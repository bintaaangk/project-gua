<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pemesanan;
use App\Models\Kendaraan;
use App\Models\Pembayaran; 
use App\Models\DokumenVerifikasi;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Notifikasi; // <--- TAMBAHKAN BARIS INI!

class PemesananController extends Controller
{
    // =================================================================
    // 1. STORE (PENYEWA): Membuat Pesanan Baru
    // =================================================================
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'id_kendaraan'  => 'required|exists:kendaraans,id', // Pastikan ID ada di tabel
            'tanggal_pesan' => 'required|date', // Hapus after_or_equal sementara untuk testing
            'durasi_hari'   => 'required|integer|min:1',
            'total_harga'   => 'required|numeric', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Gunakan Transaction agar data konsisten (Kalau satu gagal, semua batal)
            $result = DB::transaction(function () use ($request) {
                
                // 2. Simpan Pemesanan
                $pemesanan = new Pemesanan();
                $pemesanan->id_penyewa    = $request->user()->id; 
                $pemesanan->id_kendaraan  = $request->id_kendaraan; 
                $pemesanan->tanggal_pesan = $request->tanggal_pesan;
                $pemesanan->durasi_hari   = $request->durasi_hari;  
                $pemesanan->total_harga   = $request->total_harga;  
                $pemesanan->status        = 'menunggu_pembayaran'; // Status awal standar
                $pemesanan->tanggal_kembali = \Carbon\Carbon::parse($request->tanggal_pesan)
                                              ->addDays($request->durasi_hari)
                                              ->toDateString();
                $pemesanan->save();

                // 3. Update Status Kendaraan & Kirim Notif
                $kendaraan = Kendaraan::find($request->id_kendaraan);
        
                if ($kendaraan) {
                    // Update Status Kendaraan
                    $kendaraan->status = 'Disewa'; 
                    $kendaraan->save();

                    // Buat Notifikasi (Pastikan model Notifikasi sudah di-import di atas)
                    Notifikasi::create([
                        'user_id'      => $kendaraan->user_id, // Ke Pemilik
                        'tipe'         => 'order',
                        'pesan'        => 'Pesanan Baru: Unit ' . $kendaraan->nama . ' telah dipesan.',
                        'pemesanan_id' => $pemesanan->id_pemesanan,
                        'is_read'      => false
                    ]);
                }

                return $pemesanan;
            });

