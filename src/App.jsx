import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Home, List, Plus, BarChart3, LayoutGrid, Fuel, Target, Settings as SettingsIcon,
  FileText, Search, ChevronRight, ChevronLeft, X, Trash2, Pencil, Pause, Play,
  Utensils, Car, ShoppingBag, HeartPulse, Gamepad2, GraduationCap, Plane, Zap,
  Gift, Briefcase, TrendingUp, TrendingDown, PiggyBank, Shirt, Coffee, Smartphone,
  PawPrint, Wrench, CircleHelp, Wallet, ArrowUpRight, ArrowDownRight, Calendar,
  RefreshCw, LogOut, UserRound, Palette, Coins, Repeat, CarFront, Check, Printer,
  Droplets, Gauge, MapPin, Sun, Moon, Percent, Landmark, Music, Baby, Bus,
  ChevronUp, ChevronDown, Menu, RotateCcw, Lock, Eye, EyeOff, ArrowUp, Sparkles, AlertTriangle,
  ThumbsUp, ThumbsDown, Minus, CalendarDays
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, LineChart, Line
} from "recharts";
import { supabase } from "./supabase";

/* ---------------- constants ---------------- */

const CURRENCIES = ["PLN", "EUR", "USD", "GBP", "CHF", "CZK", "UAH", "JPY"];
const DEFAULT_RATES = { PLN: 1, EUR: 4.30, USD: 3.70, GBP: 5.02, CHF: 4.62, CZK: 0.175, UAH: 0.095, JPY: 0.025 };

const ICONS = {
  Utensils, Car, Home, ShoppingBag, HeartPulse, Gamepad2, GraduationCap, Plane,
  Zap, Gift, Briefcase, TrendingUp, PiggyBank, Fuel, Shirt, Coffee, Smartphone,
  PawPrint, Wrench, CircleHelp, Wallet, Landmark, Music, Baby, Bus, Target
};
const ICON_NAMES = Object.keys(ICONS);
const CAT_COLORS = ["#FFB020","#4D9FFF","#8B7CFF","#FF7AC3","#FF6E6E","#34E0A1","#FFD166","#F97316","#38BDF8","#A78BFA","#F472B6","#94A3B8","#2DD4BF","#FB923C"];

const DEFAULT_CATEGORIES = [
  { id: "c-food",   name: "Jedzenie",        type: "expense", icon: "Utensils",      color: "#FFB020", builtin: true },
  { id: "c-trans",  name: "Transport",       type: "expense", icon: "Bus",           color: "#4D9FFF", builtin: true },
  { id: "c-home",   name: "Mieszkanie",      type: "expense", icon: "Home",          color: "#8B7CFF", builtin: true },
  { id: "c-shop",   name: "Zakupy",          type: "expense", icon: "ShoppingBag",   color: "#FF7AC3", builtin: true },
  { id: "c-health", name: "Zdrowie",         type: "expense", icon: "HeartPulse",    color: "#FF6E6E", builtin: true },
  { id: "c-fun",    name: "Rozrywka",        type: "expense", icon: "Gamepad2",      color: "#34E0A1", builtin: true },
  { id: "c-bills",  name: "Rachunki",        type: "expense", icon: "Zap",           color: "#FFD166", builtin: true },
  { id: "c-fuel",   name: "Paliwo",          type: "expense", icon: "Fuel",          color: "#F97316", builtin: true },
  { id: "c-edu",    name: "Edukacja",        type: "expense", icon: "GraduationCap", color: "#38BDF8", builtin: true },
  { id: "c-travel", name: "Podróże",         type: "expense", icon: "Plane",         color: "#A78BFA", builtin: true },
  { id: "c-cloth",  name: "Ubrania",         type: "expense", icon: "Shirt",         color: "#F472B6", builtin: true },
  { id: "c-oth-e",  name: "Inne wydatki",    type: "expense", icon: "CircleHelp",    color: "#94A3B8", builtin: true },
  { id: "c-salary", name: "Wypłata",         type: "income",  icon: "Briefcase",     color: "#34E0A1", builtin: true },
  { id: "c-bonus",  name: "Premia",          type: "income",  icon: "TrendingUp",    color: "#38BDF8", builtin: true },
  { id: "c-gift",   name: "Prezent",         type: "income",  icon: "Gift",          color: "#FF7AC3", builtin: true },
  { id: "c-oth-i",  name: "Inne przychody",  type: "income",  icon: "PiggyBank",     color: "#FFD166", builtin: true },
];

const UNCAT = { id: "uncat", name: "Bez kategorii", icon: "CircleHelp", color: "#6B7280" };
const AVATAR_COLORS = ["#34E0A1","#8B7CFF","#4D9FFF","#FF7AC3","#FFB020","#FF6E6E","#38BDF8","#F97316"];


/* ---------------- themes ---------------- */

const THEMES = [
  { id: "dark",   label: "Fiolet",   scheme: "dark",  bg: "#09090F", surface: "#121219", surface2: "#191923", surface3: "#232330", text: "#F1F0F6", muted: "#8E8CA0", line: "rgba(255,255,255,0.07)", accent: "#8B5CF6", neg: "#F87171", warn: "#FBBF24", violet: "#C084FC", info: "#60A5FA", shadow: "0 16px 44px rgba(0,0,0,0.5)", onAccent: "#FFFFFF" },
  { id: "ocean",  label: "Nexify",   scheme: "dark",  bg: "#060B1A", surface: "#0B1226", surface2: "#111A33", surface3: "#182342", text: "#EDF2FB", muted: "#8593B4", line: "rgba(120,160,255,0.12)", accent: "#3B82F6", neg: "#F87171", warn: "#FBBF24", violet: "#8B5CF6", info: "#38BDF8", shadow: "0 16px 44px rgba(0,0,10,0.55)", onAccent: "#FFFFFF" },
  { id: "light",  label: "Dzień",    scheme: "light", bg: "#FFFFFF", surface: "#FFFFFF", surface2: "#F4F3FA", surface3: "#E9E7F4", text: "#161328", muted: "#6F6C86", line: "rgba(40,30,90,0.09)", accent: "#7C3AED", neg: "#DC5050", warn: "#B8860B", violet: "#9F67F8", info: "#2F7FE0", shadow: "0 14px 36px rgba(60,40,120,0.10)", onAccent: "#FFFFFF" },
  { id: "violet", label: "Magenta",  scheme: "dark",  bg: "#0E0812", surface: "#181020", surface2: "#22162D", surface3: "#2D1D3B", text: "#F6EFF8", muted: "#A08BA8", line: "rgba(255,255,255,0.08)", accent: "#D946EF", neg: "#FB7185", warn: "#FBBF24", violet: "#E879F9", info: "#818CF8", shadow: "0 16px 44px rgba(0,0,0,0.55)", onAccent: "#FFFFFF" },
  { id: "forest", label: "Szmaragd", scheme: "dark",  bg: "#07100C", surface: "#0E1A14", surface2: "#14251C", surface3: "#1C3226", text: "#ECF5EF", muted: "#87A492", line: "rgba(255,255,255,0.06)", accent: "#34D399", neg: "#F87171", warn: "#FBBF24", violet: "#818CF8", info: "#38BDF8", shadow: "0 16px 44px rgba(0,0,0,0.5)", onAccent: "#04281C" },
];

const themeBlock = (t) => `
.fin-root[data-theme="${t.id}"], .fin-vars[data-theme="${t.id}"] {
  color-scheme: ${t.scheme};
  --bg:${t.bg}; --surface:${t.surface}; --surface2:${t.surface2}; --surface3:${t.surface3};
  --text:${t.text}; --muted:${t.muted}; --line:${t.line};
  --accent:${t.accent}; --accent-dim:${t.accent}24;
  --neg:${t.neg}; --neg-dim:${t.neg}20;
  --info:${t.info}; --info-dim:${t.info}22;
  --warn:${t.warn}; --violet:${t.violet};
  --shadow:${t.shadow}; --on-accent:${t.onAccent};
  --grad-accent: linear-gradient(135deg, ${t.accent} 0%, color-mix(in srgb, ${t.accent} 40%, ${t.info}) 100%);
  --hero-glow: radial-gradient(120% 140% at 15% 0%, ${t.accent}2b, transparent 55%),
               radial-gradient(90% 120% at 100% 100%, ${t.violet}24, transparent 60%);
  --chev: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23${t.muted.slice(1)}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
}`;

const CAME_FROM_EMAIL_LINK =
  typeof window !== "undefined" && /type=signup|type=email|type=magiclink/.test(window.location.hash || "");
const CAME_FROM_RECOVERY =
  typeof window !== "undefined" && /type=recovery/.test(window.location.hash || "");

const DEFAULT_NAV = ["dashboard", "history", "stats", "more", "summary", "fuel", "goals", "budgets", "reports", "settings"];
const normalizeNav = (order) => {
  const rest = (order || DEFAULT_NAV).filter((id) => id !== "more" && DEFAULT_NAV.includes(id));
  for (const id of DEFAULT_NAV) if (id !== "more" && !rest.includes(id)) rest.push(id);
  rest.splice(3, 0, "more");
  return rest;
};

const emptyData = () => ({
  transactions: [], categories: DEFAULT_CATEGORIES, recurring: [],
  cars: [], stations: [], refuels: [], goals: [], budgets: {}, reports: [], cycles: [],
  settings: { mainCurrency: "PLN", rates: { ...DEFAULT_RATES }, theme: "dark", navOrder: DEFAULT_NAV },
});

/* ---------------- storage: Supabase (dane) + localStorage (tylko motyw) ---------------- */

const THEME_LS_KEY = "sakwa-theme";
const NAV_LS_KEY = "sakwa-nav-order";
const KEEP_LS_KEY = "sakwa-keep30";
const LASTACT_LS_KEY = "sakwa-last-activity";
const AUTOF = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(min-width: 768px)").matches;
const loadLocalTheme = () => { try { return localStorage.getItem(THEME_LS_KEY); } catch { return null; } };
const saveLocalTheme = (id) => { try { localStorage.setItem(THEME_LS_KEY, id); } catch {} };

async function dbLoad(userId) {
  const { data: row, error } = await supabase
    .from("user_data").select("data").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return row?.data || null;
}
async function dbSave(userId, data) {
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
  if (error) throw error;
}

const passwordProblems = (p) => {
  const issues = [];
  if (!p || p.length < 8) issues.push("min. 8 znaków");
  if (!/[a-ząćęłńóśźż]/.test(p || "")) issues.push("mała litera");
  if (!/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p || "")) issues.push("wielka litera");
  if (!/[0-9]/.test(p || "")) issues.push("cyfra");
  return issues;
};

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const AUTH_ERRORS = [
  [/invalid login credentials/i, "Nieprawidłowy e-mail lub hasło."],
  [/already registered/i, "Konto z tym adresem e-mail już istnieje."],
  [/password should be at least/i, "Hasło musi mieć co najmniej 6 znaków."],
  [/email not confirmed/i, "Potwierdź adres e-mail (link w skrzynce), a potem zaloguj się."],
  [/rate limit/i, "Zbyt wiele prób — odczekaj chwilę."],
];
const authErrPl = (e) => {
  const m = e?.message || "";
  for (const [re, msg] of AUTH_ERRORS) if (re.test(m)) return msg;
  if (/fetch|network/i.test(m)) return "Brak połączenia z bazą danych — sprawdź internet.";
  return "Coś poszło nie tak: " + m;
};

/* ---------------- utils ---------------- */

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const todayISO = () => new Date().toISOString().slice(0, 10);
const ym = (d) => d.slice(0, 7);
const MONTHS_PL = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
const MONTHS_FULL = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];

function fmtMoney(n, cur = "PLN", compact = false) {
  try {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency", currency: cur,
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: compact ? 0 : 2,
    }).format(n);
  } catch { return `${n.toFixed(2)} ${cur}`; }
}
function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtTime(iso) {
  try { return new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}
function parseNum(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? NaN : n;
}
const numGuard = (v) => v.replace(/[^0-9.,]/g, "").replace(/([.,].*)[.,]/g, "$1");

const fit = (text, base, min, limit) => {
  const len = String(text ?? "").length;
  return len <= limit ? base : Math.max(min, Math.round((base * limit) / len));
};

/* okres rozliczeniowy: od ostatniej "wypłaty startowej" (lub kalendarzowy miesiąc, gdy brak) */
function getPeriod(data) {
  const today = todayISO();
  const cs = [...(data.cycles || [])].filter((c) => c <= today).sort();
  if (!cs.length) return null;
  const from = cs[cs.length - 1];
  const prevFrom = cs.length > 1 ? cs[cs.length - 2] : null;
  // średnia długość ostatnich cykli (fallback 30 dni)
  let len = 30;
  if (cs.length > 1) {
    const diffs = [];
    for (let i = Math.max(1, cs.length - 3); i < cs.length; i++) {
      diffs.push((new Date(cs[i]) - new Date(cs[i - 1])) / 864e5);
    }
    len = Math.max(7, Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length));
  }
  return { from, prevFrom, len };
}

function useCountUp(value, dur = 700) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current, to = value;
    if (from === to) return;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, dur]);
  return display;
}

function scrollTopAll(smooth = false) {
  const behavior = smooth ? "smooth" : "auto";
  try { window.scrollTo({ top: 0, behavior }); } catch { window.scrollTo(0, 0); }
  const el = document.querySelector(".app-scroll");
  if (el) { try { el.scrollTo({ top: 0, behavior }); } catch { el.scrollTop = 0; } }
}

/* Dokument przewija się natywnie (Safari chowa wtedy pasek adresu i staje się on
   półprzezroczysty). Gdy otwarte jest okno modalne/szuflada, blokujemy tło. */
let __lockCount = 0, __lockY = 0;
function lockScroll() {
  if (__lockCount++ === 0) {
    __lockY = window.scrollY || 0;
    const b = document.body.style;
    b.position = "fixed"; b.top = `-${__lockY}px`; b.left = "0"; b.right = "0"; b.width = "100%";
  }
}
function unlockScroll() {
  if (--__lockCount <= 0) {
    __lockCount = 0;
    const b = document.body.style;
    b.position = ""; b.top = ""; b.left = ""; b.right = ""; b.width = "";
    window.scrollTo(0, __lockY);
  }
}

function useMedia(query) {
  const [m, setM] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setM(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return m;
}

/* ---------------- CSS ---------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; -webkit-tap-highlight-color: transparent; }
html, body { scrollbar-width: none; -ms-overflow-style: none; overscroll-behavior-x: none; touch-action: pan-y pinch-zoom; }
html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
.sheet-body { scrollbar-width: none; }
.sheet-body::-webkit-scrollbar { display: none; }
button, .btn, .cat-tile, .tx-row, .nav-item, .seg button, input, select, textarea, label { touch-action: pan-y; }
.scroll-x, .scroll-x * { touch-action: pan-x pan-y; }
.scroll-x { overscroll-behavior-x: contain; padding: 8px 6px 16px; }
.scroll-x .card { box-shadow: 0 6px 16px rgba(0,0,0,0.16); }
.seg { max-width: 100%; overflow-x: auto; scrollbar-width: none; }
.seg::-webkit-scrollbar { display: none; }
.fin-root {
  font-family: 'Manrope', system-ui, sans-serif;
  min-height: 100vh; min-height: 100dvh; width: 100%; overflow-x: clip;
  background: var(--bg); color: var(--text);
  transition: background .3s ease, color .3s ease;
  font-size: 15px;
}
${THEMES.map(themeBlock).join("\n")}
.fin-vars { font-family: 'Manrope', system-ui, sans-serif; color: var(--text); font-size: 15px; }
.desk-cols > *, .stat-grid > *, .tile-grid > * { min-width: 0; }
.card { max-width: 100%; }
.card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 20px; box-shadow: var(--shadow);
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: none; cursor: pointer; font-family: inherit; font-weight: 700;
  border-radius: 14px; padding: 12px 18px; font-size: 14px;
  transition: transform .12s ease, opacity .15s ease, background .2s ease;
}
.btn:active { transform: scale(0.965); }
.btn-primary { background: var(--accent); color: var(--on-accent); }
.btn-ghost { background: var(--surface2); color: var(--text); }
.btn-danger { background: var(--neg-dim); color: var(--neg); }
.btn-danger-solid { background: var(--neg); color: #fff; }
.btn:disabled { opacity: .45; cursor: not-allowed; }
.input, .select {
  width: 100%; background: var(--surface2); color: var(--text);
  border: 1.5px solid transparent; border-radius: 14px;
  padding: 12px 14px; font-family: inherit; font-size: 15px; outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.input:focus, .select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.input.err { border-color: var(--neg); }
select.select {
  appearance: none; -webkit-appearance: none;
  background-image: var(--chev); background-repeat: no-repeat;
  background-position: right 12px center; background-size: 16px;
  padding-right: 38px; cursor: pointer;
}
input[type="date"] { cursor: pointer; }
input[type="date"]::-webkit-calendar-picker-indicator { opacity: .55; }
.amt-pill { display: inline-block; padding: 5px 11px; border-radius: 11px; font-weight: 800; font-size: 13.5px; letter-spacing: -0.01em; white-space: nowrap; }
.hero-num-grad { background: linear-gradient(100deg, var(--info), var(--accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.skeleton { background: var(--surface2); border-radius: 14px; animation: pulse 1.1s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
.sens { transition: filter .3s ease; }
.incognito .sens { filter: blur(9px); pointer-events: none; user-select: none; }
.tx-list > * + * { border-top: 1px solid var(--line); }
.err-msg { color: var(--neg); font-size: 12.5px; margin-top: 5px; font-weight: 600; }
.label { font-size: 12.5px; font-weight: 700; color: var(--muted); letter-spacing: .03em; text-transform: uppercase; display: block; margin-bottom: 7px; }
.seg { display: flex; background: var(--surface2); border-radius: 14px; padding: 4px; gap: 4px; }
.seg button {
  flex: 1; border: none; background: transparent; color: var(--muted); cursor: pointer;
  font-family: inherit; font-weight: 700; font-size: 13.5px; padding: 9px 6px;
  border-radius: 11px; transition: all .18s ease; white-space: nowrap;
}
.seg button.on { background: var(--surface); color: var(--text); box-shadow: 0 2px 10px rgba(0,0,0,0.18); }
.seg button.on.pos { color: var(--accent); }
.seg button.on.neg { color: var(--neg); }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 700; }
.row-press { transition: background .15s ease; cursor: pointer; }
.row-press:hover { background: var(--surface2); }
.fade-in { animation: fadeIn .25s ease backwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.stagger > * { animation: fadeIn .3s ease backwards; }
.overlay {
  position: fixed; inset: 0; background: rgba(5,8,14,0.55); backdrop-filter: blur(3px);
  z-index: 900; animation: ovIn .2s ease both;
}
@keyframes ovIn { from { opacity: 0; } to { opacity: 1; } }
.sheet {
  position: fixed; z-index: 950; background: var(--surface);
  border: 1px solid var(--line); display: flex; flex-direction: column;
  inset: 0; margin: auto; height: fit-content;
  width: min(430px, calc(100vw - 28px)); max-height: 82vh; max-height: 82dvh;
  border-radius: 22px; overflow: hidden;
  animation: modalIn .3s cubic-bezier(.16,.84,.28,1) backwards;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
@media (min-width: 768px) { .sheet { width: min(560px, 92vw); } }
@keyframes modalIn { from { opacity: 0; transform: scale(.94) translateY(18px); } to { opacity: 1; transform: none; } }
.sheet-body { overflow-y: auto; overflow-x: clip; min-height: 0; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; padding: 6px 20px 22px; touch-action: pan-y; }
.sheet-body input, .sheet-body select, .sheet-body textarea { min-width: 0; max-width: 100%; }
input[type="date"] { -webkit-appearance: none; appearance: none; display: block; width: 100%; min-width: 0; min-height: 46px; text-align: left; }
input[type="date"]::-webkit-date-and-time-value { text-align: left; }
.toast {
  position: fixed; bottom: calc(100px + max(env(safe-area-inset-bottom), 12px)); left: 50%; transform: translateX(-50%);
  background: var(--surface3); color: var(--text); border: 1px solid var(--line);
  padding: 12px 16px; border-radius: 14px; z-index: 990; display: flex; align-items: center; gap: 14px;
  box-shadow: var(--shadow); animation: fadeIn .22s ease both; font-size: 14px; font-weight: 600;
  max-width: min(92vw, 420px);
}
@media (min-width: 1024px) { .toast { bottom: 28px; } }
.toast button { background: none; border: none; color: var(--accent); font-weight: 800; cursor: pointer; font-family: inherit; font-size: 14px; }
@media (max-width: 1023px) {
  /* dokument przewija się sam => Safari zwija pasek adresu, treść płynie pod nim.
     overflow-x: clip chroni przed poziomym scrollem i jest neutralny dla position:sticky. */
  html, body { height: auto; min-height: 100%; overflow-x: clip; overflow-y: visible; overscroll-behavior-y: contain; }
  .fin-root { position: relative; inset: auto; min-height: 100dvh; width: auto; overflow-x: clip; }
  .app-scroll { height: auto; min-height: 100dvh; overflow: visible; }
  .app-scroll::-webkit-scrollbar { display: none; }
  /* iOS Safari auto-zoomuje pole tekstowe z font-size < 16px przy focusie =>
     po odpaleniu klawiatury strona skacze i przesuwa się w bok (w lewo).
     16px na polach wejściowych wyłącza ten zoom (patrz też .pin-hidden). */
  .input, .select, input, textarea, select { font-size: 16px; }
@media (min-width: 1024px) { .app-scroll { min-height: 100vh; } }
.bottom-nav {
  position: fixed; bottom: var(--vv-off, 0px); left: 0; right: 0; z-index: 40;
  transition: transform .28s cubic-bezier(.22,.9,.3,1);
}
.pin-box {
  width: 54px; height: 58px; border-radius: 14px; background: var(--surface2);
  border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center;
  font-size: 25px; font-weight: 800; transition: border-color .15s ease;
}
.pin-box.active { border-color: var(--accent); }
.pin-box.err { border-color: var(--neg); }
.pin-hidden { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; font-size: 16px; border: none; background: none; }
.bottom-nav.nav-hidden { transform: translateY(calc(100% + var(--vv-off, 0px) + 26px)); }
.bottom-nav {
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transform: translateZ(0); border-top: 1px solid var(--line);
  display: grid; grid-template-columns: repeat(5, 1fr); padding: 8px 8px calc(10px + env(safe-area-inset-bottom));
}
.bottom-nav::after {
  content: ""; position: absolute; top: 100%; left: 0; right: 0;
  height: calc(var(--vv-off, 0px) + 2px); background: var(--bg);
}
.bottom-nav button {
  background: none; border: none; color: var(--muted); font-family: inherit; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 10.5px; font-weight: 700;
  padding: 8px 0; min-height: 48px; transition: color .15s ease;
  touch-action: manipulation; -webkit-user-select: none; user-select: none;
}
.bottom-nav button.on { color: var(--accent); }
.nav-plus {
  width: 52px; height: 52px; border-radius: 18px; background: var(--accent); color: var(--on-accent);
  display: flex; align-items: center; justify-content: center; margin: -18px auto 0;
  box-shadow: 0 8px 22px var(--accent-dim), 0 4px 14px rgba(0,0,0,.3);
  transition: transform .14s ease;
}
.nav-plus:active { transform: scale(.93); }
.sidebar {
  width: 240px; flex-shrink: 0; padding: 24px 14px; border-right: 1px solid var(--line);
  display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; height: 100vh;
}
.sidebar button.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 13px;
  background: none; border: none; color: var(--muted); font-family: inherit; font-size: 14px;
  font-weight: 700; cursor: pointer; transition: all .15s ease; text-align: left; width: 100%;
}
.sidebar button.nav-item:hover { background: var(--surface2); color: var(--text); }
.sidebar button.nav-item.on { background: var(--accent-dim); color: var(--accent); }
.cat-tile {
  display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 12px 4px;
  border-radius: 16px; border: 1.5px solid transparent; background: var(--surface2);
  cursor: pointer; font-family: inherit; transition: all .15s ease; color: var(--text);
}
.cat-tile:active { transform: scale(.96); }
.cat-tile.on { border-color: var(--accent); background: var(--accent-dim); }
.cat-tile span { font-size: 11px; font-weight: 700; text-align: center; line-height: 1.2; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.icon-badge { width: 40px; height: 40px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.progress-track { height: 9px; border-radius: 999px; background: var(--surface3); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999px; background: var(--accent); transition: width .7s cubic-bezier(.22,.9,.3,1); }
.tile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (min-width: 640px) { .stat-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); } }
.desk-cols { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 1024px) { .desk-cols { grid-template-columns: 3fr 2fr; align-items: start; } }
.scroll-x { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; }
.scroll-x::-webkit-scrollbar { display: none; }
.car-carousel { scroll-snap-type: x mandatory; scroll-padding-left: 2px; }
.car-carousel > * { scroll-snap-align: start; }
.dots { display: flex; gap: 6px; justify-content: center; margin-top: 10px; }
.dots span { width: 6px; height: 6px; border-radius: 3px; background: var(--surface3); transition: width .25s ease, background .25s ease; }
.dots span.on { background: var(--accent); width: 18px; }
.tx-row { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 15px; position: relative; }
.swipe-del {
  position: absolute; right: 0; top: 0; bottom: 0; width: 76px; display: flex; align-items: center;
  justify-content: center; color: var(--neg); border-radius: 0 15px 15px 0;
}
/* zwykły nagłówek Historii — scrolluje się razem ze stroną jak na innych podstronach
   (BEZ position: sticky) */
.hist-head { padding-bottom: 6px; }
h1.page-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; padding-left: 4px; }
@media (max-width: 1023px) { h1.page-title { padding-left: 10px; } }
/* Centrowanie przez auto-marginesy zamiast align/justify-center: gdy klawiatura
   otworzy się i karta jest wyższa niż widoczny obszar, nie ucina góry ani nie
   „przeskakuje" — po prostu wyrównuje do góry i pozwala przewinąć. */
