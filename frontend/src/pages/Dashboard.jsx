import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ result, user }) {
  const navigate = useNavigate();
  const prob = result?.final_refined_risk_probability ?? result?.lifestyle_risk_probability;
  const cat  = result?.final_risk_category;
  const bmi  = result?.bmi;
  const recs = result?.personalized_recommendations;
  const date = result?.date ? new Date(result.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null;
  const catColor = cat==='High'?'var(--rose)':cat==='Moderate'?'#BF6000':'#2E7D32';
  const badgeCls = cat==='High'?'b-high':cat==='Moderate'?'b-mod':'b-low';

  const ACTIONS = [
    {icon:'◈',label:'Risk Assessment',   sub:'Get your AI-powered PCOS risk score',  to:'/assess',    gold:true},
    {icon:'◎',label:'Period Tracker',    sub:'Log your cycle and track symptoms',     to:'/tracker',   gold:false},
    {icon:'⬢',label:'Health Assistant',  sub:'Ask any question about PCOS',           to:'/chatbot',   gold:false},
    {icon:'▦',label:'Health Schemes',    sub:'Discover free government healthcare',   to:'/schemes',   gold:false},
    {icon:'◇',label:'Yoga & Exercises',  sub:'Poses for hormonal balance',            to:'/exercises', gold:false},
    {icon:'≡', label:'My History',        sub:'View past assessments & reports',       to:'/history',   gold:false},
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{marginBottom:32}}>
        <div className="overline" style={{marginBottom:8}}>
          {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        </div>
        <h1 style={{fontSize:38,marginBottom:6}}>Good day, {user}</h1>
        <p style={{color:'var(--muted)',fontSize:15,fontWeight:300}}>
          Here is your personalised women's health overview
        </p>
      </div>

      {/* Hero risk banner */}
      {result ? (
        <div style={{
          background:'var(--navy)',borderRadius:20,padding:'28px 34px',
          marginBottom:28,display:'flex',alignItems:'center',
          justifyContent:'space-between',flexWrap:'wrap',gap:20,
          boxShadow:'0 8px 32px rgba(30,45,74,.2)',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',right:-40,top:-40,width:200,height:200,borderRadius:'50%',background:'rgba(201,168,76,.06)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:60,bottom:-60,width:150,height:150,borderRadius:'50%',background:'rgba(201,168,76,.04)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div className="overline" style={{color:'var(--gold)',marginBottom:8}}>Latest Assessment Result</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:'var(--cream)',marginBottom:6}}>
              {prob}% — {cat} Risk
            </div>
            <div style={{fontSize:13,color:'rgba(245,240,232,.55)',fontWeight:300}}>{date}</div>
          </div>
          <div style={{display:'flex',gap:12,position:'relative',zIndex:1,flexWrap:'wrap'}}>
            <button className="btn btn-outline" onClick={()=>navigate('/results')}
              style={{border:'1px solid rgba(245,240,232,.25)',color:'var(--cream)',background:'rgba(255,255,255,.06)'}}>
              View Full Report
            </button>
            <button className="btn btn-gold" onClick={()=>navigate('/assess')}>New Assessment</button>
          </div>
        </div>
      ) : (
        <div style={{
          background:'var(--navy)',borderRadius:20,padding:'36px',
          marginBottom:28,textAlign:'center',
          boxShadow:'0 8px 32px rgba(30,45,74,.2)',
          position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 50%, rgba(201,168,76,.08), transparent)',pointerEvents:'none'}}/>
          <div className="overline" style={{color:'var(--gold)',marginBottom:16}}>Get Started</div>
          <h2 style={{fontSize:32,color:'var(--cream)',marginBottom:10}}>Begin Your First Assessment</h2>
          <p style={{fontSize:14,color:'rgba(245,240,232,.55)',marginBottom:24,maxWidth:440,margin:'0 auto 24px',fontWeight:300}}>
            Receive your personalised PCOS risk score powered by machine learning and clinical data analysis
          </p>
          <button className="btn btn-gold" onClick={()=>navigate('/assess')} style={{fontSize:15,padding:'13px 30px'}}>
            Start Risk Assessment →
          </button>
        </div>
      )}

      {/* Stats */}
      {result && (
        <div className="g4" style={{marginBottom:28}}>
          {[
            {label:'Risk Score',  val:`${prob}%`,    sub:cat+' Risk',      color:catColor},
            {label:'BMI',         val:bmi??'—',       sub:bmi?(bmi<18.5?'Underweight':bmi<25?'Normal range':bmi<30?'Overweight':'Obese'):'', color:'var(--navy)'},
            {label:'Lifestyle',   val:`${(result.lifestyle_risk_probability??0).toFixed(0)}%`, sub:'Lifestyle factors', color:'#6B46C1'},
            {label:'Clinical Adj.',val:`+${(result.clinical_adjustment??0).toFixed(0)}%`, sub:'Clinical refinement', color:'var(--teal)'},
          ].map(({label,val,sub,color})=>(
            <div key={label} className="card" style={{textAlign:'center',padding:'20px 16px'}}>
              <div style={{fontSize:10,fontWeight:600,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:10}}>{label}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color,marginBottom:4}}>{val}</div>
              <div style={{fontSize:11,color:'var(--muted)',fontWeight:400}}>{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{marginBottom:28}}>
        <div className="overline" style={{marginBottom:14}}>Quick Access</div>
        <div className="g3">
          {ACTIONS.map(({icon,label,sub,to,gold})=>(
            <div key={to} onClick={()=>navigate(to)} style={{
              background:gold?'var(--navy)':'var(--card)',
              border:gold?'none':'1px solid var(--border)',
              borderRadius:16,padding:'22px 20px',
              cursor:'pointer',transition:'all .2s',
              boxShadow:gold?'0 8px 24px rgba(30,45,74,.2)':'var(--shadow)',
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=gold?'0 14px 36px rgba(30,45,74,.3)':'var(--shadow-md)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=gold?'0 8px 24px rgba(30,45,74,.2)':'var(--shadow)';}}
            >
              <div style={{fontSize:22,marginBottom:10,color:gold?'var(--gold)':'var(--gold)'}}>{icon}</div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:5,fontFamily:"'Cormorant Garamond',serif",color:gold?'var(--cream)':'var(--navy)'}}>{label}</div>
              <div style={{fontSize:12,color:gold?'rgba(245,240,232,.6)':'var(--muted)',lineHeight:1.5,fontWeight:300}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations preview */}
      {recs?.lifestyle_optimization?.length > 0 && (
        <div className="card-navy" style={{borderRadius:16}}>
          <div className="overline" style={{color:'var(--gold)',marginBottom:10}}>Your Health Recommendations</div>
          <div className="g2">
            {recs.lifestyle_optimization.slice(0,4).map((tip,i)=>(
              <div key={i} style={{padding:'14px 16px',background:'rgba(255,255,255,.06)',borderRadius:12,
                fontSize:13,lineHeight:1.6,borderLeft:'3px solid var(--gold)',color:'rgba(245,240,232,.85)',fontWeight:300}}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}