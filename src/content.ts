export type Lang = "en" | "fr";
export type L = Record<Lang, string>;

export const links = {
  github: "https://github.com/Mbaka11",
  linkedin: "https://www.linkedin.com/in/marsel-bakashov-813643213/",
  email: "m.bakashov11@gmail.com",
  mila: "https://mila.quebec/",
};

export const ui = {
  name: "Marsel Bakashov",
  role: { en: "Master's in Machine Learning at Mila", fr: "Maîtrise en apprentissage automatique à Mila" } as L,
  tagline: {
    en: "Machine learning, reinforcement learning and AI agents, built to work outside the notebook.",
    fr: "Apprentissage automatique, apprentissage par renforcement et agents IA, conçus pour fonctionner hors du notebook.",
  } as L,
  nav: {
    experience: { en: "Experience", fr: "Expérience" } as L,
    projects: { en: "Projects", fr: "Projets" } as L,
    education: { en: "Education", fr: "Formation" } as L,
    contact: { en: "Contact", fr: "Contact" } as L,
  },
  cv: { en: "CV", fr: "CV" } as L,
  day: { en: "Day", fr: "Jour" } as L,
  night: { en: "Night", fr: "Nuit" } as L,
  nightTitle: { en: "The personal side", fr: "Le côté perso" } as L,
  nightSoon: {
    en: "Coming soon: music, 3D, editing and side projects.",
    fr: "Bientôt : musique, 3D, montage et projets perso.",
  } as L,
};

export const experience = [
  {
    period: "05/2026 – 12/2026",
    org: "McKesson",
    title: { en: "Data Science & ML Intern", fr: "Stagiaire science des données et ML" } as L,
    points: {
      en: [
        "Built AI agents used by 100+ people to analyze business data and write executive summaries (about 10 hours saved per user per week).",
        "Orchestrated multi-agent workflows where dozens of agents with dedicated tools pass results to each other.",
        "Processed sensitive health data through APIs with privacy and security first.",
      ],
      fr: [
        "Agents IA utilisés par 100+ personnes pour analyser des données d'affaires et rédiger des synthèses (environ 10 h économisées par utilisateur par semaine).",
        "Flux multi-agents orchestrés où des dizaines d'agents avec leurs outils se passent les résultats.",
        "Traitement de données de santé sensibles via API, avec la confidentialité et la sécurité en priorité.",
      ],
    },
    tags: ["Python", "Multi-agent", "Azure", "Snowflake", "Power BI"],
  },
  {
    period: "09/2025 – 04/2026",
    org: "Intact Insurance",
    title: { en: "Data Scientist & RL Intern", fr: "Stagiaire science des données et RL" } as L,
    points: {
      en: [
        "Reinforcement learning pricing policies that improved simulated long-term profitability under 10+ regulatory and business constraints.",
        "Validated in simulation on millions of records (profit, volatility, CVaR).",
      ],
      fr: [
        "Politiques de tarification par apprentissage par renforcement qui améliorent la rentabilité simulée à long terme sous 10+ contraintes réglementaires et d'affaires.",
        "Validation en simulation sur des millions d'enregistrements (profit, volatilité, CVaR).",
      ],
    },
    tags: ["PyTorch", "Reinforcement learning", "MLflow", "Databricks"],
  },
  {
    period: "05/2024 – 09/2024",
    org: "Radio-Canada / CBC",
    title: { en: "Data Scientist Intern", fr: "Stagiaire science des données" } as L,
    points: {
      en: ["AI-powered indexing system unifying internal sources for semantic and keyword search across 15M+ elements."],
      fr: ["Système d'indexation par IA unifiant des sources internes pour la recherche sémantique et par mots-clés sur 15M+ éléments."],
    },
    tags: ["Azure AI Search", "Embeddings", "Airflow", "Hugging Face"],
  },
  {
    period: "09/2023 – 12/2023",
    org: "Stingray",
    title: { en: "Full-Stack Developer Intern", fr: "Stagiaire développeur full-stack" } as L,
    points: {
      en: ["Full-stack features in an Agile team with CI and code reviews."],
      fr: ["Fonctionnalités full-stack dans une équipe Agile, avec CI et revues de code."],
    },
    tags: ["Next.js", "React", "Node.js", "TypeScript"],
  },
];

