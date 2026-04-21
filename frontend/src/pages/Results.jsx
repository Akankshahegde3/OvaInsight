import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell,RadarChart,Radar,PolarGrid,PolarAngleAxis } from 'recharts';

function RiskGauge({prob,cat}){
  const color=cat==='High'?'#A84C6A':cat==='Moderate'?'#BF6000':'#2E7D32';
  const r=52,cx=70,cy=70,circ=2*Math.PI*r;
  const offset=circ-(Math.min(prob,100)/100)*circ;
  return(
    <div style={{position:'relative',width:140,height:130,flexShrink:0}}>
      <svg width={140} height={130} viewBox="0 0 140 130">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--cream-dark)" strokeWidth={12}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{transition:'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)'}}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={22} fontWeight={700} fill={color} fontFamily="Cormorant Garamond,serif">{Math.round(prob)}%</text>
        <text x={cx} y={cy+16} textAnchor="middle" fontSize={11} fill="var(--muted)" fontFamily="Jost,sans-serif">{cat} Risk</text>
      </svg>
    </div>
  );
}

function FactorBar({feature,percentage,direction}){
  const up=direction==='increase';
  return(
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'7px 0'}}>
      <div style={{width:140,fontSize:13,color:'var(--text2)',fontWeight:500,flexShrink:0}}>{feature}</div>
      <div style={{flex:1,background:'var(--cream-dark)',borderRadius:99,height:10,overflow:'hidden'}}>
        <div style={{width:`${Math.min(percentage*2.5,100)}%`,height:'100%',borderRadius:99,
          background:up?'linear-gradient(90deg,var(--rose-mid),var(--rose))':'linear-gradient(90deg,#43A047,#2E7D32)',
          transition:'width 1.4s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
      <span style={{fontSize:12,fontWeight:700,minWidth:60,textAlign:'right',color:up?'var(--rose)':'var(--teal)'}}>{up?'↑':'↓'} {percentage}%</span>
    </div>
  );
}

function RecBlock({title,icon,items,border,bg}){
  if(!items?.length) return null;
  return(
    <div style={{marginBottom:18}}>
      <div style={{fontSize:13,fontWeight:700,color:'var(--navy)',marginBottom:10,display:'flex',alignItems:'center',gap:7}}>
        <span>{icon}</span>{title}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:7}}>
        {items.map((item,i)=>(
          <div key={i} style={{padding:'12px 15px',background:bg,borderRadius:11,fontSize:13,lineHeight:1.6,borderLeft:`3px solid ${border}`,color:'var(--text)',fontWeight:300}}>{item}</div>
        ))}
      </div>
    </div>
  );
}

