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
        Schema::table('kendaraans', function (Blueprint $table) {
            // Tambahkan kolom user_id untuk relasi dengan user (perental owner)
            if (!Schema::hasColumn('kendaraans', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            }
            
            // Tambahkan kolom status (untuk penanda ketersediaan kendaraan)
            if (!Schema::hasColumn('kendaraans', 'status')) {
                $table->enum('status', ['Tersedia', 'Tidak Tersedia'])->default('Tersedia');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kendaraans', function (Blueprint $table) {
            $table->dropForeignIdFor('users');
            $table->dropColumnIfExists('user_id');
            $table->dropColumnIfExists('status');
        });
    }
};
