import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import HopThoai from '../../components/shared/HopThoai'

export default function DoiMatKhau({ khiDong, khiLuu, dangLuu, loi }) {
  return (
    <HopThoai tieuDe="Đổi mật khẩu" moTa="Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật tài khoản." khiDong={khiDong}>
      <form onSubmit={khiLuu} className="space-y-5 p-5 sm:p-6" aria-busy={dangLuu}>
        <fieldset disabled={dangLuu} className="space-y-5">
          <FormField label="Mật khẩu hiện tại" name="current_password" type="password" autoComplete="current-password" required maxLength={72} autoFocus />
          <FormField label="Mật khẩu mới" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
          <p className="text-xs leading-5 text-[#607568]">Mật khẩu mới có ít nhất 8 ký tự và khác mật khẩu hiện tại.</p>
          <FormField label="Nhập lại mật khẩu mới" name="password_confirmation" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
        </fieldset>
        {loi && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loi}</p>}
        <div className="flex justify-end gap-3 border-t border-[#e4ece7] pt-5">
          <button type="button" disabled={dangLuu} onClick={khiDong} className="rounded-xl border border-[#ceded3] px-4 py-2 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 disabled:opacity-60">Hủy</button>
          <Button type="submit" disabled={dangLuu}>{dangLuu ? 'Đang đổi mật khẩu…' : 'Lưu mật khẩu mới'}</Button>
        </div>
      </form>
    </HopThoai>
  )
}
