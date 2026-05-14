import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const priorities  = ['Low', 'Medium', 'High', 'Critical']
const categories  = ['Laptop', 'Mobile', 'Printer', 'Server', 'Networking', 'Electrical', 'Furniture', 'Other']
const locations   = ['Pune Office', 'Mumbai Office', 'Delhi Office', 'Bangalore Office', 'Remote']
const technicians = ['Ravi Kumar', 'Suresh Patil', 'Amit Shah', 'Priya Mehta', 'Kiran Desai']

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

export default function AddMaintenancePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    assetName: '', assetId: '', category: '', location: '',
    issue: '', priority: 'Medium', assignedTo: '',
    reportedDate: '', dueDate: '', notes: ''
  })

  const [errors, setErrors]      = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.assetName.trim())  e.assetName    = 'Asset name is required'
    if (!form.assetId.trim())    e.assetId      = 'Asset ID is required'
    if (!form.category)          e.category     = 'Category is required'
    if (!form.location)          e.location     = 'Location is required'
    if (!form.issue.trim())      e.issue        = 'Issue description is required'
    if (!form.reportedDate)      e.reportedDate = 'Reported date is required'
    if (!form.dueDate)           e.dueDate      = 'Due date is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/maintenance'), 1500)
  }

  if (submitted) return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
          <h2 className="text-xl font-black text-slate-800">Request Submitted!</h2>
          <p className="text-slate-500 text-sm mt-1">Redirecting to Maintenance page...</p>
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
              onClick={() => navigate('/maintenance')}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-slate-600 text-lg"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800">New Maintenance Request</h1>
              <p className="text-slate-500 text-sm mt-0.5">Log a new asset maintenance or repair request.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/maintenance')}
              className="h-10 px-5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Submit Request
            </button>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto space-y-4">

          {/* Asset Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Asset Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Asset Name" required error={errors.assetName}>
                <input
                  className={inputCls(errors.assetName)}
                  placeholder="e.g. HP LaserJet Printer"
                  value={form.assetName}
                  onChange={e => set('assetName', e.target.value)}
                />
              </Field>

              <Field label="Asset ID" required error={errors.assetId}>
                <input
                  className={inputCls(errors.assetId)}
                  placeholder="e.g. AST-1004"
                  value={form.assetId}
                  onChange={e => set('assetId', e.target.value)}
                />
              </Field>

              <Field label="Category" required error={errors.category}>
                <select
                  className={selectCls(errors.category)}
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
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

            </div>
          </div>

          {/* Issue Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Issue Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              <Field label="Priority">
                <div className="flex gap-2 flex-wrap h-10 items-center">
                  {priorities.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set('priority', p)}
                      className={`px-3 h-8 rounded-lg text-xs font-bold transition ${
                        form.priority === p
                          ? p === 'Critical' ? 'bg-red-500 text-white'
                          : p === 'High'     ? 'bg-orange-500 text-white'
                          : p === 'Medium'   ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Assigned Technician">
                <select
                  className={selectCls(false)}
                  value={form.assignedTo}
                  onChange={e => set('assignedTo', e.target.value)}
                >
                  <option value="">Select technician</option>
                  {technicians.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>

            </div>

            <Field label="Issue Description" required error={errors.issue}>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
                rows={4}
                placeholder="Describe the issue in detail..."
                value={form.issue}
                onChange={e => set('issue', e.target.value)}
              />
              {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}
            </Field>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Reported Date" required error={errors.reportedDate}>
                <input
                  type="date"
                  className={inputCls(errors.reportedDate)}
                  value={form.reportedDate}
                  onChange={e => set('reportedDate', e.target.value)}
                />
              </Field>

              <Field label="Due Date" required error={errors.dueDate}>
                <input
                  type="date"
                  className={inputCls(errors.dueDate)}
                  value={form.dueDate}
                  onChange={e => set('dueDate', e.target.value)}
                />
              </Field>

            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Additional Notes</h2>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
              rows={3}
              placeholder="Any extra context or instructions..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <button
              onClick={() => navigate('/maintenance')}
              className="h-10 px-6 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-6 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Submit Request
            </button>
          </div>

        </div>
      </div>
    </UserLayout>
  )
}