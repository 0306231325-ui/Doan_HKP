import { KeyRound, PencilLine, UserRound } from 'lucide-react'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import KhungThongTin from '../../components/shared/KhungThongTin'

export default function ThongTinCaNhan() {
  return (
    <div className="space-y-6">
      <KhungThongTin tieuDe="Thông tin cá nhân" bieuTuong={UserRound}>
        <p className="text-sm leading-6 text-[#607568]">Thông tin tài khoản và liên hệ của bạn.</p>
        <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { name: 'ho_ten', label: 'Họ và tên' },
            { name: 'ma_so', label: 'Mã sinh viên / giảng viên' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'so_dien_thoai', label: 'Số điện thoại', type: 'tel' },
            { name: 'khoa', label: 'Khoa' },
            { name: 'lop', label: 'Lớp' },
          ].map((truong) => <FormField key={truong.name} {...truong} disabled placeholder="Chưa có thông tin" className="disabled:cursor-not-allowed disabled:opacity-70" />)}
        </div>
        <div className="mt-7 flex justify-end border-t border-[#e4ece7] pt-5">
          <Button disabled title="Chưa kết nối tài khoản" className="inline-flex items-center justify-center gap-2"><PencilLine className="h-4 w-4" aria-hidden="true" />Chỉnh sửa thông tin</Button>
        </div>
      </KhungThongTin>

      <KhungThongTin tieuDe="Bảo mật tài khoản" bieuTuong={KeyRound}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#315a43]">Mật khẩu</h3>
            <p className="mt-1 text-sm leading-6 text-[#607568]">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
          </div>
          <Button disabled title="Chưa kết nối tài khoản" className="shrink-0 self-start">Đổi mật khẩu</Button>
        </div>
      </KhungThongTin>
    </div>
  )
}
