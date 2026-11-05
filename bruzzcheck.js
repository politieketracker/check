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
  style.textContent = "    /* =====================================================================\n       BRUZZ Check - styles (Zacht)\n       ===================================================================== */\n\n    /* ---------- tokens + reset ---------- */\n    #promise-tracker-embed {\n      --pt-red: #ff0033;\n      --pt-pink: #FA79D7;\n      --pt-ink: #17171c;\n      --pt-muted: #6b6b75;\n      --pt-bg: #fff9fb;\n      --pt-field: #FFF2F5;\n      --pt-tint: #FFE9EE;\n      --pt-line: #FFE0E6;\n      --pt-radius: 0;\n      --pt-shadow: 0 0 0 1px rgba(23, 23, 28, .025), 0 1px 2px rgba(23, 23, 28, .03), 0 6px 18px -10px rgba(23, 23, 28, .06);\n      --pt-ease: cubic-bezier(.2, .8, .2, 1);\n\n      position: relative;\n      width: 100%;\n      color: var(--pt-ink);\n      font: inherit;\n      line-height: 1.45;\n      -webkit-text-size-adjust: 100%;\n    }\n\n    #promise-tracker-embed *,\n    #promise-tracker-embed *::before,\n    #promise-tracker-embed *::after { box-sizing: border-box; }\n\n    #promise-tracker-embed [hidden] { display: none !important; }\n\n    #promise-tracker-embed h2,\n    #promise-tracker-embed h3,\n    #promise-tracker-embed p { margin: 0; }\n\n    #promise-tracker-embed a { color: inherit; text-decoration: none; }\n\n    #promise-tracker-embed button,\n    #promise-tracker-embed input,\n    #promise-tracker-embed select {\n      font: inherit;\n      color: inherit;\n      letter-spacing: inherit;\n    }\n\n    #promise-tracker-embed button {\n      appearance: none;\n      -webkit-appearance: none;\n      background: none;\n      border: 0;\n      padding: 0;\n      margin: 0;\n      cursor: pointer;\n      text-align: inherit;\n    }\n\n    #promise-tracker-embed button:focus-visible,\n    #promise-tracker-embed a:focus-visible,\n    #promise-tracker-embed select:focus-visible,\n    #promise-tracker-embed input:focus-visible {\n      outline: 3px solid var(--pt-red);\n      outline-offset: 3px;\n    }\n\n    /* dropdowns and search: focus shows as the red border only, never as a second outer ring */\n    #promise-tracker-embed .pt-select select:focus-visible,\n    #promise-tracker-embed .pt-search input:focus-visible {\n      outline: none;\n      border-color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-sr {\n      position: absolute !important;\n      width: 1px; height: 1px;\n      margin: -1px; padding: 0;\n      overflow: hidden;\n      clip: rect(0 0 0 0);\n      white-space: nowrap;\n      border: 0;\n    }\n\n    /* ---------- page + layout ---------- */\n    #promise-tracker-embed .pt-app {\n      width: 100%;\n      margin: 0;\n      /* the pink fills the whole embed; the content keeps a maximum width and stays centred */\n      /* --pt-top-space = extra pink above the title and ministers; change this number to taste */\n      --pt-top-space: 56px;\n      padding: var(--pt-top-space) max(clamp(20px, 4vw, 52px), calc((100% - 1146px) / 2)) 56px;\n      background: var(--pt-bg);\n    }\n\n    #promise-tracker-embed .pt-layout {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      grid-template-areas:\n        \"ministers panel\"\n        \"filters filters\"\n        \"results results\";\n      column-gap: clamp(32px, 5vw, 72px);\n      row-gap: 36px;\n    }\n\n    #promise-tracker-embed .pt-ministers { grid-area: ministers; align-self: center; }\n    #promise-tracker-embed .pt-panel {\n      grid-area: panel;\n      display: flex;\n      flex-direction: column;\n      gap: 26px;\n      align-self: center;\n    }\n    #promise-tracker-embed .pt-filters { grid-area: filters; }\n    #promise-tracker-embed .pt-results { grid-area: results; }\n\n    /* ---------- intro ---------- */\n    #promise-tracker-embed .pt-title {\n      font-size: clamp(38px, 4.6vw, 58px);\n      line-height: .96;\n      letter-spacing: -.035em;\n      font-weight: 900;\n      color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-subtitle {\n      margin-top: 8px;\n      font-size: clamp(18px, 2vw, 22px);\n      font-weight: 700;\n      color: #000;\n    }\n\n    #promise-tracker-embed .pt-lede {\n      margin-top: 18px;\n      max-width: 56ch;\n      font-size: 15.5px;\n      line-height: 1.5;\n    }\n\n    /* ---------- timeline ---------- */\n    #promise-tracker-embed .pt-timeline { position: relative; margin-top: 14px; }\n\n    #promise-tracker-embed .pt-tl-track {\n      position: relative;\n      height: 8px;\n      margin-top: 40px;\n      border-radius: 0;\n      background: #fff;\n    }\n\n    #promise-tracker-embed .pt-tl-fill {\n      position: absolute;\n      left: 0; top: 0; bottom: 0;\n      width: var(--pt-today-pos, 0%);\n      border-radius: 0;\n      background: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-tl-mid {\n      position: absolute;\n      top: 50%;\n      left: var(--pt-mid-pos, 50%);\n      width: 2px;\n      height: 12px;\n      transform: translate(-50%, -50%);\n      border-radius: 0;\n      background: rgba(23, 23, 28, .22);\n    }\n\n    #promise-tracker-embed .pt-tl-dot {\n      position: absolute;\n      top: 50%;\n      left: var(--pt-today-pos, 0%);\n      width: 12px; height: 12px;\n      transform: translate(-50%, -50%);\n      border-radius: 50%;\n      background: #fff;\n      box-shadow: 0 0 0 1px rgba(23, 23, 28, .05), 0 1px 3px rgba(23, 23, 28, .12);\n    }\n\n    #promise-tracker-embed .pt-tl-today {\n      position: absolute;\n      bottom: 15px;\n      left: clamp(26px, var(--pt-today-pos, 0%), calc(100% - 26px));\n      transform: translateX(-50%);\n      padding: 2px 8px;\n      border-radius: 0;\n      background: var(--pt-red);\n      color: #fff;\n      font-size: 10.5px;\n      font-weight: 700;\n      line-height: 1.4;\n      white-space: nowrap;\n    }\n\n    #promise-tracker-embed .pt-tl-labels {\n      position: relative;\n      display: flex;\n      justify-content: space-between;\n      min-height: 18px;\n      margin-top: 14px;\n      font-size: 12.5px;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-tl-label-mid {\n      position: absolute;\n      left: var(--pt-mid-pos, 50%);\n      transform: translateX(-50%);\n      white-space: nowrap;\n    }\n\n    /* ---------- status overview ---------- */\n    #promise-tracker-embed .pt-status {\n      padding: 22px 24px 18px;\n      border-radius: 0;\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n    }\n\n    #promise-tracker-embed .pt-status-head {\n      display: flex;\n      align-items: baseline;\n      justify-content: space-between;\n      gap: 12px;\n    }\n\n    #promise-tracker-embed .pt-status-title {\n      font-size: 16px;\n      font-weight: 600;\n      line-height: 1.3;\n    }\n\n    #promise-tracker-embed .pt-assessment-date {\n      flex: none;\n      font-size: 12.5px;\n      color: var(--pt-muted);\n      text-align: right;\n      white-space: nowrap;\n    }\n\n    #promise-tracker-embed .pt-status-bars { display: flex; flex-direction: column; margin: 12px -10px 0; }\n\n    #promise-tracker-embed .pt-status-row {\n      --pt-status-color: var(--pt-red);\n      display: grid;\n      grid-template-columns: 24px 118px minmax(0, 1fr) 30px;\n      align-items: center;\n      gap: 12px;\n      width: 100%;\n      padding: 8px 10px;\n      border-radius: 0;\n      font-size: 14.5px;\n      transition: opacity .2s var(--pt-ease), background-color .2s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-status-row:hover { background: var(--pt-field); }\n    #promise-tracker-embed .pt-status-row.pt-status-active { background: var(--pt-tint); }\n    #promise-tracker-embed .pt-status-bars.pt-has-active .pt-status-row:not(.pt-status-active) { opacity: .45; }\n\n    #promise-tracker-embed .pt-status-icon { --sym: 24px; display: grid; place-items: center; }\n    #promise-tracker-embed .pt-status-name { font-weight: 600; }\n    #promise-tracker-embed .pt-status-track { height: 10px; border-radius: 0; background: var(--pt-tint); overflow: hidden; }\n    #promise-tracker-embed .pt-status-fill { display: block; height: 100%; width: var(--w, 0%); min-width: 6px; border-radius: 0; background: var(--pt-status-color); }\n    #promise-tracker-embed .pt-status-count { text-align: right; font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; }\n    #promise-tracker-embed .pt-status-row[data-zero=\"true\"] .pt-status-count { color: #b2b2ba; font-weight: 600; }\n\n    /* ---------- update note ---------- */\n    #promise-tracker-embed .pt-meta {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n      gap: 12px 24px;\n      padding: 0 4px;\n    }\n\n    #promise-tracker-embed .pt-meta-item {\n      margin: 0;\n      font-size: 11.5px;\n      line-height: 1.4;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-meta-item strong {\n      display: block;\n      margin-top: 2px;\n      font-size: 12.5px;\n      font-weight: 700;\n      color: var(--pt-ink);\n    }\n\n    #promise-tracker-embed .pt-meta-note { grid-column: 1 / -1; }\n\n    #promise-tracker-embed .pt-meta-link {\n      color: var(--pt-red);\n      font-weight: 700;\n      text-decoration: underline;\n      text-underline-offset: 3px;\n      white-space: nowrap;\n    }\n\n    /* ---------- status icon ---------- */\n    #promise-tracker-embed .pt-sym {\n      position: relative;\n      display: inline-block;\n      flex: none;\n      width: var(--sym, 20px);\n      height: var(--sym, 20px);\n    }\n\n    #promise-tracker-embed .pt-sym-fallback {\n      position: absolute;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      border-radius: 50%;\n      background: var(--pt-status-color, var(--pt-red));\n      color: #fff;\n      font-size: calc(var(--sym, 20px) * .56);\n      font-weight: 800;\n      line-height: 1;\n    }\n\n    #promise-tracker-embed .pt-sym-img {\n      position: absolute;\n      inset: 0;\n      width: 100%;\n      height: 100%;\n      object-fit: contain;\n      display: block;\n    }\n\n    /* ---------- ministers: orbit ---------- */\n    #promise-tracker-embed .pt-ministers-body.pt-orbit-mode {\n      position: relative;\n      width: 100%;\n      max-width: 620px;\n      margin: 0 auto;\n      aspect-ratio: 1 / 1;\n    }\n\n    #promise-tracker-embed .pt-orbit-center {\n      position: absolute;\n      left: 50%;\n      /* the circles sit 25px above the middle of their boxes, so the text is lifted by the same amount */\n      top: calc(50% - 25px);\n      width: min(40%, 250px);\n      transform: translate(-50%, -50%);\n      text-align: center;\n      z-index: 3;\n      pointer-events: none;\n    }\n\n    #promise-tracker-embed .pt-orbit-center.pt-home { top: calc(50% - 6px); }\n\n    #promise-tracker-embed .pt-orbit-center-title {\n      font-size: clamp(25px, 2.9vw, 36px);\n      line-height: 1;\n      font-weight: 900;\n      letter-spacing: -.03em;\n      white-space: pre-line;\n    }\n\n    #promise-tracker-embed .pt-orbit-center.pt-detail .pt-orbit-center-title {\n      font-size: clamp(20px, 2.1vw, 26px);\n      line-height: 1.04;\n      margin-bottom: 8px;\n    }\n\n    #promise-tracker-embed .pt-orbit-center-meta {\n      display: inline-flex;\n      flex-wrap: wrap;\n      justify-content: center;\n      gap: 2px 8px;\n      margin-bottom: 8px;\n      font-size: 13px;\n      font-weight: 700;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-orbit-center-party { color: var(--party-ink, var(--pt-red)); }\n\n    #promise-tracker-embed .pt-orbit-center-subtitle {\n      max-width: 92%;\n      margin: 0 auto;\n      font-size: 14px;\n      line-height: 1.3;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-orbit-item {\n      --x: 0px; --y: 0px; --size: 116px;\n      position: absolute;\n      left: 50%; top: 50%;\n      width: calc(var(--size) + 112px);\n      height: calc(var(--size) + 50px);\n      margin-left: calc((var(--size) + 112px) / -2);\n      margin-top: calc((var(--size) + 50px) / -2);\n      transform: translate(var(--x), var(--y)) scale(1);\n      transition: transform 420ms var(--pt-ease), opacity 250ms ease;\n      z-index: 2;\n    }\n\n    #promise-tracker-embed .pt-orbit-item button { display: block; width: 100%; text-align: center; }\n\n    #promise-tracker-embed .pt-orbit-circle {\n      display: block;\n      position: relative;\n      width: var(--size);\n      height: var(--size);\n      margin: 0 auto;\n      border-radius: 50%;\n      transition: box-shadow .25s var(--pt-ease), transform .25s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-orbit-circle::before,\n    #promise-tracker-embed .pt-strip-photo::before {\n      content: \"\";\n      position: absolute;\n      inset: 1px;\n      border-radius: 50%;\n      background: #ffe9ee;\n    }\n\n    #promise-tracker-embed .pt-orbit-circle img {\n      position: relative;\n      display: block;\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n      border-radius: 50%;\n      filter: grayscale(100%) contrast(1.04);\n    }\n\n    #promise-tracker-embed .pt-orbit-btn:hover .pt-orbit-circle { transform: translateY(-2px); }\n\n    #promise-tracker-embed .pt-orbit-label { display: block; width: 100%; height: 36px; margin-top: -26px; overflow: visible; transition: opacity .2s ease; }\n    #promise-tracker-embed .pt-orbit-label text { font-size: 12.5px; letter-spacing: .005em; }\n    #promise-tracker-embed .pt-orbit-label-name { fill: var(--pt-ink); font-weight: 600; }\n    #promise-tracker-embed .pt-orbit-label-party { fill: var(--party-ink, var(--pt-red)); font-weight: 500; }\n\n    #promise-tracker-embed .pt-orbit-item.pt-active { z-index: 4; transform: translate(var(--x), var(--y)) scale(1.24); }\n    #promise-tracker-embed .pt-orbit-item.pt-inactive { z-index: 1; opacity: .8; transform: translate(var(--x), var(--y)) scale(.56); }\n    #promise-tracker-embed .pt-orbit-item.pt-active .pt-orbit-label,\n    #promise-tracker-embed .pt-orbit-item.pt-inactive .pt-orbit-label { opacity: 0; pointer-events: none; }\n    #promise-tracker-embed .pt-orbit-item button:focus-visible .pt-orbit-circle { outline: 3px solid var(--pt-red); outline-offset: 5px; }\n\n    /* ---------- ministers: strip (narrow screens) ---------- */\n    #promise-tracker-embed .pt-strip {\n      display: flex;\n      justify-content: space-between;\n      gap: 14px;\n      overflow-x: auto;\n      padding: 8px 6px 12px;\n      margin: 0 -6px;\n      scroll-snap-type: x proximity;\n      scrollbar-width: none;\n    }\n    #promise-tracker-embed .pt-strip::-webkit-scrollbar { display: none; }\n\n    #promise-tracker-embed .pt-strip-item {\n      flex: 0 0 auto;\n      width: 96px;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 8px;\n      text-align: center;\n      scroll-snap-align: start;\n      transition: opacity .25s var(--pt-ease);\n    }\n\n    #promise-tracker-embed .pt-strip-photo { position: relative; width: 88px; height: 88px; border-radius: 50%; transition: box-shadow .25s var(--pt-ease); }\n    #promise-tracker-embed .pt-strip-photo img { position: relative; display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; filter: grayscale(100%) contrast(1.04); }\n    #promise-tracker-embed .pt-strip-item.pt-inactive { opacity: .4; }\n    #promise-tracker-embed .pt-strip-name { font-size: 13.5px; font-weight: 600; line-height: 1.15; }\n    #promise-tracker-embed .pt-strip-party { font-size: 12px; font-weight: 500; color: var(--party-ink); line-height: 1; margin-top: -3px; }\n    #promise-tracker-embed .pt-strip-caption { margin-top: 10px; font-size: 15px; color: var(--pt-muted); line-height: 1.4; min-height: 22px; }\n    #promise-tracker-embed .pt-strip-caption strong { color: var(--pt-ink); font-weight: 800; }\n\n    /* ---------- filters ---------- */\n    #promise-tracker-embed .pt-filters {\n      display: flex;\n      flex-wrap: wrap;\n      align-items: center;\n      gap: 12px;\n      padding: 14px;\n      border-radius: 0;\n      background: var(--pt-tint);\n      box-shadow: var(--pt-shadow);\n    }\n\n    #promise-tracker-embed .pt-search { position: relative; display: block; flex: 1 1 220px; min-width: 0; }\n    #promise-tracker-embed .pt-search svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--pt-muted); pointer-events: none; }\n\n    #promise-tracker-embed .pt-search input {\n      width: 100%;\n      height: 46px;\n      padding: 0 16px 0 44px;\n      border-radius: 0;\n      border: 1.5px solid transparent;\n      background: #fff;\n      font-size: 15px;\n      appearance: none;\n      -webkit-appearance: none;\n    }\n    #promise-tracker-embed .pt-search input::placeholder { color: #9a9aa4; }\n\n    #promise-tracker-embed .pt-selects { display: flex; flex-wrap: wrap; gap: 10px; flex: 3 1 560px; }\n    #promise-tracker-embed .pt-select { position: relative; flex: 1 1 150px; min-width: 0; display: block; }\n\n    #promise-tracker-embed .pt-select select {\n      width: 100%;\n      height: 46px;\n      padding: 0 38px 0 18px;\n      border-radius: 0;\n      border: 1.5px solid transparent;\n      background: #fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 20 20'%3E%3Cpath d='M4.5 7.5 10 13l5.5-5.5' fill='none' stroke='%2317171c' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 16px center;\n      font-size: 14.5px;\n      font-weight: 600;\n      appearance: none;\n      -webkit-appearance: none;\n      cursor: pointer;\n      text-overflow: ellipsis;\n    }\n\n    #promise-tracker-embed .pt-select.pt-filter-active select { border-color: var(--pt-red); }\n\n    #promise-tracker-embed .pt-clear { padding: 10px 14px; border-radius: 0; font-size: 14px; font-weight: 700; color: var(--pt-red); }\n    #promise-tracker-embed .pt-clear:hover { background: rgba(255, 0, 51, .08); }\n\n    /* ---------- results ---------- */\n    #promise-tracker-embed .pt-results-count { margin-bottom: 16px; font-size: 14px; color: var(--pt-muted); }\n\n    #promise-tracker-embed .pt-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }\n\n    #promise-tracker-embed .pt-empty,\n    #promise-tracker-embed .pt-loading,\n    #promise-tracker-embed .pt-error {\n      grid-column: 1 / -1;\n      padding: 48px 20px;\n      text-align: center;\n      color: var(--pt-muted);\n      font-size: 16px;\n    }\n    #promise-tracker-embed .pt-error { color: var(--pt-red); }\n\n    /* ---------- cards ---------- */\n    #promise-tracker-embed .pt-card {\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      border-radius: 0;\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n      --pt-status-color: var(--pt-red);\n      --pt-status-bg: #fde5ea;\n      --pt-title-color: var(--pt-red);\n    }\n\n    #promise-tracker-embed .pt-card:focus-within { outline: 1.5px solid var(--pt-red); outline-offset: 0; }\n\n    #promise-tracker-embed .pt-card-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--pt-status-bg); }\n\n    #promise-tracker-embed .pt-card-fallback {\n      position: absolute;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      font-size: 54px;\n      line-height: 1;\n    }\n\n    #promise-tracker-embed .pt-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s var(--pt-ease); }\n\n    #promise-tracker-embed .pt-chip {\n      position: absolute;\n      top: 14px; right: 14px;\n      z-index: 2;\n      display: inline-flex;\n      align-items: center;\n      gap: 7px;\n      padding: 5px 12px 5px 6px;\n      border-radius: 0;\n      background: rgba(255, 255, 255, .97);\n      box-shadow: 0 1px 4px rgba(23, 23, 28, .16);\n      font-size: 13px;\n      font-weight: 700;\n      line-height: 1.2;\n      white-space: nowrap;\n      --sym: 20px;\n    }\n\n    #promise-tracker-embed .pt-card-body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 20px 22px 18px; }\n\n    #promise-tracker-embed .pt-card-title {\n      font-size: 21px;\n      line-height: 1.18;\n      font-weight: 800;\n      letter-spacing: -.012em;\n      color: var(--pt-title-color);\n      text-wrap: balance;\n    }\n\n    #promise-tracker-embed .pt-card-link::after { content: \"\"; position: absolute; inset: 0; z-index: 3; }\n    #promise-tracker-embed .pt-card-link:focus-visible { outline: none; }\n\n    #promise-tracker-embed .pt-card-summary {\n      display: -webkit-box;\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 3;\n      line-clamp: 3;\n      overflow: hidden;\n      font-size: 15px;\n      line-height: 1.55;\n      color: var(--pt-muted);\n    }\n\n    #promise-tracker-embed .pt-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 14px; }\n    #promise-tracker-embed .pt-card-who { display: flex; align-items: center; gap: 9px; min-width: 0; font-size: 13.5px; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-card-names { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; line-height: 1.3; }\n    #promise-tracker-embed .pt-card-avatars { display: flex; flex: none; }\n    #promise-tracker-embed .pt-card-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; background: #E5E5E5; filter: grayscale(100%); flex: none; }\n    #promise-tracker-embed .pt-card-avatars .pt-card-avatar { box-shadow: 0 0 0 2px #fff; }\n    #promise-tracker-embed .pt-card-avatars .pt-card-avatar + .pt-card-avatar { margin-left: -9px; }\n\n    #promise-tracker-embed .pt-card-go { display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--pt-field); transition: background-color .25s var(--pt-ease), color .25s var(--pt-ease); }\n    #promise-tracker-embed .pt-card-go svg { width: 16px; height: 16px; }\n\n    #promise-tracker-embed .pt-card.pt-static .pt-card-go { visibility: hidden; }\n\n    @media (hover: hover) {\n      #promise-tracker-embed .pt-card:hover .pt-card-img { transform: scale(1.05); }\n      #promise-tracker-embed .pt-card:hover .pt-card-go { background: var(--pt-red); color: #fff; }\n    }\n\n    /* ---------- pagination ---------- */\n    #promise-tracker-embed .pt-pager-wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; }\n    #promise-tracker-embed .pt-pager { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }\n    #promise-tracker-embed .pt-pager button {\n      display: grid;\n      place-items: center;\n      position: relative;\n      z-index: 2;\n      width: 44px;\n      height: 44px;\n      min-width: 44px;\n      min-height: 44px;\n      padding: 0;\n      border-radius: 50%;\n      border: 1.5px solid var(--pt-line);\n      background: #fff;\n      line-height: 1;\n      touch-action: manipulation;\n      -webkit-tap-highlight-color: transparent;\n      transition: border-color .2s, background-color .2s, color .2s;\n    }\n    #promise-tracker-embed .pt-pager button:hover:not(:disabled) { border-color: var(--pt-ink); }\n    #promise-tracker-embed .pt-pager button:disabled { opacity: .35; cursor: default; }\n    #promise-tracker-embed .pt-pager svg { width: 16px; height: 16px; }\n    #promise-tracker-embed .pt-pager .pt-prev svg { transform: scaleX(-1); }\n    #promise-tracker-embed .pt-showall { padding: 10px 18px; border-radius: 0; border: 1.5px solid var(--pt-line); background: #fff; font-size: 14px; font-weight: 700; }\n    #promise-tracker-embed .pt-showall:hover { border-color: var(--pt-ink); }\n\n    /* ---------- methodology ---------- */\n    #promise-tracker-embed .pt-method {\n      margin-top: 56px;\n      padding: 28px 30px;\n      border-radius: 0;\n      background: #fff;\n      box-shadow: var(--pt-shadow);\n    }\n    #promise-tracker-embed .pt-method-title { margin-bottom: 14px; font-size: 22px; font-weight: 800; }\n    #promise-tracker-embed .pt-method-text { color: var(--pt-muted); text-wrap: pretty; }\n    #promise-tracker-embed .pt-method-text p { font-size: 13.5px; line-height: 1.6; }\n    #promise-tracker-embed .pt-method-text p + p { margin-top: 10px; }\n\n    /* ---------- one-time load animation ---------- */\n    @keyframes pt-grow { from { width: 0; } }\n    #promise-tracker-embed.pt-anim .pt-status-fill { animation: pt-grow .9s var(--pt-ease) both; }\n\n\n    /* ---------- timeline: top row with the milestones ---------- */\n    #promise-tracker-embed .pt-tl-ends { position: relative; display: flex; justify-content: space-between; height: 18px; margin-top: 14px; font-size: 12.5px; font-weight: 700; color: var(--pt-ink); }\n    #promise-tracker-embed .pt-tl-top-mid { position: absolute; left: var(--pt-mid-pos, 50%); transform: translateX(-50%); white-space: nowrap; }\n    #promise-tracker-embed .pt-tl-track { margin-top: 40px; }\n    #promise-tracker-embed .pt-tl-labels { margin-top: 4px; }\n\n    /* ---------- editorial approach ---------- */\n    #promise-tracker-embed .pt-redactie { margin-top: 48px; max-width: 50%; scroll-margin-top: 24px; }\n    @media (max-width: 900px) { #promise-tracker-embed .pt-redactie { max-width: none; } }\n    #promise-tracker-embed .pt-redactie-title { font-size: 16px; font-weight: 600; line-height: 1.3; margin-bottom: 8px; }\n    #promise-tracker-embed .pt-redactie p { font-size: 15.5px; line-height: 1.5; }\n    #promise-tracker-embed .pt-redactie p + p { margin-top: 10px; }\n    #promise-tracker-embed .pt-redactie .pt-meta-link { white-space: normal; }\n\n\n    /* thin grey ticks at the start and the end of the timeline, as tall as the halfway tick */\n    #promise-tracker-embed .pt-tl-track::before,\n    #promise-tracker-embed .pt-tl-track::after { content: \"\"; position: absolute; top: 50%; width: 2px; height: 12px; transform: translateY(-50%); background: rgba(23, 23, 28, .22); }\n    #promise-tracker-embed .pt-tl-track::before { left: 0; }\n    #promise-tracker-embed .pt-tl-track::after { right: 0; }\n\n    /* results bar: the count, and (phone only) the button that opens the filters */\n    #promise-tracker-embed .pt-results-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }\n    #promise-tracker-embed .pt-results-bar .pt-results-count { margin-bottom: 0; }\n    #promise-tracker-embed .pt-filter-toggle { display: none; padding: 8px 16px; border: 1.5px solid var(--pt-line); background: #fff; font-size: 14px; font-weight: 700; line-height: 1.2; }\n    #promise-tracker-embed .pt-filter-toggle.pt-has-filters { border-color: var(--pt-red); color: var(--pt-red); }\n\n\n    /* phone: a bigger circle without the curved names; the name shows in the middle after a tap */\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-label { display: none; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-item { width: var(--size); height: var(--size); margin-left: calc(var(--size) / -2); margin-top: calc(var(--size) / -2); }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center { top: 50%; width: 48%; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center.pt-home { top: 50%; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center-title { font-size: 20px; font-weight: 600; letter-spacing: -.02em; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center.pt-detail .pt-orbit-center-title { font-size: 16px; font-weight: 600; line-height: 1.1; margin-bottom: 4px; overflow-wrap: anywhere; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center-meta { margin-bottom: 4px; font-size: 11.5px; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-center-subtitle { max-width: 100%; font-size: 11.5px; line-height: 1.25; overflow-wrap: break-word; hyphens: none; }\n    #promise-tracker-embed .pt-orbit-compact .pt-orbit-item.pt-active { transform: translate(var(--x), var(--y)) scale(1.1); }\n\n\n    /* phone: one swipeable row of cards per status */\n    #promise-tracker-embed .pt-cards.pt-cards-rows { display: block; }\n    #promise-tracker-embed .pt-row + .pt-row { margin-top: 30px; }\n    #promise-tracker-embed .pt-row { scroll-margin-top: 16px; }\n    #promise-tracker-embed .pt-row-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }\n    #promise-tracker-embed .pt-row-title { display: inline-flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; line-height: 1.2; --sym: 24px; }\n    #promise-tracker-embed .pt-row-count { font-size: 14px; font-weight: 700; color: var(--pt-muted); font-variant-numeric: tabular-nums; }\n    #promise-tracker-embed .pt-row-track { display: flex; gap: 14px; margin: 0 -16px; padding: 4px 16px 14px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-left: 16px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }\n    #promise-tracker-embed .pt-row-track::-webkit-scrollbar { display: none; }\n    #promise-tracker-embed .pt-row-track .pt-card { flex: 0 0 78%; max-width: 320px; scroll-snap-align: start; }\n    #promise-tracker-embed .pt-row-track .pt-chip { display: none; }\n\n\n\n    #promise-tracker-embed .pt-orbit-center.pt-detail .pt-orbit-center-title { font-weight: 700; }\n    /* timeline: one column per milestone (name above, date below) */\n    #promise-tracker-embed .pt-tl-ends { position: relative; display: flex; justify-content: space-between; height: auto; margin-top: 14px; font-size: 12.5px; font-weight: 400; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-tl-end { display: flex; flex-direction: column; gap: 4px; line-height: 1.25; }\n    #promise-tracker-embed .pt-tl-end b { font-weight: 700; color: var(--pt-ink); }\n    #promise-tracker-embed .pt-tl-end i { font-style: normal; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-tl-end-mid { position: absolute; left: var(--pt-mid-pos, 50%); top: 0; transform: translateX(-50%); align-items: center; white-space: nowrap; }\n    #promise-tracker-embed .pt-tl-end-right { align-items: flex-end; text-align: right; }\n    #promise-tracker-embed .pt-tl-end:not(.pt-tl-end-mid) { min-width: 0; }\n    @media (min-width: 641px) { #promise-tracker-embed .pt-timeline { margin-top: -12px; } }\n\n    /* ---------- responsive ---------- */\n    @media (max-width: 1100px) {\n      #promise-tracker-embed .pt-layout {\n        grid-template-columns: minmax(0, 1fr);\n        grid-template-areas: \"panel\" \"ministers\" \"filters\" \"results\";\n      }\n      #promise-tracker-embed .pt-ministers-body.pt-orbit-mode { max-width: 520px; }\n    }\n\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-app { --pt-top-space: 36px; padding: var(--pt-top-space) 16px 36px; }\n      #promise-tracker-embed .pt-meta { grid-template-columns: 1fr; }\n      #promise-tracker-embed .pt-status-title-long { display: none; }\n      #promise-tracker-embed .pt-ministers { overflow-x: clip; }\n      #promise-tracker-embed .pt-filter-toggle { display: inline-block; }\n      #promise-tracker-embed .pt-filters { display: none; }\n      #promise-tracker-embed.pt-filters-open .pt-filters { display: flex; }\n      #promise-tracker-embed .pt-layout { grid-template-areas: \"ministers\" \"panel\" \"filters\" \"results\"; row-gap: 28px; }\n\n      /* phone: more air in the intro, status card first, the timeline after it */\n      #promise-tracker-embed .pt-panel { gap: 30px; }\n      #promise-tracker-embed .pt-intro { order: 1; }\n      #promise-tracker-embed .pt-status { order: 2; }\n      #promise-tracker-embed .pt-meta { order: 3; margin-top: -12px; }\n      #promise-tracker-embed .pt-timeline { order: 4; margin-top: 4px; }\n      #promise-tracker-embed .pt-subtitle { margin-top: 12px; font-size: 18px; font-weight: 600; line-height: 1.3; }\n      #promise-tracker-embed .pt-lede { margin-top: 20px; line-height: 1.6; }\n      #promise-tracker-embed .pt-tl-track { margin-top: 52px; }\n      #promise-tracker-embed .pt-tl-today { bottom: 17px; }\n      #promise-tracker-embed .pt-tl-ends { margin-top: 18px; font-size: 12px; }\n      #promise-tracker-embed .pt-tl-end { gap: 5px; }\n\n      #promise-tracker-embed .pt-redactie { margin-top: 36px; }\n      #promise-tracker-embed .pt-redactie p { font-size: 15px; }\n      #promise-tracker-embed .pt-status-row { grid-template-columns: 24px minmax(0, 1fr) auto; gap: 6px 12px; }\n      #promise-tracker-embed .pt-status-track { grid-column: 2 / -1; grid-row: 2; }\n      #promise-tracker-embed .pt-cards { grid-template-columns: minmax(0, 1fr); }\n      #promise-tracker-embed .pt-pager-wrap { flex-wrap: wrap; }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      #promise-tracker-embed *,\n    #promise-tracker-embed *::before,\n    #promise-tracker-embed *::after { animation: none !important; transition: none !important; }\n    }\n";
  style.textContent += "\n    #promise-tracker-embed .pt-tl-dot { display: none; }\n";
