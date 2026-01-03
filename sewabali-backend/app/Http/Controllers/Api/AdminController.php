<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Kendaraan;
use App\Models\Pemesanan;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * 1. STATISTIK DASHBOARD
     */
    public function getStats()
    {
        return response()->json([
            'total_users' => User::where('role', '!=', 'admin')->count(),
            'total_vehicles' => Kendaraan::where('status', 'Tersedia')->count(),
            'total_transactions' => Pemesanan::count(),
            'total_revenue' => Pemesanan::where('status', 'selesai')->sum('total_harga'),
        ]);
    }

    /**
     * 2. LAPORAN PENDAPATAN BULANAN
     * Menghitung total uang masuk dari transaksi yang sudah selesai
     */
    public function getRevenueReport()
    {
        // Mengambil total harga dari pesanan yang 'selesai' dikelompokkan per bulan
        $report = Pemesanan::where('status', 'selesai')
            ->selectRaw('MONTHNAME(created_at) as bulan, SUM(total_harga) as total, COUNT(id_pemesanan) as jumlah_transaksi')
            ->groupBy('bulan')
            ->orderByRaw("MIN(created_at) ASC")
            ->get();

        return response()->json($report);
    }

    /**
     * 3. VERIFIKASI USER (KYC)
     */
    public function listPendingUsers()
    {
        $users = User::where('is_verified', false)
                     ->where('role', '!=', 'admin')
                     ->get();
                     
        return response()->json($users);
    }

    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        $user->is_verified = true;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User ' . $user->name . ' berhasil diverifikasi.'
        ]);
    }

    /**
     * 4. MONITORING KENDARAAN
     */
    public function listAllVehicles()
    {
        $vehicles = Kendaraan::with('user')->get();
        return response()->json($vehicles);
    }

    public function toggleVehicleStatus($id)
    {
        $vehicle = Kendaraan::findOrFail($id);
        
        if ($vehicle->status === 'Tersedia') {
            $vehicle->status = 'Nonaktif';
            $pesan = "Unit " . $vehicle->nama . " berhasil dinonaktifkan.";
        } else {
            $vehicle->status = 'Tersedia';
            $pesan = "Unit " . $vehicle->nama . " berhasil diaktifkan kembali.";
        }
        
        $vehicle->save();
        return response()->json([
            'success' => true,
            'message' => $pesan,
            'status' => $vehicle->status
        ]);
    }

    /**
     * 5. MONITORING & VERIFIKASI TRANSAKSI
     */
    public function listAllTransactions()
    {
        $transactions = Pemesanan::with(['user', 'kendaraan'])
                        ->orderBy('created_at', 'desc')
                        ->get();
                        
        return response()->json($transactions);
    }

    public function verifyPayment(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
        ]);

        // Pastikan load relasi kendaraan
        $pemesanan = Pemesanan::with('kendaraan')->findOrFail($id);
        
        if ($request->status === 'disetujui') {
            $pemesanan->status = 'selesai'; // Atau 'menunggu_verifikasi_dokumen' tergantung alurmu
            $pemesanan->status_pembayaran = 'disetujui';
            $pesan = "Pembayaran Berhasil Diverifikasi.";
        } else {
            // === JIKA DITOLAK ===
            $pemesanan->status = 'dibatalkan';
            $pemesanan->status_pembayaran = 'ditolak';
            $pesan = "Pembayaran Ditolak & Pesanan Dibatalkan.";

            // === [TAMBAHAN BARU: KEMBALIKAN STATUS KENDARAAN] ===
            // Jika pembayaran ditolak, mobil harus bisa disewa orang lain lagi
            if ($pemesanan->kendaraan) {
                $pemesanan->kendaraan->status = 'Tersedia';
                $pemesanan->kendaraan->save();
            }
            // ====================================================
        }


        $pemesanan->save();

        return response()->json([
            'success' => true,
            'message' => $pesan
        ]);
    }

    public function deleteVehicle($id)
    {
        // Cari kendaraan
        $vehicle = Kendaraan::findOrFail($id);

        // (Opsional) Hapus gambar dari penyimpanan biar server gak penuh
        if ($vehicle->gambar_url) {
            $path = str_replace(url('storage/'), '', $vehicle->gambar_url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }

        // Hapus data dari database
        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit berhasil dihapus permanen oleh Admin.'
        ]);
    }
}