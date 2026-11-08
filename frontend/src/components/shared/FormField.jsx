import { useId } from 'react'
import './form-controls.css'

export default function FormField({ label, name, id, as: TruongNhap = 'input', children, ...inputProps }) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      <TruongNhap id={inputId} name={name} {...inputProps}>{children}</TruongNhap>
    </div>
  )
}
