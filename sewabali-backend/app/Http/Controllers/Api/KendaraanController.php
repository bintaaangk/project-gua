<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kendaraan;
use Exception;

class KendaraanController extends Controller
{
    // =================================================================
    // 1. PUBLIC: GET ALL (Untuk Beranda Penyewa - Semua orang bisa lihat)
    // =================================================================
    public function index()
    {
        try {
            // Ambil SEMUA kendaraan dari SEMUA user
            // Menggunakan strtolower agar pencarian case-insensitive
            $mobil = Kendaraan::whereRaw('LOWER(tipe) = ?', ['mobil'])->get();
            $motor = Kendaraan::whereRaw('LOWER(tipe) = ?', ['motor'])->get();

            return response()->json([
                'mobil' => $mobil,
                'motor' => $motor
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 2. PRIVATE: GET MY UNITS (KHUSUS Dashboard Perental - Unit Saya)
    // =================================================================
    public function myUnits(Request $request)
    {
        try {
            $userId = $request->user()->id; 

            // Filter berdasarkan user_id yang sedang login
            $mobil = Kendaraan::where('user_id', $userId)
                              ->whereRaw('LOWER(tipe) = ?', ['mobil'])
                              ->get();

            $motor = Kendaraan::where('user_id', $userId)
                              ->whereRaw('LOWER(tipe) = ?', ['motor'])
                              ->get();

            return response()->json([
                'mobil' => $mobil,
                'motor' => $motor
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 3. GET DETAIL (Untuk Halaman Detail Kendaraan)
    // =================================================================
    public function show($id)
    {
        try {
            // Eager loading 'user' agar data pemilik langsung terbawa
            $kendaraan = Kendaraan::with('user')->find($id);

            if (!$kendaraan) {
                return response()->json(['message' => 'Kendaraan tidak ditemukan'], 404);
            }

            return response()->json($kendaraan);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 4. STORE (Tambah Unit Baru oleh Perental)
    // =================================================================
    // =================================================================
    // 4. STORE (Tambah Unit Baru oleh Perental)
    // =================================================================
    public function store(Request $request)
    {
        try {
            // Validasi Input
            $request->validate([
                'nama'           => 'required|string|max:255',
                'tipe'           => 'required', 
                'plat_nomor'     => 'required|string|max:20',
                'harga_per_hari' => 'required|numeric',
                'transmisi'      => 'required|string',
                'kapasitas'      => 'required|numeric',
                'gambar'         => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'no_rekening'    => 'nullable|string', 
            ]);

            // Proses Upload Gambar
            $imagePath = null;
            if ($request->hasFile('gambar')) {
                $imagePath = $request->file('gambar')->store('kendaraan', 'public');
            }

            // Simpan ke Database
            // REVISI: Saya hapus 'lokasi' dan 'deskripsi' agar tidak error
            $kendaraan = Kendaraan::create([
                'user_id'        => $request->user()->id, 
                'nama'           => $request->nama,
                'tipe'           => ucfirst(strtolower($request->tipe)), 
                'plat_nomor'     => strtoupper($request->plat_nomor),
                'harga_per_hari' => $request->harga_per_hari,
                'kapasitas'      => $request->kapasitas, 
                'transmisi'      => $request->transmisi,
                'status'         => 'Tersedia',
                'gambar_url'     => $imagePath ? url('storage/' . $imagePath) : null,
                
                // HANYA INI TAMBAHAN YANG KITA BUTUHKAN
                'no_rekening'    => $request->no_rekening, 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kendaraan berhasil ditambahkan',
                'data'    => $kendaraan
            ], 201);

        } catch (Exception $e) {
            // Ini akan memunculkan pesan error asli jika masih gagal
            return response()->json(['error' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            // Cari kendaraan berdasarkan ID
            $kendaraan = Kendaraan::find($id);

            if (!$kendaraan) {
                return response()->json(['message' => 'Unit tidak ditemukan'], 404);
            }

            // Pastikan yang menghapus adalah PEMILIK unit itu sendiri (Keamanan)
            if ($kendaraan->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Anda tidak berhak menghapus unit ini'], 403);
            }

            // Hapus gambar dari storage jika ada (biar server gak penuh sampah)
            if ($kendaraan->gambar_url) {
                // Ambil path relatif dari URL (misal: kendaraan/foto.jpg)
                $path = str_replace(url('storage/'), '', $kendaraan->gambar_url);
                // Hapus file fisik
                \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            }

            // Hapus data dari database
            $kendaraan->delete();

            return response()->json(['message' => 'Unit berhasil dihapus'], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Gagal menghapus unit: ' . $e->getMessage()], 500);
        }
    }
}