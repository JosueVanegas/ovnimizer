"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageUploader } from "@/components/ImageUploader";
import { EditorView } from "@/components/EditorView";
import { Link } from "@/i18n/navigation";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { ToolMode } from "@/types";

interface ToolWorkspaceProps {
  mode: ToolMode;
}

export function ToolWorkspace({ mode }: ToolWorkspaceProps) {
  const t = useTranslations();

  const {
    images,
    error,
    addImages,
    removeImage,
    updateItem,
    clearAll,
    resetProcessed,
  } = useFileUpload(mode);

  const { isProcessing, progress, processImages, cancel } =
    useImageProcessor(updateItem);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const prevProcessingRef = useMemo(() => ({ value: false }), []);
  useEffect(() => {
    if (prevProcessingRef.value && !isProcessing && progress.total > 0) {
      const errors = images.filter((i) => i.status === "error").length;
      const done = images.filter((i) => i.status === "done").length;
      if (errors > 0) {
        toast.warning(t("toast.warning", { done, errors }));
      } else if (done > 0) {
        toast.success(
          done === 1
            ? t(`toast.${mode}.success` as Parameters<typeof t>[0], { count: done })
            : t(`toast.${mode}.successPlural` as Parameters<typeof t>[0], { count: done }),
        );
      }
    }
    prevProcessingRef.value = isProcessing;
  }, [isProcessing, images, progress.total, prevProcessingRef, t, mode]);

  const lastIdleKey = useRef("");
  useEffect(() => {
    if (isProcessing) return;
    const idle = images.filter((i) => i.status === "idle");
    if (!idle.length) return;
    const key = idle.map((i) => i.id).join(",");
    if (key === lastIdleKey.current) return;
    lastIdleKey.current = key;
    processImages(idle.map((img) => ({ item: img, options: img.settings })));
  }, [images, isProcessing]);

  useEffect(() => {
    return () => {
      images.forEach((i) => {
        URL.revokeObjectURL(i.preview);
        if (i.processedPreview) URL.revokeObjectURL(i.processedPreview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasImages = images.length > 0;
  const otherMode: ToolMode = mode === "optimize" ? "convert" : "optimize";
  const Icon = mode === "optimize" ? Sparkles : ArrowLeftRight;

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-40 space-y-8">
        {!hasImages && (
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufo-green/10 text-ufo-green text-xs font-semibold">
              <Icon className="w-3.5 h-3.5" />
              {t(`tool.${mode}.badge` as Parameters<typeof t>[0])}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t(`tool.${mode}.title` as Parameters<typeof t>[0])}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              {t(`tool.${mode}.subtitle` as Parameters<typeof t>[0])}
            </p>
            <Link
              href={`/${otherMode}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              {t(`tool.${otherMode}.switch` as Parameters<typeof t>[0])}
            </Link>
          </div>
        )}

        <ImageUploader
          onFiles={addImages}
          disabled={isProcessing}
          hasImages={hasImages}
        />

        {hasImages && (
          <EditorView
            mode={mode}
            images={images}
            updateItem={updateItem}
            onRemove={removeImage}
            onClear={clearAll}
            processImages={processImages}
            onCancel={cancel}
            onReprocess={() => {
              resetProcessed();
              lastIdleKey.current = "";
            }}
            isProcessing={isProcessing}
            progress={progress}
          />
        )}

        <div className="flex justify-center pt-4 pb-16">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            {t("tool.allTools")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
