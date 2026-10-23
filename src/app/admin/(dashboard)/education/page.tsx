import { faAward, faGraduationCap, faMedal, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAchievements, getEducations } from "@/db/queries/education";
import { formatMonth } from "@/lib/dates";
import { achievementTypes, formatYears } from "@/lib/education";
import { requireAdmin } from "@/lib/session";
import { DeleteButton } from "../_components/delete-button";
import { secondaryButtonClass } from "../_components/form";
import { PageHeader } from "../_components/page-header";
import { deleteAchievement, deleteEducation } from "./actions";

export const metadata: Metadata = {
  title: "Education",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

const medalColors = {
  gold: "bg-yellow-100 text-yellow-700",
  silver: "bg-slate-100 text-slate-600",
  bronze: "bg-orange-100 text-orange-700",
  finalist: "bg-blue-100 text-blue-700",
};

export default async function AdminEducationPage() {
  await requireAdmin();
  const [educations, achievements] = await Promise.all([
    getEducations(),
    getAchievements(),
  ]);

  return (
    <>
      <PageHeader
        title="Education"
        description="Your schools and the achievements next to them on the About page. Both are listed newest first."
      />

      <div className="space-y-10">
        <ListSection
          title="Schools"
          count={`${educations.length} ${educations.length === 1 ? "school" : "schools"}`}
          addHref="/admin/education/new"
          addLabel="New education"
          empty="Add the school or university you studied at."
        >
          {educations.map((education) => (
            <Row
              key={education.id}
              icon={faGraduationCap}
              iconClass="bg-gray-100 text-gray-600"
              title={education.school}
              detail={`${education.degree} · ${formatYears(education.startYear, education.endYear)}`}
              thumbnail={education.photos[0]}
              editHref={`/admin/education/${education.id}/edit`}
              deleteButton={
                <DeleteButton
                  action={deleteEducation.bind(null, education.id)}
                  title={education.school}
                />
              }
            />
          ))}
        </ListSection>

        <ListSection
          title="Achievements"
          count={`${achievements.length} ${achievements.length === 1 ? "achievement" : "achievements"}`}
          addHref="/admin/education/achievements/new"
          addLabel="New achievement"
          empty="Add competitions, awards, or scholarships."
        >
          {achievements.map((achievement) => (
            <Row
              key={achievement.id}
              icon={achievement.type === "finalist" ? faAward : faMedal}
              iconClass={medalColors[achievement.type]}
              title={achievement.title}
              detail={`${achievement.event} · ${formatMonth(achievement.date)} · ${achievementTypes[achievement.type]}`}
              editHref={`/admin/education/achievements/${achievement.id}/edit`}
              deleteButton={
                <DeleteButton
                  action={deleteAchievement.bind(null, achievement.id)}
                  title={achievement.title}
                />
              }
            />
          ))}
        </ListSection>
      </div>
    </>
  );
}

function ListSection({
  title,
  count,
  addHref,
  addLabel,
  empty,
  children,
}: {
  title: string;
  count: string;
  addHref: string;
  addLabel: string;
  empty: string;
  children: ReactNode[];
}) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{count}</p>
        </div>
        <Link href={addHref} className={secondaryButtonClass}>
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          {addLabel}
        </Link>
      </div>
      {children.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          {empty}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {children}
        </ul>
      )}
    </section>
  );
}

function Row({
  icon,
  iconClass,
  title,
  detail,
  thumbnail,
  editHref,
  deleteButton,
}: {
  icon: typeof faMedal;
  iconClass: string;
  title: string;
  detail: string;
  thumbnail?: string;
  editHref: string;
  deleteButton: ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ${iconClass}`}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- small preview of arbitrary URLs
            <img src={thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={icon} />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          <p className="truncate text-sm text-gray-500">{detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm sm:justify-end">
        <Link href={editHref} className="font-medium hover:underline">
          Edit
        </Link>
        {deleteButton}
      </div>
    </li>
  );
}
