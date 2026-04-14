import { useState, useEffect, useRef } from “react”;

const SPOTS = {
“강원도 강릉”: [
{ id: 1, name: “경포해변”, cat: “해변”, img: “🏖️”, dist: “2.1km”, time: “8분”, desc: “국내 최대 규모의 해변. 일출 명소”, tags: [“사진맛집”, “일출”] },
{ id: 2, name: “정동진”, cat: “명소”, img: “🌅”, dist: “18km”, time: “28분”, desc: “세계에서 바다와 가장 가까운 기차역”, tags: [“로맨틱”, “일몰”] },
{ id: 3, name: “오죽헌”, cat: “역사”, img: “🏛️”, dist: “3.4km”, time: “12분”, desc: “신사임당·율곡이이의 생가. 조선시대 건축”, tags: [“역사”, “문화”] },
{ id: 4, name: “강릉 커피거리”, cat: “카페”, img: “☕”, dist: “4.2km”, time: “15분”, desc: “강릉 바리스타 챔피언들의 카페 집결지”, tags: [“카페”, “커피”] },
{ id: 5, name: “안목해변”, cat: “해변”, img: “🌊”, dist: “5.1km”, time: “18분”, desc: “카페 거리와 바다가 공존하는 감성 해변”, tags: [“감성”, “카페”] },
{ id: 6, name: “참소리축음기박물관”, cat: “박물관”, img: “🎵”, dist: “2.8km”, time: “10분”, desc: “세계 최대 축음기·에디슨 발명품 컬렉션”, tags: [“독특함”, “박물관”] },
],
“제주도 서귀포”: [
{ id: 7, name: “성산일출봉”, cat: “자연”, img: “🌋”, dist: “45km”, time: “65분”, desc: “유네스코 세계자연유산. 분화구 트레킹”, tags: [“트레킹”, “사진맛집”] },
{ id: 8, name: “섭지코지”, cat: “해안”, img: “🌊”, dist: “47km”, time: “68분”, desc: “드라마 올인 촬영지. 절경의 해안 절벽”, tags: [“드라이브”, “절경”] },
{ id: 9, name: “천지연폭포”, cat: “자연”, img: “💧”, dist: “2km”, time: “8분”, desc: “서귀포 도심 속 이국적인 폭포”, tags: [“자연”, “산책”] },
{ id: 10, name: “외돌개”, cat: “명소”, img: “🪨”, dist: “5km”, time: “15분”, desc: “용암이 굳어 만들어진 20m 바위 기둥”, tags: [“독특함”, “절경”] },
],
“경주시”: [
{ id: 11, name: “불국사”, cat: “사찰”, img: “⛩️”, dist: “15km”, time: “25분”, desc: “유네스코 세계문화유산. 신라의 정수”, tags: [“역사”, “문화”] },
{ id: 12, name: “첨성대”, cat: “역사”, img: “🔭”, dist: “4km”, time: “12분”, desc: “동양 최고(最古) 천문대. 야경 명소”, tags: [“야경”, “역사”] },
{ id: 13, name: “황리단길”, cat: “거리”, img: “🛍️”, dist: “3km”, time: “10분”, desc: “한옥 감성의 카페·빈티지숍 밀집 거리”, tags: [“감성”, “쇼핑”] },
]
};

const FOOD = [
{ id: “f1”, name: “초당순두부”, cat: “한식”, emoji: “🥣”, rating: 4.8, price: “₩₩”, desc: “강릉 대표 음식” },
{ id: “f2”, name: “물회”, cat: “해산물”, emoji: “🐟”, rating: 4.7, price: “₩₩₩”, desc: “신선한 동해 횟감” },
{ id: “f3”, name: “감자옹심이”, cat: “한식”, emoji: “🍲”, rating: 4.6, price: “₩”, desc: “강원도 토속 음식” },
{ id: “f4”, name: “테라로사”, cat: “카페”, emoji: “☕”, rating: 4.9, price: “₩₩”, desc: “강릉 스페셜티 커피” },
{ id: “f5”, name: “명주동 브런치”, cat: “브런치”, emoji: “🥞”, rating: 4.5, price: “₩₩”, desc: “감성 한옥 브런치카페” },
{ id: “f6”, name: “항구 회센터”, cat: “해산물”, emoji: “🦞”, rating: 4.7, price: “₩₩₩₩”, desc: “싱싱한 활어회” },
];

const REGIONS = [“강원도 강릉”, “제주도 서귀포”, “경주시”];

