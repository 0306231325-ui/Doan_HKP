import ThongBaoTrong from '../../../components/shared/ThongBaoTrong'
import useDuyetTinDang from './hooks/useDuyetTinDang'

export default function DuyetTinDang() {
  const thongBao = useDuyetTinDang()

  return <ThongBaoTrong {...thongBao} />
}
