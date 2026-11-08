-- Run on the existing database only; preserves IDs, passwords and related records.
-- Expand before converting legacy values, then restrict to the two current roles.
ALTER TABLE nguoi_dung MODIFY vai_tro
    ENUM('sinh_vien','giang_vien','nguoi_dung','quan_tri') NOT NULL DEFAULT 'nguoi_dung';
UPDATE nguoi_dung SET vai_tro = 'nguoi_dung'
    WHERE vai_tro IN ('sinh_vien','giang_vien');
ALTER TABLE nguoi_dung MODIFY vai_tro
    ENUM('nguoi_dung','quan_tri') NOT NULL DEFAULT 'nguoi_dung';
