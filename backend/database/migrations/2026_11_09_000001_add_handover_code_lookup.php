<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->char('ma_tra_cuu_hash', 64)->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->dropUnique(['ma_tra_cuu_hash']);
            $table->dropColumn('ma_tra_cuu_hash');
        });
    }
};
