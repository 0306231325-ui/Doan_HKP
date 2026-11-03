<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('danh_muc_do_vat', function (Blueprint $table) {
            $table->dropColumn('bieu_tuong');
        });
    }

    public function down(): void
    {
        Schema::table('danh_muc_do_vat', function (Blueprint $table) {
            $table->string('bieu_tuong', 50)->nullable()->after('ten_danh_muc');
        });
    }
};
