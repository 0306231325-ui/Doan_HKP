import { useState } from 'react'
import { Copy } from 'lucide-react'
import Button from '../../components/shared/Button'

export default function MaBanGiao({ ma }) {
  const [thongBao, datThongBao] = useState('')

  async function saoChep() {
    try {
      await navigator.clipboard.writeText(ma)
      datThongBao('Đã sao chép mã bàn giao.')
    } catch {
      datThongBao('Không sao chép tự động được. Hãy chọn mã để sao chép.')
    }
  }

  return (
    <div className="space-y-2 rounded-xl bg-emerald-50 p-4 text-emerald-950">
      <p className="text-sm font-semibold">Mã bàn giao</p>
      <div className="flex flex-wrap items-center gap-3">
        <p className="select-all font-mono text-3xl tracking-widest">{ma}</p>
        <Button onClick={saoChep} className="inline-flex items-center gap-2">
          <Copy size={16} aria-hidden="true" />Sao chép mã
        </Button>
      </div>
      <p role="status" className="text-sm">{thongBao}</p>
    </div>
  )
}
