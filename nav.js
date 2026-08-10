/* ============================================================
   CVA Teacher Resources Hub — Shared Navigation
   Usage: Add ONE line to every resource page, just before </body>:
     <script src="nav.js"></script>
   ============================================================ */
  /* ── Google Analytics ───────────────────────────────────── */

  const GA_ID = "G-444E1VXNYV";

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src =
    "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;

  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("js", new Date());
  gtag("config", GA_ID);

(function () {
  "use strict";

  /* ── Site map ─────────────────────────────────────────────
     Add new pages here. The menu rebuilds automatically.
  ──────────────────────────────────────────────────────────── */

  const BASE = window.location.origin;

  const NAV = [
    {
      label: "Grading and Feedback",
      pages: [
        {
          title: "Academic Integrity and Paused Grading",
          href: BASE + "/grading-and-feedback/paused-grading.html"
        },
        {
          title: "Effective Feedback",
          href: BASE + "/grading-and-feedback/effective-feedback.html"
        },
        {
          title: "Grading Policy at CVA",
          href: BASE + "/grading-and-feedback/cva-grading-policy.html"
        },
        {
          title: "Resubmission Opportunities",
          href: BASE + "/grading-and-feedback/allowing-resubmissions.html"
        },
        {
          title: "Submission Expectations",
          href: BASE + "/grading-and-feedback/submission-expectations.html"
        }
      ]
    },
    {
      label: "Communication and Responsiveness",
      pages: [
        {
          title: "Email Communication",
          href:
            BASE +
            "/communication-and-responsiveness/email-communication.html"
        },
        {
          title: "Contacting Local Schools",
          href:
            BASE +
            "/communication-and-responsiveness/contacting-local-schools.html"
        },
        {
          title: "Required Email Signature",
          href:
            BASE +
            "/communication-and-responsiveness/cva-email-signature.html"
        },
        {
          title: "Who Do Students Contact?",
          href:
            BASE +
            "/communication-and-responsiveness/who-do-students-contact.html"
        }
      ]
    },
    {
      label: "Rapport and Relationships",
      pages: [
        {
          title: "Instructor Profile",
          href:
            BASE +
            "/rapport-and-relationships/instructor-profile.html"
        },
        {
          title: "Classroom Announcements",
          href:
            BASE +
            "/rapport-and-relationships/classroom-announcements.html"
        },
        {
          title: "Discussion to Drive Learning",
          href:
            BASE +
            "/rapport-and-relationships/discussions-as-learning.html"
        },
        {
          title: "Teacher Information Page",
          href:
            BASE +
            "/rapport-and-relationships/directions-for-teacher-information-page.html"
        }
      ]
    },
    {
      label: "Proactive Intervention and Student Support",
      pages: [
        {
          title: "Class Schedule",
          href:
            BASE +
            "/proactive-intervention-and-student-support/class-schedule.html"
        },
        {
          title: "Communicating Deadlines",
          href:
            BASE +
            "/proactive-intervention-and-student-support/communicating-deadlines.html"
        },
        {
          title: "Grades and Feedback Support",
          href:
            BASE +
            "/proactive-intervention-and-student-support/grades-and-feedback-support.html"
        },
        {
          title: "Progress Tracker",
          href:
            BASE +
            "/proactive-intervention-and-student-support/progress-tracker.html"
        },
        {
          title: "Practice Student View",
          href:
            BASE +
            "/proactive-intervention-and-student-support/practice-student.html"
        },
        {
          title: "Student Accommodations and Accessibility",
          href:
            BASE +
            "/proactive-intervention-and-student-support/accommodations-and-accessibility.html"
        }
      ]
    },
    {
      label: "Professionalism and Collaboration",
      pages: [
        {
          title: "Accessibility by Design",
          href:
            BASE +
            "/professionalism-and-collaboration/accessibility-by-design.html"
        },
        {
          title: "Instructional Practice Review",
          href:
            BASE +
            "/professionalism-and-collaboration/instructional-practice-review.html"
        },
        {
          title: "Professional Learning Course",
          href:
            BASE +
            "/professionalism-and-collaboration/professional-learning-course.html"
        },
        {
          title: "Views and Tools",
          href:
            BASE +
            "/professionalism-and-collaboration/views-and-tools.html"
        },
        {
          title: "Weekly Facilitation Routine",
          href:
            BASE +
            "/professionalism-and-collaboration/weekly-routine.html"
        },
        {
          title: "Synergy Gradebook Setup",
          href:
            BASE +
            "/professionalism-and-collaboration/synergy.gradebook.html"
        }
      ]
    },
    {
      label: "Technology How-To Guides",
      pages: [
        {
          title: "Keyboard Shortcuts",
          href: BASE + "/keyboard-shortcuts.html"
        },
        {
          title: "Panopto",
          href: "https://support.panopto.com/s/",
          external: true
        }
      ]
    }
  ];

  /* ── Normalize URLs for current-page detection ───────────── */

  function normalizeURL(url) {
    return url
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "");
  }

  const currentURL = normalizeURL(window.location.href);

  /* ── Styles ──────────────────────────────────────────────── */

  const style = document.createElement("style");

  style.textContent = `
    #cva-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
      line-height: 0;
      background: #ffffff;
    }

    #cva-banner img {
      width: 100%;
      height: auto;
      display: block;
    }

    #cva-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: #BB0000;
      color: #ffffff;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      z-index: 1000;
      box-sizing: border-box;
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
      background: #ffffff;
      border-radius: 2px;
      transition: transform 0.2s, opacity 0.2s;
    }

    #cva-menu-toggle.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    #cva-menu-toggle.open span:nth-child(2) {
      opacity: 0;
    }

    #cva-menu-toggle.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    #cva-header-home {
      color: #ffffff;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #cva-header-home:hover,
    #cva-header-home:focus {
      text-decoration: underline;
    }

    #cva-sidebar {
      position: fixed;
      top: 56px;
      left: -300px;
      width: 288px;
      bottom: 0;
      background: #ffffff;
      border-right: 1px solid #C8C7C7;
      overflow-y: auto;
      z-index: 999;
      transition: left 0.25s ease;
      font-family: 'Montserrat', Arial, sans-serif;
      padding-bottom: 32px;
      box-sizing: border-box;
    }

    #cva-sidebar.open {
      left: 0;
    }

    #cva-overlay {
      display: none;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.25);
      z-index: 998;
    }

    #cva-overlay.open {
      display: block;
    }

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

    .cva-nav-home:hover,
    .cva-nav-home:focus {
      background: #FAFAFA;
    }

    .cva-nav-group {
      border-bottom: 1px solid #C8C7C7;
    }

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

    .cva-nav-group-btn:hover,
    .cva-nav-group-btn:focus {
      background: #F5F5F5;
    }

    .cva-nav-group-btn .cva-arrow {
      font-size: 0.65rem;
      transition: transform 0.2s;
      flex-shrink: 0;
    }

    .cva-nav-group-btn.open .cva-arrow {
      transform: rotate(180deg);
    }

    .cva-nav-pages {
      display: none;
      padding: 0 0 6px;
      background: #F5F5F5;
    }

    .cva-nav-pages.open {
      display: block;
    }

    .cva-nav-pages a {
      display: block;
      padding: 9px 20px 9px 24px;
      font-size: 0.82rem;
      color: #222222;
      text-decoration: none;
      border-left: 3px solid transparent;
      line-height: 1.4;
    }

    .cva-nav-pages a:hover,
    .cva-nav-pages a:focus {
      background: #E8E8E8;
      border-left-color: #C8C7C7;
    }

    .cva-nav-pages a.current {
      font-weight: 700;
      color: #BB0000;
      border-left-color: #BB0000;
      background: #FFFFFF;
    }

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

    .cva-nav-external:hover,
    .cva-nav-external:focus {
      background: #FAFAFA;
    }

    .cva-nav-external .cva-ext-arrow {
      font-size: 0.7rem;
      opacity: 0.6;
    }

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
    <button
      id="cva-menu-toggle"
      type="button"
      aria-label="Open navigation menu"
      aria-expanded="false"
      aria-controls="cva-sidebar"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <a
      id="cva-header-home"
      href="${BASE}/"
    >
      CVA Teacher Resources Hub
    </a>
  `;

  document.body.prepend(header);

  /* ── Banner image ────────────────────────────────────────── */

  const banner = document.createElement("div");
  banner.id = "cva-banner";

  const bannerImg = document.createElement("img");

  bannerImg.src =
    "/images/Website Banner Teacher Resources Hub.png";

  bannerImg.alt = "Cobb Virtual Academy Teacher Resources";

  banner.appendChild(bannerImg);
  document.body.prepend(banner);

  /* ── Build sidebar ───────────────────────────────────────── */

  const sidebar = document.createElement("nav");
  sidebar.id = "cva-sidebar";
  sidebar.setAttribute("aria-label", "Resource navigation");

  let sidebarHTML = `
    <a class="cva-nav-home" href="${BASE}/">
      &#8592; Resource Hub Home
    </a>
  `;

  NAV.forEach(function (group, groupIndex) {
    const isActiveGroup = group.pages.some(function (page) {
      return normalizeURL(page.href) === currentURL;
    });

    sidebarHTML += `
      <div class="cva-nav-group">
        <button
          type="button"
          class="cva-nav-group-btn${isActiveGroup ? " open" : ""}"
          aria-expanded="${isActiveGroup}"
          aria-controls="cva-group-${groupIndex}"
          data-group="${groupIndex}"
        >
          <span>${group.label}</span>
          <span class="cva-arrow" aria-hidden="true">&#9660;</span>
        </button>

        <div
          class="cva-nav-pages${isActiveGroup ? " open" : ""}"
          id="cva-group-${groupIndex}"
        >
    `;

    group.pages.forEach(function (page) {
      const isCurrent =
        normalizeURL(page.href) === currentURL;

      const externalAttributes = page.external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";

      const externalIndicator = page.external
        ? ' <span aria-hidden="true">↗</span>'
        : "";

      sidebarHTML += `
        <a
          href="${page.href}"
          class="${isCurrent ? "current" : ""}"
          ${isCurrent ? 'aria-current="page"' : ""}
          ${externalAttributes}
        >
          ${page.title}${externalIndicator}
        </a>
      `;
    });

    sidebarHTML += `
        </div>
      </div>
    `;
  });

  sidebarHTML += `
    <div class="cva-nav-external-group">
      <a
        class="cva-nav-external"
        href="https://www.cobbk12.org/cobbvirtualacademy"
        target="_blank"
        rel="noopener noreferrer"
      >
        CVA Homepage
        <span class="cva-ext-arrow" aria-hidden="true">↗</span>
      </a>

      <a
        class="cva-nav-external"
        href="https://www.cobbk12.org/ctls-support"
        target="_blank"
        rel="noopener noreferrer"
      >
        CTLS Support
        <span class="cva-ext-arrow" aria-hidden="true">↗</span>
      </a>

      <a
        class="cva-nav-external"
        href="https://incite.educationincites.com/#/initUser"
        target="_blank"
        rel="noopener noreferrer"
      >
        CTLS Teach
        <span class="cva-ext-arrow" aria-hidden="true">↗</span>
      </a>

      <a
        class="cva-nav-external"
        href="https://synergy.cobbk12.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Synergy
        <span class="cva-ext-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  `;

  sidebar.innerHTML = sidebarHTML;
  document.body.appendChild(sidebar);

  /* ── Overlay ─────────────────────────────────────────────── */

  const overlay = document.createElement("div");
  overlay.id = "cva-overlay";
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);

  /* ── Position page elements ──────────────────────────────── */

  function updateLayout() {
    const bannerHeight = bannerImg.offsetHeight;
    const navigationTop = bannerHeight + 56;

    header.style.top = bannerHeight + "px";
    sidebar.style.top = navigationTop + "px";
    overlay.style.top = navigationTop + "px";

    document.body.style.paddingTop =
      navigationTop + 16 + "px";
  }

  bannerImg.addEventListener("load", updateLayout);
  window.addEventListener("resize", updateLayout);
  window.addEventListener("load", updateLayout);

  updateLayout();

  if (
    bannerImg.complete &&
    bannerImg.naturalHeight !== 0
  ) {
    updateLayout();
  }

  /* ── Toggle logic ────────────────────────────────────────── */

  const toggle =
    document.getElementById("cva-menu-toggle");

  function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    toggle.classList.add("open");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    overlay.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    toggle.classList.remove("open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    overlay.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    if (sidebar.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  /* ── Close menu when a page link is clicked ──────────────── */

  sidebar
    .querySelectorAll(".cva-nav-pages a")
    .forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

  /* ── Accordion groups inside the sidebar ─────────────────── */

  sidebar
    .querySelectorAll(".cva-nav-group-btn")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        const groupIndex = button.dataset.group;

        const pages = document.getElementById(
          "cva-group-" + groupIndex
        );

        const isOpen =
          button.classList.contains("open");

        button.classList.toggle("open", !isOpen);
        pages.classList.toggle("open", !isOpen);

        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );
      });
    });

  /* ── Close on Escape ─────────────────────────────────────── */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });
})();
