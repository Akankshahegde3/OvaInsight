import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import './index.css';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Assessment    from './pages/Assessment';
import Results       from './pages/Results';
import Chatbot       from './pages/Chatbot';
import PeriodTracker from './pages/PeriodTracker';
import Schemes       from './pages/Schemes';
import Exercises     from './pages/Exercises';
import History       from './pages/History';

const NAV = [
  { to:'/',          label:'Dashboard',       icon:'🏠' },
  { to:'/assess',    label:'Risk Assessment', icon:'🔬' },
  { to:'/results',   label:'My Results',      icon:'📊' },
  { to:'/tracker',   label:'Period Tracker',  icon:'📅' },
  { to:'/chatbot',   label:'Health Assistant',icon:'💬' },
  { to:'/schemes',   label:'Health Schemes',  icon:'🏥' },
  { to:'/exercises', label:'Yoga & Exercises',icon:'🧘' },
  { to:'/history',   label:'My History',      icon:'📋' },
];

function MobileHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (to) => { setOpen(false); navigate(to); };
  const handleLogout = () => { setOpen(false); onLogout(); navigate('/login'); };

  return (
    <>
      {/* Top bar */}
      <div style={{
        position:'sticky', top:0, zIndex:200,
        background:'var(--navy)', padding:'14px 18px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'0 2px 12px rgba(0,0,0,.3)',
      }}>
        <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700}}>
          <span style={{color:'var(--gold)'}}>Ova</span>
          <span style={{color:'var(--cream)'}}>Insight</span>
        </div>
        <button onClick={()=>setOpen(true)} style={{
          background:'transparent', border:'none', cursor:'pointer',
          padding:'6px', display:'flex', flexDirection:'column',
          gap:5, alignItems:'center', justifyContent:'center',
        }}>
          <span style={{width:24,height:2.5,background:'var(--gold)',borderRadius:2,display:'block'}}/>
          <span style={{width:24,height:2.5,background:'var(--gold)',borderRadius:2,display:'block'}}/>
          <span style={{width:24,height:2.5,background:'var(--gold)',borderRadius:2,display:'block'}}/>
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div onClick={()=>setOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.55)',
          zIndex:300, backdropFilter:'blur(2px)',
        }}/>
      )}

      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0,
        width:'78%', maxWidth:300,
        background:'var(--navy)', zIndex:400,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform .3s cubic-bezier(.4,0,.2,1)',
        display:'flex', flexDirection:'column',
        boxShadow:'-8px 0 32px rgba(0,0,0,.4)',
      }}>
        {/* Drawer header */}
        <div style={{
          padding:'20px 20px 16px',
          borderBottom:'1px solid rgba(255,255,255,.1)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700}}>
              <span style={{color:'var(--gold)'}}>Ova</span>
              <span style={{color:'var(--cream)'}}>Insight</span>
            </div>
            <div style={{fontSize:10, color:'rgba(245,240,232,.45)', letterSpacing:'1px', textTransform:'uppercase', marginTop:2}}>
              Women's Health Intelligence
            </div>
          </div>
          <button onClick={()=>setOpen(false)} style={{
            background:'rgba(255,255,255,.1)', border:'none', cursor:'pointer',
            width:34, height:34, borderRadius:'50%',
            color:'var(--cream)', fontSize:18, display:'flex',
            alignItems:'center', justifyContent:'center',
          }}>✕</button>
        </div>

        {/* User info */}
        <div style={{padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:10}}>
          <div style={{
            width:38, height:38, borderRadius:'50%',
            background:'var(--gold)', display:'flex',
            alignItems:'center', justifyContent:'center',
            color:'var(--navy)', fontSize:15, fontWeight:700, flexShrink:0,
          }}>{(user||'U')[0].toUpperCase()}</div>
          <div>
            <div style={{fontSize:14, fontWeight:600, color:'var(--cream)'}}>{user}</div>
            <div style={{fontSize:11, color:'rgba(245,240,232,.5)', textTransform:'uppercase', letterSpacing:'.5px'}}>Patient</div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{flex:1, padding:'12px 12px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto'}}>
          {NAV.map(({to, label, icon}) => (
            <button key={to} onClick={()=>handleNav(to)} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 14px', borderRadius:11, fontSize:14,
              border:'none', cursor:'pointer', textAlign:'left',
              background:'transparent', color:'rgba(245,240,232,.75)',
              transition:'all .15s', fontFamily:'inherit', fontWeight:400,
              width:'100%',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,.15)';e.currentTarget.style.color='var(--gold)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(245,240,232,.75)';}}
            >
              <span style={{fontSize:18, lineHeight:1}}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{padding:'14px 16px 24px', borderTop:'1px solid rgba(255,255,255,.1)'}}>
          <button onClick={handleLogout} style={{
            width:'100%', padding:'12px', borderRadius:10,
            border:'1.5px solid rgba(255,255,255,.2)',
            background:'transparent', color:'rgba(245,240,232,.7)',
            cursor:'pointer', fontFamily:'inherit', fontSize:14,
            fontWeight:500, transition:'all .15s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='var(--cream)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(245,240,232,.7)';}}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width:'var(--sw)', minHeight:'100vh', background:'var(--navy)',
      display:'flex', flexDirection:'column',
      position:'sticky', top:0, height:'100vh', flexShrink:0,
    }}>
      <div style={{padding:'24px 20px 18px', borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, lineHeight:1, marginBottom:5}}>
          <span style={{color:'var(--gold)'}}>Ova</span>
          <span style={{color:'var(--cream)'}}>Insight</span>
        </div>
        <div style={{fontSize:10, color:'rgba(245,240,232,.5)', fontWeight:500, letterSpacing:'1.2px', textTransform:'uppercase'}}>
          Women's Health Intelligence
        </div>
      </div>
      <nav style={{flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto'}}>
        {NAV.map(({to, label, icon}) => (
          <NavLink key={to} to={to} end={to==='/'} style={({isActive})=>({
            display:'flex', alignItems:'center', gap:11, padding:'10px 14px',
            borderRadius:10, fontSize:13, fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--navy)' : 'rgba(245,240,232,.65)',
            background: isActive ? 'var(--gold)' : 'transparent',
            textDecoration:'none', transition:'all .18s', letterSpacing:'.2px',
          })}>
            <span style={{fontSize:15, lineHeight:1}}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div style={{padding:'16px 14px 22px', borderTop:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
          <div style={{width:36, height:36, borderRadius:'50%', flexShrink:0, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)', fontSize:14, fontWeight:700}}>
            {(user||'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:600, color:'var(--cream)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140}}>{user}</div>
            <div style={{fontSize:10, color:'rgba(245,240,232,.5)', textTransform:'uppercase', letterSpacing:'.8px'}}>Patient</div>
          </div>
        </div>
        <button onClick={()=>{onLogout();navigate('/login');}} style={{
          width:'100%', padding:'9px', borderRadius:9, fontSize:12, fontWeight:500,
          border:'1px solid rgba(255,255,255,.15)', background:'rgba(255,255,255,.06)',
          color:'rgba(245,240,232,.65)', cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
        }}
          onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,.12)';e.target.style.color='var(--cream)';}}
          onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,.06)';e.target.style.color='rgba(245,240,232,.65)';}}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

function Layout({ user, onLogout, result, onResult, history, onAddHistory }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // VERY IMPORTANT
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pages = (
    <Routes>
      <Route path="/"          element={<Dashboard  result={result} user={user} />} />
      <Route path="/assess"    element={<Assessment onResult={onResult} onAddHistory={onAddHistory} />} />
      <Route path="/results"   element={<Results    result={result} />} />
      <Route path="/tracker"   element={<PeriodTracker />} />
      <Route path="/chatbot"   element={<Chatbot    result={result} />} />
      <Route path="/schemes"   element={<Schemes    result={result} />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/history"   element={<History    history={history} />} />
      <Route path="*"          element={<Navigate to="/" />} />
    </Routes>
  );

  if (isMobile) {
    return (
      <div style={{minHeight:'100vh', background:'var(--bg)'}}>
        <MobileHeader user={user} onLogout={onLogout} />
        <div>{pages}</div>
      </div>
    );
  }

  return (
    <div className="shell">
      <DesktopSidebar user={user} onLogout={onLogout} />
      <div className="content">{pages}</div>
    </div>
  );
}

export default function App() {
  const [user,    setUser]    = useState(()=>localStorage.getItem('ova_user')||null);
  const [result,  setResult]  = useState(()=>{ try{return JSON.parse(localStorage.getItem('ova_result'));}catch{return null;} });
  const [history, setHistory] = useState(()=>{ try{return JSON.parse(localStorage.getItem('ova_history'))||[];}catch{return[];} });

  const handleLogin      = (u)=>{ localStorage.setItem('ova_user',u); setUser(u); };
  const handleLogout     = ()=>{ localStorage.removeItem('ova_user'); localStorage.removeItem('ova_result'); setUser(null); setResult(null); };
  const handleResult     = (r)=>{ const s={...r,date:new Date().toISOString()}; setResult(s); localStorage.setItem('ova_result',JSON.stringify(s)); };
  const handleAddHistory = (e)=>{ const u=[e,...history].slice(0,20); setHistory(u); localStorage.setItem('ova_history',JSON.stringify(u)); };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user?<Navigate to="/" />:<Login onLogin={handleLogin}/>} />
        <Route path="/*" element={
          user
            ? <Layout user={user} onLogout={handleLogout} result={result} onResult={handleResult}
                history={history} onAddHistory={handleAddHistory}/>
            : <Navigate to="/login"/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}