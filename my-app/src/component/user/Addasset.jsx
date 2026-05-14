import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const categories = ['Laptop', 'Mobile', 'Printer', 'Server', 'Networking', 'Furniture', 'Other']
const locations  = ['Pune Office', 'Mumbai Office', 'Delhi Office', 'Bangalore Office', 'Remote']
const statuses   = ['Available', 'Assigned', 'Maintenance']
const conditions = ['New', 'Good', 'Fair', 'Poor']

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

export default function AddAssetPage() {
  const navigate  = useNavigate()
  const fileRef   = useRef(null)

  const [form, setForm] = useState({
    name: '', assetId: '', category: '', status: 'Available',
    condition: 'New', location: '', assignedTo: '',
    purchaseDate: '', purchasePrice: '', warranty: '',
    vendor: '', serialNumber: '', description: ''
  })

  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted]  = useState(false)
  const [image, setImage]          = useState(null)      // base64 preview
  const [imageFile, setImageFile]  = useState(null)      // actual File object
  const [dragging, setDragging]    = useState(false)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())           e.name          = 'Asset name is required'
    if (!form.assetId.trim())        e.assetId       = 'Asset ID is required'
    if (!form.category)              e.category      = 'Category is required'
    if (!form.location)              e.location      = 'Location is required'
    if (!form.purchaseDate)          e.purchaseDate  = 'Purchase date is required'
    if (!form.purchasePrice.trim())  e.purchasePrice = 'Purchase price is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/assets'), 1500)
  }

  // Handle file — works for both input and drop
  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, etc.)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const onFileInput = (e) => handleFile(e.target.files[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const removeImage = () => {
    setImage(null)
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  if (submitted) return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
          <h2 className="text-xl font-black text-slate-800">Asset Added!</h2>
          <p className="text-slate-500 text-sm mt-1">Redirecting to Assets page...</p>
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
              onClick={() => navigate('/assets')}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-slate-600 text-lg"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Add New Asset</h1>
              <p className="text-slate-500 text-sm mt-0.5">Fill in the details to register a new asset.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/assets')}
              className="h-10 px-5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Save Asset
            </button>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto space-y-4">

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Asset Name" required error={errors.name}>
                <input
                  className={inputCls(errors.name)}
                  placeholder="e.g. Dell Latitude 5420"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </Field>

              <Field label="Asset ID" required error={errors.assetId}>
                <input
                  className={inputCls(errors.assetId)}
                  placeholder="e.g. AST-1001"
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

              <Field label="Serial Number">
                <input
                  className={inputCls(false)}
                  placeholder="e.g. SN-2024-XYZ"
                  value={form.serialNumber}
                  onChange={e => set('serialNumber', e.target.value)}
                />
              </Field>

              <Field label="Vendor / Brand">
                <input
                  className={inputCls(false)}
                  placeholder="e.g. Dell, Apple, HP"
                  value={form.vendor}
                  onChange={e => set('vendor', e.target.value)}
                />
              </Field>

              <Field label="Condition">
                <select
                  className={selectCls(false)}
                  value={form.condition}
                  onChange={e => set('condition', e.target.value)}
                >
                  {conditions.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>

            </div>

            {/* Description + Image side by side */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Description">
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
                  rows={5}
                  placeholder="Optional notes about this asset..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </Field>

              <Field label="Asset Image">
                {/* Hidden input always mounted */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileInput}
                />
              
                {!image ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileRef.current.click()}
                    className={`border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      dragging
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                    style={{ minHeight: '118px' }}
                  >
                    <div className="text-2xl">🖼️</div>
                    <p className="text-xs font-semibold text-slate-600">Drag & drop or click to upload</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG, WEBP — max 5MB</p>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-3 border border-slate-200 rounded-xl p-3"
                    style={{ minHeight: '118px' }}
                  >
                    <img
                      src={image}
                      alt="Asset preview"
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{imageFile?.name}</p>
                      <p className="text-[10px] text-slate-400 mb-3">
                        {imageFile ? (imageFile.size / 1024).toFixed(1) + ' KB' : ''}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileRef.current.click()}
                          className="h-7 px-3 rounded-lg border border-slate-200 text-[11px] font-semibold hover:bg-slate-100 transition"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="h-7 px-3 rounded-lg bg-red-50 text-red-600 text-[11px] font-semibold hover:bg-red-100 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Field>
              
            </div>
          </div>

          {/* Purchase Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Field label="Purchase Date" required error={errors.purchaseDate}>
                <input
                  type="date"
                  className={inputCls(errors.purchaseDate)}
                  value={form.purchaseDate}
                  onChange={e => set('purchaseDate', e.target.value)}
                />
              </Field>

              <Field label="Purchase Price (₹)" required error={errors.purchasePrice}>
                <input
                  className={inputCls(errors.purchasePrice)}
                  placeholder="e.g. 85000"
                  value={form.purchasePrice}
                  onChange={e => set('purchasePrice', e.target.value)}
                />
              </Field>

              <Field label="Warranty (months)">
                <input
                  className={inputCls(false)}
                  placeholder="e.g. 24"
                  value={form.warranty}
                  onChange={e => set('warranty', e.target.value)}
                />
              </Field>

            </div>
          </div>

          {/* Assignment & Location */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4">Assignment & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Field label="Status">
                <select
                  className={selectCls(false)}
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  {statuses.map(s => <option key={s}>{s}</option>)}
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

              <Field label="Assigned To">
                <input
                  className={`${inputCls(false)} ${form.status !== 'Assigned' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                  placeholder="Employee name or team"
                  value={form.assignedTo}
                  onChange={e => set('assignedTo', e.target.value)}
                  disabled={form.status !== 'Assigned'}
                />
              </Field>

            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <button
              onClick={() => navigate('/assets')}
              className="h-10 px-6 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-6 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              Save Asset
            </button>
          </div>

        </div>
      </div>
    </UserLayout>
  )
}