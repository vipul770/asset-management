import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const API = 'http://localhost:8000'

const statusStyle = {
  assigned:    'bg-emerald-100 text-emerald-700',
  available:   'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
  retired:     'bg-slate-100 text-slate-500',
}

const ROLE_LABELS = {
  admin:    'Administrator',
  manager:  'Manager',
  employee: 'Employee',
  viewer:   'Viewer',
}

export default function DashboardPage() {
  const navigate = useNavigate()

  const [me,      setMe]      = useState(null)
  const [stats,   setStats]   = useState(null)
  const [assets,  setAssets]  = useState([])
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  

  const token = localStorage.getItem('access_token')
  const isAdminOrManager = ['admin', 'manager'].includes(me?.role?.toLowerCase())

  const fetchData = useCallback(async () => {
    if (!token) { navigate('/login'); return }
    setLoading(true)
    setError('')

    const headers = {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      const meRes = await fetch(`${API}/api/users/me`, { headers })
      if (meRes.status === 401) { localStorage.clear(); navigate('/login'); return }
      const meData = await meRes.json()
      setMe(meData)
      localStorage.setItem('user', JSON.stringify(meData))

      const statsRes = await fetch(`${API}/api/reports/dashboard-stats`, { headers })
      if (statsRes.ok) setStats(await statsRes.json())

      const assetsRes = await fetch(`${API}/api/assets`, { headers })
      if (assetsRes.ok) {
        const all = await assetsRes.json()
        const filtered = Array.isArray(all)
          ? ['admin', 'manager'].includes(meData.role?.toLowerCase())
            ? all.slice(0, 5)
            : all.filter(a => a.assigned_to_id === meData.id).slice(0, 5)
          : []
        setAssets(filtered)
      }

      if (['admin', 'manager'].includes(meData.role?.toLowerCase())) {
        const usersRes = await fetch(`${API}/api/users`, { headers })
        if (usersRes.ok) {
          const allUsers = await usersRes.json()
          setUsers(Array.isArray(allUsers) ? allUsers.slice(0, 5) : [])
        }
      }
    } catch {
      setError('Failed to load dashboard data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    const saved = localStorage.getItem('user')
    if (saved) { try { setMe(JSON.parse(saved)) } catch {} }
    fetchData()
  }, [token, navigate, fetchData])

  // const handleLogout = () => { localStorage.clear(); navigate('/login') }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const statCards = [
    { title: 'Total Assets',     value: stats?.total_assets,       icon: '📦', color: 'from-emerald-500 to-green-600' },
    { title: 'Active Users',     value: stats?.active_users,       icon: '👥', color: 'from-blue-500 to-cyan-600' },
    { title: 'Pending Requests', value: stats?.pending_maintenance, icon: '⏳', color: 'from-orange-500 to-amber-600' },
    { title: 'Maintenance Due',  value: stats?.maintenance_assets,  icon: '🛠️', color: 'from-red-500 to-rose-600' }
  ]

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Welcome back{me ? `, ${me.first_name} ${me.last_name}` : ''}! Here's your overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search assets..."
              className="w-60 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button
              onClick={fetchData}
              className="w-10 h-10 rounded-xl bg-slate-100 text-lg hover:bg-slate-200 transition"
              title="Refresh"
            >
              🔔
            </button>
            
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <button onClick={fetchData} className="ml-auto text-xs text-red-500 underline font-semibold">Retry</button>
          </div>
        )}

        <div className="p-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{item.title}</p>
                    <h2 className="text-3xl font-black text-slate-800">
                      {loading
                        ? <span className="inline-block w-12 h-8 bg-slate-200 rounded animate-pulse" />
                        : (item.value ?? 0)
                      }
                    </h2>
                  </div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-xl text-white`}>
                    {item.icon}
                  </div>
                </div>
                <p className="text-emerald-600 text-xs font-semibold">⬆ Updated live</p>
              </div>
            ))}
          </div>

          {/* Table + Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Assets Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    {isAdminOrManager ? 'Recent Assets' : 'My Assigned Assets'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">Manage and monitor all company assets</p>
                </div>
                {isAdminOrManager && (
                  <button
                    onClick={() => navigate('/add-asset')}
                    className="px-4 h-9 rounded-xl text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                  >
                    + Add Asset
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center text-slate-400 text-sm animate-pulse">Loading assets...</div>
                ) : assets.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-slate-500 text-sm font-semibold">No assets found.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Asset Name', 'Category', 'Status', 'Assigned To'].map(col => (
                          <th key={col} className="text-left px-5 py-3 text-slate-500 font-bold uppercase text-xs">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset, i) => (
                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-5 py-3 font-semibold text-slate-800 text-sm">{asset.name}</td>
                          <td className="px-5 py-3 text-slate-600 text-sm">{asset.category_id || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusStyle[asset.status] || 'bg-slate-100 text-slate-600'}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-600 text-sm font-medium">
                            {asset.assigned_to_id ? `User #${asset.assigned_to_id}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {!loading && assets.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-100">
                  <button onClick={() => navigate('/assets')} className="text-emerald-600 text-xs font-bold hover:underline">
                    View all assets →
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-base font-black text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  ['📦', 'New asset added',               '2 mins ago'],
                  ['👤', 'User assigned laptop',          '10 mins ago'],
                  ['🛠️', 'Maintenance request submitted', '30 mins ago'],
                  ['📊', 'Monthly report generated',      '1 hour ago'],
                  ['🔔', 'Asset warranty expiring',       '2 hours ago']
                ].map(([icon, title, time], i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-base flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end grid */}

          {/* Users Table — admin/manager only */}
          {isAdminOrManager && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">Recent Users</h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''} shown`}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/users/add')}
                  className="px-4 h-9 rounded-xl text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                >
                  + Add User
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm animate-pulse">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-slate-500 text-sm font-semibold">No users yet.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          {['Name', 'Email', 'Role', 'Department', 'Status', 'Joined'].map(col => (
                            <th key={col} className="text-left px-5 py-3 text-slate-500 font-bold uppercase text-xs">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #1d9e75, #0f6e56)' }}
                                >
                                  {`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase() || '?'}
                                </div>
                                <span className="font-semibold text-slate-800 text-sm">{u.first_name} {u.last_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-sm">{u.email}</td>
                            <td className="px-5 py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 capitalize">
                                {ROLE_LABELS[u.role?.toLowerCase()] || u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-sm">{u.department || '—'}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-sm whitespace-nowrap">
                              {formatDate(u.joining_date || u.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100">
                    <button onClick={() => navigate('/users')} className="text-emerald-600 text-xs font-bold hover:underline">
                      View all users →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>{/* end p-6 */}
      </div>{/* end min-h-screen */}
    </UserLayout>
  )
}