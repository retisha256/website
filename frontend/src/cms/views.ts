import { ApiError, api } from "../shared/api";
import { Safe, debounce, html, mount } from "../shared/dom";
import { icon } from "../shared/icons";
import { MODULES, Module, Field, moduleByKey } from "./schema";
import { SelectOptions, badge, confirmDialog, enhanceForm, readForm, relativeTime, renderField, toast } from "./ui";

type Row = Record<string, unknown> & { id: number; is_published?: boolean };
interface Page<T> { count: number; results: T[] }

const ADMIN = "/api/admin";

export const url = (m: Module, id?: number | string): string =>
  m.kind === "single" ? `${ADMIN}/${m.endpoint}/` : `${ADMIN}/${m.endpoint}/${id !== undefined ? id + "/" : ""}`;

async function loadSelectOptions(): Promise<SelectOptions> {
  const cats = await api.get<Page<Row>>(`${ADMIN}/skill-categories/?page_size=200`);
  return { skillCategories: cats.results.map((c) => [String(c.id), String(c.name)] as [string, string]) };
}

function pageHeader(title: string, subtitle = "", action: Safe | string = ""): Safe {
  return html`<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div><h1 id="page-title" tabindex="-1" class="text-2xl font-bold">${title}</h1>
    ${subtitle ? html`<p class="mt-1 text-sm text-muted">${subtitle}</p>` : ""}</div>
    ${action}
  </div>`;
}

function errorBox(error: unknown, retryable = true): Safe {
  const message = error instanceof ApiError ? error.message : "Something went wrong.";
  return html`<div class="card p-6 text-center" role="alert"><p class="font-semibold text-red-800">${message}</p>
    ${retryable ? html`<button class="btn btn-dark mt-4" data-retry>Try again</button>` : ""}</div>`;
}

/* ================= dashboard ================= */

interface Dashboard {
  counts: Record<string, { label: string; total: number; published: number; drafts: number }>;
  recent: { module: string; type: string; id: number; title: string; published: boolean; updated_at: string }[];
  checks: { ok: boolean; text: string; module: string }[];
  projects_without_outcomes: string[];
  maintenance_mode: boolean;
}

