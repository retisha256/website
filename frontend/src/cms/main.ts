import { ApiError, api } from "../shared/api";
import { html, mount } from "../shared/dom";
import { icon } from "../shared/icons";
import { MODULES, moduleByKey } from "./schema";
import { toast } from "./ui";
import { dashboardView, formView, listView, passwordView } from "./views";

interface User { id: number; username: string; name: string }

const app = document.getElementById("cms") as HTMLElement;

/* ---------- login ---------- */

function loginScreen(): void {
  mount(
    app,
    html`<main class="flex min-h-screen items-center justify-center p-4">
      <form id="login" class="card w-full max-w-sm p-7" novalidate>
        <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-bold text-accent">RN</span>
        <h1 class="mt-5 text-2xl font-bold">Sign in to your CMS</h1>
        <p class="mt-1 text-sm text-muted">Manage the content on your portfolio website.</p>
        <div class="mt-6 space-y-4">
          <div><label for="u" class="mb-1.5 block text-sm font-semibold">Username</label>
            <input id="u" class="input" autocomplete="username" autocapitalize="none" required></div>
          <div><label for="p" class="mb-1.5 block text-sm font-semibold">Password</label>
            <input id="p" type="password" class="input" autocomplete="current-password" required></div>
          <p id="login-err" class="min-h-5 text-sm font-medium text-red-700" role="alert"></p>
          <button class="btn btn-primary w-full" id="login-btn">Sign in</button>
        </div>
        <p class="mt-5 text-center text-sm"><a class="text-muted underline" href="/">Back to the website</a></p>
      </form>
    </main>`,
  );
  (document.getElementById("u") as HTMLInputElement).focus();
  document.getElementById("login")!.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = document.getElementById("login-err")!;
    const btn = document.getElementById("login-btn") as HTMLButtonElement;
    err.textContent = "";
    btn.disabled = true;
    try {
      await api.get("/api/auth/csrf/");
      const user = await api.post<User>("/api/auth/login/", {
        username: (document.getElementById("u") as HTMLInputElement).value,
        password: (document.getElementById("p") as HTMLInputElement).value,
      });
      shell(user);
    } catch (error) {
      err.textContent =
        error instanceof ApiError && error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : error instanceof ApiError ? error.message : "Could not sign in.";
      btn.disabled = false;
    }
  });
}

/* ---------- shell + router ---------- */

function navLink(key: string, label: string, iconName: string) {
  return html`<a href="#/${key}" data-nav="${key}" class="nav-item">${icon(iconName, "h-4 w-4")} <span>${label}</span></a>`;
}

const NAV_ICONS: Record<string, string> = {
  projects: "layers", services: "sparkle", "skill-categories": "folder", skills: "tasks", experience: "briefcase",
  education: "book", testimonials: "message", profile: "user", contact: "mail", links: "link", settings: "settings",
};

function shell(user: User): void {
  const group = (name: "Content" | "Site") =>
    html`<p class="nav-heading">${name}</p>${MODULES.filter((m) => m.group === name).map((m) => navLink(m.key, m.nav, NAV_ICONS[m.key] || "file"))}`;
  mount(
    app,
    html`<div class="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <span class="font-bold">Portfolio CMS</span>
        <button id="nav-toggle" class="icon-btn" aria-expanded="false" aria-controls="sidebar" aria-label="Open navigation">${icon("menu")}</button>
      </header>
      <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-y-auto border-r border-line bg-white p-4 lg:sticky lg:top-0 lg:block lg:h-screen" aria-label="CMS navigation">
        <div class="mb-5 flex items-center gap-3 px-2"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-accent">RN</span><span class="font-bold">Portfolio CMS</span></div>
        <nav class="space-y-0.5">
          ${navLink("", "Dashboard", "dashboard")}
          ${group("Content")}${group("Site")}
          <p class="nav-heading">Account</p>
          ${navLink("password", "Change password", "key")}
          <a href="/" target="_blank" rel="noopener noreferrer" class="nav-item">${icon("external", "h-4 w-4")} <span>View website</span></a>
          <button id="logout" class="nav-item w-full text-left">${icon("logout", "h-4 w-4")} <span>Sign out (${user.username})</span></button>
        </nav>
      </aside>
      <div id="scrim" class="fixed inset-0 z-30 hidden bg-ink/40 lg:hidden"></div>
      <main id="view" class="mx-auto w-full max-w-5xl p-4 sm:p-8" tabindex="-1"></main>
    </div>`,
  );

  const sidebar = document.getElementById("sidebar")!;
  const scrim = document.getElementById("scrim")!;
  const toggle = document.getElementById("nav-toggle")!;
  const setNav = (open: boolean) => {
    sidebar.classList.toggle("hidden", !open);
    scrim.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setNav(sidebar.classList.contains("hidden")));
  scrim.addEventListener("click", () => setNav(false));

  document.getElementById("logout")!.addEventListener("click", async () => {
    try { await api.post("/api/auth/logout/"); } catch { /* already signed out */ }
    window.removeEventListener("hashchange", route);
    loginScreen();
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("hashchange", () => setNav(false));
  void route();
}

async function route(): Promise<void> {
  const view = document.getElementById("view");
  if (!view) return;
  const [key = "", id = ""] = location.hash.replace(/^#\/?/, "").split("/");
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => {
    if (a.dataset.nav === key) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  try {
    if (key === "") await dashboardView(view);
    else if (key === "password") passwordView(view);
    else {
      const m = moduleByKey(key);
      if (!m) {
        mount(view, html`<h1 class="text-2xl font-bold">Page not found</h1><p class="mt-2"><a class="underline" href="#/">Back to the dashboard</a></p>`);
      } else if (m.kind === "single") await formView(view, m, null);
      else if (id) await formView(view, m, id);
      else await listView(view, m);
    }
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      toast("Your session has ended. Please sign in again.", "error");
      loginScreen();
      return;
    }
    mount(view, html`<div class="card p-6" role="alert">Something went wrong. Please refresh the page.</div>`);
  }
  (document.getElementById("page-title") as HTMLElement | null)?.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

/* ---------- boot ---------- */

async function boot(): Promise<void> {
  try {
    await api.get("/api/auth/csrf/");
    shell(await api.get<User>("/api/auth/me/"));
  } catch {
    loginScreen();
  }
}

void boot();
