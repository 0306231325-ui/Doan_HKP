export default function ThongBaoTrong({ bieuTuong: BieuTuong, tieuDe, moTa }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-[#dce7dd] bg-white px-6 py-10 text-center shadow-[0_2px_3px_rgba(20,83,45,0.05)]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <BieuTuong className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{tieuDe}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#607568]">{moTa}</p>
    </div>
  )
}
