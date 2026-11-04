import FormField from './FormField'
import { layQuyTacCauHoi } from './quyTacCauHoi.js'

export default function TruongCauHoi({ cauHoi, loaiForm, giaTri, khiThayDoi }) {
  const nhanLai = loaiForm === 'nhan_lai'
  const { batBuoc, congKhai } = layQuyTacCauHoi(cauHoi)
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const props = {
    label: <>{cauHoi.nhanDangTin}{batBuoc && <span className="text-rose-600" aria-hidden="true"> *</span>}</>,
    name: cauHoi.id, required: batBuoc, onChange: khiThayDoi, className: lopNhap,
    ...(giaTri === undefined ? { defaultValue: '' } : { value: giaTri }),
  }

  return (
    <div>
      {cauHoi.kieuNhap === 'so'
        ? <FormField {...props} type="number" step="any" inputMode="decimal" placeholder="Nhập số…" />
        : <FormField {...props} as="textarea" rows={3} maxLength={2000} placeholder="Nhập câu trả lời…" />}
      {!nhanLai && !congKhai && <p className="mt-2 text-xs leading-5 text-[#718276]">Câu trả lời này được giữ kín trên tin đăng.</p>}
    </div>
  )
}
