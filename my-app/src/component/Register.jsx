import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name:        '',
    company:          '',
    email:            '',
    phone:            '',
    password:         '',
    confirm_password: '',
    org_type:         '',
    agree:            false
  })

  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '', general: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim())        e.full_name        = 'Full name is required'
    if (!form.company.trim())          e.company          = 'Company name is required'
    if (!form.email.trim())            e.email            = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                       e.email            = 'Enter a valid email'
    if (!form.phone.trim())            e.phone            = 'Phone number is required'
    if (!form.password)                e.password         = 'Password is required'
    else if (form.password.length < 6) e.password         = 'Minimum 6 characters'
    if (!form.confirm_password)        e.confirm_password = 'Please confirm your password'
    else if (form.password !== form.confirm_password)
                                       e.confirm_password = 'Passwords do not match'
    if (!form.org_type)                e.org_type         = 'Please select organization type'
    if (!form.agree)                   e.agree            = 'You must agree to the terms'
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

    const parts      = form.full_name.trim().split(' ')
    const first_name = parts[0]
    const last_name  = parts.slice(1).join(' ') || parts[0]

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          email:            form.email,
          phone:            form.phone,
          password:         form.password,
          confirm_password: form.confirm_password,
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Save tokens
        localStorage.setItem('access_token',  data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        localStorage.setItem('user',          JSON.stringify(data.user))
        localStorage.setItem('organization_id', data.user.organization_id)

        alert(`Your Organization ID: ${data.user.organization_id}`)
              
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      } else {
        // FastAPI error format: { detail: "..." } or { detail: { email: "..." } }
        const serverErrors = {}

        if (data.detail) {
          if (typeof data.detail === 'string') {
            serverErrors.general = data.detail
          } else if (typeof data.detail === 'object') {
            // field-level errors from FastAPI
            Object.entries(data.detail).forEach(([key, val]) => {
              serverErrors[key] = Array.isArray(val) ? val[0] : val
            })
          } else if (Array.isArray(data.detail)) {
            // Pydantic validation errors
            data.detail.forEach(err => {
              const field = err.loc?.[1] || 'general'
              serverErrors[field] = err.msg
            })
          }
        }

        if (!Object.keys(serverErrors).length) {
          serverErrors.general = 'Registration failed. Please try again.'
        }

        setErrors(serverErrors)
      }
    } catch (err) {
      setErrors({ general: 'Cannot connect to server. Make sure the backend is running on port 8000.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (err) =>
    `w-full h-14 px-5 rounded-2xl border transition focus:outline-none focus:ring-4 ${
      err
        ? 'border-red-400 focus:ring-red-100 bg-red-50'
        : 'border-slate-200 focus:ring-green-100 focus:border-green-500'
    }`

  if (success) return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #0f6e56 50%, #1d9e75 100%)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Account Created!</h2>
        <p className="text-slate-500 text-lg mb-1">Your account has been registered successfully.</p>
        <p className="text-slate-400 text-sm">Redirecting to login page...</p>
        <div className="mt-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background:  'linear-gradient(135deg, #1d9e75, #0f6e56)',
              animation:   'progress 2s linear forwards'
            }}
          />
        </div>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #0f6e56 50%, #1d9e75 100%)' }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto">

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-800 mb-3">Create Account</h2>
              <p className="text-slate-500 text-lg">Register your organization account</p>
            </div>

            {/* General error banner */}
            {errors.general && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={e => set('full_name', e.target.value)}
                  className={inputCls(errors.full_name)}
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.full_name}</p>}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  className={inputCls(errors.company)}
                />
                {errors.company && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.company}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputCls(errors.email)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={inputCls(errors.phone)}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone}</p>}
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className={inputCls(errors.password)}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirm_password}
                    onChange={e => set('confirm_password', e.target.value)}
                    className={inputCls(errors.confirm_password)}
                  />
                  {errors.confirm_password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirm_password}</p>}
                </div>
              </div>

              {/* Org Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.org_type}
                  onChange={e => set('org_type', e.target.value)}
                  className={inputCls(errors.org_type) + ' bg-white'}
                >
                  <option value="">Select organization type</option>
                  <option>IT Company</option>
                  <option>Manufacturing</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
                {errors.org_type && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.org_type}</p>}
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={form.agree}
                    onChange={e => set('agree', e.target.checked)}
                    className="mt-1 w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-sm text-slate-600 leading-6 cursor-pointer">
                    I agree to the <span className="text-green-700 font-semibold">Terms & Conditions</span> and <span className="text-green-700 font-semibold">Privacy Policy</span>.
                  </label>
                </div>
                {errors.agree && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.agree}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-white font-bold text-lg transition hover:scale-[1.02] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>

            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500">
                Already have an account?
                <span
                  onClick={() => navigate('/login')}
                  className="text-green-700 font-semibold cursor-pointer ml-2 hover:underline"
                >
                  Login
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}