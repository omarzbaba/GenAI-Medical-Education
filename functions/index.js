/*
 * Notification Cloud Functions for the GenAI Medical Education companion site.
 *
 * Triggers:
 *   1. onCommentCreated          — emails admin when a new comment is submitted
 *   2. onSubmissionCreated       — emails admin when a new prompt is submitted
 *   3. onFeedbackCreated         — emails admin when feedback is submitted
 *   4. onSubmissionStatusChanged — emails the submitter when status changes
 *   5. onCommentMentions         — writes in-app notification docs for @mentions
 *   6. verifyReturningVisitor    — callable, legacy returning-visitor lookup
 *
 * SITE_URL / RESEND_FROM / ADMIN_EMAIL come from the functions .env file —
 * this repo reuses the same Firebase project (ai-pathology-education) as the
 * original companion site, so the .env values must be updated to point at
 * https://omarzbaba.github.io/GenAI-Medical-Education before/at deploy time.
 */

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { Resend } = require("resend");

if (!getApps().length) initializeApp();
const adminDb = getFirestore();

const resendKey = defineSecret("RESEND_API_KEY");

const RESEND_FROM = process.env.RESEND_FROM || "notifications@onresend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const SITE_URL = process.env.SITE_URL || "https://omarzbaba.github.io/GenAI-Medical-Education";

function getResend() {
  return new Resend(resendKey.value());
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// 1. New comment → email admin
// ---------------------------------------------------------------------------

exports.onCommentCreated = onDocumentCreated(
  { document: "comments/{commentId}", secrets: [resendKey] },
  async (event) => {
    const c = event.data.data();
    if (c.is_admin === true) return;

    try {
      const resend = getResend();
      const promptUrl = SITE_URL + "/library.html#/" + c.prompt_path;
      const adminUrl = SITE_URL + "/admin.html";

      const _r = await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: "[Companion] New comment from " + (c.commenter_name || "unknown"),
        html: `
          <h2>New comment awaiting moderation</h2>
          <p><strong>From:</strong> ${escapeHtml(c.commenter_name)}</p>
          <p><strong>On prompt:</strong> <a href="${escapeHtml(promptUrl)}">${escapeHtml(c.prompt_path)}</a></p>
          <hr>
          <blockquote style="border-left: 3px solid #7A1C28; padding-left: 1rem; margin: 1rem 0;">
            ${escapeHtml(c.comment_text).replace(/\n/g, "<br>")}
          </blockquote>
          <p><a href="${escapeHtml(adminUrl)}">Open admin dashboard &rarr;</a></p>
        `
      });
      if (_r && _r.error) throw new Error("Resend rejected: " + JSON.stringify(_r.error));
      logger.info("Comment notification sent for", event.params.commentId, "id:", _r && _r.data && _r.data.id);
    } catch (err) {
      logger.error("Failed to send comment notification:", err);
    }
  }
);

// ---------------------------------------------------------------------------
// 2. New prompt submission → email admin
// ---------------------------------------------------------------------------

exports.onSubmissionCreated = onDocumentCreated(
  { document: "prompt_submissions/{subId}", secrets: [resendKey] },
  async (event) => {
    const s = event.data.data();
    try {
      const resend = getResend();
      const adminUrl = SITE_URL + "/admin.html";

      const _r = await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: "[Companion] New prompt submission: " + (s.prompt_title || "untitled"),
        html: `
          <h2>New prompt submission</h2>
          <p><strong>Title:</strong> ${escapeHtml(s.prompt_title)}</p>
          <p><strong>From:</strong> ${escapeHtml(s.submitter_name)} &lt;${escapeHtml(s.submitter_email)}&gt;</p>
          <p><strong>Pillar:</strong> ${escapeHtml(s.prompt_pillar)}</p>
          <h3>What it does</h3>
          <p>${escapeHtml(s.prompt_intent).replace(/\n/g, "<br>")}</p>
          <h3>The prompt</h3>
          <pre style="background: #f5f5f0; padding: 1rem; overflow-x: auto;">${escapeHtml(s.prompt_text)}</pre>
          <p><a href="${escapeHtml(adminUrl)}">Open admin dashboard to review &rarr;</a></p>
        `
      });
      if (_r && _r.error) throw new Error("Resend rejected: " + JSON.stringify(_r.error));
      logger.info("Submission notification sent for", event.params.subId, "id:", _r && _r.data && _r.data.id);
    } catch (err) {
      logger.error("Failed to send submission notification:", err);
    }
  }
);

// ---------------------------------------------------------------------------
// 3. New feedback → email admin
// ---------------------------------------------------------------------------

exports.onFeedbackCreated = onDocumentCreated(
  { document: "feedback/{fbId}", secrets: [resendKey] },
  async (event) => {
    const f = event.data.data();
    try {
      const resend = getResend();
      const adminUrl = SITE_URL + "/admin.html";
      const identity = f.submitter_name || f.submitter_email
        ? escapeHtml(f.submitter_name || "(no name)") + (f.submitter_email ? " &lt;" + escapeHtml(f.submitter_email) + "&gt;" : "")
        : "<em>Anonymous</em>";

      const _r = await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        replyTo: f.submitter_email || undefined,
        subject: "[Companion] Feedback from " + (f.submitter_name || f.submitter_email || "anonymous"),
        html: `
          <h2>New feedback</h2>
          <p><strong>From:</strong> ${identity}</p>
          <p><strong>Page:</strong> <a href="${escapeHtml(f.page_url || "")}">${escapeHtml(f.page_url || "")}</a></p>
          <hr>
          <blockquote style="border-left: 3px solid #7A1C28; padding-left: 1rem; margin: 1rem 0; white-space: pre-wrap;">
            ${escapeHtml(f.message || "")}
          </blockquote>
          <p><a href="${escapeHtml(adminUrl)}">Open admin dashboard &rarr;</a></p>
        `
      });
      if (_r && _r.error) throw new Error("Resend rejected: " + JSON.stringify(_r.error));
      logger.info("Feedback notification sent for", event.params.fbId, "id:", _r && _r.data && _r.data.id);
    } catch (err) {
      logger.error("Failed to send feedback notification:", err);
    }
  }
);

