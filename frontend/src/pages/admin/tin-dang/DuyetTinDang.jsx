import ThongBaoTrong from '../../../components/ThongBaoTrong'
import useDuyetTinDang from './hooks/useDuyetTinDang'

export default function DuyetTinDang() {
  const thongBao = useDuyetTinDang()

  return <ThongBaoTrong {...thongBao} />
}
