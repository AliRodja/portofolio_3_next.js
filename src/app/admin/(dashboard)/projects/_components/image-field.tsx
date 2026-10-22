"use client";

import {
  faArrowLeft,
  faArrowRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { upload } from "@vercel/blob/client";
import { useState, type ReactNode } from "react";

// Uploads images to Vercel Blob, or accepts a pasted URL or public/ path.
// The chosen URLs are submitted as hidden inputs named `name`.
export function ImageField({
  name,
  label,
  hint,
  multiple = false,
  defaultValue = [],
}: {
  name: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState(defaultValue);
  const [manualUrl, setManualUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = (newUrls: string[]) =>
    setUrls((current) => {
      if (!multiple) return newUrls.slice(-1);
      return [...current, ...newUrls.filter((url) => !current.includes(url))];
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) =>
          upload(`projects/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
          }),
        ),
      );
      add(uploaded.map((blob) => blob.url));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const addManualUrl = () => {
    const url = manualUrl.trim();
    if (!url) return;
    add([url]);
    setManualUrl("");
  };

  const move = (index: number, offset: number) =>
    setUrls((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {hint && <p className="mb-2 text-xs text-gray-500">{hint}</p>}

      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {urls.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <li
              key={url}
              className="group relative h-24 w-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- preview of arbitrary URLs */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                {multiple && index > 0 && (
                  <IconButton label="Move left" onClick={() => move(index, -1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </IconButton>
                )}
                {multiple && index < urls.length - 1 && (
                  <IconButton label="Move right" onClick={() => move(index, 1)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </IconButton>
                )}
                <IconButton
                  label="Remove image"
                  onClick={() =>
                    setUrls((current) => current.filter((u) => u !== url))
                  }
                >
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition hover:bg-gray-50">
          {isUploading ? "Uploading..." : multiple ? "Upload images" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            disabled={isUploading}
            className="sr-only"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-gray-400">or</span>
        <input
          type="text"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addManualUrl();
            }
          }}
          placeholder="/images/... or https://..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addManualUrl}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition hover:bg-gray-50"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-xs text-gray-800 hover:bg-white"
    >
      {children}
    </button>
  );
}
