import FormField from '../shared/FormField'

export default function TruongNoiDungTinDang({ duLieu, diaDiem, ngayToiDa, doiTruong, dangTaiDiaDiem = false }) {
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  return (
    <>
      <FormField label="Tiêu đề *" name="tieuDe" value={duLieu.tieuDe} onChange={doiTruong} required maxLength={150} placeholder={duLieu.loaiTin === 'found' ? 'Ví dụ: Nhặt được ví ở thư viện' : 'Ví dụ: Mất tai nghe tại sân trường'} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
        <FormField label={duLieu.loaiTin === 'found' ? 'Ngày nhặt được *' : 'Ngày bị mất *'} name="ngayXayRa" type="date" value={duLieu.ngayXayRa} onChange={doiTruong} max={ngayToiDa} required />
        <FormField label="Giờ (không bắt buộc)" name="gioXayRa" type="time" value={duLieu.gioXayRa ?? ''} onChange={doiTruong} />
        <FormField as="select" label="Khu vực" name="diaDiemId" value={duLieu.diaDiemId} onChange={doiTruong} disabled={dangTaiDiaDiem} className={lopNhap}>
          <option value="">Chọn khu vực (không bắt buộc)</option>
          {diaDiem.map((noi) => <option key={noi.id} value={noi.id}>{noi.name}</option>)}
        </FormField>
      </div>
      <FormField label="Vị trí cụ thể *" name="diaDiemChiTiet" value={duLieu.diaDiemChiTiet} onChange={doiTruong} required maxLength={255} placeholder="Ví dụ: Bàn đọc tầng 2, thư viện" />
      <FormField as="textarea" label="Mô tả thêm về đồ vật" name="moTa" rows={3} value={duLieu.moTa} onChange={doiTruong} maxLength={2000} placeholder="Mô tả màu sắc, kiểu dáng hoặc tình trạng của đồ vật." className={lopNhap} />
    </>
  )
}
