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
            'tin_dang' => ['nguoi_dung_id', 'danh_muc_id', 'tieu_de', 'trang_thai', 'thong_tin_lien_he', 'email_lien_he'],
            'danh_muc_do_vat' => ['ten_danh_muc', 'trang_thai', 'thu_tu'],
            'hinh_anh_tin_dang' => ['tin_dang_id', 'duong_dan', 'pham_vi', 'thu_tu'],
            'yeu_cau_nhan_do' => ['tin_dang_id', 'nguoi_yeu_cau_id', 'trang_thai', 'loi_nhan', 'ghi_chu_admin', 'nguoi_xu_ly_id', 'thoi_gian_xu_ly'],
            'tra_loi_yeu_cau' => ['yeu_cau_id', 'ket_qua_doi_chieu', 'loi_khai_tin_dang_id'],
            'loi_khai_tin_dang' => ['cau_hoi_phien_ban_id'],
            'lich_su_cau_hoi' => ['du_lieu'],
            'minh_chung_yeu_cau' => ['yeu_cau_id', 'duong_dan'],
            'lich_su_yeu_cau' => ['yeu_cau_id', 'cuoc_hen_id', 'nguoi_thuc_hien_id', 'hanh_dong', 'trang_thai_cu', 'trang_thai_moi', 'noi_dung'],
            'thong_bao' => ['nguoi_dung_id', 'tin_dang_id', 'yeu_cau_id', 'cuoc_hen_id', 'loai_thong_bao', 'tieu_de', 'noi_dung'],
            'dia_diem' => ['ten_dia_diem', 'trang_thai'],
            'cuoc_hen' => ['yeu_cau_id', 'nguoi_giu_do_id', 'nguoi_de_xuat_id', 'nguoi_xac_nhan_id', 'thoi_gian_xac_nhan', 'thoi_gian_hen_gap', 'dia_diem_id', 'trang_thai', 'ly_do_huy', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc'],
            'ban_giao' => ['cuoc_hen_id', 'thoi_gian_ban_giao', 'ma_ban_giao_hash', 'ma_het_han_luc'],
        ];
        foreach ($tables as $name => $columns) {
            Schema::create($name, function (Blueprint $t) use ($name, $columns) {
                $t->id();
                foreach ($columns as $c) {
                    $t->text($c)->nullable();
                }
                if ($name !== 'ban_giao') {
                    $t->timestamps();
                }
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

    public function test_group_counts_and_item_filter(): void
    {
        for ($i = 0; $i < 24; $i++) {
            YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'can_bo_sung']);
        }
        $other = TinDang::create(['nguoi_dung_id' => $this->admin->id, 'tieu_de' => 'Phone', 'trang_thai' => 'dang_mo']);
        YeuCauNhanDo::create(['tin_dang_id' => $other->id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        $this->actingAs($this->admin);
        $groups = $this->getJson('/api/admin/yeu-cau?nhom=1')->assertOk()->assertJsonPath('data.total', 2)->json('data.data');
        $group = collect($groups)->firstWhere('tin_dang_id', $this->yc->tin_dang_id);
        $this->assertEquals(25, $group['so_yeu_cau']);
        $this->assertEquals(1, $group['cho_kiem_tra']);
        $this->assertEquals(24, $group['can_bo_sung']);
        $this->getJson('/api/admin/yeu-cau?tinDangId='.$this->yc->tin_dang_id)->assertOk()->assertJsonPath('data.total', 25)->assertJsonCount(20, 'data.data');
        $this->getJson('/api/admin/yeu-cau?nhom=1&trangThai=can_bo_sung')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.so_yeu_cau', 24);
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

    public function test_supplement_action_is_no_longer_available(): void
    {
        $this->actingAs($this->admin);
        $this->action('can_bo_sung')->assertUnprocessable();
        $this->assertSame('cho_kiem_tra', $this->yc->fresh()->trang_thai);
        $this->postJson('/api/me/yeu-cau/'.$this->yc->id.'/bo-sung', ['noiDung' => 'demo'])->assertNotFound();
    }

    public function test_retired_supplement_claims_return_to_review_without_losing_answers(): void
    {
        $this->yc->update(['trang_thai' => 'can_bo_sung', 'ghi_chu_admin' => 'Old feedback']);
        $migration = require database_path('migrations/2026_11_09_000001_retire_claim_supplement_step.php');
        $migration->up();
        $this->assertSame('cho_kiem_tra', $this->yc->fresh()->trang_thai);
        $this->assertNull($this->yc->fresh()->ghi_chu_admin);
        $this->assertDatabaseHas('tra_loi_yeu_cau', ['id' => $this->answer->id]);
        $this->assertDatabaseHas('lich_su_yeu_cau', ['yeu_cau_id' => $this->yc->id, 'hanh_dong' => 'chuyen_cho_duyet']);
        $migration->up();
        $this->assertSame(1, $this->yc->lichSu()->where('hanh_dong', 'chuyen_cho_duyet')->count());
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

    public function test_legacy_appointment_actions_are_disabled_and_approved_contact_is_readable(): void
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

    public function test_approved_participants_can_schedule_and_only_the_other_account_can_confirm_at_the_meeting_time(): void
    {
        $this->travelTo(now()->startOfMinute());
        $body = $this->lichHen();
        $this->postJson('/api/me/cuoc-hen', $body)->assertUnauthorized();
        $this->actingAs($this->user)->postJson('/api/me/cuoc-hen', $body)->assertConflict();
        $this->assertDatabaseCount('cuoc_hen', 0);
        $this->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.data.0.coTheDatLich', false);
        $this->getJson('/api/me/yeu-cau?loai=lich_hen')->assertOk()->assertJsonPath('data.total', 0);
        $this->approve();
        $this->actingAs($this->user)->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.data.0.coTheDatLich', true);
        $this->getJson('/api/me/yeu-cau?loai=lich_hen')->assertOk()->assertJsonPath('data.total', 0);
        $nguoiNgoai = NguoiDung::create(['ho_ten' => 'Khách', 'email' => 'khach@test.vn', 'mat_khau' => 'password', 'vai_tro' => 'nguoi_dung', 'trang_thai' => 'hoat_dong']);
        $this->actingAs($nguoiNgoai)->postJson('/api/me/cuoc-hen', $body)->assertNotFound();
        $this->actingAs($this->user)->postJson('/api/me/cuoc-hen', [...$body, 'diaDiemId' => 999])->assertUnprocessable();
        $this->postJson('/api/me/cuoc-hen', $this->lichHen(-1))->assertUnprocessable();
        $ketQua = $this->postJson('/api/me/cuoc-hen', $body)->assertCreated()->assertHeader('Cache-Control', 'no-store, private')->json('data');
        $ma = $ketQua['ma'];
        $this->assertMatchesRegularExpression('/^[0-9]{6}$/', $ma);
        $hen = $this->yc->cuocHen()->findOrFail($ketQua['cuocHenId']);
        $maHash = hash_hmac('sha256', "ban-giao:{$this->admin->id}:{$ma}", config('app.key'));
        $this->assertSame($maHash, $hen->banGiao->ma_ban_giao_hash);
        $this->assertTrue($hen->thoi_gian_hen_gap->eq(now()->addHour()));
        $this->assertTrue($hen->banGiao->ma_het_han_luc->eq($hen->thoi_gian_hen_gap->copy()->addHours(24)));
        $this->assertDatabaseHas('thong_bao', ['nguoi_dung_id' => $this->admin->id, 'cuoc_hen_id' => $hen->id, 'loai_thong_bao' => 'tao_cuoc_hen']);
        $this->getJson('/api/me/yeu-cau/'.$this->yc->id)->assertOk()->assertJsonPath('data.coTheDatLich', false)
            ->assertJsonPath('data.cuoc_hen.0.dungMaBanGiao', true)->assertJsonMissingPath('data.cuoc_hen.0.ban_giao.ma_ban_giao_hash');
        $this->getJson('/api/me/yeu-cau?loai=lich_hen')->assertOk()
            ->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.cuoc_hen.0.id', $hen->id);
        $url = '/api/me/cuoc-hen/xac-nhan-ban-giao';
        $this->postJson($url, ['ma' => $ma])->assertUnprocessable();
        $this->actingAs($nguoiNgoai)->postJson($url, ['ma' => $ma])->assertUnprocessable();
        $this->actingAs($this->admin)->postJson('/api/me/cuoc-hen', $body)->assertConflict();
        $this->getJson('/api/admin/yeu-cau?trangThai=cho_xac_nhan_giao_nhan')->assertOk()->assertJsonPath('data.total', 1);
        $this->postJson($url, ['ma' => $ma])->assertConflict();
        $this->travelTo($hen->thoi_gian_hen_gap);
        $this->postJson($url, ['ma' => $ma])->assertOk()->assertJsonPath('yeuCauId', $this->yc->id);
        $this->postJson($url, ['ma' => $ma])->assertOk();
        $hen->refresh();
        $this->assertSame('da_hoan_tat', $hen->trang_thai);
        $this->assertSame('da_hoan_tat', $this->yc->tinDang->fresh()->trang_thai);
        $this->assertTrue($hen->nguoi_giu_xac_nhan_luc->eq($hen->nguoi_nhan_xac_nhan_luc));
        $this->assertSame($maHash, $hen->banGiao->ma_ban_giao_hash);
        $this->assertNull($hen->banGiao->ma_het_han_luc);
        $this->assertSame((int) $this->admin->id, (int) $hen->nguoi_xac_nhan_id);
        $this->assertTrue($hen->banGiao->thoi_gian_ban_giao->eq($hen->thoi_gian_xac_nhan));
        $this->assertSame(2, $hen->thongBao()->where('loai_thong_bao', 'xac_nhan_ban_giao')->count());
        $this->assertSame(1, $hen->lichSuYeuCau()->where('hanh_dong', 'xac_nhan_ban_giao')->count());
        $lichQuanTri = '/api/admin/lich-hen?'.http_build_query([
            'trangThai' => 'da_hoan_tat', 'ngay' => substr($body['thoiGianHen'], 0, 10), 'tuKhoa' => 'Ví',
        ]);
        $this->getJson($lichQuanTri)->assertOk()->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.data.0.id', $hen->id)
            ->assertJsonPath('data.data.0.nguoi_nhan.ho_ten', $this->user->ho_ten)
            ->assertJsonMissingPath('data.data.0.ban_giao.ma_ban_giao_hash');
        $this->getJson('/api/admin/yeu-cau?nhom=1&trangThaiNhom=hoan_tat')->assertOk()
            ->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.lich_hen.id', $hen->id);
        $this->getJson('/api/admin/yeu-cau?nhom=1&trangThaiNhom=cho_duyet')->assertOk()->assertJsonPath('data.total', 0);
        $this->actingAs($this->user)->getJson($lichQuanTri)->assertForbidden();
    }

    public function test_expired_code_is_cancelled_on_use_or_read_and_either_side_can_rebook(): void
    {
        $this->travelTo(now()->startOfMinute());
        $this->approve();
        $ma = $this->actingAs($this->admin)->postJson('/api/me/cuoc-hen', $this->lichHen())->assertCreated()->json('data.ma');
        $this->travel(25)->hours();
        $url = '/api/me/cuoc-hen/xac-nhan-ban-giao';
        $this->actingAs($this->user)->postJson($url, ['ma' => $ma])->assertConflict()->assertJsonPath('hetHan', true);
        $this->assertDatabaseHas('cuoc_hen', ['yeu_cau_id' => $this->yc->id, 'trang_thai' => 'da_huy']);
        $this->getJson('/api/me/yeu-cau/'.$this->yc->id)->assertOk()->assertJsonPath('data.coTheDatLich', true);
        $lichMoi = $this->postJson('/api/me/cuoc-hen', $this->lichHen())->assertCreated()->json('data');
        $this->travel(25)->hours();
        $this->getJson('/api/me/yeu-cau')->assertOk()->assertJsonPath('data.data.0.coTheDatLich', true);
        $this->assertDatabaseHas('cuoc_hen', ['id' => $lichMoi['cuocHenId'], 'trang_thai' => 'da_huy']);
        $this->actingAs($this->admin)->postJson($url, ['ma' => $lichMoi['ma']])->assertConflict()->assertJsonPath('hetHan', true);
        $this->assertSame('cho_ban_giao', $this->yc->tinDang->fresh()->trang_thai);
    }

    private function lichHen(int $sauGio = 1): array
    {
        return ['yeuCauId' => $this->yc->id, 'diaDiemId' => 1, 'thoiGianHen' => now()->addHours($sauGio)->setTimezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i')];
    }

    public function test_categories_filter_groups_before_pagination(): void
    {
        DB::table('danh_muc_do_vat')->insert(['id' => 1, 'ten_danh_muc' => 'Ví']);
        DB::table('danh_muc_do_vat')->insert(['id' => 2, 'ten_danh_muc' => 'Điện tử']);
        $this->yc->tinDang->update(['danh_muc_id' => 1]);
        $other = TinDang::create(['nguoi_dung_id' => $this->admin->id, 'danh_muc_id' => 2, 'tieu_de' => 'Phone', 'trang_thai' => 'dang_mo']);
        YeuCauNhanDo::create(['tin_dang_id' => $other->id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        $this->actingAs($this->admin)->getJson('/api/admin/yeu-cau?nhom=1&danhMucId=1')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.tin_dang.danh_muc.ten_danh_muc', 'Ví');
        $this->getJson('/api/admin/yeu-cau?nhom=1&danhMucId=2')->assertOk()->assertJsonPath('data.total', 1)->assertJsonPath('data.data.0.tin_dang.tieu_de', 'Phone');
        $this->getJson('/api/admin/yeu-cau?danhMucId=invalid')->assertUnprocessable();
    }

    public function test_other_claims_wait_then_reopen_or_close_with_the_item(): void
    {
        $other = YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        $other->traLoi()->create(['ket_qua_doi_chieu' => 'khop']);
        $this->approve();
        $url = '/api/admin/yeu-cau/'.$other->id;
        $this->getJson($url)->assertOk()->assertJsonPath('data.trang_thai_xu_ly', 'tam_cho_ban_giao');
        $this->getJson('/api/admin/yeu-cau?trangThai=tam_cho_ban_giao')->assertOk()->assertJsonPath('data.total', 1);
        $this->getJson('/api/admin/yeu-cau?trangThai=san_sang_duyet')->assertOk()->assertJsonPath('data.total', 0);
        $this->getJson('/api/admin/yeu-cau?trangThai=nhom_da_duyet')->assertOk()->assertJsonPath('data.total', 1);
        $this->patchJson($url, ['hanhDong' => 'da_xac_minh'])->assertConflict();
        $this->action('tu_choi')->assertOk();
        $this->getJson($url)->assertOk()->assertJsonPath('data.trang_thai_xu_ly', 'cho_kiem_tra');
        $this->getJson('/api/admin/yeu-cau?trangThai=san_sang_duyet')->assertOk()->assertJsonPath('data.total', 1);
        $this->patchJson($url, ['hanhDong' => 'da_xac_minh'])->assertOk();
        $this->yc->refresh()->update(['trang_thai' => 'cho_kiem_tra']);
        $this->yc->tinDang->update(['trang_thai' => 'da_hoan_tat']);
        $this->getJson('/api/admin/yeu-cau/'.$this->yc->id)->assertOk()->assertJsonPath('data.trang_thai_xu_ly', 'da_dong');
        $this->getJson('/api/admin/yeu-cau?trangThai=da_dong')->assertOk()->assertJsonPath('data.total', 1);
        $this->action('da_xac_minh', ['doiChieu' => [$this->answer->id => 'khop']])->assertConflict();
    }

    public function test_one_confirmation_reviews_all_answers_for_this_claim_only(): void
    {
        $second = $this->yc->traLoi()->create(['ket_qua_doi_chieu' => 'khong_khop']);
        $other = YeuCauNhanDo::create(['tin_dang_id' => $this->yc->tin_dang_id, 'nguoi_yeu_cau_id' => $this->user->id, 'trang_thai' => 'cho_kiem_tra']);
        $otherAnswer = $other->traLoi()->create(['ket_qua_doi_chieu' => 'chua_danh_gia']);
        $this->actingAs($this->admin);
        $this->action('da_xac_minh', ['xacNhanDoiChieu' => false])->assertUnprocessable();
        $this->action('da_xac_minh', ['xacNhanDoiChieu' => true])->assertOk();
        $this->assertSame('khop', $this->answer->fresh()->ket_qua_doi_chieu);
        $this->assertSame('khop', $second->fresh()->ket_qua_doi_chieu);
        $this->assertSame('chua_danh_gia', $otherAnswer->fresh()->ket_qua_doi_chieu);
        $this->patchJson('/api/admin/yeu-cau/'.$other->id, ['hanhDong' => 'da_xac_minh', 'xacNhanDoiChieu' => true])->assertConflict();
        $this->assertSame('chua_danh_gia', $otherAnswer->fresh()->ket_qua_doi_chieu);
    }

    public function test_comparison_returns_public_item_photos_only(): void
    {
        DB::table('hinh_anh_tin_dang')->insert([
            ['tin_dang_id' => $this->yc->tin_dang_id, 'duong_dan' => '/tin/tin-nhat/anhtin1.jpg', 'pham_vi' => 'cong_khai', 'thu_tu' => 1],
            ['tin_dang_id' => $this->yc->tin_dang_id, 'duong_dan' => '/private-evidence.jpg', 'pham_vi' => 'rieng_tu', 'thu_tu' => 2],
        ]);
        $this->actingAs($this->admin)->getJson('/api/admin/yeu-cau/'.$this->yc->id)
            ->assertOk()->assertJsonCount(1, 'data.anh_tin_dang')
            ->assertJsonPath('data.anh_tin_dang.0.url', '/api/tin-dang/anh/anhtin1.jpg')
            ->assertJsonMissingPath('data.tin_dang.hinh_anh');
    }

    private function approve(): void
    {
        $this->actingAs($this->admin)->patchJson('/api/admin/yeu-cau/'.$this->yc->id, [
            'hanhDong' => 'da_xac_minh', 'doiChieu' => [$this->answer->id => 'khop'],
        ])->assertOk();
    }
}
