/*
 * Feedback widget — floating button + modal form on every public page.
 *
 * Submissions go to Firestore `feedback` (admin-only read). Firebase loads
 * lazily on first open. If the visitor is signed in (auth.js), their name/
 * email pre-fill; otherwise the fields are optional — anonymous is fine.
 *
 * All widget styling uses the site's own CSS custom properties (main.css),
 * not hardcoded colors, so it stays in sync with light/dark and any future
 * palette change.
 */

(function () {
  let modalOpen = false;
  let firebaseReady = null;
  let identityOverride = null;

  function getIdentity() {
    if (identityOverride) return identityOverride;
    try {
      if (window.__companionUser) {
        const u = window.__companionUser;
        return { name: u.display_name || "", email: u.email || "" };
      }
    } catch (_) {}
    return null;
  }

  function injectStyles() {
    if (document.getElementById("feedback-widget-styles")) return;
    const css = `
      .fbw-trigger {
        position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 9998;
        background: var(--accent-ink); color: var(--paper);
        border: none; border-radius: 999px; padding: 0.6rem 1.1rem;
        font: 500 var(--text-sm)/1 var(--sans);
        cursor: pointer; box-shadow: 0 4px 14px oklch(0% 0 0 / 0.2);
        transition: background var(--dur) var(--ease), transform var(--dur) var(--ease);
        display: inline-flex; align-items: center; gap: 0.4rem;
      }
      .fbw-trigger:hover, .fbw-trigger:focus-visible { background: var(--accent); transform: translateY(-1px); outline: none; }
      .fbw-trigger:focus-visible { box-shadow: 0 0 0 3px var(--accent-wash); }
      .fbw-trigger__icon { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; fill: none; }

      .fbw-backdrop {
        position: fixed; inset: 0; background: oklch(0% 0 0 / 0.5); z-index: 9999;
        display: flex; align-items: center; justify-content: center; padding: 1rem;
      }
      .fbw-modal {
        background: var(--paper-raised); border-radius: 8px; max-width: 520px; width: 100%;
        max-height: 90vh; overflow-y: auto; padding: 1.75rem;
        box-shadow: 0 20px 60px oklch(0% 0 0 / 0.25);
        font-family: var(--sans); color: var(--ink); position: relative;
      }
      .fbw-modal h3 { margin: 0 0 0.5rem; font-family: var(--serif); font-size: 1.6rem; color: var(--ink); }
      .fbw-modal p.fbw-lede { margin: 0 0 1.25rem; color: var(--ink-soft); font-size: var(--text-sm); line-height: 1.5; }
      .fbw-close {
        position: absolute; top: 0.75rem; right: 0.85rem; background: none; border: none;
        font-size: 1.5rem; line-height: 1; color: var(--ink-soft); cursor: pointer; padding: 0.25rem 0.5rem;
      }
      .fbw-close:hover { color: var(--ink); }

      .fbw-identity { font-size: var(--text-xs); color: var(--ink-soft); margin: 0 0 1rem; }
      .fbw-identity a { color: var(--accent-ink); text-decoration: underline; cursor: pointer; }

      .fbw-field { margin-bottom: 1rem; }
      .fbw-field label { display: block; font-size: var(--text-xs); font-weight: 600; margin-bottom: 0.3rem; color: var(--ink); }
      .fbw-field input, .fbw-field textarea {
        width: 100%; padding: 0.55rem 0.7rem; border: 1px solid var(--rule); border-radius: 6px;
        font: inherit; color: inherit; background: var(--paper); box-sizing: border-box;
      }
      .fbw-field input:focus, .fbw-field textarea:focus {
        outline: 2px solid var(--accent); outline-offset: -1px; border-color: var(--accent);
      }
      .fbw-field textarea { min-height: 120px; resize: vertical; }
      .fbw-field--inline { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      @media (max-width: 480px) { .fbw-field--inline { grid-template-columns: 1fr; } }

      .fbw-actions { display: flex; gap: 0.5rem; align-items: center; margin-top: 1.25rem; }
      .fbw-submit {
        background: var(--accent-ink); color: var(--paper); border: none; padding: 0.6rem 1.2rem;
        border-radius: 6px; font: 600 var(--text-sm)/1 inherit; cursor: pointer;
      }
      .fbw-submit:hover { background: var(--accent); }
      .fbw-submit:disabled { opacity: 0.6; cursor: wait; }
      .fbw-cancel {
        background: none; border: 1px solid var(--rule); color: var(--ink); padding: 0.6rem 1.2rem;
        border-radius: 6px; font: 500 var(--text-sm)/1 inherit; cursor: pointer;
      }
      .fbw-cancel:hover { background: var(--paper-sunken); }
      .fbw-status { margin-top: 1rem; padding: 0.6rem 0.85rem; border-radius: 6px; font-size: var(--text-sm); }
      .fbw-status--error { background: var(--warn-wash); color: var(--warn); }
      .fbw-status--success { background: var(--good-wash); color: var(--good); }
      .fbw-privacy { font-size: var(--text-xs); color: var(--ink-faint); margin-top: 1rem; line-height: 1.4; }

      body.fbw-suppress .fbw-trigger { display: none; }
    `;
    const style = document.createElement("style");
    style.id = "feedback-widget-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectTrigger() {
    if (document.getElementById("feedback-widget-trigger")) return;
    if (document.body.classList.contains("fbw-suppress")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "feedback-widget-trigger";
    btn.className = "fbw-trigger";
    btn.setAttribute("aria-label", "Open feedback form");
    btn.innerHTML =
      '<svg class="fbw-trigger__icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
      '</svg>Feedback';
    btn.addEventListener("click", openModal);
    document.body.appendChild(btn);
  }

  function openModal() {
    if (modalOpen) return;
    modalOpen = true;
    const id = getIdentity();

    const backdrop = document.createElement("div");
    backdrop.className = "fbw-backdrop";
    backdrop.id = "feedback-widget-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "fbw-title");

    const identityBlock = id
      ? '<p class="fbw-identity">Sending as <strong>' + esc(id.name || id.email) + '</strong> &mdash; <a id="fbw-change-identity">change</a></p>'
      : '';

    const fieldBlock = id
      ? ''
      : '<div class="fbw-field fbw-field--inline">' +
          '<div><label for="fbw-name">Your name (optional)</label><input type="text" id="fbw-name" maxlength="120" autocomplete="name"></div>' +
          '<div><label for="fbw-email">Email (optional, for reply)</label><input type="email" id="fbw-email" maxlength="254" autocomplete="email"></div>' +
        '</div>';

    backdrop.innerHTML =
      '<div class="fbw-modal">' +
        '<button type="button" class="fbw-close" id="fbw-close" aria-label="Close">&times;</button>' +
        '<h3 id="fbw-title">Send feedback</h3>' +
        '<p class="fbw-lede">Spotted a bug, want to suggest something, or have a question? This goes straight to the team.</p>' +
        identityBlock +
        '<form id="fbw-form" novalidate>' +
          fieldBlock +
          '<div class="fbw-field">' +
            '<label for="fbw-message">Your message <span style="color:var(--warn);">*</span></label>' +
            '<textarea id="fbw-message" required minlength="10" maxlength="3000" placeholder="What\'s on your mind? Bug reports get extra credit if you include the page you were on and what you expected."></textarea>' +
          '</div>' +
          '<div class="fbw-actions">' +
            '<button type="submit" class="fbw-submit" id="fbw-submit">Send</button>' +
            '<button type="button" class="fbw-cancel" id="fbw-cancel">Cancel</button>' +
          '</div>' +
          '<div id="fbw-status" role="status" aria-live="polite"></div>' +
        '</form>' +
        '<p class="fbw-privacy">Your message is stored privately for review. Name and email (if provided) are used only to reply.</p>' +
      '</div>';

    document.body.appendChild(backdrop);
    backdrop.querySelector("#fbw-close").addEventListener("click", closeModal);
    backdrop.querySelector("#fbw-cancel").addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
    document.addEventListener("keydown", escHandler);
    backdrop.querySelector("#fbw-form").addEventListener("submit", onSubmit);

    const changeLink = backdrop.querySelector("#fbw-change-identity");
    if (changeLink) {
      changeLink.addEventListener("click", (e) => {
        e.preventDefault();
        identityOverride = { name: "", email: "" };
        closeModal();
        openModal();
      });
    }

    setTimeout(() => {
      const focusTarget = backdrop.querySelector("#fbw-message");
      if (focusTarget) focusTarget.focus();
    }, 50);

    if (!firebaseReady) firebaseReady = loadFirebase();
  }

  function closeModal() {
    const bd = document.getElementById("feedback-widget-backdrop");
    if (bd) bd.remove();
    document.removeEventListener("keydown", escHandler);
    modalOpen = false;
    identityOverride = null;
  }

  function escHandler(e) { if (e.key === "Escape") closeModal(); }

  async function loadFirebase() {
    const [{ initializeApp, getApps }, { initializeAppCheck, ReCaptchaV3Provider }, fs, cfg] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("./firebase-config.js")
    ]);

    let app;
    const existing = getApps().find((a) => a.name === "feedback-widget");
    if (existing) {
      app = existing;
    } else {
      app = initializeApp(cfg.firebaseConfig, "feedback-widget");
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(cfg.appCheckSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      } catch (_) { /* App Check may already be init on default app; non-fatal */ }
    }
    const db = fs.getFirestore(app);
    return { db, fs };
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const statusEl = form.querySelector("#fbw-status");
    const submitBtn = form.querySelector("#fbw-submit");
    statusEl.textContent = "";
    statusEl.className = "";

    const message = (form.querySelector("#fbw-message").value || "").trim();
    if (message.length < 10) {
      showStatus(statusEl, "Please write at least a sentence (10+ characters).", "error");
      return;
    }

    const id = getIdentity();
    const nameField = form.querySelector("#fbw-name");
    const emailField = form.querySelector("#fbw-email");
    const submitter_name = id ? (id.name || "") : (nameField ? nameField.value.trim() : "");
    const submitter_email = id ? (id.email || "") : (emailField ? emailField.value.trim().toLowerCase() : "");

    if (submitter_email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(submitter_email)) {
      showStatus(statusEl, "That email doesn't look right. Leave blank to send anonymously.", "error");
      return;
    }

    submitBtn.disabled = true;
    const origLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    try {
      const { db, fs } = await firebaseReady;
      await fs.addDoc(fs.collection(db, "feedback"), {
        timestamp: fs.serverTimestamp(),
        status: "new",
        submitter_name: trunc(submitter_name, 120),
        submitter_email: trunc(submitter_email, 254),
        message: trunc(message, 3000),
        page_url: trunc(window.location.href, 500),
        referrer: trunc(document.referrer || "", 500),
        user_agent: trunc(navigator.userAgent || "", 500)
      });
      form.parentElement.innerHTML =
        '<button type="button" class="fbw-close" id="fbw-close-2" aria-label="Close">&times;</button>' +
        '<h3>Thank you</h3>' +
        '<p class="fbw-lede">Your feedback was received. If you left an email and it warrants a reply, you\'ll hear back within a few days.</p>' +
        '<div class="fbw-actions"><button type="button" class="fbw-submit" id="fbw-done">Close</button></div>';
      document.getElementById("fbw-done").addEventListener("click", closeModal);
      document.getElementById("fbw-close-2").addEventListener("click", closeModal);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = origLabel;
      showStatus(statusEl, "Couldn't send right now. Please try again.", "error");
    }
  }

  function showStatus(el, msg, kind) {
    el.className = "fbw-status fbw-status--" + kind;
    el.textContent = msg;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function trunc(s, n) { return String(s == null ? "" : s).slice(0, n); }

  function boot() {
    injectStyles();
    injectTrigger();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
