/* Declarative configuration for every editable collection in the CMS.
   The generic admin pages (/admin/c/[collection]) render list and edit
   views from this config, so adding a content type is a schema change
   plus an entry here. */

export type FieldType =
  | "text" | "textarea" | "markdown" | "image" | "boolean"
  | "select" | "number" | "datetime" | "slug" | "url" | "email";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  /** for slug fields: which field to derive from */
  from?: string;
};

export type CollectionConfig = {
  key: string;            // URL segment, e.g. "faqs"
  model: string;          // prisma delegate name, e.g. "faq"
  label: string;          // plural
  singular: string;
  description: string;
  fields: Field[];
  listColumns: string[];  // field names shown in list view
  orderable: boolean;     // supports manual ordering
  publishable: boolean;   // has `published`
  sortBy?: { field: string; dir: "asc" | "desc" };
  icon: string;
  group: "Home page sections" | "Content";
};

const PUBLISHED: Field = { name: "published", label: "Published", type: "boolean", help: "Unpublished items are hidden from the site." };

export const COLLECTIONS: CollectionConfig[] = [
  {
    key: "about-slides", model: "aboutSlide", label: "About slides", singular: "About slide", icon: "slides",
    description: "Slides in the 'About Womentor Africa' carousel (The Why, Vision, Mission).",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["heading", "title"],
    fields: [
      { name: "heading", label: "Heading", type: "text", required: true, help: "e.g. The Why, Our VISION" },
      { name: "title", label: "Title", type: "text", help: "Optional bold line under the heading." },
      { name: "content", label: "Content", type: "textarea", required: true, rows: 6, help: "Blank line = new paragraph." },
      { name: "image", label: "Image", type: "image" },
      PUBLISHED,
    ],
  },
  {
    key: "pillars", model: "pillar", label: "Approach pillars", singular: "Pillar", icon: "pillars",
    description: "The three pillars shown under 'Our Approach'.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["title", "color"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "icon", label: "Icon", type: "select", options: [
        { value: "handshake", label: "Handshake" }, { value: "book", label: "Book" }, { value: "megaphone", label: "Megaphone" },
        { value: "star", label: "Star" }, { value: "users", label: "People" }, { value: "spark", label: "Spark" }] },
      { name: "color", label: "Card colour", type: "select", options: [
        { value: "orange", label: "Orange" }, { value: "amber", label: "Amber" }, { value: "pink", label: "Pink" }, { value: "emerald", label: "Emerald" }] },
      PUBLISHED,
    ],
  },
  {
    key: "features", model: "feature", label: "Mentorship features", singular: "Feature", icon: "sparkles",
    description: "Bullet points under 'What makes our mentorship program unique'.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["title"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      PUBLISHED,
    ],
  },
  {
    key: "expect-tabs", model: "expectTab", label: "What to expect", singular: "Tab", icon: "tabs",
    description: "Tabs in the 'What to Expect' section (Duration & Structure, Support & Resources…). FAQs are managed separately and appear as the last tab.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["title"],
    fields: [
      { name: "title", label: "Tab title", type: "text", required: true },
      { name: "body", label: "Body", type: "markdown", required: true, rows: 14 },
      PUBLISHED,
    ],
  },
  {
    key: "faqs", model: "faq", label: "FAQs", singular: "FAQ", icon: "question",
    description: "Questions shown in the FAQs tab.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["question"],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 5 },
      PUBLISHED,
    ],
  },
  {
    key: "stats", model: "stat", label: "Impact stats", singular: "Stat", icon: "chart",
    description: "Numbers in the 'Our Impact' section.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["value", "label"],
    fields: [
      { name: "value", label: "Value", type: "text", required: true, help: "e.g. 200+, 75%" },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "description", label: "Description", type: "text" },
      { name: "icon", label: "Icon", type: "select", options: [
        { value: "link", label: "Link" }, { value: "globe", label: "Globe" }, { value: "building", label: "Building" },
        { value: "clock", label: "Clock" }, { value: "trend", label: "Trend" }, { value: "calendar", label: "Calendar" }, { value: "users", label: "People" }] },
      PUBLISHED,
    ],
  },
  {
    key: "partners", model: "partner", label: "Partners", singular: "Partner", icon: "handshake",
    description: "Logos in the partners carousel.",
    group: "Home page sections", orderable: true, publishable: true,
    listColumns: ["name", "website"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", required: true },
      { name: "website", label: "Website", type: "url" },
      PUBLISHED,
    ],
  },
  {
    key: "posts", model: "post", label: "News & stories", singular: "Post", icon: "news",
    description: "Articles shown at /news.",
    group: "Content", orderable: false, publishable: true, sortBy: { field: "createdAt", dir: "desc" },
    listColumns: ["title", "author", "publishedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", from: "title", help: "URL path, e.g. /news/your-slug. Leave blank to generate from the title." },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "author", label: "Author", type: "text" },
      { name: "body", label: "Body", type: "markdown", rows: 20 },
      { name: "publishedAt", label: "Publish date", type: "datetime" },
      PUBLISHED,
    ],
  },
  {
    key: "events", model: "event", label: "Events", singular: "Event", icon: "calendar",
    description: "Learning sessions and events shown at /events.",
    group: "Content", orderable: false, publishable: true, sortBy: { field: "startsAt", dir: "desc" },
    listColumns: ["title", "startsAt", "location"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", from: "title", help: "URL path, e.g. /events/your-slug." },
      { name: "summary", label: "Summary", type: "textarea", rows: 3 },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "location", label: "Location", type: "text" },
      { name: "startsAt", label: "Starts", type: "datetime", required: true },
      { name: "endsAt", label: "Ends", type: "datetime" },
      { name: "registerUrl", label: "Registration link", type: "url" },
      { name: "body", label: "Details", type: "markdown", rows: 16 },
      PUBLISHED,
    ],
  },
];

