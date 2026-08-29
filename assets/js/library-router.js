/*
 * Library router — loads and renders content into library.html.
 *
 * Views:
 *  - No hash            → full library overview (every pillar, card grid)
 *  - #/library/<pillar-dir>/index → one pillar's card grid
 *  - any other path     → markdown detail view (prompt or guide)
 *
 * marked.js parses Markdown; DOMPurify sanitizes before injection.
 */
(function () {
  "use strict";

  var contentEl = document.getElementById("library-content");
  var manifest = null;

  // ------------------------------------------------------------- routing
  function parseHash() {
    var h = window.location.hash || "";
    if (h.charAt(0) === "#") h = h.slice(1);
    if (h.charAt(0) === "/") h = h.slice(1);
    if (!h) return null;
    var parts = [];
    var segs = h.split("/");
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if (!seg || seg === ".") continue;
      if (seg === "..") { if (parts.length) parts.pop(); continue; }
      if (!/^[A-Za-z0-9_\-]+$/.test(seg)) return null;
      parts.push(seg);
    }
    if (!parts.length) return null;
    return parts.join("/") + ".md";
  }

  function pillarDirFromPath(path) {
    var m = path.match(/^library\/(pillar-[^\/]+)\/index\.md$/);
    return m ? m[1] : null;
  }

  function ensureManifest() {
    if (manifest) return Promise.resolve(manifest);
    return fetch("library/manifest.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (m) { manifest = m; return m; })
      .catch(function () { return null; });
  }

  function load() {
    var path = parseHash();
    ensureManifest().then(function (m) {
      if (!path) {
        if (m) renderOverview(m);
        else renderError("The library manifest could not be loaded.");
        return;
      }
      var dir = pillarDirFromPath(path);
      if (dir && m) {
        var pillar = null;
        for (var i = 0; i < m.pillars.length; i++) {
          if (m.pillars[i].dir === dir) pillar = m.pillars[i];
        }
        if (pillar) { renderPillar(pillar); return; }
      }
      fetch(path, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.text();
        })
        .then(function (text) { renderDetail(text, path); })
        .catch(function (err) {
          renderError("That document could not be loaded (" + err.message + ").");
        });
    });
  }

  // ------------------------------------------------------------ helpers
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function setTitle(t) {
    if (t) document.title = t + " — GenAI in Medical Education";
  }

  function parseFrontmatter(src) {
    if (src.indexOf("---\n") !== 0 && src.indexOf("---\r\n") !== 0) {
      return { data: {}, body: src };
    }
    var end = src.indexOf("\n---", 4);
    if (end < 0) return { data: {}, body: src };
    var block = src.slice(4, end);
    var body = src.slice(end + 4).replace(/^\r?\n/, "");
    var data = {};
    block.split(/\r?\n/).forEach(function (raw) {
      var m = raw.trim().match(/^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/);
      if (m) data[m[1]] = m[2].trim();
    });
    return { data: data, body: body };
  }

  // ------------------------------------------------------------- render
  function cardHtml(p) {
    var href = "library.html#/" + p.path.replace(/\.md$/, "");
    return '<a class="prompt-card" href="' + esc(href) + '">' +
      "<h4>" + esc(p.title) + "</h4>" +
      "<p>" + esc(p.intent) + "</p>" +
      '<div class="meta">' +
      (p.difficulty ? '<span class="pill">' + esc(p.difficulty) + "</span>" : "") +
      (p.time_to_use ? '<span class="pill">' + esc(p.time_to_use) + "</span>" : "") +
      (p.best_model ? '<span class="pill -accent">' + esc(p.best_model) + "</span>" : "") +
      "</div></a>";
  }

  function sectionsHtml(pillar) {
    return pillar.sections.map(function (s) {
      return '<h3 class="lib-section-title">' + esc(s.title) +
        ' <span class="n">' + s.prompts.length + " prompts</span></h3>" +
        '<div class="card-grid">' + s.prompts.map(cardHtml).join("") + "</div>";
    }).join("");
  }

  function renderPillar(pillar) {
    setTitle(pillar.title);
    contentEl.innerHTML =
      "<h1>" + esc(pillar.title) + "</h1>" +
      '<p class="lede">' + esc(pillar.tagline) + "</p>" +
      sectionsHtml(pillar);
    window.scrollTo(0, 0);
  }

  function renderOverview(m) {
    setTitle("Prompt Library");
    var total = 0;
    m.pillars.forEach(function (p) {
      p.sections.forEach(function (s) { total += s.prompts.length; });
    });
    contentEl.innerHTML =
      "<h1>Prompt Library</h1>" +
      '<p class="lede">' + total + " prompts across the framework’s four pillars. " +
      "Every entry pairs a prompt with its intent, expected output, common failure modes, " +
      "and a required human-verification step.</p>" +
      m.pillars.map(function (p) {
        return "<h2>" + esc(p.title) + "</h2><p>" + esc(p.tagline) + "</p>" + sectionsHtml(p);
      }).join("");
    window.scrollTo(0, 0);
  }

  var META_LABELS = {
    pillar: "Pillar", audience: "Audience", difficulty: "Difficulty",
    time_to_use: "Time to use", tags: "Tags", best_model: "Best model",
    source: "Source", last_updated: "Updated"
  };

  function metaHtml(data) {
    var rows = [];
    Object.keys(META_LABELS).forEach(function (k) {
      if (data[k] && data[k] !== "n/a") {
        rows.push('<span class="pill">' + esc(META_LABELS[k]) + ": " + esc(data[k]) + "</span>");
      }
    });
    return rows.length ? '<div class="chip-row" style="margin-top:0">' + rows.join(" ") + "</div>" : "";
  }

  function renderDetail(text, path) {
    var parsed = parseFrontmatter(text);
    setTitle(parsed.data.title || path);
    if (!window.marked || !window.DOMPurify) {
      renderError("Renderer not loaded.");
      return;
    }
    var raw = window.marked.parse(parsed.body, { mangle: false });
    var clean = window.DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    contentEl.innerHTML =
      (parsed.data.title ? "<h1>" + esc(parsed.data.title) + "</h1>" : "") +
      metaHtml(parsed.data) + clean;

    contentEl.querySelectorAll("a[href]").forEach(function (a) {
      if (/^https?:\/\//i.test(a.getAttribute("href") || "")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
    contentEl.querySelectorAll("pre").forEach(function (pre) {
      var wrap = document.createElement("div");
      wrap.className = "promptbox";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.innerText.trim()).then(function () {
          btn.textContent = "Copied";
          btn.classList.add("-done");
          setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("-done");
          }, 1600);
        });
      });
      wrap.appendChild(btn);
    });
    window.scrollTo(0, 0);
  }

  function renderError(msg) {
    contentEl.innerHTML =
      '<div class="verdict -no"><div class="head">' + esc(msg) + "</div>" +
      'Return to the <a href="library.html">library overview</a>.</div>';
  }

  // ---------------------------------------------------------------- boot
  window.addEventListener("hashchange", load);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
