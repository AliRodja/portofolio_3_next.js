import type { MetadataRoute } from "next";
import { getProjects } from "@/db/queries/projects";
import { siteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/projects", "/projects/archive"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const projects = await getProjects();
  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
  }));

  return [...pages, ...projectPages];
}
