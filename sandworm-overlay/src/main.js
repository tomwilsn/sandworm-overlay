// Sandworm Overlay — phase-lock crawl timer.
// One full loop == WIN seconds (your safe sand-crawl window). No interaction
// to "start": you note where the marker is when you land, and bail when it
// returns to that spot. Colour + number + ticks make every position unique
// so you can re-find it under pressure.

const WIN = 150; // 2:30 safe window, in seconds
const ZONES = 12; // dial colour zones
const SEGS = 15; // bar colour segments
const ns = "http://www.w3.org/2000/svg";

const zoneHue = (i) => Math.round((i / ZONES) * 360);
const zoneColor = (i, l = 55) => `hsl(${zoneHue(i)}, 68%, ${l}%)`;

/* ================= DIAL ================= */
const dial = document.getElementById("dial");
const CX = 150,
  CY = 150;

function buildDial() {
  // 12 coloured annular segments
  const r = 112,
    sw = 30,
    C = 2 * Math.PI * r,
    seg = C / ZONES,
    gap = 5;
  for (let i = 0; i < ZONES; i++) {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", CX);
    c.setAttribute("cy", CY);
    c.setAttribute("r", r);
    c.setAttribute("fill", "none");
    c.setAttribute("stroke", zoneColor(i, 42));
    c.setAttribute("stroke-width", sw);
    c.setAttribute("stroke-dasharray", `${seg - gap} ${C - (seg - gap)}`);
    c.setAttribute("stroke-dashoffset", -(i * seg) + gap / 2);
    c.setAttribute("transform", `rotate(-90 ${CX} ${CY})`);
    c.dataset.zi = i;
    c.classList.add("zoneseg");
    dial.appendChild(c);
  }
  // 60 minor ticks, majors every 5
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI - Math.PI / 2,
      maj = i % 5 === 0;
    const r1 = maj ? 86 : 92,
      r2 = 96;
    const ln = document.createElementNS(ns, "line");
    ln.setAttribute("x1", CX + r1 * Math.cos(a));
    ln.setAttribute("y1", CY + r1 * Math.sin(a));
    ln.setAttribute("x2", CX + r2 * Math.cos(a));
    ln.setAttribute("y2", CY + r2 * Math.sin(a));
    ln.setAttribute("stroke", maj ? "#8a7448" : "#3a2f1c");
    ln.setAttribute("stroke-width", maj ? 2.4 : 1.2);
    dial.appendChild(ln);
  }
  // zone numbers 1..12 at sector centres
  for (let i = 0; i < ZONES; i++) {
    const a = ((i + 0.5) / ZONES) * 2 * Math.PI - Math.PI / 2,
      tr = 68;
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", CX + tr * Math.cos(a));
    t.setAttribute("y", CY + tr * Math.sin(a) + 5);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "15");
    t.setAttribute("font-weight", "800");
    t.setAttribute("fill", zoneColor(i, 72));
    t.textContent = i + 1;
    dial.appendChild(t);
  }
  // comet trail
  for (let i = 0; i < 26; i++) {
    const s = document.createElementNS(ns, "circle");
    s.setAttribute("r", 3.4);
    s.classList.add("trail");
    s.dataset.k = i;
    dial.appendChild(s);
  }
  // marker dot
  const dot = document.createElementNS(ns, "circle");
  dot.setAttribute("id", "d-dot");
  dot.setAttribute("r", 9);
  dot.setAttribute("stroke", "#fff");
  dot.setAttribute("stroke-width", 2.5);
  dial.appendChild(dot);
  const hub = document.createElementNS(ns, "circle");
  hub.setAttribute("cx", CX);
  hub.setAttribute("cy", CY);
  hub.setAttribute("r", 5);
  hub.setAttribute("fill", "#6b5836");
  dial.appendChild(hub);
}

