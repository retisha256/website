export interface SiteSettings {
  site_title: string;
  monogram: string;
  logo: string | null;
  favicon: string | null;
  nav_cta_label: string;
  hero_eyebrow: string;
  hero_heading: string;
  hero_statement: string;
  hero_highlights: string[];
  hero_primary_cta_label: string;
  hero_secondary_cta_label: string;
  closing_heading: string;
  closing_text: string;
  footer_text: string;
}

export interface Profile {
  full_name: string;
  professional_title: string;
  short_bio: string;
  long_bio: string;
  photo: string | null;
  photo_alt: string;
  location: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  linkedin_url: string;
  github_url: string;
  availability_statement: string;
  about_executive_support: string;
  about_strengths: string;
  about_ai_responsibility: string;
  about_technical: string;
  cv_file: string | null;
}

export interface ContactLink {
  id: number;
  label: string;
  url: string;
  icon: string;
}

export interface SiteBundle {
  site: SiteSettings;
  profile: Profile;
  links: ContactLink[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  category: string;
  icon: string;
  icon_image: string | null;
  icon_alt: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  skills: Skill[];
}

export interface ProjectCard {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_label: string;
  tags: string[];
  is_featured: boolean;
  organization: string;
  period: string;
  role_title: string;
  summary: string;
  technologies: string[];
  thumbnail: string | null;
  thumbnail_alt: string;
  live_url: string;
  source_url: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  alt_text: string;
  caption: string;
}

export interface Project extends ProjectCard {
  overview: string;
  problem: string;
  role_description: string;
  responsibilities: string[];
  work_completed: string[];
  challenges_lessons: string;
  outcomes: string[];
  outcomes_evidence: string;
  images: ProjectImage[];
}

export interface ProjectFacets {
  categories: { value: string; label: string; count: number }[];
  tags: { name: string; slug: string; count: number }[];
}

export interface Experience {
  id: number;
  organization: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  arrangement: string;
  description: string;
  responsibilities: string[];
}

export interface Education {
  id: number;
  institution: string;
  qualification: string;
  kind: "degree" | "certification" | "development";
  status: "completed" | "in_progress" | "expected";
  date: string | null;
  description: string;
  certificate_file: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization: string;
  text: string;
  image: string | null;
  image_alt: string;
}
