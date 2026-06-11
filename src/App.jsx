import { useState, useEffect } from 'react'
import { loadAll, savePrediction, saveResult, addPlayer, seedDefaultPlayers } from './supabase.js'

// ── Data ──────────────────────────────────────────────────────────────────────
const FIXTURES = [
  { id:"m1",  num:1,  group:"A", home:"Mexico",        away:"South Africa",  date:"2026-06-11", time:"15:00" },
  { id:"m2",  num:2,  group:"A", home:"Korea Republic",away:"Czechia",       date:"2026-06-11", time:"22:00" },
  { id:"m3",  num:3,  group:"B", home:"Canada",        away:"Bosnia & Herz.",date:"2026-06-12", time:"15:00" },
  { id:"m4",  num:4,  group:"D", home:"USA",           away:"Paraguay",      date:"2026-06-12", time:"21:00" },
  { id:"m5",  num:5,  group:"C", home:"Haiti",         away:"Scotland",      date:"2026-06-12", time:"21:00" },
  { id:"m6",  num:6,  group:"D", home:"Australia",     away:"Türkiye",       date:"2026-06-13", time:"00:00" },
  { id:"m7",  num:7,  group:"C", home:"Brazil",        away:"Morocco",       date:"2026-06-13", time:"18:00" },
  { id:"m8",  num:8,  group:"B", home:"Qatar",         away:"Switzerland",   date:"2026-06-13", time:"15:00" },
  { id:"m9",  num:9,  group:"E", home:"Côte d'Ivoire", away:"Ecuador",       date:"2026-06-13", time:"19:00" },
  { id:"m10", num:10, group:"E", home:"Germany",       away:"Curaçao",       date:"2026-06-14", time:"13:00" },
  { id:"m11", num:11, group:"F", home:"Netherlands",   away:"Japan",         date:"2026-06-14", time:"16:00" },
  { id:"m12", num:12, group:"F", home:"Sweden",        away:"Tunisia",       date:"2026-06-14", time:"22:00" },
  { id:"m13", num:13, group:"H", home:"Saudi Arabia",  away:"Uruguay",       date:"2026-06-14", time:"18:00" },
  { id:"m14", num:14, group:"H", home:"Spain",         away:"Cabo Verde",    date:"2026-06-14", time:"12:00" },
  { id:"m15", num:15, group:"G", home:"IR Iran",       away:"New Zealand",   date:"2026-06-14", time:"21:00" },
  { id:"m16", num:16, group:"G", home:"Belgium",       away:"Egypt",         date:"2026-06-15", time:"15:00" },
  { id:"m17", num:17, group:"I", home:"France",        away:"Senegal",       date:"2026-06-15", time:"15:00" },
  { id:"m18", num:18, group:"I", home:"Iraq",          away:"Norway",        date:"2026-06-15", time:"18:00" },
  { id:"m19", num:19, group:"J", home:"Argentina",     away:"Algeria",       date:"2026-06-15", time:"21:00" },
  { id:"m20", num:20, group:"J", home:"Austria",       away:"Jordan",        date:"2026-06-16", time:"00:00" },
  { id:"m21", num:21, group:"L", home:"England",       away:"Croatia",       date:"2026-06-16", time:"19:00" },
  { id:"m22", num:22, group:"K", home:"Uzbekistan",    away:"Colombia",      date:"2026-06-16", time:"16:00" },
  { id:"m23", num:23, group:"K", home:"Portugal",      away:"Congo DR",      date:"2026-06-16", time:"13:00" },
  { id:"m24", num:24, group:"B", home:"Canada",        away:"Qatar",         date:"2026-06-16", time:"22:00" },
  { id:"m25", num:25, group:"A", home:"Czechia",       away:"South Africa",  date:"2026-06-16", time:"12:00" },
  { id:"m26", num:26, group:"B", home:"Switzerland",   away:"Bosnia & Herz.",date:"2026-06-16", time:"15:00" },
  { id:"m27", num:27, group:"A", home:"Mexico",        away:"Korea Republic",date:"2026-06-17", time:"18:00" },
  { id:"m28", num:28, group:"C", home:"Brazil",        away:"Haiti",         date:"2026-06-17", time:"21:00" },
  { id:"m29", num:29, group:"C", home:"Scotland",      away:"Morocco",       date:"2026-06-17", time:"20:30" },
  { id:"m30", num:30, group:"D", home:"USA",           away:"Australia",     date:"2026-06-17", time:"18:00" },
  { id:"m31", num:31, group:"D", home:"Türkiye",       away:"Paraguay",      date:"2026-06-18", time:"23:00" },
  { id:"m32", num:32, group:"F", home:"Sweden",        away:"Tunisia",       date:"2026-06-18", time:"15:00" },
  { id:"m33", num:33, group:"E", home:"Germany",       away:"Côte d'Ivoire", date:"2026-06-18", time:"16:00" },
  { id:"m34", num:34, group:"E", home:"Ecuador",       away:"Curaçao",       date:"2026-06-18", time:"20:00" },
  { id:"m35", num:35, group:"F", home:"Netherlands",   away:"Sweden",        date:"2026-06-18", time:"13:00" },
  { id:"m36", num:36, group:"F", home:"Tunisia",       away:"Japan",         date:"2026-06-19", time:"00:00" },
  { id:"m37", num:37, group:"H", home:"Uruguay",       away:"Cabo Verde",    date:"2026-06-19", time:"18:00" },
  { id:"m38", num:38, group:"H", home:"Spain",         away:"Saudi Arabia",  date:"2026-06-19", time:"12:00" },
  { id:"m39", num:39, group:"G", home:"Belgium",       away:"IR Iran",       date:"2026-06-19", time:"15:00" },
  { id:"m40", num:40, group:"J", home:"Jordan",        away:"Algeria",       date:"2026-06-19", time:"21:00" },
  { id:"m41", num:41, group:"I", home:"Norway",        away:"Senegal",       date:"2026-06-20", time:"20:00" },
  { id:"m42", num:42, group:"I", home:"France",        away:"Iraq",          date:"2026-06-20", time:"17:00" },
  { id:"m43", num:43, group:"J", home:"Argentina",     away:"Austria",       date:"2026-06-20", time:"13:00" },
  { id:"m44", num:44, group:"B", home:"Switzerland",   away:"Canada",        date:"2026-06-20", time:"23:00" },
  { id:"m45", num:45, group:"L", home:"England",       away:"Ghana",         date:"2026-06-21", time:"16:00" },
  { id:"m46", num:46, group:"L", home:"Panama",        away:"Croatia",       date:"2026-06-21", time:"19:00" },
  { id:"m47", num:47, group:"C", home:"Morocco",       away:"Haiti",         date:"2026-06-21", time:"13:00" },
  { id:"m48", num:48, group:"K", home:"Colombia",      away:"Congo DR",      date:"2026-06-21", time:"22:00" },
  { id:"m49", num:49, group:"C", home:"Scotland",      away:"Brazil",        date:"2026-06-22", time:"18:00" },
  { id:"m50", num:50, group:"C", home:"Morocco",       away:"Haiti",         date:"2026-06-22", time:"18:00" },
  { id:"m51", num:51, group:"A", home:"South Africa",  away:"Korea Republic",date:"2026-06-22", time:"15:00" },
  { id:"m52", num:52, group:"B", home:"Bosnia & Herz.",away:"Qatar",         date:"2026-06-22", time:"15:00" },
  { id:"m53", num:53, group:"A", home:"Czechia",       away:"Mexico",        date:"2026-06-22", time:"21:00" },
  { id:"m54", num:54, group:"K", home:"Portugal",      away:"Uzbekistan",    date:"2026-06-22", time:"21:00" },
  { id:"m55", num:55, group:"E", home:"Curaçao",       away:"Côte d'Ivoire", date:"2026-06-23", time:"16:00" },
  { id:"m56", num:56, group:"E", home:"Ecuador",       away:"Germany",       date:"2026-06-23", time:"16:00" },
  { id:"m57", num:57, group:"F", home:"Japan",         away:"Sweden",        date:"2026-06-23", time:"19:00" },
  { id:"m58", num:58, group:"F", home:"Tunisia",       away:"Netherlands",   date:"2026-06-23", time:"19:00" },
  { id:"m59", num:59, group:"D", home:"Türkiye",       away:"USA",           date:"2026-06-24", time:"22:00" },
  { id:"m60", num:60, group:"D", home:"Paraguay",      away:"Australia",     date:"2026-06-24", time:"22:00" },
  { id:"m61", num:61, group:"I", home:"Norway",        away:"France",        date:"2026-06-24", time:"15:00" },
  { id:"m62", num:62, group:"I", home:"Senegal",       away:"Iraq",          date:"2026-06-24", time:"15:00" },
  { id:"m63", num:63, group:"G", home:"Egypt",         away:"IR Iran",       date:"2026-06-24", time:"23:00" },
  { id:"m64", num:64, group:"G", home:"New Zealand",   away:"Belgium",       date:"2026-06-24", time:"23:00" },
  { id:"m65", num:65, group:"H", home:"Uruguay",       away:"Spain",         date:"2026-06-25", time:"20:00" },
  { id:"m66", num:66, group:"H", home:"Cabo Verde",    away:"Saudi Arabia",  date:"2026-06-25", time:"20:00" },
  { id:"m67", num:67, group:"L", home:"Croatia",       away:"Ghana",         date:"2026-06-25", time:"17:00" },
  { id:"m68", num:68, group:"L", home:"Panama",        away:"England",       date:"2026-06-25", time:"17:00" },
  { id:"m69", num:69, group:"J", home:"Jordan",        away:"Argentina",     date:"2026-06-26", time:"22:00" },
  { id:"m70", num:70, group:"J", home:"Algeria",       away:"Austria",       date:"2026-06-26", time:"22:00" },
  { id:"m71", num:71, group:"K", home:"Colombia",      away:"Portugal",      date:"2026-06-26", time:"19:30" },
  { id:"m72", num:72, group:"K", home:"Congo DR",      away:"Uzbekistan",    date:"2026-06-26", time:"19:30" },
]

