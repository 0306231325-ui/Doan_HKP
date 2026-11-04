<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->unsignedInteger('phien_ban');
            $table->json('du_lieu');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['cau_hoi_id', 'phien_ban']);
        });
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->foreignId('cau_hoi_phien_ban_id')->nullable()->constrained('lich_su_cau_hoi');
            $table->unique(['tin_dang_id', 'cau_hoi_phien_ban_id'], 'uq_loi_khai_tin_phien_ban');
        });
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->dropUnique('uq_loi_khai_tin_cau_hoi');
        });
        DB::transaction(function () {
            $cacNhom = DB::table('cau_hoi')->orderBy('phien_ban')->orderBy('id')->get()->groupBy('ma_cau_hoi');
            foreach ($cacNhom as $cacBan) {
                $hienTai = $cacBan->last();
                foreach ($cacBan as $ban) {
                    $anhChup = (array) $ban;
                    foreach (['lua_chon', 'cau_hinh_ap_dung'] as $cot) {
                        if (is_string($anhChup[$cot] ?? null)) {
                            $anhChup[$cot] = json_decode($anhChup[$cot], true, 512, JSON_THROW_ON_ERROR);
                        }
                    }
                    $phienBanId = DB::table('lich_su_cau_hoi')->insertGetId([
                        'cau_hoi_id' => $hienTai->id, 'phien_ban' => $ban->phien_ban,
                        'du_lieu' => json_encode($anhChup, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
                        'created_at' => $ban->created_at,
                    ]);
                    DB::table('loi_khai_tin_dang')->where('cau_hoi_id', $ban->id)->whereNull('cau_hoi_phien_ban_id')->update(['cau_hoi_id' => $hienTai->id, 'cau_hoi_phien_ban_id' => $phienBanId]);
                }
                DB::table('cau_hoi')->whereIn('id', $cacBan->pluck('id')->reject(fn ($id) => $id === $hienTai->id))->delete();
            }
        });
        if (DB::getDriverName() === 'mysql') {
            $mariaDb = str_contains(strtolower(DB::selectOne('SELECT VERSION() AS v')->v), 'mariadb');
            foreach (['chk_cau_hoi_phien_ban', 'chk_cau_hoi_lua_chon'] as $ten) {
                DB::statement('ALTER TABLE cau_hoi DROP '.($mariaDb ? 'CONSTRAINT ' : 'CHECK ').$ten);
            }
        }
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropUnique('uq_cau_hoi_phien_ban');
            $table->dropColumn(['phien_ban', 'kieu_nhap', 'lua_chon', 'nhan_nhan_lai']);
            $table->unique('ma_cau_hoi', 'uq_cau_hoi_ma');
        });
    }

    public function down(): void
    {
        $lichSu = DB::table('lich_su_cau_hoi')->orderBy('phien_ban')->get();
        $cacBan = $lichSu->map(function ($ban) {
            $duLieu = json_decode($ban->du_lieu, true, 512, JSON_THROW_ON_ERROR);
            if (! isset($duLieu['id'], $duLieu['kieu_nhap'], $duLieu['phien_ban'])) {
                throw new RuntimeException('Đã có lịch sử theo cấu trúc mới. Hãy khôi phục bản sao lưu thay vì rollback làm mất dữ liệu.');
            }

            return ['lich_su_id' => $ban->id, 'cau_hoi_id' => $ban->cau_hoi_id, 'du_lieu' => $duLieu];
        });
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropUnique('uq_cau_hoi_ma');
            $table->unsignedInteger('phien_ban')->default(1);
            $table->string('kieu_nhap')->default('van_ban');
            $table->json('lua_chon')->nullable();
            $table->string('nhan_nhan_lai', 250)->nullable();
        });
        DB::transaction(function () use ($cacBan) {
            foreach ($cacBan as $ban) {
                $duLieu = $ban['du_lieu'];
                foreach (['lua_chon', 'cau_hinh_ap_dung'] as $cot) {
                    if (is_array($duLieu[$cot] ?? null)) {
                        $duLieu[$cot] = json_encode($duLieu[$cot], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
                    }
                }
                if ($duLieu['id'] === $ban['cau_hoi_id']) {
                    $duLieu['trang_thai'] = DB::table('cau_hoi')->where('id', $duLieu['id'])->value('trang_thai');
                    DB::table('cau_hoi')->where('id', $duLieu['id'])->update($duLieu);
                } else {
                    DB::table('cau_hoi')->insert($duLieu);
                }
                DB::table('loi_khai_tin_dang')->where('cau_hoi_phien_ban_id', $ban['lich_su_id'])->update(['cau_hoi_id' => $duLieu['id']]);
            }
        });
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->unique(['tin_dang_id', 'cau_hoi_id'], 'uq_loi_khai_tin_cau_hoi');
        });
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->dropUnique('uq_loi_khai_tin_phien_ban');
            $table->dropForeign(['cau_hoi_phien_ban_id']);
            $table->dropColumn('cau_hoi_phien_ban_id');
        });
        Schema::dropIfExists('lich_su_cau_hoi');
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->unique(['ma_cau_hoi', 'phien_ban'], 'uq_cau_hoi_phien_ban');
        });
    }
};
