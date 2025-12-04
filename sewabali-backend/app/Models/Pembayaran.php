<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'tabel_pembayaran'; // Pastikan nama tabel benar
    protected $primaryKey = 'id_pembayaran';
    public $timestamps = false; // Tidak menggunakan created_at dan updated_at

    protected $fillable = [
        'id_pemesanan',
        'total_bayar',
        'no_rekening_perental',
        'bukti_pembayaran',
        'status_pembayaran',
        'tanggal_bayar'
    ];
}
