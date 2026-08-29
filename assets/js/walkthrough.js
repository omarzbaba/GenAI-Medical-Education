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
    }

    back.addEventListener("click", function () { go(current - 1); });
    next.addEventListener("click", function () {
      go(current === steps.length - 1 ? 0 : current + 1);
    });

    nav.appendChild(back);
    nav.appendChild(dots);
    nav.appendChild(next);
    wt.appendChild(nav);
    go(0);
  });
})();
