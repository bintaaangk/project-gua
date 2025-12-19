<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kendaraan;

class KendaraanSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan tabel sebelum mengisi agar tidak duplikat
        Kendaraan::truncate();

        $dataKendaraan = [
            // --- MOBIL (10 Unit) ---
            [
                'nama' => 'Toyota Innova Zenix 2024',
                'tipe' => 'Mobil',
                'harga_per_hari' => 750000,
                'gambar_url' => 'https://placehold.co/600x400/007bff/FFFFFF?text=Innova+Zenix'
            ],
            [
                'nama' => 'Toyota All New Avanza',
                'tipe' => 'Mobil',
                'harga_per_hari' => 550000,
                'gambar_url' => 'https://placehold.co/600x400/198754/FFFFFF?text=Avanza'
            ],
            [
                'nama' => 'Mitsubishi Pajero Sport',
                'tipe' => 'Mobil',
                'harga_per_hari' => 900000,
                'gambar_url' => 'https://placehold.co/600x400/333333/FFFFFF?text=Pajero+Sport'
            ],
            [
                'nama' => 'Honda Brio Satya',
                'tipe' => 'Mobil',
                'harga_per_hari' => 350000,
                'gambar_url' => 'https://placehold.co/600x400/ffc107/333333?text=Honda+Brio'
            ],
            [
                'nama' => 'Toyota Raize GR Sport',
                'tipe' => 'Mobil',
                'harga_per_hari' => 450000,
                'gambar_url' => 'https://placehold.co/600x400/dc3545/FFFFFF?text=Toyota+Raize'
            ],
            [
                'nama' => 'Toyota Fortuner VRZ',
                'tipe' => 'Mobil',
                'harga_per_hari' => 1200000,
                'gambar_url' => 'https://placehold.co/600x400/000000/FFFFFF?text=Fortuner+VRZ'
            ],
            [
                'nama' => 'Toyota Alphard Transformer',
                'tipe' => 'Mobil',
                'harga_per_hari' => 2500000,
                'gambar_url' => 'https://placehold.co/600x400/ffffff/000000?text=Alphard'
            ],
            [
                'nama' => 'Mitsubishi Xpander Cross',
                'tipe' => 'Mobil',
                'harga_per_hari' => 500000,
                'gambar_url' => 'https://placehold.co/600x400/6610f2/FFFFFF?text=Xpander'
            ],
            [
                'nama' => 'Suzuki Jimny 4x4',
                'tipe' => 'Mobil',
                'harga_per_hari' => 1500000,
                'gambar_url' => 'https://placehold.co/600x400/20c997/FFFFFF?text=Suzuki+Jimny'
            ],
            [
                'nama' => 'Toyota Hiace Commuter',
                'tipe' => 'Mobil',
                'harga_per_hari' => 1100000,
                'gambar_url' => 'https://placehold.co/600x400/6c757d/FFFFFF?text=Hiace'
            ],

            // --- MOTOR (10 Unit) ---
            [
                'nama' => 'Yamaha Aerox 155',
                'tipe' => 'Motor',
                'harga_per_hari' => 185000,
                'gambar_url' => 'https://placehold.co/600x400/dc3545/FFFFFF?text=Aerox+155'
            ],
            [
                'nama' => 'Yamaha Nmax 155',
                'tipe' => 'Motor',
                'harga_per_hari' => 150000,
                'gambar_url' => 'https://placehold.co/600x400/ffc107/333333?text=Nmax+155'
            ],
            [
                'nama' => 'Yamaha Xmax 250',
                'tipe' => 'Motor',
                'harga_per_hari' => 215000,
                'gambar_url' => 'https://placehold.co/600x400/6610f2/FFFFFF?text=Xmax+250'
            ],
            [
                'nama' => 'Honda Vario 160',
                'tipe' => 'Motor',
                'harga_per_hari' => 100000,
                'gambar_url' => 'https://placehold.co/600x400/333333/FFFFFF?text=Vario+160'
            ],
            [
                'nama' => 'Honda Scoopy Stylish',
                'tipe' => 'Motor',
                'harga_per_hari' => 85000,
                'gambar_url' => 'https://placehold.co/600x400/d63384/FFFFFF?text=Scoopy'
            ],
            [
                'nama' => 'Honda PCX 160',
                'tipe' => 'Motor',
                'harga_per_hari' => 160000,
                'gambar_url' => 'https://placehold.co/600x400/ffffff/000000?text=PCX+160'
            ],
            [
                'nama' => 'Vespa Sprint S 150',
                'tipe' => 'Motor',
                'harga_per_hari' => 250000,
                'gambar_url' => 'https://placehold.co/600x400/fd7e14/FFFFFF?text=Vespa+Sprint'
            ],
            [
                'nama' => 'Kawasaki KLX 150',
                'tipe' => 'Motor',
                'harga_per_hari' => 200000,
                'gambar_url' => 'https://placehold.co/600x400/198754/FFFFFF?text=KLX+150'
            ],
            [
                'nama' => 'Honda Beat Street',
                'tipe' => 'Motor',
                'harga_per_hari' => 75000,
                'gambar_url' => 'https://placehold.co/600x400/000000/FFFFFF?text=Beat+Street'
            ],
            [
                'nama' => 'Yamaha Fazzio Hybrid',
                'tipe' => 'Motor',
                'harga_per_hari' => 110000,
                'gambar_url' => 'https://placehold.co/600x400/0dcaf0/FFFFFF?text=Fazzio'
            ],
        ];

        foreach ($dataKendaraan as $data) {
            Kendaraan::create($data);
        }
    }
}