const TIMES = [“오전 6시”, “오전 7시”, “오전 8시”, “오전 9시”, “오전 10시”, “오전 11시”, “오후 12시”, “오후 1시”, “오후 2시”];

export default function TripDrop() {
const [screen, setScreen] = useState(“home”);
// screens: home → depart → destination → spots → pipeline → timeline
const [depart, setDepart] = useState(””);
const [departTime, setDepartTime] = useState(“오전 9시”);
const [transport, setTransport] = useState(“car”);
const [region, setRegion] = useState(””);
const [selectedSpots, setSelectedSpots] = useState([]);
const [pipeline, setPipeline] = useState([]);
const [addingFood, setAddingFood] = useState(null); // index where we insert
const [foodFilter, setFoodFilter] = useState(“전체”);
const [mapPins, setMapPins] = useState([]);
const [animating, setAnimating] = useState(false);
const [activePin, setActivePin] = useState(null);
const [tripStarted, setTripStarted] = useState(false);
const [currentStep, setCurrentStep] = useState(0);
const [progress, setProgress] = useState(0);
const canvasRef = useRef(null);

const spots = region ? SPOTS[region] || [] : [];

// Animate screen transitions
const goTo = (s) => {
setAnimating(true);
setTimeout(() => { setScreen(s); setAnimating(false); }, 180);
};

// Map canvas
useEffect(() => {
if (!canvasRef.current) return;
const canvas = canvasRef.current;
const ctx = canvas.getContext(“2d”);
const W = canvas.width, H = canvas.height;
ctx.clearRect(0, 0, W, H);

```
// Map background
const bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, "#e8f4e8");
bg.addColorStop(1, "#ddf0dd");
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Grid lines (roads)
ctx.strokeStyle = "#fff";
ctx.lineWidth = 1.5;
for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

// Main roads
ctx.strokeStyle = "#fff";
ctx.lineWidth = 5;
ctx.beginPath(); ctx.moveTo(0, H * 0.5); ctx.lineTo(W, H * 0.5); ctx.stroke();
ctx.beginPath(); ctx.moveTo(W * 0.4, 0); ctx.lineTo(W * 0.4, H); ctx.stroke();

const allPins = mapPins.length > 0 ? mapPins : [];
if (allPins.length === 0 && screen !== "home") {
  // Show placeholder pins
  const placeholders = [
    { x: W * 0.2, y: H * 0.35, color: "#3B82F6", label: "출발" },
    { x: W * 0.7, y: H * 0.55, color: "#F59E0B", label: "목적지" },
  ];
  placeholders.forEach(p => drawPin(ctx, p.x, p.y, p.color, p.label, false));
}

// Draw route line
if (allPins.length > 1) {
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  allPins.forEach((p, i) => i === 0 ? ctx.moveTo(p.x * W, p.y * H) : ctx.lineTo(p.x * W, p.y * H));
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw pins
allPins.forEach((p, i) => {
  drawPin(ctx, p.x * W, p.y * H, p.color || "#3B82F6", p.label, activePin === i);
});

// Progress dot for trip started
if (tripStarted && allPins.length > 1) {
  const t = progress / 100;
  const ix = Math.min(Math.floor(t * (allPins.length - 1)), allPins.length - 2);
  const local = (t * (allPins.length - 1)) - ix;
  const px = (allPins[ix].x + (allPins[ix + 1].x - allPins[ix].x) * local) * W;
  const py = (allPins[ix].y + (allPins[ix + 1].y - allPins[ix].y) * local) * H;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#EF4444";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("나", px, py + 3);
}
```

}, [mapPins, activePin, tripStarted, progress, screen]);

function drawPin(ctx, x, y, color, label, active) {
const r = active ? 14 : 10;
if (active) {
ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2);
ctx.fillStyle = color + “33”; ctx.fill();
}
ctx.beginPath();
ctx.arc(x, y - r, r, Math.PI, 0);
ctx.lineTo(x + r * 0.3, y + r * 0.6);
ctx.lineTo(x, y + r * 1.2);
ctx.lineTo(x - r * 0.3, y + r * 0.6);
ctx.closePath();
ctx.fillStyle = color; ctx.fill();
ctx.strokeStyle = “#fff”; ctx.lineWidth = 2; ctx.stroke();

```
if (label) {
  ctx.fillStyle = "#1E2A3A";
  ctx.font = `bold ${active ? 11 : 9}px sans-serif`;
  ctx.textAlign = "center";
  const maxW = 80;
  const shortLabel = label.length > 5 ? label.slice(0, 5) + "…" : label;
  ctx.fillStyle = "#fff";
  const tw = ctx.measureText(shortLabel).width + 10;
  ctx.beginPath();
  ctx.roundRect(x - tw / 2, y + r * 1.4, tw, 16, 4);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText(shortLabel, x, y + r * 1.4 + 11);
}
```

}

