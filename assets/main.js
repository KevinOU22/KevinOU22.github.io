(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const announce = (msg) => { const el = $("[data-announce]"); if (el) el.textContent = msg; };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: fine */ } }
  };

  const COLORS = { red: "#d6262f", green: "#1f8a5a", indigo: "#2546a8" };
  const NAMES = { hello: "Hello", deca: "DECA", mun: "Model UN", music: "Music", scouts: "Scouts", court: "Court & Canvas", code: "Code", photos: "Photos", findme: "Find me" };
  const spreads = $$(".spread[data-station]");
  const stamped = new Set(store.get("ko-stamps", []).filter((s) => NAMES[s]));

  /* ── stamps ─────────────────────────────────────── */
  const NS = "http://www.w3.org/2000/svg";
  function stampSVG(id, icon, label) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 128 128");
    svg.setAttribute("class", "stamp__ink");
    svg.setAttribute("aria-hidden", "true");
    const pathId = "arc-" + id;
    svg.innerHTML =
      `<defs><path id="${pathId}" d="M64 64 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>` +
      `<circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" stroke-width="4.5"/>` +
      `<circle cx="64" cy="64" r="36" fill="none" stroke="currentColor" stroke-width="2"/>` +
      `<text class="stamp__label"><textPath href="#${pathId}" startOffset="25%" text-anchor="middle">${label.toUpperCase()}</textPath></text>` +
      `<text class="stamp__label" style="font-size:9px"><textPath href="#${pathId}" startOffset="75%" text-anchor="middle">KEVIN OU · RALLY</textPath></text>` +
      `<use href="#${icon}" x="42" y="40" width="44" height="44"/>` +
      `<text class="stamp__date" x="64" y="94" text-anchor="middle">2026</text>`;
    return svg;
  }

  spreads.forEach((sec) => {
    const id = sec.dataset.station;
    let spot = $(".stampspot", sec);
    const sign = $(".sign", sec);
    if (!spot && sign) { spot = document.createElement("div"); spot.className = "stampspot stampspot--sign"; sign.appendChild(spot); }
    if (!spot) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stamp";
    btn.dataset.station = id;
    btn.style.setProperty("--sr", (Math.round(Math.random() * 24) - 14) + "deg");
    btn.innerHTML = `<span class="stamp__ghost"><svg aria-hidden="true"><use href="#${sec.dataset.icon}"/></svg>press</span>`;
    btn.appendChild(stampSVG(id, sec.dataset.icon, NAMES[id]));
    btn.setAttribute("aria-label", `Stamp the ${NAMES[id]} station`);
    spot.appendChild(btn);
    btn.addEventListener("click", () => press(id, btn));
  });

  /* rally rings */
  const ringsEl = $("#rally-rings");
  spreads.forEach((sec) => {
    const id = sec.dataset.station;
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ring";
    b.dataset.station = id;
    b.style.setProperty("--c", COLORS[sec.dataset.color] || COLORS.red);
    b.style.setProperty("--rr", (Math.round(Math.random() * 30) - 15) + "deg");
    b.innerHTML = `<svg aria-hidden="true"><use href="#${sec.dataset.icon}"/></svg><span class="sr">${NAMES[id]}</span>`;
    b.addEventListener("click", () => sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }));
    li.appendChild(b);
    ringsEl.appendChild(li);
  });

  const rally = $(".rally");
  const rallyHead = $(".rally__head");
  rallyHead.addEventListener("click", () => {
    const open = rally.classList.toggle("is-open");
    rallyHead.setAttribute("aria-expanded", String(open));
  });

  let helloVisible = true;
  const narrow = window.matchMedia("(max-width: 640px)");
  const hello = $("#hello");
  if (hello) {
    new IntersectionObserver(([e]) => {
      helloVisible = e.isIntersecting;
      if (rally.dataset.pinned || narrow.matches) return;
      rally.classList.toggle("is-open", e.isIntersecting);
      rallyHead.setAttribute("aria-expanded", String(e.isIntersecting));
    }, { threshold: 0.35 }).observe(hello);
  }
  rallyHead.addEventListener("click", () => { rally.dataset.pinned = "1"; });

  function render() {
    $$(".stamp").forEach((b) => {
      const on = stamped.has(b.dataset.station);
      b.classList.toggle("is-stamped", on);
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", on ? `${NAMES[b.dataset.station]} stamped` : `Stamp the ${NAMES[b.dataset.station]} station`);
    });
    $$(".ring").forEach((r) => {
      const on = stamped.has(r.dataset.station);
      r.classList.toggle("is-on", on);
      r.setAttribute("aria-label", `${NAMES[r.dataset.station]}: ${on ? "stamped" : "not stamped yet"}. Go there.`);
    });
    $$(".route a").forEach((a) => a.classList.toggle("is-stamped", stamped.has(a.dataset.station)));
    $("[data-count]").textContent = stamped.size;
    $(".rally__done").hidden = stamped.size < spreads.length;
  }

  function press(id, btn) {
    if (stamped.has(id)) return;
    stamped.add(id);
    store.set("ko-stamps", [...stamped]);
    btn.classList.add("is-pressing");
    btn.addEventListener("animationend", () => btn.classList.remove("is-pressing"), { once: true });
    thunk();
    render();
    announce(`${NAMES[id]} stamped. ${stamped.size} of ${spreads.length}.`);
    if (stamped.size < spreads.length) {
      rally.classList.add("is-open"); rallyHead.setAttribute("aria-expanded", "true");
      clearTimeout(press.t);
      press.t = setTimeout(() => { if ((helloVisible && !narrow.matches) || rally.dataset.pinned) return; rally.classList.remove("is-open"); rallyHead.setAttribute("aria-expanded", "false"); }, 2200);
    }
    if (stamped.size === spreads.length) {
      setTimeout(celebrate, 350);
      clearTimeout(press.t);
      rally.classList.add("is-open"); rallyHead.setAttribute("aria-expanded", "true");
      announce("Rally complete! You collected every stamp.");
    }
  }

  $(".rally__reset").addEventListener("click", () => {
    stamped.clear();
    store.set("ko-stamps", []);
    render();
    announce("Stamps cleared.");
  });
  render();

  /* ── route scroll-spy (top line + side tabs) ───── */
  const stationLinks = $$(".route a[data-station], .tabs a[data-station]");
  const track = $(".route__track");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.station;
      stationLinks.forEach((a) => {
        const on = a.dataset.station === id;
        a.classList.toggle("is-here", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
      const a = $(`.route a[data-station="${id}"]`);
      if (a && track && track.scrollWidth > track.clientWidth) {
        track.scrollTo({ left: a.parentElement.offsetLeft - track.clientWidth / 2 + a.offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spreads.forEach((s) => spy.observe(s));

  /* ── progress train on the route ───────────────── */
  const routeDots = $$(".route__line .route__dot");
  let dotX = [];
  function measureRoute() {
    if (!track) return;
    const tr = track.getBoundingClientRect();
    dotX = routeDots.map((d) => { const r = d.getBoundingClientRect(); return r.left - tr.left + track.scrollLeft + r.width / 2; });
    if (dotX.length < 2) return;
    track.style.setProperty("--rail-l", dotX[0] + "px");
    track.style.setProperty("--rail-w", dotX[dotX.length - 1] - dotX[0] + "px");
    moveTrain();
  }
  let trainRaf = 0;
  function moveTrain() {
    trainRaf = 0;
    if (dotX.length < 2) return;
    const mid = scrollY + innerHeight * 0.45;
    let i = 0;
    for (let k = 0; k < spreads.length; k++) if (spreads[k].offsetTop <= mid) i = k;
    const sec = spreads[i], next = spreads[i + 1];
    const end = document.documentElement.scrollHeight - innerHeight * 0.55;
    const span = Math.max(1, (next ? next.offsetTop : end) - sec.offsetTop);
    const f = Math.min(1, Math.max(0, (mid - sec.offsetTop) / span));
    const to = dotX[i + 1] !== undefined ? dotX[i + 1] : dotX[i];
    const x = dotX[i] + (to - dotX[i]) * f;
    track.style.setProperty("--train-x", x + "px");
    track.style.setProperty("--done", ((x - dotX[0]) / (dotX[dotX.length - 1] - dotX[0])).toFixed(4));
  }
  addEventListener("scroll", () => { if (!trainRaf) trainRaf = requestAnimationFrame(moveTrain); }, { passive: true });
  addEventListener("resize", measureRoute);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureRoute);
  measureRoute();

  /* ── scroll reveal: each spread's pieces get placed once ── */
  if ("IntersectionObserver" in window) {
    spreads.forEach((sec) => {
      $$(".scrap, .rank, .postcard", sec).forEach((el, i) => {
        const d = 0.14 + Math.min(i, 8) * 0.065 + (i % 3) * 0.012; // non-uniform, capped
        el.style.setProperty("--d", d.toFixed(3) + "s");
      });
    });
    spreads.forEach((sec) => { if (sec.getBoundingClientRect().top < innerHeight * 0.9) sec.classList.add("is-in"); });
    const rootEl = document.documentElement;
    rootEl.classList.add("reveal-on", "reveal-init");
    requestAnimationFrame(() => requestAnimationFrame(() => rootEl.classList.remove("reveal-init")));
    const rv = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); rv.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -18% 0px" });
    spreads.forEach((sec) => { if (!sec.classList.contains("is-in")) rv.observe(sec); });
  }

  /* ── drag the scraps ────────────────────────────── */
  if (finePointer) {
    const GRID = 8;
    $$("[data-drag]").forEach((el) => {
      let sx = 0, sy = 0, bx = 0, by = 0, id = null;
      const sec = el.closest(".spread");
      el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || e.target.closest("a, button")) return;
        id = e.pointerId;
        el.setPointerCapture(id);
        sx = e.clientX; sy = e.clientY;
        bx = parseFloat(el.style.getPropertyValue("--dx")) || 0;
        by = parseFloat(el.style.getPropertyValue("--dy")) || 0;
        el.classList.add("is-grabbed");
        sec && sec.classList.add("is-focusing");
      });
      el.addEventListener("pointermove", (e) => {
        if (e.pointerId !== id) return;
        el.style.setProperty("--dx", bx + e.clientX - sx + "px");
        el.style.setProperty("--dy", by + e.clientY - sy + "px");
      });
      const drop = (e) => {
        if (e.pointerId !== id) return;
        id = null;
        const dx = Math.round((parseFloat(el.style.getPropertyValue("--dx")) || 0) / GRID) * GRID;
        const dy = Math.round((parseFloat(el.style.getPropertyValue("--dy")) || 0) / GRID) * GRID;
        el.style.setProperty("--dx", dx + "px");
        el.style.setProperty("--dy", dy + "px");
        el.classList.remove("is-grabbed");
        sec && sec.classList.remove("is-focusing");
      };
      el.addEventListener("pointerup", drop);
      el.addEventListener("pointercancel", drop);
    });
  }

  /* ── pocket: pull out the business plan ─────────── */
  $$("[data-pocket]").forEach((p) => {
    const card = $(".pocket__card", p);
    const detail = $(".pocket__detail", p);
    card.addEventListener("click", () => {
      if (p.classList.contains("is-open")) return;
      p.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
      detail.hidden = false;
    });
  });

  /* ── placard flip ───────────────────────────────── */
  $$(".placard").forEach((b) => b.addEventListener("click", () => {
    b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
  }));

  /* ── rail tickets: punch ────────────────────────── */
  $$(".railticket").forEach((b) => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    if (on) click(1800, 0.05);
  }));

  /* ── receipts: print the rest ───────────────────── */
  $$("button.receipt").forEach((b) => b.addEventListener("click", () => {
    b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true"));
  }));

  /* ── crayons: pick trail colour ─────────────────── */
  const crayons = $$(".crayon");
  let trailColor = store.get("ko-trail", "#d6262f");
  if (!crayons.some((c) => c.dataset.trail === trailColor)) trailColor = "#d6262f";
  const setCrayon = (c) => {
    trailColor = c;
    crayons.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.trail === c)));
    store.set("ko-trail", c);
  };
  setCrayon(trailColor);
  crayons.forEach((c) => c.addEventListener("click", () => { setCrayon(c.dataset.trail); announce("Cursor trail color changed."); }));

  /* ── percussion (Web Audio) ─────────────────────── */
  let ac = null;
  const ctx = () => {
    if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
    if (ac.state === "suspended") ac.resume();
    return ac;
  };
  function noiseBuf(a, secs) {
    const b = a.createBuffer(1, a.sampleRate * secs, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  const sounds = {
    snare(a) {
      const t = a.currentTime;
      const n = a.createBufferSource(); n.buffer = noiseBuf(a, .25);
      const hp = a.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1400;
      const g = a.createGain(); g.gain.setValueAtTime(.7, t); g.gain.exponentialRampToValueAtTime(.001, t + .2);
      n.connect(hp).connect(g).connect(a.destination); n.start(t); n.stop(t + .25);
      const o = a.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(140, t + .08);
      const og = a.createGain(); og.gain.setValueAtTime(.5, t); og.gain.exponentialRampToValueAtTime(.001, t + .1);
      o.connect(og).connect(a.destination); o.start(t); o.stop(t + .12);
    },
    timpani(a) {
      const t = a.currentTime;
      const o = a.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(92, t + 1.2);
      const g = a.createGain(); g.gain.setValueAtTime(.001, t); g.gain.exponentialRampToValueAtTime(.9, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + 1.6);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + 1.7);
      const n = a.createBufferSource(); n.buffer = noiseBuf(a, .08);
      const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600;
      const ng = a.createGain(); ng.gain.setValueAtTime(.4, t); ng.gain.exponentialRampToValueAtTime(.001, t + .07);
      n.connect(lp).connect(ng).connect(a.destination); n.start(t);
    },
    triangle(a) {
      const t = a.currentTime;
      [2637, 3951, 5274].forEach((f, i) => {
        const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f;
        const g = a.createGain(); g.gain.setValueAtTime(.18 / (i + 1), t); g.gain.exponentialRampToValueAtTime(.0005, t + 2.2);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + 2.3);
      });
    }
  };
  function hit(name) {
    const a = ctx(); if (!a || !sounds[name]) return;
    sounds[name](a);
    const pad = $(`.pad[data-sound="${name}"]`);
    if (pad) { pad.classList.remove("is-hit"); void pad.offsetWidth; pad.classList.add("is-hit"); setTimeout(() => pad.classList.remove("is-hit"), 140); }
  }
  function click(freq, len) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime;
    const n = a.createBufferSource(); n.buffer = noiseBuf(a, len);
    const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq;
    const g = a.createGain(); g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + len);
    n.connect(bp).connect(g).connect(a.destination); n.start(t);
  }
  function thunk() {
    const a = ctx(); if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(60, t + .1);
    const g = a.createGain(); g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .14);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + .15);
  }
  $$(".pad").forEach((p) => p.addEventListener("pointerdown", (e) => { e.preventDefault(); hit(p.dataset.sound); }));
  $$(".pad").forEach((p) => p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(p.dataset.sound); } }));
  const keyMap = { s: "snare", t: "timpani", a: "triangle" };
  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, textarea")) return;
    const s = keyMap[e.key.toLowerCase()];
    const music = $("#music").getBoundingClientRect();
    if (s && music.top < innerHeight && music.bottom > 0) hit(s);
  });

  /* ── cursor trail: waxy crayon stroke + crumbs ──── */
  const trail = $(".trail");
  const tctx = trail.getContext("2d");
  let dpr = 1, W = 0, H = 0;
  const pts = [];      // stroke spine (eased head positions)
  const crumbs = [];   // little bits of wax that flake off
  const marks = [];    // click stamps
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    [trail, $(".confetti")].forEach((c) => { c.width = W * dpr; c.height = H * dpr; });
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  // Crayon wax texture: solid colour with paper "tooth" knocked out and lighter wax streaks.
  const waxCache = new Map();
  function wax(color) {
    if (waxCache.has(color)) return waxCache.get(color);
    const c = document.createElement("canvas"); c.width = c.height = 120;
    const g = c.getContext("2d");
    g.fillStyle = color; g.fillRect(0, 0, 120, 120);
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 900; i++) {           // paper tooth: tiny gaps the wax skipped
      g.globalAlpha = 0.35 + rnd() * 0.65;
      g.fillRect(rnd() * 120, rnd() * 120, 0.6 + rnd() * 1.6, 0.6 + rnd() * 1.1);
    }
    g.globalAlpha = 0.28; g.lineWidth = 0.7; g.strokeStyle = "#000";
    for (let i = 0; i < 46; i++) {            // diagonal drag marks
      const x = rnd() * 140 - 10, y = rnd() * 140 - 10, l = 6 + rnd() * 16;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y - l * 0.45); g.stroke();
    }
    g.globalCompositeOperation = "source-atop";
    g.globalAlpha = 0.18; g.fillStyle = "#fff";
    for (let i = 0; i < 60; i++) g.fillRect(rnd() * 120, rnd() * 120, 2 + rnd() * 5, 1);  // waxy sheen
    const pat = tctx.createPattern(c, "repeat");
    waxCache.set(color, pat);
    return pat;
  }

  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const LIFE = 460;
  let mx = -99, my = -99, hx = -99, hy = -99, live = false, travel = 0;

  function flake(x, y, n, force) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = force * (0.3 + Math.random());
      crumbs.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.6 - 0.3, s: 1 + Math.random() * 2.2, r: Math.random() * 3, t: performance.now(), c: trailColor });
    }
    if (crumbs.length > 160) crumbs.splice(0, crumbs.length - 160);
  }

  if (!reduceMotion) {
    if (finePointer) {
      window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        if (!live) { hx = mx = e.clientX; hy = my = e.clientY; live = true; }
        travel += Math.hypot(e.clientX - mx, e.clientY - my);
        mx = e.clientX; my = e.clientY;
        if (travel > 16) { travel = 0; flake(mx, my, 1, 0.7); }
        kick();
      }, { passive: true });
      document.addEventListener("pointerleave", () => { live = false; });
    }
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a, button, [data-drag], input")) return;
      marks.push({ x: e.clientX, y: e.clientY, t: performance.now(), r: Math.random() * 0.8 - 0.4, c: trailColor });
      flake(e.clientX, e.clientY, 12, 2.2);
      kick();
    }, { passive: true });
  }

  function star(c, R, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R; c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
    c.closePath();
  }

  function draw(now) {
    raf = 0;
    tctx.clearRect(0, 0, W, H);

    if (live) {
      hx += (mx - hx) * 0.42; hy += (my - hy) * 0.42;
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(hx - last.x, hy - last.y) > 1.2) pts.push({ x: hx, y: hy, t: now, j: 0.75 + Math.random() * 0.5 });
    }
    while (pts.length && now - pts[0].t > LIFE) pts.shift();
    if (pts.length > 64) pts.splice(0, pts.length - 64);

    // the crayon stroke: tapered, ragged edge, wax texture fixed to the "paper"
    const n = pts.length;
    if (n > 2) {
      const left = [], right = [];
      for (let i = 0; i < n; i++) {
        const p = pts[i], q = pts[Math.min(i + 1, n - 1)], o = pts[Math.max(i - 1, 0)];
        let dx = q.x - o.x, dy = q.y - o.y; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
        const age = 1 - (now - p.t) / LIFE;
        const w = (0.6 + 6.5 * Math.pow(i / (n - 1), 0.85) * Math.max(0, age)) * p.j;
        left.push([p.x - dy * w, p.y + dx * w]); right.push([p.x + dy * w * (2 - p.j), p.y - dx * w * (2 - p.j)]);
      }
      tctx.beginPath();
      tctx.moveTo(left[0][0], left[0][1]);
      for (let i = 1; i < n; i++) tctx.lineTo(left[i][0], left[i][1]);
      for (let i = n - 1; i >= 0; i--) tctx.lineTo(right[i][0], right[i][1]);
      tctx.closePath();
      tctx.globalAlpha = 0.92; tctx.fillStyle = wax(trailColor); tctx.fill();
      // crayon tip
      const h = pts[n - 1];
      tctx.save(); tctx.translate(h.x, h.y);
      tctx.globalAlpha = 0.95; tctx.fillStyle = wax(trailColor);
      tctx.beginPath(); tctx.arc(0, 0, 4.2, 0, Math.PI * 2); tctx.fill();
      tctx.restore();
    }

    // wax crumbs: tiny irregular flakes that drop and fade
    for (let i = crumbs.length - 1; i >= 0; i--) {
      const b = crumbs[i], age = now - b.t;
      if (age > 900) { crumbs.splice(i, 1); continue; }
      b.vy += 0.07; b.vx *= 0.97; b.x += b.vx; b.y += b.vy;
      tctx.save(); tctx.translate(b.x, b.y); tctx.rotate(b.r);
      tctx.globalAlpha = (1 - age / 900) * 0.85; tctx.fillStyle = b.c;
      tctx.fillRect(-b.s / 2, -b.s / 3, b.s, b.s * 0.66);
      tctx.restore();
    }

    // click stamps (ink ring + star)
    for (let i = marks.length - 1; i >= 0; i--) {
      const m = marks[i], age = now - m.t;
      if (age > 1400) { marks.splice(i, 1); continue; }
      const p = age / 1400;
      const scale = age < 140 ? 1.5 - (age / 140) * 0.5 : 1;
      tctx.save();
      tctx.translate(m.x, m.y); tctx.rotate(m.r); tctx.scale(scale, scale);
      tctx.globalAlpha = (1 - p) * 0.85;
      tctx.strokeStyle = wax(m.c); tctx.fillStyle = wax(m.c);
      tctx.lineWidth = 2.5; tctx.beginPath(); tctx.arc(0, 0, 17, 0, Math.PI * 2); tctx.stroke();
      tctx.lineWidth = 1; tctx.beginPath(); tctx.arc(0, 0, 12, 0, Math.PI * 2); tctx.stroke();
      star(tctx, 7, 3); tctx.fill();
      tctx.restore();
    }
    tctx.globalAlpha = 1;
    const moving = live && Math.hypot(mx - hx, my - hy) > 0.5;
    if (pts.length > 1 || crumbs.length || marks.length || moving) kick();
  }

  /* ── Eco Wrap booklet ───────────────────────────── */
  const booklet = $(".booklet");
  if (booklet) {
    const img = $(".booklet__page", booklet), num = $("[data-page]", booklet);
    const prev = $('[data-dir="-1"]', booklet), next = $('[data-dir="1"]', booklet);
    const TOTAL = 22; let page = 1;
    const src = (n) => `assets/plan/p${String(n).padStart(2, "0")}.jpg`;
    const go = (d) => {
      const n = Math.min(TOTAL, Math.max(1, page + d));
      if (n === page) return;
      page = n;
      img.classList.add("is-turning");
      setTimeout(() => {
        img.src = src(page); img.alt = `Eco Wrap business plan, page ${page} of ${TOTAL}`;
        img.onload = () => img.classList.remove("is-turning");
      }, reduceMotion ? 0 : 160);
      num.textContent = page; prev.disabled = page === 1; next.disabled = page === TOTAL;
      if (page < TOTAL) { const pre = new Image(); pre.src = src(page + 1); }
    };
    prev.disabled = true;
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    $(".booklet__stage", booklet).addEventListener("click", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      go(e.clientX - r.left < r.width / 3 ? -1 : 1);
    });
    booklet.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); });
  }

  /* ── rally complete: paper confetti ─────────────── */
  function celebrate() {
    if (reduceMotion) return;
    const cv = $(".confetti"), c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const palette = ["#d6262f", "#2546a8", "#1f8a5a", "#ffe066", "#bfe6d3", "#f7cfc6", "#c89d6c"];
    const bits = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - .5) * 200, y: H * .55,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 15 - 6,
      w: 6 + Math.random() * 10, h: 4 + Math.random() * 7,
      r: Math.random() * 6, vr: (Math.random() - .5) * .3,
      col: palette[(Math.random() * palette.length) | 0]
    }));
    const start = performance.now();
    (function step(now) {
      const t = now - start;
      c.clearRect(0, 0, W, H);
      bits.forEach((b) => {
        b.vy += .42; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        c.save(); c.translate(b.x, b.y); c.rotate(b.r);
        c.globalAlpha = Math.max(0, 1 - t / 2600);
        c.fillStyle = b.col; c.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.r * 2)) + 1);
        c.restore();
      });
      if (t < 2600) requestAnimationFrame(step); else c.clearRect(0, 0, W, H);
    })(start);
  }
  /* ── round 6: toss angles + gentle scroll parallax ── */
  // Each piece lands from its own angle, alternating sides, so a section never moves as one block.
  $$(".spread .scrap, .spread .rank").forEach((el, i) => {
    const mag = [7, 11, 5, 13, 8, 10][i % 6];
    el.style.setProperty("--toss", (i % 2 ? mag : -mag) + "deg");
  });

  // Photos, tickets, badges and notes drift a few pixels against the scroll, so the page keeps moving.
  if (!reduceMotion) {
    const floaters = $$(".print, .polaroid, .badge, .note, .railticket, .ribbon, .booklet, .sash, .postcard__photo")
      .map((el, i) => ({ el, k: [0.05, -0.035, 0.07, -0.05, 0.04][i % 5] }));
    let pRaf = 0;
    const parallax = () => {
      pRaf = 0;
      const mid = innerHeight / 2;
      floaters.forEach(({ el, k }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        const off = Math.max(-28, Math.min(28, (r.top + r.height / 2 - mid) * k));
        el.style.setProperty("--py", off.toFixed(1) + "px");
      });
    };
    addEventListener("scroll", () => { if (!pRaf) pRaf = requestAnimationFrame(parallax); }, { passive: true });
    parallax();
  }
})();
