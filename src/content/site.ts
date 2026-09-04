/**
 * Single source of truth for every piece of editable text and business data on
 * the site. Edit this file to change copy — you should not need to touch any
 * component.
 *
 * Anything marked `TODO(windii)` is a placeholder that needs to be confirmed
 * before launch. Every one of them is also listed in TODO.md.
 *
 * IMPORTANT — D&B / D-U-N-S consistency:
 * The company name, address, phone and email below are rendered verbatim in the
 * header, footer, contact page and JSON-LD structured data. They must stay
 * character-for-character identical to the Partnership Registration Certificate
 * (Form-C), the NTN record and the D&B Company Information Template. Change them
 * here and nowhere else.
 */

/* -------------------------------------------------------------------------- */
/* Business identity                                                           */
/* -------------------------------------------------------------------------- */

export const business = {
  /** Legal / trading name. Must match Form-C and NTN records exactly. */
  name: "Windii Technologies",
  /** Short name for tight spaces (mobile header, page titles). */
  shortName: "Windii Technologies",
  sector: "Information Technology & Software Services",
  legalStructure: "Registered partnership firm",

  domain: "windiitechnologies.com",
  /**
   * Canonical origin, no trailing slash. Single source for canonical URLs,
   * JSON-LD, the sitemap and robots.txt, so those can never disagree.
   * NEXT_PUBLIC_SITE_URL overrides it for preview deployments only — leave it
   * unset in production.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://windiitechnologies.com",

  email: "info@windiitechnologies.com",
  /** Display form of the business phone number. */
  phone: "+92 334 9703013",
  /** E.164 form used in `tel:` links and structured data. */
  phoneHref: "+923349703013",

  address: {
    street: "7 Bridge Colony",
    locality: "Lahore",
    region: "Punjab",
    country: "Pakistan",
    /** ISO 3166-1 alpha-2, used in structured data. */
    countryCode: "PK",
    /** The one-line form used everywhere on the site. */
    full: "7 Bridge Colony, Lahore, Punjab, Pakistan",
  },

  geographicScope: "Pakistan, serving clients internationally",

  /**
   * TODO(windii): confirm published business hours, then replace this string.
   * Shown on the Contact page.
   */
  businessHours: "Monday to Friday, 9:00 AM – 6:00 PM (PKT, UTC+5)",

  /**
   * TODO(windii): add the official LinkedIn company page URL once it is live,
   * then add it to `sameAs` below. It must use the same company name and
   * business details as this site.
   */
  linkedin: "" as string,
} as const;

/**
 * Profiles emitted in the JSON-LD `sameAs` array. Empty entries are filtered
 * out, so the schema stays valid until the LinkedIn page exists.
 */
export const socialProfiles: string[] = [business.linkedin].filter(Boolean);

/** Map coordinates for the Lahore office. Used by the lazy-loaded map embed. */
export const mapLocation = {
  /**
   * TODO(windii): confirm the exact pin for 7 Bridge Colony. These coordinates
   * centre the map on the Bridge Colony area of Lahore and are close enough to
   * be useful, but should be verified before launch.
   */
  latitude: 31.5497,
  longitude: 74.3436,
  zoom: 15,
  label: "7 Bridge Colony, Lahore, Punjab, Pakistan",
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNavigation = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
] as const;

/* -------------------------------------------------------------------------- */
/* Global SEO                                                                  */
/* -------------------------------------------------------------------------- */

export const seo = {
  titleTemplate: `%s | ${business.name}`,
  defaultTitle: `${business.name} — Software Development & IT Services, Lahore`,
  /**
   * Also used verbatim as the `description` property of the Organization
   * structured data on every page.
   */
  description:
    "Windii Technologies is an information technology and software services firm based in Lahore, Pakistan, delivering software development, product engineering, database administration and cloud support to clients locally and internationally.",
  keywords: [
    "Windii Technologies",
    "software development Lahore",
    "IT services Pakistan",
    "outsourced development",
    "SaaS development",
    "database administration",
    "product engineering",
  ],
  locale: "en_US",
} as const;

/* -------------------------------------------------------------------------- */
/* Home page                                                                   */
/* -------------------------------------------------------------------------- */

