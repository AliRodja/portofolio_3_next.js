"use client";

import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  socialIconKeys,
  socialIcons,
  type SocialIcon,
  type SocialLink,
} from "@/lib/social-icons";
import { FieldError, inputClass } from "../../_components/form";

// Edits the list in local state and submits it as one JSON field.
export function SocialsField({
  defaultValue,
  error,
}: {
  defaultValue: SocialLink[];
  error?: string[];
}) {
  // Keys keep inputs stable while rows are added and removed.
  const [rows, setRows] = useState(() =>
    defaultValue.map((link) => ({ ...link, key: crypto.randomUUID() })),
  );

  const update = (key: string, changes: Partial<SocialLink>) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );

  const addRow = () => {
    // Suggest a platform that is not on the list yet.
    const used = new Set(rows.map((row) => row.icon));
    const icon = socialIconKeys.find((key) => !used.has(key)) ?? "github";
    setRows((current) => [
      ...current,
      { key: crypto.randomUUID(), icon, label: socialIcons[icon], href: "" },
    ]);
  };

  const links = rows.map(({ label, href, icon }) => ({ label, href, icon }));

  return (
    <div>
      <input type="hidden" name="socials" value={JSON.stringify(links)} />

      {rows.length > 0 && (
        <ul className="mb-3 space-y-3">
          {rows.map((row) => (
            <li
              key={row.key}
              className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-[10rem_10rem_1fr_auto] sm:items-center sm:border-0 sm:p-0"
            >
              <select
                value={row.icon}
                aria-label="Platform"
                onChange={(event) => {
                  const icon = event.target.value as SocialIcon;
                  // Keep the label in sync until it has been customized.
                  const label =
                    row.label === socialIcons[row.icon] ? socialIcons[icon] : row.label;
                  update(row.key, { icon, label });
                }}
                className={inputClass}
              >
                {socialIconKeys.map((key) => (
                  <option key={key} value={key}>
                    {socialIcons[key]}
                  </option>
                ))}
              </select>
              <input
                value={row.label}
                aria-label="Label"
                placeholder="Label"
                onChange={(event) => update(row.key, { label: event.target.value })}
                className={inputClass}
              />
              <input
                type="url"
                value={row.href}
                aria-label="URL"
                placeholder="https://"
                onChange={(event) => update(row.key, { href: event.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                aria-label={`Remove ${row.label || "link"}`}
                onClick={() =>
                  setRows((current) => current.filter((item) => item.key !== row.key))
                }
                className="flex h-9 w-9 items-center justify-center justify-self-end rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
      >
        <FontAwesomeIcon icon={faPlus} className="text-xs" />
        Add link
      </button>
      <FieldError error={error} />
    </div>
  );
}
