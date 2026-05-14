import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const roles      = ['Admin', 'Manager', 'Employee', 'Viewer']
const departments = ['IT', 'HR', 'Finance', 'Sales', 'Operations', 'Marketing', 'Admin']
const locations  = ['Pune Office', 'Mumbai Office', 'Delhi Office', 'Bangalore Office', 'Remote']

const inputCls = (err) =>
  `w-full h-10 rounded-xl border px-3 text-sm outline-none transition ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-slate-200 focus:ring-2 focus:ring-green-100 focus:border-green-500'
  }`

const selectCls = (err) =>
  `w-full h-10 rounded-xl border px-3 text-sm outline-none bg-white transition ${
    err
      ? 'border-red-400'
      : 'border-slate-200 focus:ring-2 focus:ring-green-100 focus:border-green-500'
  }`

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function AddUserPage() {
  const navigate = useNavigate()
  const avatarRef = useRef(null)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    role: '', department: '', location: '',
    employeeId: '', joiningDate: '',
    password: '', confirmPassword: '',
    status: 'Active', notes: ''
  })

  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted]  = useState(false)
  const [avatar, setAvatar]        = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [showPass, setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim())      e.firstName  = 'First name is required'
    if (!form.lastName.trim())       e.lastName   = 'Last name is required'
    if (!form.email.trim())          e.email      = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                     e.email      = 'Enter a valid email'
    if (!form.phone.trim())          e.phone      = 'Phone is required'
    if (!form.role)                  e.role       = 'Role is required'
    if (!form.department)            e.department = 'Department is required'
    if (!form.location)              e.location   = 'Location is required'
    if (!form.employeeId.trim())     e.employeeId = 'Employee ID is required'
    if (!form.joiningDate)           e.joiningDate = 'Joining date is required'
    if (!form.password)              e.password   = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (!form.confirmPassword)       e.confirmPassword = 'Please confirm password'
    else if (form.password !== form.confirmPassword)
                                     e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/users'), 1500)
  }

  const handleAvatar = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return }
    if (file.size > 3 * 1024 * 1024)    { alert('Image must be under 3MB'); return }
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setAvatar(e.target.result)
    reader.readAsDataURL(file)
  }

  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || 'U'

  if (submitted) return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
          <h2 className="text-xl font-black text-slate-800">User Created!</h2>
          <p className="text-slate-500 text-sm mt-1">Redirecting to Users page...</p>
        </div>
      </div>
    </UserLayout>
  )

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/users')}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-slate-600 text-lg"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Add New User</h1>
              <p className="text-slate-500 text-sm mt-0.5">Create a new user account and assign a role.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/users')}
              className="h-10 px-5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Create User
            </button>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-4">

          {/* Avatar + Basic Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Profile & Basic Info</h2>

            <div className="flex flex-col md:flex-row gap-6">

              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div
                  onClick={() => avatarRef.current.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 cursor-pointer overflow-hidden flex items-center justify-center transition-all bg-slate-50 hover:bg-emerald-50"
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-300">
                        {form.firstName || form.lastName ? initials : '👤'}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1">Upload</p>
                    </div>
                  )}
                </div>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleAvatar(e.target.files[0])}
                />
                {avatar && (
                  <button
                    type="button"
                    onClick={() => { setAvatar(null); setAvatarFile(null) }}
                    className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                )}
                <p className="text-[10px] text-slate-400 text-center">JPG, PNG<br/>max 3MB</p>
              </div>

              {/* Name + Email + Phone */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="First Name" required error={errors.firstName}>
                  <input
                    className={inputCls(errors.firstName)}
                    placeholder="e.g. Vipul"
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                  />
                </Field>

                <Field label="Last Name" required error={errors.lastName}>
                  <input
                    className={inputCls(errors.lastName)}
                    placeholder="e.g. Singh"
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                  />
                </Field>

                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    className={inputCls(errors.email)}
                    placeholder="e.g. vipul@company.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                  />
                </Field>

                <Field label="Phone Number" required error={errors.phone}>
                  <input
                    type="tel"
                    className={inputCls(errors.phone)}
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Role & Department</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Field label="Employee ID" required error={errors.employeeId}>
                <input
                  className={inputCls(errors.employeeId)}
                  placeholder="e.g. EMP-1001"
                  value={form.employeeId}
                  onChange={e => set('employeeId', e.target.value)}
                />
              </Field>

              <Field label="Role" required error={errors.role}>
                <select
                  className={selectCls(errors.role)}
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                >
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>

              <Field label="Department" required error={errors.department}>
                <select
                  className={selectCls(errors.department)}
                  value={form.department}
                  onChange={e => set('department', e.target.value)}
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Location" required error={errors.location}>
                <select
                  className={selectCls(errors.location)}
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                >
                  <option value="">Select location</option>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>

              <Field label="Joining Date" required error={errors.joiningDate}>
                <input
                  type="date"
                  className={inputCls(errors.joiningDate)}
                  value={form.joiningDate}
                  onChange={e => set('joiningDate', e.target.value)}
                />
              </Field>

              <Field label="Status">
                <div className="flex gap-3 h-10 items-center">
                  {['Active', 'Inactive'].map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={() => set('status', s)}
                        className="accent-emerald-600"
                      />
                      <span className={`text-sm font-semibold ${
                        form.status === s
                          ? s === 'Active' ? 'text-emerald-600' : 'text-red-500'
                          : 'text-slate-400'
                      }`}>{s}</span>
                    </label>
                  ))}
                </div>
              </Field>

            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Account Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Password" required error={errors.password}>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={inputCls(errors.password) + ' pr-10'}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password" required error={errors.confirmPassword}>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={inputCls(errors.confirmPassword) + ' pr-10'}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </Field>

            </div>

            {/* Password strength */}
            {form.password && (
              <div className="mt-3">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        form.password.length >= i * 3
                          ? form.password.length < 6  ? 'bg-red-400'
                          : form.password.length < 9  ? 'bg-amber-400'
                          : 'bg-emerald-500'
                          : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-[11px] font-semibold ${
                  form.password.length < 6  ? 'text-red-500'
                  : form.password.length < 9  ? 'text-amber-500'
                  : 'text-emerald-600'
                }`}>
                  {form.password.length < 6  ? 'Weak'
                  : form.password.length < 9  ? 'Medium'
                  : 'Strong'}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Additional Notes</h2>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
              rows={3}
              placeholder="Any additional information about this user..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <button
              onClick={() => navigate('/users')}
              className="h-10 px-6 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-6 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Create User
            </button>
          </div>

        </div>
      </div>
    </UserLayout>
  )
}