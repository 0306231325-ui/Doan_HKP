import { Info } from 'lucide-react'
import Button from './Button'
import HopThoai from './HopThoai'
import useHuongDan from './hooks/useHuongDan'

export default function HuongDanThaoTac({ goiY, tieuDe, cacBuoc, ghiChu }) {
  const { dangMo, moHuongDan, dongHuongDan } = useHuongDan()

  return (
    <>
      <p className="text-sm leading-6 text-[#607568]">
        <span className="underline underline-offset-4">{goiY}</span>
        <button type="button" onClick={moHuongDan} aria-label={`Click vào đây để xem ${tieuDe.toLocaleLowerCase('vi-VN')}`} aria-haspopup="dialog" aria-expanded={dangMo} className="ml-1 inline-flex min-h-8 items-center gap-1.5 rounded-lg px-1 align-middle text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          <span className="underline underline-offset-4">Click vào đây</span>
          <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
      </p>
      {dangMo && <HopThoai tieuDe={tieuDe} khiDong={dongHuongDan}>
        <div className="space-y-5 p-5 text-sm leading-6 text-[#607568] sm:p-6">
          <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-emerald-800">
            {cacBuoc.map(([tenBuoc, moTa]) => (
              <li key={tenBuoc}><span className="font-semibold text-[#243c30]">{tenBuoc}</span> {moTa}</li>
            ))}
          </ol>
          {ghiChu && <p className="border-t border-[#e4ece7] pt-4">{ghiChu}</p>}
        </div>
        <div className="flex justify-end border-t border-[#e1eae4] px-5 py-4 sm:px-6"><Button onClick={dongHuongDan}>Đóng</Button></div>
      </HopThoai>}
    </>
  )
}
