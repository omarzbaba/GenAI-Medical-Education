/*
 * Walkthrough player — progressive enhancement.
 *
 * Markup contract: a .walkthrough element containing .wt-step children
 * inside a .wt-body. Without JS all steps render stacked (fully readable).
 * With JS, steps become a stepper with Back / Next and progress dots.
 */
(function () {
  "use strict";

  document.querySelectorAll(".walkthrough").forEach(function (wt) {
    var steps = Array.prototype.slice.call(wt.querySelectorAll(".wt-step"));
    if (steps.length < 2) return;

    var current = 0;

    var nav = document.createElement("div");
    nav.className = "wt-nav";

    var live = document.createElement("span");
    live.className = "wt-live";
    live.setAttribute("aria-live", "polite");
    live.style.cssText =
      "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";

    var counter = document.createElement("span");
    counter.className = "wt-counter";
    counter.setAttribute("aria-hidden", "true");
    counter.style.cssText =
      "font-size:0.875rem;color:var(--ink-faint);min-width:4.5rem";

    var back = document.createElement("button");
    back.type = "button";
    back.className = "btn";
    back.textContent = "← Back";

    var dots = document.createElement("div");
    dots.className = "dots";
    dots.setAttribute("role", "tablist");
    var dotEls = steps.map(function (s, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("aria-label", "Step " + (i + 1) + " of " + steps.length);
      d.addEventListener("click", function () { go(i); });
      dots.appendChild(d);
      return d;
    });

    var next = document.createElement("button");
    next.type = "button";
    next.className = "btn -primary";

    function go(i) {
      current = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, j) {
        s.classList.toggle("-active", j === current);
      });
      dotEls.forEach(function (d, j) {
        if (j === current) d.setAttribute("aria-current", "step");
        else d.removeAttribute("aria-current");
      });
      back.disabled = current === 0;
      next.textContent = current === steps.length - 1
        ? "Start over"
        : "Next →";
      counter.textContent = "Step " + (current + 1) + " of " + steps.length;
      var h = steps[current].querySelector("h4");
      live.textContent = "Step " + (current + 1) + " of " + steps.length +
        (h ? ": " + h.textContent : "");
    }

    back.addEventListener("click", function () { go(current - 1); });
    next.addEventListener("click", function () {
      go(current === steps.length - 1 ? 0 : current + 1);
    });

    nav.appendChild(back);
    nav.appendChild(counter);
    nav.appendChild(dots);
    nav.appendChild(next);
    nav.appendChild(live);
    wt.appendChild(nav);

    // Arrow-key navigation while focus is inside the walkthrough.
    wt.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(current + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { go(current - 1); e.preventDefault(); }
    });

    go(0);
  });
})();
