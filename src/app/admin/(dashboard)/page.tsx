import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faBriefcase,
  faFolderOpen,
  faGraduationCap,
  faLayerGroup,
  faPlus,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { getAchievements, getEducations } from "@/db/queries/education";
import { getExperiences } from "@/db/queries/experience";
import { getProfile } from "@/db/queries/profile";
import { getProjects } from "@/db/queries/projects";
import { getSkillCategories } from "@/db/queries/skills";
import { requireAdmin } from "@/lib/session";
import { primaryButtonClass, secondaryButtonClass } from "./_components/form";
import { PageHeader } from "./_components/page-header";

export const metadata: Metadata = {
  title: "Overview",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function OverviewPage() {
  const admin = await requireAdmin();
  const [profile, projects, experiences, skillCategories, educations, achievements] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getExperiences(),
      getSkillCategories(),
      getEducations(),
      getAchievements(),
    ]);
  const skillCount = skillCategories.reduce(
    (total, category) => total + category.languages.length,
    0,
  );
  const highlight = projects.find((project) => project.highlight);
  const latestExperience = experiences[0];
  const firstName = admin.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        description="Here is what is on your portfolio right now."
        actions={
          <>
            <Link href="/" target="_blank" className={secondaryButtonClass}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
              View site
            </Link>
            <Link href="/admin/projects/new" className={primaryButtonClass}>
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              New project
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          href="/admin/profile"
          icon={faUser}
          title="Profile"
          value={profile.fullName}
          detail={
            profile.updatedAt
              ? `${profile.role} · Updated ${profile.updatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
              : "Still using the starter content"
          }
        />
        <SectionCard
          href="/admin/projects"
          icon={faFolderOpen}
          title="Projects"
          value={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
          detail={highlight ? `Highlight: ${highlight.title}` : "No highlighted project"}
        />
        <SectionCard
          href="/admin/experience"
          icon={faBriefcase}
          title="Experience"
          value={`${experiences.length} ${experiences.length === 1 ? "position" : "positions"}`}
          detail={
            latestExperience
              ? `Latest: ${latestExperience.role} at ${latestExperience.company}`
              : "Hidden on the About page until you add one"
          }
        />
        <SectionCard
          href="/admin/skills"
          icon={faLayerGroup}
          title="Skills"
          value={`${skillCategories.length} ${skillCategories.length === 1 ? "category" : "categories"}`}
          detail={
            skillCategories.length
              ? `${skillCount} ${skillCount === 1 ? "technology" : "technologies"} in total`
              : "Hidden on the About page until you add one"
          }
        />
        <SectionCard
          href="/admin/education"
          icon={faGraduationCap}
          title="Education"
          value={`${educations.length} ${educations.length === 1 ? "school" : "schools"}`}
          detail={`${achievements.length} ${achievements.length === 1 ? "achievement" : "achievements"}`}
        />
      </div>

    </>
  );
}

function SectionCard({
  href,
  icon,
  title,
  value,
  detail,
}: {
  href: string;
  icon: IconDefinition;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
      <p className="mt-1 flex items-center justify-between gap-3 text-sm text-gray-500">
        <span className="truncate">{detail}</span>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-xs text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900"
        />
      </p>
    </Link>
  );
}
