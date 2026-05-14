import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from './UserLayout'

const assets = [
  {
    id: 'AST-1001',
    name: 'Dell Latitude 5420',
    category: 'Laptop',
    assignedTo: 'Vipul Singh',
    status: 'Assigned',
    location: 'Pune Office',
    purchaseDate: '12 Jan 2026'
  },
  {
    id: 'AST-1002',
    name: 'MacBook Pro M3',
    category: 'Laptop',
    assignedTo: 'Development Team',
    status: 'Available',
    location: 'Mumbai Office',
    purchaseDate: '05 Feb 2026'
  },
  {
    id: 'AST-1003',
    name: 'iPhone 15 Pro',
    category: 'Mobile',
    assignedTo: 'Sales Team',
    status: 'Assigned',
    location: 'Delhi Office',
    purchaseDate: '18 Mar 2026'
  },
  {
    id: 'AST-1004',
    name: 'HP LaserJet Printer',
    category: 'Printer',
    assignedTo: 'Admin Team',
    status: 'Maintenance',
    location: 'Pune Office',
    purchaseDate: '10 Apr 2026'
  },
  {
    id: 'AST-1005',
    name: 'Lenovo ThinkPad X1',
    category: 'Laptop',
    assignedTo: 'HR Team',
    status: 'Available',
    location: 'Bangalore Office',
    purchaseDate: '22 Apr 2026'
  }
]

export default function AssetsPage() {
  const [search, setSearch] = useState('')

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(search.toLowerCase()) ||
    asset.category.toLowerCase().includes(search.toLowerCase()) ||
    asset.id.toLowerCase().includes(search.toLowerCase())
  )
  const navigate = useNavigate()

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
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button
              onClick={() => navigate('/add-asset')}
              className="h-10 px-5 rounded-xl text-white text-sm font-bold hover:scale-[1.02] transition" 
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + Add Asset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
          {[
            ['Total Assets', '1,248', '📦'],
            ['Assigned Assets', '860', '👤'],
            ['Available Assets', '320', '✅'],
            ['Maintenance', '68', '🛠️']
          ].map(([title, value, icon], index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-xs tracking-wide mb-1">{title}</p>
                  <h2 className="text-3xl font-black text-slate-800">{value}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-xl text-white">
                  {icon}
                </div>
              </div>
              <p className="text-emerald-600 text-sm font-semibold">↑ 12% increase this month</p>
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
                <p className="text-slate-500 text-sm mt-0.5">Track and manage all organization assets.</p>
              </div>
              <button className="px-4 h-9 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition">
                Export Report
              </button>
            </div>

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
                  {filteredAssets.map((asset, index) => (
                    <tr key={index} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-5 py-3 font-bold text-emerald-700 text-sm whitespace-nowrap">{asset.id}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">{asset.name}</td>
                      <td className="px-5 py-3 text-slate-600 text-sm">{asset.category}</td>
                      <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">{asset.assignedTo}</td>
                      <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">{asset.location}</td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          asset.status === 'Assigned'
                            ? 'bg-emerald-100 text-emerald-700'
                            : asset.status === 'Available'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-sm whitespace-nowrap">{asset.purchaseDate}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button className="px-3 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">View</button>
                          <button className="px-3 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 transition">Edit</button>
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
    </UserLayout>
  )
}