export function getCollection(key: string): CollectionConfig | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

/* ---------- Singletons ---------- */

export type FieldGroup = { title: string; description?: string; fields: Field[] };

export const SETTINGS_GROUPS: FieldGroup[] = [
  { title: "Site", fields: [
    { name: "siteName", label: "Site name", type: "text", required: true },
    { name: "tagline", label: "Tagline", type: "text" },
    { name: "metaTitle", label: "Browser title", type: "text" },
    { name: "metaDescription", label: "Meta description", type: "textarea", rows: 2 },
    { name: "logoUrl", label: "Logo", type: "image" },
  ]},
  { title: "Member app", description: "The external platform members log in to.", fields: [
    { name: "appUrl", label: "App URL", type: "url", help: "Login and signup buttons link here." },
    { name: "loginLabel", label: "Login button label", type: "text" },
  ]},
  { title: "Signup availability", description: "Controls the 'Join' popup. Mirrors the signup/status API.", fields: [
    { name: "menteeSignup", label: "Mentee signup open", type: "boolean" },
    { name: "menteeWaitlist", label: "Mentee waitlist enabled (when signup is closed)", type: "boolean" },
    { name: "mentorSignup", label: "Mentor signup open", type: "boolean" },
    { name: "mentorWaitlist", label: "Mentor waitlist enabled (when signup is closed)", type: "boolean" },
  ]},
  { title: "Contact details", fields: [
    { name: "organisationName", label: "Legal name", type: "text" },
    { name: "addressLine1", label: "Address line 1", type: "text" },
    { name: "addressLine2", label: "Address line 2", type: "text" },
    { name: "addressCountry", label: "Country", type: "text" },
    { name: "infoEmail", label: "General email", type: "email" },
    { name: "partnershipsEmail", label: "Partnerships email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
  ]},
  { title: "Social & footer", fields: [
    { name: "instagramUrl", label: "Instagram URL", type: "url" },
    { name: "linkedinUrl", label: "LinkedIn URL", type: "url" },
    { name: "copyrightText", label: "Copyright line", type: "text" },
    { name: "showNews", label: "Show News link in navigation", type: "boolean" },
    { name: "showEvents", label: "Show Events link in navigation", type: "boolean" },
  ]},
];

export const HOME_GROUPS: FieldGroup[] = [
  { title: "Hero", fields: [
    { name: "heroTitle", label: "Headline", type: "textarea", rows: 2, help: "Line breaks are kept." },
    { name: "heroSubtitle", label: "Subtitle", type: "textarea", rows: 3 },
    { name: "heroQuote", label: "Italic quote", type: "textarea", rows: 3 },
    { name: "heroCtaLabel", label: "Button label", type: "text" },
    { name: "heroCtaTarget", label: "Button scrolls to", type: "select", options: [
      { value: "about", label: "About" }, { value: "mentorship", label: "Mentorship" }, { value: "community", label: "Community" }, { value: "contact", label: "Contact" }] },
    { name: "heroImage", label: "Hero illustration", type: "image" },
  ]},
  { title: "About", description: "Slides are edited under About slides.", fields: [
    { name: "aboutTitle", label: "Section title", type: "text" },
  ]},
  { title: "Our Approach", description: "Pillar cards are edited under Approach pillars.", fields: [
    { name: "approachTitle", label: "Section title", type: "text" },
    { name: "approachIntro", label: "Intro", type: "textarea", rows: 4 },
  ]},
  { title: "Mentorship overview", description: "Feature bullets are edited under Mentorship features.", fields: [
    { name: "mentorshipTitle", label: "Section title", type: "text" },
    { name: "mentorshipBody", label: "Body", type: "textarea", rows: 8, help: "Blank line = new paragraph." },
    { name: "mentorshipImage", label: "Image", type: "image" },
    { name: "featuresTitle", label: "Features heading", type: "text" },
    { name: "featuresImage", label: "Features image", type: "image" },
  ]},
  { title: "What to expect", description: "Tabs are edited under What to expect; questions under FAQs.", fields: [
    { name: "expectTitle", label: "Section title", type: "text" },
    { name: "expectIntro", label: "Intro", type: "textarea", rows: 2 },
    { name: "expectCtaTitle", label: "Call-to-action title", type: "text" },
    { name: "expectCtaBody", label: "Call-to-action text", type: "textarea", rows: 2 },
  ]},
  { title: "Quote banner", fields: [
    { name: "quoteText", label: "Quote", type: "textarea", rows: 3 },
  ]},
  { title: "Our Impact", description: "Numbers are edited under Impact stats.", fields: [
    { name: "impactTitle", label: "Section title", type: "text" },
    { name: "impactIntro", label: "Intro", type: "textarea", rows: 2 },
  ]},
  { title: "Partners", fields: [
    { name: "partnersTitle", label: "Section title", type: "text" },
    { name: "partnersSubtitle", label: "Subtitle", type: "text" },
  ]},
  { title: "Community banner", fields: [
    { name: "communityTitle", label: "Title", type: "text" },
    { name: "communityBody", label: "Text", type: "textarea", rows: 2 },
    { name: "communityImage", label: "Image", type: "image" },
  ]},
  { title: "Contact section", description: "Addresses and emails are under Settings.", fields: [
    { name: "partnerTitle", label: "Partner block title", type: "text" },
    { name: "partnerBody", label: "Partner block text", type: "textarea", rows: 2 },
    { name: "followTitle", label: "Follow block title", type: "text" },
    { name: "followBody", label: "Follow block text", type: "textarea", rows: 2 },
    { name: "contactTitle", label: "Contact block title", type: "text" },
  ]},
  { title: "Join popup", fields: [
    { name: "signupWelcome", label: "Welcome line", type: "text" },
    { name: "signupPrompt", label: "Prompt", type: "text" },
    { name: "menteeBenefits", label: "Mentee benefits", type: "textarea", rows: 3, help: "One per line." },
    { name: "mentorBenefits", label: "Mentor benefits", type: "textarea", rows: 3, help: "One per line." },
  ]},
];