.auth-wrap { min-height: 100vh; min-height: 100dvh; display: flex; padding: calc(max(env(safe-area-inset-top), 34px) + 16px) 20px calc(max(env(safe-area-inset-bottom), 16px) + 16px); }
.auth-wrap > * { margin: auto; }
.hero-balance {
  position: relative; overflow: hidden; padding: 26px 24px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 24px; box-shadow: var(--shadow);
}
.hero-balance::before { content: ""; position: absolute; inset: 0; background: var(--hero-glow); pointer-events: none; }
.big-num { font-size: clamp(34px, 8vw, 46px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
.divider { height: 1px; background: var(--line); margin: 4px 0; }
.to-top {
  position: fixed; left: 16px; right: auto; bottom: calc(14px + env(safe-area-inset-bottom)); z-index: 45;
}
@media (min-width: 1024px) {
  .to-top { left: auto; right: 24px; bottom: 26px; }
}
.to-top {
  transition: bottom .28s cubic-bezier(.22,.9,.3,1), opacity .2s ease, transform .2s ease;
}
.to-top {
  width: 46px; height: 46px; border-radius: 16px;
  background: var(--surface3); color: var(--text); border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: var(--shadow); opacity: 0; transform: translateY(18px) scale(.8);
  pointer-events: none; transition: opacity .25s ease, transform .32s cubic-bezier(.22,.9,.3,1), background .2s ease;
}
.to-top.show { opacity: 1; transform: none; pointer-events: auto; }
.to-top:hover { background: var(--surface2); }
.to-top:active { transform: scale(.9); }
@media (min-width: 1024px) { .to-top { bottom: 26px; right: 26px; } }
.recharts-wrapper, .recharts-surface, .recharts-wrapper * { user-select: none; -webkit-user-select: none; outline: none !important; }
.recharts-sector, .recharts-wrapper path, .recharts-wrapper svg { outline: none !important; }
.recharts-sector:focus, .recharts-wrapper path:focus, .recharts-wrapper svg:focus { outline: none !important; }
@media print {
  .no-print { display: none !important; }
  .fin-root { background: #fff !important; color: #111 !important; }
  .print-area { display: block !important; }
  .card { box-shadow: none !important; border: 1px solid #ddd !important; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}


/* =====================================================================
   SAKWA v5 — wg referencji użytkownika:
   MOBILE  = czarno-fioletowy banking (saldo + pigułka + kafle skrótów,
             pasek z podpisami i uniesionym okrągłym FAB-em z podkreśleniem)
   DESKTOP = granatowy dashboard (topbar z powitaniem i chipem konta,
             sidebar z gradientową aktywną pozycją, KPI z ikoną w rogu)
   Kilka motywów. Zero zmian w funkcjonalności.
   ===================================================================== */
.fin-root {
  font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
  background:
    radial-gradient(820px 420px at 82% -12%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 60%),
    radial-gradient(640px 400px at -8% 108%, color-mix(in srgb, var(--violet) 9%, transparent), transparent 55%),
    var(--bg);
}
.sens, .big-num, .pin-box { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.02em; }
.big-num { letter-spacing: -0.035em; }
h1.page-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 25px; font-weight: 700; letter-spacing: -0.02em; }
h1.page-title::after { content: ""; display: block; width: 28px; height: 3px; margin-top: 8px; border-radius: 3px; background: var(--grad-accent); }

.card { border-radius: 18px; border: 1px solid var(--line); background: var(--surface); box-shadow: 0 10px 30px rgba(0,0,0,0.22); }
.btn { border-radius: 13px; }
.btn-primary {
  background: var(--grad-accent); border: none; color: var(--on-accent); font-weight: 800;
  box-shadow: 0 10px 26px color-mix(in srgb, var(--accent) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.25);
}
.btn-primary:not(:disabled):active { transform: scale(0.975); }
.btn-ghost { background: color-mix(in srgb, var(--surface2) 82%, transparent); border: 1px solid var(--line); }
.input { border-radius: 13px; background: color-mix(in srgb, var(--surface2) 80%, transparent); border: 1px solid var(--line); transition: border-color .15s, box-shadow .15s; }
.input:focus { border-color: color-mix(in srgb, var(--accent) 60%, transparent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); }
.pin-box { border-radius: 13px; background: color-mix(in srgb, var(--surface2) 70%, transparent); border: 1px solid var(--line); }
.pin-box.active { border-color: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); }
.seg { border-radius: 14px; padding: 4px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 78%, transparent); }
.seg button { border-radius: 10px; }
.seg button.on { background: var(--grad-accent); color: var(--on-accent); box-shadow: 0 6px 16px color-mix(in srgb, var(--accent) 38%, transparent); }
.seg button.on.pos {
  background: color-mix(in srgb, var(--accent) 18%, var(--surface));
  color: color-mix(in srgb, var(--accent) 88%, var(--text));
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--accent) 48%, transparent);
}
.seg button.on.neg {
  background: color-mix(in srgb, var(--neg) 16%, var(--surface));
  color: color-mix(in srgb, var(--neg) 88%, var(--text));
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--neg) 45%, transparent);
}
.chip { border-radius: 999px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 60%, transparent); font-weight: 700; }
/* warianty semantyczne: tło i ramka wyprowadzone z koloru — czytelne na jasnych i ciemnych motywach */
.chip-pos {
  color: color-mix(in srgb, var(--accent) 88%, var(--text));
  background: color-mix(in srgb, var(--accent) 15%, var(--surface));
  border-color: color-mix(in srgb, var(--accent) 42%, transparent);
}
.chip-neg {
  color: color-mix(in srgb, var(--neg) 88%, var(--text));
  background: color-mix(in srgb, var(--neg) 14%, var(--surface));
  border-color: color-mix(in srgb, var(--neg) 40%, transparent);
}
.hero-status {
  background: color-mix(in srgb, currentColor 10%, var(--surface));
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 12px; padding: 8px 12px;
}
.icon-badge { border-radius: 12px; }
.progress-track { height: 6px; border-radius: 999px; }
.progress-fill { border-radius: 999px; background-image: var(--grad-accent); }
.sheet { border-radius: 22px; border: 1px solid var(--line); box-shadow: 0 40px 90px rgba(0,0,0,0.6); }
.overlay { background: color-mix(in srgb, var(--bg) 42%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.toast { border-radius: 999px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 88%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: var(--shadow); }
.to-top { border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 88%, transparent); backdrop-filter: blur(10px); }

/* historia jak w referencji 1: płaskie wiersze rozdzielone hairline wewnątrz karty */
.tx-row { background: transparent; border: none; margin: 0; border-radius: 12px; }
.tx-list .tx-row:not(:last-child) { border-bottom: 1px solid color-mix(in srgb, var(--line) 75%, transparent); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

/* --- MOBILE app bar --- */
.appbar { display: flex; align-items: center; gap: 12px; padding: 2px 2px 16px; }
.appbar-avatar { width: 42px; height: 42px; border-radius: 14px; border: none; color: #fff; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: inherit; flex-shrink: 0; box-shadow: 0 6px 16px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.16); }
.appbar-greet { flex: 1; min-width: 0; }
.greet-k { font-size: 11.5px; font-weight: 600; color: var(--muted); }
.greet-n { font-size: 16.5px; font-weight: 800; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.brandmark { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: var(--accent); background: color-mix(in srgb, var(--accent) 13%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }

/* --- DESKTOP topbar --- */
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 0 2px 24px; }
.user-chip { display: flex; align-items: center; gap: 10px; padding: 7px 12px 7px 7px; border-radius: 14px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 60%, transparent); cursor: pointer; font-family: inherit; color: var(--text); max-width: 240px; }
.user-chip:hover { border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
.user-chip .appbar-avatar { cursor: pointer; }

/* --- HERO (obraz 1): saldo, pigułka, kafle --- */
.hero-balance.hero-v2 {
  text-align: left; padding: 22px 20px 20px; border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--line));
  background:
    radial-gradient(430px 210px at 92% -32%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 66%),
    linear-gradient(168deg, color-mix(in srgb, var(--accent) 9%, var(--surface)), var(--surface) 56%);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--accent) 7%, rgba(0,0,0,0.18));
}
.hero-v2::before { background: none; content: none; }
.hero-kicker { display: flex; align-items: center; gap: 8px; text-align: left; font-size: 12.5px; font-weight: 600; letter-spacing: 0.01em; text-transform: none; color: var(--muted); margin-bottom: 6px; }
.hero-eye2 {
  position: absolute; top: -4px; right: -4px; z-index: 2;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid color-mix(in srgb, var(--accent) 42%, var(--line));
  background: color-mix(in srgb, var(--surface2) 62%, transparent);
  color: var(--muted); cursor: pointer; transition: color .15s ease, border-color .15s ease;
}
.hero-eye2:active { color: var(--accent); }
.hero-num { line-height: 1.06; }
.hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; justify-content: flex-start; margin-top: 12px; }
.hero-status { justify-content: flex-start; text-align: left; margin-top: 12px; font-size: 12.5px; }
.hero-add { margin-top: 16px; padding: 12px 20px; }
.quick-row { display: flex; flex-direction: row; align-items: stretch; justify-content: space-between; gap: 10px; border-top: none; padding-top: 0; margin-top: 18px; }
.hero-extra { display: none; }
.hero-ratio { margin-top: 18px; }
.hr-track { height: 10px; border-radius: 999px; background: color-mix(in srgb, var(--neg) 22%, var(--surface2)); overflow: hidden; }
.hr-fill { height: 100%; border-radius: 999px; background: var(--grad-accent); transition: width .6s cubic-bezier(.22,.9,.3,1); }
.hr-caption { display: flex; justify-content: space-between; margin-top: 7px; font-size: 11.5px; font-weight: 800; }
@media (min-width: 1024px) {
  .quick-row, .hero-add, .hero-ratio { display: none; }
  .hero-extra {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
    margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line);
  }
  .hx-cell { min-width: 0; }
  .hx-l { font-size: 11.5px; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
  .hx-v { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
/* (6) PC: subtelne powiększenie kart pod kursorem */
@media (min-width: 1024px) {
  .card, .hero-balance { transition: transform .18s ease, box-shadow .18s ease; }
  .card:hover, .hero-balance:hover { transform: scale(1.012); }
}
.quick {
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
  flex: 1; min-width: 0; gap: 7px; padding: 0; margin: 0;
  background: none; border: none; cursor: pointer; font-family: inherit;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.01em; color: var(--muted);
}
.quick > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.quick-ic {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 54px; border-radius: 16px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface2) 82%, transparent);
  color: var(--accent);
  transition: transform .15s ease, border-color .15s ease;
}
.quick:active .quick-ic { transform: scale(0.95); }
.quick:hover .quick-ic { border-color: color-mix(in srgb, var(--accent) 45%, transparent); }

/* --- KPI (obraz 2): etykieta z lewej, ikonka w kolorowym kwadracie z prawej --- */
.stat-card { padding: 15px 16px 14px; }
.stat-kicker { display: flex; flex-direction: row-reverse; align-items: center; justify-content: space-between; gap: 8px; font-size: 11.5px; font-weight: 700; letter-spacing: 0; text-transform: none; color: var(--muted); margin-bottom: 9px; }
.stat-kicker svg { width: 27px; height: 27px; padding: 6px; border-radius: 9px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); flex-shrink: 0; }
.stat-val { line-height: 1.12; }
@media (max-width: 1023px) {
  .stat-grid { display: flex; overflow-x: auto; gap: 12px; scroll-snap-type: x mandatory; margin: 0 -16px; padding: 2px 16px 8px; scroll-padding: 0 16px; scrollbar-width: none; }
  .stat-grid::-webkit-scrollbar { display: none; }
  .stat-grid > * { min-width: 100%; flex: 0 0 100%; scroll-snap-align: start; }
  .stat-grid, .stat-grid * { touch-action: pan-x pan-y; }
}

.sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.sec-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: color-mix(in srgb, var(--accent) 78%, var(--muted)); margin-bottom: 2px; }
.sec-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.sec-side { font-size: 12px; font-weight: 700; color: var(--accent); }

/* --- SIDEBAR (obraz 2): aktywna pozycja = gradientowa pastylka --- */
.sidebar {
  background: color-mix(in srgb, var(--surface) 68%, var(--bg));
  border-right: 1px solid var(--line);
  box-shadow: 14px 0 34px -18px rgba(0, 0, 0, 0.35);
}
.sidebar button.nav-item { border-radius: 13px; }
.sidebar .side-profile {
  /* zawsze ciemniej niż panel: jasny motyw -> szary, ciemne -> głębsza czerń */
  background: color-mix(in srgb, var(--bg) 86%, #000);
  border: 1px solid var(--line);
  border-radius: 15px;
}
.sidebar .side-profile:hover { border-color: color-mix(in srgb, var(--accent) 42%, transparent); }
.sidebar button.nav-item.on {
  background: var(--grad-accent); color: var(--on-accent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent);
}

/* --- DOLNY PASEK (obraz 1): podpisy, fioletowy aktywny z podkreśleniem, uniesiony FAB --- */
.bottom-nav {
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(18px) saturate(1.2); -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border-top: 1px solid var(--line); box-shadow: 0 -12px 34px rgba(0,0,0,0.3);
}
.nav-lbl { display: block; font-size: 10px; font-weight: 700; margin-top: 3px; }
.bottom-nav button { position: relative; }
.bottom-nav button.on { color: var(--accent); }
.bottom-nav button.on::after {
  content: ""; position: absolute; left: 50%; transform: translateX(-50%); bottom: 2px;
  width: 16px; height: 3px; border-radius: 3px; background: var(--grad-accent);
}
.fab {
  position: fixed; right: 18px; bottom: calc(14px + env(safe-area-inset-bottom)); z-index: 40;
  width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: var(--grad-accent); color: var(--on-accent);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 50%, transparent), inset 0 1.5px 0 rgba(255,255,255,0.35);
  transition: transform .15s ease;
}
.fab:active { transform: scale(0.93); }
.drawer-overlay {
  position: fixed; inset: 0; z-index: 1080;
  background: color-mix(in srgb, var(--bg) 30%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  opacity: 0; pointer-events: none; transition: opacity .25s ease;
}
.drawer-overlay.open { opacity: 1; pointer-events: auto; }
.drawer {
  position: fixed; top: 0; bottom: 0; left: 0; z-index: 1090;
  width: min(304px, 82vw); background: color-mix(in srgb, var(--surface) 68%, var(--bg)); border-right: 1px solid var(--line);
  transform: translateX(-104%); transition: transform .3s cubic-bezier(.22,.9,.3,1), box-shadow .3s ease;
  display: flex; flex-direction: column;
  padding: calc(max(env(safe-area-inset-top), 34px) + 8px) 0 calc(max(env(safe-area-inset-bottom), 12px) + 8px);
  /* cień TYLKO gdy otwarta — inaczej rozmycie wystaje zza lewej krawędzi ekranu */
}
.drawer.open { transform: translateX(0); box-shadow: 24px 0 60px rgba(0,0,0,0.45); }
.drawer-head { display: flex; align-items: center; gap: 12px; padding: 6px 16px 16px; border-bottom: 1px solid var(--line); margin-bottom: 14px; }
.drawer-foot {
  display: flex; align-items: center; gap: 12px; margin: 10px 12px 0; padding: 12px;
  border: 1px solid var(--line); border-radius: 15px; background: color-mix(in srgb, var(--surface2) 70%, transparent);
  color: var(--text); font-family: inherit; cursor: pointer; width: calc(100% - 24px); box-sizing: border-box;
}
.drawer-list { flex: 1; overflow-y: auto; padding: 0 14px; display: flex; flex-direction: column; gap: 5px; overscroll-behavior: contain; box-sizing: border-box; }
.drawer-item {
  display: flex; align-items: center; gap: 12px; width: 100%; box-sizing: border-box;
  min-height: 46px; padding: 12px 14px; margin: 0;
  border-radius: 13px; border: none; background: none; color: var(--muted);
  font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; text-align: left;
}
.drawer-item.on {
  background: var(--grad-accent);
  color: var(--on-accent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 32%, transparent), inset 0 1px 0 rgba(255,255,255,0.22);
}
.drawer-item:not(.on):active { background: color-mix(in srgb, var(--accent) 12%, var(--surface)); }

.statusbar-scrim {
  position: fixed; top: 0; left: 0; right: 0; z-index: 30; pointer-events: none;
  height: calc(max(env(safe-area-inset-top), 34px));
  background: linear-gradient(180deg, var(--bg) 62%, transparent);
}
.pass-eye {
  position: absolute; right: 7px; top: 50%; transform: translateY(-50%);
  width: 34px; height: 34px; border-radius: 10px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--surface3) 70%, transparent); color: var(--muted);
  touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none;
}
.pass-eye:active { color: var(--accent); }

.appbar, .topbar { position: relative; }
.appbar-month {
  position: absolute; left: 50%; top: 21px; transform: translate(-50%, -50%); text-align: center;
  font-size: 14.5px; font-weight: 800; color: var(--text); white-space: nowrap;
  padding: 8px 18px; border-radius: 999px; border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface2) 88%, transparent);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  text-transform: capitalize; pointer-events: none; z-index: 1;
}
@media (min-width: 1024px) {
  .appbar-month {
    position: static; transform: none; pointer-events: none;
    font-size: clamp(14.5px, 1.05vw, 17px);
    padding: 9px clamp(18px, 2.6vw, 40px);
  }
}
.top-ic {
  width: 42px; height: 42px; border-radius: 13px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 72%, transparent);
  color: var(--muted); cursor: pointer; transition: border-color .15s ease, color .15s ease;
}
.top-ic:hover { border-color: color-mix(in srgb, var(--accent) 45%, transparent); color: var(--accent); }
.top-ic-on {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.theme-toggle {
  position: fixed; top: calc(max(env(safe-area-inset-top), 12px) + 10px); right: 16px; z-index: 60;
  width: 42px; height: 42px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--line); background: color-mix(in srgb, var(--surface2) 85%, transparent);
  color: var(--muted); cursor: pointer; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
}
.theme-toggle:hover { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 45%, transparent); }

.rail-dots { display: none; }
@media (max-width: 1023px) {
  .rail-dots { display: flex; justify-content: center; gap: 6px; margin-top: 10px; }
  .rail-dots span { width: 6px; height: 6px; border-radius: 999px; background: color-mix(in srgb, var(--muted) 35%, transparent); transition: all .25s ease; }
  .rail-dots span.on { width: 18px; background: var(--grad-accent); }
}

.nav-plus {
  width: 56px; height: 56px; border-radius: 50%; margin-top: -26px;
  background: var(--grad-accent); color: var(--on-accent);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--accent) 55%, transparent), inset 0 1.5px 0 rgba(255,255,255,0.35),
              0 0 0 6px color-mix(in srgb, var(--bg) 85%, transparent);
}
`;

/* ---------------- shared components ---------------- */

function CatIcon({ cat, size = 40 }) {
  const I = ICONS[cat?.icon] || CircleHelp;
  const color = cat?.color || UNCAT.color;
  return (
    <div className="icon-badge" style={{ width: size, height: size, background: color + "22", color }}>
      <I size={size * 0.5} strokeWidth={2.2} />
    </div>
  );
}

function Sheet({ open, onClose, title, children, wide }) {
  const isMobile = useMedia("(max-width: 767px)");
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  useEffect(() => {
    if (!open) return;
    lockScroll();
    return unlockScroll;
  }, [open]);
  if (!open) return null;
  return (
    <>
      <div className="overlay no-print" onClick={onClose} />
      <div className="sheet no-print" role="dialog" aria-modal="true" style={{ width: !isMobile && wide ? "min(760px,94vw)" : undefined }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const t = e.target;
          if (!t || t.tagName !== "INPUT" || t.type === "checkbox" || t.type === "radio") return;
          const btn = e.currentTarget.querySelector(".btn-primary:not(:disabled)");
          if (btn) { e.preventDefault(); btn.click(); }
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 8px", flexShrink: 0 }}>
          <div style={{ fontSize: 17.5, fontWeight: 800 }}>{title}</div>
          <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 12 }} onClick={onClose} aria-label="Zamknij"><X size={18} /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}

function Confirm({ conf, onDone }) {
  const [text, setText] = useState("");
  useEffect(() => setText(""), [conf]);
  if (!conf) return null;
  const needType = !!conf.typeToConfirm;
  const ok = !needType || text === conf.typeToConfirm;
  return (
    <Sheet open onClose={() => onDone(false)} title={conf.title}>
      <p style={{ color: "var(--muted)", fontWeight: 600, lineHeight: 1.55, marginBottom: 16 }}>{conf.desc}</p>
      {needType && (
        <div style={{ marginBottom: 16 }}>
          <label className="label">Wpisz „{conf.typeToConfirm}", aby potwierdzić</label>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} autoFocus={AUTOF} />
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onDone(false)}>Anuluj</button>
        <button className={`btn ${conf.danger ? "btn-danger-solid" : "btn-primary"}`} style={{ flex: 1 }} disabled={!ok} onClick={() => onDone(true)}>
          {conf.confirmLabel || "Potwierdź"}
        </button>
      </div>
    </Sheet>
  );
}

function Seg({ options, value, onChange, tone }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value}
          className={value === o.value ? `on ${tone ? tone(o.value) : ""}` : ""}
          onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label className="label">{label}</label>}
      {children}
      {error && <div className="err-msg">{error}</div>}
    </div>
  );
}

function NumInput({ value, onChange, placeholder, error, big, suffix }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        className={`input ${error ? "err" : ""}`} inputMode="decimal" placeholder={placeholder || "0,00"}
        style={big ? { fontSize: 26, fontWeight: 800, padding: "14px 16px" } : undefined}
        value={value} onChange={(e) => onChange(numGuard(e.target.value))}
      />
      {suffix && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontWeight: 800 }}>{suffix}</span>}
    </div>
  );
}

function StatCard({ icon: I, label, value, sub, tone, trend }) {
  const toneColor = tone === "pos" ? "var(--accent)" : tone === "neg" ? "var(--neg)" : tone === "info" ? "var(--info)" : "var(--text)";
  return (
    <div className="card stat-card">
      <div className="stat-kicker"><I size={13} strokeWidth={2.4} /><span>{label}</span></div>
      <div className="sens stat-val" style={{ fontSize: fit(value, 25, 15, 12), color: toneColor }}>{value}</div>
      {(sub || trend != null) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
          {trend != null && !isNaN(trend) && isFinite(trend) && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: trend >= 0 ? "var(--accent)" : "var(--neg)" }}>
              {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(trend).toFixed(0)}%
            </span>
          )}
          {sub && <span>{sub}</span>}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: I, title, desc, action }) {
  return (
    <div className="card" style={{ padding: "36px 24px", textAlign: "center" }}>
      <div className="icon-badge" style={{ width: 54, height: 54, background: "var(--surface2)", color: "var(--muted)", margin: "0 auto 14px" }}>
        <I size={26} />
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{title}</div>
      <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.5 }}>{desc}</div>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/* swipeable transaction row */
function TxRow({ tx, cat, main, toMain, onEdit, onDelete, showDate }) {
  const [dx, setDx] = useState(0);
  const start = useRef(null);
  const isMobile = useMedia("(max-width: 767px)");
  const converted = toMain(tx.amount, tx.currency);
  const touch = isMobile ? {
    onTouchStart: (e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx }; },
    onTouchMove: (e) => {
      if (!start.current) return;
      const ddx = e.touches[0].clientX - start.current.x;
      const ddy = e.touches[0].clientY - start.current.y;
      if (Math.abs(ddy) > Math.abs(ddx)) return;
      setDx(Math.max(-84, Math.min(0, start.current.dx + ddx)));
    },
    onTouchEnd: () => { setDx((d) => (d < -42 ? -84 : 0)); start.current = null; },
  } : {};
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 15 }}>
      {dx < -5 && (
        <button className="swipe-del" style={{ background: "var(--neg-dim)", border: "none", cursor: "pointer" }}
          onClick={() => { setDx(0); onDelete(tx); }} aria-label="Usuń transakcję">
          <Trash2 size={20} />
        </button>
      )}
      <div className="tx-row row-press" {...touch}
        style={{ transform: `translateX(${dx}px)`, transition: start.current ? "none" : "transform .2s ease", background: "var(--surface)" }}
        onClick={() => dx === 0 && onEdit(tx)}>
        <CatIcon cat={cat} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>
            {tx.name} {tx.recurringId && <Repeat size={12} style={{ verticalAlign: -1, color: "var(--muted)" }} />}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 3, background: cat?.color || UNCAT.color, flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat?.name || UNCAT.name}{showDate ? ` · ${fmtDate(tx.date)}` : ""}</span>
          </div>
        </div>
        <div className="sens" style={{ textAlign: "right" }}>
          <span className="amt-pill" style={{ background: tx.type === "income" ? "var(--accent-dim)" : "var(--neg-dim)", color: tx.type === "income" ? "var(--accent)" : "var(--neg)" }}>
            {tx.type === "income" ? "+" : "−"}{fmtMoney(Math.abs(converted), main)}
          </span>
          {tx.currency !== main && (
            <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, marginTop: 3 }}>{fmtMoney(tx.amount, tx.currency)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- category picker (compact grid + expandable sheet) ---------------- */

function CategoryGrid({ categories, transactions, type, value, onChange }) {
  const [full, setFull] = useState(false);
  const [q, setQ] = useState("");
  const list = categories.filter((c) => c.type === type);
  const usage = useMemo(() => {
    const u = {};
    transactions.forEach((t) => { u[t.categoryId] = (u[t.categoryId] || 0) + 1; });
    return u;
  }, [transactions]);
  const sorted = [...list].sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0));
  const fitsOneLine = sorted.length <= 4; // 4 kolumny siatki => jedna linia, kafel "Więcej" zbędny
  const compact = fitsOneLine ? sorted : sorted.slice(0, 7);
  const selected = list.find((c) => c.id === value);
  const showSelectedExtra = selected && !compact.includes(selected);
  const filtered = sorted.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {(showSelectedExtra ? [selected, ...compact.slice(0, 6)] : compact).map((c) => (
          <button type="button" key={c.id} className={`cat-tile ${value === c.id ? "on" : ""}`} onClick={() => onChange(c.id)}>
            <CatIcon cat={c} size={36} /><span>{c.name}</span>
          </button>
        ))}
        {!fitsOneLine && (
          <button type="button" className="cat-tile" onClick={() => setFull(true)}>
            <div className="icon-badge" style={{ width: 36, height: 36, background: "var(--surface3)", color: "var(--muted)" }}>
              <LayoutGrid size={17} />
            </div>
            <span>Więcej</span>
          </button>
        )}
      </div>
      <Sheet open={full} onClose={() => setFull(false)} title="Wszystkie kategorie" wide>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Szukaj kategorii…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={AUTOF} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 8 }}>
          {filtered.map((c) => (
            <button type="button" key={c.id} className={`cat-tile ${value === c.id ? "on" : ""}`}
              onClick={() => { onChange(c.id); setFull(false); }}>
              <CatIcon cat={c} size={36} /><span>{c.name}</span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p style={{ color: "var(--muted)", fontWeight: 600, textAlign: "center", padding: 20 }}>Brak wyników dla „{q}".</p>}
      </Sheet>
    </>
  );
}

/* ---------------- transaction form ---------------- */

function TransactionForm({ data, initial, onSave, onClose }) {
  const editing = !!initial?.id;
  const [type, setType] = useState(initial?.type || "expense");
  const [name, setName] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount != null ? String(initial.amount).replace(".", ",") : "");
  const [currency, setCurrency] = useState(initial?.currency || data.settings.mainCurrency);
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [note, setNote] = useState(initial?.note || "");
  const [showNote, setShowNote] = useState(!!initial?.note);
  const [recurring, setRecurring] = useState(false);
  const [recDay, setRecDay] = useState(new Date().getDate() > 28 ? 28 : new Date().getDate());
  const [startCycle, setStartCycle] = useState(false);
  const [errs, setErrs] = useState({});

  useEffect(() => {
    const cat = data.categories.find((c) => c.id === categoryId);
    if (cat && cat.type !== type) setCategoryId("");
  }, [type]); // eslint-disable-line

  const submit = () => {
    const e = {};
    const num = parseNum(amount);
    if (!name.trim()) e.name = "Podaj nazwę transakcji.";
    if (isNaN(num) || num <= 0) e.amount = "Kwota musi być liczbą większą od 0.";
    if (!categoryId) e.category = "Wybierz kategorię.";
    if (!date) e.date = "Podaj datę.";
    setErrs(e);
    if (Object.keys(e).length) return;
    onSave({
      id: initial?.id || uid(), type, name: name.trim(), amount: Math.round(num * 100) / 100,
      currency, categoryId, date, note: note.trim(), recurringId: initial?.recurringId,
    }, recurring && !editing ? { day: recDay } : null,
    { startCycle: startCycle && type === "income" && !editing, cycleDate: date });
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Seg value={type} onChange={setType}
          options={[{ value: "expense", label: "Wydatek" }, { value: "income", label: "Przychód" }]}
          tone={(v) => (v === "income" ? "pos" : "neg")} />
      </div>
      <Field label="Kwota" error={errs.amount}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><NumInput big value={amount} onChange={setAmount} error={errs.amount} /></div>
          <select className="select" style={{ width: 96, fontWeight: 800 }} value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label="Waluta">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </Field>
      <Field label="Nazwa" error={errs.name}>
        <input className={`input ${errs.name ? "err" : ""}`} placeholder={type === "expense" ? "np. Zakupy spożywcze" : "np. Wypłata za czerwiec"} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Kategoria" error={errs.category}>
        <CategoryGrid categories={data.categories} transactions={data.transactions} type={type} value={categoryId} onChange={setCategoryId} />
      </Field>
      <Field label="Data" error={errs.date}>
        <input type="date" className="input" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
      </Field>
      {!showNote ? (
        <button className="btn btn-ghost" style={{ marginBottom: 14, fontSize: 13 }} onClick={() => setShowNote(true)}>+ Dodaj notatkę</button>
      ) : (
        <Field label="Notatka (opcjonalna)">
          <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      )}
      {!editing && type === "income" && (
        <div className="card" style={{ padding: 14, marginBottom: 14, background: "var(--surface2)", boxShadow: "none" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            <input type="checkbox" checked={startCycle} onChange={(e) => setStartCycle(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
            <span>
              Zakończ obecny miesiąc i rozpocznij nowy od tej wypłaty
              <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted)", marginTop: 3, lineHeight: 1.5 }}>
                Statystyki na Pulpicie będą liczone „od wypłaty do wypłaty" zamiast od 1. dnia miesiąca — przydatne, gdy pensja przychodzi w różnych dniach.
              </span>
            </span>
          </label>
        </div>
      )}
      {!editing && (
        <div className="card" style={{ padding: 14, marginBottom: 16, background: "var(--surface2)", boxShadow: "none" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--accent)" }} />
            Transakcja cykliczna (co miesiąc)
          </label>
          {recurring && (
            <div style={{ marginTop: 12 }}>
              <label className="label">Dzień miesiąca (1–28)</label>
              <select className="select" value={recDay} onChange={(e) => setRecDay(Number(e.target.value))}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit}>{editing ? "Zapisz zmiany" : "Dodaj transakcję"}</button>
      </div>
    </>
  );
}

/* ---------------- dashboard ---------------- */

function Donut({ slices, size = 150, centerLabel, centerValue }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", userSelect: "none" }}
      onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <div style={{ width: size, height: size, flexShrink: 0, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={slices.length ? slices : [{ name: "brak", value: 1 }]} dataKey="value"
              innerRadius="68%" outerRadius="100%" paddingAngle={slices.length > 1 ? 3 : 0}
              startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}>
              {(slices.length ? slices : [{ color: "var(--surface3)" }]).map((s, i) => (
                <Cell key={i} fill={s.color || "var(--surface3)"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{centerLabel}</div>
          <div className="sens" style={{ fontSize: fit(centerValue, 15, 11, 10), fontWeight: 800 }}>{centerValue}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 120, display: "flex", flexDirection: "column", gap: 8 }}>
        {slices.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
            <span style={{ color: "var(--muted)" }}>{total ? Math.round((s.value / total) * 100) : 0}%</span>
          </div>
        ))}
        {slices.length === 0 && <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>Brak wydatków w tym okresie.</span>}
      </div>
    </div>
  );
}

function catSlices(txs, categories, toMain, limit = 5) {
  const byCat = {};
  txs.filter((t) => t.type === "expense").forEach((t) => {
    byCat[t.categoryId] = (byCat[t.categoryId] || 0) + toMain(t.amount, t.currency);
  });
  const arr = Object.entries(byCat).map(([id, value]) => {
    const c = categories.find((x) => x.id === id) || UNCAT;
    return { name: c.name, color: c.color, value };
  }).sort((a, b) => b.value - a.value);
  if (limit && arr.length > limit) {
    const top = arr.slice(0, limit - 1);
    const rest = arr.slice(limit - 1).reduce((s, x) => s + x.value, 0);
    return [...top, { name: "Pozostałe", color: "#6B7280", value: rest }];
  }
  return arr;
}

function StatRail({ children }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const count = React.Children.count(children);
  const onScroll = () => {
    const el = ref.current;
    if (!el || count < 2) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    setIdx(Math.min(count - 1, Math.max(0, Math.round((el.scrollLeft / max) * (count - 1)))));
  };
  return (
    <div>
      <div className="stat-grid stagger" ref={ref} onScroll={onScroll}>{children}</div>
      {count > 1 && (
        <div className="rail-dots" aria-hidden="true">
          {Array.from({ length: count }).map((_, i) => <span key={i} className={i === idx ? "on" : ""} />)}
        </div>
      )}
    </div>
  );
}

function PasswordInput({ value, onChange, error, placeholder, autoComplete, onKeyDown, autoFocus }) {
  const [show, setShow] = useState(false);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  const hold = (e) => { e.preventDefault(); clearTimeout(tRef.current); setShow(true); };
  const release = () => { clearTimeout(tRef.current); tRef.current = setTimeout(() => setShow(false), 1200); };
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} className={`input ${error ? "err" : ""}`}
        style={{ paddingRight: 46 }} placeholder={placeholder} autoComplete={autoComplete}
        value={value} autoFocus={autoFocus} onChange={onChange} onKeyDown={onKeyDown} />
      <button type="button" className="pass-eye" aria-label="Przytrzymaj, aby odsłonić hasło" tabIndex={-1}
        onPointerDown={hold} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}>
        {show ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}

function PinDigits({ value, onChange, error, autoFocus }) {
  const [reveal, setReveal] = useState(false);
  const tRef = useRef(null);
  const inpRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  const handle = (raw) => {
    const nv = raw.replace(/\D/g, "").slice(0, 4);
    const grew = nv.length > value.length;
    onChange(nv);
    clearTimeout(tRef.current);
    if (grew) {
      setReveal(true);
      tRef.current = setTimeout(() => setReveal(false), 650);
    } else setReveal(false);
  };
  return (
    <div style={{ position: "relative", cursor: "text" }} onClick={() => inpRef.current?.focus()}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pin-box ${error ? "err" : ""} ${i === Math.min(value.length, 3) && value.length < 4 ? "active" : ""}`}>
            {i < value.length ? (i === value.length - 1 && reveal ? value[i] : "•") : ""}
          </div>
        ))}
      </div>
      <input ref={inpRef} className="pin-hidden" inputMode="numeric" autoComplete="one-time-code"
        aria-label="Kod PIN" value={value} autoFocus={autoFocus}
        onChange={(e) => handle(e.target.value)} />
    </div>
  );
}

