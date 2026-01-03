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
    Schema::table('kendaraans', function (Blueprint $table) {
        $table->text('jaminan')->after('no_rekening')->nullable(); 
        // Menggunakan tipe TEXT agar bisa menampung tulisan yang panjang
    });
}

public function down()
{
    Schema::table('kendaraans', function (Blueprint $table) {
        $table->dropColumn('jaminan');
    });
}

 
};
