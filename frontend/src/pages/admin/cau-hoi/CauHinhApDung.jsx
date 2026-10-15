export default function CauHinhApDung({ apDung, doiCauHinh }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-semibold text-[#243c30]">Áp dụng cho loại tin</legend>
      {Object.entries({ mat: 'Tin báo mất', nhat: 'Tin nhặt được' }).map(([loai, nhan]) => {
        const cauHinh = apDung[loai]
        return (
          <div key={loai} className="rounded-xl border border-[#d6e4db] p-4">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-emerald-900"><input type="checkbox" checked={cauHinh.suDung} onChange={(suKien) => doiCauHinh(loai, 'suDung', suKien.target.checked)} className="h-4 w-4 accent-emerald-800" />{nhan}</label>
            <fieldset disabled={!cauHinh.suDung} className="mt-3 space-y-3 border-t border-[#e8efea] pt-3 disabled:opacity-45">
              <legend className="sr-only">Cấu hình {nhan.toLowerCase()}</legend>
              <label className="flex items-center gap-2.5 text-sm text-[#526c5b]"><input type="checkbox" checked={cauHinh.batBuoc} onChange={(suKien) => doiCauHinh(loai, 'batBuoc', suKien.target.checked)} className="h-4 w-4 accent-emerald-800" />Bắt buộc trả lời khi đăng tin</label>
              <label className="flex items-center gap-2.5 text-sm text-[#526c5b]"><input type="checkbox" checked={cauHinh.congKhai} disabled={cauHinh.dungXacMinh} onChange={(suKien) => doiCauHinh(loai, 'congKhai', suKien.target.checked)} className="h-4 w-4 accent-emerald-800 disabled:opacity-45" />Công khai câu trả lời trên tin đăng</label>
              {loai === 'nhat' && <>
                <label className="flex items-center gap-2.5 text-sm text-[#526c5b]"><input type="checkbox" checked={cauHinh.dungXacMinh} onChange={(suKien) => doiCauHinh(loai, 'dungXacMinh', suKien.target.checked)} className="h-4 w-4 accent-emerald-800" />Dùng để đối chiếu yêu cầu nhận lại</label>
                <label className="flex items-center gap-2.5 text-sm text-[#526c5b]"><input type="checkbox" checked={cauHinh.batBuocNhanLai} disabled={!cauHinh.dungXacMinh} onChange={(suKien) => doiCauHinh(loai, 'batBuocNhanLai', suKien.target.checked)} className="h-4 w-4 accent-emerald-800 disabled:opacity-45" />Bắt buộc trả lời khi xin nhận lại</label>
                {cauHinh.dungXacMinh && <p className="text-xs leading-5 text-emerald-800">Đáp án của người nhặt được giữ kín để admin đối chiếu. Trả lời khớp chưa đồng nghĩa với được duyệt nhận đồ.</p>}
              </>}
            </fieldset>
          </div>
        )
      })}
    </fieldset>
  )
}