function Dashboard({ data, helpers, go, update, toast, userEmail, onAdd, onEditTx, onDeleteTx }) {
  const { toMain, main } = helpers;
  const now = new Date();
  const curYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYM = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  const balance = data.transactions.reduce((s, t) => s + (t.type === "income" ? 1 : -1) * toMain(t.amount, t.currency), 0);
  const period = getPeriod(data);
  const todayStr = todayISO();
  const monthTx = period
    ? data.transactions.filter((t) => t.date >= period.from && t.date <= todayStr)
    : data.transactions.filter((t) => ym(t.date) === curYM);
  const prevTx = period
    ? (period.prevFrom ? data.transactions.filter((t) => t.date >= period.prevFrom && t.date < period.from) : [])
    : data.transactions.filter((t) => ym(t.date) === prevYM);
  const periodLabel = period ? "w tym okresie" : "w tym mies.";
  const vsLabel = period ? "vs poprzedni okres" : "vs poprzedni mies.";
  const sum = (arr, type) => arr.filter((t) => t.type === type).reduce((s, t) => s + toMain(t.amount, t.currency), 0);
  const inc = sum(monthTx, "income"), exp = sum(monthTx, "expense");
  const pInc = sum(prevTx, "income"), pExp = sum(prevTx, "expense");
  const savingsRate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
  const animBalance = useCountUp(balance);
  const recent = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 5);
  const slices = catSlices(monthTx, data.categories, toMain);
  const trend = (cur, prv) => (prv > 0 ? ((cur - prv) / prv) * 100 : null);
  const hidden = !!data.settings.hideBalance;
  const [pinSheet, setPinSheet] = useState(null); // "setup" | "enter" | "forgot"
  const [pin1, setPin1] = useState(""); const [pin2, setPin2] = useState("");
  const [pinTry, setPinTry] = useState(""); const [pinErr, setPinErr] = useState("");
  const [fpPass, setFpPass] = useState(""); const [fpBusy, setFpBusy] = useState(false);
  const openPinSheet = (which) => { setPin1(""); setPin2(""); setPinTry(""); setPinErr(""); setFpPass(""); setPinSheet(which); };

  const toggleIncognito = () => {
    if (!hidden) {
      if (!data.settings.incognitoPinHash) openPinSheet("setup");
      else { update((d) => ({ ...d, settings: { ...d.settings, hideBalance: true } })); toast("Tryb incognito włączony"); }
    } else openPinSheet("enter");
  };

  const savePinAndEnable = async () => {
    if (!/^\d{4}$/.test(pin1)) return setPinErr("Kod musi składać się z 4 cyfr.");
    if (pin1 !== pin2) return setPinErr("Kody różnią się od siebie — wpisz je ponownie.");
    const hash = await sha256(pin1);
    update((d) => ({ ...d, settings: { ...d.settings, incognitoPinHash: hash, hideBalance: true } }));
    setPinSheet(null); toast("Kod ustawiony · tryb incognito włączony");
  };

  const tryDisable = async () => {
    if (!/^\d{4}$/.test(pinTry)) return setPinErr("Wpisz 4-cyfrowy kod.");
    const hash = await sha256(pinTry);
    if (hash !== data.settings.incognitoPinHash) { setPinTry(""); return setPinErr("Nieprawidłowy kod — spróbuj ponownie."); }
    update((d) => ({ ...d, settings: { ...d.settings, hideBalance: false } }));
    setPinSheet(null); toast("Tryb incognito wyłączony");
  };

  const forgotPin = async () => {
    if (!fpPass) return setPinErr("Podaj hasło do konta.");
    setFpBusy(true); setPinErr("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: userEmail, password: fpPass });
      if (error) throw error;
      update((d) => ({ ...d, settings: { ...d.settings, incognitoPinHash: null, hideBalance: false } }));
      setPinSheet(null); toast("Kod zresetowany · tryb incognito wyłączony");
    } catch {
      setPinErr("Nieprawidłowe hasło do konta.");
    } finally { setFpBusy(false); }
  };

  const prevBal = pInc - pExp, curBal = inc - exp;
  const balPct = prevBal !== 0 ? ((curBal - prevBal) / Math.abs(prevBal)) * 100 : null;

  /* forecast: tempo wydatków + nadchodzące płatności cykliczne, w granicach okresu */
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = period
    ? Math.max(1, Math.round((new Date(todayStr) - new Date(period.from)) / 864e5) + 1)
    : dayOfMonth;
  const daysRemaining = period
    ? Math.max(0, period.len - daysElapsed)
    : daysInMonth - dayOfMonth;
  const upcomingRec = data.recurring
    .filter((r) => !r.paused && Math.min(r.day, 28) > dayOfMonth)
    .reduce((s, r) => s + (r.type === "income" ? 1 : -1) * toMain(r.amount, r.currency), 0);
  const dailyExp = exp / daysElapsed;
  const forecast = balance - dailyExp * daysRemaining + (period ? 0 : upcomingRec);

  /* (9) ocena statusu salda względem dni pozostałych do końca okresu */
  const saldoStatus = forecast < 0
    ? { icon: ThumbsDown, color: "var(--neg)", bg: "var(--neg-dim)", text: `Przy tym tempie zabraknie środków przed końcem ${period ? "okresu" : "miesiąca"}` }
    : forecast >= balance
      ? { icon: ThumbsUp, color: "var(--accent)", bg: "var(--accent-dim)", text: `Świetnie — saldo utrzyma się do końca ${period ? "okresu" : "miesiąca"} (zostało ${daysRemaining} dni)` }
      : { icon: Minus, color: "var(--warn)", bg: "color-mix(in srgb, var(--warn) 15%, transparent)", text: `Stabilnie — saldo lekko stopnieje przez pozostałe ${daysRemaining} dni` };

  /* budgets: spent this month per budgeted category */
  const budgetRows = Object.entries(data.budgets?.[curYM] || {})
    .filter(([, limit]) => limit > 0)
    .map(([catId, limit]) => {
      const cat = data.categories.find((c) => c.id === catId);
      if (!cat) return null;
      const spent = monthTx.filter((t) => t.type === "expense" && t.categoryId === catId)
        .reduce((s, t) => s + toMain(t.amount, t.currency), 0);
      return { cat, limit, spent, ratio: spent / limit };
    }).filter(Boolean).sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="hero-balance hero-v2">
        <div style={{ position: "relative" }}>
          <button className="hero-eye2" aria-label={hidden ? "Wyłącz tryb incognito" : "Włącz tryb incognito"} onClick={toggleIncognito}>
            {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <div className="hero-kicker">Saldo całkowite</div>
          <div className="big-num sens hero-num" style={{ fontSize: `min(${fit(fmtMoney(balance, main), 52, 26, 12)}px, 11.5vw)` }}>{fmtMoney(animBalance, main)}</div>
          <div className="sens hero-chips">
            <span className="chip chip-pos"><ArrowUpRight size={14} /> {fmtMoney(inc, main, true)} {periodLabel}</span>
            <span className="chip chip-neg"><ArrowDownRight size={14} /> {fmtMoney(exp, main, true)} {periodLabel}</span>
          </div>
          <div className="hero-status" style={{ color: saldoStatus.color }}>
            <saldoStatus.icon size={14} style={{ flexShrink: 0 }} /> <span>{saldoStatus.text}</span>
          </div>
          <div className="hero-ratio sens">
            <div className="hr-track">
              <div className="hr-fill" style={{ width: `${inc + exp > 0 ? (inc / (inc + exp)) * 100 : 50}%` }} />
            </div>
            <div className="hr-caption">
              <span style={{ color: "var(--accent)" }}>wpłaty {inc + exp > 0 ? ((inc / (inc + exp)) * 100).toFixed(0) : 50}%</span>
              <span style={{ color: "var(--neg)" }}>wydatki {inc + exp > 0 ? ((exp / (inc + exp)) * 100).toFixed(0) : 50}%</span>
            </div>
          </div>
          <div className="hero-extra sens">
            <div className="hx-cell"><div className="hx-l">Bilans okresu</div><div className="hx-v" style={{ color: curBal >= 0 ? "var(--accent)" : "var(--neg)" }}>{fmtMoney(curBal, main, true)}</div></div>
            <div className="hx-cell"><div className="hx-l">Prognoza salda</div><div className="hx-v" style={{ color: forecast >= 0 ? "var(--info)" : "var(--neg)" }}>{fmtMoney(forecast, main, true)}</div></div>
            <div className="hx-cell"><div className="hx-l">Stopa oszczędności</div><div className="hx-v">{Math.max(0, savingsRate).toFixed(0)}%</div></div>
            <div className="hx-cell"><div className="hx-l">Dni do końca</div><div className="hx-v">{daysRemaining}</div></div>
          </div>
          <div className="quick-row">
            <button className="quick" onClick={() => go("history")}><span className="quick-ic"><List size={19} /></span><span>Historia</span></button>
            <button className="quick" onClick={() => go("goals")}><span className="quick-ic"><Target size={19} /></span><span>Cele</span></button>
            <button className="quick" onClick={() => go("stats")}><span className="quick-ic"><BarChart3 size={19} /></span><span>Analizy</span></button>
            <button className="quick" onClick={() => go("reports")}><span className="quick-ic"><FileText size={19} /></span><span>Raporty</span></button>
          </div>
        </div>
      </div>

      <StatRail>
        <StatCard icon={ArrowUpRight} label="Przychody" value={fmtMoney(inc, main, true)} tone="pos" trend={trend(inc, pInc)} sub={vsLabel} />
        <StatCard icon={ArrowDownRight} label="Wydatki" value={fmtMoney(exp, main, true)} tone="neg" trend={trend(exp, pExp)} sub={vsLabel} />
        <StatCard icon={PiggyBank} label="Bilans miesiąca" value={fmtMoney(curBal, main, true)} tone="info" trend={balPct}
          sub={balPct != null ? `${balPct >= 0 ? "lepiej" : "gorzej"} niż poprzednio` : (period ? "pierwszy okres — brak porównania" : "brak danych z poprz. mies.")} />
        <StatCard icon={Percent} label="Stopa oszczędności" value={`${Math.max(0, savingsRate).toFixed(0)}%`} sub={inc > 0 ? "przychodów zostaje" : "brak przychodów"} />
        <StatCard icon={TrendingUp} label="Prognoza salda" value={fmtMoney(forecast, main, true)} tone={forecast >= balance ? "pos" : "neg"}
          sub={period ? `koniec okresu za ~${daysRemaining} dni · tempo wydatków` : "na koniec miesiąca · tempo wydatków + cykliczne"} />
      </StatRail>

      {budgetRows.length > 0 && (
        <div className="card" style={{ padding: 18 }}>
          <div className="sec-head">
            <div><div className="sec-kicker">Kontrola wydatków</div><div className="sec-title">Budżety miesięczne</div></div>
            <span className="sec-side">{MONTHS_FULL[now.getMonth()].toLowerCase()}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {budgetRows.map(({ cat, limit, spent, ratio }) => {
              const pct = Math.min(100, ratio * 100);
              const color = ratio >= 1 ? "var(--neg)" : ratio >= 0.8 ? "var(--warn)" : "var(--accent)";
              return (
                <div key={cat.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 800, fontSize: 13.5, flex: 1 }}>{cat.name}</span>
                    <span className="sens" style={{ fontSize: 12.5, fontWeight: 800, color }}>
                      {fmtMoney(spent, main, true)} / {fmtMoney(limit, main, true)}
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 7 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  {ratio >= 1 && <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--neg)", marginTop: 4 }}>Budżet przekroczony o <span className="sens">{fmtMoney(spent - limit, main, true)}</span></div>}
                  {ratio >= 0.8 && ratio < 1 && <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--warn)", marginTop: 4 }}>Zbliżasz się do limitu ({pct.toFixed(0)}%)</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="desk-cols">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Ostatnie transakcje</div>
            <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => go("history")}>
              Zobacz wszystkie <ChevronRight size={14} />
            </button>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={Wallet} title="Brak transakcji" desc="Dodaj pierwszą transakcję przyciskiem +, aby zobaczyć ją tutaj." />
          ) : (
            <div className="tx-list" style={{ display: "flex", flexDirection: "column" }}>
              {recent.map((t) => (
                <TxRow key={t.id} tx={t} cat={data.categories.find((c) => c.id === t.categoryId)}
                  main={main} toMain={toMain} onEdit={onEditTx} onDelete={onDeleteTx} showDate />
              ))}
            </div>
          )}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Wydatki wg kategorii <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>· {MONTHS_FULL[now.getMonth()].toLowerCase()}</span></div>
          <Donut slices={slices} centerLabel="Wydatki" centerValue={fmtMoney(exp, main, true)} />
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 14, fontSize: 13 }} onClick={() => go("stats")}>Pełny podział w Statystykach</button>
        </div>
      </div>

      <Sheet open={pinSheet === "setup"} onClose={() => setPinSheet(null)} title="Zabezpiecz tryb incognito">
        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
          Tryb incognito rozmywa wszystkie kwoty w aplikacji — przydaje się, gdy ktoś zagląda Ci przez ramię.
          Zanim go pierwszy raz włączysz, ustaw <b style={{ color: "var(--text)" }}>4-cyfrowy kod</b>: będzie wymagany
          do <b style={{ color: "var(--text)" }}>wyłączenia</b> trybu, żeby nikt poza Tobą nie mógł odsłonić Twoich finansów.
        </p>
        <Field label="Wybierz kod (4 cyfry)"><PinDigits value={pin1} onChange={(v) => { setPin1(v); setPinErr(""); }} error={pinErr} autoFocus={AUTOF} /></Field>
        <Field label="Powtórz kod" error={pinErr}><PinDigits value={pin2} onChange={(v) => { setPin2(v); setPinErr(""); }} error={pinErr} /></Field>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setPinSheet(null)}>Anuluj</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={savePinAndEnable}>Ustaw kod i włącz</button>
        </div>
      </Sheet>

      <Sheet open={pinSheet === "enter"} onClose={() => setPinSheet(null)} title="Wyłącz tryb incognito">
        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
          Podaj 4-cyfrowy kod, aby odsłonić kwoty.
        </p>
        <Field label="Kod" error={pinErr}><PinDigits value={pinTry} onChange={(v) => { setPinTry(v); setPinErr(""); }} error={pinErr} autoFocus={AUTOF} /></Field>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setPinSheet(null)}>Anuluj</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={tryDisable}>Wyłącz incognito</button>
        </div>
        <button className="btn btn-ghost" style={{ width: "100%", fontSize: 12.5 }} onClick={() => openPinSheet("forgot")}>Nie pamiętam kodu</button>
      </Sheet>

      <Sheet open={pinSheet === "forgot"} onClose={() => setPinSheet(null)} title="Reset kodu incognito">
        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
          Potwierdź tożsamość <b style={{ color: "var(--text)" }}>hasłem do konta</b> — kod zostanie usunięty,
          a tryb incognito wyłączony. Przy następnym włączeniu ustawisz nowy kod.
        </p>
        <Field label="Hasło do konta" error={pinErr}>
          <PasswordInput error={pinErr} value={fpPass} autoFocus={AUTOF}
            onChange={(e) => { setFpPass(e.target.value); setPinErr(""); }} onKeyDown={(e) => e.key === "Enter" && forgotPin()} />
        </Field>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setPinSheet(null)}>Anuluj</button>
          <button className="btn btn-danger-solid" style={{ flex: 2 }} disabled={fpBusy} onClick={forgotPin}>{fpBusy ? "Sprawdzam…" : "Zresetuj kod"}</button>
        </div>
      </Sheet>
    </div>
  );
}

/* ---------------- history ---------------- */

