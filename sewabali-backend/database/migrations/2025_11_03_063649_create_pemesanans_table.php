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
            $table->id('id_pemesanan'); 
            
            $table->unsignedBigInteger('id_penyewa'); 
            $table->unsignedBigInteger('id_kendaraan'); 
            
            $table->date('tanggal_pesan'); 
            $table->integer('durasi_hari'); 
            $table->decimal('total_harga', 12, 2); // Dinaikkan menjadi 12 agar aman untuk nominal jutaan
            
            // PERBAIKAN: Tambahkan 'menunggu_dokumen', 'menunggu_pembayaran', dan 'batal'
            $table->enum('status', [
                'menunggu_dokumen', 
                'menunggu_pembayaran', 
                'menunggu_verifikasi', 
                'dalam_sewa', 
                'selesai', 
                'batal'
            ])->default('menunggu_dokumen'); 
            
            $table->timestamps(); 

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
