<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenVerifikasi extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_dokumen';

    protected $fillable = [
        'id_penyewa',
        'path_ktp',
        'path_sim_c',
        'path_jaminan',
        'status'
    ];
}
