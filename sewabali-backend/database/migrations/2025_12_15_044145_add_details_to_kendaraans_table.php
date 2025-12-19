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
        // Tambahkan kolom yang kurang
        if (!Schema::hasColumn('kendaraans', 'transmisi')) {
            $table->string('transmisi')->default('Manual'); // Manual / Matic
        }
        if (!Schema::hasColumn('kendaraans', 'kapasitas')) {
            $table->integer('kapasitas')->default(4); // Jumlah kursi
        }
    });
}

/**
 * Reverse the migrations.
 */
public function down(): void
{
    Schema::table('kendaraans', function (Blueprint $table) {
        $table->dropColumnIfExists('transmisi');
        $table->dropColumnIfExists('kapasitas');
    });
}
};