export async function dashboardView(root: HTMLElement): Promise<void> {
  mount(root, html`${pageHeader("Dashboard", "A quick look at what’s live on your website.")}<div class="skeleton h-40"></div>`);
  const draw = async (): Promise<void> => {
    try {
      const d = await api.get<Dashboard>(`${ADMIN}/dashboard/`);
      const stat = (key: string, label: string) => html`<a href="#/${key}" class="card card-hover block p-5">
        <p class="text-sm font-medium text-muted">${label}</p>
        <p class="mt-1 text-3xl font-bold">${d.counts[key].published}<span class="ml-1 text-sm font-medium text-muted">published</span></p>
        <p class="mt-1 text-xs text-muted">${d.counts[key].drafts} draft${d.counts[key].drafts === 1 ? "" : "s"} · ${d.counts[key].total} total</p>
      </a>`;
      const todo = d.checks.filter((c) => !c.ok);
      mount(
        root,
        html`${pageHeader("Dashboard", "A quick look at what’s live on your website.")}
        ${d.maintenance_mode ? html`<div class="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="status"><strong>Maintenance mode is on.</strong> Visitors currently see a “back soon” page. <a class="underline" href="#/settings">Turn it off</a></div>` : ""}
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          ${stat("projects", "Projects")}${stat("services", "Services")}${stat("skills", "Skills")}${stat("testimonials", "Testimonials")}
        </div>
        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <section class="card p-5 lg:col-span-2" aria-labelledby="recent-h">
            <h2 id="recent-h" class="text-base font-semibold">Recent edits</h2>
            ${d.recent.length
              ? html`<ul class="mt-3 divide-y divide-line">${d.recent.map((r) => html`<li class="flex items-center justify-between gap-3 py-3">
                  <div class="min-w-0"><a class="block truncate text-sm font-semibold hover:underline" href="#/${r.module}/${r.id}">${r.title}</a>
                  <p class="text-xs text-muted">${r.type} · ${relativeTime(r.updated_at)}</p></div>${badge(r.published)}</li>`)}</ul>`
              : html`<p class="mt-3 text-sm text-muted">Nothing edited yet.</p>`}
          </section>
          <section class="card p-5" aria-labelledby="quick-h">
            <h2 id="quick-h" class="text-base font-semibold">Quick add</h2>
            <div class="mt-3 grid gap-2">
              ${[["projects", "New project"], ["services", "New service"], ["skills", "New skill"], ["experience", "New role"], ["education", "New qualification"], ["testimonials", "New testimonial"]].map(
                ([k, t]) => html`<a class="btn btn-secondary justify-start" href="#/${k}/new">${icon("plus", "h-4 w-4")} ${t}</a>`)}
            </div>
          </section>
        </div>
        <section class="card mt-6 p-5" aria-labelledby="health-h">
          <h2 id="health-h" class="text-base font-semibold">Content checklist</h2>
          <p class="mt-1 text-sm text-muted">${todo.length ? `${todo.length} thing${todo.length === 1 ? "" : "s"} could use attention.` : "Everything looks complete."}</p>
          <ul class="mt-3 grid gap-2 sm:grid-cols-2">
            ${d.checks.map((c) => html`<li class="flex items-center gap-2.5 text-sm">
              <span class="${c.ok ? "text-emerald-600" : "text-amber-600"}">${icon(c.ok ? "check" : "alert", "h-4 w-4")}</span>
              ${c.ok ? c.text : html`<a class="underline" href="#/${c.module}">${c.text}</a>`}</li>`)}
          </ul>
          ${d.projects_without_outcomes.length ? html`<p class="mt-4 text-xs text-muted">No verified outcomes are published for: ${d.projects_without_outcomes.join(", ")}. That’s fine. Only add outcomes you can prove.</p>` : ""}
        </section>`,
      );
    } catch (error) {
      mount(root, html`${pageHeader("Dashboard")}${errorBox(error)}`);
      root.querySelector("[data-retry]")?.addEventListener("click", () => void draw());
    }
  };
  await draw();
}

/* ================= list ================= */

export async function listView(root: HTMLElement, m: Module): Promise<void> {
  const state = { q: "", filters: {} as Record<string, string>, status: "" };
  const options = await loadSelectOptions().catch(() => ({}) as SelectOptions);

  mount(
    root,
    html`${pageHeader(m.label, "", html`<a class="btn btn-primary" href="#/${m.key}/new">${icon("plus", "h-4 w-4")} Add ${m.singular}</a>`)}
    <form class="mb-5 flex flex-wrap items-end gap-3" role="search">
      <div class="min-w-[12rem] flex-1"><label for="q" class="mb-1 block text-xs font-semibold text-muted">Search</label>
        <input id="q" type="search" class="input" placeholder="Search ${m.label.toLowerCase()}…"></div>
      ${m.publishable ? html`<div><label for="status" class="mb-1 block text-xs font-semibold text-muted">Status</label>
        <select id="status" class="input"><option value="">All</option><option value="true">Published</option><option value="false">Drafts</option></select></div>` : ""}
      ${(m.filters || []).map((f) => {
        const opts = Array.isArray(f.options) ? f.options : options[String(f.options)] || [];
        return html`<div><label for="flt-${f.name}" class="mb-1 block text-xs font-semibold text-muted">${f.label}</label>
          <select id="flt-${f.name}" data-filter="${f.name}" class="input"><option value="">All</option>${opts.map(([v, t]) => html`<option value="${v}">${t}</option>`)}</select></div>`;
      })}
    </form>
    <div id="list-body" aria-live="polite"><div class="skeleton h-48"></div></div>`,
  );

  const body = root.querySelector("#list-body") as HTMLElement;
  const filtered = (): boolean => Boolean(state.q || state.status || Object.values(state.filters).some(Boolean));

  const load = async (): Promise<void> => {
    const params = new URLSearchParams({ page_size: "200" });
    if (state.q) params.set("search", state.q);
    if (state.status) params.set("is_published", state.status);
    Object.entries(state.filters).forEach(([k, v]) => v && params.set(k, v));
    try {
      const data = await api.get<Page<Row>>(`${url(m)}?${params}`);
      draw(data.results);
    } catch (error) {
      mount(body, errorBox(error));
      body.querySelector("[data-retry]")?.addEventListener("click", () => void load());
    }
  };

  const draw = (rows: Row[]): void => {
    if (!rows.length) {
      mount(body, html`<div class="card border-dashed p-10 text-center"><p class="text-sm text-muted">${filtered() ? "Nothing matches your search." : m.emptyText}</p>
        ${filtered() ? "" : html`<a class="btn btn-primary mt-4" href="#/${m.key}/new">Add ${m.singular}</a>`}</div>`);
      return;
    }
    const canReorder = m.reorderable && !filtered();
    mount(
      body,
      html`<ul class="card divide-y divide-line overflow-hidden">
        ${rows.map((r, i) => html`<li class="flex flex-wrap items-center gap-3 p-3 sm:p-4" data-id="${r.id}">
          ${m.imageField ? (r[m.imageField] ? html`<img src="${String(r[m.imageField])}" alt="" class="h-12 w-12 rounded-lg border border-line object-cover">` : html`<span class="flex h-12 w-12 items-center justify-center rounded-lg bg-mist text-muted">${icon("image")}</span>`) : ""}
          <div class="min-w-0 flex-1">
            <a class="block truncate text-sm font-semibold hover:underline" href="#/${m.key}/${r.id}">${String(r[m.titleField] ?? "")}</a>
            <p class="truncate text-xs text-muted">${m.subtitleField ? String(r[m.subtitleField] ?? "") : ""}${m.badge ? ` · ${m.badge(r)}` : ""}${r.is_featured ? " · ★ Featured" : ""}</p>
          </div>
          ${m.publishable ? badge(Boolean(r.is_published)) : ""}
          <div class="flex items-center gap-1">
            ${canReorder ? html`<button class="icon-btn" data-move="-1" ${i === 0 ? "disabled" : ""} aria-label="Move ${String(r[m.titleField])} up">${icon("arrowUp", "h-4 w-4")}</button>
              <button class="icon-btn" data-move="1" ${i === rows.length - 1 ? "disabled" : ""} aria-label="Move ${String(r[m.titleField])} down">${icon("arrowDown", "h-4 w-4")}</button>` : ""}
            ${m.publishable ? html`<button class="icon-btn" data-toggle aria-label="${r.is_published ? "Unpublish" : "Publish"} ${String(r[m.titleField])}" title="${r.is_published ? "Unpublish" : "Publish"}">${icon(r.is_published ? "eyeOff" : "eye", "h-4 w-4")}</button>` : ""}
            <a class="icon-btn" href="#/${m.key}/${r.id}" aria-label="Edit ${String(r[m.titleField])}" title="Edit">${icon("edit", "h-4 w-4")}</a>
            <button class="icon-btn text-red-700" data-delete aria-label="Delete ${String(r[m.titleField])}" title="Delete">${icon("trash", "h-4 w-4")}</button>
          </div></li>`)}
      </ul>
      <p class="mt-3 text-xs text-muted">${rows.length} item${rows.length === 1 ? "" : "s"}.${m.reorderable && filtered() ? " Clear the filters to reorder." : ""}</p>`,
    );

    body.querySelectorAll<HTMLLIElement>("li[data-id]").forEach((li, index) => {
      const id = Number(li.dataset.id);
      const row = rows[index];
      li.querySelector("[data-toggle]")?.addEventListener("click", async () => {
        try {
          await api.post(`${url(m, id)}${row.is_published ? "unpublish" : "publish"}/`);
          toast(row.is_published ? "Unpublished. It’s hidden from the website." : "Published. It’s now live.");
          void load();
        } catch (e) { toast(e instanceof ApiError ? e.message : "Could not update.", "error"); }
      });
      li.querySelector("[data-delete]")?.addEventListener("click", async () => {
        if (!(await confirmDialog(`Delete “${String(row[m.titleField])}”?`, "This permanently removes it and cannot be undone. If you only want to hide it, unpublish it instead."))) return;
        try { await api.delete(url(m, id)); toast("Deleted."); void load(); }
        catch (e) { toast(e instanceof ApiError ? e.message : "Could not delete.", "error"); }
      });
      li.querySelectorAll<HTMLButtonElement>("[data-move]").forEach((btn) =>
        btn.addEventListener("click", async () => {
          const to = index + Number(btn.dataset.move);
          const ids = rows.map((r) => r.id);
          [ids[index], ids[to]] = [ids[to], ids[index]];
          try { await api.post(`${url(m)}reorder/`, { order: ids }); void load(); }
          catch (e) { toast(e instanceof ApiError ? e.message : "Could not reorder.", "error"); }
        }),
      );
    });
  };

  root.querySelector("form[role=search]")!.addEventListener("submit", (e) => e.preventDefault());
  (root.querySelector("#q") as HTMLInputElement).addEventListener("input", debounce((e) => { state.q = (e.target as HTMLInputElement).value.trim(); void load(); }, 250) as (e: Event) => void);
  root.querySelector("#status")?.addEventListener("change", (e) => { state.status = (e.target as HTMLSelectElement).value; void load(); });
  root.querySelectorAll<HTMLSelectElement>("[data-filter]").forEach((s) => s.addEventListener("change", () => { state.filters[s.dataset.filter!] = s.value; void load(); }));
  await load();
}

/* ================= form (create / edit / single) ================= */

export async function formView(root: HTMLElement, m: Module, id: string | null): Promise<void> {
  const isNew = id === "new";
  const single = m.kind === "single";
  mount(root, html`${pageHeader(single ? m.label : isNew ? `New ${m.singular}` : `Edit ${m.singular}`)}<div class="skeleton h-64"></div>`);

  let record: Row | null = null;
  let options: SelectOptions = {};
  try {
    [record, options] = await Promise.all([
      isNew ? Promise.resolve(null) : api.get<Row>(url(m, single ? undefined : id!)),
      loadSelectOptions(),
    ]);
  } catch (error) {
    mount(root, html`${pageHeader(m.label)}${errorBox(error, false)}<p class="mt-4"><a class="underline" href="#/${single ? "" : m.key}">Go back</a></p>`);
    return;
  }

  const allFields: Field[] = m.sections.flatMap((s) => s.fields);
  const defaults: Record<string, unknown> = isNew ? { is_published: true, status: "completed", kind: "certification", category: m.key === "projects" ? "other" : m.key === "services" ? "other" : "" } : {};
  let current: Row | Record<string, unknown> = record ?? defaults;
  let errors: Record<string, string[]> = {};
  let summary = "";

  const draw = (): void => {
    const title = single ? m.label : isNew ? `New ${m.singular}` : String(current[m.titleField] || `Edit ${m.singular}`);
    const published = Boolean(current.is_published);
    mount(
      root,
      html`<nav aria-label="Breadcrumb" class="mb-3 text-sm">${single ? "" : html`<a class="inline-flex items-center gap-1 text-muted hover:text-ink" href="#/${m.key}">${icon("arrowLeft", "h-4 w-4")} ${m.label}</a>`}</nav>
      ${pageHeader(title, "", !single && !isNew && m.publishable ? badge(published) : "")}
      <form id="record-form" novalidate class="space-y-6">
        ${summary ? html`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert" tabindex="-1" id="form-summary"><strong>${summary}</strong>
          ${Object.keys(errors).length ? html`<ul class="mt-1 list-disc pl-5">${Object.entries(errors).map(([f, e]) => html`<li>${allFields.find((x) => x.name === f)?.label || f}: ${e.join(" ")}</li>`)}</ul>` : ""}</div>` : ""}
        ${m.sections.map((s) => html`<fieldset class="card p-5 sm:p-6">
          <legend class="sr-only">${s.title}</legend>
          <h2 class="text-base font-semibold">${s.title}</h2>
          ${s.description ? html`<p class="mt-1 text-sm text-muted">${s.description}</p>` : ""}
          <div class="mt-5 grid gap-5 md:grid-cols-2">${s.fields.map((f) => renderField(f, current[f.name], errors, options))}</div>
        </fieldset>`)}
        ${m.gallery && !isNew ? html`<section class="card p-5 sm:p-6" id="gallery" aria-labelledby="gal-h"></section>` : ""}
        ${m.gallery && isNew ? html`<p class="text-sm text-muted">Save the project first, then you can add gallery images.</p>` : ""}
        <div class="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          <div class="flex flex-wrap gap-3">
            <button type="submit" class="btn btn-primary" id="save-btn">Save${single ? " changes" : ""}</button>
            ${!single ? html`<a class="btn btn-secondary" href="#/${m.key}">Cancel</a>` : ""}
          </div>
          <div class="flex flex-wrap gap-3">
            ${!single && !isNew && m.publishable ? html`<button type="button" class="btn btn-secondary" id="toggle-pub">${icon(published ? "eyeOff" : "eye", "h-4 w-4")} ${published ? "Unpublish" : "Publish"}</button>` : ""}
            ${!single && !isNew ? html`<button type="button" class="btn btn-danger-outline" id="delete-btn">${icon("trash", "h-4 w-4")} Delete</button>` : ""}
          </div>
        </div>
      </form>`,
    );
    const form = root.querySelector("#record-form") as HTMLFormElement;
    enhanceForm(form);
    form.addEventListener("submit", (e) => { e.preventDefault(); void save(form); });
    root.querySelector("#toggle-pub")?.addEventListener("click", async () => {
      try {
        current = await api.post<Row>(`${url(m, id!)}${published ? "unpublish" : "publish"}/`);
        toast(published ? "Unpublished." : "Published. It’s now live.");
        draw();
      } catch (err) { toast(err instanceof ApiError ? err.message : "Could not update.", "error"); }
    });
    root.querySelector("#delete-btn")?.addEventListener("click", async () => {
      if (!(await confirmDialog(`Delete “${String(current[m.titleField])}”?`, "This permanently removes it and cannot be undone."))) return;
      try { await api.delete(url(m, id!)); toast("Deleted."); location.hash = `#/${m.key}`; }
      catch (err) { toast(err instanceof ApiError ? err.message : "Could not delete.", "error"); }
    });
    if (m.gallery && !isNew) void galleryPanel(root.querySelector("#gallery") as HTMLElement, Number(id));
    if (summary) (root.querySelector("#form-summary") as HTMLElement | null)?.focus();
  };

  const save = async (form: HTMLFormElement): Promise<void> => {
    const button = form.querySelector("#save-btn") as HTMLButtonElement;
    button.disabled = true;
    button.textContent = "Saving…";
    const { json, files } = readForm(form, allFields);
    try {
      let saved: Row;
      if (single || !isNew) saved = await api.patch<Row>(url(m, single ? undefined : id!), json);
      else saved = await api.post<Row>(url(m), json);
      if (Object.keys(files).length) {
        const data = new FormData();
        Object.entries(files).forEach(([k, f]) => data.append(k, f));
        saved = await api.patch<Row>(url(m, single ? undefined : saved.id), data);
      }
      current = saved; errors = {}; summary = "";
      toast("Saved.");
      location.hash = single ? "#/" : `#/${m.key}`;
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) { errors = error.errors; summary = error.message; }
      else { errors = {}; summary = error instanceof ApiError ? error.message : "Could not save. Please try again."; }
      current = { ...current, ...json };
      draw();
      root.querySelector<HTMLElement>('[aria-invalid="true"]')?.scrollIntoView({ block: "center" });
    }
  };

  draw();
}

