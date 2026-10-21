CREATE DATABASE IF NOT EXISTS quan_ly_do_that_lac_v4
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_do_that_lac_v4;
SET NAMES utf8mb4;

CREATE TABLE nguoi_dung (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ho_ten VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  mat_khau VARCHAR(255) NOT NULL,
  so_dien_thoai VARCHAR(20) NULL,
  ma_so VARCHAR(50) NULL,
  khoa VARCHAR(100) NULL,
  lop VARCHAR(50) NULL,
  vai_tro ENUM('sinh_vien', 'giang_vien', 'quan_tri') NOT NULL DEFAULT 'sinh_vien',
  da_xac_minh TINYINT(1) NOT NULL DEFAULT 0,
  trang_thai ENUM('hoat_dong', 'bi_khoa') NOT NULL DEFAULT 'hoat_dong',
  ly_do_khoa TEXT NULL,
  khoa_den_ngay DATETIME NULL,
  anh_dai_dien VARCHAR(500) NULL,
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nguoi_dung_ma_so (ma_so),
  CONSTRAINT chk_nguoi_dung_xac_minh CHECK (da_xac_minh IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE danh_muc_do_vat (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_danh_muc VARCHAR(100) NOT NULL UNIQUE,
  bieu_tuong VARCHAR(50) NULL,
  mo_ta TEXT NULL,
  trang_thai TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dia_diem (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_dia_diem VARCHAR(150) NOT NULL UNIQUE,
  mo_ta TEXT NULL,
  trang_thai TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cau_hoi (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  danh_muc_id BIGINT UNSIGNED NULL,
  ma_cau_hoi VARCHAR(64) NOT NULL,
  phien_ban INT UNSIGNED NOT NULL DEFAULT 1,
  noi_dung VARCHAR(255) NOT NULL,
  kieu_nhap ENUM('van_ban', 'so', 'chon_mot') NOT NULL DEFAULT 'van_ban',
  lua_chon JSON NULL,
  loai_tin ENUM('ca_hai', 'bao_mat', 'nhat_duoc') NOT NULL DEFAULT 'ca_hai',
  bat_buoc TINYINT(1) NOT NULL DEFAULT 1,
  cong_khai TINYINT(1) NOT NULL DEFAULT 1,
  dung_xac_minh TINYINT(1) NOT NULL DEFAULT 0,
  thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
  trang_thai TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cau_hoi_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_do_vat(id),
  UNIQUE KEY uq_cau_hoi_phien_ban (ma_cau_hoi, phien_ban),
  INDEX idx_cau_hoi_form (danh_muc_id, trang_thai, loai_tin, thu_tu),
  CONSTRAINT chk_cau_hoi_phien_ban CHECK (phien_ban >= 1),
  CONSTRAINT chk_cau_hoi_co CHECK (
    bat_buoc IN (0,1) AND cong_khai IN (0,1) AND dung_xac_minh IN (0,1) AND trang_thai IN (0,1)
  ),
  CONSTRAINT chk_cau_hoi_xac_minh CHECK (
    dung_xac_minh = 0 OR loai_tin <> 'bao_mat'
  ),
  CONSTRAINT chk_cau_hoi_lua_chon CHECK (
    (kieu_nhap = 'chon_mot' AND lua_chon IS NOT NULL
      AND JSON_TYPE(lua_chon) = 'ARRAY' AND JSON_LENGTH(lua_chon) > 0)
    OR (kieu_nhap <> 'chon_mot' AND lua_chon IS NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tin_dang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nguoi_dung_id BIGINT UNSIGNED NOT NULL,
  danh_muc_id BIGINT UNSIGNED NOT NULL,
  dia_diem_id BIGINT UNSIGNED NULL,
  loai_tin ENUM('bao_mat', 'nhat_duoc') NOT NULL,
  tin_bao_mat_lien_quan_id BIGINT UNSIGNED NULL,
  tieu_de VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  mo_ta TEXT NOT NULL,
  thoi_gian_xay_ra DATETIME NULL,
  dia_diem_chi_tiet VARCHAR(255) NULL,
  thong_tin_lien_he VARCHAR(255) NULL,
  trang_thai ENUM('dang_mo', 'cho_ban_giao', 'da_hoan_tat', 'da_dong') NOT NULL DEFAULT 'dang_mo',
  trang_thai_kiem_duyet ENUM('hien_thi', 'da_an') NOT NULL DEFAULT 'hien_thi',
  ly_do_an TEXT NULL,
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tin_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_tin_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_do_vat(id),
  CONSTRAINT fk_tin_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id),
  CONSTRAINT fk_tin_bao_mat_lien_quan FOREIGN KEY (tin_bao_mat_lien_quan_id) REFERENCES tin_dang(id),
  CONSTRAINT chk_tin_phan_hoi_bao_mat CHECK (tin_bao_mat_lien_quan_id IS NULL OR loai_tin = 'nhat_duoc'),
  INDEX idx_tin_phan_hoi_bao_mat (tin_bao_mat_lien_quan_id, nguoi_dung_id),
  INDEX idx_tin_loc (loai_tin, trang_thai, danh_muc_id, dia_diem_id),
  INDEX idx_tin_hien_thi (trang_thai_kiem_duyet, deleted_at, created_at),
  FULLTEXT INDEX ft_tin_tim_kiem (tieu_de, mo_ta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE loi_khai_tin_dang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  cau_hoi_id BIGINT UNSIGNED NOT NULL,
  gia_tri_text TEXT NULL,
  gia_tri_so DECIMAL(18,4) NULL,
  gia_tri_lua_chon VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_loi_khai_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_loi_khai_cau_hoi FOREIGN KEY (cau_hoi_id) REFERENCES cau_hoi(id),
  UNIQUE KEY uq_loi_khai_tin_cau_hoi (tin_dang_id, cau_hoi_id),
  UNIQUE KEY uq_loi_khai_tin_id_tin (id, tin_dang_id),
  INDEX idx_loi_khai_loc (cau_hoi_id, gia_tri_lua_chon, tin_dang_id),
  CONSTRAINT chk_loi_khai_tin_mot_gia_tri CHECK (
    (gia_tri_text IS NOT NULL) + (gia_tri_so IS NOT NULL) + (gia_tri_lua_chon IS NOT NULL) = 1
    AND (gia_tri_text IS NULL OR CHAR_LENGTH(TRIM(gia_tri_text)) > 0)
    AND (gia_tri_lua_chon IS NULL OR CHAR_LENGTH(TRIM(gia_tri_lua_chon)) > 0)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE yeu_cau_nhan_do (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  nguoi_yeu_cau_id BIGINT UNSIGNED NOT NULL,
  loi_nhan TEXT NULL,
  thoi_gian_mat DATETIME NULL,
  dia_diem_mat_id BIGINT UNSIGNED NULL,
  dia_diem_mat_chi_tiet VARCHAR(255) NULL,
  trang_thai ENUM('cho_kiem_tra', 'can_bo_sung', 'da_xac_minh', 'tu_choi', 'da_huy') NOT NULL DEFAULT 'cho_kiem_tra',
  nguoi_xu_ly_id BIGINT UNSIGNED NULL,
  ghi_chu_admin TEXT NULL,
  thoi_gian_xu_ly DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  tin_dang_dang_xu_ly_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN trang_thai IN ('cho_kiem_tra', 'can_bo_sung', 'da_xac_minh')
      THEN tin_dang_id ELSE NULL END
  ) STORED,
  tin_dang_da_duyet_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN trang_thai = 'da_xac_minh'
      THEN tin_dang_id ELSE NULL END
  ) STORED,
  CONSTRAINT fk_yeu_cau_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_yeu_cau_nguoi_gui FOREIGN KEY (nguoi_yeu_cau_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_yeu_cau_dia_diem_mat FOREIGN KEY (dia_diem_mat_id) REFERENCES dia_diem(id),
  CONSTRAINT fk_yeu_cau_admin FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id),
  UNIQUE KEY uq_yeu_cau_id_tin (id, tin_dang_id),
  UNIQUE KEY uq_yeu_cau_dang_xu_ly (nguoi_yeu_cau_id, tin_dang_dang_xu_ly_id),
  UNIQUE KEY uq_mot_nguoi_nhan (tin_dang_da_duyet_id),
  INDEX idx_yeu_cau_tin_trang_thai (tin_dang_id, trang_thai),
  INDEX idx_yeu_cau_admin_queue (trang_thai, created_at),
  CONSTRAINT chk_yeu_cau_da_duyet CHECK (
    trang_thai <> 'da_xac_minh'
    OR (nguoi_xu_ly_id IS NOT NULL AND thoi_gian_xu_ly IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cuoc_hen (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  yeu_cau_id BIGINT UNSIGNED NOT NULL,
  nguoi_giu_do_id BIGINT UNSIGNED NOT NULL,
  nguoi_de_xuat_id BIGINT UNSIGNED NOT NULL,
  nguoi_xac_nhan_id BIGINT UNSIGNED NULL,
  thoi_gian_xac_nhan DATETIME NULL,
  thoi_gian_hen_gap DATETIME NOT NULL,
  dia_diem_id BIGINT UNSIGNED NOT NULL,
  trang_thai ENUM('cho_xac_nhan', 'da_xac_nhan', 'tu_choi', 'da_huy', 'da_hoan_tat') NOT NULL DEFAULT 'cho_xac_nhan',
  ly_do_huy TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  yeu_cau_hieu_luc_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN trang_thai IN ('cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat')
      THEN yeu_cau_id ELSE NULL END
  ) STORED,
  CONSTRAINT fk_cuoc_hen_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
  CONSTRAINT fk_cuoc_hen_nguoi_giu FOREIGN KEY (nguoi_giu_do_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_cuoc_hen_nguoi_de_xuat FOREIGN KEY (nguoi_de_xuat_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_cuoc_hen_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_cuoc_hen_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id),
  UNIQUE KEY uq_cuoc_hen_hieu_luc (yeu_cau_hieu_luc_id),
  UNIQUE KEY uq_cuoc_hen_id_yeu_cau (id, yeu_cau_id),
  INDEX idx_cuoc_hen_yeu_cau (yeu_cau_id, created_at),
  INDEX idx_cuoc_hen_nguoi_giu (nguoi_giu_do_id, trang_thai, thoi_gian_hen_gap),
  CONSTRAINT chk_cuoc_hen_xac_nhan CHECK (
    (nguoi_xac_nhan_id IS NULL AND thoi_gian_xac_nhan IS NULL)
    OR (nguoi_xac_nhan_id IS NOT NULL AND thoi_gian_xac_nhan IS NOT NULL
      AND nguoi_xac_nhan_id <> nguoi_de_xuat_id)
  ),
  CONSTRAINT chk_cuoc_hen_trang_thai CHECK (
    (trang_thai NOT IN ('da_xac_nhan', 'da_hoan_tat') OR nguoi_xac_nhan_id IS NOT NULL)
    AND (trang_thai <> 'cho_xac_nhan' OR nguoi_xac_nhan_id IS NULL)
  ),
  CONSTRAINT chk_cuoc_hen_ly_do_huy CHECK (
    trang_thai NOT IN ('tu_choi', 'da_huy')
    OR (ly_do_huy IS NOT NULL AND CHAR_LENGTH(TRIM(ly_do_huy)) > 0)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ban_giao (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cuoc_hen_id BIGINT UNSIGNED NOT NULL UNIQUE,
  ma_ban_giao_hash VARCHAR(255) NULL,
  ma_het_han_luc DATETIME NULL,
  so_lan_nhap_sai TINYINT UNSIGNED NOT NULL DEFAULT 0,
  phuong_thuc_ban_giao ENUM('ma_xac_nhan', 'admin_xac_nhan') NULL,
  nguoi_xac_nhan_ban_giao_id BIGINT UNSIGNED NULL,
  thoi_gian_ban_giao DATETIME NULL,
  ghi_chu_ban_giao TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ban_giao_cuoc_hen FOREIGN KEY (cuoc_hen_id) REFERENCES cuoc_hen(id),
  CONSTRAINT fk_ban_giao_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_ban_giao_id) REFERENCES nguoi_dung(id),
  CONSTRAINT chk_ban_giao_ma CHECK (
    (ma_ban_giao_hash IS NULL AND ma_het_han_luc IS NULL)
    OR (phuong_thuc_ban_giao IS NULL AND ma_ban_giao_hash IS NOT NULL
      AND CHAR_LENGTH(TRIM(ma_ban_giao_hash)) > 0 AND ma_het_han_luc IS NOT NULL)
  ),
  CONSTRAINT chk_ban_giao_so_lan_sai CHECK (so_lan_nhap_sai BETWEEN 0 AND 5),
  CONSTRAINT chk_ban_giao_ket_qua CHECK (
    (phuong_thuc_ban_giao IS NOT NULL
      AND nguoi_xac_nhan_ban_giao_id IS NOT NULL AND thoi_gian_ban_giao IS NOT NULL
      AND (phuong_thuc_ban_giao = 'ma_xac_nhan'
        OR (phuong_thuc_ban_giao = 'admin_xac_nhan' AND ghi_chu_ban_giao IS NOT NULL
          AND CHAR_LENGTH(TRIM(ghi_chu_ban_giao)) > 0)))
    OR (phuong_thuc_ban_giao IS NULL
      AND nguoi_xac_nhan_ban_giao_id IS NULL AND thoi_gian_ban_giao IS NULL AND ghi_chu_ban_giao IS NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tra_loi_yeu_cau (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  yeu_cau_id BIGINT UNSIGNED NOT NULL,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  loi_khai_tin_dang_id BIGINT UNSIGNED NOT NULL,
  gia_tri_text TEXT NULL,
  gia_tri_so DECIMAL(18,4) NULL,
  gia_tri_lua_chon VARCHAR(100) NULL,
  ket_qua_doi_chieu ENUM('chua_danh_gia', 'khop', 'khong_khop', 'chua_du_can_cu') NOT NULL DEFAULT 'chua_danh_gia',
  nhan_xet_admin TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tra_loi_yc_yeu_cau FOREIGN KEY (yeu_cau_id, tin_dang_id) REFERENCES yeu_cau_nhan_do(id, tin_dang_id),
  CONSTRAINT fk_tra_loi_yc_dap_an_goc FOREIGN KEY (loi_khai_tin_dang_id, tin_dang_id) REFERENCES loi_khai_tin_dang(id, tin_dang_id),
  UNIQUE KEY uq_tra_loi_yc_cau_hoi (yeu_cau_id, loi_khai_tin_dang_id),
  CONSTRAINT chk_tra_loi_yc_mot_gia_tri CHECK (
    (gia_tri_text IS NOT NULL) + (gia_tri_so IS NOT NULL) + (gia_tri_lua_chon IS NOT NULL) = 1
    AND (gia_tri_text IS NULL OR CHAR_LENGTH(TRIM(gia_tri_text)) > 0)
    AND (gia_tri_lua_chon IS NULL OR CHAR_LENGTH(TRIM(gia_tri_lua_chon)) > 0)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hinh_anh_tin_dang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  nguoi_tai_len_id BIGINT UNSIGNED NOT NULL,
  duong_dan VARCHAR(500) NOT NULL,
  mo_ta VARCHAR(255) NULL,
  pham_vi ENUM('cong_khai', 'rieng_tu') NOT NULL DEFAULT 'cong_khai',
  thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_anh_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_anh_nguoi_tai FOREIGN KEY (nguoi_tai_len_id) REFERENCES nguoi_dung(id),
  INDEX idx_anh_tin_thu_tu (tin_dang_id, thu_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE minh_chung_yeu_cau (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  yeu_cau_id BIGINT UNSIGNED NOT NULL,
  duong_dan VARCHAR(500) NOT NULL,
  mo_ta VARCHAR(255) NULL,
  thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_minh_chung_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
  INDEX idx_minh_chung_thu_tu (yeu_cau_id, thu_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lich_su_tin_dang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  nguoi_thuc_hien_id BIGINT UNSIGNED NULL,
  hanh_dong VARCHAR(64) NOT NULL,
  trang_thai_cu VARCHAR(32) NULL,
  trang_thai_moi VARCHAR(32) NULL,
  noi_dung TEXT NULL,
  du_lieu_cu JSON NULL,
  du_lieu_moi JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ls_tin_dang FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_ls_tin_nguoi FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(id),
  INDEX idx_ls_tin_thoi_gian (tin_dang_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lich_su_yeu_cau (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  yeu_cau_id BIGINT UNSIGNED NOT NULL,
  cuoc_hen_id BIGINT UNSIGNED NULL,
  nguoi_thuc_hien_id BIGINT UNSIGNED NULL,
  hanh_dong VARCHAR(64) NOT NULL,
  trang_thai_cu VARCHAR(32) NULL,
  trang_thai_moi VARCHAR(32) NULL,
  noi_dung TEXT NULL,
  du_lieu_cu JSON NULL,
  du_lieu_moi JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ls_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
  CONSTRAINT fk_ls_yc_cuoc_hen FOREIGN KEY (cuoc_hen_id, yeu_cau_id) REFERENCES cuoc_hen(id, yeu_cau_id),
  CONSTRAINT fk_ls_yc_nguoi FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(id),
  INDEX idx_ls_yc_thoi_gian (yeu_cau_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bao_cao_tin_dang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tin_dang_id BIGINT UNSIGNED NOT NULL,
  nguoi_bao_cao_id BIGINT UNSIGNED NOT NULL,
  ly_do VARCHAR(255) NOT NULL,
  mo_ta TEXT NULL,
  trang_thai ENUM('cho_xu_ly', 'chap_nhan', 'tu_choi') NOT NULL DEFAULT 'cho_xu_ly',
  nguoi_xu_ly_id BIGINT UNSIGNED NULL,
  ghi_chu_admin TEXT NULL,
  thoi_gian_xu_ly DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bao_cao_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_bao_cao_nguoi_gui FOREIGN KEY (nguoi_bao_cao_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_bao_cao_admin FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id),
  INDEX idx_bao_cao_queue (trang_thai, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE thong_bao (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nguoi_dung_id BIGINT UNSIGNED NOT NULL,
  tin_dang_id BIGINT UNSIGNED NULL,
  yeu_cau_id BIGINT UNSIGNED NULL,
  cuoc_hen_id BIGINT UNSIGNED NULL,
  loai_thong_bao VARCHAR(50) NOT NULL,
  tieu_de VARCHAR(255) NOT NULL,
  noi_dung TEXT NOT NULL,
  thoi_gian_doc DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_thong_bao_nguoi FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_thong_bao_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
  CONSTRAINT fk_thong_bao_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
  CONSTRAINT fk_thong_bao_cuoc_hen FOREIGN KEY (cuoc_hen_id, yeu_cau_id) REFERENCES cuoc_hen(id, yeu_cau_id),
  INDEX idx_thong_bao_hop_thu (nguoi_dung_id, thoi_gian_doc, created_at),
  CONSTRAINT chk_thong_bao_cuoc_hen CHECK (cuoc_hen_id IS NULL OR yeu_cau_id IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO danh_muc_do_vat (id, ten_danh_muc, bieu_tuong) VALUES
(1, 'Điện thoại', 'smartphone'),
(2, 'Laptop / Máy tính bảng', 'laptop'),
(3, 'Tai nghe', 'headphones'),
(4, 'Sạc / Cáp / Pin dự phòng', 'battery'),
(5, 'Ví', 'wallet'),
(6, 'Tiền mặt', 'banknote'),
(7, 'Giấy tờ / Thẻ', 'id-card'),
(8, 'Chìa khóa', 'key'),
(9, 'Balo / Túi xách', 'briefcase'),
(10, 'Đồ dùng học tập', 'book-open'),
(11, 'Trang phục / Phụ kiện', 'shirt'),
(12, 'Khác', 'box');

INSERT INTO dia_diem (id, ten_dia_diem) VALUES
(1, 'Thư viện'), (2, 'Nhà xe'), (3, 'Căn tin'), (4, 'Phòng học'),
(5, 'Phòng thực hành'), (6, 'Hội trường'), (7, 'Sân trường'), (8, 'Văn phòng Đoàn - Hội');

INSERT INTO cau_hoi
  (id, danh_muc_id, ma_cau_hoi, noi_dung, kieu_nhap, lua_chon, loai_tin,
   cong_khai, dung_xac_minh, thu_tu)
VALUES
(1, NULL, 'mau_chu_dao', 'Màu chủ đạo của đồ vật?', 'chon_mot',
 '[{"gia_tri":"den","nhan":"Đen"},{"gia_tri":"trang","nhan":"Trắng"},{"gia_tri":"xanh","nhan":"Xanh"},{"gia_tri":"do","nhan":"Đỏ"},{"gia_tri":"nau","nhan":"Nâu"},{"gia_tri":"khac","nhan":"Khác"}]',
 'ca_hai', 1, 1, 10),
(2, NULL, 'tinh_trang', 'Tình trạng bên ngoài của đồ vật?', 'van_ban', NULL, 'ca_hai', 1, 1, 20),
(3, NULL, 'dac_diem_rieng', 'Đồ vật có dấu hiệu riêng nào để xác minh chủ sở hữu?', 'van_ban', NULL, 'ca_hai', 0, 1, 30),
(4, 1, 'dien_thoai_hang', 'Hãng điện thoại?', 'chon_mot',
 '[{"gia_tri":"apple","nhan":"Apple"},{"gia_tri":"samsung","nhan":"Samsung"},{"gia_tri":"xiaomi","nhan":"Xiaomi"},{"gia_tri":"oppo","nhan":"OPPO"},{"gia_tri":"khac","nhan":"Khác"}]',
 'ca_hai', 1, 1, 40),
(5, 1, 'dien_thoai_model', 'Model điện thoại?', 'van_ban', NULL, 'ca_hai', 1, 1, 50),
(6, 1, 'dien_thoai_op', 'Đặc điểm của ốp điện thoại?', 'van_ban', NULL, 'ca_hai', 0, 1, 60),
(7, 5, 'vi_chat_lieu', 'Chất liệu của ví?', 'van_ban', NULL, 'ca_hai', 1, 1, 40),
(8, 5, 'vi_giay_to', 'Thông tin nhận dạng trên giấy tờ hoặc thẻ bên trong ví?', 'van_ban', NULL, 'ca_hai', 0, 1, 50),
(9, 6, 'tien_so_to', 'Có bao nhiêu tờ tiền?', 'so', NULL, 'ca_hai', 0, 1, 40),
(10, 8, 'chia_khoa_so_luong', 'Có bao nhiêu chìa khóa?', 'so', NULL, 'ca_hai', 1, 1, 40),
(11, 8, 'chia_khoa_moc', 'Móc khóa có đặc điểm gì?', 'van_ban', NULL, 'ca_hai', 0, 1, 50),
(12, 1, 'dien_thoai_lan_cuoi', 'Bạn nhìn thấy điện thoại lần cuối trong hoàn cảnh nào?', 'van_ban', NULL, 'bao_mat', 1, 0, 70),
(13, 1, 'dien_thoai_bat_tat', 'Khi nhặt được, điện thoại đang bật hay tắt?', 'chon_mot',
 '[{"gia_tri":"bat","nhan":"Đang bật"},{"gia_tri":"tat","nhan":"Đang tắt"}]',
 'nhat_duoc', 1, 0, 70);
