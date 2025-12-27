<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;

    // 1. Sesuaikan Nama Tabel
    protected $table = 'pemesanans'; 

    // 2. Sesuaikan Primary Key (WAJIB KARENA BUKAN 'id')
    protected $primaryKey = 'id_pemesanan';

    // 3. Pastikan kolom ini boleh diisi
    protected $fillable = [
        'id_penyewa',
        'id_kendaraan',
        'tanggal_pesan',
        'durasi_hari',
        'total_harga',
        'status',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_penyewa', 'id');
    }

    // Relasi ke Kendaraan
    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'id_kendaraan', 'id');
    }

    // Relasi ke Pembayaran
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan', 'id_pemesanan');
    }
}