import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BINARY = [
  {key:'weight_gain',      label:'Recent Weight Gain',        sub:'Noticeable increase in past 6–12 months'},
  {key:'hair_growth',      label:'Excess Hair Growth',         sub:'On face, chest or abdomen'},
  {key:'hair_loss',        label:'Hair Thinning or Loss',      sub:'From the scalp'},
  {key:'pimples',          label:'Persistent Acne',            sub:'Frequent or severe breakouts'},
  {key:'skin_darkening',   label:'Skin Darkening',             sub:'Around neck or underarms'},
  {key:'fast_food',        label:'Frequent Fast Food Intake',  sub:'Multiple times per week'},
  {key:'regular_exercise', label:'Regular Physical Activity',  sub:'At least 3 times per week'},
];

function Toggle({value,onChange}){
  return(
    <div style={{display:'flex',gap:6}}>
      {[1,0].map(v=>(
        <button key={v} type="button" onClick={()=>onChange(v)} style={{
          padding:'7px 20px',borderRadius:9,fontSize:13,fontWeight:600,
          border:`1.5px solid ${value===v?'var(--gold)':'var(--border)'}`,
          background:value===v?'var(--gold)':'#fff',
          color:value===v?'var(--navy)':'var(--muted)',
          cursor:'pointer',transition:'all .15s',fontFamily:'inherit',
        }}>{v===1?'Yes':'No'}</button>
      ))}
    </div>
  );
}

function Stepper({value,onChange,min=0,max=999,step=1,placeholder}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <button type="button" onClick={()=>onChange(Math.max(min,(parseFloat(value)||0)-step))}
        style={{width:34,height:40,borderRadius:9,border:'1.5px solid var(--border)',background:'#fff',fontSize:18,color:'var(--muted)',cursor:'pointer',flexShrink:0,fontFamily:'inherit',transition:'all .15s'}}
        onMouseEnter={e=>{e.target.style.background='var(--navy)';e.target.style.color='var(--gold)';}}
        onMouseLeave={e=>{e.target.style.background='#fff';e.target.style.color='var(--muted)';}}>−</button>
      <input className="fi" type="number" value={value} min={min} max={max} step={step}
        onChange={e=>onChange(e.target.value===''?'':parseFloat(e.target.value))}
        placeholder={placeholder} style={{textAlign:'center'}}/>
      <button type="button" onClick={()=>onChange(Math.min(max,(parseFloat(value)||0)+step))}
        style={{width:34,height:40,borderRadius:9,border:'1.5px solid var(--border)',background:'#fff',fontSize:18,color:'var(--muted)',cursor:'pointer',flexShrink:0,fontFamily:'inherit',transition:'all .15s'}}
        onMouseEnter={e=>{e.target.style.background='var(--navy)';e.target.style.color='var(--gold)';}}
        onMouseLeave={e=>{e.target.style.background='#fff';e.target.style.color='var(--muted)';}}>+</button>
    </div>
  );
}

const INIT={age:'',height:'',weight:'',cycle_length:28,weight_gain:0,hair_growth:0,hair_loss:0,pimples:0,skin_darkening:0,fast_food:0,regular_exercise:1,lh:'',fsh:'',amh:'',fasting_sugar:''};

