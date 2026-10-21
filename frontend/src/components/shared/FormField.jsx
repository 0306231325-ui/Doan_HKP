import { useId } from 'react'
import './form-controls.css'

export default function FormField({ label, name, id, ...inputProps }) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} name={name} {...inputProps} />
    </div>
  )
}
