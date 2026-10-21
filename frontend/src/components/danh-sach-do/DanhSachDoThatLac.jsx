import TheDoThatLac from './TheDoThatLac'
import TrangThaiDanhSachRong from '../shared/TrangThaiDanhSachRong'

export default function DanhSachDoThatLac({ danhSachDo = [], tongTin = danhSachDo.length, trangHienTai = 1, loiNgay = '', coBoLoc = false, xoaBoLoc, khiXemChiTiet, tieuDe = 'Danh sách đồ thất lạc gần đây', tuyChon }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {tieuDe}
          </h2>
          <p role="status" className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
            Các tin báo mất và nhặt được trong khuôn viên trường hiện có{' '}
            <strong className="font-bold text-emerald-900 underline decoration-emerald-700 underline-offset-4">{tongTin} tin phù hợp</strong>.
          </p>
        </div>

        {tuyChon}
      </div>

      <div key={trangHienTai} role="region" aria-label={tieuDe} tabIndex={0} className="h-[min(32rem,60dvh)] min-h-64 overflow-y-auto rounded-2xl border border-[#d6e4db] bg-white [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
        {danhSachDo.length > 0 ? <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {danhSachDo.map((doVat) => (
            <TheDoThatLac key={doVat.id} doVat={doVat} khiXemChiTiet={khiXemChiTiet} />
          ))}
        </div> : <TrangThaiDanhSachRong loi={loiNgay} coBoLoc={coBoLoc} xoaBoLoc={xoaBoLoc} />}
      </div>
    </section>
  )
}
