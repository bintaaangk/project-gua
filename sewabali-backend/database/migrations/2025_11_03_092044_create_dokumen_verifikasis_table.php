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
            // Menghubungkan ke tabel user
            $table->foreignId('id_penyewa')->constrained('users'); 
            
            // Path file
            $table->string('path_ktp');
            $table->string('path_sim_c')->nullable();
            $table->string('path_jaminan'); // Bisa STNK/Ijazah/Kartu Keluarga
            
            $table->enum('status', ['pending', 'verified', 'rejected'])
                  ->default('pending');

            $table->timestamps();
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
