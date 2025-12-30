<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kendaraan;
use App\Models\Pemesanan;
use App\Models\DokumenVerifikasi;
use Exception;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * DASHBOARD: Statistik Ringkas
     */
    public function getStats()
    {
        try {
            return response()->json([
                'total_users' => User::count(),
                'total_vehicles' => Kendaraan::count(),
                'active_bookings' => Pemesanan::where('status', 'Lunas')->count(),
                'pending_verifications' => DokumenVerifikasi::where('status', 'pending')->count(),
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * MANAJEMEN USER
     */
    public function getUsers()
    {
        try {
            $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();
            return response()->json($users);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            User::findOrFail($id)->delete();
            return response()->json(['message' => 'User berhasil dihapus']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * MANAJEMEN KENDARAAN
     */
    public function getKendaraans()
    {
        try {
            // Memastikan mengambil data yang dibutuhkan oleh tabel di React
            $kendaraans = Kendaraan::with('user:id,name')->get()->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->nama,
                    'owner' => $item->user->name ?? 'Tanpa Pemilik',
                    'plat' => $item->plat_nomor,
                    'price' => number_format($item->harga_sewa, 0, ',', '.'),
                    'status' => $item->status,
                ];
            });
            return response()->json($kendaraans);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * MANAJEMEN TRANSAKSI
     */
    public function getTransactions()
    {
        try {
            $transactions = Pemesanan::with(['penyewa:id,name', 'kendaraan:id,nama'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id_pemesanan,
                        'user' => $item->penyewa->name ?? 'Unknown',
                        'vehicle' => $item->kendaraan->nama ?? 'Unknown',
                        'dates' => $item->tanggal_pesan . ' (' . $item->durasi_hari . ' Hari)',
                        'total' => number_format($item->total_harga, 0, ',', '.'),
                        'status' => $item->status
                    ];
                });
            return response()->json($transactions);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Fungsi Update Status Transaksi (Penting untuk tombol Konfirmasi Bayar & Selesai)
    public function updateTransactionStatus(Request $request, $id)
    {
        try {
            $request->validate(['status' => 'required']);
            $booking = Pemesanan::findOrFail($id);
            $booking->update(['status' => $request->status]);

            return response()->json(['message' => 'Status transaksi berhasil diperbarui']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * MANAJEMEN VERIFIKASI DOKUMEN
     */
    public function getVerifications()
    {
        try {
            $verifications = DokumenVerifikasi::with(['penyewa:id,name'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id_dokumen,
                        'user' => $item->penyewa->name ?? 'Penyewa',
                        'type' => 'KTP & Jaminan',
                        'status' => $item->status,
                        'note' => $item->catatan_verifikasi,
                        'img' => $item->path_ktp // Nanti di React ditambahkan base_url storage
                    ];
                });
            return response()->json($verifications);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateVerification(Request $request, $id)
    {
        try {
            $dokumen = DokumenVerifikasi::findOrFail($id);
            $dokumen->update([
                'status' => $request->status,
                'catatan_verifikasi' => $request->catatan_verifikasi,
                'tanggal_verifikasi' => now()
            ]);

            return response()->json(['message' => 'Verifikasi berhasil diperbarui']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}