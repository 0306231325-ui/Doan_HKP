import { useEffect, useRef } from 'react'
import { Link, Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import Button from '../../components/shared/Button'
import useAnhBieuMau from '../../components/shared/hooks/useAnhBieuMau'
import useGuiYeuCauNhanDo from './hooks/useGuiYeuCauNhanDo'

export default function YeuCauNhanDo() {
  const [thamSo] = useSearchParams()
  const idTin = thamSo.get('id') || ''
  const { user } = useAuth()

  return <QuyTrinhNhanDo key={`${user?.id}:${idTin}`} idTin={idTin} />
}

function QuyTrinhNhanDo({ idTin }) {
  const yeuCau = useGuiYeuCauNhanDo(idTin)
  const anhBieuMau = useAnhBieuMau()
  const { buoc, dangGui, duongDanVeBuoc } = yeuCau
  const buocTruoc = useRef(buoc)
  const tieuDeTrang = useRef(null)
  const duongDanQuayLai = yeuCau.idTin ? `/chi-tiet-tin-dang?id=${yeuCau.idTin}` : '/danh-sach-do'
  const nhanQuayLai = yeuCau.idTin ? 'Quay lại tin đăng' : 'Quay lại danh sách tin'
  const KhungBuoc = buoc === 1 ? 'div' : 'form'

  useEffect(function tapTrungBuoc() {
    if (buocTruoc.current === buoc || duongDanVeBuoc) return
    buocTruoc.current = buoc
    window.scrollTo(0, 0)
    tieuDeTrang.current?.focus({ preventScroll: true })
  }, [buoc, duongDanVeBuoc])

  if (duongDanVeBuoc) return <Navigate to={duongDanVeBuoc} replace />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {(buoc > 1 || !yeuCau.tin || yeuCau.daGui) && <Link to={duongDanQuayLai} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{nhanQuayLai}</Link>}
      {!yeuCau.tin && <h1 className="text-3xl font-extrabold text-emerald-950">Yêu cầu nhận lại đồ</h1>}
      {yeuCau.dangTai && <p role="status" className="rounded-2xl bg-white p-6 text-sm text-[#607568]">Đang tải câu hỏi của tin đăng…</p>}
      {yeuCau.loiTai && (
        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6">
          <p role="alert">{yeuCau.loiTai}</p>
          {yeuCau.coTheTaiLai && <Button onClick={yeuCau.taiLai}>Thử lại</Button>}
        </div>
      )}
      {yeuCau.tin && (yeuCau.daGui ? (
        <section className="space-y-3 rounded-2xl bg-white p-6">
          <h1 className="text-xl font-bold">Bạn đã gửi yêu cầu</h1>
          <p className="text-sm text-[#607568]">Quản trị viên sẽ xử lý yêu cầu của bạn.</p>
          <Link to={duongDanQuayLai} className="font-semibold text-emerald-800 underline">{nhanQuayLai}</Link>
        </section>
      ) : (
        <KhungBuoc onSubmit={buoc > 1 ? yeuCau.yeuCauGui : undefined} className="min-w-0 space-y-6">
          <p className="text-sm font-semibold text-emerald-800">Yêu cầu nhận lại đồ · Bước {buoc}/3</p>
          <Outlet context={{ ...yeuCau, duongDanQuayLai, anhBieuMau, tieuDeTrang }} />
          {yeuCau.loi && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{yeuCau.loi}</p>}
          {buoc > 1 && (
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
              <button type="button" onClick={yeuCau.quayLaiBuocTruoc} disabled={dangGui} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-60">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />Quay lại bước {buoc - 1}
              </button>
              <Button type="submit" disabled={dangGui} className="inline-flex min-h-12 items-center justify-center gap-2 px-5">
                {buoc === 2 ? <>Tiếp tục<ArrowRight className="h-4 w-4" aria-hidden="true" /></> : <><Send className="h-4 w-4" aria-hidden="true" />Gửi yêu cầu nhận lại đồ</>}
              </Button>
            </div>
          )}
        </KhungBuoc>
      ))}
    </div>
  )
}
