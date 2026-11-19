<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const RANG_BUOC = [
        'loi_khai_tin_dang' => 'chk_loi_khai_tin_mot_gia_tri',
        'tra_loi_yeu_cau' => 'chk_tra_loi_yc_mot_gia_tri',
    ];

    public function up(): void
    {
        foreach (self::RANG_BUOC as $bang => $rangBuoc) {
            $this->boRangBuoc($bang, $rangBuoc);
            // Chuyển dữ liệu cũ trước khi bỏ các cột trả lời không còn dùng.
            DB::table($bang)->whereNull('gia_tri_text')->update([
                'gia_tri_text' => DB::raw('COALESCE(CAST(gia_tri_so AS CHAR), gia_tri_lua_chon)'),
            ]);
            if ($bang === 'loi_khai_tin_dang') {
                Schema::table($bang, fn (Blueprint $table) => $table->index(['cau_hoi_id', 'tin_dang_id'], 'idx_loi_khai_loc_text'));
                Schema::table($bang, fn (Blueprint $table) => $table->dropIndex('idx_loi_khai_loc'));
            }
            Schema::table($bang, function (Blueprint $table) {
                $table->dropColumn(['gia_tri_so', 'gia_tri_lua_chon']);
            });
            DB::statement("ALTER TABLE `$bang` MODIFY gia_tri_text TEXT NOT NULL");
            DB::statement("ALTER TABLE `$bang` ADD CONSTRAINT `$rangBuoc` CHECK (CHAR_LENGTH(TRIM(gia_tri_text)) > 0)");
        }
        Schema::table('cau_hoi', fn (Blueprint $table) => $table->dropColumn('kieu_nhap'));
        DB::table('lich_su_cau_hoi')->orderBy('id')->chunkById(200, function ($cacBan) {
            foreach ($cacBan as $ban) {
                $duLieu = json_decode($ban->du_lieu, true, 512, JSON_THROW_ON_ERROR);
                unset($duLieu['kieu_nhap']);
                DB::table('lich_su_cau_hoi')->where('id', $ban->id)->update([
                    'du_lieu' => json_encode($duLieu, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('cau_hoi', fn (Blueprint $table) => $table->enum('kieu_nhap', ['van_ban', 'so'])->default('van_ban'));
        foreach (self::RANG_BUOC as $bang => $rangBuoc) {
            $this->boRangBuoc($bang, $rangBuoc);
            DB::statement("ALTER TABLE `$bang` MODIFY gia_tri_text TEXT NULL");
            Schema::table($bang, function (Blueprint $table) {
                $table->decimal('gia_tri_so', 18, 4)->nullable();
                $table->string('gia_tri_lua_chon', 100)->nullable();
            });
            if ($bang === 'loi_khai_tin_dang') {
                Schema::table($bang, fn (Blueprint $table) => $table->index(['cau_hoi_id', 'gia_tri_lua_chon', 'tin_dang_id'], 'idx_loi_khai_loc'));
                Schema::table($bang, fn (Blueprint $table) => $table->dropIndex('idx_loi_khai_loc_text'));
            }
            DB::statement("ALTER TABLE `$bang` ADD CONSTRAINT `$rangBuoc` CHECK (
                (gia_tri_text IS NOT NULL) + (gia_tri_so IS NOT NULL) + (gia_tri_lua_chon IS NOT NULL) = 1
                AND (gia_tri_text IS NULL OR CHAR_LENGTH(TRIM(gia_tri_text)) > 0)
                AND (gia_tri_lua_chon IS NULL OR CHAR_LENGTH(TRIM(gia_tri_lua_chon)) > 0)
            )");
        }
    }

    private function boRangBuoc(string $bang, string $rangBuoc): void
    {
        $mariaDb = str_contains(strtolower(DB::selectOne('SELECT VERSION() AS version')->version), 'mariadb');
        $lenh = $mariaDb ? 'DROP CONSTRAINT' : 'DROP CHECK';
        DB::statement("ALTER TABLE `$bang` $lenh `$rangBuoc`");
    }
};
