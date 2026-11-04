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
            $table->string('nhan_nhan_lai', 250)->nullable();
            $table->json('cau_hinh_ap_dung')->nullable();
        });
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE cau_hoi MODIFY kieu_nhap ENUM('van_ban', 'doan_van', 'so', 'chon_mot') NOT NULL DEFAULT 'van_ban'");
        }
    }

    public function down(): void
    {
        DB::table('cau_hoi')->where('kieu_nhap', 'doan_van')->update(['kieu_nhap' => 'van_ban']);
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE cau_hoi MODIFY kieu_nhap ENUM('van_ban', 'so', 'chon_mot') NOT NULL DEFAULT 'van_ban'");
        }
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropColumn(['nhan_nhan_lai', 'cau_hinh_ap_dung']);
        });
    }
};
