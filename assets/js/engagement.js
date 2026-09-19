/*
 * engagement.js — favorites, notebook notes, up/down votes, and comments
 * (with likes + @mentions) on a single prompt detail page.
 *
 * Mounted lazily by library-router.js only on prompt detail pages, into
 * <div id="engagement-slot">. Requires sign-in for every write (favorite,
 * note, vote, comment, like) — browsing and reading are always free.
 */
import {
  onAuth, getCurrentUser, getUserProfile, db_
} from "./auth.js";
import {
  doc, getDoc, setDoc, deleteDoc, collection, addDoc, query, where,
  orderBy, getDocs, onSnapshot, serverTimestamp, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function safeId(promptPath) {
  return promptPath.replace(/\//g, "__");
}

function requireSignIn(mount) {
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = "Sign in (top of page) to save this prompt, take notes, vote, or comment.";
  mount.appendChild(note);
}

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

async function mountFavorite(container, promptPath, user) {
  const db = db_();
  const ref = doc(db, "users", user.uid, "favorites", safeId(promptPath));
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-fav";
  container.appendChild(btn);

  async function refresh() {
    const snap = await getDoc(ref);
    btn.textContent = snap.exists() ? "★ Saved to notebook" : "☆ Save to notebook";
    btn.dataset.saved = snap.exists() ? "1" : "0";
  }
  await refresh();

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      if (btn.dataset.saved === "1") {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, { prompt_path: promptPath, saved_at: serverTimestamp() });
      }
      await refresh();
    } finally {
      btn.disabled = false;
    }
  });
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

