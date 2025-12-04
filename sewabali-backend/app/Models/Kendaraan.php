<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    // Tambahkan ini agar Model Kendaraan bisa diisi
    protected $fillable = [
        'nama',
        'tipe',
        'harga_per_hari',
        'gambar_url',
    ];
}
