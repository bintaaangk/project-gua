<?php

namespace App\Http\Controllers;

use App\Models\BuktiBayar;
use App\Models\Pemesanan;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BuktiBayarController extends Controller
{
    /**
     * Display bukti bayar untuk diverifikasi perental
     */
    public function index()
    {
        try {
            $user = auth()->user();
            
            // Ambil bukti pembayaran dari kendaraan milik perental ini
            $buktiBayar = BuktiBayar::whereHas('pemesanan.kendaraan', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['pemesanan', 'penyewa', 'perental'])
            ->orderBy('created_at', 'desc')
            ->get();

            return response()->json($buktiBayar, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload bukti pembayaran
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'id_pemesanan' => 'required|exists:pemesanans,id_pemesanan',
                'path_bukti' => 'required|file|image|max:5120', // Max 5MB
            ]);

            $user = auth()->user();
            
            // Cek pemesanan ada & ambil perental info
            $pemesanan = Pemesanan::findOrFail($request->id_pemesanan);
            $perental = $pemesanan->kendaraan->user_id;

            // Upload file
            $filePath = $request->file('path_bukti')->store('bukti_pembayaran', 'public');

            // Create bukti bayar record
            $buktiBayar = BuktiBayar::create([
                'id_pemesanan' => $request->id_pemesanan,
                'id_perental' => $perental,
                'path_bukti' => $filePath,
                'status' => 'pending'
            ]);

            // Create notifikasi untuk perental
            Notifikasi::create([
                'user_id' => $perental,
                'tipe' => 'bukti_pembayaran_upload',
                'pesan' => 'Ada bukti pembayaran baru dari penyewa yang perlu diverifikasi',
                'pemesanan_id' => $request->id_pemesanan,
                'is_read' => false
            ]);

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diupload',
                'bukti_bayar' => $buktiBayar
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify bukti pembayaran
     */
    public function verify($id)
    {
        try {
            $buktiBayar = BuktiBayar::findOrFail($id);
            
            $buktiBayar->update([
                'status' => 'verified',
                'tanggal_verifikasi' => now()
            ]);

            // Create notifikasi untuk penyewa
            Notifikasi::create([
                'user_id' => $buktiBayar->pemesanan->id_penyewa,
                'tipe' => 'bukti_pembayaran_verified',
                'pesan' => 'Bukti pembayaran Anda telah diverifikasi. Pemesanan siap diproses.',
                'pemesanan_id' => $buktiBayar->id_pemesanan,
                'is_read' => false
            ]);

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diverifikasi',
                'bukti_bayar' => $buktiBayar
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject bukti pembayaran
     */
    public function reject(Request $request, $id)
    {
        try {
            $request->validate([
                'catatan' => 'required|string|max:500'
            ]);

            $buktiBayar = BuktiBayar::findOrFail($id);
            
            $buktiBayar->update([
                'status' => 'rejected',
                'catatan' => $request->catatan,
                'tanggal_verifikasi' => now()
            ]);

            // Create notifikasi untuk penyewa
            Notifikasi::create([
                'user_id' => $buktiBayar->pemesanan->id_penyewa,
                'tipe' => 'bukti_pembayaran_rejected',
                'pesan' => 'Bukti pembayaran Anda ditolak. Alasan: ' . $request->catatan,
                'pemesanan_id' => $buktiBayar->id_pemesanan,
                'is_read' => false
            ]);

            return response()->json([
                'message' => 'Bukti pembayaran ditolak',
                'bukti_bayar' => $buktiBayar
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