const addSpot = (spot) => {
if (selectedSpots.find(s => s.id === spot.id)) {
setSelectedSpots(selectedSpots.filter(s => s.id !== spot.id));
setMapPins(mapPins.filter((_, i) => i !== selectedSpots.findIndex(s => s.id === spot.id) + 1));
} else {
const newSpots = […selectedSpots, spot];
setSelectedSpots(newSpots);
const newPins = [
{ x: 0.15, y: 0.3, color: “#3B82F6”, label: depart || “출발지” },
…newSpots.map((s, i) => ({
x: 0.25 + i * 0.2,
y: 0.3 + (i % 2) * 0.25,
color: “#F59E0B”,
label: s.name
}))
];
setMapPins(newPins);
}
};

const buildPipeline = () => {
const nodes = [
{ type: “start”, label: depart || “출발지”, icon: “🔵”, time: departTime },
…selectedSpots.map(s => ({ type: “spot”, label: s.name, icon: s.img, time: null, spot: s })),
{ type: “end”, label: “귀가”, icon: “🏠”, time: null }
];
setPipeline(nodes);
goTo(“pipeline”);
};

const insertFood = (idx, food) => {
const newPipe = […pipeline];
newPipe.splice(idx + 1, 0, { type: “food”, label: food.name, icon: food.emoji, cat: food.cat, food });
setPipeline(newPipe);
setAddingFood(null);
// update map pins
const foodPins = newPipe.filter(n => n.type === “food”).map((_, i) => ({
x: 0.35 + i * 0.15,
y: 0.65,
color: “#10B981”,
label: _.label
}));
setMapPins(prev => […prev.slice(0, selectedSpots.length + 1), …foodPins]);
};

const calcTimes = () => {
const hours = parseInt(departTime.includes(“오전”) ? departTime.replace(“오전 “, “”).replace(“시”, “”) : parseInt(departTime.replace(“오후 “, “”).replace(“시”, “”)) + 12);
let cur = hours * 60;
return pipeline.map((node, i) => {
if (i === 0) return { …node, arrive: departTime, depart: departTime };
const stay = node.type === “spot” ? 60 : node.type === “food” ? 50 : 20;
const travel = node.spot ? parseInt(node.spot.time) : 15;
cur += travel;
const arrive = `${Math.floor(cur / 60) % 24}:${String(cur % 60).padStart(2, "0")}`;
cur += stay;
const dep = `${Math.floor(cur / 60) % 24}:${String(cur % 60).padStart(2, "0")}`;
return { …node, arrive, depart: dep, travel, stay };
});
};

const startTrip = () => {
setTripStarted(true);
setCurrentStep(1);
let p = 0;
const timer = setInterval(() => {
p += 0.3;
setProgress(Math.min(p, 100));
if (p >= 100) clearInterval(timer);
}, 100);
};

const foodFilters = [“전체”, “한식”, “해산물”, “카페”, “브런치”];
const filteredFood = foodFilter === “전체” ? FOOD : FOOD.filter(f => f.cat === foodFilter);
const timedPipeline = screen === “timeline” ? calcTimes() : [];

return (
<div style={{
fontFamily: “‘Pretendard’, ‘Noto Sans KR’, sans-serif”,
background: “#0F172A”,
minHeight: “100vh”,
display: “flex”,
justifyContent: “center”,
alignItems: “center”,
padding: “20px”
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; } .fade-in { animation: fadeIn 0.25s ease; } @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .slide-up { animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); } @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } } .pulse { animation: pulse 2s infinite; } @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} } .btn-tap:active { transform: scale(0.96); transition: transform 0.1s; } .spot-card:hover { transform: translateY(-2px); transition: transform 0.2s; } .shimmer { background: linear-gradient(90deg, #1E293B 25%, #273549 50%, #1E293B 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; } @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} } .tag { display:inline-block; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; } .pipe-node { position:relative; } .pipe-node::before { content:''; position:absolute; left:19px; top:-16px; width:2px; height:16px; background: linear-gradient(#334155, #475569); } .pipe-node:first-child::before { display:none; }`}</style>

```
  {/* Phone Frame */}
  <div style={{
    width: 390,
    height: 780,
    background: "#0F172A",
    borderRadius: 44,
    border: "2px solid #1E293B",
    boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 #334155",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column"
  }}>
    {/* Status Bar */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 24px 4px", background:"#0F172A", flexShrink:0 }}>
      <span style={{ color:"#94A3B8", fontSize:12, fontWeight:600 }}>9:41</span>
      <div style={{ width:120, height:20, background:"#1E293B", borderRadius:10 }} />
      <div style={{ display:"flex", gap:4 }}>
        {["📶","🔋"].map(i => <span key={i} style={{ fontSize:11 }}>{i}</span>)}
      </div>
    </div>

    {/* Screens */}
    <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", opacity: animating ? 0 : 1, transition:"opacity 0.18s" }}>

      {/* ── HOME ── */}
      {screen === "home" && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:24, justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:24 }}>🗺️</span>
              <span style={{ color:"#3B82F6", fontSize:13, fontWeight:700, letterSpacing:2 }}>TRIPDROP</span>
            </div>
            <h1 style={{ color:"#F8FAFC", fontSize:32, fontWeight:900, lineHeight:1.2, marginBottom:8 }}>
              지금 바로<br/>
              <span style={{ background:"linear-gradient(135deg,#3B82F6,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>떠나볼까요?</span>
            </h1>
            <p style={{ color:"#64748B", fontSize:14 }}>AI가 짜주는 나만의 즉석 여행 플래너</p>
          </div>

          {/* Map Preview */}
          <div style={{ borderRadius:20, overflow:"hidden", position:"relative", height:220, background:"#1E293B" }}>
            <canvas ref={canvasRef} width={342} height={220} style={{ width:"100%", height:"100%" }} />
            <div style={{ position:"absolute", top:12, left:12, background:"rgba(15,23,42,0.8)", borderRadius:10, padding:"6px 12px", backdropFilter:"blur(8px)" }}>
              <span style={{ color:"#94A3B8", fontSize:11 }}>📍 내 주변 여행지 탐색중...</span>
            </div>
          </div>

          {/* Recent / Trending */}
          <div>
            <p style={{ color:"#475569", fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:10 }}>🔥 지금 핫한 여행지</p>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
              {["강릉 ☕", "경주 ⛩️", "제주 🌊", "전주 🏮", "양양 🏄"].map(tag => (
                <div key={tag} className="btn-tap" onClick={() => {
                  const reg = tag.includes("강릉") ? "강원도 강릉" : tag.includes("경주") ? "경주시" : tag.includes("제주") ? "제주도 서귀포" : "강원도 강릉";
                  setRegion(reg);
                  goTo("depart");
                }} style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:20, padding:"6px 14px", color:"#CBD5E1", fontSize:12, whiteSpace:"nowrap", cursor:"pointer", flexShrink:0 }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="btn-tap pulse" onClick={() => goTo("depart")} style={{
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            border: "none", borderRadius: 20, padding: "18px", color: "#fff",
            fontSize: 17, fontWeight: 800, cursor: "pointer", width: "100%",
            boxShadow: "0 8px 32px rgba(59,130,246,0.4)"
          }}>
            ✈️ 여행 짜기
          </button>
        </div>
      )}

      {/* ── DEPART ── */}
      {screen === "depart" && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column" }}>
          {/* Map Top */}
          <div style={{ height:180, position:"relative", flexShrink:0 }}>
            <canvas ref={canvasRef} width={390} height={180} style={{ width:"100%", height:"100%" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, #0F172A)" }} />
            <button onClick={() => goTo("home")} style={{ position:"absolute", top:12, left:16, background:"rgba(15,23,42,0.7)", border:"none", borderRadius:10, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", backdropFilter:"blur(8px)" }}>← 뒤로</button>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"16px 24px 24px" }}>
            <h2 style={{ color:"#F8FAFC", fontSize:20, fontWeight:800, marginBottom:20 }}>출발지 설정</h2>

            {/* Location input */}
            <div style={{ marginBottom:16 }}>
              <label style={{ color:"#64748B", fontSize:11, fontWeight:700, letterSpacing:1 }}>🔵 출발 위치</label>
              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                <input value={depart} onChange={e => setDepart(e.target.value)} placeholder="현위치 또는 주소 입력" style={{ flex:1, background:"#1E293B", border:"1px solid #334155", borderRadius:12, padding:"12px 14px", color:"#F1F5F9", fontSize:14, outline:"none" }} />
                <button onClick={() => setDepart("현재 위치")} style={{ background:"#3B82F6", border:"none", borderRadius:12, padding:"12px", color:"#fff", cursor:"pointer", fontSize:18 }}>📍</button>
              </div>
            </div>

            {/* Time */}
            <div style={{ marginBottom:16 }}>
              <label style={{ color:"#64748B", fontSize:11, fontWeight:700, letterSpacing:1 }}>⏰ 출발 시간</label>
              <div style={{ display:"flex", gap:6, marginTop:6, overflowX:"auto", paddingBottom:4 }}>
                {TIMES.map(t => (
                  <button key={t} onClick={() => setDepartTime(t)} className="btn-tap" style={{ background: departTime===t ? "#3B82F6" : "#1E293B", border: departTime===t ? "1px solid #3B82F6" : "1px solid #334155", borderRadius:10, padding:"8px 12px", color: departTime===t ? "#fff" : "#94A3B8", fontSize:12, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, fontWeight: departTime===t ? 700 : 400 }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div style={{ marginBottom:20 }}>
              <label style={{ color:"#64748B", fontSize:11, fontWeight:700, letterSpacing:1 }}>🚗 이동수단</label>
              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                {[["car","🚗","자가용"],["transit","🚌","대중교통"],["walk","🚶","도보"]].map(([v,e,l]) => (
                  <button key={v} onClick={() => setTransport(v)} className="btn-tap" style={{ flex:1, background: transport===v ? "#1E3A5F" : "#1E293B", border: transport===v ? "1px solid #3B82F6" : "1px solid #334155", borderRadius:12, padding:"12px 8px", color: transport===v ? "#60A5FA" : "#64748B", cursor:"pointer", fontSize:11, fontWeight:700 }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{e}</div>{l}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div style={{ marginBottom:24 }}>
              <label style={{ color:"#64748B", fontSize:11, fontWeight:700, letterSpacing:1 }}>📍 목적지 지역</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
                {REGIONS.map(r => (
                  <button key={r} onClick={() => setRegion(r)} className="btn-tap" style={{ background: region===r ? "#1E3A5F" : "#1E293B", border: region===r ? "1px solid #3B82F6" : "1px solid #334155", borderRadius:12, padding:"14px 10px", color: region===r ? "#60A5FA" : "#94A3B8", cursor:"pointer", fontSize:12, fontWeight: region===r ? 700 : 400 }}>{r}</button>
                ))}
              </div>
            </div>

            <button onClick={() => region && goTo("spots")} className="btn-tap" style={{ background: region ? "linear-gradient(135deg,#3B82F6,#6366F1)" : "#1E293B", border:"none", borderRadius:16, padding:"16px", color: region ? "#fff" : "#475569", fontSize:15, fontWeight:800, width:"100%", cursor: region ? "pointer" : "default", boxShadow: region ? "0 6px 24px rgba(59,130,246,0.35)" : "none" }}>
              {region ? `${region} 관광지 보기 →` : "목적지를 선택하세요"}
            </button>
          </div>
        </div>
      )}

      {/* ── SPOTS ── */}
      {screen === "spots" && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column" }}>
          {/* Map */}
          <div style={{ height:190, position:"relative", flexShrink:0 }}>
            <canvas ref={canvasRef} width={390} height={190} style={{ width:"100%", height:"100%" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, #0F172A)" }} />
            <button onClick={() => goTo("depart")} style={{ position:"absolute", top:12, left:16, background:"rgba(15,23,42,0.7)", border:"none", borderRadius:10, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", backdropFilter:"blur(8px)" }}>← 뒤로</button>
            {/* Distance bubble */}
            <div style={{ position:"absolute", top:12, right:16, background:"rgba(15,23,42,0.8)", borderRadius:10, padding:"6px 10px", backdropFilter:"blur(8px)" }}>
              <span style={{ color:"#60A5FA", fontSize:11, fontWeight:700 }}>📍 {region}</span>
            </div>
            {/* Selected count */}
            {selectedSpots.length > 0 && (
              <div style={{ position:"absolute", bottom:16, left:16, background:"#3B82F6", borderRadius:20, padding:"4px 12px" }}>
                <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>✅ {selectedSpots.length}곳 선택됨</span>
              </div>
            )}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <h2 style={{ color:"#F8FAFC", fontSize:17, fontWeight:800 }}>🏷️ 추천 관광지</h2>
              <span style={{ color:"#64748B", fontSize:12 }}>탭해서 추가</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {spots.map((spot, i) => {
                const selected = !!selectedSpots.find(s => s.id === spot.id);
                return (
                  <div key={spot.id} className="spot-card btn-tap slide-up" onClick={() => addSpot(spot)} style={{ background: selected ? "#1E3A5F" : "#1E293B", border: selected ? "1.5px solid #3B82F6" : "1px solid #334155", borderRadius:16, padding:"14px", cursor:"pointer", animationDelay:`${i*0.05}s` }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ width:48, height:48, borderRadius:12, background: selected ? "#2563EB22" : "#0F172A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{spot.img}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div>
                            <span style={{ color: selected ? "#60A5FA" : "#F1F5F9", fontSize:15, fontWeight:700 }}>{spot.name}</span>
                            <span style={{ color:"#475569", fontSize:11, marginLeft:6 }}>{spot.cat}</span>
                          </div>
                          <div style={{ background: selected ? "#3B82F6" : "#334155", borderRadius:8, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <span style={{ color:"#fff", fontSize:13 }}>{selected ? "✓" : "+"}</span>
                          </div>
                        </div>
                        <p style={{ color:"#64748B", fontSize:12, marginTop:2, lineHeight:1.4 }}>{spot.desc}</p>
                        <div style={{ display:"flex", gap:6, marginTop:6, alignItems:"center" }}>
                          <span style={{ color:"#94A3B8", fontSize:11 }}>🚗 {spot.dist}</span>
                          <span style={{ color:"#475569", fontSize:11 }}>•</span>
                          <span style={{ color:"#94A3B8", fontSize:11 }}>⏱ {spot.time}</span>
                          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
                            {spot.tags.map(t => <span key={t} className="tag" style={{ background:"#0F172A", color:"#475569" }}>#{t}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ height:80 }} />
          </div>

          {/* Bottom CTA */}
          {selectedSpots.length > 0 && (
            <div style={{ padding:"12px 16px 16px", background:"linear-gradient(to top, #0F172A, transparent)", position:"absolute", bottom:0, left:0, right:0 }}>
              <button onClick={buildPipeline} className="btn-tap" style={{ background:"linear-gradient(135deg,#3B82F6,#6366F1)", border:"none", borderRadius:16, padding:"16px", color:"#fff", fontSize:15, fontWeight:800, width:"100%", cursor:"pointer", boxShadow:"0 6px 24px rgba(59,130,246,0.4)" }}>
                {selectedSpots.length}곳으로 일정 짜기 →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PIPELINE ── */}
      {screen === "pipeline" && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column" }}>
          {/* Map */}
          <div style={{ height:175, position:"relative", flexShrink:0 }}>
            <canvas ref={canvasRef} width={390} height={175} style={{ width:"100%", height:"100%" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, #0F172A)" }} />
            <button onClick={() => goTo("spots")} style={{ position:"absolute", top:12, left:16, background:"rgba(15,23,42,0.7)", border:"none", borderRadius:10, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", backdropFilter:"blur(8px)" }}>← 뒤로</button>
            <div style={{ position:"absolute", bottom:12, left:0, right:0, textAlign:"center" }}>
              <span style={{ color:"#64748B", fontSize:11 }}>핀을 탭하면 상세 정보 확인</span>
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ color:"#F8FAFC", fontSize:17, fontWeight:800 }}>🔗 여행 파이프라인</h2>
              <span style={{ color:"#64748B", fontSize:12 }}>+ 로 식사 추가</span>
            </div>

            <div style={{ position:"relative" }}>
              {/* Vertical line */}
              <div style={{ position:"absolute", left:23, top:24, bottom:24, width:2, background:"linear-gradient(to bottom, #3B82F6, #6366F1, #10B981)", borderRadius:2 }} />

              {pipeline.map((node, i) => (
                <div key={i}>
                  {/* + button between nodes */}
                  {i > 0 && (
                    <div style={{ display:"flex", alignItems:"center", marginLeft:12, marginBottom:4, marginTop:4 }}>
                      <div style={{ width:24 }} />
                      <button onClick={() => setAddingFood(i-1)} className="btn-tap" style={{ background:"#1E293B", border:"1px dashed #3B82F6", borderRadius:8, padding:"4px 12px", color:"#3B82F6", fontSize:11, fontWeight:700, cursor:"pointer", marginLeft:8 }}>
                        + 식사 · 카페 추가
                      </button>
                      {addingFood === i-1 && (
                        <button onClick={() => setAddingFood(null)} style={{ background:"transparent", border:"none", color:"#475569", cursor:"pointer", marginLeft:8, fontSize:11 }}>닫기</button>
                      )}
                    </div>
                  )}

                  {/* Food selector */}
                  {addingFood === i-1 && (
                    <div className="slide-up" style={{ marginLeft:40, marginBottom:8, background:"#1E293B", borderRadius:16, padding:14, border:"1px solid #334155" }}>
                      <div style={{ display:"flex", gap:6, marginBottom:10, overflowX:"auto" }}>
                        {foodFilters.map(f => (
                          <button key={f} onClick={() => setFoodFilter(f)} style={{ background: foodFilter===f ? "#3B82F6" : "#0F172A", border: foodFilter===f ? "1px solid #3B82F6" : "1px solid #1E293B", borderRadius:20, padding:"4px 10px", color: foodFilter===f ? "#fff" : "#64748B", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>{f}</button>
                        ))}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        {filteredFood.map(food => (
                          <button key={food.id} onClick={() => insertFood(i-1, food)} className="btn-tap" style={{ background:"#0F172A", border:"1px solid #334155", borderRadius:10, padding:"10px 12px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:20 }}>{food.emoji}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:"#F1F5F9", fontSize:13, fontWeight:600 }}>{food.name}</div>
                              <div style={{ color:"#475569", fontSize:11 }}>{food.cat} · ⭐ {food.rating} · {food.price}</div>
                            </div>
                            <span style={{ color:"#3B82F6", fontSize:13 }}>+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Node */}
                  <div className="pipe-node" style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:4, padding:"8px 0" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background: node.type==="start" ? "#1E3A5F" : node.type==="food" ? "#0D2E1F" : node.type==="end" ? "#1E293B" : "#1E2A1E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, border: node.type==="start" ? "2px solid #3B82F6" : node.type==="food" ? "1px solid #10B981" : "1px solid #334155", zIndex:1, position:"relative" }}>
                      {node.icon}
                    </div>
                    <div style={{ flex:1, paddingTop:4 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color: node.type==="start" ? "#60A5FA" : node.type==="food" ? "#34D399" : "#F1F5F9", fontSize:14, fontWeight:700 }}>{node.label}</span>
                        {node.type === "food" && (
                          <button onClick={() => setPipeline(pipeline.filter((_,pi) => pi !== i))} style={{ background:"transparent", border:"none", color:"#475569", cursor:"pointer", fontSize:12 }}>✕</button>
                        )}
                      </div>
                      <div style={{ color:"#475569", fontSize:11, marginTop:2 }}>
                        {node.type==="start" && `출발 · ${departTime} · ${transport==="car"?"🚗 자가용":transport==="transit"?"🚌 대중교통":"🚶 도보"}`}
                        {node.type==="spot" && node.spot && `🚗 ${node.spot.time} · 체류 약 1시간`}
                        {node.type==="food" && `🍽️ 약 50분`}
                        {node.type==="end" && "귀가"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height:80 }} />
          </div>

          <div style={{ padding:"12px 16px 16px", background:"linear-gradient(to top, #0F172A, transparent)", position:"absolute", bottom:0, left:0, right:0 }}>
            <button onClick={() => goTo("timeline")} className="btn-tap" style={{ background:"linear-gradient(135deg,#10B981,#3B82F6)", border:"none", borderRadius:16, padding:"16px", color:"#fff", fontSize:15, fontWeight:800, width:"100%", cursor:"pointer", boxShadow:"0 6px 24px rgba(16,185,129,0.4)" }}>
              ⏱ 타임라인 확인하기 →
            </button>
          </div>
        </div>
      )}

      {/* ── TIMELINE ── */}
      {screen === "timeline" && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column" }}>
          {/* Map */}
          <div style={{ height:160, position:"relative", flexShrink:0 }}>
            <canvas ref={canvasRef} width={390} height={160} style={{ width:"100%", height:"100%" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, #0F172A)" }} />
            <button onClick={() => goTo("pipeline")} style={{ position:"absolute", top:12, left:16, background:"rgba(15,23,42,0.7)", border:"none", borderRadius:10, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", backdropFilter:"blur(8px)" }}>← 뒤로</button>
            {tripStarted && (
              <div style={{ position:"absolute", bottom:16, left:16, right:16, background:"rgba(15,23,42,0.85)", borderRadius:12, padding:"8px 14px", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>🔴</span>
                <span style={{ color:"#F8FAFC", fontSize:12, fontWeight:700 }}>여행 진행중</span>
                <div style={{ flex:1, height:4, background:"#1E293B", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#3B82F6,#10B981)", borderRadius:2, transition:"width 0.5s" }} />
                </div>
                <span style={{ color:"#64748B", fontSize:11 }}>{Math.round(progress)}%</span>
              </div>
            )}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ color:"#F8FAFC", fontSize:17, fontWeight:800 }}>📅 여행 타임라인</h2>
              <span style={{ color:"#64748B", fontSize:11 }}>{timedPipeline.length}개 지점</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {timedPipeline.map((node, i) => {
                const isActive = tripStarted && i === currentStep;
                const isDone = tripStarted && i < currentStep;
                return (
                  <div key={i} className="slide-up" style={{ background: isActive ? "#1E3A5F" : isDone ? "#111827" : "#1E293B", border: isActive ? "1.5px solid #3B82F6" : isDone ? "1px solid #1F2937" : "1px solid #334155", borderRadius:16, padding:"14px 16px", animationDelay:`${i*0.06}s`, opacity: isDone ? 0.6 : 1 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ textAlign:"center", flexShrink:0, width:40 }}>
                        <div style={{ fontSize:22 }}>{node.icon}</div>
                        {isDone && <div style={{ fontSize:10, color:"#10B981", fontWeight:700 }}>완료</div>}
                        {isActive && <div style={{ fontSize:10, color:"#60A5FA", fontWeight:700 }}>현재</div>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ color: isActive ? "#60A5FA" : "#F1F5F9", fontSize:14, fontWeight:700 }}>{node.label}</span>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:600 }}>도착 {node.arrive}</div>
                            {node.depart !== node.arrive && <div style={{ color:"#475569", fontSize:11 }}>출발 {node.depart}</div>}
                          </div>
                        </div>
                        {node.travel && (
                          <div style={{ display:"flex", gap:12, marginTop:4 }}>
                            <span style={{ color:"#475569", fontSize:11 }}>🚗 이동 {node.travel}분</span>
                            {node.stay && <span style={{ color:"#475569", fontSize:11 }}>• 체류 {node.stay}분</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary */}
            <div style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:16, padding:16, marginTop:12, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, textAlign:"center" }}>
              {[["🗺️", "총 관광지", `${selectedSpots.length}곳`], ["🍽️", "식사·카페", `${pipeline.filter(n=>n.type==="food").length}곳`], ["⏱", "예상 소요", "약 7시간"]].map(([e,l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:20 }}>{e}</div>
                  <div style={{ color:"#475569", fontSize:10, marginTop:2 }}>{l}</div>
                  <div style={{ color:"#F1F5F9", fontSize:13, fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ height:90 }} />
          </div>

          <div style={{ padding:"12px 16px 16px", background:"linear-gradient(to top, #0F172A 80%, transparent)", position:"absolute", bottom:0, left:0, right:0 }}>
            {!tripStarted ? (
              <button onClick={startTrip} className="btn-tap" style={{ background:"linear-gradient(135deg,#EF4444,#F59E0B)", border:"none", borderRadius:16, padding:"16px", color:"#fff", fontSize:16, fontWeight:800, width:"100%", cursor:"pointer", boxShadow:"0 6px 24px rgba(239,68,68,0.4)" }}>
                🚀 여행 시작!
              </button>
            ) : (
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setCurrentStep(Math.min(currentStep+1, pipeline.length-1))} style={{ flex:1, background:"#1E3A5F", border:"1px solid #3B82F6", borderRadius:16, padding:"14px", color:"#60A5FA", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  ✅ 다음 지점
                </button>
                <button onClick={() => { setTripStarted(false); setCurrentStep(0); setProgress(0); setScreen("home"); setSelectedSpots([]); setPipeline([]); setMapPins([]); setDepart(""); setRegion(""); }} style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:16, padding:"14px 18px", color:"#64748B", fontSize:14, cursor:"pointer" }}>
                  🏁 종료
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>

    {/* Bottom Nav */}
    {screen !== "home" && (
      <div style={{ display:"flex", justifyContent:"space-around", padding:"8px 0 12px", background:"#0A1122", borderTop:"1px solid #1E293B", flexShrink:0 }}>
        {[["🏠","홈","home"],["🗺️","탐색","depart"],["📍","일정","pipeline"],["👤","프로필","home"]].map(([e,l,s]) => (
          <button key={l} onClick={() => goTo(s)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:18 }}>{e}</span>
            <span style={{ color: screen===s ? "#3B82F6" : "#475569", fontSize:10, fontWeight:600 }}>{l}</span>
          </button>
        ))}
      </div>
    )}
  </div>
</div>
```

);
}
