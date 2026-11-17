import { html, mount, safeUrl } from "../../shared/dom";
import { icon } from "../../shared/icons";
import { contactList, pageHero } from "../components";
import { errorMessage, getCsrf, getSite, sendContactMessage } from "../data";

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
          <div class="space-y-8">
            ${contactList(profile, links)}
            <form id="contact-form" class="card space-y-5 p-6 sm:p-8">
              <div>
                <h2 class="text-xl font-semibold">Send a message</h2>
                <p class="mt-2 text-sm text-muted">Your message will be sent by email. You can reply directly to follow up.</p>
              </div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="contact-name" class="mb-1.5 block text-sm font-medium">Your name</label>
                  <input id="contact-name" name="name" type="text" maxlength="120" autocomplete="name" required
                    class="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
                </div>
                <div>
                  <label for="contact-email" class="mb-1.5 block text-sm font-medium">Your email</label>
                  <input id="contact-email" name="email" type="email" maxlength="254" autocomplete="email" required
                    class="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
                </div>
              </div>
              <div>
                <label for="contact-subject" class="mb-1.5 block text-sm font-medium">Subject</label>
                <input id="contact-subject" name="subject" type="text" maxlength="160" required
                  class="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
              </div>
              <div>
                <label for="contact-message" class="mb-1.5 block text-sm font-medium">Message</label>
                <textarea id="contact-message" name="message" rows="6" maxlength="5000" required
                  class="w-full resize-y rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"></textarea>
              </div>
              <div class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label for="contact-website">Leave this field empty</label>
                <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off">
              </div>
              <button type="submit" class="btn-primary disabled:cursor-wait disabled:opacity-60">Send message</button>
              <p id="contact-status" class="min-h-5 text-sm" role="status" aria-live="polite"></p>
            </form>
          </div>
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

  const form = root.querySelector<HTMLFormElement>("#contact-form");
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = root.querySelector<HTMLParagraphElement>("#contact-status");
  if (!form || !submit || !status) throw new Error("The contact form could not be initialized.");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const buttonLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "";
    status.className = "min-h-5 text-sm";

    const message = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    void getCsrf().then(() => sendContactMessage(message)).then((response) => {
      form.reset();
      status.textContent = response.detail;
      status.classList.add("text-emerald-700");
    }).catch((error: unknown) => {
      status.textContent = errorMessage(error);
      status.classList.add("text-red-700");
    }).finally(() => {
      submit.disabled = false;
      submit.textContent = buttonLabel;
    });
  });
}
