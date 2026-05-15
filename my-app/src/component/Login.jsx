import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ organization_id: '', email: '', password: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [success,  setSuccess]  = useState(false)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '', general: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.organization_id.trim())
      e.organization_id = 'Organization ID is required'
    if (!form.email.trim())
      e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address'
    if (!form.password)
      e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const clientErrors = validate()
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ organization_id: form.organization_id, email: form.email, password: form.password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('access_token',  data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        localStorage.setItem('user',          JSON.stringify(data.user))
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        if (data.error)    setErrors({ general: data.error })
        else if (data.email)    setErrors({ email: Array.isArray(data.email) ? data.email[0] : data.email })
        else if (data.password) setErrors({ password: Array.isArray(data.password) ? data.password[0] : data.password })
        else setErrors({ general: 'Login failed. Please try again.' })
      }
    } catch {
      setErrors({ general: 'Cannot connect to server. Make sure backend is running on port 8000.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (err) =>
    `w-full h-14 px-5 rounded-2xl border transition focus:outline-none focus:ring-4 ${
      err
        ? 'border-red-400 focus:ring-red-100 bg-red-50'
        : 'border-slate-200 focus:ring-green-100 focus:border-green-500 bg-slate-50'
    }`

  /* ── Success screen ── */
  if (success) return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #03140d 0%, #0a3d2e 30%, #0f6e56 70%, #1d9e75 100%)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome Back!</h2>
        <p className="text-slate-500 text-lg mb-1">Login successful.</p>
        <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
        <div className="mt-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(135deg, #1d9e75, #0f6e56)', animation: 'progress 1.5s linear forwards' }}
          />
        </div>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #03140d 0%, #0a3d2e 30%, #0f6e56 70%, #1d9e75 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-emerald-300/10 blur-3xl"></div>

      <div className="w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 relative z-10">

        {/* ── Left Side ── */}
        <div
          className="hidden lg:flex flex-col justify-center p-14 text-white relative"
          style={{ background: 'linear-gradient(135deg, #05281c 0%, #0f6e56 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl backdrop-blur-md">📦</div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">AssetHub</h1>
                <p className="text-white/70 text-sm mt-1">Smart Asset Management Platform</p>
              </div>
            </div>

            <h2 className="text-5xl font-black leading-tight mb-6">
              Welcome<br />Back 👋
            </h2>

            <p className="text-lg text-white/75 leading-8 max-w-md mb-10">
              Access your organization dashboard, monitor assets, and manage operations securely from anywhere.
            </p>

            <div className="space-y-5">
              {[
                ['🔐', 'Secure authentication system'],
                ['📊', 'Real-time analytics dashboard'],
                ['⚡', 'Fast and intelligent workflow'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">{icon}</div>
                  <span className="text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Side ── */}
        <div className="p-8 md:p-14 bg-white flex items-center">
          <div className="w-full max-w-md mx-auto">

            {/* Mobile logo */}
            <div className="mb-10 text-center lg:text-left">
              <div
                className="lg:hidden w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-5"
                style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
              >
                📦
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-3">Login Account</h2>
              <p className="text-slate-500 text-lg leading-7">Enter your credentials to continue</p>
            </div>

            {/* General error banner */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization ID <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter organization ID"
                  value={form.organization_id}
                  onChange={e => set('organization_id', e.target.value)}
                  className={inputCls(errors.organization_id)}
                />

                {errors.organization_id && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">
                    {errors.organization_id}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputCls(errors.email)}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-green-700 font-semibold cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className={inputCls(errors.password) + ' pr-14'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl transition"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="remember" className="w-5 h-5 accent-green-600 cursor-pointer" />
                  <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>
                <span className="text-sm text-slate-400">🔒 Secure Login</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-white font-bold text-lg transition hover:scale-[1.02] shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Login to Dashboard'}
              </button>

            </form>

            {/* Register link */}
            <div className="mt-10 text-center">
              <p className="text-slate-500 text-base">
                Don't have an account?
                <span
                  onClick={() => navigate('/register')}
                  className="text-green-700 font-bold cursor-pointer ml-2 hover:underline"
                >
                  Create Account
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}