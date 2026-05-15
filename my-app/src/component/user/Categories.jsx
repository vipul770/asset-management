import React, { useState, useEffect, useCallback } from 'react'
import UserLayout from './UserLayout'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const currentUser = JSON.parse(localStorage.getItem('user'))

  const canManageUsers =
    ['admin', 'manager'].includes(
      currentUser?.role?.toLowerCase()
    )

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    const detail = isJson
      ? (await res.json().catch(() => ({}))).detail
      : `Server returned ${res.status} (${res.statusText})`
    throw new Error(detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  if (!isJson) throw new Error(`Expected JSON but got ${contentType}`)
  return res.json()
}

// Fallback gradient colors for categories that don't have one stored
const FALLBACK_COLORS = [
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-green-600',
  'from-orange-500 to-amber-600',
  'from-purple-500 to-violet-600',
  'from-pink-500 to-rose-600',
  'from-slate-500 to-gray-700',
]

const FALLBACK_ICON = '📦'

function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-slate-50 rounded-xl p-2.5">
            <div className="h-2 w-16 bg-slate-200 rounded mb-1" />
            <div className="h-5 w-10 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-8 rounded-xl bg-slate-200" />
        <div className="w-8 h-8 rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}

// Modal for Add / Edit category
function CategoryModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name:        initial?.name        || '',
    icon:        initial?.icon        || '',
    description: initial?.description || '',
    color:       initial?.color       || FALLBACK_COLORS[0],
  })
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr('Name is required.'); return }
    setSaving(true)
    setErr('')
    try {
      if (initial) {
        await apiFetch(`/api/categories/${initial.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
      } else {
        await apiFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }
      onSave()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-800">
            {initial ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-500 font-bold">✕</button>
        </div>

        {err && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {err}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full h-10 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
              placeholder="e.g. Laptops"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon (emoji)</label>
            <input
              value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              className="w-full h-10 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
              placeholder="e.g. 💻"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition resize-none"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {FALLBACK_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${c} transition ring-offset-1 ${form.color === c ? 'ring-2 ring-slate-400' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-10 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition"
            style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
          >
            {saving ? 'Saving…' : initial ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories,    setCategories]    = useState([])
  const [stats,         setStats]         = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [search,        setSearch]        = useState('')
  const [searchInput,   setSearchInput]   = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [modal,         setModal]         = useState(null)   // null | 'add' | category object
  const [deleting,      setDeleting]      = useState(null)   // category id being deleted

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(searchTimeout)
    setSearchTimeout(setTimeout(() => setSearch(val), 400))
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/api/categories')
      setCategories(data)

      // Derive stats from the category list
      const total      = data.length
      const totalAssets = data.reduce((s, c) => s + (c.asset_count ?? 0), 0)
      setStats({ total, totalAssets })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return
    setDeleting(category.id)
    try {
      await apiFetch(`/api/categories/${category.id}`, { method: 'DELETE' })
      setCategories(prev => prev.filter(c => c.id !== category.id))
    } catch (e) {
      alert(e.message)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Modal */}
        {modal && (
          <CategoryModal
            initial={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); fetchCategories() }}
          />
        )}

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black text-slate-800">Asset Categories</h1>
            <p className="text-slate-500 mt-2 text-lg">Organize and manage asset categories efficiently.</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-80 h-14 rounded-2xl border border-slate-200 bg-white px-6 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            />
            {canManageUsers && (
            <button
              onClick={() => setModal('add')}
              className="h-14 px-8 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + Add Category
            </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-8">
          {[
            ['Total Categories', loading ? null : stats?.total,        '🗂️'],
            ['Total Assets',     loading ? null : stats?.totalAssets,  '📦'],
            ['Active Categories',loading ? null : stats?.total,        '✅'],
            ['Maintenance Items',loading ? null : '—',                 '🛠️'],
          ].map(([title, value, icon], i) => (
            <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-sm tracking-wide mb-2">{title}</p>
                  {loading
                    ? <div className="h-10 w-16 bg-slate-200 rounded animate-pulse mt-1" />
                    : <h2 className="text-5xl font-black text-slate-800">{value ?? 0}</h2>
                  }
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-3xl text-white shadow-lg">
                  {icon}
                </div>
              </div>
              <p className="text-slate-400 font-semibold text-sm">Live data from database</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-8 mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchCategories} className="ml-auto underline font-semibold">Retry</button>
          </div>
        )}

        {/* Categories Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : filtered.length === 0
              ? (
                <div className="col-span-3 py-20 text-center text-slate-400">
                  <div className="text-5xl mb-3">🗂️</div>
                  <p className="font-semibold text-slate-500">No categories found.</p>
                  <button
                    onClick={() => setModal('add')}
                    className="mt-4 px-5 h-10 rounded-xl text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                  >
                    + Add your first category
                  </button>
                </div>
              )
              : filtered.map((category, index) => {
                  const color = category.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                  const icon  = category.icon  || FALLBACK_ICON

                  return (
                    <div key={category.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition duration-300">

                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-xl text-white`}>
                            {icon}
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-slate-800">{category.name}</h2>
                            {category.description && (
                              <p className="text-xs text-slate-400 truncate max-w-[160px]">{category.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        {canManageUsers && (
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deleting === category.id}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 transition text-sm disabled:opacity-50"
                          title="Delete category"
                        >
                          {deleting === category.id ? '…' : '🗑'}
                        </button>
                        )}
                      </div>

                      {/* Stats grid — asset_count comes from backend */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Total Assets</p>
                          <h3 className="text-lg font-bold text-slate-800">{category.asset_count ?? '—'}</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Assigned</p>
                          <h3 className="text-lg font-bold text-emerald-600">{category.assigned_count ?? '—'}</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Available</p>
                          <h3 className="text-lg font-bold text-blue-600">{category.available_count ?? '—'}</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5">
                          <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Maintenance</p>
                          <h3 className="text-lg font-bold text-orange-600">{category.maintenance_count ?? '—'}</h3>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-2">
                        <button
                          className="flex-1 h-8 rounded-xl text-white text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                        >
                          View Assets
                        </button>
                        {canManageUsers && (
                          <button
                            onClick={() => setModal(category)}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-sm"
                            title="Edit"
                          >
                            ✏️
                          </button>
                        )}
                      </div>

                    </div>
                  )
                })
            }
          </div>
        </div>

      </div>
    </UserLayout>
  )
}