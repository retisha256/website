import { html, mount, safeUrl } from "../../shared/dom";
import { icon } from "../../shared/icons";
import type { Profile } from "../../shared/types";
import {
  educationCard,
  emptyState,
  experienceTimeline,
  paragraphs,
  sectionHeader,
  skeletonCards,
  skillGroup,
} from "../components";
import { getEducation, getExperience, getSite, getSkills, guarded } from "../data";

function approachCards(profile: Profile) {
  const items = [
    { icon: "briefcase", title: "How I support executives", text: profile.about_executive_support },
    { icon: "message", title: "Organization & communication", text: profile.about_strengths },
    { icon: "shield", title: "AI verification & responsible data handling", text: profile.about_ai_responsibility },
    { icon: "code", title: "Technical background as a supporting advantage", text: profile.about_technical },
  ].filter((i) => i.text.trim());
  if (!items.length) return html``;
  return html`<section class="border-y border-line bg-white"><div class="wrap section">
    ${sectionHeader("My approach", "How I work")}
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      ${items.map((i) => html`<article class="card p-6">
        <span class="icon-tile">${icon(i.icon)}</span>
        <h3 class="mt-4 text-lg font-semibold">${i.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">${i.text}</p>
      </article>`)}
    </div>
  </div></section>`;
}

export async function renderAbout(root: HTMLElement): Promise<void> {
  const { profile } = await getSite();
  const photo = profile.photo
    ? html`<img src="${profile.photo}" alt="${profile.photo_alt}" width="480" height="600" loading="eager" decoding="async"
        class="aspect-[4/5] w-full rounded-3xl object-cover object-[46%_22%] shadow-lift">`
    : "";
  mount(
    root,
    html`<section class="border-b border-line bg-white">
        <div class="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div class="mx-auto w-full max-w-xs lg:max-w-none">${photo}</div>
          <div class="reveal">
            <p class="eyebrow">About me</p>
            <h1 class="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">${profile.full_name}</h1>
            <p class="mt-2 text-lg font-medium text-muted">${profile.professional_title}</p>
            <div class="mt-6 max-w-2xl space-y-4">${profile.long_bio ? paragraphs(profile.long_bio) : paragraphs(profile.short_bio)}</div>
            <div class="mt-8 flex flex-wrap gap-3">
              ${profile.cv_file
                ? html`<a href="${safeUrl(profile.cv_file)}" class="btn-primary" target="_blank" rel="noopener noreferrer" download>${icon("download", "h-4 w-4")} Download my CV<span class="sr-only"> (PDF, opens in a new tab)</span></a>`
                : ""}
              <a href="/contact/" class="btn-secondary">Get in touch</a>
            </div>
          </div>
        </div>
      </section>
      ${approachCards(profile)}
      <section class="wrap section" aria-labelledby="skills-title">
        ${sectionHeader("Skills overview", "What I bring", "Skills grouped by the kind of support they provide.")}
        <div id="about-skills" class="mt-8">${skeletonCards(3, "h-40")}</div>
      </section>
      <div id="about-experience"></div>
      <section class="wrap section pt-0" aria-labelledby="education-title">
        ${sectionHeader("Education", "Education, certifications & development")}
        <div id="about-education" class="mt-8">${skeletonCards(3, "h-36")}</div>
      </section>`,
  );

  const slot = (id: string) => root.querySelector(`#${id}`) as HTMLElement;

  void guarded(slot("about-skills"), async () => {
    const categories = await getSkills();
    if (!categories.length) return emptyState("Skills coming soon", "My skills overview is being updated.");
    return html`<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${categories.map(skillGroup)}</div>`;
  });

  void guarded(slot("about-experience"), async () => {
    const items = await getExperience();
    if (!items.length) return html``;
    return html`<section class="border-y border-line bg-white"><div class="wrap section">
      ${sectionHeader("Experience", "Where I’m working")}
      <div class="mt-8 max-w-3xl">${experienceTimeline(items)}</div>
    </div></section>`;
  });

  void guarded(slot("about-education"), async () => {
    const items = await getEducation();
    if (!items.length) return emptyState("Nothing to show yet", "Education details will appear here.");
    const group = (title: string, kinds: string[]) => {
      const rows = items.filter((e) => kinds.includes(e.kind));
      return rows.length
        ? html`<div><h3 class="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted">${title}</h3>
            <div class="grid gap-4 md:grid-cols-2">${rows.map(educationCard)}</div></div>`
        : html``;
    };
    return html`<div class="space-y-8">
      ${group("Education & certifications", ["degree", "certification"])}
      ${group("Professional development", ["development"])}
    </div>`;
  });
}
