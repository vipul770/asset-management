import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {

  const navigate = useNavigate()
  const location = useLocation()

  const menus = [
    ['Dashboard', '📊', '/dashboard'],
    ['Assets', '📦', '/assets'],
    ['Categories', '🗂️', '/categories'],
    ['Reports', '📈', '/reports'],
    ['Users', '👥', '/users'],
    ['Maintenance', '🛠️', '/maintenance'],
    ['Settings', '⚙️', '/settings']
  ]

  return (
    // <div className="w-72 bg-gradient-to-b from-[#05281c] to-[#0f6e56] text-white hidden lg:flex flex-col min-h-screen">
    <div className="w-72 min-w-72 h-screen bg-gradient-to-b from-[#05281c] to-[#0f6e56] text-white flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
            📦
          </div>

          <div>
            <h1 className="text-3xl font-black">
              AssetHub
            </h1>

            <p className="text-white/60 text-sm">
              Asset Management
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-6 space-y-3">

        {menus.map(([label, icon, path]) => (

          <div
            key={label}
            onClick={() => navigate(path)}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition ${
              location.pathname === path
                ? 'bg-white/15'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="text-2xl">{icon}</span>

            <span className="font-semibold text-lg">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className="p-6 border-t border-white/10">

        <div className="bg-white/10 rounded-2xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center text-xl font-black text-slate-900">
              VS
            </div>

            <div>
              <h3 className="font-bold text-lg">
                Vipul Singh
              </h3>

              <p className="text-white/60 text-sm">
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}