style.textContent += "\n    /* status tags on the cards: black text, coloured symbol, a soft glow in the status colour */\n    #promise-tracker-embed .pt-chip { color: #17171c; }\n";
style.textContent += "\n    #promise-tracker-embed .pt-arch, #promise-tracker-embed .pt-seg { display: none; }\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-ministers, #promise-tracker-embed .pt-intro .pt-title, #promise-tracker-embed .pt-lede-more { display: none; }\n      #promise-tracker-embed .pt-arch { display: block; grid-area: ministers; margin-top: -8px; }\n      #promise-tracker-embed .pt-layout { row-gap: 22px; }\n      #promise-tracker-embed .pt-panel { gap: 22px; }\n      #promise-tracker-embed .pt-intro { order: 1; }\n      #promise-tracker-embed .pt-lede { margin-top: 10px; font-size: 15px; line-height: 1.5; }\n      #promise-tracker-embed .pt-intro .pt-subtitle { margin-top: 0; font-size: 18px; font-weight: 600; line-height: 1.3; }\n      #promise-tracker-embed .pt-seg { display: flex; gap: 3px; height: 12px; order: 2; margin-top: -6px; }\n      #promise-tracker-embed .pt-seg i { display: block; height: 100%; background: var(--c); min-width: 3px; transform-origin: left; animation: pt-seg-in .8s var(--pt-ease) both; animation-delay: calc(var(--n) * 90ms + 900ms); }\n      #promise-tracker-embed .pt-status { order: 3; }\n      #promise-tracker-embed .pt-meta { order: 4; }\n      #promise-tracker-embed .pt-timeline { order: 5; }\n      #promise-tracker-embed .pt-arch-stage { position: relative; width: 100%; }\n      #promise-tracker-embed .pt-arch-c { position: absolute; padding: 0; border: 0; border-radius: 50%; background: #ffe9ee; -webkit-tap-highlight-color: transparent; transition: transform .45s cubic-bezier(.34,1.56,.64,1); }\n      #promise-tracker-embed .pt-arch-fill { position: absolute; inset: 0; border-radius: 50%; background: var(--pc); transform: scale(0); transition: transform .5s var(--pt-ease); }\n      #promise-tracker-embed .pt-arch-ph { position: absolute; inset: 1px; border-radius: 50%; overflow: hidden; }\n      #promise-tracker-embed .pt-arch-ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(1.04); border-radius: 50%; }\n      #promise-tracker-embed .pt-arch-ph i { position: absolute; inset: 0; display: grid; place-items: center; font-style: normal; font-weight: 800; font-size: 12px; color: rgba(23,23,28,.45); }\n      #promise-tracker-embed .pt-arch-c.on { z-index: 5; transform: scale(1.14); }\n      #promise-tracker-embed .pt-arch-c.on .pt-arch-fill { transform: scale(1.02); }\n      #promise-tracker-embed .pt-arch-mid { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; pointer-events: none; }\n      #promise-tracker-embed .pt-arch-ttl { font-size: var(--fs, 24px); line-height: .96; letter-spacing: -.035em; font-weight: 900; color: var(--pt-red); white-space: nowrap; }\n      #promise-tracker-embed .pt-arch-q { margin: 8px auto 0; font-size: var(--fq, 14px); line-height: 1.25; font-weight: 600; }\n      #promise-tracker-embed .pt-arch-info { min-height: 44px; margin-top: 8px; text-align: center; font-size: 12.5px; color: var(--pt-muted); }\n      #promise-tracker-embed .pt-arch-info b { display: block; color: var(--pt-ink); font-weight: 600; font-size: 13.5px; }\n      #promise-tracker-embed .pt-arch-info span { display: block; }\n    }\n    @keyframes pt-arch-spring { from { opacity: 0; transform: translateY(30px) scale(.3); } to { opacity: 1; transform: none; } }\n    @keyframes pt-arch-fade { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }\n    @keyframes pt-seg-in { from { transform: scaleX(0); } to { transform: none; } }\n    #promise-tracker-embed .pt-arch-go .pt-arch-c { animation: pt-arch-spring .7s cubic-bezier(.34,1.56,.64,1) both; animation-delay: calc(var(--i) * 90ms + 100ms); }\n    #promise-tracker-embed .pt-arch-go .pt-arch-mid { animation: pt-arch-fade .7s ease both; animation-delay: 900ms; }\n";
style.textContent += "\n    /* ===== desktop: text + timeline + ministers on the left, plinko + progress card on the right ===== */\n    #promise-tracker-embed .pt-layout { grid-template-columns: minmax(0, 1fr); grid-template-areas: \"panel\" \"filters\" \"results\"; }\n    #promise-tracker-embed .pt-panel { grid-area: panel; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: clamp(32px, 5vw, 72px); align-items: start; align-self: stretch; gap: 0; column-gap: clamp(32px, 5vw, 72px); }\n    #promise-tracker-embed .pt-col { display: flex; flex-direction: column; gap: 30px; min-width: 0; }\n    #promise-tracker-embed .pt-ministers { grid-area: auto; align-self: auto; }\n    #promise-tracker-embed .pt-ministers-body { max-width: none; width: 100%; }\n    #promise-tracker-embed .pt-ministers .pt-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px 14px; overflow: visible; padding: 0; margin: 0; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item { width: auto; min-width: 0; }\n    #promise-tracker-embed .pt-ministers .pt-strip-photo { width: 100%; max-width: 104px; height: auto; aspect-ratio: 1; }\n    #promise-tracker-embed .pt-ministers .pt-strip-photo::before { transition: background .3s var(--pt-ease); }\n    #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo::before { background: var(--party-color); }\n    #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo { transform: scale(1.06); transition: transform .35s cubic-bezier(.34,1.56,.64,1); }\n    #promise-tracker-embed .pt-ministers .pt-strip-caption { margin-top: 18px; }\n    #promise-tracker-embed .pt-plinko { position: relative; background: #fff; padding: 14px 10px 10px; box-shadow: var(--pt-shadow); }\n    #promise-tracker-embed .pt-plinko canvas { display: block; width: 100%; max-width: 420px; margin: 0 auto; }\n    #promise-tracker-embed .pt-plinko-replay { position: absolute; left: 12px; top: 12px; z-index: 2; display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px 6px 9px; background: #f4f0f2; border-radius: 999px; font-size: 12px; font-weight: 700; color: var(--pt-ink); }\n    #promise-tracker-embed .pt-plinko-replay:hover { background: #ebe5e8; }\n    @media (max-width: 900px) {\n      #promise-tracker-embed .pt-panel { grid-template-columns: minmax(0, 1fr); row-gap: 36px; }\n    }\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-layout { grid-template-areas: \"ministers\" \"panel\" \"filters\" \"results\"; }\n      #promise-tracker-embed .pt-panel { display: flex; flex-direction: column; gap: 22px; }\n      #promise-tracker-embed .pt-col { display: contents; }\n      #promise-tracker-embed .pt-plinko { display: none; }\n    }\n";
style.textContent += "\n    #promise-tracker-embed .pt-vcard { background: #fff; box-shadow: var(--pt-shadow); }\n    #promise-tracker-embed .pt-vcard .pt-plinko { box-shadow: none; padding-bottom: 6px; }\n    #promise-tracker-embed .pt-vcard .pt-status { box-shadow: none; border-top: 1px solid #f1e6ea; margin: 0 24px; padding: 20px 0 18px; }\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-vcard { display: contents; }\n      #promise-tracker-embed .pt-vcard .pt-status { box-shadow: var(--pt-shadow); border-top: 0; margin: 0; padding: 22px 24px 18px; }\n    }\n";
style.textContent += "\n    #promise-tracker-embed .pt-status-title-long { display: none; }\n    #promise-tracker-embed .pt-status-group { display: none; }\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-vcard { position: relative; display: flex; flex-direction: column; padding-bottom: 18px; }\n      #promise-tracker-embed .pt-vcard .pt-status { display: contents; }\n      #promise-tracker-embed .pt-vcard .pt-status-head { order: 0; display: block; padding: 22px 24px 0; }\n      #promise-tracker-embed .pt-vcard .pt-assessment-date { display: block; margin-top: 3px; }\n      #promise-tracker-embed .pt-vcard .pt-plinko { order: 1; position: static; padding: 0 14px 4px; }\n      #promise-tracker-embed .pt-vcard .pt-plinko-replay { left: auto; right: 20px; top: 18px; }\n      #promise-tracker-embed .pt-vcard .pt-status-bars { order: 2; margin: 6px 24px 0; padding-top: 4px; border-top: 1px solid #f1e6ea; }\n      #promise-tracker-embed .pt-status-group { display: block; margin: 14px 0 2px; font-size: 11px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: var(--pt-muted); }\n      #promise-tracker-embed .pt-status-group:first-child { margin-top: 10px; }\n      #promise-tracker-embed .pt-ministers .pt-strip { grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; }\n      #promise-tracker-embed .pt-ministers .pt-strip-photo { max-width: 52px; margin: 0 auto; }\n      #promise-tracker-embed .pt-ministers .pt-strip-name, #promise-tracker-embed .pt-ministers .pt-strip-party { display: none; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item { opacity: .5; transition: opacity .25s var(--pt-ease); }\n      #promise-tracker-embed .pt-ministers .pt-strip-item:hover, #promise-tracker-embed .pt-ministers .pt-strip-item:focus-visible, #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active { opacity: 1; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive { opacity: .35; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive:hover { opacity: .9; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item:hover .pt-strip-photo img, #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo img { filter: grayscale(0%) contrast(1.02); }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { margin-top: 14px; font-size: 14px; min-height: 40px; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-vcard .pt-assessment-date { text-align: left; margin: 3px 0 0; }\n      #promise-tracker-embed .pt-vcard .pt-plinko { padding-top: 14px; }\n      #promise-tracker-embed .pt-vcard .pt-status-row { padding-top: 5px; padding-bottom: 5px; }\n      #promise-tracker-embed .pt-status-group { margin: 10px 0 0; }\n    }\n";
style.textContent += "\n    /* ---- v8 ---- */\n    #promise-tracker-embed .pt-plinko-replay { width: 38px; height: 38px; padding: 0; justify-content: center; border-radius: 50%; }\n    #promise-tracker-embed .pt-vcard .pt-status-bars { border-top: 0; margin-top: 0; padding-top: 0; }\n    #promise-tracker-embed .pt-vcard .pt-status-title { font-size: 26px; line-height: 1.1; }\n    #promise-tracker-embed .pt-vcard .pt-assessment-date { font-size: 15px; margin-top: 5px; }\n    #promise-tracker-embed .pt-status-group { display: flex; justify-content: space-between; padding-right: 10px; }\n    #promise-tracker-embed .pt-status-group-n { font-size: 13px; letter-spacing: 0; color: var(--pt-ink); }\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-col-left .pt-ministers { order: 1; }\n      #promise-tracker-embed .pt-col-left .pt-timeline { order: 2; }\n      #promise-tracker-embed .pt-ministers .pt-strip { display: flex; gap: 0; padding: 6px 0 0; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item { flex: 1 1 0; width: auto; min-width: 0; opacity: 1; position: relative; z-index: 1; margin-left: -10px; transition: transform .3s cubic-bezier(.34,1.56,.64,1); }\n      #promise-tracker-embed .pt-ministers .pt-strip-item:first-child { margin-left: 0; }\n      #promise-tracker-embed .pt-ministers .pt-strip-photo { width: 100%; max-width: none; height: auto; aspect-ratio: 1; margin: 0; box-shadow: 0 0 0 3px #fff9fb; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item:hover { z-index: 5; transform: translateY(-4px) scale(1.1); opacity: 1; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active { z-index: 4; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo { box-shadow: 0 0 0 3px #fff9fb, 0 0 0 5px var(--party-color); transform: none; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive { opacity: .6; }\n      #promise-tracker-embed .pt-ministers .pt-strip-photo img { filter: grayscale(100%) contrast(1.04); }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { margin-top: 18px; min-height: 92px; display: flex; flex-direction: column; gap: 4px; }\n      #promise-tracker-embed .pt-mc-name { font-size: 22px; font-weight: 800; line-height: 1.1; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-mc-role { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-mc-role i { font-style: normal; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 999px; }\n      #promise-tracker-embed .pt-mc-resp { font-size: 14px; line-height: 1.4; color: var(--pt-muted); max-width: 46ch; }\n      #promise-tracker-embed .pt-mc-hint { font-size: 14px; color: var(--pt-muted); }\n    }\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-vcard { display: flex; flex-direction: column; position: relative; order: 3; padding-bottom: 14px; }\n      #promise-tracker-embed .pt-vcard .pt-status { display: contents; }\n      #promise-tracker-embed .pt-vcard .pt-status-head { order: 0; display: block; padding: 20px 18px 0; }\n      #promise-tracker-embed .pt-vcard .pt-assessment-date { display: block; text-align: left; }\n      #promise-tracker-embed .pt-vcard .pt-plinko { display: block; order: 1; position: static; padding: 0 6px 2px; box-shadow: none; }\n      #promise-tracker-embed .pt-vcard .pt-plinko-replay { right: 14px; left: auto; top: 14px; }\n      #promise-tracker-embed .pt-vcard .pt-status-bars { order: 2; margin: 0 14px; box-shadow: none; }\n      #promise-tracker-embed .pt-vcard .pt-status { box-shadow: none; padding: 0; margin: 0; border: 0; }\n    }\n";
style.textContent += "\n    #promise-tracker-embed .pt-tl-today { background: transparent; color: var(--pt-red); padding: 2px 0; font-size: 12px; font-weight: 800; }\n";
style.textContent += "\n    #promise-tracker-embed .pt-vcard .pt-plinko canvas { position: relative; z-index: 1; pointer-events: none; }\n    #promise-tracker-embed .pt-vcard .pt-plinko { padding-top: 0; }\n    #promise-tracker-embed .pt-ministers .pt-strip-caption { min-height: 84px; }\n";
style.textContent += "\n    #promise-tracker-embed .pt-status-name { font-weight: 500; }\n    #promise-tracker-embed .pt-status-count { font-size: 14.5px; font-weight: 500; }\n    #promise-tracker-embed .pt-status-row { font-size: 14.5px; }\n    #promise-tracker-embed .pt-status-group { display: flex; justify-content: space-between; margin: 12px 0 0; padding: 0 10px 0 0; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-status-group-n { font-size: 11px; font-weight: 700; color: var(--pt-muted); }\n    #promise-tracker-embed .pt-status-group:first-child { margin-top: 8px; }\n    #promise-tracker-embed .pt-status-row[data-zero=\"true\"] .pt-status-count { color: #b9b1b6; }\n    #promise-tracker-embed .pt-card-media { aspect-ratio: 16 / 9; }\n    #promise-tracker-embed .pt-card-body { padding: 16px 20px 14px; gap: 8px; }\n    #promise-tracker-embed .pt-card-title { font-size: 20px; }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-redactie { max-width: min(760px, 100%); } }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-ministers .pt-strip-caption { min-height: 72px; margin-top: 14px; } }\n";
style.textContent += "\n    /* ---- mobile landing: plinko on top, title box below ---- */\n    #promise-tracker-embed .pt-mtop { display: none; }\n    .pt-plinko-rpt { display: none; }\n    @media (max-width: 640px) {\n      #promise-tracker-embed .pt-arch { display: none; }\n      #promise-tracker-embed .pt-layout { grid-template-areas: \"mtop\" \"panel\" \"filters\" \"results\"; }\n      #promise-tracker-embed .pt-mtop { display: block; grid-area: mtop; margin-top: calc(var(--pt-top-space, 36px) * -1); }\n      #promise-tracker-embed .pt-mhost { margin: 0 -16px; background: #fff; box-shadow: 0 12px 30px -18px rgba(23,23,28,.28); }\n      #promise-tracker-embed .pt-mhost .pt-plinko { display: block; position: relative; background: none; box-shadow: none; padding: 12px 0 14px; }\n      #promise-tracker-embed .pt-mhost .pt-plinko canvas { max-width: 420px; }\n      #promise-tracker-embed .pt-mhost .pt-plinko-replay { left: 12px; top: 12px; right: auto; width: auto; height: auto; padding: 6px 11px 6px 9px; border-radius: 999px; }\n      #promise-tracker-embed .pt-plinko-rpt { display: inline; }\n      #promise-tracker-embed .pt-mtitle { position: relative; z-index: 2; width: min(100% - 32px, 360px); margin: -4px auto 0; padding: 14px 16px 16px; background: #fff; text-align: center; box-shadow: 0 0 0 1px rgba(23,23,28,.05), 0 8px 24px -14px rgba(23,23,28,.25); animation: ptTitleIn .7s cubic-bezier(.2,.8,.2,1) 1.2s both; }\n      #promise-tracker-embed .pt-mtitle .pt-title { display: block; font-size: 40px; line-height: .98; letter-spacing: -.035em; font-weight: 900; color: var(--pt-red); }\n      #promise-tracker-embed .pt-mq { margin: 8px 0 0; font-size: 17px; line-height: 1.25; font-weight: 700; }\n      #promise-tracker-embed .pt-intro .pt-subtitle { display: none; }\n    }\n    @keyframes ptTitleIn { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }\n    @media (prefers-reduced-motion: reduce) { #promise-tracker-embed .pt-mtitle { animation: none; } }\n";
style.textContent += "\n    @media (max-width: 640px) { #promise-tracker-embed .pt-vcard { width: 100%; align-self: stretch; box-sizing: border-box; } #promise-tracker-embed .pt-panel { align-self: stretch; width: 100%; } }\n";
style.textContent += "\n    /* ---- v10 desktop condense ---- */\n    #promise-tracker-embed .pt-status-title { font-family: inherit; font-weight: 800; }\n    #promise-tracker-embed .pt-status-group-n { display: none; }\n    #promise-tracker-embed .pt-status-group { justify-content: flex-start; }\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-strip-photo { box-shadow: none; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo { box-shadow: none; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item:hover .pt-strip-photo::before { background: var(--party-color); }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { position: relative; display: block; margin-top: 14px; min-height: 74px; text-align: center; }\n      #promise-tracker-embed .pt-mc { position: absolute; top: 0; width: 210px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }\n      #promise-tracker-embed .pt-mc-0 { left: 0; transform: none; width: auto; align-items: flex-start; text-align: left; }\n      #promise-tracker-embed .pt-mc-name { font-size: 13.5px; font-weight: 800; line-height: 1.2; }\n      #promise-tracker-embed .pt-mc-role { display: block; font-size: 12px; font-weight: 600; color: var(--pt-muted); }\n      #promise-tracker-embed .pt-mc-role b { font-weight: 800; }\n      #promise-tracker-embed .pt-mc-resp { font-size: 11.5px; line-height: 1.35; color: var(--pt-muted); }\n      #promise-tracker-embed .pt-mc-hint { font-size: 13px; color: var(--pt-muted); }\n    }\n";
style.textContent += "\n    /* ---- v11 left-column variants (classes lv-*) ---- */\n    #promise-tracker-embed .pt-sec-h { display: none; }\n    #promise-tracker-embed .pt-tl-end-mid, #promise-tracker-embed .pt-tl-mid { display: none; }\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-col-left .pt-tlwrap { order: 2; }\n      #promise-tracker-embed.lv-tl .pt-col-left .pt-tlwrap { order: 1; }\n      #promise-tracker-embed.lv-tl .pt-col-left .pt-ministers { order: 2; }\n      #promise-tracker-embed.lv-head .pt-sec-h { display: block; margin: 0 0 14px; font-family: inherit; font-size: 15px; font-weight: 800; letter-spacing: 0; line-height: 1.2; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-tlwrap .pt-timeline { margin-top: 0; }\n      /* stretch: left column as tall as the card */\n      #promise-tracker-embed.lv-stretch .pt-panel { align-items: stretch; }\n      #promise-tracker-embed.lv-stretch .pt-col-right { align-self: start; }\n      #promise-tracker-embed.lv-stretch .pt-col-left { justify-content: space-between; }\n      #promise-tracker-embed.lv-stretch.lv-tl .pt-col-left { justify-content: flex-start; }\n      #promise-tracker-embed.lv-stretch.lv-tl .pt-col-left .pt-ministers { margin-top: auto; }\n      /* type scale */\n      #promise-tracker-embed.lv-type .pt-title { font-size: clamp(54px, 5.6vw, 76px); }\n      #promise-tracker-embed.lv-type .pt-intro .pt-subtitle { margin-top: 12px; font-size: clamp(22px, 2.3vw, 28px); font-weight: 800; line-height: 1.12; }\n      #promise-tracker-embed.lv-type .pt-lede { margin-top: 20px; font-size: 17px; line-height: 1.55; max-width: 54ch; }\n      /* 2 x 4 ministers, names visible */\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px 14px; padding: 0; }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-item { margin-left: 0; flex: none; gap: 8px; }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-photo { width: 100%; max-width: 86px; margin: 0 auto; }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-item:hover { transform: translateY(-3px); }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-name { display: block; font-size: 13px; font-weight: 700; line-height: 1.15; }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-party { display: block; font-size: 12px; font-weight: 600; margin-top: -4px; }\n      #promise-tracker-embed.lv-grid .pt-ministers .pt-strip-caption { min-height: 40px; margin-top: 14px; }\n      #promise-tracker-embed.lv-grid .pt-mc { position: static; transform: none; width: auto; max-width: 46ch; margin: 0 auto; }\n      #promise-tracker-embed.lv-grid .pt-mc-0 { margin: 0; align-items: flex-start; text-align: left; }\n      #promise-tracker-embed.lv-grid .pt-mc-name { display: none; }\n      #promise-tracker-embed.lv-grid .pt-mc-role { font-size: 12px; }\n    }\n";
style.textContent += "\n    /* group labels in the bars: off by default (spacing stays), on with lv-grp */\n    #promise-tracker-embed:not(.lv-grp) .pt-status-group { height: 16px; margin: 0; padding: 0; overflow: hidden; font-size: 0; line-height: 0; }\n    #promise-tracker-embed:not(.lv-grp) .pt-status-group:first-child { height: 6px; }\n";
style.textContent += "\n    /* ---- v12 ---- */\n    #promise-tracker-embed .pt-status-group { display: none !important; }\n    #promise-tracker-embed .pt-tl-mid { display: block; }\n    #promise-tracker-embed .pt-tlwrap .pt-sec-h { display: none !important; }\n    #promise-tracker-embed .pt-card .pt-plinko canvas, #promise-tracker-embed .pt-vcard .pt-plinko canvas, #promise-tracker-embed .pt-mhost .pt-plinko canvas { pointer-events: auto; }\n    #promise-tracker-embed .pt-status-bars[data-hi] .pt-status-row { opacity: .28; }\n    #promise-tracker-embed .pt-status-bars[data-hi=\"0\"] .pt-status-row[data-group=\"0\"],\n    #promise-tracker-embed .pt-status-bars[data-hi=\"1\"] .pt-status-row[data-group=\"1\"],\n    #promise-tracker-embed .pt-status-bars[data-hi=\"2\"] .pt-status-row[data-group=\"2\"] { opacity: 1; }\n    #promise-tracker-embed .pt-status-row { transition: opacity .2s; }\n    @media (min-width: 641px) {\n      #promise-tracker-embed.lv-type .pt-intro .pt-subtitle { font-size: clamp(17px, 1.6vw, 20px); font-weight: 700; margin: 12px 0 0; }\n      #promise-tracker-embed.lv-type .pt-lede { margin-top: 18px; }\n      #promise-tracker-embed .pt-mc { gap: 3px; }\n      #promise-tracker-embed .pt-mc-name { font-size: 13.5px; font-weight: 800; }\n      #promise-tracker-embed .pt-mc-party { font-size: 12px; font-weight: 800; }\n      #promise-tracker-embed .pt-mc-role { font-size: 12px; font-weight: 600; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-mc-resp { margin-top: 2px; }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { min-height: 78px; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-col-right { align-items: flex-end; }\n      #promise-tracker-embed .pt-vcard { width: 100%; max-width: 470px; }\n      #promise-tracker-embed .pt-vcard .pt-status-head { padding: 24px 28px 0; }\n      #promise-tracker-embed .pt-vcard .pt-plinko { padding: 0 24px 2px; }\n      #promise-tracker-embed .pt-vcard .pt-plinko-replay { right: 24px; top: 20px; }\n      #promise-tracker-embed .pt-vcard .pt-status-bars { margin: 4px 28px 0; }\n      #promise-tracker-embed .pt-vcard { padding-bottom: 20px; }\n      #promise-tracker-embed .pt-col-right .pt-meta { align-self: stretch; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-col-right .pt-meta { align-self: flex-end; width: 100%; max-width: 470px; padding: 0; } }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed.lv-stretch .pt-col-left { justify-content: flex-start; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-ministers { margin-top: 14px; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-tlwrap { margin-top: auto; }\n    }\n";
style.textContent += "\n    /* ---- v13 ---- */\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-vcard .pt-status-title { font-size: 19px; }\n      #promise-tracker-embed .pt-vcard .pt-assessment-date { font-size: 13px; margin-top: 3px; }\n      #promise-tracker-embed .pt-vcard .pt-status-bars { margin-top: 16px; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-ministers { margin-top: 64px; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-tlwrap { margin-top: -10px; }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { min-height: 56px; }\n      #promise-tracker-embed .pt-mc { gap: 3px; }\n      #promise-tracker-embed .pt-mc-name { font-size: 13.5px; }\n      #promise-tracker-embed .pt-mc-name b { font-weight: 800; }\n      #promise-tracker-embed .pt-mc-party { font-weight: 600; }\n      #promise-tracker-embed .pt-mc-resp { font-size: 12.5px; line-height: 1.35; color: var(--pt-ink); margin-top: 0; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-tlwrap { margin-top: -28px; }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { min-height: 48px; margin-top: 12px; }\n    }\n";
style.textContent += "\n    /* ---- v14: minister info replaces the heading ---- */\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-sec-h { display: block; min-height: 40px; margin: 0 0 12px; font-family: inherit; font-size: 15px; font-weight: 800; line-height: 1.35; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min { font-size: 14px; font-weight: 400; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min b { font-weight: 800; font-size: 15px; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min span { font-weight: 700; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min .pt-sec-role { font-weight: 400; color: var(--pt-muted); }\n      #promise-tracker-embed .pt-ministers .pt-strip-caption { display: none; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-tlwrap { margin-top: 0; }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-ministers { margin-top: 56px; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-sec-h { min-height: 58px; margin-bottom: 8px; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min { line-height: 1.3; }\n      #promise-tracker-embed .pt-ministers .pt-sec-l1 { display: block; font-size: 16px; font-weight: 800; color: var(--pt-ink); }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min b { font-size: inherit; font-weight: 800; }\n      #promise-tracker-embed .pt-ministers .pt-sec-l1 span { font-weight: 700; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min .pt-sec-role { display: block; margin-top: 2px; font-size: 13px; font-weight: 400; color: var(--pt-muted); }\n      #promise-tracker-embed.lv-stretch .pt-col-left .pt-ministers { margin-top: 44px; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-col-left { padding-top: 14px; } }\n";
style.textContent += "\n    @media (max-width: 640px) { #promise-tracker-embed .pt-tlwrap { order: 5; align-self: stretch; width: 100%; } #promise-tracker-embed .pt-tlwrap .pt-timeline { order: 0; } }\n";
style.textContent += "\n    #promise-tracker-embed .pt-tl-fill { overflow: visible; }\n    #promise-tracker-embed .pt-tl-fill::after { content: \"\"; position: absolute; right: -1px; top: -9px; bottom: -4px; width: 2px; background: var(--pt-red); }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-ministers .pt-sec-h-min .pt-sec-role { font-weight: 300 !important; letter-spacing: 0; } }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-ministers .pt-sec-l1 span { font-weight: 400 !important; } }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-sec-h { min-height: 44px; }\n      #promise-tracker-embed .pt-ministers .pt-sec-h-min .pt-sec-role { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) { #promise-tracker-embed .pt-ministers .pt-sec-h:not(.pt-sec-h-min) { font-size: 16px; } }\n";
style.textContent += "\n    /* clearer start / end markers on the timeline */\n    #promise-tracker-embed .pt-tl-track::before, #promise-tracker-embed .pt-tl-track::after { width: 3px; height: 20px; background: var(--pt-ink, #17171c); }\n    #promise-tracker-embed .pt-tl-track::before { left: -1px; }\n    #promise-tracker-embed .pt-tl-track::after { right: -1px; }\n    #promise-tracker-embed .pt-tl-end b { font-weight: 800; }\n";
style.textContent += "\n    #promise-tracker-embed .pt-tl-fill::after { display: none; }\n    #promise-tracker-embed .pt-tl-track::before, #promise-tracker-embed .pt-tl-track::after { z-index: 3; background: #9d9aa1; }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-strip-item .pt-strip-photo { transform: scale(1.09); transform-origin: center; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo { transform: scale(1.09); }\n      #promise-tracker-embed .pt-ministers .pt-strip { padding: 8px 4px 0; }\n    }\n";
style.textContent += "\n    @media (min-width: 641px) {\n      #promise-tracker-embed .pt-ministers .pt-strip-photo::before { transition: background-color .16s ease; }\n      #promise-tracker-embed .pt-ministers .pt-strip-photo img { transition: filter .16s ease; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item { transition: transform .18s ease, opacity .16s ease; }\n      #promise-tracker-embed .pt-ministers .pt-strip-item .pt-strip-photo { transition: transform .18s ease; }\n    }\n";
style.textContent += "\n    #promise-tracker-embed .pt-tl-track { height: 4px; }\n    #promise-tracker-embed .pt-tl-track::before, #promise-tracker-embed .pt-tl-track::after { width: 2px; height: 14px; background: #b4b1b8; }\n    #promise-tracker-embed .pt-tl-track::before { left: 0; }\n    #promise-tracker-embed .pt-tl-track::after { right: 0; }\n    #promise-tracker-embed .pt-tl-mid { width: 1px; height: 8px; }\n";
document.head.appendChild(style);
  MOUNT.innerHTML = "<div class=\"pt-app\">\n    <div class=\"pt-layout\">\n\n      <section class=\"pt-mtop\" id=\"pt-mtop\"><div class=\"pt-mhost\" id=\"pt-mhost\"></div><div class=\"pt-mtitle\"><h2 class=\"pt-title\">BRUZZ Check</h2><p class=\"pt-mq\">Hoe ver staat de Brusselse regering met haar beloftes?</p></div></section>\n\n      <section class=\"pt-arch\" id=\"pt-arch\" aria-label=\"Ministers\">\n        <div class=\"pt-arch-stage\" id=\"pt-archStage\"></div>\n        <p class=\"pt-arch-info\" id=\"pt-archInfo\" aria-live=\"polite\"></p>\n      </section>\n\n      <div class=\"pt-panel\">\n\n        <div class=\"pt-col pt-col-left\">\n\n        <header class=\"pt-intro\">\n          <div class=\"pt-intro-text\">\n          <h2 class=\"pt-title\">BRUZZ Check</h2>\n          <p class=\"pt-subtitle\">Hoe ver staat de Brusselse regering met haar beloftes?</p>\n\n          <p class=\"pt-lede\">\n            Belofte maakt schuld. In februari 2026 trad de Brusselse regering aan, met een regeerakkoord vol engagementen. <span class=\"pt-lede-more\">De politieke barometer van BRUZZ Check volgt 25 concrete beloften en maakt halfjaarlijks de balans op: wat is uitgevoerd, wat zit op schema en wat blijft achter?</span>\n          </p>\n          </div>\n\n        </header>\n\n        <div class=\"pt-tlwrap\"><h3 class=\"pt-sec-h\">De legislatuur</h3>\n        <div class=\"pt-timeline\" role=\"img\" aria-label=\"Voortgang van de legislatuur\">\n          <div class=\"pt-tl-track\">\n            <span class=\"pt-tl-fill\"></span>\n            <span class=\"pt-tl-mid\"></span>\n            <span class=\"pt-tl-dot\"></span>\n            <span class=\"pt-tl-today\">Vandaag</span>\n          </div>\n          <div class=\"pt-tl-ends\">\n            <span class=\"pt-tl-end\"><b>Regering gevormd</b><i>Feb 2026</i></span>\n            <span class=\"pt-tl-end pt-tl-end-right\"><b>Einde legislatuur</b><i>Zomer 2029</i></span>\n          </div>\n        </div></div>\n\n        <section class=\"pt-ministers\" aria-label=\"Ministers\">\n          <h3 class=\"pt-sec-h\">De Brusselse regering</h3>\n          <div class=\"pt-ministers-body\" id=\"pt-ministersOrbit\"></div>\n        </section>\n\n        </div>\n\n        <div class=\"pt-col pt-col-right\">\n\n        <div class=\"pt-vcard\">\n\n        <section class=\"pt-plinko\" id=\"pt-plinko\" aria-label=\"Overzicht van de beloftes\">\n          <button type=\"button\" class=\"pt-plinko-replay\" id=\"pt-plinkoReplay\" aria-label=\"Opnieuw afspelen\"><svg viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/></svg><span class=\"pt-plinko-rpt\">Replay</span></button>\n          <canvas id=\"pt-plinkoCv\" role=\"img\" aria-label=\"Beloftes per status\"></canvas>\n        </section>\n\n        <section class=\"pt-status\" id=\"pt-status\" aria-labelledby=\"pt-statusSummaryCopy\">\n          <div class=\"pt-status-head\">\n            <h3 class=\"pt-status-title\" id=\"pt-statusSummaryCopy\">Voortgang<span class=\"pt-status-title-long\"> 25 beloftes</span></h3>\n            <span class=\"pt-assessment-date\" id=\"pt-assessmentDate\">Stand op -</span>\n          </div>\n          <div class=\"pt-status-bars\" id=\"pt-statusBars\"></div>\n        </section>\n\n        </div>\n\n        <div class=\"pt-meta\" id=\"pt-meta\">\n          <p class=\"pt-meta-item pt-meta-note\">BRUZZ beoordeelt de beloftes halfjaarlijks. <a class=\"pt-meta-link\" href=\"#pt-redactie\" data-scroll-redactie>Zo gaat de redactie te werk.</a></p>\n        </div>\n\n        </div>\n\n      </div>\n\n      <section class=\"pt-filters\" id=\"pt-filters\" aria-label=\"Beloftes filteren\">\n        <label class=\"pt-search\">\n          <span class=\"pt-sr\">Zoeken</span>\n          <svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"9\" r=\"5.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"m13.4 13.4 4 4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n          <input id=\"pt-searchInput\" type=\"search\" placeholder=\"Zoek op belofte of minister\" autocomplete=\"off\">\n        </label>\n\n        <div class=\"pt-selects\">\n          <label class=\"pt-select\" data-filter=\"status\">\n            <span class=\"pt-sr\">Status</span>\n            <select id=\"pt-statusFilter\"><option value=\"\">Alle statussen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"minister\">\n            <span class=\"pt-sr\">Minister</span>\n            <select id=\"pt-ministerFilter\"><option value=\"\">Alle ministers</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"party\">\n            <span class=\"pt-sr\">Partij</span>\n            <select id=\"pt-partyFilter\"><option value=\"\">Alle partijen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"theme\">\n            <span class=\"pt-sr\">Thema</span>\n            <select id=\"pt-themeFilter\"><option value=\"\">Alle thema's</option></select>\n          </label>\n        </div>\n\n        <button class=\"pt-clear\" id=\"pt-clearFilters\" type=\"button\" hidden>Wis filters</button>\n      </section>\n\n      <div class=\"pt-results\">\n        <div class=\"pt-results-bar\" id=\"pt-resultsBar\">\n          <p class=\"pt-results-count\" id=\"pt-resultsMeta\" aria-live=\"polite\" hidden></p>\n          <button class=\"pt-filter-toggle\" id=\"pt-filterToggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"pt-filters\">Filters</button>\n        </div>\n        <div class=\"pt-cards\" id=\"pt-cardsContainer\">\n          <div class=\"pt-loading\">Aan het laden...</div>\n        </div>\n\n        <div class=\"pt-pager-wrap\" id=\"pt-paginationWrap\" hidden>\n          <button class=\"pt-showall\" id=\"pt-showAllToggle\" type=\"button\">Toon alles</button>\n          <div class=\"pt-pager\" id=\"pt-pagination\"></div>\n        </div>\n      </div>\n    </div>\n\n    <section class=\"pt-redactie\" id=\"pt-redactie\" aria-labelledby=\"pt-redactieTitle\">\n      <h3 class=\"pt-redactie-title\" id=\"pt-redactieTitle\">Redactionele aanpak</h3>\n      <p>BRUZZ Check is de politieke barometer van BRUZZ en volgt 25 concrete beloften uit het Brusselse regeerakkoord van februari 2026. Halfjaarlijks maakt de redactie de balans op. Op basis van vaste criteria en controleerbare bronnen krijgt elke belofte een status: \u2018niet gestart\u2019, \u2018gestart\u2019, \u2018op schema\u2019, \u2018niet op schema\u2019, \u2018gerealiseerd\u2019, \u2018mislukt\u2019 of \u2018niet verifieerbaar\u2019.</p>\n      <p>Meer weten over de werkwijze? Lees de <a class=\"pt-meta-link\" href=\"/node/214357\">veelgestelde vragen</a>.</p>\n    </section>\n  </div>";

    (function () {
      const root = MOUNT;
      if (!root) return;
      (MOUNT.getAttribute("data-lv") || "stretch type head").split(/\s+/).filter(Boolean).forEach(k => root.classList.add("lv-" + k));

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

      /*
        BEOORDELINGEN (the verdicts per round): the status of a promise (and its verdict text) now comes from the
        LATEST PUBLISHED row in the Beoordelingen table, not from the Promises table.
        - BEOORDELINGEN_TABLE_ID / RONDES_TABLE_ID: the table numbers in Baserow (the number after /table/ in the
          address bar). Only needed without a proxy. With a proxy (API_BASE_URL) the Worker needs the routes
          /beoordelingen and /rondes.
        - As long as the tables can not be read, the page keeps using the old columns of the Promises table.
      */
      const BEOORDELINGEN_TABLE_ID = "1285538".trim();
      const RONDES_TABLE_ID = "1285539".trim();
      const BEOORDELINGEN_API = `https://api.baserow.io/api/database/rows/table/${BEOORDELINGEN_TABLE_ID}/?user_field_names=true&size=200`;
      const RONDES_API = `https://api.baserow.io/api/database/rows/table/${RONDES_TABLE_ID}/?user_field_names=true&size=200`;

      const PAGE_SIZE = 12;

      const STATUS_CONFIG = {
            "GEDWARSBOOMD": { color: "#FF8A1F", bg: "#fff1e0", symbol: "\u21AF", iconUrl: "" },
            "NIET GESTART": { color: "#2e2e2e", bg: "#ececec", symbol: "✕", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4df1c29aca7da8d503&f=t&dl=t&c=621b99d3b2893607c7ceb5be21589b81&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZGYxYzI5YWNhN2RhOGQ1MDMmZj10JmRsPXQmYz02MjFiOTlkM2IyODkzNjA3YzdjZWI1YmUyMTU4OWI4MSIsInR5cGUiOiJkaXJlY3QifQ.D8poPnoPxffh6BGG6dqsO4yCQcyzd3mE5RTRojHmf3A" },
            "GESTART": { color: "#69CDF0", bg: "#e6f7fd", symbol: "…", iconUrl: "https://app.razuna.eu/file/remote?i=6ac367788fc71aef8abe8323&f=t&dl=t&c=194c6c8cb7b9389ef02bb1b139cd2f91&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3ODhmYzcxYWVmOGFiZTgzMjMmZj10JmRsPXQmYz0xOTRjNmM4Y2I3YjkzODllZjAyYmIxYjEzOWNkMmY5MSIsInR5cGUiOiJkaXJlY3QifQ.ZUasZvCE-VVupF1O0Rww6xVUSxsiTmPSQFcQZiXuegs" },
            "OP SCHEMA": { color: "#91fae8", bg: "#effffb", symbol: "→", iconUrl: "https://app.razuna.eu/file/remote?i=6ac367795d26d4fa58efb1ff&f=t&dl=t&c=820bfcf63a4b7e75c1827f2f93f5f3c1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3OTVkMjZkNGZhNThlZmIxZmYmZj10JmRsPXQmYz04MjBiZmNmNjNhNGI3ZTc1YzE4MjdmMmY5M2Y1ZjNjMSIsInR5cGUiOiJkaXJlY3QifQ.C5fRSpQXEym86Z5OoXEun99F_PZ5CB5dLw8boagJlJc" },
            "NIET OP SCHEMA": { color: "#FA79D7", bg: "#ffe8ef", symbol: "⏸", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4f8fc71aef8abe7f40&f=t&dl=t&c=0ae03ce2e22325e7d9c0ef235b098d8b&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZjhmYzcxYWVmOGFiZTdmNDAmZj10JmRsPXQmYz0wYWUwM2NlMmUyMjMyNWU3ZDljMGVmMjM1YjA5OGQ4YiIsInR5cGUiOiJkaXJlY3QifQ.HBt_lf4CEZdVlfBwS1coO11Dubv2kMneVMudHFphnp4" },
            "MISLUKT": { color: "#ff0033", bg: "#fce8ed", symbol: "✕", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e50e7c79cb82176880e&f=t&dl=t&c=f2198c5be089c0704dfbbabc06fbce82&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU1MGU3Yzc5Y2I4MjE3Njg4MGUmZj10JmRsPXQmYz1mMjE5OGM1YmUwODljMDcwNGRmYmJhYmMwNmZiY2U4MiIsInR5cGUiOiJkaXJlY3QifQ.-lTM_9If3bIs4Chs7KOXQbGL1eLqBzo99ma4jbAe8Sw" },
            "GELUKT": { color: "#00C8BE", bg: "#e0f8f6", symbol: "✓", iconUrl: "https://app.razuna.eu/file/remote?i=6ac36778e7c79cb821768adb&f=t&dl=t&c=4b2310c11278efb91ee90ec6f56f2f7d&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNjc3OGU3Yzc5Y2I4MjE3NjhhZGImZj10JmRsPXQmYz00YjIzMTBjMTEyNzhlZmI5MWVlOTBlYzZmNTZmMmY3ZCIsInR5cGUiOiJkaXJlY3QifQ.aEDrAoEbrRY50nFav5_gxZxcTHvg3omUDmwQFfBFXq4" },
            "ONVERIFIEERBAAR": { color: "#640044", bg: "#f5e6f0", symbol: "?", iconUrl: "https://app.razuna.eu/file/remote?i=6ac35e4efbae2dee4fef7652&f=t&dl=t&c=95852bb3fde1d2504e6319b23968a52d&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02YWMzNWU0ZWZiYWUyZGVlNGZlZjc2NTImZj10JmRsPXQmYz05NTg1MmJiM2ZkZTFkMjUwNGU2MzE5YjIzOTY4YTUyZCIsInR5cGUiOiJkaXJlY3QifQ.53REmx1y-YP1y7QSrHN3WKnTjfEPJJIjcb_dNNfR6g0" },
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

      const STATUS_ORDER = ["GELUKT","OP SCHEMA","NIET OP SCHEMA","MISLUKT","GESTART","NIET GESTART","GEDWARSBOOMD","GEBLOKKEERD","ONVERIFIEERBAAR"];
      const HIDE_WHEN_ZERO = ["GEDWARSBOOMD", "GEBLOKKEERD", "ONVERIFIEERBAAR"];

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
              centerSubtitle: "Veiligheid & Wetenschappelijk Onderzoek"
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
      const STATUS_LABELS = { "GELUKT": "Gerealiseerd", "ONVERIFIEERBAAR": "Niet verifieerbaar" };
      function statusLabel(key) {
        if (STATUS_LABELS[key]) return STATUS_LABELS[key];
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

      /* =====================================================================
         BEOORDELINGEN: latest published verdict per promise + all published verdicts for the timeline
         ===================================================================== */
      function bKey(name) { return String(name).toLowerCase().replace(/[^a-z0-9]/g, ""); }

      function bRaw(row, names) {
        const wanted = names.map(bKey);
        for (const key of Object.keys(row)) {
          if (!wanted.includes(bKey(key))) continue;
          const value = row[key];
          if (value == null || value === "" || (Array.isArray(value) && !value.length)) continue;
          return value;
        }
        return null;
      }

      function bScalars(value) {
        if (value == null) return [];
        if (Array.isArray(value)) return value.flatMap(bScalars);
        if (typeof value === "object") {
          if ("value" in value) return bScalars(value.value);
          if ("name" in value) return bScalars(value.name);
          return [];
        }
        return [value];
      }

      function bText(value) {
        const list = bScalars(value);
        return list.length ? String(list[0]) : "";
      }

      function bIsTrue(value) {
        return bScalars(value).some(item => item === true || String(item).toLowerCase() === "true");
      }

      function bTime(value) {
        const text = bText(value).trim();
        if (!text) return 0;
        const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12, 0).getTime();
        const nl = text.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
        if (nl) return new Date(Number(nl[3]), Number(nl[2]) - 1, Number(nl[1]), 12, 0).getTime();
        const parsed = Date.parse(text);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      function bIso(time) {
        const d = new Date(time);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      async function fetchOptionalTable(url, label, proxyPath, tableId) {
        if (!API_BASE_URL && !tableId) return null;
        try {
          return await fetchTable(url, label, proxyPath);
        } catch (err) {
          console.warn(`${label} niet geladen, de oude kolommen van Promises worden gebruikt:`, err.message);
          return null;
        }
      }

      /* Puts the latest published Beoordeling on top of each Promise row (Status, Verdict, Uitkomst, Laatsteverdict,
         Volgendebeoordeling), so the rest of the page works as before. Returns the new promises and, per promise
         row id, all published verdicts (newest first) for the timeline. */
      // A row only becomes a card when it has a title and at least MIN_FILLED_FIELDS filled columns
      // (id, order and other technical columns do not count). Fully empty rows are skipped.
      const MIN_FILLED_FIELDS = 2;
      const IGNORED_COLUMNS = ["id", "order", "Sort order", "Order", "Status", "Created on", "Last modified"];
      function isUsablePromiseRow(row) {
        if (!row || !getDisplayValue(row["Promise"]).trim()) return false;
        let filled = 0;
        Object.keys(row).forEach(key => {
          if (IGNORED_COLUMNS.includes(key)) return;
          if (getDisplayValue(row[key]).trim()) filled++;
        });
        return filled >= MIN_FILLED_FIELDS;
      }

      function applyBeoordelingen(promises, beoordelingen, rondes) {
        const byPromise = new Map();

        (beoordelingen || []).forEach(row => {
          if (!bIsTrue(bRaw(row, ["Gepubliceerd", "Published"]))) return;
          const status = bText(bRaw(row, ["Status"])).trim();
          if (!status) return;
          const time = bTime(bRaw(row, ["Datum", "Date", "Ronde datum"]));
          if (!time) return;

          const link = bRaw(row, ["Promise", "Belofte"]);
          const ids = (Array.isArray(link) ? link : [link]).map(item => item && item.id).filter(id => id != null);
          const keyText = bText(bRaw(row, ["Promise key", "Key"])).trim();
          const key = statusKey(status);

          const entry = {
            id: row.id,
            time,
            iso: bIso(time),
            statusText: status,
            key,
            label: statusLabel(key),
            toelichting: bText(bRaw(row, ["Toelichting", "Verdict"])),
            bewijs: bText(bRaw(row, ["Bewijs", "Cijfers", "Uitkomst"])),
            keyText
          };

          ids.forEach(id => {
            if (!byPromise.has(id)) byPromise.set(id, []);
            byPromise.get(id).push(entry);
          });
        });

        byPromise.forEach(list => list.sort((a, b) => (b.time - a.time) || (b.id - a.id)));

        const rounds = (rondes || []).map(row => ({
          time: bTime(bRaw(row, ["Datum", "Date"])),
          published: bIsTrue(bRaw(row, ["Gepubliceerd", "Published"]))
        })).filter(round => round.time).sort((a, b) => a.time - b.time);

        const merged = (promises || []).map(promise => {
          const list = byPromise.get(promise.id);
          if (!list || !list.length) return promise;
          const latest = list[0];
          const copy = Object.assign({}, promise);
          copy["Status"] = latest.statusText;
          copy["Verdict"] = latest.toelichting;
          copy["Uitkomst"] = latest.bewijs;
          copy["Cijfers"] = "";
          copy["Laatsteverdict"] = latest.iso;
          const next = rounds.find(round => !round.published && round.time > latest.time);
          if (next) copy["Volgendebeoordeling"] = bIso(next.time);
          return copy;
        });

        return { promises: merged, updatesFor: promise => (promise && byPromise.get(promise.id)) || [] };
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

      /* ONE request for all lists: the Worker route /all returns promises, beoordelingen, rondes (and glossary)
         together. If that route is not available (old Worker) each list is asked for separately, and without a
         proxy the lists are read straight from Baserow. The Updates table is no longer used. */
      async function loadAll(withGlossary) {
        const wanted = ["promises", "beoordelingen", "rondes"].concat(withGlossary ? ["glossary"] : []);

        if (API_BASE_URL) {
          try {
            const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/all?include=${wanted.join(",")}`);
            const text = await res.text();
            if (!res.ok) throw new Error(`all failed (${res.status}): ${text}`);
            const data = JSON.parse(text);
            if (!data || !Array.isArray(data.promises)) throw new Error("promises ontbreken in het antwoord");
            const list = part => (Array.isArray(data[part]) ? data[part] : null);
            return { promises: data.promises, beoordelingen: list("beoordelingen"), rondes: list("rondes"), glossary: list("glossary") };
          } catch (err) {
            console.warn("Gecombineerde aanvraag mislukt, de lijsten worden apart opgehaald:", err.message);
          }
        }

        const [promises, beoordelingen, rondes, glossary] = await Promise.all([
          fetchTable(PROMISES_API, "Promises table", "promises"),
          fetchOptionalTable(BEOORDELINGEN_API, "Beoordelingen", "beoordelingen", BEOORDELINGEN_TABLE_ID),
          fetchOptionalTable(RONDES_API, "Rondes", "rondes", RONDES_TABLE_ID),
          Promise.resolve(null)
        ]);
        return { promises, beoordelingen, rondes, glossary };
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

      function imageFocusPosition(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (["top", "boven"].includes(raw)) return "center top";
        if (["bottom", "onder"].includes(raw)) return "center bottom";
        if (["left", "links"].includes(raw)) return "left center";
        if (["right", "rechts"].includes(raw)) return "right center";
        return "center center";
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
        const midEl = $("pt-tlMidDate");
        if (midEl) {
          const m = TIMELINE_MIDPOINT.toLocaleDateString("nl-BE", { month: "long", year: "numeric" });
          midEl.textContent = m.charAt(0).toUpperCase() + m.slice(1);
        }
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
        if (PHONE_MQ.matches) {   // on a phone a tap only shows the minister's name; it does not filter the cards
          renderMinisters();
          return;
        }
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

        const compact = width < 460;
        host.classList.toggle("pt-orbit-compact", compact);
        const itemSize = compact ? 76 : 112;
        const radius = compact ? Math.max(96, base * 0.355) : Math.max(112, Math.min(base * 0.39, 235));

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

      function ministerCaption(m) {
        if (!m) return "";
        const role = [m.centerKicker, m.centerSubtitle].filter(Boolean).join(" van ");
        return `<span class="pt-mc-name"><b>${escapeHtml(displayName(m.name))}</b>${m.partij ? ` <span class="pt-mc-party" style="color:${partyInk(m.partij)}">(${escapeHtml(m.partij)})</span>` : ""}</span>
          ${role ? `<span class="pt-mc-resp">${escapeHtml(role)}</span>` : ""}`;
      }

      function renderStrip(host) {
        host.classList.remove("pt-orbit-compact");
        const active = activeMinisterIndex == null ? null : MINISTERS[activeMinisterIndex];
        const caption = ministerCaption(active);

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
          <div class="pt-strip-caption">${caption}</div>
        `;
        bindMinisterButtons(host);
        const capEl = host.querySelector(".pt-strip-caption");
        const stripEl = host.querySelector(".pt-strip");
        const headEl = host.parentElement.querySelector(".pt-sec-h");
        const DEFAULT_HEAD = "De Brusselse regering";
        const setCap = idx => {
          if (!headEl) return;
          if (idx == null) { headEl.className = "pt-sec-h"; headEl.textContent = DEFAULT_HEAD; return; }
          const m = MINISTERS[idx];
          const role = [m.centerKicker, m.centerSubtitle].filter(Boolean).join(" van ");
          headEl.className = "pt-sec-h pt-sec-h-min";
          headEl.innerHTML = `<span class="pt-sec-l1"><b>${escapeHtml(displayName(m.name))}</b>${m.partij ? ` <span style="color:${partyInk(m.partij)}">(${escapeHtml(m.partij)})</span>` : ""}</span>${role ? `<span class="pt-sec-role">${escapeHtml(role)}</span>` : ""}`;
        };
        const reset = () => setCap(activeMinisterIndex);
        reset();
        host.querySelectorAll(".pt-strip-item").forEach(btn => {
          const idx = Number(btn.dataset.ministerIndex), m = MINISTERS[idx];
          const show = () => setCap(idx);
          btn.addEventListener("mouseenter", show); btn.addEventListener("focus", show);
          btn.addEventListener("mouseleave", reset); btn.addEventListener("blur", reset);
        });
      }

      // The circle needs room. On narrow screens it falls back to a scrolling strip.
      function canUseOrbit() {
        const host = $("pt-ministersOrbit");
        return host.parentElement.clientWidth >= 300;
      }

      function renderMinisters() {
        const host = $("pt-ministersOrbit");
        if (!host || PHONE_MQ.matches) return;   // on a phone the arc at the top is used instead
        host.classList.remove("pt-orbit-mode");
        renderStrip(host);
      }

      /* ===================================================================
         STATUS
         =================================================================== */
      /* Status symbols drawn in code, so their colours always follow the status colours (no image files needed). */
      const SYM_SHAPES = {
        "GELUKT": '<polygon points="12.00,1.20 14.38,3.11 17.40,2.65 18.51,5.49 21.35,6.60 20.89,9.62 22.80,12.00 20.89,14.38 21.35,17.40 18.51,18.51 17.40,21.35 14.38,20.89 12.00,22.80 9.62,20.89 6.60,21.35 5.49,18.51 2.65,17.40 3.11,14.38 1.20,12.00 3.11,9.62 2.65,6.60 5.49,5.49 6.60,2.65 9.62,3.11"/><path d="M8.2 12.4l2.7 2.7 5-5.6"/>',
        "OP SCHEMA": '<circle cx="12" cy="12" r="10"/><path d="M12 6.8V12l3.6 2.3"/>',
        "GESTART": '<circle cx="12" cy="12" r="10"/><path d="M10 8.2v7.6l6-3.8z" fill="currentColor"/>',
        "NIET OP SCHEMA": '<circle cx="12" cy="12" r="10" stroke-dasharray="2.2 2.6"/><path d="M12 6.8V12l3.6 2.3"/>',
        "NIET GESTART": '<circle cx="12" cy="12" r="10"/><rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.2" fill="currentColor"/>',
        "MISLUKT": '<circle cx="12" cy="12" r="10"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8"/>',
        "ONVERIFIEERBAAR": '<circle cx="12" cy="12" r="10"/><path d="M9.3 9.4a2.8 2.8 0 1 1 4 2.5c-.9.5-1.3 1-1.3 2"/><circle cx="12" cy="17" r=".7" fill="currentColor"/>'
      };
      // symbol colours that differ from the status colour 
      const SYM_COLORS = { "OP SCHEMA": "#5ee0cc" };
      function symKeyFor(conf) {
        const keys = Object.keys(STATUS_CONFIG);
        return keys.find(k => STATUS_CONFIG[k] === conf) || keys.find(k => STATUS_CONFIG[k] && STATUS_CONFIG[k].color === conf.color && STATUS_CONFIG[k].symbol === conf.symbol) || "";
      }
      function builtinSym(conf, cls) {
        const key = symKeyFor(conf);
        if (!SYM_SHAPES[key]) return "";
        const color = SYM_COLORS[key] || conf.color;
        return `<span class="CLS" style="--CLS-color:${escapeHtml(conf.color)};"><svg class="CLS-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:${color}" aria-hidden="true">${SYM_SHAPES[key]}</svg></span>`.replace(/CLS/g, cls);
      }

      function renderSym(conf) {
        const built = builtinSym(conf, "pt-sym");
        if (built) return built;
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

      root.addEventListener("click", event => {
        const link = event.target.closest("[data-scroll-redactie]");
        if (!link) return;
        event.preventDefault();
        const target = $("pt-redactie");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      function renderSummary() {
        updateTimelineMarkers();
        const latest = getLatestAssessmentDate() || "-";
        $("pt-assessmentDate").textContent = `Stand op ${latest}`;

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

        plPlace();
        plinkoArm();

        // A full bar stands for all promises together.
        const total = allPromises.length;
        const activeStatus = $("pt-statusFilter")?.value || "";

        const bars = $("pt-statusBars");
        const GROUPS = [["Gerealiseerd", ["GELUKT"]], ["Bezig", ["OP SCHEMA", "GESTART", "NIET OP SCHEMA"]], ["Niet gerealiseerd", ["NIET GESTART", "MISLUKT", "GEDWARSBOOMD", "GEBLOKKEERD", "ONVERIFIEERBAAR"]]];
        const orderedKeys = [];
        GROUPS.forEach(g => g[1].forEach(k => { if (STATUS_ORDER.includes(k)) orderedKeys.push([g[0], k]); }));
        let lastGroup = "";
        bars.innerHTML = orderedKeys
          .filter(([, key]) => !HIDE_WHEN_ZERO.includes(key) || (counts[key] || 0) > 0)
          .map(([group, key]) => {
            const gTotal = (GROUPS.find(g => g[0] === group)[1]).reduce((a, k) => a + (counts[k] || 0), 0);
            const head = group !== lastGroup ? `<div class="pt-status-group"><span>${group}</span><span class="pt-status-group-n">${gTotal}</span></div>` : "";
            lastGroup = group;
            const conf = STATUS_CONFIG[key];
            const value = counts[key] || 0;
            const pct = total && value ? (value / total) * 100 : 0;
            const isActive = activeStatus === key;
            return head + `
              <button type="button" data-group="${GROUPS.findIndex(g => g[0] === group)}"
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
            if (isRowsMode()) {
              const row = document.getElementById("pt-row-" + clicked.replace(/\s+/g, "-"));
              if (row) row.scrollIntoView({ behavior: "smooth", block: "start" });
              return;
            }
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
              ${hero ? `<img class="pt-card-img" src="${escapeHtml(hero)}" alt="" loading="lazy" decoding="async" style="object-position:${escapeHtml(imageFocusPosition(getFirstField(row, ["Hero image focus", "Image focus", "Beeld focus"])))}">` : ""}
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

      /* phone: with no filter active, the cards are shown as one swipeable row per status */
      const PHONE_MQ = window.matchMedia("(max-width: 640px)");
      function isRowsMode() {
        return PHONE_MQ.matches && !hasActiveFilters();
      }
      function hasActiveFilters() {
        return Boolean($("pt-searchInput").value.trim() || $("pt-statusFilter").value || $("pt-ministerFilter").value || $("pt-partyFilter").value || $("pt-themeFilter").value);
      }

      function renderStatusRows(rows) {
        const container = $("pt-cardsContainer");
        const groups = new Map();
        rows.forEach(row => {
          const key = statusKey(row["Status"]);
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(row);
        });
        const keys = [...STATUS_ORDER.filter(k => groups.has(k)), ...[...groups.keys()].filter(k => !STATUS_ORDER.includes(k))];
        container.innerHTML = keys.map(key => {
          const conf = STATUS_CONFIG[key] || STATUS_CONFIG["GESTART"];
          const list = groups.get(key);
          return `
            <section class="pt-row" id="pt-row-${escapeHtml(key.replace(/\s+/g, "-"))}" style="--pt-status-color:${escapeHtml(conf.color)};">
              <div class="pt-row-head"><span class="pt-row-title">${renderSym(conf)}<span>${escapeHtml(statusLabel(key))}</span></span><span class="pt-row-count">${list.length}</span></div>
              <div class="pt-row-track">${list.map(renderCard).join("")}</div>
            </section>`;
        }).join("");
      }

      function renderCards(rows) {
        const container = $("pt-cardsContainer");
        if (!rows.length) {
          container.innerHTML = `<div class="pt-empty">Geen beloftes gevonden met deze filters.</div>`;
          return;
        }
        if (isRowsMode()) { renderStatusRows(rows); return; }
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
        const filters = $("pt-filters");
        (filters.offsetParent ? filters : $("pt-resultsBar")).scrollIntoView({ behavior: "auto", block: "start" });
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
        let count = $("pt-searchInput").value.trim() ? 1 : 0;
        let any = count > 0;
        ["status", "minister", "party", "theme"].forEach(key => {
          const select = $(`pt-${key}Filter`);
          const active = Boolean(select.value);
          if (active) count++;
          any = any || active;
          select.closest(".pt-select")?.classList.toggle("pt-filter-active", active);
        });
        $("pt-clearFilters").hidden = !any;
        const toggle = $("pt-filterToggle");
        if (toggle) {
          const open = root.classList.contains("pt-filters-open");
          toggle.textContent = open ? "Verberg filters" : (count ? `Filters (${count})` : "Filters");
          toggle.classList.toggle("pt-has-filters", count > 0);
        }
      }

      $("pt-filterToggle").addEventListener("click", () => {
        root.classList.toggle("pt-filters-open");
        $("pt-filterToggle").setAttribute("aria-expanded", String(root.classList.contains("pt-filters-open")));
        updateFilterHighlightState();
      });

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
        const rowsMode = isRowsMode();
        $("pt-cardsContainer").classList.toggle("pt-cards-rows", rowsMode);
        renderCards(rowsMode ? filteredPromises : pageRows);
        renderPagination(total, totalPages);
        if (rowsMode) $("pt-paginationWrap").hidden = true;
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

      const onPhoneChange = () => { if (dataLoaded) applyFilters(false); };
      if (PHONE_MQ.addEventListener) PHONE_MQ.addEventListener("change", onPhoneChange); else if (PHONE_MQ.addListener) PHONE_MQ.addListener(onPhoneChange);

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const host = $("pt-ministersOrbit");
          if (!PHONE_MQ.matches && host && !host.firstChild) renderMinisters();
          plinkoResize();
        }, 150);
      });
      const onPhoneChange2 = () => { if (!PHONE_MQ.matches) renderMinisters(); plPlace(); if (plStarted) plinkoStart(true); };
      if (PHONE_MQ.addEventListener) PHONE_MQ.addEventListener("change", onPhoneChange2); else if (PHONE_MQ.addListener) PHONE_MQ.addListener(onPhoneChange2);

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

      /* ===================================================================
         PHONE HEADER: arc of ministers with title + question inside
         =================================================================== */
      const ARCH_ORDER = ["Boris","Elke","Ahmed","Laurent","Dirk","Karine","Audrey","Ans"];
      const ARCH_FILL = { "MR":"#5cbcff", "Anders":"#5cbcff", "Groen":"#2fd070", "Les Engagés":"#76e6df", "PS":"#ff3d66", "Vooruit":"#ff3d66" };
      let archSel = null;
      let archPlayed = false;
      let archW = 0;

      function archMinisters() {
        return ARCH_ORDER.map(n => MINISTERS.find(m => m.name.indexOf(n) === 0)).filter(Boolean);
      }
      function archInitials(name) {
        return String(name).split(" ").map(w => w[0]).slice(0, 2).join("");
      }
      function archLayout() {
        const stage = $("pt-archStage");
        if (!stage || !stage.firstChild) return;
        const W = stage.clientWidth;
        if (!W) return;
        archW = W;
        const d = Math.min(62, Math.max(44, Math.round(W * 0.155)));
        const R = (W - d) / 2 - 4;
        stage.style.height = (R + d) + "px";
        stage.querySelectorAll(".pt-arch-c").forEach((c, i) => {
          const a = Math.PI - i * Math.PI / 7;
          c.style.width = c.style.height = d + "px";
          c.style.left = (W / 2 + R * Math.cos(a) - d / 2) + "px";
          c.style.top = (R - R * Math.sin(a)) + "px";
        });
        const mid = stage.querySelector(".pt-arch-mid");
        const ir = R - d / 2;
        mid.style.top = (R * 0.8) + "px";
        mid.style.width = (ir * 1.62) + "px";
        mid.style.setProperty("--fs", (ir * 0.25) + "px");
              }
      function archPaint() {
        const list = archMinisters();
        document.querySelectorAll("#pt-archStage .pt-arch-c").forEach((c, i) => c.classList.toggle("on", i === archSel));
        const m = archSel == null ? null : list[archSel];
        $("pt-archInfo").innerHTML = m
          ? `<b>${escapeHtml(displayName(m.name))} · ${escapeHtml(m.partij)}</b><span>${escapeHtml(m.centerKicker || "")}${m.centerSubtitle ? " · " + escapeHtml(m.centerSubtitle) : ""}</span>`
          : `<span>Tik op een gezicht voor de minister</span>`;
      }
      function renderArch() {
        const stage = $("pt-archStage");
        if (!stage || !PHONE_MQ.matches) return;
        if (!stage.firstChild) {
          const list = archMinisters();
          stage.innerHTML = list.map((m, i) => `
            <button type="button" class="pt-arch-c" data-arch="${i}" aria-label="${escapeHtml(displayName(m.name))}" aria-pressed="false" style="--pc:${ARCH_FILL[m.partij] || "#ddd"};--i:${i}">
              <span class="pt-arch-fill"></span>
              <span class="pt-arch-ph"><img src="${escapeHtml(m.image)}" alt="" loading="eager" onerror="this.remove()"></span>
            </button>`).join("") + `
            <div class="pt-arch-mid"><h2 class="pt-title pt-arch-ttl">BRUZZ Check</h2></div>`;
          stage.addEventListener("click", e => {
            const b = e.target.closest("[data-arch]");
            if (!b) return;
            const i = Number(b.dataset.arch);
            archSel = archSel === i ? null : i;
            stage.querySelectorAll(".pt-arch-c").forEach((c, k) => c.setAttribute("aria-pressed", String(k === archSel)));
            archPaint();
          });
          if (!archPlayed) {
            archPlayed = true;
            stage.classList.add("pt-arch-go");
          }
        }
        archLayout();
        archPaint();
      }
      window.addEventListener("resize", () => { if (PHONE_MQ.matches) { renderArch(); } });
      if (PHONE_MQ.addEventListener) PHONE_MQ.addEventListener("change", renderArch); else if (PHONE_MQ.addListener) PHONE_MQ.addListener(renderArch);

      function renderSegBar(counts, total) {
        const el = $("pt-seg");
        if (!el) return;
        let n = 0;
        el.innerHTML = STATUS_ORDER
          .filter(k => (counts[k] || 0) > 0)
          .map(k => `<i style="--c:${escapeHtml(STATUS_CONFIG[k].color)};--n:${n++};flex:${counts[k]} 1 0"></i>`).join("");
      }

      /* ===================================================================
         PLINKO: every promise is a ball that falls through the parliament
         into Gerealiseerd / Bezig / Niet gerealiseerd (desktop only)
         =================================================================== */
      const PL_DW = 304;
      let PL_DH = 312, PL_TOP = -64;
      function plMode() { PL_DH = PHONE_MQ.matches ? 338 : 286; PL_TOP = PHONE_MQ.matches ? -4 : -64; }
      const PL_LEG = [["OP SCHEMA", "Op schema"], ["NIET OP SCHEMA", "Niet op schema"], ["GESTART", "Gestart"]];
      const PL_LEG2 = [["NIET GESTART", "Niet gestart"], ["MISLUKT", "Mislukt"], ["ONVERIFIEERBAAR", "Niet verifieerbaar"]];
      const PL_BUCKETS = [{ name: "Gerealiseerd", base: "#00C8BE" }, { name: "Bezig", base: "#69CDF0" }, { name: "Niet gerealiseerd", base: "#2e2e2e" }];
      const PL_BUCKET_OF = { "GELUKT": 0, "OP SCHEMA": 1, "NIET OP SCHEMA": 1, "GESTART": 1 };
      let plSim = null, plRaf = 0, plRun = 0, plStarted = false, plObserver = null, plSeed = 5;
      function plRnd() { plSeed = (plSeed * 9301 + 49297) % 233280; return plSeed / 233280; }

      function plCfg() {
        const cx = 152, cy = 190, rows = [[32, 140], [25, 112], [19, 84], [13, 56]], dots = [], GAPA = .26, total = Math.PI - 2 * GAPA, FR = [.37, .26, .37];
        rows.forEach(r => {
          const n = r[0], side = Math.round(n * .37), cnt = [side, n - 2 * side, side];
          let start = Math.PI;
          for (let k = 0; k < 3; k++) {
            const span = total * FR[k], ns = cnt[k];
            for (let j = 0; j < ns; j++) {
              const th = start - (ns > 1 ? span * j / (ns - 1) : span / 2);
              dots.push({ x: cx + r[1] * Math.cos(th), y: cy - r[1] * Math.sin(th) });
            }
            start -= span + GAPA;
          }
        });
        return { cx, cy, dots, bw: 96, r: 4.3, BT: PHONE_MQ.matches ? 236 : 220, FL: PHONE_MQ.matches ? 280 : 256 };
      }

      function plBuild(C) {
        const balls = allPromises.map(row => {
          const key = statusKey(row["Status"]);
          const conf = STATUS_CONFIG[key] || { color: "#999" };
          const bi = key in PL_BUCKET_OF ? PL_BUCKET_OF[key] : 2;
          return { bi, key, col: conf.color, r: C.r, x: 0, y: PL_TOP + 6, vx: 0, vy: 0, on: false, landed: false, frozen: false, still: 0, calm: 0 };
        });
        for (let i = balls.length - 1; i > 0; i--) { const j = Math.floor(plRnd() * (i + 1)); const t = balls[i]; balls[i] = balls[j]; balls[j] = t; }
        balls.forEach(b => { b.tx = 8 + C.bw * b.bi + C.bw / 2 + (plRnd() - .5) * 44; b.x = C.cx + (plRnd() - .5) * 70; b.vx = (b.tx - C.cx) * .35 + (plRnd() - .5) * 30; b.gs = 1 - .1 * b.bi; });
        balls.slice().sort((a, b) => a.bi - b.bi).forEach((b, i) => { b.t0 = .25 + i * .16 + b.bi * .5; });
        return balls;
      }

      function plLanded(st, b) { b.landed = true; st.count[b.bi]++; st.ck[b.key] = (st.ck[b.key] || 0) + 1; }

      function plStep(C, st, dt) {
        const G = 1500, r = C.r, B = st.balls;
        B.forEach(b => {
          if (b.frozen || st.t < b.t0) return;
          b.on = true;
          b.vy += G * b.gs * dt;
          if (!b.landed) {
            if (b.y < C.BT - 6) {
              // aim for the bucket like a thrown ball: the sideways speed that lands it in time, eased in smoothly
              const a = G * b.gs, rem = Math.max(0, C.BT - b.y);
              const tr = Math.max(.14, (-b.vy + Math.sqrt(b.vy * b.vy + 2 * a * rem)) / a);
              const vdes = Math.max(-260, Math.min(260, (b.tx - b.x) / tr));
              b.vx += (vdes - b.vx) * Math.min(1, (b.y < C.cy - 40 ? 2.5 : 7) * dt);
            } else { b.vx += (b.tx - b.x) * 14 * dt; b.vx *= 1 - 3 * dt; }
          }
          b.x += b.vx * dt; b.y += b.vy * dt;
          for (let i = 0; i < C.dots.length; i++) {
            const p = C.dots[i], dx = b.x - p.x, dy = b.y - p.y, d2 = dx * dx + dy * dy, m = r + 2.2;
            if (d2 < m * m && d2 > 1e-6) {
              const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
              b.x = p.x + nx * m; b.y = p.y + ny * m;
              if (ny < -.55) b.vx += (b.x < 4 + r + 5 ? 1 : b.x > PL_DW - 4 - r - 5 ? -1 : (dx >= 0 ? 1 : -1)) * (40 + plRnd() * 30);   // never rest on top of a dot
              const vn = b.vx * nx + b.vy * ny;
              if (vn < 0) { b.vx -= 1.5 * vn * nx; b.vy -= 1.5 * vn * ny; }
            }
          }
          if (b.y > C.BT) {
            const x0 = 8 + C.bw * b.bi + 2, x1 = 8 + C.bw * (b.bi + 1) - 2;
            if (b.x < x0 + r) { b.x = x0 + r; b.vx = Math.abs(b.vx) * .3; }
            if (b.x > x1 - r) { b.x = x1 - r; b.vx = -Math.abs(b.vx) * .3; }
          } else {
            if (b.x < 4 + r) { b.x = 4 + r; b.vx = Math.abs(b.vx) * .3; }
            if (b.x > PL_DW - 4 - r) { b.x = PL_DW - 4 - r; b.vx = -Math.abs(b.vx) * .3; }
          }
          if (b.y + r > C.FL) {
            b.y = C.FL - r;
            if (b.vy > 0) b.vy = -b.vy * .3;
            if (Math.abs(b.vy) < 40) b.vy = 0;
            b.vx *= 1 - 9 * dt;
            if (!b.landed) plLanded(st, b);
          }
          const sp = Math.abs(b.vx) + Math.abs(b.vy);
          if (!b.landed) {
            if (!b.an) b.an = { x: b.x, y: b.y, t: 0 };
            const ax = b.x - b.an.x, ay = b.y - b.an.y;
            if (ax * ax + ay * ay > 64) b.an = { x: b.x, y: b.y, t: 0 };
            else {
              b.an.t += dt;
              if (b.an.t > .45) {
                // stuck on a dot: a small hop sideways towards its bucket instead of vanishing
                b.rescues = (b.rescues || 0) + 1;
                if (b.rescues > 8) { b.x = C.cx + (plRnd() - .5) * 40; b.y = PL_TOP + 6; b.vx = (b.tx - C.cx) * .3; b.vy = 0; b.rescues = 0; }
                else { b.vx = (b.tx >= b.x ? 1 : -1) * (110 + plRnd() * 70); b.vy = (b.x < 22 || b.x > PL_DW - 22) ? -240 : -110; }
                b.an = null;
              }
            }
          }
          if (!b.landed && sp < 30) { b.still += dt; if (b.still > .3) { b.still = 0; b.vx = (plRnd() - .5) * 220; b.vy = -60; } } else b.still = 0;
          if (b.landed) { if (sp < 45) b.calm += dt; else b.calm = 0; if (b.calm > .22) { b.frozen = true; b.vx = 0; b.vy = 0; } }
        });
        for (let it = 0; it < 3; it++) for (let i = 0; i < B.length; i++) {
          const a = B[i]; if (!a.on) continue;
          for (let j = i + 1; j < B.length; j++) {
            const c2 = B[j]; if (!c2.on || c2.bi !== a.bi) continue;
            const dx = c2.x - a.x, dy = c2.y - a.y, d2 = dx * dx + dy * dy, m = 2 * r;
            if (d2 < m * m && d2 > 1e-6) {
              if (a.frozen && c2.frozen) continue;
              const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, o = m - d;
              const wa = a.frozen ? 0 : (c2.frozen ? 1 : .5), wc = c2.frozen ? 0 : (a.frozen ? 1 : .5);
              a.x -= nx * o * wa; a.y -= ny * o * wa; c2.x += nx * o * wc; c2.y += ny * o * wc;
              const vr = (c2.vx - a.vx) * nx + (c2.vy - a.vy) * ny;
              if (vr < 0) {
                const k = 1.15 * vr;
                if (a.frozen) { c2.vx -= k * nx; c2.vy -= k * ny; c2.vx *= .96; }
                else if (c2.frozen) { a.vx += k * nx; a.vy += k * ny; a.vx *= .96; }
                else { a.vx += .5 * k * nx; a.vy += .5 * k * ny; c2.vx -= .5 * k * nx; c2.vy -= .5 * k * ny; }
              }
              if (a.landed && !c2.landed && c2.y > C.BT && Math.abs(c2.vy) < 260) plLanded(st, c2);
              if (c2.landed && !a.landed && a.y > C.BT && Math.abs(a.vy) < 260) plLanded(st, a);
            }
          }
        }
      }

      function plDraw(c, C, st) {
        const ink = "#17171c";
        C.dots.forEach(p => { c.fillStyle = "#c9c1c6"; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 6.3); c.fill(); });
        c.textAlign = "center"; c.fillStyle = ink;
        c.font = "900 30px " + st.font; c.fillText(String(st.total), C.cx, C.cy - 9);
        c.font = "600 10.5px " + st.font; c.fillStyle = ink; c.fillText("beloftes", C.cx, C.cy + 4);
        PL_BUCKETS.forEach((bk, i) => {
          const x = 8 + C.bw * i, mid = x + C.bw / 2;
          if (st.hover === i) { c.fillStyle = "rgba(242,184,200,.22)"; c.fillRect(x + 2, C.BT, C.bw - 4, C.FL + 4 - C.BT); }
          c.fillStyle = PHONE_MQ.matches ? bk.base : "#f2b8c8"; c.fillRect(x + 2, C.FL, C.bw - 4, 4);
          c.strokeStyle = "#f2b8c8"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, C.BT); c.lineTo(x, C.FL + 4); c.stroke();
          c.fillStyle = ink; c.textAlign = "center";
          
          if (PHONE_MQ.matches) {
            c.fillStyle = ink;
            c.font = "800 22px " + st.font; c.fillText(String(st.count[i]), mid, C.FL + 30);
            c.font = "800 9px " + st.font; if ("letterSpacing" in c) c.letterSpacing = ".25px"; c.fillText(bk.name.toUpperCase(), mid, C.FL + 46); if ("letterSpacing" in c) c.letterSpacing = "0px";
          } else {
            c.font = "800 8.5px " + st.font; if ("letterSpacing" in c) c.letterSpacing = ".25px"; c.fillText(bk.name.toUpperCase(), mid, C.FL + 22); if ("letterSpacing" in c) c.letterSpacing = "0px";
          }
        });
        c.strokeStyle = "#f2b8c8"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(8 + C.bw * 3, C.BT); c.lineTo(8 + C.bw * 3, C.FL + 4); c.stroke();
        st.balls.forEach(b => {
          if (!b.on) return;
          const r = b.r, x = b.x, y = b.y;
          const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
          g.addColorStop(0, "rgba(255,255,255,.32)"); g.addColorStop(.35, b.col); g.addColorStop(1, b.col);
          c.fillStyle = b.col; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill();
          c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill();
          
        });
      }

      function plPaint() {
        if (!plSim) return;
        plMode();
        const { cv, c, C, st } = plSim;
        const W = cv.clientWidth || PL_DW, dpr = Math.min(2, window.devicePixelRatio || 1), s = W / PL_DW;
        const wantW = Math.round(W * dpr), wantH = Math.round((PL_DH - PL_TOP) * s * dpr);
        if (cv.width !== wantW || cv.height !== wantH) { cv.width = wantW; cv.height = wantH; cv.style.height = ((PL_DH - PL_TOP) * s) + "px"; }
        cv.style.marginTop = ((PL_TOP - (PHONE_MQ.matches ? 0 : 44)) * s) + "px";
        c.setTransform(dpr * s, 0, 0, dpr * s, 0, -PL_TOP * s * dpr);
        c.clearRect(0, PL_TOP, PL_DW, PL_DH - PL_TOP);
        plDraw(c, C, st);
      }

      function plPlace() {
        const pl = $("pt-plinko"), host = $("pt-mhost"), vc = document.querySelector(".pt-vcard");
        if (!pl || !host || !vc) return;
        if (PHONE_MQ.matches) { if (pl.parentNode !== host) host.appendChild(pl); }
        else if (pl.parentNode !== vc) vc.insertBefore(pl, vc.firstChild);
      }
      function plinkoResize() { plMode(); plPaint(); }

      function plinkoStart(replay) {
        const cv = $("pt-plinkoCv");
        if (!cv || !allPromises.length) return;
        if (plStarted && !replay) return;
        plStarted = true;
        plMode(); plPlace();
        cancelAnimationFrame(plRaf);
        plSeed = 5;
        const C = plCfg();
        const st = { t: 0, balls: plBuild(C), count: [0, 0, 0], ck: {}, total: allPromises.length, font: getComputedStyle(root).fontFamily || "sans-serif" };
        plSim = { cv, c: cv.getContext("2d"), C, st };
        root.__plSim = plSim;
        const my = ++plRun;
        const label = () => { cv.setAttribute("aria-label", `${st.count[0]} gerealiseerd, ${st.count[1]} bezig, ${st.count[2]} niet gerealiseerd`); };
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          for (let k = 0; k < 90 * 25 && !st.balls.every(b => b.frozen); k++) { plStep(C, st, 1 / 90); st.t += 1 / 90; }
          plPaint(); label(); return;
        }
        let last = null, acc = 0;
        const frame = ts => {
          if (my !== plRun) return;
          if (last == null) last = ts;
          const dt = Math.min(.05, (ts - last) / 1000); last = ts; acc += dt;
          while (acc >= 1 / 180) { plStep(C, st, 1 / 180); st.t += 1 / 180; acc -= 1 / 180; }
          plPaint();
          if (!st.balls.every(b => b.frozen) && st.t < 25) plRaf = requestAnimationFrame(frame); else { plRaf = 0; label(); }
        };
        plRaf = requestAnimationFrame(frame);
      }

      // start when the block scrolls into view (once)
      function plinkoArm() {
        if (plStarted) return;
        const el = $("pt-plinko");
        if (!el) return;
        if (!("IntersectionObserver" in window)) { plinkoStart(false); return; }
        if (plObserver) return;
        plObserver = new IntersectionObserver(entries => {
          if (entries.some(e => e.isIntersecting)) { plObserver.disconnect(); plinkoStart(false); }
        }, { threshold: .35 });
        plObserver.observe(el);
      }
      $("pt-plinkoReplay").addEventListener("click", () => plinkoStart(true));
      // hovering a bucket lights up its bars
      (function () {
        const cv = $("pt-plinkoCv"), bars = $("pt-statusBars");
        if (!cv || !bars) return;
        const set = i => {
          if (bars.dataset.hi === String(i)) return;
          if (i < 0) delete bars.dataset.hi; else bars.dataset.hi = String(i);
          if (plSim) { plSim.st.hover = i; if (!plRaf) plPaint(); }
        };
        const hit = e => {
          if (!plSim) return -1;
          const r = cv.getBoundingClientRect(), s = r.width / PL_DW, C = plSim.C;
          const x = (e.clientX - r.left) / s, y = PL_TOP + (e.clientY - r.top) / s;
          if (y < C.BT - 16 || y > C.FL + 34) return -1;
          const i = Math.floor((x - 8) / C.bw);
          return i >= 0 && i < 3 ? i : -1;
        };
        cv.addEventListener("pointermove", e => { const i = hit(e); set(i); cv.style.cursor = i >= 0 ? "pointer" : "default"; });
        cv.addEventListener("pointerleave", () => set(-1));
        cv.addEventListener("pointerdown", e => { if (e.pointerType === "touch") { set(hit(e)); setTimeout(() => set(-1), 2200); } });
      })();

      async function init() {
        hidePageHeader();
        pullEmbedUp();
        updateTimelineMarkers();
        renderMinisters();
        renderArch();

        try {
          const all = await loadAll(false);
          const promisesRaw = all.promises;
          const beoordelingen = all.beoordelingen;
          const rondes = all.rondes;
          const updates = [];

          const promises = applyBeoordelingen(promisesRaw.filter(isUsablePromiseRow), beoordelingen, rondes).promises;

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