export default function Assessment({onResult,onAddHistory}){
  const navigate=useNavigate();
  const [form,setForm]=useState(INIT);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const bmi=form.height&&form.weight?(parseFloat(form.weight)/Math.pow(parseFloat(form.height)/100,2)).toFixed(1):null;

  const submit=async(e)=>{
    e.preventDefault();setError('');
    if(!form.age||!form.height||!form.weight){setError('Age, height and weight are required.');return;}
    setLoading(true);
    try{
      const payload={
        age:parseInt(form.age),height:parseFloat(form.height),weight:parseFloat(form.weight),
        cycle_length:parseInt(form.cycle_length),weight_gain:form.weight_gain,
        hair_growth:form.hair_growth,hair_loss:form.hair_loss,pimples:form.pimples,
        skin_darkening:form.skin_darkening,fast_food:form.fast_food,regular_exercise:form.regular_exercise,
        lh:form.lh!==''?parseFloat(form.lh):null,fsh:form.fsh!==''?parseFloat(form.fsh):null,
        amh:form.amh!==''?parseFloat(form.amh):null,
        fasting_sugar:form.fasting_sugar!==''?parseFloat(form.fasting_sugar):null,
      };
      const res=await fetch('http://127.0.0.1:8000/predict/lifestyle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!res.ok){const d=await res.json();throw new Error(d.detail||'Server error');}
      const data=await res.json();
      const stamped={...data,bmi:parseFloat(bmi),date:new Date().toISOString()};
      onResult(stamped); onAddHistory({...stamped,id:Date.now()});
      navigate('/results');
    }catch(err){
      setError(err.message.includes('fetch')?'Cannot connect to backend. Start it with: uvicorn main:app --reload --port 8000':err.message);
    }
    setLoading(false);
  };

  return(
    <div className="page">
      <div style={{marginBottom:28}}>
        <div className="overline" style={{marginBottom:8}}>AI-Powered Analysis</div>
        <h1 style={{fontSize:36,marginBottom:6}}>PCOS Risk Assessment</h1>
        <p style={{color:'var(--muted)',fontSize:14,fontWeight:300,maxWidth:600}}>
          Complete the form below. Our machine learning model analyses your health indicators to generate a personalised risk score with clinical insights.
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="g2" style={{marginBottom:22}}>
          <div style={{display:'flex',flexDirection:'column',gap:18}}>

            <div className="card">
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'var(--gold)'}}>📏</div>
                <div>
                  <div className="overline" style={{marginBottom:1}}>Step 1</div>
                  <div style={{fontWeight:600,fontSize:15,color:'var(--navy)'}}>Body Measurements</div>
                </div>
              </div>
              <div className="g2" style={{gap:14}}>
                <div className="fg"><label className="fl">Age (years)</label><Stepper value={form.age} onChange={v=>set('age',v)} min={10} max={60} placeholder="e.g. 24"/></div>
                <div className="fg"><label className="fl">Height (cm)</label><Stepper value={form.height} onChange={v=>set('height',v)} min={100} max={220} step={0.5} placeholder="e.g. 160"/></div>
                <div className="fg"><label className="fl">Weight (kg)</label><Stepper value={form.weight} onChange={v=>set('weight',v)} min={20} max={200} step={0.5} placeholder="e.g. 60"/></div>
                <div className="fg"><label className="fl">Cycle Length (days)</label><Stepper value={form.cycle_length} onChange={v=>set('cycle_length',v)} min={15} max={90} placeholder="e.g. 28"/></div>
              </div>
              {bmi&&(
                <div style={{marginTop:16,padding:'13px 16px',borderRadius:12,
                  background:parseFloat(bmi)>=25?'var(--rose-light)':'var(--teal-light)',
                  border:`1px solid ${parseFloat(bmi)>=25?'#F4A0B5':'#80CBC4'}`,
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:parseFloat(bmi)>=25?'var(--rose)':'var(--teal)'}}>BMI: {bmi}</span>
                  <span style={{fontSize:12,color:'var(--muted)',fontWeight:500}}>
                    {parseFloat(bmi)<18.5?'Underweight':parseFloat(bmi)<25?'Normal Weight ✓':parseFloat(bmi)<30?'Overweight ⚠':'Obese ⚠'}
                  </span>
                </div>
              )}
              <div style={{marginTop:16}}>
                <label className="fl" style={{display:'block',marginBottom:9}}>
                  Cycle Length — {form.cycle_length} days
                  {form.cycle_length>35&&<span style={{color:'var(--rose)',marginLeft:8,fontWeight:700}}>⚠ Irregular</span>}
                </label>
                <input type="range" min={15} max={90} value={form.cycle_length}
                  onChange={e=>set('cycle_length',parseInt(e.target.value))}
                  style={{width:'100%',accentColor:'var(--gold)'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--muted)',marginTop:5}}>
                  <span>15d (Short)</span><span style={{color:'var(--teal)',fontWeight:600}}>Normal: 21–35 days</span><span>90d (Long)</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'var(--gold)'}}>🔬</div>
                <div>
                  <div className="overline" style={{marginBottom:1}}>Step 3 — Optional</div>
                  <div style={{fontWeight:600,fontSize:15,color:'var(--navy)'}}>Clinical Values</div>
                </div>
              </div>
              <p style={{fontSize:12,color:'var(--muted)',marginBottom:16,lineHeight:1.6,fontWeight:300}}>
                Adding hormone values (LH, FSH, AMH) enables clinical refinement of your risk score for greater accuracy.
              </p>
              <div className="g2" style={{gap:14}}>
                {[{key:'lh',label:'LH (mIU/mL)',ph:'e.g. 8.5'},{key:'fsh',label:'FSH (mIU/mL)',ph:'e.g. 5.0'},
                  {key:'amh',label:'AMH (ng/mL)',ph:'e.g. 4.2'},{key:'fasting_sugar',label:'Fasting Sugar (mg/dL)',ph:'e.g. 95'}
                ].map(({key,label,ph})=>(
                  <div className="fg" key={key}>
                    <label className="fl">{label}</label>
                    <input className="fi" type="number" step="0.1" value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'var(--gold)'}}>🌿</div>
              <div>
                <div className="overline" style={{marginBottom:1}}>Step 2</div>
                <div style={{fontWeight:600,fontSize:15,color:'var(--navy)'}}>Symptoms & Lifestyle</div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {BINARY.map(({key,label,sub})=>(
                <div key={key} style={{
                  display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'13px 16px',borderRadius:12,transition:'all .15s',
                  background:form[key]===1?'var(--gold-pale)':'var(--cream)',
                  border:`1.5px solid ${form[key]===1?'var(--gold)':'var(--border)'}`,
                }}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--navy)'}}>{label}</div>
                    <div style={{fontSize:11,color:'var(--muted)',fontWeight:300}}>{sub}</div>
                  </div>
                  <Toggle value={form[key]} onChange={v=>set(key,v)}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,padding:'13px 15px',background:'var(--navy-pale)',borderRadius:12,fontSize:12,color:'var(--navy)',lineHeight:1.6,border:'1px solid var(--cream-deeper)'}}>
              ℹ️ <strong>Note:</strong> This tool provides a risk estimate based on statistical patterns, not a medical diagnosis. Please consult a qualified gynaecologist for professional evaluation.
            </div>
          </div>
        </div>

        {error&&<div style={{padding:'13px 16px',background:'var(--rose-light)',border:'1px solid #F4A0B5',borderRadius:12,fontSize:13,color:'var(--rose)',marginBottom:16}}>⚠️ {error}</div>}

        <button className="btn btn-gold" type="submit" disabled={loading}
          style={{width:'100%',padding:16,fontSize:16,justifyContent:'center',borderRadius:14}}>
          {loading?'Analysing your health data…':'Run AI Risk Assessment →'}
        </button>
      </form>
    </div>
  );
}