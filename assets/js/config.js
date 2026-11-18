/* ==========================================================================
   CONFIGURAÇÃO DO SITE · edite aqui primeiro
   Tudo o que se repete em várias páginas (nome, contatos,
   redes) fica neste arquivo. Os textos de cada página ficam no próprio HTML
   (inglês) e em assets/js/i18n.js (português e espanhol).
   ========================================================================== */
window.SITE = {

  /* Nome da marca, usado no cabeçalho, rodapé e títulos */
  BRAND: {
    name: "Eazy Way",
    sub: "Solutions",
    fullName: "Eazy Way Solutions",
    /* Logotipo (SVG em assets/img/). Para trocar, substitua o arquivo ou informe outro caminho. */
    logo: "assets/img/logo-ews.svg"
  },

  /* Endereço público do site, sem barra no final. Usado pelo blog (npm run blog)
     para gerar canonical, hreflang, sitemap.xml e RSS. TROQUE pelo domínio real. */
  SITE_URL: "https://www.eazywaysolutions.com",

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
  FORM_ENDPOINT: ""

  /* Fotos das fundadoras: ficam direto no HTML (Home e About), com alt e tamanho.
     Arquivos: assets/img/founder-natalia-close.webp e founder-vitoria-close.webp
     (700 x 875) mais as versões -360.webp. Para trocar, substitua os quatro arquivos
     mantendo nome e proporção 4:5. Nunca exibir acima de 330px de largura. */
};
