import { useState } from 'react'
import HopThoai from '../../components/shared/HopThoai'
import Button from '../../components/shared/Button'

export default function XemTruocAnhDaiDien({ urlAnh, dangTai, loiTaiAnh, khiDong, khiXacNhan }) {
  const [sanSang, datSanSang] = useState(false)
  const [loi, datLoi] = useState('')

  function anhDaTai(suKien) {
    const { naturalWidth: rong, naturalHeight: cao } = suKien.currentTarget
    if (!rong || !cao || rong > 4096 || cao > 4096) {
      datLoi('Chọn ảnh có chiều rộng và chiều cao không quá 4096 pixel.')
      return
    }
    datSanSang(true)
  }

  function dongHopThoai() {
    if (!dangTai) khiDong()
  }

  return (
    <HopThoai tieuDe="Xem trước ảnh đại diện" khiDong={dongHopThoai}>
      <div className="space-y-5 p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl bg-[#f0f6f2] p-2">
          <img src={urlAnh} alt="Ảnh đại diện sắp đổi" onLoad={anhDaTai} onError={() => datLoi('Không đọc được ảnh. Vui lòng chọn ảnh khác.')} className="h-80 max-h-[45dvh] w-full object-contain" />
        </div>
        {(loi || loiTaiAnh) && <p role="alert" className="text-sm text-rose-700">{loi || loiTaiAnh}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6">
        <button type="button" disabled={dangTai} onClick={dongHopThoai} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] disabled:opacity-50">Hủy</button>
        <Button onClick={khiXacNhan} disabled={dangTai || !sanSang || Boolean(loi)}>{dangTai ? 'Đang lưu…' : 'Xác nhận'}</Button>
      </div>
    </HopThoai>
  )
}
