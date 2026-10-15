import { Plus, Trash2 } from 'lucide-react'
import HopThoai from '../../../components/HopThoai'
import CauHinhApDung from './CauHinhApDung'
import { cacKieuNhap } from './hooks/xuLyCauHoi.js'

export default function FormCauHoi({ bieuMau, danhMucChon, loi, loiLuu, dongBieuMau, doiBieuMau, doiCauHinh, themLuaChon, doiLuaChon, xoaLuaChon, luuCauHoi }) {
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  return (
    <HopThoai tieuDe={bieuMau.id ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'} moTa={`Danh mục: ${danhMucChon.tenDanhMuc}`} khiDong={dongBieuMau}>
      <form onSubmit={luuCauHoi} noValidate>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          {bieuMau.id && <p className="rounded-xl bg-[#edf7f0] px-3 py-2.5 text-xs leading-5 text-emerald-900">Sửa và lưu sẽ tạo bản {bieuMau.phienBan + 1}. Nội dung và lựa chọn của bản cũ được giữ trong lịch sử.</p>}
          <div>
            <label htmlFor="nhan-dang-tin" className="mb-2 block text-sm font-semibold text-[#243c30]">Câu hỏi khi đăng tin <span className="text-red-600">*</span></label>
            <input id="nhan-dang-tin" name="nhanDangTin" value={bieuMau.nhanDangTin} onChange={doiBieuMau} maxLength={250} required aria-invalid={Boolean(loi.nhanDangTin)} aria-describedby={loi.nhanDangTin ? 'loi-nhan-dang-tin' : undefined} placeholder="Ví dụ: Thiết bị thuộc hãng nào?" className={lopNhap} />
            {loi.nhanDangTin && <p id="loi-nhan-dang-tin" role="alert" className="mt-1 text-xs text-red-700">{loi.nhanDangTin}</p>}
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3">
            <div><label htmlFor="kieu-nhap-cau-hoi" className="mb-2 block text-sm font-semibold text-[#243c30]">Kiểu trả lời</label><select id="kieu-nhap-cau-hoi" name="kieuNhap" value={bieuMau.kieuNhap} onChange={doiBieuMau} className={lopNhap}>{Object.entries(cacKieuNhap).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}</select></div>
            <div><label htmlFor="thu-tu-cau-hoi" className="mb-2 block text-sm font-semibold text-[#243c30]">Thứ tự</label><input id="thu-tu-cau-hoi" type="number" min={1} max={999} step={1} name="thuTu" value={bieuMau.thuTu} onChange={doiBieuMau} aria-invalid={Boolean(loi.thuTu)} aria-describedby={loi.thuTu ? 'loi-thu-tu' : undefined} className={lopNhap} /></div>
          </div>
          {loi.thuTu && <p id="loi-thu-tu" role="alert" className="text-xs text-red-700">{loi.thuTu}</p>}
          {loi.kieuNhap && <p role="alert" className="text-xs text-red-700">{loi.kieuNhap}</p>}
          {bieuMau.kieuNhap === 'chon_mot' && <fieldset className="space-y-2.5">
            <legend className="mb-2 text-sm font-semibold text-[#243c30]">Các lựa chọn</legend>
            {bieuMau.luaChon.map((muc, viTri) => <div key={muc.id} className="flex gap-2">
              <input aria-label={`Lựa chọn ${viTri + 1}`} value={muc.nhan} onChange={(suKien) => doiLuaChon(muc.id, suKien.target.value)} maxLength={100} placeholder={`Lựa chọn ${viTri + 1}`} className={lopNhap} />
              <button type="button" onClick={() => xoaLuaChon(muc.id)} aria-label={`Xóa lựa chọn ${viTri + 1}`} className="rounded-lg p-2 text-[#687d70] hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-emerald-700"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
            </div>)}
            <button type="button" disabled={bieuMau.luaChon.length >= 20} onClick={themLuaChon} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-40"><Plus className="h-3.5 w-3.5" aria-hidden="true" />Thêm lựa chọn</button>
            {loi.luaChon && <p role="alert" className="text-xs text-red-700">{loi.luaChon}</p>}
          </fieldset>}
          <CauHinhApDung apDung={bieuMau.apDung} doiCauHinh={doiCauHinh} />
          {loi.apDung && <p role="alert" className="text-xs text-red-700">{loi.apDung}</p>}
          {bieuMau.apDung.nhat.suDung && bieuMau.apDung.nhat.dungXacMinh && <div>
            <label htmlFor="nhan-nhan-lai" className="mb-2 block text-sm font-semibold text-[#243c30]">Câu hỏi khi xin nhận lại <span className="text-red-600">*</span></label>
            <textarea id="nhan-nhan-lai" name="nhanNhanLai" value={bieuMau.nhanNhanLai} onChange={doiBieuMau} maxLength={250} rows={2} required aria-invalid={Boolean(loi.nhanNhanLai)} aria-describedby={loi.nhanNhanLai ? 'loi-nhan-nhan-lai' : undefined} placeholder="Ví dụ: Đồ vật của bạn có đặc điểm riêng nào?" className={lopNhap} />
            {loi.nhanNhanLai && <p id="loi-nhan-nhan-lai" role="alert" className="mt-1 text-xs text-red-700">{loi.nhanNhanLai}</p>}
          </div>}
          {(loiLuu || loi.danhMucId) && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{loiLuu || loi.danhMucId}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
          <button type="button" onClick={dongBieuMau} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">Hủy</button>
          <button type="submit" className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">{bieuMau.id ? 'Lưu thay đổi' : 'Thêm câu hỏi'}</button>
        </div>
      </form>
    </HopThoai>
  )
}