export const projects = [
  {
    name: "ApplyPilot",
    url: "https://github.com/Mbaka11/ApplyPilot",
    image: "https://opengraph.githubassets.com/1/Mbaka11/ApplyPilot",
    desc: {
      en: "Local-first Chrome extension for internship discovery and applications: source filters, Workday autofill, cover letters and tracking. It never submits on its own.",
      fr: "Extension Chrome locale pour trouver des stages et postuler : filtres de sources, remplissage Workday, lettres de motivation et suivi. Elle ne soumet jamais seule.",
    } as L,
    tags: ["JavaScript", "Chrome extension", "LLM"],
  },
  {
    name: "ECG-AI-KG",
    url: "https://github.com/Mbaka11/ECG-AI-KG",
    image: "https://opengraph.githubassets.com/1/Mbaka11/ECG-AI-KG",
    desc: {
      en: "Research project: AI-assisted interpretation of paper ECGs from a smartphone photo, for remote primary care in Kyrgyzstan.",
      fr: "Projet de recherche : interprétation assistée par IA d'ECG papier à partir d'une photo de téléphone, pour les soins primaires à distance au Kirghizistan.",
    } as L,
    tags: ["Python", "Healthcare AI", "Knowledge graph"],
  },
  {
    name: "GravityGuyML",
    url: "https://github.com/Mbaka11/Gravity-Guy-ML",
    image: "https://opengraph.githubassets.com/1/Mbaka11/Gravity-Guy-ML",
    desc: {
      en: "A fast side-scroller where deep RL agents (DQN, PPO, SAC, A2C) learn when to flip gravity to survive. Gymnasium-compatible, with procedural levels.",
      fr: "Un jeu à défilement où des agents RL profonds (DQN, PPO, SAC, A2C) apprennent quand inverser la gravité pour survivre. Compatible Gymnasium, niveaux procéduraux.",
    } as L,
    tags: ["Python", "Deep RL", "Gymnasium"],
  },
  {
    name: "EvoTribes",
    url: "https://github.com/Mbaka11/evo-tribes-genetic-tribes-sim",
    image: "https://opengraph.githubassets.com/1/Mbaka11/evo-tribes-genetic-tribes-sim",
    desc: {
      en: "A modular genetic multi-agent simulation built with Gymnasium to study emergent group behavior and alignment failures.",
      fr: "Simulation génétique multi-agents modulaire, construite avec Gymnasium, pour étudier les comportements de groupe émergents et les échecs d'alignement.",
    } as L,
    tags: ["Python", "Multi-agent", "Gymnasium"],
  },
  {
    name: "HR Policy RAG Agent",
    url: "https://github.com/Mbaka11/hr-policy-ai-agent",
    image: "https://opengraph.githubassets.com/1/Mbaka11/hr-policy-ai-agent",
    desc: {
      en: "A retrieval-augmented AI agent that answers employee HR policy questions from PDFs, intranet pages and documents.",
      fr: "Un agent IA à récupération augmentée qui répond aux questions des employés sur les politiques RH à partir de PDF, de pages intranet et de documents.",
    } as L,
    tags: ["Python", "RAG", "LLM agents"],
  },
  {
    name: "Opening Range Bot",
    url: "https://github.com/Mbaka11/OpeningRangeTradingStrategy",
    image: "https://opengraph.githubassets.com/1/Mbaka11/OpeningRangeTradingStrategy",
    desc: {
      en: "Paper-trading bot and pre-registered research log for an intraday opening-range strategy on the Nasdaq-100, with daily results posted publicly.",
      fr: "Robot de paper trading et journal de recherche pré-enregistré pour une stratégie d'ouverture intrajournalière sur le Nasdaq-100, avec résultats quotidiens publiés.",
    } as L,
    tags: ["Python", "Quant", "Backtesting"],
  },
];

export const education = [
  {
    period: "01/2026 – 01/2028",
    logo: "/logos/edu-mila.png",
    school: { en: "University of Montreal / McGill – Mila", fr: "Université de Montréal / McGill – Mila" } as L,
    degree: { en: "Professional Master's in Machine Learning", fr: "Maîtrise professionnelle en apprentissage automatique" } as L,
  },
  {
    period: "09/2021 – 12/2025",
    logo: "/logos/edu-poly.png",
    school: { en: "Polytechnique Montréal", fr: "Polytechnique Montréal" } as L,
    degree: { en: "Bachelor of Software Engineering", fr: "Baccalauréat en génie logiciel" } as L,
  },
  {
    period: "02/2025 – 06/2025",
    logo: "/logos/edu-korea.png",
    school: { en: "Korea University", fr: "Korea University" } as L,
    degree: { en: "Exchange, Computer Engineering", fr: "Échange, génie informatique" } as L,
  },
];
