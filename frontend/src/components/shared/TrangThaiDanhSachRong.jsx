import { SearchX } from 'lucide-react'

export default function TrangThaiDanhSachRong({ loi = '', coBoLoc = false, xoaBoLoc }) {
  return (
    <div role="status" className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
      <SearchX className="mb-5 h-12 w-12 text-[#9aafa1]" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-[#243c30]">{loi ? 'Kiểm tra lại khoảng ngày' : 'Chưa có tin đăng nào'}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#718276]">
        {loi || 'Tin báo mất và nhặt được sẽ hiển thị tại đây khi có dữ liệu.'}
      </p>
      {coBoLoc && xoaBoLoc && (
        <button
          type="button"
          onClick={xoaBoLoc}
          className="mt-5 rounded-xl bg-[#edf7f0] px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-[#deede3] focus-visible:outline-2 focus-visible:outline-emerald-700"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}
