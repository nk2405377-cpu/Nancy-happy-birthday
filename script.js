// ===== Easy settings =====
const SONG_PATH = "audio/birthday-song.mp3"; // change song here (or replace the file)
// Photos: images/photo-1.jpg ... photo-6.jpg (replace the files, same names)

const $ = id => document.getElementById(id);
const pages = [...document.querySelectorAll(".page")];
const song = $("song"), btn = $("musicBtn"), toast = $("toast"), sky = $("sky");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
song.src = SONG_PATH;

// Missing photo -> pretty 4:3 placeholder
document.querySelectorAll(".ph img, .mem img").forEach(img => {
  const name = img.getAttribute("src").split("/").pop();
  const fallback = () => { img.onerror = null;
    img.src = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='#f7d6e0'/><text x='400' y='290' font-size='110' text-anchor='middle'>💗</text><text x='400' y='380' font-size='34' text-anchor='middle' fill='#4a2c4f'>Add images/${name}</text></svg>`);
  };
  img.onerror = fallback;
  if (img.complete && img.naturalWidth === 0) fallback(); // error may fire before this script runs
});

// Floating hearts + stars
const icons = ["💗","💖","🌸","✨"];
function float(n, min){
  for (let i = 0; i < n; i++) {
    const h = document.createElement("i");
    h.textContent = icons[Math.floor(Math.random()*icons.length)];
    h.style.cssText = `left:${Math.random()*100}%;font-size:${14+Math.random()*16}px;animation-duration:${min+Math.random()*6}s;animation-delay:${Math.random()*2}s`;
    sky.append(h); setTimeout(() => h.remove(), (min+9)*1000);
  }
}
if (!reduce) {
  for (let i = 0; i < 14; i++) { const s = document.createElement("b"); s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`; sky.append(s); }
  setInterval(() => float(1, 8), 1300);
}

// ===== Page navigation (state-based, no reload) =====
let cur = 0, busy = false;
const T = reduce ? 20 : 750;
function enter(p){ // stagger entrance
  p.querySelectorAll("[data-s]").forEach((el, i) => el.style.setProperty("--i", i));
  p.classList.add("show");
}
function go(n){
  if (busy || n === cur) return;
  busy = true;
  const fwd = n > cur, out = pages[cur], inn = pages[n];
  inn.hidden = false;
  out.classList.add(fwd ? "out-l" : "out-r");
  inn.classList.add(fwd ? "in-r" : "in-l");
  inn.scrollTop = 0; enter(inn);
  if (n === 3) float(12, 5); // memory page: a few floating hearts
  if (n === 4) { float(20, 5); if (!started) startMusic(); } // final page (music trigger)
  setTimeout(() => {
    out.hidden = true; out.className = "page";
    inn.className = "page show"; cur = n; busy = false;
    const h = inn.querySelector("h1,h2"); if (h) h.focus({preventScroll:true});
  }, T);
}
// "One Last Surprise" is the music trigger too (user click => autoplay allowed)
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(+b.dataset.go));
enter(pages[0]);

// ===== Music =====
// Uses audio/birthday-song.mp3 if present; otherwise a built-in "Happy Birthday" melody
// (traditional tune, public domain) made with the Web Audio API.
let mode = null, playing = false, started = false, ctx = null;
const N = {G4:392,A4:440,B4:494,C5:523,D5:587,E5:659,F5:698,G5:784};
const tune = [["G4",.5],["G4",.5],["A4",1],["G4",1],["C5",1],["B4",2],
 ["G4",.5],["G4",.5],["A4",1],["G4",1],["D5",1],["C5",2],
 ["G4",.5],["G4",.5],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],
 ["F5",.5],["F5",.5],["E5",1],["C5",1],["D5",1],["C5",2]];
function synth(){
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const beat = .55; let t = ctx.currentTime + .1;
  for (let r = 0; r < 4; r++) {
    for (const [n, d] of tune) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = N[n];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t+.03);
      g.gain.exponentialRampToValueAtTime(.001, t + d*beat);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d*beat);
      t += d*beat;
    }
    t += 1.2;
  }
}
function label(){ btn.textContent = playing ? "🎶 Pause music" : "🎵 Play music"; btn.setAttribute("aria-pressed", playing); }
function say(m){ toast.textContent = m; toast.hidden = false; setTimeout(() => toast.hidden = true, 7000); }
async function startMusic(){
  started = true;
  try { await song.play(); mode = "file"; }
  catch { mode = "synth"; synth(); say("Tip: add your song as audio/birthday-song.mp3. Playing a built-in melody for now. 🎵"); }
  playing = true; label();
}
btn.onclick = async () => {
  if (!started) return startMusic();
  if (mode === "file") { playing ? song.pause() : await song.play(); }
  else { playing ? await ctx.suspend() : await ctx.resume(); }
  playing = !playing; label();
};
