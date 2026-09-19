/*
 * admin.js — single-admin moderation + analytics dashboard.
 *
 * Gate: signed-in via the same passwordless auth as everyone else, but only
 * rendered for the one uid Firestore rules treat as admin (isAdmin() in
 * firebase/firestore.rules). Everyone else sees a "sign in as admin" panel —
 * reads are rejected by rules regardless, this is just UX, not the gate.
 */
import { onAuth, sendSignInLink, completeSignInIfLinkPresent, db_ } from "./auth.js";
import {
  collection, query, where, orderBy, limit, getDocs, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const ADMIN_UID = "gXIEl0ajRzfXHgUye54WvemBf642";

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function fmtTs(ts) {
  if (!ts || !ts.toDate) return "—";
  return ts.toDate().toLocaleString();
}

const gate = document.getElementById("admin-gate");
const dash = document.getElementById("admin-dash");

function renderGate(user) {
  dash.hidden = true;
  gate.hidden = false;
  if (!user) {
    gate.innerHTML = `
      <h2>Admin sign-in</h2>
      <p class="note">Sign in with the admin account's email to view the dashboard.</p>
      <form id="admin-signin-form" class="account-inline-form" style="display:flex;gap:.5rem;justify-content:center;margin-top:1rem">
        <input type="email" id="admin-signin-email" required placeholder="admin email" style="padding:.5rem;border:1px solid var(--rule);border-radius:6px">
        <button type="submit" class="btn -primary">Send link</button>
      </form>
      <p class="note" id="admin-signin-status" style="margin-top:.75rem"></p>`;
    document.getElementById("admin-signin-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("admin-signin-email").value.trim();
      const status = document.getElementById("admin-signin-status");
      try { await sendSignInLink(email); status.textContent = "Check your email for the sign-in link."; }
      catch (err) { status.textContent = "Couldn't send link — try again."; console.error(err); }
    });
  } else {
    gate.innerHTML = `<h2>Not authorized</h2><p class="note">Signed in as ${escapeHtml(user.email)}, which isn't the admin account.</p>`;
  }
}

// ---------------------------------------------------------------------------
// Stats summary
// ---------------------------------------------------------------------------

async function renderStats(db) {
  const el = document.getElementById("admin-stats");
  const counts = {};
  const jobs = [
    ["users", "users"],
    ["prompt_submissions", "prompt_submissions", "status", "pending"],
    ["comments", "comments", "status", "pending"],
    ["feedback", "feedback", "status", "new"],
    ["page_events", "page_events"]
  ];
  el.innerHTML = '<p class="note">Loading…</p>';
  try {
    const [usersSnap, subsSnap, pendingSubsSnap, commentsSnap, pendingCommentsSnap, feedbackSnap, newFeedbackSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "prompt_submissions")),
      getDocs(query(collection(db, "prompt_submissions"), where("status", "==", "pending"))),
      getDocs(collection(db, "comments")),
      getDocs(query(collection(db, "comments"), where("status", "==", "pending"))),
      getDocs(collection(db, "feedback")),
      getDocs(query(collection(db, "feedback"), where("status", "==", "new")))
    ]);
    const stats = [
      ["Users", usersSnap.size],
      ["Submissions", subsSnap.size, pendingSubsSnap.size + " pending"],
      ["Comments", commentsSnap.size, pendingCommentsSnap.size + " pending"],
      ["Feedback", feedbackSnap.size, newFeedbackSnap.size + " new"]
    ];
    el.innerHTML = stats.map(([label, n, sub]) => `
      <div class="admin-stat">
        <span class="n">${n}</span>
        <span class="label">${label}</span>
        ${sub ? `<div class="note" style="margin-top:.25rem">${sub}</div>` : ""}
      </div>`).join("");
  } catch (err) {
    el.innerHTML = '<p class="note">Failed to load stats.</p>';
    console.error(err);
  }
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

async function renderSubmissions(db) {
  const el = document.getElementById("panel-submissions");
  el.innerHTML = '<p class="note">Loading…</p>';
  const snap = await getDocs(query(collection(db, "prompt_submissions"), orderBy("timestamp", "desc"), limit(100)));
  if (snap.empty) { el.innerHTML = '<p class="note">No submissions yet.</p>'; return; }
  el.innerHTML = "";
  snap.forEach((d) => {
    const s = d.data();
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `
      <div class="meta">${fmtTs(s.timestamp)} · ${escapeHtml(s.prompt_pillar)} · status: <strong>${escapeHtml(s.status)}</strong></div>
      <strong>${escapeHtml(s.prompt_title)}</strong> — ${escapeHtml(s.submitter_name)} &lt;${escapeHtml(s.submitter_email)}&gt;
      <div class="body">${escapeHtml(s.prompt_intent)}</div>
      <div class="actions">
        <button type="button" data-act="approved">Approve</button>
        <button type="button" data-act="needs_revision">Needs revision</button>
        <button type="button" data-act="rejected">Reject</button>
      </div>`;
    row.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await updateDoc(doc(db, "prompt_submissions", d.id), { status: btn.dataset.act });
        renderSubmissions(db);
        renderStats(db);
      });
    });
    el.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Comments moderation
