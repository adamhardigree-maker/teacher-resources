/* ============================================================
   CVA Teacher Resources Hub — Shared Navigation
   Usage: Add ONE line to every resource page, just before </body>:
     <script src="nav.js"></script>
   ============================================================ */

(function () {

  /* ── Site map ─────────────────────────────────────────────
     Add new pages here. The menu rebuilds automatically.
  ──────────────────────────────────────────────────────────── */
  const BASE = "https://adamhardigree-maker.github.io/teacher-resources";

  const NAV = [
    {
      label: "Grading and Feedback",
      pages: [
        { title: "Academic Integrity and Paused Grading", href: BASE + "/grading-and-feedback/paused-grading.html" },
        { title: "Effective Feedback",                    href: BASE + "/grading-and-feedback/effective-feedback.html" },
          { title: "Grading Policy at CVA",                 href: BASE + "/grading-and-feedback/cva-grading-policy.html" },
          { title: "Resolving In Progress Student Work",    href: BASE + "/grading-and-feedback/resolving-in-progress-work.html" },
        { title: "Resubmission Opportunities",            href: BASE + "/grading-and-feedback/allowing-resubmissions.html" },
         { title: "Submission Expectations",               href: BASE + "/grading-and-feedback/submission-expectations.html" },
      ],
    },
    {
      label: "Communication and Responsiveness",
      pages: [
        { title: "Email Communication",      href: BASE + "/communication-and-responsiveness/email-communication.html" },
         { title: "Not Contacting Local Schools", href: BASE + "/communication-and-responsiveness/contacting-local-schools.html" },
        { title: "Required Email Signature", href: BASE + "/communication-and-responsiveness/cva-email-signature.html" },
        { title: "Who Do Students Contact?", href: BASE + "/communication-and-responsiveness/who-do-students-contact.html" },
        
      ],
    },
    {
      label: "Rapport and Relationships",
      pages: [
        { title: "Instructor Profile",           href: BASE + "/rapport-and-relationships/instructor-profile.html" },
        { title: "Classroom Announcements",      href: BASE + "/rapport-and-relationships/classroom-announcements.html" },
        { title: "Discussion to Drive Learning", href: BASE + "/rapport-and-relationships/discussions-as-learning.html" },
        { title: "Teacher Information Page", href: BASE + "/rapport-and-relationships/directions-for-teacher-information-page.html" },
      ],
    },
    {
      label: "Proactive Intervention and Student Support",
      pages: [
       
        { title: "Class Schedule",                           href: BASE + "/proactive-intervention-and-student-support/class-schedule.html" },
        { title: "Communicating Deadlines",                  href: BASE + "/proactive-intervention-and-student-support/communicating-deadlines.html" },
        { title: "Grades and Feedback Support",              href: BASE + "/proactive-intervention-and-student-support/grades-and-feedback-support.html" },
        { title: "Progress Tracker",                         href: BASE + "/proactive-intervention-and-student-support/progress-tracker.html" },
        { title: "Practice Student View",                    href: BASE + "/proactive-intervention-and-student-support/practice-student.html" },
          { title: "Student Accommodations and Accessibility", href: BASE + "/proactive-intervention-and-student-support/accommodations-and-accessibility.html" },
      ],
    },
    {
      label: "Professionalism and Collaboration",
      pages: [
 { title: "Accessibility by Design",       href: BASE + "/professionalism-and-collaboration/accessibility-by-design.html" },
        { title: "Instructional Practice Review", href: BASE + "/professionalism-and-collaboration/instructional-practice-review.html" },
           { title: "Professional Learning Course",  href: BASE + "/professionalism-and-collaboration/professional-learning-course.html" },
        { title: "Views and Tools",       href: BASE + "/professionalism-and-collaboration/views-and-tools.html" },
         { title: "Weekly Facilitation Routine",   href: BASE + "/professionalism-and-collaboration/weekly-routine.html" },
        { title: "Synergy Gradebook Setup",       href: BASE + "/professionalism-and-collaboration/synergy.gradebook.html" },
      ],
    },
  ];

  /* ── Detect current page ─────────────────────────────────── */
  const currentURL = window.location.href.split("?")[0];

  /* ── Styles ──────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    /* Padding set dynamically by JS to account for banner + nav bar */

    /* ── Banner image ── */
    #cva-banner {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1001;
      line-height: 0;
    }
    #cva-banner img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* ── Top header bar ── */
    #cva-header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 56px;
      background: #BB0000;
      color: #fff;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      z-index: 1000;
      font-family: 'Montserrat', Arial, sans-serif;
    }
    #cva-menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex-shrink: 0;
    }
    #cva-menu-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: transform 0.2s, opacity 0.2s;
    }
    #cva-menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #cva-menu-toggle.open span:nth-child(2) { opacity: 0; }
    #cva-menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    #cva-header-home {
      color: #fff;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #cva-header-home:hover { text-decoration: underline; }

    /* ── Side drawer ── */
    #cva-sidebar {
      position: fixed;
      top: 56px;
      left: -300px;
      width: 288px;
      bottom: 0;
      background: #fff;
      border-right: 1px solid #C8C7C7;
      overflow-y: auto;
      z-index: 999;
      transition: left 0.25s ease;
      font-family: 'Montserrat', Arial, sans-serif;
      padding-bottom: 32px;
    }
    #cva-sidebar.open { left: 0; }

    /* Overlay */
    #cva-overlay {
      display: none;
      position: fixed;
      inset: 56px 0 0 0;
      background: rgba(0,0,0,0.25);
      z-index: 998;
    }
    #cva-overlay.open { display: block; }

    /* Hub link at top of sidebar */
    .cva-nav-home {
      display: block;
      padding: 16px 20px 14px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #BB0000;
      text-decoration: none;
      border-bottom: 2px solid #BB0000;
    }
    .cva-nav-home:hover { background: #fafafa; }

    /* Category group */
    .cva-nav-group { border-bottom: 1px solid #C8C7C7; }

    .cva-nav-group-btn {
      width: 100%;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 13px 20px 13px 16px;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #222222;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .cva-nav-group-btn:hover { background: #F5F5F5; }
    .cva-nav-group-btn .cva-arrow {
      font-size: 0.65rem;
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .cva-nav-group-btn.open .cva-arrow { transform: rotate(180deg); }

    /* Page list inside each group */
    .cva-nav-pages {
      display: none;
      padding: 0 0 6px;
      background: #F5F5F5;
    }
    .cva-nav-pages.open { display: block; }

    .cva-nav-pages a {
      display: block;
      padding: 9px 20px 9px 24px;
      font-size: 0.82rem;
      color: #222222;
      text-decoration: none;
      border-left: 3px solid transparent;
      line-height: 1.4;
    }
    .cva-nav-pages a:hover {
      background: #e8e8e8;
      border-left-color: #C8C7C7;
    }
    .cva-nav-pages a.current {
      font-weight: 700;
      color: #BB0000;
      border-left-color: #BB0000;
      background: #fff;
    }

    /* External links at bottom of sidebar */
    .cva-nav-external {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 20px 13px 16px;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #BB0000;
      text-decoration: none;
      border-bottom: 1px solid #C8C7C7;
    }
    .cva-nav-external:hover { background: #fafafa; }
    .cva-nav-external .cva-ext-arrow { font-size: 0.7rem; opacity: 0.6; }
    .cva-nav-external-group {
      border-top: 2px solid #BB0000;
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);

  /* ── Build header ────────────────────────────────────────── */
  const header = document.createElement("div");
  header.id = "cva-header";
  header.innerHTML = `
    <button id="cva-menu-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="cva-sidebar">
      <span></span><span></span><span></span>
    </button>
    <a id="cva-header-home" href="https://adamhardigree-maker.github.io/teacher-resources/">CVA Teacher Resources Hub</a>
  `;
  document.body.prepend(header);

  /* ── Banner image ────────────────────────────────────────── */
  const banner = document.createElement("div");
  banner.id = "cva-banner";
  const bannerImg = document.createElement("img");
  const isRoot = window.location.pathname.split("/").filter(Boolean).length <= 2;
  bannerImg.src = (isRoot ? "" : "../") + "images/Website Banner Teacher Resources Hub.png";
  bannerImg.alt = "Cobb Virtual Academy Teacher Resources";
  banner.appendChild(bannerImg);
  document.body.prepend(banner);

  /* Position nav bar below banner and adjust body padding */
  function updateLayout() {
    const bannerH = bannerImg.offsetHeight;
    const sideEl = document.getElementById("cva-sidebar");
    header.style.top = bannerH + "px";
    if (sideEl) sideEl.style.top = (bannerH + 56) + "px";
    document.body.style.paddingTop = (bannerH + 56 + 16) + "px";
  }
  updateLayout();
  bannerImg.addEventListener("load", updateLayout);
  if (bannerImg.complete && bannerImg.naturalHeight !== 0) updateLayout();
  window.addEventListener("resize", updateLayout);
  window.addEventListener("load", updateLayout);

  /* ── Build sidebar ───────────────────────────────────────── */
  const sidebar = document.createElement("nav");
  sidebar.id = "cva-sidebar";
  sidebar.setAttribute("aria-label", "Resource navigation");

  let sidebarHTML = `<a class="cva-nav-home" href="https://adamhardigree-maker.github.io/teacher-resources/">&#8592; Resource Hub Home</a>`;

  NAV.forEach((group, gi) => {
    // Auto-expand the group that contains the current page
    const isActiveGroup = group.pages.some(p => p.href === currentURL);

    sidebarHTML += `
      <div class="cva-nav-group">
        <button class="cva-nav-group-btn${isActiveGroup ? " open" : ""}"
                aria-expanded="${isActiveGroup}"
                data-group="${gi}">
          ${group.label}
          <span class="cva-arrow">&#9660;</span>
        </button>
        <div class="cva-nav-pages${isActiveGroup ? " open" : ""}" id="cva-group-${gi}">
          ${group.pages.map(p => {
            const isCurrent = p.href === currentURL;
            return `<a href="${p.href}"
                       class="${isCurrent ? "current" : ""}"
                    >${p.title}</a>`;
          }).join("")}
        </div>
      </div>`;
  });

  sidebarHTML += `
    <div class="cva-nav-external-group">
      <a class="cva-nav-external" href="https://www.cobbk12.org/cobbvirtualacademy" target="_blank" rel="noopener">CVA Homepage <span class="cva-ext-arrow">↗</span></a>
      <a class="cva-nav-external" href="https://www.cobbk12.org/ctls-support" target="_blank" rel="noopener">CTLS Support <span class="cva-ext-arrow">↗</span></a>
      <a class="cva-nav-external" href="https://incite.educationincites.com/#/initUser" target="_blank" rel="noopener">CTLS Teach <span class="cva-ext-arrow">↗</span></a>
      <a class="cva-nav-external" href="https://synergy.cobbk12.org/" target="_blank" rel="noopener">Synergy <span class="cva-ext-arrow">↗</span></a>
    </div>`;

  sidebar.innerHTML = sidebarHTML;
  document.body.appendChild(sidebar);

  /* ── Overlay ─────────────────────────────────────────────── */
  const overlay = document.createElement("div");
  overlay.id = "cva-overlay";
  document.body.appendChild(overlay);

  /* ── Toggle logic ────────────────────────────────────────── */
  const toggle    = document.getElementById("cva-menu-toggle");
  const sideEl    = document.getElementById("cva-sidebar");
  const overlayEl = document.getElementById("cva-overlay");

  function openMenu() {
    sideEl.classList.add("open");
    overlayEl.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    sideEl.classList.remove("open");
    overlayEl.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    sideEl.classList.contains("open") ? closeMenu() : openMenu();
  }

  toggle.addEventListener("click", toggleMenu);
  overlayEl.addEventListener("click", closeMenu);

  /* ── Close menu when a page link is clicked ──────────────── */
  sidebar.querySelectorAll(".cva-nav-pages a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  /* ── Accordion inside sidebar ────────────────────────────── */
  sidebar.querySelectorAll(".cva-nav-group-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const gi = btn.dataset.group;
      const pages = document.getElementById(`cva-group-${gi}`);
      const isOpen = btn.classList.contains("open");
      btn.classList.toggle("open", !isOpen);
      pages.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ── Close on Escape ─────────────────────────────────────── */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

})();
