import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'
import ThongTinDoNhanLai from '../../components/danh-sach-do/ThongTinDoNhanLai'
import FormYeuCauNhanDo from '../../components/danh-sach-do/FormYeuCauNhanDo'
import useGuiYeuCauNhanDo from './hooks/useGuiYeuCauNhanDo'

export default function YeuCauNhanDo() {
  const yeuCau = useGuiYeuCauNhanDo()
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/danh-sach-do" className="text-sm font-semibold text-emerald-800 underline">Quay lại danh sách tin</Link>
      <h1 className="text-3xl font-extrabold text-emerald-900">Yêu cầu nhận lại đồ</h1>
      {yeuCau.dangTai ? <p role="status">Đang tải câu hỏi của tin đăng…</p> : yeuCau.loiTai ? <div role="alert" className="space-y-4 rounded-2xl bg-white p-6"><p>{yeuCau.loiTai}</p><Button onClick={yeuCau.taiLai}>Thử lại</Button></div> : yeuCau.tin && <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
        <ThongTinDoNhanLai item={yeuCau.tin} />
        {yeuCau.daGui ? <section className="space-y-4 rounded-2xl bg-white p-6"><h2 className="text-lg font-bold">Bạn đã gửi yêu cầu</h2><p className="text-sm text-[#607568]">Quản trị viên sẽ xử lý yêu cầu của bạn.</p><Link to={`/chi-tiet-tin-dang?id=${yeuCau.tin.id}`} className="font-semibold text-emerald-800 underline">Quay lại tin đăng</Link></section> : <FormYeuCauNhanDo {...yeuCau} />}
      </div>}
    </div>
  )
}