// ---------------------------------------------------------------------------

async function renderComments(db) {
  const el = document.getElementById("panel-comments");
  el.innerHTML = '<p class="note">Loading…</p>';
  const snap = await getDocs(query(collection(db, "comments"), orderBy("timestamp", "desc"), limit(150)));
  if (snap.empty) { el.innerHTML = '<p class="note">No comments yet.</p>'; return; }
  el.innerHTML = "";
  snap.forEach((d) => {
    const c = d.data();
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `
      <div class="meta">${fmtTs(c.timestamp)} · ${escapeHtml(c.prompt_path)} · status: <strong>${escapeHtml(c.status)}</strong></div>
      <strong>${escapeHtml(c.commenter_name)}</strong>
      <div class="body">${escapeHtml(c.comment_text)}</div>
      <div class="actions">
        <button type="button" data-act="visible">Approve</button>
        <button type="button" data-act="hidden">Hide</button>
        <button type="button" data-act="delete">Delete</button>
      </div>`;
    row.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (btn.dataset.act === "delete") await deleteDoc(doc(db, "comments", d.id));
        else await updateDoc(doc(db, "comments", d.id), { status: btn.dataset.act });
        renderComments(db);
        renderStats(db);
      });
    });
    el.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

async function renderFeedback(db) {
  const el = document.getElementById("panel-feedback");
  el.innerHTML = '<p class="note">Loading…</p>';
  const snap = await getDocs(query(collection(db, "feedback"), orderBy("timestamp", "desc"), limit(100)));
  if (snap.empty) { el.innerHTML = '<p class="note">No feedback yet.</p>'; return; }
  el.innerHTML = "";
  snap.forEach((d) => {
    const f = d.data();
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `
      <div class="meta">${fmtTs(f.timestamp)} · status: <strong>${escapeHtml(f.status)}</strong> · <a href="${escapeHtml(f.page_url || "#")}">${escapeHtml(f.page_url || "")}</a></div>
      <strong>${escapeHtml(f.submitter_name || f.submitter_email || "Anonymous")}</strong>
      <div class="body">${escapeHtml(f.message)}</div>
      <div class="actions">
        <button type="button" data-act="read">Mark read</button>
        <button type="button" data-act="delete">Delete</button>
      </div>`;
    row.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (btn.dataset.act === "delete") await deleteDoc(doc(db, "feedback", d.id));
        else await updateDoc(doc(db, "feedback", d.id), { status: btn.dataset.act });
        renderFeedback(db);
        renderStats(db);
      });
    });
    el.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Analytics — top prompts by view, favorite/vote/comment counts
// ---------------------------------------------------------------------------

async function renderAnalytics(db) {
  const el = document.getElementById("panel-analytics");
  el.innerHTML = '<p class="note">Loading…</p>';
  const snap = await getDocs(query(collection(db, "page_events"), orderBy("timestamp", "desc"), limit(2000)));
  const byType = {};
  const byPrompt = {};
  const sessions = new Set();
  snap.forEach((d) => {
    const e = d.data();
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (e.session_id) sessions.add(e.session_id);
    if (e.prompt_path) byPrompt[e.prompt_path] = (byPrompt[e.prompt_path] || 0) + 1;
  });
  const topPrompts = Object.entries(byPrompt).sort((a, b) => b[1] - a[1]).slice(0, 15);

  el.innerHTML = `
    <div class="admin-stats">
      ${Object.entries(byType).map(([t, n]) => `<div class="admin-stat"><span class="n">${n}</span><span class="label">${escapeHtml(t)}</span></div>`).join("")}
      <div class="admin-stat"><span class="n">${sessions.size}</span><span class="label">sessions (last 2000 events)</span></div>
    </div>
    <h3 class="card-section__title">Most-engaged prompts</h3>
    <div class="admin-row">
      ${topPrompts.length ? topPrompts.map(([p, n]) => `<div>${n} &middot; ${escapeHtml(p)}</div>`).join("") : '<p class="note">No prompt-scoped events yet.</p>'}
    </div>
    <p class="note" style="margin-top:1rem">Based on the most recent 2000 page_events (view, favorite, unfavorite, note_saved, vote, comment, submission).</p>`;
}

// ---------------------------------------------------------------------------
// Tabs + boot
// ---------------------------------------------------------------------------

const TABS = ["submissions", "comments", "feedback", "analytics"];
function showTab(which) {
  TABS.forEach((t) => {
    document.getElementById("panel-" + t).hidden = t !== which;
    document.getElementById("tab-" + t).setAttribute("aria-selected", String(t === which));
  });
}

async function boot(user) {
  gate.hidden = true;
  dash.hidden = false;
  const db = db_();
  TABS.forEach((t) => {
    document.getElementById("tab-" + t).addEventListener("click", () => showTab(t));
  });
  showTab("submissions");
  await Promise.all([
    renderStats(db),
    renderSubmissions(db),
    renderComments(db),
    renderFeedback(db),
    renderAnalytics(db)
  ]);
}

completeSignInIfLinkPresent().catch((err) => console.error(err));
onAuth((user) => {
  if (user && user.uid === ADMIN_UID) boot(user);
  else renderGate(user);
});
