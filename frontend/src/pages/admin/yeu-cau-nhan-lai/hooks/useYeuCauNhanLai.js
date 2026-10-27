import { useState } from 'react'


export default function useYeuCauNhanLai() {
  const [yeuCau, datYeuCau] = useState(null)
  function xuLy(thaoTac, duLieu) {
    const thoiGian = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Bangkok', dateStyle: 'short', timeStyle: 'short' }).format(new Date())
    datYeuCau((cu) => (cu ? { ...cu, trangThai: thaoTac.trangThai, lichSu: [{ nhan: thaoTac.nhan, thoiGian, ...duLieu }, ...cu.lichSu] } : null))
  }
  return { yeuCau, xuLy }
}

