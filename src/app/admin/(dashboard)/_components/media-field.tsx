"use client";

import {
  faArrowLeft,
  faArrowRight,
  faArrowUpRightFromSquare,
  faFilePdf,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { upload } from "@vercel/blob/client";
import { useState, type ReactNode } from "react";

const kinds = {
  image: { accept: "image/*", placeholder: "/images/... or https://..." },
  file: { accept: "application/pdf", placeholder: "/docs/cv.pdf or https://..." },
};

// Uploads to Vercel Blob, or takes a pasted URL or public/ path. The chosen
// URLs are submitted as hidden inputs named `name`, in display order.
export function MediaField({
  name,
  label,
  hint,
  folder,
  kind = "image",
  max = 1,
  defaultValue = [],
}: {
  name: string;
  label: string;
  hint?: string;
  // Prefix for uploaded file names in the Blob store, e.g. "profile".
  folder: string;
  kind?: keyof typeof kinds;
  max?: number;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState(defaultValue);
  const [manualUrl, setManualUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSingle = max === 1;
  const isFull = !isSingle && urls.length >= max;

  // A single field replaces its value. A list appends, up to `max`.
  const add = (newUrls: string[]) =>
    setUrls((current) => {
      if (isSingle) return newUrls.slice(-1);
      const fresh = newUrls.filter((url) => !current.includes(url));
      return [...current, ...fresh].slice(0, max);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) =>
          upload(`${folder}/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
          }),
        ),
      );
      add(uploaded.map((blob) => blob.url));
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        "Upload failed. Make sure BLOB_READ_WRITE_TOKEN is set, or paste a link instead.",
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

  const remove = (url: string) =>
    setUrls((current) => current.filter((item) => item !== url));

  const move = (index: number, offset: number) =>
    setUrls((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      {hint && <p className="-mt-0.5 mb-2 text-xs text-gray-500">{hint}</p>}

      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {urls.length > 0 &&
        (kind === "image" ? (
          <ul className="mb-3 flex flex-wrap gap-3">
            {urls.map((url, index) => (
              <li
                key={url}
                className="group relative h-28 w-44 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- preview of arbitrary URLs */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  {!isSingle && index > 0 && (
                    <IconButton label="Move left" onClick={() => move(index, -1)}>
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </IconButton>
                  )}
                  {!isSingle && index < urls.length - 1 && (
                    <IconButton label="Move right" onClick={() => move(index, 1)}>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </IconButton>
                  )}
                  <IconButton label="Remove" onClick={() => remove(url)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mb-3 space-y-2">
            {urls.map((url) => (
              <li
                key={url}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
              >
                <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                <span className="min-w-0 flex-1 truncate">{fileName(url)}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open file"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => remove(url)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </li>
            ))}
          </ul>
        ))}

      {isFull ? (
        <p className="text-xs text-gray-500">
          Maximum of {max} reached. Remove one to add another.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50 has-disabled:cursor-wait has-disabled:opacity-60">
            {isUploading ? "Uploading..." : urls.length > 0 && isSingle ? "Replace" : "Upload"}
            <input
              type="file"
              accept={kinds[kind].accept}
              multiple={!isSingle}
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
            placeholder={kinds[kind].placeholder}
            aria-label={`${label} link`}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={addManualUrl}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Add
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

function fileName(url: string) {
  return decodeURIComponent(url.split("/").pop() ?? url);
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
      title={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-xs text-gray-800 hover:bg-white"
    >
      {children}
    </button>
  );
}
