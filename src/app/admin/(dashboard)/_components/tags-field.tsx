"use client";

import { faPlus, faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type KeyboardEvent } from "react";
import { FieldError, inputClass } from "./form";

// A list of short names edited as chips: type and press Enter (or a comma,
// unless `commas` is off for values that contain them) to add one. With
// `highlightable`, each chip has a star toggle. Submitted as one JSON field:
// Tag[] when highlightable, string[] otherwise.
export type Tag = { name: string; highlight: boolean };

export function TagsField({
  name,
  label,
  hint,
  placeholder,
  highlightable = false,
  commas = true,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  highlightable?: boolean;
  commas?: boolean;
  defaultValue: Tag[];
  error?: string[];
}) {
  const [items, setItems] = useState(defaultValue);
  const [draft, setDraft] = useState("");

  const add = () => {
    const names = (commas ? draft.split(",") : [draft])
      .map((item) => item.trim())
      .filter(Boolean);
    setItems((current) => {
      const taken = new Set(current.map((item) => item.name.toLowerCase()));
      const fresh = names.filter((item) => {
        const key = item.toLowerCase();
        if (taken.has(key)) return false;
        taken.add(key);
        return true;
      });
      return [...current, ...fresh.map((item) => ({ name: item, highlight: false }))];
    });
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter would otherwise submit the whole form.
    if (event.key === "Enter" || (commas && event.key === ",")) {
      event.preventDefault();
      add();
    } else if (event.key === "Backspace" && !draft && items.length) {
      setItems((current) => current.slice(0, -1));
    }
  };

  const value = highlightable ? items : items.map((item) => item.name);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(value)} />

      {items.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-1 rounded-full border py-1 pr-1 text-sm ${
                item.highlight
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white"
              } ${highlightable ? "pl-1" : "pl-3"}`}
            >
              {highlightable && (
                <button
                  type="button"
                  aria-label={item.highlight ? `Unhighlight ${item.name}` : `Highlight ${item.name}`}
                  aria-pressed={item.highlight}
                  title={item.highlight ? "Highlighted" : "Highlight"}
                  onClick={() =>
                    setItems((current) =>
                      current.map((other) =>
                        other.name === item.name
                          ? { ...other, highlight: !other.highlight }
                          : other,
                      ),
                    )
                  }
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
                    item.highlight
                      ? "text-yellow-300 hover:bg-white/15"
                      : "text-gray-300 hover:bg-gray-100 hover:text-yellow-500"
                  }`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
              )}
              {item.name}
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() =>
                  setItems((current) => current.filter((other) => other.name !== item.name))
                }
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition ${
                  item.highlight
                    ? "text-white/60 hover:bg-white/15 hover:text-white"
                    : "text-gray-400 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          aria-label={`Add to ${label}`}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add()}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          Add
        </button>
      </div>
      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
      <FieldError error={error} />
    </div>
  );
}
