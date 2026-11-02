import { Safe, html, raw } from "../shared/dom";
import { icon } from "../shared/icons";
import type { Field } from "./schema";
import { ICON_OPTIONS } from "./schema";

/* ---------- toasts ---------- */

export function toast(message: string, kind: "success" | "error" = "success"): void {
  const host = document.getElementById("toasts");
  if (!host) return;
  const el = document.createElement("div");
  el.className =
    "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lift " +
    (kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900");
  el.textContent = message;
  host.appendChild(el);
  window.setTimeout(() => el.remove(), kind === "error" ? 7000 : 3500);
}

/* ---------- confirm dialog ---------- */

export function confirmDialog(title: string, text: string, confirmLabel = "Delete"): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "w-[min(92vw,26rem)] rounded-2xl p-0 shadow-lift backdrop:bg-ink/50";
    dialog.setAttribute("aria-labelledby", "dlg-title");
    dialog.innerHTML = html`<form method="dialog" class="p-6">
      <h2 id="dlg-title" class="text-lg font-bold">${title}</h2>
      <p class="mt-2 text-sm text-muted">${text}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button value="cancel" class="btn btn-secondary" autofocus>Cancel</button>
        <button value="ok" class="btn btn-danger">${confirmLabel}</button>
      </div>
    </form>`.value;
    dialog.addEventListener("close", () => {
      resolve(dialog.returnValue === "ok");
      dialog.remove();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  });
}

/* ---------- form fields ---------- */

type Errors = Record<string, string[]>;
export type SelectOptions = Record<string, [string, string][]>;

function fieldWrap(field: Field, control: Safe, errors: Errors, inline = false): Safe {
  const errs = errors[field.name] || [];
  const id = `f-${field.name}`;
  const describedBy = [field.help ? `${id}-help` : "", errs.length ? `${id}-err` : ""].filter(Boolean).join(" ");
  void describedBy;
  return html`<div class="${inline ? "" : "md:col-span-1"}" data-field="${field.name}">
    ${control}
    ${field.help ? html`<p id="${id}-help" class="mt-1.5 text-xs text-muted">${field.help}</p>` : ""}
    ${errs.length ? html`<p id="${id}-err" class="mt-1.5 text-sm font-medium text-red-700" role="alert">${errs.join(" ")}</p>` : ""}
  </div>`;
}

const label = (field: Field): Safe =>
  html`<label for="f-${field.name}" class="mb-1.5 block text-sm font-semibold">${field.label}${field.required ? html`<span class="text-red-700" aria-hidden="true"> *</span><span class="sr-only"> (required)</span>` : ""}</label>`;

function describe(field: Field, errors: Errors): string {
  const id = `f-${field.name}`;
  return [field.help ? `${id}-help` : "", errors[field.name]?.length ? `${id}-err` : ""].filter(Boolean).join(" ");
}