const printReport=(result,prob,cat)=>{
  const date=result.date?new Date(result.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):new Date().toLocaleDateString('en-IN');
  const recs=result.personalized_recommendations; const schemes=result.government_schemes??[];
  const html=`<!DOCTYPE html><html><head><title>OvaInsight Health Report</title>
  <style>body{font-family:Georgia,serif;max-width:750px;margin:40px auto;color:#1E2D4A;line-height:1.7;padding:0 30px}
  .logo{font-size:34px;font-weight:bold;margin-bottom:4px}.logo .o{color:#C9A84C}.logo .i{color:#1E2D4A}
  .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:700}
  .high{background:#F5E6EC;color:#A84C6A}.mod{background:#FFF3E0;color:#BF6000}.low{background:#E8F5E9;color:#2E7D32}
  h2{color:#C9A84C;border-bottom:2px solid #EDE5D4;padding-bottom:6px;margin-top:28px;font-size:18px}
  li{margin-bottom:6px}.scheme{background:#F5F0E8;padding:12px 16px;border-radius:8px;margin-bottom:10px;border-left:4px solid #C9A84C}
  .stats{display:flex;gap:16px;margin:16px 0;flex-wrap:wrap}
  .stat{background:#F5F0E8;padding:14px 20px;border-radius:12px;flex:1;text-align:center;min-width:120px}
  .stat-val{font-size:24px;font-weight:bold;color:#1E2D4A;font-family:Georgia}.stat-lab{font-size:12px;color:#6B7A99;margin-top:2px}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #EDE5D4;font-size:12px;color:#999;text-align:center;line-height:1.6}
  </style></head><body>
  <div class="logo"><span class="o">Ova</span><span class="i">Insight</span></div>
  <div style="color:#999;font-size:13px;margin-bottom:22px;letter-spacing:1px;text-transform:uppercase">Women's Health Intelligence</div>
  <h1 style="font-size:28px;margin-bottom:4px">Personalised PCOS Risk Report</h1>
  <div style="font-size:13px;color:#999;margin-bottom:22px">Generated on ${date}</div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${prob}% <span class="badge ${cat==='High'?'high':cat==='Moderate'?'mod':'low'}">${cat}</span></div><div class="stat-lab">Overall Risk Score</div></div>
    <div class="stat"><div class="stat-val">${(result.lifestyle_risk_probability??0).toFixed(1)}%</div><div class="stat-lab">Lifestyle Risk</div></div>
    <div class="stat"><div class="stat-val">${result.bmi??'—'}</div><div class="stat-lab">BMI</div></div>
  </div>
  <h2>Risk Interpretation</h2><p>${result.interpretation??''}</p>
  <h2>Recommended Action</h2><p>${result.category_recommendation??''}</p>
  ${recs?.lifestyle_optimization?.length?`<h2>Nutrition & Lifestyle Plan</h2><ul>${recs.lifestyle_optimization.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${recs?.monitoring_tracking?.length?`<h2>What to Monitor</h2><ul>${recs.monitoring_tracking.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${recs?.clinical_considerations?.length?`<h2>When to See a Doctor</h2><ul>${recs.clinical_considerations.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
  ${schemes.length?`<h2>Government Health Schemes</h2>${schemes.map(s=>`<div class="scheme"><strong>${s.scheme_name}</strong> — ${s.category}<br/>${s.benefit}</div>`).join('')}`:''}
  <div class="footer">This report was generated by OvaInsight for educational and informational purposes only.<br/>It is not a substitute for professional medical advice, diagnosis, or treatment.<br/>Please consult a qualified gynaecologist or healthcare provider for personalised medical care.</div>
  </body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close(); w.print();
};

export default function Results({result}){
  const navigate=useNavigate();
  if(!result) return(
    <div className="page" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:420}}>
      <div style={{textAlign:'center',color:'var(--muted)'}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:64,marginBottom:16,opacity:.2}}>◉</div>
        <h2 style={{fontSize:26,marginBottom:10}}>No Results Yet</h2>
        <p style={{fontSize:14,marginBottom:22,fontWeight:300,maxWidth:320,margin:'0 auto 22px'}}>Complete a risk assessment to see your personalised health report here</p>
        <button className="btn btn-gold" onClick={()=>navigate('/assess')} style={{fontSize:15}}>Start Assessment →</button>
      </div>
    </div>
  );

  const prob=result.final_refined_risk_probability??result.lifestyle_risk_probability??0;
  const lifestyle=parseFloat((result.lifestyle_risk_probability??0).toFixed(1));
  const clinical=parseFloat((result.clinical_adjustment??0).toFixed(1));
  const cat=result.final_risk_category??'Low';
  const bmi=result.bmi;
  const recs=result.personalized_recommendations;
  const behavioral=result.behavioral_metabolic_factors??[];
  const clinSign=result.clinical_sign_indicators??[];
  const schemes=result.government_schemes??[];
  const allContrib=[...behavioral,...clinSign];
  const catColor=cat==='High'?'var(--rose)':cat==='Moderate'?'#BF6000':'#2E7D32';
  const badgeCls=cat==='High'?'b-high':cat==='Moderate'?'b-mod':'b-low';
  const date=result.date?new Date(result.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):null;

  const barData=[
    {name:'Lifestyle Risk',value:lifestyle,fill:'#6B46C1'},
    {name:'Clinical Adjustment',value:clinical,fill:'var(--teal)'},
    {name:'Final Risk Score',value:parseFloat(prob.toFixed(1)),fill:cat==='High'?'#A84C6A':cat==='Moderate'?'#BF6000':'#2E7D32'},
  ];
  const radarData=allContrib.slice(0,6).map(c=>({feature:c.feature,value:parseFloat(c.percentage.toFixed(1))}));

  return(
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <div className="overline" style={{marginBottom:8}}>Assessment Report</div>
          <h1 style={{fontSize:34,marginBottom:6}}>Your Health Results</h1>
          {date&&<p style={{color:'var(--muted)',fontSize:13,fontWeight:300}}>Assessment completed on {date}</p>}
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-outline" onClick={()=>navigate('/assess')}>← New Assessment</button>
          <button className="btn btn-gold" onClick={()=>printReport(result,Math.round(prob),cat)}>⬇ Download Report</button>
        </div>
      </div>

      <div className="g2" style={{marginBottom:22}}>
        <div className="card">
          <div className="stitle">Risk Result</div>
          <div style={{display:'flex',gap:22,alignItems:'center'}}>
            <RiskGauge prob={prob} cat={cat}/>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:catColor,marginBottom:6}}>{cat} Risk</div>
              <span className={`badge ${badgeCls}`} style={{marginBottom:12,display:'inline-flex',fontSize:12}}>
                {cat==='High'?'⚠️ Consult a Gynaecologist':cat==='Moderate'?'⚡ Action Recommended':'✅ Maintain Healthy Habits'}
              </span>
              <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6,fontWeight:300}}>{result.interpretation}</p>
            </div>
          </div>
          <div className="divider"/>
          <div className="g3" style={{gap:12}}>
            {[{l:'Lifestyle Risk',v:`${lifestyle}%`,c:'#6B46C1'},{l:'Clinical Adjustment',v:`+${clinical}%`,c:'var(--teal)'},{l:'BMI',v:bmi??'—',c:'var(--navy)'}]
              .map(({l,v,c})=>(
              <div key={l} style={{textAlign:'center',padding:14,background:'var(--cream)',borderRadius:12}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:3,fontWeight:500,letterSpacing:'.4px'}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:'13px 16px',background:'var(--gold-pale)',borderRadius:12,fontSize:13,color:'var(--navy)',lineHeight:1.6,border:'1px solid var(--gold-light)'}}>
            <strong>Recommended Action:</strong> {result.category_recommendation}
          </div>
        </div>

        <div className="card">
          <div className="stitle">Factors Influencing Your Score</div>
          <p style={{fontSize:12,color:'var(--muted)',marginBottom:18,lineHeight:1.6,fontWeight:300}}>
            These are the key inputs from your assessment that had the most influence on your risk score. Longer bars indicate greater influence.
          </p>
          {allContrib.length>0?(
            <div style={{display:'flex',flexDirection:'column',gap:2}}>
              {allContrib.map((c,i)=><FactorBar key={i} feature={c.feature} percentage={c.percentage} direction={c.direction}/>)}
            </div>
          ):(
            <div style={{color:'var(--muted)',fontSize:13,padding:'20px',textAlign:'center',background:'var(--cream)',borderRadius:10}}>
              Factor data not available. Ensure the backend is running correctly.
            </div>
          )}
          <div style={{marginTop:14,padding:'11px 14px',background:'var(--teal-light)',borderRadius:10,fontSize:12,color:'var(--teal)',lineHeight:1.6,fontWeight:300}}>
            ℹ️ These factors reflect statistical patterns in the data associated with PCOS. They are not confirmed medical causes.
          </div>
        </div>
      </div>

      <div className="g2" style={{marginBottom:22}}>
        <div className="card">
          <div className="stitle">Risk Score Breakdown</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={barData} barSize={52}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-dark)" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:'var(--muted)',fontFamily:'Jost,sans-serif'}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fontSize:11,fill:'var(--muted)'}} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip formatter={v=>`${v}%`} contentStyle={{borderRadius:12,border:'1px solid var(--border)',fontSize:13,fontFamily:'Jost,sans-serif',boxShadow:'0 4px 20px rgba(0,0,0,.1)'}}/>
              <Bar dataKey="value" radius={[10,10,0,0]}>
                {barData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {radarData.length>=3&&(
          <div className="card">
            <div className="stitle">Risk Factor Profile</div>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--cream-darker,#D4C9B0)"/>
                <PolarAngleAxis dataKey="feature" tick={{fontSize:11,fill:'var(--muted)',fontFamily:'Jost,sans-serif'}}/>
                <Radar dataKey="value" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.2} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {recs&&(
        <div className="card" style={{marginBottom:22}}>
          <div className="stitle">Your Personalised Health Plan</div>
          <div className="g2">
            <div>
              <RecBlock title="Nutrition & Lifestyle" icon="🥗" items={recs.lifestyle_optimization} border="var(--teal)" bg="var(--teal-light)"/>
              <RecBlock title="What to Monitor" icon="📈" items={recs.monitoring_tracking} border="var(--gold)" bg="var(--gold-pale)"/>
            </div>
            <RecBlock title="When to See a Doctor" icon="🏥" items={recs.clinical_considerations} border="var(--rose)" bg="var(--rose-light)"/>
          </div>
        </div>
      )}

      {schemes.length>0&&(
        <div className="card">
          <div className="stitle">Government Health Schemes Available to You</div>
          <div className="g2">
            {schemes.map((s,i)=>(
              <div key={i} style={{padding:'16px 18px',border:'1px solid var(--border)',borderRadius:14,transition:'all .2s',cursor:'default'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.boxShadow='0 4px 16px rgba(201,168,76,.15)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow='none';}}>
                <span className="tag" style={{background:'var(--navy-pale)',color:'var(--navy)',marginBottom:8,display:'inline-block'}}>{s.category}</span>
                <div style={{fontSize:14,fontWeight:600,marginBottom:5,lineHeight:1.4,fontFamily:"'Cormorant Garamond',serif",color:'var(--navy)'}}>{s.scheme_name}</div>
                <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5,fontWeight:300}}>{s.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}