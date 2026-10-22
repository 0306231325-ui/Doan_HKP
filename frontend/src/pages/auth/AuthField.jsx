export default function AuthField({ label, name, ...props }) {
  return (
    <div className="auth-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} required {...props} />
    </div>
  )
}
