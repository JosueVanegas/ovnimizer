"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Upload, ImagePlus, PlusCircle, Link2, Loader2 } from "lucide-react";
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { openDropboxPicker, openGoogleDrivePicker } from "@/lib/cloud-pickers";

interface ImageUploaderProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  hasImages?: boolean;
}

async function fetchImageFromUrl(
  url: string,
  name?: string,
  headers?: Record<string, string>,
): Promise<File> {
  const res = await fetch(url, headers ? { headers } : undefined);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const mime = blob.type || "image/jpeg";
  const source = name ?? url;
  const pathname = (() => {
    try {
      return new URL(source).pathname;
    } catch {
      return "/image";
    }
  })();
  const filename = pathname.split("/").pop()?.split("?")[0] || "image";
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const finalName = filename.includes(".") ? filename : `${filename}.${ext}`;
  return new File([blob], finalName, { type: mime });
}

function GoogleDriveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
      <path d="M2 17.5L6 11h12l4 6.5H2Z" fill="#1FA463" />
      <path d="M9.5 4h5L22 17.5H14L9.5 4Z" fill="#4285F4" />
      <path d="M2 17.5L8 7l3.5 4L6 17.5H2Z" fill="#FBBC04" />
    </svg>
  );
}

function DropboxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="#0061FF">
      <path d="M6 2.5L1 6l5 3.5L1 13l5 3.5 5-3.5 5 3.5 5-3.5-5-3.5 5-3.5L11 2.5 6 6 1 2.5Z" />
      <path d="M6 17.5l5 3.5 5-3.5-5-3.5-5 3.5Z" />
    </svg>
  );
}

const CLOUD_PROVIDERS = [
  { key: "cloudDrive", Icon: GoogleDriveIcon, handler: openGoogleDrivePicker },
  { key: "cloudDropbox", Icon: DropboxIcon, handler: openDropboxPicker },
] as const;

export function ImageUploader({
  onFiles,
  disabled,
  hasImages,
}: ImageUploaderProps) {
  const t = useTranslations("upload");
  const [showUrl, setShowUrl] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [urlFetching, setUrlFetching] = useState(false);
  const [cloudLoading, setCloudLoading] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onFiles(accepted);
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: true,
      disabled,
    });

  async function handleUrlFetch() {
    const url = urlValue.trim();
    if (!url) return;
    setUrlFetching(true);
    try {
      const file = await fetchImageFromUrl(url);
      onFiles([file]);
      setUrlValue("");
      setShowUrl(false);
    } catch {
      toast.error(t("urlError"));
    } finally {
      setUrlFetching(false);
    }
  }

  async function handleCloudPicker(
    key: string,
    handler: typeof openGoogleDrivePicker,
  ) {
    setCloudLoading(key);
    try {
      await handler(fetchImageFromUrl, onFiles);
    } catch (err) {
      const msg = String(err);
      if (msg.startsWith("Error: env:")) {
        const vars = msg.replace("Error: env:", "");
        toast.error(`Configura ${vars} en .env.local`, { duration: 6000 });
      } else {
        toast.error(t("urlError"));
      }
    } finally {
      setCloudLoading(null);
    }
  }

  if (hasImages) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <div
            {...getRootProps()}
            className={[
              "flex-1 flex items-center justify-center gap-2.5 border border-dashed rounded-xl px-5 py-3",
              "text-sm text-muted-foreground cursor-pointer transition-colors duration-200 select-none",
              isDragActive && !isDragReject
                ? "border-ufo-green bg-ufo-green/5 text-ufo-green"
                : isDragReject
                  ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-destructive"
                  : "border-border hover:border-ufo-green/50 hover:bg-muted/40",
              disabled && "opacity-50 cursor-not-allowed",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input {...getInputProps()} />
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>
              {isDragReject
                ? t("reject")
                : isDragActive
                  ? t("dropToAdd")
                  : t("addMore")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            disabled={disabled}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
              showUrl
                ? "border-ufo-green bg-ufo-green/10 text-ufo-green"
                : "border-border hover:border-ufo-green/50 hover:bg-muted/40 text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t("fromUrl")}</span>
          </button>
        </div>

        {showUrl && (
          <div className="flex gap-2 animate-slide-up">
            <input
              ref={inputRef}
              autoFocus
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlFetch()}
              placeholder={t("urlPlaceholder")}
              disabled={urlFetching}
              className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-muted/40 text-sm outline-none focus:border-ufo-green transition-colors placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleUrlFetch}
              disabled={urlFetching || !urlValue.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ufo-green hover:bg-ufo-green/85 text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {urlFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("fetch")
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={[
          "relative border-2 border-dashed rounded-2xl p-12 md:p-20 text-center cursor-pointer backdrop-blur-sm",
          "transition-colors duration-200 select-none",
          isDragActive && !isDragReject
            ? "border-ufo-green bg-ufo-green/5"
            : isDragReject
              ? "border-red-500 bg-red-50 dark:bg-red-950/30"
              : "border-border hover:border-ufo-green/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-5">
          <div
            className={[
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-200",
              isDragActive && !isDragReject ? "bg-ufo-green/10" : "bg-muted",
            ].join(" ")}
          >
            {isDragActive && !isDragReject ? (
              <ImagePlus className="w-9 h-9 text-ufo-green" />
            ) : (
              <Upload className="w-9 h-9 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-bold">
              {isDragReject
                ? t("reject")
                : isDragActive
                  ? t("drop")
                  : t("drag")}
            </p>
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "" : t("hint")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">{t("orFrom")}</span>

        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
            showUrl
              ? "border-ufo-green bg-ufo-green/10 text-ufo-green"
              : "border-border hover:border-ufo-green/50 hover:bg-muted/40 text-muted-foreground",
          ].join(" ")}
        >
          <Link2 className="w-3.5 h-3.5" />
          {t("fromUrl")}
        </button>

        {CLOUD_PROVIDERS.map(({ key, Icon, handler }) => (
          <button
            key={key}
            type="button"
            disabled={cloudLoading === key}
            onClick={() => handleCloudPicker(key, handler)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-border/60 hover:bg-muted/40 text-xs font-medium text-muted-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cloudLoading === key ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon />
            )}
            {t(key)}
          </button>
        ))}
      </div>

      {showUrl && (
        <div className="flex gap-2 animate-slide-up">
          <input
            ref={inputRef}
            autoFocus
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlFetch()}
            placeholder={t("urlPlaceholder")}
            disabled={urlFetching}
            className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-muted/40 text-sm outline-none focus:border-ufo-green transition-colors placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleUrlFetch}
            disabled={urlFetching || !urlValue.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ufo-green hover:bg-ufo-green/85 text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {urlFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("fetch")
            )}
          </button>
        </div>
      )}
    </div>
  );
}
