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
        Schema::create('dokumen_verifikasis', function (Blueprint $table) { 
            $table->id('id_dokumen');
            // Menghubungkan ke tabel pemesanan dan penyewa
            $table->unsignedBigInteger('pemesanan_id');
            $table->foreignId('id_penyewa')->constrained('users'); 
            $table->foreignId('perental_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Path file
            $table->string('path_ktp');
            $table->string('path_sim_c')->nullable();
            $table->string('path_jaminan'); // Bisa STNK/Ijazah/Kartu Keluarga
            $table->string('path_bukti_transfer')->nullable(); // Bukti pembayaran
            
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('catatan_verifikasi')->nullable(); // Alasan jika ditolak
            $table->timestamp('tanggal_verifikasi')->nullable();

            $table->timestamps();
            
            // Foreign key untuk pemesanan (gunakan id_pemesanan)
            $table->foreign('pemesanan_id')->references('id_pemesanan')->on('pemesanans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_verifikasis');
    }
};