const DEFAULT_PLAYERS = [
  { name:"Ziad",    pin:"3847" },
  { name:"Mostafa", pin:"6192" },
  { name:"Youssef", pin:"5031" },
  { name:"Ali",     pin:"7284" },
  { name:"Omar",    pin:"4916" },
  { name:"Yazan",   pin:"2753" },
]
const ADMIN_PASSWORD = "696969"
const GAMEDAYS = [...new Set(FIXTURES.map(f => f.date))].sort()

const FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","Korea Republic":"🇰🇷","Czechia":"🇨🇿",
  "Canada":"🇨🇦","Bosnia & Herz.":"🇧🇦","USA":"🇺🇸","Paraguay":"🇵🇾",
  "Haiti":"🇭🇹","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Australia":"🇦🇺","Türkiye":"🇹🇷",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Qatar":"🇶🇦","Switzerland":"🇨🇭",
  "Côte d'Ivoire":"🇨🇮","Ecuador":"🇪🇨","Germany":"🇩🇪","Curaçao":"🇨🇼",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Saudi Arabia":"🇸🇦","Uruguay":"🇺🇾","Spain":"🇪🇸","Cabo Verde":"🇨🇻",
  "IR Iran":"🇮🇷","New Zealand":"🇳🇿","Belgium":"🇧🇪","Egypt":"🇪🇬",
  "France":"🇫🇷","Senegal":"🇸🇳","Iraq":"🇮🇶","Norway":"🇳🇴",
  "Argentina":"🇦🇷","Algeria":"🇩🇿","Austria":"🇦🇹","Jordan":"🇯🇴",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Uzbekistan":"🇺🇿","Colombia":"🇨🇴",
  "Portugal":"🇵🇹","Congo DR":"🇨🇩","Panama":"🇵🇦","Ghana":"🇬🇭",
}
const flag = t => FLAGS[t] || "🏳️"