            return response()->json([
                'success' => true,
                'message' => 'Pemesanan berhasil dibuat.',
                'pemesanan' => $result
            ], 201);

        } catch (\Exception $e) {
            // === DISINI KUNCI DEBUGGINGNYA ===
            // Kita kirim pesan error aslinya ke frontend biar kelihatan salahnya apa
            return response()->json([
                'error' => 'Terjadi Kesalahan Server',
                'message' => $e->getMessage(), // <--- Ini akan memberitahu error sebenarnya
                'line' => $e->getLine()
            ], 500);
        }
    }

    // =================================================================
    // 2. INDEX RIWAYAT (PENYEWA): List riwayat pesanan saya
    // =================================================================
    public function indexRiwayat(Request $request)
    {
        try {
            $riwayat = Pemesanan::with(['kendaraan'])
                ->where('id_penyewa', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedData = $riwayat->map(function ($r) {
                return [
                    'id_pemesanan' => $r->id_pemesanan,
                    'status' => $r->status,
                    'total_harga' => $r->total_harga,
                    'durasi_hari' => $r->durasi_hari,
                    'tanggal_pesan' => $r->tanggal_pesan,
                    'created_at' => $r->created_at,
                    'kendaraan' => [
                        'nama' => $r->kendaraan ? $r->kendaraan->nama : 'Unit Dihapus',
                        'gambar_url' => $r->kendaraan ? $r->kendaraan->gambar_url : null,
                    ]
                ];
            });

            return response()->json($formattedData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal memuat riwayat'], 500);
        }
    }

    // =================================================================
    // 3. SHOW DETAIL (PENYEWA): Detail satu pesanan
    // =================================================================
    public function show($id)
    {
        $pemesanan = Pemesanan::with([
            'kendaraan.user', 
            'buktiBayar', 
            'dokumenVerifikasi'
        ])
        ->where('id_pemesanan', $id)
        ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    // =================================================================
    // 4. INDEX PESANAN MASUK (KHUSUS PERENTAL)
    // =================================================================
    public function indexPesananMasuk(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $pesanan = Pemesanan::whereHas('kendaraan', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->with(['kendaraan', 'user', 'buktiBayar', 'dokumenVerifikasi']) 
            ->orderBy('created_at', 'desc')
            ->get();

            $formattedData = $pesanan->map(function ($p) {
                return [
                    'id' => $p->id_pemesanan,
                    'kode' => 'TRX-' . str_pad($p->id_pemesanan, 6, '0', STR_PAD_LEFT),
                    'status' => $p->status,
                    'status_label' => ucwords(str_replace('_', ' ', $p->status)),
                    'tanggal_sewa' => $p->tanggal_pesan,
                    'tanggal_kembali' => date('Y-m-d', strtotime($p->tanggal_pesan . ' + ' . $p->durasi_hari . ' days')),
                    'total_harga' => $p->total_harga,
                    'catatan' => $p->catatan,
                    'user' => [
                        'name' => $p->user ? $p->user->name : 'User Dihapus',
                        'email' => $p->user ? $p->user->email : '-',
                        'telepon' => $p->user ? $p->user->nomor_telepon : '-'
                    ],
                    'kendaraan' => [
                        'nama' => $p->kendaraan ? $p->kendaraan->nama : 'Unit Dihapus',
                        'plat_nomor' => $p->kendaraan ? $p->kendaraan->plat_nomor : '-',
                        'gambar_url' => $p->kendaraan ? $p->kendaraan->gambar_url : null, 
                    ],
                    'bukti_bayar' => $p->buktiBayar ? [
                        'file_path' => $p->buktiBayar->bukti_pembayaran,
                    ] : null,
                    'dokumen_verifikasi' => $p->dokumenVerifikasi ? [
                        'path_ktp'   => $p->dokumenVerifikasi->path_ktp,
                        'path_sim_c' => $p->dokumenVerifikasi->path_sim_c,
                        'path_jaminan' => $p->dokumenVerifikasi->path_jaminan,
                    ] : null,
                ];
            });

            return response()->json($formattedData);

        } catch (\Exception $e) {
            Log::error('Error Pesanan Masuk: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal memuat pesanan masuk'], 500);
        }
    }

    // =================================================================
    // 5. UPLOAD ULANG (PENYEWA): Memperbaiki Dokumen yang Ditolak
    // =================================================================
    public function uploadUlang(Request $request, $id)
    {
        try {
            $pesanan = Pemesanan::findOrFail($id);

            // Set status kembali ke verifikasi agar muncul lagi di perental
            $pesanan->status = 'menunggu_verifikasi';
            $pesanan->catatan = 'Penyewa telah mengunggah ulang data perbaikan.';
            $pesanan->save();

            // 1. Update Dokumen
            if ($request->hasFile('ktp') || $request->hasFile('sim_c') || $request->hasFile('jaminan')) {
                $pathKtp = $request->file('ktp') ? $request->file('ktp')->store('dokumen', 'public') : null;
                $pathSim = $request->file('sim_c') ? $request->file('sim_c')->store('dokumen', 'public') : null;
                $pathJaminan = $request->file('jaminan') ? $request->file('jaminan')->store('dokumen', 'public') : null;

                DokumenVerifikasi::updateOrCreate(
                    ['pemesanan_id' => $id],
                    [
                        'path_ktp' => $pathKtp ?? DB::raw('path_ktp'),
                        'path_sim_c' => $pathSim ?? DB::raw('path_sim_c'),
                        'path_jaminan' => $pathJaminan ?? DB::raw('path_jaminan'),
                    ]
                );
            }

            // 2. Update Pembayaran
            if ($request->hasFile('bukti_pembayaran')) {
                $pathBayar = $request->file('bukti_pembayaran')->store('bukti_transfer', 'public');
                
                Pembayaran::updateOrCreate(
                    ['id_pemesanan' => $id],
                    ['bukti_pembayaran' => $pathBayar]
                );
            }

            return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 6. KONFIRMASI PESANAN (PERENTAL): Menangani Status & Alasan
    // =================================================================
    public function konfirmasiPesanan(Request $request, $id)
    {
        $request->validate([
            'status' => 'required', 
            'catatan' => 'nullable|string'
        ]);

        try {
            $pesanan = Pemesanan::findOrFail($id);

           if ($request->status === 'Dikonfirmasi' || $request->status === 'disetujui') {
                $pesanan->status = 'dalam_sewa'; 
            } elseif ($request->status === 'sedang_disewa') {
                $pesanan->status = 'sedang_disewa';
            } elseif ($request->status === 'selesai') {
                $pesanan->status = 'selesai';
            } elseif ($request->status === 'Ditolak') {
                $pesanan->status = 'batal';
            } else {
                $pesanan->status = $request->status;
            }

            $pesanan->catatan = $request->catatan;
            $pesanan->save();

            return response()->json([
                'success' => true,
                'message' => 'Status pesanan berhasil diperbarui.',
                'status_sekarang' => $pesanan->status
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // Tambahkan di dalam class PemesananController

public function cekPengingat(Request $request)
{
    $user = $request->user();
    $hariIni = \Carbon\Carbon::today()->toDateString();
    $besok = \Carbon\Carbon::tomorrow()->toDateString();

    // 1. PENGINGAT AMBIL (Status: dalam_sewa & Tanggal: Hari ini)
    $ambil = Pemesanan::with('kendaraan')
        ->where('id_penyewa', $user->id)
        ->whereDate('tanggal_pesan', $hariIni)
        ->where('status', 'dalam_sewa')
        ->first();

    if ($ambil) {
        return response()->json([
            'ada_tenggat' => true,
            'tipe' => 'ambil',
            'pesan' => "Hari ini jadwal pengambilan unit " . $ambil->kendaraan->nama,
            'detail' => ['unit' => $ambil->kendaraan->nama, 'plat' => $ambil->kendaraan->plat_nomor]
        ]);
    }

    // 2. PENGINGAT KEMBALI (Status: sedang_disewa & Tanggal Kembali: Hari ini/Besok)
    // Jika kolom tanggal_kembali belum ada, kita hitung on-the-fly
    $kembali = Pemesanan::with('kendaraan')
        ->where('id_penyewa', $user->id)
        ->where('status', 'sedang_disewa')
        ->get()
        ->filter(function($p) use ($hariIni, $besok) {
            // Hitung tanggal kembali: tgl_pesan + durasi
            $tglSelesai = \Carbon\Carbon::parse($p->tanggal_pesan)->addDays($p->durasi_hari)->toDateString();
            return $tglSelesai == $hariIni || $tglSelesai == $besok;
        })->first();

    if ($kembali) {
        $tglSelesai = \Carbon\Carbon::parse($kembali->tanggal_pesan)->addDays($kembali->durasi_hari);
        $waktu = $tglSelesai->toDateString() == $hariIni ? "HARI INI" : "BESOK";

        return response()->json([
            'ada_tenggat' => true,
            'tipe' => 'kembali',
            'pesan' => "Waktu sewa Anda berakhir $waktu! Mohon segera kembalikan unit.",
            'detail' => [
                'unit' => $kembali->kendaraan->nama,
                'plat' => $kembali->kendaraan->plat_nomor,
                'batas' => $tglSelesai->format('d M Y')
            ]
        ]);
    }

    return response()->json(['ada_tenggat' => false]);
}
}