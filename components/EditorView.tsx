"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  Download,
  Loader2,
  AlertCircle,
  Trash2,
  Archive,
  Users,
} from "lucide-react";
import { ImageItem, ProcessingOptions } from "@/types";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { FormatPicker } from "./FormatPicker";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import { getOutputFilename } from "@/lib/image-processor";
import { downloadSingleOrZip } from "@/lib/zip-handler";
import { QUALITY_PRESETS, RESIZE_PRESETS } from "@/lib/constants";

interface Progress {
  total: number;
  done: number;
  imagePct: number;
  startedAt: number | null;
}

interface EditorViewProps {
  images: ImageItem[];
  updateItem: (id: string, updates: Partial<ImageItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  processImages: (
    tasks: Array<{ item: ImageItem; options: ProcessingOptions }>,
  ) => void;
  onCancel: () => void;
  onReprocess: () => void;
  isProcessing: boolean;
  progress: Progress;
}

export function EditorView({
  images,
  updateItem,
  onRemove,
  onClear,
  processImages,
  onCancel,
  onReprocess,
  isProcessing,
  progress,
}: EditorViewProps) {
  const t = useTranslations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const pendingSettingsRef = useRef<{
    id: string;
    options: ProcessingOptions;
  } | null>(null);

  useEffect(() => {
    if (!images.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !images.find((i) => i.id === selectedId)) {
      setSelectedId(images[0].id);
    }
  }, [images, selectedId]);

  const selected = useMemo(
    () => images.find((i) => i.id === selectedId) ?? images[0] ?? null,
    [images, selectedId],
  );

  const doneImages = useMemo(
    () => images.filter((i) => i.status === "done" && i.processedBlob),
    [images],
  );
  const anyDone = doneImages.length > 0;

  const totalOriginal = doneImages.reduce((s, i) => s + i.originalSize, 0);
  const totalProcessed = doneImages.reduce(
    (s, i) => s + (i.processedSize ?? 0),
    0,
  );
  const overallSaving =
    totalOriginal > 0
      ? Math.round((1 - totalProcessed / totalOriginal) * 100)
      : 0;

  const overallPct =
    progress.total > 0
      ? ((progress.done + progress.imagePct / 100) / progress.total) * 100
      : 0;

  const triggerReprocess = useCallback(
    (img: ImageItem, opts: ProcessingOptions) => {
      pendingSettingsRef.current = { id: img.id, options: opts };
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const pending = pendingSettingsRef.current;
        if (!pending) return;
        pendingSettingsRef.current = null;
        const latest = images.find((i) => i.id === pending.id);
        if (!latest) return;
        processImages([{ item: latest, options: pending.options }]);
      }, 400);
    },
    [images, processImages],
  );

  function updateSettings(patch: Partial<ProcessingOptions>) {
    if (!selected) return;
    const newSettings = { ...selected.settings, ...patch };
    updateItem(selected.id, { settings: newSettings });
    triggerReprocess(selected, newSettings);
  }

  function handleApplyToAll() {
    if (!selected) return;
    const settings = { ...selected.settings };
    images.forEach((img) => updateItem(img.id, { settings }));
    processImages(images.map((img) => ({ item: img, options: settings })));
  }

  function downloadOne(img: ImageItem) {
    if (!img.processedBlob) return;
    const url = URL.createObjectURL(img.processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getOutputFilename(
      img.name,
      selected?.settings.format ?? "webp",
    );
    a.click();
    URL.revokeObjectURL(url);
  }

  const settings = selected?.settings;
  const qualityPresetKey =
    QUALITY_PRESETS.find((p) => p.value === settings?.quality)?.key ?? "custom";
  const resizePresetKey =
    RESIZE_PRESETS.find((p) => p.value === settings?.width)?.key ?? "original";

  const selectCls =
    "w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/40 text-sm font-medium transition-colors focus:outline-none focus:border-emerald-500 hover:bg-muted/70 appearance-none cursor-pointer disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {images.length}{" "}
          {images.length === 1 ? t("gallery.image") : t("gallery.images")}
          {anyDone && (
            <span className="ml-2 text-emerald-600 dark:text-emerald-400">
              · {doneImages.length}{" "}
              {doneImages.length === 1
                ? t("gallery.processed")
                : t("gallery.processedPlural")}
            </span>
          )}
        </span>
        <button
          onClick={onClear}
          disabled={isProcessing}
          className="flex items-center gap-1 hover:text-destructive transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => {
            const isSel = img.id === selectedId;
            const imgSaving = img.processedSize
              ? Math.round((1 - img.processedSize / img.originalSize) * 100)
              : null;
            return (
              <div
                key={img.id}
                onClick={() => setSelectedId(img.id)}
                className={[
                  "group relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                  isSel
                    ? "border-emerald-500 ring-2 ring-emerald-500/30"
                    : "border-border/40 hover:border-border opacity-70 hover:opacity-100",
                ].join(" ")}
              >
                <img
                  src={img.processedPreview ?? img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                {img.status === "processing" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
                {img.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-200" />
                  </div>
                )}
                {img.status === "done" && imgSaving !== null && (
                  <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 bg-black/60 text-[9px] font-bold text-emerald-300">
                    {imgSaving > 0
                      ? `-${imgSaving}%`
                      : `+${Math.abs(imgSaving)}%`}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(img.id);
                  }}
                  disabled={isProcessing}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all disabled:hidden"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-4 items-start">
        <div className="relative rounded-2xl overflow-hidden bg-muted/20 border border-border/40 min-h-64 flex items-center justify-center">
          {!selected ? null : selected.status === "done" &&
            selected.processedPreview ? (
            <BeforeAfterSlider
              before={selected.preview}
              after={selected.processedPreview}
              alt={selected.name}
              beforeLabel={t("gallery.before")}
              afterLabel={t("gallery.after")}
            />
          ) : selected.status === "processing" ? (
            <div className="relative w-full">
              <img
                src={selected.preview}
                alt={selected.name}
                className="w-full max-h-[520px] object-contain opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <div className="w-40 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 progress-shimmer transition-all duration-300"
                    style={{ width: `${progress.imagePct}%` }}
                  />
                </div>
              </div>
            </div>
          ) : selected.status === "error" ? (
            <div className="relative w-full">
              <img
                src={selected.preview}
                alt={selected.name}
                className="w-full max-h-[520px] object-contain opacity-20"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-sm text-red-500 font-medium text-center">
                  {selected.errorMessage ?? t("editor.error")}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <img
                src={selected.preview}
                alt={selected.name}
                className="w-full max-h-[520px] object-contain"
              />
            </div>
          )}

          {images.length === 1 && selected && (
            <button
              onClick={() => onRemove(selected.id)}
              disabled={isProcessing}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {selected?.status === "done" && selected.processedSize && (
            <div className="absolute top-2 left-2">
              {(() => {
                const s = Math.round(
                  (1 - selected.processedSize / selected.originalSize) * 100,
                );
                return (
                  <Badge
                    className={`text-[10px] h-5 px-1.5 font-bold pointer-events-none border-0 ${s > 0 ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}
                  >
                    {s > 0 ? `-${s}%` : `+${Math.abs(s)}%`}
                  </Badge>
                );
              })()}
            </div>
          )}

          {selected?.status === "done" && images.length > 1 && (
            <button
              onClick={() => downloadOne(selected)}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-emerald-500 transition-colors"
              title={t("gallery.downloadAria")}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-4">
          <FormatPicker
            value={settings?.format ?? "webp"}
            onChange={(fmt) => updateSettings({ format: fmt })}
            disabled={isProcessing}
          />
          {settings?.format === "avif" && (
            <p className="text-[11px] text-amber-500 dark:text-amber-400 -mt-2">
              {t("options.avifWarning")}
            </p>
          )}
          {settings?.format === "png" && (
            <p className="text-[11px] text-amber-500 dark:text-amber-400 -mt-2">
              {t("format.pngWarning")}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">
                {t("options.quality")}
              </label>
              <span className="text-sm font-mono tabular-nums text-muted-foreground">
                {settings?.quality ?? 80}%
              </span>
            </div>

            <div className="relative">
              <select
                value={qualityPresetKey}
                onChange={(e) => {
                  const preset = QUALITY_PRESETS.find(
                    (p) => p.key === e.target.value,
                  );
                  if (preset) updateSettings({ quality: preset.value });
                }}
                disabled={isProcessing}
                className={selectCls}
              >
                {QUALITY_PRESETS.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {t(`options.preset.${key}` as Parameters<typeof t>[0])} —{" "}
                    {value}%
                  </option>
                ))}
                {qualityPresetKey === "custom" && (
                  <option value="custom">
                    {t("options.preset.custom")} — {settings?.quality}%
                  </option>
                )}
              </select>
            </div>

            <Slider
              value={[settings?.quality ?? 80]}
              min={1}
              max={100}
              step={1}
              onValueChange={(v) =>
                updateSettings({ quality: Array.isArray(v) ? v[0] : v })
              }
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {t("options.maxWidth")}
            </label>
            <div className="relative">
              <select
                value={resizePresetKey}
                onChange={(e) => {
                  const preset = RESIZE_PRESETS.find(
                    (p) => p.key === e.target.value,
                  );
                  if (preset) updateSettings({ width: preset.value });
                }}
                disabled={isProcessing}
                className={selectCls}
              >
                {RESIZE_PRESETS.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {t(`options.size.${key}` as Parameters<typeof t>[0])}
                    {value ? ` — ${value}px` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-border/40 pt-3 space-y-2">
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("progress.label", {
                      current: progress.done + 1,
                      total: progress.total,
                    })}
                  </span>
                  <button
                    onClick={onCancel}
                    className="text-destructive hover:underline"
                  >
                    {t("actions.cancel")}
                  </button>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full progress-shimmer transition-all duration-300"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>
            )}

            {images.length > 1 && (
              <Button
                variant="outline"
                className="w-full gap-2 text-sm"
                onClick={handleApplyToAll}
                disabled={isProcessing}
              >
                <Users className="w-4 h-4" />
                {t("editor.applyAll")}
              </Button>
            )}

            {anyDone && !isProcessing && (
              <Button
                className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                onClick={() =>
                  downloadSingleOrZip(doneImages, settings?.format ?? "webp")
                }
              >
                {doneImages.length === 1 ? (
                  <>
                    <Download className="w-4 h-4" />
                    {t("stats.download")}
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    {t("stats.downloadAll")} ({doneImages.length})
                  </>
                )}
              </Button>
            )}

            {anyDone && !isProcessing && (
              <button
                onClick={onReprocess}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {t("actions.reprocess")}
              </button>
            )}
          </div>
        </div>
      </div>

      {anyDone && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground px-1">
          <span>
            {doneImages.length}{" "}
            {doneImages.length === 1 ? t("stats.image") : t("stats.images")}
          </span>
          <span>{formatBytes(totalOriginal)} {t("stats.original")}</span>
          <span
            className={
              overallSaving > 0
                ? "text-ufo-green font-semibold"
                : ""
            }
          >
            {overallSaving > 0
              ? `-${overallSaving}%`
              : `+${Math.abs(overallSaving)}%`}{" "}
            {t("stats.compression")}
          </span>
          {totalOriginal > totalProcessed && (
            <span>
              {formatBytes(totalOriginal - totalProcessed)} {t("stats.saved")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
