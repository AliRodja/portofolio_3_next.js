import {
  faArrowRight,
  faBriefcase,
  faFolderOpen,
  faGraduationCap,
  faLayerGroup,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/db/queries/profile";
import { getProjects } from "@/db/queries/projects";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "./_components/page-header";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const admin = await requireAdmin();
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const highlight = projects.find((project) => project.highlight);
  const firstName = admin.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        description="Here is what is on your portfolio right now."
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
        <SectionCard icon={faBriefcase} title="Experience" />
        <SectionCard icon={faLayerGroup} title="Skills" />
        <SectionCard icon={faGraduationCap} title="Education & achievements" />
      </div>
    </>
  );
}

// A section with an href is live. One without is shown as coming soon.
function SectionCard({
  href,
  icon,
  title,
  value,
  detail,
}: {
  href?: string;
  icon: IconDefinition;
  title: string;
  value?: string;
  detail?: string;
}) {
  const header = (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="text-sm font-medium text-gray-500">{title}</span>
    </div>
  );

  if (!href) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-5">
        {header}
        <p className="text-sm text-gray-400">
          Coming soon. Still edited in <code>src/data/</code> for now.
        </p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
    >
      {header}
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
