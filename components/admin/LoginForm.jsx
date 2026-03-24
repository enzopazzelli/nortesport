'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Small delay to feel more natural
    setTimeout(() => {
      const result = onLogin(password)
      if (!result) {
        setError('Contraseña incorrecta')
      }
      setLoading(false)
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-secondary mb-1.5"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            placeholder="Ingresá la contraseña"
            className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-white text-dark placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-dark"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sale text-sm font-medium bg-sale/5 border border-sale/20 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Ingresar
          </>
        )}
      </button>
    </form>
  )
}
