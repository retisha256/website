import { html, mount } from "../shared/dom";
import { errorState } from "./components";
import { initHeaderShadow, initMotion } from "./motion";
import { errorMessage } from "./data";
import { renderAbout } from "./pages/about";
import { renderContact } from "./pages/contact";
import { renderHome } from "./pages/home";
import { renderPortfolio } from "./pages/portfolio";
import { renderProject } from "./pages/project";
import { renderServices } from "./pages/services";

const PAGES: Record<string, (root: HTMLElement) => Promise<void>> = {
  home: renderHome,
  about: renderAbout,
  services: renderServices,
  portfolio: renderPortfolio,
  project: renderProject,
  contact: renderContact,
};

function setupMenu(): void {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!button || !menu) return;
  const set = (open: boolean) => {
    menu.classList.toggle("hidden", !open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  button.addEventListener("click", () => set(menu.classList.contains("hidden")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") set(false);
  });
  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => e.matches && set(false));
}

async function boot(): Promise<void> {
  setupMenu();
  initHeaderShadow();
  const root = document.getElementById("main");
  const page = root?.dataset.page;
  if (!root || !page || !PAGES[page]) return;
  const run = async (): Promise<void> => {
    try {
      await PAGES[page](root);
    } catch (error) {
      mount(root, html`<section class="wrap section">${errorState(errorMessage(error))}</section>`);
      root.querySelector("[data-retry]")?.addEventListener("click", () => void run());
    }
  };
  initMotion(root);
  await run();
}

void boot();
