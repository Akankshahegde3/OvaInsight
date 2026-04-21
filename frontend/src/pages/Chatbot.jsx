// CHATBOT
import React, { useState, useRef, useEffect } from 'react';

const LANG_VOICES = {
  'English':  { lang:'en-IN' },
  'हिंदी':    { lang:'hi-IN' },
  'ಕನ್ನಡ':    { lang:'kn-IN' },
  'తెలుగు':   { lang:'te-IN' },
  'മലയാളം':  { lang:'ml-IN' },
  'தமிழ்':    { lang:'ta-IN' },
};

const REPLIES = {
  'pcos':'PCOS (Polycystic Ovary Syndrome) is one of the most common hormonal disorders in women of reproductive age, affecting approximately 1 in 10 women worldwide. It involves a combination of irregular or absent menstrual periods, elevated androgen (male hormone) levels causing symptoms like acne and excess hair growth, and small fluid-filled sacs (follicles) on the ovaries. The exact cause is not fully understood, but genetics, insulin resistance, and inflammation all play roles. The good news is that with the right lifestyle changes and medical support, most women with PCOS lead healthy, fulfilling lives.',
  'symptom':'Common PCOS symptoms include: irregular, infrequent, or absent periods; excess androgen hormones causing acne, excess facial or body hair (hirsutism), or scalp hair thinning; weight gain, especially around the abdomen; darkened skin patches around the neck or underarms; and mood changes including anxiety and depression. Not every woman experiences all symptoms — PCOS presents differently in each person.',
  'diet':'A low glycaemic index (GI) diet is most effective for managing PCOS. Focus on: whole grains like oats, brown rice, and millets; plenty of leafy vegetables; lean proteins such as lentils, eggs, tofu, and fish; healthy fats from nuts, seeds, and olive oil; and anti-inflammatory foods like turmeric and berries. Reduce refined sugar, white flour (maida), processed foods, and sugary drinks. Soaking fenugreek (methi) seeds overnight and drinking the water is a traditional remedy that may help improve insulin sensitivity.',
  'exercise':'Exercise is one of the most powerful tools for PCOS management. Aim for 150 minutes of moderate activity per week. The most effective combination includes 30 minutes of brisk walking or cycling daily, strength training 2-3 times per week to improve insulin sensitivity, and yoga poses like Butterfly Pose, Bridge Pose, and Cobra Pose for hormonal balance. Even a 5% reduction in body weight can restore menstrual regularity and significantly reduce symptoms.',
  'period':'Irregular periods are one of the most recognisable signs of PCOS. They occur because elevated androgen levels and insulin resistance disrupt the hormonal cycle needed for ovulation. A cycle longer than 35 days, fewer than 8 periods per year, or absent periods may indicate anovulation. Tracking your cycle using the OvaInsight Period Tracker helps identify patterns over time.',
  'fertil':'PCOS is a leading cause of infertility, but it is one of the most treatable. Many women with PCOS conceive naturally, especially after lifestyle improvements. Medical options include ovulation induction with medications, metformin therapy, and in complex cases, IVF. Maintaining a healthy weight and following a low-GI diet significantly improve ovulation rates.',
  'insulin':'Insulin resistance affects 50 to 70 percent of women with PCOS. When cells do not respond well to insulin, the pancreas produces more insulin, which then stimulates the ovaries to produce more androgens. This worsens symptoms like acne, hair growth, and irregular periods. Diet and exercise are the first-line treatments, along with medications like metformin if prescribed.',
  'stress':'Chronic stress raises cortisol levels, which worsens hormonal imbalance in PCOS. Practices that help include 10 minutes of mindfulness or meditation daily, adequate sleep of 7 to 8 hours, reducing caffeine, spending time in nature, and social support. Mental health is an important and often overlooked aspect of PCOS management.',
  'scheme':'Key government schemes available include: Ayushman Bharat PM-JAY for health insurance up to 5 lakh rupees, Free Diagnostic Services Initiative for free hormone tests at government hospitals, Pradhan Mantri Matru Vandana Yojana for maternal support, and state-specific schemes like Arogya Karnataka. Visit the Health Schemes section in OvaInsight for full details.',
  'yoga':'The most beneficial yoga poses for PCOS include Butterfly Pose for ovarian stimulation, Cobra Pose for stress reduction, Bridge Pose for thyroid support, Seated Forward Bend for insulin regulation, and Legs-up-the-Wall for hormonal balance. Visit the Yoga and Exercises section for step-by-step instructions.',
  'amh':'AMH (Anti-Mullerian Hormone) is produced by ovarian follicles and reflects ovarian reserve. In PCOS, AMH levels are often elevated, typically above 3.5 ng/mL, reflecting the high number of follicles. It is used alongside LH/FSH ratio for diagnosis and monitoring treatment response.',
  'lh':'The LH to FSH ratio is a key diagnostic marker for PCOS. A ratio above 2 suggests hormonal imbalance affecting ovulation. OvaInsight uses this value in its clinical refinement layer to adjust your risk score for greater accuracy.',
};