// ---------------------------------------------------------------------------
// 4. Submission status changed → email submitter
// ---------------------------------------------------------------------------

exports.onSubmissionStatusChanged = onDocumentUpdated(
  { document: "prompt_submissions/{subId}", secrets: [resendKey] },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (before.status === after.status) return;
    if (!after.submitter_email) return;

    const statusMessages = {
      approved: {
        subject: "Your prompt has been approved",
        body: "Good news — your submission has been approved and will appear in the library shortly with attribution to you."
      },
      rejected: {
        subject: "Update on your prompt submission",
        body: "After review, your submission won't be added to the library at this time. This often happens when the prompt is too generic, overlaps significantly with existing content, or falls outside the library's scope. You're welcome to revise and resubmit if you'd like."
      },
      needs_revision: {
        subject: "Your prompt submission needs revision",
        body: "Your submission shows promise but needs some revision before it can be approved. Dr. Baba will follow up directly with specific feedback within a few days."
      },
      pending: null
    };

    const msg = statusMessages[after.status];
    if (!msg) return;

    try {
      const resend = getResend();
      const _r = await resend.emails.send({
        from: RESEND_FROM,
        to: after.submitter_email,
        subject: msg.subject + ": " + (after.prompt_title || "your submission"),
        html: `
          <p>Hi ${escapeHtml(after.submitter_name)},</p>
          <p>Thank you for submitting "<strong>${escapeHtml(after.prompt_title)}</strong>" to the companion library.</p>
          <p>${escapeHtml(msg.body)}</p>
          <p>If you have questions, feel free to reply to this email directly.</p>
          <p>— The AI in Pathology Education team</p>
        `
      });
      if (_r && _r.error) throw new Error("Resend rejected: " + JSON.stringify(_r.error));
      logger.info("Status notification sent to submitter:", after.submitter_email, "status:", after.status, "id:", _r && _r.data && _r.data.id);
    } catch (err) {
      logger.error("Failed to send status notification:", err);
    }
  }
);

// ---------------------------------------------------------------------------
// 5. New comment with @mentions → in-app notification docs
//
// users/{uid}/notifications is server-only-create per firestore.rules, so
// resolving a mention (username → notified uid) has to happen here, not on
// the client. We match mentions against users.display_name (case-insensitive,
// first exact match wins) rather than trying to guess uids client-side.
// ---------------------------------------------------------------------------

exports.onCommentMentions = onDocumentCreated(
  "comments/{commentId}",
  async (event) => {
    const c = event.data.data();
    const mentions = Array.isArray(c.mentions) ? c.mentions : [];
    if (!mentions.length) return;

    try {
      const usersSnap = await adminDb.collection("users").get();
      const byNameLower = new Map();
      usersSnap.forEach((d) => {
        const name = String(d.data().display_name || "").trim().toLowerCase();
        if (name && !byNameLower.has(name)) byNameLower.set(name, d.id);
      });

      const seen = new Set();
      for (const raw of mentions) {
        const handle = String(raw || "").trim().toLowerCase();
        if (!handle || seen.has(handle)) continue;
        seen.add(handle);

        const targetUid = byNameLower.get(handle);
        if (!targetUid || targetUid === c.uid) continue; // no self-notify

        await adminDb.collection("users").doc(targetUid)
          .collection("notifications").add({
            type: "mention",
            comment_id: event.params.commentId,
            prompt_path: c.prompt_path || "",
            from_name: c.commenter_name || "Someone",
            excerpt: String(c.comment_text || "").slice(0, 200),
            read: false,
            created_at: FieldValue.serverTimestamp()
          });
      }
    } catch (err) {
      logger.error("Failed to resolve mentions for comment", event.params.commentId, err);
    }
  }
);

// ---------------------------------------------------------------------------
// 6. Returning-visitor verification (callable, legacy access-log lookup)
// ---------------------------------------------------------------------------

exports.verifyReturningVisitor = onCall(
  {
    maxInstances: 10,
    cors: [
      "https://omarzbaba.github.io",
      /localhost(:\d+)?$/
    ]
  },
  async (request) => {
    const data = request.data || {};
    const rawEmail = String(data.email || "").trim().toLowerCase();

    if (!rawEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail) || rawEmail.length > 254) {
      throw new HttpsError("invalid-argument", "A valid email is required.");
    }

    try {
      const snap = await adminDb
        .collection("access_log")
        .where("email", "==", rawEmail)
        .limit(1)
        .get();

      if (snap.empty) return { found: false };

      const d = snap.docs[0].data();
      return {
        found: true,
        name: String(d.name || ""),
        institution: String(d.institution || ""),
        role: String(d.role || "")
      };
    } catch (err) {
      logger.error("verifyReturningVisitor failed:", err);
      throw new HttpsError("internal", "Lookup failed.");
    }
  }
);
