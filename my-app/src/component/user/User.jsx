import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

const ROLE_STYLES = {
  admin:    'bg-purple-100 text-purple-700',
  manager:  'bg-blue-100 text-blue-700',
  employee: 'bg-emerald-100 text-emerald-700',
  viewer:   'bg-slate-100 text-slate-600',
}

function SkeletonRow() {
  return (
    <tr className="border-t border-slate-100 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </td>
      ))}
    </tr>
  )
}

function Avatar({ user }) {
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U'
  if (user.avatar) {
    return (
      <img
        src={`${API_BASE}/${user.avatar}`}
        alt={initials}
        className="w-9 h-9 rounded-xl object-cover"
      />
    )
  }
  const colors = ['from-emerald-400 to-green-600', 'from-blue-400 to-cyan-600',
                  'from-purple-400 to-violet-600', 'from-orange-400 to-amber-600']
  const color = colors[user.id % colors.length]
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-black`}>
      {initials}
    </div>
  )
}

export default function UsersPage() {
  const navigate = useNavigate()

  const [users,         setUsers]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [searchInput,   setSearchInput]   = useState('')
  const [search,        setSearch]        = useState('')
  const [roleFilter,    setRoleFilter]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [deleting,      setDeleting]      = useState(null)

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(searchTimeout)
    setSearchTimeout(setTimeout(() => setSearch(val), 400))
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/api/users')
      setUsers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.first_name} ${user.last_name}"? This cannot be undone.`)) return
    setDeleting(user.id)
    try {
      await apiFetch(`/api/users/${user.id}`, { method: 'DELETE' })
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (e) {
      alert(e.message)
    } finally {
      setDeleting(null)
    }
  }

  // Client-side filter (search, role, status)
  const filtered = users.filter(u => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase()
    const matchSearch = !search ||
      fullName.includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase())
    const matchRole   = !roleFilter   || u.role?.toLowerCase() === roleFilter
    const matchStatus = !statusFilter || (statusFilter === 'active' ? u.is_active : !u.is_active)
    return matchSearch && matchRole && matchStatus
  })

  const stats = {
    total:    users.length,
    active:   users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admins:   users.filter(u => u.role?.toLowerCase() === 'admin').length,
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Users Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage all user accounts and permissions.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-64 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition text-slate-600"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition text-slate-600"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {canManageUsers && (
            <button
              onClick={() => navigate('/users/add')}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + Add User
            </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {[
            { label: 'Total Users',    value: stats.total,    icon: '👥', color: 'from-emerald-500 to-green-600' },
            { label: 'Active Users',   value: stats.active,   icon: '✅', color: 'from-blue-500 to-cyan-600'    },
            { label: 'Inactive Users', value: stats.inactive, icon: '🚫', color: 'from-orange-500 to-amber-600' },
            { label: 'Admins',         value: stats.admins,   icon: '🛡️', color: 'from-purple-500 to-violet-600'},
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-xs tracking-wide mb-1">{label}</p>
                  {loading
                    ? <div className="h-9 w-14 bg-slate-200 rounded animate-pulse mt-1" />
                    : <h2 className="text-3xl font-black text-slate-800">{value}</h2>
                  }
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-xl text-white`}>
                  {icon}
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">Live data from database</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Table header bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-800">All Users</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {loading ? 'Loading…' : `${filtered.length} user${filtered.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 h-9 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition disabled:opacity-50"
              >
                {loading ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
                <button onClick={fetchUsers} className="ml-auto underline font-semibold">Retry</button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Employee ID', 'Role', 'Department', 'Location', 'Status', 'Joined', 'Actions'].map(col => (
                      <th key={col} className="text-left px-5 py-3 text-slate-500 uppercase text-xs font-bold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-16 text-center">
                          <div className="text-4xl mb-2">👥</div>
                          <p className="text-slate-500 font-semibold text-sm">No users found.</p>
                          <button
                            onClick={() => navigate('/add-user')}
                            className="mt-3 px-4 h-9 rounded-xl text-white text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                          >
                            + Add your first user
                          </button>
                        </td>
                      </tr>
                    )
                    : filtered.map(user => (
                      <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50 transition">

                        {/* User cell with avatar */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar user={user} />
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-tight">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-slate-400 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-sm font-semibold text-emerald-700 whitespace-nowrap">
                          {user.employee_id || '—'}
                        </td>

                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${ROLE_STYLES[user.role?.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                            {user.role || '—'}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {user.department || '—'}
                        </td>

                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {user.location || '—'}
                        </td>

                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">
                          {formatDate(user.joining_date || user.created_at)}
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/users/${user.id}`)}
                              className="px-3 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/users/${user.id}/edit`)}
                              className="px-3 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={deleting === user.id}
                              className="px-3 h-8 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition disabled:opacity-50"
                            >
                              {deleting === user.id ? '…' : 'Delete'}
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