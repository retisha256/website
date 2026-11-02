/** Declarative description of every CMS module. The generic list/form views render from this. */

export type FieldType =
  | "text" | "textarea" | "url" | "email" | "number" | "date" | "select" | "bool"
  | "list" | "tags" | "image" | "file" | "color" | "icon";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  options?: [string, string][] | "skillCategories";
  accept?: string;
  rows?: number;
  max?: number;
  placeholder?: string;
  /** Name of a sibling field holding this image's alt text (shown as a reminder). */
  altField?: string;
}

export interface Section {
  title: string;
  description?: string;
  fields: Field[];
}

export interface Module {
  key: string;
  label: string;
  singular: string;
  endpoint: string;
  nav: string;
  group: "Content" | "Site";
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  publishable: boolean;
  reorderable: boolean;
  filters?: { name: string; label: string; options: [string, string][] | "skillCategories" }[];
  /** "list" modules have many rows; "single" modules are one editable record. */
  kind: "list" | "single";
  sections: Section[];
  gallery?: boolean;
  badge?: (row: Record<string, unknown>) => string;
  emptyText: string;
}

const ICONS = [
  "calendar", "inbox", "tasks", "users", "file", "folder", "search", "brain", "shield", "workflow", "code",
  "database", "globe", "wrench", "mail", "phone", "chart", "check", "star", "clock", "lock", "cloud", "api",
  "layers", "book", "award", "message", "briefcase", "heart", "link", "pen", "settings", "sparkle",
];
export const ICON_OPTIONS: [string, string][] = ICONS.map((n) => [n, n[0].toUpperCase() + n.slice(1)]);

const SERVICE_CATEGORIES: [string, string][] = [
  ["executive", "Executive Virtual Assistance"],
  ["administrative", "Administrative & Operations Support"],
  ["ai_operations", "AI Operations Support"],
  ["technical", "Technical Assistance"],
  ["other", "Other"],
];

export const PROJECT_CATEGORIES: [string, string][] = [
  ["virtual_assistance", "Virtual Assistance"],
  ["ai_operations", "AI Operations"],
  ["administration", "Administration"],
  ["web_development", "Web Development"],
  ["backend_development", "Backend Development"],
  ["other", "Other"],
];

const publishField: Field = {
  name: "is_published",
  label: "Published",
  type: "bool",
  help: "Only published items appear on the public website.",
};

