<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pemesanan; // Pastikan model ini di-import
use Illuminate\Support\Facades\Validator;

class PemesananController extends Controller
{
    // Fungsi untuk menyimpan data pemesanan
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'id_penyewa' => 'required|integer', 
            'id_kendaraan' => 'required|integer',
            'tanggal_pesan' => 'required|date|after_or_equal:today', // Tanggal tidak boleh lampau
            'durasi_hari' => 'required|integer|min:1',
            'total_harga' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Simulasikan Penyimpanan yang Berhasil
        // Karena kita belum mengatur autentikasi dan status, kita simulasikan penyimpanan data
        // Jika Anda sudah membuat tabel pemesanans dengan field yang sesuai, gunakan ini:
        /*
        $pemesanan = Pemesanan::create([
            'id_penyewa' => $request->id_penyewa,
            'id_kendaraan' => $request->id_kendaraan,
            'tanggal_pesan' => $request->tanggal_pesan,
            'durasi_hari' => $request->durasi_hari,
            'total_harga' => $request->total_harga,
            'status' => 'menunggu_verifikasi', // Status awal
        ]);
        $newPemesananId = $pemesanan->id_pemesanan;
        */
        
        // KODE SIMULASI (Digunakan karena Anda belum menyelesaikan Model/Tabel)
        $newPemesananId = rand(1000, 9999); 

        // 3. Kembalikan response sukses (Wajib ada ID baru untuk frontend)
        return response()->json([
            'message' => 'Pemesanan berhasil dibuat.',
            'pemesanan' => [
                'id_pemesanan' => $newPemesananId, // Kembalikan ID untuk digunakan di halaman Pembayaran
            ]
        ], 201);
    }
}
