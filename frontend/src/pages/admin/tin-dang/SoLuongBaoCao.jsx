export default function SoLuongBaoCao({ baoCao }) {
  const tong = baoCao.length
  if (!tong) return <span className="text-xs text-[#718276]">Chưa có</span>
  return <div className="space-y-1"><span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tong >= 3 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}>{tong} lần báo cáo</span></div>
}
