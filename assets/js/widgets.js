/*
 * Interactive widgets:
 *  1. Prompt-anatomy builder  (.anatomy)      — manuscript Figure 2
 *  2. Data-sensitivity check  (.sens-check)   — manuscript Table 6
 *  3. Tool-tier matcher       (.tier-match)   — manuscript Table 3
 *
 * All are declarative: data lives in the HTML, JS only wires behavior.
 */
(function () {
  "use strict";

  // ------------------------------------------------- 1. anatomy builder
  document.querySelectorAll(".anatomy").forEach(function (root) {
    var toggles = root.querySelectorAll(".anatomy-toggle");
    var warn = root.querySelector(".anatomy-warn");

    function refresh() {
      var offNames = [];
      toggles.forEach(function (t) {
        var on = t.getAttribute("aria-pressed") === "true";
        var seg = root.querySelector('.seg[data-seg="' + t.dataset.seg + '"]');
        if (seg) seg.classList.toggle("-off", !on);
        if (!on) offNames.push(t.dataset.warnAs || t.dataset.seg);
      });
      if (warn) {
        if (offNames.length === 0) {
          warn.innerHTML = '<div class="verdict -ok"><div class="head">All five components present</div>' +
            "This is a well-formed prompt: the model knows who it is speaking as, what it cannot infer, " +
            "what to produce, in what shape, and what to flag for you to verify.</div>";
        } else {
          warn.innerHTML = '<div class="verdict -no"><div class="head">Missing: ' + offNames.join(", ") + "</div>" +
            "Omitting a component leads the model to fall back on generic assumptions — " +
            "a default reader, a default length, and no flag on the claims you most need to check.</div>";
        }
      }
    }

    toggles.forEach(function (t) {
      t.addEventListener("click", function () {
        t.setAttribute("aria-pressed",
          t.getAttribute("aria-pressed") === "true" ? "false" : "true");
        refresh();
      });
    });
    refresh();
  });

  // ------------------------------------------- 2 & 3. chip → panel widgets
  // Contract: .chip[data-target] buttons + .widget-panel[data-panel] blocks.
  document.querySelectorAll(".chip-widget").forEach(function (root) {
    var chips = root.querySelectorAll(".chip");
    var panels = root.querySelectorAll(".widget-panel");

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (o) {
          o.setAttribute("aria-pressed", o === c ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.hidden = p.dataset.panel !== c.dataset.target;
        });
      });
    });
    // Show nothing until a choice is made; panels start hidden in HTML.
  });
})();
