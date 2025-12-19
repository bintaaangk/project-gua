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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            
            // UBAHAN 1: Hapus ->unique() dari sini agar tidak error Duplicate Entry
            $table->string('email'); 
            
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // --- DATA TAMBAHAN ---
            $table->string('role')->default('penyewa'); // penyewa atau perental
            $table->string('nomor_telepon')->nullable();
            $table->text('alamat')->nullable();
            // ---------------------

            $table->rememberToken();
            $table->timestamps();

            // UBAHAN 2: Tambahkan Unique Kombinasi di sini (PENTING!)
            // Artinya: Kombinasi Email + Role tidak boleh sama.
            // Contoh: 
            // - budi@gmail.com + penyewa (Boleh)
            // - budi@gmail.com + perental (Boleh)
            // - budi@gmail.com + penyewa (Gagal/Duplicate)
            $table->unique(['email', 'role']); 
            
            // Lakukan hal yang sama untuk nomor telepon (jika perlu)
            $table->unique(['nomor_telepon', 'role']);
        });

        // Tabel untuk reset password (bawaan Laravel)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Tabel untuk sessions (bawaan Laravel)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};