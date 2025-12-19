<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    // Tambahkan ini agar Model Kendaraan bisa diisi
    protected $fillable = [
    'user_id', 'nama', 'tipe', 'jenis', 'plat_nomor', 
    'harga_per_hari', 'status', 'gambar_url',
    'transmisi', 'kapasitas' // <-- WAJIB ADA
];
}
