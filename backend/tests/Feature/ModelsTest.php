<?php

namespace Tests\Feature;

use App\Models\BanGiao;
use App\Models\CauHoi;
use App\Models\CuocHen;
use App\Models\HinhAnhTinDang;
use App\Models\LichSuTinDang;
use App\Models\LichSuYeuCau;
use App\Models\LoiKhaiTinDang;
use App\Models\MinhChungYeuCau;
use App\Models\NguoiDung;
use App\Models\ThongBao;
use App\Models\TraLoiYeuCau;
use App\Models\YeuCauNhanDo;
use Carbon\CarbonInterface;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ModelsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);
        DB::purge('sqlite');
    }

    public function test_mat_khau_giu_nguyen_va_khong_lo_khi_chuyen_json(): void
    {
        $nguoiDung = new NguoiDung(['mat_khau' => 'MatKhauThu@123']);
        $matKhauDaBam = $nguoiDung->getAuthPassword();

        $this->assertSame('mat_khau', $nguoiDung->getAuthPasswordName());
        $this->assertSame('MatKhauThu@123', $matKhauDaBam);
        $this->assertArrayNotHasKey('mat_khau', $nguoiDung->toArray());

        $nguoiDung->mat_khau = $matKhauDaBam;
        $this->assertSame($matKhauDaBam, $nguoiDung->getAuthPassword());
        $this->assertArrayNotHasKey('ma_ban_giao_hash', (new BanGiao([
            'ma_ban_giao_hash' => 'hash-thu',
        ]))->toArray());
    }

    public function test_du_lieu_json_ngay_va_so_duoc_chuyen_dung_kieu(): void
    {
        $cauHoi = new CauHoi([
            'lua_chon' => ['Den', 'Trang'],
            'bat_buoc' => 1,
            'cong_khai' => 0,
        ]);
        $cauHoi = $cauHoi->newFromBuilder($cauHoi->getAttributes());

        $this->assertSame(['Den', 'Trang'], $cauHoi->lua_chon);
        $this->assertTrue($cauHoi->bat_buoc);
        $this->assertFalse($cauHoi->cong_khai);
        $this->assertSame('12345678901234.5678', (new LoiKhaiTinDang([
            'gia_tri_so' => '12345678901234.5678',
        ]))->gia_tri_so);
        $this->assertSame('12.3400', (new TraLoiYeuCau(['gia_tri_so' => '12.34']))->gia_tri_so);
        $this->assertNull((new LoiKhaiTinDang)->gia_tri_so);
        $this->assertInstanceOf(CarbonInterface::class, (new CuocHen([
            'thoi_gian_hen_gap' => '2026-10-23 15:00:00',
        ]))->thoi_gian_hen_gap);

        $lichSu = new LichSuTinDang(['du_lieu_moi' => ['trang_thai' => 'da_dong']]);
        $lichSu = $lichSu->newFromBuilder($lichSu->getAttributes());
        $this->assertSame(['trang_thai' => 'da_dong'], $lichSu->du_lieu_moi);
    }

    public function test_cot_sinh_tu_dong_khong_nhan_qua_fill(): void
    {
        $yeuCau = new YeuCauNhanDo([
            'tin_dang_id' => 10,
            'tin_dang_dang_xu_ly_id' => 999,
            'tin_dang_da_duyet_id' => 999,
        ]);
        $cuocHen = new CuocHen(['yeu_cau_id' => 20, 'yeu_cau_hieu_luc_id' => 999]);

        $this->assertSame(10, $yeuCau->tin_dang_id);
        $this->assertArrayNotHasKey('tin_dang_dang_xu_ly_id', $yeuCau->getAttributes());
        $this->assertArrayNotHasKey('tin_dang_da_duyet_id', $yeuCau->getAttributes());
        $this->assertSame(20, $cuocHen->yeu_cau_id);
        $this->assertArrayNotHasKey('yeu_cau_hieu_luc_id', $cuocHen->getAttributes());
    }

    public function test_luu_va_sua_bang_chi_co_created_at(): void
    {
        foreach ([
            [HinhAnhTinDang::class, 'duong_dan', '/anh.jpg'],
            [MinhChungYeuCau::class, 'duong_dan', '/minh-chung.jpg'],
            [LichSuTinDang::class, 'hanh_dong', 'tao_tin'],
            [LichSuYeuCau::class, 'hanh_dong', 'tao_yeu_cau'],
            [ThongBao::class, 'noi_dung', 'Thong bao thu'],
        ] as [$lopModel, $cot, $giaTri]) {
            Schema::create((new $lopModel)->getTable(), function (Blueprint $table) use ($cot) {
                $table->id();
                $table->string($cot);
                $table->dateTime('created_at');
            });

            $model = $lopModel::create([$cot => $giaTri]);
            $this->assertInstanceOf(CarbonInterface::class, $model->fresh()->created_at);

            $model->update([$cot => 'gia-tri-moi']);
            $this->assertSame('gia-tri-moi', $model->fresh()->getAttribute($cot));
            $this->assertArrayNotHasKey('updated_at', $model->fresh()->getAttributes());
        }
    }

    public function test_quan_he_hai_chieu_va_xoa_mem(): void
    {
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->string('ho_ten');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('tieu_de');
            $table->softDeletes();
            $table->timestamps();
        });

        $nguoiDung = NguoiDung::create(['ho_ten' => 'Nguoi thu']);
        $tinDang = $nguoiDung->tinDang()->create(['tieu_de' => 'Tin thu']);

        $this->assertTrue($tinDang->nguoiDung->is($nguoiDung));
        $this->assertTrue($nguoiDung->load('tinDang')->tinDang->first()->is($tinDang));

        $tinDang->delete();
        $this->assertSame(0, $nguoiDung->tinDang()->count());
        $this->assertSame(1, $nguoiDung->tinDang()->withTrashed()->count());
        $tinDang->restore();
        $this->assertSame(1, $nguoiDung->tinDang()->count());

        $nguoiDung->delete();
        $this->assertNull($tinDang->fresh()->nguoiDung);
        $this->assertTrue($tinDang->nguoiDung()->withTrashed()->first()->is($nguoiDung));
        $nguoiDung->restore();
        $this->assertTrue($tinDang->fresh()->nguoiDung->is($nguoiDung));
    }
}