function tickDial(frac) {
  const r = 112;
  const a = frac * 2 * Math.PI - Math.PI / 2;
  const zi = Math.floor(frac * ZONES) % ZONES;
  const col = zoneColor(zi, 58);
  const dx = CX + r * Math.cos(a),
    dy = CY + r * Math.sin(a);
  const dot = document.getElementById("d-dot");
  dot.setAttribute("cx", dx);
  dot.setAttribute("cy", dy);
  dot.setAttribute("fill", col);
  dot.style.filter = `drop-shadow(0 0 9px ${col})`;
  dial.querySelectorAll(".zoneseg").forEach((s) => {
    const zsi = +s.dataset.zi;
    s.setAttribute("stroke", zoneColor(zsi, zsi === zi ? 60 : 42));
  });
  dial.querySelectorAll(".trail").forEach((s) => {
    const k = +s.dataset.k,
      aa = (frac - k * 0.011) * 2 * Math.PI - Math.PI / 2;
    s.setAttribute("cx", CX + r * Math.cos(aa));
    s.setAttribute("cy", CY + r * Math.sin(aa));
    s.setAttribute("fill", col);
    s.setAttribute("opacity", (1 - k / 26) * 0.45);
  });
  document.getElementById("d-zone").textContent = zi + 1;
  document.getElementById("d-swatch").style.background = col;
}

/* ================= BAR ================= */
const segbar = document.getElementById("segbar");
const ruler = document.getElementById("ruler");

function buildBar() {
  for (let i = 0; i < SEGS; i++) {
    const d = document.createElement("div");
    d.className = "seg";
    d.style.background = zoneColor((i * ZONES) / SEGS, 46);
    const s = document.createElement("span");
    s.textContent = i + 1;
    d.appendChild(s);
    segbar.appendChild(d);
  }
  const head = document.createElement("div");
  head.className = "head";
  head.id = "b-head";
  segbar.appendChild(head);
  const lab = document.createElement("div");
  lab.className = "headlabel";
  lab.id = "b-headlabel";
  segbar.appendChild(lab);
  for (let i = 0; i <= 30; i++) {
    const t = document.createElement("div");
    t.className = "rt" + (i % 6 === 0 ? " maj" : "");
    t.style.left = (i / 30) * 100 + "%";
    ruler.appendChild(t);
  }
}

function tickBar(frac) {
  const seg = Math.min(SEGS, Math.floor(frac * SEGS) + 1);
  document.getElementById("b-head").style.left = frac * 100 + "%";
  const lab = document.getElementById("b-headlabel");
  lab.style.left = frac * 100 + "%";
  lab.textContent = "seg " + seg;
  document.getElementById("b-seg").textContent = seg;
}

/* ================= LOOP ================= */
buildDial();
buildBar();

let mode = "dial"; // "dial" | "bar"

function loop() {
  // The loop phase is (now mod WIN), so the display is identical on every
  // machine and survives the app being closed/reopened — what matters is only
  // "same spot again", which is exactly one WIN later regardless of phase.
  const frac = (Date.now() % (WIN * 1000)) / (WIN * 1000);
  if (mode === "dial") tickDial(frac);
  else tickBar(frac);
  requestAnimationFrame(loop);
}
loop();

function setMode(m) {
  mode = m;
  document.getElementById("dialView").hidden = m !== "dial";
  document.getElementById("barView").hidden = m !== "bar";
}

/* ================= TAURI WIRING ================= */
// Falls back gracefully when opened in a plain browser (no __TAURI__).
const tauri = window.__TAURI__;
if (tauri?.event?.listen) {
  tauri.event.listen("switch-mode", () => {
    setMode(mode === "dial" ? "bar" : "dial");
  });
  tauri.event.listen("dragmode", (e) => {
    document.body.classList.toggle("dragmode", !!e.payload);
  });
}

// Fade the first-run hint after a few seconds.
const hint = document.getElementById("firsthint");
setTimeout(() => hint.classList.add("gone"), 7000);
