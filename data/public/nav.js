// ============================================================
//  WASTELAND SCAVENGER — nav.js
//  Drop this file in: data/public/nav.js
//  Then add ONE line to every HTML page (see bottom of file)
// ============================================================

(function () {
  // --- 1. Define all 8 routes ---
  const NAV_LINKS = [
    { label: "⌂ Camp",        href: "index.html" },
    { label: "✦ Enlist",      href: "register.html" },
    { label: "◉ Profile",     href: "profile.html" },
    { label: "⚡ Expedition",  href: "expedition.html" },
    { label: "⚙ Bunker",      href: "bunker-control.html" },
    { label: "☢ Admin",       href: "admin-dashboard.html" },
    { label: "📋 Checkpoints", href: "checkpoints.html" },
    { label: "☠ Debrief",     href: "game-over.html" },
  ];

  // --- 2. Figure out which page we're on so we can highlight it ---
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  // --- 3. Build the nav HTML ---
  const linksHTML = NAV_LINKS.map(({ label, href }) => {
    const isActive = href === currentFile;
    return `<a href="${href}" class="nav-link${isActive ? " nav-active" : ""}">${label}</a>`;
  }).join("");

  const navHTML = `
    <nav id="wasteland-nav">
      <div class="nav-brand">☢ WASTELAND</div>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle nav">☰</button>
      <div class="nav-links" id="navLinks">
        ${linksHTML}
      </div>
    </nav>
  `;

  // --- 4. Inject nav as the very first thing inside <body> ---
  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // --- 5. Hamburger toggle for mobile ---
  document.getElementById("navToggle").addEventListener("click", function () {
    document.getElementById("navLinks").classList.toggle("nav-open");
  });

  // --- 6. Inject the CSS (so you only need one file, not two) ---
  const style = document.createElement("style");
  style.textContent = `
    /* ── Reset & base offset so nav doesn't cover content ── */
    body { padding-top: 56px; }

    /* ── Nav bar ── */
    #wasteland-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
      height: 56px;
      background: #0a0f1a;
      border-bottom: 2px solid #f0c030;
      display: flex;
      align-items: center;
      padding: 0 1.2rem;
      gap: 1rem;
      font-family: 'Courier New', Courier, monospace;
      box-shadow: 0 2px 16px rgba(240,192,48,0.15);
    }

    /* ── Brand / logo ── */
    .nav-brand {
      color: #f0c030;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      white-space: nowrap;
      margin-right: auto;    /* pushes links to the right */
    }

    /* ── Link container ── */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      flex-wrap: nowrap;
    }

    /* ── Individual links ── */
    .nav-link {
      color: #8ab4c0;
      text-decoration: none;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.3rem 0.55rem;
      border: 1px solid transparent;
      border-radius: 3px;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: #f0c030;
      border-color: #f0c03055;
      background: #f0c03010;
    }

    /* ── Active / current page ── */
    .nav-active {
      color: #f0c030 !important;
      border-color: #f0c030 !important;
      background: #f0c03018 !important;
    }

    /* ── Hamburger (hidden on desktop) ── */
    .nav-toggle {
      display: none;
      background: none;
      border: 1px solid #f0c030;
      color: #f0c030;
      font-size: 1.1rem;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      border-radius: 3px;
      margin-left: auto;
    }

    /* ── Mobile: collapse into dropdown ── */
    @media (max-width: 768px) {
      .nav-toggle { display: block; }

      .nav-links {
        display: none;
        position: fixed;
        top: 56px; left: 0; right: 0;
        background: #0a0f1a;
        border-bottom: 2px solid #f0c030;
        flex-direction: column;
        align-items: flex-start;
        padding: 0.75rem 1.2rem 1rem;
        gap: 0.4rem;
      }

      .nav-links.nav-open { display: flex; }

      .nav-link { font-size: 0.85rem; width: 100%; }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
//  HOW TO ADD THIS TO EVERY PAGE — just paste this ONE line
//  right before the closing </body> tag on each HTML file:
//
//    <script src="nav.js"></script>
//
//  That's it. The nav appears automatically on every page.
// ============================================================