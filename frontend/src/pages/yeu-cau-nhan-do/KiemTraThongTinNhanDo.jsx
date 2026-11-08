import { ArrowLeft, ArrowRight, Mail, PencilLine, Phone, UserRound } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import useThongTinCaNhan from '../trang-ca-nhan/hooks/useThongTinCaNhan'
import { CAC_TRUONG_HO_SO } from '../trang-ca-nhan/hooks/xuLyHoSo'
import XacNhanHoSo from '../trang-ca-nhan/XacNhanHoSo'

const cacTruongLienHe = [
  ['ho_ten', UserRound],
  ['so_dien_thoai', Phone],
  ['email', Mail],
].map(([ten, BieuTuong]) => ({ truong: CAC_TRUONG_HO_SO.find(({ name }) => name === ten), BieuTuong }))

export default function KiemTraThongTinNhanDo() {
  const { duongDanQuayLai, tieuDeTrang, yeuCauGui } = useOutletContext()
  const hoSo = useThongTinCaNhan()

  return (
    <>
      <h1 ref={tieuDeTrang} tabIndex={-1} className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">Kiểm tra thông tin người yêu cầu</h1>
      <section className="space-y-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-base leading-7 text-[#607568]">{hoSo.dangSua ? 'Những thay đổi sẽ được lưu vào hồ sơ của bạn.' : 'Xem lại thông tin từ hồ sơ của bạn trước khi tiếp tục.'}</p>
          {!hoSo.dangSua && (
            <button type="button" onClick={hoSo.batDauSua} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">
              <PencilLine className="h-4 w-4" aria-hidden="true" />Sửa thông tin
            </button>
          )}
        </div>

        {hoSo.dangSua ? (
          <form onSubmit={hoSo.luuHoSo} aria-busy={hoSo.dangLuu} className="space-y-6">
            <fieldset disabled={hoSo.dangLuu || Boolean(hoSo.thaoTacChoXacNhan)} className="min-w-0 space-y-6 [&_label]:text-lg!">
              {cacTruongLienHe.map(({ truong }) => (
                <FormField key={truong.name} {...truong} value={hoSo.duLieu[truong.name]} onChange={hoSo.doiTruong} className="h-14! text-lg!" />
              ))}
              {hoSo.emailThayDoi && (
                <div className="space-y-2">
                  <FormField label="Mật khẩu hiện tại" name="current_password" type="password" autoComplete="current-password" required maxLength={72} value={hoSo.matKhauEmail} onChange={(suKien) => hoSo.datMatKhauEmail(suKien.target.value)} className="h-14! text-lg!" />
                  <p className="text-sm leading-6 text-[#607568]">Cần xác nhận mật khẩu khi đổi email đăng nhập.</p>
                </div>
              )}
            </fieldset>
            <div className="flex flex-wrap justify-end gap-4">
              <button type="button" onClick={hoSo.huySua} disabled={hoSo.dangLuu} className="rounded-xl border border-emerald-200 px-5 py-3 font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-60">Hủy chỉnh sửa</button>
              <Button type="submit" disabled={hoSo.dangLuu} className="min-h-12 px-5">Lưu vào hồ sơ</Button>
            </div>
          </form>
        ) : (
          <dl className="divide-y divide-emerald-100 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 sm:px-6">
            {cacTruongLienHe.map(({ truong, BieuTuong }) => (
              <div key={truong.name} className="grid gap-2 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-baseline sm:gap-6 sm:py-6">
                <dt className="flex items-center gap-3 text-base font-semibold text-slate-600 sm:text-lg">
                  <BieuTuong className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />{truong.label}
                </dt>
                <dd className="text-lg font-normal text-emerald-950 [overflow-wrap:anywhere] sm:text-xl">{hoSo.user?.[truong.name] || 'Chưa cập nhật'}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {!hoSo.dangSua && (
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <Link to={duongDanQuayLai} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />Quay lại tin đăng
          </Link>
          <Button onClick={yeuCauGui} className="inline-flex min-h-12 items-center justify-center gap-2 px-5">Tiếp tục<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
        </div>
      )}
      {hoSo.thaoTacChoXacNhan && <XacNhanHoSo {...hoSo} />}
    </>
  )
}
