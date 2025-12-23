<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuktiBayar extends Model
{
    /** @use HasFactory<\Database\Factories\BuktiBayarFactory> */
    use HasFactory;

    protected $table = 'bukti_pembayarans';
    protected $fillable = ['id_pemesanan', 'id_perental', 'path_bukti', 'status', 'catatan', 'tanggal_verifikasi'];

    // Relationships
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }

    public function perental()
    {
        return $this->belongsTo(User::class, 'id_perental', 'id');
    }

    public function penyewa()
    {
        return $this->pemesanan()->belongsTo(User::class, 'id_penyewa', 'id');
    }
}
