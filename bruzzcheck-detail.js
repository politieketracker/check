/*
  BRUZZ Check - detail page (one shared file for all promise pages)
  Per page you only need this:
    <div class="bruzz-promise-detail" data-slug="PROMISE-KEY" data-timeline="#test"></div>
    <script src="https://YOUR-ADDRESS/bruzzcheck-detail.js"></script>
  data-slug      the "Promise key" of the promise in Baserow (or its row id)
  data-timeline  (optional) selector of the CMS article list that becomes the timeline
  data-overview  (optional) address of the overview page, for the back button
  data-api       (optional) address of the Cloudflare Worker, if different from the default below
*/
(function () {
  "use strict";
  var DEFAULT_API = "https://bruzzcheck-api.webmaster-dfe.workers.dev";
  var DEFAULT_OVERVIEW = "/node/217403";

  var MOUNT = document.querySelector(".bruzz-promise-detail");
  if (!MOUNT || MOUNT.getAttribute("data-bc-ready")) return;
  MOUNT.setAttribute("data-bc-ready", "1");

  var CONFIG = {
    slug: MOUNT.getAttribute("data-slug") || "",
    timeline: MOUNT.getAttribute("data-timeline") || "#timeline-artikels",
    overview: MOUNT.getAttribute("data-overview") || DEFAULT_OVERVIEW,
    api: MOUNT.getAttribute("data-api") || DEFAULT_API
  };

  MOUNT.id = "promise-detail-embed";
  var style = document.createElement("style");
  style.setAttribute("data-bruzzcheck", "");
  style.textContent = "    /* =====================================================================\n       BRUZZ Check - detail page (Zacht)\n       Same look as the overview: soft pink page, white rounded cards,\n       status colours on the titles, thin red focus outlines.\n       ===================================================================== */\n\n    /* ---------- tokens + reset ---------- */\n    #promise-detail-embed {\n      --pd-red: #ff0033;\n      --pd-pink: #FA79D7;\n      --pd-ink: #17171c;\n      --pd-text: #17171c;\n      --pd-muted: #6b6b75;\n      --pd-bg: #fff9fb;\n      --pd-tint: #FFE9EE;\n      --pd-field: #FFF2F5;\n      --pd-line: #FFE0E6;\n      --pd-line-strong: #FFE0E6;\n      --pd-radius: 22px;\n      --pd-shadow: 0 1px 2px rgba(60, 10, 25, .035), 0 14px 30px -24px rgba(255, 0, 51, .16);\n      --pd-ease: cubic-bezier(.2, .8, .2, 1);\n      --pd-status-color: #80E4DF;\n      --pd-status-bg: #eaf7fc;\n      --pd-title-color: #ff0033;\n\n      position: relative;\n      width: 100%;\n      max-width: 100%;\n      overflow-x: clip;\n      color: var(--pd-ink);\n      font: inherit;\n      line-height: 1.45;\n      -webkit-text-size-adjust: 100%;\n    }\n\n    #promise-detail-embed *,\n    #promise-detail-embed *::before,\n    #promise-detail-embed *::after { box-sizing: border-box; }\n\n    #promise-detail-embed [hidden] { display: none !important; }\n\n    #promise-detail-embed h1,\n    #promise-detail-embed h2,\n    #promise-detail-embed h3,\n    #promise-detail-embed p { margin: 0; }\n\n    #promise-detail-embed a { color: inherit; text-decoration: none; }\n\n    #promise-detail-embed button,\n    #promise-detail-embed input,\n    #promise-detail-embed select {\n      font: inherit;\n      color: inherit;\n      letter-spacing: inherit;\n    }\n\n    #promise-detail-embed button {\n      appearance: none;\n      -webkit-appearance: none;\n      margin: 0;\n      cursor: pointer;\n      text-align: inherit;\n    }\n\n    #promise-detail-embed button:focus-visible,\n    #promise-detail-embed a:focus-visible {\n      outline: 1.5px solid var(--pd-red);\n      outline-offset: 3px;\n    }\n\n    #promise-detail-embed strong { color: var(--pd-ink); font-weight: 800; }\n\n    /* ---------- icons ---------- */\n    #promise-detail-embed .pd-icon {\n      display: inline-block;\n      flex: none;\n      width: 1.25em;\n      height: 1.25em;\n      font-size: 20px;\n    }\n\n    #promise-detail-embed .pd-sym {\n      position: relative;\n      display: inline-block;\n      flex: none;\n      width: var(--sym, 20px);\n      height: var(--sym, 20px);\n    }\n\n    #promise-detail-embed .pd-sym-fallback {\n      position: absolute;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      border-radius: 50%;\n      background: var(--pd-sym-color, var(--pd-status-color));\n      color: #fff;\n      font-size: calc(var(--sym, 20px) * .56);\n      font-weight: 800;\n      line-height: 1;\n    }\n\n    #promise-detail-embed .pd-sym-img {\n      position: absolute;\n      inset: 0;\n      width: 100%;\n      height: 100%;\n      object-fit: contain;\n      display: block;\n    }\n\n    /* ---------- page ---------- */\n    #promise-detail-embed .pd-app {\n      width: 100%;\n      margin: 0;\n      /* the pink fills the whole embed; the content keeps a maximum width and stays centred */\n      padding: 26px max(clamp(20px, 4vw, 52px), calc((100% - 1146px) / 2)) 56px;\n      background: var(--pd-bg);\n    }\n\n    #promise-detail-embed .pd-back {\n      display: inline-flex;\n      align-items: center;\n      gap: 10px;\n      margin: 0 0 24px;\n      padding: 13px 24px 13px 16px;\n      border-radius: 999px;\n      background: var(--pd-red);\n      box-shadow: 0 12px 24px -14px rgba(255, 0, 51, .7);\n      color: #fff;\n      font-size: 16px;\n      font-weight: 800;\n      line-height: 1.1;\n      text-decoration: none;\n      transition: background-color .2s var(--pd-ease);\n    }\n\n    #promise-detail-embed .pd-back::before {\n      content: \"\";\n      width: 20px;\n      height: 20px;\n      background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M16 10H4.5M9.5 4.5 4 10l5.5 5.5' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") center / contain no-repeat;\n    }\n\n    #promise-detail-embed .pd-back:hover { background: #e6002f; }\n\n    #promise-detail-embed .pd-shell {\n      display: grid;\n      gap: 48px;\n      max-width: 100%;\n      min-width: 0;\n    }\n\n    /* ---------- hero ---------- */\n    #promise-detail-embed .pd-hero {\n      display: grid;\n      grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);\n      gap: 24px;\n      align-items: stretch;\n      min-width: 0;\n    }\n\n    #promise-detail-embed .pd-promise-panel,\n    #promise-detail-embed .pd-verdict-card {\n      min-width: 0;\n      border-radius: var(--pd-radius);\n      background: #fff;\n      box-shadow: var(--pd-shadow);\n    }\n\n    #promise-detail-embed .pd-promise-panel {\n      position: relative;\n      display: flex;\n      align-items: stretch;\n      min-height: 480px;\n      overflow: hidden;\n      isolation: isolate;\n      background: #07080c;\n      color: #fff;\n    }\n\n    /* the hero image fills the top of the card, like the cards in the overview */\n    #promise-detail-embed .pd-promise-panel::before {\n      content: \"\";\n      position: absolute;\n      inset: 0;\n      z-index: -2;\n      background-image:\n        linear-gradient(90deg, rgba(5, 6, 10, .95) 0%, rgba(5, 6, 10, .84) 32%, rgba(5, 6, 10, .48) 64%, rgba(5, 6, 10, .16) 100%),\n        var(--pd-hero-image, linear-gradient(90deg, #08090d, #24242a));\n      background-size: cover;\n      background-position: var(--pd-image-focus, center center);\n      filter: saturate(.96) contrast(1.04);\n    }\n\n    #promise-detail-embed .pd-promise-panel::after {\n      content: \"\";\n      position: absolute;\n      inset: 0;\n      z-index: -1;\n      pointer-events: none;\n      background:\n        radial-gradient(circle at 18% 26%, rgba(255, 255, 255, .08), transparent 26%),\n        linear-gradient(180deg, rgba(0, 0, 0, .04), rgba(0, 0, 0, .34));\n    }\n\n    #promise-detail-embed .pd-promise-panel::after {\n      content: \"\";\n      position: absolute;\n      inset: 0;\n      z-index: -1;\n      pointer-events: none;\n      background: linear-gradient(180deg, rgba(0, 0, 0, .05) 0%, rgba(0, 0, 0, .45) 100%);\n    }\n\n    #promise-detail-embed .pd-hero-emoji {\n      position: absolute;\n      top: 36px;\n      right: 8%;\n      font-size: 96px;\n      line-height: 1;\n      filter: drop-shadow(0 6px 20px rgba(0, 0, 0, .4));\n    }\n\n    #promise-detail-embed .pd-promise-content {\n      display: flex;\n      flex-direction: column;\n      gap: 14px;\n      width: 100%;\n      min-height: 100%;\n      padding: clamp(26px, 3.1vw, 38px);\n    }\n\n    #promise-detail-embed .pd-eyebrow,\n    #promise-detail-embed .pd-kicker {\n      display: inline-flex;\n      align-items: center;\n      align-self: flex-start;\n      gap: 6px;\n      margin: 0;\n      padding: 7px 11px 6px;\n      border: 1px solid rgba(255, 255, 255, .24);\n      border-radius: 999px;\n      background: var(--pd-red);\n      color: #fff;\n      font-size: 11px;\n      font-weight: 900;\n      line-height: 1;\n      letter-spacing: .055em;\n      text-transform: uppercase;\n      white-space: nowrap;\n    }\n\n    #promise-detail-embed .pd-eyebrow .pd-icon,\n    #promise-detail-embed .pd-kicker .pd-icon { color: #fff; font-size: 15px; }\n\n    #promise-detail-embed .pd-title {\n      max-width: 13.5ch;\n      margin: 12px 0 0;\n      color: #fff;\n      font-size: clamp(38px, 4.3vw, 60px);\n      line-height: .96;\n      font-weight: 950;\n      letter-spacing: -.055em;\n      text-wrap: balance;\n      text-shadow: 0 2px 18px rgba(0, 0, 0, .32);\n    }\n\n    #promise-detail-embed .pd-title.pd-title-long {\n      max-width: 15.5ch;\n      font-size: clamp(32px, 3.45vw, 51px);\n      line-height: 1;\n    }\n\n    #promise-detail-embed .pd-hero-details {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      align-items: start;\n      gap: 18px;\n      max-width: 720px;\n      margin-top: auto;\n      padding-top: 22px;\n      border-top: 1px solid rgba(255, 255, 255, .22);\n    }\n\n    #promise-detail-embed .pd-hero-detail {\n      display: grid;\n      grid-template-columns: auto minmax(0, 1fr);\n      align-items: start;\n      gap: 12px;\n      min-width: 0;\n    }\n\n    #promise-detail-embed .pd-hero-detail .pd-icon {\n      display: block;\n      box-sizing: content-box;\n      width: 18px;\n      height: 18px;\n      padding: 7px;\n      border: 1px solid rgba(255, 255, 255, .44);\n      border-radius: 50%;\n      background: rgba(0, 0, 0, .12);\n      color: #fff;\n      font-size: 18px;\n    }\n\n    /* several ministers: a list, each with their own photo */\n    #promise-detail-embed .pd-hero-detail-list { grid-template-columns: minmax(0, 1fr); }\n    #promise-detail-embed .pd-hero-detail-list .pd-hero-detail-label { margin-bottom: 8px; }\n    #promise-detail-embed .pd-minister-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }\n    #promise-detail-embed .pd-minister-row { display: flex; align-items: center; gap: 12px; margin: 0; padding: 0; }\n\n    #promise-detail-embed .pd-hero-avatar {\n      display: block;\n      box-sizing: border-box;\n      width: 34px;\n      height: 34px;\n      border: 1px solid rgba(255, 255, 255, .44);\n      border-radius: 50%;\n      object-fit: cover;\n      background: #000;\n      filter: grayscale(100%) contrast(1.04);\n    }\n\n\n    #promise-detail-embed .pd-hero-detail-label {\n      display: block;\n      margin-bottom: 3px;\n      color: rgba(255, 255, 255, .68);\n      font-size: 11px;\n      line-height: 1.15;\n      font-weight: 900;\n      letter-spacing: .06em;\n      text-transform: uppercase;\n    }\n\n    #promise-detail-embed .pd-hero-detail-value {\n      color: #fff;\n      font-size: 12px;\n      line-height: 1.35;\n      font-weight: 800;\n    }\n\n    #promise-detail-embed .pd-hero-detail-value a {\n      color: #fff;\n      font-weight: 850;\n      text-decoration: underline;\n      text-decoration-color: rgba(255, 255, 255, .58);\n      text-decoration-thickness: 1px;\n      text-underline-offset: 3px;\n    }\n\n    #promise-detail-embed .pd-hero-detail-value a:hover { color: #fff; text-decoration-color: #fff; }\n\n    /* ---------- verdict ---------- */\n    #promise-detail-embed .pd-verdict-card {\n      display: grid;\n      grid-template-rows: auto 1fr;\n      overflow: hidden;\n      background: #fff;\n    }\n\n    #promise-detail-embed .pd-verdict-card strong { color: inherit; }\n\n    #promise-detail-embed .pd-verdict-head {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 16px;\n      padding: 20px 26px;\n      background: var(--pd-status-color);\n      color: var(--pd-on-status, var(--pd-ink));\n    }\n\n    #promise-detail-embed .pd-verdict-title {\n      margin: 0;\n      color: inherit;\n      font-size: 22px;\n      line-height: 1.1;\n      font-weight: 800;\n      letter-spacing: -.02em;\n    }\n\n    #promise-detail-embed .pd-status-pill,\n    #promise-detail-embed .pd-update-status-pill {\n      --sym: 20px;\n      display: inline-flex;\n      align-items: center;\n      flex: 0 0 auto;\n      gap: 7px;\n      padding: 5px 13px 5px 6px;\n      border-radius: 999px;\n      background: #fff;\n      box-shadow: 0 1px 6px rgba(0, 0, 0, .08);\n      color: var(--pd-ink);\n      font-size: 13px;\n      font-weight: 700;\n      line-height: 1.2;\n      white-space: nowrap;\n    }\n\n    #promise-detail-embed .pd-verdict-body {\n      display: grid;\n      align-content: start;\n      gap: 16px;\n      padding: 22px 26px 24px;\n    }\n\n    #promise-detail-embed .pd-verdict-lead {\n      margin: 0;\n      color: var(--pd-ink);\n      font-size: 15px;\n      line-height: 1.5;\n    }\n\n    /* the size is set on the paragraphs themselves, so the site's own paragraph size cannot override it */\n    #promise-detail-embed .pd-verdict-lead p,\n    #promise-detail-embed .pd-verdict-lead li { font-size: 15px; line-height: 1.5; }\n\n    #promise-detail-embed .pd-verdict-evidence {\n      display: grid;\n      gap: 9px;\n      padding: 16px 18px;\n      border-radius: 16px;\n      background: var(--pd-field);\n    }\n\n    #promise-detail-embed .pd-verdict-evidence-title {\n      margin: 0;\n      color: var(--pd-ink);\n      font-size: 14px;\n      line-height: 1.3;\n      font-weight: 800;\n    }\n\n    #promise-detail-embed .pd-verdict-evidence-list {\n      margin: 0;\n      padding-left: 18px;\n      color: #3a3a42;\n      font-size: 14px;\n      line-height: 1.5;\n    }\n\n    #promise-detail-embed .pd-verdict-evidence-list li + li { margin-top: 4px; }\n\n    #promise-detail-embed .pd-verdict-meta {\n      display: grid;\n      gap: 9px;\n      margin-top: auto;\n      padding-top: 16px;\n      border-top: 1px solid var(--pd-line);\n      color: var(--pd-muted);\n      font-size: 12.5px;\n      line-height: 1.35;\n    }\n\n    #promise-detail-embed .pd-verdict-meta-row {\n      display: grid;\n      grid-template-columns: 22px minmax(0, 1fr);\n      align-items: start;\n      gap: 8px;\n    }\n\n    #promise-detail-embed .pd-verdict-meta .pd-icon { color: var(--pd-red); font-size: 18px; }\n    #promise-detail-embed .pd-verdict-meta strong { color: var(--pd-ink); font-weight: 800; }\n\n    /* ---------- sections ---------- */\n    #promise-detail-embed .pd-section { max-width: 100%; min-width: 0; }\n    #promise-detail-embed .pd-section-head { margin-bottom: 18px; }\n\n    #promise-detail-embed .pd-section-title {\n      margin: 0;\n      color: var(--pd-ink);\n      font-size: 26px;\n      line-height: 1.1;\n      font-weight: 600;\n      letter-spacing: -.01em;\n    }\n\n    #promise-detail-embed .pd-copy,\n    #promise-detail-embed .pd-method-copy,\n    #promise-detail-embed .pd-update-body,\n    #promise-detail-embed .pd-fact-copy { color: var(--pd-ink); }\n\n    #promise-detail-embed .pd-verdict-lead p,\n    #promise-detail-embed .pd-copy p,\n    #promise-detail-embed .pd-method-copy p,\n    #promise-detail-embed .pd-update-body p,\n    #promise-detail-embed .pd-quote-text p,\n    #promise-detail-embed .pd-fact-copy p { margin: 0 0 10px; }\n\n    #promise-detail-embed .pd-verdict-lead p:last-child,\n    #promise-detail-embed .pd-copy p:last-child,\n    #promise-detail-embed .pd-method-copy p:last-child,\n    #promise-detail-embed .pd-update-body p:last-child,\n    #promise-detail-embed .pd-quote-text p:last-child,\n    #promise-detail-embed .pd-fact-copy p:last-child { margin-bottom: 0; }\n\n    #promise-detail-embed .pd-copy,\n    #promise-detail-embed .pd-method-copy,\n    #promise-detail-embed .pd-update-body,\n    #promise-detail-embed .pd-quote-text,\n    #promise-detail-embed .pd-fact-copy {\n      white-space: normal;\n      overflow-wrap: normal;\n      word-break: normal;\n      hyphens: none;\n    }\n\n    /* ---------- promise facts ---------- */\n    #promise-detail-embed .pd-promise-overview-box {\n      border-radius: var(--pd-radius);\n      background: #fff;\n      box-shadow: var(--pd-shadow);\n      overflow: hidden;\n    }\n\n    #promise-detail-embed .pd-overview-grid { display: grid; grid-template-columns: 1fr; }\n\n    #promise-detail-embed .pd-overview-item {\n      display: grid;\n      grid-template-columns: 128px minmax(0, 1fr);\n      gap: 14px;\n      padding: 18px 26px;\n      border-top: 1px solid var(--pd-line);\n    }\n\n    #promise-detail-embed .pd-overview-item:first-child { border-top: 0; }\n\n    #promise-detail-embed .pd-overview-label {\n      color: var(--pd-red);\n      font-size: 15px;\n      line-height: 1.4;\n      font-weight: 800;\n    }\n\n    #promise-detail-embed .pd-fact-copy { max-width: none; font-size: 17px; line-height: 1.55; }\n    #promise-detail-embed .pd-overview-item .pd-fact-copy p,\n    #promise-detail-embed .pd-overview-item .pd-fact-copy ul,\n    #promise-detail-embed .pd-overview-item .pd-fact-copy li { font-size: inherit; line-height: inherit; }\n\n    #promise-detail-embed .pd-fact-copy ul,\n    #promise-detail-embed .pd-copy ul,\n    #promise-detail-embed .pd-method-copy ul,\n    #promise-detail-embed .pd-verdict-lead ul,\n    #promise-detail-embed .pd-update-body ul {\n      margin: 0;\n      padding-left: 1.15em;\n      list-style: disc;\n    }\n\n    #promise-detail-embed .pd-fact-copy li,\n    #promise-detail-embed .pd-copy li,\n    #promise-detail-embed .pd-method-copy li,\n    #promise-detail-embed .pd-verdict-lead li,\n    #promise-detail-embed .pd-update-body li { margin: 0 0 7px; padding-left: .12em; }\n    #promise-detail-embed .pd-fact-copy li:last-child,\n    #promise-detail-embed .pd-copy li:last-child,\n    #promise-detail-embed .pd-method-copy li:last-child,\n    #promise-detail-embed .pd-verdict-lead li:last-child,\n    #promise-detail-embed .pd-update-body li:last-child { margin-bottom: 0; }\n\n    #promise-detail-embed .pd-terms { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }\n\n    #promise-detail-embed .pd-term { padding: 14px 18px; border-radius: 16px; background: #fff; box-shadow: var(--pd-shadow); }\n    #promise-detail-embed .pd-term-title { display: block; margin-bottom: 4px; color: var(--pd-red); font-size: 14px; line-height: 1.25; font-weight: 800; }\n    #promise-detail-embed .pd-term-text { margin: 0; color: #3a3a42; font-size: 14px; line-height: 1.5; }\n\n    /* ---------- timeline (updates from the database) ---------- */\n    #promise-detail-embed .pd-timeline-wrap {\n      padding: 26px;\n      border-radius: var(--pd-radius);\n      background: #fff;\n      box-shadow: var(--pd-shadow);\n    }\n\n    #promise-detail-embed .pd-timeline-shell { position: relative; margin: 2px 6px 26px; }\n\n    #promise-detail-embed .pd-timeline-track {\n      position: relative;\n      height: 8px;\n      border-radius: 999px;\n      background: rgba(23, 23, 28, .09);\n    }\n\n    #promise-detail-embed .pd-timeline-dot,\n    #promise-detail-embed .pd-event-dot {\n      position: absolute;\n      top: 50%;\n      border-radius: 50%;\n      transform: translate(-50%, -50%);\n      z-index: 3;\n    }\n\n    #promise-detail-embed .pd-timeline-dot {\n      left: var(--pd-today-pos, 0%);\n      width: 12px; height: 12px;\n      background: #fff;\n      box-shadow: 0 0 0 1px rgba(23, 23, 28, .06), 0 1px 3px rgba(23, 23, 28, .25);\n    }\n\n    #promise-detail-embed .pd-event-dot {\n      left: var(--event-pos, 0%);\n      width: 12px; height: 12px;\n      padding: 0;\n      background: #fff;\n      border: 0;\n      box-shadow: 0 0 0 1px rgba(23, 23, 28, .06), 0 1px 3px rgba(23, 23, 28, .25);\n      cursor: pointer;\n      appearance: none;\n    }\n\n    #promise-detail-embed .pd-event-dot { transition: transform .2s var(--pd-ease), box-shadow .2s var(--pd-ease); }\n    #promise-detail-embed .pd-event-dot:hover { transform: translate(-50%, -50%) scale(1.3); box-shadow: 0 0 0 4px rgba(255, 0, 51, .16), 0 1px 3px rgba(23, 23, 28, .25); }\n    #promise-detail-embed .pd-event-dot:focus-visible { outline: 1.5px solid var(--pd-red); outline-offset: 3px; }\n\n    #promise-detail-embed .pd-timeline-label-row {\n      position: relative;\n      display: flex;\n      justify-content: space-between;\n      gap: 16px;\n      margin-top: 14px;\n      color: var(--pd-muted);\n      font-size: 12.5px;\n      line-height: 1.2;\n    }\n\n    #promise-detail-embed .pd-update-list { display: grid; gap: 12px; }\n\n    #promise-detail-embed .pd-update-card {\n      position: relative;\n      display: grid;\n      grid-template-columns: 124px minmax(0, 1fr) auto;\n      align-items: center;\n      gap: 14px 20px;\n      padding: 18px 20px 18px 30px;\n      border-radius: 12px;\n      background: var(--pd-bg);\n      transition: background-color .2s var(--pd-ease), box-shadow .2s var(--pd-ease);\n    }\n\n    /* coloured edge: the status colour of the update */\n    #promise-detail-embed .pd-update-card::before {\n      content: \"\";\n      position: absolute;\n      left: 12px; top: 16px; bottom: 16px;\n      width: 4px;\n      border-radius: 999px;\n      background: var(--update-color, #e2e2e6);\n    }\n\n    #promise-detail-embed .pd-update-card.pd-update-status { background: color-mix(in srgb, var(--update-bg, #fff) 40%, #ffffff); }\n\n    #promise-detail-embed .pd-update-card[data-has-body=\"true\"] { cursor: pointer; }\n\n    #promise-detail-embed .pd-update-card[data-has-body=\"true\"]:hover,\n    #promise-detail-embed .pd-update-card.pd-update-expanded {\n      background: #fff;\n      box-shadow: var(--pd-shadow), 0 0 0 1.5px var(--pd-line);\n    }\n\n    #promise-detail-embed .pd-update-card[data-has-body=\"true\"]:focus-visible { outline: 1.5px solid var(--pd-red); outline-offset: 0; }\n\n    #promise-detail-embed .pd-update-meta {\n      display: grid;\n      gap: 7px;\n      align-content: center;\n      align-self: stretch;\n      justify-items: start;\n      min-width: 0;\n      text-align: left;\n    }\n\n    #promise-detail-embed .pd-type-badge {\n      display: inline-flex;\n      align-items: center;\n      justify-self: start;\n      padding: 4px 11px;\n      border-radius: 999px;\n      background: #fff;\n      box-shadow: 0 1px 4px rgba(0, 0, 0, .08);\n      color: var(--pd-ink);\n      font-family: var(--pd-body-font, inherit);\n      font-size: 12.5px;\n      line-height: 1.3;\n      font-weight: 700;\n      white-space: nowrap;\n    }\n\n    #promise-detail-embed .pd-update-status-pill { justify-self: start; }\n    #promise-detail-embed .pd-update-status-pill.pd-update-status-main { font-size: 14px; }\n\n    #promise-detail-embed .pd-update-date {\n      color: var(--pd-muted);\n      font-family: var(--pd-body-font, inherit);\n      font-size: 13px;\n      line-height: 1.25;\n      text-align: left;\n    }\n\n    #promise-detail-embed .pd-update-main { display: grid; gap: 7px; min-width: 0; }\n\n    #promise-detail-embed .pd-update-title {\n      margin: 0;\n      color: var(--pd-ink);\n      font-family: var(--pd-heading-font, inherit);\n      font-size: clamp(17px, 1.3vw, 20px);\n      line-height: 1.2;\n      font-weight: 700;\n      letter-spacing: -.01em;\n    }\n\n    #promise-detail-embed .pd-update-body {\n      grid-column: 2 / -1;\n      max-width: none;\n      margin-top: -2px;\n      color: #3a3a42;\n      font-size: 16px;\n      line-height: 1.55;\n      text-align: left;\n    }\n\n    #promise-detail-embed .pd-update-body .pd-update-link { display: inline-flex; margin-top: 10px; }\n    #promise-detail-embed .pd-update-main .pd-update-link { display: inline-flex; justify-self: start; margin-top: 6px; }\n\n    #promise-detail-embed .pd-update-actions { display: inline-flex; align-items: center; justify-content: flex-end; gap: 10px; min-width: 0; }\n\n    #promise-detail-embed .pd-update-chevron {\n      display: grid;\n      place-items: center;\n      width: 34px; height: 34px;\n      border-radius: 50%;\n      background: var(--pd-field);\n      color: var(--pd-ink);\n      transition: transform .25s var(--pd-ease), background-color .2s var(--pd-ease), color .2s var(--pd-ease);\n    }\n\n    #promise-detail-embed .pd-update-chevron .pd-icon { width: 16px; height: 16px; font-size: 16px; }\n\n    #promise-detail-embed .pd-update-card[data-has-body=\"true\"]:hover .pd-update-chevron { background: var(--pd-red); color: #fff; }\n    #promise-detail-embed .pd-update-card.pd-update-expanded .pd-update-chevron { transform: rotate(180deg); background: var(--pd-red); color: #fff; }\n\n    #promise-detail-embed .pd-update-link {\n      color: var(--pd-red);\n      font-size: 14px;\n      line-height: 1.2;\n      font-weight: 700;\n      text-decoration: underline;\n      text-underline-offset: 3px;\n      white-space: nowrap;\n    }\n\n    #promise-detail-embed .pd-show-more-row { display: flex; justify-content: center; margin-top: 18px; }\n\n    #promise-detail-embed .pd-show-more-button {\n      padding: 10px 18px;\n      border: 1.5px solid var(--pd-line);\n      border-radius: 999px;\n      background: #fff;\n      color: var(--pd-ink);\n      font-size: 14px;\n      line-height: 1.2;\n      font-weight: 700;\n      transition: border-color .2s var(--pd-ease);\n    }\n\n    #promise-detail-embed .pd-show-more-button:hover { border-color: var(--pd-ink); }\n\n    #promise-detail-embed .pd-update-highlight { box-shadow: 0 0 0 1.5px var(--pd-red); }\n\n    /* ---------- quotes (copied from the CMS blocks) ---------- */\n    #promise-detail-embed .pd-quotes-grid {\n      display: grid;\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n      column-gap: 24px;\n      align-items: start;\n    }\n\n    #promise-detail-embed .pd-quotes-column { display: grid; gap: 24px; align-content: start; min-width: 0; }\n\n    #promise-detail-embed .pd-quote-card {\n      position: relative;\n      overflow: hidden;\n      min-width: 0;\n      padding: clamp(26px, 2.8vw, 34px);\n      border-radius: var(--pd-radius);\n      background: var(--pd-tint);\n      isolation: isolate;\n    }\n\n    #promise-detail-embed .pd-quote-content {\n      position: relative;\n      z-index: 2;\n      display: grid;\n      grid-template-columns: 30px minmax(0, 1fr);\n      column-gap: 10px;\n      row-gap: 12px;\n      min-width: 0;\n    }\n\n    #promise-detail-embed .pd-quote-card.pd-has-image {\n      --pd-quote-image-width: clamp(122px, 25%, 165px);\n      min-height: 190px;\n      padding-right: calc(var(--pd-quote-image-width) + clamp(22px, 2.2vw, 30px));\n    }\n\n    #promise-detail-embed .pd-quote-card.pd-has-image .pd-quote-content { align-items: start; }\n\n    #promise-detail-embed .pd-quote-mark {\n      grid-column: 1;\n      grid-row: 1 / span 3;\n      color: var(--pd-red);\n      font-size: 40px;\n      line-height: .72;\n      font-weight: 800;\n      letter-spacing: -.08em;\n      transform: translateY(1px);\n      user-select: none;\n    }\n\n    #promise-detail-embed .pd-quote-text {\n      grid-column: 2;\n      max-width: 62ch;\n      margin: 0;\n      color: var(--pd-ink);\n      font-family: var(--pd-body-font, inherit);\n      font-size: 18px;\n      line-height: 1.52;\n      font-weight: var(--pd-body-weight, 400);\n      font-style: normal;\n      letter-spacing: var(--pd-body-letter-spacing, normal);\n      text-wrap: pretty;\n    }\n\n    #promise-detail-embed .pd-quote-footer { grid-column: 2; display: block; min-width: 0; margin-top: 4px; }\n    #promise-detail-embed .pd-quote-person-block { display: grid; align-content: end; gap: 2px; min-width: 0; }\n\n    #promise-detail-embed .pd-quote-source-name,\n    #promise-detail-embed .pd-quote-role {\n      min-width: 0;\n      color: var(--pd-ink);\n      font-family: var(--pd-body-font, inherit);\n      font-size: 14px;\n      line-height: 1.35;\n      font-weight: 400;\n    }\n\n    #promise-detail-embed .pd-quote-source-name { font-weight: 700; }\n\n    #promise-detail-embed .pd-quote-source-name a,\n    #promise-detail-embed .pd-quote-role a {\n      color: var(--pd-red);\n      font-weight: 400;\n      text-decoration: underline;\n      text-decoration-thickness: 1px;\n      text-underline-offset: 2px;\n    }\n\n    #promise-detail-embed .pd-quote-link-icon {\n      display: inline-block;\n      width: 14px; height: 14px;\n      margin-right: 5px;\n      vertical-align: -2px;\n      background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='3.5' y='3.5' width='13' height='13' rx='2.5' fill='none' stroke='%23ff0033' stroke-width='1.8'/%3E%3Cpath d='M7 7.5h6M7 10.5h6M7 13.5h3.5' stroke='%23ff0033' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E\") center / contain no-repeat;\n    }\n\n    #promise-detail-embed .pd-quote-image-wrap {\n      position: absolute;\n      top: 0; right: 0; bottom: 0;\n      z-index: 1;\n      width: var(--pd-quote-image-width, 150px);\n      overflow: hidden;\n      background: #f2dce2;\n    }\n\n    #promise-detail-embed .pd-quote-image { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; }\n\n    /* ---------- evidence ---------- */\n    #promise-detail-embed .pd-evidence-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: 16px; margin-bottom: 16px; }\n\n    #promise-detail-embed .pd-evidence-card,\n    #promise-detail-embed .pd-metric-panel,\n    #promise-detail-embed .pd-method-card {\n      border-radius: var(--pd-radius);\n      background: #fff;\n      box-shadow: var(--pd-shadow);\n    }\n\n    #promise-detail-embed .pd-evidence-card,\n    #promise-detail-embed .pd-method-card { padding: 22px 24px; }\n    #promise-detail-embed .pd-metric-panel { padding: 22px; }\n\n    #promise-detail-embed .pd-evidence-title,\n    #promise-detail-embed .pd-metric-panel-title { margin: 0 0 12px; color: var(--pd-ink); font-size: 17px; line-height: 1.2; font-weight: 800; }\n\n    #promise-detail-embed .pd-metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }\n\n    #promise-detail-embed .pd-metric-card { display: grid; align-content: start; gap: 5px; min-height: 96px; padding: 14px 16px; border-radius: 16px; background: var(--pd-field); }\n    #promise-detail-embed .pd-metric-value { color: var(--pd-ink); font-size: clamp(25px, 3vw, 36px); line-height: .98; font-weight: 800; letter-spacing: -.04em; }\n    #promise-detail-embed .pd-metric-label { color: var(--pd-muted); font-size: 14px; line-height: 1.4; }\n\n    #promise-detail-embed .pd-method-copy { font-size: 16px; line-height: 1.6; }\n    #promise-detail-embed .pd-evidence-card .pd-fact-copy,\n    #promise-detail-embed .pd-evidence-card .pd-fact-copy p,\n    #promise-detail-embed .pd-evidence-card .pd-fact-copy li { font-size: 16px; line-height: 1.6; }\n\n    #promise-detail-embed .pd-empty,\n    #promise-detail-embed .pd-loading,\n    #promise-detail-embed .pd-error {\n      padding: 22px 24px;\n      border-radius: var(--pd-radius);\n      background: #fff;\n      box-shadow: var(--pd-shadow);\n      color: var(--pd-muted);\n    }\n\n    #promise-detail-embed .pd-error strong { color: var(--pd-red); }\n\n    #promise-detail-embed #pdTimelineMount:empty { display: none; }\n\n    /* ---------- responsive ---------- */\n    @media (max-width: 920px) {\n      #promise-detail-embed .pd-hero,\n    #promise-detail-embed .pd-evidence-grid,\n    #promise-detail-embed .pd-hero-details { grid-template-columns: 1fr; }\n      #promise-detail-embed .pd-quotes-grid,\n    #promise-detail-embed .pd-terms { grid-template-columns: 1fr; }\n    }\n\n    @media (max-width: 640px) {\n      #promise-detail-embed .pd-app { padding: 20px 16px 38px; }\n      #promise-detail-embed .pd-shell { gap: 40px; }\n      #promise-detail-embed .pd-promise-panel { min-height: 420px; }\n      #promise-detail-embed .pd-promise-content,\n    #promise-detail-embed .pd-verdict-head,\n    #promise-detail-embed .pd-verdict-body,\n    #promise-detail-embed .pd-timeline-wrap { padding-left: 18px; padding-right: 18px; }\n      #promise-detail-embed .pd-verdict-head { display: grid; justify-content: stretch; }\n      #promise-detail-embed .pd-overview-item { grid-template-columns: 1fr; gap: 4px; padding: 16px 18px; }\n      #promise-detail-embed .pd-metric-grid { grid-template-columns: 1fr; }\n      #promise-detail-embed .pd-update-card { grid-template-columns: 1fr; padding-left: 28px; }\n      #promise-detail-embed .pd-update-body { grid-column: 1 / -1; margin-top: 0; }\n      #promise-detail-embed .pd-update-actions { justify-content: flex-start; }\n      #promise-detail-embed .pd-quote-card { padding: 22px 20px; }\n      #promise-detail-embed .pd-quote-card.pd-has-image { --pd-quote-image-width: clamp(92px, 27vw, 112px); min-height: 170px; padding-right: calc(var(--pd-quote-image-width) + 18px); }\n      #promise-detail-embed .pd-quote-mark { font-size: 36px; }\n      #promise-detail-embed .pd-quote-source-name,\n    #promise-detail-embed .pd-quote-role { font-size: 13.5px; }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      #promise-detail-embed *,\n    #promise-detail-embed *::before,\n    #promise-detail-embed *::after { animation: none !important; transition: none !important; }\n    }\n\n    /* ---------- thin white outline on the cards ---------- */\n    #promise-detail-embed .pd-promise-panel,\n    #promise-detail-embed .pd-verdict-card,\n    #promise-detail-embed .pd-promise-overview-box,\n    #promise-detail-embed .pd-term,\n    #promise-detail-embed .pd-timeline-wrap,\n    #promise-detail-embed .pd-evidence-card,\n    #promise-detail-embed .pd-metric-panel,\n    #promise-detail-embed .pd-method-card,\n    #promise-detail-embed .pd-empty,\n    #promise-detail-embed .pd-loading,\n    #promise-detail-embed .pd-error { border: 1px solid rgba(255, 255, 255, .9); }\n\n    #promise-detail-embed .pd-quote-card { border: 1px solid rgba(255, 255, 255, .85); }\n\n    /* ---------- woordenboek (dictionary) ---------- */\n    #promise-detail-embed .pd-gloss {\n      text-decoration: underline dotted;\n      text-decoration-color: var(--pd-red);\n      text-decoration-thickness: 2px;\n      text-underline-offset: 3px;\n      border-radius: 3px;\n      cursor: help;\n      transition: background-color .15s var(--pd-ease);\n    }\n\n    #promise-detail-embed .pd-gloss:hover,\n    #promise-detail-embed .pd-gloss[aria-expanded=\"true\"] { background: var(--pd-tint); }\n    #promise-detail-embed .pd-gloss:focus-visible { outline: 1.5px solid var(--pd-red); outline-offset: 2px; }\n\n    #promise-detail-embed .pd-gloss-pop {\n      position: absolute;\n      z-index: 50;\n      width: max-content;\n      max-width: min(280px, calc(100% - 16px));\n      padding: 11px 14px 12px;\n      border-radius: 12px;\n      background: #fff;\n      color: var(--pd-ink);\n      box-shadow: 0 18px 40px -14px rgba(23, 23, 28, .38), 0 0 0 1px rgba(23, 23, 28, .06);\n      font-size: 13px;\n      line-height: 1.4;\n      text-align: left;\n    }\n\n    #promise-detail-embed .pd-gloss-pop::after {\n      content: \"\";\n      position: absolute;\n      left: var(--pd-arrow-x, 24px);\n      width: 12px;\n      height: 12px;\n      margin-left: -6px;\n      background: #fff;\n      transform: rotate(45deg);\n    }\n\n    #promise-detail-embed .pd-gloss-pop[data-side=\"above\"]::after { bottom: -6px; box-shadow: 2px 2px 3px -1px rgba(23, 23, 28, .12); }\n    #promise-detail-embed .pd-gloss-pop[data-side=\"below\"]::after { top: -6px; box-shadow: -2px -2px 3px -1px rgba(23, 23, 28, .1); }\n\n    #promise-detail-embed .pd-gloss-pop-word { margin-bottom: 4px; color: var(--pd-ink); font-size: 14px; font-weight: 800; line-height: 1.2; }\n    #promise-detail-embed .pd-gloss-pop-text p,\n    #promise-detail-embed .pd-gloss-pop-text li { margin: 0 0 5px; font-size: 13px; line-height: 1.4; }\n    #promise-detail-embed .pd-gloss-pop-text p:last-child { margin-bottom: 0; }\n\n  /* The CMS's own quote blocks and article lists live outside the embed; they are hidden once copied in. */\n  .pd-cms-quote-source-hidden,\n  .bm-timeline-source-hidden {\n    display: none !important;\n  }\n\n  .bm-master-timeline.bm-timeline-ready {\n    --bm-red: var(--pd-red, #ff0033);\n    --bm-ink: var(--pd-ink, #17171c);\n    --bm-muted: var(--pd-muted, #6b6b75);\n    --bm-tint: var(--pd-tint, #FFE9EE);\n    --bm-field: var(--pd-field, #FFF2F5);\n    --bm-line: var(--pd-line, #FFE0E6);\n    --bm-done: #00b2a9;\n    --bm-done-soft: #ebfff1;\n    --bm-shadow: 0 1px 2px rgba(60, 10, 25, .035), 0 14px 30px -24px rgba(255, 0, 51, .16);\n\n    width: 100%;\n    max-width: none;\n    margin: 0;\n    padding: 0;\n    background: transparent !important;\n    box-sizing: border-box;\n  }\n\n  .bm-master-timeline.bm-timeline-ready * {\n    box-sizing: border-box;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section,\n  .bm-master-timeline.bm-timeline-ready .teaser-section__inner {\n    width: 100%;\n    max-width: none;\n    margin-inline: 0;\n    padding-inline: 0;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .section-title {\n    margin: 0 0 18px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .section-title__top {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 18px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .section-title__title-wrapper svg,\n  .bm-master-timeline.bm-timeline-ready .section-title__subtitle {\n    display: none;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .section-title__title {\n    margin: 0;\n    color: var(--bm-ink);\n    font-size: 26px;\n    line-height: 1.1;\n    font-weight: 600;\n    letter-spacing: -.01em;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-heading-tools {\n    display: inline-flex;\n    align-items: center;\n    justify-content: flex-end;\n    gap: 12px;\n    flex: 0 0 auto;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-control-icon {\n    flex: 0 0 auto;\n    width: 18px;\n    height: 18px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-count {\n    color: var(--bm-muted);\n    font-size: 14px;\n    line-height: 1;\n    white-space: nowrap;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-order-toggle {\n    appearance: none !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    gap: 7px !important;\n    min-width: 0 !important;\n    min-height: 0 !important;\n    height: auto !important;\n    padding: 9px 16px 9px 13px !important;\n    border: 1.5px solid var(--bm-line) !important;\n    border-radius: 999px !important;\n    background: #fff !important;\n    color: var(--bm-ink) !important;\n    box-shadow: none !important;\n    font-family: inherit !important;\n    font-size: 14px !important;\n    line-height: 1.2 !important;\n    font-weight: 700 !important;\n    white-space: nowrap !important;\n    cursor: pointer;\n    transform: none !important;\n    transition: border-color 200ms ease;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-order-toggle > span:not(.bm-timeline-control-icon) {\n    font-family: inherit !important;\n    font-size: 14px !important;\n    line-height: 1.2 !important;\n    font-weight: 700 !important;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-order-toggle:hover {\n    border-color: var(--bm-ink) !important;\n    background: #fff !important;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-order-toggle:focus-visible {\n    outline: 1.5px solid var(--bm-red);\n    outline-offset: 3px;\n  }\n\n  /* dot navigation */\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav {\n    width: 100%;\n    max-width: 100%;\n    border: 0;\n    padding: 10px 8px 14px 0;\n    margin: 0 0 14px;\n    background: transparent;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__row {\n    display: grid;\n    grid-template-columns: max-content minmax(0, 1fr) max-content;\n    align-items: center;\n    gap: 14px;\n    width: 100%;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__edge-label {\n    color: var(--bm-muted);\n    font-size: 12.5px;\n    line-height: 1;\n    font-weight: 400;\n    white-space: nowrap;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__track {\n    position: relative;\n    width: 100%;\n    height: 8px;\n    border-radius: 999px;\n    background: rgba(23, 23, 28, .09);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__dot {\n    appearance: none;\n    position: absolute;\n    top: 50%;\n    width: 12px;\n    height: 12px;\n    padding: 0;\n    border-radius: 999px;\n    background: #fff;\n    border: 0;\n    box-shadow: 0 0 0 1px rgba(23, 23, 28, .06), 0 1px 3px rgba(23, 23, 28, .25);\n    opacity: 1;\n    z-index: 1;\n    transform: translate(-50%, -50%);\n    cursor: pointer;\n    transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;\n  }\n\n  /* a little lift and a soft red halo when you point at a dot */\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__dot:hover {\n    transform: translate(-50%, -50%) scale(1.3);\n    box-shadow: 0 0 0 4px rgba(255, 0, 51, .16), 0 1px 3px rgba(23, 23, 28, .25);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__dot.bm-timeline-nav__dot--active {\n    z-index: 10;\n    background: var(--bm-red);\n    transform: translate(-50%, -50%) scale(1.2);\n    box-shadow: 0 1px 4px rgba(23, 23, 28, .3);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__dot:focus-visible {\n    outline: 1.5px solid var(--bm-red);\n    outline-offset: 3px;\n  }\n\n  /* list of CMS articles */\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items {\n    display: block !important;\n    width: 100%;\n    max-width: none;\n    list-style: none;\n    margin: 0 0 0 -6px;\n    width: calc(100% + 6px);\n    padding: 6px 10px 6px 6px;\n    max-height: 520px;\n    overflow-y: scroll;\n    scrollbar-gutter: stable;\n    scrollbar-width: thin;\n    scrollbar-color: #ffb3c1 transparent;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items::-webkit-scrollbar {\n    width: 8px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items::-webkit-scrollbar-thumb {\n    background: #ffb3c1;\n    border-radius: 999px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items::-webkit-scrollbar-thumb:hover {\n    background: var(--bm-red);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items > li {\n    list-style: none;\n    margin: 0 0 12px;\n    padding: 0;\n    scroll-margin-top: 100px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-section__items > li::marker {\n    content: \"\";\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser-wrapper {\n    width: 100%;\n    max-width: none;\n    margin: 0;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser {\n    display: block;\n    width: 100%;\n    max-width: none;\n    position: relative;\n    overflow: hidden;\n    color: var(--bm-ink);\n    text-decoration: none;\n    border: 1px solid rgba(255, 255, 255, .9);\n    border-radius: 12px;\n    background: #fff;\n    box-shadow: var(--bm-shadow);\n    transition: background-color 200ms ease, box-shadow 200ms ease;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser:hover {\n    background: #fff;\n    box-shadow: var(--bm-shadow), 0 0 0 1.5px var(--bm-line);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser:focus-visible {\n    outline: 1.5px solid var(--bm-red);\n    outline-offset: 0;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-active .teaser,\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-active .teaser:hover {\n    background: var(--bm-tint);\n    box-shadow: var(--bm-shadow);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser__content {\n    position: relative;\n    display: grid;\n    grid-template-columns: 112px minmax(0, 1fr);\n    align-items: stretch;\n    gap: 0;\n    min-height: 80px;\n    padding: 0;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-no-image .teaser__content {\n    grid-template-columns: minmax(0, 1fr);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-type-milestone .teaser {\n    background: var(--bm-field);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-type-vonnis .teaser,\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-realized .teaser {\n    background: var(--bm-done-soft);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-media {\n    width: 112px;\n    height: 100%;\n    min-height: 80px;\n    overflow: hidden;\n    background: var(--bm-field);\n    align-self: stretch;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-media img {\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-no-image .bm-timeline-media {\n    display: none;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-main {\n    min-width: 0;\n    align-self: center;\n    padding: 14px 20px;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .teaser__title {\n    margin: 0;\n    color: var(--bm-ink);\n    font-size: clamp(16px, 1.4vw, 18px);\n    line-height: 1.22;\n    font-weight: 700;\n    letter-spacing: -.01em;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-title-hidden {\n    display: none;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-type-vonnis .teaser__title,\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-realized .teaser__title {\n    color: var(--bm-done);\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-meta-line {\n    margin-top: 5px;\n    color: var(--bm-muted);\n    font-size: 12.5px;\n    line-height: 1.3;\n    font-weight: 400;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-status {\n    display: inline-flex;\n    align-items: center;\n    width: fit-content;\n    margin-bottom: 6px;\n    padding: 4px 12px 4px 5px;\n    border-radius: 999px;\n    background: var(--bm-done);\n    color: #fff;\n    font-size: 13px;\n    font-weight: 700;\n    line-height: 1.2;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-status::before {\n    content: \"\u2713\";\n    display: inline-grid;\n    place-items: center;\n    width: 16px;\n    height: 16px;\n    margin-right: 7px;\n    border-radius: 999px;\n    background: #fff;\n    color: var(--bm-done);\n    font-size: 10px;\n    font-weight: 800;\n  }\n\n  .bm-master-timeline.bm-timeline-ready .bm-timeline-no-link .teaser {\n    cursor: default;\n  }\n\n  @media (max-width: 640px) {\n    .bm-master-timeline.bm-timeline-ready .section-title__top {\n      align-items: flex-start;\n      flex-direction: column;\n      gap: 10px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .bm-timeline-heading-tools {\n      justify-content: flex-start;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__row {\n      gap: 9px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .bm-timeline-nav__edge-label {\n      font-size: 11px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .teaser__content {\n      grid-template-columns: 90px minmax(0, 1fr);\n      min-height: 74px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .bm-timeline-media {\n      width: 90px;\n      min-height: 74px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .bm-timeline-main {\n      padding: 11px 14px;\n    }\n\n    .bm-master-timeline.bm-timeline-ready .teaser__title {\n      font-size: 16px;\n    }\n  }\n";
  document.head.appendChild(style);
  MOUNT.innerHTML = "<div class=\"pd-app\">\n    <a class=\"pd-back\" id=\"pdBackLink\" href=\"#\">Zie het overzicht met alle beloftes</a>\n    <div id=\"pdRoot\" class=\"pd-shell\">\n      <div class=\"pd-loading\">Aan het laden...</div>\n    </div>\n  </div>";

  /* ---- page + data ---- */
  (function () {
    (function () {
      const root = MOUNT;
      if (!root) return;

      /*
        Recommended production setup:
        - Set API_BASE_URL to your own proxy, e.g. "https://your-worker.example.com".
        - The proxy keeps the Baserow token server-side and exposes /promises and /updates.

        Temporary/local testing setup:
        - Leave API_BASE_URL empty and add a read-only Baserow token below.
        - This direct-token fallback is visible in browser Inspect, so do not use it for production.
      */
      const API_BASE_URL = String(CONFIG.api || "").trim();
      const TOKEN = "";
      const PROMISES_TABLE_ID = "931852".trim();
      const UPDATES_TABLE_ID = "931853".trim();

      /* URL of the overview page. Used by the back button. */
      const OVERVIEW_URL = CONFIG.overview;

      /*
        The page selects a promise from the URL:
        ?promise_key=lage-emissiezone  or  ?key=lage-emissiezone  or  ?id=181
        For a hard-coded article/detail page, set DEFAULT_PROMISE_KEY to a Promise key.
      */
      const DEFAULT_PROMISE_KEY = CONFIG.slug;

      /* Hero image can sit above or below the promise title inside the left promise card. */
      const HERO_IMAGE_PLACEMENT = "above-title"; // "above-title" or "below-title"

      const PROMISES_API = `https://api.baserow.io/api/database/rows/table/${PROMISES_TABLE_ID}/?user_field_names=true&size=200`;
      const UPDATES_API = `https://api.baserow.io/api/database/rows/table/${UPDATES_TABLE_ID}/?user_field_names=true&size=200`;

      /*
        START RIGHT UNDER THE HEADER BARS
        The page around the embed has its own title, date and share buttons. With COVER_PAGE_HEADER on, the
        script hides them, so the embed starts straight under the header bars of the site.
        Article pages do not all look the same, so it works in two steps:
        1. PAGE_HEADER_SELECTORS: blocks that are hidden when they sit above the embed. ".hero" is the base
           class of the title block on your article pages, so it also covers variants like "hero--media".
           Add more selectors for other templates, for example [".hero", ".article-header"].
        2. If none of those is found on a page, the script looks for the title block by itself: the page title
           (the first <h1> above the embed) and everything between it and the embed. It leaves the page alone
           when that does not look like just a title, a date and share buttons, and says so in the console.
        To switch the whole thing off: COVER_PAGE_HEADER = false.
      */
      const COVER_PAGE_HEADER = true;
      const PAGE_HEADER_SELECTORS = [".hero"];

      /*
        The theme can leave empty space above the embed (padding or margin around it, a coloured band on draft
        articles). With REMOVE_SPACE_ABOVE_EMBED on, the script measures that space and pulls the embed up
        to the top of the page content, right under the header bars. It never goes under a fixed header.
      */
      const REMOVE_SPACE_ABOVE_EMBED = true;

      /*
        WOORDENBOEK (dictionary)
        - GLOSSARY_TABLE_ID: the number of the "Woordenboek" table in Baserow. You find it in the address bar
          when you open the table: .../database/123/table/THIS-NUMBER. The read-only token must be allowed to
          read this table as well (Baserow > Settings > Database tokens).
        - GLOSSARY_DEMO: set to true only to try the feature with a few made-up example words (DEMO_GLOSSARY below)
          when no table is connected. Keep it false on the live page, so readers only ever see your own definitions.
        - GLOSSARY_FIRST_ONLY: underline a word only the first time it appears in a section (false = every time).
        - GLOSSARY_SCOPES: the parts of the page where words are looked for.
      */
      const GLOSSARY_TABLE_ID = "951927".trim();
      const GLOSSARY_DEMO = false;
      const GLOSSARY_FIRST_ONLY = true;
      const GLOSSARY_SCOPES = [".pd-verdict-body", ".pd-promise-overview-box", ".pd-copy"];
      const GLOSSARY_API = `https://api.baserow.io/api/database/rows/table/${GLOSSARY_TABLE_ID}/?user_field_names=true&size=200`;

      const STATUS_CONFIG = {
            "NIET GESTART": { color: "#ff0033", bg: "#fde5ea", symbol: "✕", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4df1c29aca7da8d503&f=t&dl=t&c=621b99d3b2893607c7ceb5be21589b81&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZGYxYzI5YWNhN2RhOGQ1MDMmZj10JmRsPXQmYz02MjFiOTlkM2IyODkzNjA3YzdjZWI1YmUyMTU4OWI4MSIsInR5cGUiOiJkaXJlY3QifQ.D8poPnoPxffh6BGG6dqsO4yCQcyzd3mE5RTRojHmf3A" },
            "GESTART": { color: "#80E4DF", bg: "#eaf7fc", symbol: "…", iconUrl: "https://app.razuna.eu/file/remote?i=6ac367788fc71aef8abe8323&f=t&dl=t&c=194c6c8cb7b9389ef02bb1b139cd2f91&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3ODhmYzcxYWVmOGFiZTgzMjMmZj10JmRsPXQmYz0xOTRjNmM4Y2I3YjkzODllZjAyYmIxYjEzOWNkMmY5MSIsInR5cGUiOiJkaXJlY3QifQ.ZUasZvCE-VVupF1O0Rww6xVUSxsiTmPSQFcQZiXuegs" },
            "OP SCHEMA": { color: "#80E4DF", bg: "#fbfddf", symbol: "→", iconUrl: "https://app.razuna.eu/file/remote?i=6ac367795d26d4fa58efb1ff&f=t&dl=t&c=820bfcf63a4b7e75c1827f2f93f5f3c1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3OTVkMjZkNGZhNThlZmIxZmYmZj10JmRsPXQmYz04MjBiZmNmNjNhNGI3ZTc1YzE4MjdmMmY5M2Y1ZjNjMSIsInR5cGUiOiJkaXJlY3QifQ.C5fRSpQXEym86Z5OoXEun99F_PZ5CB5dLw8boagJlJc" },
            "NIET OP SCHEMA": { color: "#FA79D7", bg: "#ffe8ef", symbol: "⏸", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4f8fc71aef8abe7f40&f=t&dl=t&c=0ae03ce2e22325e7d9c0ef235b098d8b&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZjhmYzcxYWVmOGFiZTdmNDAmZj10JmRsPXQmYz0wYWUwM2NlMmUyMjMyNWU3ZDljMGVmMjM1YjA5OGQ4YiIsInR5cGUiOiJkaXJlY3QifQ.HBt_lf4CEZdVlfBwS1coO11Dubv2kMneVMudHFphnp4" },
            "MISLUKT": { color: "#ff0033", bg: "#fce8ed", symbol: "✕", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e50e7c79cb82176880e&f=t&dl=t&c=f2198c5be089c0704dfbbabc06fbce82&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU1MGU3Yzc5Y2I4MjE3Njg4MGUmZj10JmRsPXQmYz1mMjE5OGM1YmUwODljMDcwNGRmYmJhYmMwNmZiY2U4MiIsInR5cGUiOiJkaXJlY3QifQ.-lTM_9If3bIs4Chs7KOXQbGL1eLqBzo99ma4jbAe8Sw" },
            "GELUKT": { color: "#00b2a9", bg: "#ebfff1", symbol: "✓", iconUrl: "https://app.razuna.eu/file/remote?i=6ac36778e7c79cb821768adb&f=t&dl=t&c=4b2310c11278efb91ee90ec6f56f2f7d&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3OGU3Yzc5Y2I4MjE3NjhhZGImZj10JmRsPXQmYz00YjIzMTBjMTEyNzhlZmI5MWVlOTBlYzZmNTZmMmY3ZCIsInR5cGUiOiJkaXJlY3QifQ.aEDrAoEbrRY50nFav5_gxZxcTHvg3omUDmwQFfBFXq4" },
            "ONVERIFIEERBAAR": { color: "#000000", bg: "#f3f3f3", symbol: "?", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4efbae2dee4fef7652&f=t&dl=t&c=95852bb3fde1d2504e6319b23968a52d&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZWZiYWUyZGVlNGZlZjc2NTImZj10JmRsPXQmYz05NTg1MmJiM2ZkZTFkMjUwNGU2MzE5YjIzOTY4YTUyZCIsInR5cGUiOiJkaXJlY3QifQ.53REmx1y-YP1y7QSrHN3WKnTjfEPJJIjcb_dNNfR6g0" },
            "GEBLOKKEERD": { color: "#000000", bg: "#fff3e3", symbol: "⏸", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e50f1c29aca7da8d58d&f=t&dl=t&c=ebf2906ff7ce38997b5e3262cf653e0c&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU1MGYxYzI5YWNhN2RhOGQ1OGQmZj10JmRsPXQmYz1lYmYyOTA2ZmY3Y2UzODk5N2I1ZTMyNjJjZjY1M2UwYyIsInR5cGUiOiJkaXJlY3QifQ.CDaybXfH__Nvf48yC4qHD7TmWOB-JTiI5JtU7Jc2gpQ" }
          };

      /* Same statuses (and the same colours/icons) as the overview page. Older names still work. */
      const LEGACY_STATUS_MAP = {
        "NIET VERIFIEERBAAR": "ONVERIFIEERBAAR",
        "GEREALISEERD": "GELUKT",
        "NAGEKOMEN": "GELUKT",
        "INGELOST": "GELUKT",
        "BEZIG": "OP SCHEMA",
        "IN UITVOERING": "OP SCHEMA",
        "GEEN NIEUWS": "GESTART",
        "VERTRAGING": "NIET OP SCHEMA",
        "VASTGELOPEN": "NIET OP SCHEMA",
        "NIET NAGEKOMEN": "NIET GESTART",
        "NIET INGELOST": "NIET GESTART",
        "NIET GEREALISEERD": "MISLUKT"
      };

      const MINISTERS = [
            {
              name: "Boris DILLIÈS",
              shortName: "Boris DILLIÈS",
              bg: "#05060a",
              partij: "MR",
              image: "https://app.razuna.eu/file/remote?i=69e631c4055d275698f393b6&f=t&dl=t&c=d46434a1c7adef8d8d92d3b79146c196&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFjNDA1NWQyNzU2OThmMzkzYjYmZj10JmRsPXQmYz1kNDY0MzRhMWM3YWRlZjhkOGQ5MmQzYjc5MTQ2YzE5NiIsInR5cGUiOiJkaXJlY3QifQ.XJHg57he5qKKB4yxRONV0wsmLZeBvgtTrd3KPRhnDv8",
              centerKicker: "Minister-President",
              centerTitle: "Boris DILLIÈS",
              centerSubtitle: "Veiligheid, Toerisme, Wetenschappelijk Onderzoek, Externe Betrekkingen & Buitenlandse Handel"
            },
            {
              name: "Elke VAN DEN BRANDT",
              shortName: "Elke VAN DEN BRANDT",
              partij: "Groen",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631bb8e15ec28d9d0ef06&f=t&dl=t&c=4e748169f7544b4522044abe9464de13&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFiYjhlMTVlYzI4ZDlkMGVmMDYmZj10JmRsPXQmYz00ZTc0ODE2OWY3NTQ0YjQ1MjIwNDRhYmU5NDY0ZGUxMyIsInR5cGUiOiJkaXJlY3QifQ.vW1qeC09nQgyBbHWcsOyKhrtwhZVlJrXaK0xBYj4JTE",
              centerKicker: "Minister",
              centerTitle: "Elke VAN DEN BRANDT",
              centerSubtitle: "Mobiliteit, Openbare Werken, Verkeersveiligheid & Dierenwelzijn"
            },
            {
              name: "Dirk DE SMEDT",
              shortName: "Dirk DE SMEDT",
              partij: "Anders",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631c7b134cb119fc27b85&f=t&dl=t&c=635019ef630af87328c4cddfbd7fd289&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFjN2IxMzRjYjExOWZjMjdiODUmZj10JmRsPXQmYz02MzUwMTllZjYzMGFmODczMjhjNGNkZGZiZDdmZDI4OSIsInR5cGUiOiJkaXJlY3QifQ.v2MzKxHZM55Fo2nuwcLvQP3dIwpJgxkERanzIRZgdBo",
              centerKicker: "Minister",
              centerTitle: "Dirk DE SMEDT",
              centerSubtitle: "Financiën, Begroting, Ambtenarenzaken & Digitalisering"
            },
            {
              name: "Audrey HENRY",
              shortName: "Audrey HENRY",
              partij: "MR",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631c9bb689608f6d451ed&f=t&dl=t&c=d6febb6631e7295256a6117c48350775&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFjOWJiNjg5NjA4ZjZkNDUxZWQmZj10JmRsPXQmYz1kNmZlYmI2NjMxZTcyOTUyNTZhNjExN2M0ODM1MDc3NSIsInR5cGUiOiJkaXJlY3QifQ.puW2p7bPAxutA_5GbbBCYHVwajTkIoLT3Dldhlcx78Y",
              centerKicker: "Staatssecretaris",
              centerTitle: "Audrey HENRY",
              centerSubtitle: "Ruimtelijke Ordening, Openbare Netheid & Energie"
            },
            {
              name: "Ans PERSOONS",
              shortName: "Ans PERSOONS",
              partij: "Vooruit",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631bfb8941ccbec8fd4da&f=t&dl=t&c=490f6bee1b8ef931d73936317b4ec5d3&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFiZmI4OTQxY2NiZWM4ZmQ0ZGEmZj10JmRsPXQmYz00OTBmNmJlZTFiOGVmOTMxZDczOTM2MzE3YjRlYzVkMyIsInR5cGUiOiJkaXJlY3QifQ.iJFq5kCXZnUSH3TJscLP1I1E_TX5VDJDswHxwpzS-9g",
              centerKicker: "Staatssecretaris",
              centerTitle: "Ans PERSOONS",
              centerSubtitle: "Leefmilieu, Klimaat, Stadsvernieuwing & Erfgoed"
            },
            {
              name: "Karine LALIEUX",
              shortName: "Karine LALIEUX",
              partij: "PS",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631c21cd3b3713110e41d&f=t&dl=t&c=27a5958054ab4f8a48aeef3f6ef1e359&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFjMjFjZDNiMzcxMzExMGU0MWQmZj10JmRsPXQmYz0yN2E1OTU4MDU0YWI0ZjhhNDhhZWVmM2Y2ZWYxZTM1OSIsInR5cGUiOiJkaXJlY3QifQ.PfI85SOUTo_UT92WuObErP90fZ2lSiefhy6tHmDPrdM",
              centerKicker: "Staatssecretaris",
              centerTitle: "Karine LALIEUX",
              centerSubtitle: "Huisvesting, Taxisector & Sportinfrastructuur"
            },
            {
              name: "Ahmed LAAOUEJ",
              shortName: "Ahmed LAAOUEJ",
              partij: "PS",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631b98e15ec28d9d0eea9&f=t&dl=t&c=0857aedf1d75baa86d212b52ae80ebc8&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFiOThlMTVlYzI4ZDlkMGVlYTkmZj10JmRsPXQmYz0wODU3YWVkZjFkNzViYWE4NmQyMTJiNTJhZTgwZWJjOCIsInR5cGUiOiJkaXJlY3QifQ.PKdtRvJjcvCLFElGSdtGm0YcF4yZKbvrwAiKVQ4CmeE",
              centerKicker: "Minister",
              centerTitle: "Ahmed LAAOUEJ",
              centerSubtitle: "Plaatselijke Besturen, Gelijke Kansen & Schoolondersteuning"
            },
            {
              name: "Laurent HUBLET",
              shortName: "Laurent HUBLET",
              partij: "Les Engagés",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631bd25f5635dbfdd91b3&f=t&dl=t&c=3618157e1ee9e6eb0d8231ae1d06fc40&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFiZDI1ZjU2MzVkYmZkZDkxYjMmZj10JmRsPXQmYz0zNjE4MTU3ZTFlZTllNmViMGQ4MjMxYWUxZDA2ZmM0MCIsInR5cGUiOiJkaXJlY3QifQ.ea8EC6iSs_Rsfxkmd2wd18TRtsp9EOFyNnC1JzeJB5E",
              centerKicker: "Minister",
              centerTitle: "Laurent HUBLET",
              centerSubtitle: "Economie, Digitale Economie en Werk"
            }
          ];

      const TYPE_LABELS = {
        timeline: "Update",
        verdict: "Vonnis",
        quote: "Quote",
        subpromise: "Deelbelofte",
        faq: "FAQ"
      };

      const TIMELINE_START = new Date("2026-02-01T00:00:00");
      const TIMELINE_END = new Date("2029-02-01T00:00:00");

      /*
        Current Promises table field names.
        The code also keeps a few older fallbacks so it does not break if fields are renamed later.
      */
      const PROMISE_FIELDS = {
        title: ["Promise", "Title", "Titel"],
        key: ["Promise key", "Key", "Slug", "URL slug"],
        datePromised: ["Date promised", "Datum belofte", "Beloofd op"],
        deadlinePromised: ["Deadline promised", "Deadline", "Wanneer"],
        status: ["Status"],
        theme: ["Theme", "Thema"],
        minister: ["Minister"],
        party: ["Party", "Partij", "Parties"],
        shortDescription: ["Short description", "Korte beschrijving"],
        lastUpdated: ["Last updated", "Laatst bijgewerkt"],
        detailUrl: ["Detail URL"],
        sortOrder: ["Sort order", "Order", "Volgorde"],
        emoji: ["Emoji"],
        wat: ["Wat"],
        waar: ["Waar"],
        wanneer: ["Wanneer"],
        waarom: ["Waarom"],
        hoe: ["Hoe"],
        methodologie: ["Methodologie", "Methodology", "Methodiek"],
        verdict: ["Verdict", "Vonnis", "BRUZZ verdict"],
        woorden: ["Woorden", "Glossary", "Begrippen", "Moeilijke woorden"],
        dossier: ["Dossier", "Source URL", "Bron URL", "Article URL"],
        uitkomst: ["Uitkomst", "Outcome"],
        cijfers: ["Cijfers", "Numbers", "Kerncijfers"],
        nextUpdate: ["Next update", "Volgende update"],
        sourceLabel: ["Source label", "Bron label", "Brontekst label", "Bron type"],
        sourceTitle: ["Source title", "Bron title", "Bron titel", "Article title", "Artikel titel"],
        sourceDate: ["Source date", "Bron date", "Bron datum", "Article date", "Artikel datum"],
        sourceUrl: ["Source URL", "Bron URL", "Article URL", "Artikel URL", "Dossier"],
        heroImage: ["Hero image", "Hero image URL", "Image", "Image URL", "Foto", "Foto URL", "Beeld", "Beeld URL"],
        heroImageAlt: ["Hero image alt", "Image alt", "Alt text", "Alt", "Beeld alt"],
        heroImageCaption: ["Hero image caption", "Image caption", "Caption", "Bijschrift", "Beeld bijschrift"],
        heroImageCredit: ["Hero image credit", "Image credit", "Credit", "Foto credit", "Beeld credit"],
        heroImageFocus: ["Hero image focus", "Image focus", "Beeld focus"],
        heroImagePlacement: ["Hero image placement", "Image placement", "Beeld positie"]
      };

      const $ = (id) => root.querySelector(`#${id}`);

      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      /* Small inline icons (no icon font needed). */
      const ICONS = {
        flag: '<path d="M5.5 17V3.5M5.5 4.5h8.6l-1.9 3 1.9 3H5.5"/>',
        person: '<circle cx="10" cy="6.6" r="3.1"/><path d="M3.9 17c.6-3.2 3-5 6.1-5s5.5 1.8 6.1 5"/>',
        article: '<rect x="4" y="3" width="12" height="14" rx="2.2"/><path d="M7 7.5h6M7 10.5h6M7 13.5h3.5"/>',
        calendar_month: '<rect x="3.5" y="4.5" width="13" height="12" rx="2.4"/><path d="M3.5 8.5h13M7 3v3M13 3v3"/>',
        schedule: '<circle cx="10" cy="10" r="6.8"/><path d="M10 6.2V10l2.6 1.6"/>',
        expand_more: '<path d="M5 7.5 10 12.5l5-5"/>'
      };

      function renderIcon(name, className = "") {
        const path = ICONS[name];
        if (!path) return "";
        const extra = className ? ` ${className}` : "";
        return `<svg class="pd-icon${extra}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
      }

      /* Status icon: the same round icon images as the overview, with a simple fallback symbol. */
      function renderSym(conf) {
        if (!conf || !conf.symbol) return "";
        const url = String(conf.iconUrl || "").trim();
        const fallback = `<span class="pd-sym-fallback">${escapeHtml(conf.symbol)}</span>`;
        const img = /^https?:\/\//i.test(url)
          ? `<img class="pd-sym-img" src="${escapeHtml(url)}" alt="" decoding="async">`
          : "";
        return `<span class="pd-sym" style="--pd-sym-color:${escapeHtml(conf.color)};">${fallback}${img}</span>`;
      }

      root.addEventListener("load", event => {
        const img = event.target;
        if (img.tagName === "IMG" && img.classList.contains("pd-sym-img")) {
          const fb = img.previousElementSibling;
          if (fb) fb.style.visibility = "hidden";
        }
      }, true);

      root.addEventListener("error", event => {
        const img = event.target;
        if (img.tagName !== "IMG") return;
        if (img.classList.contains("pd-sym-img")) img.style.display = "none";
        if (img.classList.contains("pd-hero-avatar")) img.style.visibility = "hidden";
      }, true);

      function syncBodyTypography() {
        const sample = root.querySelector(
          ".pd-overview-item .pd-fact-copy p, .pd-verdict-lead p, .pd-copy p, .pd-update-body p, .pd-fact-copy p, .pd-overview-item .pd-fact-copy"
        );
        if (!sample) return;

        const style = window.getComputedStyle(sample);
        root.style.setProperty("--pd-body-font", style.fontFamily);
        root.style.setProperty("--pd-body-size", style.fontSize);
        root.style.setProperty("--pd-body-line-height", style.lineHeight);
        root.style.setProperty("--pd-body-weight", style.fontWeight || "400");
        root.style.setProperty("--pd-body-letter-spacing", style.letterSpacing || "normal");
      }

      function escapeCssUrl(value) {
        return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      }

      function applyInlineFormatting(value) {
        return escapeHtml(value)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
      }

      function cleanBulletText(value) {
        return String(value || "")
          .replace(/^[-*•]\s+/, "")
          .replace(/^[–—-]\s+/, "")
          .replace(/\s{2,}/g, " ")
          .trim();
      }

      function splitInlineDashBullets(text) {
        const normalized = String(text || "").trim();
        if (!/^[-*•]\s+/.test(normalized)) return [];

        const markerMatches = normalized.match(/\s[-*•]\s+(?=[A-ZÀ-Ý0-9–—-])/g) || [];
        if (!markerMatches.length) return [];

        return normalized
          .replace(/^[-*•]\s+/, "")
          .split(/\s[-*•]\s+(?=[A-ZÀ-Ý0-9–—-])/g)
          .map(item => cleanBulletText(item))
          .filter(Boolean);
      }

      function renderBulletList(items) {
        return `<ul>${items.map(item => `<li>${applyInlineFormatting(item)}</li>`).join("")}</ul>`;
      }

      function renderRichText(value) {
        const raw = String(value ?? "")
          .replace(/\r\n?/g, "\n")
          .replace(/\u00a0/g, " ")
          .trim();
        if (!raw) return "";

        const blocks = raw.split(/\n\s*\n+/).map(block => block.trim()).filter(Boolean);

        return blocks.map(block => {
          const lines = block.split(/\n+/).map(line => line.trim()).filter(Boolean);
          const bulletLines = lines.filter(line => /^[-*•]\s+/.test(line));

          if (lines.length > 1 && bulletLines.length === lines.length) {
            return renderBulletList(lines.map(cleanBulletText).filter(Boolean));
          }

          const inlineDashItems = splitInlineDashBullets(block);
          if (inlineDashItems.length > 1) {
            return renderBulletList(inlineDashItems);
          }

          const paragraph = lines
            .join(" ")
            .replace(/\s{2,}/g, " ")
            .trim();

          return paragraph ? `<p>${applyInlineFormatting(paragraph)}</p>` : "";
        }).join("");
      }

      function stripWrappingQuotes(value) {
        return String(value || "").trim().replace(/^[“”"']+/, "").replace(/[“”"']+$/, "").trim();
      }

      function flattenValues(value) {
        if (value == null) return [];
        if (["string", "number", "boolean"].includes(typeof value)) return [String(value)];
        if (Array.isArray(value)) return value.flatMap(flattenValues);
        if (typeof value === "object") {
          if ("value" in value && value.value != null) return flattenValues(value.value);
          if ("name" in value && value.name != null) return [String(value.name)];
          return Object.values(value).flatMap(flattenValues);
        }
        return [];
      }

      function getDisplayValue(field) {
        return [...new Set(flattenValues(field).filter(Boolean))].join(", ");
      }

      function getField(row, names) {
        for (const name of names) {
          if (Object.prototype.hasOwnProperty.call(row, name)) {
            const value = getDisplayValue(row[name]).trim();
            if (value) return value;
          }
        }
        return "";
      }

      function getRawField(row, names) {
        for (const name of names) {
          if (Object.prototype.hasOwnProperty.call(row, name) && row[name] != null) return row[name];
        }
        return null;
      }

      function findFirstUrl(value) {
        if (value == null) return "";
        if (typeof value === "string") {
          const match = value.match(/https?:\/\/[^\s,]+/i);
          return match ? match[0] : "";
        }
        if (Array.isArray(value)) {
          for (const item of value) {
            const found = findFirstUrl(item);
            if (found) return found;
          }
          return "";
        }
        if (typeof value === "object") {
          for (const key of ["url", "visible_name", "original_name", "link", "src"]) {
            if (typeof value[key] === "string") {
              const found = findFirstUrl(value[key]);
              if (found) return found;
            }
          }
          if (value.thumbnails) {
            const thumb = value.thumbnails.large?.url || value.thumbnails.medium?.url || value.thumbnails.small?.url;
            if (thumb) return thumb;
          }
          for (const item of Object.values(value)) {
            const found = findFirstUrl(item);
            if (found) return found;
          }
        }
        return "";
      }

      function getImageField(row, names) {
        const raw = getRawField(row, names);
        return findFirstUrl(raw) || getField(row, names);
      }

      function normalizeHeroPlacement(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (["below", "below-title", "onder", "onder titel", "na titel"].includes(raw)) return "below-title";
        return "above-title";
      }

      function imageFocusPosition(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (["top", "boven"].includes(raw)) return "center top";
        if (["bottom", "onder"].includes(raw)) return "center bottom";
        if (["left", "links"].includes(raw)) return "left center";
        if (["right", "rechts"].includes(raw)) return "right center";
        return "center center";
      }

      function getLinkedIds(field) {
        if (field == null) return [];
        if (typeof field === "number" || typeof field === "string") {
          const n = Number(field);
          return Number.isNaN(n) ? [] : [n];
        }
        if (Array.isArray(field)) return field.flatMap(getLinkedIds).filter(Boolean);
        if (typeof field === "object") {
          if ("id" in field && field.id != null) {
            const n = Number(field.id);
            return Number.isNaN(n) ? [] : [n];
          }
          if ("value" in field) return getLinkedIds(field.value);
          return Object.values(field).flatMap(getLinkedIds).filter(Boolean);
        }
        return [];
      }

      function slugify(value) {
        return String(value ?? "")
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      function parseFlexibleDate(value) {
        const raw = getDisplayValue(value).trim();
        if (!raw) return null;

        const direct = new Date(raw);
        if (!Number.isNaN(direct.getTime())) return direct;

        const ddmmyyyy = raw.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})\b/);
        if (ddmmyyyy) {
          const d = new Date(Number(ddmmyyyy[3]), Number(ddmmyyyy[2]) - 1, Number(ddmmyyyy[1]));
          if (!Number.isNaN(d.getTime())) return d;
        }

        const monthMap = {
          januari: 0, jan: 0, februari: 1, feb: 1, maart: 2, mrt: 2, april: 3, apr: 3,
          mei: 4, juni: 5, jun: 5, juli: 6, jul: 6, augustus: 7, aug: 7,
          september: 8, sep: 8, sept: 8, oktober: 9, okt: 9, november: 10, nov: 10, december: 11, dec: 11
        };

        const lower = raw.toLowerCase();
        const monthYear = lower.match(/\b(januari|jan|februari|feb|maart|mrt|april|apr|mei|juni|jun|juli|jul|augustus|aug|september|sep|sept|oktober|okt|november|nov|december|dec)\s+(\d{4})\b/);
        if (monthYear) return new Date(Number(monthYear[2]), monthMap[monthYear[1]], 1);

        const year = lower.match(/\b(20\d{2}|19\d{2})\b/);
        if (year) return new Date(Number(year[1]), 0, 1);

        return null;
      }

      function formatDate(value) {
        const raw = getDisplayValue(value);
        if (!raw) return "";
        const d = parseFlexibleDate(raw);
        if (!d) return raw;
        return d.toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
      }

      function formatTimelineLabel(time) {
        const d = new Date(time);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
      }

      function getDateTime(value) {
        const d = parseFlexibleDate(value);
        return d ? d.getTime() : 0;
      }

      function statusKey(rawStatus) {
        const raw = getDisplayValue(rawStatus).trim().toUpperCase();
        const mapped = LEGACY_STATUS_MAP[raw] || raw;
        return STATUS_CONFIG[mapped] ? mapped : "GESTART";
      }

      // "NIET OP SCHEMA" -> "Niet op schema"
      function statusLabel(key) {
        const lower = String(key || "").toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      // Accent-insensitive, case-insensitive name match: "Boris Dilliès" = "Boris DILLIÈS"
      function fold(value) {
        return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      }

      function ministerFor(name) {
        const key = fold(name);
        if (!key) return null;
        return MINISTERS.find(m => fold(m.name) === key) || null;
      }

      // A promise can have two or three responsible ministers (and parties). The column can hold several
      // values (multiple select / linked rows) or one text with separators (comma, "en", "&", "/", ";").
      const LIST_SPLIT = /\s*(?:,|;|\/|&|\+|\n|\ben\b)\s*/i;

      function listValues(field) {
        const out = [];
        flattenValues(field).forEach(value => {
          String(value).split(LIST_SPLIT).forEach(part => {
            const clean = part.trim();
            if (clean && !out.some(x => fold(x) === fold(clean))) out.push(clean);
          });
        });
        return out;
      }

      // "A", "A en B", "A, B en C"
      function joinNames(list) {
        return list.length < 2 ? (list[0] || "") : list.slice(0, -1).join(", ") + " en " + list[list.length - 1];
      }

      // minister + party for each responsible minister; the party comes from the ministers list,
      // or from the Party column when the list does not know the person
      function ministerPeople(ministerField, partyField) {
        const names = listValues(ministerField);
        const parties = listValues(partyField);
        return names.map((name, i) => {
          const person = ministerFor(name);
          const party = names.length === 1
            ? (parties.join(" en ") || (person ? person.partij : ""))
            : ((person && person.partij) || parties[i] || "");
          return { name, person, party };
        });
      }

      function peopleText(people) {
        return joinNames(people.map(p => p.party ? `${p.name} (${p.party})` : p.name));
      }

      // a column looked up by name, ignoring case, spaces and dashes ("Volgendebeoordeling" = "Volgende beoordeling")
      function getColumn(row, normalizedName) {
        const key = Object.keys(row).find(k => k.toLowerCase().replace(/[\s_-]+/g, "") === normalizedName);
        return key ? row[key] : null;
      }

      // a real date is shown as "5 okt 2026"; free text ("najaar 2026") is shown as it is
      function formatMaybeDate(raw) {
        const text = String(raw || "").trim();
        if (!text) return "";
        if (/^\d{4}-\d{2}-\d{2}/.test(text) || /^\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}$/.test(text)) return formatDate(text);
        return text;
      }

      // Black or white text, whichever contrasts better with the status colour behind it.
      function luminance(hex) {
        let h = String(hex || "").replace("#", "");
        if (h.length === 3) h = h.split("").map(c => c + c).join("");
        const n = parseInt(h, 16);
        if (Number.isNaN(n) || h.length !== 6) return 1;
        const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
      }

      function onColorFor(hex) {
        const L = luminance(hex);
        const withWhite = 1.05 / (L + 0.05);
        const withDark = (L + 0.05) / (luminance("#1F1F1F") + 0.05);
        // white wins ties and near-ties: it reads better on saturated colours such as the red
        return withWhite >= withDark * 0.9 ? "#FFFFFF" : "#1F1F1F";
      }

      // "Beoordeling was op": the most recent date in the "Laatsteverdict" column
      // (on the promise or on one of its updates; matched ignoring case, spaces and dashes).
      function getVerdictDate(promise, updates) {
        let best = 0;
        [promise, ...updates].forEach(row => {
          Object.keys(row).forEach(key => {
            if (key.toLowerCase().replace(/[\s_-]+/g, "") !== "laatsteverdict") return;
            flattenValues(row[key]).forEach(value => {
              const d = parseFlexibleDate(value);
              const time = d ? d.getTime() : 0;
              if (time > best) best = time;
            });
          });
        });
        return best ? new Date(best).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" }) : "";
      }

      function statusConfigFromValue(value) {
        return STATUS_CONFIG[statusKey(value)] || null;
      }

      function statusConfigFor(row) {
        return STATUS_CONFIG[statusKey(getField(row, PROMISE_FIELDS.status))] || STATUS_CONFIG["GESTART"];
      }

      function getUpdateStatus(update) {
        return getField(update, ["Status", "Nieuwe status", "New status", "Status update", "Vonnis"]);
      }

      function statusConfigForUpdate(update, fallbackConf) {
        const raw = getUpdateStatus(update);
        return statusConfigFromValue(raw) || fallbackConf;
      }

      function getTimelineBounds(promise, updates) {
        const times = [];

        [
          getField(promise, PROMISE_FIELDS.datePromised),
          getField(promise, PROMISE_FIELDS.deadlinePromised),
          getField(promise, PROMISE_FIELDS.wanneer)
        ].forEach(value => {
          const time = getDateTime(value);
          if (time) times.push(time);
        });

        updates.forEach(update => {
          [
            update["Update date"],
            getField(update, ["Wanneer", "When", "Deadline", "Aangekondigd voor"])
          ].forEach(value => {
            const time = getDateTime(value);
            if (time) times.push(time);
          });
        });

        const today = Date.now();
        const start = times.length ? Math.min(...times) : TIMELINE_START.getTime();
        let end = Math.max(today, ...(times.length ? times : [TIMELINE_END.getTime()]));

        if (end <= start) {
          end = start + 1000 * 60 * 60 * 24;
        }

        return {
          start,
          end,
          today,
          todayPos: getTimelineProgressPercent(today, { start, end }),
          showToday: today >= start && today <= end
        };
      }

      function getTimelineProgressPercent(dateValue, bounds) {
        const start = bounds?.start ?? TIMELINE_START.getTime();
        const end = bounds?.end ?? TIMELINE_END.getTime();
        const current = typeof dateValue === "number" ? dateValue : getDateTime(dateValue);
        if (!current || Number.isNaN(current)) return 0;
        if (current <= start) return 0;
        if (current >= end) return 100;
        return ((current - start) / (end - start)) * 100;
      }

      function normalizeType(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (!raw) return "timeline";
        if (["quote", "citaat"].includes(raw)) return "quote";
        if (["subpromise", "deelbelofte", "deelbelofte/status", "subbelofte"].includes(raw)) return "subpromise";
        if (["faq", "vraag"].includes(raw)) return "faq";
        if (["vonnis", "verdict", "beoordeling"].includes(raw)) return "verdict";
        if (["tijdlijn", "timeline", "update", "nieuws"].includes(raw)) return "timeline";
        return "timeline";
      }

      function getUpdateType(update) {
        return normalizeType(getField(update, ["Type", "Update type", "Single select", "Soort", "Categorie", "Category"]));
      }

      function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
          promiseKey: params.get("promise_key") || params.get("key") || params.get("slug") || "",
          id: params.get("id") || ""
        };
      }

      function getPromiseKey(row) {
        return getField(row, PROMISE_FIELDS.key);
      }

      function findPromise(promises) {
        const { promiseKey, id } = getUrlParams();
        const wantedId = Number(id);
        const wantedKey = slugify(promiseKey || DEFAULT_PROMISE_KEY);

        if (wantedId) {
          const byId = promises.find(row => Number(row.id) === wantedId);
          if (byId) return byId;
        }

        if (wantedKey) {
          return promises.find(row => {
            const rowKey = slugify(getPromiseKey(row));
            const titleKey = slugify(getField(row, PROMISE_FIELDS.title));
            return rowKey === wantedKey || titleKey === wantedKey;
          });
        }

        return null;
      }

      function getPromiseUpdates(promiseRow, allUpdates) {
        const promiseRowId = Number(promiseRow.id);
        const promiseKey = getPromiseKey(promiseRow).trim();

        return allUpdates
          .filter(update => {
            const linkedIds = getLinkedIds(update["Promise"]);
            const updateKey = getField(update, ["Promise key", "Key", "Slug"]);
            return linkedIds.includes(promiseRowId) || (promiseKey && updateKey === promiseKey);
          })
          .sort((a, b) => {
            const orderA = Number(getField(a, ["Order", "Volgorde", "Sort"]));
            const orderB = Number(getField(b, ["Order", "Volgorde", "Sort"]));
            if (!Number.isNaN(orderA) || !Number.isNaN(orderB)) return (orderA || 9999) - (orderB || 9999);
            return getDateTime(a["Update date"]) - getDateTime(b["Update date"]);
          });
      }

      function getLatestUpdate(updates) {
        return [...updates]
          .filter(update => getUpdateType(update) !== "quote")
          .filter(update => getDateTime(update["Update date"]))
          .sort((a, b) => getDateTime(b["Update date"]) - getDateTime(a["Update date"]))[0] || null;
      }

      async function fetchTable(url, label, proxyPath) {
        const useProxy = Boolean(API_BASE_URL);
        const requestUrl = useProxy ? `${API_BASE_URL.replace(/\/$/, "")}/${proxyPath}` : url;
        const options = useProxy ? {} : { headers: { "Authorization": `Token ${TOKEN}` } };

        const res = await fetch(requestUrl, options);
        const text = await res.text();
        if (!res.ok) throw new Error(`${label} failed (${res.status}): ${text}`);
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : (data.results || []);
      }

      function renderTerms(row) {
        const glossary = getField(row, PROMISE_FIELDS.woorden);
        if (!glossary) return "";

        const terms = glossary
          .split(/\n+/)
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => {
            const parts = line.split(/\s*(?:=|:|–|-)\s*/);
            return {
              term: parts.shift() || "",
              definition: parts.join(" - ") || ""
            };
          })
          .filter(item => item.term);

        if (!terms.length) return "";

        return `
          <div class="pd-terms">
            ${terms.map(item => `
              <div class="pd-term">
                <span class="pd-term-title">${escapeHtml(item.term)}</span>
                ${item.definition ? `<p class="pd-term-text">${renderRichText(item.definition)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        `;
      }

      function renderTimeline(promise, updates, conf) {
        const timelineUpdates = updates
          .filter(update => getUpdateType(update) !== "quote")
          .sort((a, b) => getDateTime(b["Update date"]) - getDateTime(a["Update date"]));
        const datedUpdates = timelineUpdates.filter(update => getDateTime(update["Update date"]));
        const bounds = getTimelineBounds(promise, timelineUpdates);
        const visibleCount = 5;

        if (!timelineUpdates.length) {
          return `<div class="pd-empty">Nog geen updates voor deze belofte.</div>`;
        }

        const eventDots = datedUpdates.map(update => {
          const pct = getTimelineProgressPercent(getField(update, ["Update date"]), bounds);
          const updateStatus = getUpdateStatus(update);
          const updateType = getUpdateType(update);
          const updateConf = (updateStatus || updateType === "verdict")
            ? statusConfigForUpdate(update, conf)
            : { color: "#ff0033" };
          const title = getField(update, ["Update title", "Title", "Titel"]) || formatDate(update["Update date"]);
          return `
            <button
              type="button"
              class="pd-event-dot"
              style="--event-pos:${pct}%; --event-color:${updateConf.color};"
              data-update-target="pd-update-${escapeHtml(update.id)}"
              title="${escapeHtml(title)}"
              aria-label="Ga naar update: ${escapeHtml(title)}"
            ></button>
          `;
        }).join("");

        return `
          <div class="pd-timeline-wrap">
            <div class="pd-timeline-shell" aria-hidden="${datedUpdates.length ? "false" : "true"}">
              <div class="pd-timeline-track">
                ${eventDots}
              </div>
              <div class="pd-timeline-label-row">
                <span>${escapeHtml(formatTimelineLabel(bounds.start))}</span>
                <span>${escapeHtml(formatTimelineLabel(bounds.end))}</span>
              </div>
            </div>

            <div class="pd-update-list" aria-label="Tijdlijn updates">
              ${timelineUpdates.map((update, index) => renderUpdateCard(update, conf, index >= visibleCount)).join("")}
            </div>

            ${timelineUpdates.length > visibleCount ? `
              <div class="pd-show-more-row">
                <button class="pd-show-more-button" type="button" data-show-target="updates" data-total="${timelineUpdates.length}" aria-expanded="false">
                  Toon alle updates (${timelineUpdates.length})
                </button>
              </div>
            ` : ""}
          </div>
        `;
      }

      function renderUpdateCard(update, conf, initiallyHidden = false) {
        const type = getUpdateType(update);
        const label = TYPE_LABELS[type] || "Update";
        const title = getField(update, ["Update title", "Title", "Titel"]);
        const date = formatDate(update["Update date"]);
        const when = getField(update, ["Wanneer", "When"]);
        const body = getField(update, ["Detail text", "Context", "Update tekst detail", "Update tekst uitklap", "Body", "Tekst"]);
        const url = getField(update, ["Article URL", "Source URL", "Bron URL", "URL"]);
        const updateStatus = getUpdateStatus(update);
        const hasStatusColor = Boolean(updateStatus) || type === "verdict";
        const updateConf = hasStatusColor ? statusConfigForUpdate(update, conf) : { color: "#d8d8d8", bg: "#ffffff", icon: "" };
        const cardClass = ["pd-update-card", hasStatusColor ? "pd-update-status" : ""].filter(Boolean).join(" ");
        const hasBody = Boolean(body);
        const isVerdictUpdate = type === "verdict";
        const statusPill = updateStatus ? `<span class="pd-update-status-pill${isVerdictUpdate ? " pd-update-status-main" : ""}">${renderSym(updateConf)}${escapeHtml(statusLabel(statusKey(updateStatus)))}</span>` : "";
        const linkMarkup = url ? `<a class="pd-update-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">Lees meer</a>` : "";
        const titleMarkup = isVerdictUpdate && updateStatus
          ? statusPill
          : (title ? `<h3 class="pd-update-title">${escapeHtml(title)}</h3>` : statusPill);

        return `
          <article
            class="${cardClass}"
            id="pd-update-${escapeHtml(update.id)}"
            style="--update-color:${updateConf.color}; --update-bg:${hasStatusColor ? updateConf.bg : "#ffffff"};"
            ${hasBody ? `data-has-body="true" role="button" tabindex="0" aria-expanded="false" aria-controls="pd-update-body-${escapeHtml(update.id)}"` : ""}
            ${initiallyHidden ? "hidden data-extra-update" : ""}
          >
            <div class="pd-update-meta">
              <span class="pd-type-badge">${escapeHtml(label)}</span>
              ${(!isVerdictUpdate && updateStatus) ? statusPill : ""}
              <span class="pd-update-date">${escapeHtml(date || when || "")}</span>
            </div>
            <div class="pd-update-main">
              ${titleMarkup}
              ${(!hasBody && linkMarkup) ? linkMarkup : ""}
            </div>
            <div class="pd-update-actions">
              ${hasBody ? `<span class="pd-update-chevron" aria-hidden="true">${renderIcon("expand_more")}</span>` : ""}
            </div>
            ${hasBody ? `<div class="pd-update-body" id="pd-update-body-${escapeHtml(update.id)}" hidden>${renderRichText(body)}${linkMarkup}</div>` : ""}
          </article>
        `;
      }

      function cleanCmsQuoteText(value) {
        return String(value || "").replace(/\s+/g, " ").trim();
      }

      function sanitizeCmsInlineHtml(value) {
        const template = document.createElement("template");
        template.innerHTML = String(value || "").trim();

        const allowedTags = new Set(["A", "STRONG", "B", "EM", "I", "BR", "SPAN"]);
        const allowedAttributes = {
          A: new Set(["href", "title", "target", "rel"]),
          STRONG: new Set(),
          B: new Set(),
          EM: new Set(),
          I: new Set(),
          BR: new Set(),
          SPAN: new Set()
        };

        Array.from(template.content.querySelectorAll("*")).forEach(element => {
          if (!allowedTags.has(element.tagName)) {
            element.replaceWith(...Array.from(element.childNodes));
            return;
          }

          Array.from(element.attributes).forEach(attribute => {
            if (!allowedAttributes[element.tagName].has(attribute.name.toLowerCase())) {
              element.removeAttribute(attribute.name);
            }
          });

          if (element.tagName === "A") {
            const href = element.getAttribute("href") || "";
            try {
              const url = new URL(href, window.location.href);
              if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
                element.removeAttribute("href");
              }
            } catch (_) {
              element.removeAttribute("href");
            }

            // External article/source links inside quote blocks always open
            // in a new tab. Keep mailto:/tel: links in the current context.
            if (element.hasAttribute("href")) {
              try {
                const safeUrl = new URL(element.getAttribute("href"), window.location.href);
                if (["http:", "https:"].includes(safeUrl.protocol)) {
                  element.setAttribute("target", "_blank");
                  element.setAttribute("rel", "noopener noreferrer");
                } else {
                  element.removeAttribute("target");
                  element.removeAttribute("rel");
                }
              } catch (_) {
                element.removeAttribute("target");
                element.removeAttribute("rel");
              }
            }
          }
        });

        return template.innerHTML;
      }

      function addCmsLinkIcons(html) {
        if (!html) return "";

        const template = document.createElement("template");
        template.innerHTML = html;

        template.content.querySelectorAll("a").forEach(link => {
          const icon = document.createElement("span");
          icon.className = "pd-quote-link-icon";
          icon.setAttribute("aria-hidden", "true");
          link.before(icon);
        });

        return template.innerHTML;
      }

      function getCmsInlineHtml(block, selector) {
        const element = block.querySelector(selector);
        if (!element) return "";

        // Preserve CMS-rendered inline HTML. If the CMS prints tags literally,
        // parse the text as HTML as well. The sanitizer above limits what survives.
        const raw = element.children.length ? element.innerHTML : element.textContent;
        return addCmsLinkIcons(sanitizeCmsInlineHtml(raw));
      }

      function normalizeCmsImageUrl(value) {
        const raw = String(value || "").trim();
        if (!raw) return "";

        try {
          const url = new URL(raw, window.location.href);
          return ["http:", "https:"].includes(url.protocol) ? url.href : "";
        } catch (_) {
          return "";
        }
      }

      function parseCmsSrcset(value) {
        return String(value || "")
          .split(",")
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => {
            const parts = item.split(/\s+/);
            const src = normalizeCmsImageUrl(parts[0]);
            const descriptor = parts[1] || "";
            const widthMatch = descriptor.match(/^(\d+)w$/);
            const densityMatch = descriptor.match(/^([\d.]+)x$/);
            return {
              src,
              score: widthMatch ? Number(widthMatch[1]) : (densityMatch ? Number(densityMatch[1]) * 1000 : 0)
            };
          })
          .filter(item => item.src);
      }

      function getBruzzOriginalImageCandidate(value) {
        const src = normalizeCmsImageUrl(value);
        if (!src) return "";

        try {
          const url = new URL(src);
          const match = url.pathname.match(/^\/styles\/[^/]+\/(.+)$/);
          if (!match) return "";

          // BRUZZ image derivatives contain the original relative image path after
          // /styles/<style-hash>/. Try that original path first. If the CDN does not
          // expose it publicly, the image fallback handler below restores the CMS URL.
          return `${url.origin}/${match[1]}`;
        } catch (_) {
          return "";
        }
      }

      function getCmsQuoteImage(block) {
        const image = block.querySelector(".blockquote__image, img");
        if (!image) return null;

        const candidates = [];
        const pushCandidate = (src, score = 0) => {
          const normalized = normalizeCmsImageUrl(src);
          if (!normalized) return;
          if (candidates.some(item => item.src === normalized)) return;
          candidates.push({ src: normalized, score });
        };

        // Prefer responsive/lazy-loaded sources when the CMS exposes them.
        const picture = image.closest("picture");
        if (picture) {
          picture.querySelectorAll("source[srcset], source[data-srcset]").forEach(source => {
            parseCmsSrcset(source.getAttribute("srcset") || source.getAttribute("data-srcset"))
              .forEach(item => pushCandidate(item.src, item.score + 20000));
          });
        }

        [
          image.getAttribute("srcset"),
          image.getAttribute("data-srcset"),
          image.getAttribute("data-lazy-srcset")
        ].filter(Boolean).forEach(srcset => {
          parseCmsSrcset(srcset).forEach(item => pushCandidate(item.src, item.score + 10000));
        });

        [
          "data-original",
          "data-original-src",
          "data-full-src",
          "data-fullsize",
          "data-large-src",
          "data-lazy-src",
          "data-src"
        ].forEach(attribute => {
          const value = image.getAttribute(attribute);
          if (value) pushCandidate(value, 50000);
        });

        const currentSrc = image.currentSrc || "";
        const normalSrc = image.getAttribute("src") || "";
        pushCandidate(currentSrc, 1000);
        pushCandidate(normalSrc, 900);

        // The BRUZZ URL in the CMS can itself be a signed 300x300 derivative. Try
        // the corresponding original CDN path before falling back to that derivative.
        [currentSrc, normalSrc].forEach(src => {
          const originalCandidate = getBruzzOriginalImageCandidate(src);
          if (originalCandidate) pushCandidate(originalCandidate, 100000);
        });

        if (!candidates.length) return null;

        candidates.sort((a, b) => b.score - a.score);

        return {
          src: candidates[0].src,
          candidates: candidates.map(item => item.src),
          alt: cleanCmsQuoteText(image.getAttribute("alt") || "")
        };
      }

      function setupCmsQuoteImageFallbacks(scope) {
        scope.querySelectorAll(".pd-quote-image[data-image-candidates]").forEach(image => {
          let candidates = [];
          try {
            candidates = JSON.parse(image.getAttribute("data-image-candidates") || "[]");
          } catch (_) {
            candidates = [];
          }

          candidates = candidates
            .map(normalizeCmsImageUrl)
            .filter(Boolean)
            .filter((src, index, array) => array.indexOf(src) === index);

          let index = Math.max(0, candidates.indexOf(normalizeCmsImageUrl(image.getAttribute("src"))));

          image.addEventListener("error", () => {
            index += 1;
            if (index < candidates.length) {
              image.src = candidates[index];
            }
          });
        });
      }

      function isAfterPromiseDetail(node) {
        return Boolean(root.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);
      }

      function readSiteQuoteBlocks() {
        // Prefer the CMS block wrapper when it exists. Some templates expose the
        // .blockquote element directly, so use that as a fallback.
        const wrappedBlocks = Array.from(document.querySelectorAll(".block--quote"));
        const sourceBlocks = wrappedBlocks.length
          ? wrappedBlocks
          : Array.from(document.querySelectorAll(".blockquote"));

        return sourceBlocks
          .filter(block => !root.contains(block))
          .filter(isAfterPromiseDetail)
          .map((block, index) => ({
            block,
            text: stripWrappingQuotes(cleanCmsQuoteText(block.querySelector(".blockquote__text")?.textContent)),
            authorHtml: getCmsInlineHtml(block, ".blockquote__author"),
            functionHtml: getCmsInlineHtml(block, ".blockquote__function"),
            image: getCmsQuoteImage(block),
            index
          }))
          .filter(quote => quote.text);
      }

      function renderQuotes(quotes) {
        if (!quotes.length) return "";

        const leftColumn = quotes.filter((_, index) => index % 2 === 0);
        const rightColumn = quotes.filter((_, index) => index % 2 === 1);

        return `
          <section class="pd-section" id="debat">
            <div class="pd-section-head">
              <h2 class="pd-section-title">Wat is er gezegd?</h2>
            </div>

            <div class="pd-quotes-grid">
              <div class="pd-quotes-column">
                ${leftColumn.map(renderQuoteCard).join("")}
              </div>

              <div class="pd-quotes-column">
                ${rightColumn.map(renderQuoteCard).join("")}
              </div>
            </div>
          </section>
        `;
      }

      function renderQuoteCard(quote) {
        const hasMeta = Boolean(quote.authorHtml || quote.functionHtml);
        const hasImage = Boolean(quote.image?.src);

        return `
          <article class="pd-quote-card${hasImage ? " pd-has-image" : ""}">
            <div class="pd-quote-content">
              <div class="pd-quote-mark" aria-hidden="true">“</div>

              <p class="pd-quote-text">${escapeHtml(quote.text)}</p>

              ${hasMeta ? `
                <div class="pd-quote-footer">
                  <div class="pd-quote-person-block">
                    ${quote.authorHtml ? `<div class="pd-quote-source-name">${quote.authorHtml}</div>` : ""}
                    ${quote.functionHtml ? `<div class="pd-quote-role">${quote.functionHtml}</div>` : ""}
                  </div>
                </div>
              ` : ""}

            </div>

            ${hasImage ? `
              <div class="pd-quote-image-wrap">
                <img
                  class="pd-quote-image"
                  src="${escapeHtml(quote.image.src)}"
                  data-image-candidates="${escapeHtml(JSON.stringify(quote.image.candidates || [quote.image.src]))}"
                  alt="${escapeHtml(quote.image.alt)}"
                  loading="lazy"
                >
              </div>
            ` : ""}
          </article>
        `;
      }

      let cmsQuoteObserver = null;
      let cmsQuoteObserverTimer = null;

      function syncCmsQuotes() {
        const mount = $("pdQuotesMount");
        if (!mount) return false;

        const quotes = readSiteQuoteBlocks();
        if (!quotes.length) {
          mount.innerHTML = "";
          return false;
        }

        mount.innerHTML = renderQuotes(quotes);
        setupCmsQuoteImageFallbacks(mount);

        quotes.forEach(quote => {
          quote.block.classList.add("pd-cms-quote-source-hidden");
        });

        return true;
      }

      function stopCmsQuoteObserver() {
        if (cmsQuoteObserver) {
          cmsQuoteObserver.disconnect();
          cmsQuoteObserver = null;
        }
        if (cmsQuoteObserverTimer) {
          clearTimeout(cmsQuoteObserverTimer);
          cmsQuoteObserverTimer = null;
        }
      }

      function startCmsQuoteSync() {
        stopCmsQuoteObserver();

        if (syncCmsQuotes()) return;

        cmsQuoteObserver = new MutationObserver(() => {
          if (syncCmsQuotes()) {
            stopCmsQuoteObserver();
          }
        });

        cmsQuoteObserver.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        cmsQuoteObserverTimer = setTimeout(stopCmsQuoteObserver, 10000);
      }

      function renderHeroImage(promise, status, placement) {
        const imageUrl = getImageField(promise, PROMISE_FIELDS.heroImage);
        if (!imageUrl) return "";

        const alt = getField(promise, PROMISE_FIELDS.heroImageAlt) || getField(promise, PROMISE_FIELDS.title);
        const caption = getField(promise, PROMISE_FIELDS.heroImageCaption);
        const credit = getField(promise, PROMISE_FIELDS.heroImageCredit);
        const focus = imageFocusPosition(getField(promise, PROMISE_FIELDS.heroImageFocus));

        return `
          <figure class="pd-hero-image-frame" style="--pd-image-focus:${escapeHtml(focus)};">
            <div class="pd-hero-image-wrap">
              <img class="pd-hero-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" loading="eager">
            </div>
            ${(caption || credit) ? `
              <figcaption class="pd-hero-image-caption">
                ${caption ? `<span>${escapeHtml(caption)}</span>` : `<span></span>`}
                ${credit ? `<span class="pd-hero-image-credit">${escapeHtml(credit)}</span>` : ""}
              </figcaption>
            ` : ""}
          </figure>
        `;
      }

      function renderOverviewItem(key, label, value) {
        if (!isMeaningfulText(value)) return "";
        if (!value) return "";
        return `
          <article class="pd-overview-item pd-overview-${escapeHtml(key)}">
            <div class="pd-overview-label-row">
              <span class="pd-overview-label">${escapeHtml(label)}</span>
            </div>
            <div class="pd-fact-copy">${renderRichText(value)}</div>
          </article>
        `;
      }

      function renderPromiseFacts(promise) {
        const items = [
          renderOverviewItem("wat", "Wat", getField(promise, PROMISE_FIELDS.wat)),
          renderOverviewItem("waar", "Waar", getField(promise, PROMISE_FIELDS.waar)),
          renderOverviewItem("wanneer", "Wanneer", getField(promise, PROMISE_FIELDS.wanneer) || getField(promise, PROMISE_FIELDS.deadlinePromised)),
          renderOverviewItem("waarom", "Waarom", getField(promise, PROMISE_FIELDS.waarom)),
          renderOverviewItem("hoe", "Hoe", getField(promise, PROMISE_FIELDS.hoe))
        ].filter(Boolean);

        if (items.length) {
          return `
            <div class="pd-promise-overview-box" aria-label="Belofte in het kort">
              <div class="pd-overview-grid">
                ${items.join("")}
              </div>
            </div>
          `;
        }

        const fallback = getField(promise, PROMISE_FIELDS.shortDescription);
        return fallback
          ? `<div class="pd-copy">${renderRichText(fallback)}</div>`
          : `<div class="pd-empty">Vul de velden Wat, Waar, Wanneer, Waarom en Hoe in Baserow om deze sectie te vullen.</div>`;
      }

      function plainText(value) {
        return String(value || "")
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/\s+/g, " ")
          .trim();
      }

      function metricPlainText(value) {
        return String(value || "")
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/\r\n?/g, "\n")
          .replace(/[ \t]+/g, " ")
          .replace(/\n{2,}/g, "\n")
          .trim();
      }

      function isMeaningfulText(value) {
        const text = plainText(value)
          .replace(/^[\s:;.,\-–—]+|[\s:;.,\-–—]+$/g, "")
          .trim();
        if (!text) return false;
        if (/^[A-Za-zÀ-ÿ ]{1,24}:?$/.test(text)) return false;
        return /[A-Za-zÀ-ÿ0-9]/.test(text) && text.length > 6;
      }

      function sentenceFromMatch(text, index) {
        const start = Math.max(text.lastIndexOf(".", index), text.lastIndexOf("\n", index));
        const endDot = text.indexOf(".", index);
        const endBreak = text.indexOf("\n", index);
        const ends = [endDot, endBreak].filter(n => n >= 0);
        const end = ends.length ? Math.min(...ends) : text.length;
        return text.slice(start + 1, end).trim();
      }

      function highlightFirstMetric(sentence, value) {
        const sentenceText = String(sentence || "");
        const metricText = String(value || "").trim();
        if (!sentenceText) return "";
        if (!metricText) return escapeHtml(sentenceText);
        const index = sentenceText.toLowerCase().indexOf(metricText.toLowerCase());
        if (index < 0) return escapeHtml(sentenceText);
        return `${escapeHtml(sentenceText.slice(0, index))}<strong>${escapeHtml(sentenceText.slice(index, index + metricText.length))}</strong>${escapeHtml(sentenceText.slice(index + metricText.length))}`;
      }

      function extractMetricItems(...values) {
        const text = plainText(values.filter(Boolean).join("\n"));
        if (!text) return [];

        const seen = new Set();
        const metrics = [];
        const metricRegex = /([+-]?\d{1,3}(?:[\s.]\d{3})*(?:[,.]\d+)?\s?%|[+-]?\d+(?:[,.]\d+)?\s?procent|\b\d{1,3}(?:[\s.]\d{3})+\b)/gi;
        let match;

        while ((match = metricRegex.exec(text)) && metrics.length < 4) {
          const value = match[1].replace(/\s+(?=%)/g, "");
          const normalized = value.toLowerCase();
          if (seen.has(normalized)) continue;
          seen.add(normalized);

          let sentence = cleanBulletText(sentenceFromMatch(text, match.index));
          let label = sentence.replace(match[1], "").replace(/^[\s:;,.\-–—]+|[\s:;,.\-–—]+$/g, "").trim();
          if (label.length > 115) label = label.slice(0, 112).replace(/\s+\S*$/, "") + "…";
          if (!label || /^[,:;\-–—]+$/.test(label)) label = "Kerncijfer uit de beoordeling";

          metrics.push({ value, label, sentence });
        }

        return metrics;
      }

      function renderMetricGrid(metrics) {
        if (!metrics.length) return "";
        return `
          <div class="pd-metric-panel">
            <h3 class="pd-metric-panel-title">Kerncijfers</h3>
            <div class="pd-metric-grid">
              ${metrics.map(item => `
                <article class="pd-metric-card">
                  <span class="pd-metric-value">${escapeHtml(item.value)}</span>
                  <span class="pd-metric-label">${escapeHtml(item.label)}</span>
                </article>
              `).join("")}
            </div>
          </div>
        `;
      }

      function renderEvidenceBlock(title, value) {
        if (!isMeaningfulText(value)) return "";
        return `
          <article class="pd-evidence-card">
            <h3 class="pd-evidence-title">${escapeHtml(title)}</h3>
            <div class="pd-fact-copy">${renderRichText(value)}</div>
          </article>
        `;
      }

      function renderEvidenceGrid(promise) {
        const outcome = getField(promise, PROMISE_FIELDS.uitkomst);
        const numbers = getField(promise, PROMISE_FIELDS.cijfers);
        const metrics = extractMetricItems(numbers, outcome);
        const outcomeBlock = renderEvidenceBlock("Uitkomst", outcome);
        const numbersFallback = !metrics.length ? renderEvidenceBlock("Cijfers", numbers) : "";
        const metricBlock = renderMetricGrid(metrics);
        const blocks = [outcomeBlock, metricBlock || numbersFallback].filter(Boolean);
        return blocks.length ? `<div class="pd-evidence-grid">${blocks.join("")}</div>` : "";
      }

      function renderVerdictEvidence(promise) {
        const metrics = extractMetricItems(
          getField(promise, PROMISE_FIELDS.cijfers),
          getField(promise, PROMISE_FIELDS.uitkomst)
        ).slice(0, 3);

        if (!metrics.length) return "";

        return `
          <div class="pd-verdict-evidence">
            <h3 class="pd-verdict-evidence-title">Waarom dit vonnis?</h3>
            <ul class="pd-verdict-evidence-list">
              ${metrics.map(item => `<li>${highlightFirstMetric(item.sentence || `${item.value} ${item.label}`, item.value)}</li>`).join("")}
            </ul>
          </div>
        `;
      }

      function renderSummaryItem(label, value) {
        if (!value) return "";
        return `
          <div class="pd-summary-item">
            <span class="pd-summary-label">${escapeHtml(label)}</span>
            <span class="pd-summary-value">${escapeHtml(value)}</span>
          </div>
        `;
      }

      function renderPage(promise, updates) {
        const host = $("pdRoot");
        const conf = statusConfigFor(promise);
        const status = statusKey(getField(promise, PROMISE_FIELDS.status));
        const latestUpdate = getLatestUpdate(updates);

        root.style.setProperty("--pd-status-color", conf.color);
        root.style.setProperty("--pd-status-bg", conf.bg);
        /* white text on the teal "Gelukt" header; other statuses pick black or white by contrast */
        const WHITE_TEXT_ON = ["GELUKT"];
        const onColor = WHITE_TEXT_ON.includes(status) ? "#FFFFFF" : onColorFor(conf.color);
        root.style.setProperty("--pd-on-status", onColor);

        const promiseTitle = getField(promise, PROMISE_FIELDS.title);
        const plainTitle = promiseTitle.replace(/[“”"]/g, "").trim();
        const titleClass = plainTitle.length > 44 ? "pd-title pd-title-long" : "pd-title";
        const emoji = getField(promise, PROMISE_FIELDS.emoji);
        const people = ministerPeople(getRawField(promise, PROMISE_FIELDS.minister), getRawField(promise, PROMISE_FIELDS.party));
        const avatarOf = p => p.person
          ? `<img class="pd-hero-avatar" src="${escapeHtml(p.person.image)}" alt="" loading="lazy">`
          : renderIcon("person");
        const personText = p => escapeHtml(p.party ? `${p.name} (${p.party})` : p.name);
        // one minister: photo next to the label and name; several: a list with a photo for each, below each other
        const ministerBlock = people.length > 1
          ? `
                    <div class="pd-hero-detail pd-hero-detail-list">
                      <div>
                        <span class="pd-hero-detail-label">Ministers</span>
                        <ul class="pd-minister-list">
                          ${people.map(p => `<li class="pd-minister-row">${avatarOf(p)}<span class="pd-hero-detail-value">${personText(p)}</span></li>`).join("")}
                        </ul>
                      </div>
                    </div>`
          : (people.length === 1 ? `
                    <div class="pd-hero-detail">
                      ${avatarOf(people[0])}
                      <div>
                        <span class="pd-hero-detail-label">Minister</span>
                        <div class="pd-hero-detail-value">${personText(people[0])}</div>
                      </div>
                    </div>` : "");
        const theme = getField(promise, PROMISE_FIELDS.theme);
        const promisedDate = formatDate(getField(promise, PROMISE_FIELDS.datePromised));
        const deadline = getField(promise, PROMISE_FIELDS.deadlinePromised);
        const dossierUrl = getField(promise, PROMISE_FIELDS.dossier);
        const sourceLabel = getField(promise, PROMISE_FIELDS.sourceLabel) || "Brontekst";
        const sourceTitle = getField(promise, PROMISE_FIELDS.sourceTitle) || getField(promise, PROMISE_FIELDS.shortDescription);
        const sourceDateRaw = getField(promise, PROMISE_FIELDS.sourceDate) || getField(promise, PROMISE_FIELDS.datePromised);
        const sourceDate = formatDate(sourceDateRaw) || sourceDateRaw;
        const sourceUrl = getField(promise, PROMISE_FIELDS.sourceUrl) || dossierUrl;
        const sourceName = [sourceTitle, sourceDate ? `(${sourceDate})` : ""].filter(Boolean).join(" ") || sourceUrl;
        const heroImageUrl = getImageField(promise, PROMISE_FIELDS.heroImage);
        const heroFocus = imageFocusPosition(getField(promise, PROMISE_FIELDS.heroImageFocus));
        const heroStyle = heroImageUrl
          ? `--pd-hero-image:url(&quot;${escapeCssUrl(heroImageUrl)}&quot;); --pd-image-focus:${escapeHtml(heroFocus)};`
          : `--pd-image-focus:center center;`;
        const verdictBody = getField(promise, PROMISE_FIELDS.verdict)
          || getField(latestUpdate || {}, ["Update tekst uitklap", "Context", "Detail text"])
          || getField(promise, PROMISE_FIELDS.shortDescription);
        const latestDate = getVerdictDate(promise, updates)
          || formatDate(getField(promise, PROMISE_FIELDS.lastUpdated))
          || (latestUpdate ? formatDate(latestUpdate["Update date"]) : "");
        const nextDate = formatMaybeDate(listValues(getColumn(promise, "volgendebeoordeling")).join(", ") || getField(promise, PROMISE_FIELDS.nextUpdate));
        const journalists = listValues(getColumn(promise, "journalist"));
        const assessmentText = (latestDate
          ? `De laatste beoordeling was op <strong>${escapeHtml(latestDate)}</strong>.`
          : "Er is nog geen beoordeling geweest.")
          + (nextDate ? ` De volgende staat gepland op <strong>${escapeHtml(nextDate)}</strong>.` : "");
        // The old compact status summary strip is intentionally not rendered anymore.
        // Status/date/control details now live inside the verdict card.

        $("pdBackLink").href = OVERVIEW_URL;

        host.innerHTML = `
          <section class="pd-hero" aria-labelledby="pd-title">
            <div class="pd-promise-panel" style="${heroStyle}">
              ${(!heroImageUrl && emoji) ? `<span class="pd-hero-emoji" aria-hidden="true">${escapeHtml(emoji)}</span>` : ""}
              <div class="pd-promise-content">
                <p class="pd-eyebrow">${renderIcon("flag")}<span>Belofte</span></p>
                <h1 class="${titleClass}" id="pd-title">${escapeHtml(plainTitle)}</h1>
                <div class="pd-hero-details">
                  ${ministerBlock}
                  ${(sourceName || sourceUrl) ? `
                    <div class="pd-hero-detail">
                      ${renderIcon("article")}
                      <div>
                        <span class="pd-hero-detail-label">${escapeHtml(sourceLabel)}</span>
                        <div class="pd-hero-detail-value">
                          ${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(sourceName || sourceUrl)}</a>` : escapeHtml(sourceName)}
                        </div>
                      </div>
                    </div>
                  ` : ""}
                </div>
              </div>
            </div>

            <aside class="pd-verdict-card" aria-labelledby="pd-verdict-title">
              <div class="pd-verdict-head">
                <h2 class="pd-verdict-title" id="pd-verdict-title">Vooruitgang</h2>
                <span class="pd-status-pill">${renderSym(conf)}${escapeHtml(statusLabel(status))}</span>
              </div>
              <div class="pd-verdict-body">
                ${verdictBody ? `<div class="pd-verdict-lead">${renderRichText(verdictBody)}</div>` : ""}
                ${renderVerdictEvidence(promise)}
                <div class="pd-verdict-meta">
                  <span class="pd-verdict-meta-row">${renderIcon("calendar_month")}<span>${assessmentText}</span></span>
                  ${journalists.length ? `<span class="pd-verdict-meta-row">${renderIcon("article")}<span>Deze belofte wordt opgevolgd door ${journalists.length > 1 ? "journalisten" : "journalist"} <strong>${escapeHtml(joinNames(journalists))}</strong></span></span>` : ""}
                </div>
              </div>
            </aside>
          </section>

          <section class="pd-section" id="belofte">
            <div class="pd-section-head">
              <h2 class="pd-section-title">Wat houdt de belofte in?</h2>
            </div>
            ${renderPromiseFacts(promise)}
            ${renderTerms(promise)}
          </section>

          <div id="pdTimelineMount" class="pd-section"></div>
          <div id="pdQuotesMount"></div>
        `;
      }

      /* ===================================================================
         WOORDENBOEK
         Words from the "Woordenboek" table are found in the text of the page (which itself comes from the
         Promises table) and become clickable: point at a word, or tap it, to see its meaning in a small card.
         In the table, the "Woord" cell can hold several forms of the same word, separated by a comma:
         "LEZ, lage-emissiezone". Matching ignores capitals; a hyphen and a space count as the same; a plural
         ending (-s, 's, -en) is allowed.
         =================================================================== */
      const GLOSSARY_FIELDS = { word: ["Woord", "Word"], meaning: ["Betekenis", "Meaning"] };

      // example words, only used while GLOSSARY_TABLE_ID is empty
      const DEMO_GLOSSARY = [
        { word: "LEZ", forms: ["LEZ", "lage-emissiezone"], meaning: "Een gebied waar de meest vervuilende voertuigen niet meer mogen rijden. In Brussel geldt de lage-emissiezone voor het hele gewest." },
        { word: "NOx", forms: ["NOx", "stikstofoxiden", "stikstofdioxide"], meaning: "Gassen die vooral vrijkomen bij verbranding in motoren, zoals stikstofdioxide (NO₂). Ze zijn schadelijk voor de luchtwegen." },
        { word: "Euronorm", forms: ["Euronorm"], meaning: "De Europese norm die bepaalt hoeveel schadelijke stoffen een voertuig maximaal mag uitstoten. Hoe hoger het cijfer (Euro 5, Euro 6), hoe strenger de norm." },
        { word: "Regeerakkoord", forms: ["regeerakkoord"], meaning: "De afspraken die de regeringspartijen samen maken aan het begin van de legislatuur. Daarin staan de beloftes die BRUZZ opvolgt." },
        { word: "Wagenpark", forms: ["wagenpark"], meaning: "Alle voertuigen die in een bepaald gebied rondrijden of ingeschreven zijn." }
      ];

      async function loadGlossary() {
        // with a proxy the table number lives in the proxy, so it is not needed here
        if (!GLOSSARY_TABLE_ID && !API_BASE_URL) return GLOSSARY_DEMO ? DEMO_GLOSSARY : [];
        try {
          const rows = await fetchTable(GLOSSARY_API, "Woordenboek", "glossary");
          return rows.map(row => {
            const forms = getField(row, GLOSSARY_FIELDS.word).split(/\s*[;|,\n]\s*/).map(f => f.trim()).filter(Boolean);
            const meaning = getField(row, GLOSSARY_FIELDS.meaning);
            return forms.length && meaning ? { word: forms[0], forms, meaning } : null;
          }).filter(Boolean);
        } catch (err) {
          console.warn("Woordenboek kon niet geladen worden:", err.message);
          return [];
        }
      }

      let glossaryEntries = [];

      function escapeRegex(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      function buildGlossaryMatcher(entries) {
        const lookup = new Map();
        const forms = [];
        entries.forEach((entry, index) => entry.forms.forEach(form => {
          const key = fold(form).replace(/[\s-]+/g, " ");
          if (!key || lookup.has(key)) return;
          lookup.set(key, index);
          forms.push(form.trim());
        }));
        if (!forms.length) return null;
        forms.sort((a, b) => b.length - a.length);   // the longest form wins
        const source = forms.map(f => escapeRegex(f).replace(/[\s-]+/g, "[\\s-]+")).join("|");
        return {
          lookup,
          regex: new RegExp("(^|[^\\p{L}\\p{N}_])(" + source + ")(['’]s|s|en)?(?![\\p{L}\\p{N}_])", "giu")
        };
      }

      function markTextNode(node, matcher, seen) {
        const text = node.nodeValue;
        const { regex, lookup } = matcher;
        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let last = 0;
        let count = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          const index = lookup.get(fold(match[2]).replace(/[\s-]+/g, " "));
          if (index === undefined) continue;
          if (GLOSSARY_FIRST_ONLY && seen.has(index)) continue;
          seen.add(index);

          const start = match.index + match[1].length;
          const shown = match[2] + (match[3] || "");
          const term = document.createElement("span");
          term.className = "pd-gloss";
          term.tabIndex = 0;
          term.setAttribute("role", "button");
          term.setAttribute("aria-expanded", "false");
          term.dataset.gloss = String(index);
          term.textContent = shown;

          fragment.append(text.slice(last, start), term);
          last = start + shown.length;
          count++;
        }

        if (!count) return 0;
        fragment.append(text.slice(last));
        node.parentNode.replaceChild(fragment, node);
        return count;
      }

      function applyGlossary(entries) {
        glossaryEntries = entries || [];
        const matcher = buildGlossaryMatcher(glossaryEntries);
        if (!matcher) return 0;

        let marked = 0;
        GLOSSARY_SCOPES.forEach(selector => {
          root.querySelectorAll(selector).forEach(scope => {
            const seen = new Set();   // "first time in this section" is counted per section
            const nodes = [];
            const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
              acceptNode: node => (node.nodeValue.trim() && !node.parentElement.closest("a, button, script, style, h1, h2, h3, .pd-gloss, .pd-terms"))
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT
            });
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach(node => { marked += markTextNode(node, matcher, seen); });
          });
        });
        return marked;
      }

      /* ---- the card with the meaning ---- */
      let glossPop = null;
      let glossTimer = null;
      let glossTerm = null;
      let glossPinned = false;

      function glossPopover() {
        if (glossPop) return glossPop;
        glossPop = document.createElement("div");
        glossPop.className = "pd-gloss-pop";
        glossPop.id = "pdGlossPop";
        glossPop.setAttribute("role", "tooltip");
        glossPop.hidden = true;
        root.appendChild(glossPop);
        glossPop.addEventListener("mouseenter", () => clearTimeout(glossTimer));
        glossPop.addEventListener("mouseleave", () => scheduleHideGloss());
        return glossPop;
      }

      function positionGloss(term, pop) {
        const rootRect = root.getBoundingClientRect();
        const t = term.getClientRects()[0] || term.getBoundingClientRect();
        const w = pop.offsetWidth;
        const h = pop.offsetHeight;
        const centre = t.left - rootRect.left + t.width / 2;
        const left = Math.min(Math.max(8, centre - w / 2), Math.max(8, rootRect.width - w - 8));
        const above = t.top - h - 12 >= 8;   // enough room above the word on screen?
        pop.style.left = left + "px";
        pop.style.top = (above ? t.top - rootRect.top - h - 12 : t.bottom - rootRect.top + 12) + "px";
        pop.dataset.side = above ? "above" : "below";
        pop.style.setProperty("--pd-arrow-x", Math.min(Math.max(18, centre - left), Math.max(18, w - 18)) + "px");
      }

      function showGloss(term, pinned) {
        const entry = glossaryEntries[Number(term.dataset.gloss)];
        if (!entry) return;
        clearTimeout(glossTimer);
        if (glossTerm && glossTerm !== term) {
          glossTerm.setAttribute("aria-expanded", "false");
          glossTerm.removeAttribute("aria-describedby");
        }
        glossTerm = term;
        glossPinned = Boolean(pinned);

        const pop = glossPopover();
        pop.innerHTML = `
          <div class="pd-gloss-pop-word">${escapeHtml(entry.word)}</div>
          <div class="pd-gloss-pop-text">${renderRichText(entry.meaning)}</div>
        `;
        pop.style.left = "0px";
        pop.style.top = "0px";
        pop.hidden = false;
        term.setAttribute("aria-expanded", "true");
        term.setAttribute("aria-describedby", "pdGlossPop");
        positionGloss(term, pop);
      }

      function hideGloss() {
        clearTimeout(glossTimer);
        if (glossPop) glossPop.hidden = true;
        if (glossTerm) {
          glossTerm.setAttribute("aria-expanded", "false");
          glossTerm.removeAttribute("aria-describedby");
        }
        glossTerm = null;
        glossPinned = false;
      }

      function scheduleHideGloss() {
        clearTimeout(glossTimer);
        if (glossPinned) return;
        glossTimer = setTimeout(hideGloss, 160);
      }

      root.addEventListener("mouseover", event => {
        const term = event.target.closest(".pd-gloss");
        if (term && !glossPinned) showGloss(term, false);
        if (event.target.closest(".pd-gloss-pop")) clearTimeout(glossTimer);
      });

      root.addEventListener("mouseout", event => {
        if (!event.target.closest(".pd-gloss, .pd-gloss-pop")) return;
        const next = event.relatedTarget && event.relatedTarget.closest ? event.relatedTarget.closest(".pd-gloss, .pd-gloss-pop") : null;
        if (!next) scheduleHideGloss();
      });

      root.addEventListener("focusin", event => {
        const term = event.target.closest(".pd-gloss");
        if (term && !glossPinned) showGloss(term, false);
      });

      root.addEventListener("focusout", event => {
        if (event.target.closest(".pd-gloss")) scheduleHideGloss();
      });

      root.addEventListener("click", event => {
        const term = event.target.closest(".pd-gloss");
        if (!term) return;
        event.preventDefault();
        if (glossTerm === term && glossPinned) hideGloss();
        else showGloss(term, true);
      });

      root.addEventListener("keydown", event => {
        const term = event.target.closest(".pd-gloss");
        if (event.key === "Escape") {
          const was = glossTerm;
          hideGloss();
          if (was) was.focus();
          return;
        }
        if (term && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          if (glossTerm === term && glossPinned) hideGloss();
          else showGloss(term, true);
        }
      });

      document.addEventListener("click", event => {
        if (!event.target.closest(".pd-gloss, .pd-gloss-pop")) hideGloss();
      });

      window.addEventListener("resize", hideGloss);

      /* ===================================================================
         PAGE HEADER (see COVER_PAGE_HEADER)
         =================================================================== */
      let pageHeaderLogged = false;
      function noteAboutPageHeader(message) {
        if (!pageHeaderLogged) console.info("BRUZZ Check: " + message);
        pageHeaderLogged = true;
      }

      function hidePageHeader() {
        if (!COVER_PAGE_HEADER) return;
        const hide = el => {
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-pd-hidden", "");
        };
        const isAboveEmbed = el => el !== root && !root.contains(el) && !el.contains(root)
          && Boolean(root.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);

        // step 1: the blocks you named, when they sit above the embed
        let count = 0;
        PAGE_HEADER_SELECTORS.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            if (!isAboveEmbed(el)) return;
            hide(el);
            count++;
          });
        });
        if (count) {
          noteAboutPageHeader(`${count} blok(ken) van de paginakop verborgen`);
          return;
        }

        // step 2: look for the title block ourselves
        const main = root.closest("main");
        const title = [...document.querySelectorAll("h1")].find(h =>
          isAboveEmbed(h) && (!main || main.contains(h)));
        if (!title) return;

        let start = title;
        while (start.parentElement && !start.parentElement.contains(root)) start = start.parentElement;
        const shared = start.parentElement;
        if (!shared) return;
        let end = root;
        while (end.parentElement && end.parentElement !== shared) end = end.parentElement;
        if (end.parentElement !== shared || end === start) return;
        if (!(start.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)) return;

        const blocks = [];
        for (let el = start; el && el !== end; el = el.nextElementSibling) blocks.push(el);

        // Inside <main> a menu is most likely a breadcrumb or the share buttons, so that is allowed there.
        // Outside <main> a menu is probably the site navigation, so the page is left alone.
        const textLength = blocks.reduce((sum, el) => sum + el.textContent.trim().length, 0);
        const hasForm = blocks.some(el => el.matches("form, main, article") || el.querySelector("form, main, article, input, select"));
        const hasSiteMenu = !main && blocks.some(el => el.matches("nav") || el.querySelector("nav"));
        if (hasForm || hasSiteMenu || textLength > (main ? 600 : 400)) {
          noteAboutPageHeader("de paginakop is niet verborgen omdat die er niet uitziet als alleen titel, datum en deelknoppen. Voeg de klasse van het blok toe aan PAGE_HEADER_SELECTORS.");
          return;
        }
        blocks.forEach(hide);
        noteAboutPageHeader(`${blocks.length} blok(ken) van de paginakop automatisch verborgen`);
      }

      function pullEmbedUp() {
        if (!COVER_PAGE_HEADER || !REMOVE_SPACE_ABOVE_EMBED) return;
        root.style.marginTop = "";                      // measure from the natural position
        const content = root.closest("main");
        if (!content) return;

        const scrollY = window.pageYOffset || 0;
        let anchor = content.getBoundingClientRect().top + scrollY;
        document.querySelectorAll("header, nav, [data-header]").forEach(el => {
          if (el.contains(root)) return;
          const box = el.getBoundingClientRect();
          if (getComputedStyle(el).position === "fixed" && box.height > 0 && box.top < 8) {
            anchor = Math.max(anchor, box.bottom);       // a fixed bar stays on screen: stop below it
          }
        });

        const gap = Math.round(root.getBoundingClientRect().top + scrollY - anchor);
        if (gap > 1) {
          root.style.marginTop = `-${gap}px`;
          noteAboutSpace(`${gap}px lege ruimte boven de embed weggehaald`);
        }
      }

      let spaceLogged = false;
      function noteAboutSpace(message) {
        if (!spaceLogged) console.info("BRUZZ Check: " + message);
        spaceLogged = true;
      }

      async function init() {
        hidePageHeader();
        pullEmbedUp();

        try {
          if (!API_BASE_URL && (!TOKEN || TOKEN === "PASTE_YOUR_READ_ONLY_BASEROW_TOKEN_HERE")) {
            throw new Error("Vul API_BASE_URL in voor de proxy, of vul tijdelijk TOKEN in met een read-only Baserow database token.");
          }

          const [promises, updates, glossary] = await Promise.all([
            fetchTable(PROMISES_API, "Promises table", "promises"),
            fetchTable(UPDATES_API, "Updates table", "updates").catch(() => []),
            loadGlossary()
          ]);

          const promise = findPromise(promises);

          if (!promise) {
            $("pdRoot").innerHTML = `
              <div class="pd-error">
                <strong>Geen belofte gevonden.</strong><br>
                Voeg <code>?promise_key=...</code> of <code>?id=...</code> toe aan de URL, of vul <code>DEFAULT_PROMISE_KEY</code> in de code in.
              </div>
            `;
            return;
          }

          renderPage(promise, getPromiseUpdates(promise, updates));
          syncBodyTypography();
          startCmsQuoteSync();

          const marked = applyGlossary(glossary);
          if (glossary.length) console.info(`Woordenboek: ${glossary.length} woorden geladen, ${marked} gemarkeerd${(GLOSSARY_TABLE_ID || API_BASE_URL) ? "" : " (voorbeeldwoorden)"}`);
        } catch (err) {
          $("pdRoot").innerHTML = `<div class="pd-error"><strong>Could not load data:</strong><br>${escapeHtml(err.message)}</div>`;
        }
      }

      root.addEventListener("click", (event) => {
        const dot = event.target.closest(".pd-event-dot");
        if (dot) {
          const targetId = dot.dataset.updateTarget;
          const target = targetId ? root.querySelector(`#${CSS.escape(targetId)}`) : null;
          if (target) {
            if (target.hidden) {
              root.querySelectorAll("[data-extra-update]").forEach(item => item.hidden = false);
              const btn = root.querySelector('[data-show-target="updates"]');
              if (btn) {
                btn.setAttribute("aria-expanded", "true");
                btn.textContent = "Toon minder updates";
              }
            }
            target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            target.classList.add("pd-update-highlight");
            setTimeout(() => target.classList.remove("pd-update-highlight"), 1200);
          }
          return;
        }

        const showMore = event.target.closest(".pd-show-more-button");
        if (showMore) {
          const target = showMore.dataset.showTarget;
          const isExpanded = showMore.getAttribute("aria-expanded") === "true";
          if (target !== "updates") return;

          root.querySelectorAll("[data-extra-update]").forEach(item => item.hidden = isExpanded);
          showMore.setAttribute("aria-expanded", String(!isExpanded));

          const total = showMore.dataset.total || root.querySelectorAll(".pd-update-card").length;
          showMore.textContent = isExpanded ? `Toon alle updates (${total})` : "Toon minder updates";
          return;
        }

        const updateCard = event.target.closest(".pd-update-card[data-has-body='true']");
        if (updateCard) {
          if (event.target.closest("a, button")) return;
          toggleUpdateCard(updateCard);
        }
      });

      root.addEventListener("keydown", (event) => {
        const updateCard = event.target.closest(".pd-update-card[data-has-body='true']");
        if (!updateCard) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleUpdateCard(updateCard);
      });

      function toggleUpdateCard(card) {
        const body = card?.querySelector(".pd-update-body");
        if (!body) return;
        const willOpen = body.hidden;
        body.hidden = !willOpen;
        card.classList.toggle("pd-update-expanded", willOpen);
        card.setAttribute("aria-expanded", String(willOpen));
      }

      init();
      window.addEventListener("load", () => { hidePageHeader(); pullEmbedUp(); });
      let pullTimer = null;
      window.addEventListener("resize", () => {
        clearTimeout(pullTimer);
        pullTimer = setTimeout(pullEmbedUp, 150);       // the theme's spacing can change with the window width
      });
    })();

  })();

  /* ---- CMS article timeline ---- */
  (function () {
  (function () {
    const config = {
      mainSectionSelector: CONFIG.timeline,
      sourceSectionSelectors: [CONFIG.timeline],

      waitForConfiguredSources: false,
      maxWaitForSourcesMs: 1500,
      initializationDelayMs: 100,

      dedupeByHref: true,
      hideMergedSourceSections: true,

      heading: "Wat is er ondertussen gebeurd?",
      visibleInitialCount: 5,

      defaultBadge: "BRUZZ",

      // Timeline is built only from CMS/feed articles; no manual additions.
      manualCards: []
    };

    const SWAP_ICON = '<svg class="bm-timeline-control-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 16V4M7 4 4 7M7 4l3 3M13 4v12M13 16l-3-3M13 16l3-3"/></svg>';

    const startedAt = Date.now();
    let initialized = false;
    let retryTimer = null;
    let initTimer = null;

    function clean(text) {
      return (text || "").replace(/\s+/g, " ").trim();
    }

    function slug(text) {
      return clean(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function unique(array) {
      return Array.from(new Set(array));
    }

    function getSourceSections() {
      return unique(
        config.sourceSectionSelectors
          .map(function (selector) {
            return document.querySelector(selector);
          })
          .filter(Boolean)
      );
    }

    function shouldWaitForMoreSources(sourceSections) {
      if (!config.waitForConfiguredSources) return false;
      if (config.sourceSectionSelectors.length <= 1) return false;
      if (sourceSections.length >= config.sourceSectionSelectors.length) return false;

      return Date.now() - startedAt < config.maxWaitForSourcesMs;
    }

    function parseLocalDate(value) {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (typeof value !== "string") {
        return NaN;
      }

      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

      if (!match) {
        return NaN;
      }

      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        12,
        0
      ).getTime();
    }

    function pad(number) {
      return String(number).padStart(2, "0");
    }

    function formatDate(ms) {
      if (!Number.isFinite(ms)) return "";

      return new Intl.DateTimeFormat("nl-BE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
        .format(new Date(ms))
        .replace(/\./g, "");
    }

    function formatDateTime(ms) {
      if (!Number.isFinite(ms)) return "";

      const date = new Date(ms);

      return (
        pad(date.getDate()) + "/" +
        pad(date.getMonth() + 1) + "/" +
        date.getFullYear() + " " +
        pad(date.getHours()) + "." +
        pad(date.getMinutes()) + "u"
      );
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function sameText(a, b) {
      return clean(a).toLocaleLowerCase("nl-BE") === clean(b).toLocaleLowerCase("nl-BE");
    }

    function getDateInfo(meta) {
      const node =
        (meta && meta.querySelector("[data-dynamic-date]")) ||
        (meta && meta.querySelector(".meta__item:nth-child(2) div"));

      const seconds = Number(node && node.getAttribute("data-dynamic-date"));

      if (Number.isFinite(seconds) && seconds > 0) {
        const ms = seconds * 1000;

        return {
          dateLabel: formatDate(ms),
          dateTimeLabel: formatDateTime(ms),
          ms: ms
        };
      }

      return {
        dateLabel: clean(node && node.textContent),
        dateTimeLabel: clean(node && node.textContent),
        ms: NaN
      };
    }

    function getCategory(meta) {
      const items = meta ? Array.from(meta.querySelectorAll(".meta__item")) : [];

      const categoryItem = items.find(function (item) {
        return !item.classList.contains("is-update") &&
          !item.querySelector("[data-dynamic-date]");
      });

      return clean(categoryItem && categoryItem.textContent);
    }

    function getBadge() {
      // Article colour/type is no longer inferred from words in the title.
      return config.defaultBadge;
    }

    function getFeedHref(item) {
      const link = item.querySelector("a.teaser[href]");
      return link ? link.getAttribute("href") : "";
    }

    function getMetaLine(meta, dateInfo) {
      const category = getCategory(meta);
      const dateTime = dateInfo.dateTimeLabel;

      return [category, dateTime].filter(Boolean).join(" ");
    }

    function normalizeManualCard(card, index) {
      const dateMs = Number.isFinite(card.dateMs)
        ? card.dateMs
        : parseLocalDate(card.date);

      return {
        id: "bm-timeline-manual-" + index,
        isManual: true,
        title: clean(card.title),
        badge: clean(card.badge) || config.defaultBadge,
        status: clean(card.status),
        dateLabel: clean(card.dateLabel) || formatDate(dateMs),
        dateTimeLabel: clean(card.dateTimeLabel) || formatDateTime(dateMs),
        metaLine: clean(card.metaLine) || formatDateTime(dateMs),
        dateMs: dateMs,
        href: card.href || null,
        image: card.image || null,
        imageAlt: card.imageAlt || "",
        realized: Boolean(card.realized)
      };
    }

    function createManualItem(card) {
      const li = document.createElement("li");
      li.className = "bm-timeline-manual-source";

      const wrapper = document.createElement("div");
      wrapper.className = "teaser-wrapper";

      const shell = document.createElement(card.href ? "a" : "div");
      shell.className = "teaser teaser--variant-horizontal teaser--manual";

      if (card.href) {
        shell.href = card.href;
        shell.setAttribute("role", "link");
        shell.setAttribute("tabindex", "0");
        shell.setAttribute("aria-label", card.title);
      } else {
        shell.setAttribute("role", "article");
      }

      if (card.image) {
        const media = document.createElement("div");
        media.className = "teaser__media";

        const img = document.createElement("img");
        img.src = card.image;
        img.alt = card.imageAlt || "";
        img.loading = "lazy";

        media.appendChild(img);
        shell.appendChild(media);
      }

      const content = document.createElement("div");
      content.className = "teaser__content";

      shell.appendChild(content);
      wrapper.appendChild(shell);
      li.appendChild(wrapper);

      return li;
    }

    function readFeedCard(item, index) {
      const titleEl = item.querySelector(".teaser__title");
      const meta = item.querySelector(".meta");
      const title = clean(titleEl ? titleEl.textContent : "");
      const dateInfo = getDateInfo(meta);

      return {
        id: "bm-timeline-feed-" + index,
        isManual: false,
        title: title,
        badge: getBadge(title),
        status: "",
        dateLabel: dateInfo.dateLabel,
        dateTimeLabel: dateInfo.dateTimeLabel,
        metaLine: getMetaLine(meta, dateInfo),
        dateMs: dateInfo.ms,
        href: getFeedHref(item),
        image: null,
        imageAlt: "",
        realized: false
      };
    }

    function collectFeedPairs(sourceSections) {
      const seenHrefs = new Set();
      const pairs = [];
      let feedIndex = 0;

      sourceSections.forEach(function (section) {
        const list = section.querySelector(".teaser-section__items");
        if (!list) return;

        Array.from(list.children)
          .filter(function (child) {
            return child.matches("li");
          })
          .forEach(function (item) {
            const href = getFeedHref(item);

            if (config.dedupeByHref && href) {
              if (seenHrefs.has(href)) return;
              seenHrefs.add(href);
            }

            pairs.push({
              item: item,
              card: readFeedCard(item, feedIndex)
            });

            feedIndex++;
          });
      });

      return pairs;
    }

    function getTimelineRange(cards) {
      const dates = cards
        .map(function (card) { return card.dateMs; })
        .filter(function (ms) { return Number.isFinite(ms); });

      if (!dates.length) {
        const now = Date.now();

        return {
          startDate: now,
          endDate: now
        };
      }

      return {
        startDate: Math.min.apply(null, dates),
        endDate: Math.max.apply(null, dates)
      };
    }

    function getDotPositions(cards, startDate, endDate) {
      const totalRange = Math.max(1, endDate - startDate);

      const positions = cards.map(function (card, index) {
        let pos = 0;

        if (Number.isFinite(card.dateMs)) {
          pos = ((card.dateMs - startDate) / totalRange) * 100;
          pos = clamp(pos, 0, 100);
        }

        return {
          index: index,
          pos: pos
        };
      });

      const sorted = positions.slice().sort(function (a, b) {
        return a.pos - b.pos;
      });

      const minGap = 1.15;

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].pos - sorted[i - 1].pos < minGap) {
          sorted[i].pos = sorted[i - 1].pos + minGap;
        }
      }

      const overflow = sorted.length ? sorted[sorted.length - 1].pos - 100 : 0;

      if (overflow > 0) {
        sorted.forEach(function (item) {
          item.pos -= overflow;
        });
      }

      sorted.forEach(function (item) {
        item.pos = clamp(item.pos, 0, 100);
      });

      const result = [];

      sorted.forEach(function (item) {
        result[item.index] = item.pos;
      });

      return result;
    }

    function buildTimelineNav(section, cards) {
      const oldNav = section.querySelector(".bm-timeline-nav");
      if (oldNav) oldNav.remove();

      const range = getTimelineRange(cards);
      const startDate = range.startDate;
      const endDate = range.endDate;
      const dotPositions = getDotPositions(cards, startDate, endDate);

      const nav = document.createElement("div");
      nav.className = "bm-timeline-nav";

      const track = document.createElement("div");
      track.className = "bm-timeline-nav__track";

      cards.forEach(function (card, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "bm-timeline-nav__dot";

        if (card.badge === "MILESTONE") {
          dot.classList.add("bm-timeline-nav__dot--milestone");
        }

        if (card.badge === "VONNIS") {
          dot.classList.add("bm-timeline-nav__dot--vonnis");
        }

        if (card.realized) {
          dot.classList.add("bm-timeline-nav__dot--realized");
        }

        dot.style.left = dotPositions[index] + "%";
        dot.title = clean(card.dateLabel + " — " + card.title);
        dot.setAttribute("aria-label", dot.title);

        dot.addEventListener("click", function () {
          const target = document.getElementById(card.id);
          if (!target) return;

          section.querySelectorAll(".bm-timeline-nav__dot--active").forEach(function (item) {
            item.classList.remove("bm-timeline-nav__dot--active");
          });
          dot.classList.add("bm-timeline-nav__dot--active");

          section.querySelectorAll(".bm-timeline-active").forEach(function (item) {
            item.classList.remove("bm-timeline-active");
          });
          target.classList.add("bm-timeline-active");

          target.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        });

        track.appendChild(dot);
      });

      const row = document.createElement("div");
      row.className = "bm-timeline-nav__row";

      const leftLabel = document.createElement("span");
      leftLabel.className = "bm-timeline-nav__edge-label";

      const rightLabel = document.createElement("span");
      rightLabel.className = "bm-timeline-nav__edge-label";

      leftLabel.textContent = formatDate(startDate);
      rightLabel.textContent = formatDate(endDate);

      row.append(leftLabel, track, rightLabel);
      nav.appendChild(row);

      const sectionTitle = section.querySelector(".section-title");
      if (sectionTitle) {
        sectionTitle.after(nav);
      }
    }

    function transformItem(item, card) {
      const shell = item.querySelector(".teaser");
      const content = item.querySelector(".teaser__content");
      const originalMedia = item.querySelector(".teaser__media");

      if (!shell || !content) return;

      item.id = card.id;

      const isLinked =
        shell.tagName.toLowerCase() === "a" &&
        Boolean(shell.getAttribute("href"));

      if (isLinked) {
        shell.setAttribute("target", "_blank");
        shell.setAttribute("rel", "noopener noreferrer");
      }

      const titleEl =
        content.querySelector(".teaser__title") ||
        document.createElement("h3");

      titleEl.classList.add("teaser__title");
      titleEl.textContent = card.title;

      const shouldHideTitle =
        Boolean(card.status) && sameText(card.title, card.status);

      titleEl.classList.toggle("bm-timeline-title-hidden", shouldHideTitle);

      const media = document.createElement("div");
      media.className = "bm-timeline-media";

      const img = originalMedia ? originalMedia.querySelector("img") : null;

      if (img) {
        media.appendChild(img);
        originalMedia.remove();
        item.classList.remove("bm-timeline-no-image");
      } else {
        item.classList.add("bm-timeline-no-image");
      }

      const main = document.createElement("div");
      main.className = "bm-timeline-main";

      if (card.status) {
        const status = document.createElement("span");
        status.className = "bm-timeline-status";
        status.textContent = card.status;
        main.appendChild(status);
      }

      main.appendChild(titleEl);

      if (card.metaLine) {
        const metaLine = document.createElement("div");
        metaLine.className = "bm-timeline-meta-line";
        metaLine.textContent = card.metaLine;
        main.appendChild(metaLine);
      }

      const children = [];

      if (img) {
        children.push(media);
      }

      children.push(main);

      content.replaceChildren.apply(content, children);

      item.classList.toggle("bm-timeline-realized", Boolean(card.realized));
      item.classList.toggle("bm-timeline-no-link", !isLinked);

      const typeClass = "bm-timeline-type-" + slug(card.badge);
      if (typeClass !== "bm-timeline-type-") {
        item.classList.add(typeClass);
      }

      if (!card.isManual) {
        item.classList.add("bm-timeline-type-bruzz");
      }
    }

    function setupOrderToggle(section) {
      const top = section.querySelector(".section-title__top");
      const list = section.querySelector(".teaser-section__items");
      if (!top || !list) return;

      let tools = top.querySelector(".bm-timeline-heading-tools");
      if (!tools) {
        tools = document.createElement("div");
        tools.className = "bm-timeline-heading-tools";
        top.appendChild(tools);
      }

      const oldButton = tools.querySelector(".bm-timeline-order-toggle");
      if (oldButton) oldButton.remove();

      const button = document.createElement("button");
      button.type = "button";
      button.className = "bm-timeline-order-toggle";
      button.innerHTML = SWAP_ICON + '<span>Toon oudste eerst</span>';
      button.setAttribute("aria-label", "Sorteer updates van oud naar nieuw");
      button.dataset.order = "newest";

      button.addEventListener("click", function () {
        const currentItems = Array.from(list.children).filter(function (item) {
          return item.matches("li");
        });

        currentItems.reverse().forEach(function (item) {
          list.appendChild(item);
        });

        const nowOldestFirst = button.dataset.order === "newest";
        button.dataset.order = nowOldestFirst ? "oldest" : "newest";
        button.innerHTML = SWAP_ICON + `<span>${nowOldestFirst ? "Toon nieuwste eerst" : "Toon oudste eerst"}</span>`;
        button.setAttribute(
          "aria-label",
          nowOldestFirst ? "Sorteer updates van nieuw naar oud" : "Sorteer updates van oud naar nieuw"
        );

      });

      tools.appendChild(button);
    }


    function hideSecondarySections(sourceSections, mainSection) {
      if (!config.hideMergedSourceSections) return;

      sourceSections.forEach(function (section) {
        if (section !== mainSection) {
          section.classList.add("bm-timeline-source-hidden");
        }
      });
    }

    function placeTimelineInPromiseDetail(section) {
      const mount = document.querySelector("#promise-detail-embed #pdTimelineMount");
      if (!mount || !section) return false;

      if (section.parentNode !== mount) {
        mount.appendChild(section);
      }

      return true;
    }

    function ensureTimelinePlacement(section) {
      if (placeTimelineInPromiseDetail(section)) return;

      const placementObserver = new MutationObserver(function () {
        if (placeTimelineInPromiseDetail(section)) {
          placementObserver.disconnect();
        }
      });

      placementObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      setTimeout(function () {
        placementObserver.disconnect();
      }, 10000);
    }

    function initTimeline() {
      if (initialized) return true;

      const mainSection = document.querySelector(config.mainSectionSelector);
      if (!mainSection) return false;

      if (mainSection.classList.contains("bm-timeline-ready")) {
        ensureTimelinePlacement(mainSection);
        initialized = true;
        return true;
      }

      const sourceSections = getSourceSections();

      if (!sourceSections.length) return false;

      if (shouldWaitForMoreSources(sourceSections)) {
        return false;
      }

      const masterList = mainSection.querySelector(".teaser-section__items");
      if (!masterList) return false;

      const feedPairs = collectFeedPairs(sourceSections);

      if (!feedPairs.length && !config.manualCards.length) return false;

      const manualPairs = config.manualCards.map(function (manualCard, index) {
        const card = normalizeManualCard(manualCard, index);

        return {
          item: createManualItem(card),
          card: card
        };
      });

      const allPairs = feedPairs.concat(manualPairs);

      allPairs.sort(function (a, b) {
        return (b.card.dateMs || 0) - (a.card.dateMs || 0);
      });

      allPairs.forEach(function (pair) {
        masterList.appendChild(pair.item);
      });

      const sortedItems = allPairs.map(function (pair) {
        return pair.item;
      });

      const sortedCards = allPairs.map(function (pair) {
        return pair.card;
      });

      const heading = mainSection.querySelector(".section-title__title");
      if (heading) {
        heading.textContent = config.heading;
      }

      const top = mainSection.querySelector(".section-title__top");
      if (top) {
        let tools = top.querySelector(".bm-timeline-heading-tools");
        if (!tools) {
          tools = document.createElement("div");
          tools.className = "bm-timeline-heading-tools";
          top.appendChild(tools);
        }

        let count = tools.querySelector(".bm-timeline-count");
        if (!count) {
          count = document.createElement("div");
          count.className = "bm-timeline-count";
          tools.appendChild(count);
        }

        count.textContent = sortedItems.length + " updates";
      }

      buildTimelineNav(mainSection, sortedCards);

      sortedItems.forEach(function (item, index) {
        item.classList.remove("bm-timeline-hidden-after-limit");
        transformItem(item, sortedCards[index], index);
      });

      setupOrderToggle(mainSection);
      hideSecondarySections(sourceSections, mainSection);

      mainSection.classList.add("bm-master-timeline");
      mainSection.classList.add("bm-timeline-ready");

      ensureTimelinePlacement(mainSection);

      initialized = true;
      return true;
    }

    function attemptInit() {
      clearTimeout(retryTimer);

      if (initTimeline()) {
        observer.disconnect();
        return;
      }

      if (Date.now() - startedAt < config.maxWaitForSourcesMs + 2000) {
        retryTimer = setTimeout(attemptInit, 500);
      }
    }

    function scheduleInit() {
      clearTimeout(initTimer);
      initTimer = setTimeout(attemptInit, config.initializationDelayMs);
    }

    const observer = new MutationObserver(scheduleInit);

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleInit);
    } else {
      scheduleInit();
    }
  })();

  })();
})();
