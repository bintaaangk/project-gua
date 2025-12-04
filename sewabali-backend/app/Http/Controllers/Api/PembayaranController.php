<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PembayaranController extends Controller
{
    // Fungsi untuk menyimpan data pembayaran dan bukti transfer
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|integer',
            'total_bayar' => 'required|numeric',
            'no_rekening_perental' => 'required|string|max:50',
            // Validasi file: wajib diisi, berupa gambar (jpg, jpeg, png), maks 5MB
            'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png|max:5120', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filePath = null;

        // 2. Upload Bukti Pembayaran
        if ($request->hasFile('bukti_pembayaran')) {
            // Simpan file di storage/app/public/bukti_transfer
            $file = $request->file('bukti_pembayaran');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('bukti_transfer', $fileName, 'public'); // Simpan di folder public/bukti_transfer
        }

        // 3. Simpan data ke database
        $pembayaran = Pembayaran::create([
            'id_pemesanan' => $request->id_pemesanan,
            'total_bayar' => $request->total_bayar,
            'no_rekening_perental' => $request->no_rekening_perental,
            'bukti_pembayaran' => $filePath, // Simpan path file
            'status_pembayaran' => 'menunggu_verifikasi',
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diupload. Menunggu verifikasi.',
            'pembayaran' => $pembayaran
        ], 201);
    }
}
