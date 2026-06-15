/* ============================================================
   CVA Teacher Resources — Main Navigation (nav-main.js)
   Usage: Add ONE line to every page, just before </body>:
     <script src="nav-main.js"></script>
   ============================================================ */

(function () {

  /* ── Site map ─────────────────────────────────────────────
     Add sub-pages under each section as links become available.
     External links open in a new tab automatically.
     Use href: "#" as a placeholder until real links are ready.
  ──────────────────────────────────────────────────────────── */
  const NAV = [
    {
      label: "Grading and Feedback",
      pages: [
        { title: "Grading Policy at CVA",                    href: "cva-grading-policy.html" },
        { title: "Resolving In Progress Student Work",        href: "resolving-in-progress-work.html" },
        { title: "Resubmission Opportunities",               href: "allowing-resubmissions.html" },
        { title: "Discussion to Drive Learning",             href: "discussions-as-learning.html" },
        { title: "Academic Integrity and Paused Grading",    href: "paused-grading.html" },
        { title: "Effective Feedback",                       href: "effective-feedback.html" },
      ],
    },
    {
      label: "Communication and Responsiveness",
      pages: [
        { title: "Email Communication",      href: "email-communication.html" },
        { title: "Required Email Signature", href: "cva-email-signature.html" },
        { title: "Who Do Students Contact?", href: "who-do-students-contact.html" },
      ],
    },
    {
      label: "Rapport and Relationships",
      pages: [
        { title: "Instructor Profile",      href: "https://www.cobbk12.org/cobbvirtualacademy/instructor-profile" },
        { title: "Classroom Announcements", href: "classroom-announcements.html" },
      ],
    },
    {
      label: "Proactive Intervention and Student Support",
      pages: [
        { title: "Parent Access to CTLS Learn",              href: "parent-access-to-ctls.html" },
        { title: "Navigating with CTLS Icons",               href: "https://www.cobbk12.org/cobbvirtualacademy/navigating-ctls-icons" },
        { title: "Checking Grades",                          href: "https://www.cobbk12.org/cobbvirtualacademy/checking-grades" },
        { title: "Checking Feedback",                        href: "https://www.cobbk12.org/cobbvirtualacademy/checking-feedback" },
        { title: "Student Accommodations and Accessibility", href: "accommodations-and-accessibility.html" },
        { title: "Progress Tracker",                         href: "progress-tracker.html" },
        { title: "Practice Student View",                    href: "practice-student.html" },
        { title: "Contact from Local Schools",               href: "contacting-local-schools.html" },
      ],
    },
    {
      label: "Professionalism and Collaboration",
      pages: [
        { title: "Professional Learning Course",  href: "professional-learning-course.html" },
        { title: "Instructional Practice Review", href: "instructional-practice-review.html" },
        { title: "Weekly Facilitation Routine",   href: "weekly-facilitation-routine.html" },
      ],
    },
    /* ── External tool links (no sub-pages, open in new tab) ── */
    {
      label: "CTLS Support",
      external: "https://www.cobbk12.org/ctls-support",
    },
    {
      label: "CTLS Teach",
      external: "https://incite.educationincites.com/#/initUser",
    },
    {
      label: "Synergy",
      external: "https://synergy.cobbk12.org/",
    },
  ];

  /* ── Styles ───────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    #cva-main-nav-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 48px;
      background: #BB0000;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 14px;
      z-index: 9999;
      font-family: 'Montserrat', Arial, sans-serif;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    }

    #cva-main-burger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 6px;
      background: none;
      border: none;
      flex-shrink: 0;
    }
    #cva-main-burger span {
      display: block;
      width: 20px;
      height: 2px;
      background: #fff;
      border-radius: 1px;
      transition: all 0.25s ease;
    }

    #cva-main-nav-title {
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      flex: 1;
    }

    #cva-main-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 10000;
    }
    #cva-main-overlay.open { display: block; }

    #cva-main-drawer {
      position: fixed;
      top: 0; left: 0;
      width: 280px;
      height: 100%;
      background: #fff;
      z-index: 10001;
      transform: translateX(-100%);
      transition: transform 0.28s ease;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      font-family: 'Montserrat', Arial, sans-serif;
      box-shadow: 3px 0 12px rgba(0,0,0,0.15);
    }
    #cva-main-drawer.open { transform: translateX(0); }

    #cva-main-drawer-header {
      background: #BB0000;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #cva-main-drawer-header span {
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    #cva-main-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 0 2px;
    }

    #cva-main-drawer-home {
      display: block;
      padding: 12px 16px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #BB0000;
      text-decoration: none;
      border-bottom: 2px solid #BB0000;
      background: #fff8f8;
    }
    #cva-main-drawer-home:hover { background: #fee; }

    .cva-main-group { border-bottom: 1px solid #e5e5e5; }

    .cva-main-group-btn {
      width: 100%;
      background: none;
      border: none;
      padding: 11px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #222;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s;
    }
    .cva-main-group-btn:hover { background: #f5f5f5; }
    .cva-main-group-btn .cva-main-chevron {
      font-size: 10px;
      color: #BB0000;
      transition: transform 0.2s;
    }
    .cva-main-group-btn.open .cva-main-chevron { transform: rotate(180deg); }

    .cva-main-group-pages {
      display: none;
      background: #fafafa;
      border-top: 1px solid #ececec;
    }
    .cva-main-group-pages.open { display: block; }

    .cva-main-group-pages a {
      display: block;
      padding: 9px 16px 9px 24px;
      font-size: 11px;
      color: #333;
      text-decoration: none;
      border-bottom: 1px solid #ececec;
      transition: background 0.15s, color 0.15s;
    }
    .cva-main-group-pages a:last-child { border-bottom: none; }
    .cva-main-group-pages a:hover { background: #f0e8e8; color: #BB0000; }
    .cva-main-group-pages a.active {
      color: #BB0000;
      font-weight: 700;
      background: #f5eded;
      border-left: 3px solid #BB0000;
      padding-left: 21px;
    }

    /* External direct links (no sub-pages) */
    .cva-main-external-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 16px;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #BB0000;
      text-decoration: none;
      border-bottom: 1px solid #e5e5e5;
      transition: background 0.15s;
    }
    .cva-main-external-link:hover { background: #fff8f8; }
    .cva-main-external-link .cva-ext-icon {
      font-size: 10px;
      opacity: 0.6;
    }

    #cva-main-banner {
      position: fixed;
      top: 0;
      left: 0; right: 0;
      width: 100%;
      z-index: 9998;
      line-height: 0;
    }
    #cva-main-banner img {
      width: 100%;
      height: auto;
      display: block;
    }

    body { padding-top: 72px !important; }
  `;
  document.head.appendChild(style);

  /* ── Header bar ───────────────────────────────────────── */
  const bar = document.createElement("div");
  bar.id = "cva-main-nav-bar";

  const burgerBtn = document.createElement("button");
  burgerBtn.id = "cva-main-burger";
  burgerBtn.setAttribute("aria-label", "Open navigation menu");
  burgerBtn.innerHTML = "<span></span><span></span><span></span>";
  bar.appendChild(burgerBtn);

  const title = document.createElement("span");
  title.id = "cva-main-nav-title";
  title.textContent = "Teacher Resources";
  bar.appendChild(title);



  /* ── Banner image (above nav bar) ────────────────────── */
  const banner = document.createElement("div");
  banner.id = "cva-main-banner";
  const bannerImg = document.createElement("img");
  bannerImg.src = "images/Website Banner Teacher Resources Hub.png";
  bannerImg.alt = "Cobb Virtual Academy Teacher Resources";
  banner.appendChild(bannerImg);
  document.body.insertBefore(banner, document.body.firstChild);

  /* Position nav bar below banner and adjust body padding */
  function updateLayout() {
    var bannerH = bannerImg.offsetHeight;
    bar.style.top = bannerH + "px";
    document.body.style.paddingTop = (bannerH + 48) + "px";
  }
  bannerImg.addEventListener("load", updateLayout);
  if (bannerImg.complete && bannerImg.naturalHeight !== 0) { updateLayout(); }
  window.addEventListener("resize", updateLayout);

  document.body.insertBefore(bar, document.body.children[1]);

  /* ── Overlay ──────────────────────────────────────────── */
  const overlay = document.createElement("div");
  overlay.id = "cva-main-overlay";
  document.body.appendChild(overlay);

  /* ── Drawer ───────────────────────────────────────────── */
  const drawer = document.createElement("div");
  drawer.id = "cva-main-drawer";

  const drawerHeader = document.createElement("div");
  drawerHeader.id = "cva-main-drawer-header";
  drawerHeader.innerHTML = "<span>Teacher Resources</span>";
  const closeBtn = document.createElement("button");
  closeBtn.id = "cva-main-close";
  closeBtn.setAttribute("aria-label", "Close menu");
  closeBtn.textContent = "✕";
  drawerHeader.appendChild(closeBtn);
  drawer.appendChild(drawerHeader);

  const drawerHome = document.createElement("a");
  drawerHome.id = "cva-main-drawer-home";
  drawerHome.href = "https://www.cobbvirtualacademy.org";
  drawerHome.target = "_blank";
  drawerHome.rel = "noopener";
  drawerHome.textContent = "← Back to CVA Home";
  drawer.appendChild(drawerHome);

  /* ── Build nav items ──────────────────────────────────── */
  const currentPage = location.pathname.split("/").pop() || "index.html";

  NAV.forEach(function (section) {

    /* External direct link — no sub-pages */
    if (section.external) {
      const extLink = document.createElement("a");
      extLink.className = "cva-main-external-link";
      extLink.href = section.external;
      extLink.target = "_blank";
      extLink.rel = "noopener";
      extLink.innerHTML = section.label + '<span class="cva-ext-icon">↗</span>';
      drawer.appendChild(extLink);
      return;
    }

    /* Section with sub-pages */
    const group = document.createElement("div");
    group.className = "cva-main-group";

    const btn = document.createElement("button");
    btn.className = "cva-main-group-btn";
    btn.innerHTML = section.label + '<span class="cva-main-chevron">▼</span>';

    const pages = document.createElement("div");
    pages.className = "cva-main-group-pages";

    let hasActive = false;
    section.pages.forEach(function (page) {
      const a = document.createElement("a");
      a.href = page.href;
      a.textContent = page.title;
      /* External sub-pages open in new tab */
      if (page.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      if (page.href !== "#" && page.href.split("/").pop() === currentPage) {
        a.classList.add("active");
        hasActive = true;
      }
      pages.appendChild(a);
    });

    /* Auto-expand the active section */
    if (hasActive) {
      btn.classList.add("open");
      pages.classList.add("open");
    }

    btn.addEventListener("click", function () {
      const isOpen = pages.classList.contains("open");
      /* Close all others */
      drawer.querySelectorAll(".cva-main-group-pages.open").forEach(function (el) {
        el.classList.remove("open");
      });
      drawer.querySelectorAll(".cva-main-group-btn.open").forEach(function (el) {
        el.classList.remove("open");
      });
      if (!isOpen) {
        pages.classList.add("open");
        btn.classList.add("open");
      }
    });

    group.appendChild(btn);
    group.appendChild(pages);
    drawer.appendChild(group);
  });

  document.body.appendChild(drawer);

  /* ── Open / close logic ───────────────────────────────── */
  function openMenu() {
    drawer.classList.add("open");
    overlay.classList.add("open");
  }
  function closeMenu() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  burgerBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

})();