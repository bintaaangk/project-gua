<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
       'name',
        'email',
        'password',
        // --- TAMBAHKAN KOLOM INI AGAR BISA DI-UPDATE ---
        'nomor_telepon', // Pastikan ini sesuai nama kolom di DB (misal: no_hp)
        'alamat',
        'avatar_url',
        'role',
        'status',// <-- TAMBAHKAN INI
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class);
    }

    // app/Models/User.php

public function kendaraans()
{
    return $this->hasMany(Kendaraan::class, 'user_id');
}
}