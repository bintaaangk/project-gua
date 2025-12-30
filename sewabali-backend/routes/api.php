<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLER ---
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\DokumenVerifikasiController;
use App\Http\Controllers\Api\BuktiBayarController;
use App\Http\Controllers\Api\AdminController; 

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Tanpa Login)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 

// Akses Kendaraan untuk Beranda
Route::get('/kendaraan', [KendaraanController::class, 'index']);
Route::get('/kendaraan/{id}', [KendaraanController::class, 'show'])->where('id', '[0-9]+');

/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (Wajib Login / Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);
    Route::post('/user/password', [AuthController::class, 'updatePassword']);

    // --- PROFIL & NOTIFIKASI ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users/{id}', function ($id) {
        $user = \App\Models\User::find($id);
        return $user ? response()->json($user) : response()->json(['error' => 'User tidak ditemukan'], 404);
    });

    Route::get('/notifikasi', function (Request $request) {
        return $request->user()->notifikasi()->latest()->get();
    });
    Route::post('/notifikasi/{id}/read', function (Request $request, $id) {
        $notifikasi = \App\Models\Notifikasi::find($id);
        if ($notifikasi) $notifikasi->update(['is_read' => true]);
        return response()->json(['message' => 'Notifikasi dibaca']);
    });

    // --- FITUR PANEL ADMIN ---
    Route::prefix('admin')->group(function () {
        // Statistik Dashboard
        Route::get('/stats', [AdminController::class, 'getStats']); // Tambahan untuk angka dashboard
        
        // Manajemen User
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']); // Tambahan fungsi hapus
        
        // Manajemen Armada
        Route::get('/kendaraans', [AdminController::class, 'getKendaraans']);
        
        // Manajemen Transaksi
        Route::get('/transaksi', [AdminController::class, 'getTransactions']);
        Route::post('/transaksi/{id}/status', [AdminController::class, 'updateTransactionStatus']);
        
        // Manajemen Verifikasi Dokumen (Oleh Admin Utama)
        Route::get('/verifikasi-dokumen', [AdminController::class, 'getVerifications']);
        Route::post('/verifikasi/{id}', [AdminController::class, 'updateVerification']);
    });

    // --- FITUR PENYEWA ---
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::get('/riwayat', [PemesananController::class, 'indexRiwayat']);
    Route::get('/riwayat/{id}', [PemesananController::class, 'show']);
    Route::post('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'store']);
    Route::post('/bukti-bayar', [BuktiBayarController::class, 'store']); 
    
    // --- FITUR PERENTAL (Pemilik Kendaraan) ---
    Route::get('/kendaraan/saya', [KendaraanController::class, 'myUnits']); 
    Route::post('/kendaraan', [KendaraanController::class, 'store']); 
    Route::get('/transaksi/perental', [PemesananController::class, 'indexPesananMasuk']);
    Route::post('/transaksi/{id}/konfirmasi', [PemesananController::class, 'konfirmasiPesanan']);

    Route::delete('/kendaraan/{id}', [KendaraanController::class, 'destroy']);
    
    // Verifikasi oleh Perental
    Route::get('/dokumen-verifikasi-perental', [DokumenVerifikasiController::class, 'index']);
    Route::post('/dokumen-verifikasi/{id}/verify', [DokumenVerifikasiController::class, 'verify']);
    Route::post('/dokumen-verifikasi/{id}/reject', [DokumenVerifikasiController::class, 'reject']);
    
    Route::get('/bukti-bayar-perental', [BuktiBayarController::class, 'index']); 
    Route::post('/bukti-bayar/{id}/verify', [BuktiBayarController::class, 'verify']); 
    Route::post('/bukti-bayar/{id}/reject', [BuktiBayarController::class, 'reject']); 
    // Pastikan baris ini ada agar URL /api/transaksi/{id}/upload dikenali
Route::post('/transaksi/{id}/upload', [PemesananController::class, 'uploadUlang']);
Route::get('/pengingat-tenggat', [PemesananController::class, 'cekPengingat']);

});