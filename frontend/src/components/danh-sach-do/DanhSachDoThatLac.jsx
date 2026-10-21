import TheDoThatLac from './TheDoThatLac'
import TrangThaiDanhSachRong from '../shared/TrangThaiDanhSachRong'

export default function DanhSachDoThatLac({ danhSachDo = [], tongTin = danhSachDo.length, loiNgay = '', coBoLoc = false, xoaBoLoc }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Danh sách đồ thất lạc gần đây
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Các tin báo mất và nhặt được trong khuôn viên trường
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-500">Hiển thị</span>
          <span role="status" className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {tongTin} tin phù hợp
          </span>
        </div>
      </div>

      {danhSachDo.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {danhSachDo.map((doVat) => (
          <TheDoThatLac key={doVat.id} doVat={doVat} />
        ))}
      </div> : <TrangThaiDanhSachRong loi={loiNgay} coBoLoc={coBoLoc} xoaBoLoc={xoaBoLoc} />}
    </section>
  )
}
