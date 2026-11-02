import { Info } from 'lucide-react'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import useHuongDanDangTin from './hooks/useHuongDanDangTin'

export default function HuongDanDangTin() {
  const { dangMo, moHuongDan, dongHuongDan } = useHuongDanDangTin()

  return (
    <>
      <p className="text-sm leading-6 text-[#607568]">
        <span className="underline underline-offset-4">Bạn có thể đọc hướng dẫn trước khi đăng tin.</span>
        <button type="button" onClick={moHuongDan} aria-label="Click vào đây để xem hướng dẫn đăng tin" aria-haspopup="dialog" aria-expanded={dangMo} className="ml-1 inline-flex min-h-8 items-center gap-1.5 rounded-lg px-1 align-middle text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><span className="underline underline-offset-4">Click vào đây</span><Info className="h-5 w-5 shrink-0" aria-hidden="true" /></button>
      </p>
      {dangMo && <HopThoai tieuDe="Hướng dẫn đăng tin" khiDong={dongHuongDan}>
        <div className="space-y-5 p-5 text-sm leading-6 text-[#607568] sm:p-6">
          <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-emerald-800">
            <li><span className="font-semibold text-[#243c30]">Chọn loại tin và danh mục.</span> Chọn Báo mất đồ hoặc Nhặt được đồ, rồi chọn danh mục phù hợp.</li>
            <li><span className="font-semibold text-[#243c30]">Điền thông tin chính xác.</span> Trả lời các câu hỏi hiển thị; mô tả rõ đặc điểm, nơi và thời gian mất hoặc nhặt được đồ.</li>
            <li><span className="font-semibold text-[#243c30]">Thêm ảnh rõ nét.</span> Chọn tối đa 5 ảnh JPG, PNG hoặc WebP, mỗi ảnh không quá 5 MB.</li>
            <li><span className="font-semibold text-[#243c30]">Kiểm tra trước khi gửi.</span> Nhập số điện thoại liên hệ và bấm Xem trước tin đăng để kiểm tra nội dung.</li>
          </ol>
          <p className="border-t border-[#e4ece7] pt-4">Đăng thông tin trung thực và chỉ chia sẻ những thông tin cần thiết để liên hệ, nhận lại đồ.</p>
        </div>
        <div className="flex justify-end border-t border-[#e1eae4] px-5 py-4 sm:px-6"><Button onClick={dongHuongDan}>Đóng</Button></div>
      </HopThoai>}
    </>
  )
}
