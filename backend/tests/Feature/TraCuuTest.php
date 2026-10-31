<?php

namespace Tests\Feature;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\HinhAnhTinDang;
use App\Models\NguoiDung;
use App\Models\TinDang;
use Database\Seeders\DuLieuTraCuuSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TraCuuTest extends TestCase
{
    private NguoiDung $nguoiDung;

    private DanhMucDoVat $danhMuc;

    private DiaDiem $diaDiem;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        DB::connection()->getPdo()->sqliteCreateFunction('REGEXP_REPLACE', fn ($text, $pattern, $replacement) => preg_replace('/'.$pattern.'/u', $replacement, $text), 3);
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            foreach (['ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'trang_thai'] as $cot) {
                $table->string($cot);
            }
            $table->softDeletes();
            $table->timestamps();
        });
        foreach (['danh_muc_do_vat' => 'ten_danh_muc', 'dia_diem' => 'ten_dia_diem'] as $tenBang => $cotTen) {
            Schema::create($tenBang, function (Blueprint $table) use ($cotTen) {
                $table->id();
                $table->string($cotTen)->unique();
                $table->boolean('trang_thai')->default(true);
                $table->timestamps();
            });
        }
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->unsignedBigInteger('danh_muc_id');
            $table->unsignedBigInteger('dia_diem_id')->nullable();
            $table->string('loai_tin');
            $table->string('tieu_de');
            $table->string('slug')->unique();
            $table->text('mo_ta');
            $table->dateTime('thoi_gian_xay_ra')->nullable();
            $table->string('dia_diem_chi_tiet')->nullable();
            $table->string('thong_tin_lien_he')->nullable();
            $table->string('trang_thai')->default('dang_mo');
            $table->string('trang_thai_kiem_duyet')->default('hien_thi');
            $table->text('ly_do_an')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('hinh_anh_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tin_dang_id');
            $table->unsignedBigInteger('nguoi_tai_len_id');
            $table->string('duong_dan');
            $table->string('pham_vi')->default('cong_khai');
            $table->unsignedInteger('thu_tu')->default(0);
            $table->dateTime('created_at')->nullable();
        });
        $this->nguoiDung = NguoiDung::create(['ho_ten' => 'Nguoi dang', 'email' => 'thu@example.test', 'mat_khau' => 'hash-khong-cong-khai', 'so_dien_thoai' => 'SECRET-PHONE', 'trang_thai' => 'hoat_dong']);
        $this->danhMuc = DanhMucDoVat::create(['ten_danh_muc' => 'Thiet bi', 'trang_thai' => true]);
        $this->diaDiem = DiaDiem::create(['ten_dia_diem' => 'Thu vien', 'trang_thai' => true]);
    }

    private function taoTin(array $duLieu = []): TinDang
    {
        return TinDang::create(array_merge([
            'nguoi_dung_id' => $this->nguoiDung->id, 'danh_muc_id' => $this->danhMuc->id,
            'dia_diem_id' => $this->diaDiem->id, 'loai_tin' => 'nhat_duoc',
            'tieu_de' => 'Tai nghe trang', 'slug' => 'tin-'.TinDang::withTrashed()->count(),
            'mo_ta' => 'Hop sac tai nghe', 'thoi_gian_xay_ra' => '2026-10-30 09:00:00',
            'dia_diem_chi_tiet' => 'Ban doc tang 2', 'trang_thai' => 'dang_mo', 'trang_thai_kiem_duyet' => 'hien_thi',
        ], $duLieu));
    }

    public function test_bo_loc_doc_db_va_chi_hien_muc_dang_hoat_dong(): void
    {
        DanhMucDoVat::create(['ten_danh_muc' => 'Da ngung', 'trang_thai' => false]);
        DiaDiem::create(['ten_dia_diem' => 'Da dong', 'trang_thai' => false]);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonCount(1, 'danhMuc')->assertJsonCount(1, 'diaDiem')
            ->assertJsonPath('danhMuc.0.id', (string) $this->danhMuc->id)->assertJsonPath('diaDiem.0.name', 'Thu vien');
    }

    public function test_khach_xem_duoc_tin_cong_khai_khong_lo_du_lieu_rieng(): void
    {
        $tin = $this->taoTin();
        $this->taoTin(['trang_thai_kiem_duyet' => 'da_an', 'ly_do_an' => 'PRIVATE-REASON']);
        $this->taoTin()->delete();
        HinhAnhTinDang::create(['tin_dang_id' => $tin->id, 'nguoi_tai_len_id' => $this->nguoiDung->id, 'duong_dan' => '/private.png', 'pham_vi' => 'rieng_tu', 'thu_tu' => 0]);
        HinhAnhTinDang::create(['tin_dang_id' => $tin->id, 'nguoi_tai_len_id' => $this->nguoiDung->id, 'duong_dan' => '/public.png', 'pham_vi' => 'cong_khai', 'thu_tu' => 1]);
        $response = $this->getJson('/api/tra-cuu')->assertOk()->assertJsonPath('meta.tongTin', 1)->assertJsonPath('data.0.imageUrl', '/public.png');
        foreach (['mat_khau', 'hash-khong-cong-khai', 'SECRET-PHONE', 'PRIVATE-REASON', '/private.png'] as $biMat) {
            $this->assertStringNotContainsString($biMat, $response->getContent());
        }
    }

    public function test_tim_tu_khoa_ket_hop_loai_danh_muc_dia_diem_va_khoang_ngay(): void
    {
        $tin = $this->taoTin();
        $this->taoTin(['loai_tin' => 'bao_mat']);
        $this->taoTin(['thoi_gian_xay_ra' => '2026-10-29 09:00:00']);
        $thamSo = http_build_query(['tuKhoa' => 'TAI NGHE TANG 2', 'loaiTin' => 'found', 'danhMuc' => $this->danhMuc->id, 'diaDiem' => $this->diaDiem->id, 'tuNgay' => '2026-10-30', 'denNgay' => '2026-10-30']);
        $this->getJson('/api/tra-cuu?'.$thamSo)->assertOk()->assertJsonPath('meta.tongTin', 1)->assertJsonPath('data.0.id', $tin->id);
        $this->getJson('/api/tra-cuu?tuKhoa=THU+VIEN')->assertOk()->assertJsonPath('meta.tongTin', 3);
        $this->getJson('/api/tra-cuu?tuKhoa=khongtontai')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_tim_ma_tin_va_ky_tu_dac_biet_khong_tro_thanh_wildcard(): void
    {
        $tin = $this->taoTin();
        $ma = 'TIN-'.str_pad((string) $tin->id, 6, '0', STR_PAD_LEFT);
        $this->getJson('/api/tra-cuu?tuKhoa='.$ma)->assertOk()->assertJsonPath('meta.tongTin', 1)->assertJsonPath('data.0.referenceCode', $ma);
        $this->getJson('/api/tra-cuu?tuKhoa=%25')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_tu_khoa_khong_khop_nham_mot_phan_cua_tu_khac(): void
    {
        $mucVi = DanhMucDoVat::create(['ten_danh_muc' => 'Vi va giay to', 'trang_thai' => true]);
        $this->taoTin(['danh_muc_id' => $mucVi->id, 'tieu_de' => 'The sinh vien', 'mo_ta' => 'Thong tin nhan dang can doi chieu']);
        $vi = $this->taoTin(['danh_muc_id' => $mucVi->id, 'tieu_de' => 'Vi da mau nau', 'mo_ta' => 'Vi da nho']);
        $this->getJson('/api/tra-cuu?tuKhoa=vi+da')->assertOk()->assertJsonPath('meta.tongTin', 1)->assertJsonPath('data.0.id', $vi->id);
    }

    public function test_phan_trang_sap_xep_va_tu_dieu_chinh_trang_vuot_bien(): void
    {
        for ($i = 0; $i < 8; $i++) {
            $this->taoTin(['thoi_gian_xay_ra' => '2026-10-'.(22 + $i).' 12:00:00']);
        }
        $this->getJson('/api/tra-cuu')->assertOk()->assertJsonCount(6, 'data')->assertJsonPath('meta.tongTrang', 2)->assertJsonPath('data.0.id', 8);
        $this->getJson('/api/tra-cuu?trang=99')->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('meta.trangHienTai', 2)->assertJsonPath('meta.tuViTri', 7)->assertJsonPath('meta.denViTri', 8);
        $this->getJson('/api/tra-cuu?sapXep=cu_nhat')->assertOk()->assertJsonPath('data.0.id', 1);
    }

    public function test_tu_choi_ngay_sai_khoang_ngay_dao_va_bo_loc_khong_hop_le(): void
    {
        $this->getJson('/api/tra-cuu?tuNgay=2026-02-30')->assertUnprocessable()->assertJsonValidationErrors('tuNgay');
        $this->getJson('/api/tra-cuu?tuNgay=2026-10-30&denNgay=2026-10-29')->assertUnprocessable()->assertJsonValidationErrors('denNgay');
        $this->getJson('/api/tra-cuu?loaiTin=sai&danhMuc=abc&trang=-1')->assertUnprocessable()->assertJsonValidationErrors(['loaiTin', 'danhMuc', 'trang']);
    }

    public function test_seed_mau_chay_lai_khong_trung_khong_ghi_de_va_khong_hoi_sinh_tin_da_xoa(): void
    {
        $this->seed(DuLieuTraCuuSeeder::class);
        $this->assertDatabaseCount('tin_dang', 8);
        $tin = TinDang::where('slug', 'mau-tra-cuu-dien-thoai-den')->firstOrFail();
        $tin->update(['tieu_de' => 'Da sua boi nguoi dung']);
        TinDang::where('slug', 'mau-tra-cuu-vi-da-nau')->firstOrFail()->delete();
        $this->seed(DuLieuTraCuuSeeder::class);
        $this->assertDatabaseCount('tin_dang', 8);
        $this->assertDatabaseCount('danh_muc_do_vat', 6);
        $this->assertDatabaseCount('dia_diem', 6);
        $this->assertSame('Da sua boi nguoi dung', $tin->fresh()->tieu_de);
        $this->assertSame(7, TinDang::count());
        $this->assertSame('hash-khong-cong-khai', $this->nguoiDung->fresh()->mat_khau);
    }
}
