/* ============================================================
   SecureMetro — all logic in one file (no backend needed).
   Simulator -> AI anomaly detection -> alerts, charts, admin.
   ============================================================ */

// ---------- global state ----------
const state = {
  user: JSON.parse(localStorage.getItem("sm_user") || "null"),
  users: JSON.parse(localStorage.getItem("sm_users") || "null") || [
    { name: "UPMRC Admin", email: "admin@upmrc.local", pass: "admin123", role: "admin" }
  ],
  devices: [
    { id: 1, name: "Train LKO-101", type: "train",  location: "Blue Line - Hazratganj",  status: "online" },
    { id: 2, name: "Train LKO-102", type: "train",  location: "Blue Line - Charbagh",    status: "online" },
    { id: 3, name: "Track Sensor TS-14", type: "sensor", location: "Viaduct KM 6.2",     status: "online" },
    { id: 4, name: "Tunnel Sensor TS-27", type: "sensor", location: "Hussainganj Tunnel", status: "online" },
    { id: 5, name: "Signal Node SG-05", type: "signal", location: "Transport Nagar Yard", status: "online" },
    { id: 6, name: "Platform Camera CAM-3", type: "camera", location: "Lekhraj Market Stn", status: "online" },
    { id: 7, name: "AFC Gate G-12", type: "gate",   location: "Hazratganj Concourse",    status: "online" }
  ],
  latest: {},          // deviceId -> latest reading
  series: {},          // deviceId -> recent packetRate values (for the chart)
  timeLabels: [],
  alerts: [],
  logs: [],
  history: {},         // AI rolling windows: deviceId -> metric -> number[]
  filter: "all",
  nextId: 8
};

// ---------- tiny helpers ----------
const $ = (id) => document.getElementById(id);
const now = () => new Date().toLocaleTimeString();
const log = (actor, action, detail) => {
  state.logs.unshift({ ts: now(), actor, action, detail });
  if (state.logs.length > 200) state.logs.pop();
};

// ============================================================
// AI ENGINE — z-score baseline learning + railway domain rules
// ============================================================
function detect(devId, metrics) {
  if (!state.history[devId]) state.history[devId] = {};
  let worstZ = 0, worstMetric = null;

  for (const [k, v] of Object.entries(metrics)) {
    const h = state.history[devId][k] || (state.history[devId][k] = []);
    if (h.length >= 10) {                     // need history before judging
      const mean = h.reduce((a, b) => a + b) / h.length;
      const std = Math.sqrt(h.reduce((a, b) => a + (b - mean) ** 2, 0) / h.length) || 1e-6;
      const z = Math.abs((v - mean) / std);   // distance from "normal"
      if (z > worstZ) { worstZ = z; worstMetric = k; }
    }
    h.push(v); if (h.length > 40) h.shift();  // learn from every reading
  }

  let score = Math.min(1, worstZ / 6);
  let type = "Behavioural anomaly";
  let detail = worstMetric ? `${worstMetric} deviated ${worstZ.toFixed(1)} sigma from baseline` : "";

  // Railway domain rules sharpen the statistical verdict:
  if (metrics.packetRate > 900) { score = Math.max(score, 0.9);  type = "DDoS-like flood";      detail = `packet rate ${Math.round(metrics.packetRate)}/s far above safe ceiling`; }
  if (metrics.latency > 450)    { score = Math.max(score, 0.75); type = "MitM / link suspicion"; detail = `latency ${Math.round(metrics.latency)}ms — possible interception`; }
  if (metrics.speed > 110)      { score = Math.max(score, 0.85); type = "Spoofed telemetry";     detail = `reported speed ${Math.round(metrics.speed)} km/h exceeds physical limit`; }
  if (metrics.temperature > 75) { score = Math.max(score, 0.8);  type = "Sensor spike / injection"; detail = `temperature ${metrics.temperature.toFixed(1)} C beyond rating`; }

  const anomaly = score >= 0.55;
  const severity = score >= 0.9 ? "critical" : score >= 0.75 ? "high" : score >= 0.65 ? "medium" : "low";
  return { anomaly, score: +score.toFixed(2), type: anomaly ? type : "normal", detail, severity };
}

