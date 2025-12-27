<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kendaraan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class KendaraanController extends Controller
{
    // =================================================================
    // 1. PUBLIC: GET ALL (Untuk Beranda Penyewa - Semua orang bisa lihat)
    // =================================================================
    public function index()
    {
        try {
            // Ambil SEMUA kendaraan dari SEMUA user (tanpa filter user_id)
            $mobil = Kendaraan::where(function($query) {
                $query->where('tipe', 'Mobil')->orWhere('tipe', 'mobil');
            })->get();
            
            $motor = Kendaraan::where(function($query) {
                $query->where('tipe', 'Motor')->orWhere('tipe', 'motor');
            })->get();

            return response()->json([
                'mobil' => $mobil,
                'motor' => $motor
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 2. PRIVATE: GET MY UNITS (KHUSUS Dashboard Perental - Unit Saya)
    // =================================================================
    public function myUnits(Request $request)
    {
        try {
            // Ambil ID User yang sedang login (dari Token)
            $userId = $request->user()->id; 

            // Ambil Mobil HANYA milik user tersebut
            $mobil = Kendaraan::where('user_id', $userId)
                        ->where(function($q){ 
                            $q->where('tipe', 'Mobil')->orWhere('tipe', 'mobil'); 
                        })
                        ->get();

            // Ambil Motor HANYA milik user tersebut
            $motor = Kendaraan::where('user_id', $userId)
                        ->where(function($q){ 
                            $q->where('tipe', 'Motor')->orWhere('tipe', 'motor'); 
                        })
                        ->get();

            // Format JSON disamakan dengan fungsi index agar Frontend tidak error
            return response()->json([
                'mobil' => $mobil,
                'motor' => $motor
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 3. GET DETAIL (Untuk Halaman Detail Kendaraan)
    // =================================================================
    public function show($id)
    {
        $kendaraan = Kendaraan::find($id);
        if (!$kendaraan) {
            return response()->json(['message' => 'Kendaraan tidak ditemukan'], 404);
        }
        return response()->json($kendaraan);
    }

    // =================================================================
    // 4. STORE (Tambah Unit Baru oleh Perental)
    // =================================================================
    public function store(Request $request)
    {
        // Validasi Input
        $request->validate([
            'nama'           => 'required',
            'tipe'           => 'required', 
            'plat_nomor'     => 'required',
            'harga_per_hari' => 'required|numeric',
            'transmisi'      => 'required',
            'kapasitas'      => 'required|numeric',
            'gambar'         => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Proses Upload Gambar
        $imagePath = null;
        if ($request->hasFile('gambar')) {
            $imagePath = $request->file('gambar')->store('kendaraan', 'public');
        }

        // Simpan ke Database
        $kendaraan = Kendaraan::create([
            'user_id'        => $request->user()->id, // PENTING: Menandai pemilik kendaraan
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
            'success' => true,
            'message' => 'Kendaraan berhasil ditambahkan',
            'data'    => $kendaraan
        ], 201);
    }
}