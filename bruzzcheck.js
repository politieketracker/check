/*
  BRUZZ Check - overview page (one shared file)
  On the page you only need this:
    <div class="bruzz-promise-overview"></div>
    <script src="https://YOUR-ADDRESS/bruzzcheck.js"></script>
  data-api  (optional) address of the Cloudflare Worker, if different from the default below
*/
(function () {
  "use strict";
  var DEFAULT_API = "https://bruzzcheck-api.webmaster-dfe.workers.dev";

  var MOUNT = document.querySelector(".bruzz-promise-overview");
  if (!MOUNT || MOUNT.getAttribute("data-bc-ready")) return;
  MOUNT.setAttribute("data-bc-ready", "1");

  var CONFIG = { api: MOUNT.getAttribute("data-api") || DEFAULT_API };

  MOUNT.id = "promise-tracker-embed";
  var style = document.createElement("style");
  style.setAttribute("data-bruzzcheck-overview", "");
  style.textContent = "    /* =====================================================================\n       BRUZZ Check - styles (Zacht)\n       ===================================================================== */\n\n    /* ---------- tokens + reset ---------- */\n    #promise-tracker-embed {\n      --pt-red: #ff0033;\n      --pt-pink: #FA79D7;\n      --pt-ink: #17171c;\n      --pt-muted: #6b6b75;\n      --pt-bg: #fff9fb;\n      --pt-field: #FFF2F5;\n      --pt-tint: #FFE9EE;\n      --pt-line: #FFE0E6;\n      --pt-radius: 22px;\n      --pt-shadow: 0 1px 2px rgba(60, 10, 25, .035), 0 14px 30px -24px rgba(255, 0, 51, .16);\n      --pt-ease: cubic-bezier(.2, .8, .2, 1);\n\n      position: relative;\n      width: 100%;\n      color: var(--pt-ink);\n      font: inherit;\n      line-height: 1.45;\n      -webkit-text-size-adjust: 100%;\n    }\n\n    #promise-tracker-embed *,\n    #promise-tracker-embed *::before,\n    #promise-tracker-embed *::after { box-sizing: border-box; }\n\n    #promise-tracker-embed [hidden] { display: none !important; }\n\n    #promise-tracker-embed h2,\n    #promise-tracker-embed h3,\n    #promise-tracker-embed p { margin: 0; }\n\n    #promise-tracker-embed a { color: inherit; text-decoration: none; }\n\n    #promise-tracker-embed button,\n    #promise-tracker-embed input,\n    #promise-tracker-embed select {\n      font: inherit;\n      color: inherit;\n      letter-spacing: inherit;\n    }\n\n    #promise-tracker-embed button {\n      appearance: none;\n      -webkit-appearance: none;\n      background: none;\n      border: 0;\n      padding: 0;\n      margin: 0;\n      cursor: pointer;\n      text-align: inherit;\n    }\n\n    #promise-tracker-embed button:focus-visible,\n    #promise-tracker-embed a:focus-visible,\n    #promise-tracker-embed select:focus-visible,\n    #promise-tracker-embed input:focus-visible {\n      outline: 3px solid var(--pt-red);\n      outline-offset: 3px;\n    }\n\n    /* dropdowns and search: focus shows as the red border only, never as a second outer ring */\n    #promise-tracker-embed .pt-select select:focus-visible,\n    #promise-tracker-embed .pt-search input:focus-visible {\n      outline: none;\n      border-color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-sr {\n      position: absolute !important;\n      width: 1px; height: 1px;\n      margin: -1px; padding: 0;\n      overflow: hidden;\n      clip: rect(0 0 0 0);\n      white-space: nowrap;\n      border: 0;\n    }\n\n    /* ---------- page + layout ---------- */\n    #promise-tracker-embed .pt-app {\n      width: 100%;\n      margin: 0;\n      /* the pink fills the whole embed; the content keeps a maximum width and stays centred */\n      /* --pt-top-space = extra pink above the title and ministers; change this number to taste */\n      --pt-top-space: 56px;\n      padding: var(--pt-top-space) max(clamp(20px, 4vw, 52px), calc((100% - 1146px) / 2)) 56px;\n      background: var(--pt-bg);\n    }\n\n    #promise-tracker-embed .pt-layout {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      grid-template-areas:\n        \"ministers panel\"\n        \"filters filters\"\n        \"results results\";\n      column-gap: clamp(32px, 5vw, 72px);\n      row-gap: 36px;\n    }\n\n    #promise-tracker-embed .pt-ministers { grid-area: ministers; align-self: center; }\n    #promise-tracker-embed .pt-panel {\n      grid-area: panel;\n      display: flex;\n      flex-direction: column;\n      gap: 26px;\n      align-self: center;\n    }\n    #promise-tracker-embed .pt-filters { grid-area: filters; }\n    #promise-tracker-embed .pt-results { grid-area: results; }\n\n    /* ---------- intro ---------- */\n    #promise-tracker-embed .pt-title {\n      font-size: clamp(38px, 4.6vw, 58px);\n      line-height: .96;\n      letter-spacing: -.035em;\n      font-weight: 900;\n      color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-subtitle {\n      margin-top: 8px;\n      font-size: clamp(18px, 2vw, 22px);\n      font-weight: 700;\n      color: var(--pt-pink);\n    }\n\n    #promise-tracker-embed .pt-lede {\n      margin-top: 18px;\n      max-width: 56ch;\n      font-size: 15.5px;\n      line-height: 1.5;\n    }\n\n    /* ---------- timeline ---------- */\n    #promise-tracker-embed .pt-timeline { position: relative; margin-top: 14px; }\n\n    #promise-tracker-embed .pt-tl-track {\n      position: relative;\n      height: 8px;\n      margin-top: 40px;\n      border-radius: 999px;\n      background: rgba(23, 23, 28, .09);\n    }\n\n    #promise-tracker-embed .pt-tl-fill {\n      position: absolute;\n      left: 0; top: 0; bottom: 0;\n      width: var(--pt-today-pos, 0%);\n      border-radius: 999px;\n      background: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-tl-mid {\n      position: absolute;\n      top: 50%;\n      left: var(--pt-mid-pos, 50%);\n      width: 2px;\n      height: 18px;\n      transform: translate(-50%, -50%);\n      border-radius: 2px;\n      background: rgba(23, 23, 28, .22);\n    }\n\n    #promise-tracker-embed .pt-tl-dot {\n      position: absolute;\n      top: 50%;\n      left: var(--pt-today-pos, 0%);\n      width: 12px; height: 12px;\n      transform: translate(-50%, -50%);\n      border-radius: 50%;\n      background: #fff;\n      box-shadow: 0 0 0 1px rgba(23, 23, 28, .06), 0 1px 3px rgba(23, 23, 28, .25);\n    }\n\n    #promise-tracker-embed .pt-tl-today {\n      position: absolute;\n      bottom: 15px;\n      left: clamp(26px, var(--pt-today-pos, 0%), calc(100% - 26px));\n      transform: translateX(-50%);\n      padding: 2px 8px;\n      border-radius: 999px;\n      background: var(--pt-red);\n      color: #fff;\n      font-size: 10.5px;\n      font-weight: 700;\n      line-height: 1.4;\n      white-space: nowrap;\n    }\n\n    #promise-tracker-embed .pt-tl-labels {\n      position: relative;\n      display: flex;\n      justify-content: space-between;\n      min-height: 18px;\n      margin-top: 14px;\n      font-size: 12.5px;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-tl-label-mid {\n      position: absolute;\n      left: var(--pt-mid-pos, 50%);\n      transform: translateX(-50%);\n      white-space: nowrap;\n    }\n\n    /* ---------- status overview ---------- */\n    #promise-tracker-embed .pt-status {\n      padding: 22px 24px 18px;\n      border-radius: var(--pt-radius);\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n    }\n\n    #promise-tracker-embed .pt-status-head {\n      display: flex;\n      align-items: baseline;\n      justify-content: space-between;\n      gap: 12px;\n    }\n\n    #promise-tracker-embed .pt-status-title {\n      font-size: 16px;\n      font-weight: 800;\n      line-height: 1.3;\n    }\n\n    #promise-tracker-embed .pt-assessment-date {\n      flex: none;\n      font-size: 12.5px;\n      color: var(--pt-muted);\n      text-align: right;\n      white-space: nowrap;\n    }\n\n    #promise-tracker-embed .pt-status-bars { display: flex; flex-direction: column; margin: 12px -10px 0; }\n\n    #promise-tracker-embed .pt-status-row {\n      --pt-status-color: var(--pt-red);\n      display: grid;\n      grid-template-columns: 24px 118px minmax(0, 1fr) 30px;\n      align-items: center;\n      gap: 12px;\n      width: 100%;\n      padding: 8px 10px;\n      border-radius: 14px;\n      font-size: 14.5px;\n      transition: opacity .2s var(--pt-ease), background-color .2s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-status-row:hover { background: var(--pt-field); }\n    #promise-tracker-embed .pt-status-row.pt-status-active { background: var(--pt-tint); }\n    #promise-tracker-embed .pt-status-bars.pt-has-active .pt-status-row:not(.pt-status-active) { opacity: .45; }\n\n    #promise-tracker-embed .pt-status-icon { --sym: 24px; display: grid; place-items: center; }\n    #promise-tracker-embed .pt-status-name { font-weight: 600; }\n    #promise-tracker-embed .pt-status-track { height: 10px; border-radius: 999px; background: var(--pt-tint); overflow: hidden; }\n    #promise-tracker-embed .pt-status-fill { display: block; height: 100%; width: var(--w, 0%); min-width: 6px; border-radius: 999px; background: var(--pt-status-color); }\n    #promise-tracker-embed .pt-status-count { text-align: right; font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; }\n    #promise-tracker-embed .pt-status-row[data-zero=\"true\"] .pt-status-count { color: #b2b2ba; font-weight: 600; }\n\n    /* ---------- update note ---------- */\n    #promise-tracker-embed .pt-meta {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      gap: 12px 24px;\n      padding: 0 4px;\n    }\n\n    #promise-tracker-embed .pt-meta-item {\n      margin: 0;\n      font-size: 11.5px;\n      line-height: 1.4;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-meta-item strong {\n      display: block;\n      margin-top: 2px;\n      font-size: 12.5px;\n      font-weight: 700;\n      color: var(--pt-ink);\n    }\n\n    #promise-tracker-embed .pt-meta-note { grid-column: 1 / -1; }\n\n    #promise-tracker-embed .pt-meta-link {\n      color: var(--pt-red);\n      font-weight: 700;\n      text-decoration: underline;\n      text-underline-offset: 3px;\n      white-space: nowrap;\n    }\n\n    /* ---------- status icon ---------- */\n    #promise-tracker-embed .pt-sym {\n      position: relative;\n      display: inline-block;\n      flex: none;\n      width: var(--sym, 20px);\n      height: var(--sym, 20px);\n    }\n\n    #promise-tracker-embed .pt-sym-fallback {\n      position: absolute;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      border-radius: 50%;\n      background: var(--pt-status-color, var(--pt-red));\n      color: #fff;\n      font-size: calc(var(--sym, 20px) * .56);\n      font-weight: 800;\n      line-height: 1;\n    }\n\n    #promise-tracker-embed .pt-sym-img {\n      position: absolute;\n      inset: 0;\n      width: 100%;\n      height: 100%;\n      object-fit: contain;\n      display: block;\n    }\n\n    /* ---------- ministers: orbit ---------- */\n    #promise-tracker-embed .pt-ministers-body.pt-orbit-mode {\n      position: relative;\n      width: 100%;\n      max-width: 620px;\n      margin: 0 auto;\n      aspect-ratio: 1 / 1;\n    }\n\n    #promise-tracker-embed .pt-orbit-center {\n      position: absolute;\n      left: 50%;\n      /* the circles sit 25px above the middle of their boxes, so the text is lifted by the same amount */\n      top: calc(50% - 25px);\n      width: min(40%, 250px);\n      transform: translate(-50%, -50%);\n      text-align: center;\n      z-index: 3;\n      pointer-events: none;\n    }\n\n    #promise-tracker-embed .pt-orbit-center.pt-home { top: calc(50% - 6px); }\n\n    #promise-tracker-embed .pt-orbit-center-title {\n      font-size: clamp(25px, 2.9vw, 36px);\n      line-height: 1;\n      font-weight: 900;\n      letter-spacing: -.03em;\n      white-space: pre-line;\n    }\n\n    #promise-tracker-embed .pt-orbit-center.pt-detail .pt-orbit-center-title {\n      font-size: clamp(20px, 2.1vw, 26px);\n      line-height: 1.04;\n      margin-bottom: 8px;\n    }\n\n    #promise-tracker-embed .pt-orbit-center-meta {\n      display: inline-flex;\n      flex-wrap: wrap;\n      justify-content: center;\n      gap: 2px 8px;\n      margin-bottom: 8px;\n      font-size: 13px;\n      font-weight: 700;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-orbit-center-party { color: var(--party-ink, var(--pt-red)); }\n\n    #promise-tracker-embed .pt-orbit-center-subtitle {\n      max-width: 92%;\n      margin: 0 auto;\n      font-size: 14px;\n      line-height: 1.3;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-orbit-item {\n      --x: 0px; --y: 0px; --size: 116px;\n      position: absolute;\n      left: 50%; top: 50%;\n      width: calc(var(--size) + 112px);\n      height: calc(var(--size) + 50px);\n      margin-left: calc((var(--size) + 112px) / -2);\n      margin-top: calc((var(--size) + 50px) / -2);\n      transform: translate(var(--x), var(--y)) scale(1);\n      transition: transform 420ms var(--pt-ease), opacity 250ms ease;\n      z-index: 2;\n    }\n\n    #promise-tracker-embed .pt-orbit-item button { display: block; width: 100%; text-align: center; }\n\n    #promise-tracker-embed .pt-orbit-circle {\n      display: block;\n      position: relative;\n      width: var(--size);\n      height: var(--size);\n      margin: 0 auto;\n      border-radius: 50%;\n      transition: box-shadow .25s var(--pt-ease), transform .25s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-orbit-circle::before,\n    #promise-tracker-embed .pt-strip-photo::before {\n      content: \"\";\n      position: absolute;\n      inset: -1px;\n      border-radius: 50%;\n      background: #000;\n    }\n\n    #promise-tracker-embed .pt-orbit-circle img {\n      position: relative;\n      display: block;\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n      border-radius: 50%;\n      filter: grayscale(100%) contrast(1.04);\n    }\n\n    #promise-tracker-embed .pt-orbit-btn:hover .pt-orbit-circle { transform: translateY(-2px); }\n\n    #promise-tracker-embed .pt-orbit-label { display: block; width: 100%; height: 36px; margin-top: -26px; overflow: visible; transition: opacity .2s ease; }\n    #promise-tracker-embed .pt-orbit-label text { font-size: 12.5px; letter-spacing: .005em; }\n    #promise-tracker-embed .pt-orbit-label-name { fill: var(--pt-ink); font-weight: 800; }\n    #promise-tracker-embed .pt-orbit-label-party { fill: var(--party-ink, var(--pt-red)); font-weight: 700; }\n\n    #promise-tracker-embed .pt-orbit-item.pt-active { z-index: 4; transform: translate(var(--x), var(--y)) scale(1.24); }\n    #promise-tracker-embed .pt-orbit-item.pt-inactive { z-index: 1; opacity: .8; transform: translate(var(--x), var(--y)) scale(.56); }\n    #promise-tracker-embed .pt-orbit-item.pt-active .pt-orbit-label,\n    #promise-tracker-embed .pt-orbit-item.pt-inactive .pt-orbit-label { opacity: 0; pointer-events: none; }\n    #promise-tracker-embed .pt-orbit-item button:focus-visible .pt-orbit-circle { outline: 3px solid var(--pt-red); outline-offset: 5px; }\n\n    /* ---------- ministers: strip (narrow screens) ---------- */\n    #promise-tracker-embed .pt-strip {\n      display: flex;\n      justify-content: space-between;\n      gap: 14px;\n      overflow-x: auto;\n      padding: 8px 6px 12px;\n      margin: 0 -6px;\n      scroll-snap-type: x proximity;\n      scrollbar-width: none;\n    }\n    #promise-tracker-embed .pt-strip::-webkit-scrollbar { display: none; }\n\n    #promise-tracker-embed .pt-strip-item {\n      flex: 0 0 auto;\n      width: 96px;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 8px;\n      text-align: center;\n      scroll-snap-align: start;\n      transition: opacity .25s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-strip-photo { position: relative; width: 88px; height: 88px; border-radius: 50%; transition: box-shadow .25s var(--pt-ease); }\n    #promise-tracker-embed .pt-strip-photo img { position: relative; display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; filter: grayscale(100%) contrast(1.04); }\n    #promise-tracker-embed .pt-strip-item.pt-inactive { opacity: .4; }\n    #promise-tracker-embed .pt-strip-name { font-size: 13.5px; font-weight: 700; line-height: 1.15; }\n    #promise-tracker-embed .pt-strip-party { font-size: 12px; font-weight: 700; color: var(--party-ink); line-height: 1; margin-top: -3px; }\n    #promise-tracker-embed .pt-strip-caption { margin-top: 10px; font-size: 15px; color: var(--pt-muted); line-height: 1.4; min-height: 22px; }\n    #promise-tracker-embed .pt-strip-caption strong { color: var(--pt-ink); font-weight: 800; }\n\n    /* ---------- filters ---------- */\n    #promise-tracker-embed .pt-filters {\n      display: flex;\n      flex-wrap: wrap;\n      align-items: center;\n      gap: 12px;\n      padding: 14px;\n      border-radius: var(--pt-radius);\n      background: var(--pt-tint);\n      box-shadow: var(--pt-shadow);\n    }\n\n    #promise-tracker-embed .pt-search { position: relative; display: block; flex: 1 1 220px; min-width: 0; }\n    #promise-tracker-embed .pt-search svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--pt-muted); pointer-events: none; }\n\n    #promise-tracker-embed .pt-search input {\n      width: 100%;\n      height: 46px;\n      padding: 0 16px 0 44px;\n      border-radius: 999px;\n      border: 1.5px solid transparent;\n      background: #fff;\n      font-size: 15px;\n      appearance: none;\n      -webkit-appearance: none;\n    }\n    #promise-tracker-embed .pt-search input::placeholder { color: #9a9aa4; }\n\n    #promise-tracker-embed .pt-selects { display: flex; flex-wrap: wrap; gap: 10px; flex: 3 1 560px; }\n    #promise-tracker-embed .pt-select { position: relative; flex: 1 1 150px; min-width: 0; display: block; }\n\n    #promise-tracker-embed .pt-select select {\n      width: 100%;\n      height: 46px;\n      padding: 0 38px 0 18px;\n      border-radius: 999px;\n      border: 1.5px solid transparent;\n      background: #fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 20 20'%3E%3Cpath d='M4.5 7.5 10 13l5.5-5.5' fill='none' stroke='%2317171c' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 16px center;\n      font-size: 14.5px;\n      font-weight: 600;\n      appearance: none;\n      -webkit-appearance: none;\n      cursor: pointer;\n      text-overflow: ellipsis;\n    }\n\n    #promise-tracker-embed .pt-select.pt-filter-active select { border-color: var(--pt-red); }\n\n    #promise-tracker-embed .pt-clear { padding: 10px 14px; border-radius: 999px; font-size: 14px; font-weight: 700; color: var(--pt-red); }\n    #promise-tracker-embed .pt-clear:hover { background: rgba(255, 0, 51, .08); }\n\n    /* ---------- results ---------- */\n    #promise-tracker-embed .pt-results-count { margin-bottom: 16px; font-size: 14px; color: var(--pt-muted); }\n\n    #promise-tracker-embed .pt-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }\n\n    #promise-tracker-embed .pt-empty,\n    #promise-tracker-embed .pt-loading,\n    #promise-tracker-embed .pt-error {\n      grid-column: 1 / -1;\n      padding: 48px 20px;\n      text-align: center;\n      color: var(--pt-muted);\n      font-size: 16px;\n    }\n    #promise-tracker-embed .pt-error { color: var(--pt-red); }\n\n    /* ---------- cards ---------- */\n    #promise-tracker-embed .pt-card {\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      border-radius: var(--pt-radius);\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n      --pt-status-color: var(--pt-red);\n      --pt-status-bg: #fde5ea;\n      --pt-title-color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-card:focus-within { outline: 1.5px solid var(--pt-red); outline-offset: 0; }\n\n    #promise-tracker-embed .pt-card-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--pt-status-bg); }\n\n    #promise-tracker-embed .pt-card-fallback {\n      position: absolute;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      font-size: 54px;\n      line-height: 1;\n    }\n\n    #promise-tracker-embed .pt-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s var(--pt-ease); }\n\n    #promise-tracker-embed .pt-chip {\n      position: absolute;\n      top: 14px; right: 14px;\n      z-index: 2;\n      display: inline-flex;\n      align-items: center;\n      gap: 7px;\n      padding: 5px 12px 5px 6px;\n      border-radius: 999px;\n      background: rgba(255, 255, 255, .78);\n      -webkit-backdrop-filter: blur(8px);\n      backdrop-filter: blur(8px);\n      box-shadow: 0 1px 6px rgba(0, 0, 0, .08);\n      font-size: 13px;\n      font-weight: 700;\n      line-height: 1.2;\n      white-space: nowrap;\n      --sym: 20px;\n    }\n\n    #promise-tracker-embed .pt-card-body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 20px 22px 18px; }\n\n    #promise-tracker-embed .pt-card-title {\n      font-size: 21px;\n      line-height: 1.18;\n      font-weight: 800;\n      letter-spacing: -.012em;\n      color: var(--pt-title-color);\n      text-wrap: balance;\n    }\n\n    #promise-tracker-embed .pt-card-link::after { content: \"\"; position: absolute; inset: 0; z-index: 3; }\n    #promise-tracker-embed .pt-card-link:focus-visible { outline: none; }\n\n    #promise-tracker-embed .pt-card-summary {\n      display: -webkit-box;\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 3;\n      line-clamp: 3;\n      overflow: hidden;\n      font-size: 15px;\n      line-height: 1.55;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 14px; }\n    #promise-tracker-embed .pt-card-who { display: flex; align-items: center; gap: 9px; min-width: 0; font-size: 13.5px; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-card-names { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; line-height: 1.3; }\n    #promise-tracker-embed .pt-card-avatars { display: flex; flex: none; }\n    #promise-tracker-embed .pt-card-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; background: #E5E5E5; filter: grayscale(100%); flex: none; }\n    #promise-tracker-embed .pt-card-avatars .pt-card-avatar { box-shadow: 0 0 0 2px #fff; }\n    #promise-tracker-embed .pt-card-avatars .pt-card-avatar + .pt-card-avatar { margin-left: -9px; }\n\n    #promise-tracker-embed .pt-card-go { display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--pt-field); transition: background-color .25s var(--pt-ease), color .25s var(--pt-ease); }\n    #promise-tracker-embed .pt-card-go svg { width: 16px; height: 16px; }\n\n    #promise-tracker-embed .pt-card.pt-static .pt-card-go { visibility: hidden; }\n\n    @media (hover: hover) {\n      #promise-tracker-embed .pt-card:hover .pt-card-img { transform: scale(1.05); }\n      #promise-tracker-embed .pt-card:hover .pt-card-go { background: var(--pt-red); color: #fff; }\n    }\n\n    /* ---------- pagination ---------- */\n    #promise-tracker-embed .pt-pager-wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; }\n    #promise-tracker-embed .pt-pager { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }\n    #promise-tracker-embed .pt-pager button {\n      display: grid;\n      place-items: center;\n      position: relative;\n      z-index: 2;\n      width: 44px;\n      height: 44px;\n      min-width: 44px;\n      min-height: 44px;\n      padding: 0;\n      border-radius: 50%;\n      border: 1.5px solid var(--pt-line);\n      background: #fff;\n      line-height: 1;\n      touch-action: manipulation;\n      -webkit-tap-highlight-color: transparent;\n      transition: border-color .2s, background-color .2s, color .2s;\n    }\n    #promise-tracker-embed .pt-pager button:hover:not(:disabled) { border-color: var(--pt-ink); }\n    #promise-tracker-embed .pt-pager button:disabled { opacity: .35; cursor: default; }\n    #promise-tracker-embed .pt-pager svg { width: 16px; height: 16px; }\n    #promise-tracker-embed .pt-pager .pt-prev svg { transform: scaleX(-1); }\n    #promise-tracker-embed .pt-showall { padding: 10px 18px; border-radius: 999px; border: 1.5px solid var(--pt-line); background: #fff; font-size: 14px; font-weight: 700; }\n    #promise-tracker-embed .pt-showall:hover { border-color: var(--pt-ink); }\n\n    /* ---------- methodology ---------- */\n    #promise-tracker-embed .pt-method {\n      margin-top: 56px;\n      padding: 28px 30px;\n      border-radius: var(--pt-radius);\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n    }\n    #promise-tracker-embed .pt-method-title { margin-bottom: 14px; font-size: 22px; font-weight: 800; }\n    #promise-tracker-embed .pt-method-text { color: var(--pt-muted); text-wrap: pretty; }\n    #promise-tracker-embed .pt-method-text p { font-size: 13.5px; line-height: 1.6; }\n    #promise-tracker-embed .pt-method-text p + p { margin-top: 10px; }\n\n    /* ---------- one-time load animation ---------- */\n    @keyframes pt-grow { from { width: 0; } }\n    #promise-tracker-embed.pt-anim .pt-status-fill { animation: pt-grow .9s var(--pt-ease) both; }\n\n    /* ---------- responsive ---------- */\n    @media (max-width: 1100px) {\n      #promise-tracker-embed .pt-layout {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-areas: \"panel\" \"ministers\" \"filters\" \"results\";\n      }\n      #promise-tracker-embed .pt-ministers-body.pt-orbit-mode { max-width: 520px; }\n    }\n\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-app { --pt-top-space: 36px; padding: var(--pt-top-space) 16px 36px; }\n      #promise-tracker-embed .pt-meta { grid-template-columns: 1fr; }\n      #promise-tracker-embed .pt-status-row { grid-template-columns: 24px minmax(0, 1fr) auto; gap: 6px 12px; }\n      #promise-tracker-embed .pt-status-track { grid-column: 2 / -1; grid-row: 2; }\n      #promise-tracker-embed .pt-cards { grid-template-columns: minmax(0, 1fr); }\n      #promise-tracker-embed .pt-pager-wrap { flex-wrap: wrap; }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      #promise-tracker-embed *,\n    #promise-tracker-embed *::before,\n    #promise-tracker-embed *::after { animation: none !important; transition: none !important; }\n    }\n";
  document.head.appendChild(style);
  MOUNT.innerHTML = "<div class=\"pt-app\">\n    <div class=\"pt-layout\">\n\n      <section class=\"pt-ministers\" aria-label=\"Ministers\">\n        <div class=\"pt-ministers-body\" id=\"pt-ministersOrbit\"></div>\n      </section>\n\n      <div class=\"pt-panel\">\n\n        <header class=\"pt-intro\">\n          <h2 class=\"pt-title\">BRUZZ Check</h2>\n          <p class=\"pt-subtitle\">De politieke barometer van Brussel</p>\n\n          <p class=\"pt-lede\">\n            In februari 2026 trad de nieuwe Brusselse regering aan. Welke beloftes worden waargemaakt,\n            welke blijven liggen en welke raken onderweg bijgestuurd? BRUZZ volgt een selectie\n            opvallende engagementen uit het regeerakkoord op.\n          </p>\n\n          <div class=\"pt-timeline\" role=\"img\" aria-label=\"Voortgang van de legislatuur\">\n            <div class=\"pt-tl-track\">\n              <span class=\"pt-tl-fill\"></span>\n              <span class=\"pt-tl-mid\"></span>\n              <span class=\"pt-tl-dot\"></span>\n              <span class=\"pt-tl-today\">Vandaag</span>\n            </div>\n            <div class=\"pt-tl-labels\">\n              <span>Feb 2026</span>\n              <span class=\"pt-tl-label-mid\">Halverwege de termijn</span>\n              <span>Zomer 2029</span>\n            </div>\n          </div>\n        </header>\n\n        <section class=\"pt-status\" id=\"pt-status\" aria-labelledby=\"pt-statusSummaryCopy\">\n          <div class=\"pt-status-head\">\n            <h3 class=\"pt-status-title\" id=\"pt-statusSummaryCopy\">Voortgang volgens BRUZZ</h3>\n            <span class=\"pt-assessment-date\" id=\"pt-assessmentDate\">per -</span>\n          </div>\n          <div class=\"pt-status-bars\" id=\"pt-statusBars\"></div>\n        </section>\n\n        <div class=\"pt-meta\" id=\"pt-meta\">\n          <p class=\"pt-meta-item pt-meta-note\">BRUZZ beoordeelt de beloftes elke 6 maanden. <a class=\"pt-meta-link\" href=\"#pt-methodology\">Zo gaan we te werk.</a></p>\n        </div>\n\n      </div>\n\n      <section class=\"pt-filters\" id=\"pt-filters\" aria-label=\"Beloftes filteren\">\n        <label class=\"pt-search\">\n          <span class=\"pt-sr\">Zoeken</span>\n          <svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"9\" r=\"5.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"m13.4 13.4 4 4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n          <input id=\"pt-searchInput\" type=\"search\" placeholder=\"Zoek op belofte of minister\" autocomplete=\"off\">\n        </label>\n\n        <div class=\"pt-selects\">\n          <label class=\"pt-select\" data-filter=\"status\">\n            <span class=\"pt-sr\">Status</span>\n            <select id=\"pt-statusFilter\"><option value=\"\">Alle statussen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"minister\">\n            <span class=\"pt-sr\">Minister</span>\n            <select id=\"pt-ministerFilter\"><option value=\"\">Alle ministers</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"party\">\n            <span class=\"pt-sr\">Partij</span>\n            <select id=\"pt-partyFilter\"><option value=\"\">Alle partijen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"theme\">\n            <span class=\"pt-sr\">Thema</span>\n            <select id=\"pt-themeFilter\"><option value=\"\">Alle thema's</option></select>\n          </label>\n        </div>\n\n        <button class=\"pt-clear\" id=\"pt-clearFilters\" type=\"button\" hidden>Wis filters</button>\n      </section>\n\n      <div class=\"pt-results\">\n        <p class=\"pt-results-count\" id=\"pt-resultsMeta\" aria-live=\"polite\" hidden></p>\n        <div class=\"pt-cards\" id=\"pt-cardsContainer\">\n          <div class=\"pt-loading\">Aan het laden...</div>\n        </div>\n\n        <div class=\"pt-pager-wrap\" id=\"pt-paginationWrap\" hidden>\n          <button class=\"pt-showall\" id=\"pt-showAllToggle\" type=\"button\">Toon alles</button>\n          <div class=\"pt-pager\" id=\"pt-pagination\"></div>\n        </div>\n      </div>\n    </div>\n\n    <section id=\"pt-methodology\" class=\"pt-method\">\n      <h3 class=\"pt-method-title\">Zo gaan we te werk</h3>\n      <div class=\"pt-method-text\">\n        <p>BRUZZ volgt een selectie van politieke engagementen uit het Brusselse regeerakkoord en uit publieke verklaringen van de regering.</p>\n        <p>Per belofte bekijken we offici\u00eble documenten, beleidsbeslissingen, verklaringen en recente ontwikkelingen. Op basis daarvan kennen we een status toe: niet gestart, gestart, op schema, niet op schema, mislukt, gelukt, onverifieerbaar of geblokkeerd.</p>\n        <p>Deze pagina wordt geregeld bijgewerkt wanneer er relevante nieuwe informatie beschikbaar is.</p>\n      </div>\n    </section>\n  </div>";

    (function () {
      const root = MOUNT;
      if (!root) return;

      /* ===================================================================
         SETTINGS
         =================================================================== */
      /*
        Keeping the Baserow token out of the page:
        - Set API_BASE_URL to the address of your own proxy (see baserow-proxy-worker.js), e.g.
          "https://bruzz-check.your-name.workers.dev". The proxy holds the token; leave TOKEN empty.
        - Without API_BASE_URL the page talks to Baserow directly with TOKEN. That token is then visible
          to anyone who looks at the page's source, so only use that for testing.
      */
      const API_BASE_URL = String(CONFIG.api || "").trim();

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
      const TOKEN = "";
      const PROMISES_TABLE_ID = "931852".trim();
      const UPDATES_TABLE_ID = "931853".trim();
      const NEXT_PLANNED_UPDATE_LABEL = "sep 2026";

      // Exact name of the Baserow column that holds the hero image (file field or plain URL).
      // Leave empty to auto-detect (tries "Hero image", "Afbeelding", "Image", "Foto", "Cover", ...).
      const HERO_FIELD = "";

      const PROMISES_API = `https://api.baserow.io/api/database/rows/table/${PROMISES_TABLE_ID}/?user_field_names=true&size=200`;
      const UPDATES_API = `https://api.baserow.io/api/database/rows/table/${UPDATES_TABLE_ID}/?user_field_names=true&size=200`;

      const PAGE_SIZE = 12;

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

      const PARTY_COLORS = {
            "Anders": "#5d8ee6",
            "MR": "#5d8ee6",
            "Les Engagés": "#67dce9",
            "Les Engages": "#67dce9",
            "Groen": "#66d36c",
            "Vooruit": "#ff0033",
            "PS": "#ff0033"
          };

      // Darker versions of the party colours, used for small text so it stays readable.
      const PARTY_INK = {
        "Anders": "#3f6fcf",
        "MR": "#3f6fcf",
        "Les Engagés": "#1594a6",
        "Les Engages": "#1594a6",
        "Groen": "#2c9a35",
        "Vooruit": "#e6002f",
        "PS": "#e6002f"
      };

      // All card titles have the same colour.
      const CARD_TITLE_COLOR = "#1F1F1F";

      const STATUS_ORDER = ["GELUKT","OP SCHEMA","GESTART","NIET OP SCHEMA","NIET GESTART","MISLUKT","GEBLOKKEERD","ONVERIFIEERBAAR"];
      const HIDE_WHEN_ZERO = ["GEBLOKKEERD", "ONVERIFIEERBAAR"];

      const LEGACY_STATUS_MAP = {
            "NIET VERIFIEERBAAR": "ONVERIFIEERBAAR",
            "GEREALISEERD": "GELUKT",
            "NAGEKOMEN": "GELUKT",
            "BEZIG": "OP SCHEMA",
            "GEEN NIEUWS": "GESTART",
            "VERTRAGING": "NIET OP SCHEMA",
            "NIET NAGEKOMEN": "NIET GESTART",
            "INGELOST": "GELUKT",
            "IN UITVOERING": "OP SCHEMA",
            "VASTGELOPEN": "NIET OP SCHEMA",
            "NIET INGELOST": "NIET GESTART"
          };

      const TIMELINE_START = new Date("2026-02-01T00:00:00");
      const TIMELINE_END = new Date("2029-06-10T00:00:00");
      const TIMELINE_MIDPOINT = new Date((TIMELINE_START.getTime() + TIMELINE_END.getTime()) / 2);

      const HOME_CENTER = {
        centerKicker: "2024-2029",
        centerTitle: "Brusselse\nRegering",
        centerSubtitle: "",
        partij: ""
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

      const HERO_CANDIDATES = ["Hero image", "Hero", "Hero afbeelding", "Afbeelding", "Image", "Foto", "Cover", "Beeld", "Header image"];

      const ICON_CHEVRON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      /* ===================================================================
         STATE
         =================================================================== */
      let allPromises = [];
      let allUpdates = [];
      let filteredPromises = [];
      let dataLoaded = false;
      let currentPage = 1;
      let showAll = false;
      let activeMinisterIndex = null;
      let resizeTimer = null;
      let lastOrbitWidth = 0;
      let animTimer = null;
      let introPlayed = false;

      const $ = (id) => root.querySelector(`#${id}`);

      /* ===================================================================
         HELPERS
         =================================================================== */
      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function renderInline(value) {
        const text = String(value ?? "").replace(/\s+/g, " ").trim();
        return escapeHtml(text)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
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

      function getFirstField(row, names) {
        for (const name of names) {
          if (Object.prototype.hasOwnProperty.call(row, name)) {
            const value = getDisplayValue(row[name]).trim();
            if (value) return value;
          }
        }
        return "";
      }

      function getPromiseVerdict(row) {
        return getFirstField(row, ["Verdict", "Vonnis", "BRUZZ verdict", "BRUZZ vonnis", "Uitkomst", "Outcome"]);
      }

      function normalize(value) {
        return getDisplayValue(value).trim().toLowerCase();
      }

      function fold(value) {
        return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
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

      function formatDate(value) {
        const raw = getDisplayValue(value);
        if (!raw) return "";
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return raw;
        return d.toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
      }

      function statusKey(rawStatus) {
        const raw = getDisplayValue(rawStatus).trim().toUpperCase();
        const mapped = LEGACY_STATUS_MAP[raw] || raw;
        return STATUS_CONFIG[mapped] ? mapped : "GESTART";
      }

      function statusConfigFor(rawStatus) {
        return STATUS_CONFIG[statusKey(rawStatus)] || STATUS_CONFIG["GESTART"];
      }

      // "NIET OP SCHEMA" -> "Niet op schema"
      function statusLabel(key) {
        const lower = String(key || "").toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      function titleColorFor() {
        return CARD_TITLE_COLOR;
      }

      function partyColor(party) {
        return PARTY_COLORS[String(party || "").trim()] || "#ff0033";
      }

      function partyInk(party) {
        return PARTY_INK[String(party || "").trim()] || "#e6002f";
      }

      // "Elke VAN DEN BRANDT" -> "Elke Van den Brandt"
      function displayName(raw) {
        const words = String(raw || "").trim().split(/\s+/);
        const particles = new Set(["van", "den", "der", "de", "het", "ten", "ter"]);
        const firstSurname = words.findIndex(w => w.length > 1 && w === w.toUpperCase() && w !== w.toLowerCase());
        return words.map((w, i) => {
          if (firstSurname === -1 || i < firstSurname) return w;
          const lower = w.toLowerCase();
          if (i > firstSurname && particles.has(lower)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        }).join(" ");
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

      // every individual name once (not "A, B" as one option)
      function uniqueList(rows, namesOf) {
        const seen = new Map();
        rows.forEach(row => namesOf(row).forEach(name => {
          const key = fold(name);
          if (!seen.has(key)) seen.set(key, name);
        }));
        return [...seen.values()].sort((a, b) => a.localeCompare(b));
      }

      function uniqueValues(rows, fieldName) {
        return [...new Set(rows.map(row => getDisplayValue(row[fieldName])).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b));
      }

      function fillSelect(selectId, options, emptyLabel) {
        const el = $(selectId);
        el.innerHTML = "";
        const base = document.createElement("option");
        base.value = "";
        base.textContent = emptyLabel;
        el.appendChild(base);

        options.forEach(o => {
          const opt = document.createElement("option");
          opt.value = typeof o === "string" ? o : o.value;
          opt.textContent = typeof o === "string" ? o : o.label;
          el.appendChild(opt);
        });
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

      /* ---- hero image ---- */
      function extractUrl(v) {
        if (!v) return "";
        if (typeof v === "string") return /^https?:\/\//i.test(v.trim()) ? v.trim() : "";
        if (Array.isArray(v)) {
          for (const item of v) {
            const u = extractUrl(item);
            if (u) return u;
          }
          return "";
        }
        if (typeof v === "object") return extractUrl(v.url) || extractUrl(v.value) || "";
        return "";
      }

      function getHeroImage(row) {
        const names = HERO_FIELD ? [HERO_FIELD] : HERO_CANDIDATES;
        for (const name of names) {
          if (name in row) {
            const u = extractUrl(row[name]);
            if (u) return u;
          }
        }
        if (!HERO_FIELD) {
          for (const key of Object.keys(row)) {
            if (/hero|afbeeld|image|foto|cover|beeld/i.test(key)) {
              const u = extractUrl(row[key]);
              if (u) return u;
            }
          }
        }
        return "";
      }

      /* ---- updates (used for sorting + the "last assessment" date) ---- */
      function getPromiseUpdates(promiseRow) {
        const promiseRowId = Number(promiseRow.id);
        const promiseKey = getDisplayValue(promiseRow["Promise key"]).trim();

        return allUpdates.filter(update => {
          const linkedIds = getLinkedIds(update["Promise"]);
          const updateKey = getDisplayValue(update["Promise key"]).trim();
          return linkedIds.includes(promiseRowId) || (promiseKey && updateKey === promiseKey);
        }).sort((a, b) => {
          const aDate = new Date(getDisplayValue(a["Update date"] || "")).getTime() || 0;
          const bDate = new Date(getDisplayValue(b["Update date"] || "")).getTime() || 0;
          return bDate - aDate;
        });
      }

      function getLatestUpdateTime(promiseRow) {
        const latest = getPromiseUpdates(promiseRow)[0];
        if (!latest) return 0;
        const d = new Date(getDisplayValue(latest["Update date"] || ""));
        return Number.isNaN(d.getTime()) ? 0 : d.getTime();
      }

      // The "per ..." date in the overview: the most recent date in the "Laatsteverdict" column
      // (found in the promises or the updates table; matched ignoring case, spaces and dashes).
      // If that column is not found, the most recent update date is used instead.
      const VERDICT_DATE_COLUMN = "laatsteverdict";

      function parseLooseDate(raw) {
        const s = String(raw || "").trim();
        if (!s) return 0;

        const direct = new Date(s);
        if (!Number.isNaN(direct.getTime())) return direct.getTime();

        const lower = s.toLowerCase();
        const numeric = lower.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
        if (numeric) return new Date(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1])).getTime();

        const months = { januari: 0, jan: 0, februari: 1, feb: 1, maart: 2, mrt: 2, april: 3, apr: 3, mei: 4, juni: 5, jun: 5, juli: 6, jul: 6, augustus: 7, aug: 7, september: 8, sep: 8, sept: 8, oktober: 9, okt: 9, november: 10, nov: 10, december: 11, dec: 11 };
        const named = lower.match(/(\d{1,2})\s+(januari|jan|februari|feb|maart|mrt|april|apr|mei|juni|jun|juli|jul|augustus|aug|september|sept|sep|oktober|okt|november|nov|december|dec)\.?\s+(\d{4})/);
        if (named) return new Date(Number(named[3]), months[named[2]], Number(named[1])).getTime();

        return 0;
      }

      function getLatestVerdictTime() {
        let best = 0;
        allPromises.concat(allUpdates).forEach(row => {
          Object.keys(row).forEach(key => {
            if (key.toLowerCase().replace(/[\s_-]+/g, "") !== VERDICT_DATE_COLUMN) return;
            flattenValues(row[key]).forEach(value => {
              const time = parseLooseDate(value);
              if (time > best) best = time;
            });
          });
        });
        return best;
      }

      function getLatestAssessmentDate() {
        const time = getLatestVerdictTime();
        if (time) return new Date(time).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
        return getLatestGlobalUpdateDate();
      }

      function getLatestGlobalUpdateDate() {
        if (!allUpdates.length) return "";
        const latest = [...allUpdates].sort((a, b) => {
          const aTime = new Date(getDisplayValue(a["Update date"] || "")).getTime() || 0;
          const bTime = new Date(getDisplayValue(b["Update date"] || "")).getTime() || 0;
          return bTime - aTime;
        })[0];
        return formatDate(getDisplayValue(latest["Update date"] || ""));
      }

      /* ---- timeline ---- */
      function getTimelinePercentFor(date) {
        const start = TIMELINE_START.getTime();
        const end = TIMELINE_END.getTime();
        const current = date.getTime();
        if (current <= start) return 0;
        if (current >= end) return 100;
        return ((current - start) / (end - start)) * 100;
      }

      function updateTimelineMarkers() {
        root.style.setProperty("--pt-today-pos", `${getTimelinePercentFor(new Date())}%`);
        root.style.setProperty("--pt-mid-pos", `${getTimelinePercentFor(TIMELINE_MIDPOINT)}%`);
      }

      /* ===================================================================
         MINISTERS
         =================================================================== */
      function ensureMinisterOption(name) {
        const select = $("pt-ministerFilter");
        const key = fold(name);
        const existing = [...select.options].find(opt => opt.value && fold(opt.value) === key);
        if (existing) return existing.value;
        const opt = document.createElement("option");
        opt.value = displayName(name);
        opt.textContent = displayName(name);
        select.appendChild(opt);
        return opt.value;
      }

      function toggleMinister(idx) {
        activeMinisterIndex = activeMinisterIndex === idx ? null : idx;
        $("pt-searchInput").value = "";
        resetSelectFilters();
        if (activeMinisterIndex != null) {
          $("pt-ministerFilter").value = ensureMinisterOption(MINISTERS[activeMinisterIndex].name);
        }
        renderMinisters();
        applyFilters(true);
      }

      function bindMinisterButtons(host) {
        host.querySelectorAll("[data-minister-index]").forEach(btn => {
          btn.addEventListener("click", () => toggleMinister(Number(btn.dataset.ministerIndex)));
        });
      }

      function stateClassFor(idx) {
        if (activeMinisterIndex == null) return "";
        return activeMinisterIndex === idx ? "pt-active" : "pt-inactive";
      }

      function createCurveLabel(minister, idx) {
        const pathId = `pt-curve-${idx}`;
        const name = displayName(minister.shortName || minister.name || "");
        const party = minister.partij || "";
        const partyPart = party
          ? `<tspan> </tspan><tspan class="pt-orbit-label-party">${escapeHtml(party)}</tspan>`
          : "";

        return `
          <svg class="pt-orbit-label" viewBox="0 0 230 46" aria-hidden="true" style="overflow: visible;">
            <defs><path id="${pathId}" d="M 22 2 A 105 105 0 0 0 208 2"></path></defs>
            <text>
              <textPath href="#${pathId}" startOffset="50%" text-anchor="middle">
                <tspan class="pt-orbit-label-name">${escapeHtml(name)}</tspan>${partyPart}
              </textPath>
            </text>
          </svg>
        `;
      }

      function renderOrbit(host) {
        host.innerHTML = "";
        const bounds = host.getBoundingClientRect();
        lastOrbitWidth = Math.round(bounds.width);
        const width = bounds.width || 620;
        const height = bounds.height || width;
        const base = Math.min(width, height);

        const itemSize = width < 460 ? 68 : 112;
        const radius = Math.max(112, Math.min(base * 0.39, 235));

        const step = (Math.PI * 2) / MINISTERS.length;
        const start = -Math.PI / 2;

        const positions = MINISTERS.map((_, idx) => ({
          x: Math.round(Math.cos(start + idx * step) * radius),
          y: Math.round(Math.sin(start + idx * step) * radius)
        }));

        const current = activeMinisterIndex == null ? HOME_CENTER : MINISTERS[activeMinisterIndex];
        const centerMode = activeMinisterIndex == null ? "pt-home" : "pt-detail";

        const centerContent = activeMinisterIndex == null
          ? `
            <h2 class="pt-orbit-center-title">${escapeHtml(current.centerTitle || "")}</h2>
          `
          : `
            <h2 class="pt-orbit-center-title">${escapeHtml(displayName(current.centerTitle || ""))}</h2>
            <div class="pt-orbit-center-meta">
              ${current.centerKicker ? `<span>${escapeHtml(current.centerKicker)}</span>` : ""}
              ${current.partij ? `<span class="pt-orbit-center-party">${escapeHtml(current.partij)}</span>` : ""}
            </div>
            ${current.centerSubtitle ? `<p class="pt-orbit-center-subtitle">${escapeHtml(current.centerSubtitle)}</p>` : ""}
          `;

        host.innerHTML = `
          <div class="pt-orbit-center ${centerMode}" style="--party-ink:${escapeHtml(partyInk(current.partij))};">
            ${centerContent}
          </div>

          ${MINISTERS.map((minister, idx) => {
            const pos = positions[idx];
            return `
              <div class="pt-orbit-item ${stateClassFor(idx)}" style="--x:${pos.x}px; --y:${pos.y}px; --size:${itemSize}px; --party-color:${partyColor(minister.partij)}; --party-ink:${partyInk(minister.partij)};">
                <button type="button" class="pt-orbit-btn" data-minister-index="${idx}" aria-label="${escapeHtml(displayName(minister.name))}" aria-pressed="${activeMinisterIndex === idx}">
                  <span class="pt-orbit-circle">
                    <img src="${escapeHtml(minister.image)}" alt="" loading="lazy">
                  </span>
                  ${createCurveLabel(minister, idx)}
                </button>
              </div>
            `;
          }).join("")}
        `;
        bindMinisterButtons(host);
      }

      function renderStrip(host) {
        const active = activeMinisterIndex == null ? null : MINISTERS[activeMinisterIndex];
        const role = active
          ? [active.centerKicker && active.centerKicker.toLowerCase(), active.partij && `(${active.partij})`].filter(Boolean).join(" ")
          : "";
        const caption = active
          ? `<strong>${escapeHtml(displayName(active.name))}</strong> ${escapeHtml(role)}${active.centerSubtitle ? `. ${escapeHtml(active.centerSubtitle)}` : ""}`
          : "Kies een minister om de beloftes te filteren.";

        host.innerHTML = `
          <div class="pt-strip">
            ${MINISTERS.map((minister, idx) => `
              <button type="button" class="pt-strip-item ${stateClassFor(idx)}" data-minister-index="${idx}" aria-pressed="${activeMinisterIndex === idx}" style="--party-color:${partyColor(minister.partij)}; --party-ink:${partyInk(minister.partij)};">
                <span class="pt-strip-photo"><img src="${escapeHtml(minister.image)}" alt="" loading="lazy"></span>
                <span class="pt-strip-name">${escapeHtml(displayName(minister.name))}</span>
                <span class="pt-strip-party">${escapeHtml(minister.partij || "")}</span>
              </button>
            `).join("")}
          </div>
          <p class="pt-strip-caption">${caption}</p>
        `;
        bindMinisterButtons(host);
      }

      // The circle needs room. On narrow screens it falls back to a scrolling strip.
      function canUseOrbit() {
        const host = $("pt-ministersOrbit");
        return host.parentElement.clientWidth >= 440;
      }

      function renderMinisters() {
        const host = $("pt-ministersOrbit");
        if (!host) return;
        const orbit = canUseOrbit();
        host.classList.toggle("pt-orbit-mode", orbit);
        if (orbit) renderOrbit(host);
        else renderStrip(host);
      }

      /* ===================================================================
         STATUS
         =================================================================== */
      function renderSym(conf) {
        const url = String(conf.iconUrl || "").trim();
        const fallback = `<span class="pt-sym-fallback">${escapeHtml(conf.symbol)}</span>`;
        const img = /^https?:\/\//i.test(url)
          ? `<img class="pt-sym-img" src="${escapeHtml(url)}" alt="" decoding="async">`
          : "";
        return `<span class="pt-sym" style="--pt-status-color:${escapeHtml(conf.color)};">${fallback}${img}</span>`;
      }

      root.addEventListener("load", event => {
        const img = event.target;
        if (img.tagName === "IMG" && img.classList.contains("pt-sym-img")) {
          const fb = img.previousElementSibling;
          if (fb) fb.style.visibility = "hidden";
        }
      }, true);

      root.addEventListener("error", event => {
        const img = event.target;
        if (img.tagName !== "IMG") return;
        if (img.classList.contains("pt-sym-img") || img.classList.contains("pt-card-img")) img.style.display = "none";
        if (img.classList.contains("pt-card-avatar")) img.style.visibility = "hidden";
      }, true);

      function renderSummary() {
        updateTimelineMarkers();
        const latest = getLatestAssessmentDate() || "-";
        $("pt-assessmentDate").textContent = `per ${latest}`;

        if (!introPlayed) {
          introPlayed = true;
          root.classList.add("pt-anim");
          clearTimeout(animTimer);
          animTimer = setTimeout(() => root.classList.remove("pt-anim"), 1500);
        }

        const counts = {};
        STATUS_ORDER.forEach(k => counts[k] = 0);
        allPromises.forEach(row => {
          const key = statusKey(row["Status"]);
          counts[key] = (counts[key] || 0) + 1;
        });

        // A full bar stands for all promises together.
        const total = allPromises.length;
        const activeStatus = $("pt-statusFilter")?.value || "";

        const bars = $("pt-statusBars");
        bars.innerHTML = STATUS_ORDER
          .filter(key => !HIDE_WHEN_ZERO.includes(key) || (counts[key] || 0) > 0)
          .map(key => {
            const conf = STATUS_CONFIG[key];
            const value = counts[key] || 0;
            const pct = total && value ? (value / total) * 100 : 0;
            const isActive = activeStatus === key;
            return `
              <button type="button"
                class="pt-status-row ${isActive ? "pt-status-active" : ""}"
                style="--pt-status-color:${escapeHtml(conf.color)};"
                data-status-summary="${escapeHtml(key)}"
                data-zero="${value === 0}"
                aria-pressed="${isActive}">
                <span class="pt-status-icon" aria-hidden="true">${renderSym(conf)}</span>
                <span class="pt-status-name">${escapeHtml(statusLabel(key))}</span>
                <span class="pt-status-track" aria-hidden="true"><span class="pt-status-fill" style="--w:${pct}%;${value ? "" : " display:none;"}"></span></span>
                <span class="pt-status-count">${value}</span>
              </button>
            `;
          }).join("");
        bars.classList.toggle("pt-has-active", Boolean(activeStatus));

        bars.querySelectorAll("[data-status-summary]").forEach(btn => {
          btn.addEventListener("click", () => {
            const clicked = btn.dataset.statusSummary;
            setExclusiveFilter("status", $("pt-statusFilter").value === clicked ? "" : clicked);
          });
        });
      }

      /* ===================================================================
         CARDS
         =================================================================== */
      function renderCard(row) {
        const title = getDisplayValue(row["Promise"]);
        const emoji = getDisplayValue(row["Emoji"]);
        const people = ministerPeople(row["Minister"], row["Party"]);
        const summary = getDisplayValue(row["Short description"]);
        const detailUrl = getDisplayValue(row["Detail URL"]).trim();
        const hero = getHeroImage(row);
        const key = statusKey(row["Status"]);
        const conf = statusConfigFor(row["Status"]);
        const who = peopleText(people);
        const avatars = people.filter(p => p.person).slice(0, 3);

        const titleHtml = detailUrl
          ? `<a class="pt-card-link" href="${escapeHtml(detailUrl)}">${escapeHtml(title)}</a>`
          : escapeHtml(title);

        return `
          <article class="pt-card ${detailUrl ? "" : "pt-static"}" style="--pt-status-color:${escapeHtml(conf.color)}; --pt-status-bg:${escapeHtml(conf.bg)}; --pt-title-color:${escapeHtml(titleColorFor(key))};">
            <div class="pt-card-media">
              <div class="pt-card-fallback" aria-hidden="true">${emoji ? escapeHtml(emoji) : ""}</div>
              ${hero ? `<img class="pt-card-img" src="${escapeHtml(hero)}" alt="" loading="lazy" decoding="async">` : ""}
            </div>

            <span class="pt-chip">${renderSym(conf)}<span>${escapeHtml(statusLabel(key))}</span></span>

            <div class="pt-card-body">
              <h3 class="pt-card-title">${titleHtml}</h3>
              ${summary ? `<p class="pt-card-summary">${renderInline(summary)}</p>` : ""}
              <div class="pt-card-foot">
                <div class="pt-card-who">
                  ${avatars.length ? `<span class="pt-card-avatars">${avatars.map(p => `<img class="pt-card-avatar" src="${escapeHtml(p.person.image)}" alt="" loading="lazy">`).join("")}</span>` : ""}
                  ${who ? `<span class="pt-card-names">${escapeHtml(who)}</span>` : ""}
                </div>
                <span class="pt-card-go" aria-hidden="true">${ICON_CHEVRON}</span>
              </div>
            </div>
          </article>
        `;
      }

      function renderCards(rows) {
        const container = $("pt-cardsContainer");
        if (!rows.length) {
          container.innerHTML = `<div class="pt-empty">Geen beloftes gevonden met deze filters.</div>`;
          return;
        }
        container.innerHTML = rows.map(renderCard).join("");
      }

      function renderResultsCount(total) {
        const el = $("pt-resultsMeta");
        el.hidden = false;
        el.textContent = `${total} ${total === 1 ? "belofte" : "beloftes"}`;
      }

      // Jump straight to the top of the results after changing page. (A smooth scroll takes about a second,
      // and a click that lands while the page is still moving can be lost.)
      function scrollToResults() {
        $("pt-filters").scrollIntoView({ behavior: "auto", block: "start" });
      }

      function renderPagination(total, totalPages) {
        const size = PAGE_SIZE;
        const wrap = $("pt-paginationWrap");
        const pager = $("pt-pagination");

        wrap.hidden = total <= size;
        $("pt-showAllToggle").textContent = showAll ? "Toon minder" : "Toon alles";

        if (showAll || total <= size) {
          pager.innerHTML = "";
          return;
        }

        pager.innerHTML = `
          <button type="button" class="pt-prev" id="pt-prevPage" aria-label="Vorige pagina" ${currentPage === 1 ? "disabled" : ""}>${ICON_CHEVRON}</button>
          <span>${currentPage} / ${totalPages}</span>
          <button type="button" class="pt-next" id="pt-nextPage" aria-label="Volgende pagina" ${currentPage === totalPages ? "disabled" : ""}>${ICON_CHEVRON}</button>
        `;

        $("pt-prevPage")?.addEventListener("click", () => { currentPage--; applyFilters(false); scrollToResults(); });
        $("pt-nextPage")?.addEventListener("click", () => { currentPage++; applyFilters(false); scrollToResults(); });
      }

      /* ===================================================================
         FILTERS
         =================================================================== */
      function resetSelectFilters() {
        $("pt-statusFilter").value = "";
        $("pt-partyFilter").value = "";
        $("pt-themeFilter").value = "";
        $("pt-ministerFilter").value = "";
      }

      function setExclusiveFilter(type, value) {
        $("pt-searchInput").value = "";
        resetSelectFilters();
        activeMinisterIndex = null;
        if (type === "status") $("pt-statusFilter").value = value || "";
        renderMinisters();
        applyFilters(true);
      }

      function updateFilterHighlightState() {
        let any = Boolean($("pt-searchInput").value.trim());
        ["status", "minister", "party", "theme"].forEach(key => {
          const select = $(`pt-${key}Filter`);
          const active = Boolean(select.value);
          any = any || active;
          select.closest(".pt-select")?.classList.toggle("pt-filter-active", active);
        });
        $("pt-clearFilters").hidden = !any;
      }

      function applyFilters(resetPage = true) {
        if (resetPage) currentPage = 1;

        const q = normalize($("pt-searchInput").value);
        const status = $("pt-statusFilter").value;
        const party = $("pt-partyFilter").value;
        const theme = $("pt-themeFilter").value;
        const minister = $("pt-ministerFilter").value;

        updateFilterHighlightState();

        filteredPromises = allPromises.filter(row => {
          const promise = getDisplayValue(row["Promise"]);
          const desc = getDisplayValue(row["Short description"]);
          const verdict = getPromiseVerdict(row);
          const rowStatus = statusKey(row["Status"]);
          const rowParties = listValues(row["Party"]);
          const rowParty = rowParties.join(" ");
          const rowTheme = getDisplayValue(row["Theme"]);
          const rowMinisters = listValues(row["Minister"]);
          const rowMinister = rowMinisters.join(" ");

          const matchesSearch = !q ||
            promise.toLowerCase().includes(q) ||
            desc.toLowerCase().includes(q) ||
            verdict.toLowerCase().includes(q) ||
            statusLabel(rowStatus).toLowerCase().includes(q) ||
            rowParty.toLowerCase().includes(q) ||
            rowTheme.toLowerCase().includes(q) ||
            rowMinister.toLowerCase().includes(q);

          return matchesSearch &&
            (!status || rowStatus === status) &&
            (!party || rowParties.some(p => fold(p) === fold(party))) &&
            (!theme || rowTheme === theme) &&
            (!minister || rowMinisters.some(m => fold(m) === fold(minister)));
        });

        filteredPromises.sort((a, b) => getLatestUpdateTime(b) - getLatestUpdateTime(a));

        const total = filteredPromises.length;
        const size = PAGE_SIZE;
        const totalPages = showAll ? 1 : Math.max(1, Math.ceil(total / size));
        if (currentPage > totalPages) currentPage = 1;

        const pageRows = showAll
          ? filteredPromises
          : filteredPromises.slice((currentPage - 1) * size, currentPage * size);

        renderSummary();
        renderResultsCount(total);
        renderCards(pageRows);
        renderPagination(total, totalPages);
      }

      function clearAllFilters() {
        $("pt-searchInput").value = "";
        resetSelectFilters();
        activeMinisterIndex = null;
        currentPage = 1;
        renderMinisters();
        applyFilters(false);
      }

      /* ===================================================================
         EVENTS
         =================================================================== */
      function syncMinisterFromSelect() {
        const selected = fold($("pt-ministerFilter").value);
        const idx = MINISTERS.findIndex(m => fold(m.name) === selected);
        activeMinisterIndex = idx >= 0 ? idx : null;
        renderMinisters();
      }

      $("pt-searchInput").addEventListener("input", () => applyFilters(true));

      ["pt-statusFilter", "pt-partyFilter", "pt-themeFilter", "pt-ministerFilter"].forEach(id => {
        $(id).addEventListener("change", () => {
          syncMinisterFromSelect();
          applyFilters(true);
        });
      });

      $("pt-clearFilters").addEventListener("click", clearAllFilters);

      $("pt-showAllToggle").addEventListener("click", () => {
        showAll = !showAll;
        currentPage = 1;
        applyFilters(false);
      });

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const host = $("pt-ministersOrbit");
          const orbit = canUseOrbit();
          const modeChanged = orbit !== host.classList.contains("pt-orbit-mode");
          const widthChanged = orbit && Math.abs(Math.round(host.getBoundingClientRect().width) - lastOrbitWidth) > 8;
          if (modeChanged || widthChanged) renderMinisters();
        }, 150);
      });

      /* ===================================================================
         INIT
         =================================================================== */
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
          el.setAttribute("data-pt-hidden", "");
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
        updateTimelineMarkers();
        renderMinisters();

        try {
          const [promises, updates] = await Promise.all([
            fetchTable(PROMISES_API, "Promises table", "promises"),
            fetchTable(UPDATES_API, "Updates table", "updates").catch(() => [])
          ]);

          allPromises = promises;
          allUpdates = updates;
          allPromises.sort((a, b) => getLatestUpdateTime(b) - getLatestUpdateTime(a));
          dataLoaded = true;

          fillSelect(
            "pt-statusFilter",
            STATUS_ORDER
              .filter(key => !HIDE_WHEN_ZERO.includes(key) || allPromises.some(row => statusKey(row["Status"]) === key))
              .map(key => ({ value: key, label: statusLabel(key) })),
            "Alle statussen"
          );
          fillSelect("pt-partyFilter", uniqueList(allPromises, row => listValues(row["Party"])), "Alle partijen");
          fillSelect("pt-themeFilter", uniqueValues(allPromises, "Theme"), "Alle thema's");
          fillSelect("pt-ministerFilter", uniqueList(allPromises, row => listValues(row["Minister"])), "Alle ministers");

          renderMinisters();
          applyFilters();
        } catch (err) {
          $("pt-cardsContainer").innerHTML = `<div class="pt-error">Could not load data: ${escapeHtml(err.message)}</div>`;
        }
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
