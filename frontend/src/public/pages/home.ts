import { html, mount } from "../../shared/dom";
import { icon } from "../../shared/icons";
import type { Education, Experience, Profile, SiteSettings } from "../../shared/types";
import {
  emptyState,
  projectCard,
  sectionHeader,
  serviceCard,
  skeletonCards,
  testimonialCard,
} from "../components";
import {
  getEducation,
  getExperience,
  getFeaturedProjects,
  getServices,
  getSite,
  getTestimonials,
  guarded,
} from "../data";

function hero(site: SiteSettings, profile: Profile) {
  const photo = profile.photo
    ? html`<img src="${profile.photo}" alt="${profile.photo_alt}" width="640" height="800" fetchpriority="high" decoding="async"
        class="hero-photo relative aspect-[4/5] w-full rounded-3xl object-cover object-[46%_22%] shadow-lift">`
    : html`<div class="relative flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-ink text-6xl font-bold text-accent shadow-lift" role="img" aria-label="${profile.full_name}">${site.monogram}</div>`;

  return html`<section class="wrap pb-14 pt-10 sm:pb-20 sm:pt-16">
    <div class="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div class="reveal">
        <h1 class="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.35rem]">${site.hero_heading}</h1>
        <p class="lead mt-5 max-w-xl">${site.hero_statement}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/contact/" class="btn-primary">${site.hero_primary_cta_label} ${icon("arrowRight", "h-4 w-4")}</a>
          <a href="/services/" class="btn-secondary">${site.hero_secondary_cta_label}</a>
        </div>
        ${site.hero_highlights.length
          ? html`<ul class="check-list mt-9 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
              ${site.hero_highlights.map((h) => html`<li>${icon("check")}<span>${h}</span></li>`)}
            </ul>`
          : ""}
      </div>
      <div class="reveal mx-auto w-full max-w-sm lg:max-w-none">
        <div class="relative mb-3 mr-3 sm:mb-4 sm:mr-4">
          <div class="hero-blob absolute left-3 top-3 h-full w-full rounded-3xl bg-accent/70 sm:left-4 sm:top-4" aria-hidden="true"></div>
          ${photo}
          <div class="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur sm:inset-x-4 sm:bottom-4">
            <p class="text-sm font-semibold">${profile.full_name}</p>
            <p class="text-xs text-muted">${profile.location || profile.professional_title}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function credentials(experience: Experience[], education: Education[]) {
  const current = experience.find((e) => e.is_current) || experience[0];
  const picks: { icon: string; title: string; text: string }[] = [];
  if (current) {
    picks.push({
      icon: "briefcase",
      title: `${current.is_current ? "Currently" : "Previously"}: ${current.job_title}`,
      text: `${current.organization}${current.arrangement ? ` · ${current.arrangement}` : ""}`,
    });
  }
  education.slice(0, 3).forEach((e) =>
    picks.push({ icon: e.kind === "degree" ? "book" : "award", title: e.qualification, text: e.institution }),
  );
  if (!picks.length) return html``;
  return html`<section class="border-y border-line bg-white">
    <div class="wrap section">
      ${sectionHeader("Professional highlights", "Training and experience behind the work")}
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${picks.map((p) => html`<li class="flex gap-4 rounded-2xl bg-canvas p-5">
          <span class="icon-tile">${icon(p.icon)}</span>
          <div><p class="text-sm font-semibold leading-snug">${p.title}</p><p class="mt-1 text-sm text-muted">${p.text}</p></div>
        </li>`)}
      </ul>
      <p class="mt-6"><a href="/about/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">More about me ${icon("arrowRight", "h-4 w-4")}</a></p>
    </div>
  </section>`;
}

export async function renderHome(root: HTMLElement): Promise<void> {
  const { site, profile } = await getSite();
  mount(
    root,
    html`${hero(site, profile)}
      <section class="wrap section pt-0 sm:pt-4" aria-labelledby="services-title">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="max-w-2xl">
            <p class="eyebrow">Services</p>
            <h2 id="services-title" class="section-title">How I can help</h2>
          </div>
          <a href="/services/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">All services ${icon("arrowRight", "h-4 w-4")}</a>
        </div>
        <div id="home-services" class="mt-8">${skeletonCards(4, "h-64")}</div>
      </section>
      <div id="home-credentials"></div>
      <section class="wrap section" aria-labelledby="projects-title">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="max-w-2xl">
            <p class="eyebrow">Selected work</p>
            <h2 id="projects-title" class="section-title">Projects that show how I work</h2>
            <p class="lead mt-3">Technical projects are supporting evidence of my problem-solving and digital systems knowledge.</p>
          </div>
          <a href="/portfolio/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">Full portfolio ${icon("arrowRight", "h-4 w-4")}</a>
        </div>
        <div id="home-projects" class="mt-8">${skeletonCards(3)}</div>
      </section>
      <div id="home-testimonials"></div>
      <section class="wrap pb-16 sm:pb-24">
        <div class="on-dark relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-2xl" aria-hidden="true"></div>
          <h2 class="relative mx-auto max-w-2xl text-3xl font-bold !text-white sm:text-4xl">${site.closing_heading}</h2>
          <p class="relative mx-auto mt-4 max-w-xl text-white/75">${site.closing_text}</p>
          <div class="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href="/contact/" class="btn-primary">${site.nav_cta_label} ${icon("arrowRight", "h-4 w-4")}</a>
            ${profile.email ? html`<a href="mailto:${profile.email}" class="btn-ghost-light">${icon("mail", "h-4 w-4")} ${profile.email}</a>` : ""}
          </div>
          ${profile.availability_statement ? html`<p class="relative mt-6 text-sm text-white/60">${profile.availability_statement}</p>` : ""}
        </div>
      </section>`,
  );

  const slot = (id: string) => root.querySelector(`#${id}`) as HTMLElement;

  void guarded(slot("home-services"), async () => {
    const services = await getServices();
    if (!services.length) return emptyState("Services coming soon", "My service list is being updated. Please check back shortly.");
    return html`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${services.map((s) => serviceCard(s, 3))}</div>`;
  });

  void guarded(slot("home-projects"), async () => {
    const projects = (await getFeaturedProjects()).slice(0, 3);
    if (!projects.length) return emptyState("Projects coming soon", "Case studies will appear here once they are published.");
    return html`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${projects.map(projectCard)}</div>`;
  });

  void guarded(slot("home-credentials"), async () => {
    const [experience, education] = await Promise.all([getExperience(), getEducation()]);
    return credentials(experience, education);
  });

  void guarded(slot("home-testimonials"), async () => {
    const testimonials = await getTestimonials();
    if (!testimonials.length) return html``; // never show an empty testimonials section
    return html`<section class="border-y border-line bg-white"><div class="wrap section">
      ${sectionHeader("Kind words", "What people say")}
      <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">${testimonials.slice(0, 3).map(testimonialCard)}</div>
    </div></section>`;
  });

}
