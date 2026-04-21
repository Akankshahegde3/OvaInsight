import React, { useState } from 'react';

const POSES = [
  {
    name:'Butterfly Pose', sanskrit:'Baddha Konasana', dur:'2–3 min', tag:'Hormonal',
    tc:'#880E4F', tb:'#F9D0DC',
    img:'https://fitfabguide.com/wp-content/uploads/2024/06/dz_personal-34_11zon.jpg',
    benefit:'Stimulates the ovaries and reproductive organs, improves pelvic blood circulation, and reduces menstrual discomfort and cramps.',
    steps:['Sit upright on a mat with your spine straight','Bend your knees and bring the soles of your feet together','Hold your feet gently with both hands','Gently flap your knees up and down like butterfly wings','For the last minute, hold still and breathe deeply into your lower belly'],
    tip:'Place a folded blanket under your hips if your knees do not comfortably reach the floor.'
  },
  {
    name:'Cobra Pose', sanskrit:'Bhujangasana', dur:'30–60 sec', tag:'Strength',
    tc:'#00504A', tb:'#C8EDEA',
    img:'https://tse3.mm.bing.net/th/id/OIP.GChW5SWT0K60OpCZBPmv-wHaFE?rs=1&pid=ImgDetMain&o=7&rm=3',
    benefit:'Strengthens the lower back, stimulates abdominal and ovarian organs, and reduces stress cortisol levels.',
    steps:['Lie face down with legs extended behind you','Place palms flat on the floor directly under your shoulders','Inhale and slowly press your hands down and lift your chest','Keep elbows slightly bent and shoulders relaxed','Hold 30–60 seconds, then lower down on an exhale'],
    tip:'Keep the lift gentle — focus on opening the chest rather than arching the lower back.'
  },
  {
    name:'Bridge Pose', sanskrit:'Setu Bandhasana', dur:'30–60 sec', tag:'Metabolic',
    tc:'#7A4A00', tb:'#FFF0CC',
    img:'https://www.fitsri.com/wp-content/uploads/2020/03/bridge-pose.jpg',
    benefit:'Improves thyroid function, stimulates abdominal organs, and helps regulate the menstrual cycle and metabolism.',
    steps:['Lie on your back with knees bent, feet flat, hip-width apart','Rest arms at your sides with palms facing down','Inhale and lift your hips toward the ceiling','Optionally clasp hands beneath your pelvis','Hold and breathe for 30–60 seconds, then lower slowly'],
    tip:'Place a yoga block under your sacrum for a gentle restorative variation.'
  },
  {
    name:'Seated Forward Bend', sanskrit:'Paschimottanasana', dur:'1–2 min', tag:'Insulin',
    tc:'#3D1A6E', tb:'#EDE7F6',
    img:'https://www.harithayogshala.com/upload/blog/steps-benefits-paschimottanasana-seated-forward-bend-pose_1580800401.jpg',
    benefit:'Reduces insulin resistance, calms the nervous system, and stimulates the reproductive and digestive organs.',
    steps:['Sit with both legs extended straight in front','Inhale and lengthen your spine upward','On your exhale, hinge forward from the hips toward your feet','Hold ankles, feet, or use a yoga strap','Breathe deeply and hold for 1–2 minutes'],
    tip:'A long spine with a slight fold is more beneficial than a deep fold with a rounded back.'
  },
  {
    name:'Cat-Cow Stretch', sanskrit:'Marjaryasana-Bitilasana', dur:'2 min', tag:'Flexibility',
    tc:'#00504A', tb:'#C8EDEA',
    img:'https://www.healthspectra.com/wp-content/uploads/2017/04/Cat_Cow-Posture.jpg',
    benefit:'Massages the reproductive organs, improves spinal flexibility and circulation, and reduces bloating and cramps.',
    steps:['Begin on hands and knees in tabletop position','Inhale: drop belly, lift head and tailbone (Cow pose)','Exhale: round spine, tuck chin and tailbone (Cat pose)','Flow gently between the two for 2 minutes','Move in sync with your breath'],
    tip:'Moving slowly and synchronising breath with movement is what makes this pose effective.'
  },
  {
    name:'Legs-up-the-Wall', sanskrit:'Viparita Karani', dur:'5–10 min', tag:'Relaxation',
    tc:'#1A2E4A', tb:'#D8E4F0',
    img:'https://www.fitsri.com/wp-content/uploads/2020/10/legs-up-the-wall-viparita-karani-variation-1024x683.jpg',
    benefit:'Restores hormonal balance, reduces stress cortisol, improves lymphatic flow, and deeply calms the nervous system.',
    steps:['Sit sideways with one hip close to a wall','Swing your legs up the wall as you lie back','Adjust distance so legs are comfortably extended','Rest arms at your sides with palms facing upward','Close your eyes and breathe slowly for 5–10 minutes'],
    tip:'Place a folded blanket under your hips for extra support. Excellent before sleep.'
  },
];

