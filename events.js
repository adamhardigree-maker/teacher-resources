window.evTriggerUpload = function () {
  var input = document.getElementById("ev-fileInput");
  if (input) input.click();
};

(function () {
  /*
    Calendar data file.
    Keep cva-calendar-dates.csv in the same GitHub folder as this page.
  */
  var EVENTS_URL = "cva-calendar-dates.csv";

  /*
    This calendar covers July 2026 through June 2027.
    Months JUL-DEC use 2026; JAN-JUN use 2027.
  */
  var CALENDAR_START_YEAR = 2026;

  var EV_MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];

  var evEvents = [];
  var evOpenIdx = -1;
  var EV_LIMIT = 5;
  var evShowAll = false;

  function evShow(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("ev-hidden");
  }

  function evHide(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("ev-hidden");
  }

  function evInit() {
    evSetStatus("Loading events...", false);
    fetchEvents();
  }

  function fetchEvents() {
    /*
      cache: "no-store" helps GitHub Pages request the newest CSV
      after you replace the file.
    */
    fetch(EVENTS_URL, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) {
          throw new Error("HTTP " + r.status);
        }
        return r.text();
      })
      .then(function (csv) {
        parseCSV(csv);
      })
      .catch(function (err) {
        console.error("Event calendar load error:", err);
        evSetStatus(
          "Could not load events. Please try refreshing the page.",
          true
        );
      });
  }

  /*
    Full CSV parser.
    Handles:
    - commas inside quoted cells
    - quotation marks
    - Windows/Mac line endings
    - quoted fields containing line breaks
  */
  function parseCSVText(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
      var c = text[i];

      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else {
        if (c === '"') {
          inQuotes = true;
        } else if (c === ",") {
          row.push(field);
          field = "";
        } else if (c === "\n") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (c !== "\r") {
          field += c;
        }
      }
    }

    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  }

  function parseCSV(csv) {
    var rows = parseCSVText(csv).filter(function (row) {
      return row.some(function (cell) {
        return String(cell).trim() !== "";
      });
    });

    if (rows.length < 2) {
      evSetStatus("No events found in the calendar file.", true);
      return;
    }

    var headers = rows[0].map(function (h) {
      return String(h).trim().toLowerCase();
    });

    var iMonth = headers.indexOf("month");
    var iDay = headers.indexOf("day");
    var iTitle = headers.indexOf("title");
    var iTime = headers.indexOf("time");
    var iCat = headers.indexOf("category");
    var iDetail = headers.indexOf("details");
    var iIcs = headers.indexOf("ics link");

    if (iMonth === -1 || iDay === -1 || iTitle === -1) {
      evSetStatus(
        "Calendar file is missing required columns: Month, Day, Title.",
        true
      );
      return;
    }

    evEvents = [];

    for (var i = 1; i < rows.length; i++) {
      var cols = rows[i];

      var month = String(cols[iMonth] || "")
        .trim()
        .toUpperCase()
        .slice(0, 3);

      var day = parseInt(
        String(cols[iDay] || "").trim(),
        10
      );

      var title = String(cols[iTitle] || "").trim();

      if (
        !month ||
        !day ||
        !title ||
        EV_MONTHS.indexOf(month) === -1
      ) {
        continue;
      }

      var year = eventYear(month);

      evEvents.push({
        month: month,
        day: day,
        year: year,
        date: new Date(
          year,
          EV_MONTHS.indexOf(month),
          day
        ),
        title: title,
        time:
          iTime > -1
            ? String(cols[iTime] || "All Day").trim()
            : "All Day",
        cat:
          iCat > -1
            ? String(cols[iCat] || "").trim()
            : "",
        detail:
          iDetail > -1
            ? String(cols[iDetail] || "").trim()
            : "",
        ics:
          iIcs > -1
            ? String(cols[iIcs] || "").trim()
            : ""
      });
    }

    evEvents.sort(function (a, b) {
      return a.date - b.date;
    });

    evOpenIdx = -1;
    evShowAll = false;

    evSetStatus("");
    evShow("ev-eventSection");
    evRender();
  }

  function eventYear(month) {
    /*
      JUL-DEC belong to the starting calendar year.
      JAN-JUN belong to the following calendar year.
    */
    return EV_MONTHS.indexOf(month) >= 6
      ? CALENDAR_START_YEAR
      : CALENDAR_START_YEAR + 1;
  }

  function startOfToday() {
    var d = new Date();

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
  }

  function evEsc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function evRender() {
    var list = document.getElementById("ev-eventList");

    if (!list) return;

    if (!evEvents.length) {
      list.innerHTML =
        '<div class="ev-status">No events found.</div>';
      return;
    }

    var today = startOfToday();

    /*
      Keep today's events and all later events.

      Because each event now has a real 2026 or 2027 date,
      January-June will work correctly after New Year's.
    */
    var upcoming = evEvents.filter(function (ev) {
      return ev.date >= today;
    });

    if (!upcoming.length) {
      list.innerHTML =
        '<div class="ev-status">No upcoming events.</div>';
      return;
    }

    var visible = evShowAll
      ? upcoming
      : upcoming.slice(0, EV_LIMIT);

    var hasMore =
      !evShowAll &&
      upcoming.length > EV_LIMIT;

    list.innerHTML = visible
      .map(function (ev, i) {
        var open = evOpenIdx === i;

        var dh = ev.detail
          ? "<p>" +
            evEsc(ev.detail).replace(/\n/g, "<br>") +
            "</p>"
          : "<p><em>No additional details.</em></p>";

        var ih = ev.ics
          ? '<a class="ev-cal-link" href="' +
            evEsc(ev.ics) +
            '" target="_blank" rel="noopener">Add to my calendar</a>'
          : "";

        return (
          '<div role="listitem">' +

          '<div class="ev-row" ' +
          'onclick="evToggle(' +
          i +
          ')" ' +
          'role="button" ' +
          'tabindex="0" ' +
          'aria-expanded="' +
          open +
          '" ' +
          'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();evToggle(' +
          i +
          ');}">' +

          '<div class="ev-badge" aria-hidden="true">' +
          '<span class="ev-month">' +
          evEsc(ev.month) +
          "</span>" +
          '<span class="ev-day">' +
          ev.day +
          "</span>" +
          "</div>" +

          '<div class="ev-body">' +
          '<div class="ev-title">' +
          evEsc(ev.title) +
          "</div>" +
          '<div class="ev-time">' +
          evEsc(ev.time) +
          "</div>" +
          (ev.cat
            ? '<div class="ev-cat">' +
              evEsc(ev.cat) +
              "</div>"
            : "") +
          "</div>" +

          '<div class="ev-arrow' +
          (open ? " open" : "") +
          '" aria-hidden="true">' +

          '<svg class="ev-chevron" ' +
          'xmlns="http://www.w3.org/2000/svg" ' +
          'viewBox="0 0 24 24" ' +
          'fill="none" ' +
          'stroke="currentColor" ' +
          'stroke-width="2.5" ' +
          'stroke-linecap="round" ' +
          'stroke-linejoin="round">' +

          '<path d="M9 6l6 6-6 6"/>' +
          "</svg>" +
          "</div>" +

          "</div>" +

          '<div class="ev-detail' +
          (open ? "" : " ev-hidden") +
          '" role="region">' +

          dh +
          ih +

          "</div>" +
          "</div>"
        );
      })
      .join("");

    if (hasMore) {
      list.innerHTML +=
        '<div class="ev-view-all-wrap">' +
        '<button class="ev-view-all-btn" onclick="evToggleAll()">' +
        "View All " +
        upcoming.length +
        " Events" +
        "</button>" +
        "</div>";
    } else if (
      evShowAll &&
      upcoming.length > EV_LIMIT
    ) {
      list.innerHTML +=
        '<div class="ev-view-all-wrap">' +
        '<button class="ev-view-all-btn" onclick="evToggleAll()">' +
        "Show Less" +
        "</button>" +
        "</div>";
    }
  }

  function evToggleAll() {
    evShowAll = !evShowAll;
    evOpenIdx = -1;
    evRender();
  }

  function evToggle(i) {
    evOpenIdx =
      evOpenIdx === i
        ? -1
        : i;

    evRender();
  }

  function evSetStatus(msg, isErr) {
    var el =
      document.getElementById("ev-statusMsg");

    if (!el) return;

    if (msg) {
      el.className =
        "ev-status" +
        (isErr ? " err" : "");

      el.textContent = msg;

      evShow("ev-statusMsg");
    } else {
      el.className = "";
      el.textContent = "";

      evHide("ev-statusMsg");
    }
  }

  window.evToggle = evToggle;
  window.evToggleAll = evToggleAll;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      evInit
    );
  } else {
    evInit();
  }
})();


