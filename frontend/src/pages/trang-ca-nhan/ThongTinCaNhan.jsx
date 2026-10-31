import { KeyRound, PencilLine, Save, UserRound } from 'lucide-react'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import KhungThongTin from '../../components/shared/KhungThongTin'
import DoiMatKhau from './DoiMatKhau'
import useThongTinCaNhan from './hooks/useThongTinCaNhan'
import { CAC_TRUONG_HO_SO } from './hooks/xuLyHoSo'

export default function ThongTinCaNhan() {
  const hoSo = useThongTinCaNhan()

  return (
    <div className="space-y-6">
      <KhungThongTin tieuDe="Thông tin cá nhân" bieuTuong={UserRound}>
        <p className="text-sm leading-6 text-[#607568]">Thông tin tài khoản và liên hệ của bạn.</p>
        <form onSubmit={hoSo.luuHoSo} className="mt-6" aria-busy={hoSo.dangLuu}>
          <fieldset disabled={hoSo.dangLuu} className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
            {CAC_TRUONG_HO_SO.map((truong) => <FormField key={truong.name} {...truong} value={hoSo.dangSua ? hoSo.duLieu[truong.name] : hoSo.user?.[truong.name] ?? ''} onChange={hoSo.doiTruong} readOnly={!hoSo.dangSua} placeholder="Chưa có thông tin" className="read-only:bg-[#f8fbf9] read-only:text-[#526c5b]" />)}
            {hoSo.dangSua && hoSo.emailThayDoi && <div className="space-y-2 sm:col-span-2"><FormField label="Mật khẩu hiện tại" name="current_password" type="password" autoComplete="current-password" required maxLength={72} value={hoSo.matKhauEmail} onChange={(suKien) => hoSo.datMatKhauEmail(suKien.target.value)} /><p className="text-xs leading-5 text-[#607568]">Xác nhận mật khẩu hiện tại khi thay đổi email đăng nhập.</p></div>}
          </fieldset>
          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-[#e4ece7] pt-5">
            {hoSo.dangSua ? <>
              <button type="button" onClick={hoSo.huySua} disabled={hoSo.dangLuu} className="rounded-xl border border-[#ceded3] px-4 py-2 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 disabled:opacity-60">Hủy chỉnh sửa</button>
              <Button type="submit" disabled={hoSo.dangLuu} className="inline-flex items-center justify-center gap-2"><Save className="h-4 w-4" aria-hidden="true" />{hoSo.dangLuu ? 'Đang lưu…' : 'Lưu thay đổi'}</Button>
            </> : <Button onClick={hoSo.batDauSua} className="inline-flex items-center justify-center gap-2"><PencilLine className="h-4 w-4" aria-hidden="true" />Chỉnh sửa thông tin</Button>}
          </div>
        </form>
      </KhungThongTin>

      <KhungThongTin tieuDe="Bảo mật tài khoản" bieuTuong={KeyRound}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-semibold text-[#315a43]">Mật khẩu</h3><p className="mt-1 text-sm leading-6 text-[#607568]">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p></div>
          <Button onClick={hoSo.moHopThoaiMatKhau} className="shrink-0 self-start">Đổi mật khẩu</Button>
        </div>
      </KhungThongTin>
      {hoSo.moDoiMatKhau && <DoiMatKhau khiDong={hoSo.dongHopThoaiMatKhau} khiLuu={hoSo.doiMatKhau} dangLuu={hoSo.dangDoiMatKhau} loi={hoSo.loiMatKhau} />}
    </div>
  )
}
