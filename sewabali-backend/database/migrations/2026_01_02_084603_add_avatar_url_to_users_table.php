<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kolom avatar_url setelah kolom email (boleh kosong)
            $table->string('avatar_url')->nullable()->after('email');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar_url');
        });
    }
};