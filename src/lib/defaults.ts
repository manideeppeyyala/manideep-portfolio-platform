/**
 * Seed content.
 *
 * Two jobs:
 *  1. What a brand-new install shows before anything is edited.
 *  2. The fallback merged under stored content, so adding a schema field
 *     never breaks an existing install.
 *
 * Everything here is real, migrated from the previous portfolio's
 * `data/content.json`. Nothing is invented. Skill proficiency levels are
 * the one editorial judgement — review them in Admin → Skills.
 */

import type { Content } from "./schema";

export const DEFAULT_CONTENT: Content = {
  /* ---------------------------------------------------------------- */
  settings: {
    siteTitle: "Peyyala Manideep — SmartComm Developer & AI/Data Engineer",
    siteDescription:
      "SmartComm Developer & AI/Data Engineer at Deloitte. Python, SQL-driven backend logic, document-processing pipelines and automation for enterprise systems.",
    shortName: "Peyyala Manideep",
    logoText: "PM",
    logoImage: "",
    favicon: "",
    profileImage: "/profile.jpg",
    email: "manideepyadav380@gmail.com",
    phone: "+91 70757 43204",
    whatsapp: "+917075743204",
    location: "Nellore, India",
    availabilityStatus: "Open to opportunities",
    availabilityOpen: true,
    responseTime: "Usually replies within 24 hours",
    footerText:
      "Building reliable backend systems at the intersection of Python, SmartComm and data.",
    copyrightText: "Peyyala Manideep. All rights reserved.",
    maintenanceMode: false,
    maintenanceMessage:
      "This site is briefly down for updates. Please check back shortly.",
  },

  /* ---------------------------------------------------------------- */
  navigation: [
    { id: "nav_about", label: "About", href: "#about", external: false, order: 0, enabled: true },
    { id: "nav_skills", label: "Skills", href: "#skills", external: false, order: 1, enabled: true },
    { id: "nav_exp", label: "Experience", href: "#experience", external: false, order: 2, enabled: true },
    { id: "nav_proj", label: "Projects", href: "#projects", external: false, order: 3, enabled: true },
    { id: "nav_cert", label: "Certifications", href: "#certifications", external: false, order: 4, enabled: true },
    { id: "nav_contact", label: "Contact", href: "#contact", external: false, order: 5, enabled: true },
  ],

  sections: [
    { key: "hero", label: "Hero", enabled: true, order: 0 },
    { key: "about", label: "About", enabled: true, order: 1 },
    { key: "skills", label: "Skills", enabled: true, order: 2 },
    { key: "experience", label: "Experience", enabled: true, order: 3 },
    { key: "projects", label: "Projects", enabled: true, order: 4 },
    { key: "services", label: "Services", enabled: false, order: 5 },
    { key: "certifications", label: "Certifications", enabled: true, order: 6 },
    { key: "education", label: "Education", enabled: true, order: 7 },
    { key: "testimonials", label: "Testimonials", enabled: false, order: 8 },
    { key: "contact", label: "Contact", enabled: true, order: 9 },
  ],

  /* ---------------------------------------------------------------- */
  hero: {
    eyebrow: "SmartComm Developer · AI & Data Engineer",
    name: "Peyyala",
    nameAccent: "Manideep",
    titles: [
      "SmartComm Developer",
      "AI & Data Engineer",
      "Analyst, Consulting Services @ Deloitte",
      "Python Backend Developer",
    ],
    intro:
      "Detail-oriented SmartComm Developer & AI/Data Engineer specializing in Python — building document-processing systems, SQL-driven backend logic and automation that hold up in production.",
    primaryCtaLabel: "View Projects",
    primaryCtaHref: "#projects",
    secondaryCtaLabel: "Experience",
    secondaryCtaHref: "#experience",
    tertiaryCtaLabel: "Contact",
    tertiaryCtaHref: "#contact",
    image: "/profile.jpg",
    imageAlt: "Portrait of Peyyala Manideep",
    showSocials: true,
    showParticles: true,
  },

  /* ---------------------------------------------------------------- */
  about: {
    eyebrow: "About",
    heading: "Backend engineering, with the details right.",
    lead: "A SmartComm Developer & AI/Data Engineer building document-processing systems and backend data workflows for enterprise clients.",
    paragraphs: [
      "I'm Peyyala Manideep — a SmartComm Developer & AI/Data Engineer currently working as an Analyst, Consulting Services at Deloitte in Hyderabad, building document-processing systems and backend data workflows for enterprise clients.",
      "My work spans Python, SmartComm, SQL and backend integration — designing clean, modular systems that transform and validate high-volume enterprise data. I care about maintainable code, scalable design fundamentals, and getting the details right in production.",
      "Beyond backend engineering, I'm actively building skills in AI tools, data engineering and analytics — from Databricks certification to hands-on Anthropic Claude training — and I share that journey through tech and career content as Vlogging With Mani.",
    ],
    image: "/profile.jpg",
    highlights: [
      "SmartComm",
      "AI Tools",
      "Data Engineering",
      "Automation",
      "Cloud Platforms",
    ],
    ctaLabel: "Get in touch",
    ctaHref: "#contact",
    stats: [
      { id: "stat_cgpa", value: "8.84", label: "B.Tech CGPA", order: 0, enabled: true },
      { id: "stat_certs", value: "8+", label: "Certifications", order: 1, enabled: true },
      { id: "stat_pub", value: "1", label: "IEEE Publication", order: 2, enabled: true },
      { id: "stat_stack", value: "20+", label: "Technologies", order: 3, enabled: true },
    ],
  },

  /* ---------------------------------------------------------------- */
  skillCategories: [
    { id: "sc_lang", name: "Programming Languages", icon: "Code2", description: "", order: 0, enabled: true },
    { id: "sc_backend", name: "Backend & Integration", icon: "Server", description: "", order: 1, enabled: true },
    { id: "sc_data", name: "Databases & Data Engineering", icon: "Database", description: "", order: 2, enabled: true },
    { id: "sc_smartcomm", name: "SmartComm & Enterprise Content", icon: "FileText", description: "", order: 3, enabled: true },
    { id: "sc_ai", name: "AI & Machine Learning", icon: "Sparkles", description: "", order: 4, enabled: true },
    { id: "sc_tools", name: "Platforms & Tools", icon: "Wrench", description: "", order: 5, enabled: true },
  ],

  skills: [
    { id: "sk_py", name: "Python", category: "Programming Languages", level: 90, years: 3, icon: "", description: "", featured: true, order: 0, enabled: true },
    { id: "sk_sql", name: "SQL (MySQL)", category: "Databases & Data Engineering", level: 88, years: 3, icon: "", description: "", featured: true, order: 1, enabled: true },
    { id: "sk_smartcomm", name: "SmartComm", category: "SmartComm & Enterprise Content", level: 85, years: 1, icon: "", description: "", featured: true, order: 2, enabled: true },
    { id: "sk_java", name: "Java", category: "Programming Languages", level: 70, years: 2, icon: "", description: "", featured: false, order: 3, enabled: true },
    { id: "sk_c", name: "C", category: "Programming Languages", level: 65, years: 2, icon: "", description: "", featured: false, order: 4, enabled: true },
    { id: "sk_ds", name: "Data Structures", category: "Programming Languages", level: 75, years: 3, icon: "", description: "", featured: false, order: 5, enabled: true },
    { id: "sk_rest", name: "RESTful API Concepts", category: "Backend & Integration", level: 75, years: 2, icon: "", description: "", featured: false, order: 6, enabled: true },
    { id: "sk_micro", name: "Microservice-Oriented Design", category: "Backend & Integration", level: 68, years: 1, icon: "", description: "", featured: false, order: 7, enabled: true },
    { id: "sk_modular", name: "Modular & Reusable Code", category: "Backend & Integration", level: 85, years: 2, icon: "", description: "", featured: true, order: 8, enabled: true },
    { id: "sk_etl", name: "ETL & Data Pipelines", category: "Databases & Data Engineering", level: 78, years: 2, icon: "", description: "", featured: true, order: 9, enabled: true },
    { id: "sk_window", name: "Window Functions & Aggregations", category: "Databases & Data Engineering", level: 82, years: 2, icon: "", description: "", featured: false, order: 10, enabled: true },
    { id: "sk_warehouse", name: "Data Warehousing", category: "Databases & Data Engineering", level: 70, years: 1, icon: "", description: "", featured: false, order: 11, enabled: true },
    { id: "sk_powerbi", name: "Power BI", category: "Databases & Data Engineering", level: 72, years: 1, icon: "", description: "", featured: false, order: 12, enabled: true },
    { id: "sk_tableau", name: "Tableau", category: "Databases & Data Engineering", level: 65, years: 1, icon: "", description: "", featured: false, order: 13, enabled: true },
    { id: "sk_docuedge", name: "Docuedge", category: "SmartComm & Enterprise Content", level: 70, years: 1, icon: "", description: "", featured: false, order: 14, enabled: true },
    { id: "sk_ccm", name: "CCM / CCE-16", category: "SmartComm & Enterprise Content", level: 70, years: 1, icon: "", description: "", featured: false, order: 15, enabled: true },
    { id: "sk_xecm", name: "xECM", category: "SmartComm & Enterprise Content", level: 62, years: 1, icon: "", description: "", featured: false, order: 16, enabled: true },
    { id: "sk_ai", name: "Artificial Intelligence", category: "AI & Machine Learning", level: 78, years: 2, icon: "", description: "", featured: true, order: 17, enabled: true },
    { id: "sk_ml", name: "Machine Learning", category: "AI & Machine Learning", level: 72, years: 2, icon: "", description: "", featured: false, order: 18, enabled: true },
    { id: "sk_respai", name: "Responsible & Ethical AI", category: "AI & Machine Learning", level: 80, years: 1, icon: "", description: "", featured: false, order: 19, enabled: true },
    { id: "sk_git", name: "Git & GitHub", category: "Platforms & Tools", level: 82, years: 3, icon: "", description: "", featured: true, order: 20, enabled: true },
    { id: "sk_docker", name: "Docker (basics)", category: "Platforms & Tools", level: 50, years: 1, icon: "", description: "", featured: false, order: 21, enabled: true },
    { id: "sk_sap", name: "SAP Basics", category: "Platforms & Tools", level: 45, years: 1, icon: "", description: "", featured: false, order: 22, enabled: true },
  ],

  /* ---------------------------------------------------------------- */
  experience: [
    {
      id: "exp_deloitte",
      company: "Deloitte",
      position: "Analyst, Consulting Services",
      employmentType: "Full-time",
      location: "Hyderabad, India",
      startDate: "2025-09",
      endDate: "",
      current: true,
      description:
        "Developing backend document-processing logic and SQL-driven data workflows for high-volume enterprise systems, at the intersection of automation, integration and production support.",
      responsibilities: [
        "Developed backend document-processing logic using Python to transform, validate, and structure high-volume enterprise data for production systems.",
        "Built and optimized SQL queries (joins, aggregations, window functions) to support backend data workflows and ensure high data accuracy and performance.",
        "Worked extensively with SmartComm for document composition, template logic, and data-driven content generation, integrating backend data sources into scalable document pipelines.",
        "Designed reusable Python modules for automation, validation, and backend integration, improving processing efficiency and reducing manual intervention.",
        "Applied backend design principles such as separation of concerns, modularity, and maintainability while handling sensitive business data.",
        "Supported production delivery by troubleshooting technical issues, resolving data inconsistencies, and ensuring timely completion of assigned tasks.",
        "Collaborated with cross-functional teams to understand requirements and deliver outputs aligned with scope and timelines.",
      ],
      achievements: [],
      technologies: ["Python", "SQL", "SmartComm", "Git", "Data Pipelines", "Backend Integrations"],
      logo: "",
      url: "",
      status: "published",
      order: 0,
      enabled: true,
    },
  ],

  /* ---------------------------------------------------------------- */
  education: [
    {
      id: "edu_klu",
      institution: "Kalasalingam Academy of Research and Education",
      degree: "B.Tech — Computer Science & Engineering",
      field: "Artificial Intelligence & Machine Learning",
      startDate: "",
      endDate: "2025-05",
      grade: "CGPA 8.84",
      location: "Madurai, India",
      description:
        "Specialised in AI & ML alongside core computer science, with project work in applied machine learning and data-backed systems.",
      achievements: [
        "Smart Agriculture Management System — Python & SQL for analysing soil, weather and crop data.",
        "Crop Recommendation System — Python-based recommendation logic with SQL-backed data integration.",
      ],
      logo: "",
      order: 0,
      enabled: true,
    },
  ],

  /* ---------------------------------------------------------------- */
  certifications: [
    {
      id: "cert_ieee",
      title: "IEEE Certificate of Presentation",
      issuer: "IEEE ICIRCA 2025 · RVS College of Engineering, Coimbatore",
      issueDate: "2025-06",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "Research Publication",
      description:
        'Presented "Smart Agriculture: Satellite Image-based Crop Recommendation using CNN and EfficientNet" at the 6th International Conference on Inventive Research in Computing Applications, 25–27 June 2025.',
      featured: true,
      order: 0,
      enabled: true,
    },
    {
      id: "cert_databricks",
      title: "Databricks Certified Data Engineer Associate",
      issuer: "Databricks",
      issueDate: "2026-02",
      expiryDate: "2028-02",
      credentialId: "175114048",
      credentialUrl: "",
      image: "",
      category: "Data Engineering",
      description: "",
      featured: true,
      order: 1,
      enabled: true,
    },
    {
      id: "cert_ai_fluency",
      title: "Anthropic Certified: AI Fluency Framework & Foundations",
      issuer: "Anthropic",
      issueDate: "2026-07",
      expiryDate: "",
      credentialId: "42c9k7t9tvcv",
      credentialUrl: "",
      image: "",
      category: "AI",
      description:
        "AI literacy and foundational concepts, use-case identification for AI in business workflows, assessing AI capabilities and limitations, and responsible, ethical AI adoption.",
      featured: true,
      order: 2,
      enabled: true,
    },
    {
      id: "cert_claude_code",
      title: "Anthropic Certified: Claude Code in Action",
      issuer: "Anthropic",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "AI",
      description: "",
      featured: false,
      order: 3,
      enabled: true,
    },
    {
      id: "cert_claude_101",
      title: "Anthropic Certified: Claude 101",
      issuer: "Anthropic",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "AI",
      description: "",
      featured: false,
      order: 4,
      enabled: true,
    },
    {
      id: "cert_powerbi",
      title: "Power BI Workshop — AI-Powered Dashboards",
      issuer: "OfficeMaster",
      issueDate: "2025-09",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "Analytics",
      description: "",
      featured: false,
      order: 5,
      enabled: true,
    },
    {
      id: "cert_be10x",
      title: "be10x AI Tools Workshop",
      issuer: "be10x",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "AI",
      description: "",
      featured: false,
      order: 6,
      enabled: true,
    },
    {
      id: "cert_codechef",
      title: "CodeChef Certification",
      issuer: "CodeChef",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "Programming",
      description: "",
      featured: false,
      order: 7,
      enabled: true,
    },
  ],

  /* ---------------------------------------------------------------- */
  services: [
    {
      id: "svc_backend",
      title: "Backend & Automation Engineering",
      description:
        "Python backend logic, data validation and automation for high-volume document and data workflows.",
      icon: "Server",
      features: ["Python services", "Data validation", "Reusable modules", "Production support"],
      status: "published",
      order: 0,
      enabled: true,
    },
    {
      id: "svc_data",
      title: "Data Engineering & Analytics",
      description:
        "SQL-driven pipelines, ETL workflows and dashboards that turn raw enterprise data into something decision-ready.",
      icon: "Database",
      features: ["SQL pipelines", "ETL design", "Power BI dashboards", "Data quality"],
      status: "published",
      order: 1,
      enabled: true,
    },
    {
      id: "svc_smartcomm",
      title: "SmartComm & Document Systems",
      description:
        "Template logic, document composition and data-driven content generation integrated with backend sources.",
      icon: "FileText",
      features: ["Template logic", "Document composition", "Backend integration"],
      status: "published",
      order: 2,
      enabled: true,
    },
  ],

  /* ---------------------------------------------------------------- */
  projects: [
    {
      id: "prj_agri",
      title: "Smart Agriculture: Crop Recommendation Using Satellite Images",
      slug: "smart-agriculture-crop-recommendation",
      shortDescription:
        "An ML system using CNN and EfficientNet to recommend optimal crops from satellite imagery, remote sensing and soil/weather data. Presented at IEEE ICIRCA 2025.",
      fullDescription:
        "A machine-learning system that recommends optimal crops for farmers by combining satellite imagery with remote sensing and soil/weather data. The work was presented at the 6th International Conference on Inventive Research in Computing Applications (IEEE ICIRCA 2025).",
      category: "Machine Learning",
      tags: ["Research", "Published"],
      technologies: ["Python", "CNN", "EfficientNet", "Satellite Data", "SQL"],
      coverImage: "",
      gallery: [],
      videoUrl: "",
      githubUrl: "",
      liveUrl: "",
      caseStudyUrl: "",
      year: "2025",
      client: "Academic research",
      role: "Author & presenter",
      challenge:
        "Crop selection is often based on habit rather than current ground conditions, and ground surveys don't scale across regions.",
      solution:
        "Combined satellite imagery with soil and weather data, using CNN and EfficientNet architectures to classify land conditions and map them to suitable crops.",
      process: "",
      outcome:
        "Accepted and presented at IEEE ICIRCA 2025 (25–27 June 2025), RVS College of Engineering, Coimbatore.",
      featured: true,
      status: "published",
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      order: 0,
      enabled: true,
    },
    {
      id: "prj_docpipeline",
      title: "Enterprise Document Processing Pipeline",
      slug: "enterprise-document-processing-pipeline",
      shortDescription:
        "Backend document-processing pipeline built at Deloitte using Python and SmartComm — validating, transforming and structuring high-volume enterprise data.",
      fullDescription:
        "A production backend pipeline that validates, transforms and structures high-volume enterprise data for document generation, built from reusable, modular Python components integrated with SmartComm.",
      category: "Backend",
      tags: ["Automation", "Enterprise"],
      technologies: ["Python", "SmartComm", "SQL", "Automation"],
      coverImage: "",
      gallery: [],
      videoUrl: "",
      githubUrl: "",
      liveUrl: "",
      caseStudyUrl: "",
      year: "2025",
      client: "Deloitte (client work)",
      role: "Analyst, Consulting Services",
      challenge:
        "High-volume enterprise data arriving in inconsistent shapes had to become reliable, compliant documents without manual intervention.",
      solution:
        "Modular Python processing components with explicit validation stages, plus SmartComm template logic driven directly from backend data sources.",
      process: "",
      outcome:
        "Improved processing efficiency and reduced manual intervention in production document workflows.",
      featured: true,
      status: "published",
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      order: 1,
      enabled: true,
    },
    {
      id: "prj_dashboards",
      title: "AI-Powered Interactive Dashboards",
      slug: "ai-powered-interactive-dashboards",
      shortDescription:
        "Interactive Power BI dashboards turning raw datasets into clear, decision-ready views.",
      fullDescription:
        "Interactive dashboards built in Power BI, translating raw datasets into visual, decision-ready analytics with AI-assisted exploration.",
      category: "Data Analytics",
      tags: ["Analytics"],
      technologies: ["Power BI", "SQL", "Data Modelling"],
      coverImage: "",
      gallery: [],
      videoUrl: "",
      githubUrl: "",
      liveUrl: "",
      caseStudyUrl: "",
      year: "2025",
      client: "",
      role: "Developer",
      challenge: "",
      solution: "",
      process: "",
      outcome: "",
      featured: false,
      status: "published",
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      order: 2,
      enabled: true,
    },
  ],

  /* ---------------------------------------------------------------- */
  testimonials: [],

  /* ---------------------------------------------------------------- */
  socialLinks: [
    { id: "soc_li", platform: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/in/peyyalamanideep/", icon: "Linkedin", handle: "peyyalamanideep", featured: true, order: 0, enabled: true },
    { id: "soc_gh", platform: "GitHub", label: "GitHub", url: "https://github.com/manideeppeyyala", icon: "Github", handle: "manideeppeyyala", featured: true, order: 1, enabled: true },
    { id: "soc_mail", platform: "Email", label: "Email", url: "mailto:manideepyadav380@gmail.com", icon: "Mail", handle: "manideepyadav380@gmail.com", featured: true, order: 2, enabled: true },
    { id: "soc_yt", platform: "YouTube", label: "YouTube", url: "https://www.youtube.com/@vlogingwithmani2003", icon: "Youtube", handle: "@vlogingwithmani2003", featured: false, order: 3, enabled: true },
    { id: "soc_ig", platform: "Instagram", label: "Instagram", url: "https://www.instagram.com/vloggingwithmani/", icon: "Instagram", handle: "@vloggingwithmani", featured: false, order: 4, enabled: true },
    { id: "soc_fb", platform: "Facebook", label: "Facebook", url: "https://www.facebook.com/mani.royals.33/", icon: "Facebook", handle: "", featured: false, order: 5, enabled: true },
  ],

  /* ---------------------------------------------------------------- */
  resume: {
    enabled: true,
    buttonLabel: "Download Résumé",
    fileUrl: "/Peyyala_Manideep_Resume.pdf",
    fileName: "Peyyala_Manideep_Resume.pdf",
    updatedAt: "",
    note: "",
  },

  /* ---------------------------------------------------------------- */
  contact: {
    eyebrow: "Contact",
    heading: "Let's build something reliable.",
    description:
      "Open to backend, data engineering and AI-adjacent opportunities. Drop a message and I'll get back to you.",
    formEnabled: true,
    successMessage: "Thanks — your message landed. I'll get back to you shortly.",
  },

  /* ---------------------------------------------------------------- */
  seo: {
    defaultTitle: "Peyyala Manideep — SmartComm Developer & AI/Data Engineer",
    titleTemplate: "%s · Peyyala Manideep",
    defaultDescription:
      "SmartComm Developer & AI/Data Engineer at Deloitte. Python, SQL-driven backend logic, document-processing pipelines and automation for enterprise systems.",
    keywords: [
      "Peyyala Manideep",
      "SmartComm Developer",
      "AI Engineer",
      "Data Engineer",
      "Python Developer",
      "Deloitte",
      "Backend Developer",
    ],
    ogImage: "",
    twitterHandle: "",
    canonicalUrl: "",
    robotsIndex: true,
    structuredDataEnabled: true,
    analyticsId: "",
    analyticsProvider: "none",
    analyticsDomain: "",
  },

  /* ---------------------------------------------------------------- */
  theme: {
    accent: "gold",
    surface: "navy",
    radius: "soft",
    density: "comfortable",
    motion: "full",
    heroStyle: "particles",
    fontScale: "md",
  },
};
