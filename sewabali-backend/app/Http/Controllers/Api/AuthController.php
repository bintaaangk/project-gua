<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule; // <--- WAJIB ADA UNTUK FITUR UNIK PER ROLE

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
            
            // VALIDASI EMAIL KHUSUS (Unik berdasarkan Role)
            'email' => [
                'required',
                'email',
                // Cek di tabel users, kolom email, tapi hanya baris yang role-nya sama dengan request
                Rule::unique('users')->where(function ($query) use ($request) {
                    return $query->where('role', $request->role);
                }),
            ],

            'password'      => 'required|min:8|confirmed',
            'role'          => 'required|in:penyewa,perental', // Pastikan hanya 2 role ini
            
            'alamat'        => 'required|string',

            // VALIDASI NO TELEPON KHUSUS (Unik berdasarkan Role)
            'nomor_telepon' => [
                'required',
                // Cek di tabel users, kolom nomor_telepon, hanya jika role-nya sama
                Rule::unique('users', 'nomor_telepon')->where(function ($query) use ($request) {
                    return $query->where('role', $request->role);
                }),
            ],
        ], [
            // Custom Error Messages (Pesan Bahasa Indonesia)
            'email.unique' => 'Email ini sudah terdaftar sebagai ' . $request->role . '. Silakan gunakan email lain atau login.',
            'nomor_telepon.unique' => 'Nomor telepon ini sudah terdaftar sebagai ' . $request->role . '.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.in' => 'Role tidak valid (harus penyewa atau perental).',
        ]);

        // Jika Validasi Gagal
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
                'password'      => Hash::make($request->password), // Enkripsi Password
                'role'          => $request->role,
                'nomor_telepon' => $request->nomor_telepon,
                'alamat'        => $request->alamat,
            ]);

            // 3. Berikan Response Sukses
            return response()->json([
                'success' => true,
                'message' => 'Registrasi Berhasil! Silakan Login.',
                'user'    => $user,
            ], 201);

        } catch (\Exception $e) {
            // Jika ada error database lain
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
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cek Database (Hati-hati: Jika ada 2 email sama beda role, Auth::attempt mungkin bingung)
        // Solusi: Kita cek manual user berdasarkan email DAN role (jika di form login ada pilihan role)
        // TAPI: Untuk standar, kita pakai Auth::attempt biasa dulu. 
        // Jika user punya 2 akun (Penyewa & Perental) dengan password sama, ini akan login ke salah satu.
        // Jika ingin spesifik login sebagai 'Penyewa', di frontend login harus kirim 'role'.
        
        // Cek kredensial
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        // 3. Ambil User & Token
        // Karena email bisa duplikat (beda role), kita ambil user yg auth berhasil
        $user = Auth::user(); 
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil!',
            'user'    => $user,
            'token'   => $token
        ], 200);
    }
}