'use client'

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-accent text-white hover:bg-blue-600 focus:ring-accent',
    secondary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    outline: 'bg-transparent border border-white text-white hover:bg-white/10 focus:ring-white',
    whatsapp: 'bg-whatsapp text-white hover:bg-green-600 focus:ring-whatsapp',
    ghost: 'bg-transparent text-primary hover:bg-primary-light focus:ring-primary',
    danger: 'bg-sale text-white hover:bg-red-600 focus:ring-sale',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
