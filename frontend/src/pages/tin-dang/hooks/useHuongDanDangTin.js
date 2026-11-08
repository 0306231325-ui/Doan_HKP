import { useState } from 'react'

export default function useHuongDanDangTin() {
  const [dangMo, datDangMo] = useState(false)

  function moHuongDan() {
    datDangMo(true)
  }

  function dongHuongDan() {
    datDangMo(false)
  }

  return { dangMo, moHuongDan, dongHuongDan }
}
