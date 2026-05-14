import React, { useState } from 'react'
import UserLayout from './UserLayout'

const reportData = {
  monthly: [
    { month: 'Jan', assigned: 280, available: 95, maintenance: 45 },
    { month: 'Feb', assigned: 295, available: 88, maintenance: 42 },
    { month: 'Mar', assigned: 310, available: 82, maintenance: 48 },
    { month: 'Apr', assigned: 325, available: 78, maintenance: 52 },
    { month: 'May', assigned: 340, available: 72, maintenance: 38 },
    { month: 'Jun', assigned: 360, available: 68, maintenance: 42 },
  ]
}

const recentReports = [
  { id: 'RPT-001', title: 'Monthly Asset Summary', type: 'Summary', generated: '01 May 2026', status: 'Ready' },
  { id: 'RPT-002', title: 'Maintenance Due Report', type: 'Maintenance', generated: '28 Apr 2026', status: 'Ready' },
  { id: 'RPT-003', title: 'Department-wise Asset Allocation', type: 'Allocation', generated: '25 Apr 2026', status: 'Processing' },
  { id: 'RPT-004', title: 'Asset Depreciation Report', type: 'Finance', generated: '20 Apr 2026', status: 'Ready' },
  { id: 'RPT-005', title: 'Category-wise Inventory', type: 'Inventory', generated: '15 Apr 2026', status: 'Ready' },
]

const typeColors = {
  Summary:     'bg-blue-100 text-blue-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Allocation:  'bg-purple-100 text-purple-700',
  Finance:     'bg-emerald-100 text-emerald-700',
  Inventory:   'bg-slate-100 text-slate-700',
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')

  const filteredReports = recentReports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  )

  const maxVal = Math.max(...reportData.monthly.map(d => d.assigned))

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Reports</h1>
            <p className="text-slate-500 mt-1 text-sm">Generate and view asset reports.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-60 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + Generate Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {[
            ['Total Reports',     '24',   '📋', 'text-slate-800'],
            ['Generated Today',   '3',    '📅', 'text-blue-600'],
            ['Processing',        '1',    '⏳', 'text-orange-600'],
            ['Scheduled',         '5',    '🔔', 'text-purple-600'],
          ].map(([title, value, icon, color], i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-xs tracking-wide mb-1">{title}</p>
                  <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                  {icon}
                </div>
              </div>
              <p className="text-emerald-600 text-sm font-semibold">↑ Updated just now</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit">
            {['overview', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 h-9 rounded-lg text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#1d9e75] to-[#0f6e56] text-white shadow'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'overview' ? 'Overview' : 'All Reports'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="px-6 pb-6 space-y-4">

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-base font-black text-slate-800 mb-1">Monthly Asset Trends</h2>
              <p className="text-slate-500 text-xs mb-5">Jan – Jun 2026</p>

              <div className="flex items-end gap-3 h-40">
                {reportData.monthly.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '120px', justifyContent: 'flex-end' }}>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-[#0f6e56] to-[#1d9e75] transition-all"
                        style={{ height: `${(d.assigned / maxVal) * 100}%` }}
                        title={`Assigned: ${d.assigned}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{d.month}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-4 flex-wrap">
                {[
                  ['Assigned', '#1d9e75'],
                  ['Available', '#378ADD'],
                  ['Maintenance', '#BA7517'],
                ].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Asset Utilization', value: '78%',  sub: '860 of 1,248 assigned',   icon: '📊', color: 'from-blue-500 to-blue-600' },
                { title: 'Maintenance Rate',  value: '5.4%', sub: '68 assets in maintenance', icon: '🛠️', color: 'from-orange-500 to-amber-600' },
                { title: 'Available Stock',   value: '25.6%',sub: '320 assets available',     icon: '✅', color: 'from-emerald-500 to-green-600' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{card.title}</p>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-base`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800">{card.value}</h3>
                  <p className="text-slate-500 text-xs mt-1">{card.sub}</p>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                      style={{ width: card.value }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-base font-black text-slate-800 mb-4">Category Breakdown</h2>
              <div className="space-y-3">
                {[
                  { name: 'Laptops',    count: 420, pct: 34, color: 'from-blue-500 to-cyan-500' },
                  { name: 'Mobiles',    count: 180, pct: 14, color: 'from-emerald-500 to-green-500' },
                  { name: 'Furniture',  count: 240, pct: 19, color: 'from-slate-400 to-slate-500' },
                  { name: 'Printers',   count: 65,  pct: 5,  color: 'from-orange-500 to-amber-500' },
                  { name: 'Networking', count: 90,  pct: 7,  color: 'from-pink-500 to-rose-500' },
                  { name: 'Servers',    count: 28,  pct: 2,  color: 'from-purple-500 to-violet-500' },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700 w-24 shrink-0">{cat.name}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${cat.color}`} style={{ width: `${cat.pct * 2.5}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-8 text-right">{cat.pct}%</span>
                    <span className="text-xs text-slate-400 w-10 text-right">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'reports' && (
          <div className="px-6 pb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-800">All Reports</h2>
                  <p className="text-slate-500 text-sm mt-0.5">{filteredReports.length} reports found</p>
                </div>
                <button className="px-4 h-9 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition">
                  Export All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Report ID', 'Title', 'Type', 'Generated', 'Status', 'Actions'].map(col => (
                        <th key={col} className="text-left px-5 py-3 text-slate-500 uppercase text-xs font-bold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-bold text-emerald-700 text-sm">{r.id}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800 text-sm">{r.title}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${typeColors[r.type]}`}>
                            {r.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 text-sm whitespace-nowrap">{r.generated}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            r.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button className="px-3 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">
                              View
                            </button>
                            <button className="px-3 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition">
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  )
}