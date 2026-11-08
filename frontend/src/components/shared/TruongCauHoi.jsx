import FormField from './FormField'

export default function TruongCauHoi({ cauHoi, giaTri, khiThayDoi }) {
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const props = {
    label: <>{cauHoi.nhanDangTin}<span className="text-rose-600" aria-hidden="true"> *</span></>,
    name: cauHoi.id, required: true, onChange: khiThayDoi, className: lopNhap,
    ...(giaTri === undefined ? { defaultValue: '' } : { value: giaTri }),
  }

  return (
    <div>
      {cauHoi.kieuNhap === 'so'
        ? <FormField {...props} type="number" step="any" inputMode="decimal" placeholder="Nhập số…" />
        : <FormField {...props} as="textarea" rows={3} maxLength={2000} placeholder="Nhập câu trả lời…" />}
    </div>
  )
}
