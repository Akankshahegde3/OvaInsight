import React, { useState, useEffect } from 'react';

const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const SYMPTOMS= ['Cramps','Bloating','Headache','Mood swings','Fatigue','Acne','Back pain','Nausea','Spotting','Irritability','Tender breasts'];
const FLOW    = ['Spotting','Light','Medium','Heavy'];

const KEY  = 'ova_tracker_v2';
const WKEY = 'ova_weight_v2';
function loadData(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } }
function saveData(k,d) { localStorage.setItem(k, JSON.stringify(d)); }
function daysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
function firstDay(y,m)    { return new Date(y,m,1).getDay(); }
function toKey(y,m,d)     { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function fromKey(k)       { const p=k.split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
function datesBetween(s,e) {
  const res=[]; const cur=new Date(s);
  while(cur<=e){ res.push(toKey(cur.getFullYear(),cur.getMonth(),cur.getDate())); cur.setDate(cur.getDate()+1); }
  return res;
}

export default function PeriodTracker() {
  const today = new Date();
  const maxYear  = today.getFullYear();
  const maxMonth = today.getMonth();

  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [periods,  setPeriods]  = useState(()=>loadData(KEY));
  const [weights,  setWeights]  = useState(()=>loadData(WKEY));
  const [tab,      setTab]      = useState('calendar');
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [hovering,   setHovering]   = useState(null);
  const [showLog,    setShowLog]    = useState(false);
  const [flow,  setFlow]  = useState('Medium');
  const [syms,  setSyms]  = useState([]);
  const [note,  setNote]  = useState('');
  const [weightVal, setWeightVal] = useState('');

  useEffect(()=>{ saveData(KEY,  periods);  },[periods]);
  useEffect(()=>{ saveData(WKEY, weights); },[weights]);

  // Block navigating to future months
  const prevMonth = () => {
    if(month===0){ setMonth(11); setYear(y=>y-1); }
    else setMonth(m=>m-1);
  };
  const nextMonth = () => {
    if(year===maxYear && month===maxMonth) return; // block future
    if(month===11){ setMonth(0); setYear(y=>y+1); }
    else setMonth(m=>m+1);
  };
  const isAtMaxMonth = year===maxYear && month===maxMonth;

  const isInRange = (key) => {
    if(!rangeStart) return false;
    const end = rangeEnd || hovering;
    if(!end) return key===rangeStart;
    const s=rangeStart<end?rangeStart:end;
    const e=rangeStart<end?end:rangeStart;
    return key>=s && key<=e;
  };

  const handleDayClick = (key) => {
    // Don't allow clicking future dates
    if(key > toKey(today.getFullYear(), today.getMonth(), today.getDate())) return;
    if(!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(key); setRangeEnd(null); setHovering(null);
    } else {
      const end   = key < rangeStart ? rangeStart : key;
      const start = key < rangeStart ? key : rangeStart;
      setRangeEnd(end); setRangeStart(start); setShowLog(true);
    }
  };

  const confirmLog = () => {
    const end  = rangeEnd || rangeStart;
    const keys = datesBetween(fromKey(rangeStart), fromKey(end));
    const updated = {...periods};
    keys.forEach(k=>{ updated[k]={isPeriod:true,flow,symptoms:syms,note,rangeId:`${rangeStart}_${end}`}; });
    setPeriods(updated);
    setShowLog(false); setRangeStart(null); setRangeEnd(null);
    setSyms([]); setNote(''); setFlow('Medium');
  };

  const clearRange = (rangeId) => {
    const updated={...periods};
    Object.keys(updated).forEach(k=>{ if(updated[k].rangeId===rangeId) delete updated[k]; });
    setPeriods(updated);
  };

  const logWeight = () => {
    if(!weightVal) return;
    const k = today.toISOString().split('T')[0];
    setWeights(prev=>{
      const updated={...prev,[k]:{w:parseFloat(weightVal),date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}};
      return updated;
    });
    setWeightVal('');
  };

  // Stats
  const allPeriodKeys = Object.keys(periods).filter(k=>periods[k]?.isPeriod).sort();
  const cycleStarts = [];
  let prev=null;
  allPeriodKeys.forEach(k=>{
    if(!prev||fromKey(k)-fromKey(prev)>2*86400000) cycleStarts.push(k);
    prev=k;
  });
  const cycleLengths = cycleStarts.slice(1).map((k,i)=>Math.round((fromKey(k)-fromKey(cycleStarts[i]))/86400000));
  const avgCycle     = cycleLengths.length ? Math.round(cycleLengths.reduce((a,b)=>a+b,0)/cycleLengths.length) : 28;
  const lastStart    = cycleStarts[cycleStarts.length-1];
  const daysSince    = lastStart ? Math.floor((today-fromKey(lastStart))/86400000) : null;

  // Predicted next period
  const predictedDate = lastStart ? (() => { const d=fromKey(lastStart); d.setDate(d.getDate()+avgCycle); return d; })() : null;
  const nextPred      = predictedDate ? predictedDate.toLocaleDateString('en-IN',{day:'numeric',month:'long'}) : null;

  // Delay detection — if today is past predicted date and no new period logged
  const delayDays = predictedDate && today > predictedDate && daysSince >= avgCycle
    ? Math.floor((today - predictedDate) / 86400000)
    : 0;

  const weightArr = Object.entries(weights).sort(([a],[b])=>a>b?1:-1).slice(-12);
  const days = daysInMonth(year, month);
  const fd   = firstDay(year, month);
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const periodRanges={};
  Object.entries(periods).forEach(([k,v])=>{
    if(v?.isPeriod&&v.rangeId&&!periodRanges[v.rangeId]) periodRanges[v.rangeId]=v;
  });

  return (
    <div className="page">
      <div style={{marginBottom:28}}>
        <div className="overline" style={{marginBottom:8}}>Women's Health</div>
        <h1 style={{fontSize:36, marginBottom:6}}>Period Tracker</h1>
        <p style={{color:'#5C3D52', fontSize:15, fontWeight:400}}>
          Select a start date then an end date to log your period range. Previous months are accessible using the arrow buttons.
        </p>
      </div>

      {/* Stats */}
      {cycleStarts.length>0 && (
        <div className="g4" style={{marginBottom:24}}>
          {[
            {label:'Days Since Last Period', val: daysSince!=null ? `${daysSince} days` : '—', color:'var(--rose)'},
            {label:'Predicted Next Period',  val: nextPred||'—', color:'var(--navy)'},
            {label:'Average Cycle Length',   val: `${avgCycle} days`, color:'var(--teal)'},
            {label:'Cycles Tracked',         val: cycleStarts.length, color:'var(--gold)'},
          ].map(({label,val,color})=>(
            <div key={label} className="card" style={{textAlign:'center', padding:'20px 14px', boxShadow:'0 4px 18px rgba(30,45,74,.1)'}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color, marginBottom:6}}>{val}</div>
              <div style={{fontSize:12, color:'#5C3D52', fontWeight:600, textTransform:'uppercase', letterSpacing:'.6px'}}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Delay warning */}
      {delayDays > 0 && (
        <div style={{background:'#FFF0F3', border:'2px solid var(--rose)', borderRadius:14, padding:'16px 22px',
          marginBottom:20, display:'flex', gap:14, alignItems:'center'}}>
          <span style={{fontSize:26}}>⚠️</span>
          <div>
            <div style={{fontWeight:700, fontSize:15, color:'var(--rose)', marginBottom:3}}>
              Period Delayed by {delayDays} day{delayDays!==1?'s':''}
            </div>
            <div style={{fontSize:13, color:'#7A3050', fontWeight:400, lineHeight:1.5}}>
              Your period was predicted on <strong>{nextPred}</strong> based on your average cycle of {avgCycle} days.
              If this continues, consider consulting a gynaecologist.
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="pill-nav">
        {[['calendar','📅 Period Calendar'],['weight','⚖️ Weight Monitor'],['history','📋 Cycle History']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} className={`pill${tab===t?' active':''}`}
            style={{fontSize:14, padding:'9px 20px'}}>{l}</button>
        ))}
      </div>

      {tab==='calendar' && (
        <div>
          <div style={{
            padding:'14px 20px', borderRadius:12, marginBottom:18, fontSize:14, fontWeight:500,
            background: rangeStart&&!rangeEnd ? 'var(--gold-pale)' : '#EEE8F4',
            border:`1.5px solid ${rangeStart&&!rangeEnd ? 'var(--gold)' : '#C9B8D8'}`,
            color: rangeStart&&!rangeEnd ? 'var(--navy)' : '#3D2B52',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <span style={{fontSize:18}}>{rangeStart&&!rangeEnd ? '📍' : '💡'}</span>
            {rangeStart&&!rangeEnd
              ? `Start date selected: ${rangeStart} — now tap the last day of your period`
              : 'Tap a day to mark your period start, then tap the end date to log the full range.'
            }
          </div>

          <div className="card" style={{padding:'30px', boxShadow:'0 6px 30px rgba(30,45,74,.12)'}}>
            {/* Month nav */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:26}}>
              <button onClick={prevMonth} style={{width:42, height:42, borderRadius:'50%',
                border:'2px solid var(--border)', background:'#fff', cursor:'pointer',
                fontSize:20, color:'var(--navy)', fontFamily:'inherit', transition:'all .18s',
                display:'flex', alignItems:'center', justifyContent:'center'}}
                onMouseEnter={e=>{e.currentTarget.style.background='var(--navy)';e.currentTarget.style.color='var(--gold)';e.currentTarget.style.borderColor='var(--navy)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='var(--navy)';e.currentTarget.style.borderColor='var(--border)';}}>‹</button>

              <div style={{textAlign:'center'}}>
                <h2 style={{fontSize:26, fontWeight:700}}>{MONTHS[month]} {year}</h2>
                {isAtMaxMonth && <div style={{fontSize:11, color:'var(--muted)', marginTop:2}}>Current month</div>}
              </div>

              <button onClick={nextMonth} style={{width:42, height:42, borderRadius:'50%',
                border:'2px solid var(--border)', background: isAtMaxMonth ? '#F0EDE8' : '#fff',
                cursor: isAtMaxMonth ? 'not-allowed' : 'pointer',
                fontSize:20, color: isAtMaxMonth ? '#C0B8B0' : 'var(--navy)',
                fontFamily:'inherit', transition:'all .18s',
                display:'flex', alignItems:'center', justifyContent:'center'}}
                onMouseEnter={e=>{ if(!isAtMaxMonth){e.currentTarget.style.background='var(--navy)';e.currentTarget.style.color='var(--gold)';e.currentTarget.style.borderColor='var(--navy)';}}}
                onMouseLeave={e=>{ if(!isAtMaxMonth){e.currentTarget.style.background='#fff';e.currentTarget.style.color='var(--navy)';e.currentTarget.style.borderColor='var(--border)';}}} >›</button>
            </div>

            {/* Legend */}
            <div style={{display:'flex', gap:20, marginBottom:20, flexWrap:'wrap'}}>
              {[
                {bg:'#F9D0DC', border:'var(--rose)',  label:'Period day'},
                {bg:'#D0EDE8', border:'var(--teal)',  label:'Today'},
                {bg:'var(--gold-pale)', border:'var(--gold)', label:'Selected range'},
                {bg:'#E8E4F0', border:'#AAA', label:'Future (locked)'},
              ].map(({bg,border,label})=>(
                <div key={label} style={{display:'flex', alignItems:'center', gap:7, fontSize:13, color:'#3D2B52', fontWeight:500}}>
                  <div style={{width:16, height:16, borderRadius:5, background:bg, border:`2px solid ${border}`}}/>
                  {label}
                </div>
              ))}
            </div>

            {/* Day headers */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:8}}>
              {DAYS.map(d=>(
                <div key={d} style={{textAlign:'center', fontSize:13, fontWeight:700,
                  color:'#4A3560', padding:'8px 0', letterSpacing:'.4px'}}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6}}>
              {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:days}).map((_,i)=>{
                const d    = i+1;
                const key  = toKey(year, month, d);
                const entry = periods[key];
                const isToday   = key===todayKey;
                const isFuture  = key > todayKey;
                const isPeriod  = entry?.isPeriod;
                const inSel     = isInRange(key);
                const isStart   = key===rangeStart;
                const isEnd     = key===rangeEnd;

                let bg     = '#F5F0E8';
                let border = 'transparent';
                let color  = '#2A1A35';
                let fontW  = 500;
                let opacity = 1;
                let cursor = 'pointer';

                if(isFuture){ bg='#EDEAF5'; color='#B0A8C0'; opacity=.5; cursor='not-allowed'; }
                if(isPeriod && !isFuture){ bg='#F9D0DC'; border='#C2185B'; color='#880E4F'; fontW=700; }
                if(inSel && !isPeriod && !isFuture){ bg='var(--gold-pale)'; border='var(--gold)'; color='var(--navy)'; }
                if((isStart||isEnd) && !isFuture){ bg='var(--gold)'; border='var(--gold)'; color='var(--navy)'; fontW=800; }
                if(isToday && !isPeriod && !inSel){ bg='#D0EDE8'; border='var(--teal)'; color='var(--teal)'; fontW=700; }

                return (
                  <div key={d}
                    onClick={()=>handleDayClick(key)}
                    onMouseEnter={()=>{ if(!isFuture && rangeStart&&!rangeEnd) setHovering(key); }}
                    onMouseLeave={()=>setHovering(null)}
                    style={{
                      aspectRatio:'1', display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      borderRadius:14, cursor, transition:'all .15s',
                      fontSize:15, fontWeight:fontW,
                      background:bg, border:`2px solid ${border}`, color,
                      userSelect:'none', opacity,
                      boxShadow: isPeriod && !isFuture ? '0 2px 8px rgba(194,24,91,.2)' : 'none',
                    }}>
                    {d}
                    {isPeriod && !isFuture && (
                      <div style={{width:5, height:5, borderRadius:'50%', background:'var(--rose)', marginTop:2}}/>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Logged ranges */}
            {Object.keys(periodRanges).length>0 && (
              <div style={{marginTop:24, borderTop:'1px solid var(--border)', paddingTop:20}}>
                <div style={{fontSize:13, fontWeight:700, color:'#3D2B52', textTransform:'uppercase',
                  letterSpacing:'.6px', marginBottom:12}}>Logged Periods This Month</div>
                <div style={{display:'flex', flexDirection:'column', gap:9}}>
                  {Object.entries(periodRanges).map(([rid,v])=>{
                    const parts = rid.split('_');
                    const s = new Date(parts[0]).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
                    const e = new Date(parts[1]).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
                    const ndays = datesBetween(new Date(parts[0]),new Date(parts[1])).length;
                    return(
                      <div key={rid} style={{display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'12px 16px', background:'#FFF0F3', borderRadius:12,
                        border:'1.5px solid #F4A0B5', boxShadow:'0 2px 8px rgba(194,24,91,.08)'}}>
                        <div>
                          <span style={{fontWeight:700, fontSize:14, color:'#880E4F'}}>📅 {s} → {e}</span>
                          <span style={{fontSize:13, color:'#7A3050', marginLeft:10}}>
                            {ndays} day{ndays!==1?'s':''} · {v.flow}
                          </span>
                          {v.symptoms?.length>0 && (
                            <div style={{fontSize:12, color:'#A06070', marginTop:4}}>
                              {v.symptoms.slice(0,3).join(' · ')}
                            </div>
                          )}
                        </div>
                        <button onClick={()=>clearRange(rid)} style={{background:'transparent', border:'none',
                          color:'var(--rose)', cursor:'pointer', fontSize:13, fontFamily:'inherit', fontWeight:700}}>
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==='weight' && (
        <div>
          <div className="card" style={{marginBottom:18, boxShadow:'0 4px 20px rgba(30,45,74,.1)'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, marginBottom:16, color:'var(--navy)'}}>Log Today's Weight</div>
            <div style={{display:'flex', gap:12, alignItems:'flex-end', maxWidth:420}}>
              <div className="fg" style={{flex:1}}>
                <label className="fl">Weight (kg)</label>
                <input className="fi" type="number" step="0.1" value={weightVal}
                  onChange={e=>setWeightVal(e.target.value)} placeholder="e.g. 62.5"
                  style={{fontSize:15}}/>
              </div>
              <button className="btn btn-gold" onClick={logWeight} style={{padding:'12px 26px', fontSize:14}}>Log</button>
            </div>
          </div>
          {weightArr.length>0 && (
            <div className="card" style={{boxShadow:'0 4px 20px rgba(30,45,74,.1)'}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, marginBottom:16, color:'var(--navy)'}}>Weight History</div>
              <div style={{display:'flex', flexDirection:'column', gap:9}}>
                {[...weightArr].reverse().map(([k,v],i)=>{
                  const prevEntry = weightArr[weightArr.length-2-i];
                  const diff = prevEntry ? parseFloat((v.w - prevEntry[1].w).toFixed(1)) : null;
                  return(
                    <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'14px 18px', background:'var(--cream)', borderRadius:12,
                      border:'1px solid var(--border)'}}>
                      <span style={{fontSize:14, color:'#4A3560', fontWeight:500}}>{v.date||k}</span>
                      <div style={{display:'flex', alignItems:'center', gap:14}}>
                        {diff!=null && (
                          <span style={{fontSize:13, fontWeight:700,
                            color:diff>0?'var(--rose)':diff<0?'var(--teal)':'var(--muted)'}}>
                            {diff>0?'+':''}{diff} kg
                          </span>
                        )}
                        <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:'var(--navy)'}}>{v.w} kg</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab==='history' && (
        <div className="card" style={{boxShadow:'0 4px 20px rgba(30,45,74,.1)'}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, marginBottom:16, color:'var(--navy)'}}>Cycle History</div>
          {cycleStarts.length===0 ? (
            <div style={{textAlign:'center', padding:'40px', color:'var(--muted)'}}>
              <div style={{fontSize:40, marginBottom:14, opacity:.4}}>📅</div>
              <div style={{fontSize:15, color:'#4A3560', fontWeight:500}}>No cycles logged yet.</div>
              <div style={{fontSize:13, color:'var(--muted)', marginTop:6}}>Use the Period Calendar tab to log your period dates.</div>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              {cycleStarts.slice().reverse().map((startKey,i,arr)=>{
                const periodDaysForStart = Object.keys(periods)
                  .filter(k=>periods[k]?.isPeriod&&k>=startKey).sort();
                const consec=[];
                let p2=null;
                periodDaysForStart.forEach(k=>{
                  if(!p2||(fromKey(k)-fromKey(p2))<=2*86400000) consec.push(k);
                  p2=k;
                });
                const durDays  = consec.length;
                const nextStart= arr[i-1];
                const cycleLen = nextStart ? Math.round((fromKey(nextStart)-fromKey(startKey))/86400000) : null;
                const e = periods[startKey];
                return(
                  <div key={startKey} style={{padding:'18px 22px', background:'var(--cream)',
                    borderRadius:14, border:'1.5px solid var(--border)',
                    boxShadow:'0 2px 10px rgba(30,45,74,.07)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
                      <div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:'var(--navy)', marginBottom:3}}>
                          {new Date(startKey).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                        </div>
                        <div style={{fontSize:13, color:'#5C3D52', fontWeight:500}}>
                          Duration: {durDays} day{durDays!==1?'s':''}
                          {cycleLen && <span style={{marginLeft:12}}>· Cycle length: {cycleLen} days</span>}
                        </div>
                      </div>
                      <span style={{padding:'4px 12px', borderRadius:20, background:'#F9D0DC',
                        color:'#880E4F', fontSize:12, fontWeight:700}}>{e?.flow||'Medium'}</span>
                    </div>
                    {e?.symptoms?.length>0 && (
                      <div style={{display:'flex', flexWrap:'wrap', gap:5, marginTop:6}}>
                        {e.symptoms.map(s=>(
                          <span key={s} style={{padding:'3px 10px', background:'#FFF0F3',
                            borderRadius:20, color:'#880E4F', fontSize:12, fontWeight:600}}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Log period modal */}
      {showLog && rangeStart && (
        <div style={{position:'fixed', inset:0, background:'rgba(10,20,40,.7)',
          backdropFilter:'blur(6px)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'var(--cream)', borderRadius:24, padding:'34px',
            width:'100%', maxWidth:500, maxHeight:'88vh', overflowY:'auto',
            boxShadow:'0 28px 70px rgba(0,0,0,.45)'}}>
            <div style={{width:48, height:3, background:'var(--gold)', borderRadius:2, marginBottom:16}}/>
            <h2 style={{fontSize:28, marginBottom:5, color:'var(--navy)'}}>Log Period</h2>
            <p style={{fontSize:14, color:'#5C3D52', marginBottom:24, fontWeight:500}}>
              {rangeStart} → {rangeEnd||rangeStart}
              {rangeEnd && rangeEnd!==rangeStart && (
                <span style={{marginLeft:8, color:'var(--gold)', fontWeight:700}}>
                  ({datesBetween(fromKey(rangeStart),fromKey(rangeEnd)).length} days)
                </span>
              )}
            </p>

            <div className="fg" style={{marginBottom:20}}>
              <label className="fl">Flow Level</label>
              <div style={{display:'flex', gap:8, marginTop:4}}>
                {FLOW.map(f=>(
                  <button key={f} type="button" onClick={()=>setFlow(f)} style={{
                    flex:1, padding:'10px', borderRadius:10, fontSize:13, fontWeight:700,
                    fontFamily:'inherit', cursor:'pointer', transition:'all .15s',
                    border:`2px solid ${flow===f?'var(--gold)':'var(--border)'}`,
                    background:flow===f?'var(--gold)':'#fff',
                    color:flow===f?'var(--navy)':'#5C3D52',
                  }}>{f}</button>
                ))}
              </div>
            </div>

            <div className="fg" style={{marginBottom:20}}>
              <label className="fl">Symptoms (select all that apply)</label>
              <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:6}}>
                {SYMPTOMS.map(s=>(
                  <button key={s} type="button"
                    onClick={()=>setSyms(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])} style={{
                    padding:'7px 14px', borderRadius:20, fontSize:13, fontWeight:600,
                    fontFamily:'inherit', cursor:'pointer', transition:'all .15s',
                    border:`1.5px solid ${syms.includes(s)?'var(--rose)':'var(--border)'}`,
                    background:syms.includes(s)?'#F9D0DC':'#fff',
                    color:syms.includes(s)?'#880E4F':'#5C3D52',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div className="fg" style={{marginBottom:26}}>
              <label className="fl">Personal Note (optional)</label>
              <textarea className="fi" rows={3} value={note} onChange={e=>setNote(e.target.value)}
                placeholder="How are you feeling? Any observations..." style={{resize:'vertical', fontSize:14}}/>
            </div>

            <div style={{display:'flex', gap:12}}>
              <button className="btn btn-gold" onClick={confirmLog}
                style={{flex:1, justifyContent:'center', padding:'14px', fontSize:15, borderRadius:12}}>
                Save Period Log
              </button>
              <button className="btn btn-outline" onClick={()=>{setShowLog(false);setRangeStart(null);setRangeEnd(null);}}
                style={{flex:1, justifyContent:'center', padding:'14px', fontSize:15, borderRadius:12}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}