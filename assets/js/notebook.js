/*
 * notebook.js — "My Notebook" page: every favorited prompt + every note,
 * for the signed-in user, in one place. Redirects to sign-in prompt if
 * not authenticated.
 */
import { onAuth, getUserProfile, db_ } from "./auth.js";
import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function humanizePromptPath(p) {
  const parts = p.split("/");
  return parts[parts.length - 1].replace(/-/g, " ");
}

function promptHref(promptPath) {
  return "library.html#/" + promptPath;
}

export function initNotebook() {
  const mount = document.getElementById("notebook-content");
  if (!mount) return;

  onAuth(async (user) => {
    if (!user) {
      mount.innerHTML = '<p class="note">Sign in (top of page) to see your notebook.</p>';
      return;
    }
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      mount.innerHTML = '<p class="note">Finish setting up your profile (top of page), then reload this page.</p>';
      return;
    }

    const db = db_();
    const [favSnap, notesSnap] = await Promise.all([
      getDocs(query(collection(db, "users", user.uid, "favorites"), orderBy("saved_at", "desc"))),
      getDocs(query(collection(db, "users", user.uid, "notes"), orderBy("updated_at", "desc")))
    ]);

    const notesByPath = {};
    notesSnap.forEach((d) => { notesByPath[d.data().prompt_path] = d.data().text; });

    if (favSnap.empty && notesSnap.empty) {
      mount.innerHTML = '<p class="note">Nothing saved yet — browse the <a href="library.html">library</a> and click "Save to notebook" on any prompt.</p>';
      return;
    }

    // Union of favorited paths and noted paths, favorites first in their order.
    const seen = new Set();
    const paths = [];
    favSnap.forEach((d) => { const p = d.data().prompt_path; if (!seen.has(p)) { seen.add(p); paths.push(p); } });
    notesSnap.forEach((d) => { const p = d.data().prompt_path; if (!seen.has(p)) { seen.add(p); paths.push(p); } });

    const favPaths = new Set(favSnap.docs.map((d) => d.data().prompt_path));

    mount.innerHTML = "";
    for (const p of paths) {
      const card = document.createElement("div");
      card.className = "prompt-card";
      card.style.cssText = "display:block;padding:1rem;border:1px solid var(--rule);border-radius:6px;margin-bottom:.75rem";
      const note = notesByPath[p];
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <a href="${promptHref(p)}" style="font-weight:600;text-transform:capitalize">${humanizePromptPath(p)}</a>
          ${favPaths.has(p) ? '<span style="font-size:.8rem;color:var(--ink-faint)">★ saved</span>' : ""}
        </div>
        <div style="font-size:.8rem;color:var(--ink-faint);margin-top:.15rem">${p}</div>
        ${note ? `<div style="margin-top:.5rem;font-size:.9rem;white-space:pre-wrap;background:var(--paper-sunken);padding:.5rem;border-radius:4px">${note.replace(/</g,"&lt;")}</div>` : ""}
      `;
      mount.appendChild(card);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNotebook);
} else {
  initNotebook();
}
