import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../Themecontext'

const features = [
  { icon: '📦', title: 'Asset Tracking',       desc: 'Track location, ownership, status, and lifecycle in real time with centralized monitoring and intelligent alerts.',   lightBg: '#d4f5e9', darkBg: 'rgba(29,158,117,0.12)', accent: '#0f6e56' },
  { icon: '📊', title: 'Reports & Analytics',  desc: 'Generate powerful dashboards to make data-backed decisions. Export, schedule, and share reports across teams.',         lightBg: '#dbeeff', darkBg: 'rgba(24,95,165,0.15)',  accent: '#185fa5' },
  { icon: '🔒', title: 'Secure Management',    desc: 'Keep asset info protected with role-based access, audit trails, and enterprise-grade security controls.',              lightBg: '#fef4e4', darkBg: 'rgba(133,79,11,0.15)',  accent: '#854f0b' },
  { icon: '🔔', title: 'Smart Alerts',         desc: 'Receive instant notifications for maintenance due dates, unauthorized access, and critical status changes.',           lightBg: '#fde8f0', darkBg: 'rgba(153,53,86,0.15)',  accent: '#993556' },
  { icon: '🔄', title: 'Transfer Management',  desc: 'Streamline asset transfers between departments with digital approval workflows and complete audit logs.',              lightBg: '#ede8fe', darkBg: 'rgba(83,74,183,0.15)',  accent: '#534ab7' },
  { icon: '📅', title: 'Maintenance Scheduler',desc: 'Schedule preventive maintenance, set reminders, and extend the lifespan of all company assets with ease.',            lightBg: '#eafade', darkBg: 'rgba(59,109,17,0.15)',  accent: '#3b6d11' },
]

const whyPoints = [
  'Easy asset allocation and transfer between teams',
  'Maintenance scheduling with automated reminders',
  'Real-time tracking and comprehensive reporting',
  'Secure user authentication and role management',
  'Depreciation tracking and financial integration',
  'Mobile-friendly interface for on-the-go access',
]

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    if (isNaN(parseInt(target))) { setCount(target); return }
    const end = parseInt(target)
    const step = end / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [start, target, duration])
  return count
}