/* ================= project gallery ================= */

interface GalleryImage { id: number; image: string; alt_text: string; caption: string }

async function galleryPanel(host: HTMLElement, projectId: number): Promise<void> {
  const draw = async (): Promise<void> => {
    let images: GalleryImage[] = [];
    try { images = (await api.get<Page<GalleryImage>>(`${ADMIN}/project-images/?project=${projectId}&page_size=200`)).results; }
    catch (e) { mount(host, errorBox(e, false)); return; }
    mount(
      host,
      html`<h2 id="gal-h" class="text-base font-semibold">Gallery images</h2>
      <p class="mt-1 text-sm text-muted">Add screenshots or photos. Describe each one so it is accessible.</p>
      ${images.length ? html`<ul class="mt-4 grid gap-4 sm:grid-cols-2">${images.map((img) => html`<li class="rounded-xl border border-line p-3" data-img="${img.id}">
        <img src="${img.image}" alt="" class="aspect-video w-full rounded-lg object-cover">
        <label class="mt-3 block text-xs font-semibold" for="alt-${img.id}">Description (alt text)</label>
        <input id="alt-${img.id}" class="input mt-1" value="${img.alt_text}" data-field="alt_text">
        <label class="mt-2 block text-xs font-semibold" for="cap-${img.id}">Caption</label>
        <input id="cap-${img.id}" class="input mt-1" value="${img.caption}" data-field="caption">
        <div class="mt-3 flex justify-between"><button type="button" class="btn btn-secondary !py-1.5" data-save>Save</button>
        <button type="button" class="btn btn-danger-outline !py-1.5" data-del>Remove</button></div></li>`)}</ul>` : ""}
      <div class="mt-4"><label for="gal-upload" class="mb-1.5 block text-sm font-semibold">Add images</label>
      <input id="gal-upload" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" class="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"></div>`,
    );
    host.querySelector<HTMLInputElement>("#gal-upload")!.addEventListener("change", async (e) => {
      const input = e.target as HTMLInputElement;
      for (const file of Array.from(input.files || [])) {
        const data = new FormData();
        data.append("project", String(projectId));
        data.append("image", file);
        data.append("display_order", String(images.length));
        try { await api.post(`${ADMIN}/project-images/`, data); toast(`Added ${file.name}`); }
        catch (err) { toast(err instanceof ApiError ? `${file.name}: ${Object.values(err.errors).flat().join(" ") || err.message}` : "Upload failed.", "error"); }
      }
      void draw();
    });
    host.querySelectorAll<HTMLLIElement>("li[data-img]").forEach((li) => {
      const id = li.dataset.img;
      li.querySelector("[data-save]")?.addEventListener("click", async () => {
        const body: Record<string, string> = {};
        li.querySelectorAll<HTMLInputElement>("input[data-field]").forEach((i) => (body[i.dataset.field!] = i.value));
        try { await api.patch(`${ADMIN}/project-images/${id}/`, body); toast("Saved."); } catch { toast("Could not save.", "error"); }
      });
      li.querySelector("[data-del]")?.addEventListener("click", async () => {
        if (!(await confirmDialog("Remove this image?", "It will be deleted from the gallery.", "Remove"))) return;
        try { await api.delete(`${ADMIN}/project-images/${id}/`); void draw(); } catch { toast("Could not remove.", "error"); }
      });
    });
  };
  await draw();
}

