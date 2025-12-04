<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PENTING: Import Controller dari Namespace yang benar (App\Http\Controllers\Api)
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\DokumenVerifikasiController;
use App\Http\Controllers\Api\PembayaranController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Registrasi & Data Umum
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/kendaraan', [KendaraanController::class, 'index']); // <-- Ini yang bikin 404

// 2. Transaksi (Pemesanan -> Verifikasi -> Pembayaran)
Route::post('/pemesanan', [PemesananController::class, 'store']);
Route::post('/dokumen-verifikasi', [DokumenVerifikasiController::class, 'store']);
Route::post('/pembayaran', [PembayaranController::class, 'store']);

// (Opsional) Rute user jika butuh nanti
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});