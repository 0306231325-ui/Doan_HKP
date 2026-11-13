import { useEffect, useState } from 'react'
import api from '../../../services/api'

export const nut = 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6e4db] bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40'
export const nhan = {
  nhom_da_dong: 'Đã đóng',
  san_sang_duyet: 'Chờ duyệt', nhom_da_duyet: 'Đã duyệt',
  cho_kiem_tra: 'Chờ duyệt', can_bo_sung: 'Chờ duyệt', da_xac_minh: 'Đã duyệt',
  nhom_tu_choi: 'Từ chối',
  tam_cho_ban_giao: 'Tạm dừng', da_dong: 'Đã đóng', tu_choi: 'Từ chối', da_huy: 'Đã hủy',
}
export const ngay = (value) => value ? new Date(value).toLocaleString('vi-VN') : 'Chưa có'
export function loiApi(error) {
  return Object.values(error.response?.data?.errors || {}).flat().join(' ') || error.response?.data?.message || 'Không tải được dữ liệu. Vui lòng thử lại.'
}
export function useDuLieu(url, params, lanTai) {
  const khoa = JSON.stringify([url, params, lanTai])
  const [ketQua, datKetQua] = useState(null)
  useEffect(() => {
    if (!url) return
    const abort = new AbortController()
    const [, boLoc] = JSON.parse(khoa)
    const timer = window.setTimeout(() => {
      api.get(url, { params: boLoc, signal: abort.signal })
        .then(({ data }) => { if (!abort.signal.aborted) datKetQua({ khoa, data }) })
        .catch((error) => { if (!abort.signal.aborted) datKetQua({ khoa, loi: loiApi(error) }) })
    }, 200)
    return () => { abort.abort(); window.clearTimeout(timer) }
  }, [url, khoa])
  return ketQua?.khoa === khoa ? ketQua : { data: null, loi: '' }
}