/* ================= password ================= */

export function passwordView(root: HTMLElement): void {
  mount(
    root,
    html`${pageHeader("Change password", "Use a long, unique password.")}
    <form id="pw" class="card max-w-md space-y-4 p-6" novalidate>
      <div><label class="mb-1.5 block text-sm font-semibold" for="cp">Current password</label><input id="cp" type="password" autocomplete="current-password" class="input"></div>
      <div><label class="mb-1.5 block text-sm font-semibold" for="np">New password</label><input id="np" type="password" autocomplete="new-password" class="input"><p class="mt-1 text-xs text-muted">At least 10 characters; not a common or all-numeric password.</p></div>
      <p id="pw-err" class="text-sm font-medium text-red-700" role="alert"></p>
      <button class="btn btn-primary">Update password</button>
    </form>`,
  );
  root.querySelector("#pw")!.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = root.querySelector("#pw-err") as HTMLElement;
    err.textContent = "";
    try {
      await api.post("/api/auth/password/", {
        current_password: (root.querySelector("#cp") as HTMLInputElement).value,
        new_password: (root.querySelector("#np") as HTMLInputElement).value,
      });
      toast("Password updated.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      err.textContent = error instanceof ApiError ? Object.values(error.errors).flat().join(" ") || error.message : "Could not update.";
    }
  });
}

export { MODULES, moduleByKey };
