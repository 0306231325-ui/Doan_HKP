<?php

namespace Tests\Feature;

use App\Models\CauHoi;
use App\Models\DanhMucDoVat;
use App\Models\HinhAnhTinDang;
use App\Models\NguoiDung;
use App\Models\TinDang;
use App\Models\YeuCauNhanDo;
use App\Services\CauTraLoiTinDang;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Tests\TestCase;

class DangTinTest extends TestCase
{
    private NguoiDung $chuTin;

    private NguoiDung $nguoiNhan;

    private DanhMucDoVat $danhMuc;

    private CauHoi $rieng;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Storage::fake('local');
        Storage::fake('public');
        Schema::create('nguoi_dung', function (Blueprint $t) {
            $t->id();
            foreach (['ho_ten', 'email', 'mat_khau', 'vai_tro', 'trang_thai'] as $cot) {
                $t->string($cot);
            }
            $t->softDeletes();
            $t->timestamps();
        });
        foreach (['danh_muc_do_vat' => 'ten_danh_muc', 'dia_diem' => 'ten_dia_diem'] as $bang => $ten) {
            Schema::create($bang, function (Blueprint $t) use ($ten) {
                $t->id();
                $t->string($ten);
                $t->boolean('trang_thai')->default(true);
                $t->timestamps();
            });
        }
        Schema::create('cau_hoi', function (Blueprint $t) {
            $t->id();
            $t->foreignId('danh_muc_id')->nullable()->constrained('danh_muc_do_vat');
            $t->string('noi_dung');
            $t->string('kieu_nhap')->default('van_ban');
            $t->integer('thu_tu')->default(1);
            $t->boolean('trang_thai')->default(true);
            $t->timestamps();
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $t) {
            $t->id();
            $t->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $t->integer('phien_ban');
            $t->json('du_lieu');
            $t->timestamp('created_at')->nullable();
        });
        Schema::create('tin_dang', function (Blueprint $t) {
            $t->id();
            $t->foreignId('nguoi_dung_id')->constrained('nguoi_dung');
            $t->foreignId('danh_muc_id')->constrained('danh_muc_do_vat');
            $t->foreignId('dia_diem_id')->nullable()->constrained('dia_diem');
            $t->string('loai_tin');
            $t->string('tieu_de');
            $t->string('slug')->unique();
            $t->text('mo_ta');
            $t->dateTime('thoi_gian_xay_ra');
            $t->boolean('co_gio_xay_ra')->nullable();
            $t->string('dia_diem_chi_tiet');
            $t->string('thong_tin_lien_he')->nullable();
            $t->string('email_lien_he', 254)->nullable();
            $t->uuid('ma_gui')->nullable()->unique();
            $t->string('trang_thai')->default('dang_mo');
            $t->string('trang_thai_kiem_duyet')->default('hien_thi');
            $t->softDeletes();
            $t->timestamps();
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $t) {
            $t->id();
            $t->foreignId('tin_dang_id')->constrained('tin_dang');
            $t->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $t->foreignId('cau_hoi_phien_ban_id')->constrained('lich_su_cau_hoi');
            $t->text('gia_tri_text')->nullable();
            $t->decimal('gia_tri_so', 18, 4)->nullable();
            $t->string('gia_tri_lua_chon')->nullable();
            $t->timestamps();
        });
        Schema::create('hinh_anh_tin_dang', function (Blueprint $t) {
            $t->id();
            $t->foreignId('tin_dang_id')->constrained('tin_dang');
            $t->foreignId('nguoi_tai_len_id')->constrained('nguoi_dung');
            $t->string('duong_dan');
            $t->string('pham_vi');
            $t->integer('thu_tu');
            $t->timestamp('created_at')->nullable();
        });
        Schema::create('yeu_cau_nhan_do', function (Blueprint $t) {
            $t->id();
            $t->foreignId('tin_dang_id')->constrained('tin_dang');
            $t->foreignId('nguoi_yeu_cau_id')->constrained('nguoi_dung');
            $t->text('loi_nhan')->nullable();
            $t->string('trang_thai');
            $t->timestamps();
        });
        Schema::create('tra_loi_yeu_cau', function (Blueprint $t) {
            $t->id();
            $t->foreignId('tin_dang_id')->constrained('tin_dang');
            $t->foreignId('yeu_cau_id')->constrained('yeu_cau_nhan_do');
            $t->foreignId('loi_khai_tin_dang_id')->constrained('loi_khai_tin_dang');
            $t->text('gia_tri_text')->nullable();
            $t->decimal('gia_tri_so', 18, 4)->nullable();
            $t->timestamps();
        });
        foreach (['lich_su_tin_dang' => 'tin_dang_id', 'lich_su_yeu_cau' => 'yeu_cau_id'] as $bang => $cot) {
            Schema::create($bang, function (Blueprint $t) use ($cot) {
                $t->id();
                $t->unsignedBigInteger($cot);
                $t->unsignedBigInteger('nguoi_thuc_hien_id');
                $t->string('hanh_dong');
                $t->string('trang_thai_moi');
                $t->text('noi_dung')->nullable();
                $t->timestamp('created_at')->nullable();
            });
        }
        $this->chuTin = $this->taiKhoan();
        $this->nguoiNhan = $this->taiKhoan();
        $this->danhMuc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử', 'trang_thai' => true]);
        $this->cauHoi(null, 'Màu sắc công khai?');
        $this->rieng = $this->cauHoi($this->danhMuc->id, 'Dấu hiệu bí mật?');
    }

    private function taiKhoan(string $vaiTro = 'nguoi_dung'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Người thử', 'email' => Str::uuid().'@example.test', 'mat_khau' => 'khong-doi-mat-khau', 'vai_tro' => $vaiTro, 'trang_thai' => 'hoat_dong']);
    }

    private function cauHoi(?int $id, string $nhan, string $kieu = 'van_ban'): CauHoi
    {
        $cau = CauHoi::create(['danh_muc_id' => $id, 'noi_dung' => $nhan, 'kieu_nhap' => $kieu, 'thu_tu' => 1, 'trang_thai' => true]);
        $cau->lichSu()->create(['phien_ban' => 1, 'du_lieu' => $cau->attributesToArray()]);

        return $cau;
    }

    private function mau(): array
    {
        $this->actingAs($this->chuTin);
        $cacCau = $this->getJson('/api/dang-tin/cau-hoi?danhMucId='.$this->danhMuc->id)->assertOk()->json('data');

        return [
            'maGui' => (string) Str::uuid(), 'loaiTin' => 'found', 'danhMucId' => $this->danhMuc->id,
            'tieuDe' => 'Nhặt được tai nghe', 'moTa' => 'Mô tả công khai', 'ngayXayRa' => '2026-01-01',
            'diaDiemChiTiet' => 'Thư viện tầng 2', 'soDienThoai' => '0901234567', 'email' => 'lienhe@gmail.com',
            'cauTraLoi' => array_map(fn ($cau) => ['id' => $cau['id'], 'phienBanId' => $cau['phienBanId'], 'giaTri' => 'SECRET-ANSWER'], $cacCau),
        ];
    }

    public function test_dang_tin_luu_db_hien_ngay_khong_lo_bi_mat_va_khong_trung(): void
    {
        $mau = $this->mau();
        $khac = DanhMucDoVat::create(['ten_danh_muc' => 'Giấy tờ']);
        $this->cauHoi($khac->id, 'Câu của danh mục khác?');
        $this->cauHoi($this->danhMuc->id, 'Câu đã ẩn?')->update(['trang_thai' => false]);
        $this->getJson('/api/dang-tin/cau-hoi')->assertUnprocessable()->assertJsonValidationErrors('danhMucId');
        $this->getJson('/api/dang-tin/cau-hoi?danhMucId='.$this->danhMuc->id)->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', (string) $this->rieng->id);
        $mau['nguoi_dung_id'] = $this->nguoiNhan->id;
        $mau['trang_thai_kiem_duyet'] = 'da_an';
        $id = $this->postJson('/api/tin-dang', $mau)->assertCreated()->json('data.id');
        $this->assertDatabaseHas('tin_dang', ['id' => $id, 'nguoi_dung_id' => $this->chuTin->id, 'email_lien_he' => 'lienhe@gmail.com', 'trang_thai_kiem_duyet' => 'hien_thi']);
        $this->getJson('/api/tra-cuu')->assertOk()->assertJsonPath('data.0.id', $id)
            ->assertJsonPath('data.0.contactPhone', '09012****')->assertJsonPath('data.0.contactEmail', 'li****@****');
        $response = $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonMissingPath('data.publicAnswers')
            ->assertJsonPath('data.contactPhone', '09012****')->assertJsonPath('data.contactEmail', 'li****@****')
            ->assertJsonPath('data.gioXayRa', null);
        foreach (['SECRET-ANSWER', '0901234567', 'lienhe@gmail.com', 'Dấu hiệu bí mật?', 'khong-doi-mat-khau'] as $biMat) {
            $this->assertStringNotContainsString($biMat, $response->getContent());
        }
        $this->postJson('/api/tin-dang', $mau)->assertOk()->assertJsonPath('data.id', $id);
        $this->assertDatabaseCount('tin_dang', 1);
        $this->assertDatabaseCount('loi_khai_tin_dang', 1);
        $this->assertDatabaseCount('lich_su_tin_dang', 1);
    }

    public function test_bat_buoc_cau_danh_muc_va_cho_email_thay_dien_thoai(): void
    {
        $mau = $this->mau();
        $mau['loaiTin'] = 'lost';
        $mau['soDienThoai'] = '';
        $mau['cauTraLoi'][0]['giaTri'] = '';
        $this->postJson('/api/tin-dang', $mau)->assertUnprocessable();
        $this->assertDatabaseCount('tin_dang', 0);
        $mau['cauTraLoi'][0]['giaTri'] = 'Sọc đỏ';
        $this->postJson('/api/tin-dang', $mau)->assertCreated();
        $this->assertDatabaseCount('loi_khai_tin_dang', 1);
        $mau['maGui'] = (string) Str::uuid();
        $mau['email'] = '';
        $this->postJson('/api/tin-dang', $mau)->assertUnprocessable()->assertJsonValidationErrors(['email', 'soDienThoai']);
    }

    public function test_chan_ban_cu_thieu_thua_cau_va_danh_muc_an(): void
    {
        $mau = $this->mau();
        $this->rieng->update(['noi_dung' => 'Nhãn mới?']);
        $this->rieng->lichSu()->create(['phien_ban' => 2, 'du_lieu' => $this->rieng->attributesToArray()]);
        $this->postJson('/api/tin-dang', $mau)->assertConflict();
        $moi = $this->mau();
        $this->postJson('/api/tin-dang', $moi)->assertCreated();
        $this->assertDatabaseHas('loi_khai_tin_dang', ['cau_hoi_id' => $this->rieng->id, 'cau_hoi_phien_ban_id' => $moi['cauTraLoi'][0]['phienBanId']]);
        $moi['maGui'] = (string) Str::uuid();
        $cu = CauHoi::whereNull('danh_muc_id')->firstOrFail();
        $this->postJson('/api/tin-dang', [...$moi, 'cauTraLoi' => []])->assertUnprocessable();
        $this->postJson('/api/tin-dang', [...$moi, 'cauTraLoi' => [...$moi['cauTraLoi'], ['id' => $cu->id, 'phienBanId' => $cu->lichSu()->firstOrFail()->id, 'giaTri' => 'Giả']]])->assertConflict();
        $this->danhMuc->update(['trang_thai' => false]);
        $this->postJson('/api/tin-dang', $mau)->assertConflict();
        $this->assertDatabaseCount('tin_dang', 1);
    }

    public function test_so_giu_chinh_xac_chan_tran_va_lam_tron(): void
    {
        $dichVu = new CauTraLoiTinDang;
        $cau = ['danhMucId' => '1', 'nhanDangTin' => 'Số?', 'kieuNhap' => 'so'];
        foreach (['12345678901234.5678' => '12345678901234.5678', '1e3' => '1000', '-.0001' => '-0.0001', '0' => '0'] as $vao => $ra) {
            $this->assertSame($ra, $dichVu->giaTri($cau, $vao, 'dapAn')['gia_tri_so']);
        }
        foreach (['100000000000000', '0.00001', '1e999', 'NaN', '0x10', [], ''] as $vao) {
            try {
                $dichVu->giaTri($cau, $vao, 'dapAn');
                $this->fail('Phải từ chối số sai.');
            } catch (ValidationException $e) {
                $this->assertArrayHasKey('dapAn', $e->errors());
            }
        }
        $this->rieng->update(['kieu_nhap' => 'so']);
        $this->rieng->lichSu()->create(['phien_ban' => 2, 'du_lieu' => $this->rieng->attributesToArray()]);
        $mau = $this->mau();
        $mau['cauTraLoi'][0]['giaTri'] = '0';
        $this->postJson('/api/tin-dang', $mau)->assertCreated();
        $this->assertDatabaseHas('loi_khai_tin_dang', ['cau_hoi_id' => $this->rieng->id, 'gia_tri_so' => 0, 'gia_tri_text' => null]);
    }

    public function test_nhieu_anh_luu_that_va_chi_chu_tin_duoc_doc_anh_tin_da_an(): void
    {
        $mau = $this->mau();
        $mau['anh'] = [UploadedFile::fake()->image('mot.jpg'), UploadedFile::fake()->image('hai.png'), UploadedFile::fake()->image('ba.jpg')];
        $this->post('/api/tin-dang', [...$mau, 'anh' => [...$mau['anh'], UploadedFile::fake()->image('bon.jpg')]], ['Accept' => 'application/json'])
            ->assertUnprocessable()->assertJsonValidationErrors('anh');
        $this->assertDatabaseCount('tin_dang', 0);
        $id = $this->post('/api/tin-dang', $mau, ['Accept' => 'application/json'])->assertCreated()->json('data.id');
        $this->assertDatabaseCount('hinh_anh_tin_dang', 3);
        $this->assertCount(3, Storage::disk('public')->allFiles('tin/tin-nhat'));
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonCount(3, 'data.images');
        $url = HinhAnhTinDang::first()->duong_dan;
        $this->get($url)->assertOk();
        $tep = basename($url);
        $anhMoi = 'tin/tin-nhat/'.$tep;
        Storage::disk('local')->put('tin-dang/'.$tep, Storage::disk('public')->get($anhMoi));
        Storage::disk('public')->delete($anhMoi);
        $this->get($url)->assertOk();
        TinDang::find($id)->update(['trang_thai_kiem_duyet' => 'da_an']);
        $this->get($url)->assertOk();
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.biAn', true)->assertJsonPath('data.canClaim', false);
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->actingAs($this->nguoiNhan, 'web');
        $this->get($url)->assertNotFound();
        $this->getJson('/api/tra-cuu/'.$id)->assertNotFound();

        $baoMat = [...$this->mau(), 'loaiTin' => 'lost', 'anh' => [UploadedFile::fake()->image('bao-mat.jpg')]];
        $this->post('/api/tin-dang', $baoMat, ['Accept' => 'application/json'])->assertCreated();
        $this->assertCount(1, Storage::disk('public')->allFiles('tin/tin-mat'));
    }

    public function test_tin_da_dang_chi_lay_tin_cua_phien_va_phan_trang_ke_ca_tin_an(): void
    {
        $url = '/api/me/tin-dang';
        $this->getJson($url)->assertUnauthorized();
        $mau = $this->mau();
        $id = $this->postJson('/api/tin-dang', $mau)->assertCreated()->json('data.id');
        $tin = TinDang::findOrFail($id);
        for ($viTri = 0; $viTri < 6; $viTri++) {
            $tin->replicate()->fill(['slug' => 'tin-thu-'.$viTri, 'ma_gui' => null])->save();
        }
        $tin->update(['trang_thai_kiem_duyet' => 'da_an']);
        $tin->replicate()->fill(['slug' => 'tin-da-xoa', 'ma_gui' => null])->save();
        TinDang::where('slug', 'tin-da-xoa')->delete();
        $tinKhac = $tin->replicate()->fill(['slug' => 'tin-nguoi-khac', 'ma_gui' => null, 'nguoi_dung_id' => $this->nguoiNhan->id, 'trang_thai_kiem_duyet' => 'hien_thi']);
        $tinKhac->save();

        $this->getJson($url.'?trang=0')->assertUnprocessable();
        $this->getJson($url)->assertOk()->assertJsonCount(6, 'data')->assertJsonPath('meta.tongTin', 7)
            ->assertJsonPath('meta.tongTrang', 2)->assertJsonPath('data.0.laChuTin', true);
        $this->getJson($url.'?trang=99')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('meta.trangHienTai', 2)
            ->assertJsonPath('data.0.id', $id)->assertJsonPath('data.0.biAn', true)->assertJsonPath('data.0.contactEmail', 'li****@****')
            ->assertDontSee('SECRET-ANSWER');
        $this->getJson('/api/tra-cuu')->assertJsonPath('meta.tongTin', 7);

        $this->app['auth']->forgetGuards();
        $this->actingAs($this->nguoiNhan, 'web');
        $this->getJson($url)->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $tinKhac->id);
    }

    public function test_loi_luu_anh_rollback_tin_va_don_tep(): void
    {
        $mau = $this->mau();
        $mau['anh'] = [UploadedFile::fake()->image('mot.jpg')];
        HinhAnhTinDang::creating(fn () => throw new RuntimeException('loi-luu-thu'));
        try {
            $this->post('/api/tin-dang', $mau, ['Accept' => 'application/json'])->assertStatus(500);
        } finally {
            HinhAnhTinDang::flushEventListeners();
        }
        $this->assertDatabaseCount('tin_dang', 0);
        $this->assertDatabaseCount('loi_khai_tin_dang', 0);
        $this->assertEmpty(Storage::disk('public')->allFiles('tin'));
    }

    public function test_nhan_lai_dung_cau_goc_va_chi_chu_tin_duoc_mo_lien_he(): void
    {
        $this->rieng->update(['thu_tu' => 2]);
        $this->rieng->lichSu()->create(['phien_ban' => 2, 'du_lieu' => $this->rieng->attributesToArray()]);
        $this->cauHoi($this->danhMuc->id, 'Hãng nào?');
        $id = $this->postJson('/api/tin-dang', $this->mau())->assertCreated()->json('data.id');
        $cu = CauHoi::whereNull('danh_muc_id')->firstOrFail();
        $loiKhaiCu = TinDang::findOrFail($id)->loiKhai()->create([
            'cau_hoi_id' => $cu->id, 'cau_hoi_phien_ban_id' => $cu->lichSu()->firstOrFail()->id, 'gia_tri_text' => 'Đáp án cũ',
        ]);
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonMissingPath('data.publicAnswers')->assertDontSee('Đáp án cũ');
        $this->rieng->update(['noi_dung' => 'Đổi câu sau khi đăng?', 'kieu_nhap' => 'so', 'danh_muc_id' => null, 'trang_thai' => false]);
        $this->rieng->lichSu()->create(['phien_ban' => 3, 'du_lieu' => $this->rieng->attributesToArray()]);
        $this->cauHoi($this->danhMuc->id, 'Câu thêm sau?');
        $this->app['auth']->forgetGuards();
        $this->actingAs($this->nguoiNhan, 'web');
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertForbidden();
        $form = $this->getJson('/api/tin-dang/'.$id.'/nhan-lai')->assertOk()->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.nhanDangTin', 'Hãng nào?')
            ->assertJsonPath('data.1.nhanDangTin', 'Dấu hiệu bí mật?')->assertJsonPath('data.1.kieuNhap', 'van_ban');
        $this->assertStringNotContainsString('SECRET-ANSWER', $form->getContent());
        $mau = ['xacNhan' => true, 'cauTraLoi' => [
            ['id' => $form->json('data.0.id'), 'giaTri' => 'Sony'],
            ['id' => $form->json('data.1.id'), 'giaTri' => 'Câu trả lời của người mất'],
        ]];
        $this->postJson('/api/tin-dang/'.$id.'/nhan-lai', ['xacNhan' => true, 'cauTraLoi' => [['id' => 999, 'giaTri' => 'giả']]])->assertUnprocessable();
        $this->postJson('/api/tin-dang/'.$id.'/nhan-lai', $mau)->assertCreated();
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertForbidden()->assertDontSee('lienhe@gmail.com')->assertDontSee('0901234567');
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.hasClaim', true)->assertJsonPath('data.laChuTin', false);
        $this->postJson('/api/tin-dang/'.$id.'/nhan-lai', $mau)->assertOk();
        $this->assertDatabaseCount('yeu_cau_nhan_do', 1);
        $this->assertDatabaseCount('tra_loi_yeu_cau', 2);
        $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => $loiKhaiCu->id, 'gia_tri_text' => 'Đáp án cũ']);
        $this->assertDatabaseHas('tra_loi_yeu_cau', ['loi_khai_tin_dang_id' => $form->json('data.1.id'), 'gia_tri_text' => 'Câu trả lời của người mất']);
        $this->assertDatabaseHas('yeu_cau_nhan_do', ['trang_thai' => 'cho_kiem_tra']);
        YeuCauNhanDo::first()->update(['trang_thai' => 'tu_choi']);
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertForbidden();
        $this->actingAs($this->taiKhoan());
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertForbidden();
        $this->actingAs($this->chuTin);
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertOk()->assertJsonPath('data.email', 'lienhe@gmail.com')->assertJsonPath('data.soDienThoai', '0901234567');
        $this->getJson('/api/tin-dang/'.$id.'/nhan-lai')->assertForbidden();
        $this->app['auth']->forgetGuards();
        $this->actingAs($this->taiKhoan('quan_tri'), 'web');
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.contactEmail', 'li****@****')
            ->assertJsonPath('data.contactPhone', '09012****')->assertDontSee('lienhe@gmail.com')->assertDontSee('0901234567');
        $this->getJson('/api/tin-dang/'.$id.'/lien-he')->assertForbidden()->assertDontSee('lienhe@gmail.com')->assertDontSee('0901234567');
    }

    public function test_chu_tin_moi_duoc_sua_noi_dung_va_xoa_tin(): void
    {
        $mau = $this->mau();
        $mau['gioXayRa'] = '00:00';
        $id = $this->postJson('/api/tin-dang', $mau)->assertCreated()->json('data.id');
        $url = '/api/tin-dang/'.$id;
        $mau['tieuDe'] = 'Tai nghe màu xanh ở thư viện';
        $mau['loaiTin'] = 'lost';
        $this->getJson('/api/tra-cuu')->assertJsonPath('data.0.laChuTin', true);
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.laChuTin', true);

        $this->app['auth']->forgetGuards();
        $this->actingAs($this->nguoiNhan, 'web');
        $this->getJson('/api/tra-cuu')->assertJsonPath('data.0.laChuTin', false);
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.laChuTin', false);
        $this->getJson($url.'/chinh-sua')->assertNotFound();
        $this->patchJson($url, $mau)->assertNotFound();
        $this->deleteJson($url)->assertNotFound();

        $this->app['auth']->forgetGuards();
        $this->actingAs($this->chuTin, 'web');
        $this->getJson($url.'/chinh-sua')->assertOk()->assertJsonPath('data.tieuDe', 'Nhặt được tai nghe')->assertJsonPath('data.gioXayRa', '00:00');
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.gioXayRa', '00:00');
        $this->patchJson($url, [...$mau, 'tieuDe' => ''])->assertUnprocessable()->assertJsonValidationErrors('tieuDe');
        $this->patchJson($url, [...$mau, 'gioXayRa' => '24:00'])->assertUnprocessable()->assertJsonValidationErrors('gioXayRa');
        $this->patchJson($url, [...$mau, 'gioXayRa' => ''])->assertOk();
        $this->getJson('/api/tra-cuu/'.$id)->assertOk()->assertJsonPath('data.title', $mau['tieuDe'])
            ->assertJsonPath('data.type', 'found')->assertJsonPath('data.gioXayRa', null);
        $this->deleteJson($url)->assertOk();
        $this->assertSoftDeleted('tin_dang', ['id' => $id]);
        $this->assertDatabaseCount('loi_khai_tin_dang', 1);
        $this->getJson('/api/tra-cuu')->assertJsonPath('meta.tongTin', 0);
        $this->getJson('/api/tra-cuu/'.$id)->assertNotFound();
    }

    public function test_quyen_va_du_lieu_sai(): void
    {
        $this->getJson('/api/dang-tin/cau-hoi?danhMucId=1')->assertUnauthorized();
        $this->postJson('/api/tin-dang', [])->assertUnauthorized();
        $this->postJson('/api/tin-dang/1/nhan-lai', [])->assertUnauthorized();
        $this->getJson('/api/tin-dang/1/lien-he')->assertUnauthorized();
        $mau = $this->mau();
        foreach ([['email', 'sai-mail'], ['ngayXayRa', '2099-01-01'], ['diaDiemId', 999], ['tieuDe', ' ']] as [$cot, $giaTri]) {
            $this->postJson('/api/tin-dang', [...$mau, $cot => $giaTri])->assertUnprocessable();
        }
        $mau['anh'] = [UploadedFile::fake()->create('anh.jpg', 20, 'text/plain')];
        $this->post('/api/tin-dang', $mau, ['Accept' => 'application/json'])->assertUnprocessable();
        $this->assertDatabaseCount('tin_dang', 0);
        $this->chuTin->update(['trang_thai' => 'bi_khoa']);
        $this->getJson('/api/dang-tin/cau-hoi?danhMucId=1')->assertForbidden();
    }
}
