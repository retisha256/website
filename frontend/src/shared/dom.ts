/**
 * Tiny safe-by-default templating.
 *
 * `html` escapes every interpolated value unless it is already a `Safe`
 * fragment (the result of another `html` call, or `raw()`), so content coming
 * from the API can never inject markup.
 */
export class Safe {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

export const raw = (value: string): Safe => new Safe(value);

type Interpolation = Safe | string | number | boolean | null | undefined | Interpolation[];

function render(value: Interpolation): string {
  if (value instanceof Safe) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  if (value === null || value === undefined || value === false) return "";
  return esc(value);
}

export function html(strings: TemplateStringsArray, ...values: Interpolation[]): Safe {
  let out = strings[0];
  values.forEach((value, i) => {
    out += render(value) + strings[i + 1];
  });
  return new Safe(out);
}

export function mount(target: Element, content: Safe): void {
  target.innerHTML = content.value;
}

export function qs<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

export function qsa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Only allow http(s)/mailto/tel URLs in href attributes. */
export function safeUrl(url: string | null | undefined): string {
  if (!url) return "#";
  return /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : "#";
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): (...args: A) => void {
  let timer: number | undefined;
  return (...args: A) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), ms);
  };
}

/** "2026-08-01" -> "Aug 2026" (month precision, timezone-safe). */
export function monthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  const [year, month] = iso.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[(month || 1) - 1]} ${year}`;
}

export function telHref(phone: string): string {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}