function History({ data, helpers, onEditTx, onDeleteTx }) {
  const { toMain, main } = helpers;
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const filtered = useMemo(() => {
    let arr = data.transactions;
    if (type !== "all") arr = arr.filter((t) => t.type === type);
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter((t) => {
        const c = data.categories.find((x) => x.id === t.categoryId);
        return t.name.toLowerCase().includes(s) || (c && c.name.toLowerCase().includes(s));
      });
    }
    const [key, dir] = sort.split("-");
    arr = [...arr].sort((a, b) => {
      const v = key === "date" ? a.date.localeCompare(b.date) : toMain(a.amount, a.currency) - toMain(b.amount, b.currency);
      return dir === "asc" ? v : -v;
    });
    return arr;
  }, [data, q, type, sort, toMain]);

  const totInc = filtered.filter((t) => t.type === "income").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
  const totExp = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + toMain(t.amount, t.currency), 0);

  const groups = useMemo(() => {
    if (!sort.startsWith("date")) return [{ key: "", items: filtered }];
    const g = [];
    filtered.forEach((t) => {
      const last = g[g.length - 1];
      if (last && last.key === t.date) last.items.push(t);
      else g.push({ key: t.date, items: [t] });
    });
    return g;
  }, [filtered, sort]);

  return (
    <div className="fade-in">
      <div className="hist-head">
        <h1 className="page-title" style={{ marginBottom: 14 }}>Historia</h1>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Szukaj po nazwie lub kategorii…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 220px" }}>
            <Seg value={type} onChange={setType} tone={(v) => (v === "income" ? "pos" : v === "expense" ? "neg" : "")}
              options={[{ value: "all", label: "Wszystkie" }, { value: "income", label: "Przychody" }, { value: "expense", label: "Wydatki" }]} />
          </div>
          <select className="select" style={{ flex: "1 1 150px", width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sortowanie">
            <option value="date-desc">Data: najnowsze</option>
            <option value="date-asc">Data: najstarsze</option>
            <option value="amount-desc">Kwota: malejąco</option>
            <option value="amount-asc">Kwota: rosnąco</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "var(--muted)", flexWrap: "wrap" }}>
          <span>{filtered.length} transakcji</span>
          {type !== "expense" && <span className="sens" style={{ color: "var(--accent)" }}>+{fmtMoney(totInc, main, true)}</span>}
          {type !== "income" && <span className="sens" style={{ color: "var(--neg)" }}>−{fmtMoney(totExp, main, true)}</span>}
          {type === "all" && <span className="sens" style={{ color: "var(--info)" }}>bilans {fmtMoney(totInc - totExp, main, true)}</span>}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="Nic tu nie ma" desc={q ? `Brak transakcji pasujących do „${q}".` : "Brak transakcji spełniających filtry."} />
      ) : (
        groups.map((g) => (
          <div key={g.key || "all"} style={{ marginBottom: 6 }}>
            {g.key && <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", padding: "12px 4px 6px", textTransform: "uppercase", letterSpacing: ".04em" }}>{fmtDate(g.key)}</div>}
            <div className="card tx-list" style={{ padding: 6, display: "flex", flexDirection: "column" }}>
              {g.items.map((t) => (
                <TxRow key={t.id} tx={t} cat={data.categories.find((c) => c.id === t.categoryId)}
                  main={main} toMain={toMain} onEdit={onEditTx} onDelete={onDeleteTx} showDate={!g.key} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- stats ---------------- */

/* ---------------- insights & AI analysis ---------------- */

const AI_COOLDOWN = 10 * 60 * 1000; // 10 min
const aiCooldownLeft = (data) => Math.max(0, AI_COOLDOWN - (Date.now() - (data.settings.aiLastAt || 0)));

function buildInsights(txs, allTx, categories, toMain, main) {
  const out = [];
  const exp = txs.filter((t) => t.type === "expense");
  const inc = txs.filter((t) => t.type === "income");
  const sumE = exp.reduce((s, t) => s + toMain(t.amount, t.currency), 0);
  const sumI = inc.reduce((s, t) => s + toMain(t.amount, t.currency), 0);
  if (!txs.length) return [{ icon: BarChart3, tone: "muted", text: "Brak transakcji w tym zakresie — dodaj kilka, aby zobaczyć wnioski." }];

  const byCat = {};
  exp.forEach((t) => { byCat[t.categoryId] = (byCat[t.categoryId] || 0) + toMain(t.amount, t.currency); });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (top && sumE > 0) {
    const c = categories.find((x) => x.id === top[0]) || UNCAT;
    out.push({ icon: BarChart3, tone: "info", text: `Największa kategoria wydatków to ${c.name} — ${fmtMoney(top[1], main, true)} (${Math.round((top[1] / sumE) * 100)}% całości).` });
  }
  if (sumI > 0) {
    const rate = ((sumI - sumE) / sumI) * 100;
    if (rate >= 20) out.push({ icon: TrendingUp, tone: "pos", text: `Świetna stopa oszczędności: zostaje Ci ${rate.toFixed(0)}% przychodów. Zasada 50/30/20 zaleca min. 20% — jesteś powyżej.` });
    else if (rate >= 0) out.push({ icon: PiggyBank, tone: "warn", text: `Odkładasz ${rate.toFixed(0)}% przychodów. Do zalecanych 20% (reguła 50/30/20) brakuje ${(20 - rate).toFixed(0)} p.p.` });
    else out.push({ icon: TrendingDown, tone: "neg", text: `Wydajesz więcej, niż zarabiasz — bilans na minusie o ${fmtMoney(sumE - sumI, main, true)}.` });
  }
  const biggest = [...exp].sort((a, b) => toMain(b.amount, b.currency) - toMain(a.amount, a.currency))[0];
  if (biggest) out.push({ icon: ArrowDownRight, tone: "muted", text: `Największy pojedynczy wydatek: „${biggest.name}" — ${fmtMoney(toMain(biggest.amount, biggest.currency), main, true)} (${fmtDate(biggest.date)}).` });

  // anomalies: expense > 3x category average
  const catAvg = {};
  const catCnt = {};
  exp.forEach((t) => { const v = toMain(t.amount, t.currency); catAvg[t.categoryId] = (catAvg[t.categoryId] || 0) + v; catCnt[t.categoryId] = (catCnt[t.categoryId] || 0) + 1; });
  const anomaly = exp.find((t) => {
    const n = catCnt[t.categoryId];
    if (n < 3) return false;
    const avg = catAvg[t.categoryId] / n;
    return toMain(t.amount, t.currency) > avg * 3;
  });
  if (anomaly) {
    const c = categories.find((x) => x.id === anomaly.categoryId) || UNCAT;
    out.push({ icon: AlertTriangle, tone: "warn", text: `Nietypowy wydatek: „${anomaly.name}" jest ponad 3× większy niż Twoja średnia w kategorii ${c.name}.` });
  }
  const fuel = byCat["c-fuel"];
  if (fuel && sumE > 0 && fuel / sumE > 0.15) {
    out.push({ icon: Fuel, tone: "muted", text: `Paliwo to aż ${Math.round((fuel / sumE) * 100)}% Twoich wydatków w tym okresie — sprawdź ranking stacji, może da się zatankować taniej.` });
  }
  return out.slice(0, 5);
}

function AiAnalysisCard({ data, txs, helpers, rangeLabel, update }) {
  const { toMain, main } = helpers;
  const [aiText, setAiText] = useState(null);
  const [aiErr, setAiErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const insights = useMemo(() => buildInsights(txs, data.transactions, data.categories, toMain, main), [txs, data, toMain, main]);
  const toneColor = { pos: "var(--accent)", neg: "var(--neg)", warn: "var(--warn)", info: "var(--info)", muted: "var(--muted)" };

  const askAI = async () => {
    const left = aiCooldownLeft(data);
    if (left > 0) {
      setAiErr(`Limit generowań: kolejna analiza AI będzie dostępna za ${Math.ceil(left / 60000)} min.`);
      return;
    }
    const prevStamp = data.settings.aiLastAt || 0;
    update((d) => ({ ...d, settings: { ...d.settings, aiLastAt: Date.now() } }));
    setLoading(true); setAiErr(null); setAiText(null);
    try {
      const exp = txs.filter((t) => t.type === "expense").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
      const inc = txs.filter((t) => t.type === "income").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
      const byCat = {};
      txs.filter((t) => t.type === "expense").forEach((t) => {
        const c = (data.categories.find((x) => x.id === t.categoryId) || UNCAT).name;
        byCat[c] = (byCat[c] || 0) + toMain(t.amount, t.currency);
      });
      const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([n, v]) => `${n}: ${v.toFixed(0)} ${main}`).join(", ");
      const goals = data.goals.map((g) => `${g.name}: ${Math.round((g.saved / g.target) * 100)}%`).join(", ") || "brak";
      const prompt = `Jesteś doradcą finansów osobistych. Dane użytkownika za okres "${rangeLabel}" (waluta ${main}): przychody ${inc.toFixed(0)}, wydatki ${exp.toFixed(0)}, bilans ${(inc - exp).toFixed(0)}, liczba transakcji ${txs.length}. Wydatki wg kategorii: ${cats || "brak"}. Postęp celów oszczędnościowych: ${goals}. Napisz po polsku zwięzłą analizę (maks. 130 słów): 1) krótka ocena sytuacji, 2) dwa najważniejsze wnioski, 3) dwie konkretne rady. Zwykły tekst, bez markdown i bez nagłówków.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const out = await res.json();
      const text = (out.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n").trim();
      if (!text) throw new Error("empty");
      setAiText(text);
    } catch {
      update((d) => ({ ...d, settings: { ...d.settings, aiLastAt: prevStamp } })); // refund limit on failure
      setAiErr("Analiza AI jest dostępna, gdy aplikacja działa w Claude.ai. Lokalnie korzystaj z automatycznych wniosków powyżej — liczą się w pełni offline i za darmo.");
    } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <Sparkles size={17} style={{ color: "var(--violet)" }} /> Wnioski i analiza
      </div>
      <div className="sens" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div className="icon-badge" style={{ width: 28, height: 28, background: "var(--surface2)", color: toneColor[ins.tone], flexShrink: 0 }}>
              <ins.icon size={14} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: "var(--text)" }}>{ins.text}</div>
          </div>
        ))}
      </div>
      {aiText && (
        <div className="card sens" style={{ padding: 14, background: "var(--surface2)", boxShadow: "none", marginBottom: 12, fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {aiText}
        </div>
      )}
      {aiErr && <div style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>{aiErr}</div>}
      <button className="btn btn-ghost" style={{ width: "100%" }} disabled={loading} onClick={askAI}>
        <Sparkles size={15} style={{ color: "var(--violet)" }} /> {loading ? "Analizuję…" : aiText ? "Analizuj ponownie (AI)" : "Poproś AI o analizę"}
      </button>
    </div>
  );
}

const PRESETS = [
  { id: "m", label: "Miesiąc" }, { id: "3m", label: "3M" }, { id: "6m", label: "6M" },
  { id: "y", label: "Rok" }, { id: "all", label: "Całość" }, { id: "custom", label: "Własny" },
];

function rangeFromPreset(preset, custom) {
  const now = new Date();
  const end = todayISO();
  if (preset === "custom") return { from: custom.from, to: custom.to };
  if (preset === "all") return { from: "1970-01-01", to: end };
  if (preset === "m") return { from: `${end.slice(0, 7)}-01`, to: end };
  const months = preset === "3m" ? 3 : preset === "6m" ? 6 : 12;
  const d = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  return { from: d.toISOString().slice(0, 10), to: end };
}

function Heatmap({ txs, toMain, monthISO, main }) {
  const [y, m] = monthISO.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const sums = {};
  txs.forEach((t) => {
    if (t.type === "expense" && t.date.startsWith(monthISO)) {
      const d = Number(t.date.slice(8));
      sums[d] = (sums[d] || 0) + toMain(t.amount, t.currency);
    }
  });
  const max = Math.max(0, ...Object.values(sums));
  const firstDow = (new Date(y, m - 1, 1).getDay() + 6) % 7; // Monday = 0
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const dows = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 5 }}>
        {dows.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 800, color: "var(--muted)" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
        {cells.map((d, i) => {
          if (d == null) return <div key={`b${i}`} />;
          const v = sums[d] || 0;
          const pct = max > 0 ? Math.round(10 + (v / max) * 75) : 0;
          return (
            <div key={d} title={v > 0 ? `${d}.${String(m).padStart(2, "0")}: ${fmtMoney(v, main)}` : `${d}.${String(m).padStart(2, "0")}: brak wydatków`}
              style={{ aspectRatio: "1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, cursor: "default", color: v > 0 && pct > 45 ? "#fff" : "var(--muted)", background: v > 0 ? `color-mix(in srgb, var(--neg) ${pct}%, var(--surface2))` : "var(--surface2)", border: "1px solid var(--line)" }}>
              {d}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 10.5, fontWeight: 700, color: "var(--muted)", justifyContent: "flex-end" }}>
        mniej
        {[0, 25, 50, 75, 100].map((p) => (
          <span key={p} style={{ width: 12, height: 12, borderRadius: 4, background: p === 0 ? "var(--surface2)" : `color-mix(in srgb, var(--neg) ${10 + p * 0.75}%, var(--surface2))`, border: "1px solid var(--line)" }} />
        ))}
        więcej
      </div>
    </div>
  );
}

function Stats({ data, helpers, go, update, toast }) {
  const { toMain, main } = helpers;
  const [preset, setPreset] = useState("m");
  const [custom, setCustom] = useState({ from: `${todayISO().slice(0, 7)}-01`, to: todayISO() });
  const [chartsReady, setChartsReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setChartsReady(true), 30);
    return () => clearTimeout(t);
  }, []);
  const range = rangeFromPreset(preset, custom);
  const txs = data.transactions.filter((t) => t.date >= range.from && t.date <= range.to);

  const monthly = useMemo(() => {
    const map = {};
    txs.forEach((t) => {
      const k = ym(t.date);
      map[k] = map[k] || { m: k, Przychody: 0, Wydatki: 0 };
      map[k][t.type === "income" ? "Przychody" : "Wydatki"] += toMain(t.amount, t.currency);
    });
    return Object.values(map).sort((a, b) => a.m.localeCompare(b.m))
      .map((r) => ({ ...r, label: `${MONTHS_PL[Number(r.m.slice(5)) - 1]} ${r.m.slice(2, 4)}` }));
  }, [txs, toMain]);

  const cumulative = useMemo(() => {
    const sorted = [...data.transactions].sort((a, b) => a.date.localeCompare(b.date));
    let acc = 0; const pts = [];
    sorted.forEach((t) => {
      acc += (t.type === "income" ? 1 : -1) * toMain(t.amount, t.currency);
      if (t.date >= range.from && t.date <= range.to) pts.push({ date: t.date, Saldo: Math.round(acc * 100) / 100 });
    });
    return pts;
  }, [data.transactions, range.from, range.to, toMain]);

  const slices = catSlices(txs, data.categories, toMain, 0);
  const exp = txs.filter((t) => t.type === "expense").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
  const tooltipStyle = { background: "var(--surface3)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: "var(--text)" };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h1 className="page-title">Statystyki</h1>
      <Seg options={PRESETS.map((p) => ({ value: p.id, label: p.label }))} value={preset} onChange={setPreset} />
      {preset === "custom" && (
        <div style={{ display: "flex", gap: 10 }}>
          <input type="date" className="input" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} aria-label="Od" />
          <input type="date" className="input" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} aria-label="Do" />
        </div>
      )}
      <div className="desk-cols">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>Przychody i wydatki miesięcznie</div>
            {monthly.length === 0 ? <p style={{ color: "var(--muted)", fontWeight: 600 }}>Brak danych w tym zakresie.</p> : !chartsReady ? <div className="skeleton" style={{ height: 230 }} /> : (
              <div style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer>
                  <BarChart data={monthly} barGap={3}>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={44} />
                    <RTooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface2)" }} formatter={(v) => fmtMoney(v, main, true)} />
                    <Bar dataKey="Przychody" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
                    <Bar dataKey="Wydatki" fill="var(--neg)" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>Saldo narastająco</div>
            {cumulative.length === 0 ? <p style={{ color: "var(--muted)", fontWeight: 600 }}>Brak danych w tym zakresie.</p> : !chartsReady ? <div className="skeleton" style={{ height: 210 }} /> : (
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <AreaChart data={cumulative}>
                    <defs>
                      <linearGradient id="gradSaldo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--info)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 10.5, fontWeight: 700 }} axisLine={false} tickLine={false} minTickGap={40} />
                    <YAxis tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={48} />
                    <RTooltip contentStyle={tooltipStyle} formatter={(v) => fmtMoney(v, main, true)} labelFormatter={fmtDate} />
                    <Area type="monotone" dataKey="Saldo" stroke="var(--info)" strokeWidth={2.5} fill="url(#gradSaldo)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>Heatmapa wydatków <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>· {MONTHS_FULL[Number(range.to.slice(5, 7)) - 1].toLowerCase()} {range.to.slice(0, 4)}</span></div>
            {chartsReady ? <Heatmap txs={data.transactions} toMain={toMain} monthISO={range.to.slice(0, 7)} main={main} /> : <div className="skeleton" style={{ height: 250 }} />}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>Wydatki wg kategorii</div>
            {chartsReady ? <Donut slices={slices} centerLabel="Razem" centerValue={fmtMoney(exp, main, true)} /> : <div className="skeleton" style={{ height: 150 }} />}
          </div>
          <AiAnalysisCard data={data} txs={txs} helpers={helpers} update={update} rangeLabel={PRESETS.find((p) => p.id === preset)?.label || "własny zakres"} />
          <ReportGenerator data={data} helpers={helpers} update={update} toast={toast} presetRange={null} />
          {data.goals.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 800 }}>Cele oszczędnościowe</div>
                <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => go("goals")}>Otwórz <ChevronRight size={14} /></button>
              </div>
              {data.goals.slice(0, 3).map((g) => {
                const pct = Math.min(100, (g.saved / g.target) * 100);
                return (
                  <div key={g.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                      <span>{g.name}</span><span style={{ color: "var(--muted)" }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ---------------- reports ---------------- */


const escHtml = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function downloadReportFile(report, data, main, toMain, aiNote) {
  const catName = (id) => (data.categories.find((c) => c.id === id) || UNCAT).name;
  const rows = report.txs.map((t) => `<tr>
    <td>${t.date}</td><td>${escHtml(t.name)}</td><td>${escHtml(catName(t.categoryId))}</td>
    <td class="r ${t.type}">${t.type === "income" ? "+" : "−"}${fmtMoney(toMain(t.amount, t.currency), main)}</td></tr>`).join("");
  const cats = report.slices.map((s) => `<tr><td>${escHtml(s.name)}</td>
    <td class="r">${report.exp ? ((s.value / report.exp) * 100).toFixed(1) : 0}%</td>
    <td class="r">${fmtMoney(s.value, main)}</td></tr>`).join("");
  const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Raport finansowy ${report.from} – ${report.to}</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#16202E;margin:36px;font-size:13px}
  h1{font-size:22px;margin:0 0 4px} .sub{color:#647082;margin-bottom:22px;font-weight:600}
  .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  .card{border:1px solid #D7DDE7;border-radius:12px;padding:12px 16px;min-width:140px}
  .card b{display:block;font-size:11px;color:#647082;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px}
  .card span{font-size:17px;font-weight:800}
  .pos{color:#0A9D69}.neg,.expense{color:#D8432A}.income{color:#0A9D69}.info{color:#2F6FD0}
  table{width:100%;border-collapse:collapse;margin-bottom:26px}
  th{font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;color:#647082;text-align:left;padding:7px 8px;border-bottom:2px solid #D7DDE7}
  td{padding:7px 8px;border-bottom:1px solid #E7ECF3} .r{text-align:right;font-weight:700}
  h2{font-size:15px;margin:0 0 10px}
  .bar{display:flex;justify-content:flex-end;margin:-6px 0 18px}
  .bar button{font:inherit;font-weight:800;font-size:13px;padding:9px 16px;border-radius:10px;border:1px solid #D7DDE7;background:#F3F6FA;cursor:pointer}
  @media print{body{margin:12mm}.bar{display:none}}
</style></head><body>
<div class="bar"><button onclick="window.print()">🖨 Drukuj / zapisz jako PDF</button></div>
<h1>Raport finansowy</h1>
<div class="sub">${fmtDate(report.from)} – ${fmtDate(report.to)} · waluta: ${main} · wygenerowano ${fmtDate(todayISO())}</div>
<div class="cards">
  <div class="card"><b>Przychody</b><span class="pos">${fmtMoney(report.inc, main)}</span></div>
  <div class="card"><b>Wydatki</b><span class="neg">${fmtMoney(report.exp, main)}</span></div>
  <div class="card"><b>Bilans</b><span class="info">${fmtMoney(report.inc - report.exp, main)}</span></div>
  <div class="card"><b>Transakcje</b><span>${report.txs.length}</span></div>
</div>
${aiNote ? `<h2>Wniosek AI</h2><p style="border:1px solid #D7DDE7;border-radius:12px;padding:12px 16px;line-height:1.6;margin:0 0 26px">${escHtml(aiNote)}</p>` : ""}
${report.slices.length ? `<h2>Podział wydatków wg kategorii</h2><table><thead><tr><th>Kategoria</th><th class="r">Udział</th><th class="r">Kwota</th></tr></thead><tbody>${cats}</tbody></table>` : ""}
<h2>Lista transakcji</h2>
<table><thead><tr><th>Data</th><th>Nazwa</th><th>Kategoria</th><th class="r">Kwota</th></tr></thead><tbody>${rows || "<tr><td colspan=4>Brak transakcji</td></tr>"}</tbody></table>
<script>window.onload = () => setTimeout(() => window.print(), 400);</script>
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `raport-${report.from}_${report.to}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function snapshotHtml(snap, autoPrint) {
  const rows = snap.rows.map((r) => `<tr>
    <td>${r.date}</td><td>${escHtml(r.name)}</td><td>${escHtml(r.cat)}</td>
    <td class="r ${r.type}">${r.type === "income" ? "+" : "−"}${fmtMoney(r.amt, snap.main)}</td></tr>`).join("");
  const cats = snap.slices.map((s) => `<tr><td>${escHtml(s.name)}</td>
    <td class="r">${snap.exp ? ((s.value / snap.exp) * 100).toFixed(1) : 0}%</td>
    <td class="r">${fmtMoney(s.value, snap.main)}</td></tr>`).join("");
  const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Raport finansowy ${snap.from} – ${snap.to}</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#16202E;margin:36px;font-size:13px}
  h1{font-size:22px;margin:0 0 4px} .sub{color:#647082;margin-bottom:22px;font-weight:600}
  .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  .card{border:1px solid #D7DDE7;border-radius:12px;padding:12px 16px;min-width:140px}
  .card b{display:block;font-size:11px;color:#647082;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px}
  .card span{font-size:17px;font-weight:800}
  .pos{color:#0A9D69}.neg,.expense{color:#D8432A}.income{color:#0A9D69}.info{color:#2F6FD0}
  table{width:100%;border-collapse:collapse;margin-bottom:26px}
  th{font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;color:#647082;text-align:left;padding:7px 8px;border-bottom:2px solid #D7DDE7}
  td{padding:7px 8px;border-bottom:1px solid #E7ECF3} .r{text-align:right;font-weight:700}
  h2{font-size:15px;margin:0 0 10px}
  .bar{display:flex;justify-content:flex-end;margin:-6px 0 18px}
  .bar button{font:inherit;font-weight:800;font-size:13px;padding:9px 16px;border-radius:10px;border:1px solid #D7DDE7;background:#F3F6FA;cursor:pointer}
  @media print{body{margin:12mm}.bar{display:none}}
</style></head><body>
<div class="bar"><button onclick="window.print()">🖨 Drukuj / zapisz jako PDF</button></div>
<h1>Raport finansowy</h1>
<div class="sub">${fmtDate(snap.from)} – ${fmtDate(snap.to)} · waluta: ${snap.main} · wygenerowano ${fmtDate(snap.createdAt.slice(0, 10))} o ${fmtTime(snap.createdAt)}</div>
<div class="cards">
  <div class="card"><b>Przychody</b><span class="pos">${fmtMoney(snap.inc, snap.main)}</span></div>
  <div class="card"><b>Wydatki</b><span class="neg">${fmtMoney(snap.exp, snap.main)}</span></div>
  <div class="card"><b>Bilans</b><span class="info">${fmtMoney(snap.inc - snap.exp, snap.main)}</span></div>
  <div class="card"><b>Transakcje</b><span>${snap.count}</span></div>
</div>
${snap.aiNote ? `<h2>Wniosek AI</h2><p style="border:1px solid #D7DDE7;border-radius:12px;padding:12px 16px;line-height:1.6;margin:0 0 26px">${escHtml(snap.aiNote)}</p>` : ""}
${snap.slices.length ? `<h2>Podział wydatków wg kategorii</h2><table><thead><tr><th>Kategoria</th><th class="r">Udział</th><th class="r">Kwota</th></tr></thead><tbody>${cats}</tbody></table>` : ""}
<h2>Lista transakcji</h2>
<table><thead><tr><th>Data</th><th>Nazwa</th><th>Kategoria</th><th class="r">Kwota</th></tr></thead><tbody>${rows || "<tr><td colspan=4>Brak transakcji</td></tr>"}</tbody></table>
${autoPrint ? '<script>window.onload = () => setTimeout(() => window.print(), 400);</' + 'script>' : ""}
</body></html>`;
  return html;
}

function downloadSnapshotFile(snap) {
  const html = snapshotHtml(snap, true);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `raport-${snap.from}_${snap.to}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function openSnapshotWindow(snap) {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(snapshotHtml(snap, false));
  w.document.close();
  return true;
}

function ReportGenerator({ data, helpers, presetRange, update, toast }) {
  const incognito = !!data.settings.hideBalance;
  const { toMain, main } = helpers;
  const [from, setFrom] = useState(presetRange?.from && presetRange.from !== "1970-01-01" ? presetRange.from : `${todayISO().slice(0, 7)}-01`);
  const [to, setTo] = useState(presetRange?.to || todayISO());
  const [selCats, setSelCats] = useState(() => new Set([...data.categories.map((c) => c.id), "uncat"]));
  const [report, setReport] = useState(null);
  const [includeAi, setIncludeAi] = useState(false);
  const [aiNote, setAiNote] = useState(null);
  const [aiStatus, setAiStatus] = useState("idle");
  const [aiMsg, setAiMsg] = useState("");
  const [cfgErrs, setCfgErrs] = useState({});

  const toggle = (id) => setSelCats((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allIds = [...data.categories.map((c) => c.id), "uncat"];
  const allOn = allIds.every((id) => selCats.has(id));

  const fetchAiNote = async (rep) => {
    const left = aiCooldownLeft(data);
    if (left > 0) {
      setAiStatus("limited");
      setAiMsg(`Limit generowań: kolejny wniosek AI będzie dostępny za ${Math.ceil(left / 60000)} min. Raport możesz pobrać bez wniosku.`);
      return;
    }
    const prevStamp = data.settings.aiLastAt || 0;
    update((d) => ({ ...d, settings: { ...d.settings, aiLastAt: Date.now() } }));
    setAiStatus("loading"); setAiNote(null);
    try {
      const cats = rep.slices.slice(0, 6).map((s) => `${s.name}: ${s.value.toFixed(0)} ${main}`).join(", ");
      const prompt = `Jesteś doradcą finansów osobistych. Raport za okres ${rep.from} – ${rep.to} (waluta ${main}): przychody ${rep.inc.toFixed(0)}, wydatki ${rep.exp.toFixed(0)}, bilans ${(rep.inc - rep.exp).toFixed(0)}, ${rep.txs.length} transakcji. Wydatki wg kategorii: ${cats || "brak"}. Napisz po polsku krótki wniosek do raportu (maks. 100 słów): ocena okresu, najważniejsza obserwacja i jedna konkretna rada. Zwykły tekst, bez markdown.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 800, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const out = await res.json();
      const text = (out.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n").trim();
      if (!text) throw new Error("empty");
      setAiNote(text); setAiStatus("done");
      update((d) => ({ ...d, reports: (d.reports || []).map((r) => (r.id === rep.id ? { ...r, aiNote: text } : r)) }));
    } catch {
      update((d) => ({ ...d, settings: { ...d.settings, aiLastAt: prevStamp } })); // refund limit on failure
      setAiStatus("error");
    }
  };

  const generate = () => {
    const e = {};
    if (!from) e.from = "Podaj datę początkową.";
    if (!to) e.to = "Podaj datę końcową.";
    if (from && to && from > to) e.from = "Data „od\u201d nie może być późniejsza niż „do\u201d.";
    if (selCats.size === 0) e.cats = "Zaznacz przynajmniej jedną kategorię.";
    setCfgErrs(e);
    if (Object.keys(e).length) return;
    if (aiStatus === "loading") return; // don't restart mid-generation
    const txs = data.transactions.filter((t) =>
      t.date >= from && t.date <= to && selCats.has(data.categories.some((c) => c.id === t.categoryId) ? t.categoryId : "uncat"));
    const inc = txs.filter((t) => t.type === "income").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
    const exp = txs.filter((t) => t.type === "expense").reduce((s, t) => s + toMain(t.amount, t.currency), 0);
    const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));
    const rep = { id: uid(), from, to, txs: sorted, inc, exp, slices: catSlices(txs, data.categories, toMain, 0) };
    const snap = {
      id: rep.id, createdAt: new Date().toISOString(), from, to, main, inc, exp, count: sorted.length,
      slices: rep.slices, aiNote: null,
      rows: sorted.map((t) => ({
        date: t.date, name: t.name, type: t.type,
        cat: (data.categories.find((c) => c.id === t.categoryId) || UNCAT).name,
        amt: Math.round(toMain(t.amount, t.currency) * 100) / 100,
      })),
    };
    update((d) => ({ ...d, reports: [snap, ...(d.reports || [])].slice(0, 30) }));
    setReport(rep);
    setAiNote(null); setAiStatus("idle");
    if (includeAi) fetchAiNote(rep);
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div id="report-generator" className="card no-print" style={{ padding: 18 }}>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>Generator raportów</div>
        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12.5, marginBottom: 14 }}>
          Wygenerowany raport zapisze się automatycznie w zakładce Raporty.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Od</label>
            <input type="date" className={`input ${cfgErrs.from ? "err" : ""}`} max={to || undefined} value={from} onChange={(e) => { setFrom(e.target.value); setCfgErrs({}); }} />
            {cfgErrs.from && <div className="err-msg">{cfgErrs.from}</div>}
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Do</label>
            <input type="date" className={`input ${cfgErrs.to ? "err" : ""}`} min={from || undefined} max={todayISO()} value={to} onChange={(e) => { setTo(e.target.value); setCfgErrs({}); }} />
            {cfgErrs.to && <div className="err-msg">{cfgErrs.to}</div>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label className="label" style={{ margin: 0 }}>Kategorie</label>
          <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12.5 }}
            onClick={() => setSelCats(allOn ? new Set() : new Set(allIds))}>{allOn ? "Odznacz wszystkie" : "Zaznacz wszystkie"}</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {[...data.categories, { ...UNCAT, id: "uncat" }].map((c) => (
            <button key={c.id} className="chip" onClick={() => toggle(c.id)}
              style={{ cursor: "pointer", border: "1.5px solid", borderColor: selCats.has(c.id) ? c.color : "var(--line)", background: selCats.has(c.id) ? c.color + "20" : "transparent", color: selCats.has(c.id) ? "var(--text)" : "var(--muted)", fontFamily: "inherit" }}>
              {selCats.has(c.id) && <Check size={13} />} {c.name}
            </button>
          ))}
        </div>
        {cfgErrs.cats && <div className="err-msg" style={{ marginTop: -8, marginBottom: 12 }}>{cfgErrs.cats}</div>}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 700, fontSize: 13.5, marginBottom: 14, padding: "12px 14px", background: "var(--surface2)", borderRadius: 14 }}>
          <input type="checkbox" checked={includeAi} onChange={(e) => setIncludeAi(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--accent)" }} />
          <Sparkles size={15} style={{ color: "var(--violet)" }} /> Dołącz wniosek AI do raportu
        </label>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={aiStatus === "loading"} onClick={generate}><FileText size={16} /> {aiStatus === "loading" ? "Generuję wniosek AI…" : "Generuj raport"}</button>
      </div>


      <Sheet open={!!report} onClose={() => setReport(null)} title="Raport finansowy" wide>
        {report && (
        <div className="print-area">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <div style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13 }}>{fmtDate(report.from)} – {fmtDate(report.to)} · waluta: {main}</div>
              <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 11.5, marginTop: 3 }}>Pobrany plik otworzy okno wydruku — wybierz „Zapisz jako PDF".</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="btn btn-primary no-print" disabled={aiStatus === "loading" || incognito}
                onClick={() => {
                  if (incognito) { toast("Tryb incognito aktywny — pobieranie raportów jest zablokowane"); return; }
                  if (aiStatus === "loading") return;
                  downloadReportFile(report, data, main, helpers.toMain, aiNote);
                }}>
                {incognito ? <EyeOff size={16} /> : <Printer size={16} />} {incognito ? "Incognito — pobieranie zablokowane" : aiStatus === "loading" ? "Czekam na wniosek AI…" : "Pobierz PDF"}
              </button>
              {incognito && <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--warn)", marginTop: 6 }}>Wyłącz tryb incognito (ikona oka na Pulpicie), aby pobrać PDF.</div>}
            </div>
          </div>
          <div className="stat-grid" style={{ marginBottom: 18 }}>
            <StatCard icon={ArrowUpRight} label="Przychody" value={fmtMoney(report.inc, main)} tone="pos" />
            <StatCard icon={ArrowDownRight} label="Wydatki" value={fmtMoney(report.exp, main)} tone="neg" />
            <StatCard icon={Wallet} label="Bilans" value={fmtMoney(report.inc - report.exp, main)} tone="info" />
            <StatCard icon={List} label="Transakcje" value={report.txs.length} />
          </div>
          {aiStatus !== "idle" && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
                <Sparkles size={15} style={{ color: "var(--violet)" }} /> Wniosek AI
              </div>
              {aiStatus === "loading" && <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5 }}>Generuję wniosek… (pobieranie PDF odblokuje się po zakończeniu)</div>}
              {aiStatus === "done" && (
                <div className="card sens" style={{ padding: 14, background: "var(--surface2)", boxShadow: "none", fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{aiNote}</div>
              )}
              {aiStatus === "limited" && <div style={{ color: "var(--warn)", fontWeight: 700, fontSize: 12.5, lineHeight: 1.5 }}>{aiMsg}</div>}
              {aiStatus === "error" && <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12.5, lineHeight: 1.5 }}>Wniosek AI jest dostępny, gdy aplikacja działa w Claude.ai — lokalnie raport wygeneruje się bez niego.</div>}
            </div>
          )}
          {report.slices.length > 0 && (
            <>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Podział wydatków wg kategorii</div>
              <div style={{ marginBottom: 18 }}>
                {report.slices.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5, fontWeight: 700 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />
                    <span style={{ flex: 1 }}>{s.name}</span>
                    <span style={{ color: "var(--muted)" }}>{report.exp ? ((s.value / report.exp) * 100).toFixed(1) : 0}%</span>
                    <span className="sens" style={{ width: 110, textAlign: "right" }}>{fmtMoney(s.value, main)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Lista transakcji</div>
          {report.txs.length === 0 ? <p style={{ color: "var(--muted)", fontWeight: 600 }}>Brak transakcji w wybranym zakresie.</p> : report.txs.map((t) => {
            const c = data.categories.find((x) => x.id === t.categoryId) || UNCAT;
            return (
              <div key={t.id} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13, fontWeight: 600 }}>
                <span style={{ width: 82, color: "var(--muted)", flexShrink: 0 }}>{t.date}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</span>
                <span style={{ color: "var(--muted)", width: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                <span className="sens" style={{ width: 110, textAlign: "right", fontWeight: 800, color: t.type === "income" ? "var(--accent)" : "var(--neg)" }}>
                  {t.type === "income" ? "+" : "−"}{fmtMoney(helpers.toMain(t.amount, t.currency), main)}
                </span>
              </div>
            );
          })}
        </div>
        )}
      </Sheet>
    </div>
  );
}

/* ---------------- goals ---------------- */

function HCarousel({ title, count, chipTone, children, emptyText }) {
  const ref = useRef(null);
  const [page, setPage] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    if (!el || count < 2) return;
    const first = el.children[0];
    const w = first ? first.offsetWidth + 12 : 1;
    setPage(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / w))));
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
        <span className="chip" style={{ background: chipTone === "pos" ? "var(--accent-dim)" : "var(--surface2)", color: chipTone === "pos" ? "var(--accent)" : "var(--muted)", fontSize: 11.5 }}>{count}</span>
      </div>
      {count === 0 ? (
        <div className="card" style={{ padding: 16, color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>{emptyText}</div>
      ) : (
        <>
          <div ref={ref} className="scroll-x car-carousel" onScroll={onScroll}>{children}</div>
          {count > 1 && (
            <div className="dots" aria-hidden="true">
              {Array.from({ length: count }, (_, i) => <span key={i} className={i === page ? "on" : ""} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Goals({ data, helpers, update, toast, confirm }) {
  const { main } = helpers;
  const wrapCards = useMedia("(min-width: 768px)");
  const [form, setForm] = useState(null);
  const [pay, setPay] = useState(null);
  const [detail, setDetail] = useState(null);
  const [allEntries, setAllEntries] = useState(false);
  useEffect(() => { setAllEntries(false); }, [detail]);
  const [filter, setFilter] = useState("all");
  const [allGoalsOpen, setAllGoalsOpen] = useState(false);
  const isMobileG = useMedia("(max-width: 767px)");
  const goalLimit = isMobileG ? 4 : 6;
  const totalSaved = data.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = data.goals.reduce((s, g) => s + g.target, 0);
  const isDone = (g) => g.saved >= g.target;
  const sortedGoals = useMemo(() => [...data.goals].sort((a, b) => {
    const d = (isDone(a) ? 1 : 0) - (isDone(b) ? 1 : 0);
    if (d !== 0) return d; // achieved go below active ones
    return (a.createdAt || "").localeCompare(b.createdAt || ""); // then by date added
  }), [data.goals]);
  const filteredGoals = sortedGoals.filter((g) => filter === "all" ? true : filter === "done" ? isDone(g) : !isDone(g));
  const activeGoals = sortedGoals.filter((g) => !isDone(g));
  const doneGoals = sortedGoals.filter(isDone);
  const visibleGoals = filteredGoals.slice(0, goalLimit);
  const doneCount = data.goals.filter(isDone).length;

  const saveGoal = (g) => {
    update((d) => ({ ...d, goals: g.id && d.goals.some((x) => x.id === g.id) ? d.goals.map((x) => (x.id === g.id ? { ...x, ...g } : x)) : [...d.goals, g] }));
    toast(g.saved > 0 && !data.goals.some((x) => x.id === g.id) ? "Cel utworzony z kwotą początkową" : "Cel zapisany");
    setForm(null);
  };

  const GoalCard = ({ g, full, stretch }) => {
    const pct = Math.min(100, (g.saved / g.target) * 100);
    const done = g.saved >= g.target;
    const missing = Math.max(0, g.target - g.saved);
    const monthsLeft = g.deadline ? Math.max(1, Math.ceil((new Date(g.deadline) - new Date()) / (30.44 * 864e5))) : null;
    return (
      <div className="card row-press" style={{ padding: 18, minWidth: full ? undefined : 240, width: stretch ? "100%" : undefined, flexShrink: 0 }} onClick={() => !full && setDetail(g.id)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: fit(g.name, 15, 12, 18), minWidth: 0 }}>{g.name}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
            {g.deadline
              ? <span className="chip" style={{ background: "var(--info-dim)", color: "var(--info)" }}><Calendar size={12} /> {fmtDate(g.deadline)}</span>
              : !done && <span className="chip" style={{ background: "var(--surface2)", color: "var(--muted)" }}><Calendar size={12} /> Brak daty</span>}
            {done && <span className="chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}><Check size={13} /> Osiągnięty</span>}
          </div>
        </div>
        <div className="sens" style={{ fontSize: fit(`${fmtMoney(g.saved, main, true)} / ${fmtMoney(g.target, main, true)}`, 22, 14, 17), fontWeight: 800, marginBottom: 8 }}>
          {fmtMoney(g.saved, main, true)} <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 700 }}>/ {fmtMoney(g.target, main, true)}</span>
        </div>
        <div className="progress-track" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: done ? "var(--accent)" : "linear-gradient(90deg, var(--violet), var(--accent))" }} />
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)" }}>
          {pct.toFixed(0)}% zrealizowane · brakuje {fmtMoney(missing, main, true)}
        </div>
        {!done && missing > 0 && (
          <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: monthsLeft ? "var(--accent)" : "var(--muted)" }}>
            {monthsLeft
              ? <>odkładaj {fmtMoney(missing / monthsLeft, main, true)} / mies., aby zdążyć</>
              : <>Bez pośpiechu — odkładasz we własnym tempie 😌</>}
          </div>
        )}
        {full && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={done} onClick={(e) => { e.stopPropagation(); setPay({ id: g.id, dir: 1 }); }}>Wpłać</button>
            <button className="btn btn-ghost" disabled={g.saved <= 0} onClick={(e) => { e.stopPropagation(); setPay({ id: g.id, dir: -1 }); }}>Wypłać</button>
            <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setForm(g); }} aria-label="Edytuj cel"><Pencil size={16} /></button>
            <button className="btn btn-danger" aria-label="Usuń cel" onClick={(e) => {
              e.stopPropagation();
              confirm({ title: "Usunąć cel?", desc: `Cel „${g.name}" i historia jego wpłat zostaną trwale usunięte. Tej operacji nie można cofnąć.`, danger: true, confirmLabel: "Usuń cel" },
                () => { update((d) => ({ ...d, goals: d.goals.filter((x) => x.id !== g.id) })); setDetail(null); toast("Cel usunięty"); });
            }}><Trash2 size={16} /></button>
          </div>
        )}
      </div>
    );
  };

  const detailGoal = data.goals.find((g) => g.id === detail);
  const payGoal = data.goals.find((g) => g.id === pay?.id);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="page-title">Cele</h1>
        <button className="btn btn-primary" onClick={() => setForm({})}><Plus size={16} /> Nowy cel</button>
      </div>
      {data.goals.length > 0 && (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>Łącznie odłożone we wszystkich celach</div>
          <div className="sens" style={{ fontSize: 26, fontWeight: 800 }}>{fmtMoney(totalSaved, main)} <span style={{ color: "var(--muted)", fontSize: 15 }}>/ {fmtMoney(totalTarget, main, true)}</span></div>
          <div className="progress-track" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${totalTarget ? Math.min(100, (totalSaved / totalTarget) * 100) : 0}%` }} />
          </div>
        </div>
      )}
      {data.goals.length === 0 ? (
        <EmptyState icon={Target} title="Brak celów" desc="Utwórz pierwszy cel oszczędnościowy — wakacje, poduszkę finansową albo nowy sprzęt."
          action={<button className="btn btn-primary" onClick={() => setForm({})}><Plus size={16} /> Utwórz cel</button>} />
      ) : isMobileG ? (
        <>
          <HCarousel title="Aktywne" count={activeGoals.length} emptyText="Brak aktywnych celów — wszystkie osiągnięte, gratulacje!">
            {activeGoals.map((g) => (
              <div key={g.id} style={{ flex: "0 0 84%", minWidth: 0 }}>
                <GoalCard g={g} full={false} stretch />
              </div>
            ))}
          </HCarousel>
          <HCarousel title="Osiągnięte" count={doneGoals.length} chipTone="pos" emptyText="Gdy uzbierasz pełną kwotę na którymś celu, pojawi się tutaj.">
            {doneGoals.map((g) => (
              <div key={g.id} style={{ flex: "0 0 84%", minWidth: 0 }}>
                <GoalCard g={g} full={false} stretch />
              </div>
            ))}
          </HCarousel>
        </>
      ) : (
        <>
          <Seg value={filter} onChange={setFilter} tone={(v) => (v === "done" ? "pos" : "")}
            options={[
              { value: "all", label: `Wszystkie (${data.goals.length})` },
              { value: "active", label: `Aktywne (${data.goals.length - doneCount})` },
              { value: "done", label: `Osiągnięte (${doneCount})` },
            ]} />
          {filteredGoals.length === 0 ? (
            <EmptyState icon={Target} title={filter === "done" ? "Brak osiągniętych celów" : "Brak aktywnych celów"}
              desc={filter === "done" ? "Gdy uzbierasz pełną kwotę na którymś celu, pojawi się tutaj." : "Wszystkie Twoje cele są już osiągnięte — gratulacje!"} />
          ) : (
            <>
              <div className="scroll-x stagger" style={{ flexWrap: wrapCards ? "wrap" : "nowrap" }}>
                {visibleGoals.map((g) => <GoalCard key={g.id} g={g} full={false} />)}
              </div>
              {filteredGoals.length > goalLimit && (
                <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => setAllGoalsOpen(true)}>
                  Pokaż wszystkie cele ({filteredGoals.length})
                </button>
              )}
            </>
          )}
        </>
      )}

      <Sheet open={allGoalsOpen} onClose={() => setAllGoalsOpen(false)} title={`Cele (${filteredGoals.length})`} wide>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredGoals.map((g) => <GoalCard key={g.id} g={g} full={false} />)}
        </div>
      </Sheet>

      <Sheet open={!!detailGoal} onClose={() => setDetail(null)} title={detailGoal?.name || ""}>
        {detailGoal && (
          <>
            <GoalCard g={detailGoal} full />
            {detailGoal.entries?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="label">Historia wpłat {detailGoal.entries.length > 8 && !allEntries ? `(8 z ${detailGoal.entries.length})` : `(${detailGoal.entries.length})`}</div>
                {[...detailGoal.entries].reverse().slice(0, allEntries ? undefined : 8).map((e) => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 2px", borderBottom: "1px solid var(--line)", fontSize: 13.5, fontWeight: 700 }}>
                    <span style={{ color: "var(--muted)" }}>{fmtDate(e.date)}</span>
                    <span style={{ color: e.amount >= 0 ? "var(--accent)" : "var(--neg)" }}>{e.amount >= 0 ? "+" : ""}{fmtMoney(e.amount, main)}</span>
                  </div>
                ))}
                {detailGoal.entries.length > 8 && (
                  <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 13 }} onClick={() => setAllEntries((v) => !v)}>
                    {allEntries ? "Zwiń" : `Pokaż wszystkie (${detailGoal.entries.length})`}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </Sheet>

      <Sheet open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edytuj cel" : "Nowy cel"}>
        {form && <GoalForm initial={form} main={main} onSave={saveGoal} onClose={() => setForm(null)} />}
      </Sheet>

      <Sheet open={!!payGoal} onClose={() => setPay(null)} title={pay?.dir === 1 ? "Wpłata na cel" : "Wypłata z celu"}>
        {payGoal && <PayForm goal={payGoal} dir={pay.dir} main={main} onClose={() => setPay(null)}
          onPay={(amt) => {
            update((d) => ({ ...d, goals: d.goals.map((g) => g.id === payGoal.id ? { ...g, saved: Math.round((g.saved + amt) * 100) / 100, entries: [...(g.entries || []), { id: uid(), amount: amt, date: todayISO() }] } : g) }));
            const after = payGoal.saved + amt;
            toast(amt > 0 ? (after >= payGoal.target ? "🎉 Cel osiągnięty! Gratulacje!" : "Wpłata zapisana") : "Wypłata zapisana");
            setPay(null);
          }} />}
      </Sheet>
    </div>
  );
}

function GoalForm({ initial, main, onSave, onClose }) {
  const [name, setName] = useState(initial.name || "");
  const [target, setTarget] = useState(initial.target ? String(initial.target).replace(".", ",") : "");
  const [deadline, setDeadline] = useState(initial.deadline || "");
  const [start, setStart] = useState("");
  const [errs, setErrs] = useState({});
  const submit = () => {
    const e = {};
    const t = parseNum(target), s = start ? parseNum(start) : 0;
    if (!name.trim()) e.name = "Podaj nazwę celu.";
    if (isNaN(t) || t <= 0) e.target = "Kwota docelowa musi być większa od 0.";
    if (start && (isNaN(s) || s < 0)) e.start = "Nieprawidłowa kwota początkowa.";
    if (!isNaN(t) && !isNaN(s) && s > t) e.start = "Kwota początkowa nie może przekraczać docelowej.";
    setErrs(e);
    if (Object.keys(e).length) return;
    onSave({
      id: initial.id || uid(), name: name.trim(), target: Math.round(t * 100) / 100, deadline: deadline || null,
      saved: initial.id ? initial.saved : Math.round(s * 100) / 100,
      entries: initial.id ? initial.entries : (s > 0 ? [{ id: uid(), amount: s, date: todayISO() }] : []),
      createdAt: initial.createdAt || new Date().toISOString(),
    });
  };
  return (
    <>
      <Field label="Nazwa celu" error={errs.name}><input className={`input ${errs.name ? "err" : ""}`} placeholder="np. Wakacje 2027" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label={`Kwota docelowa (${main})`} error={errs.target}><NumInput big value={target} onChange={setTarget} error={errs.target} /></Field>
      <Field label="Termin (opcjonalny)"><input type="date" className="input" min={todayISO()} value={deadline} onChange={(e) => setDeadline(e.target.value)} /></Field>
      {!initial.id && <Field label={`Kwota początkowa (opcjonalna, ${main})`} error={errs.start}><NumInput value={start} onChange={setStart} error={errs.start} /></Field>}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit}>{initial.id ? "Zapisz zmiany" : "Utwórz cel"}</button>
      </div>
    </>
  );
}

function PayForm({ goal, dir, main, onPay, onClose }) {
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");
  const max = dir === 1 ? Math.max(0, goal.target - goal.saved) : goal.saved;
  const submit = () => {
    const n = parseNum(amount);
    if (isNaN(n) || n <= 0) return setErr("Kwota musi być większa od 0.");
    if (n > max) return setErr(dir === 1 ? `Do celu brakuje tylko ${fmtMoney(max, main)}.` : `W celu odłożone jest tylko ${fmtMoney(max, main)}.`);
    onPay(dir * Math.round(n * 100) / 100);
  };
  return (
    <>
      <p style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>
        {dir === 1 ? `Brakuje ${fmtMoney(max, main)} do celu „${goal.name}".` : `Dostępne do wypłaty: ${fmtMoney(max, main)}.`}
      </p>
      <Field label={`Kwota (${main})`} error={err}><NumInput big value={amount} onChange={(v) => { setAmount(v); setErr(""); }} error={err} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit}>{dir === 1 ? "Wpłać" : "Wypłać"}</button>
      </div>
    </>
  );
}

/* ---------------- fuel ---------------- */

function Reports({ data, helpers, go, toast, confirm, update }) {
  const incognito = !!data.settings.hideBalance;
  const history = data.reports || [];
  const [histView, setHistView] = useState(null);
  const openPdf = (h) => {
    if (incognito) { toast("Tryb incognito aktywny — otwieranie raportów jest zablokowane"); return; }
    if (!openSnapshotWindow(h)) toast("Przeglądarka zablokowała nowe okno — zezwól tej stronie na wyskakujące okna");
  };
  const delSnap = (e, h) => {
    e.stopPropagation();
    confirm({
      title: "Usunąć raport z historii?",
      desc: `Raport ${fmtDate(h.from)} – ${fmtDate(h.to)} zostanie trwale usunięty. Nie wpływa to na transakcje.`,
      danger: true, confirmLabel: "Usuń",
    }, () => {
      update((d) => ({ ...d, reports: (d.reports || []).filter((r) => r.id !== h.id) }));
      setHistView(null);
      toast("Raport usunięty z historii");
    });
  };
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h1 className="page-title">Raporty</h1>
      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 3 }}>Chcesz wygenerować nowy raport?</div>
          <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12.5 }}>Generator znajdziesz w sekcji Statystyki — gotowy raport zapisze się tutaj.</div>
        </div>
        <button className="btn btn-primary" onClick={() => go("stats")}><BarChart3 size={16} /> Przejdź do Statystyk</button>
      </div>
      {history.length === 0 ? (
        <EmptyState icon={FileText} title="Brak zapisanych raportów"
          desc="Wygeneruj pierwszy raport w Statystykach — jego historia pojawi się w tym miejscu." />
      ) : (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Historia raportów</div>
            <span className="chip" style={{ background: "var(--info-dim)", color: "var(--info)" }}>{history.length} {history.length === 1 ? "raport" : history.length < 5 ? "raporty" : "raportów"}</span>
          </div>
          <div className="tx-list">
            {history.map((h) => (
              <div key={h.id} className="tx-row row-press" onClick={() => setHistView(h)}>
                <div className="icon-badge" style={{ background: "var(--violet)" + "22", color: "var(--violet)" }}><FileText size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtDate(h.from)} – {fmtDate(h.to)}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    wygenerowano {fmtDate(h.createdAt.slice(0, 10))}, {fmtTime(h.createdAt)} · {h.count} transakcji{h.aiNote ? " · z wnioskiem AI" : ""}
                  </div>
                </div>
                <button className="btn btn-ghost" aria-label="Usuń raport" style={{ padding: 7, borderRadius: 10, color: "var(--neg)", flexShrink: 0 }}
                  onClick={(e) => delSnap(e, h)}><X size={16} strokeWidth={2.6} /></button>
                <ChevronRight size={17} style={{ color: "var(--muted)", flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 11.5, marginTop: 10 }}>
            Kliknij raport, aby zobaczyć szczegóły i otworzyć wersję PDF.
          </p>
        </div>
      )}

      <Sheet open={!!histView} onClose={() => setHistView(null)} title="Szczegóły raportu" wide>
        {histView && (
          <>
            <div style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
              {fmtDate(histView.from)} – {fmtDate(histView.to)} · waluta: {histView.main}
              <br />wygenerowano {fmtDate(histView.createdAt.slice(0, 10))} o godz. {fmtTime(histView.createdAt)}
            </div>
            <div className="stat-grid" style={{ marginBottom: 16 }}>
              <StatCard icon={ArrowUpRight} label="Przychody" value={fmtMoney(histView.inc, histView.main)} tone="pos" />
              <StatCard icon={ArrowDownRight} label="Wydatki" value={fmtMoney(histView.exp, histView.main)} tone="neg" />
              <StatCard icon={Wallet} label="Bilans" value={fmtMoney(histView.inc - histView.exp, histView.main)} tone="info" />
              <StatCard icon={List} label="Transakcje" value={histView.count} />
            </div>
            {histView.aiNote && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}>
                  <Sparkles size={15} style={{ color: "var(--violet)" }} /> Wniosek AI
                </div>
                <div className="card sens" style={{ padding: 14, background: "var(--surface2)", boxShadow: "none", fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{histView.aiNote}</div>
              </div>
            )}
            {histView.slices.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Podział wydatków wg kategorii</div>
                {histView.slices.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5, fontWeight: 700 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />
                    <span style={{ flex: 1 }}>{s.name}</span>
                    <span style={{ color: "var(--muted)" }}>{histView.exp ? ((s.value / histView.exp) * 100).toFixed(1) : 0}%</span>
                    <span className="sens" style={{ width: 110, textAlign: "right" }}>{fmtMoney(s.value, histView.main)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Lista transakcji</div>
            <div style={{ marginBottom: 16 }}>
              {histView.rows.length === 0 ? <p style={{ color: "var(--muted)", fontWeight: 600 }}>Brak transakcji.</p> : histView.rows.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13, fontWeight: 600 }}>
                  <span style={{ width: 82, color: "var(--muted)", flexShrink: 0 }}>{r.date}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                  <span style={{ color: "var(--muted)", width: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.cat}</span>
                  <span className="sens" style={{ width: 105, textAlign: "right", fontWeight: 800, color: r.type === "income" ? "var(--accent)" : "var(--neg)" }}>
                    {r.type === "income" ? "+" : "−"}{fmtMoney(r.amt, histView.main)}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-danger" onClick={(e) => { delSnap(e, histView); }}><Trash2 size={15} /></button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openPdf(histView)}>
                {incognito ? <EyeOff size={16} /> : <Printer size={16} />} {incognito ? "Incognito — zablokowane" : "Otwórz PDF"}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}

function Fuel_({ data, helpers, update, toast, confirm, openRefuel, setOpenRefuel }) {
  const { main } = helpers;
  const [activeCar, setActiveCar] = useState(data.cars[0]?.id || null);
  const [carForm, setCarForm] = useState(null);
  const [stationForm, setStationForm] = useState(null);
  const [stationSort, setStationSort] = useState("asc");
  const [allRefuelsOpen, setAllRefuelsOpen] = useState(false);
  const [allStationsOpen, setAllStationsOpen] = useState(false);
  const isMobileF = useMedia("(max-width: 767px)");
  const refuelLimit = isMobileF ? 4 : 6;
  const stationLimit = isMobileF ? 5 : 8;
  const carRef = useRef(null);
  const [carPage, setCarPage] = useState(0);
  const onCarScroll = () => {
    const el = carRef.current;
    if (!el || !data.cars.length) return;
    const itemW = (el.clientWidth - 12) / 2 + 12;
    setCarPage(Math.max(0, Math.min(data.cars.length - 1, Math.round(el.scrollLeft / itemW))));
  };
  useEffect(() => {
    if (!data.cars.some((c) => c.id === activeCar)) setActiveCar(data.cars[0]?.id || null);
  }, [data.cars]); // eslint-disable-line

  const car = data.cars.find((c) => c.id === activeCar);
  const refuels = useMemo(() =>
    data.refuels.filter((r) => r.carId === activeCar).sort((a, b) => a.odometer - b.odometer),
    [data.refuels, activeCar]);

  const stats = useMemo(() => {
    if (refuels.length === 0) return null;
    const totalLiters = refuels.reduce((s, r) => s + r.liters, 0);
    const totalCost = refuels.reduce((s, r) => s + r.cost, 0);
    const first = refuels[0], last = refuels[refuels.length - 1];
    const distance = refuels.length > 1 ? last.odometer - first.odometer : 0;
    const litersAfterFirst = totalLiters - first.liters;
    const consumption = distance > 0 ? (litersAfterFirst / distance) * 100 : null;
    const avgPrice = totalLiters > 0 ? totalCost / totalLiters : 0;
    const months = Math.max(1, (new Date(last.date) - new Date(first.date)) / (30.44 * 864e5));
    return {
      distance, consumption, avgPrice, totalCost, totalLiters,
      count: refuels.length, currentOdo: last.odometer,
      monthlyDist: refuels.length > 1 ? distance / months : null,
      costPer100: consumption != null ? consumption * avgPrice : null,
    };
  }, [refuels]);

  const stationRank = useMemo(() => {
    const map = {};
    data.refuels.forEach((r) => {
      map[r.stationId] = map[r.stationId] || { liters: 0, cost: 0, n: 0 };
      map[r.stationId].liters += r.liters; map[r.stationId].cost += r.cost; map[r.stationId].n++;
    });
    const arr = data.stations.map((s) => ({
      ...s, n: map[s.id]?.n || 0,
      avg: map[s.id] && map[s.id].liters > 0 ? map[s.id].cost / map[s.id].liters : null,
    }));
    return arr.sort((a, b) => {
      if (a.avg == null) return 1; if (b.avg == null) return -1;
      return stationSort === "asc" ? a.avg - b.avg : b.avg - a.avg;
    });
  }, [data.refuels, data.stations, stationSort]);

  const delRefuel = (r) => confirm(
    { title: "Usunąć tankowanie?", desc: `Tankowanie z ${fmtDate(r.date)} (${r.liters} l za ${fmtMoney(r.cost, main)}) zostanie trwale usunięte.`, danger: true, confirmLabel: "Usuń" },
    () => { update((d) => ({ ...d, refuels: d.refuels.filter((x) => x.id !== r.id), transactions: d.transactions.filter((t) => t.refuelId !== r.id) })); toast("Tankowanie usunięte z historii"); });

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h1 className="page-title" style={{ margin: 0 }}>Paliwo</h1>
        {!isMobileF && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={() => setCarForm({})}><Plus size={15} /> Auto</button>
            <button className="btn btn-ghost" onClick={() => setStationForm({})}><Plus size={15} /> Stacja</button>
            <button className="btn btn-primary" disabled={!data.cars.length || !data.stations.length} onClick={() => setOpenRefuel(true)}>
              <Droplets size={16} /> Dodaj tankowanie
            </button>
          </div>
        )}
      </div>
      {isMobileF && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: -6 }}>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => setCarForm({})}><Plus size={15} /> Auto</button>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => setStationForm({})}><Plus size={15} /> Stacja</button>
          <button className="btn btn-primary" style={{ width: "100%", gridColumn: "1 / -1" }} disabled={!data.cars.length || !data.stations.length} onClick={() => setOpenRefuel(true)}>
            <Droplets size={16} /> Dodaj tankowanie
          </button>
        </div>
      )}

      {data.cars.length === 0 ? (
        <EmptyState icon={CarFront} title="Brak samochodów" desc="Dodaj pierwszy samochód, aby śledzić tankowania, spalanie i koszty."
          action={<button className="btn btn-primary" onClick={() => setCarForm({})}><Plus size={16} /> Dodaj samochód</button>} />
      ) : (
        <>
          <div>
            <div ref={carRef} className="scroll-x car-carousel" onScroll={onCarScroll}>
              {data.cars.map((c) => (
                <button key={c.id} className="card row-press" onClick={() => setActiveCar(c.id)}
                  style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "inherit", flex: isMobileF ? "0 0 calc(50% - 6px)" : "0 0 auto", minWidth: 0, border: `1.5px solid ${c.id === activeCar ? "var(--accent)" : "var(--line)"}`, background: c.id === activeCar ? "var(--accent-dim)" : "var(--surface)", color: "var(--text)" }}>
                  <CarFront size={18} style={{ color: c.id === activeCar ? "var(--accent)" : "var(--muted)", flexShrink: 0 }} />
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: fit(c.name, 14, 11.5, 14), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap" }}>{c.fuel} · bak {c.tank} l</div>
                  </div>
                </button>
              ))}
            </div>
            {isMobileF && data.cars.length > 2 && (
              <div className="dots" aria-hidden="true">
                {data.cars.map((c, i) => <span key={c.id} className={i === carPage ? "on" : ""} />)}
              </div>
            )}
          </div>

          {car && (
            <>
              {stats ? (
                <div className="stat-grid stagger">
                  <StatCard icon={Gauge} label="Spalanie" value={stats.consumption != null ? `${stats.consumption.toFixed(1)} l/100km` : "—"} sub={stats.consumption != null ? "od pełna do pełna" : "potrzeba ≥2 tankowań"} />
                  <StatCard icon={Coins} label="Śr. cena / litr" value={fmtMoney(stats.avgPrice, main)} />
                  <StatCard icon={Wallet} label="Łączny koszt" value={fmtMoney(stats.totalCost, main, true)} />
                  <StatCard icon={MapPin} label="Dystans" value={`${stats.distance.toLocaleString("pl-PL")} km`} sub={stats.monthlyDist ? `~${Math.round(stats.monthlyDist).toLocaleString("pl-PL")} km/mies.` : undefined} />
                  <StatCard icon={Gauge} label="Przebieg" value={`${stats.currentOdo.toLocaleString("pl-PL")} km`} />
                  <StatCard icon={Droplets} label="Tankowania" value={stats.count} sub={`${stats.totalLiters.toFixed(0)} l łącznie`} />
                  {stats.costPer100 != null && <StatCard icon={Percent} label="Koszt / 100 km" value={fmtMoney(stats.costPer100, main)} />}
                </div>
              ) : (
                <EmptyState icon={Droplets} title="Brak tankowań" desc={`Dodaj pierwsze tankowanie dla auta ${car.name}, aby zobaczyć statystyki.`} />
              )}

              {refuels.length >= 3 && (
                <div className="card" style={{ padding: 18 }}>
                  <div style={{ fontWeight: 800, marginBottom: 12 }}>Spalanie w czasie <span style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 700 }}>· l/100km</span></div>
                  <div style={{ width: "100%", height: 190 }}>
                    <ResponsiveContainer>
                      <LineChart data={refuels.slice(1).map((r, i) => {
                        const prev = refuels[i];
                        const dist = r.odometer - prev.odometer;
                        return { label: `${r.date.slice(8)}.${r.date.slice(5, 7)}`, Spalanie: dist > 0 ? Math.round((r.liters / dist) * 1000) / 10 : null };
                      }).filter((p) => p.Spalanie != null)}>
                        <CartesianGrid stroke="var(--line)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 10.5, fontWeight: 700 }} axisLine={false} tickLine={false} minTickGap={24} />
                        <YAxis tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={38} domain={["auto", "auto"]} />
                        <RTooltip contentStyle={{ background: "var(--surface3)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: "var(--text)" }} formatter={(v) => `${v} l/100km`} />
                        <Line type="monotone" dataKey="Spalanie" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3.5, fill: "#F97316", strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginTop: 8 }}>Rosnący trend może oznaczać pogarszający się stan auta lub zmianę stylu jazdy.</div>
                </div>
              )}

              {refuels.length > 0 && (() => {
                const revRefuels = [...refuels].reverse();
                const renderRefuel = (r) => {
                  const st = data.stations.find((s) => s.id === r.stationId);
                  return (
                    <div key={r.id} className="tx-row" style={{ cursor: "default" }}>
                      <div className="icon-badge" style={{ background: "#F9731622", color: "#F97316" }}><Fuel size={19} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{st?.name || "Stacja"} · {r.liters} l</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{fmtDate(r.date)} · {r.odometer.toLocaleString("pl-PL")} km · {fmtMoney(r.cost / r.liters, main)}/l</div>
                      </div>
                      <div className="sens" style={{ fontWeight: 800 }}>{fmtMoney(r.cost, main)}</div>
                      <button className="btn btn-ghost" style={{ padding: 8 }} aria-label="Usuń tankowanie" onClick={() => delRefuel(r)}><Trash2 size={15} /></button>
                    </div>
                  );
                };
                return (
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "4px 6px" }}>
                      <div style={{ fontWeight: 800 }}>Historia tankowań</div>
                      {revRefuels.length > refuelLimit && (
                        <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => setAllRefuelsOpen(true)}>
                          Wszystkie ({revRefuels.length}) <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                    <div className="tx-list">{revRefuels.slice(0, refuelLimit).map(renderRefuel)}</div>
                    <Sheet open={allRefuelsOpen} onClose={() => setAllRefuelsOpen(false)} title={`Historia tankowań (${revRefuels.length})`} wide>
                      <div className="tx-list">{revRefuels.map(renderRefuel)}</div>
                    </Sheet>
                  </div>
                );
              })()}
            </>
          )}

          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 800 }}>Ranking stacji <span style={{ color: "var(--muted)", fontSize: 12.5 }}>· śr. cena/l</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => setStationSort((s) => (s === "asc" ? "desc" : "asc"))}>
                  {stationSort === "asc" ? "Najtańsze ↑" : "Najdroższe ↓"}
                </button>
                <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => setStationForm({})}><Plus size={14} /> Stacja</button>
              </div>
            </div>
            {stationRank.length === 0 ? (
              <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5 }}>Dodaj stacje paliw, aby porównywać ceny.</p>
            ) : stationRank.slice(0, stationLimit).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", borderBottom: "1px solid var(--line)", fontSize: 14, fontWeight: 700 }}>
                <span style={{ width: 22, color: "var(--muted)", fontSize: 12.5 }}>#{i + 1}</span>
                <span style={{ flex: 1 }}>{s.name}</span>
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{s.n} tank.</span>
                <span style={{ width: 90, textAlign: "right", color: i === 0 && s.avg != null && stationSort === "asc" ? "var(--accent)" : "var(--text)" }}>
                  {s.avg != null ? `${fmtMoney(s.avg, main)}/l` : "—"}
                </span>
                <button className="btn btn-ghost" style={{ padding: 7 }} aria-label={`Usuń stację ${s.name}`} onClick={() =>
                  confirm({ title: "Usunąć stację?", desc: `Stacja „${s.name}" zostanie usunięta. Tankowania pozostaną w historii bez nazwy stacji.`, danger: true, confirmLabel: "Usuń" },
                    () => { update((d) => ({ ...d, stations: d.stations.filter((x) => x.id !== s.id) })); toast("Stacja usunięta"); })
                }><Trash2 size={14} /></button>
              </div>
            ))}
            {stationRank.length > stationLimit && (
              <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 13 }} onClick={() => setAllStationsOpen(true)}>
                Pokaż wszystkie stacje ({stationRank.length})
              </button>
            )}
            <Sheet open={allStationsOpen} onClose={() => setAllStationsOpen(false)} title={`Ranking stacji (${stationRank.length})`}>
              {stationRank.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 2px", borderBottom: "1px solid var(--line)", fontSize: 14, fontWeight: 700 }}>
                  <span style={{ width: 26, color: "var(--muted)", fontSize: 12.5 }}>#{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                  <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{s.n} tank.</span>
                  <span style={{ width: 92, textAlign: "right" }}>{s.avg != null ? `${fmtMoney(s.avg, main)}/l` : "—"}</span>
                </div>
              ))}
            </Sheet>
          </div>

          {car && (
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12, margin: "2px 2px 0" }}>
              Edycję i usuwanie aut znajdziesz w Ustawieniach → Samochody i stacje.
            </p>
          )}
        </>
      )}

      <Sheet open={!!carForm} onClose={() => setCarForm(null)} title={carForm?.id ? "Edytuj samochód" : "Nowy samochód"}>
        {carForm && <CarForm initial={carForm} onClose={() => setCarForm(null)} onSave={(c) => {
          update((d) => ({ ...d, cars: c.id && d.cars.some((x) => x.id === c.id) ? d.cars.map((x) => (x.id === c.id ? c : x)) : [...d.cars, c] }));
          setActiveCar(c.id); setCarForm(null); toast("Samochód zapisany");
        }} />}
      </Sheet>

      <Sheet open={!!stationForm} onClose={() => setStationForm(null)} title={stationForm?.id ? "Edytuj stację" : "Nowa stacja paliw"}>
        {stationForm && <StationForm initial={stationForm} onClose={() => setStationForm(null)} onSave={(s) => {
          update((d) => ({ ...d, stations: d.stations.some((x) => x.id === s.id) ? d.stations.map((x) => (x.id === s.id ? s : x)) : [...d.stations, s] }));
          setStationForm(null); toast("Stacja zapisana");
        }} />}
      </Sheet>

      <Sheet open={openRefuel} onClose={() => setOpenRefuel(false)} title="Dodaj tankowanie">
        {openRefuel && <RefuelForm data={data} main={main} defaultCar={activeCar} onClose={() => setOpenRefuel(false)} onSave={(r) => {
          const carName = data.cars.find((c) => c.id === r.carId)?.name || "auto";
          const stName = data.stations.find((s) => s.id === r.stationId)?.name || "";
          const tx = { id: `fueltx-${r.id}`, type: "expense", name: `Tankowanie · ${carName}`, amount: r.cost, currency: data.settings.mainCurrency, categoryId: "c-fuel", date: r.date, note: stName, refuelId: r.id };
          update((d) => ({ ...d, refuels: [...d.refuels, r], transactions: [...d.transactions, tx] }));
          setOpenRefuel(false); toast("Tankowanie zapisane i dodane do historii");
        }} onNeedCar={() => { setOpenRefuel(false); setCarForm({}); }} onNeedStation={() => { setStationForm({}); }} />}
      </Sheet>
    </div>
  );
}

function CarForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial.name || "");
  const [tank, setTank] = useState(initial.tank ? String(initial.tank) : "");
  const [fuel, setFuel] = useState(initial.fuel || "Benzyna");
  const [errs, setErrs] = useState({});
  const submit = () => {
    const e = {}; const t = parseNum(tank);
    if (!name.trim()) e.name = "Podaj nazwę auta.";
    if (isNaN(t) || t <= 0) e.tank = "Pojemność baku musi być większa od 0.";
    setErrs(e); if (Object.keys(e).length) return;
    onSave({ id: initial.id || uid(), name: name.trim(), tank: t, fuel });
  };
  return (
    <>
      <Field label="Nazwa" error={errs.name}><input className={`input ${errs.name ? "err" : ""}`} placeholder="np. Skoda Octavia" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Pojemność baku (l)" error={errs.tank}><NumInput value={tank} onChange={setTank} error={errs.tank} suffix="l" /></Field>
      <Field label="Rodzaj paliwa">
        <select className="select" value={fuel} onChange={(e) => setFuel(e.target.value)}>
          {["Benzyna", "Diesel", "LPG", "Hybryda", "Elektryk"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit}>Zapisz</button>
      </div>
    </>
  );
}

function StationForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [err, setErr] = useState("");
  return (
    <>
      <Field label="Nazwa stacji" error={err}><input className={`input ${err ? "err" : ""}`} placeholder="np. Orlen Radlin" value={name} onChange={(e) => setName(e.target.value)} autoFocus={AUTOF} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => (name.trim() ? onSave({ id: initial?.id || uid(), name: name.trim() }) : setErr("Podaj nazwę stacji."))}>{initial?.id ? "Zapisz zmiany" : "Dodaj stację"}</button>
      </div>
    </>
  );
}

