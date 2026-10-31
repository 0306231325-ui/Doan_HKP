import TheDoThatLac from './TheDoThatLac'
import TrangThaiDanhSachRong from '../shared/TrangThaiDanhSachRong'

export default function DanhSachDoThatLac({ danhSachDo = [], tongTin = danhSachDo.length, dangTai = false, loiTai = '', taiLai, loiNgay = '', coBoLoc = false, xoaBoLoc, tieuDe = 'Danh sách đồ thất lạc gần đây', tuyChon }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {tieuDe}
          </h2>
          <p role="status" className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
            {dangTai ? 'Đang tìm tin đăng…' : loiTai ? 'Chưa tải được danh sách tin đăng.' : <>Các tin báo mất và nhặt được trong khuôn viên trường hiện có{' '}
            <strong className="font-bold text-emerald-900 underline decoration-emerald-700 underline-offset-4">{tongTin} tin phù hợp</strong>.</>}
          </p>
        </div>

        {tuyChon}
      </div>

      <div role="region" aria-label={tieuDe} className="min-h-64 rounded-2xl border border-[#d6e4db] bg-white">
        {dangTai ? <div role="status" className="flex min-h-64 items-center justify-center p-6 text-sm text-[#607568]">Đang tải tin đăng…</div> : loiTai ? <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center text-sm text-red-700"><p>{loiTai}</p>{taiLai && <button type="button" onClick={taiLai} className="rounded-xl bg-emerald-900 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Thử lại</button>}</div> : danhSachDo.length > 0 ? <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {danhSachDo.map((doVat) => (
            <TheDoThatLac key={doVat.id} doVat={doVat} />
          ))}
        </div> : <TrangThaiDanhSachRong loi={loiNgay} coBoLoc={coBoLoc} xoaBoLoc={xoaBoLoc} />}
      </div>
    </section>
  )
}
