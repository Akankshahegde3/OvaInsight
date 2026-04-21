import React, { useState } from 'react';

const ALL = [
  {name:'Ayushman Bharat – PM-JAY', cat:'Central Government',
   desc:'Health insurance coverage of up to Rs.5 lakh per family per year for secondary and tertiary hospitalisation, including gynaecological and reproductive health conditions.',
   age:'All ages', risk:'Moderate / High', link:'https://pmjay.gov.in'},
  {name:'Free Diagnostic Services Initiative', cat:'Central Government',
   desc:'Free or subsidised hormone tests including LH, FSH, and AMH, as well as blood sugar testing at government hospitals and primary health centres across India.',
   age:'All ages', risk:'Moderate / High', link:'https://nhm.gov.in'},
  {name:'Pradhan Mantri Matru Vandana Yojana', cat:'Central Government',
   desc:'A cash incentive of Rs.5,000 for pregnant and lactating women to compensate for wage loss and support nutritional needs during and after pregnancy.',
   age:'18–40 years', risk:'All', link:'https://pmmvy.wcd.gov.in'},
  {name:'Janani Suraksha Yojana (JSY)', cat:'Central Government',
   desc:'Financial assistance and ASHA worker support for safe institutional delivery, encouraging pregnant women to deliver in government health facilities.',
   age:'18–40 years', risk:'All', link:'https://nhm.gov.in'},
  {name:'Arogya Karnataka', cat:'Karnataka State',
   desc:'State-level health assurance scheme providing cashless treatment at empanelled hospitals across Karnataka for BPL and APL families.',
   age:'All ages', risk:'Moderate / High', link:'https://arogyakarnataka.gov.in'},
  {name:"Suraksha Women's Health Clinics", cat:'Karnataka State',
   desc:"Dedicated women's health clinics at district hospitals in Karnataka offering free consultations, reproductive health screenings, and medicines for conditions including PCOS.",
   age:'All ages', risk:'All', link:'https://karnataka.gov.in'},
  {name:'Rashtriya Kishor Swasthya Karyakram', cat:'Adolescent Health',
   desc:'A national programme providing adolescent girls aged 10–19 with reproductive health counselling, nutritional guidance, and support for hormonal irregularities.',
   age:'10–19 years', risk:'All', link:'https://nhm.gov.in'},
  {name:"FOGSI Women's Health Initiative", cat:'NGO / Association',
   desc:'Free PCOS screening camps and teleconsultation sessions with gynaecologists, organised quarterly by the Federation of Obstetric and Gynaecological Societies of India.',
   age:'All ages', risk:'All', link:'https://www.fogsi.org'},
  {name:'iCall Psychosocial Helpline', cat:'Mental Health',
   desc:'Free mental health counselling for women managing PCOS-related emotional challenges such as anxiety, depression, body image concerns, and fertility worries.',
   age:'All ages', risk:'All', link:'https://icallhelpline.org'},
];

export default function Schemes({ result }) {
  const [filter, setFilter] = useState('All');
  const cats = ['All','Central Government','Karnataka State','Adolescent Health','NGO / Association','Mental Health'];
  const visible = filter==='All' ? ALL : ALL.filter(s => s.cat === filter);

  return (
    <div className="page">
      <div style={{marginBottom:26}}>
        <div className="overline" style={{marginBottom:8}}>Healthcare Access</div>
        <h1 style={{fontSize:36, marginBottom:6}}>Government Health Schemes</h1>
        <p style={{color:'var(--muted)', fontSize:14, fontWeight:300}}>
          Discover free and subsidised healthcare programmes available for women's reproductive health across India
        </p>
      </div>

      {result?.final_risk_category && (
        <div style={{background:'var(--navy)', borderRadius:16, padding:'18px 22px', marginBottom:22, display:'flex', gap:14, alignItems:'center'}}>
          <span style={{fontSize:22, flexShrink:0}}>💡</span>
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:4}}>Based on your assessment</div>
            <div style={{fontSize:13, color:'rgba(245,240,232,.8)', fontWeight:300}}>
              Your <strong style={{color:'var(--gold)'}}>{result.final_risk_category} risk</strong> result means you may qualify for{' '}
              <strong style={{color:'var(--cream)'}}>Ayushman Bharat PM-JAY</strong> and{' '}
              <strong style={{color:'var(--cream)'}}>Free Diagnostic Services</strong> for subsidised hormone testing.
            </div>
          </div>
        </div>
      )}

      <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'13px 18px', display:'flex', alignItems:'center', gap:12, marginBottom:22}}>
        <span style={{fontSize:18}}>📍</span>
        <div>
          <div style={{fontSize:13, fontWeight:600, color:'var(--navy)'}}>Detected Location: Karnataka, India</div>
          <div style={{fontSize:11, color:'var(--muted)', fontWeight:300}}>Showing both central and Karnataka state-specific schemes</div>
        </div>
      </div>

      <div className="pill-nav">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`pill${filter===c?' active':''}`}>{c}</button>
        ))}
      </div>

      <div className="g2">
        {visible.map((s, i) => (
          <div key={i} style={{
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:16, padding:'20px 22px',
            transition:'all .2s', boxShadow:'var(--shadow)',
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.boxShadow='0 8px 28px rgba(201,168,76,.15)';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow='var(--shadow)';e.currentTarget.style.transform='translateY(0)';}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
              <span style={{padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700,
                textTransform:'uppercase', letterSpacing:'.5px',
                background:'var(--navy-pale)', color:'var(--navy)'}}>{s.cat}</span>
              <span style={{fontSize:11, color:'var(--muted)', fontWeight:400}}>👤 {s.age}</span>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700,
              marginBottom:8, lineHeight:1.3, color:'var(--navy)'}}>{s.name}</div>
            <div style={{fontSize:12, color:'var(--muted)', lineHeight:1.6, marginBottom:14, fontWeight:300}}>{s.desc}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
              borderTop:'1px solid var(--border)', paddingTop:12}}>
              <span style={{fontSize:11, color:'var(--muted)', fontWeight:500}}>For: {s.risk}</span>
              <a href={s.link} target="_blank" rel="noreferrer" style={{
                fontSize:13, color:'var(--navy)', fontWeight:700,
                display:'flex', alignItems:'center', gap:5,
                padding:'7px 16px', background:'var(--gold)', borderRadius:9, transition:'all .15s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.background='#B8963E';}}
                onMouseLeave={e=>{e.currentTarget.style.background='var(--gold)';}}>
                Visit Official Site ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