function StatCard({ value, label, icon, animate }) {
  const suffix = value.replace(/[0-9]/g, '')
  const num = useCountUp(parseInt(value) || 0, 1500, animate)
  const display = isNaN(parseInt(value)) ? value : `${num}${suffix}`
  return (
    <div style={{
      background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px',
      padding: '2rem 1.5rem', textAlign: 'center',
      transition: 'transform 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2.6rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{display}</div>
      <div style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.5rem', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function AssetManagementHomePage() {
  const { isDark } = useTheme()
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // ── Theme-aware token helpers ──────────────────────────
  const bg       = isDark ? '#060e09'   : '#f5f8f5'
  const surface  = isDark ? '#0d1f12'   : '#ffffff'
  // const surface2 = isDark ? '#111f15'   : '#f5f8f5'
  const text     = isDark ? '#e4f5ed'   : '#1a2e1a'
  const muted    = isDark ? '#7db899'   : '#6b7b6b'
  const border   = isDark ? 'rgba(29,158,117,0.18)' : '#e8ede8'
  const cardShadow = isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)'
  const cardHoverShadow = isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 40px rgba(15,110,86,0.12)'
  const checkBg  = isDark ? 'rgba(29,158,117,0.18)' : '#d4f5e9'
  const badgeBg  = isDark ? 'rgba(29,158,117,0.18)' : '#d4f5e9'

  const stats = [
    { value: '500+', label: 'Assets Managed',  icon: '📦' },
    { value: '120+', label: 'Departments',      icon: '🏢' },
    { value: '98%',  label: 'Efficiency Rate',  icon: '⚡' },
    { value: '24/7', label: 'Monitoring',       icon: '🛡️' },
  ]

  return (
    <div style={{ fontFamily: "'Outfit','Segoe UI',sans-serif", background: bg, color: text, transition: 'background 0.4s, color 0.4s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .hero-float { animation: float 6s ease-in-out infinite; }
        .hero-text  { animation: fadeUp 0.8s ease forwards; }
        .hero-text2 { animation: fadeUp 0.8s ease 0.18s forwards; opacity:0; }
        .hero-btns  { animation: fadeUp 0.8s ease 0.36s forwards; opacity:0; }
        .badge-pulse { animation: pulse 2.5s ease infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1d9e75;border-radius:10px; }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg,#0a3d2e 0%,#0f6e56 40%,#1d9e75 75%,#2dbf8a 100%)',
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        padding: '4rem 2rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:'-80px',right:'-80px',width:'420px',height:'420px',borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:'-120px',left:'-60px',width:'520px',height:'520px',borderRadius:'50%',background:'rgba(255,255,255,0.03)',pointerEvents:'none' }} />

        <div style={{ maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center',width:'100%' }}>
          <div>
            <div className="badge-pulse" style={{ display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'50px',padding:'6px 16px',marginBottom:'1.8rem',fontSize:'0.82rem',fontWeight:'600',color:'rgba(255,255,255,0.9)',backdropFilter:'blur(10px)' }}>
              <span style={{ width:'8px',height:'8px',borderRadius:'50%',background:'#7dffc4',display:'inline-block' }} />
              Next-Gen Asset Intelligence Platform
            </div>
            <h1 className="hero-text" style={{ fontSize:'clamp(2.5rem,5vw,3.8rem)',fontWeight:'900',color:'#fff',lineHeight:1.08,letterSpacing:'-2px',marginBottom:'1.5rem' }}>
              Smart Asset<br /><span style={{ color:'#7dffc4' }}>Management</span><br />Made Simple
            </h1>
            <p className="hero-text2" style={{ fontSize:'1.1rem',color:'rgba(255,255,255,0.8)',lineHeight:1.8,maxWidth:'480px',marginBottom:'2.5rem' }}>
              Manage, track, and monitor your organization's assets with a modern, secure, and intelligent platform. Boost productivity and gain real-time insights.
            </p>
            <div className="hero-btns" style={{ display:'flex',gap:'16px',flexWrap:'wrap' }}>
              <button style={{ background:'#fff',color:'#0f6e56',fontWeight:'800',padding:'14px 32px',borderRadius:'50px',border:'none',fontSize:'1rem',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 8px 30px rgba(0,0,0,0.2)',transition:'transform 0.2s,box-shadow 0.2s' }}
                onClick={() => navigate('/register')}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.2)'; }}
              >🚀 Get Started Free</button>
              <button style={{ background:'transparent',color:'#fff',fontWeight:'600',padding:'14px 32px',borderRadius:'50px',border:'1.5px solid rgba(255,255,255,0.45)',fontSize:'1rem',cursor:'pointer',fontFamily:'inherit',transition:'background 0.2s,border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,255,255,0.45)'; }}
              >▶ Watch Demo</button>
            </div>
            <div style={{ display:'flex',gap:'2rem',marginTop:'3rem',flexWrap:'wrap' }}>
              {[['✓ No credit card','required'],['✓ Free 14-day','trial'],['✓ Cancel','anytime']].map(([a,b])=>(
                <div key={a} style={{ fontSize:'0.82rem',color:'rgba(85, 71, 71, 0.7)',fontWeight:500 }}>
                  <span style={{ color:'#7dffc4',fontWeight:700 }}>{a}</span> {b}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex',justifyContent:'center',position:'relative' }}>
            <div className="hero-float" style={{ position:'relative',zIndex:1 }}>
              <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1000&auto=format&fit=crop" alt="Dashboard" style={{ width:'100%',maxWidth:'480px',borderRadius:'28px',boxShadow:'0 40px 80px rgba(0,0,0,0.35)',border:'3px solid rgba(255,255,255,0.15)' }} />
              <div style={{ position:'absolute',bottom:'24px',left:'-28px',background:'#fff',borderRadius:'16px',padding:'14px 18px',boxShadow:'0 10px 40px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:'12px' }}>
                <div style={{ fontSize:'1.5rem' }}>📈</div>
                <div>
                  <div style={{ fontSize:'0.72rem',color:'#888',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px' }}>Asset Efficiency</div>
                  <div style={{ fontSize:'1.1rem',fontWeight:'800',color:'#0f6e56' }}>+42% This Month</div>
                </div>
              </div>
              <div style={{ position:'absolute',top:'20px',right:'-24px',background:'#0f6e56',borderRadius:'14px',padding:'12px 16px',boxShadow:'0 10px 30px rgba(15,110,86,0.4)',color:'#fff',textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem',fontWeight:'800' }}>500+</div>
                <div style={{ fontSize:'0.7rem',opacity:0.85,fontWeight:600 }}>Assets Live</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section ref={statsRef} style={{ background:'linear-gradient(135deg,#0a3d2e,#0f6e56)',padding:'5rem 2rem' }}>
        <div style={{ maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem' }}>
          {stats.map(s => <StatCard key={s.label} {...s} animate={statsVisible} />)}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem' }}>
        {features.map(f => (
          <div
            key={f.title}
            style={{
              background: isDark ? f.darkBg : f.lightBg,
              border:`1.5px solid ${border}`,
              borderRadius:'20px',
              padding:'2rem',
              transition:'all 0.3s ease',
              boxShadow: cardShadow,
              cursor:'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = cardHoverShadow
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = cardShadow
            }}
          >
            <div
              style={{
                width:'56px',
                height:'56px',
                borderRadius:'16px',
                background:isDark ? f.darkBg : f.lightBg,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:'1.8rem',
                marginBottom:'1.2rem',
                border:`1px solid ${f.accent}33`
              }}
            >
              {f.icon}
            </div>
            
            <h3
              style={{
                fontSize:'1.15rem',
                fontWeight:'700',
                color:text,
                marginBottom:'0.7rem'
              }}
            >
              {f.title}
            </h3>
            
            <p
              style={{
                color:muted,
                lineHeight:1.7,
                fontSize:'0.93rem',
                margin:0
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── WHY ────────────────────────────────────────────── */}
      <section style={{ padding:'7rem 2rem',background:surface,transition:'background 0.4s' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6rem',alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute',top:'-20px',left:'-20px',right:'20px',bottom:'20px',background:isDark?'rgba(29,158,117,0.08)':'linear-gradient(135deg,#d4f5e9,#eafaf5)',borderRadius:'28px',zIndex:0,transition:'background 0.4s' }} />
            <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=900&auto=format&fit=crop" alt="Team" style={{ width:'100%',borderRadius:'24px',boxShadow:`0 20px 60px ${isDark?'rgba(0,0,0,0.5)':'rgba(15,110,86,0.18)'}`,position:'relative',zIndex:1,display:'block',transition:'box-shadow 0.4s' }} />
            <div style={{ position:'absolute',zIndex:2,bottom:'28px',right:'-20px',background:surface,borderRadius:'20px',padding:'18px 24px',boxShadow:`0 10px 40px ${isDark?'rgba(0,0,0,0.5)':'rgba(0,0,0,0.12)'}`,border:`1px solid ${border}`,transition:'background 0.4s,border-color 0.4s' }}>
              <div style={{ fontSize:'1.8rem',marginBottom:'4px' }}>🌟</div>
              <div style={{ fontSize:'1rem',fontWeight:'800',color:text,transition:'color 0.4s' }}>Rated #1</div>
              <div style={{ fontSize:'0.78rem',color:muted,fontWeight:500,transition:'color 0.4s' }}>Asset Platform 2026</div>
            </div>
          </div>

          <div>
            <span style={{ display:'inline-block',background:badgeBg,color:'#0f6e56',fontSize:'0.8rem',fontWeight:'700',letterSpacing:'1.5px',padding:'6px 18px',borderRadius:'50px',marginBottom:'1.2rem',textTransform:'uppercase',transition:'background 0.4s' }}>Why Choose Us</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)',fontWeight:'900',color:text,letterSpacing:'-1px',marginBottom:'1.2rem',lineHeight:1.1,transition:'color 0.4s' }}>
              Built for modern<br /><span style={{ color:'#1d9e75' }}>organizations</span>
            </h2>
            <p style={{ color:muted,lineHeight:1.8,fontSize:'1.05rem',marginBottom:'2rem',transition:'color 0.4s' }}>
              Our Asset Management System helps organizations optimize resource utilization, reduce costs, and improve transparency — with a user-friendly, intelligent interface.
            </p>
            <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
              {whyPoints.map(pt => (
                <div key={pt} style={{ display:'flex',alignItems:'center',gap:'14px' }}>
                  <div style={{ width:'28px',height:'28px',borderRadius:'8px',background:checkBg,color:'#0f6e56',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0,fontWeight:'700',transition:'background 0.4s' }}>✓</div>
                  <span style={{ color:isDark?'#c2dac9':'#3a4e3a',fontWeight:500,fontSize:'0.98rem',transition:'color 0.4s' }}>{pt}</span>
                </div>
              ))}
            </div>
            <button style={{ marginTop:'2.5rem',background:'linear-gradient(135deg,#1d9e75,#0f6e56)',border:'none',color:'#fff',padding:'14px 36px',borderRadius:'50px',fontWeight:'700',fontSize:'1rem',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 20px rgba(15,110,86,0.35)',transition:'transform 0.2s,box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(15,110,86,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(15,110,86,0.35)'; }}
            >Explore All Features →</button>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ padding:'6rem 2rem',background:'linear-gradient(135deg,#0a3d2e 0%,#1d9e75 100%)',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'-100px',left:'50%',transform:'translateX(-50%)',width:'600px',height:'600px',borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none' }} />
        <div style={{ position:'relative',zIndex:1,maxWidth:'700px',margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)',fontWeight:'900',color:'#fff',letterSpacing:'-1.5px',marginBottom:'1rem',lineHeight:1.1 }}>
            Ready to transform your<br />asset management?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.8)',fontSize:'1.1rem',marginBottom:'2.5rem',lineHeight:1.7 }}>
            Join 500+ organizations already using AssetHub to streamline operations and maximize efficiency.
          </p>
          <div style={{ display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap' }}>
            <button style={{ background:'#fff',color:'#0f6e56',fontWeight:'800',padding:'16px 40px',borderRadius:'50px',border:'none',fontSize:'1.05rem',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 8px 30px rgba(0,0,0,0.25)',transition:'transform 0.2s' }}
              onClick={() => navigate('/register')}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
            >Start Free Trial</button>
            <button style={{ background:'transparent',color:'#fff',fontWeight:'600',padding:'16px 40px',borderRadius:'50px',border:'1.5px solid rgba(255,255,255,0.5)',fontSize:'1.05rem',cursor:'pointer',fontFamily:'inherit',transition:'background 0.2s' }}
              onClick={() => navigate('/register')}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer id="footer" style={{ background: isDark?'#040c07':'#0a1a0f', color:'#fff',padding:'5rem 2rem 2rem',transition:'background 0.4s' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1.2fr',gap:'3rem',marginBottom:'3rem' }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'1.2rem' }}>
                <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#1d9e75,#0f6e56)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem' }}>📦</div>
                <span style={{ fontSize:'1.2rem',fontWeight:'800',color:'#1d9e75' }}>Asset<span style={{ color:'#fff' }}>Hub</span></span>
              </div>
              <p style={{ color:'#6b8a6b',lineHeight:1.8,fontSize:'0.95rem',maxWidth:'260px' }}>Modern solution for managing company assets efficiently, securely, and intelligently.</p>
              <div style={{ display:'flex',gap:'12px',marginTop:'1.5rem' }}>
                {['🐦','💼','📘'].map((ic,i) => (
                  <div key={i} style={{ width:'38px',height:'38px',borderRadius:'10px',background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',transition:'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(29,158,117,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  >{ic}</div>
                ))}
              </div>
            </div>
            {[
              { title:'Product', links:['Home','Assets','Reports','Integrations','Pricing'] },
              { title:'Company', links:['About','Blog','Careers','Press','Partners'] },
              { title:'Support', links:['Help Center','Documentation','API Status','Community'] },
              { title:'Contact', links:['📧 support@assethub.com','📞 +91 9876543210','📍 Pune, Maharashtra','🌐 www.assethub.com'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight:'700',color:'#fff',marginBottom:'1.2rem',fontSize:'0.95rem',letterSpacing:'0.3px' }}>{col.title}</h4>
                <ul style={{ listStyle:'none' }}>
                  {col.links.map(l => (
                    <li key={l} style={{ marginBottom:'10px' }}>
                      <span style={{ color:'#6b8a6b',fontSize:'0.9rem',cursor:'pointer',transition:'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color='#1d9e75'}
                        onMouseLeave={e => e.currentTarget.style.color='#6b8a6b'}
                      >{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem' }}>
            <p style={{ color:'#4a6a4a',fontSize:'0.88rem' }}>© 2026 AssetHub. All rights reserved.</p>
            <div style={{ display:'flex',gap:'1.5rem' }}>
              {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
                <span key={l} style={{ color:'#4a6a4a',fontSize:'0.88rem',cursor:'pointer',transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#1d9e75'}
                  onMouseLeave={e => e.currentTarget.style.color='#4a6a4a'}
                >{l}</span>
              ))}
            </div>
            <p style={{ color:'#4a6a4a',fontSize:'0.88rem' }}>📍 Pune, Maharashtra, India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}