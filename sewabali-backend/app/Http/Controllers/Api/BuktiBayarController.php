<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran; 
use App\Models\Pemesanan;
use App\Models\Notifikasi;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BuktiBayarController extends Controller
{
    // ============================================================================
    // 1. INDEX: Lihat Daftar Bukti Bayar (Untuk Dashboard Perental)
    // ============================================================================
    public function index()
    {
        try {
            $user = auth()->user();
            
            // Ambil pembayaran yang terkait dengan kendaraan milik user yang login
            $buktiBayar = Pembayaran::whereHas('pemesanan.kendaraan', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['pemesanan', 'pemesanan.user']) 
            ->orderBy('id_pembayaran', 'desc')
            ->get();

            return response()->json($buktiBayar, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ============================================================================
    // 2. STORE: Upload Bukti Pembayaran (Dipakai Penyewa)
    // ============================================================================
    public function store(Request $request)
    {
        // A. Validasi Input
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|exists:pemesanans,id_pemesanan', 
            'bukti_pembayaran' => 'required|file|image|max:5120', // Maks 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $filePath = null;

            // B. Proses Upload File
            if ($request->hasFile('bukti_pembayaran')) {
                $file = $request->file('bukti_pembayaran');
                // Nama file unik: waktu_originalName
                $fileName = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                // Simpan ke folder public/bukti_transfer
                $filePath = $file->storeAs('bukti_transfer', $fileName, 'public'); 
            } 

            // C. Simpan ke Database (tabel pembayarans)
            $pembayaran = Pembayaran::create([
                'id_pemesanan' => $request->id_pemesanan,
                'total_bayar' => $request->total_bayar ?? 0, 
                'no_rekening_perental' => $request->no_rekening_perental ?? '-',
                'bukti_pembayaran' => $filePath, 
                // PERBAIKAN 1: Pastikan status pembayaran juga sesuai format database kamu jika perlu
                // (Biasanya tabel pembayaran pakai varchar, jadi 'menunggu_verifikasi' aman)
                'status_pembayaran' => 'menunggu_verifikasi',
            ]);

            // D. Update Status di Tabel Pemesanan
            $pemesanan = Pemesanan::where('id_pemesanan', $request->id_pemesanan)->first();
            
            if ($pemesanan) {
                // PERBAIKAN UTAMA DI SINI:
                // Ganti 'Pending' menjadi 'menunggu_verifikasi' agar cocok dengan ENUM database
                $pemesanan->status = 'menunggu_verifikasi'; 
                $pemesanan->save();

                // E. Buat Notifikasi (SAFE MODE)
                try {
                     if ($pemesanan->kendaraan) {
                        Notifikasi::create([
                            'user_id' => $pemesanan->kendaraan->user_id, 
                            'tipe' => 'bukti_pembayaran_upload',
                            'pesan' => 'Ada bukti pembayaran baru pesanan #' . $pemesanan->id_pemesanan,
                            'pemesanan_id' => $pemesanan->id_pemesanan,
                            'is_read' => false
                        ]);
                     }
                } catch (\Exception $notifError) {
                    Log::error('Gagal buat notifikasi: ' . $notifError->getMessage());
                }
            }

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diupload.',
                'data' => $pembayaran
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error Upload Bukti: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal menyimpan pembayaran',
                'error_detail' => $e->getMessage() 
            ], 500);
        }
    }

    // ============================================================================
    // 3. VERIFY: Terima Pembayaran (Dipakai Perental)
    // ============================================================================
    public function verify(Request $request, $id)
    {
        try {
            $pembayaran = Pembayaran::where('id_pembayaran', $id)->firstOrFail();
            
            $pembayaran->update([
                'status_pembayaran' => 'lunas',
            ]);

            if ($pembayaran->pemesanan) {
                // PERBAIKAN STATUS: Gunakan 'dalam_sewa' sesuai ENUM database
                $pembayaran->pemesanan->update(['status' => 'dalam_sewa']);
                
                try {
                    Notifikasi::create([
                        'user_id' => $pembayaran->pemesanan->id_penyewa,
                        'tipe' => 'bukti_pembayaran_verified',
                        'pesan' => 'Pembayaran lunas. Pesanan #' . $pembayaran->id_pemesanan . ' aktif.',
                        'pemesanan_id' => $pembayaran->id_pemesanan,
                        'is_read' => false
                    ]);
                } catch (\Exception $e) { Log::error($e->getMessage()); }
            }

            return response()->json(['message' => 'Pembayaran diverifikasi', 'data' => $pembayaran], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ============================================================================
    // 4. REJECT: Tolak Pembayaran (Dipakai Perental)
    // ============================================================================
    public function reject(Request $request, $id)
    {
        try {
            $request->validate([
                'catatan' => 'string|max:500' 
            ]);

            $pembayaran = Pembayaran::where('id_pembayaran', $id)->firstOrFail();
            
            $pembayaran->update([
                'status_pembayaran' => 'ditolak',
            ]);

             if ($pembayaran->pemesanan) {
                // PERBAIKAN STATUS: 
                // Karena database kamu TIDAK ADA status 'Ditolak', kita bisa:
                // 1. Kembalikan ke 'menunggu_verifikasi'
                // 2. Atau ubah database tambah status 'batal'
                // Untuk sekarang, kita kembalikan ke 'menunggu_verifikasi' atau biarkan tetap (jangan update status pemesanan ke kata yang dilarang)
                
                // Opsi aman: Jangan update status pemesanan jika tidak ada status batal/tolak di ENUM
                // $pembayaran->pemesanan->update(['status' => 'Ditolak']); // INI AKAN ERROR DI DB KAMU

                // Notifikasi Aman
                try {
                    Notifikasi::create([
                        'user_id' => $pembayaran->pemesanan->id_penyewa,
                        'tipe' => 'bukti_pembayaran_rejected',
                        'pesan' => 'Pembayaran ditolak. Cek kembali bukti Anda.',
                        'pemesanan_id' => $pembayaran->id_pemesanan,
                        'is_read' => false
                    ]);
                } catch (\Exception $e) { Log::error($e->getMessage()); }
            }

            return response()->json(['message' => 'Pembayaran ditolak', 'data' => $pembayaran], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}