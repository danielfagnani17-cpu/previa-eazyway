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
  const callBtns = (cls) => PHONES.map((p) => `<a class="${cls}" href="tel:${esc(p.tel)}">${icon("phone")}<span>${who(p)}${esc(p.label)}</span></a>`).join("");

  /* ---------- Ícones ---------- */
  /* Lucide (licença ISC), traço 1.5. Cada símbolo carrega o próprio traço para não depender do CSS. */
  const L = {
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .7 2.810 2 2 0 0 1-.450 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.450 12.840 12.840 0 0 0 2.810.7A2 2 0 0 1 22 16.920z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.870"/><path d="M16 3.130a4 4 0 0 1 0 7.750"/>',
    languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    messages: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.100.9-2 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    "list-checks": '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "file-check": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
    "file-search": '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="m9 18-1.500-1.500"/><circle cx="5" cy="14" r="3"/>',
    "file-pen": '<path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.010 4.012a2 2 0 0 0-.506.854l-.837 2.870a.5.5 0 0 0 .620.620l2.870-.837a2 2 0 0 0 .854-.506z"/><path d="M8 18h1"/>',
    "pen-line": '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.620-.620l.838-2.872a2 2 0 0 1 .506-.854z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.500 14.500 0 0 0 0 20 14.500 14.500 0 0 0 0-20"/><path d="M2 12h20"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    "folder-open": '<path d="m6 14 1.500-2.900A2 2 0 0 1 9.240 10H20a2 2 0 0 1 1.940 2.500l-1.540 6a2 2 0 0 1-1.950 1.500H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.900a2 2 0 0 1 1.690.9l.810 1.200a2 2 0 0 0 1.670.9H18a2 2 0 0 1 2 2v2"/>',
    heart: '<path d="M19 14c1.490-1.460 3-3.210 3-5.500A5.500 5.500 0 0 0 16.500 3c-1.760 0-3 .5-4.500 2-1.500-1.500-2.740-2-4.500-2A5.500 5.500 0 0 0 2 8.500c0 2.300 1.500 4.050 3 5.500l7 7Z"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.500 2.500a1 1 0 1 0 3-3l-3.880-3.880a3 3 0 0 0-4.240 0l-.880.880a1 1 0 1 1-3-3l2.810-2.810a5.790 5.790 0 0 1 7.060-.870l.470.280a2 2 0 0 0 1.420.250L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.500 6.500a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.700 1.500-2.500 1-.9 1.500-2.200 1.500-3.500A6 6 0 0 0 6 8c0 1 .2 2.200 1.500 3.500.7.7 1.300 1.500 1.500 2.500"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    play: '<path d="m6 3 14 9-14 9V3z"/>',
    "id-card": '<path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.170 15a3 3 0 0 1 5.660 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    plane: '<path d="M17.800 19.200 16 11l3.500-3.500C21 6 21.500 4 21 3c-1-.5-3 0-4.500 1.500L13 8 4.800 6.200c-.5-.1-.9.1-1.100.5l-.3.5c-.2.5-.1 1 .3 1.300L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.500 5.300c.3.4.8.5 1.300.3l.5-.2c.4-.3.6-.7.5-1.200z"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.370A4 4 0 1 1 12.630 8 4 4 0 0 1 16 11.370z"/><path d="M17.500 6.500h.010"/>',
    youtube: '<path d="M2.500 17a24.120 24.120 0 0 1 0-10 2 2 0 0 1 1.400-1.400 49.560 49.560 0 0 1 16.200 0A2 2 0 0 1 21.500 7a24.120 24.120 0 0 1 0 10 2 2 0 0 1-1.400 1.400 49.550 49.550 0 0 1-16.200 0A2 2 0 0 1 2.500 17"/><path d="m10 15 5-3-5-3z"/>'
  };
  const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><defs>${
    Object.entries(L).map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</g></symbol>`).join("")
  }<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.310 4.679a2.123 2.123 0 0 0 1.595 1.160l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.140a.53.53 0 0 1-.771.560l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.010a.53.53 0 0 1-.770-.560l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.160 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.160z"/></symbol>
<symbol id="i-logo" viewBox="0 0 36 42"><path d="M18 1.5 34.5 7.5V21c0 10.500-7.500 17-16.500 19.500C9 38 1.500 31.500 1.500 21V7.500Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.500 13h15M10.500 18h15M10.500 23h9" stroke="currentColor" stroke-width="1.7"/><path d="m21 27.500 2.800 2.800 5-5" stroke="currentColor" stroke-width="1.7" fill="none"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.030-.967-.273-.099-.471-.148-.670.150-.197.297-.767.966-.940 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.390-1.475-.883-.788-1.480-1.761-1.653-2.059-.173-.297-.018-.458.130-.606.134-.133.298-.347.446-.520.149-.174.198-.298.298-.497.099-.198.050-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.510-.173-.008-.371-.010-.570-.010-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.360.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.870 9.870 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.860 9.860 0 0 1-1.510-5.260c.001-5.450 4.436-9.884 9.888-9.884 2.640 0 5.122 1.030 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.450-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.050 0C5.495 0 .160 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.480-8.413z"/></symbol>
</defs></svg>`;
  /* Webfonts: a folha entra como media="print" (não bloqueia) e passa a valer aqui */
  document.querySelectorAll("link[data-async-css]").forEach((l) => { l.media = "all"; });
  document.body.insertAdjacentHTML("afterbegin", SPRITE);

  const icon = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  /* Telefone clicável com o ícone do WhatsApp ao lado */
  const phoneLine = (p) => `<span class="ph"><a href="tel:${esc(p.tel)}">${who(p)}${esc(p.label)}</a>${p.wa
    ? `<a class="wa-link" href="https://wa.me/${esc(p.wa)}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(p.name)} ${esc(p.label)}" title="WhatsApp">${icon("whatsapp")}</a>` : ""}</span>`;
  /* Bandeiras do seletor de idioma (SVG, porque emoji de bandeira não aparece no Windows) */
  const FLAGS = {
    en: `<rect width="18" height="12" fill="#B22234"/><path d="M0 1.38h18M0 3.23h18M0 5.08h18M0 6.92h18M0 8.77h18M0 10.62h18" stroke="#fff" stroke-width=".92"/><rect width="7.6" height="6.46" fill="#3C3B6E"/><path d="M.9 1.1h6M.9 2.5h6M.9 3.9h6M.9 5.3h6" stroke="#fff" stroke-width=".5" stroke-dasharray=".5 .8"/>`,
    pt: `<rect width="18" height="12" fill="#009C3B"/><path d="M9 1.3l7.2 4.7L9 10.700 1.8 6z" fill="#FFDF00"/><circle cx="9" cy="6" r="2.5" fill="#002776"/>`,
    es: `<rect width="18" height="12" fill="#AA151B"/><rect y="3" width="18" height="6" fill="#F1BF00"/>`
  };
  const flag = (l) => `<svg class="flag" viewBox="0 0 18 12" aria-hidden="true">${FLAGS[l]}</svg>`;
  const t = (key, en) => `<span data-i18n="${key}">${en}</span>`;

  const logoHTML = (white) => {
    const src = white ? (B.logoWhite || B.logo) : B.logo;
    if (src) return `<img class="logo-img" src="${esc(asset(src))}" alt="${esc(B.fullName)}" width="133" height="40">`;
    return `${icon("logo", "logo-mark")}<span><span class="name">${esc(B.name)}</span><span class="sub">${esc(B.sub)}</span></span>`;
  };

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
  function renderHeader(el) {
    el.outerHTML = `
<a class="skip" href="#main">${t("skip", "Skip to content")}</a>
<div class="topbar">
  <div class="wrap">
    <span class="tagline">${t("topbar", "Document preparation, certified translation and interpreters in three languages.")}</span>
    <div class="items">
      ${PHONES.map((p) => `<a class="t-phone" href="tel:${esc(p.tel)}">${icon("phone")}${who(p)}${esc(p.label)}</a>`).join('<span class="t-sep" aria-hidden="true">/</span>')}
      <div class="langs" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="false" title="English" aria-label="English">${flag("en")}</button>
        <button type="button" data-lang="pt" aria-pressed="false" title="Português" aria-label="Português">${flag("pt")}</button>
        <button type="button" data-lang="es" aria-pressed="false" title="Español" aria-label="Español">${flag("es")}</button>
      </div>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${R || "./"}" aria-label="${esc(B.fullName)}, home">${logoHTML(false)}</a>
    <nav class="nav" aria-label="Main">${navLinks()}</nav>
    <div class="header-actions">
      <a class="btn btn-brand" href="${R}contact/">${t("cta_btn", "Free Consultation")}${icon("arrow")}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu"><span></span><b class="visually-hidden" data-i18n="menu_open">Open menu</b></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="scrim" data-close></div>
  <div class="panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="top">
      <a class="brand" href="${R || "./"}">${logoHTML(false)}</a>
      <button class="close" type="button" data-close><span aria-hidden="true">×</span><b class="visually-hidden" data-i18n="menu_close">Close menu</b></button>
    </div>
    <nav aria-label="Mobile">${navLinks()}</nav>
    <a class="btn btn-brand" href="${R}contact/">${t("cta_btn", "Free Consultation")}${icon("arrow")}</a>
    <div class="contact">
      ${PHONES.map(phoneLine).join("")}
      ${EMAILS.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join("")}
    </div>
  </div>
</div>`;
  }

  /* ---------- Componente: CTA final ---------- */
  function renderCTA(el) {
    el.outerHTML = `
<section class="cta on-photo" aria-labelledby="cta-title">
  <figure class="photo" data-img="cta"></figure>
  <div class="shade"></div>
  <div class="wrap">
    <div class="stack">
      <h2 class="h2" id="cta-title" data-i18n="cta_title">Not sure which document you need? Talk to our team at no cost.</h2>
      <p class="lead" data-i18n="cta_text">Tell us about your situation and we will explain the options, the price and the timeline before you decide.</p>
    </div>
    <div class="btns">
      <a class="btn btn-white" href="${R}contact/">${t("cta_btn2", "Request a Quote")}${icon("arrow")}</a>
      ${callBtns("btn btn-ghost")}
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
    <div class="cols">
      <div>
        <a class="brand" href="${R || "./"}" aria-label="${esc(B.fullName)}, home">${logoHTML(false)}</a>
        <p style="margin-top:20px;max-width:36ch" data-i18n="footer_about">Document preparation, certified translation and interpreters for families in English, Portuguese and Spanish.</p>
        <div class="socials">${socialHTML()}</div>
      </div>
      <div>
        <h3 data-i18n="footer_nav">Navigation</h3>
        <ul>${PAGES.map((p) => `<li><a href="${(R + p.href) || "./"}"${p.id === "blog" ? " data-blog-link" : ""}>${t(p.key, p.label)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h3 data-i18n="footer_services">Services</h3>
        <ul>
          <li><a href="${R}services/#divorce">${t("s_divorce", "Uncontested Divorce")}</a></li>
          <li><a href="${R}services/#name-change">${t("s_name", "Name Change")}</a></li>
          <li><a href="${R}services/#translation">${t("s_translation", "Certified Translation")}</a></li>
          <li><a href="${R}services/#power-of-attorney">${t("s_poa", "Power of Attorney")}</a></li>
          <li><a href="${R}services/#interpreters">${t("s_interp", "Interpreters")}</a></li>
        </ul>
      </div>
      <div>
        <h3 data-i18n="footer_contact">Contact</h3>
        <ul>
          ${PHONES.map((p) => `<li class="ci">${icon("phone")}${phoneLine(p)}</li>`).join("")}
          ${EMAILS.map((e) => `<li class="ci">${icon("mail")}<a href="mailto:${esc(e)}">${esc(e)}</a></li>`).join("")}
          <li class="ci">${icon("pin")}<span>${esc(C.address)}</span></li>
          <li class="ci">${icon("clock")}<span>${esc(C.hours)}</span></li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <p class="disclaimer" data-i18n="disclaimer">${esc(B.fullName)} is not a law firm and is not a substitute for an attorney. We cannot give legal advice, choose forms for you based on legal judgment, or represent you in court. Services are provided at your direction, based on the information you supply.</p>
      <div class="copy"><span>© ${year} ${esc(B.fullName)}. <span data-i18n="rights">All rights reserved.</span></span><span class="credit">created with love · <a href="https://tassiane.com" target="_blank" rel="noopener">tassiane.com</a></span><a href="#top" data-i18n="back_top">Back to top ↑</a></div>
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
      if (wa.length) el.outerHTML = wa.map((p) => `<a class="${esc(el.className)}" href="https://wa.me/${esc(p.wa)}" target="_blank" rel="noopener">${icon("whatsapp")}<span>WhatsApp · ${esc(p.name || p.label)}</span></a>`).join("");
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

  /* ---------- Fotos ---------- */
  /* Fundadoras: config.js (FOUNDER_PHOTOS) decide entre o recorte e a foto original */
  const CUT = S.FOUNDER_PHOTOS === "cutout";
  document.querySelectorAll(".photo[data-img]").forEach((fig) => {
    const all = S.IMAGES || {}, key = fig.dataset.img;
    const cut = CUT && /^founder/.test(key) && all[key + "Cutout"] && all[key + "Cutout"].src;
    const img = (cut ? all[key + "Cutout"] : all[key]) || {};
    if (cut) fig.classList.add("cutout");
    if (img.src) {
      fig.classList.add("has-img");
      const inHero = !!fig.closest(".hero"), first = (inHero && !!fig.closest(".slide.active")) || !!fig.closest(".page-hero");
      /* no celular a primeira foto de fundadora do About já aparece na primeira tela */
      const early = !!fig.closest(".founder:first-child");
      const src = asset(img.src);
      /* versões -800.webp existem para as fotos largas (1600px) */
      /* fotos das fundadoras: versão -480.webp para telas pequenas */
      const sm = img.sm && /\.webp$/.test(src) ? ` srcset="${esc(src.replace(/\.webp$/, `-${img.sm}.webp`))} ${img.sm}w, ${esc(src)} ${img.w}w" sizes="${fig.closest(".founder") ? "(min-width:1021px) 320px, 260px" : "(min-width:961px) 240px, 46vw"}"` : "";
      const set = sm || (img.w >= 1600 && /\.webp$/.test(src) ? ` srcset="${esc(src.replace(/\.webp$/, "-800.webp"))} 800w, ${esc(src)} 1600w" sizes="${inHero || fig.closest(".page-hero") ? "(min-width:900px) 58vw, 100vw" : "(min-width:960px) 50vw, 100vw"}"` : "");
      const dims = img.w && img.h ? ` width="${img.w}" height="${img.h}"` : "";
      fig.insertAdjacentHTML("afterbegin", `<img src="${esc(src)}"${set}${dims} alt="${esc(img.alt || "")}" decoding="async" ${first ? 'loading="eager" fetchpriority="high"' : early ? 'loading="eager"' : 'loading="lazy"'}>`);
    } else {
      fig.setAttribute("role", "presentation");
    }
  });

  /* ---------- Paleta ---------- */
  function setPalette(p) {
    document.documentElement.dataset.palette = p;
    document.querySelectorAll(".palette-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.palette === p)));
  }
  setPalette(S.PALETTE ?? "");
  if (window.SITE_PREVIEW) {
    document.body.insertAdjacentHTML("beforeend", `<div class="palette-switch" role="group" aria-label="Color palette"><span>Palette</span>
      <button type="button" data-palette="" aria-pressed="false"><i style="background:#1C4A57"></i>Petrol</button>
      <button type="button" data-palette="wine" aria-pressed="false"><i style="background:#5E2333"></i>Wine</button></div>`);
    document.querySelectorAll(".palette-switch button").forEach((b) => b.addEventListener("click", () => setPalette(b.dataset.palette)));
    setPalette(S.PALETTE ?? "");
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
    matchMedia("(min-width: 1021px)").addEventListener?.("change", (m) => { if (m.matches && menu.classList.contains("open")) close(); });
  }

  /* ---------- Pausa da troca automática (hero e depoimentos) ----------
     Botão só com ícone; o nome acessível vai em aria-label, no idioma ativo. */
  const PP = { en: ["Pause slideshow", "Play slideshow"], pt: ["Pausar slides", "Reproduzir slides"], es: ["Pausar diapositivas", "Reproducir diapositivas"] };
  const pauseBtn = (cls, onToggle) => {
    const b = document.createElement("button");
    let off = false;
    b.type = "button"; b.className = cls; b.innerHTML = icon("pause");
    const label = () => b.setAttribute("aria-label", (PP[lang] || PP.en)[off ? 1 : 0]);
    b.addEventListener("click", () => {
      off = !off;
      b.querySelector("use").setAttribute("href", "#i-" + (off ? "play" : "pause"));
      label(); onToggle(off);
    });
    langHooks.push(label); label();
    return b;
  };

  /* ---------- Slider do hero ---------- */
  const hero = document.querySelector(".hero[data-slider]");
  if (hero) {
    const slides = [...hero.querySelectorAll(".slide")];
    const dots = hero.querySelector(".hero-dots");
    let i = 0;
    slides.forEach((sl, n) => {
      sl.setAttribute("role", "group"); sl.setAttribute("aria-roledescription", "slide"); sl.setAttribute("aria-label", `${n + 1} / ${slides.length}`);
      dots.insertAdjacentHTML("beforeend", `<button type="button" aria-label="Slide ${n + 1}"></button>`);
    });
    const dotBtns = [...dots.children];
    const pad = (n) => String(n).padStart(2, "0");
    dots.insertAdjacentHTML("beforebegin", `<p class="hero-count" aria-hidden="true"><b>01</b> / ${pad(slides.length)}</p>`);
    const count = hero.querySelector(".hero-count b");
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { const on = k === i; s.classList.toggle("active", on); s.setAttribute("aria-hidden", String(!on)); s.inert = !on; });
      dotBtns.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
      count.textContent = pad(i + 1);
      /* setas e barras acompanham o tom do slide ativo (claro ou escuro) */
      hero.dataset.tone = slides[i].dataset.tone || "light";
    };
    /* Troca automática: a barra de progresso do indicador ativo (CSS) marca o tempo.
       Pausa ao passar o mouse ou focar; desligada com movimento reduzido. */
    dots.addEventListener("animationend", (e) => { if (e.target.getAttribute("aria-current") === "true") show(i + 1); });
    const pause = (on) => hero.classList.toggle("paused", on);
    hero.addEventListener("mouseenter", () => pause(true));
    hero.addEventListener("mouseleave", () => pause(false));
    hero.addEventListener("focusin", () => pause(true));
    hero.addEventListener("focusout", (e) => { if (!hero.contains(e.relatedTarget)) pause(false); });
    hero.querySelector(".prev").addEventListener("click", () => show(i - 1));
    hero.querySelector(".next").addEventListener("click", () => show(i + 1));
    dotBtns.forEach((d, k) => d.addEventListener("click", () => show(k)));
    hero.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    dots.after(pauseBtn("hero-pause", (off) => hero.classList.toggle("stopped", off)));
    show(0);
  }

  /* ---------- Slider de depoimentos ---------- */
  document.querySelectorAll("[data-tslider]").forEach((box) => {
    const items = [...box.querySelectorAll(".testi")];
    const dots = box.querySelector(".ts-dots");
    if (items.length < 2) { box.querySelectorAll(".ts-ctrl").forEach((b) => { b.hidden = true; }); return; }
    let i = 0, timer = null, user = false;
    const track = box.querySelector(".ts-track"), still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    items.forEach((_, n) => dots.insertAdjacentHTML("beforeend", `<button type="button" aria-label="${n + 1} / ${items.length}"></button>`));
    const dotBtns = [...dots.children];
    const show = (n) => {
      i = (n + items.length) % items.length;
      items.forEach((s, k) => { const on = k === i; s.classList.toggle("active", on); s.setAttribute("aria-hidden", String(!on)); });
      dotBtns.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    };
    /* Troca automática a cada 8 s; pausa com mouse ou foco e com movimento reduzido */
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { if (!timer && !user && !still) timer = setInterval(() => show(i + 1), 8000); };
    /* parado (pelo botão ou por "reduzir movimento"), a troca manual é anunciada ao leitor de tela */
    const live = (on) => track.setAttribute("aria-live", on ? "polite" : "off");
    dots.appendChild(pauseBtn("ts-pause", (off) => { user = off; live(off); if (off) stop(); else play(); }));
    live(still);
    box.querySelector(".prev").addEventListener("click", () => show(i - 1));
    box.querySelector(".next").addEventListener("click", () => show(i + 1));
    dotBtns.forEach((d, k) => d.addEventListener("click", () => show(k)));
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", play);
    box.addEventListener("focusin", stop);
    box.addEventListener("focusout", (e) => { if (!box.contains(e.relatedTarget)) play(); });
    show(0);
    play();
  });

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
