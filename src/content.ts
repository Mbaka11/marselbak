export type Lang = "en" | "fr";
export type L = Record<Lang, string>;

export const links = {
  github: "https://github.com/Mbaka11",
  linkedin: "https://www.linkedin.com/in/marsel-bakashov-813643213/",
  email: "m.bakashov11@gmail.com",
  mila: "https://mila.quebec/",
};

export const ui = {
  name: "Marsel Bak",
  role: { en: "Master's in Machine Learning at Mila", fr: "Maîtrise en apprentissage automatique à Mila" } as L,
  tagline: {
    en: "I turn machine learning into tools people actually use: reinforcement learning, AI agents, real-world data.",
    fr: "Je transforme l'apprentissage automatique en outils réellement utilisés : apprentissage par renforcement, agents IA, données réelles.",
  } as L,
  nav: {
    experience: { en: "Experience", fr: "Expérience" } as L,
    projects: { en: "Projects", fr: "Projets" } as L,
    education: { en: "Education", fr: "Formation" } as L,
    contact: { en: "Contact", fr: "Contact" } as L,
  },
  cv: { en: "Download CV", fr: "Télécharger le CV" } as L,
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
    name: "GravityGuyML",
    url: "https://github.com/Mbaka11",
    desc: {
      en: "Reinforcement learning side-scroller: a Gymnasium-compatible Pygame environment with procedural generation and deep RL agents (DQN, PPO, SAC, A2C).",
      fr: "Jeu à défilement en apprentissage par renforcement : environnement Pygame compatible Gymnasium, génération procédurale et agents RL profonds (DQN, PPO, SAC, A2C).",
    } as L,
    tags: ["Python", "Deep RL", "Gymnasium"],
  },
  {
    name: "ApplyPilot",
    url: "https://github.com/Mbaka11",
    desc: {
      en: "AI job-application agent: a local Chrome extension and server that analyze postings, pick the best CV, draft cover letters and autofill forms. The user always submits.",
      fr: "Agent de candidature : extension Chrome et serveur locaux qui analysent les offres, choisissent le meilleur CV, rédigent la lettre et remplissent les formulaires. C'est toujours l'utilisateur qui soumet.",
    } as L,
    tags: ["JavaScript", "Node.js", "LLM"],
  },
  {
    name: "Disease Outbreak Prediction",
    url: "https://github.com/Mbaka11",
    desc: {
      en: "Predicts 11 disease outcomes from symptom and weather data with KNN, SVM and XGBoost (0.98 macro F1).",
      fr: "Prédit 11 issues de maladies à partir de symptômes et de météo avec KNN, SVM et XGBoost (F1 macro de 0,98).",
    } as L,
    tags: ["Python", "scikit-learn", "XGBoost"],
  },
];

export const education = [
  {
    period: "01/2026 – 01/2028",
    school: { en: "University of Montreal / McGill – Mila", fr: "Université de Montréal / McGill – Mila" } as L,
    degree: { en: "Professional Master's in Machine Learning", fr: "Maîtrise professionnelle en apprentissage automatique" } as L,
  },
  {
    period: "09/2021 – 12/2025",
    school: { en: "Polytechnique Montréal", fr: "Polytechnique Montréal" } as L,
    degree: { en: "Bachelor of Software Engineering", fr: "Baccalauréat en génie logiciel" } as L,
  },
  {
    period: "02/2025 – 06/2025",
    school: { en: "Korea University", fr: "Korea University" } as L,
    degree: { en: "Exchange, Computer Engineering", fr: "Échange, génie informatique" } as L,
  },
];
