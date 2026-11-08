import { useOutletContext } from 'react-router-dom'
import TruongCauHoi from '../../components/shared/TruongCauHoi'

export default function TraLoiCauHoiNhanDo() {
  const { cauHoi, cauTraLoi, doiCauTraLoi, tieuDeTrang } = useOutletContext()

  return (
    <>
      <h1 ref={tieuDeTrang} tabIndex={-1} className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">Trả lời câu hỏi nhận diện</h1>
      <section className="space-y-7 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-base leading-7 text-[#607568]">Trả lời các câu hỏi gốc của tin đăng để quản trị viên đối chiếu khi xác minh yêu cầu.</p>
        <div className="space-y-6 [&_.form-field]:gap-3 [&_label]:text-lg! [&_input]:h-14! [&_input]:text-lg! [&_textarea]:text-lg [&_textarea]:leading-7">
          {cauHoi.map((cau) => <TruongCauHoi key={cau.id} cauHoi={cau} giaTri={cauTraLoi[cau.id] ?? ''} khiThayDoi={doiCauTraLoi} />)}
        </div>
      </section>
    </>
  )
}
