<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // <-- PENTING: Tambahkan ini

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Matikan pengecekan Foreign Key (agar tidak error 1701)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 2. Panggil Seeder Kendaraan
        $this->call([
            KendaraanSeeder::class,
        ]);

        // 3. Nyalakan kembali pengecekan Foreign Key
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}