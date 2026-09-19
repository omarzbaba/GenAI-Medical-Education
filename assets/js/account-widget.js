/*
 * account-widget.js — mounts into #account-slot (present in the header on
 * every real HTML page). Handles: sign-in-link request, post-click
 * completion, first-time profile setup, and the signed-in "Hi, X · My
 * Notebook · Sign out" state.
 */
import {
  onAuth, sendSignInLink, completeSignInIfLinkPresent,
  getUserProfile, createUserProfile, signOutUser
} from "./auth.js";

const ROLE_LABELS = {
  resident: "Resident", fellow: "Fellow", faculty: "Faculty",
  program_director: "Program Director", other: "Other"
};

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderSignedOut(mount) {
  mount.innerHTML = "";
  const btn = el(`<button type="button" class="btn-link" id="account-signin-btn">Sign in</button>`);
  mount.appendChild(btn);
  btn.addEventListener("click", () => renderSignInForm(mount));
}

function renderSignInForm(mount) {
  mount.innerHTML = "";
  const wrap = el(`
    <form id="signin-form" class="account-inline-form" style="display:flex;gap:.4rem;align-items:center">
      <input type="email" required placeholder="you@institution.edu" id="signin-email"
             style="font-size:.85rem;padding:.3rem .5rem;border:1px solid var(--rule);border-radius:4px;width:200px">
      <button type="submit" class="btn-link">Send link</button>
      <span id="signin-status" style="font-size:.8rem;color:var(--ink-faint)"></span>
    </form>`);
  mount.appendChild(wrap);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signin-email").value.trim();
    const status = document.getElementById("signin-status");
    status.textContent = "Sending…";
    try {
      await sendSignInLink(email);
      status.textContent = "Check your email for the sign-in link.";
      wrap.querySelector("button").disabled = true;
    } catch (err) {
      status.textContent = "Couldn't send that — check the address and try again.";
      console.error(err);
    }
  });
}

function renderProfileSetup(mount, user) {
  mount.innerHTML = "";
  const wrap = el(`
    <form id="profile-form" class="account-inline-form" style="display:flex;gap:.4rem;align-items:center;flex-wrap:wrap">
      <span style="font-size:.85rem">Welcome — one-time setup:</span>
      <input required placeholder="Display name" id="profile-name" style="font-size:.85rem;padding:.3rem .5rem;width:140px">
      <input placeholder="Institution (optional)" id="profile-inst" style="font-size:.85rem;padding:.3rem .5rem;width:160px">
      <select id="profile-role" required style="font-size:.85rem;padding:.3rem .4rem">
        <option value="">Role…</option>
        ${Object.entries(ROLE_LABELS).map(([v,l]) => `<option value="${v}">${l}</option>`).join("")}
      </select>
      <button type="submit" class="btn-link">Save</button>
    </form>`);
  mount.appendChild(wrap);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const display_name = document.getElementById("profile-name").value.trim();
    const institution = document.getElementById("profile-inst").value.trim();
    const role = document.getElementById("profile-role").value;
    if (!display_name || !role) return;
    await createUserProfile({ uid: user.uid, email: user.email, display_name, institution, role });
    renderSignedIn(mount, user, { display_name, institution, role });
  });
}

function renderSignedIn(mount, user, profile) {
  mount.innerHTML = "";
  window.__companionUser = { uid: user.uid, email: user.email, display_name: profile.display_name || "" };
  const firstName = (profile.display_name || user.email).split(/\s+/)[0];
  const wrap = el(`
    <span style="display:flex;gap:.7rem;align-items:center;font-size:.85rem">
      <a href="notebook.html">My Notebook</a>
      <span style="color:var(--ink-faint)">Hi, ${firstName}</span>
      <button type="button" class="btn-link" id="signout-btn">Sign out</button>
    </span>`);
  mount.appendChild(wrap);
  document.getElementById("signout-btn").addEventListener("click", async () => {
    await signOutUser();
    renderSignedOut(mount);
  });
}

export function initAccountWidget() {
  const mount = document.getElementById("account-slot");
  if (!mount) return;

  completeSignInIfLinkPresent().catch((err) => console.error("Sign-in completion failed:", err));

  onAuth(async (user) => {
    if (!user) { window.__companionUser = null; renderSignedOut(mount); return; }
    const profile = await getUserProfile(user.uid);
    if (!profile) { renderProfileSetup(mount, user); return; }
    renderSignedIn(mount, user, profile);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAccountWidget);
} else {
  initAccountWidget();
}
