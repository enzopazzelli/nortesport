export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-border rounded-xl ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
