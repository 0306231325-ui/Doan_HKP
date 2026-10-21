import json
import re
import sqlite3
import unittest
from pathlib import Path


DUONG_DAN_SQL = Path(__file__).resolve().parents[2] / 'database/design/quan_ly_do_that_lac_v4_toi_gon.sql'


def chuyenDinhNghia(sql):
    sql = re.sub(r'^\s*(?:FULLTEXT INDEX|INDEX) .*\n', '', sql, flags=re.M)
    sql = re.sub(r'UNIQUE KEY (\w+) ', r'CONSTRAINT \1 UNIQUE ', sql)
    sql = re.sub(r'(\w+) ENUM\(([^\n]+?)\)', r'\1 TEXT CHECK (\1 IN (\2))', sql)
    sql = sql.replace('BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY')
    sql = sql.replace('BIGINT UNSIGNED', 'INTEGER').replace('INT UNSIGNED', 'INTEGER')
    sql = re.sub(r'\bTINYINT(?:\(1\))?(?: UNSIGNED)?\b', 'INTEGER', sql)
    sql = sql.replace(' ON UPDATE CURRENT_TIMESTAMP', '').replace('CHAR_LENGTH(', 'LENGTH(')
    sql = re.sub(r'\) ENGINE=InnoDB[^;]*;', ');', sql)
    return re.sub(r',\s*\);$', '\n);', sql)


def layKieuJson(giaTri):
    giaTri = json.loads(giaTri)
    if isinstance(giaTri, list):
        return 'ARRAY'
    if isinstance(giaTri, dict):
        return 'OBJECT'
    return 'SCALAR'


