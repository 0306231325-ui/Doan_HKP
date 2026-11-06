import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import HopThoai from '../../components/shared/HopThoai'

const cacLoaiTin = [{ giaTri: 'lost', nhan: 'Báo mất đồ' }, { giaTri: 'found', nhan: 'Nhặt được đồ' }]

export default function ChonThongTinDangTin({ tin }) {
  const { duLieu, danhMuc, doiTruong, coTheTiepTuc, chuyenSangNoiDung } = tin
  const [dangXacNhan, datDangXacNhan] = useState(false)
  const loiThongTin = !tin.dangTaiDanhMuc && !tin.loiTaiDanhMuc ? tin.loiThongTin : ''
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  function moXacNhan(suKien) {
    suKien.preventDefault()
    if (coTheTiepTuc) datDangXacNhan(true)
  }

  function dongXacNhan() {
    datDangXacNhan(false)
  }

  function xacNhanTiepTuc() {
    dongXacNhan()
    chuyenSangNoiDung()
  }

  return (
    <form onSubmit={moXacNhan} className="space-y-6 rounded-3xl border border-[#d6e4db] bg-white p-5 shadow-sm sm:p-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#243c30]">Loại tin</legend>
        <div className="grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
          {cacLoaiTin.map(({ giaTri, nhan }) => {
            const daChon = duLieu.loaiTin === giaTri
            return (
              <label key={giaTri} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-[#243c30] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700 ${daChon ? 'border-emerald-700 bg-emerald-50' : 'border-[#ceded3] bg-white hover:bg-[#f8fbf9]'}`}>
                <input type="radio" name="loaiTin" value={giaTri} checked={daChon} onChange={doiTruong} required className="h-4 w-4 accent-emerald-800" />
                <span>{nhan}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="border-t border-[#e4ece7] pt-6">
        <FormField as="select" label={<>Danh mục <span className="text-rose-600" aria-hidden="true">*</span></>} name="danhMucId" disabled={tin.dangTaiDanhMuc || Boolean(tin.loiTaiDanhMuc)} value={duLieu.danhMucId} onChange={doiTruong} required className={lopNhap}>
          <option value="" disabled>{tin.dangTaiDanhMuc ? 'Đang tải danh mục…' : !danhMuc.length ? 'Chưa có danh mục' : 'Chọn danh mục đồ vật'}</option>
          {danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.tenDanhMuc}</option>)}
        </FormField>
        {tin.loiTaiDanhMuc && <div role="alert" className="mt-3 text-sm text-rose-700">{tin.loiTaiDanhMuc} <button type="button" onClick={tin.taiLaiDanhMuc} className="font-semibold underline">Thử lại</button></div>}
      </div>

      <fieldset className="space-y-4 border-t border-[#e4ece7] pt-5">
        <legend className="px-1 text-lg font-bold text-[#243c30]">Thông tin liên hệ</legend>
        <p className="text-xs leading-5 text-[#607568]">Số điện thoại và email được điền từ tài khoản. Bạn có thể sửa cho tin này và cần giữ ít nhất một cách liên hệ. Trang chi tiết che một phần liên hệ bằng dấu sao. Chỉ bạn có thể xem đầy đủ.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Số điện thoại" name="soDienThoai" type="tel" autoComplete="tel" value={duLieu.soDienThoai} onChange={doiTruong} required={!duLieu.email.trim()} pattern="[+]?[0-9 ]{9,20}" maxLength={20} title="Nhập từ 9 đến 20 chữ số hoặc dấu cách, có thể có dấu + ở đầu." placeholder="Số điện thoại liên hệ" />
          <FormField label="Email / Gmail" name="email" type="email" autoComplete="email" value={duLieu.email} onChange={doiTruong} required={!duLieu.soDienThoai.trim()} maxLength={254} placeholder="tenban@gmail.com" />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {loiThongTin && <p id="huong-dan-tiep-tuc" className="text-sm text-[#607568]">{loiThongTin}</p>}
        <Button type="submit" disabled={!coTheTiepTuc} aria-haspopup="dialog" aria-describedby={loiThongTin ? 'huong-dan-tiep-tuc' : undefined} className="inline-flex items-center justify-center gap-2 px-6">
          Tiếp tục <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {dangXacNhan && (
        <HopThoai tieuDe="Xác nhận tiếp tục?" khiDong={dongXacNhan}>
          <div className="flex flex-wrap justify-end gap-3 px-5 py-4 sm:px-6">
            <button type="button" onClick={dongXacNhan} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#315a43] hover:bg-emerald-50">Hủy</button>
            <Button onClick={xacNhanTiepTuc} disabled={!coTheTiepTuc}>Xác nhận</Button>
          </div>
        </HopThoai>
      )}
    </form>
  )
}
