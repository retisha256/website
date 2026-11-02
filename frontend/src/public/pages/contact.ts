import { html, mount, safeUrl } from "../../shared/dom";
import { icon } from "../../shared/icons";
import { contactList, pageHero } from "../components";
import { getSite } from "../data";

export async function renderContact(root: HTMLElement): Promise<void> {
  const { profile, links } = await getSite();
  mount(
    root,
    html`${pageHero(
        "Contact",
        "Let’s Work Together",
        "I’d be glad to discuss virtual assistance, administrative support and AI operations for you or your team. Reach out using any of the details below.",
      )}
      <section class="wrap section">
        <div class="grid items-start gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          ${contactList(profile, links)}
          <aside class="space-y-5">
            <div class="on-dark rounded-2xl bg-ink p-6 text-white">
              <h2 class="text-lg font-semibold !text-white">How to reach me</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/75">Email or call with a short description of what you need support with. I’ll reply to discuss next steps.</p>
              ${profile.availability_statement ? html`<p class="mt-4 rounded-lg bg-white/10 p-3 text-sm text-accent">${profile.availability_statement}</p>` : ""}
              ${profile.email ? html`<a class="btn-primary mt-5 w-full" href="mailto:${profile.email}">${icon("mail", "h-4 w-4")} Send an email</a>` : ""}
            </div>
            ${profile.cv_file
              ? html`<a href="${safeUrl(profile.cv_file)}" target="_blank" rel="noopener noreferrer" download class="card card-hover flex items-center gap-4 p-5">
                  <span class="icon-tile">${icon("file")}</span>
                  <span><span class="block text-sm font-semibold">Download my CV</span><span class="text-xs text-muted">PDF</span></span>
                </a>`
              : ""}
          </aside>
        </div>
      </section>`,
  );
}
