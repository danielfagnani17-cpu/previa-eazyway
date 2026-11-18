/* ==================================================
   motion.js · camada de movimento (carregar com defer, depois do main.js)
   Estados: item atual no índice de Services e botão do WhatsApp fora do caminho.
   Movimento: entrada dos blocos ao rolar e contadores da faixa de fatos.
   Nada aqui muda texto. Com "reduzir movimento" só ficam os estados.
   Estilos: bloco MOVIMENTO, no fim do style.css.
   ================================================== */
(function () {
  "use strict";
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* ---------- 0. Índice de Services: marca o capítulo que está em leitura ----------
     Estado, não animação. Vale o último capítulo cujo topo já passou da linha
     de leitura (40% da tela). */
  const toc = document.querySelector(".toc");
  if (toc && hasIO) {
    const pairs = [];
    toc.querySelectorAll('a[href^="#"]').forEach((a) => { const t = document.getElementById(a.hash.slice(1)); if (t) pairs.push([t, a]); });
    let cur = null;
    const pick = () => {
      const line = (window.innerHeight || root.clientHeight) * 0.4;
      let a = null;
      pairs.forEach(([t, link]) => { if (t.getBoundingClientRect().top <= line) a = link; });
      if (a === cur) return;
      cur = a;
      pairs.forEach(([, x]) => (x === a ? x.setAttribute("aria-current", "true") : x.removeAttribute("aria-current")));
    };
    const spy = new IntersectionObserver(pick, { rootMargin: "-40% 0px -59% 0px" });
    pairs.forEach(([t]) => spy.observe(t));
    addEventListener("scroll", pick, { passive: true });
    pick();
  }

  /* ---------- 0b. Botão do WhatsApp: nunca por cima de um controle ----------
     Estado, não animação. Um observador com a área do canto do botão (e folga) vigia
     links, botões, campos e os retratos do hero: enquanto algum passa por ali, o botão some (.is-off). */
  const fab = document.querySelector(".wa-wrap,body > .wa-float");
  if (fab && hasIO) {
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
      /* linhas inteiras clicáveis (serviços, índice, artigos) contam como o controle */
      document.querySelectorAll("a[href],button,input,select,textarea,summary,label.consent,.byline figure")
        .forEach((e) => { if (!fab.contains(e) && !e.closest("#mobile-menu,.skip")) zo.observe(e.closest(".nlist > li,.index-list article,.post-row") || e); });
    };
    /* tela ou idioma mudou (a troca recria links dentro dos textos): observa de novo */
    const again = () => { if (!zr) zr = requestAnimationFrame(zone); };
    root.classList.add("fab-js");
    fab.classList.add("is-off");
    zone();
    addEventListener("resize", again);
    new MutationObserver(again).observe(root, { attributes: true, attributeFilter: ["lang"] });
    ["click", "keyup", "focusout"].forEach((t) => document.addEventListener(t, () => setTimeout(upd)));

    /* Não cobre leitura: some ao rolar para baixo; volta ao rolar para cima, no topo e no fim da página.
       Sobre a faixa em tinta fica claro (.on-dark). */
    /* Margem livre: o botão cabe inteiro à direita do conteúdo (.wrap). Só aí ele nasce visível.
       Sem margem livre (celular, tablet, desktop estreito): oculto na carga, aparece no primeiro gesto de
       rolar para cima e no fim da página, só no celular; do tablet para cima sem margem, não aparece (.is-text). */
    const wrapEl = document.querySelector("main .wrap") || document.querySelector(".wrap");
    const small = matchMedia("(max-width: 719px)");
    let free = false;
    const measure = () => {
      const w = wrapEl.getBoundingClientRect(), right = parseFloat(getComputedStyle(btn).right) || 20;
      free = root.clientWidth - right - btn.offsetWidth >= w.right - 1;
    };
    let last = scrollY, sr = 0;
    /* tablet e desktop sem margem livre: o flutuante não aparece (piscava sobre o texto); o WhatsApp segue no menu, no fecho e no rodapé */
    const guard = () => fab.classList.toggle("is-text", !free && !small.matches && btn.getAttribute("aria-expanded") !== "true");
    const onScroll = () => {
      sr = 0;
      /* confere de novo depois que a rolagem e as entradas assentam */
            const y = scrollY, max = root.scrollHeight - innerHeight;
      if (y > max - 80) fab.classList.remove("is-down");
      else if (y < 80) fab.classList.toggle("is-down", !free);
      else if (Math.abs(y - last) > 6) fab.classList.toggle("is-down", y > last && btn.getAttribute("aria-expanded") !== "true");
      last = y;
      guard();
      const r = btn.getBoundingClientRect(), cy = r.top + r.height / 2;
      const dark = [...document.querySelectorAll(".on-ink")].some((e) => { const q = e.getBoundingClientRect(); return q.top < cy && q.bottom > cy; });
      fab.classList.toggle("on-dark", dark);
    };
    measure();
    if (!free) fab.classList.add("is-down");
    addEventListener("resize", () => { measure(); onScroll(); });
    addEventListener("scroll", () => { if (!sr) sr = requestAnimationFrame(onScroll); }, { passive: true });
    onScroll();
  }

  if (still || !hasIO) return;
  root.classList.add("js");

  /* ---------- 1. Entrada dos blocos ao rolar ---------- */
  const STAGGER = 70, DUR = 650;
  const SEL = [".intro .h2", ".intro .txt", ".svc .head", ".nlist > li", ".lf .head", ".items", ".trio",
    ".voices .h2", ".voice", ".index .h2", ".index .lead", ".index-list", ".faq-sec .side", ".faq",
    ".cta .wrap", ".founder", ".founders .triad", ".story .h2", ".story .txt", ".value", ".scope .side", ".scope .plain",
    ".chapter", ".areas-col > *", ".lfp-intro .h2", ".lfp-intro .txt", ".pull", ".sup",
    ".more .side", ".portfolio .head", ".grid6", ".note", ".how .head", ".flex-sec .side", ".vision",
    ".post-row", ".prose", ".more-posts .h2"].join(",");
  let pending = [];
  /* depois de entrar, o bloco volta ao CSS normal (hovers intactos) */
  const settle = (el) => { el.classList.remove("reveal", "in"); el.style.removeProperty("--d"); };
  const show = (el, delay) => {
    pending = pending.filter((x) => x !== el);
    io.unobserve(el);
    if (delay < 0) return settle(el);   /* sem animação */
    el.style.setProperty("--d", delay + "ms");
    el.classList.add("in");
    setTimeout(settle, delay + DUR + 80, el);
  };
  const io = new IntersectionObserver((entries) => {
    /* irmãos que entram juntos sobem em sequência */
    const seen = new Map();
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const p = en.target.parentElement, n = seen.get(p) || 0;
      seen.set(p, n + 1);
      show(en.target, Math.min(n, 6) * STAGGER);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  const vh = () => window.innerHeight || root.clientHeight;
  document.querySelectorAll(SEL).forEach((el) => {
    /* nunca esconder bloco dentro de bloco, nem o que já está na primeira tela */
    if (el.parentElement.closest(SEL) || el.getBoundingClientRect().top < vh() * 0.92) return;
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
  addEventListener("beforeprint", () => pending.slice().forEach((el) => show(el, -1)));

  /* ---------- 2. Contadores ----------
     <span data-count="340">340</span>: o valor final já está no HTML. Conta uma vez
     ao entrar na tela. A largura do número final fica reservada (algarismos tabulares),
     então nada em volta se mexe. A leitura de tela usa o texto fixo ao lado
     (.visually-hidden); este trecho é aria-hidden. */
  const counters = [...document.querySelectorAll("[data-count]")];
  if (counters.length) {
    const run = (el) => {
      const end = parseInt(el.dataset.count, 10);
      if (!end) return;
      el.style.minWidth = el.getBoundingClientRect().width + "px";
      const t0 = performance.now(), T = 1100;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / T);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = "0";
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { co.unobserve(en.target); run(en.target); }
    }), { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }
})();
