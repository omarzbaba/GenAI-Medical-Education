/* Shared behavior: copy buttons, current-nav marking. */
(function () {
  "use strict";

  // Mark the current page in the site nav.
  var here = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".site-nav a, .pillar-nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var target = new URL(href, location.href).pathname.replace(/\/+$/, "");
    if (target === here) a.setAttribute("aria-current", "page");
  });

  // Copy buttons on every promptbox.
  document.querySelectorAll(".promptbox").forEach(function (box) {
    var pre = box.querySelector("pre");
    if (!pre) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.textContent.trim()).then(function () {
        btn.textContent = "Copied";
        btn.classList.add("-done");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("-done");
        }, 1600);
      });
    });
    box.appendChild(btn);
  });
})();
