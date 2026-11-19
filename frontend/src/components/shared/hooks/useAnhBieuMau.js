import { useEffect, useRef, useState } from 'react'
import { chonAnhDangTin } from '../../../pages/tin-dang/hooks/xuLyDangTin.js'

export default function useAnhBieuMau() {
  const [anh, datAnh] = useState([])
  const [loiAnh, datLoiAnh] = useState('')
  const cacUrl = useRef(new Set())

  useEffect(function quanLyAnh() {
    const urls = cacUrl.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  function chonAnh(suKien) {
    const cacTep = Array.from(suKien.target.files || [])
    suKien.target.value = ''
    const { anhSeThem, loi } = chonAnhDangTin(cacTep, anh.length)
    datLoiAnh(loi)
    if (!anhSeThem.length) return

    const anhMoi = anhSeThem.map((tep) => {
      const url = URL.createObjectURL(tep)
      cacUrl.current.add(url)
      return { id: url, tep, url }
    })
    datAnh((cu) => [...cu, ...anhMoi])
  }

  function xoaAnh(ma) {
    URL.revokeObjectURL(ma)
    cacUrl.current.delete(ma)
    datAnh((cu) => cu.filter((muc) => muc.id !== ma))
    datLoiAnh('')
  }

  return { anh, loiAnh, chonAnh, xoaAnh }
}
