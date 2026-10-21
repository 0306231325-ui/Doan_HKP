import ThongBaoTrong from '../../../components/shared/ThongBaoTrong'
import useYeuCauNhanLai from './hooks/useYeuCauNhanLai'

export default function YeuCauNhanLai() {
  const thongBao = useYeuCauNhanLai()

  return <ThongBaoTrong {...thongBao} />
}
