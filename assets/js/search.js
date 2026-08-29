/*
 * Library search — filters prompts by title, intent, tags, section.
 * Renders results into #search-results; hides #library-content while active.
 */
(function () {
  "use strict";

  var input = document.getElementById("lib-search");
  var results = document.getElementById("search-results");
  var content = document.getElementById("library-content");
  if (!input || !results || !content) return;

  var index = null;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureIndex() {
    if (index) return Promise.resolve(index);
    return fetch("library/search-index.json", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) { index = d; return d; });
  }

  function score(rec, terms) {
    var hay = (rec.title + " " + rec.intent + " " + rec.tags + " " +
               rec.section + " " + rec.pillar).toLowerCase();
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (hay.indexOf(t) === -1) return 0;
      s += rec.title.toLowerCase().indexOf(t) !== -1 ? 3 : 1;
    }
    return s;
  }

  function run() {
    var q = input.value.trim().toLowerCase();
    if (!q) {
      results.hidden = true;
      content.hidden = false;
      return;
    }
    ensureIndex().then(function (idx) {
      var terms = q.split(/\s+/).filter(Boolean);
      var hits = idx
        .map(function (r) { return { r: r, s: score(r, terms) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 40);
      content.hidden = true;
      results.hidden = false;
      if (!hits.length) {
        results.innerHTML = '<p class="note">No prompts match “' + esc(q) + '”.</p>';
        return;
      }
      results.innerHTML =
        '<p class="note">' + hits.length + " matching prompt" +
        (hits.length === 1 ? "" : "s") + "</p>" +
        '<div class="card-grid">' +
        hits.map(function (x) {
          var href = "library.html#/" + x.r.path.replace(/\.md$/, "");
          return '<a class="prompt-card" href="' + esc(href) + '">' +
            "<h4>" + esc(x.r.title) + "</h4>" +
            "<p>" + esc(x.r.intent.slice(0, 180)) + "</p>" +
            '<div class="meta"><span class="pill">' + esc(x.r.pillar) +
            '</span><span class="pill">' + esc(x.r.section) + "</span></div></a>";
        }).join("") +
        "</div>";
    });
  }

  var timer = null;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(run, 160);
  });
  // Clicking a result navigates within library.html; clear the filter so
  // the detail view is visible.
  results.addEventListener("click", function () {
    input.value = "";
    results.hidden = true;
    content.hidden = false;
  });
})();