// ============================================================
// SIMULATOR — smooth random-walk telemetry + injected attacks
// ============================================================
const BASE = {
  train:  { speed: 62, vibration: 2.2, packetRate: 220, latency: 40 },
  sensor: { temperature: 32, humidity: 48, packetRate: 60, latency: 35 },
  signal: { packetRate: 150, latency: 25, voltage: 24 },
  camera: { packetRate: 480, latency: 60, fps: 25 },
  gate:   { packetRate: 90, latency: 30, taps: 14 }
};
const walk = {};   // deviceId -> drifting values

function tick() {
  const t = new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
  state.timeLabels.push(t); if (state.timeLabels.length > 30) state.timeLabels.shift();

  for (const d of state.devices) {
    if (d.status !== "online") { (state.series[d.id] ||= []).push(null); if (state.series[d.id].length > 30) state.series[d.id].shift(); continue; }

    // smooth drift around the baseline (mean reversion + noise)
    const base = BASE[d.type] || { packetRate: 100, latency: 30 };
    const w = walk[d.id] ||= { ...base };
    const m = {};
    for (const k in w) {
      w[k] += (base[k] - w[k]) * 0.08 + (Math.random() - 0.5) * (k === "packetRate" ? 20 : 3);
      m[k] = +Math.max(0, w[k]).toFixed(2);
    }

    // ~6% chance: inject an attack for the AI to catch
    if (Math.random() < 0.06) {
      const opts = [];
      if ("packetRate" in m) opts.push(() => m.packetRate = 950 + Math.random() * 600);
      if ("temperature" in m) opts.push(() => m.temperature = 78 + Math.random() * 15);
      if ("speed" in m) opts.push(() => m.speed = 115 + Math.random() * 40);
      if ("latency" in m) opts.push(() => m.latency = 480 + Math.random() * 300);
      opts[Math.floor(Math.random() * opts.length)]();
    }

    const v = detect(d.id, m);
    state.latest[d.id] = { metrics: m, ...v };
    (state.series[d.id] ||= []).push(m.packetRate ?? null);
    if (state.series[d.id].length > 30) state.series[d.id].shift();

    if (v.anomaly) {
      state.alerts.unshift({ id: Date.now() + Math.random(), device: d.name, loc: d.location,
        severity: v.severity, type: v.type, msg: v.detail, score: v.score, ts: new Date().toLocaleString(), acked: false });
      if (state.alerts.length > 100) state.alerts.pop();
      log("AI-Engine", "THREAT_DETECTED", `${v.type} on ${d.name} — score ${v.score}`);
    }
  }
  render();
}

// ============================================================
// AUTH
// ============================================================
function login() {
  const u = state.users.find(x => x.email === $("loginEmail").value && x.pass === $("loginPass").value);
  if (!u) { $("loginError").textContent = "Invalid email or password"; return; }
  state.user = { name: u.name, email: u.email, role: u.role };
  localStorage.setItem("sm_user", JSON.stringify(state.user));
  log(u.email, "LOGIN", `${u.name} signed in`);
  location.hash = "#dashboard"; updateNav();
}
function signup() {
  const name = $("suName").value.trim(), email = $("suEmail").value.trim(), pass = $("suPass").value;
  if (!name || !email || pass.length < 6) { $("suError").textContent = "Fill all fields (password 6+ chars)"; return; }
  if (state.users.some(x => x.email === email)) { $("suError").textContent = "Email already registered"; return; }
  state.users.push({ name, email, pass, role: "viewer" });
  localStorage.setItem("sm_users", JSON.stringify(state.users));
  state.user = { name, email, role: "viewer" };
  localStorage.setItem("sm_user", JSON.stringify(state.user));
  log(email, "SIGNUP", `New account for ${name}`);
  location.hash = "#dashboard"; updateNav();
}
function logout() {
  log(state.user.email, "LOGOUT", `${state.user.name} signed out`);
  state.user = null; localStorage.removeItem("sm_user");
  location.hash = "#home"; updateNav();
}

