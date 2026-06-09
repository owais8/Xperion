/* ════════════════════════════════════════════════════════════════════
   XPERION · Abstract art for insight / blog card pictures
   ────────────────────────────────────────────────────────────────────
   Injects an original, brand-palette SVG artwork into every blog card
   picture (.insight-card-art on the Insights index, .lp-insight-art on
   the landing). Six distinct generative styles assigned by position so
   no two adjacent cards repeat. Subtle SMIL motion, dropped under
   prefers-reduced-motion (the static art still shows). The artwork sits
   behind the existing CSS gradient + the category badge, so if the
   script never runs the cards still look intentional.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.insight-card-art, .lp-insight-art'));
  if (!nodes.length) return;

  var P = { teal: '#00C9A7', green: '#3DDC97', amber: '#F59E0B', gold: '#FCD34D', violet: '#7C3AED', white: '#FFFFFF' };

  function lg(id, stops, x2, y2) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 == null ? '1' : x2) + '" y2="' + (y2 == null ? '1' : y2) + '">' + stops + '</linearGradient>';
  }
  function rg(id, stops, cx, cy, r) {
    return '<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' + stops + '</radialGradient>';
  }
  function st(o, c, op) { return '<stop offset="' + o + '" stop-color="' + c + '"' + (op != null ? ' stop-opacity="' + op + '"' : '') + '/>'; }
  function aFloat(attr, vals, dur) { return reduced ? '' : '<animate attributeName="' + attr + '" values="' + vals + '" dur="' + dur + '" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>'; }
  function aSpin(cx, cy, dur, to) { return reduced ? '' : '<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 ' + cx + ' ' + cy + '" to="' + (to == null ? 360 : to) + ' ' + cx + ' ' + cy + '" dur="' + dur + '" repeatCount="indefinite"/>'; }
  function aDim(values, dur, begin) { return reduced ? '' : '<animate attributeName="opacity" values="' + values + '" dur="' + dur + '" begin="' + (begin || '0s') + '" repeatCount="indefinite"/>'; }

  /* Soft, drifting colour base prepended to EVERY card so the sparse line/ring
     styles read as boldly as the blob styles — no card looks empty. */
  function glow(seed) {
    var sets = [[P.teal, P.amber], [P.violet, P.teal], [P.amber, P.green], [P.teal, P.violet], [P.green, P.amber], [P.amber, P.teal]];
    var c = sets[seed % sets.length];
    return '<defs><filter id="gl' + uid + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="28"/></filter></defs>'
      + '<g filter="url(#gl' + uid + ')" opacity="0.72">'
      + '<circle cx="92" cy="70" r="84" fill="' + c[0] + '">' + aFloat('cx', '92;132;92', '16s') + '</circle>'
      + '<circle cx="242" cy="152" r="96" fill="' + c[1] + '" opacity="0.9">' + aFloat('cy', '152;112;152', '19s') + '</circle>'
      + '</g>';
  }

  /* Each style returns the inner SVG markup for a 320×180 (16:9) canvas. */
  function aurora(a, b, c) {
    return '<defs><filter id="ab' + uid + '" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter></defs>'
      + '<g filter="url(#ab' + uid + ')">'
      + '<circle cx="78" cy="58" r="76" fill="' + a + '" opacity="0.52">' + aFloat('cx', '78;112;78', '15s') + '</circle>'
      + '<circle cx="248" cy="132" r="86" fill="' + b + '" opacity="0.40">' + aFloat('cy', '132;98;132', '17s') + '</circle>'
      + '<circle cx="186" cy="40" r="58" fill="' + c + '" opacity="0.34">' + aFloat('cx', '186;152;186', '19s') + '</circle>'
      + '</g>';
  }
  function contour(a, b, c) {
    var defs = '<defs>' + lg('cg' + uid, st('0%', a) + st('55%', b) + st('100%', c), 1, 0) + '</defs>';
    var lines = '';
    for (var i = 0; i < 9; i++) {
      var y = 18 + i * 19, ph = (i % 2 ? 14 : -10);
      lines += '<path d="M-12 ' + y + ' C 70 ' + (y + ph) + ', 150 ' + (y - ph) + ', 332 ' + (y + ph * 0.4) + '" fill="none" stroke="url(#cg' + uid + ')" stroke-width="1.8" opacity="' + (0.5 + (i % 3) * 0.1) + '"/>';
    }
    return defs + '<g>' + lines + (reduced ? '' : '<animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="12s" repeatCount="indefinite"/>') + '</g>';
  }
  function orbital(a, b, c) {
    var cx = 196, cy = 92;
    var rings = '<g fill="none" stroke="' + a + '" stroke-opacity="0.55" stroke-width="1.6">'
      + '<circle cx="' + cx + '" cy="' + cy + '" r="34"/><circle cx="' + cx + '" cy="' + cy + '" r="60"/><circle cx="' + cx + '" cy="' + cy + '" r="86" stroke="' + c + '" stroke-opacity="0.42"/></g>';
    var dots = '<g>' + aSpin(cx, cy, '24s')
      + '<circle cx="' + (cx + 60) + '" cy="' + cy + '" r="4.5" fill="' + b + '"/>'
      + '<circle cx="' + cx + '" cy="' + (cy - 34) + '" r="3.5" fill="' + a + '"/>'
      + '<circle cx="' + (cx - 86) + '" cy="' + cy + '" r="3" fill="' + c + '"/></g>';
    var dots2 = '<g>' + aSpin(cx, cy, '34s', -360)
      + '<circle cx="' + (cx - 60) + '" cy="' + cy + '" r="3" fill="' + P.white + '" opacity="0.8"/>'
      + '<circle cx="' + cx + '" cy="' + (cy + 60) + '" r="2.6" fill="' + b + '"/></g>';
    var core = '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + b + '">' + aDim('0.6;1;0.6', '4s') + '</circle>';
    return rings + dots + dots2 + core;
  }
  function constellation(a, b, c) {
    var pts = [[40, 50], [96, 30], [150, 70], [120, 120], [60, 140], [210, 46], [260, 96], [228, 140], [300, 60], [186, 110]];
    var lines = '<g stroke="' + a + '" stroke-opacity="0.22" stroke-width="1">';
    var pairs = [[0, 1], [1, 2], [2, 5], [5, 6], [6, 7], [2, 3], [3, 4], [0, 4], [6, 8], [2, 9], [9, 6]];
    for (var i = 0; i < pairs.length; i++) {
      var p = pts[pairs[i][0]], q = pts[pairs[i][1]];
      lines += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '"/>';
    }
    lines += '</g>';
    var dots = '<g>';
    for (var j = 0; j < pts.length; j++) {
      var accent = (j % 4 === 0), col = accent ? b : (j % 3 === 0 ? c : P.white);
      dots += '<circle cx="' + pts[j][0] + '" cy="' + pts[j][1] + '" r="' + (accent ? 3.4 : 2.2) + '" fill="' + col + '" opacity="' + (accent ? 0.95 : 0.6) + '">' + aDim((accent ? '0.95;0.5;0.95' : '0.6;0.25;0.6'), (5 + (j % 4)) + 's', (-(j * 0.6)) + 's') + '</circle>';
    }
    dots += '</g>';
    return lines + dots;
  }
  function flow(a, b, c) {
    var defs = '<defs>' + lg('fg' + uid, st('0%', a, 0) + st('25%', a) + st('60%', b) + st('100%', c, 0.2), 1, 0) + '</defs>';
    var paths = '';
    for (var i = 0; i < 6; i++) {
      var o = i * 9 - 12;
      paths += '<path d="M-20 ' + (54 + o) + ' C 70 ' + (14 + o) + ', 180 ' + (118 + o) + ', 340 ' + (44 + o) + '" fill="none" stroke="url(#fg' + uid + ')" stroke-width="1.6" opacity="' + (0.3 + (i % 3) * 0.14) + '"/>';
    }
    return defs + '<g>' + paths + (reduced ? '' : '<animateTransform attributeName="transform" type="translate" values="0 0;14 0;0 0" dur="16s" repeatCount="indefinite"/>') + '</g>';
  }
  function prism(a, b, c) {
    var defs = '<defs>' + lg('pg' + uid, st('0%', a) + st('100%', b), 1, 1) + lg('pg2' + uid, st('0%', c) + st('100%', a, 0.2), 0, 1) + '</defs>';
    var shards = '<g opacity="0.85">'
      + '<polygon points="0,0 150,0 60,180 0,180" fill="url(#pg' + uid + ')" opacity="0.5"/>'
      + '<polygon points="150,0 250,0 150,180 70,180" fill="url(#pg2' + uid + ')" opacity="0.45"/>'
      + '<polygon points="250,0 320,0 320,180 175,180" fill="url(#pg' + uid + ')" opacity="0.35"/>'
      + '</g>';
    var beam = reduced ? '' : '<rect x="-60" y="0" width="40" height="180" fill="' + P.white + '" opacity="0.10"><animate attributeName="x" values="-60;360" dur="7s" repeatCount="indefinite"/></rect>';
    return defs + '<g>' + shards + beam + '</g>';
  }

  /* Palette rotations so each style also varies in colour. */
  var styles = [
    function () { return aurora(P.teal, P.amber, P.violet); },
    function () { return contour(P.teal, P.green, P.amber); },
    function () { return orbital(P.teal, P.gold, P.violet); },
    function () { return constellation(P.teal, P.amber, P.green); },
    function () { return flow(P.violet, P.teal, P.amber); },
    function () { return prism(P.amber, P.violet, P.teal); }
  ];

  var uid = 0;
  nodes.forEach(function (el, i) {
    if (el.querySelector('.insight-art-svg')) return;          // idempotent
    uid = i + 1;                                               // unique ids per card
    var inner = glow(i) + styles[i % styles.length]();         // colour base + distinctive motif
    var svg = '<svg class="insight-art-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" '
      + 'style="position:absolute;inset:0;width:100%;height:100%;display:block" aria-hidden="true" focusable="false">'
      + inner + '</svg>';
    el.insertAdjacentHTML('afterbegin', svg);                  // behind the badge (which follows in the DOM)
  });
})();
