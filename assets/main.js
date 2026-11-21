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

  /* ── route scroll-spy ───────────────────────────── */
  const links = new Map($$(".route a").map((a) => [a.dataset.station, a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("is-here"));
      const a = links.get(e.target.dataset.station);
      if (a) {
        a.classList.add("is-here");
        a.setAttribute("aria-current", "true");
        links.forEach((o) => { if (o !== a) o.removeAttribute("aria-current"); });
        const line = a.closest(".route__line");
        if (line && line.scrollWidth > line.clientWidth) {
          line.scrollTo({ left: a.parentElement.offsetLeft - line.clientWidth / 2 + a.offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spreads.forEach((s) => spy.observe(s));

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

  /* ── cursor trail: a rail line that fades ───────── */
  const trail = $(".trail");
  const tctx = trail.getContext("2d");
  let dpr = 1, W = 0, H = 0;
  const pts = [];
  const marks = [];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    [trail, $(".confetti")].forEach((c) => { c.width = W * dpr; c.height = H * dpr; });
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const LIFE = 650;

  if (!reduceMotion) {
    if (finePointer) {
      window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (pts.length > 80) pts.shift();
        kick();
      }, { passive: true });
    }
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a, button, [data-drag], input")) return;
      marks.push({ x: e.clientX, y: e.clientY, t: performance.now(), r: Math.random() * 0.8 - 0.4, c: trailColor });
      kick();
    }, { passive: true });
  }

  function draw(now) {
    raf = 0;
    tctx.clearRect(0, 0, W, H);
    while (pts.length && now - pts[0].t > LIFE) pts.shift();
    if (pts.length > 1) {
      tctx.lineCap = "round"; tctx.lineJoin = "round";
      // rails
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const life = 1 - (now - b.t) / LIFE;
        tctx.strokeStyle = trailColor;
        tctx.globalAlpha = Math.max(0, life) * .9;
        tctx.lineWidth = 1 + life * 2.5;
        tctx.beginPath(); tctx.moveTo(a.x, a.y); tctx.lineTo(b.x, b.y); tctx.stroke();
      }
      // sleepers every ~11px
      let acc = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
        if (!len) continue;
        acc += len;
        if (acc < 11) continue;
        acc = 0;
        const life = 1 - (now - b.t) / LIFE;
        const nx = -dy / len, ny = dx / len, s = 3 + life * 4;
        tctx.globalAlpha = Math.max(0, life) * .8;
        tctx.lineWidth = 2;
        tctx.beginPath(); tctx.moveTo(b.x - nx * s, b.y - ny * s); tctx.lineTo(b.x + nx * s, b.y + ny * s); tctx.stroke();
      }
    }
    // click stamps
    for (let i = marks.length - 1; i >= 0; i--) {
      const m = marks[i], age = now - m.t;
      if (age > 1400) { marks.splice(i, 1); continue; }
      const p = age / 1400;
      const scale = age < 140 ? 1.5 - (age / 140) * .5 : 1;
      tctx.save();
      tctx.translate(m.x, m.y); tctx.rotate(m.r); tctx.scale(scale, scale);
      tctx.globalAlpha = (1 - p) * .85;
      tctx.strokeStyle = m.c; tctx.fillStyle = m.c;
      tctx.lineWidth = 2.5;
      tctx.beginPath(); tctx.arc(0, 0, 17, 0, Math.PI * 2); tctx.stroke();
      tctx.lineWidth = 1;
      tctx.beginPath(); tctx.arc(0, 0, 12, 0, Math.PI * 2); tctx.stroke();
      star(tctx, 0, 0, 7, 3);
      tctx.restore();
    }
    tctx.globalAlpha = 1;
    if (pts.length > 1 || marks.length) kick();
  }
  function star(c, x, y, R, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    c.closePath(); c.fill();
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
})();
