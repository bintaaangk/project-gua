<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DokumenVerifikasi;
use App\Models\Pembayaran;
use App\Models\User;
use App\Models\Kendaraan;

class Pemesanan extends Model
{
    use HasFactory;

    protected $table = 'pemesanans'; 
    protected $primaryKey = 'id_pemesanan';

    protected $fillable = [
        'id_penyewa',
        'id_kendaraan',
        'tanggal_pesan',
        'durasi_hari',
        'total_harga',
        'status',
        'catatan', // <--- TAMBAHAN: Untuk menyimpan alasan tolak
        'tanggal_kembali', // Pastikan ini ada
    ];

    // --- RELASI (DISESUAIKAN DENGAN CONTROLLER) ---

    // 1. Relasi ke User (Penyewa)
    // Kita ganti nama function dari 'penyewa' ke 'user' agar sinkron dengan Controller ($p->user)
    public function user()
    {
        return $this->belongsTo(User::class, 'id_penyewa', 'id');
    }

    // 2. Relasi ke Kendaraan
    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'id_kendaraan', 'id');
    }

    // 3. Relasi ke Dokumen Verifikasi (Gunakan camelCase)
    public function dokumenVerifikasi()
    {
        // Pastikan foreign key di tabel dokumen_verifikasis adalah 'pemesanan_id'
        // Jika di database kamu namanya 'id_pemesanan', ganti parameter kedua jadi 'id_pemesanan'
        return $this->hasOne(DokumenVerifikasi::class, 'pemesanan_id', 'id_pemesanan');
    }

    // 4. Relasi ke Bukti Bayar (Model Pembayaran)
    // Kita namakan 'buktiBayar' agar sinkron dengan Controller ($p->buktiBayar)
    public function buktiBayar()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan', 'id_pemesanan');
    }
}