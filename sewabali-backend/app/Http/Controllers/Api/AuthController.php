<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * REGISTER (DAFTAR)
     */
    public function register(Request $request)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email', // Email harus unik di seluruh sistem (Lebih Aman)
            'password'      => 'required|min:8|confirmed',
            'role'          => 'required|in:penyewa,perental',
            'alamat'        => 'required|string',
            'nomor_telepon' => 'required|unique:users,nomor_telepon', // No HP juga unik
        ], [
            'email.unique' => 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.',
            'nomor_telepon.unique' => 'Nomor telepon ini sudah digunakan.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi Gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Simpan ke Database
        try {
            $user = User::create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => Hash::make($request->password),
                'role'          => $request->role,
                'nomor_telepon' => $request->nomor_telepon,
                'alamat'        => $request->alamat,
            ]);

            // Buat Token langsung saat register (opsional, biar langsung login)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registrasi Berhasil!',
                'user'    => $user,
                'token'   => $token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data user.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * LOGIN (MASUK)
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
            'role'     => 'required|in:penyewa,perental,admin' // Tambah admin jika perlu
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // PERBAIKAN: Cek Email + Password + Role sekaligus
        // Ini memastikan user yang login memiliki role yang sesuai dengan inputan
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role // Filter user berdasarkan role juga
        ];

        // Khusus jika Admin login (karena admin mungkin tidak pilih role di awal, opsional)
        if($request->role === 'admin') {
             unset($credentials['role']); // Hapus filter role jika admin
        }

        if (!Auth::attempt($credentials)) {
            // Cek manual apakah email ada tapi salah role
            $userCheck = User::where('email', $request->email)->first();
            if ($userCheck && $userCheck->role !== $request->role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun ini terdaftar sebagai ' . ucfirst($userCheck->role) . ', bukan ' . ucfirst($request->role)
                ], 403);
            }

            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil!',
            'user'    => $user,
            'token'   => $token
        ], 200);
    }

    /**
     * UPDATE PROFIL (Nama, Telepon, Alamat)
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'name' => 'required|string|max:255',
                'nomor_telepon' => 'nullable|string|max:15',
                'alamat' => 'nullable|string',
            ]);

            $user->update([
                'name' => $request->name,
                'nomor_telepon' => $request->nomor_telepon,
                'alamat' => $request->alamat,
            ]);

            return response()->json([
                'message' => 'Profil berhasil diperbarui',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal update profil', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * UPDATE PASSWORD
     */
    public function updatePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:6|confirmed',
            ]);

            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Kata sandi saat ini salah.'], 400);
            }

            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json(['message' => 'Kata sandi berhasil diubah']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal ubah password', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * UPDATE AVATAR
     */
    public function updateAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $user = $request->user();

            if ($request->hasFile('avatar')) {
                // Opsional: Hapus foto lama jika ada
                // if ($user->avatar_url) { Storage::disk('public')->delete(...) }

                $path = $request->file('avatar')->store('avatars', 'public');
                
                $user->update([
                    'avatar_url' => url('storage/' . $path)
                ]);
            }

            return response()->json([
                'message' => 'Foto profil berhasil diperbarui',
                'avatar_url' => $user->avatar_url
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal upload foto', 'error' => $e->getMessage()], 500);
        }
    }
}