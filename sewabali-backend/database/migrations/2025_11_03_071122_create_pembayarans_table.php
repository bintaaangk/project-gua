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
        // PERBAIKAN: Gunakan nama tabel yang sama dengan database Anda
        Schema::create('tabel_pembayaran', function (Blueprint $table) { 
            $table->id('id_pembayaran');
            $table->integer('id_pemesanan'); // Kita pakai integer karena kita belum buat tabel pemesanans
            $table->decimal('total_bayar', 10, 2);
            $table->string('no_rekening_perental', 50)->nullable();
            $table->string('bukti_pembayaran', 255)->nullable(); // Path file bukti transfer
            $table->enum('status_pembayaran', ['menunggu_verifikasi', 'valid', 'tidak_valid'])
                  ->default('menunggu_verifikasi');
            $table->dateTime('tanggal_bayar')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabel_pembayaran');
    }
};
