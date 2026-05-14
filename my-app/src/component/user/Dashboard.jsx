import React from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const stats = [
  { title: 'Total Assets',      value: '1,248', icon: '📦', color: 'from-emerald-500 to-green-600' },
  { title: 'Active Users',      value: '84',    icon: '👥', color: 'from-blue-500 to-cyan-600' },
  { title: 'Pending Requests',  value: '16',    icon: '⏳', color: 'from-orange-500 to-amber-600' },
  { title: 'Maintenance Due',   value: '09',    icon: '🛠️', color: 'from-red-500 to-rose-600' }
]

const assets = [
  { name: 'Dell Latitude 5420',  category: 'Laptop',  status: 'Assigned',    user: 'Vipul Singh' },
  { name: 'iPhone 15 Pro',       category: 'Mobile',  status: 'Available',   user: '—' },
  { name: 'HP LaserJet Printer', category: 'Printer', status: 'Maintenance', user: 'Admin Team' },
  { name: 'MacBook Pro M3',      category: 'Laptop',  status: 'Assigned',    user: 'Development Team' }
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">Welcome back, manage your assets efficiently.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search assets..."
              className="w-60 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button className="w-10 h-10 rounded-xl bg-slate-100 text-lg hover:bg-slate-200 transition">
              🔔
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{item.title}</p>
                    <h2 className="text-3xl font-black text-slate-800">{item.value}</h2>
                  </div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-xl text-white`}>
                    {item.icon}
                  </div>
                </div>
                <p className="text-emerald-600 text-xs font-semibold">⬆ 12% increase this month</p>
              </div>
            ))}
          </div>

          {/* Table + Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Recent Assets Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">Recent Assets</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Manage and monitor all company assets</p>
                </div>
                <button
                  onClick={() => navigate('/add-asset')}
                  className="px-4 h-9 rounded-xl text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                >
                  + Add Asset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Asset Name', 'Category', 'Status', 'Assigned To'].map(col => (
                        <th key={col} className="text-left px-5 py-3 text-slate-500 font-bold uppercase text-xs">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-semibold text-slate-800 text-sm">{asset.name}</td>
                        <td className="px-5 py-3 text-slate-600 text-sm">{asset.category}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            asset.status === 'Assigned'    ? 'bg-emerald-100 text-emerald-700' :
                            asset.status === 'Available'   ? 'bg-blue-100 text-blue-700' :
                                                             'bg-orange-100 text-orange-700'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm font-medium">{asset.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-base font-black text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  ['📦', 'New asset added',                '2 mins ago'],
                  ['👤', 'User assigned laptop',           '10 mins ago'],
                  ['🛠️', 'Maintenance request submitted',  '30 mins ago'],
                  ['📊', 'Monthly report generated',       '1 hour ago'],
                  ['🔔', 'Asset warranty expiring',        '2 hours ago']
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

          </div>
        </div>
      </div>
    </UserLayout>
  )
}