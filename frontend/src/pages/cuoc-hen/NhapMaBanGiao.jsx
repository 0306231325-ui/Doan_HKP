import { useState } from 'react'
import Button from '../../components/shared/Button'
import KhungCuocHen from './KhungCuocHen'

export default function NhapMaBanGiao() {
  const [ma, datMa] = useState('')

  return (
    <KhungCuocHen tieuDe="Nhập mã bàn giao" moTa="Sau khi giao nhận đồ, nhập mã 6 số do người tạo cuộc hẹn cung cấp để xác nhận cho cả hai bên.">
      <section className="max-w-lg rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-emerald-950">
            Mã bàn giao
            <input
              type="text" inputMode="numeric" autoComplete="off" maxLength={6}
              value={ma} onChange={(suKien) => datMa(suKien.target.value.replace(/[^0-9]/g, ''))}
              placeholder="6 số" className="mt-2 block min-h-12 w-full rounded-xl border border-[#ceded3] px-4 py-3 font-mono text-lg tracking-widest focus-visible:outline-2 focus-visible:outline-emerald-700"
            />
          </label>
          <p className="text-sm text-[#526c5b]">Tính năng xác nhận bàn giao đang được hoàn thiện.</p>
          <Button disabled>Xác nhận bàn giao</Button>
        </div>
      </section>
    </KhungCuocHen>
  )
}
