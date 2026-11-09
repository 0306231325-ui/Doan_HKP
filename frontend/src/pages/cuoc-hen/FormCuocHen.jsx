import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import Button from '../../components/shared/Button'

export default function FormCuocHen({ cacDiaDiem, khiXemLai, khiHuy, giaTriBanDau, nhanXemLai = 'Xem lại cuộc hẹn', nhanHuy = 'Hủy' }) {
  const kieuTruong = 'mt-2 w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  function xemLai(event) {
    event.preventDefault()
    if (!khiXemLai) return
    const form = event.currentTarget
    const data = new FormData(form)
    const ngay = data.get('ngay')
    const gio = data.get('gio')
    const batDau = Date.parse(`${ngay}T${gio}+07:00`)
    if (!Number.isFinite(batDau) || batDau < Math.floor(Date.now() / 60_000) * 60_000) {
      form.elements.gio.setCustomValidity('Vui lòng chọn giờ hẹn từ thời điểm hiện tại trở đi.')
      form.elements.gio.reportValidity()
      return
    }
    khiXemLai({ ngay, gio, batDau, diaDiem: cacDiaDiem.find((muc) => muc.id === data.get('diaDiem')) })
  }

  return <form onSubmit={xemLai}>
    <fieldset className="space-y-6 p-5 sm:p-7">
      <legend className="sr-only">Thời gian và địa điểm gặp</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#243c30]">
          <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#718276]" aria-hidden="true" />Ngày gặp <span className="text-red-600" aria-hidden="true">*</span></span>
          <input name="ngay" type="date" required defaultValue={giaTriBanDau?.ngay || ''} className={kieuTruong} onChange={(event) => event.currentTarget.form.elements.gio.setCustomValidity('')} />
        </label>
        <label className="block text-sm font-semibold text-[#243c30]">
          <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#718276]" aria-hidden="true" />Giờ gặp (giờ Việt Nam) <span className="text-red-600" aria-hidden="true">*</span></span>
          <input name="gio" type="time" required defaultValue={giaTriBanDau?.gio || ''} className={kieuTruong} onChange={(event) => event.currentTarget.setCustomValidity('')} />
        </label>
      </div>
      <label className="block text-sm font-semibold text-[#243c30]">
        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#718276]" aria-hidden="true" />Địa điểm gặp <span className="text-red-600" aria-hidden="true">*</span></span>
        <select name="diaDiem" required defaultValue={giaTriBanDau?.diaDiem.id || ''} className={kieuTruong}>
          <option value="" disabled>{cacDiaDiem.length ? 'Chọn địa điểm trong trường' : 'Chưa có địa điểm để chọn'}</option>
          {cacDiaDiem.map((muc) => <option key={muc.id} value={muc.id}>{muc.ten}</option>)}
        </select>
        <span className="mt-2 block text-xs font-normal leading-5 text-[#718276]">Ưu tiên khu vực công cộng, thuận tiện cho cả hai bên.</span>
      </label>
    </fieldset>
    <div className="flex flex-wrap justify-end gap-3 rounded-b-3xl border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-7">
      <button type="button" onClick={khiHuy} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">{nhanHuy}</button>
      <Button type="submit" disabled={!khiXemLai || !cacDiaDiem.length}>{nhanXemLai}</Button>
    </div>
  </form>
}
