export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-primary text-white',
    nuevo: 'bg-primary text-white',
    sale: 'bg-sale text-white',
    ultimas: 'bg-yellow-500 text-white',
    accent: 'bg-accent/20 text-accent border border-accent',
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-[11px] font-semibold uppercase tracking-wide rounded ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
