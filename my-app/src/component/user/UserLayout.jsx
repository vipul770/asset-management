import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function UserLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const menus = [
    ['Dashboard',   '📊', '/dashboard'],
    ['Assets',      '📦', '/assets'],
    ['Categories',  '🗂️', '/categories'],
    ['Reports',     '📈', '/reports'],
    ['Users',       '👥', '/users/add'],
    ['Maintenance', '🛠️', '/maintenance'],
    ['Settings',    '⚙️', '/settings'],
  ]

  return (
    <>
      <style>{`
        .sidebar { width: 240px; transition: width 0.25s ease; }
        .sidebar.collapsed { width: 56px; }
        .sidebar-label { transition: opacity 0.2s, width 0.2s; opacity: 1; white-space: nowrap; overflow: hidden; }
        .collapsed .sidebar-label { opacity: 0; width: 0; }
        .collapsed .sidebar-title { opacity: 0; width: 0; overflow: hidden; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: background 0.15s; margin: 2px 8px; }
        .menu-item:hover { background: rgba(255,255,255,0.1); }
        .menu-item.active { background: #f59e0b; color: #1c1c1c; }
        .menu-item.active .menu-icon { filter: none; }
        .collapsed .menu-item { justify-content: center; padding: 10px; margin: 2px 6px; }

        /* tooltip for collapsed */
        .nav-wrap { position: relative; }
        .nav-wrap .tip {
          position: fixed; left: 64px;
          background: #1e293b; color: #fff;
          font-size: 12px; font-weight: 600;
          padding: 5px 10px; border-radius: 6px;
          white-space: nowrap; opacity: 0; pointer-events: none;
          transform: translateX(-4px); transition: opacity 0.15s, transform 0.15s;
          z-index: 9999;
        }
        .nav-wrap .tip::before {
          content: ''; position: absolute; right: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent; border-right-color: #1e293b;
        }
        .collapsed .nav-wrap:hover .tip { opacity: 1; transform: translateX(0); }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

        {/* Sidebar */}
        <div
          className={`sidebar ${collapsed ? 'collapsed' : ''}`}
          style={{
            position: 'fixed', top: 0, left: 0, height: '100vh',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white', display: 'flex', flexDirection: 'column',
            zIndex: 50, flexShrink: 0, overflowX: 'hidden'
          }}
        >
          {/* App Title */}
          <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                📦
              </div>
              <span className="sidebar-label sidebar-title" style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                AssetHub
              </span>
            </div>
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          {/* User Profile */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              👤
            </div>
            <div className="sidebar-label">
              <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, lineHeight: 1.3 }}>Vipul Singh</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Administrator</p>
            </div>
          </div>

          {/* Nav Items */}
          <div style={{ flex: 1, paddingTop: '8px', paddingBottom: '8px', overflowY: 'auto', overflowX: 'hidden' }}>
            {menus.map(([label, icon, path]) => {
              const active = location.pathname === path
              return (
                <div key={label} className="nav-wrap">
                  <div
                    onClick={() => navigate(path)}
                    className={`menu-item ${active ? 'active' : ''}`}
                  >
                    <span className="menu-icon" style={{ fontSize: '18px', flexShrink: 0, width: '22px', textAlign: 'center' }}>{icon}</span>
                    <span className="sidebar-label" style={{ fontSize: '13px', fontWeight: active ? '700' : '500' }}>{label}</span>
                    {!collapsed && (
                      <span style={{ marginLeft: 'auto', fontSize: '12px', opacity: 0.4 }}>›</span>
                    )}
                  </div>
                  <span className="tip">{label}</span>
                </div>
              )
            })}
          </div>

          {/* Bottom */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 14px' }}>
            <div className="nav-wrap">
              <div
                className="menu-item"
                onClick={() => navigate('/')}
                style={{ margin: 0 }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, width: '22px', textAlign: 'center' }}>🚪</span>
                <span className="sidebar-label" style={{ fontSize: '13px', fontWeight: '500' }}>Logout</span>
              </div>
              <span className="tip">Logout</span>
            </div>
          </div>

        </div>

        {/* Main Content */}
        <div style={{ flex: 1, marginLeft: collapsed ? '56px' : '240px', transition: 'margin-left 0.25s ease' }}>
          {children}
        </div>

      </div>
    </>
  )
}