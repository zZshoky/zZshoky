export type Locale = "es" | "en";

export const translations = {
  es: {
    nav: {
      features:   "Funciones",
      howItWorks: "Cómo Funciona",
      waitlist:   "Lista de Espera",
    },
    hero: {
      badge:    "Inteligencia de compras gubernamentales",
      headline: "La inteligencia de compras del gobierno de Puerto Rico, en tiempo real",
      sub:      "Alertas de licitaciones, análisis de vendedores y detección de anomalías — todo en una plataforma.",
      cta:      "Únete a la Lista de Espera",
      ctaSub:   "Gratis. Sin tarjeta de crédito.",
    },
    stats: {
      label: "personas en lista de espera",
    },
    features: {
      title: "Todo lo que necesitas para ganar contratos",
      cards: [
        {
          icon:  "🔔",
          title: "Alertas de RFP en Tiempo Real",
          desc:  "Recibe notificaciones instantáneas cuando se publican licitaciones que coincidan con tu perfil.",
        },
        {
          icon:  "🏢",
          title: "Inteligencia de Vendedores",
          desc:  "Analiza el historial de contratos de tus competidores y encuentra oportunidades de mercado.",
        },
        {
          icon:  "⚠️",
          title: "Detección de Anomalías",
          desc:  "Identifica patrones inusuales en adjudicaciones con inteligencia artificial.",
        },
        {
          icon:  "📊",
          title: "Panel de Análisis",
          desc:  "Visualiza el gasto por agencia, municipio y categoría con dashboards interactivos.",
        },
        {
          icon:  "🤝",
          title: "Perfil de Agencias",
          desc:  "Conoce los patrones de compra de cada agencia antes de presentar tu propuesta.",
        },
        {
          icon:  "📋",
          title: "Exportación de Datos",
          desc:  "Exporta contratos y licitaciones en CSV/Excel para análisis y reportes internos.",
        },
      ],
    },
    howItWorks: {
      title: "Cómo Funciona",
      steps: [
        {
          step:  "01",
          title: "Configura tu Perfil",
          desc:  "Indica tu industria, códigos NAICS y agencias de interés. El sistema aprende tus preferencias.",
        },
        {
          step:  "02",
          title: "Recibe Alertas",
          desc:  "Te notificamos en tiempo real cuando se publican licitaciones relevantes en OCPR, ASG y USASpending.",
        },
        {
          step:  "03",
          title: "Analiza y Actúa",
          desc:  "Usa nuestras herramientas de inteligencia para tomar decisiones informadas y ganar más contratos.",
        },
      ],
    },
    social: {
      title: "Construido para el ecosistema de Puerto Rico",
      items: [
        "Contratistas del gobierno",
        "Firmas legales",
        "Periodistas de datos",
        "Municipios",
      ],
    },
    waitlist: {
      title:            "Sé de los Primeros",
      sub:              "Únete a la lista de espera y obtén acceso anticipado a Corpora PR.",
      namePlaceholder:  "Tu nombre (opcional)",
      emailPlaceholder: "tu@empresa.com",
      orgTypeLabel:     "Tipo de organización",
      orgTypes: {
        contractor: "Contratista / Empresa",
        law_firm:   "Firma Legal",
        journalist: "Periodista / Medios",
        compliance: "Cumplimiento / Auditoría",
        federal:    "Entidad Federal",
        municipal:  "Municipio / Agencia",
        other:      "Otro",
      },
      submitBtn:   "Unirme a la Lista",
      submitting:  "Enviando...",
      successMsg:  (pos: number) =>
        `¡Listo! Eres el #${pos} en la lista. Te contactaremos pronto.`,
      errorDup:    "Este correo ya está registrado.",
      errorGeneric:"Algo salió mal. Intenta de nuevo.",
    },
    footer: {
      tagline: "Construido en Puerto Rico. 🇵🇷",
      links: ["Privacidad", "Términos", "Contacto"],
    },
  },
  en: {
    nav: {
      features:   "Features",
      howItWorks: "How It Works",
      waitlist:   "Join Waitlist",
    },
    hero: {
      badge:    "Government procurement intelligence",
      headline: "Puerto Rico government procurement intelligence, in real time",
      sub:      "RFP alerts, vendor analytics, and anomaly detection — all in one platform.",
      cta:      "Join the Waitlist",
      ctaSub:   "Free. No credit card required.",
    },
    stats: {
      label: "people on the waitlist",
    },
    features: {
      title: "Everything you need to win government contracts",
      cards: [
        {
          icon:  "🔔",
          title: "Real-Time RFP Alerts",
          desc:  "Get instant notifications when matching procurement opportunities are published.",
        },
        {
          icon:  "🏢",
          title: "Vendor Intelligence",
          desc:  "Analyze competitors' contract histories and find market opportunities.",
        },
        {
          icon:  "⚠️",
          title: "Anomaly Detection",
          desc:  "Identify unusual award patterns with AI-powered analysis.",
        },
        {
          icon:  "📊",
          title: "Spend Analytics",
          desc:  "Visualize spending by agency, municipality and category with interactive dashboards.",
        },
        {
          icon:  "🤝",
          title: "Agency Profiles",
          desc:  "Understand each agency's procurement patterns before submitting a bid.",
        },
        {
          icon:  "📋",
          title: "Data Export",
          desc:  "Export contracts and bids to CSV/Excel for analysis and internal reporting.",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          step:  "01",
          title: "Set Up Your Profile",
          desc:  "Tell us your industry, NAICS codes, and agencies of interest. The system learns your preferences.",
        },
        {
          step:  "02",
          title: "Receive Alerts",
          desc:  "We notify you in real time when relevant bids are posted on OCPR, ASG, and USASpending.",
        },
        {
          step:  "03",
          title: "Analyze and Act",
          desc:  "Use our intelligence tools to make informed decisions and win more contracts.",
        },
      ],
    },
    social: {
      title: "Built for Puerto Rico's ecosystem",
      items: [
        "Government contractors",
        "Law firms",
        "Data journalists",
        "Municipalities",
      ],
    },
    waitlist: {
      title:            "Be Among the First",
      sub:              "Join the waitlist and get early access to Corpora PR.",
      namePlaceholder:  "Your name (optional)",
      emailPlaceholder: "you@company.com",
      orgTypeLabel:     "Organization type",
      orgTypes: {
        contractor: "Contractor / Company",
        law_firm:   "Law Firm",
        journalist: "Journalist / Media",
        compliance: "Compliance / Audit",
        federal:    "Federal Entity",
        municipal:  "Municipality / Agency",
        other:      "Other",
      },
      submitBtn:   "Join the List",
      submitting:  "Sending...",
      successMsg:  (pos: number) =>
        `Done! You're #${pos} on the list. We'll reach out soon.`,
      errorDup:    "This email is already registered.",
      errorGeneric:"Something went wrong. Please try again.",
    },
    footer: {
      tagline: "Built in Puerto Rico. 🇵🇷",
      links: ["Privacy", "Terms", "Contact"],
    },
  },
} as const;

export type Translations = typeof translations.es;
