<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DokumenVerifikasi;
use App\Models\Notifikasi;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DokumenVerifikasiController extends Controller
{
    // GET dokumen yang perlu diverifikasi (untuk perental & admin)
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            // Perental melihat dokumen dari pemesanan kendaraannya
            $dokumen = DokumenVerifikasi::whereHas('pemesanan', function($query) use ($userId) {
                $query->where('kendaraan_id', function($subquery) use ($userId) {
                    $subquery->select('id')->from('kendaraans')->where('user_id', $userId);
                });
            })->with(['penyewa', 'pemesanan'])->get();
            
            return response()->json($dokumen);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Fungsi untuk menyimpan dan mengupload semua dokumen
    public function store(Request $request)
    {
        try {
            // 1. Validasi Input
            $validator = Validator::make($request->all(), [
                'pemesanan_id' => 'required|integer|exists:pemesanans,id',
                'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'sim_c' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'jaminan' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'bukti_transfer' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
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
            
            if ($request->hasFile('bukti_transfer')) {
                $paths['path_bukti_transfer'] = $request->file('bukti_transfer')->store('dokumen_verifikasi', 'public');
            }

            // Get pemesanan untuk mendapat perental_id
            $pemesanan = Pemesanan::find($request->pemesanan_id);
            $perental_id = $pemesanan->kendaraan->user_id ?? null;

            // 3. Simpan data ke database
            $dokumen = DokumenVerifikasi::create([
                'pemesanan_id' => $request->pemesanan_id,
                'id_penyewa' => $request->user()->id,
                'perental_id' => $perental_id,
                'path_ktp' => $paths['path_ktp'],
                'path_sim_c' => $paths['path_sim_c'] ?? null,
                'path_jaminan' => $paths['path_jaminan'],
                'path_bukti_transfer' => $paths['path_bukti_transfer'] ?? null,
                'status' => 'pending',
            ]);

            // Kirim notifikasi ke perental
            if ($perental_id) {
                Notifikasi::create([
                    'user_id' => $perental_id,
                    'tipe' => 'dokumen_upload',
                    'pesan' => 'Ada dokumen verifikasi baru dari penyewa yang perlu diverifikasi',
                    'pemesanan_id' => $request->pemesanan_id,
                    'is_read' => false,
                ]);
            }

            return response()->json([
                'message' => 'Dokumen berhasil diupload. Menunggu verifikasi.',
                'dokumen' => $dokumen
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Verify dokumen
    public function verify(Request $request, $id)
    {
        try {
            $dokumen = DokumenVerifikasi::findOrFail($id);
            
            $dokumen->update([
                'status' => 'verified',
                'tanggal_verifikasi' => now(),
            ]);

            // Notifikasi ke penyewa
            Notifikasi::create([
                'user_id' => $dokumen->id_penyewa,
                'tipe' => 'dokumen_verified',
                'pesan' => 'Dokumen Anda telah diverifikasi dan disetujui',
                'pemesanan_id' => $dokumen->pemesanan_id,
                'is_read' => false,
            ]);

            return response()->json([
                'message' => 'Dokumen berhasil diverifikasi',
                'dokumen' => $dokumen
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Reject dokumen
    public function reject(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'catatan' => 'required|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $dokumen = DokumenVerifikasi::findOrFail($id);
            
            $dokumen->update([
                'status' => 'rejected',
                'catatan_verifikasi' => $request->catatan,
                'tanggal_verifikasi' => now(),
            ]);

            // Notifikasi ke penyewa
            Notifikasi::create([
                'user_id' => $dokumen->id_penyewa,
                'tipe' => 'dokumen_rejected',
                'pesan' => 'Dokumen Anda ditolak. Alasan: ' . $request->catatan,
                'pemesanan_id' => $dokumen->pemesanan_id,
                'is_read' => false,
            ]);

            return response()->json([
                'message' => 'Dokumen ditolak',
                'dokumen' => $dokumen
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
