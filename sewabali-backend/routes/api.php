<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PENTING: Panggil AuthController yang baru
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\DokumenVerifikasiController;
use App\Http\Controllers\Api\PembayaranController;
use App\Http\Controllers\BuktiBayarController;

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
Route::get('/kendaraan/{id}', [KendaraanController::class, 'show']);

// User profile
Route::get('/users/{id}', function ($id) {
    $user = \App\Models\User::find($id);
    if (!$user) {
        return response()->json(['error' => 'User tidak ditemukan'], 404);
    }
    return response()->json($user);
});

// 3. FITUR YANG PERLU LOGIN (Penyewa & Perental)
Route::middleware('auth:sanctum')->group(function () {
    
    // --- FITUR PENYEWA ---
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::post('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'store']);
    Route::post('/pembayaran', [PembayaranController::class, 'store']);
    
    // --- FITUR PERENTAL (Verifikasi Dokumen & Pesanan) ---
    Route::get('/kendaraan/perental', [KendaraanController::class, 'indexPerental']); 
    Route::post('/kendaraan', [KendaraanController::class, 'store']); 
    Route::get('/transaksi/perental', [PemesananController::class, 'indexPesananMasuk']);
    Route::post('/transaksi/{id}/konfirmasi', [PemesananController::class, 'konfirmasiPesanan']);
    
    // Dokumen Verifikasi (Perental & Admin)
    Route::get('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'index']);
    Route::post('/dokumen-verifikasi/{id}/verify', [DokumenVerifikasiController::class, 'verify']);
    Route::post('/dokumen-verifikasi/{id}/reject', [DokumenVerifikasiController::class, 'reject']);
    
    // Bukti Pembayaran Verifikasi (Perental & Penyewa)
    Route::get('/bukti-bayar', [BuktiBayarController::class, 'index']); // Perental lihat bukti bayar pending
    Route::post('/bukti-bayar', [BuktiBayarController::class, 'store']); // Penyewa upload bukti bayar
    Route::post('/bukti-bayar/{id}/verify', [BuktiBayarController::class, 'verify']); // Perental approve
    Route::post('/bukti-bayar/{id}/reject', [BuktiBayarController::class, 'reject']); // Perental tolak
    
    // Notifikasi
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

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});