<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('transaksis', function (Blueprint $table) {
        $table->id();
        
        // Relasi ke tabel users (Penyewa)
        $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
        
        // Relasi ke tabel kendaraans (Unit)
        $table->foreignId('id_kendaraan')->constrained('kendaraans')->onDelete('cascade');
        
        $table->string('kode_transaksi')->unique();
        $table->date('tanggal_mulai');
        $table->date('tanggal_selesai');
        $table->integer('total_harga');
        
        // Bukti bayar disimpan sebagai path file gambar
        $table->string('bukti_pembayaran')->nullable();
        
        // Status transaksi
        $table->enum('status', ['pending', 'disetujui', 'sedang_disewa', 'selesai', 'ditolak'])->default('pending');
        
        $table->text('catatan')->nullable();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
