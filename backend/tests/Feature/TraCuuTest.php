<?php

namespace Tests\Feature;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\HinhAnhTinDang;
use App\Models\NguoiDung;
use App\Models\TinDang;
use Database\Seeders\CauHoiTinMauSeeder;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TraCuuTest extends TestCase
{
    public function test_tin_bao_mat_hien_lien_he_ngay_ca_khi_chua_dang_nhap(): void
    {
        $tin = $this->taoTin(['loai_tin' => 'bao_mat', 'thong_tin_lien_he' => '0901234567', 'email_lien_he' => 'mat@example.com']);
        $this->getJson('/api/tra-cuu/'.$tin->id)->assertOk()
            ->assertJsonPath('data.coTheLienHe', true)
            ->assertJsonPath('data.contactPhone', '0901234567')
            ->assertJsonPath('data.contactEmail', 'mat@example.com');
    }

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
            $table->unique('email');
            foreach (['ma_so', 'vai_tro'] as $cot) {
                $table->string($cot)->nullable();
            }
            $table->softDeletes();
            $table->timestamps();
        });
        foreach (['danh_muc_do_vat' => 'ten_danh_muc', 'dia_diem' => 'ten_dia_diem'] as $tenBang => $cotTen) {
            Schema::create($tenBang, function (Blueprint $table) use ($cotTen) {
                $table->id();
                $table->string($cotTen)->unique();
                $table->text('mo_ta')->nullable();
                if ($cotTen === 'ten_danh_muc') {
                    $table->unsignedInteger('thu_tu')->nullable();
                }
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
            $table->boolean('co_gio_xay_ra')->nullable();
            $table->string('dia_diem_chi_tiet')->nullable();
            $table->string('thong_tin_lien_he')->nullable();
            $table->string('email_lien_he')->nullable();
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
        Schema::create('lich_su_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tin_dang_id');
            $table->unsignedBigInteger('nguoi_thuc_hien_id');
            $table->string('hanh_dong');
            $table->string('trang_thai_moi');
            $table->text('noi_dung');
            $table->dateTime('created_at')->nullable();
        });
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->constrained('danh_muc_do_vat');
            $table->string('noi_dung');
            $table->string('kieu_nhap');
            $table->unsignedInteger('thu_tu');
            $table->boolean('trang_thai');
            $table->timestamps();
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->unsignedInteger('phien_ban');
            $table->json('du_lieu');
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tin_dang_id')->constrained('tin_dang');
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->foreignId('cau_hoi_phien_ban_id')->constrained('lich_su_cau_hoi');
            $table->text('gia_tri_text')->nullable();
            $table->decimal('gia_tri_so', 18, 4)->nullable();
            $table->string('gia_tri_lua_chon')->nullable();
            $table->timestamps();
        });
        Schema::create('yeu_cau_nhan_do', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tin_dang_id')->constrained('tin_dang');
            $table->foreignId('nguoi_yeu_cau_id')->constrained('nguoi_dung');
            $table->timestamps();
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
        $this->taoTin(['trang_thai' => 'da_hoan_tat', 'loai_tin' => 'bao_mat']);
        $this->taoTin(['trang_thai' => 'da_hoan_tat', 'loai_tin' => 'nhat_duoc']);
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
        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('tin_dang', 5);
        $tin = TinDang::where('slug', 'mau-tra-cuu-laptop-asus')->firstOrFail();
        $urlAnh = '/api/tin-dang/anh/hanghoa01.jpg';
        $tinVeXe = TinDang::where('slug', 'mau-tra-cuu-the-ve-xe')->firstOrFail();
        $this->getJson('/api/tra-cuu/'.$tinVeXe->id)->assertJsonPath('data.images', [$urlAnh, $urlAnh]);
        $this->getJson('/api/tra-cuu/'.$tin->id)->assertJsonPath('data.imageUrl', $urlAnh);
        $this->get($urlAnh)->assertOk()->assertHeader('Content-Type', 'image/jpeg');
        $tin->hinhAnh()->update(['duong_dan' => '/tin/tin-mat/anhtin1.webp']);
        $this->getJson('/api/tra-cuu/'.$tin->id)->assertJsonPath('data.images.0', '/api/tin-dang/anh/anhtin1.webp');
        $tin->hinhAnh()->create(['nguoi_tai_len_id' => $tin->nguoi_dung_id, 'duong_dan' => '/api/tin-dang/anh/anhtin1_a.jpg', 'thu_tu' => 1]);
        $tin->update(['tieu_de' => 'Da sua boi nguoi dung']);
        TinDang::where('slug', 'mau-tra-cuu-vi-da-den')->firstOrFail()->delete();
        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('nguoi_dung', 8);
        $this->assertSame(1, NguoiDung::withTrashed()->where('vai_tro', 'quan_tri')->count());
        $this->assertDatabaseHas('nguoi_dung', [
            'ho_ten' => 'Vũ Thiên Phú',
            'email' => 'vul53290@caothang.edu.vn',
            'vai_tro' => 'quan_tri',
            'deleted_at' => null,
        ]);
        $this->assertDatabaseCount('tin_dang', 5);
        $this->assertDatabaseCount('hinh_anh_tin_dang', 8);
        $this->assertSame(8, HinhAnhTinDang::where('duong_dan', $urlAnh)->count());
        $this->getJson('/api/tra-cuu/'.$tin->id)->assertJsonPath('data.images', [$urlAnh, $urlAnh, $urlAnh]);
        $this->assertDatabaseCount('lich_su_tin_dang', 5);
        $this->assertDatabaseCount('cau_hoi', 15);
        $this->assertDatabaseCount('lich_su_cau_hoi', 15);
        $this->assertDatabaseCount('loi_khai_tin_dang', 6);
        $this->assertDatabaseCount('danh_muc_do_vat', 7);
        $this->assertDatabaseHas('danh_muc_do_vat', [
            'ten_danh_muc' => 'Khác',
            'mo_ta' => 'Dành cho những đồ vật không phù hợp với các danh mục trên.',
            'trang_thai' => true,
        ]);
        $this->assertDatabaseCount('dia_diem', 6);
        $this->assertSame('Da sua boi nguoi dung', $tin->fresh()->tieu_de);
        $this->assertSame(4, TinDang::count());
        $this->assertSame($this->nguoiDung->mat_khau, $this->nguoiDung->fresh()->mat_khau);

        $this->actingAs($this->nguoiDung, 'web');
        foreach (DanhMucDoVat::whereKeyNot($this->danhMuc->id)->get() as $muc) {
            $this->getJson('/api/dang-tin/cau-hoi?danhMucId='.$muc->id)->assertOk()
                ->assertJsonCount($muc->ten_danh_muc === 'Đồ điện tử' ? 5 : 2, 'data');
        }
    }

    public function test_seed_dong_bo_loi_khai_tin_mau_chua_co_yeu_cau(): void
    {
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Đồ dùng học tập', 'trang_thai' => true]);
        $mucVi = DanhMucDoVat::create(['ten_danh_muc' => 'Ví và túi xách', 'trang_thai' => true]);
        $mucGiay = DanhMucDoVat::create(['ten_danh_muc' => 'Giấy tờ', 'trang_thai' => true]);
        $tinThuong = $this->taoTin(['slug' => 'mau-tra-cuu-tin-khac', 'danh_muc_id' => $muc->id]);
        $tinMau = $this->taoTin(['slug' => 'mau-tra-cuu-may-tinh-flexio', 'danh_muc_id' => $muc->id]);
        $tinCoYeuCau = $this->taoTin(['slug' => 'mau-tra-cuu-vi-da-den', 'danh_muc_id' => $mucVi->id]);
        $tinDaXoa = $this->taoTin(['slug' => 'mau-tra-cuu-the-can-cuoc', 'danh_muc_id' => $mucGiay->id]);
        $tinDaXoa->delete();
        $nhanCu = 'Nắp trượt của máy tính có dấu hiệu nhận biết gì?';
        $cauCu = $muc->cauHoi()->create(['noi_dung' => $nhanCu, 'kieu_nhap' => 'van_ban', 'thu_tu' => 1, 'trang_thai' => false]);
        $banCu = $cauCu->lichSu()->create(['phien_ban' => 1, 'du_lieu' => $cauCu->attributesToArray()]);
        $tinThuong->loiKhai()->create(['cau_hoi_id' => $cauCu->id, 'cau_hoi_phien_ban_id' => $banCu->id, 'gia_tri_text' => 'Có vết xước']);
        $loiKhaiMau = $tinMau->loiKhai()->create(['cau_hoi_id' => $cauCu->id, 'cau_hoi_phien_ban_id' => $banCu->id, 'gia_tri_text' => 'Nắp có vết xước chéo ở góc dưới.']);
        $cauVi = $mucVi->cauHoi()->create(['noi_dung' => 'Lớp lót bên trong ví màu gì?', 'kieu_nhap' => 'van_ban', 'thu_tu' => 1, 'trang_thai' => false]);
        $banVi = $cauVi->lichSu()->create(['phien_ban' => 1, 'du_lieu' => $cauVi->attributesToArray()]);
        $tinCoYeuCau->loiKhai()->create(['cau_hoi_id' => $cauVi->id, 'cau_hoi_phien_ban_id' => $banVi->id, 'gia_tri_text' => 'Màu nâu.']);
        $tinCoYeuCau->yeuCauNhanDo()->create(['nguoi_yeu_cau_id' => $this->nguoiDung->id]);

        $this->seed(CauHoiTinMauSeeder::class);

        $cacLoiKhai = $tinMau->loiKhai()->with('phienBanCauHoi', 'cauHoi')->orderBy('id')->get();
        $this->assertCount(2, $cacLoiKhai);
        $this->assertSame($loiKhaiMau->id, $cacLoiKhai[0]->id);
        $this->assertSame($cauCu->id, $cacLoiKhai[0]->cau_hoi_id);
        $this->assertSame(2, $cacLoiKhai[0]->phienBanCauHoi->phien_ban);
        $this->assertSame('Đồ dùng có dấu hiệu riêng nào để nhận biết?', $cacLoiKhai[0]->phienBanCauHoi->du_lieu['noi_dung']);
        $this->assertSame('Có một vết xước chéo ở góc dưới của nắp.', $cacLoiKhai[0]->gia_tri_text);
        $this->assertSame('so', $cacLoiKhai[1]->phienBanCauHoi->du_lieu['kieu_nhap']);
        $this->assertSame('1.0000', $cacLoiKhai[1]->gia_tri_so);
        $this->assertTrue($cacLoiKhai[0]->cauHoi->trang_thai);
        $this->assertSame($nhanCu, $banCu->fresh()->du_lieu['noi_dung']);
        $this->assertSame([$banCu->id], $tinThuong->loiKhai()->pluck('cau_hoi_phien_ban_id')->all());
        $this->assertSame([$banVi->id], $tinCoYeuCau->loiKhai()->pluck('cau_hoi_phien_ban_id')->all());
        $this->assertSame('Màu nâu.', $tinCoYeuCau->loiKhai()->firstOrFail()->gia_tri_text);
        $this->assertFalse($tinDaXoa->loiKhai()->exists());
        $this->seed(CauHoiTinMauSeeder::class);
        $this->assertDatabaseCount('cau_hoi', 6);
        $this->assertDatabaseCount('lich_su_cau_hoi', 8);
        $this->assertDatabaseCount('loi_khai_tin_dang', 4);
    }
}
