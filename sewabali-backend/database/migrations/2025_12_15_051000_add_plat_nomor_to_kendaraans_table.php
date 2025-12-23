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
            // Tambahkan kolom plat_nomor
            if (!Schema::hasColumn('kendaraans', 'plat_nomor')) {
                $table->string('plat_nomor')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kendaraans', function (Blueprint $table) {
            if (Schema::hasColumn('kendaraans', 'plat_nomor')) {
                $table->dropColumn('plat_nomor');
            }
        });
    }
};
