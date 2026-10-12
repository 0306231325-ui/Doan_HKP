import TheDoThatLac from './TheDoThatLac'

export default function DanhSachDoThatLac({ danhSachDo = [] }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Danh sách đồ thất lạc gần đây
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Cập nhật theo thời gian thực từ sinh viên, cán bộ giảng viên và đội trật tự giảng đường
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-500">Hiển thị</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {danhSachDo.length} tin phù hợp
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {danhSachDo.map((doVat) => (
          <TheDoThatLac key={doVat.id} doVat={doVat} />
        ))}
      </div>
    </section>
  )
}