class KiemTraCuocHen(unittest.TestCase):
    def setUp(self):
        self.sql = DUONG_DAN_SQL.read_text()
        self.db = sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys = ON')
        self.db.create_function('JSON_TYPE', 1, layKieuJson)
        self.db.create_function('JSON_LENGTH', 1, lambda giaTri: len(json.loads(giaTri)))
        for bang in re.findall(r'CREATE TABLE \w+ \([\s\S]*?\) ENGINE=InnoDB[^;]*;', self.sql):
            self.db.execute(chuyenDinhNghia(bang))
        for duLieu in re.findall(r'INSERT INTO [\s\S]*?;', self.sql):
            self.db.execute(duLieu)
        for ma, vaiTro in [(1, 'sinh_vien'), (2, 'sinh_vien'), (3, 'giang_vien'), (4, 'quan_tri')]:
            self.db.execute('INSERT INTO nguoi_dung (id, ho_ten, email, mat_khau, vai_tro, da_xac_minh) VALUES (?, ?, ?, ?, ?, 1)', (ma, f'Nguoi thu {ma}', f'thu{ma}@example.test', 'du-lieu-thu', vaiTro))
        for tin in [100, 101]:
            self.db.execute("INSERT INTO tin_dang (id, nguoi_dung_id, danh_muc_id, loai_tin, tieu_de, slug, mo_ta) VALUES (?, 2, 1, 'nhat_duoc', 'Do thu', ?, 'Mo ta thu')", (tin, f'tin-thu-{tin}'))
        for yeuCau, tin in [(10, 100), (20, 101)]:
            self.db.execute("INSERT INTO yeu_cau_nhan_do (id, tin_dang_id, nguoi_yeu_cau_id, trang_thai, nguoi_xu_ly_id, thoi_gian_xu_ly) VALUES (?, ?, 1, 'da_xac_minh', 4, '2026-10-17 08:00:00')", (yeuCau, tin))

    def tearDown(self):
        self.db.close()

    def taoCuocHen(self, **thayDoi):
        duLieu = dict(yeu_cau_id=10, nguoi_giu_do_id=2, nguoi_de_xuat_id=2, thoi_gian_hen_gap='2026-10-20 09:00:00', dia_diem_id=1)
        duLieu.update(thayDoi)
        cot = ', '.join(duLieu)
        dauHoi = ', '.join('?' for _ in duLieu)
        return self.db.execute(f'INSERT INTO cuoc_hen ({cot}) VALUES ({dauHoi})', tuple(duLieu.values())).lastrowid

    def xacNhan(self, maHen):
        self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_xac_nhan', nguoi_xac_nhan_id = 1, thoi_gian_xac_nhan = '2026-10-18 09:00:00' WHERE id = ?", (maHen,))

    def test_taoDu16BangVaNapDuLieuMau(self):
        cacBang = self.db.execute("SELECT name FROM sqlite_master WHERE type = 'table'").fetchall()
        self.assertEqual(len(cacBang), 16)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM cau_hoi').fetchone()[0], 13)
        cotYeuCau = {muc[1] for muc in self.db.execute('PRAGMA table_info(yeu_cau_nhan_do)')}
        self.assertFalse(cotYeuCau & {'thoi_gian_hen_gap', 'dia_diem_hen_gap', 'nguoi_xac_nhan_ban_giao_id', 'thoi_gian_ban_giao'})
        self.assertIn('bat_buoc', {muc[1] for muc in self.db.execute('PRAGMA table_info(cau_hoi)')})
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM cau_hoi WHERE bat_buoc = 1').fetchone()[0], 13)
        self.db.execute('UPDATE cau_hoi SET bat_buoc = 0 WHERE id = 1')
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute('UPDATE cau_hoi SET bat_buoc = 2 WHERE id = 1')

    def test_khongTuXacNhanLichHoacXacNhanThieuThongTin(self):
        maHen = self.taoCuocHen()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_xac_nhan', nguoi_xac_nhan_id = 2, thoi_gian_xac_nhan = '2026-10-18 09:00:00' WHERE id = ?", (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_xac_nhan', nguoi_xac_nhan_id = 1 WHERE id = ?", (maHen,))
        self.xacNhan(maHen)
        self.assertEqual(self.db.execute('SELECT trang_thai FROM cuoc_hen WHERE id = ?', (maHen,)).fetchone()[0], 'da_xac_nhan')

    def test_chiMotLichHieuLucVaDoiLichGiuLaiLichSu(self):
        cu = self.taoCuocHen()
        with self.assertRaises(sqlite3.IntegrityError):
            self.taoCuocHen()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_huy' WHERE id = ?", (cu,))
        self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_huy', ly_do_huy = 'Doi gio da thong nhat' WHERE id = ?", (cu,))
        moi = self.taoCuocHen(thoi_gian_hen_gap='2026-10-21 09:00:00')
        self.assertNotEqual(cu, moi)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM cuoc_hen WHERE yeu_cau_id = 10').fetchone()[0], 2)

    def test_diaDiemHenPhaiCoTrongDanhSachTruong(self):
        for thayDoi in [dict(yeu_cau_id=999), dict(nguoi_giu_do_id=999), dict(dia_diem_id=999), dict(dia_diem_id=None)]:
            with self.assertRaises(sqlite3.IntegrityError):
                self.taoCuocHen(**thayDoi)
        maHen = self.taoCuocHen()
        diaDiem = self.db.execute('SELECT d.ten_dia_diem FROM cuoc_hen c JOIN dia_diem d ON d.id = c.dia_diem_id WHERE c.id = ?', (maHen,)).fetchone()[0]
        self.assertEqual(diaDiem, 'Thư viện')

    def test_maBanGiaoPhaiCoHanVaGioiHanLanSai(self):
        maHen = self.taoCuocHen()
        self.xacNhan(maHen)
        self.db.execute('INSERT INTO ban_giao (cuoc_hen_id) VALUES (?)', (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET ma_ban_giao_hash = 'hash-thu' WHERE cuoc_hen_id = ?", (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET ma_ban_giao_hash = ' ', ma_het_han_luc = '2026-10-20 10:00:00' WHERE cuoc_hen_id = ?", (maHen,))
        self.db.execute("UPDATE ban_giao SET ma_ban_giao_hash = 'hash-thu', ma_het_han_luc = '2026-10-20 10:00:00', so_lan_nhap_sai = 5 WHERE cuoc_hen_id = ?", (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute('UPDATE ban_giao SET so_lan_nhap_sai = 6 WHERE cuoc_hen_id = ?', (maHen,))
        with self.db:
            self.db.execute('UPDATE ban_giao SET ma_ban_giao_hash = NULL, ma_het_han_luc = NULL WHERE cuoc_hen_id = ?', (maHen,))
            self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_huy', ly_do_huy = 'Doi lich' WHERE id = ?", (maHen,))
        self.assertIsNone(self.db.execute('SELECT ma_ban_giao_hash FROM ban_giao WHERE cuoc_hen_id = ?', (maHen,)).fetchone()[0])

    def test_banGiaoPhaiDuThongTinVaThuHoiMaDaDung(self):
        maHen = self.taoCuocHen()
        self.xacNhan(maHen)
        self.db.execute("INSERT INTO ban_giao (cuoc_hen_id, ma_ban_giao_hash, ma_het_han_luc) VALUES (?, 'hash-thu', '2026-10-20 10:00:00')", (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'ma_xac_nhan' WHERE cuoc_hen_id = ?", (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'ma_xac_nhan', nguoi_xac_nhan_ban_giao_id = 2, thoi_gian_ban_giao = '2026-10-20 09:00:00' WHERE cuoc_hen_id = ?", (maHen,))
        with self.db:
            self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'ma_xac_nhan', nguoi_xac_nhan_ban_giao_id = 2, thoi_gian_ban_giao = '2026-10-20 09:00:00', ma_ban_giao_hash = NULL, ma_het_han_luc = NULL WHERE cuoc_hen_id = ?", (maHen,))
            self.db.execute("UPDATE cuoc_hen SET trang_thai = 'da_hoan_tat' WHERE id = ?", (maHen,))
            self.db.execute("UPDATE tin_dang SET trang_thai = 'da_hoan_tat' WHERE id = 100")
        with self.assertRaises(sqlite3.IntegrityError):
            self.taoCuocHen()
        self.assertEqual(self.db.execute('SELECT c.trang_thai, b.phuong_thuc_ban_giao, b.ma_ban_giao_hash FROM cuoc_hen c JOIN ban_giao b ON b.cuoc_hen_id = c.id WHERE c.id = ?', (maHen,)).fetchone(), ('da_hoan_tat', 'ma_xac_nhan', None))

    def test_banGiaoThuCongPhaiCoLyDo(self):
        maHen = self.taoCuocHen()
        self.xacNhan(maHen)
        self.db.execute('INSERT INTO ban_giao (cuoc_hen_id) VALUES (?)', (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'admin_xac_nhan', nguoi_xac_nhan_ban_giao_id = 4, thoi_gian_ban_giao = '2026-10-20 09:00:00' WHERE cuoc_hen_id = ?", (maHen,))
        self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'admin_xac_nhan', nguoi_xac_nhan_ban_giao_id = 4, thoi_gian_ban_giao = '2026-10-20 09:00:00', ghi_chu_ban_giao = 'Da doi chieu bien nhan' WHERE cuoc_hen_id = ?", (maHen,))
        self.assertEqual(self.db.execute('SELECT phuong_thuc_ban_giao FROM ban_giao WHERE cuoc_hen_id = ?', (maHen,)).fetchone()[0], 'admin_xac_nhan')

    def test_moiCuocHenChiCoMotHoSoBanGiao(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute('INSERT INTO ban_giao (cuoc_hen_id) VALUES (999)')
        maHen = self.taoCuocHen()
        self.xacNhan(maHen)
        self.db.execute('INSERT INTO ban_giao (cuoc_hen_id) VALUES (?)', (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute('INSERT INTO ban_giao (cuoc_hen_id) VALUES (?)', (maHen,))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE ban_giao SET phuong_thuc_ban_giao = 'ma_xac_nhan', nguoi_xac_nhan_ban_giao_id = 999, thoi_gian_ban_giao = '2026-10-20 09:00:00' WHERE cuoc_hen_id = ?", (maHen,))

    def test_loiKhaiBatBuocDungMotGiaTriVaKhongNhanChuoiTrong(self):
        for text, so, chon in [(None, None, None), ('  ', None, None), (None, None, ''), ('Mo ta', 1, None)]:
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute('INSERT INTO loi_khai_tin_dang (tin_dang_id, cau_hoi_id, gia_tri_text, gia_tri_so, gia_tri_lua_chon) VALUES (100, 1, ?, ?, ?)', (text, so, chon))
        self.db.execute('INSERT INTO loi_khai_tin_dang (tin_dang_id, cau_hoi_id, gia_tri_so) VALUES (100, 9, 0)')
        self.assertEqual(self.db.execute('SELECT gia_tri_so FROM loi_khai_tin_dang').fetchone()[0], 0)

    def test_thongBaoVaLichSuKhongTroCuocHenCuaYeuCauKhac(self):
        maHen = self.taoCuocHen()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO lich_su_yeu_cau (yeu_cau_id, cuoc_hen_id, hanh_dong) VALUES (20, ?, 'tao_hen')", (maHen,))
        for yeuCau in [None, 20]:
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute("INSERT INTO thong_bao (nguoi_dung_id, yeu_cau_id, cuoc_hen_id, loai_thong_bao, tieu_de, noi_dung) VALUES (1, ?, ?, 'cuoc_hen', 'Lich hen', 'Xem lich hen')", (yeuCau, maHen))
        self.db.execute("INSERT INTO lich_su_yeu_cau (yeu_cau_id, cuoc_hen_id, hanh_dong) VALUES (10, ?, 'tao_hen')", (maHen,))
        self.db.execute("INSERT INTO thong_bao (nguoi_dung_id, yeu_cau_id, cuoc_hen_id, loai_thong_bao, tieu_de, noi_dung) VALUES (1, 10, ?, 'cuoc_hen', 'Lich hen', 'Xem lich hen')", (maHen,))
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM thong_bao').fetchone()[0], 1)


if __name__ == '__main__':
    unittest.main(verbosity=2)
