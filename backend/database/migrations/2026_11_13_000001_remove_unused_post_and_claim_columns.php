<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tin_dang', function (Blueprint $table) {
            $table->dropUnique('tin_dang_ma_gui_unique');
            $table->dropColumn('ma_gui');
        });
        Schema::table('yeu_cau_nhan_do', function (Blueprint $table) {
            $table->dropForeign('fk_yeu_cau_dia_diem_mat');
            $table->dropColumn(['thoi_gian_mat', 'dia_diem_mat_id', 'dia_diem_mat_chi_tiet']);
        });
        Schema::table('tra_loi_yeu_cau', function (Blueprint $table) {
            $table->dropColumn('nhan_xet_admin');
        });
        Schema::table('lich_su_yeu_cau', function (Blueprint $table) {
            $table->dropColumn(['du_lieu_cu', 'du_lieu_moi']);
        });
    }

    public function down(): void
    {
        Schema::table('lich_su_yeu_cau', function (Blueprint $table) {
            $table->json('du_lieu_cu')->nullable();
            $table->json('du_lieu_moi')->nullable();
        });
        Schema::table('tra_loi_yeu_cau', function (Blueprint $table) {
            $table->text('nhan_xet_admin')->nullable();
        });
        Schema::table('yeu_cau_nhan_do', function (Blueprint $table) {
            $table->dateTime('thoi_gian_mat')->nullable();
            $table->unsignedBigInteger('dia_diem_mat_id')->nullable();
            $table->string('dia_diem_mat_chi_tiet')->nullable();
            $table->foreign('dia_diem_mat_id', 'fk_yeu_cau_dia_diem_mat')->references('id')->on('dia_diem');
        });
        Schema::table('tin_dang', function (Blueprint $table) {
            $table->char('ma_gui', 36)->nullable()->unique('tin_dang_ma_gui_unique');
        });
    }
};
