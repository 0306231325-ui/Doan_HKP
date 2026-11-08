import { ShieldCheck } from 'lucide-react'

export default function AdminFooter() {
  return (
    <footer className="mt-10 border-t border-emerald-950/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-[#607568] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-semibold text-emerald-950">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Bảng điều khiển quản trị Lạc Ơi</span>
        </div>
        <p>© {new Date().getFullYear()} Lạc Ơi · Hệ thống quản lý tài sản thất lạc</p>
      </div>
    </footer>
  )
}
