import { useEffect, useRef, useState } from 'react'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import PhanTrang from '../../components/shared/PhanTrang'
import api, { prepareCsrf } from '../../services/api'

export default function CapNhatTinLienQuan({ henId }) {
  const [mo, datMo] = useState(false)
  const [trang, datTrang] = useState(1)
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState(null)
  const [tinChon, datTinChon] = useState(null)
  const [dangLuu, datDangLuu] = useState(false)
  const [loiLuu, datLoiLuu] = useState('')
  const [daLuu, datDaLuu] = useState(false)
  const khoaLuu = useRef(false)
  const khoa = `${henId}-${trang}-${lanTai}`
  const ketQua = nguon?.khoa === khoa ? nguon.data : null
  const loiTai = nguon?.khoa === khoa ? nguon.loi : ''
  const laBaoMat = ketQua?.loaiTin === 'lost'

  useEffect(function taiTinLienQuan() {
    const yeuCau = new AbortController()
    api.get(`/me/cuoc-hen/${henId}/tin-lien-quan`, { params: { trang }, signal: yeuCau.signal })
      .then(({ data }) => {
        if (!yeuCau.signal.aborted) datNguon({ khoa, data })
      }).catch((loi) => {
        if (!yeuCau.signal.aborted) datNguon({ khoa, loi: loi.response?.data?.message || 'Chưa tải được bài đăng liên quan.' })
      })
    return () => yeuCau.abort()
  }, [henId, trang, khoa])

  function dongForm() {
    if (khoaLuu.current) return
    datMo(false)
    datTinChon(null)
    datLoiLuu('')
  }

  async function luu(suKien) {
    suKien.preventDefault()
    if (!tinChon || khoaLuu.current) return
    khoaLuu.current = true
    datDangLuu(true)
    datLoiLuu('')
    try {
      await prepareCsrf()
      await api.post(`/me/cuoc-hen/${henId}/tin-lien-quan`, { tinId: tinChon.id })
      datDaLuu(true)
      datMo(false)
    } catch (loi) {
      datLoiLuu(loi.response?.data?.message || 'Chưa cập nhật được bài đăng. Vui lòng thử lại.')
      if (loi.response?.status === 409) {
        datTinChon(null)
        datLanTai((lan) => lan + 1)
      }
    } finally {
      khoaLuu.current = false
      datDangLuu(false)
    }
  }

  if (ketQua && !ketQua.coTheCapNhat) return null
  if (daLuu || ketQua?.daLienKet) return <p role="status" className="text-sm text-emerald-800">Bài đăng liên quan đã được cập nhật.</p>

  return (
    <section className="space-y-3 rounded-2xl border border-emerald-100 bg-[#f5faf7] p-5">
      <h2 className="font-bold text-emerald-950">Cập nhật bài đăng liên quan</h2>
      {loiTai && !mo ? <p role="alert" className="text-sm text-rose-700">{loiTai} <button type="button" onClick={() => datLanTai((lan) => lan + 1)} className="underline">Thử lại</button></p>
        : !ketQua ? <p role="status" className="text-sm text-[#607568]">Đang tải bài đăng…</p>
          : !ketQua.meta.tongTin ? <p className="text-sm text-[#607568]">Bạn chưa có bài {laBaoMat ? 'báo mất' : 'nhặt được'} phù hợp để cập nhật.</p>
            : <>
              <p className="text-sm leading-6 text-[#526c5b]">Bạn có bài {laBaoMat ? 'báo mất về món đồ vừa nhận' : 'nhặt được về món đồ vừa trả'} không?</p>
              <Button onClick={() => datMo(true)} aria-haspopup="dialog">Chọn bài đăng</Button>
            </>}
      {mo && <HopThoai rong tieuDe="Cập nhật bài đăng liên quan" moTa="Chọn đúng bài đăng của bạn để đánh dấu đồ vật đã được giao nhận." khiDong={dongForm}>
        <form onSubmit={luu} className="space-y-4 p-5 sm:p-6">
          {loiLuu && <p role="alert" className="text-sm text-rose-700">{loiLuu}</p>}
          {loiTai ? <p role="alert" className="text-sm text-rose-700">{loiTai} <button type="button" onClick={() => datLanTai((lan) => lan + 1)} className="underline">Thử lại</button></p>
            : !ketQua ? <p role="status">Đang tải bài đăng…</p>
              : <>
                <fieldset disabled={dangLuu} className="max-h-[50dvh] space-y-3 overflow-y-auto">
                  <legend className="sr-only">Bài đăng {laBaoMat ? 'báo mất' : 'nhặt được'} của bạn</legend>
                  {!ketQua.data.length && <p className="text-sm text-[#607568]">Không còn bài đăng phù hợp để cập nhật.</p>}
                  {ketQua.data.map((tin) => <label key={tin.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ceded3] p-3 has-checked:border-emerald-700 has-checked:bg-emerald-50">
                    <input type="radio" name="tinLienQuan" value={tin.id} checked={tinChon?.id === tin.id} onChange={() => datTinChon(tin)} className="accent-emerald-800" />
                    <img src={tin.imageUrl} alt="" className="h-16 w-20 shrink-0 rounded-lg bg-white object-cover" />
                    <span className="min-w-0"><span className="block break-words text-sm font-semibold text-emerald-950">{tin.title}</span><span className="mt-1 block text-xs text-[#607568]">{tin.referenceCode} · {tin.date}</span></span>
                  </label>)}
                </fieldset>
                {ketQua.meta.tongTrang > 1 && <PhanTrang {...ketQua.meta} hienThongKe={false} chuyenTrang={(moi) => { if (!khoaLuu.current) { datTinChon(null); datTrang(moi) } }} />}
              </>}
          {tinChon && <p className="text-sm leading-6 text-[#526c5b]">Bài “{tinChon.title}” sẽ chuyển sang Đã hoàn tất sau khi bạn xác nhận.</p>}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#e1eae4] pt-4">
            <button type="button" onClick={dongForm} disabled={dangLuu} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b]">Để sau</button>
            <Button type="submit" disabled={dangLuu || !tinChon || !ketQua}>{dangLuu ? 'Đang cập nhật…' : 'Đánh dấu hoàn tất'}</Button>
          </div>
        </form>
      </HopThoai>}
    </section>
  )
}
