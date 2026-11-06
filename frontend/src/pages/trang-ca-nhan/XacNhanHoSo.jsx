import { useEffect, useRef } from 'react'
import HopThoai from '../../components/shared/HopThoai'
import Button from '../../components/shared/Button'
import { CAC_TRUONG_HO_SO, chuanHoaHoSo } from './hooks/xuLyHoSo'

export default function XacNhanHoSo({ user, thaoTacChoXacNhan, dangLuu, loiXacNhan, dongXacNhan, xacNhanThaoTac }) {
  const laHuy = thaoTacChoXacNhan.loai === 'huy'
  const hoSoCu = chuanHoaHoSo(user)
  const nutHuy = useRef(null)

  useEffect(function tapTrungNutHuy() {
    nutHuy.current?.focus()
  }, [])

  return (
    <HopThoai tieuDe={laHuy ? 'Bỏ thay đổi?' : 'Xác nhận lưu thông tin'} moTa={laHuy ? 'Những thông tin vừa chỉnh sửa sẽ không được lưu.' : 'Bạn có muốn lưu các thay đổi dưới đây?'} khiDong={dongXacNhan}>
      <div aria-busy={dangLuu}>
        {!laHuy && <dl className="space-y-4 px-5 py-5 sm:px-6">
          {CAC_TRUONG_HO_SO.filter(({ name }) => thaoTacChoXacNhan.duLieu[name] !== hoSoCu[name]).map(({ name, label }) => <div key={name} className="space-y-1">
            <dt className="text-sm font-semibold text-[#243c30]">{label}</dt>
            <dd className="break-words text-sm leading-6 text-[#607568]"><span>{hoSoCu[name] || 'Chưa có thông tin'}</span><span aria-hidden="true"> → </span><span className="sr-only"> đổi thành </span><strong className="font-semibold text-emerald-900">{thaoTacChoXacNhan.duLieu[name] || 'Để trống'}</strong></dd>
          </div>)}
        </dl>}
        {loiXacNhan && <p role="alert" className="px-5 py-4 text-sm leading-6 text-rose-700 sm:px-6">{loiXacNhan}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6">
          <button ref={nutHuy} type="button" disabled={dangLuu} onClick={dongXacNhan} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50">{laHuy ? 'Tiếp tục chỉnh sửa' : 'Hủy'}</button>
          {laHuy ? <button type="button" onClick={xacNhanThaoTac} className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-rose-700">Bỏ thay đổi</button> : <Button onClick={xacNhanThaoTac} disabled={dangLuu}>{dangLuu ? 'Đang lưu…' : 'Xác nhận lưu'}</Button>}
        </div>
      </div>
    </HopThoai>
  )
}
