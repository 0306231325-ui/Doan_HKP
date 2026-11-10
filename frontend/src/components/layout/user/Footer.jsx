import { Mail, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LIEN_KET_DANG_TIN, LIEN_KET_MENU } from './dieuHuongNguoiDung'

const EMAIL_HO_TRO = 'vul53290@gmail.com'
const LOP_LIEN_KET = 'rounded-sm text-sm text-gray-700 transition-colors hover:text-emerald-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700'
const CAC_MANG_XA_HOI = [
  {
    ten: 'Facebook',
    icon: <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor"><path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.6V3.9a21 21 0 0 0-2.4-.1c-2.4 0-4.1 1.5-4.1 4.2v2H8v3h2.7v8H14Z" /></svg>,
  },
  {
    ten: 'Instagram',
    icon: <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>,
  },
  { ten: 'Telegram', icon: <Send className="size-4" aria-hidden="true" /> },
]

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#d6e4db] bg-white py-7 sm:mt-16 sm:py-8">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr] lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label="Lạc Ơi · Về trang chủ" className="inline-flex items-center gap-2 rounded-lg text-xl font-black text-emerald-900 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            <img src="/logo/lacoi.png" alt="" className="size-10 shrink-0 rounded-xl object-contain" />
            <span>Lạc Ơi</span>
          </Link>
          <p className="mt-2 text-xs leading-5 text-gray-600">Đồ án tốt nghiệp · Phú và Hiên</p>
        </div>

        <nav aria-label="Điều hướng cuối trang">
          <h2 className="mb-2 text-sm font-bold text-emerald-950">Điều hướng</h2>
          <ul className="grid max-w-xs grid-cols-2 gap-x-4 gap-y-2">
            {[...LIEN_KET_MENU, LIEN_KET_DANG_TIN].map(({ to, label }) => (
              <li key={to}><Link to={to} className={LOP_LIEN_KET}>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-ho-tro">
          <h2 id="footer-ho-tro" className="mb-2 text-sm font-bold text-emerald-950">Hỗ trợ</h2>
          <a href={`mailto:${EMAIL_HO_TRO}`} className={`inline-flex items-center gap-2 break-all ${LOP_LIEN_KET}`}>
            <Mail className="size-4 shrink-0" aria-hidden="true" />{EMAIL_HO_TRO}
          </a>
          <ul aria-label="Mạng xã hội" className="mt-3 flex gap-2">
            {CAC_MANG_XA_HOI.map(({ ten, icon }) => (
              <li key={ten}><span role="img" aria-label={`${ten} · Chưa có liên kết`} title={`${ten} · Chưa có liên kết`} className="inline-flex size-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">{icon}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  )
}