// ── Helpers ───────────────────────────────────────────────────────────────────
function toET(date, time) {
  const [h,m] = time.split(":").map(Number)
  return new Date(`${date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00-04:00`)
}
function isLocked(f) { return Date.now() >= toET(f.date, f.time).getTime() }
function todayET() {
  const et = new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"}))
  return `${et.getFullYear()}-${String(et.getMonth()+1).padStart(2,"0")}-${String(et.getDate()).padStart(2,"0")}`
}
function fmtDate(d) { return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",weekday:"short"}) }
function fmtTime(t) {
  const [h,m] = t.split(":").map(Number)
  return `${h===0?12:h>12?h-12:h}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"} ET`
}
function getWinner(h,a) { return h>a?"home":a>h?"away":"draw" }
function calcPoints(pred, result) {
  if (!pred || !result) return null
  const pw = getWinner(pred.homeScore, pred.awayScore)
  const rw = getWinner(result.homeScore, result.awayScore)
  if (pw !== rw) return 0
  if (pred.homeScore===result.homeScore && pred.awayScore===result.awayScore) return 3
  return 1
}
function totalPoints(name, preds, results) {
  return FIXTURES.reduce((pts, f) => {
    const p = calcPoints(preds[name]?.[f.id], results[f.id])
    return pts + (p ?? 0)
  }, 0)
}

// ── useTick — re-renders every 30s so isLocked stays live ────────────────────
function useTick() {
  const [,setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT(t => t+1), 30_000)
    return () => clearInterval(id)
  }, [])
}

// ── PinPad ────────────────────────────────────────────────────────────────────
function PinPad({ title, subtitle, digits, error, onConfirm, onBack }) {
  const [pin, setPin] = useState("")
  function press(d) {
    if (pin.length >= digits) return
    const next = pin + d
    setPin(next)
    if (next.length === digits) setTimeout(() => { onConfirm(next); setPin("") }, 120)
  }
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"]
  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",fontFamily:"'Inter',system-ui,sans-serif"}}>
      {onBack && <button onClick={onBack} style={{position:"absolute",top:16,left:16,background:"#1f2937",border:"none",borderRadius:7,color:"#9ca3af",fontSize:12,padding:"6px 12px",cursor:"pointer"}}>← Back</button>}
      <div style={{fontSize:36,marginBottom:8}}>🔐</div>
      <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>{title}</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:28,textAlign:"center"}}>{subtitle}</div>
      <div style={{display:"flex",gap:14,marginBottom:28}}>
        {Array.from({length:digits}).map((_,i) => (
          <div key={i} style={{width:14,height:14,borderRadius:"50%",background:i<pin.length?"#6366f1":"#1f2937",border:"2px solid "+(i<pin.length?"#6366f1":"#2d3447"),transition:"background 0.1s"}} />
        ))}
      </div>
      {error && <div style={{fontSize:12,color:"#ef4444",marginBottom:16,fontWeight:600}}>{error}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3, 72px)",gap:10}}>
        {keys.map((k,i) => {
          if (k==="") return <div key={i} />
          return <button key={i} onClick={() => k==="⌫" ? setPin(p=>p.slice(0,-1)) : press(k)} style={{height:64,borderRadius:14,border:"1px solid #1f2937",background:k==="⌫"?"#0f172a":"#111827",color:k==="⌫"?"#6b7280":"#f1f5f9",fontSize:k==="⌫"?20:24,fontWeight:700,cursor:"pointer"}}>{k}</button>
        })}
      </div>
    </div>
  )
}

// ── ScoreInput ────────────────────────────────────────────────────────────────
function ScoreInput({ value, onChange, locked, highlight }) {
  return (
    <input type="number" min="0" max="20" value={value} disabled={locked}
      onChange={e => onChange(Math.max(0, parseInt(e.target.value)||0))}
      style={{width:52,height:52,textAlign:"center",fontSize:22,fontWeight:700,
        background:locked?"#0d1117":"#1a1f2e",
        border:`2px solid ${highlight?"#22c55e":locked?"#1f2937":"#3730a3"}`,
        borderRadius:10,color:locked?"#4b5563":"#f1f5f9",
        outline:"none",WebkitAppearance:"none",MozAppearance:"textfield",
        cursor:locked?"not-allowed":"text"}} />
  )
}

