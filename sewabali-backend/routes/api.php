<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLER ---
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\DokumenVerifikasiController;
// HAPUS PembayaranController (Kita pakai BuktiBayarController saja)
use App\Http\Controllers\Api\BuktiBayarController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC ROUTES (Tanpa Login)
// ==========================================

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 

// Data Kendaraan (Halaman Depan)
Route::get('/kendaraan', [KendaraanController::class, 'index']);
// Detail Kendaraan (Validasi ID harus angka)
Route::get('/kendaraan/{id}', [KendaraanController::class, 'show'])->where('id', '[0-9]+');

// User Profile Public
Route::get('/users/{id}', function ($id) {
    $user = \App\Models\User::find($id);
    if (!$user) {
        return response()->json(['error' => 'User tidak ditemukan'], 404);
    }
    return response()->json($user);
});

// ==========================================
// 2. PROTECTED ROUTES (Wajib Login / Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // --- FITUR PENYEWA ---
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::post('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'store']);
    
    // HAPUS Route::post('/pembayaran'...) -> Ganti dengan ini:
    Route::post('/bukti-bayar', [BuktiBayarController::class, 'store']); // Upload Bukti
    
    // --- FITUR PERENTAL (Dashboard & Manajemen) ---
    
    // Ambil Unit Sendiri
    Route::get('/kendaraan/saya', [KendaraanController::class, 'myUnits']); 
    
    // Tambah Unit Baru
    Route::post('/kendaraan', [KendaraanController::class, 'store']); 
    
    // Kelola Pesanan Masuk (Lihat & Konfirmasi)
    Route::get('/transaksi/perental', [PemesananController::class, 'indexPesananMasuk']);
    Route::post('/transaksi/{id}/konfirmasi', [PemesananController::class, 'konfirmasiPesanan']);
    
    // --- VERIFIKASI DOKUMEN (Perental) ---
    Route::get('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'index']);
    Route::post('/dokumen-verifikasi/{id}/verify', [DokumenVerifikasiController::class, 'verify']);
    Route::post('/dokumen-verifikasi/{id}/reject', [DokumenVerifikasiController::class, 'reject']);
    
    // --- VERIFIKASI PEMBAYARAN (Perental) ---
    Route::get('/bukti-bayar', [BuktiBayarController::class, 'index']); // Lihat daftar bukti
    Route::post('/bukti-bayar/{id}/verify', [BuktiBayarController::class, 'verify']); // Terima
    Route::post('/bukti-bayar/{id}/reject', [BuktiBayarController::class, 'reject']); // Tolak
    
    // --- NOTIFIKASI ---
    Route::get('/notifikasi', function (Request $request) {
        return $request->user()->notifikasi()->latest()->get();
    });
    Route::post('/notifikasi/{id}/read', function (Request $request, $id) {
        $notifikasi = \App\Models\Notifikasi::find($id);
        if ($notifikasi) {
            $notifikasi->update(['is_read' => true]);
        }
        return response()->json(['message' => 'Notifikasi dibaca']);
    });

    // Cek User Login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});