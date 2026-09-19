/*
 * auth.js — real per-visitor Firebase Auth (passwordless email link).
 *
 * Flow:
 *   1. Visitor clicks "Sign in", enters email. sendSignInLink() emails a
 *      magic link pointing back at this same page with a token in the URL.
 *   2. Visitor clicks the link. completeSignInIfLinkPresent() detects the
 *      token, finishes sign-in, and — if this is a first-time signer —
 *      prompts for a display name / role / institution to create their
 *      users/{uid} profile doc (required by Firestore rules on first write).
 *   3. onAuth(cb) lets other modules (favorites, notes, votes, comments)
 *      react to sign-in state without each reimplementing Firebase init.
 *
 * Email for the pending sign-in is stashed in localStorage between steps 1
 * and 2 (standard Firebase email-link pattern — the link itself doesn't
 * carry the email for privacy/shareability reasons).
 */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  initializeAppCheck, ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-check.js";
import {
  getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig, appCheckSiteKey } from "./firebase-config.js";

const PENDING_EMAIL_KEY = "companion_pending_signin_email";
const ALLOWED_ROLES = ["resident", "fellow", "faculty", "program_director", "other"];

let app, auth, db;
function ensureInit() {
  if (app) return;
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (_) { /* already initialized elsewhere on this page */ }
  auth = getAuth(app);
  db = getFirestore(app);
}

const listeners = [];
export function onAuth(cb) {
  ensureInit();
  listeners.push(cb);
  return onAuthStateChanged(auth, (user) => cb(user));
}

export function getCurrentUser() {
  ensureInit();
  return auth.currentUser;
}

export async function sendSignInLink(email) {
  ensureInit();
  const actionCodeSettings = {
    url: window.location.origin + window.location.pathname + window.location.search,
    handleCodeInApp: true
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  try { window.localStorage.setItem(PENDING_EMAIL_KEY, email); } catch (_) {}
}

/**
 * Call on every page load. Resolves to:
 *   { completed: true, user }   — a sign-in link was present and consumed
 *   { completed: false }        — nothing to do (normal page load)
 */
export async function completeSignInIfLinkPresent() {
  ensureInit();
  if (!isSignInWithEmailLink(auth, window.location.href)) return { completed: false };

  let email = null;
  try { email = window.localStorage.getItem(PENDING_EMAIL_KEY); } catch (_) {}
  if (!email) {
    email = window.prompt("Confirm the email address you used to sign in:");
  }
  if (!email) return { completed: false };

  const result = await signInWithEmailLink(auth, email, window.location.href);
  try { window.localStorage.removeItem(PENDING_EMAIL_KEY); } catch (_) {}

  // Strip the sign-in params from the URL so a refresh doesn't retry.
  const clean = window.location.origin + window.location.pathname + window.location.hash;
  window.history.replaceState({}, document.title, clean);

  await ensureUserProfile(result.user);
  return { completed: true, user: result.user };
}

/** Returns the user's profile doc, or null if they haven't completed setup yet. */
export async function getUserProfile(uid) {
  ensureInit();
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

async function ensureUserProfile(user) {
  const existing = await getUserProfile(user.uid);
  if (existing) return existing;
  return null; // caller (UI) is responsible for prompting to complete profile setup
}

/** Creates the users/{uid} doc. Call after collecting name/institution/role from a first-time signer. */
export async function createUserProfile({ uid, email, display_name, institution, role }) {
  ensureInit();
  if (!ALLOWED_ROLES.includes(role)) throw new Error("Invalid role");
  await setDoc(doc(db, "users", uid), {
    created_at: serverTimestamp(),
    email,
    display_name: String(display_name || "").trim().slice(0, 120),
    institution: String(institution || "").trim().slice(0, 200),
    role
  });
}

export async function signOutUser() {
  ensureInit();
  await signOut(auth);
}

export function db_() { ensureInit(); return db; }
export function app_() { ensureInit(); return app; }
