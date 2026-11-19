<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lich_su_tin_dang', function (Blueprint $table) {
            $table->text('ly_do_xoa')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('lich_su_tin_dang', function (Blueprint $table) {
            $table->dropColumn('ly_do_xoa');
        });
    }
};