// ── MatchCard ─────────────────────────────────────────────────────────────────
function MatchCard({ fixture, currentPlayer, allPredictions, results, players, onSave }) {
  const locked    = isLocked(fixture)
  const result    = results[fixture.id]
  const myPred    = allPredictions[currentPlayer]?.[fixture.id]
  const submitted = !!myPred
  const inputLocked = locked || submitted

  const [homeScore, setHomeScore] = useState(myPred?.homeScore ?? 1)
  const [awayScore, setAwayScore] = useState(myPred?.awayScore ?? 1)
  const [showOthers, setShowOthers] = useState(false)
  const [saving, setSaving] = useState(false)

  const submittedCount = Object.values(allPredictions).filter(p => p[fixture.id]).length
  const allSubmitted   = submittedCount >= players.length
  const winner = homeScore>awayScore ? fixture.home : awayScore>homeScore ? fixture.away : "Draw"

  const myPoints   = calcPoints(myPred, result)
  const exactMatch = myPoints === 3
  const winnerMatch= myPoints === 1

  async function handleSave() {
    if (inputLocked || saving) return
    setSaving(true)
    await onSave(fixture.id, { homeScore, awayScore, winner })
    setSaving(false)
  }

  const ptsBadge = myPoints !== null ? (
    <span style={{padding:"2px 8px",borderRadius:20,fontWeight:800,fontSize:11,
      background:exactMatch?"#14532d":winnerMatch?"#1e3a5f":"#1a0a0a",
      color:exactMatch?"#4ade80":winnerMatch?"#60a5fa":"#ef4444"}}>
      {exactMatch?"+3 pts 🎯":winnerMatch?"+1 pt ✓":"0 pts ✗"}
    </span>
  ) : null

  return (
    <div style={{background:inputLocked?"#0a0d14":"#111827",border:`1px solid ${inputLocked?"#141a26":"#1f2937"}`,borderRadius:14,padding:"16px 14px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"#6366f1",textTransform:"uppercase"}}>Group {fixture.group} · #{fixture.num}</span>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          {locked && !result && <span style={{fontSize:10,background:"#7f1d1d",color:"#fca5a5",borderRadius:6,padding:"2px 7px",fontWeight:700}}>🔒 KICKED OFF</span>}
          {!locked && submitted && <span style={{fontSize:10,background:"#1e3a5f",color:"#93c5fd",borderRadius:6,padding:"2px 7px",fontWeight:700}}>✓ BET LOCKED</span>}
          {ptsBadge}
          <span style={{fontSize:10,color:"#374151"}}>{submittedCount}/{players.length}</span>
        </div>
      </div>

      <div style={{textAlign:"center",marginBottom:8}}>
        <span style={{fontSize:11,color:inputLocked?"#374151":"#818cf8"}}>{fmtTime(fixture.time)}</span>
      </div>

      {result && (
        <div style={{textAlign:"center",marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:800,color:"#f1f5f9",background:"#1e293b",padding:"4px 16px",borderRadius:20}}>
            {flag(fixture.home)} {result.homeScore} – {result.awayScore} {flag(fixture.away)}
          </span>
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
        <div style={{flex:1,textAlign:"right"}}>
          <div style={{fontSize:20}}>{flag(fixture.home)}</div>
          <div style={{fontSize:11,fontWeight:600,color:inputLocked?"#4b5563":"#e2e8f0",marginTop:3,lineHeight:1.3}}>{fixture.home}</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <ScoreInput value={homeScore} onChange={setHomeScore} locked={inputLocked} highlight={exactMatch} />
          <span style={{fontSize:14,color:"#374151"}}>–</span>
          <ScoreInput value={awayScore} onChange={setAwayScore} locked={inputLocked} highlight={exactMatch} />
        </div>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{fontSize:20}}>{flag(fixture.away)}</div>
          <div style={{fontSize:11,fontWeight:600,color:inputLocked?"#4b5563":"#e2e8f0",marginTop:3,lineHeight:1.3}}>{fixture.away}</div>
        </div>
      </div>

      {!inputLocked && (
        <div style={{textAlign:"center",marginBottom:10}}>
          <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,background:"#1e293b",color:"#94a3b8",fontSize:11}}>
            {winner==="Draw"?"⚖️ Draw":`${flag(winner)} ${winner} wins`}
          </span>
        </div>
      )}

      {!inputLocked ? (
        <button onClick={handleSave} disabled={saving} style={{width:"100%",padding:"9px 0",borderRadius:9,border:"none",background:saving?"#312e81":"#4f46e5",color:"#fff",fontWeight:700,fontSize:13,cursor:saving?"not-allowed":"pointer"}}>
          {saving ? "Saving…" : "Lock in prediction"}
        </button>
      ) : submitted ? (
        <div style={{background:"#0f172a",borderRadius:9,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:16}}>🔒</span>
          <div><span style={{fontSize:12,color:"#6b7280"}}>Your pick: </span><span style={{fontSize:14,color:"#e2e8f0",fontWeight:700}}>{myPred.homeScore}–{myPred.awayScore}</span></div>
        </div>
      ) : (
        <div style={{borderRadius:9,padding:"9px 12px",textAlign:"center",border:"1px solid #1f2937"}}>
          <span style={{fontSize:12,color:"#374151"}}>No prediction submitted</span>
        </div>
      )}

      {submittedCount > 0 && (
        <button onClick={() => setShowOthers(!showOthers)} style={{width:"100%",marginTop:7,padding:"6px 0",borderRadius:9,border:"1px solid #1f2937",background:"transparent",color:"#6b7280",fontSize:11,cursor:"pointer"}}>
          {(allSubmitted||locked)
            ? (showOthers?"Hide predictions":`👀 See all ${submittedCount} predictions`)
            : `🔒 Reveals when all ${players.length} submit (${submittedCount} in)`}
        </button>
      )}

      {showOthers && (allSubmitted||locked) && (
        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:5}}>
          {players.map(p => {
            const pred = allPredictions[p.name]?.[fixture.id]
            const pts  = calcPoints(pred, result)
            return (
              <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:pred?"#0f172a":"#0a0d14",borderRadius:8,padding:"7px 10px",opacity:pred?1:0.5}}>
                <span style={{fontSize:12,color:"#94a3b8",fontWeight:p.name===currentPlayer?700:400,minWidth:60}}>{p.name===currentPlayer?"👤 ":""}{p.name}</span>
                {pred ? <span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{pred.homeScore}–{pred.awayScore}</span> : <span style={{fontSize:11,color:"#374151"}}>no pick</span>}
                {pts !== null && <span style={{fontSize:10,fontWeight:700,color:pts===3?"#4ade80":pts===1?"#60a5fa":"#ef4444"}}>{pts===3?"+3 🎯":pts===1?"+1 ✓":"0 ✗"}</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── AdminMatchCard ────────────────────────────────────────────────────────────
function AdminMatchCard({ fixture, result, onSaveResult }) {
  const [h, setH] = useState(result?.homeScore ?? "")
  const [a, setA] = useState(result?.awayScore ?? "")
  const [saved, setSaved] = useState(!!result)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (h===""||a===""||saving) return
    setSaving(true)
    await onSaveResult(fixture.id, { homeScore:parseInt(h), awayScore:parseInt(a) })
    setSaved(true)
    setSaving(false)
  }

  return (
    <div style={{background:saved?"#0a1a0a":"#111827",border:`1px solid ${saved?"#166534":"#1f2937"}`,borderRadius:14,padding:"16px 14px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"#d97706",textTransform:"uppercase"}}>Group {fixture.group} · #{fixture.num}</span>
        {saved
          ? <span style={{fontSize:10,background:"#14532d",color:"#4ade80",borderRadius:6,padding:"2px 8px",fontWeight:700}}>✓ Result saved</span>
          : <span style={{fontSize:10,background:"#7f1d1d",color:"#fca5a5",borderRadius:6,padding:"2px 8px",fontWeight:700}}>⏳ Needs score</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1,textAlign:"right"}}>
          <div style={{fontSize:22}}>{flag(fixture.home)}</div>
          <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginTop:3}}>{fixture.home}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input type="number" min="0" max="20" value={h} onChange={e=>{setH(e.target.value);setSaved(false)}} placeholder="0"
            style={{width:56,height:56,textAlign:"center",fontSize:24,fontWeight:800,background:"#1a1f2e",border:`2px solid ${saved?"#166534":"#3730a3"}`,borderRadius:10,color:"#f1f5f9",outline:"none",WebkitAppearance:"none"}} />
          <span style={{fontSize:18,color:"#374151",fontWeight:300}}>–</span>
          <input type="number" min="0" max="20" value={a} onChange={e=>{setA(e.target.value);setSaved(false)}} placeholder="0"
            style={{width:56,height:56,textAlign:"center",fontSize:24,fontWeight:800,background:"#1a1f2e",border:`2px solid ${saved?"#166534":"#3730a3"}`,borderRadius:10,color:"#f1f5f9",outline:"none",WebkitAppearance:"none"}} />
        </div>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{fontSize:22}}>{flag(fixture.away)}</div>
          <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginTop:3}}>{fixture.away}</div>
        </div>
      </div>
      <button onClick={handleSave} disabled={h===""||a===""||saving} style={{width:"100%",padding:"10px 0",borderRadius:9,border:"none",background:h===""||a===""?"#1f2937":saved?"#14532d":"#4f46e5",color:h===""||a===""?"#4b5563":saved?"#4ade80":"#fff",fontWeight:700,fontSize:13,cursor:h===""||a===""?"not-allowed":"pointer"}}>
        {saving?"Saving…":saved?"✓ Saved — tap to update":"Save result"}
      </button>
    </div>
  )
}

// ── AdminDashboard ────────────────────────────────────────────────────────────
function AdminDashboard({ allPredictions, results, players, onSaveResult, onAddPlayer, onExit }) {
  useTick()
  const today = todayET()
  const [activeDay, setActiveDay] = useState(() => {
    const past = GAMEDAYS.filter(d => d <= today)
    return past[past.length-1] || GAMEDAYS[0]
  })
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPin, setNewPin]   = useState("")
  const [addErr, setAddErr]   = useState("")

  useEffect(() => {
    setTimeout(() => {
      document.getElementById(`atab-${activeDay}`)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})
    }, 100)
  }, [activeDay])

  const lockedAll = FIXTURES.filter(f => isLocked(f))
  const scored    = lockedAll.filter(f => results[f.id]).length
  const lockedDay = FIXTURES.filter(f => f.date===activeDay && isLocked(f))

  if (showAdd) return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <button onClick={()=>{setShowAdd(false);setAddErr("");setNewName("");setNewPin("")}} style={{position:"absolute",top:16,left:16,background:"#1f2937",border:"none",borderRadius:7,color:"#9ca3af",fontSize:12,padding:"6px 12px",cursor:"pointer"}}>← Back</button>
      <div style={{fontSize:32,marginBottom:12}}>👤</div>
      <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Add Player</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:28}}>Name + 4-digit PIN</div>
      <div style={{width:"100%",maxWidth:280,display:"flex",flexDirection:"column",gap:12}}>
        <div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:5}}>Name</div>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Khaled" maxLength={20}
            style={{width:"100%",background:"#111827",border:"1px solid #2d3447",borderRadius:9,padding:"11px 14px",color:"#f1f5f9",fontSize:15,outline:"none",boxSizing:"border-box"}} />
        </div>
        <div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:5}}>4-digit PIN</div>
          <input value={newPin} onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="e.g. 1234" maxLength={4} type="tel"
            style={{width:"100%",background:"#111827",border:"1px solid #2d3447",borderRadius:9,padding:"11px 14px",color:"#f1f5f9",fontSize:15,outline:"none",boxSizing:"border-box",letterSpacing:"0.3em"}} />
        </div>
        {addErr && <div style={{fontSize:12,color:"#ef4444",textAlign:"center"}}>{addErr}</div>}
        <button onClick={async () => {
          const name = newName.trim()
          if (!name) return setAddErr("Enter a name.")
          if (newPin.length!==4) return setAddErr("PIN must be 4 digits.")
          if (players.find(p=>p.name.toLowerCase()===name.toLowerCase())) return setAddErr("Name already exists.")
          await onAddPlayer({name, pin:newPin})
          setShowAdd(false); setNewName(""); setNewPin(""); setAddErr("")
        }} style={{padding:"13px 0",borderRadius:10,border:"none",background:"#4f46e5",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>
          Add Player
        </button>
      </div>
    </div>
  )

  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:"#f1f5f9"}}>
      <div style={{position:"sticky",top:0,zIndex:10,background:"#0a0e1a",borderBottom:"1px solid #854d0e",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:"#fbbf24"}}>⚙️ Admin</div>
          <div style={{fontSize:10,color:"#92400e"}}>{scored}/{lockedAll.length} results entered</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setShowAdd(true)} style={{background:"#1f2937",border:"none",borderRadius:7,color:"#a5b4fc",fontSize:11,padding:"5px 10px",cursor:"pointer",fontWeight:600}}>+ Player</button>
          <button onClick={onExit} style={{background:"#1f2937",border:"none",borderRadius:7,color:"#9ca3af",fontSize:11,padding:"5px 10px",cursor:"pointer"}}>Exit</button>
        </div>
      </div>

      <div style={{margin:"10px 14px",background:"#1a1209",border:"1px solid #854d0e",borderRadius:10,padding:"10px 14px",display:"flex",gap:16,alignItems:"center"}}>
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#fbbf24"}}>{lockedAll.length}</div><div style={{fontSize:10,color:"#92400e"}}>kicked off</div></div>
        <div style={{width:1,background:"#854d0e"}} />
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#4ade80"}}>{scored}</div><div style={{fontSize:10,color:"#92400e"}}>scored</div></div>
        <div style={{width:1,background:"#854d0e"}} />
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#ef4444"}}>{lockedAll.length-scored}</div><div style={{fontSize:10,color:"#92400e"}}>pending</div></div>
      </div>

      <div style={{display:"flex",overflowX:"auto",gap:5,padding:"8px 14px 0",scrollbarWidth:"none"}}>
        {GAMEDAYS.map(day => {
          const dayFs = FIXTURES.filter(f => f.date===day && isLocked(f))
          if (!dayFs.length) return null
          const entered   = dayFs.filter(f => results[f.id]).length
          const allDone   = entered===dayFs.length
          const isActive  = activeDay===day
          const d = new Date(day+"T12:00:00")
          return (
            <button key={day} id={`atab-${day}`} onClick={()=>setActiveDay(day)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"7px 10px",borderRadius:10,border:"1px solid",borderColor:isActive?"#854d0e":"#1f2937",background:isActive?"#1a1209":"#111827",cursor:"pointer",minWidth:50}}>
              <span style={{fontSize:9,color:isActive?"#d97706":"#6b7280",fontWeight:600}}>{d.toLocaleDateString("en-US",{month:"short"})}</span>
              <span style={{fontSize:17,fontWeight:800,color:isActive?"#fbbf24":"#e2e8f0",lineHeight:1.1}}>{d.getDate()}</span>
              <span style={{fontSize:9,marginTop:2,color:allDone?"#4ade80":isActive?"#f59e0b":"#374151"}}>{allDone?"✓":`${entered}/${dayFs.length}`}</span>
            </button>
          )
        })}
      </div>

      {lockedDay.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:32,marginBottom:12}}>⏳</div>
          <div style={{color:"#374151",fontSize:14}}>No matches kicked off on this day yet</div>
        </div>
      ) : (
        <div style={{padding:"10px 14px 48px"}}>
          {lockedDay.map(f => <AdminMatchCard key={f.id} fixture={f} result={results[f.id]} onSaveResult={onSaveResult} />)}
        </div>
      )}
    </div>
  )
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function Leaderboard({ allPredictions, results, players, onClose }) {
  const scored = players.map(p => {
    const pts    = totalPoints(p.name, allPredictions, results)
    const played = FIXTURES.filter(f => results[f.id] && allPredictions[p.name]?.[f.id]).length
    const exact  = FIXTURES.filter(f => calcPoints(allPredictions[p.name]?.[f.id], results[f.id])===3).length
    return { name:p.name, pts, played, exact }
  }).sort((a,b) => b.pts-a.pts || b.exact-a.exact)

  const withResults = FIXTURES.filter(f => results[f.id]).length

  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:"#f1f5f9"}}>
      <div style={{position:"sticky",top:0,zIndex:10,background:"#0a0e1a",borderBottom:"1px solid #1f2937",padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onClose} style={{background:"#1f2937",border:"none",borderRadius:7,color:"#9ca3af",fontSize:12,padding:"5px 10px",cursor:"pointer"}}>← Back</button>
        <div>
          <div style={{fontSize:16,fontWeight:800}}>🏆 Leaderboard</div>
          <div style={{fontSize:10,color:"#6366f1"}}>{withResults}/{FIXTURES.length} results in</div>
        </div>
      </div>
      <div style={{margin:"12px 14px",background:"#111827",borderRadius:10,padding:"10px 14px",display:"flex",gap:16}}>
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#60a5fa"}}>+1</div><div style={{fontSize:10,color:"#6b7280"}}>Correct winner</div></div>
        <div style={{width:1,background:"#1f2937"}} />
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#4ade80"}}>+3</div><div style={{fontSize:10,color:"#6b7280"}}>Exact score</div></div>
        <div style={{width:1,background:"#1f2937"}} />
        <div style={{textAlign:"center",flex:1}}><div style={{fontSize:20,fontWeight:800,color:"#f1f5f9"}}>0</div><div style={{fontSize:10,color:"#6b7280"}}>Wrong winner</div></div>
      </div>
      <div style={{padding:"4px 14px 48px"}}>
        {scored.map((p,i) => {
          const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":null
          return (
            <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,background:i===0?"#1a1209":"#111827",border:`1px solid ${i===0?"#854d0e":"#1f2937"}`,borderRadius:12,padding:"14px",marginBottom:8}}>
              <span style={{fontSize:20,minWidth:28}}>{medal || <span style={{fontSize:13,color:"#374151",fontWeight:700}}>{i+1}</span>}</span>
              <span style={{fontSize:15,fontWeight:700,flex:1}}>{p.name}</span>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:800,color:i===0?"#fbbf24":i===1?"#d1d5db":i===2?"#cd7f32":"#f1f5f9"}}>{p.pts} <span style={{fontSize:12,fontWeight:400,color:"#6b7280"}}>pts</span></div>
                <div style={{fontSize:10,color:"#4b5563"}}>{p.played} played · {p.exact} exact 🎯</div>
              </div>
            </div>
          )
        })}
        {withResults===0 && <div style={{textAlign:"center",padding:"48px 20px"}}><div style={{fontSize:32,marginBottom:12}}>⏳</div><div style={{color:"#374151",fontSize:14}}>No results yet</div></div>}
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useTick()
  const [player, setPlayer]             = useState(null)
  const [pendingPlayer, setPending]     = useState(null)
  const [pinError, setPinError]         = useState("")
  const [allPredictions, setPreds]      = useState({})
  const [results, setResults]           = useState({})
  const [players, setPlayers]           = useState(DEFAULT_PLAYERS)
  const [loading, setLoading]           = useState(true)
  const [activeDay, setActiveDay]       = useState(null)
  const [showBoard, setShowBoard]       = useState(false)
  const [isAdmin, setIsAdmin]           = useState(false)
  const [showAdminPin, setShowAdminPin] = useState(false)
  const [adminPinError, setAdminPinError] = useState("")

  const today = todayET()

  useEffect(() => {
    loadAll().then(({ predictions, results: r, players: pl }) => {
      setPreds(predictions)
      setResults(r)
      if (pl) setPlayers(pl)
      else seedDefaultPlayers(DEFAULT_PLAYERS) // first run
      setLoading(false)
      const upcoming = GAMEDAYS.find(d => d >= today)
      setActiveDay(upcoming || GAMEDAYS[GAMEDAYS.length-1])
    })
  }, [])

  useEffect(() => {
    if (activeDay) {
      setTimeout(() => {
        document.getElementById(`tab-${activeDay}`)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})
      }, 100)
    }
  }, [activeDay, player])

  async function handleSave(fixtureId, pred) {
    await savePrediction(player, fixtureId, pred)
    setPreds(prev => ({ ...prev, [player]: { ...(prev[player]||{}), [fixtureId]: pred } }))
  }

  async function handleSaveResult(fixtureId, result) {
    await saveResult(fixtureId, result)
    setResults(prev => ({ ...prev, [fixtureId]: result }))
  }

  async function handleAddPlayer(p) {
    await addPlayer(p)
    setPlayers(prev => [...prev, p])
  }

  if (loading) return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{color:"#6366f1",fontSize:15,fontWeight:600}}>Loading…</div>
    </div>
  )

  if (showBoard) return <Leaderboard allPredictions={allPredictions} results={results} players={players} onClose={()=>setShowBoard(false)} />
  if (isAdmin)   return <AdminDashboard allPredictions={allPredictions} results={results} players={players} onSaveResult={handleSaveResult} onAddPlayer={handleAddPlayer} onExit={()=>setIsAdmin(false)} />

  if (showAdminPin) return (
    <PinPad title="Admin Access" subtitle="Enter the 6-digit admin password" digits={6} error={adminPinError}
      onBack={()=>{setShowAdminPin(false);setAdminPinError("")}}
      onConfirm={pin => {
        if (pin===ADMIN_PASSWORD) { setIsAdmin(true); setShowAdminPin(false); setAdminPinError("") }
        else setAdminPinError("Wrong password. Try again.")
      }} />
  )

  if (pendingPlayer) return (
    <PinPad title={pendingPlayer.name} subtitle="Enter your 4-digit PIN" digits={4} error={pinError}
      onBack={()=>{setPending(null);setPinError("")}}
      onConfirm={pin => {
        if (pin===pendingPlayer.pin) { setPlayer(pendingPlayer.name); setPending(null); setPinError("") }
        else setPinError("Wrong PIN. Try again.")
      }} />
  )

  // ── Player picker ──────────────────────────────────────────────────────────
  if (!player) return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{fontSize:46,marginBottom:8}}>🏆</div>
      <h1 style={{color:"#f1f5f9",fontSize:24,fontWeight:800,margin:"0 0 4px",letterSpacing:"-0.02em"}}>WC 2026 Picks</h1>
      <p style={{color:"#64748b",fontSize:13,marginBottom:10,textAlign:"center"}}>+1 correct winner · +3 exact score</p>
      <button onClick={()=>setShowBoard(true)} style={{marginBottom:28,padding:"8px 20px",borderRadius:9,border:"1px solid #374151",background:"transparent",color:"#94a3b8",fontSize:13,cursor:"pointer",fontWeight:600}}>🏆 View Leaderboard</button>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",maxWidth:340}}>
        {players.map(p => {
          const pts = totalPoints(p.name, allPredictions, results)
          const count = Object.keys(allPredictions[p.name]||{}).length
          return (
            <button key={p.name} onClick={()=>{setPending(p);setPinError("")}} style={{padding:"11px 20px",borderRadius:10,border:"1px solid #1f2937",background:"#111827",color:"#e2e8f0",fontSize:15,fontWeight:600,cursor:"pointer",position:"relative"}}>
              {p.name}
              {pts>0 && <span style={{position:"absolute",top:-7,right:-7,background:"#6366f1",color:"#fff",borderRadius:20,fontSize:10,padding:"1px 6px",fontWeight:700}}>{pts}pts</span>}
              {pts===0 && count>0 && <span style={{position:"absolute",top:-6,right:-6,background:"#1f2937",color:"#9ca3af",borderRadius:20,fontSize:10,padding:"1px 5px",fontWeight:700}}>{count}</span>}
            </button>
          )
        })}
      </div>
      <button onClick={()=>{setShowAdminPin(true);setAdminPinError("")}} style={{marginTop:24,padding:"5px 14px",borderRadius:7,border:"1px solid #1f2937",background:"transparent",color:"#374151",fontSize:11,cursor:"pointer"}}>
        ⚙️ Admin
      </button>
      <p style={{color:"#374151",fontSize:11,marginTop:8}}>Tap your name to predict</p>
    </div>
  )

  // ── Player main view ───────────────────────────────────────────────────────
  const dayFixtures = FIXTURES.filter(f => f.date===activeDay)
  const myTotal     = Object.keys(allPredictions[player]||{}).length
  const myPts       = totalPoints(player, allPredictions, results)
  const isToday     = activeDay===today
  const isTomorrow  = activeDay===GAMEDAYS[GAMEDAYS.indexOf(today)+1]

  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:"#f1f5f9"}}>
      <div style={{position:"sticky",top:0,zIndex:10,background:"#0a0e1a",borderBottom:"1px solid #1f2937",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:15,fontWeight:700}}>👤 {player}</div>
          <div style={{fontSize:10,color:"#6366f1"}}>
            {myPts>0 && <span style={{color:"#a5b4fc",fontWeight:700}}>{myPts} pts · </span>}
            {myTotal}/{FIXTURES.length} locked
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setShowBoard(true)} style={{background:"#1f2937",border:"none",borderRadius:7,color:"#fbbf24",fontSize:11,padding:"5px 10px",cursor:"pointer",fontWeight:600}}>🏆</button>
          <button onClick={()=>{setPlayer(null);setPending(null);setPinError("")}} style={{background:"#1f2937",border:"none",borderRadius:7,color:"#9ca3af",fontSize:11,padding:"5px 10px",cursor:"pointer"}}>Switch</button>
        </div>
      </div>

      <div style={{display:"flex",overflowX:"auto",gap:5,padding:"10px 14px 0",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
        {GAMEDAYS.map(day => {
          const dayFs  = FIXTURES.filter(f => f.date===day)
          const done   = dayFs.filter(f => allPredictions[player]?.[f.id]).length
          const isActive = activeDay===day
          const allDone  = done===dayFs.length
          const isT  = day===today
          const isTm = day===GAMEDAYS[GAMEDAYS.indexOf(today)+1]
          const isPast = day<today
          const d = new Date(day+"T12:00:00")
          return (
            <button key={day} id={`tab-${day}`} onClick={()=>setActiveDay(day)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"7px 10px",borderRadius:10,border:"1px solid",borderColor:isActive?"#6366f1":isT?"#312e81":"#1f2937",background:isActive?"#1e1b4b":isT?"#0f0e1f":"#111827",cursor:"pointer",minWidth:50,position:"relative"}}>
              {isT && <span style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",background:"#f59e0b",color:"#000",fontSize:8,fontWeight:800,borderRadius:4,padding:"1px 5px",whiteSpace:"nowrap"}}>TODAY</span>}
              {isTm && !isT && <span style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",background:"#0f766e",color:"#fff",fontSize:8,fontWeight:800,borderRadius:4,padding:"1px 5px",whiteSpace:"nowrap"}}>TMR</span>}
              <span style={{fontSize:9,color:isActive?"#818cf8":isPast?"#374151":"#6b7280",fontWeight:600}}>{d.toLocaleDateString("en-US",{month:"short"})}</span>
              <span style={{fontSize:17,fontWeight:800,color:isActive?"#a5b4fc":isPast?"#374151":"#e2e8f0",lineHeight:1.1}}>{d.getDate()}</span>
              <span style={{fontSize:9,marginTop:2,color:allDone?"#34d399":isActive?"#6366f1":"#374151"}}>{allDone?"✓":`${done}/${dayFs.length}`}</span>
            </button>
          )
        })}
      </div>

      <div style={{padding:"10px 14px 2px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{fmtDate(activeDay)}</span>
        {isToday && <span style={{fontSize:10,background:"#f59e0b",color:"#000",borderRadius:5,padding:"1px 6px",fontWeight:800}}>TODAY</span>}
        {isTomorrow && <span style={{fontSize:10,background:"#0f766e",color:"#fff",borderRadius:5,padding:"1px 6px",fontWeight:800}}>TOMORROW</span>}
        {activeDay<today && <span style={{fontSize:10,color:"#374151"}}>Betting closed</span>}
        <span style={{fontSize:11,color:"#374151",marginLeft:"auto"}}>{dayFixtures.length} matches</span>
      </div>

      <div style={{padding:"8px 14px 48px"}}>
        {dayFixtures.map(f => (
          <MatchCard key={f.id} fixture={f} currentPlayer={player}
            allPredictions={allPredictions} results={results} players={players}
            onSave={handleSave} />
        ))}
      </div>
    </div>
  )
}
