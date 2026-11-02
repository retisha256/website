import { ApiError, api } from "../shared/api";
import { Safe, mount } from "../shared/dom";
import type {
  Education,
  Experience,
  Project,
  ProjectCard,
  ProjectFacets,
  Service,
  SiteBundle,
  SkillCategory,
  Testimonial,
} from "../shared/types";
import { errorState } from "./components";

const cache = new Map<string, Promise<unknown>>();

/** GET once per page view; failed requests are not cached so "Try again" really retries. */
function cached<T>(path: string): Promise<T> {
  let promise = cache.get(path) as Promise<T> | undefined;
  if (!promise) {
    promise = api.get<T>(path);
    cache.set(path, promise);
    promise.catch(() => cache.delete(path));
  }
  return promise;
}

export const getSite = () => cached<SiteBundle>("/api/public/site/");
export const getServices = () => cached<Service[]>("/api/public/services/");
export const getSkills = () => cached<SkillCategory[]>("/api/public/skills/");
export const getExperience = () => cached<Experience[]>("/api/public/experience/");
export const getEducation = () => cached<Education[]>("/api/public/education/");
export const getTestimonials = () => cached<Testimonial[]>("/api/public/testimonials/");
export const getFacets = () => cached<ProjectFacets>("/api/public/projects/facets/");
export const getFeaturedProjects = () => cached<ProjectCard[]>("/api/public/projects/?featured=true");
export const getProject = (slug: string) => cached<Project>(`/api/public/projects/${encodeURIComponent(slug)}/`);
export const searchProjects = (query: URLSearchParams) =>
  api.get<ProjectCard[]>(`/api/public/projects/?${query.toString()}`);

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "We couldn't load this content. Please try again in a moment.";
}

/**
 * Run `render`, showing a retry-able error panel in `target` if anything fails.
 * Independent sections load in parallel and fail independently.
 */
export async function guarded(target: Element, render: () => Promise<Safe>): Promise<void> {
  try {
    mount(target, await render());
  } catch (error) {
    mount(target, errorState(errorMessage(error)));
    target.querySelector("[data-retry]")?.addEventListener("click", () => void guarded(target, render));
  }
}
