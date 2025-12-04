<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;

    // Asumsi nama tabel Anda adalah 'tabel_pemesanans' atau 'pemesanans'
    protected $table = 'tabel_pemesanans'; 
    protected $primaryKey = 'id_pemesanan';

    protected $fillable = [
        'id_penyewa',
        'id_kendaraan',
        'tanggal_pesan',
        'durasi_hari',
        'total_harga',
        'status',
    ];
}
