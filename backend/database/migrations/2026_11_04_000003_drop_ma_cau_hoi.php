<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropUnique('uq_cau_hoi_ma');
            $table->dropColumn('ma_cau_hoi');
        });
    }

    public function down(): void
    {
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->string('ma_cau_hoi', 64)->nullable();
        });
        DB::table('cau_hoi')->orderBy('id')->chunkById(200, function ($cacCau) {
            foreach ($cacCau as $cau) {
                DB::table('cau_hoi')->where('id', $cau->id)->update(['ma_cau_hoi' => 'cau-hoi-'.$cau->id]);
            }
        });
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->string('ma_cau_hoi', 64)->nullable(false)->change();
            $table->unique('ma_cau_hoi', 'uq_cau_hoi_ma');
        });
    }
};
