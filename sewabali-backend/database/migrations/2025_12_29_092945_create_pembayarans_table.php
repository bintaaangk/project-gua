<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pastikan nama tabelnya 'pembayarans'
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id('id_pembayaran'); 
            $table->unsignedBigInteger('id_pemesanan'); // Ini kolom yang tadi dibilang 'unknown'
            $table->decimal('total_bayar', 10, 2);
            $table->string('bukti_pembayaran');
            $table->string('no_rekening_perental')->nullable();
            $table->enum('status_pembayaran', ['menunggu_verifikasi', 'lunas', 'ditolak'])->default('menunggu_verifikasi');
            $table->timestamps();

            $table->foreign('id_pemesanan')->references('id_pemesanan')->on('pemesanans')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};