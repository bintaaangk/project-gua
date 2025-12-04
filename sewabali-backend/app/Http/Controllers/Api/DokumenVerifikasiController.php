<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DokumenVerifikasi;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DokumenVerifikasiController extends Controller
{
    // Fungsi untuk menyimpan dan mengupload semua dokumen
    public function store(Request $request)
    {
        // 1. Validasi Input (Asumsi semua adalah gambar/PDF dan max 5MB)
        $validator = Validator::make($request->all(), [
            'id_penyewa' => 'required|integer', 
            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'sim_c' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // SIM C bisa opsional
            'jaminan' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $paths = [];
        
        // 2. Upload Files
        $paths['path_ktp'] = $request->file('ktp')->store('dokumen_verifikasi', 'public');
        
        if ($request->hasFile('sim_c')) {
            $paths['path_sim_c'] = $request->file('sim_c')->store('dokumen_verifikasi', 'public');
        }

        $paths['path_jaminan'] = $request->file('jaminan')->store('dokumen_verifikasi', 'public');

        // 3. Simpan data ke database
        $dokumen = DokumenVerifikasi::create([
            'id_penyewa' => $request->id_penyewa,
            'path_ktp' => $paths['path_ktp'],
            'path_sim_c' => $paths['path_sim_c'] ?? null,
            'path_jaminan' => $paths['path_jaminan'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Dokumen berhasil diupload. Menunggu verifikasi.',
            'dokumen' => $dokumen
        ], 201);
    }
}
