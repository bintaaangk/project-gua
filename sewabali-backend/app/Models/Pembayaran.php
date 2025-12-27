<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    // Arahkan ke tabel 'pembayarans' (tabel baru yang kamu buat via SQL tadi)
    protected $table = 'pembayarans';

    // Primary Key
    protected $primaryKey = 'id_pembayaran';

    // Kolom yang boleh diisi
    protected $fillable = [
        'id_pemesanan',
        'total_bayar',
        'bukti_pembayaran',
        'status_pembayaran',
        'no_rekening_perental',
    ];

    // Relasi ke Pemesanan
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }
}