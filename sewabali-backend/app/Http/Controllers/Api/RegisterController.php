<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // 1. TAMBAHKAN VALIDASI UNTUK 'role'
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users',
            'nomor_telepon' => 'required|string|max:20',
            'alamat'        => 'required|string',
            'password'      => 'required|string|min:8|confirmed',
            'role'          => 'required|string|in:penyewa,perental', // <-- TAMBAHAN
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. TAMBAHKAN 'role' SAAT MEMBUAT USER
        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat'        => $request->alamat,
            'password'      => Hash::make($request->password),
            'role'          => $request->role, // <-- TAMBAHAN
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil!',
            'user'    => $user
        ], 201);
    }
}