/** Scroll-reveal for content rendered after load. Respects reduced-motion. */
const TARGETS = ".card, figure, article, section h2, .eyebrow, ol > li, .check-list li";

export function initMotion(root: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add("in-view");
          observer.unobserve(el);
          // Hand the element back to its normal hover styles once the reveal is done.
          window.setTimeout(() => {
            el.classList.remove("anim", "in-view");
            el.style.removeProperty("--d");
          }, 1300);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  const seen = new WeakSet<Element>();
  const scan = (): void => {
    root.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
      if (seen.has(el) || el.closest(".reveal, [role='status']") || el.classList.contains("hero-photo")) return;
      seen.add(el);
      // Stagger siblings so grids cascade in.
      const index = Array.from(el.parentElement?.children ?? []).indexOf(el);
      el.style.setProperty("--d", `${Math.min(index, 5) * 70}ms`);
      el.classList.add("anim");
      observer.observe(el);
    });
  };

  scan();
  // Sections load asynchronously; pick up new nodes as they arrive.
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
}

export function initHeaderShadow(): void {
  const header = document.querySelector("header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}