/* ════════════════════════════════════════
   QUICK REFERENCE SEARCH
   ════════════════════════════════════════ */

(function () {

  function initSearch() {

    var inputEl =
      document.getElementById("cva-input");

    var clearBtn =
      document.getElementById("cva-clear");

    var resultsEl =
      document.getElementById("search-results");

    if (
      !inputEl ||
      !clearBtn ||
      !resultsEl
    ) {
      return;
    }

    document
      .querySelectorAll("details.quick-ref")
      .forEach(function (d) {
        d.style.display = "block";
        d.removeAttribute("hidden");
        d.removeAttribute("open");
      });

    var sectionIcons = {
      "Grading and Feedback":
        "ti-checklist",

      "Communication and Responsiveness":
        "ti-mail",

      "Rapport and Relationships":
        "ti-heart",

      "Proactive Intervention and Student Support":
        "ti-alert-circle",

      "Professionalism and Collaboration":
        "ti-users"
    };

    var cards = Array.from(
      document.querySelectorAll(
        ".info-card[id]"
      )
    ).map(function (el) {

      var title =
        (el.querySelector("h3") || {})
          .textContent || "";

      var label =
        (
          el.querySelector(
            ".info-card-label"
          ) || {}
        ).textContent || "";

      var tags =
        (
          el.querySelector(
            ".info-card-tags"
          ) || {}
        ).textContent || "";

      var acc =
        el.closest(
          "details.quick-ref"
        );

      var sumEl =
        acc
          ? acc.querySelector("summary")
          : null;

      var section = "";

      if (sumEl) {
        var clone =
          sumEl.cloneNode(true);

        var pe =
          clone.querySelector(
            ".quick-plus"
          );

        if (pe) pe.remove();

        section =
          clone.textContent.trim();
      }

      return {
        id: el.id,
        title: title.trim(),
        label: label.trim(),
        tags: tags.trim(),
        section: section
      };
    });

    var ht = null;

    function iconFor(s) {
      return (
        sectionIcons[s] ||
        "ti-file"
      );
    }

    function getText() {
      return (
        inputEl.textContent ||
        inputEl.innerText ||
        ""
      ).trim();
    }

    function clearRes() {
      resultsEl.innerHTML = "";

      resultsEl.classList.remove(
        "visible"
      );
    }

    function scrollTo(id) {
      var c =
        document.getElementById(id);

      if (!c) return;

      var a =
        c.closest(
          "details.quick-ref"
        );

      if (a) a.open = true;

      c.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      c.classList.add(
        "card-highlight"
      );

      clearTimeout(ht);

      ht = setTimeout(
        function () {
          c.classList.remove(
            "card-highlight"
          );
        },
        5000
      );
    }

    function renderRes(
      matches,
      term
    ) {

      if (!term) {
        clearRes();

        clearBtn.classList.add(
          "ev-hidden"
        );

        return;
      }

      clearBtn.classList.remove(
        "ev-hidden"
      );

      resultsEl.classList.add(
        "visible"
      );

      if (!matches.length) {

        resultsEl.innerHTML =
          '<div class="results-list">' +
          '<div class="results-empty">' +
          "No results found for &ldquo;" +
          term +
          "&rdquo;" +
          "</div>" +
          "</div>";

        return;
      }

      var rows =
        matches
          .map(function (c) {

            return (
              '<div class="result-item" data-id="' +
              c.id +
              '">' +

              '<div class="result-icon">' +
              '<i class="ti ' +
              iconFor(c.section) +
              '" aria-hidden="true"></i>' +
              "</div>" +

              "<div>" +
              '<div class="result-title">' +
              c.title +
              "</div>" +

              '<div class="result-section">' +
              c.section +
              "</div>" +
              "</div>" +

              "</div>"
            );
          })
          .join("");

      resultsEl.innerHTML =
        '<div class="results-list">' +
        rows +
        '<div class="results-hint">' +
        "Click a result to jump to that card" +
        "</div>" +
        "</div>";

      resultsEl
        .querySelectorAll(
          ".result-item"
        )
        .forEach(function (item) {

          item.addEventListener(
            "click",
            function () {
              scrollTo(
                item.dataset.id
              );
            }
          );
        });
    }

    function doSearch() {

      var t =
        getText().toLowerCase();

      if (!t) {
        clearRes();

        clearBtn.classList.add(
          "ev-hidden"
        );

        return;
      }

      var m =
        cards.filter(function (c) {

          return (
            c.title +
            " " +
            c.label +
            " " +
            c.section +
            " " +
            c.tags
          )
            .toLowerCase()
            .includes(t);
        });

      renderRes(m, t);
    }

    inputEl.addEventListener(
      "input",
      doSearch
    );

    inputEl.addEventListener(
      "keydown",
      function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      }
    );

    inputEl.addEventListener(
      "paste",
      function (e) {

        e.preventDefault();

        var t =
          (
            e.clipboardData ||
            window.clipboardData
          ).getData(
            "text/plain"
          );

        document.execCommand(
          "insertText",
          false,
          t
        );
      }
    );

    clearBtn.addEventListener(
      "click",
      function () {

        inputEl.textContent = "";

        clearRes();

        clearBtn.classList.add(
          "ev-hidden"
        );

        inputEl.focus();
      }
    );

    clearBtn.addEventListener(
      "keydown",
      function (e) {

        if (
          e.keyCode === 13 ||
          e.keyCode === 32
        ) {
          e.preventDefault();

          inputEl.textContent = "";

          clearRes();

          clearBtn.classList.add(
            "ev-hidden"
          );

          inputEl.focus();
        }
      }
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initSearch
    );
  } else {
    initSearch();
  }
})();