export const home = {
  meta: {
    title: `${business.name} — Software Development & IT Services, Lahore`,
    description: seo.description,
  },
  hero: {
    eyebrow: business.sector,
    headline: business.name,
    positioning: "Software and IT services built to run in production.",
    supporting:
      "We are an IT and software services firm in Lahore, Pakistan. We design, build, integrate and support software systems for organisations that need dependable engineering and clear communication — from a single application to a long-running dedicated team.",
    primaryCta: { label: "Talk to us", href: "/contact" },
    secondaryCta: { label: "Our services", href: "/services" },
  },
  whoWeAre: {
    heading: "Who we are",
    body: [
      `${business.name} is an information technology and software services firm operating from ${business.address.full}. We work with clients in Pakistan and internationally, delivering custom software, product engineering, data and database administration, and ongoing cloud and technical support.`,
      "We are a registered partnership firm. Our work is engineering-led: small teams, direct access to the people writing the code, and delivery practices that hold up once a system is live and carrying real users.",
    ],
    facts: [
      { label: "Sector", value: business.sector },
      { label: "Head office", value: business.address.full },
      { label: "Delivery", value: business.geographicScope },
    ],
  },
  services: {
    eyebrow: "What we do",
    heading: "Services",
    intro:
      "Nine service lines covering the full life of a software system — from first discovery call through to the support rota that keeps it running.",
    cta: { label: "Explore all services", href: "/services" },
  },
  products: {
    eyebrow: "Products & solutions",
    heading: "Building our own software, not just yours",
    intro:
      "Alongside client engagements we develop our own products. Our current focus is a SaaS platform for transportation and fleet operations, covering booking and dispatch, fleet and driver management, trip tracking and reporting.",
    cta: { label: "See what we are building", href: "/products" },
  },
  process: {
    eyebrow: "How we work",
    heading: "A straightforward engagement process",
    intro:
      "Four stages, each with a defined output you can review before the next one starts. No stage is a black box.",
  },
  contactStrip: {
    heading: "Tell us what you are building",
    body: "Send us the outline of your project — scope, constraints, timeline — and we will come back with an honest view of whether we are the right firm for it and how we would approach the work.",
    cta: { label: "Start a conversation", href: "/contact" },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Process steps                                                               */
/* -------------------------------------------------------------------------- */

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We work through the problem, the users, the systems already in place and the constraints that matter — budget, compliance, deadlines, existing technology. The output is a written summary of scope and risk, so nothing important is discovered late.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "We turn scope into an architecture, a delivery plan and a milestone schedule, with the team shape and estimate written down. You approve the plan before engineering starts.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Delivery runs in short, reviewable increments with code review, testing and a working environment you can use throughout. You see progress continuously rather than at the end.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "After launch we handle deployment, monitoring, maintenance and technical support, and keep developing the product as your requirements change. Handover to your own team is equally fine if that is the plan.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export type Service = {
  slug: string;
  title: string;
  /** lucide-react icon key — mapped to a component in components/ServiceIcon.tsx */
  icon: string;
  /** One or two lines, used on the home page card grid. */
  summary: string;
  /** Two to four sentences, used on the Services page. */
  description: string;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "software-development",
    title: "Software Development",
    icon: "code",
    summary:
      "Custom applications and backend systems built to your requirements, from first line to production.",
    description:
      "We build custom software for organisations whose requirements are not met by off-the-shelf products. That covers business applications, internal tools, APIs and the backend systems behind them. We work in modern, well-supported technology stacks and write code intended to be maintained for years, not demonstrated once.",
    includes: [
      "Requirements analysis and technical specification",
      "Backend, API and business-logic development",
      "Frontend and user-interface implementation",
      "Automated testing and code review as part of delivery",
      "Documentation and handover to your team",
    ],
  },
  {
    slug: "it-project-management",
    title: "IT Project Management",
    icon: "clipboard",
    summary:
      "Planning, coordination and reporting that keeps a technical project on scope and on schedule.",
    description:
      "We manage software and IT projects end to end — scope, plan, schedule, risk and delivery. This service suits organisations that have engineering capacity but need someone accountable for coordination and reporting, and clients who want a single point of contact for a multi-party project.",
    includes: [
      "Scope definition, work breakdown and estimation",
      "Delivery scheduling and milestone tracking",
      "Risk and dependency management",
      "Vendor and stakeholder coordination",
      "Regular written progress reporting",
    ],
  },
  {
    slug: "outsourced-development",
    title: "Outsourced Development",
    icon: "users",
    summary:
      "Dedicated engineers who work as part of your team, on your process and your schedule.",
    description:
      "We provide dedicated development teams and individual engineers who extend your existing capacity. Our people work to your process, in your tools and to your standards, reporting into your leads. Engagements are structured so you keep control of priorities while we handle recruitment, management and continuity.",
    includes: [
      "Dedicated development teams",
      "Individual staff augmentation by skill set",
      "Engineers working in your tools, process and time zone overlap",
      "Defined reporting lines and escalation paths",
      "Knowledge retention and cover for planned absence",
    ],
  },
  {
    slug: "data-and-database-administration",
    title: "Data & Database Administration",
    icon: "database",
    summary:
      "Database design, tuning, migration and day-to-day administration for systems you depend on.",
    description:
      "We design, administer and tune the databases that sit under business-critical applications. This includes schema and data-model design for new systems, and performance, backup and recovery work on databases already in production. We also handle migrations between platforms and environments, planned so that downtime and data risk are controlled.",
    includes: [
      "Data modelling and schema design",
      "Query and index performance tuning",
      "Backup, restore and disaster-recovery procedures",
      "Database migration and version upgrades",
      "Routine administration, monitoring and capacity planning",
    ],
  },
  {
    slug: "product-development",
    title: "Product Development",
    icon: "rocket",
    summary:
      "Taking a product from concept and prototype through to a released, supportable version.",
    description:
      "We help organisations build products rather than one-off projects. That means treating the roadmap, the architecture and the release process as things that have to survive several years of change. We can take a product from initial concept through prototype and first release, or join an existing product that needs engineering depth.",
    includes: [
      "Concept validation and technical feasibility review",
      "Prototypes and minimum viable product builds",
      "Product architecture and roadmap planning",
      "Iterative release cycles with user feedback",
      "Post-release measurement and continued development",
    ],
  },
  {
    slug: "product-integration",
    title: "Product Integration",
    icon: "workflow",
    summary:
      "Connecting applications, third-party services and legacy systems so data moves reliably.",
    description:
      "Most systems have to work with systems someone else built. We integrate applications with third-party platforms, payment and messaging providers, ERP and accounting systems, and legacy software that has no modern API. The emphasis is on reliability: error handling, retries and monitoring, so a failed integration is visible rather than silent.",
    includes: [
      "REST, GraphQL and webhook integrations",
      "Third-party platform, payment and messaging providers",
      "ERP, CRM and accounting system connections",
      "Legacy system interfaces and data bridges",
      "Error handling, retry logic and integration monitoring",
    ],
  },
  {
    slug: "saas-and-technology-solutions",
    title: "SaaS & Technology Solutions",
    icon: "layers",
    summary:
      "Multi-tenant SaaS platforms built for subscription delivery, from architecture to billing.",
    description:
      "We build software-as-a-service platforms and the operational tooling around them. SaaS raises problems a single-customer application never has to solve — tenant isolation, subscription billing, per-customer configuration, safe rollout of changes to everyone at once. We design for those from the start rather than retrofitting them later.",
    includes: [
      "Multi-tenant architecture and tenant data isolation",
      "Subscription, plan and billing integration",
      "Role-based access control and administration tooling",
      "Usage analytics and customer-facing dashboards",
      "Scalable deployment and release management",
    ],
  },
  {
    slug: "web-and-mobile-application-development",
    title: "Web & Mobile Application Development",
    icon: "smartphone",
    summary:
      "Responsive web applications and mobile apps built for real devices and real networks.",
    description:
      "We build web applications and mobile apps for Android and iOS. Interfaces are designed to be accessible and to work on the devices and connection speeds your users actually have. Where a project needs both web and mobile, we plan a shared backend so the two stay consistent instead of drifting apart.",
    includes: [
      "Responsive web applications and progressive web apps",
      "Android and iOS mobile applications",
      "Shared API and backend design across platforms",
      "Accessibility and cross-browser or cross-device testing",
      "App store submission and release support",
    ],
  },
  {
    slug: "cloud-deployment-maintenance-and-technical-support",
    title: "Cloud Deployment, Maintenance & Technical Support",
    icon: "server",
    summary:
      "Deployment pipelines, monitoring and ongoing support that keep live systems running.",
    description:
      "We deploy applications to cloud infrastructure and keep them running afterwards. That covers environment setup, deployment automation, monitoring and alerting, security patching and routine maintenance. We also provide ongoing technical support with agreed response expectations, so there is a defined route when something breaks.",
    includes: [
      "Cloud environment setup and infrastructure configuration",
      "CI/CD pipelines and automated deployment",
      "Monitoring, logging and alerting",
      "Security patching, updates and routine maintenance",
      "Ongoing technical support with agreed response times",
    ],
  },
];

export const servicesPage = {
  meta: {
    title: "Services",
    description:
      "Software development, IT project management, outsourced development, database administration, product development and integration, SaaS solutions, web and mobile applications, and cloud deployment and support from Windii Technologies, Lahore.",
  },
  eyebrow: "Services",
  heading: "What we do",
  intro:
    "Windii Technologies offers nine service lines across the software life cycle. Engagements are commonly a combination — a build followed by ongoing support, or a dedicated team alongside project management. Tell us the outcome you need and we will propose the shape that fits.",
} as const;

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const about = {
  meta: {
    title: "About",
    description: `${business.name} is a registered partnership firm operating in the information technology and software services sector from ${business.address.full}, delivering to clients in Pakistan and internationally.`,
  },
  eyebrow: "About us",
  heading: `About ${business.name}`,
  lead: `${business.name} is an information technology and software services firm based in ${business.address.locality}, ${business.address.region}, ${business.address.country}.`,
  whoWeAre: {
    heading: "Who we are",
    body: [
      `${business.name} is a registered partnership firm operating in the ${business.sector.toLowerCase()} sector. Our registered office is at ${business.address.full}.`,
      "We build and support software systems for organisations that need engineering they can rely on. Our work ranges from single applications and product builds to dedicated teams that operate as an extension of a client's own engineering function, along with the database administration and cloud support that keep those systems running once they are live.",
    ],
  },
  whatWeDo: {
    heading: "What we do",
    body: [
      "Our service lines cover software development, IT project management, outsourced development, data and database administration, product development, product integration, SaaS and technology solutions, web and mobile application development, and cloud deployment, maintenance and technical support.",
      "Alongside client work we develop our own software products. Our current internal focus is a SaaS platform for transportation and fleet operations.",
    ],
    cta: { label: "See all services", href: "/services" },
  },
  scope: {
    heading: "Where we work",
    body: [
      `We operate from ${business.address.locality}, ${business.address.country}, and deliver to clients both locally and internationally. Remote engagements are normal for us: we plan working hours to overlap with the client's time zone, keep written records of decisions, and communicate in English throughout.`,
    ],
  },
  values: {
    heading: "How we work",
    intro:
      "We would rather describe how we operate than make claims about ourselves. These are the commitments we hold to on every engagement.",
    items: [
      {
        title: "Quality",
        description:
          "Code review, testing and documentation are part of delivery, not an optional extra at the end. We would rather flag a problem during a build than hand over something that fails later in production.",
      },
      {
        title: "Communication",
        description:
          "You get direct access to the people doing the work, written progress updates on an agreed cadence, and an honest answer when something is behind schedule. No surprises at the milestone review.",
      },
      {
        title: "Ownership",
        description:
          "We take responsibility for the outcome, not just the tickets. If an approach is not working we say so and propose an alternative rather than continuing to bill against a plan we no longer believe in.",
      },
      {
        title: "Continuity",
        description:
          "Systems outlive the projects that create them. We write things down, avoid single points of knowledge, and make sure a handover to your team is possible whenever you want one.",
      },
    ],
  },
  registeredAddress: {
    heading: "Registered business address",
    note: "Our registered and principal office address, as recorded in our partnership registration documents.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export const products = {
  meta: {
    title: "Products & Solutions",
    description: `${business.name} develops its own software products, including a SaaS platform for transportation and fleet operations covering booking and dispatch, fleet and driver management, trip tracking, reporting and integrations.`,
  },
  eyebrow: "Products & solutions",
  heading: "Products and solutions",
  lead: "We build our own software alongside client engagements. Product work forces you to think past the first release — about upgrades, support and the cost of a bad architectural decision three years later — and that discipline carries directly into the work we do for clients.",
  capability: {
    heading: "Our product capability",
    body: [
      "Building a product is a different exercise from delivering a project. It needs a roadmap that survives changing requirements, an architecture that can absorb features nobody has specified yet, and a release process safe enough to use every week. We run our own products on the same practices we bring to client work: reviewed code, automated testing, monitored deployments and documented decisions.",
    ],
    points: [
      {
        title: "Architecture that expects change",
        description:
          "Clear service boundaries and data models that can take new requirements without a rewrite.",
      },
      {
        title: "Release discipline",
        description:
          "Automated pipelines, staged rollouts and monitoring, so shipping a change is routine rather than an event.",
      },
      {
        title: "Operable from day one",
        description:
          "Logging, alerting and administration tooling built alongside the features, not bolted on after the first incident.",
      },
    ],
  },
  flagship: {
    /**
     * TODO(windii): confirm the final product name and public positioning.
     * Until then the platform is described generically and marked as in
     * development. Do not describe it as a shipping commercial product on the
     * public site until that is accurate.
     */
    status: "In development — available on request",
    eyebrow: "Transportation technology",
    name: "SaaS platform for transportation and fleet operations",
    lead: "A software-as-a-service platform for organisations that move vehicles, drivers and passengers, bringing booking, dispatch, fleet management and reporting into one system.",
    body: [
      "Transport operators typically run on a mix of spreadsheets, phone calls and disconnected tools, which makes it hard to answer basic questions: where is that vehicle, which driver is free, what did last month actually cost. The platform is designed to hold those operations in one place, with the day-to-day workflow of dispatch and the reporting layer above it sharing the same data.",
      "The platform is currently in development. We are happy to walk through the current capability set, discuss fit for a specific operation, and talk about pilot arrangements.",
    ],
    capabilities: [
      {
        title: "Booking & dispatch",
        description:
          "Capture and manage bookings, assign vehicles and drivers, and handle changes and cancellations from a single dispatch view.",
      },
      {
        title: "Fleet management",
        description:
          "Vehicle records, availability, documentation and service history, with maintenance schedules and expiry reminders.",
      },
      {
        title: "Driver management",
        description:
          "Driver profiles, licence and document tracking, assignment history and availability.",
      },
      {
        title: "Route & trip tracking",
        description:
          "Trip status through the journey, route and stop records, and timing data captured for later analysis.",
      },
      {
        title: "Reporting dashboards",
        description:
          "Operational and commercial reporting across trips, vehicles, drivers and costs, with exportable data.",
      },
      {
        title: "Integrations",
        description:
          "Interfaces to accounting, payment, mapping and telematics providers so the platform fits the tools an operator already uses.",
      },
    ],
    cta: { label: "Request a walkthrough", href: "/contact" },
  },
  custom: {
    heading: "Custom solutions",
    body: "If you need a platform of your own rather than a licence to ours, that is a large part of what we do. We build bespoke SaaS products, internal platforms and industry-specific systems for clients, and we can start from a written specification or from an initial discovery engagement.",
    cta: { label: "Discuss a custom build", href: "/contact" },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

export const contact = {
  meta: {
    title: "Contact",
    description: `Contact ${business.name} — ${business.address.full}. Email ${business.email} or call ${business.phone}, or send an enquiry through the contact form.`,
  },
  eyebrow: "Contact",
  heading: "Get in touch",
  lead: "Send us an outline of what you need and we will reply with a considered answer, normally within one business day.",
  detailsHeading: "Business details",
  formHeading: "Send an enquiry",
  formIntro:
    "Fields marked with an asterisk are required. We use what you send here only to reply to your enquiry.",
  mapHeading: "Find us",
  mapNote:
    "The map is loaded from OpenStreetMap only after you choose to load it, so no third-party map scripts run on this page unless you ask for them.",
  mapButton: "Load map",
  form: {
    fields: {
      name: { label: "Full name", placeholder: "Your name" },
      email: { label: "Email address", placeholder: "you@company.com" },
      company: { label: "Company", placeholder: "Company name" },
      phone: { label: "Phone", placeholder: "+92 300 0000000" },
      subject: { label: "Subject", placeholder: "What is this about?" },
      message: {
        label: "Message",
        placeholder:
          "Tell us about the project — what you need, any constraints, and your timeline.",
      },
    },
    optionalSuffix: "(optional)",
    submit: "Send enquiry",
    submitting: "Sending…",
    successHeading: "Thank you — your enquiry has been sent.",
    successBody: `We have received your message and will reply to you by email. If it is urgent, call ${business.phone}.`,
    errorHeading: "Your message could not be sent.",
    errorBody: `Something went wrong on our side. Please try again, or email us directly at ${business.email}.`,
    validationSummary: "Please correct the highlighted fields and try again.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export const footer = {
  tagline:
    "An information technology and software services firm in Lahore, Pakistan, delivering software development, product engineering and technical support to clients locally and internationally.",
  columns: {
    company: "Company",
    services: "Services",
    contact: "Contact",
  },
  addressLabel: "Registered office",
  copyright: (year: number) =>
    `© ${year} ${business.name}. All rights reserved.`,
} as const;

/* -------------------------------------------------------------------------- */
/* Legal pages                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * TODO(windii): have a qualified lawyer review both legal pages before you rely
 * on them. They are written to be honest and standard, not to be legal advice.
 */
export const legalLastUpdated = "4 September 2026";

export const privacy = {
  meta: {
    title: "Privacy Policy",
    description: `How ${business.name} collects, uses and protects personal information submitted through ${business.domain}.`,
  },
  heading: "Privacy Policy",
  intro: `This policy explains what personal information ${business.name} collects through ${business.domain}, why we collect it, and what we do with it.`,
  sections: [
    {
      heading: "Who we are",
      body: [
        `${business.name} is a registered partnership firm with its registered office at ${business.address.full}. For any question about this policy or about your personal information, contact us at ${business.email} or ${business.phone}.`,
      ],
    },
    {
      heading: "Information we collect",
      body: [
        "We collect the information you choose to give us through the contact form on this site: your name, email address, and optionally your company name and phone number, together with the subject and content of your message.",
        "We do not use advertising trackers or third-party analytics cookies on this site. Our web host may keep standard server logs, which can include IP addresses and request details, for security and operational purposes.",
      ],
    },
    {
      heading: "How we use your information",
      body: [
        "We use the information you submit solely to read and respond to your enquiry, and to maintain a record of our correspondence with you. We do not sell your information, and we do not add you to marketing lists without your explicit agreement.",
      ],
    },
    {
      heading: "Sharing and service providers",
      body: [
        "Messages sent through the contact form are delivered to our business email address using an email delivery provider acting on our instructions. Our website hosting provider processes requests to this site. These providers handle data only as needed to provide their service to us.",
        "We may disclose information where we are required to do so by applicable law.",
      ],
    },
    {
      heading: "Retention",
      body: [
        "We keep enquiry correspondence for as long as is needed to deal with your enquiry and to maintain ordinary business records, and then delete it.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        `You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Email ${business.email} and we will respond within a reasonable period.`,
      ],
    },
    {
      heading: "Security",
      body: [
        "This site is served over HTTPS, and enquiry data is transmitted to us over encrypted connections. No system is completely secure, so please do not send passwords, payment card details or other sensitive credentials through the contact form.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change this policy we will update the page and revise the date shown above.",
      ],
    },
  ],
} as const;

export const terms = {
  meta: {
    title: "Terms of Use",
    description: `The terms that apply to your use of ${business.domain}, the website of ${business.name}.`,
  },
  heading: "Terms of Use",
  intro: `These terms apply to your use of ${business.domain}, operated by ${business.name}. By using this site you accept them.`,
  sections: [
    {
      heading: "About this site",
      body: [
        `${business.domain} is the official website of ${business.name}, a registered partnership firm with its registered office at ${business.address.full}.`,
      ],
    },
    {
      heading: "Use of the site",
      body: [
        "You may use this site for lawful purposes only. You must not attempt to gain unauthorised access to the site or its infrastructure, interfere with its normal operation, or use automated means to submit the contact form or otherwise abuse it.",
      ],
    },
    {
      heading: "Information on this site",
      body: [
        "The content of this site describes our services and capabilities in general terms. It is provided for information and does not constitute a contractual offer, professional advice, or a warranty that a particular service or product feature will be available. Scope, pricing and commitments for any engagement are set out in a separate written agreement.",
        "Where a product is described as in development, its features and availability are subject to change.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        `The content, design, logo and trade marks on this site are owned by ${business.name} or used with permission. You may not reproduce them for commercial purposes without our written consent.`,
      ],
    },
    {
      heading: "External links",
      body: [
        "This site may link to websites we do not control. We are not responsible for their content or their privacy practices.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the extent permitted by applicable law, we are not liable for any loss arising from reliance on the information on this site. Nothing in these terms excludes liability that cannot lawfully be excluded.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the Islamic Republic of Pakistan, and the courts of Lahore, Punjab shall have jurisdiction.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about these terms can be sent to ${business.email} or ${business.phone}.`,
      ],
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 404                                                                         */
/* -------------------------------------------------------------------------- */

export const notFound = {
  heading: "Page not found",
  body: "The page you are looking for does not exist or has been moved.",
  cta: { label: "Back to home", href: "/" },
} as const;