async function mountNotes(container, promptPath, user) {
  const db = db_();
  const noteId = safeId(promptPath);
  const ref = doc(db, "users", user.uid, "notes", noteId);

  const wrap = document.createElement("div");
  wrap.className = "notes-block";
  wrap.innerHTML = `
    <label style="display:block;font-size:.85rem;font-weight:600;margin-bottom:.3rem">Your notes on this prompt (private)</label>
    <textarea id="notes-text" rows="4" style="width:100%;font-family:inherit;font-size:.9rem;padding:.5rem" maxlength="10000"></textarea>
    <div style="display:flex;gap:.5rem;align-items:center;margin-top:.3rem">
      <button type="button" id="notes-save" class="btn-link">Save note</button>
      <span id="notes-status" style="font-size:.8rem;color:var(--ink-faint)"></span>
    </div>`;
  container.appendChild(wrap);

  const existing = await getDoc(ref);
  const textarea = wrap.querySelector("#notes-text");
  if (existing.exists()) textarea.value = existing.data().text || "";

  wrap.querySelector("#notes-save").addEventListener("click", async () => {
    const status = wrap.querySelector("#notes-status");
    const text = textarea.value;
    if (!text.trim()) {
      await deleteDoc(ref).catch(() => {});
      status.textContent = "Cleared.";
      return;
    }
    await setDoc(ref, { prompt_path: promptPath, text, updated_at: serverTimestamp() });
    status.textContent = "Saved · " + new Date().toLocaleTimeString();
  });
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

async function mountVotes(container, promptPath, user) {
  const db = db_();
  const myVoteRef = doc(db, "votes", user.uid + "__" + safeId(promptPath));

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;gap:.5rem;align-items:center;margin:.5rem 0";
  wrap.innerHTML = `
    <button type="button" id="vote-up" class="btn-vote">▲</button>
    <span id="vote-count">—</span>
    <button type="button" id="vote-down" class="btn-vote">▼</button>`;
  container.appendChild(wrap);

  async function refreshCounts() {
    const q = query(collection(db, "votes"), where("prompt_path", "==", promptPath));
    const snap = await getDocs(q);
    let up = 0, down = 0;
    snap.forEach((d) => { const dir = d.data().direction; if (dir === "up") up++; else if (dir === "down") down++; });
    wrap.querySelector("#vote-count").textContent = (up - down) >= 0 ? "+" + (up - down) : String(up - down);
    wrap.querySelector("#vote-count").title = `${up} up · ${down} down`;
  }
  await refreshCounts();

  const mySnap = await getDoc(myVoteRef);
  let myDirection = mySnap.exists() ? mySnap.data().direction : null;
  function highlight() {
    wrap.querySelector("#vote-up").style.fontWeight = myDirection === "up" ? "700" : "400";
    wrap.querySelector("#vote-down").style.fontWeight = myDirection === "down" ? "700" : "400";
  }
  highlight();

  async function castVote(direction) {
    if (myDirection === direction) return; // no-op, already voted this way
    const payload = { prompt_path: promptPath, uid: user.uid, direction, timestamp: serverTimestamp() };
    if (myDirection === null) {
      await setDoc(myVoteRef, payload);
    } else {
      await updateDoc(myVoteRef, { direction, timestamp: serverTimestamp() });
    }
    myDirection = direction;
    highlight();
    await refreshCounts();
  }

  wrap.querySelector("#vote-up").addEventListener("click", () => castVote("up"));
  wrap.querySelector("#vote-down").addEventListener("click", () => castVote("down"));
}

// ---------------------------------------------------------------------------
// Comments (+ likes, + @mentions)
// ---------------------------------------------------------------------------

function parseMentions(text) {
  const matches = text.match(/@([A-Za-z][\w.\-]{1,60})/g) || [];
  return [...new Set(matches.map((m) => m.slice(1)))].slice(0, 10);
}

async function mountComments(container, promptPath, user, profile) {
  const db = db_();
  const wrap = document.createElement("div");
  wrap.className = "comments-block";
  wrap.innerHTML = `
    <h4 style="margin:1.5rem 0 .5rem">Comments</h4>
    <div id="comments-list"></div>
    <form id="comment-form" style="margin-top:1rem">
      <textarea id="comment-text" rows="3" placeholder="Add a comment — @name to mention someone"
                style="width:100%;font-family:inherit;font-size:.9rem;padding:.5rem" maxlength="2000"></textarea>
      <button type="submit" class="btn-link" style="margin-top:.3rem">Post comment</button>
    </form>`;
  container.appendChild(wrap);

  const list = wrap.querySelector("#comments-list");

  async function renderList() {
    const q = query(
      collection(db, "comments"),
      where("prompt_path", "==", promptPath),
      where("status", "==", "visible"),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    list.innerHTML = "";
    if (snap.empty) {
      list.innerHTML = '<p class="note" style="margin:.5rem 0">No comments yet — be the first.</p>';
      return;
    }
    for (const d of snap.docs) {
      const c = d.data();
      const row = document.createElement("div");
      row.className = "comment-row";
      row.style.cssText = "border-top:1px solid var(--rule);padding:.6rem 0";
      row.innerHTML = `
        <div style="font-size:.85rem;font-weight:600">${escapeHtml(c.commenter_name)}${c.is_admin ? " · admin" : ""}</div>
        <div style="font-size:.9rem;white-space:pre-wrap">${escapeHtml(c.comment_text)}</div>
        <div style="margin-top:.3rem">
          <button type="button" class="btn-link like-btn" data-id="${d.id}" style="font-size:.8rem">♡ <span class="like-count">…</span></button>
        </div>`;
      list.appendChild(row);
      wireLike(row.querySelector(".like-btn"), d.id, user);
    }
  }

  async function wireLike(btn, commentId, user) {
    const likesCol = collection(db, "comments", commentId, "likes");
    const mine = doc(db, "comments", commentId, "likes", user.uid);
    async function refresh() {
      const snap = await getDocs(likesCol);
      const iLiked = snap.docs.some((d) => d.id === user.uid);
      btn.querySelector(".like-count").textContent = String(snap.size);
      btn.firstChild.textContent = iLiked ? "♥ " : "♡ ";
      btn.dataset.liked = iLiked ? "1" : "0";
    }
    await refresh();
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        if (btn.dataset.liked === "1") await deleteDoc(mine);
        else await setDoc(mine, { liked_at: serverTimestamp() });
        await refresh();
      } finally { btn.disabled = false; }
    });
  }

  await renderList();

  wrap.querySelector("#comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const textarea = wrap.querySelector("#comment-text");
    const text = textarea.value.trim();
    if (text.length < 10) return;
    await addDoc(collection(db, "comments"), {
      timestamp: serverTimestamp(),
      status: "pending",
      prompt_path: promptPath,
      uid: user.uid,
      commenter_name: profile.display_name,
      comment_text: text,
      mentions: parseMentions(text),
      is_admin: false,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent.slice(0, 500)
    });
    textarea.value = "";
    const status = document.createElement("p");
    status.className = "note";
    status.textContent = "Posted — visible once approved by a moderator.";
    wrap.querySelector("#comment-form").appendChild(status);
  });
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// Entry point — called by library-router.js
// ---------------------------------------------------------------------------

export function renderEngagement(mount, promptPath) {
  if (!mount) return;
  onAuth(async (user) => {
    mount.innerHTML = "";
    if (!user) { requireSignIn(mount); return; }
    const profile = await getUserProfile(user.uid);
    if (!profile) { requireSignIn(mount); return; } // profile setup happens via the header widget

    const favWrap = document.createElement("div");
    mount.appendChild(favWrap);
    await mountFavorite(favWrap, promptPath, user);

    const voteWrap = document.createElement("div");
    mount.appendChild(voteWrap);
    await mountVotes(voteWrap, promptPath, user);

    const notesWrap = document.createElement("div");
    mount.appendChild(notesWrap);
    await mountNotes(notesWrap, promptPath, user);

    const commentsWrap = document.createElement("div");
    mount.appendChild(commentsWrap);
    await mountComments(commentsWrap, promptPath, user, profile);
  });
}
