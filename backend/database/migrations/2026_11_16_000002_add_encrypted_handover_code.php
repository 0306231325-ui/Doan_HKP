<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->text('ma_ban_giao_ma_hoa')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->dropColumn('ma_ban_giao_ma_hoa');
        });
    }
};
