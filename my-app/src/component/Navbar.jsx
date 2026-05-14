import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTheme } from '../Themecontext'

export default function Navbar({ Title = 'AssetHub', About = 'About', isHomePage = false, isLoggedIn = false }) {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/', icon: '🏠', active: true },
    { label: About, href: '/', icon: '📋', active: false },
    { label: 'Contact', href: '#contact', icon: '📞', active: false },
    
    ...(isLoggedIn
      ? [
          { label: 'Assets', href: '/assets', icon: '📦', active: false },
          { label: 'Reports', href: '/reports', icon: '📊', active: false },
        ]
      : []),
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        :root, [data-theme="light"] {
          --nav-bg-glass:      rgba(255,255,255,0.92);
          --nav-bg-top:        rgba(255,255,255,0.75);
          --nav-border:        rgba(29,158,117,0.12);
          --nav-shadow:        0 4px 24px rgba(15,110,86,0.09);
          --nav-text:          #1a2e1a;
          --nav-muted:         #4a5e4a;
          --nav-link-hover:    #0f6e56;
          --nav-link-activebg: rgba(29,158,117,0.10);
          --nav-search-bg:     #f0f6f3;
          --nav-search-border: rgba(29,158,117,0.18);
          --nav-icon-bg:       #f0f6f3;
          --nav-icon-border:   rgba(29,158,117,0.18);
          --nav-avatar-bg:     linear-gradient(135deg,#d4f5e9,#9fe1cb);
          --nav-avatar-text:   #0f6e56;
          --nav-avatar-border: #1d9e75;
          --nav-mobile-bg:     rgba(255,255,255,0.98);
          --nav-mobile-sep:    rgba(29,158,117,0.10);
          --nav-input-bg:      #f5f8f5;
          --nav-input-text:    #1a2e1a;
          --nav-toggle-bg:     #f0f6f3;
          --nav-toggle-border: rgba(29,158,117,0.20);
          --nav-toggle-bar:    #0f6e56;
        }

        [data-theme="dark"] {
          --nav-bg-glass:      rgba(8,20,12,0.96);
          --nav-bg-top:        rgba(8,20,12,0.82);
          --nav-border:        rgba(29,158,117,0.20);
          --nav-shadow:        0 4px 28px rgba(0,0,0,0.45);
          --nav-text:          #e4f5ed;
          --nav-muted:         #7db899;
          --nav-link-hover:    #2dbf8a;
          --nav-link-activebg: rgba(29,158,117,0.18);
          --nav-search-bg:     rgba(29,158,117,0.08);
          --nav-search-border: rgba(29,158,117,0.25);
          --nav-icon-bg:       rgba(29,158,117,0.10);
          --nav-icon-border:   rgba(29,158,117,0.24);
          --nav-avatar-bg:     linear-gradient(135deg,#0f3d28,#1d9e75);
          --nav-avatar-text:   #c8fae6;
          --nav-avatar-border: #1d9e75;
          --nav-mobile-bg:     rgba(6,16,10,0.99);
          --nav-mobile-sep:    rgba(29,158,117,0.15);
          --nav-input-bg:      rgba(29,158,117,0.06);
          --nav-input-text:    #e4f5ed;
          --nav-toggle-bg:     rgba(29,158,117,0.10);
          --nav-toggle-border: rgba(29,158,117,0.25);
          --nav-toggle-bar:    #2dbf8a;
        }

        .ah-nav {
          position: sticky; top: 0; z-index: 1000;
          font-family: 'Outfit','Segoe UI',sans-serif;
          transition: background 0.4s, box-shadow 0.4s, border-color 0.4s;
        }
        .ah-nav.scrolled {
          background: var(--nav-bg-glass);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: var(--nav-shadow);
          border-bottom: 1px solid var(--nav-border);
        }
        .ah-nav.top {
          background: var(--nav-bg-top);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--nav-border);
        }
        .ah-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 1.5rem; height: 68px;
          display: flex; align-items: center; gap: 1.5rem;
        }
        .ah-brand { display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0; }
        .ah-brand-icon {
          width:38px;height:38px;border-radius:11px;
          background:linear-gradient(135deg,#1d9e75,#0a3d2e);
          display:flex;align-items:center;justify-content:center;font-size:1.1rem;
          box-shadow:0 3px 10px rgba(15,110,86,0.35);
          transition:transform 0.25s,box-shadow 0.25s;
        }
        .ah-brand:hover .ah-brand-icon { transform:rotate(-8deg) scale(1.08);box-shadow:0 5px 18px rgba(15,110,86,0.5); }
        .ah-brand-text { font-size:1.22rem;font-weight:900;letter-spacing:-0.5px;line-height:1; }
        .ah-brand-text .g { color:#1d9e75; }
        .ah-brand-text .d { color:var(--nav-text); }

        .ah-links { display:flex;align-items:center;gap:0.15rem;list-style:none;margin:0;padding:0;flex:1; }
        .ah-link {
          position:relative;display:flex;align-items:center;gap:6px;
          padding:7px 13px;border-radius:10px;
          font-size:0.875rem;font-weight:600;color:var(--nav-muted);
          text-decoration:none;transition:color 0.2s,background 0.2s;white-space:nowrap;
        }
        .ah-link .lico { font-size:0.82rem;opacity:0.7;transition:opacity 0.2s,transform 0.2s; }
        .ah-link:hover { color:var(--nav-link-hover);background:var(--nav-link-activebg); }
        .ah-link:hover .lico { opacity:1;transform:scale(1.12); }
        .ah-link.active { color:var(--nav-link-hover);background:var(--nav-link-activebg); }
        .ah-link.active::after {
          content:'';position:absolute;bottom:-1px;left:13px;right:13px;
          height:2px;border-radius:2px 2px 0 0;
          background:linear-gradient(90deg,#1d9e75,#0a3d2e);
        }

        .ah-search-wrap { display:flex;align-items:center;gap:8px; }
        .ah-search-box {
          display:flex;align-items:center;
          background:var(--nav-search-bg);border:1.5px solid var(--nav-search-border);
          border-radius:50px;padding:0 14px;height:40px;gap:8px;
          transition:all 0.25s;width:200px;
        }
        .ah-search-box.focused {
          border-color:#1d9e75;background:var(--nav-mobile-bg);
          box-shadow:0 0 0 3px rgba(29,158,117,0.14);width:240px;
        }
        .ah-search-icon { font-size:0.9rem;opacity:0.5;flex-shrink:0;transition:opacity 0.2s; }
        .ah-search-box.focused .ah-search-icon { opacity:0.85; }
        .ah-search-input {
          border:none;outline:none;background:transparent;
          font-family:'Outfit',sans-serif;font-size:0.875rem;
          color:var(--nav-input-text);width:100%;font-weight:500;
        }
        .ah-search-input::placeholder { color:var(--nav-muted);opacity:0.7; }

        .ah-search-btn {
          height:40px;padding:0 20px;border-radius:50px;border:none;
          background:linear-gradient(135deg,#1d9e75,#0f6e56);
          color:#fff;font-family:'Outfit',sans-serif;
          font-size:0.85rem;font-weight:700;cursor:pointer;white-space:nowrap;
          transition:transform 0.2s,box-shadow 0.2s;
          box-shadow:0 3px 12px rgba(15,110,86,0.32);
          display:flex;align-items:center;gap:6px;
        }
        .ah-search-btn:hover { transform:scale(1.04);box-shadow:0 5px 18px rgba(15,110,86,0.44); }
        .ah-search-btn:active { transform:scale(0.97); }

        /* ── Theme toggle pill ───────────────────── */
        .ah-theme-pill {
          position:relative;width:54px;height:30px;border-radius:50px;
          border:1.5px solid var(--nav-icon-border);
          background:var(--nav-icon-bg);
          cursor:pointer;transition:background 0.35s,border-color 0.35s;
          flex-shrink:0;outline:none;padding:0;
        }
        .ah-theme-pill.dark-mode {
          background:rgba(13,50,80,0.55);
          border-color:rgba(45,191,138,0.4);
        }
        .ah-theme-thumb {
          position:absolute;top:4px;left:4px;
          width:20px;height:20px;border-radius:50%;
          background:linear-gradient(135deg,#fbbf24,#f97316);
          display:flex;align-items:center;justify-content:center;
          font-size:0.65rem;
          transition:transform 0.38s cubic-bezier(0.34,1.56,0.64,1),background 0.35s;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        }
        .ah-theme-pill.dark-mode .ah-theme-thumb {
          transform:translateX(24px);
          background:linear-gradient(135deg,#1e3a5f,#2563eb);
        }
        .ah-theme-stars {
          position:absolute;right:7px;top:50%;transform:translateY(-50%);
          font-size:0.55rem;opacity:0;transition:opacity 0.3s;line-height:1;
          color:#c8fae6;
        }
        .ah-theme-pill.dark-mode .ah-theme-stars { opacity:1; }
        .ah-theme-sun {
          position:absolute;left:7px;top:50%;transform:translateY(-50%);
          font-size:0.55rem;opacity:0;transition:opacity 0.3s;
          color:#f97316;
        }
        .ah-theme-pill:not(.dark-mode) .ah-theme-sun { opacity:1; }

        .ah-actions { display:flex;align-items:center;gap:10px;flex-shrink:0; }
        .ah-notif {
          position:relative;width:38px;height:38px;border-radius:10px;
          background:var(--nav-icon-bg);border:1px solid var(--nav-icon-border);
          display:flex;align-items:center;justify-content:center;
          font-size:1rem;cursor:pointer;transition:all 0.2s;
        }
        .ah-notif:hover { border-color:rgba(29,158,117,0.4);background:var(--nav-link-activebg); }
        .ah-notif-dot {
          position:absolute;top:7px;right:7px;
          width:7px;height:7px;border-radius:50%;
          background:#e24b4a;border:1.5px solid transparent;
          animation:ah-pulse 2s infinite;
        }
        @keyframes ah-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
        .ah-avatar {
          width:38px;height:38px;border-radius:10px;
          background:var(--nav-avatar-bg);
          border:2px solid var(--nav-avatar-border);
          display:flex;align-items:center;justify-content:center;
          font-size:0.78rem;font-weight:800;color:var(--nav-avatar-text);
          cursor:pointer;transition:all 0.2s;letter-spacing:0.5px;
        }
        .ah-avatar:hover { transform:scale(1.07);box-shadow:0 3px 14px rgba(29,158,117,0.35); }

        .ah-toggler {
          display:none;flex-direction:column;gap:5px;cursor:pointer;
          padding:8px;border-radius:8px;
          border:1px solid var(--nav-toggle-border);
          background:var(--nav-toggle-bg);margin-left:auto;transition:background 0.2s;
        }
        .ah-toggler:hover { background:var(--nav-link-activebg); }
        .ah-toggler span {
          display:block;width:20px;height:2px;
          background:var(--nav-toggle-bar);border-radius:2px;
          transition:all 0.3s ease;transform-origin:center;
        }
        .ah-toggler.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
        .ah-toggler.open span:nth-child(2) { opacity:0;transform:scaleX(0); }
        .ah-toggler.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

        .ah-mobile-menu {
          display:none;overflow:hidden;
          background:var(--nav-mobile-bg);
          border-top:1px solid var(--nav-mobile-sep);
          max-height:0;padding:0;
          transition:max-height 0.38s cubic-bezier(0.4,0,0.2,1),padding 0.3s;
        }
        .ah-mobile-menu.open { max-height:560px;padding:1rem 1.5rem 1.5rem; }
        .ah-mobile-link {
          display:flex;align-items:center;gap:10px;padding:12px 14px;
          border-radius:12px;color:var(--nav-muted);text-decoration:none;
          font-size:0.95rem;font-weight:600;transition:all 0.2s;
          margin-bottom:4px;font-family:'Outfit',sans-serif;
        }
        .ah-mobile-link:hover,.ah-mobile-link.active { color:var(--nav-link-hover);background:var(--nav-link-activebg); }
        .ah-mobile-search { display:flex;gap:8px;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--nav-mobile-sep); }
        .ah-mobile-input {
          flex:1;height:42px;border:1.5px solid var(--nav-search-border);
          border-radius:50px;padding:0 16px;
          font-family:'Outfit',sans-serif;font-size:0.875rem;
          outline:none;color:var(--nav-input-text);background:var(--nav-input-bg);
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .ah-mobile-input:focus { border-color:#1d9e75;box-shadow:0 0 0 3px rgba(29,158,117,0.12); }
        .ah-mobile-theme-row {
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 14px;border-radius:12px;
          background:var(--nav-icon-bg);margin-bottom:8px;
          border:1px solid var(--nav-icon-border);
        }
        .ah-mobile-theme-label { font-size:0.9rem;font-weight:600;color:var(--nav-muted);font-family:'Outfit',sans-serif; }

        @media (max-width:900px) {
          .ah-links,.ah-search-wrap { display:none; }
          .ah-actions .ah-notif,.ah-actions .ah-avatar { display:none; }
          .ah-actions .ah-theme-pill { display:none; }
          .ah-toggler { display:flex; }
          .ah-mobile-menu { display:block; }
        }
      `}</style>

      <nav className={`ah-nav ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="ah-inner">
          {/* Brand */}
          <a className="ah-brand" href="/">
            <div className="ah-brand-icon">📦</div>
            <div className="ah-brand-text">
              <span className="g">{Title.slice(0, Math.ceil(Title.length / 2))}</span>
              <span className="d">{Title.slice(Math.ceil(Title.length / 2))}</span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="ah-links">
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} className={`ah-link${link.active ? ' active' : ''}`}>
                  <span className="lico">{link.icon}</span>{link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Search or Login */}
          <div className="ah-search-wrap">
            {isHomePage ? (
              <Link to="/login">
                <button className="ah-search-btn" type="button">
                  🔐 Login
                </button>
              </Link>
            ) : (
              <>
                <div className={`ah-search-box${searchFocused ? ' focused' : ''}`}>
                  <span className="ah-search-icon">🔍</span>
            
                  <input
                    className="ah-search-input"
                    type="search"
                    placeholder="Search assets, reports..."
                    aria-label="Search"
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
            
                <button className="ah-search-btn" type="button">
                  🔍 Search
                </button>
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="ah-actions">
            {/* Theme toggle */}
            <button
              className={`ah-theme-pill${isDark ? ' dark-mode' : ''}`}
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="ah-theme-sun">✦</span>
              <div className="ah-theme-thumb">{isDark ? '🌙' : '☀️'}</div>
              <span className="ah-theme-stars">✦</span>
            </button>
          </div>

          {/* Mobile toggler */}
          <button
            className={`ah-toggler${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`ah-mobile-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              className={`ah-mobile-link${link.active ? ' active' : ''}`}>
              <span>{link.icon}</span>{link.label}
            </a>
          ))}

          {/* Mobile theme row */}
          <div className="ah-mobile-theme-row">
            <span className="ah-mobile-theme-label">
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              className={`ah-theme-pill${isDark ? ' dark-mode' : ''}`}
              onClick={toggle}
              aria-label="Toggle theme"
            >
              <span className="ah-theme-sun">✦</span>
              <div className="ah-theme-thumb">{isDark ? '🌙' : '☀️'}</div>
              <span className="ah-theme-stars">✦</span>
            </button>
          </div>

          <div className="ah-mobile-search">
            <input
              className="ah-mobile-input"
              type="search"
              placeholder="Search assets, reports..."
              aria-label="Search"
            />
            <button className="ah-search-btn" type="button">Search</button>
          </div>
        </div>
      </nav>
    </>
  )
}

Navbar.propTypes = {
  Title: PropTypes.string,
  About: PropTypes.string,
}

Navbar.defaultProps = {
  Title: 'AssetHub',
  About: 'About',
}