import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import Button from '../../components/shared/Button'
import { layNgayVietNam } from '../admin/tong-quan/hooks/xuLyThongKe.js'
import './form-cuoc-hen.css'

const cacGio = Array.from({ length: 24 }, (_, gio) => String(gio).padStart(2, '0'))
const cacPhut = Array.from({ length: 60 }, (_, phut) => String(phut).padStart(2, '0'))
const dinhDangGio = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

function kiemTraThoiGianHen(ngay, gio, bayGio = Date.now()) {
  if (ngay && ngay < layNgayVietNam(bayGio)) {
    return { loi: { truong: 'ngay', noiDung: 'Ngày gặp không được ở quá khứ.' } }
  }
  if (!ngay || !gio) return {}

  const batDau = Date.parse(`${ngay}T${gio}+07:00`)
  if (!Number.isFinite(batDau) || batDau < Math.floor(bayGio / 60_000) * 60_000) {
    return { loi: { truong: 'gio', noiDung: 'Vui lòng chọn giờ hẹn từ thời điểm hiện tại trở đi.' } }
  }
  return { batDau }
}

export default function FormCuocHen({ cacDiaDiem, khiXemLai, khiHuy, giaTriBanDau, nhanXemLai = 'Xem lại cuộc hẹn', nhanHuy = 'Hủy', dangGui = false }) {
  const kieuTruong = 'mt-2 w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const [ngay, datNgay] = useState(giaTriBanDau?.ngay || '')
  const [gio, datGio] = useState(giaTriBanDau?.gio?.slice(0, 2) || '')
  const [phut, datPhut] = useState(giaTriBanDau?.gio?.slice(3) || '')
  const [bayGio, datBayGio] = useState(Date.now)
  const maLoi = useId()
  const homNay = layNgayVietNam(bayGio)
  const [gioHienTai, phutHienTai] = dinhDangGio.format(bayGio).split(':')
  const chonHomNay = ngay === homNay
  const gioHen = gio && phut ? `${gio}:${phut}` : ''
  const { loi: loiThoiGian } = kiemTraThoiGianHen(ngay, gioHen, bayGio)
  const loiNgay = loiThoiGian?.truong === 'ngay'
  const loiGio = loiThoiGian?.truong === 'gio'

  useEffect(() => {
    let henGio
    function capNhatDongHo() {
      window.clearTimeout(henGio)
      const lucNay = Date.now()
      datBayGio(lucNay)
      henGio = window.setTimeout(capNhatDongHo, 60_000 - lucNay % 60_000)
    }
    henGio = window.setTimeout(capNhatDongHo, 60_000 - Date.now() % 60_000)
    window.addEventListener('focus', capNhatDongHo)
    return () => {
      window.clearTimeout(henGio)
      window.removeEventListener('focus', capNhatDongHo)
    }
  }, [])

  function xemLai(event) {
    event.preventDefault()
    if (!khiXemLai || dangGui) return
    const form = event.currentTarget
    const data = new FormData(form)
    const lucGui = Date.now()
    const { batDau, loi } = kiemTraThoiGianHen(ngay, gioHen, lucGui)
    datBayGio(lucGui)
    if (loi) {
      form.elements[loi.truong].focus()
      return
    }
    khiXemLai({ ngay, gio: gioHen, batDau, diaDiem: cacDiaDiem.find((muc) => muc.id === data.get('diaDiem')) })
  }

  return <form onSubmit={xemLai}>
    <fieldset disabled={dangGui} className="space-y-6 p-5 sm:p-7">
      <legend className="sr-only">Thời gian và địa điểm gặp</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[#243c30]">
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#718276]" aria-hidden="true" />Ngày gặp <span className="text-red-600" aria-hidden="true">*</span></span>
            <input name="ngay" type="date" required min={homNay} value={ngay} className={kieuTruong} onChange={(event) => datNgay(event.target.value)} aria-invalid={loiNgay || undefined} aria-describedby={loiNgay ? maLoi : undefined} />
          </label>
          {loiNgay && <p id={maLoi} role="alert" className="mt-2 text-sm text-rose-700">{loiThoiGian.noiDung}</p>}
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#243c30]"><Clock3 className="h-4 w-4 text-[#718276]" aria-hidden="true" />Giờ gặp (giờ Việt Nam) <span className="text-red-600" aria-hidden="true">*</span></div>
          <div className="grid grid-cols-2 gap-3">
            <select name="gio" aria-label="Giờ gặp (giờ Việt Nam)" required value={gio} className={`${kieuTruong} chon-gio-hen`} onChange={(event) => datGio(event.target.value)} aria-invalid={loiGio || undefined} aria-describedby={loiGio ? maLoi : undefined}>
              <option value="" disabled>Giờ</option>
              {cacGio.map((muc) => <option key={muc} value={muc} disabled={chonHomNay && muc < gioHienTai}>{muc}</option>)}
            </select>
            <select name="phut" aria-label="Phút gặp" required value={phut} className={`${kieuTruong} chon-gio-hen`} onChange={(event) => datPhut(event.target.value)} aria-invalid={loiGio || undefined} aria-describedby={loiGio ? maLoi : undefined}>
              <option value="" disabled>Phút</option>
              {cacPhut.map((muc) => <option key={muc} value={muc} disabled={chonHomNay && gio !== '' && `${gio}:${muc}` < `${gioHienTai}:${phutHienTai}`}>{muc}</option>)}
            </select>
          </div>
          {loiGio && <p id={maLoi} role="alert" className="mt-2 text-sm text-rose-700">{loiThoiGian.noiDung}</p>}
        </div>
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
      <button type="button" onClick={khiHuy} disabled={dangGui} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50">{nhanHuy}</button>
      <Button type="submit" disabled={dangGui || !khiXemLai || !cacDiaDiem.length}>{dangGui ? 'Đang tạo cuộc hẹn…' : nhanXemLai}</Button>
    </div>
  </form>
}
