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
style.textContent += "\n/* status tag: the text is centred on its capital letters, so it looks vertically centred in the label */\n#promise-tracker-embed .pt-chip { padding: 7px 12px 7px 7px; line-height: 1; align-items: center; }\n#promise-tracker-embed .pt-chip > span:last-child { display: block; line-height: 1; text-box: trim-both cap alphabetic; }\n";
style.textContent += "\n    /* ministers strip: the pink circles all sit behind every photo; a hovered minister comes to the front */\n    #promise-tracker-embed .pt-ministers .pt-strip { isolation: isolate; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item { z-index: auto; opacity: 1; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive { opacity: 1; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item:hover, #promise-tracker-embed .pt-ministers .pt-strip-item:focus-visible { z-index: 5; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active { z-index: auto; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item .pt-strip-photo, #promise-tracker-embed .pt-ministers .pt-strip-item.pt-active .pt-strip-photo { transform: none !important; width: 109%; max-width: none; margin: 0 -4.5%; }\n    #promise-tracker-embed .pt-ministers .pt-strip-photo::before { z-index: -1; }\n    #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive .pt-strip-photo img, #promise-tracker-embed .pt-ministers .pt-strip-item.pt-inactive .pt-strip-photo::before { opacity: .6; }\n";
style.textContent += "\n    /* ===== iris view (Optie 2) ===== */\n    #promise-tracker-embed .pt-iris { display: none; }\n    #promise-tracker-embed .pt-plinko[data-view=\"iris\"] canvas { display: none; }\n    #promise-tracker-embed .pt-plinko[data-view=\"iris\"] .pt-iris { display: flex; align-items: center; justify-content: center; aspect-ratio: 304 / 286; width: 100%; padding: 8px 6px 0; box-sizing: border-box; }\n    @media (max-width: 640px) { #promise-tracker-embed .pt-plinko[data-view=\"iris\"] .pt-iris { aspect-ratio: 304 / 338; } }\n    #promise-tracker-embed .pt-iris-grid { display: grid; grid-template-columns: repeat(var(--ir-cols, 5), 1fr); gap: clamp(6px, 1.8vw, 14px) clamp(6px, 1.4vw, 12px); width: 100%; }\n    #promise-tracker-embed .pt-iris-cell { aspect-ratio: 437 / 265; position: relative; }\n    #promise-tracker-embed .pt-iris-cell svg { width: 100%; height: 100%; overflow: visible; display: block; }\n    #promise-tracker-embed .pt-iris-leaf, #promise-tracker-embed .pt-iris-heart { transform-box: fill-box; opacity: 0; transform: scale(0); }\n    #promise-tracker-embed .pt-iris-leaf { transform-origin: 100% 100%; }\n    #promise-tracker-embed .pt-iris-heart { transform-origin: 50% 100%; }\n    @keyframes pt-iris-leaf { 0% { opacity: 0; transform: scale(.2) rotate(calc(var(--lr) + 14deg)); } 100% { opacity: 1; transform: scale(var(--ls)) rotate(var(--lr)); } }\n    @keyframes pt-iris-heart { 0% { opacity: 0; transform: scale(0) translateY(40px); } 70% { opacity: 1; transform: scale(calc(var(--hs) * 1.06)) translateY(-4px); } 100% { opacity: 1; transform: scale(var(--hs)) translateY(0); } }\n    /* first all the leaves, then the hearts bloom slowly */\n    #promise-tracker-embed .pt-iris-go .pt-iris-leaf { animation: pt-iris-leaf .9s cubic-bezier(.25, .8, .35, 1) var(--ld) forwards; }\n    #promise-tracker-embed .pt-iris-go .pt-iris-heart { animation: pt-iris-heart 1.5s cubic-bezier(.3, .9, .4, 1) calc(var(--d) + 1.9s) forwards; }\n    #promise-tracker-embed .pt-iris-ghost .pt-iris-leaf { fill-opacity: .18; stroke: currentColor; stroke-width: 5; stroke-dasharray: 9 9; }\n    @media (prefers-reduced-motion: reduce) {\n      #promise-tracker-embed .pt-iris-leaf { opacity: 1 !important; transform: scale(var(--ls)) rotate(var(--lr)) !important; animation: none !important; }\n      #promise-tracker-embed .pt-iris-heart { opacity: 1 !important; transform: scale(var(--hs)) !important; animation: none !important; }\n    }\n    .pt-optie-toggle { position: fixed; right: 12px; bottom: 12px; z-index: 2147483647; display: flex; gap: 2px; padding: 3px; border-radius: 999px; background: rgba(23, 23, 28, .86); box-shadow: 0 2px 10px rgba(0, 0, 0, .3); font: 700 12px/1 system-ui, sans-serif; }\n    .pt-optie-toggle button { cursor: pointer; border: 0; border-radius: 999px; padding: 8px 12px; font: inherit; color: #fff; background: transparent; }\n    .pt-optie-toggle button.is-on { background: #ff0033; }\n";
style.textContent += "\n#promise-tracker-embed .pt-title .pt-logo{display:block;height:1em;width:auto;max-width:100%;margin:0}\n#promise-tracker-embed h2.pt-title:has(.pt-logo){font-size:clamp(30px,5.2vw,52px)!important;line-height:1!important;letter-spacing:0!important}\n";
style.textContent += "\n#promise-tracker-embed h2.pt-title:has(.pt-logo){font-size:clamp(34px,5.8vw,60px)!important}\n#promise-tracker-embed .pt-title .pt-logo{margin-left:-4px!important}\n";
style.textContent += "\n#promise-tracker-embed .pt-title .pt-logo{margin-bottom:10px!important}\n";
style.textContent += "\n#promise-tracker-embed .pt-title .pt-logo{margin-bottom:20px!important}\n";
style.textContent += "\n#promise-tracker-embed h2.pt-title:has(.pt-logo){font-size:clamp(30px,4.9vw,50px)!important}\n#promise-tracker-embed .pt-title .pt-logo{margin-bottom:18px!important}\n#promise-tracker-embed .pt-intro .pt-subtitle,#promise-tracker-embed .pt-mq{font-size:22px!important;line-height:1.2!important;margin-bottom:10px!important}\n#promise-tracker-embed .pt-intro .pt-lede{color:#2b2b33!important;line-height:1.55!important;margin-top:0!important}\n#promise-tracker-embed .pt-intro{margin-bottom:48px!important}\n@media (max-width:640px){#promise-tracker-embed .pt-mq{font-size:19px!important}}\n";
style.textContent += "\n#promise-tracker-embed .pt-intro{margin-bottom:0!important}\n#promise-tracker-embed .pt-mtitle .pt-logo{margin-left:auto!important;margin-right:auto!important}\n";
style.textContent += "\n#promise-tracker-embed .pt-tl-today{bottom:10px!important}\n";
style.textContent += "\n#promise-tracker-embed .pt-intro .pt-subtitle,#promise-tracker-embed .pt-mq{margin-bottom:16px!important}\n";
style.textContent += "\n#promise-tracker-embed h2.pt-title:has(.pt-logo){font-size:clamp(36px,5.6vw,58px)!important}\n#promise-tracker-embed .pt-title .pt-logo{margin-bottom:30px!important}\n#promise-tracker-embed .pt-intro .pt-subtitle,#promise-tracker-embed .pt-mq{font-size:19px!important;margin-bottom:8px!important}\n@media (max-width:640px){#promise-tracker-embed .pt-mq{font-size:17px!important}}\n#promise-tracker-embed .pt-intro{margin-bottom:12px!important}\n";
style.textContent += "\n#promise-tracker-embed .pt-results-count{display:none!important}\n@media (min-width:641px){\n#promise-tracker-embed .pt-results-bar{display:none!important}\n#promise-tracker-embed .pt-timeline{margin-top:-26px!important}\n#promise-tracker-embed .pt-meta{margin-top:-16px!important}\n}\n";
document.head.appendChild(style);
  var PT_LOGO = "data:image/png;base64,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";
  MOUNT.innerHTML = "<div class=\"pt-app\">\n    <div class=\"pt-layout\">\n\n      <section class=\"pt-mtop\" id=\"pt-mtop\"><div class=\"pt-mhost\" id=\"pt-mhost\"></div><div class=\"pt-mtitle\"><h2 class=\"pt-title\"><img class=\"pt-logo\" alt=\"BRUZZ Check\" src=\"" + PT_LOGO + "\"></h2><p class=\"pt-mq\">Hoe ver staat de Brusselse regering met haar beloftes?</p></div></section>\n\n      <section class=\"pt-arch\" id=\"pt-arch\" aria-label=\"Ministers\">\n        <div class=\"pt-arch-stage\" id=\"pt-archStage\"></div>\n        <p class=\"pt-arch-info\" id=\"pt-archInfo\" aria-live=\"polite\"></p>\n      </section>\n\n      <div class=\"pt-panel\">\n\n        <div class=\"pt-col pt-col-left\">\n\n        <header class=\"pt-intro\">\n          <div class=\"pt-intro-text\">\n          <h2 class=\"pt-title\"><img class=\"pt-logo\" alt=\"BRUZZ Check\" src=\"" + PT_LOGO + "\"></h2>\n          <p class=\"pt-subtitle\">Hoe ver staat de Brusselse regering met haar beloftes?</p>\n\n          <p class=\"pt-lede\">\n            Belofte maakt schuld. In februari 2026 trad de Brusselse regering aan, met een regeerakkoord vol engagementen. <span class=\"pt-lede-more\">De politieke barometer van BRUZZ Check volgt 25 concrete beloften en maakt halfjaarlijks de balans op: wat is uitgevoerd, wat zit op schema en wat blijft achter?</span>\n          </p>\n          </div>\n\n        </header>\n\n        <div class=\"pt-tlwrap\"><h3 class=\"pt-sec-h\">De legislatuur</h3>\n        <div class=\"pt-timeline\" role=\"img\" aria-label=\"Voortgang van de legislatuur\">\n          <div class=\"pt-tl-track\">\n            <span class=\"pt-tl-fill\"></span>\n            <span class=\"pt-tl-mid\"></span>\n            <span class=\"pt-tl-dot\"></span>\n            <span class=\"pt-tl-today\">Vandaag</span>\n          </div>\n          <div class=\"pt-tl-ends\">\n            <span class=\"pt-tl-end\"><b>Regering gevormd</b><i>Feb 2026</i></span>\n            <span class=\"pt-tl-end pt-tl-end-right\"><b>Einde legislatuur</b><i>Zomer 2029</i></span>\n          </div>\n        </div></div>\n\n        <section class=\"pt-ministers\" aria-label=\"Ministers\">\n          <h3 class=\"pt-sec-h\">De Brusselse regering</h3>\n          <div class=\"pt-ministers-body\" id=\"pt-ministersOrbit\"></div>\n        </section>\n\n        </div>\n\n        <div class=\"pt-col pt-col-right\">\n\n        <div class=\"pt-vcard\">\n\n        <section class=\"pt-plinko\" id=\"pt-plinko\" aria-label=\"Overzicht van de beloftes\">\n          <button type=\"button\" class=\"pt-plinko-replay\" id=\"pt-plinkoReplay\" aria-label=\"Opnieuw afspelen\"><svg viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/></svg><span class=\"pt-plinko-rpt\">Replay</span></button>\n          <canvas id=\"pt-plinkoCv\" role=\"img\" aria-label=\"Beloftes per status\"></canvas>\n          <div class=\"pt-iris\" id=\"pt-iris\" aria-hidden=\"true\"></div>\n        </section>\n\n        <section class=\"pt-status\" id=\"pt-status\" aria-labelledby=\"pt-statusSummaryCopy\">\n          <div class=\"pt-status-head\">\n            <h3 class=\"pt-status-title\" id=\"pt-statusSummaryCopy\">Voortgang<span class=\"pt-status-title-long\"> 25 beloftes</span></h3>\n            <span class=\"pt-assessment-date\" id=\"pt-assessmentDate\">Stand op -</span>\n          </div>\n          <div class=\"pt-status-bars\" id=\"pt-statusBars\"></div>\n        </section>\n\n        </div>\n\n        <div class=\"pt-meta\" id=\"pt-meta\">\n          <p class=\"pt-meta-item pt-meta-note\">BRUZZ beoordeelt de beloftes halfjaarlijks. <a class=\"pt-meta-link\" href=\"#pt-redactie\" data-scroll-redactie>Zo gaat de redactie te werk.</a></p>\n        </div>\n\n        </div>\n\n      </div>\n\n      <section class=\"pt-filters\" id=\"pt-filters\" aria-label=\"Beloftes filteren\">\n        <label class=\"pt-search\">\n          <span class=\"pt-sr\">Zoeken</span>\n          <svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"9\" r=\"5.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"m13.4 13.4 4 4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n          <input id=\"pt-searchInput\" type=\"search\" placeholder=\"Zoek op belofte of minister\" autocomplete=\"off\">\n        </label>\n\n        <div class=\"pt-selects\">\n          <label class=\"pt-select\" data-filter=\"status\">\n            <span class=\"pt-sr\">Status</span>\n            <select id=\"pt-statusFilter\"><option value=\"\">Alle statussen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"minister\">\n            <span class=\"pt-sr\">Minister</span>\n            <select id=\"pt-ministerFilter\"><option value=\"\">Alle ministers</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"party\">\n            <span class=\"pt-sr\">Partij</span>\n            <select id=\"pt-partyFilter\"><option value=\"\">Alle partijen</option></select>\n          </label>\n          <label class=\"pt-select\" data-filter=\"theme\">\n            <span class=\"pt-sr\">Thema</span>\n            <select id=\"pt-themeFilter\"><option value=\"\">Alle thema's</option></select>\n          </label>\n        </div>\n\n        <button class=\"pt-clear\" id=\"pt-clearFilters\" type=\"button\" hidden>Wis filters</button>\n      </section>\n\n      <div class=\"pt-results\">\n        <div class=\"pt-results-bar\" id=\"pt-resultsBar\">\n          <p class=\"pt-results-count\" id=\"pt-resultsMeta\" aria-live=\"polite\" hidden></p>\n          <button class=\"pt-filter-toggle\" id=\"pt-filterToggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"pt-filters\">Filters</button>\n        </div>\n        <div class=\"pt-cards\" id=\"pt-cardsContainer\">\n          <div class=\"pt-loading\">Aan het laden...</div>\n        </div>\n\n        <div class=\"pt-pager-wrap\" id=\"pt-paginationWrap\" hidden>\n          <button class=\"pt-showall\" id=\"pt-showAllToggle\" type=\"button\">Toon alles</button>\n          <div class=\"pt-pager\" id=\"pt-pagination\"></div>\n        </div>\n      </div>\n    </div>\n\n    <section class=\"pt-redactie\" id=\"pt-redactie\" aria-labelledby=\"pt-redactieTitle\">\n      <h3 class=\"pt-redactie-title\" id=\"pt-redactieTitle\">Redactionele aanpak</h3>\n      <p>BRUZZ Check is de politieke barometer van BRUZZ en volgt 25 concrete beloften uit het Brusselse regeerakkoord van februari 2026. Halfjaarlijks maakt de redactie de balans op. Op basis van vaste criteria en controleerbare bronnen krijgt elke belofte een status: \u2018niet gestart\u2019, \u2018gestart\u2019, \u2018op schema\u2019, \u2018niet op schema\u2019, \u2018gerealiseerd\u2019, \u2018mislukt\u2019 of \u2018niet verifieerbaar\u2019.</p>\n      <p>Meer weten over de werkwijze? Lees de <a class=\"pt-meta-link\" href=\"/node/214357\">veelgestelde vragen</a>.</p>\n    </section>\n  </div>";

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
        "Les Engagés": "#67dce9",
        "Les Engages": "#67dce9",
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
              name: "Laurent HUBLET",
              shortName: "Laurent HUBLET",
              partij: "Les Engagés",
              bg: "#05060a",
              image: "https://app.razuna.eu/file/remote?i=69e631bd25f5635dbfdd91b3&f=t&dl=t&c=3618157e1ee9e6eb0d8231ae1d06fc40&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiIvZmlsZS9yZW1vdGU_aT02OWU2MzFiZDI1ZjU2MzVkYmZkZDkxYjMmZj10JmRsPXQmYz0zNjE4MTU3ZTFlZTllNmViMGQ4MjMxYWUxZDA2ZmM0MCIsInR5cGUiOiJkaXJlY3QifQ.ea8EC6iSs_Rsfxkmd2wd18TRtsp9EOFyNnC1JzeJB5E",
              centerKicker: "Minister",
              centerTitle: "Laurent HUBLET",
              centerSubtitle: "Economie, Digitale Economie en Werk"
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
            }
          ];
      /* order: minister-president first, then the ministers A-Z by surname, then the state secretaries A-Z */
      { const o = ["Boris", "Dirk", "Laurent", "Ahmed", "Elke", "Audrey", "Karine", "Ans"]; MINISTERS.sort((a, b) => o.findIndex(n => a.name.indexOf(n) === 0) - o.findIndex(n => b.name.indexOf(n) === 0)); }

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
      const ARCH_ORDER = ["Boris","Dirk","Laurent","Ahmed","Elke","Audrey","Karine","Ans"];
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
            <div class="pt-arch-mid"><h2 class="pt-title pt-arch-ttl"><img class="pt-logo" alt="BRUZZ Check" src="${PT_LOGO}"></h2></div>`;
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

      /* second peg layout: the dots form a shape (data-plinko="shape" on the mount, or root.__plSet("shape") at runtime) */
      const PL_SHAPE_PEGS = [[123.1,50.9],[180.9,50.9],[138.7,53.0],[165.3,53.0],[108.8,56.0],[195.2,56.0],[152.0,60.5],[97.5,66.8],[206.5,66.8],[122.0,79.5],[142.0,79.5],[162.0,79.5],[182.0,79.5],[92.3,81.1],[211.7,81.1],[93.7,96.8],[210.3,96.8],[112.0,97.0],[132.0,97.0],[152.0,97.0],[172.0,97.0],[192.0,97.0],[101.2,110.2],[202.8,110.2],[142.0,114.5],[162.0,114.5],[53.7,118.1],[250.3,118.1],[38.5,120.5],[265.5,120.5],[68.7,120.9],[235.3,120.9],[112.5,121.8],[191.5,121.8],[82.1,127.8],[221.9,127.8],[25.7,128.9],[278.3,128.9],[152.0,132.0],[124.6,132.5],[179.4,132.5],[94.5,137.0],[209.5,137.0],[18.0,141.9],[286.0,141.9],[135.4,144.4],[168.6,144.4],[105.5,148.1],[198.5,148.1],[42.0,149.5],[62.0,149.5],[82.0,149.5],[222.0,149.5],[242.0,149.5],[262.0,149.5],[16.5,156.9],[287.5,156.9],[144.2,157.2],[159.8,157.2],[115.5,160.2],[188.5,160.2],[52.0,167.0],[72.0,167.0],[92.0,167.0],[212.0,167.0],[232.0,167.0],[252.0,167.0],[152.0,170.2],[20.8,171.3],[283.2,171.3],[123.4,173.2],[180.6,173.2],[31.4,182.6],[272.6,182.6],[91.2,185.3],[212.8,185.3],[129.9,186.7],[174.1,186.7],[106.5,187.3],[197.5,187.3],[76.0,187.6],[228.0,187.6],[45.1,188.7],[258.9,188.7],[60.6,189.6],[243.4,189.6],[133.1,201.4],[170.9,201.4]];
      /* fine decorative dots that fill the shape (the balls pass over them; only PL_SHAPE_PEGS are solid), x10 */
      const PL_SHAPE_DECOR = [1240,482,1296,482,1744,482,1800,482,1100,531,1156,531,1212,531,1268,531,1324,531,1380,531,1436,531,1604,531,1660,531,1716,531,1772,531,1828,531,1884,531,1940,531,1016,580,1072,580,1128,580,1184,580,1240,580,1296,580,1352,580,1408,580,1464,580,1520,580,1576,580,1632,580,1688,580,1744,580,1800,580,1856,580,1912,580,1968,580,2024,580,988,629,1044,629,1100,629,1156,629,1212,629,1268,629,1324,629,1380,629,1436,629,1492,629,1548,629,1604,629,1660,629,1716,629,1772,629,1828,629,1884,629,1940,629,1996,629,2052,629,960,678,1016,678,1072,678,1128,678,1184,678,1240,678,1296,678,1352,678,1408,678,1464,678,1520,678,1576,678,1632,678,1688,678,1744,678,1800,678,1856,678,1912,678,1968,678,2024,678,2080,678,932,727,988,727,1044,727,1100,727,1156,727,1212,727,1268,727,1324,727,1380,727,1436,727,1492,727,1548,727,1604,727,1660,727,1716,727,1772,727,1828,727,1884,727,1940,727,1996,727,2052,727,2108,727,904,776,960,776,1016,776,1072,776,1128,776,1184,776,1240,776,1296,776,1352,776,1408,776,1464,776,1520,776,1576,776,1632,776,1688,776,1744,776,1800,776,1856,776,1912,776,1968,776,2024,776,2080,776,2136,776,932,825,988,825,1044,825,1100,825,1156,825,1212,825,1268,825,1324,825,1380,825,1436,825,1492,825,1548,825,1604,825,1660,825,1716,825,1772,825,1828,825,1884,825,1940,825,1996,825,2052,825,2108,825,904,874,960,874,1016,874,1072,874,1128,874,1184,874,1240,874,1296,874,1352,874,1408,874,1464,874,1520,874,1576,874,1632,874,1688,874,1744,874,1800,874,1856,874,1912,874,1968,874,2024,874,2080,874,2136,874,932,923,988,923,1044,923,1100,923,1156,923,1212,923,1268,923,1324,923,1380,923,1436,923,1492,923,1548,923,1604,923,1660,923,1716,923,1772,923,1828,923,1884,923,1940,923,1996,923,2052,923,2108,923,960,972,1016,972,1072,972,1128,972,1184,972,1240,972,1296,972,1352,972,1408,972,1464,972,1520,972,1576,972,1632,972,1688,972,1744,972,1800,972,1856,972,1912,972,1968,972,2024,972,2080,972,932,1021,988,1021,1044,1021,1100,1021,1156,1021,1212,1021,1268,1021,1324,1021,1380,1021,1436,1021,1492,1021,1548,1021,1604,1021,1660,1021,1716,1021,1772,1021,1828,1021,1884,1021,1940,1021,1996,1021,2052,1021,2108,1021,960,1070,1016,1070,1072,1070,1128,1070,1184,1070,1240,1070,1296,1070,1352,1070,1408,1070,1464,1070,1520,1070,1576,1070,1632,1070,1688,1070,1744,1070,1800,1070,1856,1070,1912,1070,1968,1070,2024,1070,2080,1070,1044,1119,1100,1119,1156,1119,1212,1119,1268,1119,1324,1119,1380,1119,1436,1119,1492,1119,1548,1119,1604,1119,1660,1119,1716,1119,1772,1119,1828,1119,1884,1119,1940,1119,1996,1119,456,1168,512,1168,568,1168,624,1168,1072,1168,1128,1168,1184,1168,1240,1168,1296,1168,1352,1168,1408,1168,1464,1168,1520,1168,1576,1168,1632,1168,1688,1168,1744,1168,1800,1168,1856,1168,1912,1168,1968,1168,2416,1168,2472,1168,2528,1168,2584,1168,316,1217,372,1217,428,1217,484,1217,540,1217,596,1217,652,1217,708,1217,764,1217,1100,1217,1156,1217,1212,1217,1268,1217,1324,1217,1380,1217,1436,1217,1492,1217,1548,1217,1604,1217,1660,1217,1716,1217,1772,1217,1828,1217,1884,1217,1940,1217,2276,1217,2332,1217,2388,1217,2444,1217,2500,1217,2556,1217,2612,1217,2668,1217,2724,1217,288,1266,344,1266,400,1266,456,1266,512,1266,568,1266,624,1266,680,1266,736,1266,792,1266,848,1266,1184,1266,1240,1266,1296,1266,1352,1266,1408,1266,1464,1266,1520,1266,1576,1266,1632,1266,1688,1266,1744,1266,1800,1266,1856,1266,2192,1266,2248,1266,2304,1266,2360,1266,2416,1266,2472,1266,2528,1266,2584,1266,2640,1266,2696,1266,2752,1266,204,1315,260,1315,316,1315,372,1315,428,1315,484,1315,540,1315,596,1315,652,1315,708,1315,764,1315,820,1315,876,1315,1212,1315,1268,1315,1324,1315,1380,1315,1436,1315,1492,1315,1548,1315,1604,1315,1660,1315,1716,1315,1772,1315,1828,1315,2164,1315,2220,1315,2276,1315,2332,1315,2388,1315,2444,1315,2500,1315,2556,1315,2612,1315,2668,1315,2724,1315,2780,1315,2836,1315,176,1364,232,1364,288,1364,344,1364,400,1364,456,1364,512,1364,568,1364,624,1364,680,1364,736,1364,792,1364,848,1364,904,1364,960,1364,1296,1364,1352,1364,1408,1364,1464,1364,1520,1364,1576,1364,1632,1364,1688,1364,1744,1364,2080,1364,2136,1364,2192,1364,2248,1364,2304,1364,2360,1364,2416,1364,2472,1364,2528,1364,2584,1364,2640,1364,2696,1364,2752,1364,2808,1364,2864,1364,204,1413,260,1413,316,1413,372,1413,428,1413,484,1413,540,1413,596,1413,652,1413,708,1413,764,1413,820,1413,876,1413,932,1413,988,1413,1324,1413,1380,1413,1436,1413,1492,1413,1548,1413,1604,1413,1660,1413,1716,1413,2052,1413,2108,1413,2164,1413,2220,1413,2276,1413,2332,1413,2388,1413,2444,1413,2500,1413,2556,1413,2612,1413,2668,1413,2724,1413,2780,1413,2836,1413,176,1462,232,1462,288,1462,344,1462,400,1462,456,1462,512,1462,568,1462,624,1462,680,1462,736,1462,792,1462,848,1462,904,1462,960,1462,1016,1462,1072,1462,1352,1462,1408,1462,1464,1462,1520,1462,1576,1462,1632,1462,1688,1462,1968,1462,2024,1462,2080,1462,2136,1462,2192,1462,2248,1462,2304,1462,2360,1462,2416,1462,2472,1462,2528,1462,2584,1462,2640,1462,2696,1462,2752,1462,2808,1462,2864,1462,148,1511,204,1511,260,1511,316,1511,372,1511,428,1511,484,1511,540,1511,596,1511,652,1511,708,1511,764,1511,820,1511,876,1511,932,1511,988,1511,1044,1511,1100,1511,1380,1511,1436,1511,1492,1511,1548,1511,1604,1511,1660,1511,1940,1511,1996,1511,2052,1511,2108,1511,2164,1511,2220,1511,2276,1511,2332,1511,2388,1511,2444,1511,2500,1511,2556,1511,2612,1511,2668,1511,2724,1511,2780,1511,2836,1511,2892,1511,176,1560,232,1560,288,1560,344,1560,400,1560,456,1560,512,1560,568,1560,624,1560,680,1560,736,1560,792,1560,848,1560,904,1560,960,1560,1016,1560,1072,1560,1128,1560,1408,1560,1464,1560,1520,1560,1576,1560,1632,1560,1912,1560,1968,1560,2024,1560,2080,1560,2136,1560,2192,1560,2248,1560,2304,1560,2360,1560,2416,1560,2472,1560,2528,1560,2584,1560,2640,1560,2696,1560,2752,1560,2808,1560,2864,1560,148,1609,204,1609,260,1609,316,1609,372,1609,428,1609,484,1609,540,1609,596,1609,652,1609,708,1609,764,1609,820,1609,876,1609,932,1609,988,1609,1044,1609,1100,1609,1156,1609,1436,1609,1492,1609,1548,1609,1604,1609,1884,1609,1940,1609,1996,1609,2052,1609,2108,1609,2164,1609,2220,1609,2276,1609,2332,1609,2388,1609,2444,1609,2500,1609,2556,1609,2612,1609,2668,1609,2724,1609,2780,1609,2836,1609,2892,1609,176,1658,232,1658,288,1658,344,1658,400,1658,456,1658,512,1658,568,1658,624,1658,680,1658,736,1658,792,1658,848,1658,904,1658,960,1658,1016,1658,1072,1658,1128,1658,1184,1658,1464,1658,1520,1658,1576,1658,1856,1658,1912,1658,1968,1658,2024,1658,2080,1658,2136,1658,2192,1658,2248,1658,2304,1658,2360,1658,2416,1658,2472,1658,2528,1658,2584,1658,2640,1658,2696,1658,2752,1658,2808,1658,2864,1658,204,1707,260,1707,316,1707,372,1707,428,1707,484,1707,540,1707,596,1707,652,1707,708,1707,764,1707,820,1707,876,1707,932,1707,988,1707,1044,1707,1100,1707,1156,1707,1212,1707,1492,1707,1548,1707,1828,1707,1884,1707,1940,1707,1996,1707,2052,1707,2108,1707,2164,1707,2220,1707,2276,1707,2332,1707,2388,1707,2444,1707,2500,1707,2556,1707,2612,1707,2668,1707,2724,1707,2780,1707,2836,1707,232,1756,288,1756,344,1756,400,1756,456,1756,512,1756,568,1756,624,1756,680,1756,736,1756,792,1756,848,1756,904,1756,960,1756,1016,1756,1072,1756,1128,1756,1184,1756,1240,1756,1800,1756,1856,1756,1912,1756,1968,1756,2024,1756,2080,1756,2136,1756,2192,1756,2248,1756,2304,1756,2360,1756,2416,1756,2472,1756,2528,1756,2584,1756,2640,1756,2696,1756,2752,1756,2808,1756,260,1805,316,1805,372,1805,428,1805,484,1805,540,1805,596,1805,652,1805,708,1805,764,1805,820,1805,876,1805,932,1805,988,1805,1044,1805,1100,1805,1156,1805,1212,1805,1268,1805,1772,1805,1828,1805,1884,1805,1940,1805,1996,1805,2052,1805,2108,1805,2164,1805,2220,1805,2276,1805,2332,1805,2388,1805,2444,1805,2500,1805,2556,1805,2612,1805,2668,1805,2724,1805,2780,1805,344,1854,400,1854,456,1854,512,1854,568,1854,624,1854,680,1854,736,1854,792,1854,848,1854,904,1854,960,1854,1016,1854,1072,1854,1128,1854,1184,1854,1240,1854,1296,1854,1744,1854,1800,1854,1856,1854,1912,1854,1968,1854,2024,1854,2080,1854,2136,1854,2192,1854,2248,1854,2304,1854,2360,1854,2416,1854,2472,1854,2528,1854,2584,1854,2640,1854,2696,1854,428,1903,484,1903,540,1903,596,1903,652,1903,708,1903,764,1903,1100,1903,1156,1903,1212,1903,1268,1903,1324,1903,1716,1903,1772,1903,1828,1903,1884,1903,1940,1903,2276,1903,2332,1903,2388,1903,2444,1903,2500,1903,2556,1903,2612,1903,1240,1952,1296,1952,1352,1952,1688,1952,1744,1952,1800,1952,1268,2001,1324,2001,1716,2001,1772,2001];
      /* darker dotted outline of the shape, x10 */
      const PL_SHAPE_EDGE = [2480,1151,2430,1158,2383,1170,2337,1183,2293,1204,2250,1224,2211,1247,2168,1276,2127,1305,2091,1333,2055,1363,2022,1397,1989,1429,1950,1473,1922,1506,1890,1545,1862,1582,1833,1626,1808,1664,1786,1707,1761,1748,1739,1791,1720,1835,1705,1881,1689,1926,1680,1975,1678,2019,1701,2044,1740,2036,1777,2003,1815,1976,1857,1948,1904,1926,1949,1908,1997,1899,2045,1890,2094,1882,2149,1888,2193,1894,2248,1901,2298,1907,2339,1918,2389,1924,2445,1929,2490,1930,2540,1925,2589,1918,2636,1905,2679,1884,2720,1864,2756,1840,2799,1805,2826,1775,2855,1735,2877,1691,2896,1648,2905,1605,2909,1549,2907,1505,2900,1456,2889,1409,2870,1365,2848,1322,2821,1285,2789,1251,2755,1225,2713,1200,2670,1179,2625,1163,2576,1156,2532,1151,482,1151,432,1158,387,1173,345,1189,303,1213,264,1239,227,1275,199,1310,178,1349,159,1393,143,1438,135,1484,128,1533,135,1582,140,1629,155,1675,173,1716,201,1757,231,1793,265,1826,301,1853,344,1878,386,1899,433,1912,477,1924,524,1930,576,1930,625,1924,676,1920,725,1912,774,1906,822,1897,871,1889,920,1882,976,1887,1025,1895,1073,1905,1119,1921,1164,1937,1206,1961,1246,1990,1285,2024,1319,2044,1356,2032,1363,1993,1356,1943,1342,1897,1326,1852,1304,1808,1286,1764,1263,1722,1239,1679,1215,1637,1186,1597,1160,1560,1130,1521,1102,1485,1064,1446,1036,1413,1000,1378,958,1341,924,1313,888,1284,843,1256,807,1231,763,1210,719,1190,674,1175,627,1162,578,1156,534,1151,1232,479,1184,490,1136,502,1092,521,1050,545,1014,575,983,604,955,641,931,683,912,727,900,774,891,820,891,872,894,920,906,968,920,1010,944,1056,968,1094,999,1134,1032,1171,1062,1201,1097,1236,1135,1268,1172,1300,1208,1335,1249,1371,1277,1404,1311,1441,1346,1484,1374,1525,1401,1565,1428,1610,1452,1652,1474,1695,1497,1731,1536,1732,1561,1707,1582,1664,1608,1619,1632,1577,1657,1539,1685,1494,1716,1456,1749,1418,1780,1384,1821,1342,1858,1309,1894,1280,1932,1244,1967,1213,1999,1180,2034,1145,2062,1108,2089,1068,2112,1025,2131,980,2143,933,2149,890,2149,837,2143,788,2132,740,2115,695,2091,653,2066,615,2036,583,1998,551,1956,526,1916,505,1870,492,1822,482,1777,479,1726,483,1678,492,1632,506,1592,528,1554,554,1498,566,1462,537,1421,512,1375,495,1330,485,1284,479];
      /* silhouette outlines (x10) and a dense dotwork, for the pink shading variants */
      const PL_SHAPE_POLYS = [[2856,1310,2830,1277,2789,1235,2741,1201,2687,1171,2657,1162,2639,1153,2612,1146,2583,1145,2570,1140,2477,1139,2455,1145,2420,1146,2333,1171,2219,1225,2204,1238,2144,1275,2051,1351,2009,1395,1988,1412,1973,1433,1934,1472,1854,1571,1837,1604,1804,1646,1780,1688,1777,1700,1750,1742,1741,1766,1726,1790,1723,1808,1708,1832,1696,1862,1693,1880,1677,1919,1671,1943,1670,1966,1665,1979,1665,2021,1672,2036,1691,2055,1733,2055,1754,2041,1790,2006,1835,1974,1880,1948,1937,1929,1949,1920,1999,1912,2013,1907,2035,1906,2079,1895,2131,1895,2145,1900,2173,1901,2187,1906,2209,1907,2259,1918,2299,1919,2325,1930,2351,1930,2373,1936,2423,1936,2445,1942,2527,1942,2541,1937,2569,1936,2657,1911,2747,1863,2807,1814,2860,1751,2880,1718,2883,1706,2904,1664,2917,1612,2917,1568,2923,1546,2923,1512,2918,1499,2917,1470,2912,1457,2911,1440,2904,1412],[184,1310,136,1412,129,1439,128,1456,123,1469,122,1498,116,1520,117,1546,123,1568,123,1612,136,1664,153,1697,160,1718,180,1751,233,1814,293,1863,383,1911,471,1936,499,1937,513,1942,595,1942,617,1936,667,1936,681,1931,715,1930,741,1919,781,1918,795,1913,817,1912,867,1901,895,1900,909,1895,961,1895,1005,1906,1027,1907,1041,1912,1091,1920,1103,1929,1160,1948,1205,1974,1250,2006,1286,2041,1307,2055,1349,2055,1368,2036,1375,2020,1375,1980,1370,1967,1369,1944,1362,1916,1347,1880,1344,1862,1332,1832,1317,1808,1314,1790,1299,1766,1290,1742,1263,1700,1260,1688,1222,1625,1205,1607,1186,1571,1106,1472,1076,1443,1052,1412,1031,1395,989,1351,896,1275,875,1264,821,1225,707,1171,620,1146,585,1145,563,1139,470,1140,457,1145,428,1146,401,1153,383,1162,353,1171,299,1201,251,1235,218,1268],[1160,480,1112,497,1040,537,1016,560,995,575,966,605,946,632,923,671,904,710,891,749,890,766,879,809,879,917,891,965,904,1004,934,1064,972,1121,989,1139,996,1151,1084,1240,1115,1264,1148,1297,1169,1312,1202,1345,1223,1360,1331,1481,1405,1592,1459,1688,1468,1712,1486,1736,1497,1744,1543,1744,1554,1736,1572,1712,1581,1688,1635,1592,1709,1481,1817,1360,1838,1345,1871,1312,1892,1297,1925,1264,1956,1240,2035,1161,2068,1121,2106,1064,2136,1004,2161,916,2161,810,2156,797,2148,746,2132,701,2094,632,2074,605,2045,575,1997,535,1928,497,1880,480,1863,479,1811,467,1739,467,1717,473,1694,474,1631,493,1604,506,1556,537,1533,559,1525,563,1511,562,1484,537,1445,511,1418,497,1346,474,1323,473,1301,467,1229,467,1177,479]];
      const PL_SHAPE_DOTS = [1146,514,1190,514,1234,514,1278,514,1322,514,1366,514,1410,514,1630,514,1674,514,1718,514,1762,514,1806,514,1850,514,1894,514,1080,552,1124,552,1168,552,1212,552,1256,552,1300,552,1344,552,1388,552,1432,552,1476,552,1564,552,1608,552,1652,552,1696,552,1740,552,1784,552,1828,552,1872,552,1916,552,1960,552,1014,590,1058,590,1102,590,1146,590,1190,590,1234,590,1278,590,1322,590,1366,590,1410,590,1454,590,1498,590,1542,590,1586,590,1630,590,1674,590,1718,590,1762,590,1806,590,1850,590,1894,590,1938,590,1982,590,2026,590,992,628,1036,628,1080,628,1124,628,1168,628,1212,628,1256,628,1300,628,1344,628,1388,628,1432,628,1476,628,1520,628,1564,628,1608,628,1652,628,1696,628,1740,628,1784,628,1828,628,1872,628,1916,628,1960,628,2004,628,2048,628,970,666,1014,666,1058,666,1102,666,1146,666,1190,666,1234,666,1278,666,1322,666,1366,666,1410,666,1454,666,1498,666,1542,666,1586,666,1630,666,1674,666,1718,666,1762,666,1806,666,1850,666,1894,666,1938,666,1982,666,2026,666,2070,666,948,704,992,704,1036,704,1080,704,1124,704,1168,704,1212,704,1256,704,1300,704,1344,704,1388,704,1432,704,1476,704,1520,704,1564,704,1608,704,1652,704,1696,704,1740,704,1784,704,1828,704,1872,704,1916,704,1960,704,2004,704,2048,704,2092,704,926,742,970,742,1014,742,1058,742,1102,742,1146,742,1190,742,1234,742,1278,742,1322,742,1366,742,1410,742,1454,742,1498,742,1542,742,1586,742,1630,742,1674,742,1718,742,1762,742,1806,742,1850,742,1894,742,1938,742,1982,742,2026,742,2070,742,2114,742,904,780,948,780,992,780,1036,780,1080,780,1124,780,1168,780,1212,780,1256,780,1300,780,1344,780,1388,780,1432,780,1476,780,1520,780,1564,780,1608,780,1652,780,1696,780,1740,780,1784,780,1828,780,1872,780,1916,780,1960,780,2004,780,2048,780,2092,780,2136,780,926,818,970,818,1014,818,1058,818,1102,818,1146,818,1190,818,1234,818,1278,818,1322,818,1366,818,1410,818,1454,818,1498,818,1542,818,1586,818,1630,818,1674,818,1718,818,1762,818,1806,818,1850,818,1894,818,1938,818,1982,818,2026,818,2070,818,2114,818,904,856,948,856,992,856,1036,856,1080,856,1124,856,1168,856,1212,856,1256,856,1300,856,1344,856,1388,856,1432,856,1476,856,1520,856,1564,856,1608,856,1652,856,1696,856,1740,856,1784,856,1828,856,1872,856,1916,856,1960,856,2004,856,2048,856,2092,856,2136,856,926,894,970,894,1014,894,1058,894,1102,894,1146,894,1190,894,1234,894,1278,894,1322,894,1366,894,1410,894,1454,894,1498,894,1542,894,1586,894,1630,894,1674,894,1718,894,1762,894,1806,894,1850,894,1894,894,1938,894,1982,894,2026,894,2070,894,2114,894,904,932,948,932,992,932,1036,932,1080,932,1124,932,1168,932,1212,932,1256,932,1300,932,1344,932,1388,932,1432,932,1476,932,1520,932,1564,932,1608,932,1652,932,1696,932,1740,932,1784,932,1828,932,1872,932,1916,932,1960,932,2004,932,2048,932,2092,932,2136,932,926,970,970,970,1014,970,1058,970,1102,970,1146,970,1190,970,1234,970,1278,970,1322,970,1366,970,1410,970,1454,970,1498,970,1542,970,1586,970,1630,970,1674,970,1718,970,1762,970,1806,970,1850,970,1894,970,1938,970,1982,970,2026,970,2070,970,2114,970,948,1008,992,1008,1036,1008,1080,1008,1124,1008,1168,1008,1212,1008,1256,1008,1300,1008,1344,1008,1388,1008,1432,1008,1476,1008,1520,1008,1564,1008,1608,1008,1652,1008,1696,1008,1740,1008,1784,1008,1828,1008,1872,1008,1916,1008,1960,1008,2004,1008,2048,1008,2092,1008,970,1046,1014,1046,1058,1046,1102,1046,1146,1046,1190,1046,1234,1046,1278,1046,1322,1046,1366,1046,1410,1046,1454,1046,1498,1046,1542,1046,1586,1046,1630,1046,1674,1046,1718,1046,1762,1046,1806,1046,1850,1046,1894,1046,1938,1046,1982,1046,2026,1046,2070,1046,992,1084,1036,1084,1080,1084,1124,1084,1168,1084,1212,1084,1256,1084,1300,1084,1344,1084,1388,1084,1432,1084,1476,1084,1520,1084,1564,1084,1608,1084,1652,1084,1696,1084,1740,1084,1784,1084,1828,1084,1872,1084,1916,1084,1960,1084,2004,1084,2048,1084,1014,1122,1058,1122,1102,1122,1146,1122,1190,1122,1234,1122,1278,1122,1322,1122,1366,1122,1410,1122,1454,1122,1498,1122,1542,1122,1586,1122,1630,1122,1674,1122,1718,1122,1762,1122,1806,1122,1850,1122,1894,1122,1938,1122,1982,1122,2026,1122,464,1160,508,1160,552,1160,1036,1160,1080,1160,1124,1160,1168,1160,1212,1160,1256,1160,1300,1160,1344,1160,1388,1160,1432,1160,1476,1160,1520,1160,1564,1160,1608,1160,1652,1160,1696,1160,1740,1160,1784,1160,1828,1160,1872,1160,1916,1160,1960,1160,2004,1160,2488,1160,2532,1160,2576,1160,354,1198,398,1198,442,1198,486,1198,530,1198,574,1198,618,1198,662,1198,706,1198,1102,1198,1146,1198,1190,1198,1234,1198,1278,1198,1322,1198,1366,1198,1410,1198,1454,1198,1498,1198,1542,1198,1586,1198,1630,1198,1674,1198,1718,1198,1762,1198,1806,1198,1850,1198,1894,1198,1938,1198,2334,1198,2378,1198,2422,1198,2466,1198,2510,1198,2554,1198,2598,1198,2642,1198,2686,1198,288,1236,332,1236,376,1236,420,1236,464,1236,508,1236,552,1236,596,1236,640,1236,684,1236,728,1236,772,1236,1124,1236,1168,1236,1212,1236,1256,1236,1300,1236,1344,1236,1388,1236,1432,1236,1476,1236,1520,1236,1564,1236,1608,1236,1652,1236,1696,1236,1740,1236,1784,1236,1828,1236,1872,1236,1916,1236,2268,1236,2312,1236,2356,1236,2400,1236,2444,1236,2488,1236,2532,1236,2576,1236,2620,1236,2664,1236,2708,1236,2752,1236,266,1274,310,1274,354,1274,398,1274,442,1274,486,1274,530,1274,574,1274,618,1274,662,1274,706,1274,750,1274,794,1274,838,1274,1190,1274,1234,1274,1278,1274,1322,1274,1366,1274,1410,1274,1454,1274,1498,1274,1542,1274,1586,1274,1630,1274,1674,1274,1718,1274,1762,1274,1806,1274,1850,1274,2202,1274,2246,1274,2290,1274,2334,1274,2378,1274,2422,1274,2466,1274,2510,1274,2554,1274,2598,1274,2642,1274,2686,1274,2730,1274,2774,1274,244,1312,288,1312,332,1312,376,1312,420,1312,464,1312,508,1312,552,1312,596,1312,640,1312,684,1312,728,1312,772,1312,816,1312,860,1312,904,1312,1212,1312,1256,1312,1300,1312,1344,1312,1388,1312,1432,1312,1476,1312,1520,1312,1564,1312,1608,1312,1652,1312,1696,1312,1740,1312,1784,1312,1828,1312,2136,1312,2180,1312,2224,1312,2268,1312,2312,1312,2356,1312,2400,1312,2444,1312,2488,1312,2532,1312,2576,1312,2620,1312,2664,1312,2708,1312,2752,1312,2796,1312,222,1350,266,1350,310,1350,354,1350,398,1350,442,1350,486,1350,530,1350,574,1350,618,1350,662,1350,706,1350,750,1350,794,1350,838,1350,882,1350,926,1350,1278,1350,1322,1350,1366,1350,1410,1350,1454,1350,1498,1350,1542,1350,1586,1350,1630,1350,1674,1350,1718,1350,1762,1350,2114,1350,2158,1350,2202,1350,2246,1350,2290,1350,2334,1350,2378,1350,2422,1350,2466,1350,2510,1350,2554,1350,2598,1350,2642,1350,2686,1350,2730,1350,2774,1350,2818,1350,200,1388,244,1388,288,1388,332,1388,376,1388,420,1388,464,1388,508,1388,552,1388,596,1388,640,1388,684,1388,728,1388,772,1388,816,1388,860,1388,904,1388,948,1388,992,1388,1300,1388,1344,1388,1388,1388,1432,1388,1476,1388,1520,1388,1564,1388,1608,1388,1652,1388,1696,1388,1740,1388,2048,1388,2092,1388,2136,1388,2180,1388,2224,1388,2268,1388,2312,1388,2356,1388,2400,1388,2444,1388,2488,1388,2532,1388,2576,1388,2620,1388,2664,1388,2708,1388,2752,1388,2796,1388,2840,1388,178,1426,222,1426,266,1426,310,1426,354,1426,398,1426,442,1426,486,1426,530,1426,574,1426,618,1426,662,1426,706,1426,750,1426,794,1426,838,1426,882,1426,926,1426,970,1426,1014,1426,1322,1426,1366,1426,1410,1426,1454,1426,1498,1426,1542,1426,1586,1426,1630,1426,1674,1426,1718,1426,2026,1426,2070,1426,2114,1426,2158,1426,2202,1426,2246,1426,2290,1426,2334,1426,2378,1426,2422,1426,2466,1426,2510,1426,2554,1426,2598,1426,2642,1426,2686,1426,2730,1426,2774,1426,2818,1426,2862,1426,156,1464,200,1464,244,1464,288,1464,332,1464,376,1464,420,1464,464,1464,508,1464,552,1464,596,1464,640,1464,684,1464,728,1464,772,1464,816,1464,860,1464,904,1464,948,1464,992,1464,1036,1464,1344,1464,1388,1464,1432,1464,1476,1464,1520,1464,1564,1464,1608,1464,1652,1464,1696,1464,2004,1464,2048,1464,2092,1464,2136,1464,2180,1464,2224,1464,2268,1464,2312,1464,2356,1464,2400,1464,2444,1464,2488,1464,2532,1464,2576,1464,2620,1464,2664,1464,2708,1464,2752,1464,2796,1464,2840,1464,2884,1464,178,1502,222,1502,266,1502,310,1502,354,1502,398,1502,442,1502,486,1502,530,1502,574,1502,618,1502,662,1502,706,1502,750,1502,794,1502,838,1502,882,1502,926,1502,970,1502,1014,1502,1058,1502,1102,1502,1366,1502,1410,1502,1454,1502,1498,1502,1542,1502,1586,1502,1630,1502,1674,1502,1938,1502,1982,1502,2026,1502,2070,1502,2114,1502,2158,1502,2202,1502,2246,1502,2290,1502,2334,1502,2378,1502,2422,1502,2466,1502,2510,1502,2554,1502,2598,1502,2642,1502,2686,1502,2730,1502,2774,1502,2818,1502,2862,1502,156,1540,200,1540,244,1540,288,1540,332,1540,376,1540,420,1540,464,1540,508,1540,552,1540,596,1540,640,1540,684,1540,728,1540,772,1540,816,1540,860,1540,904,1540,948,1540,992,1540,1036,1540,1080,1540,1124,1540,1432,1540,1476,1540,1520,1540,1564,1540,1608,1540,1916,1540,1960,1540,2004,1540,2048,1540,2092,1540,2136,1540,2180,1540,2224,1540,2268,1540,2312,1540,2356,1540,2400,1540,2444,1540,2488,1540,2532,1540,2576,1540,2620,1540,2664,1540,2708,1540,2752,1540,2796,1540,2840,1540,2884,1540,178,1578,222,1578,266,1578,310,1578,354,1578,398,1578,442,1578,486,1578,530,1578,574,1578,618,1578,662,1578,706,1578,750,1578,794,1578,838,1578,882,1578,926,1578,970,1578,1014,1578,1058,1578,1102,1578,1146,1578,1454,1578,1498,1578,1542,1578,1586,1578,1894,1578,1938,1578,1982,1578,2026,1578,2070,1578,2114,1578,2158,1578,2202,1578,2246,1578,2290,1578,2334,1578,2378,1578,2422,1578,2466,1578,2510,1578,2554,1578,2598,1578,2642,1578,2686,1578,2730,1578,2774,1578,2818,1578,2862,1578,156,1616,200,1616,244,1616,288,1616,332,1616,376,1616,420,1616,464,1616,508,1616,552,1616,596,1616,640,1616,684,1616,728,1616,772,1616,816,1616,860,1616,904,1616,948,1616,992,1616,1036,1616,1080,1616,1124,1616,1168,1616,1476,1616,1520,1616,1564,1616,1872,1616,1916,1616,1960,1616,2004,1616,2048,1616,2092,1616,2136,1616,2180,1616,2224,1616,2268,1616,2312,1616,2356,1616,2400,1616,2444,1616,2488,1616,2532,1616,2576,1616,2620,1616,2664,1616,2708,1616,2752,1616,2796,1616,2840,1616,2884,1616,178,1654,222,1654,266,1654,310,1654,354,1654,398,1654,442,1654,486,1654,530,1654,574,1654,618,1654,662,1654,706,1654,750,1654,794,1654,838,1654,882,1654,926,1654,970,1654,1014,1654,1058,1654,1102,1654,1146,1654,1190,1654,1498,1654,1542,1654,1850,1654,1894,1654,1938,1654,1982,1654,2026,1654,2070,1654,2114,1654,2158,1654,2202,1654,2246,1654,2290,1654,2334,1654,2378,1654,2422,1654,2466,1654,2510,1654,2554,1654,2598,1654,2642,1654,2686,1654,2730,1654,2774,1654,2818,1654,2862,1654,200,1692,244,1692,288,1692,332,1692,376,1692,420,1692,464,1692,508,1692,552,1692,596,1692,640,1692,684,1692,728,1692,772,1692,816,1692,860,1692,904,1692,948,1692,992,1692,1036,1692,1080,1692,1124,1692,1168,1692,1212,1692,1476,1692,1520,1692,1564,1692,1828,1692,1872,1692,1916,1692,1960,1692,2004,1692,2048,1692,2092,1692,2136,1692,2180,1692,2224,1692,2268,1692,2312,1692,2356,1692,2400,1692,2444,1692,2488,1692,2532,1692,2576,1692,2620,1692,2664,1692,2708,1692,2752,1692,2796,1692,2840,1692,222,1730,266,1730,310,1730,354,1730,398,1730,442,1730,486,1730,530,1730,574,1730,618,1730,662,1730,706,1730,750,1730,794,1730,838,1730,882,1730,926,1730,970,1730,1014,1730,1058,1730,1102,1730,1146,1730,1190,1730,1234,1730,1806,1730,1850,1730,1894,1730,1938,1730,1982,1730,2026,1730,2070,1730,2114,1730,2158,1730,2202,1730,2246,1730,2290,1730,2334,1730,2378,1730,2422,1730,2466,1730,2510,1730,2554,1730,2598,1730,2642,1730,2686,1730,2730,1730,2774,1730,2818,1730,244,1768,288,1768,332,1768,376,1768,420,1768,464,1768,508,1768,552,1768,596,1768,640,1768,684,1768,728,1768,772,1768,816,1768,860,1768,904,1768,948,1768,992,1768,1036,1768,1080,1768,1124,1768,1168,1768,1212,1768,1256,1768,1784,1768,1828,1768,1872,1768,1916,1768,1960,1768,2004,1768,2048,1768,2092,1768,2136,1768,2180,1768,2224,1768,2268,1768,2312,1768,2356,1768,2400,1768,2444,1768,2488,1768,2532,1768,2576,1768,2620,1768,2664,1768,2708,1768,2752,1768,2796,1768,266,1806,310,1806,354,1806,398,1806,442,1806,486,1806,530,1806,574,1806,618,1806,662,1806,706,1806,750,1806,794,1806,838,1806,882,1806,926,1806,970,1806,1014,1806,1058,1806,1102,1806,1146,1806,1190,1806,1234,1806,1278,1806,1762,1806,1806,1806,1850,1806,1894,1806,1938,1806,1982,1806,2026,1806,2070,1806,2114,1806,2158,1806,2202,1806,2246,1806,2290,1806,2334,1806,2378,1806,2422,1806,2466,1806,2510,1806,2554,1806,2598,1806,2642,1806,2686,1806,2730,1806,2774,1806,332,1844,376,1844,420,1844,464,1844,508,1844,552,1844,596,1844,640,1844,684,1844,728,1844,772,1844,816,1844,860,1844,904,1844,948,1844,992,1844,1036,1844,1080,1844,1124,1844,1168,1844,1212,1844,1256,1844,1300,1844,1740,1844,1784,1844,1828,1844,1872,1844,1916,1844,1960,1844,2004,1844,2048,1844,2092,1844,2136,1844,2180,1844,2224,1844,2268,1844,2312,1844,2356,1844,2400,1844,2444,1844,2488,1844,2532,1844,2576,1844,2620,1844,2664,1844,2708,1844,398,1882,442,1882,486,1882,530,1882,574,1882,618,1882,662,1882,706,1882,750,1882,794,1882,838,1882,882,1882,1014,1882,1058,1882,1102,1882,1146,1882,1190,1882,1234,1882,1278,1882,1322,1882,1718,1882,1762,1882,1806,1882,1850,1882,1894,1882,1938,1882,1982,1882,2026,1882,2158,1882,2202,1882,2246,1882,2290,1882,2334,1882,2378,1882,2422,1882,2466,1882,2510,1882,2554,1882,2598,1882,2642,1882,508,1920,552,1920,596,1920,640,1920,1168,1920,1212,1920,1256,1920,1300,1920,1344,1920,1696,1920,1740,1920,1784,1920,1828,1920,1872,1920,2400,1920,2444,1920,2488,1920,2532,1920,1234,1958,1278,1958,1322,1958,1718,1958,1762,1958,1806,1958,1300,1996,1344,1996,1696,1996,1740,1996,1322,2034,1718,2034];
      const PL_DEF = MOUNT.getAttribute("data-plinko") || "atomium";
      let plShape = /^(shape|atomium)/.test(PL_DEF);
      let plShade = (PL_DEF) === "shape-dots" ? "dots" : (PL_DEF) === "shape-rim" ? "rim" : (PL_DEF) === "shape-fill" ? "fill" : /^atomium/.test(PL_DEF) ? "atom" : "classic";


      /* third layout: the Atomium. The balls drop into the top sphere, roll through the tubes and spheres and leave through the legs / the bottom sphere into their bucket. */
      const PL_ATOM_SPH = { T: [152, 40, 21], UL: [80, 78, 23.5], UR: [224, 78, 23.5], C: [152, 120, 27.5], LL: [92, 156, 21], LR: [212, 156, 21], B: [152, 188, 23] };   /* x, y, radius in the design box (desktop); the phone layout is shifted down */
      const PL_ATOM_TUBES = [["T", "UL"], ["T", "UR"], ["T", "C"], ["UL", "LL"], ["UR", "LR"], ["UL", "C"], ["UR", "C"], ["C", "LL"], ["C", "LR"], ["C", "B"], ["LL", "B"], ["LR", "B"]];
      const PL_ATOM_ROUTES = [
        [["T", "UL", "LL", "EL"], ["T", "C", "LL", "EL"], ["T", "UL", "C", "LL", "EL"]],
        [["T", "C", "B", "EB"], ["T", "UL", "C", "B", "EB"], ["T", "UR", "C", "B", "EB"], ["T", "UL", "LL", "B", "EB"], ["T", "UR", "LR", "B", "EB"]],
        [["T", "UR", "LR", "ER"], ["T", "C", "LR", "ER"], ["T", "UR", "C", "LR", "ER"]]
      ];
      /* three motion variants of the Atomium: G = gravity, vt = max speed in the top ball, vm = max speed further down, gap = seconds between balls, wave = balls per wave (0 = one by one), kick = random bounce inside the spheres, bounce = wall restitution */
      const PL_AV = [
        { G: 900, vt: 70, vm: 190, gap: .22, wave: 0, kick: 0, bounce: 1.25, orbit: 0 },      /* Optie 1: smooth glide, one by one */
        { G: 1200, vt: 110, vm: 230, gap: .08, wave: 0, kick: 25, bounce: 1.25, orbit: 0 },    /* Optie 2: pinball - fast, ricochets, quick fire */
        { G: 900, vt: 90, vm: 200, gap: .3, wave: 0, kick: 0, bounce: 1.25, orbit: 1 }        /* Optie 3: whirlpool - every ball spins round each sphere before it drops out */
      ];
      let plAV = /atomium3/.test(PL_DEF) ? 2 : /atomium2/.test(PL_DEF) ? 1 : 0;
      function plAtomGeom(BT) {
        const dy = BT - 220, sph = {}, spheres = [];
        Object.keys(PL_ATOM_SPH).forEach(k => { const q = PL_ATOM_SPH[k]; sph[k] = { x: q[0], y: q[1] + dy, r: q[2] }; spheres.push(sph[k]); });
        const HW = 6.2, tubes = PL_ATOM_TUBES.map(t => ({ ax: sph[t[0]].x, ay: sph[t[0]].y, bx: sph[t[1]].x, by: sph[t[1]].y, hw: HW }));
        const EL = { x: 56, y: BT + 6 }, ER = { x: 248, y: BT + 6 }, EB = { x: 152, y: BT + 6 };
        tubes.push({ ax: sph.LL.x, ay: sph.LL.y, bx: EL.x, by: BT + 14, hw: 6.4 }, { ax: sph.LR.x, ay: sph.LR.y, bx: ER.x, by: BT + 14, hw: 6.4 }, { ax: sph.B.x, ay: sph.B.y, bx: 152, by: BT + 14, hw: 6.4 });
        /* one-way gates: the tubes that lead to a bucket are closed for balls of the other buckets, so a ball can never end up in the wrong one */
        [9, 10, 11, 14].forEach(i => { tubes[i].only = 1; }); tubes[12].only = 0; tubes[13].only = 2;
        return { spheres, tubes, nodes: Object.assign({ EL, ER, EB }, sph), top: sph.T.y - sph.T.r };
      }
      /* keep a ball inside the free space (spheres + tubes): it must lie at least r inside one of the shapes */
      function plAtomWall(A, b, r) {
        let best = null, bd = 1e9;
        const test = (d, gx, gy) => { if (d < bd) { bd = d; best = [gx, gy]; } };
        for (let i = 0; i < A.spheres.length; i++) { const q = A.spheres[i], dx = b.x - q.x, dy = b.y - q.y, l = Math.hypot(dx, dy) || 1e-6; test(l - q.r, dx / l, dy / l); }
        const caps = A.tubes;
        for (let i = 0; i < caps.length; i++) {
          const t = caps[i]; if (t.only !== undefined && t.only !== b.bi) continue;
          const vx = t.bx - t.ax, vy = t.by - t.ay, L2 = vx * vx + vy * vy || 1;
          let u = ((b.x - t.ax) * vx + (b.y - t.ay) * vy) / L2; u = u < 0 ? 0 : u > 1 ? 1 : u;
          const qx = t.ax + u * vx, qy = t.ay + u * vy, dx = b.x - qx, dy = b.y - qy, l = Math.hypot(dx, dy) || 1e-6;
          test(l - t.hw, dx / l, dy / l);
        }
        if (bd <= -r || !best) return;
        const k = bd + r;
        b.x -= best[0] * k; b.y -= best[1] * k;
        const vn = b.vx * best[0] + b.vy * best[1];
        if (vn > 0) { const e = (A.av && A.av.bounce) || 1.25; b.vx -= e * vn * best[0]; b.vy -= e * vn * best[1]; }
      }
      /* halftone (dither) shading of the Atomium: a Path2D of dots, cached per geometry. Spheres and tubes are lit from the top left; dot size = amount of shade */
      function plAtomDither(A) {
        if (A.dither) return A.dither;
        const P = new Path2D(), g = 3.3, row = g * .866, L = [-.42, -.58, .7], ln = Math.hypot(L[0], L[1], L[2]);
        L[0] /= ln; L[1] /= ln; L[2] /= ln;
        let y0 = 1e9, y1 = -1e9; A.spheres.forEach(q => { y0 = Math.min(y0, q.y - q.r); y1 = Math.max(y1, q.y + q.r); });
        A.tubes.forEach(t => { y1 = Math.max(y1, t.by); });
        const shadeOf = (x, y) => {
          let best = null, bd = 1e9;
          for (let i = 0; i < A.spheres.length; i++) { const q = A.spheres[i], dx = x - q.x, dy = y - q.y, d = Math.hypot(dx, dy) / q.r; if (d < 1 && d < bd) { bd = d; best = { nx: dx / q.r, ny: dy / q.r, nz: Math.sqrt(1 - d * d), sphere: true }; } }
          if (best) { const l = Math.max(0, best.nx * L[0] + best.ny * L[1] + best.nz * L[2]); return 1 - (.05 + .95 * Math.pow(l, 1.25)); }
          let tb = null, td = 1e9;
          for (let i = 0; i < A.tubes.length; i++) {
            const t = A.tubes[i], vx = t.bx - t.ax, vy = t.by - t.ay, L2 = vx * vx + vy * vy || 1, u = ((x - t.ax) * vx + (y - t.ay) * vy) / L2;
            if (u < 0 || u > 1) continue;
            const len = Math.sqrt(L2), px = -vy / len, py = vx / len, sd = (x - (t.ax + u * vx)) * px + (y - (t.ay + u * vy)) * py, tt = sd / t.hw;
            if (Math.abs(tt) < 1 && Math.abs(tt) < td) { td = Math.abs(tt); tb = { nx: px * tt, ny: py * tt, nz: Math.sqrt(1 - tt * tt) }; }
          }
          if (!tb) return -1;
          const l = Math.max(0, tb.nx * L[0] + tb.ny * L[1] + tb.nz * L[2]);
          return .22 + .68 * (1 - Math.pow(l, .9));
        };
        for (let j = 0, y = y0; y <= y1 + 12; j++, y += row) {
          for (let x = 0; x <= PL_DW; x += g) {
            const xx = x + (j % 2 ? g / 2 : 0), sh = shadeOf(xx, y);
            if (sh < 0.04) continue;
            const r = Math.min(g * .5, g * .52 * Math.pow(sh, .8) + .12);
            if (r < .3) continue;
            P.moveTo(xx + r, y); P.arc(xx, y, r, 0, 6.3);
          }
        }
        A.dither = P; return P;
      }
      /* the inside of the Atomium (spheres + tubes, a hair smaller than the outline) - the dither dots are clipped to it so none stick out past the outline */
      function plAtomClip(A) {
        if (A.clipP) return A.clipP;
        const P = new Path2D(), I = .7;
        A.spheres.forEach(q => { P.moveTo(q.x + q.r - I, q.y); P.arc(q.x, q.y, q.r - I, 0, 6.2832); });
        A.tubes.forEach(t => {
          const vx = t.bx - t.ax, vy = t.by - t.ay, len = Math.hypot(vx, vy) || 1, h = t.hw - I, nx = -vy / len * h, ny = vx / len * h;
          let pts = [[t.ax + nx, t.ay + ny], [t.bx + nx, t.by + ny], [t.bx - nx, t.by - ny], [t.ax - nx, t.ay - ny]], a2 = 0;
          for (let i = 0; i < 4; i++) { const u = pts[i], v = pts[(i + 1) % 4]; a2 += u[0] * v[1] - v[0] * u[1]; }
          if (a2 < 0) pts = pts.reverse();
          P.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < 4; i++) P.lineTo(pts[i][0], pts[i][1]); P.closePath();
          P.moveTo(t.ax + h, t.ay); P.arc(t.ax, t.ay, h, 0, 6.2832); P.moveTo(t.bx + h, t.by); P.arc(t.bx, t.by, h, 0, 6.2832);
        });
        A.clipP = P; return P;
      }
      function plAtomSteer(C, b, dt) {
        const rt = b.route; if (!rt) return;
        const AV = C.av;
        let W = rt[b.k];
        while (b.k < rt.length - 1 && b.y >= W.y - 1) {
          const from = W; b.k++; W = rt[b.k];
          if (AV.orbit && from.r) { b.orb = { n: from, nx: W, th: Math.atan2(b.y - from.y, b.x - from.x), rho: Math.hypot(b.x - from.x, b.y - from.y), w: (b.bi === 1 ? (Math.random() < .5 ? 1 : -1) : (b.bi === 0 ? -1 : 1)) * (8 + Math.random() * 3), tm: 0, min: 1.2 + Math.random() * 1.4 }; b.vx = b.vy = 0; return; }
        }
        const a = AV.G * b.gs, rem = Math.max(0, W.y - b.y);
        const tr = Math.max(.16, (-b.vy + Math.sqrt(b.vy * b.vy + 2 * a * rem)) / a);
        const vdes = Math.max(-240, Math.min(240, (W.x - b.x) / tr));
        b.vx += (vdes - b.vx) * Math.min(1, 6 * dt);
        b.vx *= 1 - .8 * dt; b.vy *= 1 - .3 * dt;
        const vmax = b.k === 0 ? AV.vt : AV.vm; if (b.vy > vmax) b.vy = vmax;
        if (AV.kick && b.k > 0) b.vx += (Math.random() - .5) * AV.kick * 60 * dt;
      }
      /* whirlpool: the ball circles inside the sphere (on a circle just inside its wall) and leaves in the direction of the next tube */
      function plAtomOrbit(C, b, dt) {
        const o = b.orb, n = o.n, tgt = Math.atan2(o.nx.y - n.y, o.nx.x - n.x), want = n.r - C.r - 1.4;
        o.tm += dt; o.th += o.w * dt; o.rho += (want - o.rho) * Math.min(1, 7 * dt);
        b.x = n.x + o.rho * Math.cos(o.th); b.y = n.y + o.rho * Math.sin(o.th); b.vx = b.vy = 0;
        let d = Math.atan2(Math.sin(tgt - o.th), Math.cos(tgt - o.th));
        if (o.w < 0) d = -d;
        if (o.tm >= o.min && d >= 0 && d < Math.abs(o.w) * dt * 1.5 + .02) {
          const sp = 90; b.x = n.x + (want) * Math.cos(tgt); b.y = n.y + (want) * Math.sin(tgt); b.vx = sp * Math.cos(tgt); b.vy = sp * Math.sin(tgt); b.orb = null;
        }
      }

      function plCfg() {
        if (plShape && plShade === "atom") {
          const BT = PHONE_MQ.matches ? 236 : 220;
          return { cx: 152, cy: 100, dots: [], bw: 96, r: 4.8, BT, FL: PHONE_MQ.matches ? 280 : 256, atom: plAtomGeom(BT), av: PL_AV[plAV] };
        }
        if (plShape) {
          return { cx: 152, cy: 150, dots: PL_SHAPE_PEGS.map(p => ({ x: p[0], y: p[1] })), bw: 96, r: 4.3, BT: PHONE_MQ.matches ? 236 : 220, FL: PHONE_MQ.matches ? 280 : 256 };
        }
        const cx = 152, cy = 190, rows = [[[11, 14, 11], 140], [[8, 10, 8], 112], [[6, 7, 6], 84], [[4, 5, 4], 56]], dots = [], GAPA = .26, total = Math.PI - 2 * GAPA, FR = [.31, .38, .31];
        rows.forEach(r => {
          const cnt = r[0];
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
        /* the 8 dots (inner ring: centre section + first 3 of the right section) that stand for the 8 ministers */
        const gov = dots.slice(dots.length - 13 + 4, dots.length - 13 + 12);
        return { cx, cy, dots, gov, bw: 96, r: 4.3, BT: PHONE_MQ.matches ? 236 : 220, FL: PHONE_MQ.matches ? 280 : 256 };
      }

      function plBuild(C) {
        const balls = allPromises.map(row => {
          const key = statusKey(row["Status"]);
          const conf = STATUS_CONFIG[key] || { color: "#999" };
          const bi = key in PL_BUCKET_OF ? PL_BUCKET_OF[key] : 2;
          return { bi, key, col: conf.color, r: C.r, x: 0, y: PL_TOP + 6, vx: 0, vy: 0, on: false, landed: false, frozen: false, still: 0, calm: 0 };
        });
        for (let i = balls.length - 1; i > 0; i--) { const j = Math.floor(plRnd() * (i + 1)); const t = balls[i]; balls[i] = balls[j]; balls[j] = t; }
        balls.forEach(b => { b.tx = 8 + C.bw * b.bi + C.bw / 2 + (plRnd() - .5) * 44; b.x = C.cx + (plRnd() - .5) * 70; b.vx = (b.tx - C.cx) * .35 + (plRnd() - .5) * 30; b.gs = 1 - .1 * b.bi;
          if (C.atom) { C.atom.av = C.av; b.x = C.cx + (plRnd() - .5) * 6; b.y = C.atom.nodes.T.y - 4 + (plRnd() - .5) * 4; b.vx = 0; const R = PL_ATOM_ROUTES[b.bi]; b.route = R[Math.floor(plRnd() * R.length)].map(n => C.atom.nodes[n]); b.k = 0; }
        });
        if (C.atom) balls.forEach((b, i) => { const V = C.av; b.t0 = V.wave ? .2 + Math.floor(i / V.wave) * 1.7 + (i % V.wave) * V.gap : .2 + i * V.gap; }); else balls.slice().sort((a, b) => a.bi - b.bi).forEach((b, i) => { b.t0 = .25 + i * .16 + b.bi * .5; });
        return balls;
      }

      function plLanded(st, b) { b.landed = true; st.count[b.bi]++; st.ck[b.key] = (st.ck[b.key] || 0) + 1; }

      /* a ball may only come to rest on the floor, or in a pocket: supported from below on BOTH sides (a neighbouring ball or the wall) */
      function plSupported(C, B, b) {
        const r = C.r;
        if (b.y + r >= C.FL - .6) return true;
        const x0 = 8 + C.bw * b.bi + 2, x1 = 8 + C.bw * (b.bi + 1) - 2;
        let left = b.x <= x0 + r + .6, right = b.x >= x1 - r - .6;
        for (let k = 0; k < B.length; k++) {
          const o = B[k]; if (o === b || !o.on || o.bi !== b.bi || o.y < b.y + .25 * r) continue;
          const dx = o.x - b.x, dy = o.y - b.y;
          if (dx * dx + dy * dy > (2 * r + 1.4) * (2 * r + 1.4)) continue;
          if (dx < -.3 * r) left = true; else if (dx > .3 * r) right = true;
        }
        return left && right;
      }
      function plStep(C, st, dt) {
        const G = C.atom ? C.av.G : 1500, r = C.r, B = st.balls;
        B.forEach(b => {
          if (b.frozen || st.t < b.t0) return;
          b.on = true;
          if (b.orb) { plAtomOrbit(C, b, dt); return; }
          b.vy += G * b.gs * dt;
          if (!b.landed) {
            if (C.atom && !b.free && b.y < C.BT + 8) { plAtomSteer(C, b, dt); }
            else if (b.y < C.BT - 6) {
              // aim for the bucket like a thrown ball: the sideways speed that lands it in time, eased in smoothly
              const a = G * b.gs, rem = Math.max(0, C.BT - b.y);
              const tr = Math.max(.14, (-b.vy + Math.sqrt(b.vy * b.vy + 2 * a * rem)) / a);
              const vdes = Math.max(-260, Math.min(260, (b.tx - b.x) / tr));
              b.vx += (vdes - b.vx) * Math.min(1, (b.y < C.cy - 40 ? 2.5 : 7) * dt);
            } else { b.vx += (b.tx - b.x) * 14 * dt; b.vx *= 1 - 3 * dt; }
          }
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (C.atom && !b.free && b.y > C.BT + 1) {
            b.free = true;
            /* leave the pipe towards the emptiest part of the bucket, so the balls spread out instead of building a pyramid */
            const x0 = 8 + C.bw * b.bi + 2 + r + 1, x1 = 8 + C.bw * (b.bi + 1) - 2 - r - 1;
            let bestX = b.x, bestN = 1e9;
            for (let i = 0; i < 9; i++) {
              const cx2 = x0 + (x1 - x0) * (i + Math.random() * .6) / 9.6;
              let n = 0;
              for (let k = 0; k < B.length; k++) { const o = B[k]; if (o !== b && o.free && o.bi === b.bi && Math.abs(o.x - cx2) < 2.4 * r) n += 1 + (o.y < C.FL - 3 * r ? 2 : 0); }
              if (n < bestN) { bestN = n; bestX = cx2; }
            }
            b.tx = bestX; b.vx = Math.max(-170, Math.min(170, (bestX - b.x) * 5));
          }
          if (C.atom && !b.landed && !b.free && b.y < C.BT + 10) { plAtomWall(C.atom, b, r); }
          for (let i = 0; i < C.dots.length; i++) {
            const p = C.dots[i], dx = b.x - p.x, dy = b.y - p.y, d2 = dx * dx + dy * dy, m = r + (plShape ? 2.2 : 1.1);
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
                if (b.rescues > 8) { b.x = C.cx + (plRnd() - .5) * (C.atom ? 5 : 40); b.y = C.atom ? C.atom.nodes.T.y - 4 : PL_TOP + 6; b.vx = C.atom ? 0 : (b.tx - C.cx) * .3; b.vy = 0; b.rescues = 0; b.k = 0; b.free = false; }
                else { b.vx = (b.tx >= b.x ? 1 : -1) * (110 + plRnd() * 70); b.vy = (b.x < 22 || b.x > PL_DW - 22) ? -240 : -110; }
                b.an = null;
              }
            }
          }
          if (!b.landed && sp < 30) { b.still += dt; if (b.still > .3) { b.still = 0; b.vx = (plRnd() - .5) * 220; b.vy = -60; } } else b.still = 0;
          if (b.landed) {
            if (sp < 45) b.calm += dt; else b.calm = 0;
            if (b.calm > .22) {
              if (plSupported(C, B, b)) { b.frozen = true; b.vx = 0; b.vy = 0; }
              else { b.calm = 0; if (!b.slide) b.slide = plRnd() < .5 ? -1 : 1; b.vx += b.slide * 75; b.vy -= 20; }   // balanced on a single ball: it rolls off
            }
          }
        });
        for (let it = 0; it < 3; it++) for (let i = 0; i < B.length; i++) {
          const a = B[i]; if (!a.on) continue;
          for (let j = i + 1; j < B.length; j++) {
            const c2 = B[j]; if (!c2.on || c2.bi !== a.bi) continue;
            if (C.atom && ((a.y < C.BT + 12 && !a.free) || (c2.y < C.BT + 12 && !c2.free))) continue;
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
        /* the last ball is in: let everything settle for a moment, then freeze all balls (no more twitching) */
        if (C.atom && !st.fz && B.length && B.every(b => b.landed)) { st.doneT = (st.doneT || 0) + dt; if (st.doneT > 1.1) { st.fz = true; B.forEach(b => { b.frozen = true; b.vx = 0; b.vy = 0; }); } }
      }

      function plDraw(c, C, st) {
        const ink = "#17171c";
        if (plShape) {
          const poly = () => { PL_SHAPE_POLYS.forEach(P => { c.beginPath(); for (let i = 0; i < P.length; i += 2) { if (i) c.lineTo(P[i] / 10, P[i + 1] / 10); else c.moveTo(P[i] / 10, P[i + 1] / 10); } c.closePath(); }); };
          if (plShade === "fill" || plShade === "rim") {
            c.fillStyle = "#ffeef2"; c.lineJoin = "round";
            PL_SHAPE_POLYS.forEach(P => { c.beginPath(); for (let i = 0; i < P.length; i += 2) { if (i) c.lineTo(P[i] / 10, P[i + 1] / 10); else c.moveTo(P[i] / 10, P[i + 1] / 10); } c.closePath(); c.fill(); });
          }
          if (plShade === "dots") {
            c.fillStyle = "#f5b8c8";
            for (let i = 0; i < PL_SHAPE_DOTS.length; i += 2) { c.beginPath(); c.arc(PL_SHAPE_DOTS[i] / 10, PL_SHAPE_DOTS[i + 1] / 10, 1.25, 0, 6.3); c.fill(); }
          } else if (plShade === "rim") {
            c.fillStyle = "#f5b8c8";
            for (let i = 0; i < PL_SHAPE_EDGE.length; i += 2) { c.beginPath(); c.arc(PL_SHAPE_EDGE[i] / 10, PL_SHAPE_EDGE[i + 1] / 10, 1.35, 0, 6.3); c.fill(); }
          } else if (plShade === "classic") {
            c.fillStyle = "#eee8eb";
            for (let i = 0; i < PL_SHAPE_DECOR.length; i += 2) { c.beginPath(); c.arc(PL_SHAPE_DECOR[i] / 10, PL_SHAPE_DECOR[i + 1] / 10, 1.05, 0, 6.3); c.fill(); }
            c.fillStyle = "#c4bbc1";
            for (let i = 0; i < PL_SHAPE_EDGE.length; i += 2) { c.beginPath(); c.arc(PL_SHAPE_EDGE[i] / 10, PL_SHAPE_EDGE[i + 1] / 10, .9, 0, 6.3); c.fill(); }
          }
        }
        if (C.atom && st.hover >= 0 && st.hover < 3) { const hx = 8 + C.bw * st.hover; c.fillStyle = "rgba(242,184,200,.22)"; c.fillRect(hx + 2, C.BT, C.bw - 4, C.FL + 4 - C.BT); }   /* bucket highlight sits behind the pipes */
        if (plShape && plShade === "atom" && C.atom) {
          const A = C.atom, OUT = "#f3b5c7", FILL = "#fff6f9";
          c.save(); c.beginPath(); c.rect(0, PL_TOP, PL_DW, C.BT + 10 - PL_TOP); c.clip(); c.lineCap = "round"; c.lineJoin = "round";
          const layer = (g, col) => {
            c.fillStyle = col; c.strokeStyle = col;
            A.spheres.forEach(q => { c.beginPath(); c.arc(q.x, q.y, q.r + g, 0, 6.3); c.fill(); });
            A.tubes.forEach(t => { c.lineWidth = 2 * t.hw + 2 * g; c.beginPath(); c.moveTo(t.ax, t.ay); c.lineTo(t.bx, t.by); c.stroke(); });
          };
          layer(.8, OUT); layer(0, FILL);
          c.save(); c.clip(plAtomClip(A)); c.globalAlpha = .13; c.fillStyle = "#f1a7bd"; c.fill(plAtomDither(A)); c.restore();   /* halftone shading inside the shapes only: dots grow where the metal is in shadow */
          c.strokeStyle = "#fff"; c.lineCap = "round";
          { const n = st.balls.reduce((m, b) => m + (b.on ? 1 : 0), 0), Cq = A.nodes.C;
            c.textAlign = "center"; c.fillStyle = "#ff0033"; c.font = "800 23px " + st.font; c.fillText(String(n), Cq.x, Cq.y + 4);
            c.fillStyle = "#ff0033"; c.font = "800 6.3px " + st.font; if ("letterSpacing" in c) c.letterSpacing = ".3px"; c.fillText(n === 1 ? "BELOFTE" : "BELOFTES", Cq.x, Cq.y + 14); if ("letterSpacing" in c) c.letterSpacing = "0px"; }
          c.restore();
        }
        C.dots.forEach(p => { c.fillStyle = (plShape && plShade !== "classic") ? "#8f858c" : "#c9c1c6"; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 6.3); c.fill(); });
        if (!plShape && C.gov) {
          const hi = plHiMinister();
          const m = hi != null ? MINISTERS[hi] : null;
          const pos = m ? PL_GOV_ORDER.findIndex(n => String(m.name || "").toUpperCase().includes(n)) : -1;
          if (pos >= 0 && pos < C.gov.length) {
            C.gov.forEach(p => { c.fillStyle = "#ffe9ee"; c.beginPath(); c.arc(p.x, p.y, 3.4, 0, 6.3); c.fill(); });
            const g = C.gov[pos];
            c.fillStyle = "#f5b8c8"; c.beginPath(); c.arc(g.x, g.y, 4.8, 0, 6.3); c.fill();
          }
        }
        c.textAlign = "center"; c.fillStyle = ink;
        if (!plShape) {
          c.font = "900 30px " + st.font; c.fillText(String(st.total), C.cx, C.cy - 9);
          c.font = "600 10.5px " + st.font; c.fillStyle = ink; c.fillText("beloftes", C.cx, C.cy + 4);
        }
        PL_BUCKETS.forEach((bk, i) => {
          const x = 8 + C.bw * i, mid = x + C.bw / 2;
          if (st.hover === i && !C.atom) { c.fillStyle = "rgba(242,184,200,.22)"; c.fillRect(x + 2, C.BT, C.bw - 4, C.FL + 4 - C.BT); }
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
        if (plIris) { cancelAnimationFrame(plRaf); plRaf = 0; plRun++; plSim = null; irisPlay(); return; }
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
      /* hovering or selecting a minister lights up the minister dots in the parliament */
      const PL_GOV_ORDER = ["HUBLET", "DE SMEDT", "LAAOUEJ", "VAN DEN BRANDT", "DILLI", "HENRY", "PERSOONS", "LALIEUX"]; /* left to right on the inner ring */
      let plHover = null;
      function plHiMinister() { return plHover != null ? plHover : activeMinisterIndex; }
      const plHiRefresh = () => { if (plSim && !plRaf) plPaint(); };
      root.addEventListener("mouseover", e => { const b = e.target.closest && e.target.closest("[data-minister-index]"); const v = b ? Number(b.dataset.ministerIndex) : null; if (v !== plHover) { plHover = v; plHiRefresh(); } });
      root.addEventListener("focusin", e => { const b = e.target.closest && e.target.closest("[data-minister-index]"); if (b) { plHover = Number(b.dataset.ministerIndex); plHiRefresh(); } });
      root.addEventListener("focusout", () => { plHover = null; plHiRefresh(); });
      root.addEventListener("click", () => setTimeout(plHiRefresh, 0));
      /* ---- iris view (Optie 2): every promise is an iris; its colour AND pose tell the status ---- */
      const IRIS_LEAF = "M16.6 134.2Q11.2 140.2 7.2 148.8Q3.2 157.2 2.6 159.6Q2.0 162.0 1.5 166.9Q1.0 171.8 0.5 172.9Q0.0 174.0 0.5 182.4Q1.0 190.8 2.1 195.1Q3.2 199.5 6.8 206.5Q10.2 213.5 14.8 218.9Q19.2 224.2 24.2 228.4Q29.2 232.5 36.8 236.5Q44.2 240.5 51.6 242.6Q59.0 244.8 61.4 244.8Q63.8 244.8 64.9 245.2Q66.0 245.8 78.9 245.2Q91.8 244.8 92.9 244.2Q94.0 243.8 96.9 243.8Q99.8 243.8 101.9 242.8Q104.0 241.8 107.4 241.8Q110.8 241.8 111.9 241.2Q113.0 240.8 114.9 240.8Q116.8 240.8 120.9 239.8Q125.0 238.8 127.4 238.8Q129.8 238.8 130.9 238.2Q132.0 237.8 136.4 237.8Q140.8 237.8 144.4 238.8Q148.0 239.8 154.9 240.8Q161.8 241.8 163.4 242.8Q165.0 243.8 168.8 244.9Q172.5 246.0 177.0 248.5Q181.5 251.0 190.2 257.9Q199.0 264.8 201.9 264.8Q204.8 264.8 206.6 263.1Q208.5 261.5 209.1 260.1Q209.8 258.8 209.8 255.4Q209.8 252.0 208.8 247.0Q207.8 242.0 206.4 238.8Q205.0 235.5 204.8 233.9Q204.5 232.2 200.0 222.2Q195.5 212.2 191.0 204.2Q186.5 196.2 183.8 192.9Q181.0 189.5 179.8 186.9Q178.5 184.2 171.5 175.6Q164.5 167.0 155.0 157.1Q145.5 147.2 137.5 140.8Q129.5 134.2 127.9 133.5Q126.2 132.8 121.9 129.5Q117.5 126.2 108.0 121.8Q98.5 117.2 91.1 115.1Q83.8 113.0 80.9 113.0Q78.0 113.0 76.9 112.5Q75.8 112.0 67.4 112.0Q59.0 112.0 57.9 112.5Q56.8 113.0 54.4 113.0Q52.0 113.0 45.6 115.1Q39.2 117.2 34.8 119.8Q30.2 122.2 26.1 125.2Q22.0 128.2 16.6 134.2Z";
      const IRIS_HEART = "M164.0 1.0Q159.0 2.0 155.6 3.1Q152.2 4.2 145.8 7.8Q139.2 11.2 133.8 16.1Q128.2 21.0 124.2 26.6Q120.2 32.2 118.2 36.2Q116.2 40.2 114.1 48.6Q112.0 57.0 112.0 65.9Q112.0 74.8 114.1 82.1Q116.2 89.5 118.8 94.5Q121.2 99.5 126.2 106.5Q131.2 113.5 138.6 121.0Q146.0 128.5 157.9 138.8Q169.8 149.0 178.8 159.1Q187.8 169.2 193.8 178.2Q199.8 187.2 205.0 197.4Q210.2 207.5 211.8 209.5Q213.2 211.5 214.1 212.1Q215.0 212.8 218.9 212.8Q222.8 212.8 225.1 210.1Q227.5 207.5 232.8 197.4Q238.0 187.2 244.0 178.2Q250.0 169.2 259.0 159.1Q268.0 149.0 279.9 138.8Q291.8 128.5 298.1 122.1Q304.5 115.8 310.5 107.6Q316.5 99.5 319.0 94.5Q321.5 89.5 323.6 82.1Q325.8 74.8 325.8 65.9Q325.8 57.0 324.8 52.0Q323.8 47.0 322.6 43.6Q321.5 40.2 319.5 36.2Q317.5 32.2 313.5 26.6Q309.5 21.0 304.0 16.1Q298.5 11.2 292.0 7.8Q285.5 4.2 282.1 3.1Q278.8 2.0 273.8 1.0Q268.8 0.0 261.4 0.0Q254.0 0.0 252.9 0.5Q251.8 1.0 249.9 1.0Q248.0 1.0 242.6 2.6Q237.2 4.2 234.2 5.8Q231.2 7.2 225.5 11.6Q219.8 16.0 218.4 15.8Q217.0 15.5 214.8 13.4Q212.5 11.2 209.5 9.2Q206.5 7.2 203.5 5.8Q200.5 4.2 195.1 2.6Q189.8 1.0 187.9 1.0Q186.0 1.0 184.9 0.5Q183.8 0.0 176.4 0.0Q169.0 0.0 164.0 1.0Z";
      const IRIS_ORDER = ["GELUKT", "OP SCHEMA", "GESTART", "NIET OP SCHEMA", "NIET GESTART", "MISLUKT", "GEDWARSBOOMD", "GEBLOKKEERD", "ONVERIFIEERBAAR"];
      /* lr = leaf rotation (+ closes the leaves, - opens or droops them), ls = leaf size, hs = heart size (0 = no heart) */
      const IRIS_POSE = {
        "GELUKT": { lr: 0, ls: 1, hs: 1 }, "OP SCHEMA": { lr: 0, ls: 1, hs: .8 }, "GESTART": { lr: 4, ls: .96, hs: .5 },
        "NIET OP SCHEMA": { lr: -14, ls: .95, hs: 0 }, "NIET GESTART": { lr: 26, ls: .84, hs: 0 }, "MISLUKT": { lr: -20, ls: .92, hs: 0 },
        "GEDWARSBOOMD": { lr: -20, ls: .92, hs: 0 }, "GEBLOKKEERD": { lr: -20, ls: .92, hs: 0 }, "ONVERIFIEERBAAR": { lr: 0, ls: 1, hs: 0, ghost: 1 }
      };
      let plIris = (PL_DEF) === "iris";
      function irisBuild() {
        const host = $("pt-iris");
        if (!host) return;
        const rows = allPromises.map((r, n) => ({ r, n, key: statusKey(r["Status"]) }));
        rows.sort((a, b) => (IRIS_ORDER.indexOf(a.key) - IRIS_ORDER.indexOf(b.key)) || (a.n - b.n));
        const cols = Math.max(1, Math.ceil(Math.sqrt(rows.length)));
        host.style.setProperty("--ir-cols", cols);
        host.innerHTML = '<div class="pt-iris-grid">' + rows.map((o, i) => {
          const P = IRIS_POSE[o.key] || IRIS_POSE["MISLUKT"], col = (STATUS_CONFIG[o.key] || { color: "#999" }).color;
          const rr = Math.floor(i / cols), cc = i % cols;
          const d = (rr * .2 + cc * .2 + ((i * 37) % 7) * .05).toFixed(2), ld = ((rr + cc) * .04 + ((i * 37) % 7) * .02).toFixed(2);
          const tip = escapeHtml(getDisplayValue(o.r["Promise"]).trim()) + " \u2013 " + escapeHtml(statusLabel(o.key));
          return '<div class="pt-iris-cell' + (P.ghost ? " pt-iris-ghost" : "") + '" title="' + tip + '" style="--d:' + d + 's;--ld:' + ld + 's;--lr:' + P.lr + 'deg;--ls:' + P.ls + ';--hs:' + P.hs + ';color:' + col + '">' +
            '<svg viewBox="0 0 437 265" aria-hidden="true"><path class="pt-iris-leaf" d="' + IRIS_LEAF + '" fill="' + col + '"/>' +
            '<g transform="translate(437 0) scale(-1 1)"><path class="pt-iris-leaf" d="' + IRIS_LEAF + '" fill="' + col + '"/></g>' +
            (P.hs ? '<path class="pt-iris-heart" d="' + IRIS_HEART + '" fill="' + col + '"/>' : "") + '</svg></div>';
        }).join("") + "</div>";
      }
      function irisPlay() {
        const host = $("pt-iris");
        if (!host) return;
        irisBuild();
        host.classList.remove("pt-iris-go"); void host.offsetWidth; host.classList.add("pt-iris-go");
        const cv = $("pt-plinkoCv"); if (cv) cv.setAttribute("aria-label", "Beloftes per status");
      }
      const plTitle = () => {
        const e = root.querySelector(".pt-status-title-long"); if (e) e.style.display = "none";
        const sec = $("pt-plinko"); if (sec) sec.dataset.view = plIris ? "iris" : (plShape ? "shape" : "parliament");
      };
      plTitle();
      root.__plSet = mode => {
        plIris = mode === "iris"; plShape = /^(shape|atomium)/.test(mode); if (/^atomium/.test(mode)) plAV = mode === "atomium3" ? 2 : mode === "atomium2" ? 1 : 0; plShade = mode === "shape-fill" ? "fill" : mode === "shape-dots" ? "dots" : mode === "shape-rim" ? "rim" : /^atomium/.test(mode) ? "atom" : "classic"; plTitle();
        if (plIris) { plStarted = true; irisPlay(); } else plinkoStart(true);
        return mode;
      };
      /* temporary test switch: Optie 1 = parliament, Optie 2 = the Brussels iris made of pegs (hide it with data-toggle="off" on the mount) */
      if ((MOUNT.getAttribute("data-toggle") || "") === "on") {
        const bar = document.createElement("div");
        bar.className = "pt-optie-toggle"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Weergave");
        let cur = "atomium";
        const OPT = [["atomium", "Optie 1"], ["atomium2", "Optie 2"], ["atomium3", "Optie 3"]], btns = [];
        const paint = () => btns.forEach(x => { const on = x.m === cur; x.b.setAttribute("aria-pressed", String(on)); x.b.classList.toggle("is-on", on); });
        OPT.forEach(o => { const b = document.createElement("button"); b.type = "button"; b.textContent = o[1]; b.addEventListener("click", () => { cur = o[0]; root.__plSet(o[0]); paint(); const t = $("pt-plinko"); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "nearest" }); }); btns.push({ m: o[0], b }); bar.appendChild(b); });
        document.body.appendChild(bar); paint();
      }
      /* keep the question under the logo on ONE line: shrink the font until it fits the column */
      (function () {
        const els = () => Array.prototype.slice.call(MOUNT.querySelectorAll(".pt-subtitle, .pt-mq"));
        function fit() {
          els().forEach(el => {
            if (!el.offsetParent) return;
            el.style.whiteSpace = "nowrap"; el.style.removeProperty("font-size");
            const box = el.parentElement, avail = box ? box.clientWidth : el.clientWidth;
            let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
            while (el.scrollWidth > avail + 0.5 && fs > 12 && n++ < 40) { fs -= 0.5; el.style.setProperty("font-size", fs + "px", "important"); }
          });
        }
        let q = false; const queue = () => { if (q) return; q = true; requestAnimationFrame(() => { q = false; fit(); }); };
        window.addEventListener("resize", queue);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
        [0, 300, 1200].forEach(t => setTimeout(queue, t));
        if (window.ResizeObserver) { try { new ResizeObserver(queue).observe(MOUNT); } catch (e) {} }
      })();
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
