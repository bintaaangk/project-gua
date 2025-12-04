<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemesanans', function (Blueprint $table) {
            $table->id('id_pemesanan'); // id_pemesanan (AUTO_INCREMENT)
            
            // Kolom Foreign Keys (diasumsikan)
            $table->unsignedBigInteger('id_penyewa'); // id_penyewa
            $table->unsignedBigInteger('id_kendaraan'); // id_kendaraan
            
            $table->date('tanggal_pesan'); // tanggal_pesan
            $table->integer('durasi_hari'); // durasi_hari
            $table->decimal('total_harga', 10, 2); // total_harga
            
            // Status (enum: menunggu_verifikasi, dalam_sewa, selesai)
            $table->enum('status', ['menunggu_verifikasi', 'dalam_sewa', 'selesai'])->default('menunggu_verifikasi'); 
            
            $table->timestamps(); // tanggal_dibuat (created_at)

            // Menambahkan foreign key constraints (jika tabel users dan kendaraans sudah ada)
            $table->foreign('id_penyewa')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_kendaraan')->references('id')->on('kendaraans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanans');
    }
};
