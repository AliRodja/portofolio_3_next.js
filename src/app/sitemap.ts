import type { MetadataRoute } from "next";
import { getProjects } from "@/db/queries/projects";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/projects", "/projects/archive"].map((path) => ({
    url: `${site.url}${path}`,
  }));

  const projects = await getProjects();
  const projectPages = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
  }));

  return [...pages, ...projectPages];
}
