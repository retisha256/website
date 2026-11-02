import { Safe, html, monthYear, safeUrl, telHref } from "../shared/dom";
import { icon } from "../shared/icons";
import type {
  ContactLink,
  Education,
  Experience,
  Profile,
  ProjectCard,
  Service,
  SkillCategory,
  Testimonial,
} from "../shared/types";

/* ---------- generic states ---------- */

export function skeletonCards(count = 3, className = "h-56"): Safe {
  return html`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
    <span class="sr-only">Loading…</span>
    ${Array.from({ length: count }, () => html`<div class="skeleton ${className}"></div>`)}
  </div>`;
}

export function errorState(message: string): Safe {
  return html`<div class="card mx-auto max-w-lg p-8 text-center" role="alert">
    <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-700">${icon("alert")}</span>
    <h2 class="mt-4 text-lg font-semibold">Something went wrong</h2>
    <p class="mt-2 text-sm text-muted">${message}</p>
    <button type="button" class="btn-dark mt-5" data-retry>Try again</button>
  </div>`;
}

export function emptyState(title: string, text: string): Safe {
  return html`<div class="card mx-auto max-w-lg border-dashed p-8 text-center">
    <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-mist text-muted">${icon("folder")}</span>
    <h3 class="mt-4 text-base font-semibold">${title}</h3>
    <p class="mt-2 text-sm text-muted">${text}</p>
  </div>`;
}

export function sectionHeader(eyebrow: string, title: string, intro = "", center = false): Safe {
  return html`<div class="${center ? "mx-auto text-center" : ""} max-w-2xl">
    <p class="eyebrow">${eyebrow}</p>
    <h2 class="section-title">${title}</h2>
    ${intro ? html`<p class="lead mt-3">${intro}</p>` : ""}
  </div>`;
}

export function pageHero(eyebrow: string, title: string, intro: string): Safe {
  return html`<section class="border-b border-line bg-white">
    <div class="wrap py-12 sm:py-16">
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">${title}</h1>
      ${intro ? html`<p class="lead mt-4 max-w-2xl">${intro}</p>` : ""}
    </div>
  </section>`;
}

export function paragraphs(text: string, className = "text-muted leading-relaxed"): Safe {
  return html`${text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => html`<p class="${className}">${p}</p>`)}`;
}

/* ---------- services ---------- */

export function serviceIcon(service: Service, size = "h-5 w-5"): Safe {
  if (service.icon_image) {
    return html`<img src="${service.icon_image}" alt="${service.icon_alt}" class="${size} object-contain" loading="lazy" decoding="async">`;
  }
  return icon(service.icon, size);
}

export function serviceCard(service: Service, featureLimit = 3): Safe {
  const features = service.features.slice(0, featureLimit);
  return html`<article class="card card-hover flex flex-col p-6">
    <span class="icon-tile">${serviceIcon(service)}</span>
    <h3 class="mt-5 text-lg font-semibold">${service.title}</h3>
    <p class="mt-2 text-sm leading-relaxed text-muted">${service.description}</p>
    ${features.length
      ? html`<ul class="check-list mt-4 space-y-2">${features.map((f) => html`<li>${icon("check")}<span>${f}</span></li>`)}</ul>`
      : ""}
  </article>`;
}

export function serviceSection(service: Service, index: number): Safe {
  return html`<article id="service-${service.id}" class="card scroll-mt-24 overflow-hidden">
    <div class="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <span class="icon-tile h-12 w-12">${serviceIcon(service, "h-6 w-6")}</span>
        <p class="eyebrow mt-5">${String(index + 1).padStart(2, "0")}</p>
        <h2 class="mt-1 text-2xl font-bold">${service.title}</h2>
        <p class="mt-3 leading-relaxed text-muted">${service.description}</p>
      </div>
      ${service.features.length
        ? html`<ul class="check-list grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            ${service.features.map((f) => html`<li class="rounded-xl bg-canvas p-3.5">${icon("check")}<span>${f}</span></li>`)}
          </ul>`
        : ""}
    </div>
  </article>`;
}

/* ---------- projects ---------- */

export function projectCard(project: ProjectCard): Safe {
  const media = project.thumbnail
    ? html`<img src="${project.thumbnail}" alt="${project.thumbnail_alt || project.title}" width="640" height="400"
        class="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async">`
    : html`<div class="flex h-full w-full items-center justify-center bg-ink text-accent">${icon("layers", "h-10 w-10 opacity-80")}</div>`;
  return html`<article class="card card-hover group relative flex flex-col overflow-hidden">
    <a href="/portfolio/${project.slug}/" class="block aspect-[16/10] overflow-hidden bg-mist" tabindex="-1" aria-hidden="true">${media}</a>
    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <span class="chip-soft">${project.category_label}</span>
        ${project.period ? html`<span class="text-xs text-muted">${project.period}</span>` : ""}
      </div>
      <h3 class="mt-3 text-lg font-semibold leading-snug">
        <a href="/portfolio/${project.slug}/" class="after:absolute after:inset-0 hover:underline">${project.title}</a>
      </h3>
      <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">${project.summary}</p>
      ${project.technologies.length
        ? html`<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            ${project.technologies.slice(0, 4).map((t) => html`<li class="chip">${t}</li>`)}
            ${project.technologies.length > 4 ? html`<li class="chip text-muted">+${project.technologies.length - 4}</li>` : ""}
          </ul>`
        : ""}
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">Read case study ${icon("arrowRight", "h-4 w-4")}</span>
    </div>
  </article>`;
}

/* ---------- skills ---------- */

