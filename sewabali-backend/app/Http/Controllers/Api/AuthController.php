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
use App\Models\Notifikasi;

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
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
            // Role tetap divalidasi agar tidak kosong, tapi isinya nanti kita cek manual
            'role'     => 'required|in:penyewa,perental,admin' 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // ============================================================
        // PERUBAHAN 1: Hapus 'role' dari credentials
        // Kita cek Email & Password dulu, urusan Role belakangan
        // ============================================================
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        // Cek Login ke Database
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        // Ambil data user yang berhasil login (Password sudah pasti benar di sini)
        $user = Auth::user();

        // ============================================================
        // PERUBAHAN 2: Logika Pengecekan Role "Sakti"
        // ============================================================
        
        // Cek: Apakah user ini Admin?
        // Jika YA ('admin'), biarkan dia masuk (return false di kondisi if, jadi lanjut ke bawah).
        // Jika BUKAN ('penyewa'/'perental'), cek apakah role yang dipilih sesuai database.
        
        if ($user->role !== 'admin' && $user->role !== $request->role) {
            // Jika masuk sini, berarti dia bukan admin DAN dia salah pilih role
            return response()->json([
                'success' => false,
                'message' => 'Akun ini terdaftar sebagai ' . ucfirst($user->role) . ', bukan ' . ucfirst($request->role)
            ], 403);
        }

        // ============================================================
        // JIKA LOLOS, LANJUT PROSES SEPERTI BIASA
        // ============================================================

        // Buat Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Buat Notifikasi Login
        Notifikasi::create([
            'user_id'      => $user->id,
            'tipe'         => 'system',
            'pesan'        => 'Sesi Login Baru: Kami mendeteksi login baru pada akun Anda hari ini.',
            'pemesanan_id' => null,
            'is_read'      => false
        ]);

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