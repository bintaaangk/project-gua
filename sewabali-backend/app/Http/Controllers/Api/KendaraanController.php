<?php

namespace App\Http\Controllers\Api; // <-- Pastikan namespace-nya 'Api'

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kendaraan; // <-- Pastikan ini di-import

class KendaraanController extends Controller // <-- Pastikan namanya sama
{
    /**
     * Tampilkan semua data kendaraan.
     */
    public function index()
    {
        // Ambil semua mobil
        $mobil = Kendaraan::where('tipe', 'Mobil')->get();

        // Ambil semua motor
        $motor = Kendaraan::where('tipe', 'Motor')->get();

        // Kirim sebagai JSON
        return response()->json([
            'mobil' => $mobil,
            'motor' => $motor,
        ]);
    }
}
