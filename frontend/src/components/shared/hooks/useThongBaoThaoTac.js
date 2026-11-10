import { useLocation, useNavigate } from 'react-router-dom'

export default function useThongBaoThaoTac() {
  const location = useLocation()
  const navigate = useNavigate()

  function hienThongBao(noiDung, loai = 'success', duongDan = location.pathname + location.search + location.hash) {
    navigate(duongDan, {
      replace: true,
      state: { ...location.state, authMessage: noiDung, authType: loai },
    })
  }

  return hienThongBao
}
