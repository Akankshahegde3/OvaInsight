import React from 'react';
import { useNavigate } from 'react-router-dom';

const printReport = (result) => {
  const prob = Math.round(result.final_refined_risk_probability ?? result.lifestyle_risk_probability ?? 0);
  const cat  = result.final_risk_category ?? 'Low';
  const date = result.date ? new Date(result.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—';
  const recs = result.personalized_recommendations;
  const schemes = result.government_schemes ?? [];
  const html = `<!DOCTYPE html><html><head><title>OvaInsight Report</title>
  <style>
    body{font-family:Georgia,serif;max-width:750px;margin:40px auto;color:#1E2D4A;line-height:1.7;padding:0 30px}
    .logo{font-size:34px;font-weight:bold}.gold{color:#C9A84C}.navy{color:#1E2D4A}
    h2{color:#C9A84C;border-bottom:2px solid #EDE5D4;padding-bottom:6px;margin-top:28px;font-size:18px}
    li{margin-bottom:6px}
    .scheme{background:#F5F0E8;padding:12px 16px;border-radius:8px;margin-bottom:10px;border-left:4px solid #C9A84C}
    .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:700}
    .high{background:#F5E6EC;color:#A84C6A}.mod{background:#FFF3E0;color:#BF6000}.low{background:#E8F5E9;color:#2E7D32}
    .stats{display:flex;gap:16px;margin:16px 0;flex-wrap:wrap}
    .stat{background:#F5F0E8;padding:14px 20px;border-radius:12px;flex:1;text-align:center;min-width:100px}
    .stat-val{font-size:24px;font-weight:bold;color:#1E2D4A;font-family:Georgia}.stat-lab{font-size:12px;color:#6B7A99;margin-top:2px}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #EDE5D4;font-size:12px;color:#999;text-align:center;line-height:1.6}
  </style></head><body>
  <div class="logo"><span class="gold">Ova</span><span class="navy">Insight</span></div>
  <div style="color:#999;font-size:12px;margin-bottom:20px;letter-spacing:1px;text-transform:uppercase">Women's Health Intelligence</div>
  <h1 style="font-size:26px">Personalised PCOS Risk Report</h1>
  <div style="font-size:13px;color:#999;margin-bottom:22px">Generated on ${date}</div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${prob}% <span class="badge ${cat==='High'?'high':cat==='Moderate'?'mod':'low'}">${cat}</span></div><div class="stat-lab">Risk Score</div></div>
    <div class="stat"><div class="stat-val">${(result.lifestyle_risk_probability??0).toFixed(1)}%</div><div class="stat-lab">Lifestyle Risk</div></div>
    <div class="stat"><div class="stat-val">${result.bmi??'—'}</div><div class="stat-lab">BMI</div></div>
  </div>
  <h2>Risk Interpretation</h2><p>${result.interpretation??''}</p>
  <h2>Recommended Action</h2><p>${result.category_recommendation??''}</p>
  ${recs?.lifestyle_optimization?.length?`<h2>Nutrition & Lifestyle Plan</h2><ul>${recs.lifestyle_optimization.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${recs?.monitoring_tracking?.length?`<h2>What to Monitor</h2><ul>${recs.monitoring_tracking.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${recs?.clinical_considerations?.length?`<h2>When to See a Doctor</h2><ul>${recs.clinical_considerations.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${schemes.length?`<h2>Government Health Schemes</h2>${schemes.map(s=>`<div class="scheme"><strong>${s.scheme_name}</strong> — ${s.category}<br/>${s.benefit}</div>`).join('')}`:''}
  <div class="footer">This report is for educational purposes only and does not constitute a medical diagnosis.<br/>Please consult a qualified gynaecologist for personalised medical advice.</div>
  </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
};

export default function History({ history }) {
  const navigate = useNavigate();

  if (!history || history.length === 0) return (
    <div className="page">
      <div style={{marginBottom:26}}>
        <div className="overline" style={{marginBottom:8}}>Your Journey</div>
        <h1 style={{fontSize:36, marginBottom:6}}>My Health History</h1>
      </div>
      <div style={{textAlign:'center', padding:'60px 20px', color:'var(--muted)'}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:64, marginBottom:16, opacity:.25}}>📋</div>
        <h2 style={{fontSize:26, marginBottom:10}}>No History Yet</h2>
        <p style={{fontSize:14, marginBottom:22, fontWeight:300, maxWidth:340, margin:'0 auto 22px'}}>
          Your assessment history will appear here after you complete your first risk assessment.
        </p>
        <button className="btn btn-gold" onClick={() => navigate('/assess')} style={{fontSize:15}}>
          Start First Assessment →
        </button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div style={{marginBottom:26}}>
        <div className="overline" style={{marginBottom:8}}>Your Journey</div>
        <h1 style={{fontSize:36, marginBottom:6}}>My Health History</h1>
        <p style={{color:'var(--muted)', fontSize:14, fontWeight:300}}>
          {history.length} assessment{history.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        {history.map((r, i) => {
          const prob = Math.round(r.final_refined_risk_probability ?? r.lifestyle_risk_probability ?? 0);
          const cat  = r.final_risk_category ?? 'Low';
          const date = r.date ? new Date(r.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
          const catColor = cat==='High' ? 'var(--rose)' : cat==='Moderate' ? '#BF6000' : '#2E7D32';
          const badgeCls = cat==='High' ? 'b-high' : cat==='Moderate' ? 'b-mod' : 'b-low';
          return (
            <div key={r.id||i} style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:18, padding:'22px 26px',
              display:'flex', alignItems:'center', gap:22, flexWrap:'wrap',
              boxShadow:'var(--shadow)', transition:'all .2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow)';e.currentTarget.style.transform='translateY(0)';}}>

              {/* Circular gauge */}
              <div style={{width:72, height:72, borderRadius:'50%', flexShrink:0,
                background:`conic-gradient(${catColor} ${prob*3.6}deg, var(--cream-dark) 0deg)`,
                display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                <div style={{width:54, height:54, borderRadius:'50%', background:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:800, color:catColor, lineHeight:1}}>{prob}%</div>
                  <div style={{fontSize:8, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.3px'}}>Risk</div>
                </div>
              </div>

              {/* Details */}
              <div style={{flex:1, minWidth:200}}>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:'var(--navy)'}}>{cat} Risk Assessment</span>
                  <span className={`badge ${badgeCls}`}>{cat}</span>
                </div>
                <div style={{fontSize:12, color:'var(--muted)', marginBottom:6, fontWeight:300}}>{date}</div>
                <div style={{fontSize:13, color:'var(--text2)', lineHeight:1.5, fontWeight:300}}>
                  {r.interpretation?.slice(0,130)}…
                </div>
              </div>

              {/* Stats */}
              <div style={{display:'flex', gap:10, flexShrink:0}}>
                {[{l:'BMI',v:r.bmi??'—'},{l:'Lifestyle',v:`${(r.lifestyle_risk_probability??0).toFixed(0)}%`},{l:'Clinical',v:`+${(r.clinical_adjustment??0).toFixed(0)}%`}]
                  .map(({l,v}) => (
                  <div key={l} style={{textAlign:'center', padding:'10px 14px', background:'var(--cream)', borderRadius:12}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:'var(--navy)'}}>{v}</div>
                    <div style={{fontSize:10, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.4px'}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Download button */}
              <button className="btn btn-gold" onClick={() => printReport(r)} style={{fontSize:12, padding:'9px 16px'}}>
                ⬇ Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
