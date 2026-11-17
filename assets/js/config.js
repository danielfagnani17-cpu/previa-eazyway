/* ==========================================================================
   CONFIGURAÇÃO DO SITE · edite aqui primeiro
   Tudo o que se repete em várias páginas (nome, contatos, redes, imagens,
   cor) fica neste arquivo. Os textos de cada página ficam no próprio HTML
   (inglês) e em assets/js/i18n.js (português e espanhol).
   ========================================================================== */
window.SITE = {

  /* Nome da marca, usado no cabeçalho, rodapé e títulos */
  BRAND: {
    name: "Eazy Way",
    sub: "Solutions",
    fullName: "Eazy Way Solutions",
    /* Deixe vazio para usar o símbolo desenhado. Para usar o seu logotipo,
       coloque o arquivo em assets/img/ e informe o caminho, ex.:
       logo: "assets/img/logo.svg", logoWhite: "assets/img/logo-white.svg" */
    logo: "assets/img/logo-ews.svg",
    logoWhite: "assets/img/logo-ews-white.svg"
  },

  /* Endereço público do site, sem barra no final. Usado pelo blog (npm run blog)
     para gerar canonical, hreflang, sitemap.xml e RSS. TROQUE pelo domínio real. */
  SITE_URL: "https://www.eazywaysolutions.com",

  /* Paleta: "" (azul petróleo, padrão) ou "wine" (vinho) */
  PALETTE: "",

  /* Movimento (assets/js/motion.js). marquee: faixa horizontal lenta com os idiomas
     e os nomes dos serviços logo abaixo do hero da Home. Fica DESLIGADA (false)
     porque é um bloco novo na página: só ligar (true) com a aprovação da cliente. */
  MOTION: { marquee: false },

  /* Retratos das fundadoras (Home e About): ESTE É O ÚNICO LUGAR PARA TROCAR.
     "cutout"   = recortes sobre o mesmo fundo areia, mesma escala e mesma linha dos olhos
                  (founder-*-cutout.webp). AGUARDANDO APROVAÇÃO DA CLIENTE.
     "original" = fotos originais, como a cliente enviou (founder-*.webp).
     Para voltar às originais, troque só o valor abaixo. (O <noscript> de index.html e
     about/index.html e o preload de about/index.html apontam para o recorte: só
     afetam quem navega sem JavaScript e o tempo de carga, não o que aparece.) */
  FOUNDER_PHOTOS: "cutout",

  /* Idioma inicial: "en", "pt" ou "es" */
  DEFAULT_LANG: "en",

  /* Contatos: SUBSTITUA pelos dados reais */
  CONTACT: {
    /* Os telefones aparecem na barra do topo; os e-mails, no rodapé e na página de contato */
    emails: [
      "eazywaysolutions.oliver@gmail.com",
      "eazywaysolutions.rosato@gmail.com"
    ],
    /* name: nome que aparece ao lado do número (deixe "" para mostrar só o número).
       whatsapp: true mostra o ícone do WhatsApp ao lado do número (false esconde).
       Com mais de um número com WhatsApp, o botão fixo abre uma lista para escolher. */
    phones: [
      { number: "404-502-3653", name: "Vitoria", whatsapp: true },
      { number: "858-833-8923", name: "Natalia", whatsapp: true }
    ],
    address: "Alabama · Georgia · Colorado",
    hours: "Mon to Fri, 9 am to 5 pm (Eastern and Mountain Time)"
  },

  /* Redes sociais: troque pelos links dos perfis. Deixe "" para esconder. */
  SOCIAL: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
    youtube: ""
  },

  /* Formulários: cole aqui o endpoint do Formspree, Getform, Basin etc.
     Enquanto estiver vazio, o formulário só mostra uma mensagem de teste. */
  FORM_ENDPOINT: "",

  /* Imagens: coloque os arquivos em assets/img/ e informe o caminho.
     Enquanto o caminho estiver vazio, aparece um espaço reservado liso,
     sem legenda. "alt" descreve a foto para leitores de tela. */
  IMAGES: {
    hero1:      { src: "assets/img/banner-services.webp", w: 1600, h: 1067, alt: "" },
    hero2:      { src: "assets/img/blog-translation.webp", w: 1600, h: 1067, alt: "" },
    hero3:      { src: "assets/img/banner-contact.webp", w: 1600, h: 900, alt: "" },
    intro:      { src: "assets/img/intro-reviewing-documents.webp", w: 1600, h: 1067, alt: "Two women reviewing documents together at a desk" },
    card1:      { src: "", alt: "Couple signing documents at a table" },
    card2:      { src: "", alt: "Official certificates and translated pages on a desk" },
    card3:      { src: "", alt: "Interpreter speaking with a client" },
    about1:     { src: "assets/img/about-team-working.webp", w: 1600, h: 1067, alt: "Two women working with documents and a laptop" },
    founderNatalia: { src: "assets/img/founder-natalia.webp", w: 900, sm: 480, h: 1125, alt: "Portrait of Natalia Rosato, Co-Founder and Paralegal" },
    founderVitoria: { src: "assets/img/founder-vitoria.webp", w: 900, sm: 480, h: 1084, alt: "Portrait of Vitoria Oliver, Co-Founder and Paralegal" },
    /* recortes (usados quando FOUNDER_PHOTOS = "cutout"); o alt é o mesmo das originais */
    founderNataliaCutout: { src: "assets/img/founder-natalia-cutout.webp", w: 900, sm: 480, h: 1125, alt: "Portrait of Natalia Rosato, Co-Founder and Paralegal" },
    founderVitoriaCutout: { src: "assets/img/founder-vitoria-cutout.webp", w: 900, sm: 480, h: 1125, alt: "Portrait of Vitoria Oliver, Co-Founder and Paralegal" },
    about2:     { src: "", alt: "Close-up of hands signing a form" },
    cta:        { src: "assets/img/cta-signing.webp", w: 1600, h: 1200, alt: "" },
    pageAbout:  { src: "assets/img/banner-about.webp", w: 1600, h: 1067, alt: "" },
    pageServices:{ src: "assets/img/banner-services.webp", w: 1600, h: 1067, alt: "" },
    /* Contact usa a mesma foto calma de "mãos e papel" da CTA (a página não tem CTA no fim).
       Para voltar à foto anterior: src "assets/img/banner-contact.webp", h 900. */
    pageContact:{ src: "assets/img/cta-signing.webp", w: 1600, h: 1200, alt: "" },
    pageLawFirms:{ src: "assets/img/banner-law-firms.webp", w: 1600, h: 1067, alt: "" },
    svcDivorce: { src: "assets/img/blog-divorce.webp", w: 1600, h: 900, alt: "Close-up of a woman's hands touching her wedding ring" },
    svcName:    { src: "", alt: "Name change petition and ID cards" },
    svcTranslation:{ src: "assets/img/blog-translation.webp", w: 1600, h: 1067, alt: "Woman's hands sorting printed forms on a desk" },
    svcPoa:     { src: "assets/img/blog-power-of-attorney.webp", w: 1600, h: 1067, alt: "Hand stamping a document on a desk" },
    svcPrenup:  { src: "", alt: "Couple reviewing a marriage agreement" },
    svcBackground:{ src: "", alt: "Fingerprint card and request forms" },
    svcPassport:{ src: "", alt: "Passport and visa application forms" },
    svcMarriage:{ src: "", alt: "Marriage certificate with an apostille" },
    svcInterp:  { src: "", alt: "Interpreter at an interview" }
  }
};