function RefuelForm({ data, main, defaultCar, onSave, onClose, onNeedCar, onNeedStation }) {
  const [carId, setCarId] = useState(defaultCar || data.cars[0]?.id || "");
  const [stationId, setStationId] = useState(data.stations[0]?.id || "");
  const [dist, setDist] = useState("");
  const [liters, setLiters] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(todayISO());
  const [errs, setErrs] = useState({});
  const prevOdo = useMemo(() => {
    const rs = data.refuels.filter((r) => r.carId === carId);
    return rs.length ? Math.max(...rs.map((r) => r.odometer)) : null;
  }, [data.refuels, carId]);
  const isFirst = prevOdo == null;
  const l = parseNum(liters), c = parseNum(cost);
  const ppl = !isNaN(l) && l > 0 && !isNaN(c) && c > 0 ? c / l : null;

  const submit = () => {
    const e = {}; const d = parseNum(dist);
    if (!carId) e.car = "Wybierz samochód.";
    if (!stationId) e.station = "Wybierz stację.";
    if (isNaN(d) || d <= 0) e.dist = isFirst ? "Podaj aktualny przebieg auta (większy od 0)." : "Dystans musi być większy od 0 km.";
    else if (!isFirst && d > 5000) e.dist = "Dystans na jednym baku wygląda na zbyt duży (max 5000 km).";
    if (isNaN(l) || l <= 0) e.liters = "Litry muszą być większe od 0.";
    if (isNaN(c) || c <= 0) e.cost = "Kwota musi być większa od 0.";
    setErrs(e); if (Object.keys(e).length) return;
    const odometer = isFirst ? Math.round(d) : prevOdo + Math.round(d);
    onSave({ id: uid(), carId, stationId, odometer, liters: Math.round(l * 100) / 100, cost: Math.round(c * 100) / 100, date });
  };

  if (!data.cars.length) return <EmptyState icon={CarFront} title="Najpierw dodaj auto" desc="Aby zapisać tankowanie, potrzebny jest samochód." action={<button className="btn btn-primary" onClick={onNeedCar}>Dodaj samochód</button>} />;
  return (
    <>
      <Field label="Samochód" error={errs.car}>
        <select className="select" value={carId} onChange={(e) => setCarId(e.target.value)}>
          {data.cars.map((cr) => <option key={cr.id} value={cr.id}>{cr.name}</option>)}
        </select>
      </Field>
      <Field label="Stacja" error={errs.station}>
        {data.stations.length ? (
          <select className="select" value={stationId} onChange={(e) => setStationId(e.target.value)}>
            {data.stations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        ) : <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onNeedStation}><Plus size={15} /> Dodaj stację paliw</button>}
      </Field>
      <Field label={isFirst ? "Aktualny przebieg auta (pierwsze tankowanie)" : "Dystans od ostatniego tankowania"} error={errs.dist}>
        <NumInput value={dist} onChange={setDist} error={errs.dist} suffix="km" placeholder={isFirst ? "np. 154 300" : "np. 520"} />
        {!isFirst && (
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, marginTop: 6 }}>
            Licznik po tym tankowaniu: {(prevOdo + (parseNum(dist) > 0 ? Math.round(parseNum(dist)) : 0)).toLocaleString("pl-PL")} km
          </div>
        )}
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Litry" error={errs.liters}><NumInput value={liters} onChange={setLiters} error={errs.liters} suffix="l" /></Field></div>
        <div style={{ flex: 1 }}><Field label={`Kwota (${main})`} error={errs.cost}><NumInput value={cost} onChange={setCost} error={errs.cost} /></Field></div>
      </div>
      <div className="card" style={{ padding: 12, marginBottom: 14, background: "var(--accent-dim)", boxShadow: "none", border: "none", textAlign: "center", fontWeight: 800, color: "var(--accent)" }}>
        {ppl != null ? `Cena za litr: ${fmtMoney(ppl, main)}` : "Cena/litr policzy się automatycznie"}
      </div>
      <Field label="Data"><input type="date" className="input" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={submit} disabled={!data.stations.length}>Zapisz tankowanie</button>
      </div>
    </>
  );
}

/* ---------------- settings & subpages ---------------- */

function CarsStationsManager({ data, update, toast, confirm, back }) {
  const [carForm, setCarForm] = useState(null);
  const [stForm, setStForm] = useState(null);
  const refuelCount = (carId) => data.refuels.filter((r) => r.carId === carId).length;
  const stationCount = (stId) => data.refuels.filter((r) => r.stationId === stId).length;
  const delCar = (car) => confirm(
    { title: "Usunąć samochód?", desc: `Auto „${car.name}", jego ${refuelCount(car.id)} tankowań oraz powiązane transakcje paliwowe zostaną trwale usunięte.`, danger: true, confirmLabel: "Usuń auto" },
    () => {
      update((d) => {
        const gone = new Set(d.refuels.filter((r) => r.carId === car.id).map((r) => r.id));
        return { ...d, cars: d.cars.filter((x) => x.id !== car.id), refuels: d.refuels.filter((r) => r.carId !== car.id), transactions: d.transactions.filter((t) => !t.refuelId || !gone.has(t.refuelId)) };
      });
      toast("Samochód usunięty");
    });
  const delStation = (s) => confirm(
    { title: "Usunąć stację?", desc: `Stacja „${s.name}" zostanie usunięta. Tankowania pozostaną w historii bez nazwy stacji.`, danger: true, confirmLabel: "Usuń stację" },
    () => { update((d) => ({ ...d, stations: d.stations.filter((x) => x.id !== s.id) })); toast("Stacja usunięta"); });
  return (
    <div className="fade-in">
      <SubHead title="Samochody i stacje" back={back} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Samochody</div>
        <button className="btn btn-primary" style={{ padding: "9px 14px", fontSize: 13 }} onClick={() => setCarForm({})}><Plus size={15} /> Auto</button>
      </div>
      {data.cars.length === 0 ? (
        <EmptyState icon={CarFront} title="Brak samochodów" desc="Dodaj auto, aby zapisywać tankowania i śledzić spalanie." />
      ) : (
        <div className="card" style={{ padding: 6, marginBottom: 20 }}>
          {data.cars.map((c) => (
            <div key={c.id} className="tx-row">
              <div className="icon-badge" style={{ background: "var(--info-dim)", color: "var(--info)" }}><CarFront size={19} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: fit(c.name, 14.5, 12, 20) }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{c.fuel} · bak {c.tank} l · {refuelCount(c.id)} tankowań</div>
              </div>
              <button className="btn btn-ghost" style={{ padding: 8 }} aria-label={`Edytuj ${c.name}`} onClick={() => setCarForm(c)}><Pencil size={15} /></button>
              <button className="btn btn-danger" style={{ padding: 8 }} aria-label={`Usuń ${c.name}`} onClick={() => delCar(c)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 10px" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Stacje paliw</div>
        <button className="btn btn-primary" style={{ padding: "9px 14px", fontSize: 13 }} onClick={() => setStForm({})}><Plus size={15} /> Stacja</button>
      </div>
      {data.stations.length === 0 ? (
        <EmptyState icon={Fuel} title="Brak stacji" desc="Dodaj stacje, aby porównywać średnie ceny paliwa." />
      ) : (
        <div className="card" style={{ padding: 6 }}>
          {data.stations.map((s) => (
            <div key={s.id} className="tx-row">
              <div className="icon-badge" style={{ background: "#F9731622", color: "#F97316" }}><Fuel size={18} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: fit(s.name, 14.5, 12, 20) }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{stationCount(s.id)} tankowań</div>
              </div>
              <button className="btn btn-ghost" style={{ padding: 8 }} aria-label={`Edytuj ${s.name}`} onClick={() => setStForm(s)}><Pencil size={15} /></button>
              <button className="btn btn-danger" style={{ padding: 8 }} aria-label={`Usuń ${s.name}`} onClick={() => delStation(s)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
      <Sheet open={!!carForm} onClose={() => setCarForm(null)} title={carForm?.id ? "Edytuj samochód" : "Nowy samochód"}>
        {carForm && <CarForm initial={carForm} onClose={() => setCarForm(null)} onSave={(c) => {
          update((d) => ({ ...d, cars: c.id && d.cars.some((x) => x.id === c.id) ? d.cars.map((x) => (x.id === c.id ? c : x)) : [...d.cars, c] }));
          setCarForm(null); toast("Samochód zapisany");
        }} />}
      </Sheet>
      <Sheet open={!!stForm} onClose={() => setStForm(null)} title={stForm?.id ? "Edytuj stację" : "Nowa stacja paliw"}>
        {stForm && <StationForm initial={stForm} onClose={() => setStForm(null)} onSave={(s) => {
          update((d) => ({ ...d, stations: d.stations.some((x) => x.id === s.id) ? d.stations.map((x) => (x.id === s.id ? s : x)) : [...d.stations, s] }));
          setStForm(null); toast("Stacja zapisana");
        }} />}
      </Sheet>
    </div>
  );
}

function Settings_({ data, user, update, updateUser, go, toast, confirm, onLogout, onDeleteAccount, sub, setSub }) {
  const items = [
    { id: "categories", icon: LayoutGrid, label: "Kategorie", desc: "Własne kategorie, ikony i kolory" },
    { id: "recurring", icon: Repeat, label: "Płatności cykliczne", desc: "Wstrzymuj, wznawiaj i usuwaj" },
    { id: "cars", icon: CarFront, label: "Samochody i stacje", desc: "Edytuj i usuwaj pojazdy oraz stacje" },
    { id: "currency", icon: Coins, label: "Waluta i kursy", desc: `Główna: ${data.settings.mainCurrency}` },
    { id: "nav", icon: Menu, label: "Nawigacja", desc: "Układ paska i menu" },
    { id: "profile", icon: UserRound, label: "Profil", desc: user.name },
  ];
  const [themeSheet, setThemeSheet] = useState(false);
  const curTheme = THEMES.find((t) => t.id === data.settings.theme) || THEMES[0];
  if (sub === "categories") return <CategoriesManager data={data} update={update} toast={toast} confirm={confirm} back={() => setSub(null)} />;
  if (sub === "recurring") return <RecurringManager data={data} helpers={{ main: data.settings.mainCurrency }} update={update} toast={toast} confirm={confirm} back={() => setSub(null)} />;
  if (sub === "currency") return <CurrencyManager data={data} update={update} toast={toast} back={() => setSub(null)} />;
  if (sub === "profile") return <ProfileManager user={user} updateUser={updateUser} toast={toast} confirm={confirm} onLogout={onLogout} onDeleteAccount={onDeleteAccount} back={() => setSub(null)} />;
  if (sub === "nav") return <NavManager data={data} update={update} toast={toast} back={() => setSub(null)} />;
  if (sub === "cars") return <CarsStationsManager data={data} update={update} toast={toast} confirm={confirm} back={() => setSub(null)} />;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h1 className="page-title">Ustawienia</h1>
      <div className="card" style={{ padding: 6 }}>
        {items.map((it) => (
          <button key={it.id} className="tx-row row-press" style={{ width: "100%", border: "none", background: "none", fontFamily: "inherit", color: "var(--text)", cursor: "pointer", textAlign: "left" }}
            onClick={() => setSub(it.id)}>
            <div className="icon-badge" style={{ background: "var(--surface2)", color: "var(--muted)" }}><it.icon size={19} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>{it.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{it.desc}</div>
            </div>
            <ChevronRight size={17} style={{ color: "var(--muted)" }} />
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="icon-badge" style={{ background: "var(--surface2)", color: "var(--muted)" }}>
            {curTheme.scheme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>Motyw: {curTheme.label}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
              {[curTheme.accent, curTheme.info, curTheme.neg].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 4, background: c }} />)}
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => setThemeSheet(true)}><Palette size={15} /> Zmień</button>
      </div>
      <ThemePicker open={themeSheet} onClose={() => setThemeSheet(false)} current={data.settings.theme}
        onPick={(id) => { update((d) => ({ ...d, settings: { ...d.settings, theme: id } })); toast(`Motyw: ${THEMES.find((t) => t.id === id)?.label}`); }} />

      <p style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
        Dane przechowywane lokalnie na tym urządzeniu, osobno dla każdego konta. Zalogowano jako {user.login}.
        <br />Sakwa · kompilacja 31 · baza Supabase</p>
    </div>
  );
}

function SubHead({ title, back }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <button className="btn btn-ghost" style={{ padding: 9 }} onClick={back} aria-label="Wstecz"><ChevronLeft size={18} /></button>
      <h1 className="page-title">{title}</h1>
    </div>
  );
}

function CategoriesManager({ data, update, toast, confirm, back }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState(null);
  const list = data.categories.filter((c) => c.type === type);
  const save = (c) => {
    update((d) => ({ ...d, categories: c.id && d.categories.some((x) => x.id === c.id) ? d.categories.map((x) => (x.id === c.id ? { ...x, ...c } : x)) : [...d.categories, c] }));
    setForm(null); toast("Kategoria zapisana");
  };
  const del = (c) => confirm(
    { title: "Usunąć kategorię?", desc: `Kategoria „${c.name}" zostanie usunięta. Powiązane transakcje NIE zostaną skasowane — przejdą do stanu „bez kategorii".`, danger: true, confirmLabel: "Usuń kategorię" },
    () => { update((d) => ({ ...d, categories: d.categories.filter((x) => x.id !== c.id) })); toast("Kategoria usunięta — transakcje bez kategorii"); });
  return (
    <div className="fade-in">
      <SubHead title="Kategorie" back={back} />
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <Seg value={type} onChange={setType} tone={(v) => (v === "income" ? "pos" : "neg")}
            options={[{ value: "expense", label: "Wydatki" }, { value: "income", label: "Przychody" }]} />
        </div>
        <button className="btn btn-primary" onClick={() => setForm({ type })}><Plus size={16} /> Nowa</button>
      </div>
      <div className="card" style={{ padding: 6 }}>
        {list.map((c) => (
          <div key={c.id} className="tx-row">
            <CatIcon cat={c} />
            <div style={{ flex: 1, fontWeight: 800, fontSize: 14.5 }}>{c.name} {c.builtin && <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>· domyślna</span>}</div>
            <button className="btn btn-ghost" style={{ padding: 8 }} aria-label={`Edytuj ${c.name}`} onClick={() => setForm(c)}><Pencil size={15} /></button>
            <button className="btn btn-danger" style={{ padding: 8 }} aria-label={`Usuń ${c.name}`} onClick={() => del(c)}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      <Sheet open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edytuj kategorię" : "Nowa kategoria"}>
        {form && <CategoryForm initial={form} onSave={save} onClose={() => setForm(null)} />}
      </Sheet>
    </div>
  );
}

function CategoryForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial.name || "");
  const [type, setType] = useState(initial.type || "expense");
  const [icon, setIcon] = useState(initial.icon || "Wallet");
  const [color, setColor] = useState(initial.color || CAT_COLORS[0]);
  const [err, setErr] = useState("");
  return (
    <>
      <Field label="Nazwa" error={err}><input className={`input ${err ? "err" : ""}`} placeholder="np. Subskrypcje" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      {!initial.id && (
        <Field label="Typ">
          <Seg value={type} onChange={setType} tone={(v) => (v === "income" ? "pos" : "neg")}
            options={[{ value: "expense", label: "Wydatek" }, { value: "income", label: "Przychód" }]} />
        </Field>
      )}
      <Field label="Ikona">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))", gap: 8, maxHeight: 170, overflowY: "auto", padding: 2 }}>
          {ICON_NAMES.map((n) => {
            const I = ICONS[n];
            return (
              <button key={n} type="button" onClick={() => setIcon(n)} aria-label={n}
                style={{ height: 46, borderRadius: 13, border: `1.5px solid ${icon === n ? "var(--accent)" : "var(--line)"}`, background: icon === n ? "var(--accent-dim)" : "var(--surface2)", color: icon === n ? "var(--accent)" : "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I size={19} />
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Kolor">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CAT_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} aria-label={`Kolor ${c}`}
              style={{ width: 34, height: 34, borderRadius: 12, background: c, border: color === c ? "3px solid var(--text)" : "3px solid transparent", cursor: "pointer" }} />
          ))}
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Własny kolor"
            style={{ width: 34, height: 34, borderRadius: 12, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
        </div>
      </Field>
      <div className="card" style={{ padding: 12, marginBottom: 14, display: "flex", alignItems: "center", gap: 12, background: "var(--surface2)", boxShadow: "none" }}>
        <CatIcon cat={{ icon, color }} /><span style={{ fontWeight: 800 }}>{name || "Podgląd kategorii"}</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Anuluj</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => (name.trim() ? onSave({ id: initial.id || uid(), name: name.trim(), type, icon, color, builtin: initial.builtin }) : setErr("Podaj nazwę kategorii."))}>Zapisz</button>
      </div>
    </>
  );
}

function RecurringManager({ data, helpers, update, toast, confirm, back }) {
  const active = data.recurring.filter((r) => !r.deleted);
  return (
    <div className="fade-in">
      <SubHead title="Płatności cykliczne" back={back} />
      {active.length === 0 ? (
        <EmptyState icon={Repeat} title="Brak płatności cyklicznych" desc="Dodając transakcję, zaznacz „transakcja cykliczna” — pojawi się tutaj i będzie generowana co miesiąc automatycznie." />
      ) : (
        <div className="card" style={{ padding: 6 }}>
          {active.map((r) => {
            const cat = data.categories.find((c) => c.id === r.categoryId);
            const now = new Date();
            const next = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= r.day ? 1 : 0), r.day);
            return (
              <div key={r.id} className="tx-row" style={{ opacity: r.paused ? 0.55 : 1 }}>
                <CatIcon cat={cat} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    {r.paused ? "Wstrzymana" : `Następna: ${fmtDate(next.toISOString().slice(0, 10))}`} · {r.day}. dzień mies.
                  </div>
                </div>
                <div className="sens" style={{ fontWeight: 800, color: r.type === "income" ? "var(--accent)" : "var(--neg)" }}>
                  {r.type === "income" ? "+" : "−"}{fmtMoney(r.amount, r.currency)}
                </div>
                <button className="btn btn-ghost" style={{ padding: 8 }} aria-label={r.paused ? "Wznów" : "Wstrzymaj"}
                  onClick={() => { update((d) => ({ ...d, recurring: d.recurring.map((x) => (x.id === r.id ? { ...x, paused: !x.paused } : x)) })); toast(r.paused ? "Płatność wznowiona" : "Płatność wstrzymana"); }}>
                  {r.paused ? <Play size={15} /> : <Pause size={15} />}
                </button>
                <button className="btn btn-danger" style={{ padding: 8 }} aria-label="Usuń płatność" onClick={() =>
                  confirm({ title: "Usunąć płatność cykliczną?", desc: `„${r.name}" przestanie być generowana. Już utworzone transakcje pozostaną w historii.`, danger: true, confirmLabel: "Usuń" },
                    () => { update((d) => ({ ...d, recurring: d.recurring.filter((x) => x.id !== r.id) })); toast("Płatność cykliczna usunięta"); })
                }><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CurrencyManager({ data, update, toast, back }) {
  const [rates, setRates] = useState(() => Object.fromEntries(CURRENCIES.map((c) => [c, String(data.settings.rates[c] ?? DEFAULT_RATES[c])])));
  const save = () => {
    const parsed = {};
    for (const c of CURRENCIES) {
      const n = parseNum(rates[c]);
      if (isNaN(n) || n <= 0) { toast(`Nieprawidłowy kurs dla ${c}.`); return; }
      parsed[c] = n;
    }
    parsed.PLN = 1;
    update((d) => ({ ...d, settings: { ...d.settings, rates: parsed } }));
    toast("Kursy zapisane");
  };
  return (
    <div className="fade-in">
      <SubHead title="Waluta i kursy" back={back} />
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <label className="label">Waluta główna (saldo i statystyki)</label>
        <select className="select" value={data.settings.mainCurrency}
          onChange={(e) => { update((d) => ({ ...d, settings: { ...d.settings, mainCurrency: e.target.value } })); toast(`Waluta główna: ${e.target.value}`); }}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>Kursy względem PLN</div>
        <p style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>
          Kursy edytujesz ręcznie (aktualne znajdziesz np. na stronie NBP). Aplikacja działa offline, więc przelicza kwoty według wartości zapisanych poniżej.
        </p>
        {CURRENCIES.map((c) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ width: 44, fontWeight: 800 }}>{c}</span>
            {c === "PLN" ? <span style={{ color: "var(--muted)", fontWeight: 700 }}>1,00 (waluta bazowa)</span> : (
              <>
                <div style={{ flex: 1 }}><NumInput value={rates[c]} onChange={(v) => setRates({ ...rates, [c]: v })} /></div>
                <span style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 700 }}>PLN za 1 {c}</span>
              </>
            )}
          </div>
        ))}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={save}><RefreshCw size={15} /> Zapisz kursy</button>
      </div>
    </div>
  );
}

function ProfileManager({ user, updateUser, toast, confirm, onLogout, onDeleteAccount, back }) {
  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.avatarColor || AVATAR_COLORS[0]);
  const [err, setErr] = useState("");
  return (
    <div className="fade-in">
      <SubHead title="Profil" back={back} />
      <div className="card" style={{ padding: 20, textAlign: "center", marginBottom: 14 }}>
        <div style={{ width: 76, height: 76, borderRadius: 26, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, margin: "0 auto 10px" }}>
          {(name || "?").trim().charAt(0).toUpperCase()}
        </div>
        <div style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13 }}>@{user.login}</div>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <Field label="Nazwa wyświetlana" error={err}><input className={`input ${err ? "err" : ""}`} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Kolor awatara">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {AVATAR_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-label={`Kolor ${c}`}
                style={{ width: 34, height: 34, borderRadius: 12, background: c, border: color === c ? "3px solid var(--text)" : "3px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
        </Field>
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => (name.trim() ? (updateUser({ name: name.trim(), avatarColor: color }), toast("Profil zapisany")) : setErr("Nazwa nie może być pusta."))}>
          Zapisz profil
        </button>
      </div>
      <div className="card" style={{ padding: 6, marginTop: 14 }}>
        <button className="tx-row row-press" style={{ width: "100%", border: "none", background: "none", fontFamily: "inherit", color: "var(--text)", cursor: "pointer", textAlign: "left" }}
          onClick={() => confirm({ title: "Wylogować?", desc: "Twoje dane są bezpiecznie zapisane w bazie — po ponownym zalogowaniu wszystko wróci.", confirmLabel: "Wyloguj" }, onLogout)}>
          <div className="icon-badge" style={{ background: "var(--surface2)", color: "var(--muted)" }}><LogOut size={18} /></div>
          <div style={{ fontWeight: 800, fontSize: 14.5 }}>Wyloguj</div>
        </button>
        <button className="tx-row row-press" style={{ width: "100%", border: "none", background: "none", fontFamily: "inherit", color: "var(--neg)", cursor: "pointer", textAlign: "left" }}
          onClick={() => confirm({ title: "Usunąć konto?", desc: `Konto „${user.login}" oraz WSZYSTKIE jego dane (transakcje, cele, auta, tankowania) zostaną trwale usunięte z bazy. Tej operacji nie można cofnąć.`, danger: true, confirmLabel: "Usuń konto na zawsze", typeToConfirm: user.login }, onDeleteAccount)}>
          <div className="icon-badge" style={{ background: "var(--neg-dim)", color: "var(--neg)" }}><Trash2 size={18} /></div>
          <div style={{ fontWeight: 800, fontSize: 14.5 }}>Usuń konto</div>
        </button>
      </div>
    </div>
  );
}

/* ---------------- auth ---------------- */

function Auth({ onAuthed, onAwaitingVerify, onAwaitingReset }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [keep30, setKeep30] = useState(false);

  const switchMode = (m) => { setMode(m); setErrs({}); setInfo(""); };

  const submit = async () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Podaj prawidłowy adres e-mail.";
    if (mode === "register") {
      const issues = passwordProblems(pass);
      if (issues.length) e.pass = "Hasło nie spełnia wymagań: " + issues.join(", ") + ".";
      if (!name.trim()) e.name = "Podaj nazwę wyświetlaną.";
    } else if (mode === "login" && !pass) {
      e.pass = "Podaj hasło.";
    }
    setErrs(e); setInfo("");
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      if (mode === "reset") {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
          if (error && !/not.?found|no user/i.test(error.message || "")) throw error;
        } catch (err) {
          if (!/not.?found|no user/i.test(err?.message || "")) throw err;
        }
        if (onAwaitingReset) onAwaitingReset();
        // Zawsze ten sam komunikat — brak konta = brak maila, ale nie zdradzamy tego użytkownikowi
        setInfo("Jeśli konto z tym adresem istnieje, wysłaliśmy link do zmiany hasła. Sprawdź skrzynkę (także folder spam).");
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(), password: pass,
          options: { data: { display_name: name.trim() }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setErrs({ email: "Konto z tym adresem e-mail już istnieje. Zaloguj się lub użyj resetu hasła." });
          return;
        }
        if (data.session?.user) onAuthed(data.session.user);
        else {
          if (onAwaitingVerify) onAwaitingVerify();
          setInfo("Konto utworzone! Sprawdź skrzynkę e-mail i kliknij link potwierdzający — po kliknięciu ta karta zaloguje się sama.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) throw error;
        try {
          if (keep30) localStorage.setItem(KEEP_LS_KEY, "1");
          else localStorage.removeItem(KEEP_LS_KEY);
          localStorage.setItem(LASTACT_LS_KEY, String(Date.now()));
        } catch {}
        onAuthed(data.user);
      }
    } catch (err) {
      setErrs({ pass: authErrPl(err) });
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="card fade-in" style={{ width: "min(420px, 100%)", padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div className="icon-badge" style={{ width: 58, height: 58, borderRadius: 20, background: "var(--accent-dim)", color: "var(--accent)", margin: "0 auto 12px" }}>
            <Wallet size={27} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Sakwa</div>
          <div style={{ color: "var(--muted)", fontWeight: 700, fontSize: 13 }}>
            {mode === "reset" ? "Odzyskiwanie dostępu do konta" : "Twoje finanse, bezpiecznie w chmurze"}
          </div>
        </div>

        {mode !== "reset" ? (
          <>
            <div style={{ marginBottom: 18 }}>
              <Seg value={mode} onChange={switchMode}
                options={[{ value: "login", label: "Logowanie" }, { value: "register", label: "Rejestracja" }]} />
            </div>
            {mode === "register" && (
              <Field label="Nazwa wyświetlana" error={errs.name}>
                <input className={`input ${errs.name ? "err" : ""}`} placeholder="np. Ania" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
            )}
            <Field label="E-mail" error={errs.email}>
              <input type="email" className={`input ${errs.email ? "err" : ""}`} placeholder="ty@przyklad.pl" autoCapitalize="none" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Hasło" error={errs.pass}>
              <PasswordInput error={errs.pass} placeholder={mode === "register" ? "silne hasło" : "twoje hasło"} autoComplete={mode === "register" ? "new-password" : "current-password"} value={pass}
                onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
              {mode === "register" && !errs.pass && (
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                  Min. 8 znaków, w tym mała i wielka litera oraz cyfra.
                </div>
              )}
            </Field>
          </>
        ) : (
          <>
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
              Podaj adres e-mail konta — wyślemy link, po którego kliknięciu ustawisz nowe hasło.
            </p>
            <Field label="E-mail" error={errs.email}>
              <input type="email" className={`input ${errs.email ? "err" : ""}`} placeholder="ty@przyklad.pl" autoCapitalize="none" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
            </Field>
          </>
        )}

        {mode === "login" && (
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, marginBottom: 14, color: "var(--muted)" }}>
            <input type="checkbox" checked={keep30} onChange={(e) => setKeep30(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--accent)" }} />
            Nie wylogowuj mnie przez 30 dni
          </label>
        )}
        {info && <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, lineHeight: 1.5, marginBottom: 12 }}>{info}</p>}

        <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={busy} onClick={submit}>
          {busy ? "Chwileczkę…" : mode === "login" ? "Zaloguj się" : mode === "register" ? "Utwórz konto" : "Wyślij link resetujący"}
        </button>

        {mode === "login" && (
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12.5 }} onClick={() => switchMode("reset")}>
            Nie pamiętam hasła
          </button>
        )}
        {mode === "reset" && (
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12.5 }} onClick={() => switchMode("login")}>
            ← Wróć do logowania
          </button>
        )}

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, fontWeight: 600, marginTop: 16, lineHeight: 1.5 }}>
          Twoje dane są zapisywane w zabezpieczonej bazie i dostępne z każdego urządzenia po zalogowaniu.
        </p>
      </div>
    </div>
  );
}

/* ---------------- recurring generation (idempotent) ---------------- */

function generateRecurringTx(data) {
  const now = new Date();
  const existing = new Set(data.transactions.map((t) => t.id));
  const added = [];
  for (const r of data.recurring) {
    if (r.paused) continue;
    const start = new Date(r.startDate + "T00:00:00");
    let y = start.getFullYear(), m = start.getMonth();
    while (y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth())) {
      const occur = new Date(y, m, Math.min(r.day, 28));
      const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(r.day, 28)).padStart(2, "0")}`;
      if (occur >= start && occur <= now) {
        const id = `rec-${r.id}-${y}-${String(m + 1).padStart(2, "0")}`;
        if (!existing.has(id)) {
          added.push({ id, type: r.type, name: r.name, amount: r.amount, currency: r.currency, categoryId: r.categoryId, date: iso, note: "", recurringId: r.id });
          existing.add(id);
        }
      }
      m++; if (m > 11) { m = 0; y++; }
    }
  }
  return added;
}

/* ---------------- budgets (standalone) ---------------- */

function Budgets({ data, helpers, update, toast, confirm }) {
  const { toMain, main } = helpers;
  const now = new Date();
  const curYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const nextD = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextYM = `${nextD.getFullYear()}-${String(nextD.getMonth() + 1).padStart(2, "0")}`;
  const monthOpts = [
    { value: "cur", label: `Bieżący (${MONTHS_PL[now.getMonth()]})` },
    { value: "next", label: `Przyszły (${MONTHS_PL[nextD.getMonth()]})` },
  ];
  const labelFor = (sel) => sel === "cur"
    ? `${MONTHS_FULL[now.getMonth()]} ${now.getFullYear()}`
    : `${MONTHS_FULL[nextD.getMonth()]} ${nextD.getFullYear()}`;

  const [monthSel, setMonthSel] = useState("cur");
  const ymKey = monthSel === "cur" ? curYM : nextYM;
  const monthLabel = labelFor(monthSel);
  const cats = data.categories.filter((c) => c.type === "expense");
  const saved = data.budgets?.[ymKey] || {};

  const spentFor = (catId) => data.transactions
    .filter((t) => t.type === "expense" && t.categoryId === catId && ym(t.date) === curYM)
    .reduce((s, t) => s + toMain(t.amount, t.currency), 0);

  /* --- sheet: dodawanie / edycja pojedynczego budżetu --- */
  const [sheet, setSheet] = useState(null); // { mode: "add" } | { mode: "edit", catId }
  const [sheetMonth, setSheetMonth] = useState("cur");
  const [selCat, setSelCat] = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");

  const sheetYM = sheetMonth === "cur" ? curYM : nextYM;
  const savedSheet = data.budgets?.[sheetYM] || {};
  const availableCats = sheet?.mode === "edit"
    ? cats.filter((c) => c.id === sheet.catId)
    : cats.filter((c) => !savedSheet[c.id]);

  const openAdd = () => { setSheetMonth(monthSel); setSelCat(""); setAmount(""); setErr(""); setSheet({ mode: "add" }); };
  const openEdit = (catId) => {
    setSheetMonth(monthSel); setSelCat(catId);
    setAmount(String(saved[catId]).replace(".", ",")); setErr("");
    setSheet({ mode: "edit", catId });
  };

  const saveBudget = () => {
    if (!selCat) return setErr("Wybierz kategorię.");
    const n = parseNum((amount || "").trim());
    if (isNaN(n) || n <= 0) return setErr("Podaj prawidłowy limit większy od zera.");
    const c = cats.find((x) => x.id === selCat);
    update((d) => ({
      ...d,
      budgets: { ...(d.budgets || {}), [sheetYM]: { ...(d.budgets?.[sheetYM] || {}), [selCat]: Math.round(n * 100) / 100 } },
    }));
    setSheet(null);
    toast(sheet?.mode === "edit"
      ? `Budżet „${c?.name}" zaktualizowany`
      : `Budżet „${c?.name}" dodany na ${labelFor(sheetMonth).toLowerCase()}`);
    if (sheet?.mode === "add" && sheetMonth !== monthSel) setMonthSel(sheetMonth);
  };

  const removeBudget = (catId) => {
    const c = cats.find((x) => x.id === catId);
    confirm({
      title: "Usunąć budżet?",
      desc: `Limit dla kategorii „${c ? c.name : "usunięta kategoria"}" na ${monthLabel.toLowerCase()} zostanie usunięty. Transakcje pozostaną nietknięte.`,
      danger: true, confirmLabel: "Usuń budżet",
    }, () => {
      update((d) => {
        const m = { ...(d.budgets?.[ymKey] || {}) };
        delete m[catId];
        return { ...d, budgets: { ...(d.budgets || {}), [ymKey]: m } };
      });
      toast("Budżet usunięty");
    });
  };

  const activeRows = Object.entries(saved).filter(([, v]) => v > 0);
  const totalLimit = activeRows.reduce((s, [, v]) => s + v, 0);
  const totalSpent = monthSel === "cur" ? activeRows.reduce((s, [id]) => s + spentFor(id), 0) : 0;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 className="page-title" style={{ margin: 0 }}>Budżety</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Dodaj budżet</button>
      </div>
      <Seg value={monthSel} onChange={setMonthSel} options={monthOpts} />

      {activeRows.length > 0 && (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>
            {monthSel === "cur" ? "Wykorzystanie budżetów" : "Zaplanowane limity"} · {monthLabel.toLowerCase()}
          </div>
          <div className="sens" style={{ fontSize: 24, fontWeight: 800 }}>
            {monthSel === "cur" ? <>{fmtMoney(totalSpent, main, true)} <span style={{ color: "var(--muted)", fontSize: 15 }}>/ {fmtMoney(totalLimit, main, true)}</span></> : fmtMoney(totalLimit, main, true)}
          </div>
          {monthSel === "cur" && (
            <div className="progress-track" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${totalLimit ? Math.min(100, (totalSpent / totalLimit) * 100) : 0}%`, background: totalSpent >= totalLimit ? "var(--neg)" : totalSpent >= totalLimit * 0.8 ? "var(--warn)" : "var(--accent)" }} />
            </div>
          )}
        </div>
      )}

      {activeRows.length === 0 ? (
        <div className="card" style={{ padding: "34px 20px", textAlign: "center" }}>
          <div className="icon-badge" style={{ width: 52, height: 52, borderRadius: 18, background: "var(--surface2)", color: "var(--muted)", margin: "0 auto 12px" }}>
            <Landmark size={24} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 6 }}>Brak budżetów na {monthLabel.toLowerCase()}</div>
          <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>
            Dodaj limit dla wybranej kategorii, a aplikacja pokaże na bieżąco, ile z niego wykorzystujesz.
          </p>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Dodaj pierwszy budżet</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 16 }}>
          {monthSel === "next" && (
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12.5, lineHeight: 1.55, marginBottom: 14 }}>
              Limity zaczną obowiązywać od pierwszego dnia przyszłego miesiąca.
            </p>
          )}
          {activeRows.map(([id, limit]) => {
            const c = cats.find((x) => x.id === id);
            const spent = monthSel === "cur" ? spentFor(id) : 0;
            const ratio = limit > 0 ? spent / limit : 0;
            const color = ratio >= 1 ? "var(--neg)" : ratio >= 0.8 ? "var(--warn)" : "var(--accent)";
            return (
              <div key={id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {c ? <CatIcon cat={c} size={34} /> : (
                    <div className="icon-badge" style={{ width: 34, height: 34, background: "var(--surface2)", color: "var(--muted)" }}><CircleHelp size={17} /></div>
                  )}
                  <button onClick={() => c && openEdit(id)} style={{ flex: 1, minWidth: 0, border: "none", background: "none", fontFamily: "inherit", color: "var(--text)", textAlign: "left", cursor: c ? "pointer" : "default", padding: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c ? c.name : "Usunięta kategoria"}</div>
                    <div className="sens" style={{ fontSize: 11.5, fontWeight: 700, color: monthSel === "cur" ? color : "var(--muted)" }}>
                      {monthSel === "cur" ? <>{fmtMoney(spent, main, true)} / {fmtMoney(limit, main, true)}</> : <>limit {fmtMoney(limit, main, true)}</>}
                    </div>
                  </button>
                  <button className="btn btn-ghost" aria-label={`Usuń budżet ${c ? c.name : ""}`}
                    style={{ padding: 7, borderRadius: 10, color: "var(--neg)", flexShrink: 0 }}
                    onClick={() => removeBudget(id)}>
                    <X size={17} strokeWidth={2.6} />
                  </button>
                </div>
                {monthSel === "cur" && (
                  <div className="progress-track" style={{ height: 6, marginTop: 7 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, ratio * 100)}%`, background: color }} />
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 11.5, marginTop: 2 }}>
            Kliknij nazwę kategorii, aby zmienić limit.
          </p>
        </div>
      )}

      <Sheet open={!!sheet} onClose={() => setSheet(null)} title={sheet?.mode === "edit" ? "Edytuj budżet" : "Nowy budżet"}>
        {sheet?.mode === "add" ? (
          <Field label="Miesiąc">
            <Seg value={sheetMonth} onChange={setSheetMonth} options={monthOpts} />
          </Field>
        ) : (
          <p style={{ color: "var(--muted)", fontWeight: 700, fontSize: 12.5, marginBottom: 12 }}>
            Miesiąc: {labelFor(sheetMonth).toLowerCase()}
          </p>
        )}
        <Field label="Kategoria" error={!selCat && err ? err : undefined}>
          {sheet?.mode === "edit" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {availableCats[0] && <CatIcon cat={availableCats[0]} size={32} />}
              <div style={{ fontWeight: 800, fontSize: 14 }}>{availableCats[0]?.name}</div>
            </div>
          ) : availableCats.length ? (
            <select className={`input ${!selCat && err ? "err" : ""}`} value={selCat} onChange={(e) => { setSelCat(e.target.value); setErr(""); }}>
              <option value="">— wybierz kategorię —</option>
              {availableCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ) : (
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13, lineHeight: 1.5 }}>
              Wszystkie kategorie wydatków mają już budżet na {labelFor(sheetMonth).toLowerCase()}.
            </p>
          )}
        </Field>
        <Field label={`Limit (${main})`} error={selCat && err ? err : undefined}>
          <NumInput value={amount} onChange={(v) => { setAmount(v); setErr(""); }} placeholder="np. 800" suffix={main} />
        </Field>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSheet(null)}>Anuluj</button>
          <button className="btn btn-primary" style={{ flex: 2 }} disabled={sheet?.mode === "add" && !availableCats.length} onClick={saveBudget}>
            {sheet?.mode === "edit" ? "Zapisz zmiany" : "Dodaj budżet"}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

