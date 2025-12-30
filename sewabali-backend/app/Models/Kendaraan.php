<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    // KITA TAMBAHKAN 'no_rekening', 'lokasi', DAN 'deskripsi' DISINI
    protected $fillable = [
        'user_id', 
        'nama', 
        'tipe', 
        'jenis', 
        'plat_nomor', 
        'harga_per_hari', 
        'status', 
        'gambar_url',
        'transmisi', 
        'kapasitas',
        'lokasi',       // <-- Tambahan
        'deskripsi',    // <-- Tambahan
        'no_rekening'   // <-- INI YANG PALING PENTING
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}