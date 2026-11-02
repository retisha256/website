import { ApiError } from "../../shared/api";
import { Safe, html, mount, safeUrl } from "../../shared/dom";
import { icon } from "../../shared/icons";
import type { Project } from "../../shared/types";
import { errorState, paragraphs } from "../components";
import { errorMessage, getProject } from "../data";

/** One numbered case-study section. Returns nothing when the content is empty, so
 *  missing information is simply not published until it is provided. */
function section(number: number, title: string, body: Safe | null): Safe {
  if (!body) return html``;
  return html`<section class="card p-6 sm:p-8" aria-labelledby="cs-${number}">
    <div class="flex items-center gap-3">
      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-accent">${number}</span>
      <h2 id="cs-${number}" class="text-xl font-bold">${title}</h2>
    </div>
    <div class="mt-4 space-y-3">${body}</div>
  </section>`;
}

const bullets = (items: string[]): Safe | null =>
  items.length ? html`<ul class="check-list space-y-2.5">${items.map((i) => html`<li>${icon("check")}<span>${i}</span></li>`)}</ul>` : null;

const text = (value: string): Safe | null => (value.trim() ? paragraphs(value) : null);

function caseStudy(p: Project): Safe {
  const sections: [string, Safe | null][] = [
    ["Project or experience overview", text(p.overview)],
    ["Problem or need addressed", text(p.problem)],
    [
      "My role and responsibilities",
      p.role_description.trim() || p.responsibilities.length
        ? html`${p.role_description ? paragraphs(p.role_description) : ""}${bullets(p.responsibilities) || ""}`
        : null,
    ],
    ["Work completed", bullets(p.work_completed)],
    [
      "Tools and technologies used",
      p.technologies.length ? html`<ul class="flex flex-wrap gap-2">${p.technologies.map((t) => html`<li class="chip">${t}</li>`)}</ul>` : null,
    ],
    ["Challenges and lessons learned", text(p.challenges_lessons)],
    [
      "Verified outcomes",
      p.outcomes.length
        ? html`${bullets(p.outcomes)}${p.outcomes_evidence ? html`<p class="text-sm text-muted"><span class="font-semibold text-ink">Evidence:</span> ${p.outcomes_evidence}</p>` : ""}`
        : null,
    ],
  ];
  let n = 0;
  return html`${sections.map(([title, body]) => (body ? section(++n, title, body) : html``))}`;
}

function render(p: Project): Safe {
  const meta = [p.organization, p.period, p.role_title].filter(Boolean);
  return html`<section class="border-b border-line bg-white">
      <div class="wrap py-10 sm:py-14">
        <a href="/portfolio/" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">${icon("arrowLeft", "h-4 w-4")} All projects</a>
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span class="chip-soft">${p.category_label}</span>
          ${p.tags.map((t) => html`<span class="chip">${t}</span>`)}
        </div>
        <h1 class="mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">${p.title}</h1>
        <p class="lead mt-4 max-w-2xl">${p.summary}</p>
        ${meta.length ? html`<p class="mt-4 text-sm font-medium text-muted">${meta.join(" · ")}</p>` : ""}
        <div class="mt-6 flex flex-wrap gap-3">
          ${p.live_url ? html`<a class="btn-primary" href="${safeUrl(p.live_url)}" target="_blank" rel="noopener noreferrer">${icon("external", "h-4 w-4")} View live project<span class="sr-only"> (opens in a new tab)</span></a>` : ""}
          ${p.source_url ? html`<a class="btn-secondary" href="${safeUrl(p.source_url)}" target="_blank" rel="noopener noreferrer">${icon("github", "h-4 w-4")} Source code<span class="sr-only"> (opens in a new tab)</span></a>` : ""}
        </div>
      </div>
    </section>
    <section class="wrap section pt-10">
      <div class="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div class="space-y-6">${caseStudy(p)}</div>
        <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
          ${p.thumbnail ? html`<img src="${p.thumbnail}" alt="${p.thumbnail_alt || p.title}" class="w-full rounded-2xl border border-line object-cover shadow-card" loading="lazy" decoding="async">` : ""}
          <div class="card p-5">
            <p class="text-sm font-semibold">Interested in working together?</p>
            <p class="mt-1 text-sm text-muted">Let’s talk about how I can support you.</p>
            <a href="/contact/" class="btn-primary mt-4 w-full">Get in touch</a>
          </div>
        </aside>
      </div>
      ${p.images.length
        ? html`<div class="mt-10"><h2 class="text-xl font-bold">Gallery</h2>
            <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              ${p.images.map((img) => html`<li><figure>
                <img src="${img.image}" alt="${img.alt_text || p.title}" class="aspect-[16/10] w-full rounded-xl border border-line object-cover" loading="lazy" decoding="async">
                ${img.caption ? html`<figcaption class="mt-2 text-xs text-muted">${img.caption}</figcaption>` : ""}
              </figure></li>`)}
            </ul></div>`
        : ""}
    </section>`;
}

export async function renderProject(root: HTMLElement): Promise<void> {
  const slug = root.dataset.slug || "";
  try {
    mount(root, render(await getProject(slug)));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      mount(root, html`<section class="wrap section text-center"><h1 class="text-3xl font-bold">Project not found</h1>
        <p class="lead mt-3">It may have been unpublished.</p><a href="/portfolio/" class="btn-primary mt-6">Back to portfolio</a></section>`);
      return;
    }
    mount(root, html`<section class="wrap section">${errorState(errorMessage(error))}</section>`);
    root.querySelector("[data-retry]")?.addEventListener("click", () => void renderProject(root));
  }
}
