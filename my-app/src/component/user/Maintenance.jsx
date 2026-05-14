import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const maintenanceData = [
  {
    id: 'MNT-001',
    assetName: 'HP LaserJet Printer',
    assetId: 'AST-1004',
    category: 'Printer',
    issue: 'Paper jam and roller damage',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Ravi Kumar',
    reportedDate: '01 May 2026',
    dueDate: '08 May 2026',
    location: 'Pune Office'
  },
  {
    id: 'MNT-002',
    assetName: 'Dell Latitude 5420',
    assetId: 'AST-1001',
    category: 'Laptop',
    issue: 'Battery not charging',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Suresh Patil',
    reportedDate: '03 May 2026',
    dueDate: '10 May 2026',
    location: 'Mumbai Office'
  },
  {
    id: 'MNT-003',
    assetName: 'Cisco Switch 24-Port',
    assetId: 'AST-1009',
    category: 'Networking',
    issue: 'Port 12-16 not responding',
    priority: 'Critical',
    status: 'Pending',
    assignedTo: 'Amit Shah',
    reportedDate: '05 May 2026',
    dueDate: '07 May 2026',
    location: 'Delhi Office'
  },
  {
    id: 'MNT-004',
    assetName: 'MacBook Pro M3',
    assetId: 'AST-1002',
    category: 'Laptop',
    issue: 'Screen flickering issue',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Priya Mehta',
    reportedDate: '20 Apr 2026',
    dueDate: '28 Apr 2026',
    location: 'Bangalore Office'
  },
  {
    id: 'MNT-005',
    assetName: 'UPS Power Backup',
    assetId: 'AST-1015',
    category: 'Electrical',
    issue: 'Battery replacement needed',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Kiran Desai',
    reportedDate: '04 May 2026',
    dueDate: '12 May 2026',
    location: 'Pune Office'
  },
  {
    id: 'MNT-006',
    assetName: 'Lenovo ThinkPad X1',
    assetId: 'AST-1005',
    category: 'Laptop',
    issue: 'Keyboard keys stuck',
    priority: 'Low',
    status: 'Pending',
    assignedTo: 'Suresh Patil',
    reportedDate: '06 May 2026',
    dueDate: '14 May 2026',
    location: 'Bangalore Office'
  },
  {
    id: 'MNT-007',
    assetName: 'iPhone 15 Pro',
    assetId: 'AST-1003',
    category: 'Mobile',
    issue: 'Cracked screen replacement',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Priya Mehta',
    reportedDate: '22 Apr 2026',
    dueDate: '29 Apr 2026',
    location: 'Delhi Office'
  }
]

const priorityStyle = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-amber-100 text-amber-700',
  Low:      'bg-blue-100 text-blue-700'
}

const statusStyle = {
  Pending:       'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed:     'bg-emerald-100 text-emerald-700',
  Cancelled:     'bg-red-100 text-red-500'
}

export default function MaintenancePage() {
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [filterStatus, setFilterStatus]   = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  const filtered = maintenanceData.filter(m => {
    const matchSearch =
      m.assetName.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.assignedTo.toLowerCase().includes(search.toLowerCase())
    const matchStatus   = filterStatus   === 'All' || m.status   === filterStatus
    const matchPriority = filterPriority === 'All' || m.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  const counts = {
    total:      maintenanceData.length,
    pending:    maintenanceData.filter(m => m.status === 'Pending').length,
    inProgress: maintenanceData.filter(m => m.status === 'In Progress').length,
    completed:  maintenanceData.filter(m => m.status === 'Completed').length,
  }

  return (
    <UserLayout>
      {/* Full height flex column so header is fixed and content scrolls */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Fixed Header / Navbar */}
        <div style={{ flexShrink: 0 }} className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Maintenance</h1>
            <p className="text-slate-500 mt-1 text-sm">Track and manage asset maintenance requests.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-60 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button
              onClick={() => navigate('/maintenance/add')}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + New Request
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto' }} className="bg-slate-100">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-6">
            {[
              ['Total Requests', counts.total,      '🛠️', 'text-slate-800'],
              ['Pending',        counts.pending,     '⏳', 'text-amber-600'],
              ['In Progress',    counts.inProgress,  '🔧', 'text-blue-600'],
              ['Completed',      counts.completed,   '✅', 'text-emerald-600'],
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
                <p className="text-emerald-600 text-xs font-semibold">↑ Updated today</p>
              </div>
            ))}
          </div>

          {/* Filters + Table */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

              {/* Filter Bar */}
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                  {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 h-8 rounded-lg text-xs font-semibold transition ${
                        filterStatus === s
                          ? 'text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      style={filterStatus === s ? { background: 'linear-gradient(135deg, #1d9e75, #0f6e56)' } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase">Priority:</span>
                  {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-3 h-8 rounded-lg text-xs font-semibold transition ${
                        filterPriority === p
                          ? 'text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      style={filterPriority === p ? { background: 'linear-gradient(135deg, #1d9e75, #0f6e56)' } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  {filtered.length} request{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['ID', 'Asset', 'Issue', 'Priority', 'Status', 'Assigned To', 'Due Date', 'Actions'].map(col => (
                        <th key={col} className="text-left px-5 py-3 text-slate-500 uppercase text-xs font-bold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">
                          No maintenance requests found.
                        </td>
                      </tr>
                    ) : filtered.map((m, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-bold text-emerald-700 text-sm whitespace-nowrap">{m.id}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <p className="font-semibold text-slate-800 text-sm">{m.assetName}</p>
                          <p className="text-xs text-slate-400">{m.assetId} · {m.location}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm max-w-[180px]">
                          <p className="truncate">{m.issue}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityStyle[m.priority]}`}>
                            {m.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[m.status]}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">{m.assignedTo}</td>
                        <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">{m.dueDate}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button className="px-3 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">
                              View
                            </button>
                            <button className="px-3 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition">
                              Update
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

        </div>
      </div>
    </UserLayout>
  )
}