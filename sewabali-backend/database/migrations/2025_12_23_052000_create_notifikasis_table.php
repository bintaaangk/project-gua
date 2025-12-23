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
        Schema::create('notifikasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('tipe'); // 'dokumen_upload', 'dokumen_verified', 'dokumen_rejected', 'pesanan_dikonfirmasi', etc
            $table->text('pesan');
            $table->unsignedBigInteger('pemesanan_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            // Foreign key for pemesanan (gunakan id_pemesanan)
            $table->foreign('pemesanan_id')->references('id_pemesanan')->on('pemesanans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasis');
    }
};
