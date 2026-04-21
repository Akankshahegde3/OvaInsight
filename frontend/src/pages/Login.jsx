import React, { useState } from 'react';

const USERS_KEY = 'ova_users';
function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || { admin: '1234' }; } catch { return { admin: '1234' }; } }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export default function Login({ onLogin }) {
  const [tab,  setTab]  = useState('login');
  const [u,    setU]    = useState('');
  const [p,    setP]    = useState('');
  const [p2,   setP2]   = useState('');
  const [name, setName] = useState('');
  const [err,  setErr]  = useState('');
  const [ok,   setOk]   = useState('');
  const [loading,setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const users = getUsers();
    if (users[u] && users[u] === p) onLogin(name || u);
    else setErr('Invalid username or password. Please try again.');
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    if (!name||!u||!p||!p2) { setErr('All fields are required.'); return; }
    if (p !== p2) { setErr('Passwords do not match.'); return; }
    if (p.length < 4) { setErr('Password must be at least 4 characters.'); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const users = getUsers();
    if (users[u]) { setErr('Username already exists. Please choose another.'); setLoading(false); return; }
    users[u] = p; saveUsers(users);
    setOk('Account created successfully! You may now sign in.');
    setTab('login'); setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'var(--navy)',
      display:'flex',alignItems:'center',justifyContent:'center',
      padding:24,
      position:'relative',overflow:'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{position:'absolute',top:-120,right:-80,width:400,height:400,borderRadius:'50%',border:'1px solid rgba(201,168,76,.15)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:-60,right:-20,width:250,height:250,borderRadius:'50%',border:'1px solid rgba(201,168,76,.1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-100,left:-60,width:300,height:300,borderRadius:'50%',border:'1px solid rgba(201,168,76,.1)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:460,position:'relative',zIndex:1}}>
        {/* Branding */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:700,lineHeight:1,marginBottom:10}}>
            <span style={{color:'var(--gold)'}}>Ova</span>
            <span style={{color:'var(--cream)'}}>Insight</span>
          </div>
          <div style={{fontSize:13,color:'rgba(245,240,232,.6)',letterSpacing:'1px',textTransform:'uppercase',fontWeight:500}}>
            Women's Health Intelligence
          </div>
        </div>

        {/* Card */}
        <div style={{background:'var(--cream)',borderRadius:20,padding:'36px 32px',boxShadow:'0 24px 60px rgba(0,0,0,.35)'}}>
          {/* Tabs */}
          <div style={{display:'flex',background:'var(--cream-dark)',borderRadius:12,padding:4,marginBottom:28,gap:4}}>
            {[['login','Sign In'],['register','Create Account']].map(([t,l])=>(
              <button key={t} onClick={()=>{setTab(t);setErr('');setOk('');}} style={{
                flex:1,padding:'10px',borderRadius:10,fontSize:13,fontWeight:600,
                border:'none',cursor:'pointer',transition:'all .2s',fontFamily:'inherit',letterSpacing:'.2px',
                background:tab===t?'var(--navy)':'transparent',
                color:tab===t?'var(--gold)':'var(--muted)',
                boxShadow:tab===t?'0 4px 14px rgba(30,45,74,.2)':'none',
              }}>{l}</button>
            ))}
          </div>

          {tab==='login' ? (
            <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:18}}>
              <div>
                <div className="gold-line"/>
                <h2 style={{fontSize:28,marginBottom:4}}>Welcome Back</h2>
                <p style={{fontSize:13,color:'var(--muted)'}}>Sign in to continue your health journey</p>
              </div>
              <div className="fg">
                <label className="fl">Username</label>
                <input className="fi" value={u} onChange={e=>setU(e.target.value)} placeholder="Enter your username" autoFocus/>
              </div>
              <div className="fg">
                <label className="fl">Password</label>
                <input className="fi" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Enter your password"/>
              </div>
              {ok&&<div style={{background:'#E8F5E9',border:'1px solid #A5D6A7',borderRadius:10,padding:'11px 14px',fontSize:13,color:'#2E7D32'}}>{ok}</div>}
              {err&&<div style={{background:'var(--rose-light)',border:'1px solid #F4A0B5',borderRadius:10,padding:'11px 14px',fontSize:13,color:'var(--rose)'}}>{err}</div>}
              <button className="btn btn-gold" type="submit" disabled={loading} style={{justifyContent:'center',padding:'14px',fontSize:15,borderRadius:12,marginTop:4}}>
                {loading?'Signing in…':'Sign In →'}
              </button>
              <div style={{textAlign:'center',padding:'11px 14px',background:'var(--navy-pale)',borderRadius:10,fontSize:12,color:'var(--navy)'}}>
                <strong>Demo account:</strong> username <code style={{background:'rgba(30,45,74,.1)',padding:'1px 6px',borderRadius:4}}>admin</code> · password <code style={{background:'rgba(30,45,74,.1)',padding:'1px 6px',borderRadius:4}}>1234</code>
              </div>
            </form>
          ):(
            <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:16}}>
              <div>
                <div className="gold-line"/>
                <h2 style={{fontSize:28,marginBottom:4}}>Create Account</h2>
                <p style={{fontSize:13,color:'var(--muted)'}}>Begin your personalised health journey today</p>
              </div>
              <div className="fg">
                <label className="fl">Full Name</label>
                <input className="fi" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Priya Sharma"/>
              </div>
              <div className="fg">
                <label className="fl">Username</label>
                <input className="fi" value={u} onChange={e=>setU(e.target.value)} placeholder="Choose a username"/>
              </div>
              <div className="g2" style={{gap:12}}>
                <div className="fg">
                  <label className="fl">Password</label>
                  <input className="fi" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Create password"/>
                </div>
                <div className="fg">
                  <label className="fl">Confirm</label>
                  <input className="fi" type="password" value={p2} onChange={e=>setP2(e.target.value)} placeholder="Repeat password"/>
                </div>
              </div>
              {err&&<div style={{background:'var(--rose-light)',border:'1px solid #F4A0B5',borderRadius:10,padding:'11px 14px',fontSize:13,color:'var(--rose)'}}>{err}</div>}
              <button className="btn btn-gold" type="submit" disabled={loading} style={{justifyContent:'center',padding:'14px',fontSize:15,borderRadius:12}}>
                {loading?'Creating account…':'Create Account →'}
              </button>
            </form>
          )}
        </div>
        <p style={{textAlign:'center',marginTop:18,fontSize:12,color:'rgba(245,240,232,.4)',letterSpacing:'.3px'}}>
          🔒 Your health data is stored privately on your device
        </p>
      </div>
    </div>
  );
}