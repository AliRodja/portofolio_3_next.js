import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { getExperiences } from "@/db/queries/experience";
import { formatMonth } from "@/lib/experience";
import { requireAdmin } from "@/lib/session";
import { DeleteButton } from "../_components/delete-button";
import { primaryButtonClass } from "../_components/form";
import { PageHeader } from "../_components/page-header";
import { deleteExperience } from "./actions";

export const metadata: Metadata = {
  title: "Experience",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

export default async function AdminExperiencePage() {
  await requireAdmin();
  const experiences = await getExperiences();

  return (
    <>
      <PageHeader
        title="Experience"
        description={`${experiences.length} ${experiences.length === 1 ? "position" : "positions"}, in the order they appear on the About page.`}
        actions={
          <Link href="/admin/experience/new" className={primaryButtonClass}>
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            New experience
          </Link>
        }
      />

      {experiences.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="font-medium">No experience yet</p>
          <p className="mt-1 text-sm text-gray-500">
            The Professional Experience section stays hidden until you add one.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {experiences.map((experience) => (
            <li
              key={experience.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center md:px-6"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  <span className="truncate">{experience.role}</span>
                  {experience.endDate === null && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Current
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {experience.company} · {experience.type} ·{" "}
                  {formatMonth(experience.startDate)} – {formatMonth(experience.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm sm:justify-end">
                <Link
                  href={`/admin/experience/${experience.id}/edit`}
                  className="font-medium hover:underline"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteExperience.bind(null, experience.id)}
                  title={`${experience.role} at ${experience.company}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
