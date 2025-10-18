'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [symptoms, setSymptoms] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  // Load history and hospital data
  useEffect(() => {
    const hist = JSON.parse(localStorage.getItem('healthHistory')) || [];
    setHistory(hist);

    fetch('/hospital-data.json')
      .then(r => r.json())
      .then(data => setHospitals(data))
      .catch(err => console.error("Error loading hospital data:", err));
  }, []);

  async function getHealthAdvice() {
    if (!symptoms.trim()) { alert("Please enter your symptoms!"); return; }
    setOutput("⏳ Checking symptoms...");

    try {
      const response = await fetch('/api/getAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      const data = await response.json();

      if (data.advice) {
        const nearbyHospital = hospitals[0]; // pick first hospital
        const adviceWithHospital = `${data.advice}\n• Nearby Hospital: ${nearbyHospital.name}, ${nearbyHospital.address}, 📞 ${nearbyHospital.phone}`;
        
        setOutput(adviceWithHospital);

        const newHistory = [{ symptoms, advice: adviceWithHospital }, ...history];
        setHistory(newHistory);
        localStorage.setItem('healthHistory', JSON.stringify(newHistory));
      } else {
        setOutput("⚠️ No advice received.");
      }

    } catch (err) {
      console.error(err);
      setOutput("⚠️ Error fetching advice. Check API key or connection.");
    }
  }

  const healthTips = [
    "💧 Drink 8-10 glasses of water daily",
    "🥗 Eat fresh fruits and vegetables",
    "🏃‍♂️ Exercise at least 30 minutes daily",
    "😴 Sleep 7-8 hours every night",
    "🧼 Wash hands frequently to prevent infections"
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor:'#f5f7fa', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#009688', color: 'white', padding: '25px 10px', textAlign: 'center', borderRadius:'0 0 20px 20px', boxShadow:'0 4px 10px rgba(0,0,0,0.2)', transition:'all 0.3s' }}>
        <h1 style={{ margin:0, fontSize:'2rem', transition:'all 0.3s' }}>💚 HealthyIndia</h1>
        <p style={{ margin:5, fontSize:'1.1rem', transition:'all 0.3s' }}>AI-powered Health Awareness Portal 🇮🇳</p>
      </header>

      {/* Main Content */}
      <main style={{ flex:1, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>

        {/* Symptoms Input */}
        <section style={{ margin:'20px 0', width:'100%', maxWidth:'500px', textAlign:'center' }}>
          <h2 style={{ color:'#009688' }}>Enter your symptoms</h2>
          <input
            type="text"
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="e.g. fever, cough, headache"
            style={{ padding:'12px', borderRadius:'10px', width:'80%', maxWidth:'400px', border:'1px solid #ccc', fontSize:'1rem', transition:'all 0.2s' }}
          />
          <br/>
          <button
            onClick={getHealthAdvice}
            style={{ 
              marginTop:'15px', padding:'12px 30px', borderRadius:'12px', backgroundColor:'#ff5722', 
              color:'white', border:'none', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', 
              boxShadow:'0 3px 6px rgba(0,0,0,0.2)', transition:'all 0.3s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            ✅ Check My Health
          </button>
        </section>

        {/* AI Result */}
        <section style={{ backgroundColor:'white', padding:'20px', margin:'15px 0', borderRadius:'15px', width:'90%', maxWidth:'500px', boxShadow:'0 3px 12px rgba(0,0,0,0.15)', transition:'all 0.3s' }}>
          <h3 style={{ color:'#009688' }}>🩺 Result:</h3>
          <ul>
            {output
              ? output.split('\n').filter(a => a.trim() !== '').map((a,i) => <li key={i} style={{ margin:'5px 0' }}>{a.replace(/^-/, '•')}</li>)
              : <li>No advice yet</li>
            }
          </ul>
        </section>

        {/* Recent Queries */}
        <section style={{ backgroundColor:'#fffde7', padding:'20px', margin:'15px 0', borderRadius:'15px', width:'90%', maxWidth:'500px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', transition:'all 0.3s' }}>
          <h2 style={{ color:'#f57c00' }}>📜 Recent Queries</h2>
          <ul>
            {history.slice(0, 3).map((item,index)=>(
              <li key={index} style={{ margin:'10px 0' }}>
                <strong>Symptoms:</strong> {item.symptoms}
                <ul>
                  {item.advice
                    ? item.advice.split('\n').filter(a => a.trim() !== '').map((a,i)=> <li key={i}>{a.replace(/^-/, '•')}</li>)
                    : <li>No advice available</li>
                  }
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Health Tips */}
        <section style={{ backgroundColor:'#e0f7fa', padding:'20px', margin:'15px 0', borderRadius:'15px', width:'90%', maxWidth:'500px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', transition:'all 0.3s' }}>
          <h2 style={{ color:'#00796b' }}>💡 5 Simple Health Tips</h2>
          <ul>
            {healthTips.map((tip,i) => <li key={i} style={{ margin:'5px 0' }}>{tip}</li>)}
          </ul>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor:'#009688', color:'white', textAlign:'center', padding:'20px 10px', borderRadius:'20px 20px 0 0', boxShadow:'0 -2px 8px rgba(0,0,0,0.2)', transition:'all 0.3s' }}>
        <p style={{ margin:'5px 0', fontWeight:'bold' }}>© 2025 HealthyIndia | Created by Himanshu Aggarwal 🇮🇳</p>
        <p style={{ margin:'5px 0', fontSize:'0.9rem' }}>For Health Awareness & Education</p>
      </footer>

    </div>
  );
}