/* ---------------- "more" grid (mobile) ---------------- */

const TILE_EXTRA = {
  dashboard: { desc: "Saldo, statystyki, budżety", color: "#34E0A1" },
  history: { desc: "Wszystkie transakcje i filtry", color: "#5EA0FF" },
  stats: { desc: "Wykresy, heatmapa, analiza", color: "#2DD4BF" },
  fuel: { desc: "Auta, tankowania, spalanie", color: "#F97316" },
  goals: { desc: "Oszczędzanie na marzenia", color: "#34E0A1" },
  budgets: { desc: "Limity wydatków na miesiąc", color: "#FFD166" },
  summary: { desc: "Miesiąc po miesiącu: wpłaty, wydatki, oszczędności", color: "#5EA0FF" },
  reports: { desc: "Podsumowania, historia, PDF", color: "#8B7CFF" },
  settings: { desc: "Kategorie, waluty, profil", color: "#4D9FFF" },
};

function More({ go, data }) {
  const barIds = normalizeNav(data.settings.navOrder).slice(0, 4);
  const tiles = DEFAULT_NAV.filter((id) => id !== "more" && !barIds.includes(id));
  return (
    <div className="fade-in">
      <h1 className="page-title" style={{ marginBottom: 16 }}>Więcej</h1>
      <div className="tile-grid stagger">
        {tiles.map((id) => {
          const m = NAV_META[id]; const x = TILE_EXTRA[id] || {}; const I = m.icon;
          return (
            <button key={id} className="card row-press" onClick={() => go(id)}
              style={{ padding: 18, cursor: "pointer", fontFamily: "inherit", color: "var(--text)", textAlign: "left", border: "1px solid var(--line)" }}>
              <div className="icon-badge" style={{ background: (x.color || "#8B7CFF") + "22", color: x.color || "#8B7CFF", marginBottom: 12 }}><I size={20} /></div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{m.label}</div>
              <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, marginTop: 3 }}>{x.desc || ""}</div>
            </button>
          );
        })}
      </div>
      <p style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        Kafelki pokazują sekcje spoza dolnego paska. Układ zmienisz w Ustawienia → Nawigacja.
      </p>
    </div>
  );
}

function ToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.querySelector(".app-scroll");
    const fn = () => setShow((window.scrollY || 0) > 350 || (el ? el.scrollTop : 0) > 350);
    window.addEventListener("scroll", fn, { passive: true });
    if (el) el.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => {
      window.removeEventListener("scroll", fn);
      if (el) el.removeEventListener("scroll", fn);
    };
  }, []);
  return (
    <button className={`to-top no-print ${show ? "show" : ""}`} aria-label="Wróć na górę"
      onClick={() => scrollTopAll(true)}>
      <ArrowUp size={20} strokeWidth={2.4} />
    </button>
  );
}

/* ---------------- root app ---------------- */