export default function Exercises() {
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="page">
      <div style={{marginBottom:26}}>
        <div className="overline" style={{marginBottom:8}}>Therapeutic Movement</div>
        <h1 style={{fontSize:36, marginBottom:6}}>Yoga & Exercises for PCOS</h1>
        <p style={{color:'#4A3560', fontSize:15, fontWeight:400}}>
          Evidence-based yoga poses that support hormonal balance, metabolic health, and symptom relief
        </p>
      </div>

      <div style={{background:'var(--navy)', borderRadius:16, padding:'18px 24px',
        marginBottom:28, display:'flex', gap:14, alignItems:'flex-start',
        boxShadow:'0 6px 24px rgba(30,45,74,.2)'}}>
        <span style={{fontSize:22, lineHeight:1.5, flexShrink:0}}>🧘</span>
        <div>
          <div style={{fontSize:14, color:'rgba(245,240,232,.95)', lineHeight:1.7, fontWeight:400}}>
            <strong style={{color:'var(--gold)', fontWeight:700}}>Daily practice guide:</strong>{' '}
            Aim for 20–30 minutes every morning. Combine with 30 minutes of brisk walking for best metabolic results.
            Tap any card to expand and see full step-by-step instructions.
          </div>
          <div style={{fontSize:12, color:'rgba(245,240,232,.5)', marginTop:5}}>
            Always consult your doctor before starting a new exercise routine if you have any existing health conditions.
          </div>
        </div>
      </div>

      <div className="g3">
        {POSES.map((pose, i) => {
          const isOpen    = open === i;
          const isHovered = hovered === i;
          return (
            <div key={i}
              onClick={() => setOpen(isOpen ? null : i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background:'var(--card)',
                cursor:'pointer',
                border:`2px solid ${isOpen ? 'var(--gold)' : isHovered ? '#C9B060' : 'var(--border)'}`,
                borderRadius:20,
                overflow:'hidden',
                boxShadow: isOpen
                  ? '0 16px 48px rgba(30,45,74,.22)'
                  : isHovered
                    ? '0 12px 36px rgba(30,45,74,.18)'
                    : '0 4px 16px rgba(30,45,74,.09)',
                transform: isOpen
                  ? 'scale(1.02)'
                  : isHovered
                    ? 'scale(1.025) translateY(-4px)'
                    : 'scale(1) translateY(0)',
                transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
              }}>

              {/* Image */}
              <div style={{height:190, overflow:'hidden', background:'var(--cream-dark)', position:'relative'}}>
                <img
                  src={pose.img}
                  alt={pose.name}
                  style={{
                    width:'100%', height:'100%', objectFit:'cover', objectPosition:'center',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    transition:'transform .4s ease',
                  }}
                />
                {/* Gradient overlay */}
                <div style={{position:'absolute', inset:0,
                  background:'linear-gradient(to bottom, rgba(0,0,0,.0) 50%, rgba(0,0,0,.35) 100%)'}}/>
                <div style={{position:'absolute', top:12, left:12}}>
                  <span style={{padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'.5px',
                    background:'rgba(245,240,232,.94)', color:pose.tc,
                    boxShadow:'0 2px 8px rgba(0,0,0,.15)'}}>{pose.tag}</span>
                </div>
                <div style={{position:'absolute', top:12, right:12,
                  background:'rgba(30,45,74,.82)', padding:'4px 12px',
                  borderRadius:20, fontSize:12, fontWeight:700, color:'var(--gold)'}}>
                  ⏱ {pose.dur}
                </div>
              </div>

              {/* Content */}
              <div style={{padding:'18px 20px'}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700,
                  marginBottom:3, color:'#1A0A35'}}>{pose.name}</div>
                <div style={{fontSize:12, color:'#7A5080', fontStyle:'italic', marginBottom:10}}>{pose.sanskrit}</div>
                <div style={{fontSize:13, color:'#4A3560', lineHeight:1.65, marginBottom:12, fontWeight:400}}>
                  {pose.benefit}
                </div>

                {isOpen && (
                  <div onClick={e=>e.stopPropagation()}>
                    <div style={{height:1, background:'var(--border)', margin:'14px 0'}}/>
                    <div style={{fontSize:12, fontWeight:700, marginBottom:12, color:'#1A0A35',
                      textTransform:'uppercase', letterSpacing:'.6px'}}>Step-by-step Instructions</div>
                    <div style={{display:'flex', flexDirection:'column', gap:9, marginBottom:14}}>
                      {pose.steps.map((step, j) => (
                        <div key={j} style={{display:'flex', gap:11, alignItems:'flex-start'}}>
                          <div style={{width:24, height:24, borderRadius:'50%', flexShrink:0,
                            background:'var(--gold)', color:'var(--navy)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:12, fontWeight:800}}>{j+1}</div>
                          <span style={{fontSize:13, lineHeight:1.6, color:'#3A2550', paddingTop:3, fontWeight:400}}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{padding:'12px 15px', background:'var(--gold-pale)', borderRadius:12,
                      fontSize:13, color:'#5A3800', lineHeight:1.6,
                      border:'1.5px solid var(--gold-light)', fontWeight:400}}>
                      💡 <strong>Pro Tip:</strong> {pose.tip}
                    </div>
                    <button onClick={()=>setOpen(null)} style={{
                      marginTop:12, width:'100%', padding:'10px', borderRadius:11,
                      border:'1.5px solid var(--border)', background:'transparent',
                      fontSize:13, color:'#5C3D52', cursor:'pointer', fontFamily:'inherit', fontWeight:500,
                    }}>Close ↑</button>
                  </div>
                )}

                {!isOpen && (
                  <div style={{fontSize:13, color:'var(--gold)', fontWeight:700,
                    display:'flex', alignItems:'center', gap:5}}>
                    View step-by-step instructions <span style={{transition:'transform .2s', transform:isHovered?'translateX(4px)':'translateX(0)'}}>→</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}