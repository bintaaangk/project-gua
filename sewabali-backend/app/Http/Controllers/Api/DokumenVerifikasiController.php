<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DokumenVerifikasi;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DokumenVerifikasiController extends Controller
{
    // GET dokumen yang perlu diverifikasi
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            // Mengambil dokumen berdasarkan kendaraan milik perental yang sedang login
            $dokumen = DokumenVerifikasi::whereHas('pemesanan', function($query) use ($userId) {
                $query->whereHas('kendaraan', function($subquery) use ($userId) {
                    $subquery->where('user_id', $userId);
                });
            })->with(['penyewa', 'pemesanan'])->get();
            
            return response()->json($dokumen);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Fungsi Upload Dokumen (STORE)
    public function store(Request $request)
    {
        try {
            // 1. Validasi Input (SUDAH DIPERBAIKI)
            $validator = Validator::make($request->all(), [
                // PERBAIKAN: 'exists:pemesanans,id_pemesanan' (Bukan 'id')
                'pemesanan_id'   => 'required|integer|exists:pemesanans,id_pemesanan',
                'ktp'            => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'sim_c'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'jaminan'        => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'bukti_transfer' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // 2. Upload Files
            $paths = [];
            $paths['path_ktp'] = $request->file('ktp')->store('dokumen_verifikasi', 'public');
            $paths['path_jaminan'] = $request->file('jaminan')->store('dokumen_verifikasi', 'public');
            
            if ($request->hasFile('sim_c')) {
                $paths['path_sim_c'] = $request->file('sim_c')->store('dokumen_verifikasi', 'public');
            }

            if ($request->hasFile('bukti_transfer')) {
                $paths['path_bukti_transfer'] = $request->file('bukti_transfer')->store('dokumen_verifikasi', 'public');
            }

            // Ambil data pemesanan untuk mendapatkan ID pemilik kendaraan (Perental)
            $pemesanan = Pemesanan::with('kendaraan')->find($request->pemesanan_id);
            $perental_id = $pemesanan->kendaraan->user_id ?? null;

            // 3. Simpan ke Database
            $dokumen = DokumenVerifikasi::create([
                'pemesanan_id'        => $request->pemesanan_id,
                'id_penyewa'          => $request->user()->id,
                'perental_id'         => $perental_id,
                'path_ktp'            => $paths['path_ktp'],
                'path_sim_c'          => $paths['path_sim_c'] ?? null,
                'path_jaminan'        => $paths['path_jaminan'],
                'path_bukti_transfer' => $paths['path_bukti_transfer'] ?? null,
                'status'              => 'pending',
            ]);

            // (Notifikasi dihapus sementara sesuai permintaan)

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

            return response()->json([
                'message' => 'Dokumen ditolak',
                'dokumen' => $dokumen
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}