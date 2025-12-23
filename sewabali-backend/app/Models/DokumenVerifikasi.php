<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenVerifikasi extends Model
{
    use HasFactory;

    protected $table = 'dokumen_verifikasis';
    protected $primaryKey = 'id_dokumen';

    protected $fillable = [
        'pemesanan_id',
        'id_penyewa',
        'perental_id',
        'path_ktp',
        'path_sim_c',
        'path_jaminan',
        'path_bukti_transfer',
        'status',
        'catatan_verifikasi',
        'tanggal_verifikasi',
    ];

    public function penyewa()
    {
        return $this->belongsTo(User::class, 'id_penyewa');
    }

    public function perental()
    {
        return $this->belongsTo(User::class, 'perental_id');
    }

    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class);
    }
}
