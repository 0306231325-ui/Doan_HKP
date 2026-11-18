<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const BANG_ANH = ['hinh_anh_tin_dang', 'minh_chung_yeu_cau'];

    public function up(): void
    {
        foreach (self::BANG_ANH as $tenBang) {
            if (Schema::hasColumn($tenBang, 'mo_ta')) {
                Schema::table($tenBang, function (Blueprint $table) {
                    $table->dropColumn('mo_ta');
                });
            }
        }
    }

    public function down(): void
    {
        foreach (self::BANG_ANH as $tenBang) {
            if (! Schema::hasColumn($tenBang, 'mo_ta')) {
                Schema::table($tenBang, function (Blueprint $table) {
                    $table->string('mo_ta')->nullable()->after('duong_dan');
                });
            }
        }
    }
};
