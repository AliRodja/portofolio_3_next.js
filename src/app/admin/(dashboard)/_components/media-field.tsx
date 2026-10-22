"use client";

import {
  faArrowLeft,
  faArrowRight,
  faArrowUpRightFromSquare,
  faCloudArrowUp,
  faFilePdf,
  faLink,
  faRotate,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { uploadFile, useUploadMode } from "./upload";

// Tile sizes that match how each image is shown on the site.
const aspects = {
  portrait: "aspect-[3/4] w-36",
  square: "aspect-square w-36",
  video: "aspect-video w-56",
};

type Aspect = keyof typeof aspects;

// Picks images (or a PDF) by upload, drag and drop, or a pasted link. The
// chosen URLs are submitted as hidden inputs named `name`, in display order.
export function MediaField({
  name,
  label,
  hint,
  folder,
  kind = "image",
  aspect = "video",
  max = 1,
  defaultValue = [],
  alignHint = false,
}: {
  name: string;
  label: string;
  hint?: string;
  // Prefix for uploaded file names, e.g. "profile".
  folder: string;
  kind?: "image" | "file";
  aspect?: Aspect;
  max?: number;
  defaultValue?: string[];
  // Reserve two lines for the hint so tiles line up in a grid of fields.
  alignHint?: boolean;
}) {
  const mode = useUploadMode();
  const fileInput = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState(defaultValue);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState("");

  const isSingle = max === 1;
  const canAdd = isSingle ? urls.length === 0 : urls.length + uploading < max;

  // A single field replaces its value. A list appends, up to `max`.
  const add = (newUrls: string[]) =>
    setUrls((current) => {
      if (isSingle) return newUrls.slice(-1);
      const fresh = newUrls.filter((url) => !current.includes(url));
      return [...current, ...fresh].slice(0, max);
    });

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const room = isSingle ? 1 : max - urls.length;
    const files = Array.from(fileList).slice(0, room);
    setError(null);
    setUploading((count) => count + files.length);

    const results = await Promise.allSettled(
      files.map((file) => uploadFile(mode, file, folder)),
    );
    setUploading((count) => count - files.length);

    add(results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : [])));
    const failure = results.find((result) => result.status === "rejected");
    if (failure) setError((failure.reason as Error).message);
  };

  const openPicker = () => fileInput.current?.click();

  const dropHandlers = {
    onDragOver: (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
  };

  const addLink = () => {
    const url = link.trim();
    if (!url) return;
    add([url]);
    setLink("");
    setShowLink(false);
  };

  const remove = (url: string) =>
    setUrls((current) => current.filter((item) => item !== url));

  const move = (index: number, offset: number) =>
    setUrls((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });

  const dropzone = (className: string) => (
    <button
      type="button"
      onClick={openPicker}
      {...dropHandlers}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-center transition ${
        isDragging
          ? "border-gray-900 bg-gray-100 text-gray-900"
          : "border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:text-gray-700"
      } ${className}`}
    >
      <FontAwesomeIcon icon={faCloudArrowUp} className="text-xl" />
      <span className="text-xs font-medium">
        {kind === "file" ? "Upload PDF" : "Upload"}
      </span>
      <span className="text-[11px] text-gray-400">or drop here</span>
    </button>
  );

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {hint && (
        <p className={`mb-3 text-xs text-gray-500 ${alignHint ? "min-h-[2lh]" : ""}`}>
          {hint}
        </p>
      )}

      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}
      <input
        ref={fileInput}
        type="file"
        accept={kind === "file" ? "application/pdf" : "image/*"}
        multiple={!isSingle}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {kind === "image" ? (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <div
              key={url}
              className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 ${aspects[aspect]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- preview of arbitrary URLs */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-linear-to-t from-black/70 to-transparent p-2 pt-6 transition sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                {!isSingle && index > 0 && (
                  <TileButton label="Move left" onClick={() => move(index, -1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </TileButton>
                )}
                {isSingle && (
                  <TileButton label="Replace" onClick={openPicker}>
                    <FontAwesomeIcon icon={faRotate} />
                  </TileButton>
                )}
                <TileButton label="Remove" onClick={() => remove(url)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </TileButton>
                {!isSingle && index < urls.length - 1 && (
                  <TileButton label="Move right" onClick={() => move(index, 1)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </TileButton>
                )}
              </div>
            </div>
          ))}

          {Array.from({ length: uploading }, (_, index) => (
            <div
              key={`uploading-${index}`}
              className={`flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400 ${aspects[aspect]}`}
            >
              <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
            </div>
          ))}

          {canAdd && uploading === 0 && dropzone(aspects[aspect])}
        </div>
      ) : urls[0] ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
          <FontAwesomeIcon icon={faFilePdf} className="text-xl text-red-500" />
          <span className="min-w-0 flex-1 truncate">{fileName(urls[0])}</span>
          <a
            href={urls[0]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open file"
            className="text-gray-500 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
          <button
            type="button"
            aria-label="Replace file"
            onClick={openPicker}
            className="text-gray-500 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faRotate} />
          </button>
          <button
            type="button"
            aria-label="Remove file"
            onClick={() => remove(urls[0])}
            className="text-gray-500 hover:text-red-600"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      ) : uploading > 0 ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
        </div>
      ) : (
        dropzone("h-24 w-full")
      )}

      <div className="mt-2">
        {showLink ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={link}
              autoFocus
              onChange={(event) => setLink(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLink();
                }
                if (event.key === "Escape") setShowLink(false);
              }}
              placeholder={kind === "file" ? "/docs/cv.pdf or https://..." : "/images/... or https://..."}
              aria-label={`${label} link`}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={addLink}
              className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowLink(false)}
              className="rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          (canAdd || isSingle) && (
            <button
              type="button"
              onClick={() => setShowLink(true)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faLink} className="text-[10px]" />
              Use a link instead
            </button>
          )
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

function fileName(url: string) {
  return decodeURIComponent(url.split("/").pop() ?? url);
}

function TileButton({
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
      className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-xs text-gray-800 transition hover:bg-white"
    >
      {children}
    </button>
  );
}
