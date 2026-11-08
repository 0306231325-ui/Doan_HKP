import { useEffect, useRef } from 'react'
import { LogOut } from 'lucide-react'
import HopThoai from '../components/shared/HopThoai'

export default function XacNhanDangXuat({ dangXuLy, loi, dongHopThoai, xacNhanDangXuat }) {
  const nutHuy = useRef(null)

  useEffect(function tapTrungNutHuy() {
    nutHuy.current?.focus()
  }, [])

  return (
    <HopThoai tieuDe="Đăng xuất" moTa="Bạn có chắc muốn đăng xuất khỏi tài khoản?" khiDong={dongHopThoai}>
      <div aria-busy={dangXuLy}>
        {loi && <p role="alert" className="px-5 py-4 text-sm text-rose-700 sm:px-6">{loi}</p>}
        <div className="flex justify-end gap-3 px-5 py-4 sm:px-6">
          <button ref={nutHuy} type="button" disabled={dangXuLy} onClick={dongHopThoai} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50">Hủy</button>
          <button type="button" disabled={dangXuLy} onClick={xacNhanDangXuat} className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-rose-700 disabled:opacity-50"><LogOut className="h-4 w-4" aria-hidden="true" />{dangXuLy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
        </div>
      </div>
    </HopThoai>
  )
}
