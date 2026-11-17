/* ==================================================
   motion.js · camada de movimento (carregar com defer, depois do main.js)
   Entrada dos blocos ao rolar, título do hero linha a linha, contadores, item
   atual nos atalhos de Services, botão do WhatsApp fora do caminho e faixa de
   idiomas (desligada). Nada aqui muda texto. Com "reduzir movimento" só ficam
   os estados (seções 0 e 0b). Estilos: bloco MOVIMENTO, no fim do style.css.
   ================================================== */
(function () {
  "use strict";
  const root = document.documentElement;
  const OPT = Object.assign({ marquee: false }, (window.SITE || {}).MOTION);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. Atalhos de Services: marca o serviço que está na tela ----------
     Estado, não animação: roda também com "reduzir movimento". O link do serviço
     em leitura recebe aria-current e a barra rola até ele. */
  const snav = document.querySelector(".svc-nav");
  if (snav && "IntersectionObserver" in window) {
    const links = [...snav.querySelectorAll('a[href^="#"]')], targets = [];
    links.forEach((a) => { const t = document.getElementById(a.hash.slice(1)); if (t) targets.push([t, a]); });
    let cur;
    const mark = (a) => {
      if (a === cur) return;
      cur = a;
      links.forEach((x) => (x === a ? x.setAttribute("aria-current", "true") : x.removeAttribute("aria-current")));
      snav.scrollTo({ left: a ? a.offsetLeft - (snav.clientWidth - a.offsetWidth) / 2 : 0, behavior: still ? "auto" : "smooth" });
    };
    /* quem decide é a posição: vale o último serviço cujo topo já passou da
       linha de leitura (41% da tela, o pé da faixa observada) */
    const pick = () => {
      const line = (window.innerHeight || root.clientHeight) * 0.41 + 2;
      let a = null;
      targets.forEach(([t, link]) => { if (t.getBoundingClientRect().top <= line) a = link; });
      mark(a);
    };
    const spy = new IntersectionObserver(pick, { rootMargin: "-40% 0px -59% 0px" });
    const edge = new IntersectionObserver(pick);
    targets.forEach(([t]) => spy.observe(t));
    if (targets[0]) { edge.observe(targets[0][0]); edge.observe(snav); }

    /* Desktop: em repouso, duas linhas (CSS); colada, uma linha rolável com setas.
       A altura que some ao colar volta como margem: nada abaixo se desloca. */
    snav.classList.add("sn-js");
    const LBL = { en: ["Previous services", "More services"], pt: ["Serviços anteriores", "Mais serviços"], es: ["Servicios anteriores", "Más servicios"] };
    const arrows = [-1, 1].map((d) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "sn-arrow " + (d < 0 ? "prev" : "next");
      b.innerHTML = '<svg aria-hidden="true"><use href="#i-chev"/></svg>';
      b.addEventListener("click", () => snav.scrollBy({ left: d * snav.clientWidth * 0.6, behavior: still ? "auto" : "smooth" }));
      snav[d < 0 ? "prepend" : "append"](b);
      return b;
    });
    const ends = () => {
      snav.classList.toggle("can-prev", snav.scrollLeft > 4);
      snav.classList.toggle("can-next", snav.scrollLeft < snav.scrollWidth - snav.clientWidth - 4);
    };
    let stuck = false, raf = 0;
    const stick = () => {
      raf = 0;
      const on = snav.parentElement.getBoundingClientRect().top < parseFloat(getComputedStyle(snav).top) - 1;
      if (on !== stuck) {
        stuck = on;
        const h = snav.offsetHeight;
        snav.classList.toggle("is-stuck", on);
        snav.style.marginBottom = on ? h - snav.offsetHeight + "px" : "";
        if (on && cur) snav.scrollLeft = cur.offsetLeft - (snav.clientWidth - cur.offsetWidth) / 2;
      }
      pick();
      ends();
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(stick); };
    /* largura ou idioma mudou: mede de novo a partir do estado de repouso */
    const reset = () => { stuck = false; snav.classList.remove("is-stuck"); snav.style.marginBottom = ""; stick(); };
    const label = () => {
      const l = LBL[(root.lang || "en").slice(0, 2)] || LBL.en;
      arrows.forEach((b, i) => b.setAttribute("aria-label", l[i]));
      requestAnimationFrame(reset);
    };
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", reset);
    snav.addEventListener("scroll", ends, { passive: true });
    /* foco por teclado na barra colada: a pílula vem para o meio, fora das setas */
    snav.addEventListener("focusin", (e) => {
      const a = e.target.closest("a");
      if (a && stuck) snav.scrollTo({ left: a.offsetLeft - (snav.clientWidth - a.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
    });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ["lang"] });
    label();
  }

  /* ---------- 0b. Botão do WhatsApp: nunca por cima de um controle ----------
     Estado, não animação. Um observador com a área do canto do botão (e folga) vigia
     links, botões e campos: enquanto algum passa por ali, o botão some (.is-off). */
  const fab = document.querySelector(".wa-wrap,body > .wa-float");
  if (fab && "IntersectionObserver" in window) {
    const btn = fab.querySelector(".wa-float") || fab, hits = new Set();
    let zo, zr = 0;
    /* menu aberto ou foco de teclado no botão: fica */
    const upd = () => fab.classList.toggle("is-off", hits.size > 0 && btn.getAttribute("aria-expanded") !== "true" && !fab.querySelector(":focus-visible"));
    const zone = () => {
      zr = 0;
      const r = btn.getBoundingClientRect();
      if (!r.width) return;
      if (zo) zo.disconnect();
      hits.clear();
      zo = new IntersectionObserver((es) => { es.forEach((e) => hits[e.isIntersecting ? "add" : "delete"](e.target)); upd(); },
        { rootMargin: `${24 - r.top}px ${r.right - root.clientWidth + 8}px ${r.bottom - innerHeight + 24}px ${8 - r.left}px` });
      document.querySelectorAll("a[href],button,input,select,textarea,summary,[role=button],label.consent")
        .forEach((e) => { if (!fab.contains(e) && !e.closest("#mobile-menu,.skip")) zo.observe(e.matches(".svc-link") ? e.closest(".svc-item") || e : e); });
    };
    /* tela ou idioma mudou (a troca recria links dentro dos textos): observa de novo */
    const again = () => { if (!zr) zr = requestAnimationFrame(zone); };
    root.classList.add("fab-js");
    fab.classList.add("is-off");
    zone();
    addEventListener("resize", again);
    new MutationObserver(again).observe(root, { attributes: true, attributeFilter: ["lang"] });
    ["click", "keyup", "focusout"].forEach((t) => document.addEventListener(t, () => setTimeout(upd)));
  }

  if (still) return;
  root.classList.add("js");

  const STAGGER = 70, DUR = 650;
  const vh = () => window.innerHeight || root.clientHeight;

  /* ---------- 1. Entrada dos blocos ao rolar ---------- */
  const SEL = [".head", ".lf-head", ".two-col > *", ".cards-3 > *", ".svc-grid", ".testi-slider", ".lf-grid > *",
    ".values > *", ".founders > *", ".steps > *", ".support-grid > *", ".posts > *", ".svc-detail", ".contact-cards > *",
    ".band .wrap > *", ".vision", ".faq", ".cta", ".pf-table", ".pf-note"].join(",");
  let pending = [];
  /* depois de entrar, o bloco volta ao CSS normal (hovers intactos) */
  const settle = (el) => { el.classList.remove("reveal", "in"); el.style.removeProperty("--d"); };
  const show = (el, delay) => {
    pending = pending.filter((x) => x !== el);
    if (io) io.unobserve(el);
    if (delay < 0) return settle(el);   /* sem animação */
    el.style.setProperty("--d", delay + "ms");
    el.classList.add("in");
    setTimeout(settle, delay + DUR + 80, el);
  };
  const showAll = () => pending.slice().forEach((el) => show(el, -1));
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      /* irmãos que entram juntos sobem em sequência */
      const seen = new Map();
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const p = en.target.parentElement, n = seen.get(p) || 0;
        seen.set(p, n + 1);
        show(en.target, Math.min(n, 6) * STAGGER);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(SEL).forEach((el) => {
      if (el.parentElement.closest(SEL) || el.closest(".hero,.page-hero")) return;   /* nunca esconder bloco dentro de bloco */
      el.classList.add("reveal");
      pending.push(el);
      io.observe(el);
    });
    /* Garantias: o que ficou para cima (âncora, tecla End) aparece sem animar;
       o que está na tela sem aviso do observador aparece depois de 2,5 s. */
    let tick = 0;
    const sweep = () => { tick = 0; pending.slice().forEach((el) => { if (el.getBoundingClientRect().bottom < 0) show(el, -1); }); };
    addEventListener("scroll", () => { if (pending.length && !tick) tick = requestAnimationFrame(sweep); }, { passive: true });
    setTimeout(() => pending.slice().forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh() && r.bottom > 0) show(el, 0);
    }), 2500);
    addEventListener("beforeprint", showAll);
  }

  /* ---------- 2. Título do hero, linha a linha ----------
     Cada palavra vira um <span> só durante a animação (textContent idêntico);
     no fim o HTML original volta (se o idioma mudou no meio, nada a desfazer). */
  const lines = (el) => {
    if (el._m) return;
    const html = el.innerHTML;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n; (n = walker.nextNode());) if (n.nodeValue.trim()) nodes.push(n);
    const words = [];
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
        const s = document.createElement("span");
        s.className = "m-w"; s.textContent = part;
        words.push(s); frag.appendChild(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    if (!words.length) return;
    let line = -1, top = null;
    words.forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { line++; top = t; }
      w.style.setProperty("--l", line);
    });
    el.classList.add("m-split");
    el._m = setTimeout(() => {
      el._m = 0;
      if (el.querySelector(".m-w")) el.innerHTML = html;
      el.classList.remove("m-split");
    }, line * 90 + 800);
  };
  const titles = [...document.querySelectorAll(".hero .slide .h1, .page-hero .h1")];
  titles.forEach((h) => h.classList.add("m-js"));   /* desliga a entrada em bloco do CSS */
  const hero = document.querySelector(".hero[data-slider]");
  if (hero) {
    const play = (slide) => { const h = slide.querySelector(".h1"); if (h) lines(h); };
    const mo = new MutationObserver((list) => list.forEach((m) => {
      const s = m.target;
      if (s.classList.contains("active") && !/\bactive\b/.test(m.oldValue || "")) play(s);
    }));
    hero.querySelectorAll(".slide").forEach((s) => mo.observe(s, { attributes: true, attributeFilter: ["class"], attributeOldValue: true }));
    const first = hero.querySelector(".slide.active");
    if (first) play(first);
  } else if (titles[0]) lines(titles[0]);

  /* ---------- 3. Contadores ----------
     Só em números já presentes no texto, marcados com data-count. Hoje nenhuma
     página tem; o texto final é sempre o original. */
  const counters = [...document.querySelectorAll("[data-count]")];
  if (counters.length && io) {
    const run = (el) => {
      const txt = el.textContent, m = txt.match(/\d[\d.,]*/);
      if (!m) return;
      const end = parseInt(m[0].replace(/\D/g, ""), 10), sep = (m[0].match(/[.,]/) || [""])[0];
      if (!end) return;
      const fmt = (n) => (sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n));
      el.style.minWidth = el.offsetWidth + "px";
      el.setAttribute("aria-label", txt);
      const t0 = performance.now(), T = 1200;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / T), e = 1 - Math.pow(1 - p, 4);
        el.textContent = p < 1 ? txt.replace(m[0], fmt(Math.round(end * e))) : txt;
        if (p < 1) requestAnimationFrame(step);
        else { el.style.minWidth = ""; el.removeAttribute("aria-label"); }
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { co.unobserve(en.target); run(en.target); }
    }), { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- 4. Faixa de idiomas e serviços (DESLIGADA por padrão) ----------
     Liga em config.js: MOTION: { marquee: true }. Só repete rótulos que já existem
     na página, por isso fica fora da leitura de tela (aria-hidden). */
  if (OPT.marquee && hero) {
    const strip = document.createElement("div");
    strip.className = "m-marquee";
    strip.setAttribute("aria-hidden", "true");
    const build = () => {
      const labels = [...document.querySelectorAll(".topbar .langs button")].map((b) => b.title)
        .concat([...document.querySelectorAll(".svc-grid .svc-link")].map((a) => a.textContent.trim())).filter(Boolean);
      if (!labels.length) return strip.remove();
      const set = () => { const u = document.createElement("ul"); labels.forEach((t) => { const li = document.createElement("li"); li.textContent = t; u.appendChild(li); }); return u; };
      const track = document.createElement("div");
      track.className = "m-track";
      track.append(set(), set());
      track.style.animationDuration = Math.max(30, labels.length * 5) + "s";
      strip.replaceChildren(track);
    };
    build();
    hero.insertAdjacentElement("afterend", strip);
    new MutationObserver(build).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }
})();
