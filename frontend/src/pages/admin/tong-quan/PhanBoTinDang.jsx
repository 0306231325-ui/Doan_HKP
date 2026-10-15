export default function PhanBoTinDang({ tongTin, phanBo, kieuPhanBo, chonKieuPhanBo }) {
  return (
    <section aria-labelledby="phan-bo-tin-dang" className="min-w-0 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="phan-bo-tin-dang" className="text-lg font-bold text-[#1d3026]">Phân bố tin đăng</h2>
        <div role="group" aria-label="Phân bố theo" className="flex rounded-xl bg-[#eaf6ee] p-1">
          {[
            { giaTri: 'danh_muc', nhan: 'Danh mục' },
            { giaTri: 'dia_diem', nhan: 'Địa điểm' },
          ].map(({ giaTri, nhan }) => (
            <button key={giaTri} type="button" aria-pressed={kieuPhanBo === giaTri} onClick={() => chonKieuPhanBo(giaTri)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${kieuPhanBo === giaTri ? 'bg-white text-emerald-900 shadow-sm' : 'text-[#526c5b] hover:text-emerald-950'}`}>
              {nhan}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-56 flex-col items-center justify-center gap-6 py-7 sm:flex-row sm:gap-7">
        <div className="relative h-40 w-40 shrink-0">
          <svg role="img" aria-label={`${tongTin} tin, phân bố theo ${kieuPhanBo === 'danh_muc' ? 'danh mục' : 'địa điểm'}`} viewBox="0 0 180 180" className="h-full w-full -rotate-90">
            <circle cx="90" cy="90" r="76" fill="none" stroke="#e8f7ee" strokeWidth="20" />
            {phanBo.map(({ ten, tyLe, diemBatDau, mau }) => (
              <circle key={ten} cx="90" cy="90" r="76" fill="none" stroke={mau} strokeWidth="20" pathLength="100" strokeDasharray={`${tyLe} ${100 - tyLe}`} strokeDashoffset={-diemBatDau} />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-[#637a6c]">{tongTin.toLocaleString('vi-VN')} tin</div>
        </div>
        {phanBo.length ? (
          <ul className="min-w-0 w-full space-y-3 sm:flex-1">
            {phanBo.map(({ ten, soLuong, mau }) => (
              <li key={ten} className="flex items-start gap-2 text-sm text-[#637a6c]">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: mau }} aria-hidden="true" />
                <span className="min-w-0 flex-1 break-words">{ten}</span>
                <span className="font-semibold text-emerald-900 tabular-nums">{soLuong}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm leading-6 text-[#687d70] sm:text-left">
            <p className="font-medium">Chưa có dữ liệu</p>
            <p className="mt-2">Chưa có tin theo {kieuPhanBo === 'danh_muc' ? 'danh mục' : 'địa điểm'}.</p>
          </div>
        )}
      </div>
    </section>
  )
}
