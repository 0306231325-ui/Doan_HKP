<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use App\Models\TinDang;
use App\Models\YeuCauNhanDo;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class QuanLyYeuCauTest extends TestCase
{
    private $admin;

    private $user;

    private $yc;

    private $answer;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        $tables = [
            'nguoi_dung' => ['ho_ten', 'email', 'mat_khau', 'vai_tro', 'trang_thai', 'so_dien_thoai'],
            'tin_dang' => ['nguoi_dung_id', 'tieu_de', 'trang_thai', 'thong_tin_lien_he', 'email_lien_he'],
            'yeu_cau_nhan_do' => ['tin_dang_id', 'nguoi_yeu_cau_id', 'trang_thai', 'loi_nhan', 'ghi_chu_admin', 'nguoi_xu_ly_id', 'thoi_gian_xu_ly'],
            'tra_loi_yeu_cau' => ['yeu_cau_id', 'ket_qua_doi_chieu', 'loi_khai_tin_dang_id'],
            'loi_khai_tin_dang' => ['cau_hoi_phien_ban_id'],
            'lich_su_cau_hoi' => ['du_lieu'],
            'minh_chung_yeu_cau' => ['yeu_cau_id', 'duong_dan'],
            'lich_su_yeu_cau' => ['yeu_cau_id', 'cuoc_hen_id', 'nguoi_thuc_hien_id', 'hanh_dong', 'trang_thai_cu', 'trang_thai_moi', 'noi_dung'],
            'thong_bao' => ['nguoi_dung_id', 'tin_dang_id', 'yeu_cau_id', 'cuoc_hen_id', 'loai_thong_bao', 'tieu_de', 'noi_dung'],
            'dia_diem' => ['ten_dia_diem', 'trang_thai'],
            'cuoc_hen' => ['yeu_cau_id', 'nguoi_giu_do_id', 'nguoi_de_xuat_id', 'nguoi_xac_nhan_id', 'thoi_gian_xac_nhan', 'thoi_gian_hen_gap', 'dia_diem_id', 'trang_thai', 'ly_do_huy', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc'],
            'ban_giao' => ['cuoc_hen_id', 'phuong_thuc_ban_giao', 'nguoi_xac_nhan_ban_giao_id', 'thoi_gian_ban_giao', 'ghi_chu_ban_giao'],
        ];
        foreach ($tables as $name => $columns) {
            Schema::create($name, function (Blueprint $t) use ($name, $columns) {
                $t->id();
                foreach ($columns as $c) {
                    $t->text($c)->nullable();
                }
                $t->timestamps();
                if (in_array($name, ['nguoi_dung', 'tin_dang'])) {
                    $t->softDeletes();
                }
            });
        }
        $this->admin = NguoiDung::create(['ho_ten' => 'Admin', 'email' => 'admin@test.vn', 'mat_khau' => 'password', 'vai_tro' => 'quan_tri', 'trang_thai' => 'hoat_dong']);
        $this->user = NguoiDung::create(['ho_ten' => 'User', 'email' => 'user@test.vn', 'mat_khau' => 'password', 'vai_tro' => 'nguoi_dung', 'trang_thai' => 'hoat_dong']);
        $tin = TinDang::create(['nguoi_dung_id' => $this->admin->id, 'tieu_de' => 'Ví', 'trang_thai' => 'dang_mo']);
        $this->yc = YeuCauNhanDo::create(['tin_dang_id' => $tin->id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        $this->answer = $this->yc->traLoi()->create(['ket_qua_doi_chieu' => 'chua_danh_gia']);
        DB::table('dia_diem')->insert(['ten_dia_diem' => 'Văn phòng', 'trang_thai' => 1]);
    }

    private function action($action, array $extra = [])
    {
        return $this->patchJson('/api/admin/yeu-cau/'.$this->yc->id, ['hanhDong' => $action, 'ghiChu' => 'Đã đối chiếu', ...$extra]);
    }

    public function test_admin_access_and_owner_scope(): void
    {
        $this->getJson('/api/admin/yeu-cau')->assertUnauthorized();
        $this->actingAs($this->user)->getJson('/api/admin/yeu-cau')->assertForbidden();
        $this->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.total', 1)->assertJsonMissingPath('data.data.0.tra_loi');
        $this->actingAs($this->admin)->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.total', 0);
        $this->getJson('/api/admin/yeu-cau')->assertOk()->assertJsonPath('data.total', 1);
    }

    public function test_review_requires_matching_answers_and_rolls_back_foreign_answers(): void
    {
        $this->actingAs($this->admin);
        $this->action('da_xac_minh')->assertUnprocessable();
        $this->action('da_xac_minh', ['doiChieu' => [$this->answer->id => 'khop', 999 => 'khop']])->assertUnprocessable();
        $this->assertSame('chua_danh_gia', $this->answer->fresh()->ket_qua_doi_chieu);
        $this->action('da_xac_minh', ['doiChieu' => [$this->answer->id => 'khop']])->assertOk();
        $this->assertSame('cho_ban_giao', $this->yc->tinDang->fresh()->trang_thai);
        $other = YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->admin->id, 'trang_thai' => 'cho_kiem_tra']);
        $other->traLoi()->create(['ket_qua_doi_chieu' => 'khop']);
        $this->patchJson('/api/admin/yeu-cau/'.$other->id, ['hanhDong' => 'da_xac_minh', 'ghiChu' => 'Khớp'])->assertConflict();
    }

    public function test_supplement_only_owner_and_requested_state(): void
    {
        $this->actingAs($this->admin);
        $this->action('can_bo_sung')->assertOk();
        $url = '/api/me/yeu-cau/'.$this->yc->id.'/bo-sung';
        $this->postJson($url, ['noiDung' => 'Khác'])->assertNotFound();
        $this->actingAs($this->user)->postJson($url, ['noiDung' => 'Có hóa đơn'])->assertOk();
        $this->assertSame('cho_kiem_tra', $this->yc->fresh()->trang_thai);
        $this->postJson($url, ['noiDung' => 'Lặp'])->assertConflict();
    }

    public function test_evidence_route_requires_admin_and_correct_claim(): void
    {
        Storage::fake('minh-chung-yeu-cau');
        Storage::disk('minh-chung-yeu-cau')->put('1/proof.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aOAAAAABJRU5ErkJggg=='));
        $photo = $this->yc->minhChung()->create(['duong_dan' => 'minh-chung-yeu-cau/1/proof.png']);
        $url = '/api/admin/yeu-cau/'.$this->yc->id.'/anh/'.$photo->id;
        $this->actingAs($this->user)->getJson($url)->assertForbidden();
        $this->actingAs($this->admin)->get($url)->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->get('/api/admin/yeu-cau/999/anh/'.$photo->id)->assertNotFound();
    }

    public function test_approval_needs_no_reason_and_records_a_default_message(): void
    {
        $this->actingAs($this->admin)->patchJson('/api/admin/yeu-cau/'.$this->yc->id, [
            'hanhDong' => 'da_xac_minh', 'doiChieu' => [$this->answer->id => 'khop'],
        ])->assertOk()->assertJsonPath('data.trang_thai', 'da_xac_minh');
        $this->assertSame('Yêu cầu nhận lại đồ đã được duyệt.', $this->yc->fresh()->ghi_chu_admin);
        $this->assertDatabaseHas('thong_bao', ['nguoi_dung_id' => $this->user->id, 'noi_dung' => 'Yêu cầu nhận lại đồ đã được duyệt.']);
    }

    public function test_rejection_requires_nonblank_reason_and_preserves_it(): void
    {
        $this->actingAs($this->admin);
        foreach ([null, '', '   '] as $reason) {
            $this->action('tu_choi', ['ghiChu' => $reason])->assertUnprocessable();
            $this->assertSame('cho_kiem_tra', $this->yc->fresh()->trang_thai);
        }
        $this->action('tu_choi', ['ghiChu' => '  Đặc điểm không khớp với đồ vật.  '])->assertOk();
        $this->assertSame('Đặc điểm không khớp với đồ vật.', $this->yc->fresh()->ghi_chu_admin);
        $this->assertSame('tu_choi', $this->yc->fresh()->trang_thai);
    }

    public function test_appointment_writes_are_disabled_but_approved_contact_is_readable(): void
    {
        $this->admin->update(['so_dien_thoai' => 'SECRET_PHONE']);
        $this->actingAs($this->user)->getJson('/api/me/yeu-cau/'.$this->yc->id)->assertOk()->assertJsonPath('data.lienHe', null)->assertDontSee('SECRET_PHONE');
        $this->approve();
        $this->actingAs($this->user)->getJson('/api/me/yeu-cau/'.$this->yc->id)->assertOk()->assertJsonPath('data.lienHe.soDienThoai', 'SECRET_PHONE');
        foreach (['de_xuat', 'xac_nhan', 'tu_choi', 'hoan_tat'] as $action) {
            $this->postJson('/api/me/yeu-cau/'.$this->yc->id.'/cuoc-hen', ['hanhDong' => $action])->assertNotFound();
        }
        $this->assertDatabaseCount('cuoc_hen', 0);
        $this->assertDatabaseCount('ban_giao', 0);
        $this->assertSame('cho_ban_giao', $this->yc->tinDang->fresh()->trang_thai);
        $this->actingAs($this->admin)->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.total', 1);
    }

    public function test_admin_still_displays_historical_progress_and_global_statistics(): void
    {
        $this->approve();
        $hen = $this->yc->cuocHen()->create(['nguoi_giu_do_id' => $this->admin->id, 'nguoi_de_xuat_id' => $this->user->id, 'dia_diem_id' => 1, 'thoi_gian_hen_gap' => now()->addDay(), 'trang_thai' => 'cho_xac_nhan']);
        $this->getJson('/api/admin/yeu-cau?trangThai=cho_xac_nhan_lich')->assertOk()->assertJsonPath('data.data.0.tien_do', 'cho_xac_nhan_lich');
        $hen->update(['trang_thai' => 'da_xac_nhan']);
        $this->getJson('/api/admin/yeu-cau?trangThai=da_thong_nhat_lich')->assertOk()->assertJsonPath('data.total', 1);
        $hen->update(['nguoi_nhan_xac_nhan_luc' => now()]);
        $this->getJson('/api/admin/yeu-cau?trangThai=cho_xac_nhan_giao_nhan')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('thongKe.dangGiaoNhan', 1);
        $hen->update(['trang_thai' => 'da_hoan_tat', 'nguoi_giu_xac_nhan_luc' => now()]);
        for ($i = 0; $i < 22; $i++) {
            YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        }
        $this->getJson('/api/admin/yeu-cau?trangThai=da_hoan_tat')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.tien_do', 'da_hoan_tat')->assertJsonPath('thongKe.tong', 23)->assertJsonPath('thongKe.hoanTat', 1)->assertJsonPath('thongKe.choKiemTra', 22);
        $this->getJson('/api/admin/yeu-cau?tuKhoa=YC-0001')->assertOk()->assertJsonPath('data.total', 1);
    }

    public function test_main_status_groups_include_all_their_detailed_states(): void
    {
        foreach (['can_bo_sung', 'tu_choi', 'da_huy'] as $status) {
            YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => $status]);
        }
        $this->actingAs($this->admin)->getJson('/api/admin/yeu-cau?trangThai=nhom_cho_kiem_tra')->assertOk()->assertJsonPath('data.total', 2);
        $this->getJson('/api/admin/yeu-cau?trangThai=nhom_tu_choi')->assertOk()->assertJsonPath('data.total', 2);
        $this->approve();
        $this->getJson('/api/admin/yeu-cau?trangThai=da_xac_minh')->assertOk()->assertJsonPath('data.total', 1);
        $this->getJson('/api/admin/yeu-cau?trangThai=dang_giao_nhan')->assertOk()->assertJsonPath('data.total', 0)->assertJsonPath('thongKe.dangGiaoNhan', 0);
        $hen = $this->yc->cuocHen()->create(['nguoi_giu_do_id' => $this->admin->id, 'nguoi_de_xuat_id' => $this->user->id, 'dia_diem_id' => 1, 'thoi_gian_hen_gap' => now()->addDay(), 'trang_thai' => 'cho_xac_nhan']);
        foreach (['cho_xac_nhan', 'da_xac_nhan'] as $status) {
            $hen->update(['trang_thai' => $status]);
            $this->getJson('/api/admin/yeu-cau?trangThai=dang_giao_nhan')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('thongKe.dangGiaoNhan', 1);
        }
        $hen->update(['nguoi_nhan_xac_nhan_luc' => now()]);
        $this->getJson('/api/admin/yeu-cau?trangThai=dang_giao_nhan')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.tien_do', 'cho_xac_nhan_giao_nhan');
        $hen->update(['trang_thai' => 'da_hoan_tat']);
        $this->getJson('/api/admin/yeu-cau?trangThai=dang_giao_nhan')->assertOk()->assertJsonPath('data.total', 0);
        $this->getJson('/api/admin/yeu-cau?trangThai=da_hoan_tat')->assertOk()->assertJsonPath('data.total', 1);
    }

    private function approve(): void
    {
        $this->actingAs($this->admin)->patchJson('/api/admin/yeu-cau/'.$this->yc->id, [
            'hanhDong' => 'da_xac_minh', 'doiChieu' => [$this->answer->id => 'khop'],
        ])->assertOk();
    }
}
