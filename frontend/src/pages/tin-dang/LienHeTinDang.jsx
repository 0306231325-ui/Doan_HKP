import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function LienHeTinDang({ tin }) {
  const { id, laChuTin, contactPhone, contactEmail } = tin
  const [dangMo, datDangMo] = useState(false)
  const [ketQua, datKetQua] = useState(null)
  const BieuTuong = dangMo ? EyeOff : Eye
  const nhanNut = dangMo ? 'Che thông tin liên hệ' : 'Hiện thông tin liên hệ đầy đủ'
  const lienHe = laChuTin && dangMo ? ketQua?.lienHe : null
  const cacTruong = [
    ['Số điện thoại', lienHe ? lienHe.soDienThoai : contactPhone],
    ['Email / Gmail', lienHe ? lienHe.email : contactEmail],
  ]

  useEffect(function napLienHe() {
    if (!laChuTin || !dangMo) return
    const yeuCau = new AbortController()
    api.get(`/tin-dang/${id}/lien-he`, { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQua({ lienHe: data.data })
    }).catch(() => {
      if (!yeuCau.signal.aborted) datKetQua({ loi: 'Không tải được liên hệ. Bấm ẩn rồi mở lại để thử.' })
    })
    return () => yeuCau.abort()
  }, [dangMo, id, laChuTin])

  function doiHienThi() {
    datKetQua(null)
    datDangMo(!dangMo)
  }

  return (
    <div className="mt-4">
      {laChuTin && (
        <button type="button" aria-pressed={dangMo} aria-label="Hiện thông tin liên hệ đầy đủ" title={nhanNut} onClick={doiHienThi} className="mb-3 inline-flex size-11 items-center justify-center rounded-xl border border-[#ceded3] text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          <BieuTuong className="size-5" aria-hidden="true" />
        </button>
      )}
      <dl className="grid gap-3 sm:grid-cols-2">
        {cacTruong.map(([nhan, giaTri]) => (
          <div key={nhan} className="space-y-1 rounded-xl bg-[#f7faf8] p-4 text-sm">
            <dt className="text-[#718276]">{nhan}</dt>
            <dd className="break-words font-medium text-[#315a43]">{giaTri || 'Không cung cấp'}</dd>
          </div>
        ))}
      </dl>
      {laChuTin && dangMo && !ketQua && <p role="status" className="mt-3 text-sm text-[#607568]">Đang tải thông tin liên hệ…</p>}
      {laChuTin && dangMo && ketQua?.loi && <p role="alert" className="mt-3 text-sm text-rose-700">{ketQua.loi}</p>}
    </div>
  )
}
