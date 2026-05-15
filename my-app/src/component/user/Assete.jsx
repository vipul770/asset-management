import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'


async function apiFetch(path, options = {}) {
  // Match the same key Dashboard uses
  const token = localStorage.getItem('access_token')
  

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // Guard: if the server returns HTML (404 page, nginx error, etc.)
  // parsing it as JSON would throw "Unexpected token '<'"
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

const STATUS_STYLES = {
  assigned:    'bg-emerald-100 text-emerald-700',
  available:   'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
}

const STAT_CONFIGS = [
  { key: 'total',       label: 'Total Assets',     icon: '📦' },
  { key: 'assigned',    label: 'Assigned Assets',   icon: '👤' },
  { key: 'available',   label: 'Available Assets',  icon: '✅' },
  { key: 'maintenance', label: 'Maintenance',        icon: '🛠️' },
]

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status?.toLowerCase()] || 'bg-slate-100 text-slate-600'
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${cls}`}>
      {status || '—'}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-t border-slate-100 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </td>
      ))}
    </tr>
  )
}

export default function AssetsPage() {
  const navigate = useNavigate()

  const [assets, setAssets]       = useState([])
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError]         = useState(null)

  // Filter state
  const [search, setSearch]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const currentUser = JSON.parse(localStorage.getItem('user'))

  const isAdminOrManager = ['admin', 'manager'].includes(currentUser?.role?.toLowerCase())

  // Debounce search
  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(searchTimeout)
    setSearchTimeout(setTimeout(() => setSearch(val), 400))
  }

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search)       params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const query = params.toString() ? `?${params}` : ''
      const data = await apiFetch(`/api/assets${query}`)
      setAssets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await apiFetch('/api/assets/stats')
      setStats(data)
    } catch {
      // Stats failure is non-critical
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchAssets() }, [fetchAssets])
  useEffect(() => { fetchStats()  }, [fetchStats])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Assets Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage and monitor all company assets.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Search assets..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-64 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition text-slate-600"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
            </select>
            {isAdminOrManager && (
              <button
                onClick={() => navigate('/add-asset')}
                className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
                style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
              >
              + Add Asset
            </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {STAT_CONFIGS.map(({ key, label, icon }) => (
            <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-xs tracking-wide mb-1">{label}</p>
                  {statsLoading ? (
                    <div className="h-9 w-16 bg-slate-200 rounded animate-pulse mt-1" />
                  ) : (
                    <h2 className="text-3xl font-black text-slate-800">
                      {stats ? (stats[key] ?? 0).toLocaleString() : '—'}
                    </h2>
                  )}
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-xl text-white">
                  {icon}
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">Live data from database</p>
            </div>
          ))}
        </div>

        {/* Asset Table */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-800">All Assets</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {loading ? 'Loading…' : `${assets.length} asset${assets.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAssets}
                  disabled={loading}
                  className="px-4 h-9 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition disabled:opacity-50"
                >
                  {loading ? 'Refreshing…' : '↻ Refresh'}
                </button>
                <button className="px-4 h-9 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition">
                  Export Report
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
                <button
                  onClick={fetchAssets}
                  className="ml-auto underline font-semibold hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {['Asset ID', 'Asset Name', 'Category', 'Assigned To', 'Location', 'Status', 'Purchase Date', 'Actions'].map(col => (
                      <th key={col} className="text-left px-5 py-3 text-slate-500 uppercase text-xs font-bold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : assets.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">
                          {error ? 'Failed to load assets.' : 'No assets found.'}
                        </td>
                      </tr>
                    )
                    : assets.map((asset) => (
                      <tr key={asset.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-bold text-emerald-700 text-sm whitespace-nowrap">
                          {asset.asset_id}
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">
                          {asset.name}
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm">
                          {asset.category?.name || '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {asset.assigned_to
                            ? `${asset.assigned_to.first_name ?? ''} ${asset.assigned_to.last_name ?? ''}`.trim() || asset.assigned_to.email
                            : '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {asset.location || '—'}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={asset.status} />
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {formatDate(asset.purchase_date)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/assets/${asset.id}`)}
                              className="px-3 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/assets/${asset.id}/edit`)}
                              className="px-3 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </UserLayout>
  )
}