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
    Schema::create('kendaraans', function (Blueprint $table) {
        $table->id();
        $table->string('nama'); // Misal: "Inova Reborn 2025"
        $table->enum('tipe', ['Mobil', 'Motor']); // Tipe kendaraan
        $table->integer('harga_per_hari'); // Misal: 700000
        $table->string('gambar_url'); // URL ke gambar
        $table->string('no_rekening')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraans');
    }
};
