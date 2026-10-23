import { faArrowDown, faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";
import { getSkillCategories } from "@/db/queries/skills";
import { skillIcons } from "@/lib/skill-icons";
import { requireAdmin } from "@/lib/session";
import { DeleteButton } from "../_components/delete-button";
import { primaryButtonClass } from "../_components/form";
import { PageHeader } from "../_components/page-header";
import { deleteSkillCategory, moveSkillCategory } from "./actions";

export const metadata: Metadata = {
  title: "Skills",
};

// Reads the session on every request (see the dashboard layout).
export const instant = false;

const moveButtonClass =
  "flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30";

export default async function AdminSkillsPage() {
  await requireAdmin();
  const categories = await getSkillCategories();

  return (
    <>
      <PageHeader
        title="Skills"
        description={`${categories.length} ${categories.length === 1 ? "category" : "categories"}. Use the arrows to set the order on the About page.`}
        actions={
          <Link href="/admin/skills/new" className={primaryButtonClass}>
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            New category
          </Link>
        }
      />

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="font-medium">No skill categories yet</p>
          <p className="mt-1 text-sm text-gray-500">
            The Skills & Expertise section stays hidden until you add one.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {categories.map((category, index) => {
            const highlighted = category.languages.filter((item) => item.highlight);
            return (
              <li
                key={category.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center md:px-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {/* Plain forms, so reordering works without waiting for
                      the page's JavaScript. */}
                  <div className="flex shrink-0 flex-col">
                    <form action={moveSkillCategory.bind(null, category.id, "up")}>
                      <button
                        type="submit"
                        aria-label={`Move ${category.title} up`}
                        disabled={index === 0}
                        className={moveButtonClass}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                    </form>
                    <form action={moveSkillCategory.bind(null, category.id, "down")}>
                      <button
                        type="submit"
                        aria-label={`Move ${category.title} down`}
                        disabled={index === categories.length - 1}
                        className={moveButtonClass}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    </form>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <FontAwesomeIcon icon={skillIcons[category.icon].icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{category.title}</p>
                    <p className="truncate text-sm text-gray-500">
                      {category.languages.length}{" "}
                      {category.languages.length === 1 ? "technology" : "technologies"} ·{" "}
                      {category.tools.length} {category.tools.length === 1 ? "tool" : "tools"}
                      {highlighted.length > 0 &&
                        ` · ★ ${highlighted.map((item) => item.name).join(", ")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm sm:justify-end">
                  <Link
                    href={`/admin/skills/${category.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteSkillCategory.bind(null, category.id)}
                    title={category.title}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
