import FormField from './FormField'

export default function TruongCauHoi({ cauHoi, loaiForm, giaTri, khiThayDoi }) {
  const nhanLai = loaiForm === 'nhan_lai'
  const cauHinh = cauHoi.apDung[nhanLai ? 'nhat' : loaiForm]
  const batBuoc = nhanLai ? cauHinh.batBuocNhanLai : cauHinh.batBuoc
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const props = {
    label: <>{nhanLai ? cauHoi.nhanNhanLai : cauHoi.nhanDangTin}{batBuoc && <span className="text-rose-600" aria-hidden="true"> *</span>}</>,
    name: cauHoi.id, required: batBuoc, onChange: khiThayDoi, className: lopNhap,
    ...(giaTri === undefined ? { defaultValue: '' } : { value: giaTri }),
  }

  return (
    <div>
      {cauHoi.kieuNhap === 'chon_mot' ? (
        <FormField {...props} as="select">
          <option value="" disabled>Chọn một đáp án</option>
          {cauHoi.luaChon.map((muc) => <option key={muc.id} value={muc.id}>{muc.nhan}</option>)}
        </FormField>
      ) : cauHoi.kieuNhap === 'doan_van' ? (
        <FormField {...props} as="textarea" rows={3} maxLength={2000} placeholder="Nhập câu trả lời…" />
      ) : (
        <FormField {...props} type={cauHoi.kieuNhap === 'so' ? 'number' : 'text'} step={cauHoi.kieuNhap === 'so' ? 'any' : undefined} placeholder="Nhập câu trả lời…" />
      )}
      {!nhanLai && !cauHinh.congKhai && <p className="mt-2 text-xs leading-5 text-[#718276]">Câu trả lời này được giữ kín trên tin đăng.</p>}
    </div>
  )
}
