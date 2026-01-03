<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    // Pastikan semua kolom yang dikirim dari Controller ada di sini
    protected $fillable = [
        'user_id', 
        'nama', 
        'tipe', 
        'plat_nomor', 
        'harga_per_hari', 
        'status', 
        'gambar_url',
        'transmisi', 
        'kapasitas',
        'no_rekening',
        'jaminan',
        // 'lokasi' dan 'deskripsi' saya hapus dari sini karena di Migration kamu tadi tidak ada
        // Kalau mau pakai lokasi/deskripsi, kamu harus tambah kolomnya dulu di file Migration
    ];

    // Relasi ke User (Pemilik Kendaraan)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Transaksi
    public function transaksis()
    {
        return $this->hasMany(Transaksi::class, 'id_kendaraan');
    }
}