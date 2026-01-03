<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    // Nama tabel di database (pastikan sama, biasanya jamak/plural)
    protected $table = 'transaksis';

    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'id_user',
        'id_kendaraan',
        'kode_transaksi',
        'tanggal_mulai',
        'tanggal_selesai',
        'total_harga',
        'bukti_pembayaran',
        'status', // Contoh: pending, disetujui, sedang_disewa, selesai, ditolak
        'catatan'
    ];

    /**
     * Relasi ke Model User (Siapa yang menyewa)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Relasi ke Model Kendaraan (Unit apa yang disewa)
     */
    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'id_kendaraan');
    }
}