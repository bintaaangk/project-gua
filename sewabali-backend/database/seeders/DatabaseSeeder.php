<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User; // Pastikan ini ada

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Matikan pengecekan Foreign Key (agar tidak error 1701)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

         User::truncate(); 

        // ==========================================
        // 3. BUAT AKUN ADMIN (KEMBALIKAN ADMIN KAMU)
        // ==========================================
        User::create([
            'name'          => 'Admin Rental Bali',
            'email'         => 'admin@gmail.com', // Email Login Admin
            'password'      => Hash::make('admin123456'), // Password Admin
            'role'          => 'admin', // Role Admin
            'nomor_telepon' => '081234567890',
            'alamat'        => 'Kantor Pusat Rental Bali',
            // 'avatar_url' => null // (Opsional, kalau kolom avatar_url sudah ada di migration)
        ]);

      

        // 3. Nyalakan kembali pengecekan Foreign Key
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

   
}