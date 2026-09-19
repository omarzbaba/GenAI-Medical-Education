/*
 * First-party analytics.
 *
 * Logs page_events to Firestore: view (auto-fired), copy, search, favorite,
 * unfavorite, note_saved, vote, comment. Admin-only read. No third parties.
 *
 * Writing this collection is ordinary product analytics, not "research data"
 * collection on its own — see firebase/firestore.rules for the same note.
 *
 * Lazy-loads Firebase on first event. Skip via body.analytics-suppress.
 */

(function () {
  const STORAGE_KEY_SESSION = "companion_session_id";

  let firebaseReady = null;
  let queue = [];
  let lastViewPath = null;

  function uuid4() {
    const r = () => Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
    return r() + "-" + r() + "-" + r() + "-" + r();
  }

  function getOrCreateSessionId() {
    try {
      let id = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!id) {
        id = uuid4();
        localStorage.setItem(STORAGE_KEY_SESSION, id);
      }
      return id;
    } catch (_) {
      return uuid4();
    }
  }

  function trunc(s, n) { return String(s == null ? "" : s).slice(0, n); }

  function currentPath() {
    const path = window.location.pathname + window.location.hash;
    return trunc(path, 500);
  }

  async function loadFirebase() {
    const [{ initializeApp, getApps }, { initializeAppCheck, ReCaptchaV3Provider }, fs, cfg, authMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("./firebase-config.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js")
    ]);

    let app = getApps().find((a) => a.name === "analytics");
    if (!app) {
      app = initializeApp(cfg.firebaseConfig, "analytics");
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(cfg.appCheckSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      } catch (_) { /* token may already be init on default app — non-fatal */ }
    }
    const db = fs.getFirestore(app);
    return { db, fs, authMod };
  }

  async function track(type, payload) {
    if (document.body && document.body.classList.contains("analytics-suppress")) return;
    if (!type) return;

    const event = {
      type: type,
      session_id: getOrCreateSessionId(),
      path: currentPath(),
      referrer: trunc(document.referrer || "", 500),
      query: trunc((payload && payload.query) || "", 200).replace(/[\r\n\t]+/g, " "),
      prompt_path: trunc((payload && payload.prompt_path) || "", 300)
    };

    queue.push(event);

    if (!firebaseReady) firebaseReady = loadFirebase();
    try {
      const { db, fs, authMod } = await firebaseReady;
      const auth = authMod.getAuth();
      const uid = auth.currentUser ? auth.currentUser.uid : null;
      while (queue.length > 0) {
        const e = queue.shift();
        if (uid) e.uid = uid;
        try {
          await fs.addDoc(fs.collection(db, "page_events"), {
            timestamp: fs.serverTimestamp(),
            ...e
          });
        } catch (err) {
          console.warn("analytics write failed:", err && err.code);
          break;
        }
      }
    } catch (_) { /* Firebase init failed; ignore */ }
  }

  function autoTrackView() {
    const p = currentPath();
    if (p === lastViewPath) return;
    lastViewPath = p;
    track("view");
  }

  function boot() {
    autoTrackView();
    window.addEventListener("hashchange", autoTrackView);
  }

  window.analytics = {
    track: track,
    view: autoTrackView
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
