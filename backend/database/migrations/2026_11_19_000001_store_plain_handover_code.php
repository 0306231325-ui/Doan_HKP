<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->char('ma_ban_giao', 6)->nullable();
        });

        DB::table('ban_giao')->whereNotNull('ma_ban_giao_hash')->orderBy('id')
            ->eachById(function ($banGiao) {
                DB::table('ban_giao')->where('id', $banGiao->id)->update([
                    'ma_ban_giao' => sprintf('%06d', random_int(0, 999999)),
                ]);
            });

        Schema::table('ban_giao', function (Blueprint $table) {
            $table->dropUnique(['ma_ban_giao_hash']);
            $table->dropColumn('ma_ban_giao_hash');
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Cần khôi phục bản sao lưu để quay lại cách lưu mã bàn giao cũ.');
    }
};