// ============================================================
// ADMIN ACTIONS
// ============================================================
function addDevice() {
  const name = $("devName").value.trim(); if (!name) return;
  state.devices.push({ id: state.nextId++, name, type: $("devType").value, location: $("devLoc").value || "Unassigned", status: "online" });
  log(state.user.email, "DEVICE_ADDED", name);
  $("devName").value = ""; $("devLoc").value = ""; render();
}
function setStatus(id, status) {
  const d = state.devices.find(x => x.id === id); d.status = status;
  log(state.user.email, "DEVICE_UPDATED", `${d.name} -> ${status}`); render();
}
function removeDevice(id) {
  const d = state.devices.find(x => x.id === id);
  if (!confirm(`Delete ${d.name} permanently?`)) return;
  state.devices = state.devices.filter(x => x.id !== id);
  log(state.user.email, "DEVICE_REMOVED", d.name); render();
}
function ackAlert(id) {
  const a = state.alerts.find(x => x.id === id); if (a) a.acked = true;
  log(state.user.email, "ALERT_ACK", `${a.type} on ${a.device}`); render();
}
function setFilter(f) { state.filter = f; render(); }

// ============================================================
// CHARTS (Chart.js)
// ============================================================
const COLORS = ["#4C9AFF", "#3DD68C", "#FFB020", "#9B7DFF", "#E5484D", "#5FD4F4", "#F49E5F"];
let lineChart, pieChart;

function initCharts() {
  Chart.defaults.color = "#93a1b7"; Chart.defaults.borderColor = "#22304a";
  lineChart = new Chart($("lineChart"), {
    type: "line",
    data: { labels: [], datasets: [] },
    options: { animation: false, responsive: true,
      plugins: { legend: { labels: { font: { size: 10 } } } },
      scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } }
  });
  pieChart = new Chart($("pieChart"), {
    type: "doughnut",
    data: { labels: ["low", "medium", "high", "critical"],
      datasets: [{ data: [0, 0, 0, 0], backgroundColor: ["#4C9AFF", "#FFB020", "#F4745F", "#E5484D"], borderColor: "#111b2e" }] },
    options: { animation: false, plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } } }
  });
}

