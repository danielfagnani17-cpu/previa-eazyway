/* ==========================================================================
   main.js · componentes e comportamentos do site
   Componentes reutilizáveis: <div data-component="header|footer|cta"></div>
   Não é preciso editar este arquivo para trocar textos, contatos ou imagens.
   ========================================================================== */
(function () {
  "use strict";
  const S = window.SITE || {};
  const C = S.CONTACT || {};
  const B = S.BRAND || {};
  const PAGES = [
    { id: "home", href: "", key: "nav_home", label: "Home" },
    { id: "about", href: "about/", key: "nav_about", label: "About" },
    { id: "services", href: "services/", key: "nav_services", label: "Services" },
    { id: "lawfirms", href: "law-firms/", key: "nav_lawfirms", label: "For Law Firms" },
    { id: "blog", href: "blog/", key: "nav_blog", label: "Blog" },
    { id: "contact", href: "contact/", key: "nav_contact", label: "Contact" }
  ];
  const page = document.body.dataset.page || "home";
  /* Páginas dentro de pastas (blog) informam o caminho até a raiz em data-root */
  const R = document.body.dataset.root || "";
  const asset = (p) => (/^(https?:|data:|\/)/.test(p) ? p : R + p);
  /* Páginas do blog têm um idioma fixo por URL (data-lang) */
  const fixedLang = document.body.dataset.lang || "";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Contatos (vários e-mails e telefones) ---------- */
  const EMAILS = C.emails || [];
  const PHONES = (C.phones || []).map((p) => {
    const d = String(p.number || "").replace(/\D/g, "");
    const intl = d.length === 10 ? "1" + d : d;    /* número dos EUA sem o 1 na frente */
    return { label: p.number, name: p.name || "", tel: "+" + intl, wa: p.whatsapp ? intl : "" };
  });
  const WAS = PHONES.filter((p) => p.wa);
  /* Um botão de ligar para cada número */
  /* Nome de quem atende aquele número, antes do número */
  const who = (p) => (p.name ? `<span class="who">${esc(p.name)}</span> ` : "");
  const callBtns = (cls) => PHONES.map((p) => `<a class="${cls}" href="tel:${esc(p.tel)}"><span>${who(p)}${esc(p.label)}</span></a>`).join("");

  /* ---------- Ícones ---------- */
  /* Só os que têm função: redes sociais (Lucide, licença ISC), WhatsApp e a estrela das avaliações. */
  const L = {
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.370A4 4 0 1 1 12.630 8 4 4 0 0 1 16 11.370z"/><path d="M17.500 6.500h.010"/>',
    youtube: '<path d="M2.500 17a24.120 24.120 0 0 1 0-10 2 2 0 0 1 1.400-1.400 49.560 49.560 0 0 1 16.200 0A2 2 0 0 1 21.500 7a24.120 24.120 0 0 1 0 10 2 2 0 0 1-1.400 1.400 49.550 49.550 0 0 1-16.200 0A2 2 0 0 1 2.500 17"/><path d="m10 15 5-3-5-3z"/>'
  };
  const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><defs>${
    Object.entries(L).map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</g></symbol>`).join("")
  }<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.310 4.679a2.123 2.123 0 0 0 1.595 1.160l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.140a.53.53 0 0 1-.771.560l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.010a.53.53 0 0 1-.770-.560l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.160 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.160z"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.030-.967-.273-.099-.471-.148-.670.150-.197.297-.767.966-.940 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.390-1.475-.883-.788-1.480-1.761-1.653-2.059-.173-.297-.018-.458.130-.606.134-.133.298-.347.446-.520.149-.174.198-.298.298-.497.099-.198.050-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.510-.173-.008-.371-.010-.570-.010-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.360.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.870 9.870 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.860 9.860 0 0 1-1.510-5.260c.001-5.450 4.436-9.884 9.888-9.884 2.640 0 5.122 1.030 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.450-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.050 0C5.495 0 .160 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.480-8.413z"/></symbol>
</defs></svg>`;
  document.body.insertAdjacentHTML("afterbegin", SPRITE);

  const icon = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  /* Telefone clicável com o ícone do WhatsApp ao lado */
  const phoneLine = (p) => `<span class="ph"><a href="tel:${esc(p.tel)}">${who(p)}${esc(p.label)}</a>${p.wa
    ? `<a class="wa-link" href="https://wa.me/${esc(p.wa)}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(p.name)} ${esc(p.label)}" title="WhatsApp">${icon("whatsapp")}</a>` : ""}</span>`;
  const t = (key, en) => `<span data-i18n="${key}">${en}</span>`;

  const logoHTML = () => `<img class="logo-img" src="${esc(asset(B.logo))}" alt="${esc(B.fullName)}" width="133" height="40">`;
  /* Motivo trilíngue: decorativo, não traduz e fica fora da leitura de tela */
  const TRIAD = `<p class="triad" aria-hidden="true">Hello <span class="dot">·</span> Olá <span class="dot">·</span> Hola</p>`;

  const socialHTML = () => {
    const s = S.SOCIAL || {};
    const items = [
      ["instagram", "Instagram"], ["facebook", "Facebook"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"]
    ].filter(([k]) => s[k]);
    /* WhatsApp não entra aqui: os dois números já aparecem com ícone na coluna Contato */
    return items.map(([k, label]) => {
      const href = esc(s[k]);
      return `<a href="${href}" target="_blank" rel="noopener" aria-label="${label}">${icon(k)}</a>`;
    }).join("");
  };

  const navLinks = () => PAGES.map((p) =>
    `<a href="${(R + p.href) || "./"}"${p.id === "blog" ? " data-blog-link" : ""}${p.id === page ? ' aria-current="page"' : ""}>${t(p.key, p.label)}</a>`).join("");

  /* ---------- Componente: header ---------- */
  const LANGS = [["en", "English"], ["pt", "Português"], ["es", "Español"]];
  function renderHeader(el) {
    el.outerHTML = `
<a class="skip" href="#main">${t("skip", "Skip to content")}</a>
<div class="topbar">
  <div class="wrap">
    <span class="tagline">${t("topbar", "Document preparation, certified translation and interpreters in three languages.")}</span>
    <div class="items">
      <div class="t-phones">${PHONES.map((p) => `<a class="t-phone" href="tel:${esc(p.tel)}">${who(p)}<span class="num">${esc(p.label)}</span></a>`).join("")}</div>
      <div class="langs" role="group" aria-label="Language">
        ${LANGS.map(([l, name]) => `<button type="button" data-lang="${l}" aria-pressed="false" title="${name}"><span aria-hidden="true">${l.toUpperCase()}</span><b class="visually-hidden">${name}</b></button>`).join("")}
      </div>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${R || "./"}" aria-label="${esc(B.fullName)}, home">${logoHTML()}</a>
    <nav class="nav" aria-label="Main">${navLinks()}</nav>
    <a class="btn btn-solid btn-sm" href="${R}contact/">${t("cta_btn", "Free Consultation")}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu"><i></i><i></i><b class="visually-hidden" data-i18n="menu_open">Open menu</b></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="top">
      <a class="brand" href="${R || "./"}">${logoHTML()}</a>
      <button class="close" type="button" data-close><span aria-hidden="true">×</span><b class="visually-hidden" data-i18n="menu_close">Close menu</b></button>
    </div>
    <nav aria-label="Mobile">${navLinks()}</nav>
    <a class="btn btn-solid" href="${R}contact/">${t("cta_btn", "Free Consultation")}</a>
    <div class="contact">
      ${PHONES.map(phoneLine).join("")}
      ${EMAILS.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join("")}
    </div>
  </div>
</div>`;
  }

  /* ---------- Componente: CTA final (tipográfico; o monograma vem do CSS) ---------- */
  function renderCTA(el) {
    el.outerHTML = `
<section class="cta on-ink" aria-labelledby="cta-title">
  <img class="cta-bg" src="${esc(asset("assets/img/texture-pen.webp"))}" srcset="${esc(asset("assets/img/texture-pen-800.webp"))} 800w, ${esc(asset("assets/img/texture-pen.webp"))} 1400w" sizes="100vw" width="1400" height="868" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <div class="wrap">
    ${TRIAD}
    <h2 class="h2" id="cta-title" data-i18n="cta_title">Not sure which document you need? Talk to our team at no cost.</h2>
    <p class="lead" data-i18n="cta_text">Tell us about your situation and we will explain the options, the price and the timeline before you decide.</p>
    <div class="actions">
      <a class="btn btn-white" href="${R}contact/">${t("cta_btn2", "Request a Quote")}</a>
      ${callBtns("link tel")}
    </div>
  </div>
</section>`;
  }

  /* ---------- Componente: footer ---------- */
  function renderFooter(el) {
    const year = new Date().getFullYear();
    el.outerHTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="f-cols">
      <div class="f-brand">
        <a class="brand" href="${R || "./"}" aria-label="${esc(B.fullName)}, home">${logoHTML()}</a>
        <p class="about" data-i18n="footer_about">Document preparation, certified translation and interpreters for families in English, Portuguese and Spanish.</p>
        <div class="socials">${socialHTML()}</div>
      </div>
      <details class="f-nav fold">
        <summary><h3 data-i18n="footer_nav">Navigation</h3><span class="pm" aria-hidden="true"></span></summary>
        <ul>${PAGES.map((p) => `<li><a href="${(R + p.href) || "./"}"${p.id === "blog" ? " data-blog-link" : ""}>${t(p.key, p.label)}</a></li>`).join("")}</ul>
      </details>
      <details class="f-svc fold">
        <summary><h3 data-i18n="footer_services">Services</h3><span class="pm" aria-hidden="true"></span></summary>
        <ul>
          <li><a href="${R}services/#divorce">${t("s_divorce", "Uncontested Divorce")}</a></li>
          <li><a href="${R}services/#name-change">${t("s_name", "Name Change")}</a></li>
          <li><a href="${R}services/#translation">${t("s_translation", "Certified Translation")}</a></li>
          <li><a href="${R}services/#power-of-attorney">${t("s_poa", "Power of Attorney")}</a></li>
          <li><a href="${R}services/#interpreters">${t("s_interp", "Interpreters")}</a></li>
        </ul>
      </details>
      <div class="f-contact">
        <h3 data-i18n="footer_contact">Contact</h3>
        <ul>
          ${PHONES.map((p) => `<li class="ci">${phoneLine(p)}</li>`).join("")}
          ${EMAILS.map((e) => `<li class="ci"><a href="mailto:${esc(e)}">${esc(e)}</a></li>`).join("")}
          <li class="ci f-place"><span>${esc(C.address)}</span></li>
          <li class="ci"><span>${esc(C.hours)}</span></li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <p class="disclaimer" data-i18n="disclaimer">${esc(B.fullName)} is not a law firm and is not a substitute for an attorney. We cannot give legal advice, choose forms for you based on legal judgment, or represent you in court. Services are provided at your direction, based on the information you supply.</p>
      <div class="copy"><span>© ${year} ${esc(B.fullName)}. <span data-i18n="rights">All rights reserved.</span></span><span class="credit">created with love · <a href="https://tassiane.com" target="_blank" rel="noopener">tassiane.com</a></span><a href="#top" data-i18n="back_top">Back to top ↑</a></div>
      <img class="mark" src="${esc(asset("assets/img/mark.svg"))}" alt="" aria-hidden="true" width="44" height="59" loading="lazy">
    </div>
  </div>
</footer>`;
  }

  const COMPONENTS = { header: renderHeader, footer: renderFooter, cta: renderCTA };
  document.querySelectorAll("[data-component]").forEach((el) => {
    const fn = COMPONENTS[el.dataset.component];
    if (fn) fn(el);
  });
  if (!document.getElementById("top")) document.body.id = "top";

  /* ---------- Contatos em qualquer página ---------- */
  document.querySelectorAll("[data-contact]").forEach((el) => {
    const k = el.dataset.contact;
    if (k === "emails") el.innerHTML = EMAILS.map((e) => `<a href="mailto:${esc(e)}">${esc(e).replace("@", "<wbr>@")}</a>`).join("");
    else if (k === "phones") el.innerHTML = PHONES.map(phoneLine).join("");
    /* Um botão de WhatsApp para cada número com WhatsApp */
    else if (k === "whatsapp") {
      const wa = PHONES.filter((p) => p.wa);
      if (wa.length) el.outerHTML = wa.map((p) => `<a class="${esc(el.className)}" href="https://wa.me/${esc(p.wa)}" target="_blank" rel="noopener"><span>WhatsApp · ${esc(p.name || p.label)}</span></a>`).join("");
      else el.hidden = true;
    }
    else if (C[k] != null) el.textContent = C[k];
  });
  document.querySelectorAll("[data-contact-tel]").forEach((el) => { el.outerHTML = callBtns(el.className); });
  document.querySelectorAll("[data-brand]").forEach((el) => { el.textContent = B.fullName; });

  /* ---------- Botão fixo do WhatsApp ---------- */
  /* Com mais de um número, o botão abre uma lista para escolher */
  if (WAS.length === 1) {
    document.body.insertAdjacentHTML("beforeend", `<a class="wa-float" href="https://wa.me/${esc(WAS[0].wa)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-whatsapp"/></svg><span class="visually-hidden" data-i18n="btn_whatsapp">Chat on WhatsApp</span></a>`);
  } else if (WAS.length > 1) {
    document.body.insertAdjacentHTML("beforeend", `<div class="wa-wrap">
  <div class="wa-menu" id="wa-menu" hidden>${WAS.map((p) => `<a href="https://wa.me/${esc(p.wa)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-whatsapp"/></svg>${who(p)}${esc(p.label)}</a>`).join("")}</div>
  <button class="wa-float" type="button" aria-expanded="false" aria-controls="wa-menu"><svg aria-hidden="true"><use href="#i-whatsapp"/></svg><span class="visually-hidden" data-i18n="btn_whatsapp">Chat on WhatsApp</span></button>
</div>`);
    const wrap = document.querySelector(".wa-wrap"), btn = wrap.querySelector("button"), menu = wrap.querySelector(".wa-menu");
    const toggle = (open) => { menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", () => toggle(menu.hidden));
    document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) toggle(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  /* ---------- Idiomas ---------- */
  const I = window.I18N || {};
  I.en = I.en || {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (!(k in I.en)) I.en[k] = el.innerHTML;
  });
  let lang = "en";
  const langHooks = [];   /* quem tem rótulo só em aria-label se atualiza aqui */
  function setLang(l) {
    if (!I[l]) l = "en";
    lang = l;
    const d = I[l];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = d[el.dataset.i18n] ?? I.en[el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    document.documentElement.lang = l === "pt" ? "pt-BR" : l;
    document.querySelectorAll(".langs button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    document.querySelectorAll("[data-blog-link]").forEach((a) => { a.href = R + "blog/" + (l === "en" ? "" : l + "/"); });
    try { localStorage.setItem("site-lang", l); } catch (e) {}
    langHooks.forEach((fn) => fn());
  }
  const tr = (k) => (I[lang] && I[lang][k]) || I.en[k] || k;
  document.querySelectorAll(".langs button").forEach((b) => b.addEventListener("click", () => {
    const l = b.dataset.lang;
    if (!fixedLang) return setLang(l);
    /* No blog, trocar de idioma leva para a URL do artigo naquele idioma */
    const alt = document.body.dataset["alt" + l[0].toUpperCase() + l.slice(1)];
    if (l === fixedLang || alt == null) return;
    try { localStorage.setItem("site-lang", l); } catch (e) {}
    location.href = R + alt;
  }));
  /* Título da CTA: cada frase vira um bloco que não se mistura com a outra na quebra
     ("Not sure which document you need?" / "Talk to our team at no cost."). O texto é
     o mesmo, caractere por caractere; só muda onde a linha quebra. */
  const ctaTitle = document.getElementById("cta-title");
  if (ctaTitle) langHooks.push(() => {
    const m = !ctaTitle.children.length && ctaTitle.textContent.match(/^(.+?[?!.])\s+(\S.*)$/);
    if (!m) return;
    const part = (txt) => { const s = document.createElement("span"); s.className = "nb"; s.textContent = txt; return s; };
    ctaTitle.replaceChildren(part(m[1]), " ", part(m[2]));
  });
  let startLang = S.DEFAULT_LANG || "en";
  try { startLang = localStorage.getItem("site-lang") || startLang; } catch (e) {}
  setLang(fixedLang || startLang);
  /* o <head> escondeu o miolo enquanto o idioma salvo (PT/ES) não estava aplicado: agora pode aparecer */
  document.documentElement.classList.remove("i18n-wait");

  /* ---------- Faixas que rolam de lado e listas recolhidas ----------
     .hscroll só rola no celular: quando há rolagem, entra na ordem do teclado (setas rolam).
     details.need / details.sup: recolhidos só no celular; do tablet para cima ficam abertos
     (CSS ::details-content; onde o navegador não tem, o atributo open resolve). */
  const wide = matchMedia("(min-width: 720px)");
  const scrollers = [...document.querySelectorAll(".hscroll")];
  /* fio de progresso acima de cada faixa: mostra em que ponto da rolagem se está */
  scrollers.forEach((el) => {
    el.insertAdjacentHTML("beforebegin", '<div class="hs-bar" aria-hidden="true"><i></i></div>');
    const bar = el.previousElementSibling.firstChild;
    const pos = () => { const max = el.scrollWidth - el.clientWidth; bar.style.width = (max > 4 ? Math.max(18, (el.clientWidth / el.scrollWidth) * 100) : 0) + "%"; bar.style.marginLeft = (max > 4 ? (el.scrollLeft / el.scrollWidth) * 100 : 0) + "%"; };
    el.addEventListener("scroll", pos, { passive: true });
    el._pos = pos;
  });
  const fit = () => {
    scrollers.forEach((el) => {
      const on = el.scrollWidth > el.clientWidth + 4, h = el.closest("section").querySelector("h2");
      if (on) { el.tabIndex = 0; el.setAttribute("role", "region"); if (h) el.setAttribute("aria-label", h.textContent.trim()); }
      else ["tabindex", "role", "aria-label"].forEach((a) => el.removeAttribute(a));
      el._pos();
    });
    const forced = window.CSS && CSS.supports && CSS.supports("selector(::details-content)");
    document.querySelectorAll("details.fold").forEach((d) => {
      if (wide.matches && !forced) d.open = true;
      d.querySelector("summary").tabIndex = wide.matches ? -1 : 0;
    });
  };
  fit();
  langHooks.push(fit);
  wide.addEventListener?.("change", fit);
  addEventListener("resize", fit);

  /* ---------- Menu móvel ---------- */
  const menu = document.getElementById("mobile-menu");
  const menuBtn = document.querySelector(".menu-btn");
  if (menu && menuBtn) {
    /* Com o menu aberto, o resto da página fica inerte: o foco não sai do diálogo */
    const behind = (on) => [...document.body.children].forEach((el) => { if (el !== menu && !/^(script|svg)$/i.test(el.tagName)) el.inert = on; });
    const open = () => {
      menu.classList.add("open"); menu.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true"); document.body.classList.add("menu-open");
      behind(true);
      menu.querySelector(".close").focus();
    };
    const close = () => {
      menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open");
      behind(false);
      menuBtn.focus();
    };
    menu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [...menu.querySelectorAll("a[href],button")], a = document.activeElement;
      if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    menuBtn.addEventListener("click", open);
    menu.querySelectorAll("[data-close]").forEach((x) => x.addEventListener("click", close));
    menu.querySelectorAll("nav a, .btn").forEach((a) => a.addEventListener("click", () => { if (menu.classList.contains("open")) close(); }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) close(); });
    matchMedia("(min-width: 1100px)").addEventListener?.("change", (m) => { if (m.matches && menu.classList.contains("open")) close(); });
  }

  /* ---------- Carrossel do hero ----------
     Três slides empilhados na mesma célula; a troca é manual (setas, teclado ou
     arrastar o dedo) e em fade (CSS). O contador "1 / 3" é anunciado ao leitor de tela. */
  const hero = document.querySelector("[data-carousel]");
  if (hero) {
    const slides = [...hero.querySelectorAll(".slide")], cur = hero.querySelector("[data-cur]");
    let i = 0, x0 = null;
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { const on = k === i; s.classList.toggle("is-active", on); s.setAttribute("aria-hidden", String(!on)); s.inert = !on; });
      if (cur) cur.textContent = i + 1;
    };
    hero.querySelector("[data-prev]").addEventListener("click", () => show(i - 1));
    hero.querySelector("[data-next]").addEventListener("click", () => show(i + 1));
    hero.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    const strip = hero.querySelector(".slides");
    strip.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    strip.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 48) show(i + (dx < 0 ? 1 : -1));
    }, { passive: true });
    show(0);
  }

  /* ---------- Formulários ---------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll("[data-required]").forEach((input) => {
        const field = input.closest(".field");
        const err = field && field.querySelector(".err");
        let bad = !input.value.trim();
        if (!bad && input.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.toggleAttribute("data-invalid", bad);
        input.setAttribute("aria-invalid", String(bad));
        if (err) err.textContent = bad ? tr(input.type === "email" && input.value ? "err_email" : "err_required") : "";
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }
      status.hidden = false;
      const say = (state, key) => { status.dataset.state = state; status.textContent = tr(key); };
      if (!S.FORM_ENDPOINT) { say("demo", "form_demo"); return; }
      say("sending", "form_sending");
      try {
        const res = await fetch(S.FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
        say("ok", "form_ok");
        form.reset();
      } catch (err) {
        say("err", "form_err");
      }
    });
  });

  /* ---------- Cabeçalho com sombra ao rolar ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* A entrada dos blocos ao rolar fica em assets/js/motion.js */

  /* ---------- Links com âncora vindos de outra página ---------- */
  if (location.hash && location.hash.length > 1) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView(), 60);
  }
})();
