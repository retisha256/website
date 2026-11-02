import { html, mount } from "../../shared/dom";
import { icon } from "../../shared/icons";
import { emptyState, pageHero, serviceSection } from "../components";
import { getServices, getSite, guarded } from "../data";

export async function renderServices(root: HTMLElement): Promise<void> {
  const { profile, site } = await getSite();
  mount(
    root,
    html`${pageHero(
        "Services",
        "Support that keeps work moving",
        "Executive assistance, administrative operations, careful AI use and technical help, each backed by my CV and training.",
      )}
      <section class="wrap section"><div id="services-list" class="space-y-6">
        <div class="skeleton h-64"></div><div class="skeleton h-64"></div>
      </div></section>
      <section class="wrap pb-16 sm:pb-24">
        <div class="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 class="text-xl font-bold">Not sure which service fits?</h2>
            <p class="mt-1 text-sm text-muted">Tell me what is taking up your time and we can work out the right support.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="/contact/" class="btn-primary">${site.nav_cta_label} ${icon("arrowRight", "h-4 w-4")}</a>
            ${profile.email ? html`<a href="mailto:${profile.email}" class="btn-secondary">${icon("mail", "h-4 w-4")} Email me</a>` : ""}
          </div>
        </div>
      </section>`,
  );
  void guarded(root.querySelector("#services-list") as HTMLElement, async () => {
    const services = await getServices();
    if (!services.length) return emptyState("Services coming soon", "My service list is being updated. Please check back shortly.");
    return html`${services.map(serviceSection)}`;
  });
}
