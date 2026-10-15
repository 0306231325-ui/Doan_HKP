import { ArrowDownLeft, ArrowUpRight, CheckCheck, Package } from 'lucide-react'

export default function TinhHinhChung({ tongTin, soBaoMat, soNhatDuoc, soDaTra, nhanKhoangThoiGian }) {
  const cacChiSo = [
    { nhan: 'Tổng tin đăng', giaTri: tongTin, moTa: 'Tin trong khoảng đã chọn', bieuTuong: Package },
    { nhan: 'Báo mất', giaTri: soBaoMat, moTa: 'Tin đăng tìm đồ thất lạc', bieuTuong: ArrowUpRight },
    { nhan: 'Nhặt được', giaTri: soNhatDuoc, moTa: 'Tin đăng đồ nhặt được', bieuTuong: ArrowDownLeft },
    { nhan: 'Đã trao trả', giaTri: soDaTra, moTa: 'Đã về với chủ nhân', bieuTuong: CheckCheck },
  ]

  return (
    <section aria-labelledby="tinh-hinh-chung" className="px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tinh-hinh-chung" className="text-lg font-bold text-[#1d3026]">Tình hình chung</h2>
        <p aria-live="polite" className="flex items-center gap-2 text-xs font-medium text-[#687d70] sm:text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-800" aria-hidden="true" />
          {nhanKhoangThoiGian === 'Tất cả thời gian' ? 'Hiện tại' : nhanKhoangThoiGian}
        </p>
      </div>
      <dl className="mt-5 grid grid-cols-2 xl:grid-cols-4">
        {cacChiSo.map(({ nhan, giaTri, moTa, bieuTuong: BieuTuong }, viTri) => (
          <div key={nhan} className={`min-w-0 border-[#d9e6df] py-4 ${viTri % 2 ? 'border-l pl-5' : 'pr-5'} ${viTri > 0 ? 'xl:border-l xl:px-6' : 'xl:pr-6'} ${viTri >= 2 ? 'border-t xl:border-t-0' : ''}`}>
            <dt className="flex items-center gap-2 text-sm font-medium text-[#637a6c]">
              <BieuTuong className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              {nhan}
            </dt>
            <dd className="mt-4 text-4xl font-bold tracking-tight text-emerald-900 tabular-nums sm:text-5xl">{giaTri.toLocaleString('vi-VN')}</dd>
            <dd className="mt-3 text-xs leading-5 text-[#687d70] sm:text-sm">{moTa}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
