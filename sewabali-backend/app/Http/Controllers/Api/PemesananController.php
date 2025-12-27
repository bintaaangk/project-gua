<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pemesanan;
use App\Models\Kendaraan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PemesananController extends Controller
{
    // ============================================================================
    // 1. STORE (PENYEWA): Membuat Pesanan Baru
    // ============================================================================
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kendaraan'  => 'required|exists:kendaraans,id', 
            'tanggal_pesan' => 'required|date|after_or_equal:today',
            'durasi_hari'   => 'required|integer|min:1',
            'total_harga'   => 'required|numeric', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $userId = $request->user()->id;

            $pemesanan = new Pemesanan();
            $pemesanan->id_penyewa    = $userId; 
            $pemesanan->id_kendaraan  = $request->id_kendaraan; 
            $pemesanan->tanggal_pesan = $request->tanggal_pesan;
            $pemesanan->durasi_hari   = $request->durasi_hari;  
            $pemesanan->total_harga   = $request->total_harga;  
            
            // --- PERBAIKAN DI SINI ---
            // Kita pakai 'menunggu_verifikasi' sesuai ENUM di database kamu
            $pemesanan->status        = 'menunggu_verifikasi'; 
            
            $pemesanan->save();

            return response()->json([
                'message' => 'Pemesanan berhasil dibuat.',
                'pemesanan' => [
                    'id_pemesanan' => $pemesanan->id_pemesanan, 
                    'kode_transaksi' => 'TRX-' . str_pad($pemesanan->id_pemesanan, 6, '0', STR_PAD_LEFT)
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Gagal membuat pesanan: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal menyimpan pesanan', 'detail' => $e->getMessage()], 500);
        }
    }

    // ============================================================================
    // 2. INDEX (PERENTAL)
    // ============================================================================
    public function indexPesananMasuk(Request $request)
    {
        try {
            $user = $request->user(); 

            $pesanan = Pemesanan::with(['kendaraan', 'user', 'pembayaran']) 
                ->whereHas('kendaraan', function ($query) use ($user) {
                    $query->where('user_id', $user->id); 
                })
                ->orderBy('created_at', 'desc') 
                ->get();

            $formattedData = $pesanan->map(function ($p) {
                $tglMulai = new \DateTime($p->tanggal_pesan);
                $tglSelesai = clone $tglMulai;
                $tglSelesai->modify('+' . $p->durasi_hari . ' days');

                return [
                    'id' => $p->id_pemesanan, 
                    'kode' => 'TRX-' . str_pad($p->id_pemesanan, 6, '0', STR_PAD_LEFT),
                    'penyewa' => $p->user ? $p->user->name : 'User Tidak Dikenal',
                    'unit' => $p->kendaraan ? $p->kendaraan->nama : 'Kendaraan Dihapus',
                    'tgl_sewa' => $tglMulai->format('d M'),
                    'tgl_kembali' => $tglSelesai->format('d M'), 
                    'total' => $p->total_harga,
                    
                    // Kita ubah tampilan status biar rapi (misal: "menunggu_verifikasi" jadi "Menunggu Verifikasi")
                    'status' => ucwords(str_replace('_', ' ', $p->status)),
                    
                    'bukti_bayar_url' => $p->pembayaran ? url('storage/' . $p->pembayaran->bukti_pembayaran) : null, 
                ];
            });

            return response()->json($formattedData);

        } catch (\Exception $e) {
            Log::error('Error fetch pesanan masuk: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal memuat pesanan', 'msg' => $e->getMessage()], 500);
        }
    }

    // ============================================================================
    // 3. KONFIRMASI (PERENTAL)
    // ============================================================================
    public function konfirmasiPesanan(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:terima,tolak'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Aksi tidak valid'], 400);
        }

        try {
            $pesanan = Pemesanan::where('id_pemesanan', $id)->firstOrFail();
            
            $kendaraan = Kendaraan::find($pesanan->id_kendaraan);
            if (!$kendaraan || $kendaraan->user_id !== $request->user()->id) {
                return response()->json(['error' => 'Anda tidak berhak mengelola pesanan ini'], 403);
            }

            // --- PERBAIKAN LOGIKA STATUS ---
            // Database kamu cuma punya: 'menunggu_verifikasi', 'dalam_sewa', 'selesai'
            // Jadi kalau DITERIMA, kita anggap masuk ke 'dalam_sewa'
            // Kalau DITOLAK, database kamu TIDAK PUNYA status 'ditolak'.
            // Saran: Untuk sekarang biarkan tetap 'menunggu_verifikasi' atau kamu harus tambah ENUM di database.
            
            if ($request->action === 'terima') {
                $statusBaru = 'dalam_sewa'; 
                $pesanan->status = $statusBaru;
                $pesanan->save();
                
                if ($pesanan->pembayaran) {
                    $pesanan->pembayaran->status_pembayaran = 'lunas';
                    $pesanan->pembayaran->save();
                }
                return response()->json(['message' => 'Pesanan diterima (Status: Dalam Sewa)']);
            } else {
                // KARENA DATABASE TIDAK ADA STATUS 'DITOLAK', kita hapus saja pesanannya atau biarkan.
                // Disini saya pilih kembalikan error dulu biar kamu sadar
                return response()->json(['error' => 'Database kamu belum punya status "Ditolak". Hanya ada: menunggu_verifikasi, dalam_sewa, selesai'], 400);
            }

        } catch (\Exception $e) {
            Log::error('Gagal konfirmasi pesanan: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal memproses pesanan'], 500);
        }
    }
}