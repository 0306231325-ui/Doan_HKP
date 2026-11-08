import { ImagePlus, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import HopThoai from '../../components/shared/HopThoai'

const lopNut = 'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50'

export default function QuanLyAnhDaiDien({ user, oChonAnh, hopThoaiAnh, dangTai, loiTaiAnh, dongQuanLyAnh, doiXacNhanGoAnh, moChonAnh, chonAnh, xacNhanAnhDaiDien }) {
  const coAnh = Boolean(user?.anh_dai_dien)
  const xacNhanGo = hopThoaiAnh === 'go-anh'
  const nutHuy = useRef(null)

  useEffect(function tapTrungThaoTac() {
    if (xacNhanGo) nutHuy.current?.focus()
  }, [xacNhanGo])

  return (
    <HopThoai tieuDe={xacNhanGo ? 'Gỡ ảnh đại diện?' : 'Ảnh đại diện'} moTa={xacNhanGo ? 'Hồ sơ của bạn sẽ dùng biểu tượng mặc định sau khi gỡ ảnh.' : undefined} khiDong={dongQuanLyAnh}>
      <div className="space-y-3 p-5 sm:p-6" aria-busy={dangTai}>
        {xacNhanGo ? (
          <div className="flex flex-wrap justify-end gap-3">
            <button ref={nutHuy} type="button" disabled={dangTai} onClick={doiXacNhanGoAnh} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50">Hủy</button>
            <button type="button" disabled={dangTai} onClick={xacNhanAnhDaiDien} className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:opacity-50">{dangTai ? 'Đang gỡ ảnh…' : 'Xác nhận gỡ ảnh'}</button>
          </div>
        ) : (
          <>
            <button type="button" onClick={moChonAnh} className={`${lopNut} border-[#ceded3] text-emerald-900 hover:bg-emerald-50 focus-visible:outline-emerald-700`}>
              <ImagePlus className="size-5" aria-hidden="true" />{coAnh ? 'Thay đổi ảnh đại diện' : 'Thêm ảnh đại diện'}
            </button>
            <input ref={oChonAnh} type="file" accept="image/jpeg,image/png,image/webp" onChange={chonAnh} className="hidden" aria-label="Chọn ảnh đại diện" />
            {coAnh && <button type="button" onClick={doiXacNhanGoAnh} className={`${lopNut} border-rose-200 text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-700`}>
              <Trash2 className="size-5" aria-hidden="true" />Gỡ ảnh đại diện
            </button>}
          </>
        )}
        {loiTaiAnh && <p role="alert" className="text-sm text-rose-700">{loiTaiAnh}</p>}
      </div>
    </HopThoai>
  )
}