function findReply(msg) {
  const l = msg.toLowerCase();
  for (const [k, v] of Object.entries(REPLIES)) {
    if (l.includes(k)) return v;
  }
  return 'Thank you for your question. For the most accurate and personalised guidance about PCOS, I recommend completing your OvaInsight risk assessment and consulting a qualified gynaecologist or endocrinologist. Is there a specific aspect of PCOS you would like me to explain further?';
}

function buildSummary(result, lang) {
  const prob = result ? Math.round(result.final_refined_risk_probability ?? result.lifestyle_risk_probability ?? 0) : 0;
  const cat  = result ? (result.final_risk_category ?? 'Low') : 'Low';
  const summaries = {
    'English': `Hello. Here is your OvaInsight personalised health summary. Your PCOS risk score is ${prob} percent, classified as ${cat} risk. ${cat==='High'?'Multiple PCOS risk factors have been identified. Please schedule a consultation with a gynaecologist as soon as possible.':cat==='Moderate'?'Some PCOS risk factors have been detected. Lifestyle improvements and regular monitoring are recommended.':'Your risk indicators are positive. Continue maintaining your healthy habits.'} Remember, this is a screening tool. Always consult a qualified doctor for personalised medical advice. Thank you for using OvaInsight.`,
    'हिंदी': `नमस्ते। आपका PCOS जोखिम स्कोर ${prob} प्रतिशत है, जो ${cat} जोखिम श्रेणी में है। कृपया एक स्त्री रोग विशेषज्ञ से परामर्श लें।`,
    'ಕನ್ನಡ': `ನಮಸ್ಕಾರ. ನಿಮ್ಮ PCOS ಅಪಾಯದ ಸ್ಕೋರ್ ${prob} ಶೇಕಡಾ, ${cat} ಅಪಾಯ ವರ್ಗದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
    'తెలుగు': `నమస్కారం. మీ PCOS రిస్క్ స్కోర్ ${prob} శాతం, ${cat} రిస్క్ వర్గంలో ఉంది. దయచేసి వైద్యుడిని సంప్రదించండి.`,
    'മലയാളം': `നമസ്കാരം. നിങ്ങളുടെ PCOS റിസ്ക് സ്കോർ ${prob} ശതമാനം, ${cat} റിസ്ക് വിഭാഗത്തിലാണ്. ദയവായി ഒരു ഡോക്ടറെ കാണുക.`,
    'தமிழ்': `வணக்கம். உங்கள் PCOS ஆபத்து மதிப்பெண் ${prob} சதவீதம், ${cat} ஆபத்து பிரிவில் உள்ளது. தயவுசெய்து மருத்துவரை அணுகவும்.`,
  };
  return summaries[lang] || summaries['English'];
}

const QUICK = [
  'What is PCOS?','Symptoms','Diet advice','Exercise tips',
  'Irregular periods','Insulin resistance','Can I get pregnant?',
  'Stress and PCOS','Government schemes','Best yoga poses',
  'What is AMH?','LH/FSH ratio',
];

export function Chatbot({ result }) {
  const [messages,  setMessages]  = useState([{who:'bot', text:'Hello! I am OvaBot, your personalised PCOS health assistant. I can answer questions about PCOS symptoms, diet, exercise, hormones, fertility, and government health support. What would you like to know today?'}]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [speaker,   setSpeaker]   = useState(false);
  const [listening, setListening] = useState(false);
  const [playing,   setPlaying]   = useState(false);
  const [selLang,   setSelLang]   = useState('English');
  const bottomRef = useRef(null);
  const recogRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(text);
    const vcfg = LANG_VOICES[lang] || LANG_VOICES['English'];
    utt.lang  = vcfg.lang;
    utt.rate  = 0.88;
    utt.pitch = 1.05;
    utt.onstart = () => setPlaying(true);
    utt.onend   = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const pref = voices.find(v => v.lang === vcfg.lang)
                  || voices.find(v => v.lang.startsWith(vcfg.lang.split('-')[0]))
                  || voices[0];
        if (pref) utt.voice = pref;
      }
      window.speechSynthesis.speak(utt);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = doSpeak;
      doSpeak();
    }
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setPlaying(false); };

  const addMsg = (who, text) => setMessages(m => [...m, { who, text }]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    addMsg('user', msg);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const reply = findReply(msg);
    addMsg('bot', reply);
    if (speaker) speak(reply, selLang);
    setLoading(false);
  };

  const toggleListen = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome browser.'); return; }
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    const vcfg = LANG_VOICES[selLang] || LANG_VOICES['English'];
    r.lang = vcfg.lang;
    r.continuous = false;
    r.interimResults = false;
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  };

  const playAudio = () => {
    const text = buildSummary(result, selLang);
    addMsg('bot', 'Playing your personalised health summary in ' + selLang + '...');
    speak(text, selLang);
  };

  return (
    <div className="page">
      <div style={{marginBottom:24}}>
        <div className="overline" style={{marginBottom:8}}>AI-Powered</div>
        <h1 style={{fontSize:36, marginBottom:6}}>Health Assistant</h1>
        <p style={{color:'var(--muted)', fontSize:14, fontWeight:300}}>Ask any question about PCOS in your preferred language</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 250px', gap:20, alignItems:'start'}}>

        {/* Chat window */}
        <div>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, display:'flex', flexDirection:'column', height:560, boxShadow:'var(--shadow)'}}>

            {/* Header */}
            <div style={{background:'var(--navy)', padding:'15px 20px', borderRadius:'20px 20px 0 0', display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:40, height:40, borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'var(--navy)', fontWeight:700}}>O</div>
              <div>
                <div style={{color:'var(--cream)', fontWeight:700, fontSize:15, fontFamily:"'Cormorant Garamond',serif"}}>OvaBot</div>
                <div style={{color:'rgba(245,240,232,.6)', fontSize:11, letterSpacing:'.3px'}}>
                  {loading ? 'Thinking...' : playing ? 'Speaking...' : listening ? 'Listening...' : 'Health Assistant · Ready'}
                </div>
              </div>
              <div style={{marginLeft:'auto', display:'flex', gap:8}}>
                <button onClick={toggleListen} style={{width:36, height:36, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:15, background:listening?'var(--gold)':'rgba(255,255,255,.1)', color:listening?'var(--navy)':'var(--cream)', transition:'all .15s'}}>🎤</button>
                <button onClick={() => setSpeaker(s => !s)} style={{width:36, height:36, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:15, background:speaker?'var(--gold)':'rgba(255,255,255,.1)', color:speaker?'var(--navy)':'var(--cream)', transition:'all .15s'}}>🔊</button>
                {playing && (
                  <button onClick={stopSpeaking} style={{width:36, height:36, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:15, background:'rgba(255,255,255,.2)', color:'var(--cream)'}}>⏹</button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{flex:1, overflowY:'auto', padding:'18px', display:'flex', flexDirection:'column', gap:12}}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.who==='user' ? 'flex-end' : 'flex-start',
                  maxWidth:'80%', padding:'12px 16px', fontSize:13, lineHeight:1.7,
                  borderRadius: m.who==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.who==='user' ? 'var(--navy)' : 'var(--cream)',
                  color: m.who==='user' ? 'var(--cream)' : 'var(--text)',
                  boxShadow:'0 2px 8px rgba(0,0,0,.06)', fontWeight:300,
                }}>{m.text}</div>
              ))}
              {loading && (
                <div style={{alignSelf:'flex-start', padding:'12px 16px', borderRadius:'16px 16px 16px 4px', background:'var(--cream)', fontSize:13, color:'var(--muted)', display:'flex', gap:5, alignItems:'center'}}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{width:7, height:7, borderRadius:'50%', background:'var(--gold)', display:'inline-block', animation:'bounce .8s infinite', animationDelay:`${i*.15}s`}}/>
                  ))}
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{padding:'14px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:8}}>
              <input
                style={{flex:1, padding:'11px 16px', border:'1.5px solid var(--border)', borderRadius:25, fontSize:13, fontFamily:'inherit', outline:'none', transition:'border-color .15s', background:'var(--cream)'}}
                placeholder={listening ? 'Listening...' : 'Ask anything about PCOS...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
                onFocus={e => e.target.style.borderColor='var(--gold)'}
                onBlur={e  => e.target.style.borderColor='var(--border)'}
                disabled={loading}
              />
              <button onClick={() => send()} disabled={loading || !input.trim()} className="btn btn-gold" style={{borderRadius:25, padding:'10px 22px'}}>Send</button>
            </div>
          </div>

          {/* Quick questions */}
          <div style={{marginTop:12}}>
            <div style={{fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8}}>Suggested Questions</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:7}}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)} className="pill" style={{fontSize:12}}>{q}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{display:'flex', flexDirection:'column', gap:14}}>

          {/* Language selector */}
          <div className="card-navy" style={{borderRadius:16, padding:'20px'}}>
            <div style={{fontWeight:700, fontSize:13, marginBottom:12, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.6px'}}>Language</div>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {Object.keys(LANG_VOICES).map(lang => (
                <button key={lang} onClick={() => setSelLang(lang)} style={{
                  padding:'9px 14px', borderRadius:9, fontFamily:'inherit', cursor:'pointer', transition:'all .15s',
                  border: `1.5px solid ${selLang===lang ? 'var(--gold)' : 'rgba(255,255,255,.1)'}`,
                  background: selLang===lang ? 'var(--gold)' : 'rgba(255,255,255,.05)',
                  color: selLang===lang ? 'var(--navy)' : 'rgba(245,240,232,.7)',
                  fontSize:13, fontWeight: selLang===lang ? 700 : 400,
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                }}>
                  <span>{lang}</span>
                  {selLang===lang && <span style={{fontSize:10}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Audio summary */}
          <div className="card" style={{padding:'20px'}}>
            <div style={{fontWeight:700, fontSize:13, marginBottom:8, color:'var(--navy)', textTransform:'uppercase', letterSpacing:'.6px'}}>Audio Summary</div>
            <p style={{fontSize:12, color:'var(--muted)', lineHeight:1.5, marginBottom:14, fontWeight:300}}>
              Hear your personalised health summary read aloud in your chosen language.
            </p>
            <button
              onClick={playAudio}
              disabled={playing}
              className="btn btn-gold"
              style={{width:'100%', justifyContent:'center', opacity:playing ? .7 : 1}}
            >
              {playing ? 'Speaking...' : 'Play in ' + selLang}
            </button>
            {!result && (
              <p style={{fontSize:11, color:'var(--muted)', marginTop:8, textAlign:'center'}}>
                Complete an assessment for personalised summary
              </p>
            )}
            {playing && (
              <button onClick={stopSpeaking} className="btn btn-outline" style={{width:'100%', justifyContent:'center', marginTop:8, fontSize:12}}>
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

export default Chatbot;