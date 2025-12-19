<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PENTING: Panggil AuthController yang baru
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\DokumenVerifikasiController;
use App\Http\Controllers\Api\PembayaranController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- PINTU MASUK (LOGIN & REGISTER) ---
// Perhatikan: Kita pakai [AuthController::class, ...]
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 

// 2. DATA UMUM
Route::get('/kendaraan', [KendaraanController::class, 'index']);

// 3. FITUR YANG PERLU LOGIN (Penyewa & Perental)
Route::middleware('auth:sanctum')->group(function () {
    
    // --- FITUR PENYEWA ---
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::post('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'store']);
    Route::post('/pembayaran', [PembayaranController::class, 'store']);
    
    // --- FITUR PERENTAL ---
    Route::get('/kendaraan/perental', [KendaraanController::class, 'indexPerental']); 
    Route::post('/kendaraan', [KendaraanController::class, 'store']); 
    Route::get('/transaksi/perental', [PemesananController::class, 'indexPesananMasuk']);
    Route::post('/transaksi/{id}/konfirmasi', [PemesananController::class, 'konfirmasiPesanan']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});