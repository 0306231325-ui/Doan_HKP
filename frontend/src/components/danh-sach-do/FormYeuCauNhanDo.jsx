import { useEffect, useState } from 'react'
import { UploadCloud, Send, X } from 'lucide-react'
import FormField from '../shared/FormField'
import Button from '../shared/Button'

export default function FormYeuCauNhanDo({ onSubmit }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  function selectFile(event) {
    const selected = event.target.files?.[0]
    setError('')
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
      setError('Vui lòng chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.')
      event.target.value = ''
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    event.target.value = ''
  }

  return (
    <form className="claim-card claim-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
      <div><h2>Thông tin xác minh</h2><p className="claim-muted">Điền thông tin để người giữ đồ có thể đối chiếu và liên hệ bạn.</p></div>
      <div className="claim-fields">
        <FormField label="Họ và tên *" name="name" autoComplete="name" required maxLength={100} />
        <FormField label="MSSV / Mã giảng viên *" name="schoolId" required maxLength={30} />
        <FormField label="Số điện thoại *" name="phone" type="tel" autoComplete="tel" required pattern="[+]?[0-9 ]{9,20}" title="Nhập từ 9 đến 20 chữ số hoặc dấu cách, có thể có dấu + ở đầu." />
        <FormField label="Email *" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>
      <div className="claim-textarea">
        <label htmlFor="claim-proof">Đặc điểm chứng minh quyền sở hữu *</label>
        <p id="claim-proof-help" className="claim-muted">Mô tả dấu hiệu riêng như vết xước, phụ kiện, đồ bên trong hoặc thời gian bạn làm mất. Không nhập mật khẩu hay mã PIN.</p>
        <textarea id="claim-proof" name="proof" rows={4} required minLength={20} maxLength={2000} aria-describedby="claim-proof-help" placeholder="Ví dụ: Mặt sau có dán sticker hình mèo, dây đeo màu xanh…" />
      </div>
      <div className="claim-upload-section">
        <label htmlFor="claim-image" className="claim-upload"><UploadCloud size={26} /><strong>Thêm ảnh chứng minh (không bắt buộc)</strong><span>Ảnh đồ vật bạn từng chụp · JPG, PNG, WebP · Tối đa 5 MB</span></label>
        <input id="claim-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} aria-describedby={error ? 'claim-image-error' : undefined} />
        {error && <p id="claim-image-error" className="claim-error" role="alert">{error}</p>}
        {preview && <div className="claim-preview"><img src={preview} alt="Ảnh bằng chứng đã chọn" /><span>{file.name}</span><button type="button" onClick={() => { setFile(null); setPreview('') }} aria-label="Xóa ảnh bằng chứng"><X size={18} /></button></div>}
      </div>
      <label className="claim-consent"><input type="checkbox" required /> <span>Tôi xác nhận thông tin cung cấp là đúng và tôi là chủ sở hữu của đồ vật này.</span></label>
      <Button type="submit" className="claim-send"><Send size={18} />Gửi yêu cầu nhận lại đồ</Button>
      <p className="claim-demo-note">Bản xem thử giao diện: yêu cầu chưa được gửi đến hệ thống.</p>
    </form>
  )
}