function Summary({ data, helpers }) {
  const { toMain, main } = helpers;
  const now = new Date();
  const curYear = now.getFullYear();
  const firstTx = data.transactions.length ? [...data.transactions].sort((a, b) => a.date.localeCompare(b.date))[0].date : null;
  const startISO = [data.profile?.createdAt, firstTx].filter(Boolean).sort()[0] || todayISO();
  const startD = new Date(startISO);
  const years = [];
  for (let y = curYear; y >= startD.getFullYear(); y--) years.push(y);
  const [year, setYear] = useState(curYear);

  const monthFrom = year === startD.getFullYear() ? startD.getMonth() : 0;
  const monthTo = year === curYear ? now.getMonth() : 11;
  const rows = [];
  for (let m = monthTo; m >= monthFrom; m--) {
    const key = `${year}-${String(m + 1).padStart(2, "0")}`;
    let inc = 0, exp = 0;
    for (const t of data.transactions) {
      if (ym(t.date) !== key) continue;
      const v = toMain(t.amount, t.currency);
      if (t.type === "income") inc += v; else exp += v;
    }
    rows.push({ m, key, inc, exp, saved: inc - exp });
  }
  const totInc = rows.reduce((s, r) => s + r.inc, 0);
  const totExp = rows.reduce((s, r) => s + r.exp, 0);

  const Cell = ({ label, value, color }) => (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
      <div className="sens" style={{ fontSize: 15, fontWeight: 800, color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtMoney(value, main, true)}</div>
    </div>
  );

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 className="page-title" style={{ margin: 0 }}>Podsumowanie</h1>
        {years.length > 1 ? (
          <select className="input" style={{ width: "auto", minWidth: 110, padding: "10px 14px" }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        ) : (
          <span className="chip" style={{ background: "var(--surface2)", color: "var(--muted)" }}>{year}</span>
        )}
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>
          Cały rok {year}{year === startD.getFullYear() ? ` · od założenia konta (${startISO})` : ""}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <Cell label="Wpłaty" value={totInc} color="var(--pos)" />
          <Cell label="Wydatki" value={totExp} color="var(--neg)" />
          <Cell label="Zaoszczędzono" value={totInc - totExp} color={totInc - totExp >= 0 ? "var(--info)" : "var(--neg)"} />
        </div>
      </div>

      <div className="card" style={{ padding: 6 }}>
        {rows.map((r) => {
          const isCur = year === curYear && r.m === now.getMonth();
          return (
            <div key={r.key} style={{ padding: "13px 14px", borderRadius: 14, background: isCur ? "var(--surface2)" : "transparent", marginBottom: 2 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  {MONTHS_FULL[r.m]}
                  {isCur && <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 800, marginLeft: 8 }}>bieżący</span>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <Cell label="Wpłaty" value={r.inc} color="var(--pos)" />
                <Cell label="Wydatki" value={r.exp} color="var(--neg)" />
                <Cell label="Zaoszczędzono" value={r.saved} color={r.saved >= 0 ? "var(--info)" : "var(--neg)"} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const NAV_META = {
  dashboard: { icon: Home, label: "Pulpit" },
  history: { icon: List, label: "Historia" },
  stats: { icon: BarChart3, label: "Statystyki" },
  more: { icon: LayoutGrid, label: "Więcej" },
  reports: { icon: FileText, label: "Raporty" },
  fuel: { icon: Fuel, label: "Paliwo" },
  goals: { icon: Target, label: "Cele" },
  budgets: { icon: Landmark, label: "Budżety" },
  summary: { icon: CalendarDays, label: "Podsumowanie" },
  settings: { icon: SettingsIcon, label: "Ustawienia" },
};

function NavManager({ data, update, toast, back }) {
  const order = normalizeNav(data.settings.navOrder);
  const move = (i, dir) => {
    if (order[i] === "more") return;
    let j = i + dir;
    if (j >= 0 && j < order.length && order[j] === "more") j += dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    update((d) => ({ ...d, settings: { ...d.settings, navOrder: next } }));
  };
  return (
    <div className="fade-in">
      <SubHead title="Nawigacja" back={back} />
      <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.55, marginBottom: 14 }}>
        Ustaw kolejność sekcji strzałkami. <b style={{ color: "var(--text)" }}>Pierwsze 4 pozycje</b> trafiają na dolny pasek (mobile), pełna kolejność steruje menu bocznym na komputerze.
      </p>
      <div className="card" style={{ padding: 6 }}>
        {order.map((id, i) => {
          const m = NAV_META[id];
          if (!m) return null;
          const onBar = i < 4;
          const locked = id === "more";
          return (
            <div key={id} className="tx-row" style={{ background: onBar ? "var(--info-dim)" : "transparent", marginBottom: 2, opacity: locked ? 0.75 : 1 }}>
              <div className="icon-badge" style={{ background: "var(--surface2)", color: onBar ? "var(--info)" : "var(--muted)" }}><m.icon size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5 }}>{m.label}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: onBar ? "var(--info)" : "var(--muted)" }}>
                  {locked ? "Zablokowane · zawsze na pasku" : onBar ? `Na pasku · slot ${i + 1}` : "W menu „Więcej” / sidebar"}
                </div>
              </div>
              {locked ? (
                <div className="icon-badge" style={{ width: 34, height: 34, background: "var(--surface2)", color: "var(--muted)" }}><Lock size={15} /></div>
              ) : (
                <>
                  <button className="btn btn-ghost" style={{ padding: 8 }} disabled={i === 0} aria-label="W górę" onClick={() => move(i, -1)}><ChevronUp size={16} /></button>
                  <button className="btn btn-ghost" style={{ padding: 8 }} disabled={i === order.length - 1} aria-label="W dół" onClick={() => move(i, 1)}><ChevronDown size={16} /></button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <button className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }}
        onClick={() => { update((d) => ({ ...d, settings: { ...d.settings, navOrder: DEFAULT_NAV } })); toast("Przywrócono domyślny układ"); }}>
        <RotateCcw size={15} /> Przywróć domyślny układ
      </button>
    </div>
  );
}

function ThemePicker({ open, onClose, current, onPick }) {
  return (
    <Sheet open={open} onClose={onClose} title="Wybierz motyw">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {THEMES.map((t) => (
          <button key={t.id} onClick={() => { onPick(t.id); onClose(); }}
            style={{ background: t.bg, border: `2px solid ${current === t.id ? t.accent : "var(--line)"}`, borderRadius: 18, padding: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
            <div style={{ background: t.surface, borderRadius: 12, padding: 10, marginBottom: 10 }}>
              <div style={{ height: 8, width: "60%", borderRadius: 4, background: t.text, opacity: .85, marginBottom: 7 }} />
              <div style={{ display: "flex", gap: 5 }}>
                {[t.accent, t.info, t.neg, t.violet].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 5, background: c }} />)}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: t.text, fontWeight: 800, fontSize: 13.5 }}>{t.label}</span>
              {current === t.id && <Check size={15} style={{ color: t.accent }} />}
            </div>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

export default function App() {
  const [phase, setPhase] = useState("loading");
  const [authTheme, setAuthTheme] = useState(() => (loadLocalTheme() === "light" ? "light" : "dark"));
  const [verifiedSplash, setVerifiedSplash] = useState(false);
  const [recoverySheet, setRecoverySheet] = useState(false);
  const [rp1, setRp1] = useState(""); const [rp2, setRp2] = useState("");
  const [rpErr, setRpErr] = useState(""); const [rpBusy, setRpBusy] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);
  const enteredRef = useRef(null);
  const awaitingVerifyRef = useRef(false);
  const awaitingResetRef = useRef(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [view, setView] = useState("dashboard");
  const [settingsSub, setSettingsSub] = useState(null);
  const [txForm, setTxForm] = useState(null);       // null | {} | tx
  const [quickAdd, setQuickAdd] = useState(false);
  const [openRefuel, setOpenRefuel] = useState(false);
  const [toastState, setToastState] = useState(null); // {msg, action, onAction}
  const [navHidden, setNavHidden] = useState(false);
  const navHiddenRef = useRef(false);
  useEffect(() => { navHiddenRef.current = navHidden; }, [navHidden]);
  const [conf, setConf] = useState(null);
  const toastTimer = useRef(null);
  const isDesktop = useMedia("(min-width: 1024px)");
  const user = sessionUser ? {
    id: sessionUser.id,
    login: sessionUser.email,
    name: data?.profile?.name || sessionUser.user_metadata?.display_name || sessionUser.email.split("@")[0],
    avatarColor: data?.profile?.avatarColor || AVATAR_COLORS[1],
  } : null;

  /* toast helper */
  const toast = useCallback((msg, action, onAction) => {
    clearTimeout(toastTimer.current);
    setToastState({ msg, action, onAction });
    toastTimer.current = setTimeout(() => setToastState(null), 4500);
  }, []);

  /* confirm helper */
  const confirmCb = useRef(null);
  const confirm = useCallback((cfg, onYes) => { confirmCb.current = onYes; setConf(cfg); }, []);
  const confirmDone = (yes) => { setConf(null); if (yes && confirmCb.current) confirmCb.current(); confirmCb.current = null; };

  /* mobile: iOS potrafi zostawić przewijanie "wyciągnięte" poza początek/koniec listy.
     Nie walczymy z natywnym sprężynowaniem (ono samo animuje powrót) — interweniujemy
     WYŁĄCZNIE, gdy pozycja jest poza zakresem i zamrożona (nie zmienia się), a palec
     nie dotyka ekranu. Wtedy dociągamy własną animacją o stałym tempie. */
  useEffect(() => {
    if (isDesktop) return;
    const el = document.querySelector(".app-scroll");
    if (!el) return;
    let touching = false, lastY = null, animRaf = null;
    const cancelAnim = () => { if (animRaf) { cancelAnimationFrame(animRaf); animRaf = null; } };
    const animateTo = (target) => {
      cancelAnim();
      const from = el.scrollTop;
      const dist = target - from;
      const dur = 280;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.scrollTop = from + dist * ease;
        if (p < 1) animRaf = requestAnimationFrame(step);
        else animRaf = null;
      };
      animRaf = requestAnimationFrame(step);
    };
    const onStart = () => { touching = true; lastY = null; cancelAnim(); };
    const onEnd = () => { touching = false; lastY = null; };
    const tick = () => {
      if (touching || animRaf) return;
      const max = Math.max(0, el.scrollHeight - el.clientHeight);
      const y = el.scrollTop;
      const target = y < -1 ? 0 : y > max + 1 ? max : null;
      if (target === null) { lastY = null; return; }
      // poza zakresem: jeśli DWA odczyty z rzędu identyczne => natywna animacja nie wróciła, utknęło
      if (lastY !== null && Math.abs(lastY - y) < 1) { lastY = null; animateTo(target); }
      else lastY = y;
    };
    const iv = setInterval(tick, 160);
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      clearInterval(iv); cancelAnim();
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [phase, isDesktop, view]);

  /* mobile: chowaj navbar przy scrollu w dół, pokazuj przy scrollu w górę */
  useEffect(() => {
    if (phase !== "app" || isDesktop) { setNavHidden(false); return; }
    const el = document.querySelector(".app-scroll");
    if (!el) return;
    let last = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - last;
      if (y < 60) setNavHidden(false);
      else if (dy > 8) setNavHidden(true);
      else if (dy < -12) setNavHidden(false);
      last = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [phase, isDesktop, view]);

  /* auto-logout po 1h nieaktywności (chyba że użytkownik wybrał "30 dni") */
  useEffect(() => {
    if (phase !== "app") return;
    const HOUR = 60 * 60 * 1000;
    const keep = () => { try { return localStorage.getItem(KEEP_LS_KEY) === "1"; } catch { return false; } };
    const touchAct = () => { try { localStorage.setItem(LASTACT_LS_KEY, String(Date.now())); } catch {} };
    let lastWrite = 0;
    const onAct = () => { const n = Date.now(); if (n - lastWrite > 20000) { lastWrite = n; touchAct(); } };
    const check = () => {
      if (keep()) return;
      let last = 0;
      try { last = Number(localStorage.getItem(LASTACT_LS_KEY) || 0); } catch {}
      if (last && Date.now() - last > HOUR) {
        toast("Wylogowano po godzinie nieaktywności");
        logout();
      }
    };
    touchAct();
    check();
    const iv = setInterval(check, 60 * 1000);
    window.addEventListener("pointerdown", onAct, { passive: true });
    window.addEventListener("keydown", onAct);
    const scroller = document.querySelector(".app-scroll");
    if (scroller) scroller.addEventListener("scroll", onAct, { passive: true });
    return () => {
      clearInterval(iv);
      window.removeEventListener("pointerdown", onAct);
      window.removeEventListener("keydown", onAct);
      if (scroller) scroller.removeEventListener("scroll", onAct);
    };
  }, [phase]); // eslint-disable-line

  /* iOS Safari: keep bottom UI above the floating address bar.
     Instead of guessing from viewport math, measure the nav's real position vs the
     visible viewport bottom and lift it by exactly the covered amount (self-correcting). */
  const navRef = useRef(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let raf = null, pending = null, pendTimer = null;
    const upd = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const nav = navRef.current;
        if (!nav) { document.documentElement.style.setProperty("--vv-off", "0px"); return; }
        if (navHiddenRef.current) return; // nie mierz schowanego navbara
        const ae = document.activeElement;
        if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return; // trwa pisanie — nie ruszaj
        // klawiatura otwarta lub w trakcie animacji => viewport kłamie, nie mierz
        if (vv.height < window.innerHeight - 120) { pending = null; return; }
        const visualBottom = vv.offsetTop + vv.height;
        const rect = nav.getBoundingClientRect();
        const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vv-off")) || 0;
        let next = cur + Math.round(rect.bottom - visualBottom);
        next = Math.max(0, next);
        if (next > 170) next = 0;
        if (Math.abs(next - cur) <= 2) { pending = null; return; }
        // zatwierdź dopiero, gdy DWA pomiary z rzędu dają to samo
        // (odfiltrowuje klatki złapane w połowie animacji navbara/klawiatury)
        if (pending !== null && Math.abs(pending - next) <= 2) {
          pending = null;
          document.documentElement.style.setProperty("--vv-off", next + "px");
        } else {
          pending = next;
          clearTimeout(pendTimer);
          pendTimer = setTimeout(upd, 150);
        }
      });
    };
    const updSoon = () => setTimeout(upd, 420); // po zamknięciu klawiatury, po animacji
    upd();
    const t1 = setTimeout(upd, 250);
    const t2 = setTimeout(upd, 900);
    vv.addEventListener("resize", upd);
    window.addEventListener("orientationchange", upd);
    window.addEventListener("focusout", updSoon);
    const navEl = navRef.current;
    if (navEl) navEl.addEventListener("transitionend", upd);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(pendTimer);
      if (raf) cancelAnimationFrame(raf);
      vv.removeEventListener("resize", upd);
      window.removeEventListener("orientationchange", upd);
      window.removeEventListener("focusout", updSoon);
      if (navEl) navEl.removeEventListener("transitionend", upd);
    };
  }, [phase, isDesktop]);

  /* iOS: after the keyboard closes, Safari can leave the visual viewport shifted —
     snap it back so pages always start exactly at the top */
  useEffect(() => {
    const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    const reset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    const isMobileEnv = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
    const onFocusOut = () => setTimeout(() => {
      if (!isMobileEnv) return; // desktop: nigdy nie resetuj scrolla po blur pola
      const vvOff = window.visualViewport ? window.visualViewport.offsetTop : 0;
      if (!isField(document.activeElement) && vvOff > 0) reset();
    }, 80);
    window.addEventListener("focusout", onFocusOut);
    /* UWAGA: NIE resetujemy scrolla na visualViewport "resize" — ten event odpala się
       na iOS przy każdym zwijaniu paska adresu i przy overscrollu, przez co strona
       "wracała do góry", nagłówek Historii wyglądał jakby nie trzymał (sticky),
       a dół tracił przezroczystość. Zamknięcie klawiatury łapie już focusout. */
    return () => {
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  /* iOS: NIE używamy viewport-fit=cover — dzięki temu treść nie wchodzi pod
     paski Safari, a Safari maluje górę/dół kolorem motywu (theme-color).
     To eliminuje szary pasek u góry i białą poświatę na dole (jak panektest.lol). */
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }
    const content = (meta.getAttribute("content") || "width=device-width, initial-scale=1")
      .replace(/,?\s*viewport-fit\s*=\s*cover/gi, "");
    meta.setAttribute("content", content);
  }, []);
  useEffect(() => {
    const id = (phase === "app" ? data?.settings?.theme : authTheme) || "dark";
    const t = THEMES.find((x) => x.id === id) || THEMES[0];
    /* theme-color = tło aktywnego motywu (jak revolut.com: theme-color #fff).
       Bez tego Safari sam PRÓBKUJE tło i przy przełączaniu kart maluje dolny pasek
       na biało (gubi „przezroczystość"). Deterministyczny theme-color = ten sam kolor
       co strona → pasek wraca spójny, jak na normalnych stronach. Glow i tak zabija
       near-white bg (nie brak theme-color), więc można go tu bezpiecznie ustawić.
       Trzymamy dokładnie JEDEN meta theme-color sterowany stąd. */
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const tcMeta = document.createElement("meta");
    tcMeta.setAttribute("name", "theme-color");
    tcMeta.setAttribute("content", t.bg);
    document.head.appendChild(tcMeta);
    document.documentElement.style.colorScheme = t.scheme;
    document.documentElement.style.background = t.bg;
    document.body.style.background = t.bg;
  }, [phase, data?.settings?.theme, authTheme]);

  /* boot: restore session + react to auth events (also fired cross-tab,
     e.g. when the e-mail confirmation link logs in from another tab) */
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && CAME_FROM_RECOVERY) setRecoverySheet(true);
      if (event === "SIGNED_IN" && session?.user) enterApp(session.user, { viaEvent: true });
    });
    (async () => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const su = s?.session?.user;
        if (su) {
          let expired = false;
          try {
            const keep = localStorage.getItem(KEEP_LS_KEY) === "1";
            const last = Number(localStorage.getItem(LASTACT_LS_KEY) || 0);
            expired = !keep && last > 0 && Date.now() - last > 60 * 60 * 1000;
          } catch {}
          if (expired) {
            try { await supabase.auth.signOut(); } catch {}
            setPhase("auth");
          } else await enterApp(su);
        } else setPhase("auth");
      } catch (e) {
        console.error(e);
        setPhase("auth");
      }
    })();
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line

  async function enterApp(su, opts = {}) {
    if (enteredRef.current === su.id) return; // auth event + manual call — run once
    enteredRef.current = su.id;
    setSessionUser(su);
    setUserId(su.id);
    await loadUserData(su);
    navStackRef.current = [];
    setView("dashboard"); setSettingsSub(null);
    setPhase("app");
    if (CAME_FROM_RECOVERY) {
      setRecoverySheet(true);
    } else if (CAME_FROM_EMAIL_LINK) {
      setVerifiedSplash(true);
    } else if (opts.viaEvent && awaitingVerifyRef.current) {
      // pokazuj tylko przy PIERWSZEJ weryfikacji konta (ta karta czekała po rejestracji)
      awaitingVerifyRef.current = false;
      setTimeout(() => toast("✅ E-mail potwierdzony — zalogowano automatycznie"), 350);
    } else if (opts.viaEvent && awaitingResetRef.current) {
      awaitingResetRef.current = false;
      setTimeout(() => toast("✅ Hasło zmienione w drugiej karcie — zalogowano"), 350);
    }
    requestAnimationFrame(() => {
      scrollTopAll();
      setTimeout(() => window.dispatchEvent(new Event("resize")), 120);
    });
  }

  async function loadUserData(su) {
    let d = null;
    try {
      d = await dbLoad(su.id);
    } catch (e) {
      console.error("dbLoad", e);
      setTimeout(() => toast("Nie udało się pobrać danych z bazy — sprawdź połączenie"), 400);
    }
    if (!d) d = emptyData();
    d = { ...emptyData(), ...d, settings: { ...emptyData().settings, ...(d.settings || {}), rates: { ...DEFAULT_RATES, ...(d.settings?.rates || {}) } } };
    // migrate old flat budgets ({catId: limit}) to per-month ({YYYY-MM: {catId: limit}})
    if (d.budgets && Object.values(d.budgets).some((v) => typeof v === "number")) {
      const nowD = new Date();
      const curYM = `${nowD.getFullYear()}-${String(nowD.getMonth() + 1).padStart(2, "0")}`;
      d = { ...d, budgets: { [curYM]: d.budgets } };
    }
    // profile lives in DB data; theme is device-local
    d.profile = {
      name: su.user_metadata?.display_name || su.email.split("@")[0],
      avatarColor: AVATAR_COLORS[1],
      ...(d.profile || {}),
    };
    if (!d.profile.createdAt) {
      d.profile = { ...d.profile, createdAt: (su.created_at || "").slice(0, 10) || todayISO() };
    }
    const localTheme = loadLocalTheme();
    if (localTheme && THEMES.some((t) => t.id === localTheme)) {
      d = { ...d, settings: { ...d.settings, theme: localTheme } };
    }
    // nawigacja: jeśli baza zwróciła układ domyślny, a lokalnie mamy własny — przywróć lokalny
    try {
      const rawNav = localStorage.getItem(NAV_LS_KEY);
      if (rawNav) {
        const localNav = JSON.parse(rawNav);
        const dbIsDefault = !d.settings.navOrder ||
          JSON.stringify(normalizeNav(d.settings.navOrder)) === JSON.stringify(normalizeNav(DEFAULT_NAV));
        if (Array.isArray(localNav) && localNav.length && dbIsDefault) {
          d = { ...d, settings: { ...d.settings, navOrder: localNav } };
        }
      }
    } catch {}
    const generated = generateRecurringTx(d);
    if (generated.length) d = { ...d, transactions: [...d.transactions, ...generated] };
    setData(d);
    if (generated.length) setTimeout(() => toast(`Wygenerowano ${generated.length} ${generated.length === 1 ? "płatność cykliczną" : "płatności cyklicznych"}`), 400);
  }

  /* persist data (debounced) */
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!data || !userId) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      dbSave(userId, data).catch((e) => {
        console.error("dbSave", e);
        toast("Błąd zapisu do bazy — zmiany mogą nie zostać zachowane");
      });
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [data, userId]);

  const update = useCallback((fn) => setData((d) => fn(d)), []);

  /* theme is the only thing kept on-device */
  useEffect(() => {
    if (data?.settings?.theme) saveLocalTheme(data.settings.theme);
  }, [data?.settings?.theme]);

  /* układ nawigacji: zapis w bazie + lustrzana kopia lokalna (odporność na utratę) */
  useEffect(() => {
    const n = data?.settings?.navOrder;
    if (Array.isArray(n) && n.length) {
      try { localStorage.setItem(NAV_LS_KEY, JSON.stringify(n)); } catch {}
    }
  }, [data?.settings?.navOrder]);

  const logout = async () => {
    try { if (data && userId) await dbSave(userId, data); } catch {}
    try { await supabase.auth.signOut(); } catch {}
    enteredRef.current = null;
    setSessionUser(null); setUserId(null); setData(null); setPhase("auth");
    requestAnimationFrame(() => scrollTopAll());
  };
  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;
    } catch (e) {
      console.error("delete_user rpc", e);
      try { await supabase.from("user_data").delete().eq("user_id", userId); } catch {}
      toast("Dane usunięte. Pełne usunięcie konta może wymagać funkcji delete_user w bazie.");
    }
    try { await supabase.auth.signOut(); } catch {}
    enteredRef.current = null;
    setSessionUser(null); setUserId(null); setData(null); setPhase("auth");
    requestAnimationFrame(() => scrollTopAll());
  };
  const updateUser = (patch) => {
    update((d) => ({ ...d, profile: { ...(d.profile || {}), ...patch } }));
  };

  /* currency helpers */
  const helpers = useMemo(() => {
    if (!data) return null;
    const rates = data.settings.rates, main = data.settings.mainCurrency;
    return {
      main,
      toMain: (amount, cur) => amount * ((rates[cur] || 1) / (rates[main] || 1)),
    };
  }, [data]);

  /* transactions ops */
  const saveTx = (tx, recurringCfg, opts) => {
    update((d) => {
      let next = { ...d };
      const exists = d.transactions.some((t) => t.id === tx.id);
      next.transactions = exists ? d.transactions.map((t) => (t.id === tx.id ? tx : t)) : [...d.transactions, tx];
      if (recurringCfg) {
        const recId = uid();
        next.recurring = [...d.recurring, { id: recId, name: tx.name, amount: tx.amount, currency: tx.currency, categoryId: tx.categoryId, type: tx.type, day: recurringCfg.day, startDate: tx.date, paused: false }];
      }
      if (opts?.startCycle) {
        const set = new Set([...(d.cycles || []), opts.cycleDate || tx.date]);
        next.cycles = [...set].sort();
      }
      return next;
    });
    setTxForm(null);
    toast(opts?.startCycle
      ? "Wypłata zapisana · rozpoczęto nowy okres rozliczeniowy"
      : recurringCfg ? "Transakcja dodana + płatność cykliczna utworzona" : "Transakcja zapisana");
  };
  const deleteTx = (tx) => {
    const linkedRefuel = tx.refuelId ? data.refuels.find((r) => r.id === tx.refuelId) : null;
    update((d) => ({
      ...d,
      transactions: d.transactions.filter((t) => t.id !== tx.id),
      refuels: linkedRefuel ? d.refuels.filter((r) => r.id !== tx.refuelId) : d.refuels,
    }));
    toast(linkedRefuel ? "Transakcja i tankowanie usunięte" : "Transakcja usunięta", "Cofnij", () =>
      update((d) => ({ ...d, transactions: [...d.transactions, tx], refuels: linkedRefuel ? [...d.refuels, linkedRefuel] : d.refuels })));
  };

  const navStackRef = useRef([]);
  const go = (v) => {
    setView((cur) => {
      if (cur !== v) {
        navStackRef.current.push(cur);
        if (navStackRef.current.length > 25) navStackRef.current.shift();
      }
      return v;
    });
    setProfileDirect(false);
    setSettingsSub(null);
    scrollTopAll();
  };
  const periodMonthLabel = useMemo(() => {
    if (!data) return "";
    const per = getPeriod(data);
    const d = per ? new Date(per.from) : new Date();
    return MONTHS_FULL[d.getMonth()];
  }, [data]);
  const goBack = () => {
    const prev = navStackRef.current.pop();
    if (prev) {
      setView(prev);
      setSettingsSub(null);
      scrollTopAll();
    } else {
      setView("dashboard");
      setSettingsSub(null);
      scrollTopAll();
    }
  };
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { if (!drawer) return; lockScroll(); return unlockScroll; }, [drawer]);
  const [profileDirect, setProfileDirect] = useState(false);
  useEffect(() => { if (!settingsSub) setProfileDirect(false); }, [settingsSub, view]);
  const openProfile = () => {
    setProfileDirect(true);
    setView((cur) => {
      if (cur !== "settings") navStackRef.current.push(cur);
      return "settings";
    });
    setSettingsSub("profile");
    scrollTopAll();
  };

  /* keyboard shortcut Ctrl+K → new transaction */
  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && phase === "app") { e.preventDefault(); setTxForm({}); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [phase]);

  if (phase === "loading") {
    return (
      <div className="fin-root" data-theme="dark">
        <style>{CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontWeight: 700 }}>Wczytywanie…</div>
      </div>
    );
  }

  if (phase === "auth") {
    return (
      <div className="fin-root" data-theme={authTheme}>
        <style>{CSS}</style>
        <button className="theme-toggle no-print" aria-label="Przełącz motyw jasny/ciemny" onClick={() => {
          const next = authTheme === "light" ? "dark" : "light";
          setAuthTheme(next);
          saveLocalTheme(next);
        }}>
          {authTheme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <div className="app-scroll">
          <Auth onAuthed={enterApp} onAwaitingVerify={() => { awaitingVerifyRef.current = true; }} onAwaitingReset={() => { awaitingResetRef.current = true; }} />
        </div>
      </div>
    );
  }

  const theme = THEMES.some((t) => t.id === data.settings.theme) ? data.settings.theme : "dark";
  const navOrder = normalizeNav(data.settings.navOrder).filter((id) => NAV_META[id]);
  const content = (() => {
    switch (view) {
      case "dashboard": return <Dashboard data={data} helpers={helpers} go={go} update={update} toast={toast} userEmail={user?.login} onAdd={() => setTxForm(true)} onEditTx={(t) => setTxForm(t)} onDeleteTx={deleteTx} />;
      case "history": return <History data={data} helpers={helpers} onEditTx={(t) => setTxForm(t)} onDeleteTx={deleteTx} />;
      case "stats": return <Stats data={data} helpers={helpers} go={go} update={update} toast={toast} />;
      case "reports": return <Reports data={data} helpers={helpers} go={go} toast={toast} confirm={confirm} update={update} />;
      case "fuel": return <Fuel_ data={data} helpers={helpers} update={update} toast={toast} confirm={confirm} openRefuel={openRefuel} setOpenRefuel={setOpenRefuel} />;
      case "goals": return <Goals data={data} helpers={helpers} update={update} toast={toast} confirm={confirm} />;
      case "budgets": return <Budgets data={data} helpers={helpers} update={update} toast={toast} confirm={confirm} />;
      case "summary": return <Summary data={data} helpers={helpers} />;
      case "more": return <More go={go} data={data} />;
      case "settings": return <Settings_ data={data} user={user} update={update} updateUser={updateUser} go={go} toast={toast} confirm={confirm} onLogout={logout} onDeleteAccount={deleteAccount} sub={settingsSub} setSub={setSettingsSub} />;
      default: return null;
    }
  })();

  const barIds = navOrder.slice(0, 4);
  const mobileTabs = [
    { id: barIds[0] }, { id: barIds[1] }, { id: "__add" }, { id: barIds[2] }, { id: barIds[3] },
  ].filter((t) => t.id);
  const activeTab = barIds.includes(view) ? view : (barIds.includes("more") && !barIds.includes(view) ? "more" : null);

  return (
    <div className={`fin-root ${data.settings.hideBalance ? "incognito" : ""}`} data-theme={theme} data-nav-hidden={navHidden && !isDesktop ? "1" : "0"}>
      <style>{CSS}</style>
      <div className="app-scroll">
      <div style={{ display: "flex" }}>
        {isDesktop && (
          <aside className="sidebar no-print">
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 14px 16px" }}>
              <div className="icon-badge" style={{ width: 48, height: 48, borderRadius: 15, background: "var(--grad-accent)", color: "var(--on-accent)", boxShadow: "0 8px 20px color-mix(in srgb, var(--accent) 32%, transparent)" }}><Wallet size={25} /></div>
              <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", fontFamily: "'Space Grotesk', sans-serif" }}>Sakwa</span>
            </div>
            <div style={{ height: 1, background: "var(--line)", margin: "0 12px 20px" }} />
            {navOrder.filter((id) => id !== "more").map((id) => {
              const m = NAV_META[id]; const I = m.icon;
              return (
                <button key={id} className={`nav-item ${view === id ? "on" : ""}`} onClick={() => go(id)}>
                  <I size={18} /> {m.label}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            {user && (
              <>
              <div style={{ height: 1, background: "var(--line)", margin: "14px 4px 12px" }} />
              <button className="nav-item side-profile" aria-label="Otwórz profil"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px" }}
                onClick={openProfile}>
                <div style={{ width: 34, height: 34, borderRadius: 12, background: user.avatarColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0, textAlign: "left" }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>@{user.login}</div>
                </div>
              </button>
              </>
            )}
          </aside>
        )}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 1600, margin: "0 auto", padding: isDesktop ? "26px 34px 48px" : "calc(max(env(safe-area-inset-top), 34px) + 10px) 16px calc(104px + max(env(safe-area-inset-bottom), 12px))" }}>
          {isDesktop && (
            <div className="topbar no-print">
              <div className="topbar-greet" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div className="icon-badge" style={{ width: 46, height: 46, borderRadius: 15, background: "var(--grad-accent)", color: "var(--on-accent)", boxShadow: "0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent)" }}>
                  <Wallet size={23} />
                </div>
                <div>
                  <div className="greet-n" style={{ fontSize: 24, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>Sakwa</div>
                  <div className="greet-k" style={{ fontSize: 12.5 }}>Twoje centrum finansów</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 12 }} />
              <div className="appbar-month">{periodMonthLabel}</div>
              <div style={{ flex: 1, minWidth: 12 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button className="btn btn-primary" onClick={() => setTxForm({})}><Plus size={16} /> Nowa transakcja</button>
                <button className="top-ic" style={{ width: 46, height: 46, borderRadius: 14 }} aria-label="Ustawienia" onClick={() => go("settings")}><SettingsIcon size={20} /></button>
                <button className="user-chip" onClick={openProfile}>
                  <span className="appbar-avatar" style={{ background: user?.avatarColor, width: 40, height: 40, fontSize: 15, borderRadius: 13 }}>{(user?.name || "?").charAt(0).toUpperCase()}</span>
                  <span style={{ textAlign: "left", minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 800, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</span>
                    <span style={{ display: "block", fontWeight: 600, fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.login}</span>
                  </span>
                </button>
              </div>
            </div>
          )}
          {!isDesktop && (
            <div className="appbar no-print">
              <button className="top-ic" aria-label="Otwórz menu" onClick={() => setDrawer(true)}>
                <Menu size={22} />
              </button>
              <button className={`top-ic ${view === "dashboard" ? "top-ic-on" : ""}`} aria-label="Pulpit" onClick={() => go("dashboard")}>
                <Home size={20} />
              </button>
              {view === "settings" && settingsSub && !(settingsSub === "profile" && profileDirect) ? (
                <div className="appbar-greet" style={{ display: "flex", alignItems: "center" }}>
                  <button className="top-ic" aria-label="Wróć" onClick={() => { setSettingsSub(null); scrollTopAll(); }}>
                    <ChevronLeft size={20} strokeWidth={2.4} />
                  </button>
                </div>
              ) : (
                <div className="appbar-greet" />
              )}
              <div className="appbar-month">{periodMonthLabel}</div>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="top-ic" aria-label="Ustawienia" onClick={() => go("settings")}>
                  <SettingsIcon size={19} />
                </button>
                <button className="appbar-avatar" aria-label="Otwórz profil"
                  style={{ background: user?.avatarColor, width: 44, height: 44, fontSize: 17, borderRadius: 14 }}
                  onClick={openProfile}>
                  {(user?.name || "?").charAt(0).toUpperCase()}
                </button>
              </div>
            </div>
          )}
          {content}
        </main>
      </div>
      </div>

      {!isDesktop && (
        <>
          <div className={`drawer-overlay no-print ${drawer ? "open" : ""}`} onClick={() => setDrawer(false)} />
          <aside className={`drawer no-print ${drawer ? "open" : ""}`} aria-hidden={!drawer}>
            <div className="drawer-head">
              <div className="icon-badge" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--grad-accent)", color: "var(--on-accent)", flexShrink: 0 }}><Wallet size={22} /></div>
              <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", fontFamily: "'Space Grotesk', sans-serif" }}>Sakwa</div>
            </div>
            <button className="btn btn-primary" style={{ margin: "0 14px 14px" }} onClick={() => { setDrawer(false); setTxForm({}); }}>
              <Plus size={16} /> Nowa transakcja
            </button>
            <div className="drawer-list">
              {normalizeNav(data.settings.navOrder).filter((id) => id !== "more").map((id) => {
                const m = NAV_META[id];
                if (!m) return null;
                const I = m.icon;
                return (
                  <button key={id} className={`drawer-item ${view === id ? "on" : ""}`} onClick={() => { setDrawer(false); go(id); }}>
                    <I size={19} /> {m.label}
                  </button>
                );
              })}
            </div>
            <button className="drawer-foot" onClick={() => { setDrawer(false); openProfile(); }}>
              <span className="appbar-avatar" style={{ background: user?.avatarColor, width: 42, height: 42, fontSize: 16, borderRadius: 13 }}>{(user?.name || "?").charAt(0).toUpperCase()}</span>
              <span style={{ minWidth: 0, textAlign: "left" }}>
                <span style={{ display: "block", fontWeight: 800, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.login}</span>
              </span>
              <ChevronRight size={17} style={{ color: "var(--muted)", marginLeft: "auto", flexShrink: 0 }} />
            </button>
          </aside>
          <button className="fab no-print" aria-label="Dodaj transakcję" onClick={() => setTxForm({})}>
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </>
      )}

      <Sheet open={quickAdd} onClose={() => setQuickAdd(false)} title="Co chcesz dodać?">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: Wallet, label: "Transakcja", desc: "Wydatek lub przychód", color: "var(--accent)", act: () => { setQuickAdd(false); setTxForm({}); } },
            { icon: Fuel, label: "Tankowanie", desc: "Paliwo do samochodu", color: "#F97316", act: () => { setQuickAdd(false); go("fuel"); setOpenRefuel(true); } },
            { icon: Target, label: "Wpłata na cel", desc: "Odłóż na oszczędności", color: "var(--violet)", act: () => { setQuickAdd(false); go("goals"); } },
          ].map((o) => (
            <button key={o.label} className="card row-press" onClick={o.act}
              style={{ padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "inherit", color: "var(--text)", textAlign: "left", width: "100%" }}>
              <div className="icon-badge" style={{ background: "var(--surface2)", color: o.color }}><o.icon size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{o.label}</div>
                <div style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 600 }}>{o.desc}</div>
              </div>
              <ChevronRight size={17} style={{ color: "var(--muted)" }} />
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={!!txForm} onClose={() => setTxForm(null)} title={txForm?.id ? "Edytuj transakcję" : "Nowa transakcja"}>
        {txForm && (
          <>
            <TransactionForm data={data} initial={txForm.id ? txForm : null} onSave={saveTx} onClose={() => setTxForm(null)} />
            {txForm.id && (
              <button className="btn btn-danger" style={{ width: "100%", marginTop: 12 }}
                onClick={() => { const t = txForm; setTxForm(null); deleteTx(t); }}>
                <Trash2 size={15} /> Usuń transakcję
              </button>
            )}
          </>
        )}
      </Sheet>

      <ToTopButton />

      <Sheet open={recoverySheet} onClose={() => setRecoverySheet(false)} title="Ustaw nowe hasło">
        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
          Kliknięto link resetujący — wpisz nowe hasło do konta. Min. 8 znaków, w tym mała i wielka litera oraz cyfra.
        </p>
        <Field label="Nowe hasło" error={rpErr}>
          <PasswordInput error={rpErr} autoComplete="new-password" value={rp1} autoFocus={AUTOF}
            onChange={(e) => { setRp1(e.target.value); setRpErr(""); }} />
        </Field>
        <Field label="Powtórz hasło">
          <PasswordInput autoComplete="new-password" value={rp2}
            onChange={(e) => { setRp2(e.target.value); setRpErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("rp-save")?.click()} />
        </Field>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setRecoverySheet(false)}>Później</button>
          <button id="rp-save" className="btn btn-primary" style={{ flex: 2 }} disabled={rpBusy} onClick={async () => {
            const issues = passwordProblems(rp1);
            if (issues.length) return setRpErr("Hasło nie spełnia wymagań: " + issues.join(", ") + ".");
            if (rp1 !== rp2) return setRpErr("Hasła różnią się od siebie.");
            setRpBusy(true);
            try {
              const { error } = await supabase.auth.updateUser({ password: rp1 });
              if (error) throw error;
              setRecoverySheet(false); setRp1(""); setRp2("");
              setRecoveryDone(true);
            } catch (e) { setRpErr(authErrPl(e)); }
            finally { setRpBusy(false); }
          }}>{rpBusy ? "Zapisuję…" : "Zapisz nowe hasło"}</button>
        </div>
      </Sheet>

      {recoveryDone && (
        <>
          <div className="overlay no-print" style={{ zIndex: 1200 }} />
          <div className="card no-print fade-in" style={{ position: "fixed", zIndex: 1210, left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(400px, calc(100vw - 32px))", padding: "34px 26px", textAlign: "center" }}>
            <div className="icon-badge" style={{ width: 64, height: 64, borderRadius: 22, background: "var(--accent-dim)", color: "var(--accent)", margin: "0 auto 16px" }}>
              <Check size={32} strokeWidth={3} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>Hasło zmienione!</div>
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Zatwierdzono nowe hasło. Karta, z której rozpocząłeś reset, została automatycznie zalogowana —
              możesz do niej wrócić i zamknąć tę.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => {
                window.close();
                setTimeout(() => toast("Zamknij tę kartę ręcznie i wróć do poprzedniej"), 300);
              }}>Zamknij kartę</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setRecoveryDone(false)}>Zostań tutaj</button>
            </div>
          </div>
        </>
      )}

      {verifiedSplash && (
        <>
          <div className="overlay no-print" style={{ zIndex: 1200 }} />
          <div className="card no-print fade-in" style={{ position: "fixed", zIndex: 1210, left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(400px, calc(100vw - 32px))", padding: "34px 26px", textAlign: "center" }}>
            <div className="icon-badge" style={{ width: 64, height: 64, borderRadius: 22, background: "var(--accent-dim)", color: "var(--accent)", margin: "0 auto 16px" }}>
              <Check size={32} strokeWidth={3} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>E-mail potwierdzony!</div>
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Twoje konto jest aktywne i zostałeś zalogowany. Jeśli rejestrowałeś się w innej karcie tej przeglądarki —
              tamta karta również właśnie się zalogowała, więc tę możesz spokojnie zamknąć.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => {
                window.close();
                setTimeout(() => toast("Przeglądarka nie pozwala zamknąć tej karty automatycznie — zamknij ją ręcznie"), 300);
              }}>Zamknij kartę</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setVerifiedSplash(false)}>Przejdź do aplikacji</button>
            </div>
          </div>
        </>
      )}

      <Confirm conf={conf} onDone={confirmDone} />

      {toastState && (
        <div className="toast no-print" role="status">
          <span>{toastState.msg}</span>
          {toastState.action && (
            <button onClick={() => { toastState.onAction?.(); setToastState(null); }}>{toastState.action}</button>
          )}
        </div>
      )}
    </div>
  );
}