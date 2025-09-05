/**
 * Ukrainian Military Charity App - React Components
 * Fundraising progress tracker with modern UI
 */

const { useState, useEffect } = React;

// Configuration
const CONFIG = {
  TOTAL: 1_250_000,
  COMPANY: 206_747,
  REFRESH_MS: 60_000,
  WEB_APP_URL: "https://script.google.com/macros/s/AKfycbw-rLvfaXZFWKcWyTUhX7-xDoFrgV5WqYQboaF1h5W2rJ6rBY1dYkl0wiOWAyDIQSSrgQ/exec"
};

/**
 * JSONP utility for loading data from Google Apps Script
 */
function loadJSONP(url, params, callback) {
  return new Promise((resolve, reject) => {
    const cbName = `jsonp_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window[cbName] = (data) => {
      try { 
        callback && callback(data); 
        resolve(data); 
      }
      finally { 
        delete window[cbName]; 
        s.remove(); 
      }
    };
    const qp = new URLSearchParams({ ...params, callback: cbName }).toString();
    const s = document.createElement("script");
    s.src = `${url}?${qp}`;
    s.onerror = () => { 
      delete window[cbName]; 
      s.remove(); 
      reject(new Error("JSONP load error")); 
    };
    document.body.appendChild(s);
  });
}

/**
 * Utility functions
 */
const utils = {
  pct: (a, b) => (b > 0 ? (a / b) * 100 : 0),
  clamp: (x) => Math.max(0, Math.min(100, x)),
  fmtN: (n) => isNaN(n) ? "—" : Number(n).toLocaleString("uk-UA"),
  fmtP: (n) => (Math.round(n * 10) / 10).toFixed(1) + "%",
  parseNumberUA: (txt) => {
    if (!txt) return NaN;
    const s = String(txt);
    let out = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i], c = ch.charCodeAt(0);
      if (c >= 48 && c <= 57) out += ch;
      else if (ch === ",") out += ".";
    }
    const v = parseFloat(out);
    return Number.isFinite(v) ? v : NaN;
  }
};

/**
 * Loading skeleton component
 */
const LoadingSkeleton = () => (
  <div>
    <div className="loading-skeleton loading-text large"></div>
    <div className="loading-skeleton loading-text" style={{marginTop: 16}}></div>
    <div className="loading-skeleton loading-bar" style={{marginTop: 20}}></div>
    <div className="grid" style={{marginTop: 12}}>
      <div className="loading-skeleton loading-grid-item"></div>
      <div className="loading-skeleton loading-grid-item"></div>
      <div className="loading-skeleton loading-grid-item"></div>
    </div>
    <div style={{marginTop: 16}}>
      <div className="loading-skeleton loading-pill"></div>
      <div className="loading-skeleton loading-pill"></div>
      <div className="loading-skeleton loading-pill"></div>
    </div>
  </div>
);

/**
 * Progress bar component
 */
const TripleBar = ({ companyPct, peoplePct, matchPct }) => {
  const w1 = utils.clamp(companyPct);
  const w2 = utils.clamp(Math.min(100 - w1, peoplePct));
  const w3 = utils.clamp(Math.min(100 - w1 - w2, matchPct));
  
  return (
    <div className="bar">
      <div 
        className="seg1" 
        style={{left: 0, width: `${w1}%`}} 
        title="AltexSoft: 206 747 грн"
      ></div>
      <div 
        className="seg2" 
        style={{left: `${w1}%`, width: `${w2}%`}} 
        title="Донати людей (вклюно з дружніми банками)"
      ></div>
      <div 
        className="seg3" 
        style={{left: `${w1 + w2}%`, width: `${w3}%`}} 
        title="Подвоєння дружніх банок"
      ></div>
    </div>
  );
};

/**
 * Main application component
 */
function Posters() {
  const [peopleJar, setPeopleJar] = useState(0);
  const [friendsJar, setFriendsJar] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate derived values
  const newTarget = CONFIG.TOTAL - CONFIG.COMPANY;
  const safePeople = Math.max(0, Number(peopleJar) || 0);
  const safeFriends = Math.max(0, Math.min(Number(friendsJar) || 0, safePeople));
  const combined = CONFIG.COMPANY + safePeople;
  const projectedCombined = combined + safeFriends;
  const projectedCombinedPct = utils.pct(projectedCombined, CONFIG.TOTAL);
  const remainingOpen = Math.max(0, newTarget - safePeople);

  const companyPctOfTotal = utils.pct(CONFIG.COMPANY, CONFIG.TOTAL);
  const peoplePctOfTotal = utils.pct(safePeople, CONFIG.TOTAL);
  const matchPctOfTotal = utils.pct(safeFriends, CONFIG.TOTAL);

  /**
   * Fetch data from Google Apps Script
   */
  async function fetchAll() {
    setLoading(true); 
    setError("");
    try {
      const res = await loadJSONP(CONFIG.WEB_APP_URL, { cells: "B1,B2,B3" });
      if (!res || !res.ok) throw new Error(res && res.error || "No data");
      
      const { B1, B2, B3 } = res.data || {};
      const vPeople = utils.parseNumberUA(B2);
      const vFriends = utils.parseNumberUA(B1);
      
      if (!Number.isFinite(vPeople)) throw new Error(`B2 некоректне: "${B2}"`);
      if (!Number.isFinite(vFriends)) throw new Error(`B1 некоректне: "${B1}"`);
      
      setPeopleJar(vPeople);
      setFriendsJar(vFriends);
      setLastUpdated(String(B3 || "").trim());
    } catch (e) {
      setError(String(e && e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // Initialize and set up auto-refresh
  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, CONFIG.REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <header style={{marginBottom: 24}}>
        <h1 style={{ 
          fontWeight: 800, 
          letterSpacing: "-0.02em", 
          fontSize: "clamp(24px,3vw,36px)" 
        }}>
          Прогрес збору на {utils.fmtN(CONFIG.TOTAL)} грн
        </h1>
        <p className="muted" style={{marginTop: 6}}>
          Компанія вже покрила {utils.fmtN(CONFIG.COMPANY)} грн → відкрита частина {utils.fmtN(newTarget)} грн.
        </p>
        <div style={{display: "flex", gap: 8, marginTop: 12}}>
          <button className="btn" onClick={fetchAll} disabled={loading}>
            {loading ? "Оновлюю…" : "Оновити зараз"}
          </button>
        </div>
        {lastUpdated && (
          <div style={{marginTop: 8, fontSize: 12}} className="muted">
            Оновлено: {lastUpdated}
          </div>
        )}
        {error && (
          <div className="error" style={{marginTop: 8, fontSize: 12}}>
            {error}
          </div>
        )}
      </header>

      <section className="card">
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>
          Щоб запакувати екіпаж залишилось:
        </h2>
        <div style={{marginTop: 20}}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="muted" style={{fontSize: 14}}>До фінішу</div>
              <div style={{ 
                fontSize: "clamp(32px,6vw,48px)", 
                fontWeight: 900, 
                letterSpacing: "-0.02em" 
              }}>
                {utils.fmtN(remainingOpen)} грн
              </div>

              <div style={{marginTop: 16}}>
                <div className="muted" style={{fontSize: 14, marginBottom: 8}}>
                  Прогрес — {utils.fmtN(projectedCombined)} / {utils.fmtN(CONFIG.TOTAL)} • {utils.fmtP(projectedCombinedPct)}
                </div>
                <TripleBar
                  companyPct={companyPctOfTotal}
                  peoplePct={peoplePctOfTotal}
                  matchPct={matchPctOfTotal}
                />
                <div className="grid" style={{marginTop: 12, fontSize: 14}}>
                  <div>AltexSoft: {utils.fmtN(CONFIG.COMPANY)} грн</div>
                  <div>Донати людей (вклюно з дружніми банками): {utils.fmtN(safePeople)} грн</div>
                  <div>Подвоєння дружніх: {utils.fmtN(safeFriends)} грн</div>
                </div>
              </div>

              <div style={{marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap"}}>
                <span className="pill pill1">
                  AltexSoft: {utils.fmtN(CONFIG.COMPANY)} грн
                </span>
                <span className="pill pill2">
                  Донати людей (вклюно з дружніми банками): {utils.fmtN(safePeople)} грн
                </span>
                <span className="pill pill3">
                  Мікробанки: {utils.fmtN(safeFriends)} грн → +{utils.fmtN(safeFriends)} грн від AltexSoft*
                </span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Posters />);
