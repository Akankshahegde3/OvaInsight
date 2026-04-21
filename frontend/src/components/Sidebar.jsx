import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { to:'/',          label:'Dashboard',        icon:'⬡' },
  { to:'/assess',    label:'Risk Assessment',  icon:'◈' },
  { to:'/results',   label:'My Results',       icon:'◉' },
  { to:'/tracker',   label:'Period Tracker',   icon:'◎' },
  { to:'/chatbot',   label:'Health Assistant', icon:'⬢' },
  { to:'/schemes',   label:'Health Schemes',   icon:'▦' },
  { to:'/exercises', label:'Yoga & Exercises', icon:'◇' },
  { to:'/history',   label:'My History',       icon:'≡' },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width:'var(--sw)',
      minHeight:'100vh',
      background:'var(--navy)',
      display:'flex',flexDirection:'column',
      position:'sticky',top:0,height:'100vh',flexShrink:0,
    }}>
      {/* Logo */}
      <div style={{padding:'28px 24px 22px',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,lineHeight:1,marginBottom:5}}>
          <span style={{color:'var(--gold)'}}>Ova</span>
          <span style={{color:'var(--cream)'}}>Insight</span>
        </div>
        <div style={{fontSize:10,color:'rgba(245,240,232,.5)',fontWeight:500,letterSpacing:'1.2px',textTransform:'uppercase'}}>
          Women's Health Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'18px 12px',display:'flex',flexDirection:'column',gap:3,overflowY:'auto'}}>
        {NAV.map(({to,label,icon})=>(
          <NavLink key={to} to={to} end={to==='/'} style={({isActive})=>({
            display:'flex',alignItems:'center',gap:11,padding:'10px 14px',
            borderRadius:10,fontSize:13,fontWeight:isActive?600:400,
            color:isActive?'var(--navy)':'rgba(245,240,232,.65)',
            background:isActive?'var(--gold)':'transparent',
            textDecoration:'none',transition:'all .18s',letterSpacing:'.2px',
          })}>
            <span style={{fontSize:14,lineHeight:1,opacity:1}}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{padding:'16px 16px 22px',borderTop:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{
            width:36,height:36,borderRadius:'50%',flexShrink:0,
            background:'var(--gold)',
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'var(--navy)',fontSize:14,fontWeight:700,
          }}>{(user||'U')[0].toUpperCase()}</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--cream)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{user}</div>
            <div style={{fontSize:10,color:'rgba(245,240,232,.5)',textTransform:'uppercase',letterSpacing:'.8px'}}>Patient</div>
          </div>
        </div>
        <button onClick={()=>{onLogout();navigate('/login');}} style={{
          width:'100%',padding:'9px',borderRadius:9,fontSize:12,fontWeight:500,
          border:'1px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.06)',
          color:'rgba(245,240,232,.65)',cursor:'pointer',fontFamily:'inherit',
          transition:'all .15s',letterSpacing:'.3px',
        }}
          onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,.12)';e.target.style.color='var(--cream)';}}
          onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,.06)';e.target.style.color='rgba(245,240,232,.65)';}}
        >Sign out</button>
      </div>
    </aside>
  );
}