// ============================================================
// RENDER
// ============================================================
function render() {
  if (!state.user) return;

  // stats
  const open = state.alerts.filter(a => !a.acked).length;
  const anomalies = Object.values(state.latest).filter(r => r.anomaly).length;
  $("stDevices").textContent = state.devices.length;
  $("stOnline").textContent = state.devices.filter(d => d.status === "online").length;
  $("stAlerts").textContent = open;
  $("stRate").textContent = state.devices.length ? Math.round(anomalies / state.devices.length * 100) + "%" : "0%";

  // line chart
  lineChart.data.labels = state.timeLabels;
  lineChart.data.datasets = state.devices.map((d, i) => ({
    label: d.name, data: state.series[d.id] || [], borderColor: COLORS[i % COLORS.length],
    borderWidth: 1.8, pointRadius: 0, tension: 0.35, spanGaps: false
  }));
  lineChart.update();

  // pie chart
  const sev = { low: 0, medium: 0, high: 0, critical: 0 };
  state.alerts.forEach(a => sev[a.severity]++);
  pieChart.data.datasets[0].data = [sev.low, sev.medium, sev.high, sev.critical];
  pieChart.update();

  // device table
  $("deviceRows").innerHTML = state.devices.map(d => {
    const r = state.latest[d.id];
    const reading = r ? Object.entries(r.metrics).slice(0, 3).map(([k, v]) => `${k}:${Math.round(v)}`).join("  ") : "—";
    const verdict = r && r.anomaly ? `<span class="badge red">! ${r.type}</span>` : `<span class="badge green">normal</span>`;
    const sb = d.status === "online" ? "green" : d.status === "quarantined" ? "red" : "dimb";
    return `<tr><td><b>${d.name}</b><br><span class="muted sm">${d.type} · ${d.location}</span></td>
      <td><span class="badge ${sb}">${d.status}</span></td>
      <td class="mono sm">${reading}</td><td>${verdict}</td></tr>`;
  }).join("");

  // alert filters + list
  $("alertFilters").innerHTML = ["all", "open", "critical", "high", "medium", "low"].map(f =>
    `<button class="btn small ${state.filter === f ? "" : "ghost"}" onclick="setFilter('${f}')">${f}</button>`).join("");
  const shown = state.alerts.filter(a => state.filter === "all" || (state.filter === "open" ? !a.acked : a.severity === state.filter));
  $("alertList").innerHTML = shown.length === 0
    ? `<div class="panel muted">No alerts match this filter yet — attacks are injected every so often, give it a minute.</div>`
    : shown.map(a => `
      <div class="panel alert-card ${a.severity} ${a.acked ? "acked" : ""}">
        <div style="flex:1">
          <div class="flex"><span class="badge ${a.severity === "critical" || a.severity === "high" ? "red" : a.severity === "medium" ? "amber" : "blue"}">${a.severity}</span>
          <span class="t">${a.type}</span></div>
          <div class="m">${a.device} (${a.loc}): ${a.msg}</div>
          <div class="ts">${a.ts} · score ${a.score}</div>
        </div>
        ${a.acked ? `<span class="badge green">handled</span>` : `<button class="btn small" onclick="ackAlert(${a.id})">Acknowledge</button>`}
      </div>`).join("");

  // admin
  if (state.user.role === "admin") {
    $("adminRows").innerHTML = state.devices.map(d => `
      <tr><td><b>${d.name}</b><br><span class="muted sm">${d.type} · ${d.location}</span></td>
      <td><span class="badge ${d.status === "online" ? "green" : "red"}">${d.status}</span></td>
      <td style="text-align:right;white-space:nowrap">
        ${d.status === "online"
          ? `<button class="btn small danger" onclick="setStatus(${d.id},'quarantined')">Quarantine</button>`
          : `<button class="btn small" onclick="setStatus(${d.id},'online')">Restore</button>`}
        <button class="btn small ghost" onclick="removeDevice(${d.id})">Delete</button></td></tr>`).join("");
    $("logRows").innerHTML = state.logs.map(l => `
      <tr><td class="mono sm">${l.ts}</td><td class="mono sm">${l.actor}</td>
      <td><span class="badge ${l.action === "THREAT_DETECTED" ? "red" : "blue"}">${l.action}</span></td>
      <td class="muted" style="font-size:13px">${l.detail}</td></tr>`).join("");
  }
}

// ============================================================
// ROUTING (hash-based) + NAV
// ============================================================
const PAGES = ["home", "login", "signup", "dashboard", "alerts", "admin"];
function route() {
  let page = (location.hash || "#home").slice(1);
  if (["dashboard", "alerts"].includes(page) && !state.user) page = "login";
  if (page === "admin" && (!state.user || state.user.role !== "admin")) page = state.user ? "dashboard" : "login";
  PAGES.forEach(p => $("page-" + p).classList.toggle("hidden", p !== page));
}
function updateNav() {
  document.querySelectorAll(".auth-only").forEach(el => el.classList.toggle("hidden", !state.user));
  document.querySelectorAll(".admin-only").forEach(el => el.classList.toggle("hidden", !state.user || state.user.role !== "admin"));
  $("loginBtn").classList.toggle("hidden", !!state.user);
  $("logoutBtn").classList.toggle("hidden", !state.user);
  $("userBadge").classList.toggle("hidden", !state.user);
  if (state.user) $("userBadge").textContent = `${state.user.name} · ${state.user.role}`;
  route();
}
window.addEventListener("hashchange", route);

// ---------- boot ----------
initCharts();
updateNav();
setInterval(tick, 2500);   // one reading per device every 2.5s
tick();