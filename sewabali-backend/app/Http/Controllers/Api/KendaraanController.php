<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kendaraan; // Pastikan Model Kendaraan sudah ada
use Illuminate\Support\Facades\Storage;

class KendaraanController extends Controller
{
    // 1. GET ALL (Untuk Beranda Penyewa) - Filter berdasarkan tipe
    public function index()
    {
        try {
            // Ambil semua kendaraan, pisahkan berdasarkan tipe (Mobil atau Motor)
            $mobil = Kendaraan::where(function($query) {
                                  $query->where('tipe', 'Mobil')
                                        ->orWhere('tipe', 'mobil');
                              })
                              ->get();
            
            $motor = Kendaraan::where(function($query) {
                                  $query->where('tipe', 'Motor')
                                        ->orWhere('tipe', 'motor');
                              })
                              ->get();

            return response()->json([
                'mobil' => $mobil,
                'motor' => $motor
            ]);
        } catch (\Exception $e) {
            \Log::error('Error di index kendaraan: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 2. GET DETAIL (Untuk Detail Page)
    public function show($id)
    {
        try {
            $kendaraan = Kendaraan::findOrFail($id);
            return response()->json($kendaraan);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Kendaraan tidak ditemukan'], 404);
        }
    }

    // 3. GET PERENTAL (Untuk Dashboard Perental - Unit Saya)
    public function indexPerental(Request $request)
    {
        // Ambil kendaraan milik user yang sedang login
        $userId = $request->user()->id;
        $kendaraan = Kendaraan::where('user_id', $userId)->get();

        return response()->json($kendaraan);
    }

    // 3. STORE (Tambah Unit Baru oleh Perental)
    public function store(Request $request)
    {
        Log::info('Mencoba menyimpan kendaraan dari user: ' . $request->user()->id);
        Log::info('Data yang diterima:', $request->all());
        Log::info('Ada file gambar?: ' . ($request->hasFile('gambar') ? 'Ya' : 'Tidak'));
        // -------------------------// 1. TAMBAHKAN VALIDASI UNTUK TRANSMISI & KAPASITAS
        // Biar user gak bisa kirim data kosong/asal-asalan
        $request->validate([
            'nama'           => 'required',
            'tipe'           => 'required', 
            'plat_nomor'     => 'required',
            'harga_per_hari' => 'required|numeric',
            'transmisi'      => 'required', // <-- TAMBAHAN PENTING
            'kapasitas'      => 'required|numeric', // <-- TAMBAHAN PENTING
            'gambar'         => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Upload Gambar (Ini sudah benar)
        $imagePath = null;
        if ($request->hasFile('gambar')) {
            $imagePath = $request->file('gambar')->store('kendaraan', 'public');
        }

        // 3. Simpan ke Database
        $kendaraan = Kendaraan::create([
            'user_id'        => $request->user()->id,
            'nama'           => $request->nama,
            'tipe'           => $request->tipe,
            'plat_nomor'     => $request->plat_nomor,
            'harga_per_hari' => $request->harga_per_hari,
            'kapasitas'      => $request->kapasitas, 
            'transmisi'      => $request->transmisi,
            'status'         => 'Tersedia',
            'gambar_url'     => $imagePath ? url('storage/' . $imagePath) : null,
        ]);

        return response()->json([
            'success' => true, // Tambah ini biar enak dicek di frontend
            'message' => 'Kendaraan berhasil ditambahkan',
            'data'    => $kendaraan
        ], 201);
    }
}