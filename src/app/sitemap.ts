import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/projects/archive"].map((path) => ({
    url: `${site.url}${path}`,
  }));

  const projectPages = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
  }));

  return [...pages, ...projectPages];
}
