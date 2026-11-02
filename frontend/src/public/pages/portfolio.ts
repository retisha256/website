import { debounce, html, mount } from "../../shared/dom";
import { icon } from "../../shared/icons";
import type { ProjectFacets } from "../../shared/types";
import { emptyState, errorState, pageHero, projectCard, skeletonCards } from "../components";
import { errorMessage, getFacets, searchProjects } from "../data";

interface Filters {
  q: string;
  category: string;
  tag: string;
}

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return { q: params.get("q") || "", category: params.get("category") || "", tag: params.get("tag") || "" };
}

function writeFilters(filters: Filters): void {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  const query = params.toString();
  history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
}

export async function renderPortfolio(root: HTMLElement): Promise<void> {
  const filters = readFilters();
  mount(
    root,
    html`${pageHero(
        "Portfolio & case studies",
        "Projects and experience",
        "Each case study covers the need, my role, the work completed, the tools used and what I learned. Technical projects are included as supporting evidence of my problem-solving and digital systems knowledge.",
      )}
      <section class="wrap section pt-10">
        <div id="portfolio-filters" class="space-y-4"></div>
        <p id="portfolio-count" class="mt-6 text-sm text-muted" role="status" aria-live="polite"></p>
        <div id="portfolio-results" class="mt-4">${skeletonCards(3)}</div>
      </section>`,
  );

  const filtersEl = root.querySelector("#portfolio-filters") as HTMLElement;
  const resultsEl = root.querySelector("#portfolio-results") as HTMLElement;
  const countEl = root.querySelector("#portfolio-count") as HTMLElement;

  let facets: ProjectFacets = { categories: [], tags: [] };
  try {
    facets = await getFacets();
  } catch {
    /* filters are optional; the list below shows its own error if the API is down */
  }

  const drawFilters = (): void => {
    mount(
      filtersEl,
      html`<div class="relative max-w-xl">
          <label for="project-search" class="sr-only">Search projects</label>
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">${icon("search", "h-4 w-4")}</span>
          <input id="project-search" type="search" class="input !pl-10" placeholder="Search by title, technology or tag…" value="${filters.q}" autocomplete="off">
        </div>
        ${facets.categories.length
          ? html`<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button type="button" class="filter-pill" data-category="" aria-pressed="${filters.category === ""}">All</button>
              ${facets.categories.map((c) => html`<button type="button" class="filter-pill" data-category="${c.value}" aria-pressed="${filters.category === c.value}">${c.label} <span class="text-xs opacity-60">${c.count}</span></button>`)}
            </div>`
          : ""}
        ${facets.tags.length
          ? html`<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tags</span>
              ${facets.tags.map((t) => html`<button type="button" class="filter-pill !py-1 !text-xs" data-tag="${t.slug}" aria-pressed="${filters.tag === t.slug}">${t.name}</button>`)}
            </div>`
          : ""}`,
    );
    const input = filtersEl.querySelector("#project-search") as HTMLInputElement;
    input.addEventListener("input", debounce(() => { filters.q = input.value.trim(); apply(false); }, 250));
    filtersEl.querySelectorAll<HTMLButtonElement>("[data-category]").forEach((btn) =>
      btn.addEventListener("click", () => { filters.category = btn.dataset.category || ""; apply(true); }),
    );
    filtersEl.querySelectorAll<HTMLButtonElement>("[data-tag]").forEach((btn) =>
      btn.addEventListener("click", () => {
        filters.tag = filters.tag === btn.dataset.tag ? "" : btn.dataset.tag || "";
        apply(true);
      }),
    );
  };

  let requestId = 0;
  const load = async (): Promise<void> => {
    const current = ++requestId;
    const query = new URLSearchParams();
    if (filters.q) query.set("search", filters.q);
    if (filters.category) query.set("category", filters.category);
    if (filters.tag) query.set("tag", filters.tag);
    try {
      const projects = await searchProjects(query);
      if (current !== requestId) return; // a newer search superseded this one
      const filtered = Boolean(filters.q || filters.category || filters.tag);
      countEl.textContent = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;
      mount(
        resultsEl,
        projects.length
          ? html`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${projects.map(projectCard)}</div>`
          : emptyState(
              filtered ? "No projects match these filters" : "No projects published yet",
              filtered ? "Try a different search term or clear the filters." : "Case studies will appear here once they are published.",
            ),
      );
    } catch (error) {
      if (current !== requestId) return;
      countEl.textContent = "";
      mount(resultsEl, errorState(errorMessage(error)));
      resultsEl.querySelector("[data-retry]")?.addEventListener("click", () => void load());
    }
  };

  function apply(redrawFilters: boolean): void {
    writeFilters(filters);
    if (redrawFilters) drawFilters();
    void load();
  }

  drawFilters();
  await load();
}