export function skillGroup(category: SkillCategory): Safe {
  return html`<section class="card p-5 sm:p-6" aria-labelledby="skills-${category.slug}">
    <div class="flex items-center gap-3">
      <span class="icon-tile h-10 w-10">${icon(category.icon || "sparkle", "h-5 w-5")}</span>
      <h3 id="skills-${category.slug}" class="text-base font-semibold">${category.name}</h3>
    </div>
    ${category.description ? html`<p class="mt-3 text-sm text-muted">${category.description}</p>` : ""}
    <ul class="mt-4 flex flex-wrap gap-2">
      ${category.skills.map((s) => html`<li class="rounded-md border border-line bg-canvas px-2.5 py-1.5 text-[13px] font-medium" title="${s.description}">${s.name}</li>`)}
    </ul>
  </section>`;
}

/* ---------- experience & education ---------- */

export function experienceTimeline(items: Experience[]): Safe {
  return html`<ol class="relative space-y-6 border-l-2 border-line pl-6 sm:pl-8">
    ${items.map((e) => {
      const end = e.is_current ? "Present" : monthYear(e.end_date);
      return html`<li class="relative">
        <span class="absolute -left-[calc(1.5rem+7px)] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-accent sm:-left-[calc(2rem+7px)]"></span>
        <div class="card p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div>
              <h3 class="text-lg font-semibold">${e.job_title}</h3>
              <p class="text-sm font-medium text-muted">${e.organization}${e.arrangement ? ` · ${e.arrangement}` : ""}</p>
            </div>
            <p class="chip-soft">${monthYear(e.start_date)} – ${end}</p>
          </div>
          ${e.description ? html`<p class="mt-3 text-sm leading-relaxed text-muted">${e.description}</p>` : ""}
          ${e.responsibilities.length
            ? html`<ul class="check-list mt-4 space-y-2">${e.responsibilities.map((r) => html`<li>${icon("check")}<span>${r}</span></li>`)}</ul>`
            : ""}
        </div>
      </li>`;
    })}
  </ol>`;
}

export function educationDate(item: Education): string {
  if (item.status === "in_progress") return "Currently pursuing";
  const when = monthYear(item.date);
  if (item.status === "expected") return `Expected ${when}`;
  return when ? `Completed ${when}` : "Completed";
}

export function educationCard(item: Education): Safe {
  const isCert = item.certificate_file;
  return html`<article class="card flex gap-4 p-5">
    <span class="icon-tile">${icon(item.kind === "degree" ? "book" : item.kind === "development" ? "users" : "award")}</span>
    <div class="min-w-0">
      <h3 class="text-base font-semibold leading-snug">${item.qualification}</h3>
      <p class="text-sm text-muted">${item.institution}</p>
      <p class="mt-2"><span class="chip-soft">${educationDate(item)}</span></p>
      ${item.description ? html`<p class="mt-3 text-sm text-muted">${item.description}</p>` : ""}
      ${isCert
        ? html`<a class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline" href="${safeUrl(item.certificate_file)}" target="_blank" rel="noopener noreferrer">View certificate ${icon("external", "h-4 w-4")}<span class="sr-only"> (opens in a new tab)</span></a>`
        : ""}
    </div>
  </article>`;
}

/* ---------- testimonials ---------- */

export function testimonialCard(t: Testimonial): Safe {
  return html`<figure class="card flex h-full flex-col p-6">
    <blockquote class="flex-1 text-base leading-relaxed">“${t.text}”</blockquote>
    <figcaption class="mt-5 flex items-center gap-3">
      ${t.image ? html`<img src="${t.image}" alt="${t.image_alt || t.name}" class="h-11 w-11 rounded-full object-cover" loading="lazy" decoding="async" width="44" height="44">` : ""}
      <div>
        <p class="text-sm font-semibold">${t.name}</p>
        <p class="text-xs text-muted">${[t.role, t.organization].filter(Boolean).join(", ")}</p>
      </div>
    </figcaption>
  </figure>`;
}

/* ---------- contact ---------- */

export function contactRow(iconName: string, label: string, value: Safe, hint = ""): Safe {
  return html`<li class="flex items-start gap-4 p-4 sm:p-5">
    <span class="icon-tile h-10 w-10">${icon(iconName, "h-5 w-5")}</span>
    <div class="min-w-0">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">${label}</p>
      <div class="mt-0.5 break-words text-base font-medium">${value}</div>
      ${hint ? html`<p class="mt-0.5 text-xs text-muted">${hint}</p>` : ""}
    </div>
  </li>`;
}

const display = (url: string): string => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function contactList(profile: Profile, links: ContactLink[]): Safe {
  const external = (url: string, text: string) =>
    html`<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}<span class="sr-only"> (opens in a new tab)</span></a>`;
  const rows: Safe[] = [contactRow("user", "Name", html`${profile.full_name}`)];
  if (profile.location) rows.push(contactRow("mapPin", "Location", html`${profile.location}`));
  const phones = [profile.phone_primary, profile.phone_secondary].filter(Boolean);
  if (phones.length) {
    rows.push(
      contactRow(
        "phone",
        phones.length > 1 ? "Phone numbers" : "Phone",
        html`${phones.map((p, i) => html`${i ? " / " : ""}<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="${telHref(p)}">${p}</a>`)}`,
      ),
    );
  }
  if (profile.email) {
    rows.push(contactRow("mail", "Email", html`<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="mailto:${profile.email}">${profile.email}</a>`));
  }
  if (profile.linkedin_url) rows.push(contactRow("linkedin", "LinkedIn", external(profile.linkedin_url, display(profile.linkedin_url))));
  if (profile.github_url) rows.push(contactRow("github", "GitHub", external(profile.github_url, display(profile.github_url))));
  links.forEach((l) => rows.push(contactRow(l.icon || "link", l.label, external(l.url, display(l.url)))));
  return html`<ul class="card divide-y divide-line overflow-hidden">${rows}</ul>`;
}
