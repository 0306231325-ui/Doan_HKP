import { useRef, useState } from 'react'
import { Flag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import api, { prepareCsrf } from '../../services/api'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'

const cacLyDo = ['Tin giả / sai thông tin', 'Nghi lừa đảo', 'Spam / trùng lặp', 'Nội dung không phù hợp', 'Khác']

export default function BaoCaoTinDang({ tin }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mo, datMo] = useState(false)
  const [lyDo, datLyDo] = useState('')
  const [loi, datLoi] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const [daGui, datDaGui] = useState(false)
  const khoaGui = useRef(false)

  function moBaoCao() {
    if (!user) {
      navigate('/dang-nhap', { state: { from: location.pathname + location.search, authMessage: 'Vui lòng đăng nhập để báo cáo tin đăng.' } })
      return
    }
    datLoi('')
    datMo(true)
  }

  async function guiBaoCao(event) {
    event.preventDefault()
    if (khoaGui.current) return
    const data = new FormData(event.currentTarget)
    const moTa = data.get('mo_ta').trim()
    if ((lyDo === 'Khác' || moTa) && moTa.length < 10) {
      datLoi('Mô tả phải có ít nhất 10 ký tự có nội dung.')
      return
    }
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      await api.post(`/tin-dang/${tin.id}/bao-cao`, { ly_do: lyDo, mo_ta: moTa || null })
      datDaGui(true)
      datMo(false)
    } catch (error) {
      const status = error.response?.status
      if (status === 409) {
        datDaGui(true)
        datMo(false)
      } else {
        datLoi(status === 422 ? Object.values(error.response.data.errors || {}).flat().join(' ') || 'Vui lòng kiểm tra thông tin báo cáo.'
          : status === 429 ? 'Bạn gửi quá nhiều lần. Vui lòng đợi một phút rồi thử lại.'
          : status === 401 || status === 419 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi gửi báo cáo.'
          : error.response?.data?.message || 'Không gửi được báo cáo. Vui lòng thử lại.')
      }
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  return <>
    <button type="button" onClick={moBaoCao} disabled={loading || daGui} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ceded3] bg-white px-4 py-3 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"><Flag className="h-4 w-4" aria-hidden="true" />{daGui ? 'Đã gửi báo cáo' : 'Báo cáo tin đăng'}</button>
    {daGui && <p role="status" className="text-sm leading-6 text-emerald-800">Báo cáo của bạn đang chờ quản trị viên xem xét.</p>}
    {mo && <HopThoai tieuDe="Báo cáo tin đăng" moTa={`Báo cáo: ${tin.title}. Thông tin người báo cáo chỉ dành cho quản trị viên.`} khiDong={() => { if (!khoaGui.current) datMo(false) }}>
      <form onSubmit={guiBaoCao} className="space-y-5 p-5 sm:p-6" aria-busy={dangGui}>
        <fieldset disabled={dangGui} className="space-y-5">
          <label className="block text-sm font-semibold text-[#315a43]">Lý do báo cáo <span aria-hidden="true">*</span>
            <select required name="ly_do" value={lyDo} onChange={(e) => datLyDo(e.target.value)} className="mt-2 w-full rounded-xl border border-[#ceded3] bg-white p-3 text-sm">
              <option value="">Chọn lý do</option>{cacLyDo.map((lyDo) => <option key={lyDo}>{lyDo}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#315a43]">Mô tả {lyDo === 'Khác' ? '(bắt buộc)' : '(không bắt buộc)'}
            <textarea name="mo_ta" required={lyDo === 'Khác'} maxLength={2000} rows={5} placeholder="Nêu chi tiết để quản trị viên có thể đối chiếu…" className="mt-2 w-full resize-y rounded-xl border border-[#ceded3] p-3 text-sm font-normal" />
            <span className="mt-1 block text-xs font-normal text-[#718276]">Nếu nhập mô tả, cần từ 10 đến 2000 ký tự.</span>
          </label>
          {loi && <p role="alert" className="text-sm text-red-700">{loi}</p>}
          <div className="flex justify-end gap-3"><button type="button" onClick={() => datMo(false)} className="rounded-xl border border-[#ceded3] px-4 py-2 text-sm">Hủy</button><Button type="submit">{dangGui ? 'Đang gửi…' : 'Gửi báo cáo'}</Button></div>
        </fieldset>
      </form>
    </HopThoai>}
  </>
}
