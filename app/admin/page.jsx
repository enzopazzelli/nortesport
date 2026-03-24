'use client'

import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import LoginForm from '@/components/admin/LoginForm'
import { adminConfig } from '@/lib/admin'

export default function AdminLoginPage() {
  const router = useRouter()

  const handleLogin = (password) => {
    if (password === adminConfig.password) {
      sessionStorage.setItem('authenticated', 'true')
      router.push('/admin/dashboard')
      return true
    }
    return false
  }

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-2">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-dark">
              Norte Sport &mdash; Admin
            </h1>
            <p className="text-secondary text-sm">
              Ingres&aacute; tu contrase&ntilde;a para acceder al panel
            </p>
          </div>

          {/* Login form */}
          <LoginForm onLogin={handleLogin} />
        </div>

        <p className="text-center text-secondary/60 text-xs mt-6">
          &copy; {new Date().getFullYear()} Norte Sport. Panel administrativo.
        </p>
      </div>
    </div>
  )
}