export function renderField(field: Field, value: unknown, errors: Errors, options: SelectOptions): Safe {
  const id = `f-${field.name}`;
  const invalid = errors[field.name]?.length ? "true" : "false";
  const common = `id="${id}" name="${field.name}" aria-invalid="${invalid}" aria-describedby="${describe(field, errors)}"`;
  const wide = field.type === "textarea" || field.type === "list" || field.type === "image" || field.type === "file";
  let control: Safe;

  switch (field.type) {
    case "textarea":
      control = html`${label(field)}<textarea ${raw(common)} rows="${field.rows || 4}" class="input" ${field.max ? raw(`maxlength="${field.max}"`) : ""}>${String(value ?? "")}</textarea>`;
      break;
    case "list":
      control = html`${label(field)}<textarea ${raw(common)} rows="${field.rows || 5}" class="input" placeholder="One item per line">${(Array.isArray(value) ? value : []).join("\n")}</textarea>`;
      break;
    case "tags":
      control = html`${label(field)}<input ${raw(common)} type="text" class="input" value="${(Array.isArray(value) ? value : []).join(", ")}">`;
      break;
    case "select": {
      const opts = Array.isArray(field.options) ? field.options : options[String(field.options)] || [];
      control = html`${label(field)}<select ${raw(common)} class="input">
        ${field.required ? "" : html`<option value="">—</option>`}
        ${opts.map(([v, text]) => html`<option value="${v}" ${String(value ?? "") === v ? raw("selected") : ""}>${text}</option>`)}
      </select>`;
      break;
    }
    case "icon":
      control = html`${label(field)}<div class="flex items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-accent" data-icon-preview>${icon(String(value || "sparkle"))}</span>
        <select ${raw(common)} class="input" data-icon-select>
          ${field.required ? "" : html`<option value="">None</option>`}
          ${ICON_OPTIONS.map(([v, text]) => html`<option value="${v}" ${String(value ?? "") === v ? raw("selected") : ""}>${text}</option>`)}
        </select></div>`;
      break;
    case "bool":
      control = html`<label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3.5">
        <input ${raw(common)} type="checkbox" class="mt-0.5 h-5 w-5 rounded border-line accent-[#0A192F]" ${value ? raw("checked") : ""}>
        <span class="text-sm font-semibold">${field.label}</span></label>`;
      break;
    case "color":
      control = html`${label(field)}<div class="flex items-center gap-3">
        <input ${raw(common)} type="color" class="h-11 w-16 cursor-pointer rounded-lg border border-line bg-white p-1" value="${String(value || "#000000")}">
        <code class="rounded bg-mist px-2 py-1 text-xs" data-color-text>${String(value || "")}</code></div>`;
      break;
    case "image":
    case "file": {
      const url = typeof value === "string" && value ? value : "";
      const isImage = field.type === "image" || /\.(png|jpe?g|webp|gif|ico)$/i.test(url);
      control = html`${label(field)}
        <div class="rounded-xl border border-dashed border-line bg-white p-4" data-file-field="${field.name}">
          <div class="flex flex-wrap items-center gap-4">
            <div data-file-preview class="${url ? "" : "hidden"}">
              ${url && isImage ? html`<img src="${url}" alt="Current ${field.label}" class="h-20 w-20 rounded-lg border border-line object-cover">` : ""}
              ${url && !isImage ? html`<a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold underline">${icon("file", "h-4 w-4")} View current file</a>` : ""}
            </div>
            <div class="min-w-0 flex-1">
              <input ${raw(common)} type="file" ${field.accept ? raw(`accept="${field.accept}"`) : field.type === "image" ? raw('accept="image/jpeg,image/png,image/webp,image/gif"') : ""} class="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white">
              ${url ? html`<label class="mt-2 flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="${field.name}__clear" class="h-4 w-4"> Remove current file</label>` : ""}
            </div>
          </div>
        </div>`;
      break;
    }
    default:
      control = html`${label(field)}<input ${raw(common)} type="${field.type}" class="input" value="${String(value ?? "")}" ${field.max ? raw(`maxlength="${field.max}"`) : ""} ${field.placeholder ? raw(`placeholder="${field.placeholder.replace(/"/g, "")}"`) : ""} ${field.required ? raw("required") : ""}>`;
  }
  return html`<div class="${wide ? "md:col-span-2" : ""}" data-field="${field.name}">
    ${fieldWrap(field, control, errors, true)}
  </div>`;
}

export interface FormValues {
  json: Record<string, unknown>;
  files: Record<string, File>;
}

/** Read the form back into a JSON body plus any newly chosen files. */
export function readForm(form: HTMLFormElement, fields: Field[]): FormValues {
  const json: Record<string, unknown> = {};
  const files: Record<string, File> = {};
  for (const field of fields) {
    const el = form.elements.namedItem(field.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (!el) continue;
    const value = "value" in el ? el.value : "";
    switch (field.type) {
      case "bool":
        json[field.name] = (el as HTMLInputElement).checked;
        break;
      case "number":
        json[field.name] = value === "" ? 0 : Number(value);
        break;
      case "date":
        json[field.name] = value === "" ? null : value;
        break;
      case "list":
        json[field.name] = value.split("\n").map((s) => s.trim()).filter(Boolean);
        break;
      case "tags":
        json[field.name] = value.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "select":
        json[field.name] = field.options === "skillCategories" ? (value ? Number(value) : null) : value;
        break;
      case "image":
      case "file": {
        const input = el as HTMLInputElement;
        if (input.files && input.files[0]) files[field.name] = input.files[0];
        else if ((form.elements.namedItem(`${field.name}__clear`) as HTMLInputElement | null)?.checked) json[field.name] = null;
        break;
      }
      default:
        json[field.name] = value;
    }
  }
  return { json, files };
}

/** Wire the small live behaviours: icon preview, colour text, new-file preview. */
export function enhanceForm(form: HTMLElement): void {
  form.querySelectorAll<HTMLSelectElement>("[data-icon-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const preview = select.parentElement?.querySelector("[data-icon-preview]");
      if (preview) preview.innerHTML = icon(select.value || "sparkle").value;
    });
  });
  form.querySelectorAll<HTMLInputElement>('input[type="color"]').forEach((input) => {
    input.addEventListener("input", () => {
      const code = input.parentElement?.querySelector("[data-color-text]");
      if (code) code.textContent = input.value.toUpperCase();
    });
  });
  form.querySelectorAll<HTMLInputElement>('[data-file-field] input[type="file"]').forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      const box = input.closest("[data-file-field]");
      const preview = box?.querySelector("[data-file-preview]");
      if (!file || !preview) return;
      preview.classList.remove("hidden");
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = "Preview of the selected file";
        img.className = "h-20 w-20 rounded-lg border border-line object-cover";
        preview.replaceChildren(img);
      } else {
        preview.textContent = file.name;
      }
    });
  });
}

export function badge(published: boolean): Safe {
  return published
    ? html`<span class="badge badge-live">Published</span>`
    : html`<span class="badge badge-draft">Draft</span>`;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(iso).toLocaleDateString();
}
