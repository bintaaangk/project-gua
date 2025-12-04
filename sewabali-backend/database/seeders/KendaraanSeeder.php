<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kendaraan; // Import model
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class KendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama (jika ada)
        Kendaraan::truncate();

        // Data Mobil (Gunakan file lokal dari folder /public)
        Kendaraan::create([
            'nama' => 'Innova Zenix 2024',
            'tipe' => 'Mobil',
            'harga_per_hari' => 750000,
            'gambar_url' => '/innova-zenix.jpg' // <-- GANTI NAMA FILE INI
        ]);
        Kendaraan::create([
            'nama' => 'All New Avanza 2023',
            'tipe' => 'Mobil',
            'harga_per_hari' => 550000,
            'gambar_url' => '/avanza-2023.jpeg' // <-- GANTI NAMA FILE INI
        ]);
        Kendaraan::create([
            'nama' => 'Pajero Sport Dakar 2024',
            'tipe' => 'Mobil',
            'harga_per_hari' => 900000,
            'gambar_url' => '/pajero-sport.jpeg' // <-- GANTI NAMA FILE INI
        ]);

        // Data Motor (Gunakan file lokal dari folder /public)
        Kendaraan::create([
            'nama' => 'Yamaha Aerox 155',
            'tipe' => 'Motor',
            'harga_per_hari' => 185000,
            'gambar_url' => '/aerox-155.jpeg' // <-- GANTI NAMA FILE INI
        ]);
        Kendaraan::create([
            'nama' => 'Yamaha Nmax 155',
            'tipe' => 'Motor',
            'harga_per_hari' => 150000,
            'gambar_url' => '/nmax-155.jpeg' // <-- GANTI NAMA FILE INI
        ]);
        Kendaraan::create([
            'nama' => 'Yamaha Xmax 250',
            'tipe' => 'Motor',
            'harga_per_hari' => 215000,
            'gambar_url' => '/xmax-250.jpeg' // <-- GANTI NAMA FILE INI
        ]);
    }
}

