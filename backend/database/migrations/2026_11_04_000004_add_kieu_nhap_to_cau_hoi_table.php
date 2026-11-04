<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->enum('kieu_nhap', ['van_ban', 'so'])->default('van_ban');
        });
    }

    public function down(): void
    {
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropColumn('kieu_nhap');
        });
    }
};
