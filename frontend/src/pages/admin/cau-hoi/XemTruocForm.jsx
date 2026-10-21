import { useState } from 'react'
import HopThoai from '../../../components/shared/HopThoai'
import { layCauHoiXemTruoc } from './hooks/xuLyCauHoi.js'

export default function XemTruocForm({ danhSach, danhMucChon, dongXemTruoc }) {
  const [loaiForm, datLoaiForm] = useState('mat')
  const cauHoi = danhMucChon.dangHoatDong ? layCauHoiXemTruoc(danhSach, danhMucChon.id, loaiForm) : []
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  function doiLoaiForm(suKien) {
    datLoaiForm(suKien.target.value)
  }

  return (
    <HopThoai tieuDe="Xem trước câu hỏi" moTa={`Danh mục: ${danhMucChon.tenDanhMuc}. Các ô dưới đây chỉ để nhập thử, không lưu câu trả lời.`} khiDong={dongXemTruoc}>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div><label htmlFor="loai-form-xem-truoc" className="mb-2 block text-sm font-semibold text-[#243c30]">Biểu mẫu</label><select id="loai-form-xem-truoc" value={loaiForm} onChange={doiLoaiForm} className={lopNhap}><option value="mat">Đăng tin báo mất</option><option value="nhat">Đăng tin nhặt được</option><option value="nhan_lai">Gửi yêu cầu nhận lại</option></select></div>
        {loaiForm === 'nhan_lai' && <p className="text-xs leading-5 text-[#718276]">Chỉ hiển thị câu hỏi được chọn để xác minh. Đáp án của người nhặt không được hiển thị cho người xin nhận lại.</p>}
        {!cauHoi.length && <p className="rounded-xl bg-[#f5f9f6] px-4 py-5 text-sm leading-6 text-[#718276]">{danhMucChon.dangHoatDong ? 'Chưa có câu hỏi đang hoạt động cho biểu mẫu này.' : 'Danh mục đã ngừng sử dụng.'}</p>}
        <div key={loaiForm} className="space-y-5">
          {cauHoi.map((muc) => {
            const batBuoc = loaiForm === 'nhan_lai' ? muc.apDung.nhat.batBuocNhanLai : muc.apDung[loaiForm].batBuoc
            const ma = `xem-truoc-${muc.id}`
            return <div key={muc.id}>
              <label htmlFor={ma} className="mb-2 block text-sm font-semibold leading-6 text-[#243c30]">{loaiForm === 'nhan_lai' ? muc.nhanNhanLai : muc.nhanDangTin} {batBuoc && <span className="text-red-600">*</span>}</label>
              {muc.kieuNhap === 'chon_mot' ? <select id={ma} defaultValue="" required={batBuoc} className={lopNhap}><option value="" disabled>Chọn một đáp án</option>{muc.luaChon.map((luaChon) => <option key={luaChon.id} value={luaChon.id}>{luaChon.nhan}</option>)}</select>
                : muc.kieuNhap === 'doan_van' ? <textarea id={ma} required={batBuoc} rows={3} className={lopNhap} placeholder="Nhập câu trả lời…" />
                  : <input id={ma} required={batBuoc} type={muc.kieuNhap === 'so' ? 'number' : 'text'} step={muc.kieuNhap === 'so' ? 'any' : undefined} className={lopNhap} placeholder="Nhập câu trả lời…" />}
              {loaiForm !== 'nhan_lai' && !muc.apDung[loaiForm].congKhai && <p className="mt-1.5 text-xs text-[#718276]">Câu trả lời này được giữ kín trên tin đăng.</p>}
            </div>
          })}
        </div>
      </div>
    </HopThoai>
  )
}