export const MODULES: Module[] = [
  {
    key: "projects", label: "Projects & case studies", singular: "project", endpoint: "projects", nav: "Projects",
    group: "Content", kind: "list", titleField: "title", subtitleField: "category_label", imageField: "thumbnail",
    publishable: true, reorderable: true, gallery: true,
    filters: [{ name: "category", label: "Category", options: PROJECT_CATEGORIES }],
    emptyText: "No projects yet. Add your first case study.",
    sections: [
      {
        title: "Basics",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, max: 140 },
          { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES, required: true },
          { name: "summary", label: "Card summary", type: "textarea", rows: 2, required: true, max: 300,
            help: "One or two sentences shown on project cards." },
          { name: "organization", label: "Organization / context", type: "text" },
          { name: "period", label: "Period", type: "text", placeholder: "e.g. 2026 or Aug 2026 – Present" },
          { name: "role_title", label: "Your role title", type: "text" },
          { name: "tags", label: "Tags", type: "tags", help: "Comma-separated, e.g. Django, API integration." },
          { name: "is_featured", label: "Feature on the homepage", type: "bool" },
          publishField,
        ],
      },
      {
        title: "Case study",
        description: "Sections you leave empty are not shown on the public page.",
        fields: [
          { name: "overview", label: "1. Project or experience overview", type: "textarea", rows: 4 },
          { name: "problem", label: "2. Problem or need addressed", type: "textarea", rows: 4 },
          { name: "role_description", label: "3. My role (introduction)", type: "textarea", rows: 3 },
          { name: "responsibilities", label: "3. Responsibilities", type: "list", help: "One per line." },
          { name: "work_completed", label: "4. Work completed", type: "list", help: "One per line." },
          { name: "technologies", label: "5. Tools and technologies", type: "list", help: "One per line." },
          { name: "challenges_lessons", label: "6. Challenges and lessons learned", type: "textarea", rows: 4 },
          { name: "outcomes", label: "7. Verified outcomes", type: "list",
            help: "Only add outcomes you can prove. Do not estimate or invent metrics." },
          { name: "outcomes_evidence", label: "How the outcomes can be verified", type: "text",
            help: "Required when outcomes are listed (a link, document or reference)." },
        ],
      },
      {
        title: "Media & links",
        fields: [
          { name: "thumbnail", label: "Thumbnail", type: "image", altField: "thumbnail_alt",
            help: "JPG, PNG, WebP or GIF, up to 5 MB." },
          { name: "thumbnail_alt", label: "Thumbnail description (alt text)", type: "text",
            help: "Describe the image for people using screen readers." },
          { name: "live_url", label: "Live project link", type: "url" },
          { name: "source_url", label: "Source code link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "services", label: "Services", singular: "service", endpoint: "services", nav: "Services",
    group: "Content", kind: "list", titleField: "title", subtitleField: "category",
    publishable: true, reorderable: true,
    filters: [{ name: "category", label: "Category", options: SERVICE_CATEGORIES }],
    emptyText: "No services yet. Add the first one.",
    sections: [
      {
        title: "Service",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "category", label: "Category", type: "select", options: SERVICE_CATEGORIES, required: true },
          { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
          { name: "features", label: "What’s included", type: "list", help: "One bullet per line." },
          { name: "icon", label: "Icon", type: "icon", help: "Pick a built-in icon, or upload your own below." },
          { name: "icon_image", label: "Custom icon (optional)", type: "image", altField: "icon_alt",
            help: "Overrides the built-in icon. Use a square image." },
          { name: "icon_alt", label: "Custom icon description", type: "text" },
          publishField,
        ],
      },
    ],
  },
  {
    key: "skill-categories", label: "Skill categories", singular: "category", endpoint: "skill-categories",
    nav: "Skill categories", group: "Content", kind: "list", titleField: "name", subtitleField: "description",
    publishable: true, reorderable: true,
    badge: (r) => `${r.skill_count ?? 0} skills`,
    emptyText: "No categories yet.",
    sections: [{
      title: "Category",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Short description", type: "text" },
        { name: "icon", label: "Icon", type: "icon" },
        publishField,
      ],
    }],
  },
  {
    key: "skills", label: "Skills", singular: "skill", endpoint: "skills", nav: "Skills",
    group: "Content", kind: "list", titleField: "name", subtitleField: "category_name",
    publishable: true, reorderable: true,
    filters: [{ name: "category", label: "Category", options: "skillCategories" }],
    emptyText: "No skills yet. Add a category first, then skills.",
    sections: [{
      title: "Skill",
      description: "Skills are shown by name. No percentage bars are displayed.",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "select", options: "skillCategories", required: true },
        { name: "description", label: "Short description", type: "text" },
        { name: "icon", label: "Icon (optional)", type: "icon" },
        publishField,
      ],
    }],
  },
  {
    key: "experience", label: "Work experience", singular: "role", endpoint: "experience", nav: "Experience",
    group: "Content", kind: "list", titleField: "job_title", subtitleField: "organization",
    publishable: true, reorderable: true,
    emptyText: "No roles yet.",
    sections: [{
      title: "Role",
      fields: [
        { name: "job_title", label: "Job title", type: "text", required: true },
        { name: "organization", label: "Employer or organization", type: "text", required: true },
        { name: "arrangement", label: "Work arrangement / location", type: "text", placeholder: "e.g. Remote (Nigeria)" },
        { name: "start_date", label: "Start date", type: "date", required: true },
        { name: "is_current", label: "This is my current role", type: "bool" },
        { name: "end_date", label: "End date", type: "date", help: "Leave empty for a current role." },
        { name: "description", label: "Summary", type: "textarea", rows: 3 },
        { name: "responsibilities", label: "Responsibilities & achievements", type: "list", help: "One per line." },
        publishField,
      ],
    }],
  },
  {
    key: "education", label: "Education & certifications", singular: "entry", endpoint: "education",
    nav: "Education", group: "Content", kind: "list", titleField: "qualification", subtitleField: "institution",
    publishable: true, reorderable: true,
    emptyText: "No entries yet.",
    sections: [{
      title: "Qualification",
      fields: [
        { name: "qualification", label: "Qualification or certification", type: "text", required: true },
        { name: "institution", label: "Institution", type: "text", required: true },
        { name: "kind", label: "Type", type: "select", required: true, options: [
          ["degree", "Degree"], ["certification", "Certificate / certification"], ["development", "Professional development"],
        ] },
        { name: "status", label: "Status", type: "select", required: true, options: [
          ["completed", "Completed"], ["in_progress", "Currently pursuing"], ["expected", "Expected completion"],
        ], help: "Choose “Expected” until it is actually completed. It is shown as “Expected …” publicly." },
        { name: "date", label: "Completion / expected date", type: "date", help: "Only month and year are shown." },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
        { name: "certificate_file", label: "Certificate (image or PDF)", type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp" },
        publishField,
      ],
    }],
  },
  {
    key: "testimonials", label: "Testimonials", singular: "testimonial", endpoint: "testimonials",
    nav: "Testimonials", group: "Content", kind: "list", titleField: "name", subtitleField: "organization",
    imageField: "image", publishable: true, reorderable: true,
    emptyText: "No testimonials. Only add real ones you have permission to publish.",
    sections: [{
      title: "Testimonial",
      description: "Only add genuine testimonials the author has authorised you to publish.",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "organization", label: "Organization", type: "text" },
        { name: "text", label: "Testimonial", type: "textarea", rows: 5, required: true },
        { name: "image", label: "Photo (optional)", type: "image", altField: "image_alt" },
        { name: "image_alt", label: "Photo description", type: "text" },
        { name: "permission_confirmed", label: "The author has given permission to publish this", type: "bool" },
        publishField,
      ],
    }],
  },
  {
    key: "profile", label: "Profile", singular: "profile", endpoint: "profile", nav: "Profile",
    group: "Site", kind: "single", titleField: "full_name", publishable: false, reorderable: false,
    emptyText: "",
    sections: [
      {
        title: "Identity",
        fields: [
          { name: "full_name", label: "Full name", type: "text", required: true },
          { name: "professional_title", label: "Professional title", type: "text", required: true },
          { name: "photo", label: "Profile photograph", type: "image", altField: "photo_alt",
            help: "Used on the homepage and About page. Upload a replacement any time." },
          { name: "photo_alt", label: "Photo description (alt text)", type: "text" },
          { name: "availability_statement", label: "Availability statement", type: "text",
            placeholder: "Leave empty to hide" },
        ],
      },
      {
        title: "Biography",
        fields: [
          { name: "short_bio", label: "Short biography", type: "textarea", rows: 3 },
          { name: "long_bio", label: "Long biography", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
        ],
      },
      {
        title: "About page sections",
        description: "Each box becomes a card on the About page. Leave one empty to hide it.",
        fields: [
          { name: "about_executive_support", label: "My approach to supporting executives", type: "textarea", rows: 4 },
          { name: "about_strengths", label: "Organizational & communication strengths", type: "textarea", rows: 4 },
          { name: "about_ai_responsibility", label: "AI verification & responsible data handling", type: "textarea", rows: 4 },
          { name: "about_technical", label: "Technical background", type: "textarea", rows: 4 },
        ],
      },
      {
        title: "CV",
        fields: [
          { name: "cv_file", label: "CV (PDF)", type: "file", accept: ".pdf",
            help: "Powers every “Download my CV” button. Replace it here when your CV changes." },
        ],
      },
      {
        title: "Search engine listing",
        fields: [
          { name: "seo_title", label: "SEO title", type: "text", max: 70 },
          { name: "seo_description", label: "SEO description", type: "textarea", rows: 2, max: 170 },
        ],
      },
    ],
  },
  {
    key: "contact", label: "Contact details", singular: "contact details", endpoint: "profile", nav: "Contact details",
    group: "Site", kind: "single", titleField: "full_name", publishable: false, reorderable: false,
    emptyText: "",
    sections: [{
      title: "Contact details",
      description: "Shown on the Contact page and in the footer. Email and phone become clickable links.",
      fields: [
        { name: "location", label: "Location", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone_primary", label: "Phone (primary)", type: "text" },
        { name: "phone_secondary", label: "Phone (secondary)", type: "text" },
        { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
        { name: "github_url", label: "GitHub URL", type: "url" },
      ],
    }],
  },
  {
    key: "links", label: "Other professional links", singular: "link", endpoint: "links", nav: "Other links",
    group: "Site", kind: "list", titleField: "label", subtitleField: "url", publishable: true, reorderable: true,
    emptyText: "No extra links. LinkedIn and GitHub are edited under Contact details.",
    sections: [{
      title: "Link",
      fields: [
        { name: "label", label: "Label", type: "text", required: true },
        { name: "url", label: "URL", type: "url", required: true },
        { name: "icon", label: "Icon", type: "icon" },
        publishField,
      ],
    }],
  },
  {
    key: "settings", label: "Site settings", singular: "settings", endpoint: "site-settings", nav: "Site settings",
    group: "Site", kind: "single", titleField: "site_title", publishable: false, reorderable: false,
    emptyText: "",
    sections: [
      {
        title: "Branding",
        fields: [
          { name: "site_title", label: "Site title", type: "text", required: true },
          { name: "monogram", label: "Logo monogram", type: "text", max: 4, help: "Initials shown when no logo is uploaded." },
          { name: "logo", label: "Logo (optional)", type: "image" },
          { name: "favicon", label: "Favicon", type: "image", accept: ".png,.ico,.webp,.jpg", help: "Small square image shown in the browser tab." },
          { name: "footer_text", label: "Footer text", type: "text" },
        ],
      },
      {
        title: "Theme colours",
        description: "Defaults are the brand palette. Keep strong contrast between text and background.",
        fields: [
          { name: "color_background", label: "Background", type: "color" },
          { name: "color_text", label: "Headings & text", type: "color" },
          { name: "color_accent", label: "Accent & buttons", type: "color" },
          { name: "color_muted", label: "Muted text", type: "color" },
        ],
      },
      {
        title: "Navigation labels",
        fields: [
          { name: "nav_home", label: "Home", type: "text" },
          { name: "nav_about", label: "About", type: "text" },
          { name: "nav_services", label: "Services", type: "text" },
          { name: "nav_portfolio", label: "Portfolio", type: "text" },
          { name: "nav_contact", label: "Contact", type: "text" },
          { name: "nav_cta_label", label: "Header button", type: "text" },
        ],
      },
      {
        title: "Homepage",
        fields: [
          { name: "hero_heading", label: "Main heading", type: "text", required: true },
          { name: "hero_statement", label: "Supporting statement", type: "textarea", rows: 3, required: true },
          { name: "hero_highlights", label: "Service highlights under the hero", type: "list", help: "One per line." },
          { name: "hero_primary_cta_label", label: "Primary button", type: "text" },
          { name: "hero_secondary_cta_label", label: "Secondary button", type: "text" },
          { name: "closing_heading", label: "Closing call-to-action heading", type: "text" },
          { name: "closing_text", label: "Closing call-to-action text", type: "textarea", rows: 2 },
        ],
      },
      {
        title: "SEO & sharing",
        fields: [
          { name: "seo_title", label: "Home page SEO title", type: "text", max: 70 },
          { name: "seo_description", label: "Home page SEO description", type: "textarea", rows: 2, max: 170 },
          { name: "og_image", label: "Social sharing image", type: "image", help: "Shown when the site is shared. Ideal size 1200×630." },
        ],
      },
      {
        title: "Maintenance mode",
        description: "Visitors see a “back soon” page. You can still use the CMS.",
        fields: [
          { name: "maintenance_mode", label: "Turn on maintenance mode", type: "bool" },
          { name: "maintenance_message", label: "Message", type: "text" },
        ],
      },
    ],
  },
];

export const moduleByKey = (key: string): Module | undefined => MODULES.find((m) => m.key === key);
