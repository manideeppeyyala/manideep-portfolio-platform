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
    { id: "nav_expertise", label: "Expertise", href: "#expertise", external: false, order: 1, enabled: true },
    { id: "nav_work", label: "Work", href: "#projects", external: false, order: 2, enabled: true },
    { id: "nav_cert", label: "Certifications", href: "#certifications", external: false, order: 3, enabled: true },
    { id: "nav_skills", label: "Skills", href: "#skills", external: false, order: 4, enabled: true },
    { id: "nav_exp", label: "Experience", href: "#experience", external: false, order: 5, enabled: true },
    { id: "nav_gallery", label: "Gallery", href: "#gallery", external: false, order: 6, enabled: true },
    { id: "nav_contact", label: "Contact", href: "#contact", external: false, order: 7, enabled: true },
  ],

  sections: [
    { key: "hero", label: "Hero", enabled: true, order: 0 },
    { key: "about", label: "About", enabled: true, order: 1 },
    { key: "services", label: "Expertise", enabled: true, order: 2 },
    { key: "projects", label: "Work & Research", enabled: true, order: 3 },
    { key: "certifications", label: "Certifications", enabled: true, order: 4 },
    { key: "skills", label: "Skills", enabled: true, order: 5 },
    { key: "experience", label: "Experience & Education", enabled: true, order: 6 },
    { key: "gallery", label: "Gallery", enabled: true, order: 7 },
    { key: "testimonials", label: "Testimonials", enabled: false, order: 8 },
    { key: "contact", label: "Contact", enabled: true, order: 9 },
    // Rendered inside the Experience timeline, not as its own band.
    { key: "education", label: "Education (in timeline)", enabled: false, order: 10 },
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
    lead: "A SmartComm Developer & AI/Data Engineer at Deloitte, building document-processing systems and backend data workflows that enterprise clients depend on every day.",
    paragraphs: [
      "I'm Peyyala Manideep — a SmartComm Developer and AI/Data Engineer working as an Analyst in Consulting Services at Deloitte, Hyderabad. My day-to-day is backend document-processing logic and SQL-driven data workflows for high-volume enterprise systems, sitting right where automation, integration and production support meet.",
      "Most of what I build is invisible when it works. A document pipeline that validates and structures thousands of records without a human touching them. A SQL query rewritten with the right window function so a report that took minutes returns in seconds. Reusable Python modules that quietly remove the manual step someone used to do every morning. I care about that kind of engineering — modular, maintainable, and boring in production.",
      "I came to this through a B.Tech in Computer Science & Engineering specialising in AI and Machine Learning at Kalasalingam Academy of Research and Education, graduating in 2025 with a CGPA of 8.84. Along the way I published research on satellite-image-based crop recommendation using CNN and EfficientNet, presented at IEEE ICIRCA 2025 — my first real taste of taking an idea all the way from a dataset to a peer-reviewed room.",
      "Since then I've kept deliberately widening the stack rather than deepening one narrow corner: Databricks certification for data engineering, Anthropic's AI Fluency and Claude Code training for working effectively alongside AI tools, and Power BI for the analytics end. The thread connecting them is the same — understanding data well enough to move it, shape it and explain it.",
      "Outside engineering I create tech and career content as Vlogging With Mani, which keeps me honest: if I can't explain a concept clearly to someone starting out, I probably don't understand it as well as I think I do.",
    ],
    image: "/profile.jpg",
    highlights: [
      "Analyst @ Deloitte",
      "IEEE Published",
      "Databricks Certified",
      "Anthropic AI Fluency",
      "B.Tech CGPA 8.84",
      "Content Creator",
    ],
    ctaLabel: "Get in touch",
    ctaHref: "#contact",
    stats: [
      { id: "stat_cgpa", value: "8.84", label: "B.Tech CGPA", order: 0, enabled: true },
      { id: "stat_certs", value: "8+", label: "Certifications", order: 1, enabled: true },
      { id: "stat_pub", value: "1", label: "IEEE Publication", order: 2, enabled: true },
      { id: "stat_stack", value: "20+", label: "Technologies", order: 3, enabled: true },
      { id: "stat_years", value: "1+", label: "Years at Deloitte", order: 4, enabled: true },
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
        "Building backend document-processing logic and SQL-driven data workflows for high-volume enterprise systems — where automation, integration and production support meet.",
      responsibilities: [
        "Developed backend document-processing logic in Python to transform, validate and structure high-volume enterprise data for production systems.",
        "Built and optimised SQL queries — joins, aggregations and window functions — supporting backend data workflows with a hard requirement on accuracy and performance.",
        "Worked extensively with SmartComm for document composition, template logic and data-driven content generation, integrating backend data sources into scalable document pipelines.",
        "Designed reusable Python modules for automation, validation and backend integration, improving processing efficiency and cutting manual intervention.",
        "Applied backend design principles — separation of concerns, modularity, maintainability — while handling sensitive business data under confidentiality and compliance standards.",
        "Supported production delivery by troubleshooting technical issues, resolving data inconsistencies and meeting delivery timelines.",
        "Collaborated with developers, analysts and stakeholders to turn requirements into scoped, step-by-step deliverables.",
      ],
      achievements: [
        "Completed Deloitte's BRIDGE Campus Learning Series.",
        "Took ownership of independent deliverables within the first year of joining.",
      ],
      technologies: [
        "Python",
        "SQL",
        "SmartComm",
        "Git",
        "Data Pipelines",
        "Backend Integrations",
        "Docuedge",
        "CCM",
      ],
      logo: "",
      url: "https://www.deloitte.com",
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
      startDate: "2021-08",
      endDate: "2025-05",
      grade: "CGPA 8.84",
      location: "Madurai, India",
      description:
        "Specialised in AI and Machine Learning alongside core computer science — data structures, databases and systems — with project work grounded in applied ML and data-backed decision systems.",
      achievements: [
        "Published and presented research at IEEE ICIRCA 2025 on satellite-image-based crop recommendation.",
        "Smart Agriculture Management System — Python and SQL for analysing soil, weather and crop data.",
        "Crop Recommendation System — Python recommendation logic with SQL-backed data integration.",
        "Graduated with a CGPA of 8.84.",
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
      title: "Backend Engineering",
      description:
        "Python services that transform, validate and structure high-volume enterprise data, built to survive production.",
      icon: "Server",
      features: ["Python", "Modular Design", "Validation", "Production Support"],
      status: "published",
      order: 0,
      enabled: true,
    },
    {
      id: "svc_data",
      title: "Data Engineering",
      description:
        "SQL-driven pipelines and ETL workflows — joins, aggregations and window functions tuned for accuracy at volume.",
      icon: "Database",
      features: ["SQL", "ETL", "Window Functions", "Data Warehousing"],
      status: "published",
      order: 1,
      enabled: true,
    },
    {
      id: "svc_smartcomm",
      title: "SmartComm & Document Systems",
      description:
        "Template logic and document composition wired directly to backend data sources for enterprise communications.",
      icon: "FileText",
      features: ["SmartComm", "CCM", "Docuedge", "Template Logic"],
      status: "published",
      order: 2,
      enabled: true,
    },
    {
      id: "svc_ai",
      title: "Applied AI & Machine Learning",
      description:
        "Identifying where AI genuinely fits a workflow, and assessing model capabilities honestly against their limits.",
      icon: "BrainCircuit",
      features: ["Machine Learning", "Use-Case Design", "Responsible AI", "Model Evaluation"],
      status: "published",
      order: 3,
      enabled: true,
    },
    {
      id: "svc_automation",
      title: "Automation & Integration",
      description:
        "Reusable modules that remove manual steps, and backend integrations that keep systems talking to each other.",
      icon: "Workflow",
      features: ["Reusable Modules", "Backend Integration", "REST Concepts", "Process Automation"],
      status: "published",
      order: 4,
      enabled: true,
    },
    {
      id: "svc_analytics",
      title: "Analytics & Visualisation",
      description:
        "Turning raw datasets into dashboards people actually make decisions from.",
      icon: "LineChart",
      features: ["Power BI", "Tableau", "Data Analysis", "Dashboards"],
      status: "published",
      order: 5,
      enabled: true,
    },
    {
      id: "svc_platforms",
      title: "Enterprise Platforms & Tooling",
      description:
        "Working inside the toolchain enterprise delivery actually runs on, from version control to content platforms.",
      icon: "Boxes",
      features: ["Git & GitHub", "Docker", "SAP Basics", "xECM"],
      status: "published",
      order: 6,
      enabled: true,
    },
    {
      id: "svc_practice",
      title: "Engineering Practice",
      description:
        "Clean, maintainable code, careful debugging, and handling sensitive business data the way it should be handled.",
      icon: "Shield",
      features: ["Clean Code", "Debugging", "Secure Data Handling", "Scalable Design"],
      status: "published",
      order: 7,
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
  /*
   * Seeded with the professional images available today. Graduation and
   * conference photos get added from Admin → Gallery — uploads land in
   * public/uploads and are committed to the repo like any other content.
   */
  gallery: [
    {
      id: "gal_portrait",
      title: "Peyyala Manideep",
      caption: "SmartComm Developer & AI/Data Engineer at Deloitte.",
      image: "/gallery/portrait.jpg",
      video: "",
      category: "Profile",
      date: "",
      featured: true,
      order: 0,
      enabled: true,
    },
    {
      id: "gal_bridge",
      title: "Deloitte BRIDGE Campus Learning Series",
      caption:
        "Completing Deloitte's BRIDGE Campus Learning Series \u2014 the onboarding programme for new campus hires into Consulting.",
      image: "/gallery/deloitte-bridge.jpg",
      video: "",
      category: "Milestone",
      date: "2025-08",
      featured: false,
      order: 1,
      enabled: true,
    },
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
