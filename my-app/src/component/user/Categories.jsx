import React, { useState } from 'react'
import UserLayout from './UserLayout'

const categories = [
  {
    name: 'Laptops',
    icon: '💻',
    totalAssets: 420,
    assigned: 310,
    available: 90,
    maintenance: 20,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'Mobiles',
    icon: '📱',
    totalAssets: 180,
    assigned: 140,
    available: 30,
    maintenance: 10,
    color: 'from-emerald-500 to-green-600'
  },
  {
    name: 'Printers',
    icon: '🖨️',
    totalAssets: 65,
    assigned: 50,
    available: 8,
    maintenance: 7,
    color: 'from-orange-500 to-amber-600'
  },
  {
    name: 'Servers',
    icon: '🗄️',
    totalAssets: 28,
    assigned: 20,
    available: 5,
    maintenance: 3,
    color: 'from-purple-500 to-violet-600'
  },
  {
    name: 'Networking',
    icon: '🌐',
    totalAssets: 90,
    assigned: 70,
    available: 15,
    maintenance: 5,
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Furniture',
    icon: '🪑',
    totalAssets: 240,
    assigned: 200,
    available: 35,
    maintenance: 5,
    color: 'from-slate-500 to-gray-700'
  }
]

export default function CategoriesPage() {
  const [search, setSearch] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-100">

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 h-14 rounded-2xl border border-slate-200 bg-white px-6 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
            />
            <button
              className="h-14 px-8 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.02] transition"
              style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-8">
          {[
            ['Total Categories', '12', '🗂️'],
            ['Total Assets', '1,248', '📦'],
            ['Active Categories', '10', '✅'],
            ['Maintenance Items', '50', '🛠️']
          ].map(([title, value, icon], index) => (
            <div key={index} className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-slate-500 font-semibold uppercase text-sm tracking-wide mb-2">{title}</p>
                  <h2 className="text-5xl font-black text-slate-800">{value}</h2>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-3xl text-white shadow-lg">
                  {icon}
                </div>
              </div>
              <p className="text-emerald-600 font-semibold">↑ 8% growth this month</p>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition duration-300">

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-xl text-white`}>
                      {category.icon}
                    </div>
                    <h2 className="text-base font-bold text-slate-800">{category.name}</h2>
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-sm">⋮</button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Total Assets</p>
                    <h3 className="text-lg font-bold text-slate-800">{category.totalAssets}</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Assigned</p>
                    <h3 className="text-lg font-bold text-emerald-600">{category.assigned}</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Available</p>
                    <h3 className="text-lg font-bold text-blue-600">{category.available}</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase mb-0.5">Maintenance</p>
                    <h3 className="text-lg font-bold text-orange-600">{category.maintenance}</h3>
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
                  <button className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-sm">✏️</button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </UserLayout>
  )
}