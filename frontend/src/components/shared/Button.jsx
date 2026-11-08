import './form-controls.css'

export default function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button type={type} className={`form-button ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
