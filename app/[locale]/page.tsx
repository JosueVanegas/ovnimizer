"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageUploader } from "@/components/ImageUploader";
import { EditorView } from "@/components/EditorView";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";

export default function Home() {
  const t = useTranslations();

  const {
    images,
    error,
    addImages,
    removeImage,
    updateItem,
    clearAll,
    resetProcessed,
  } = useFileUpload();

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
            ? t("toast.success", { count: done })
            : t("toast.successPlural", { count: done }),
        );
      }
    }
    prevProcessingRef.value = isProcessing;
  }, [isProcessing, images, progress.total, prevProcessingRef, t]);

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

  async function handleShare() {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ovnimizer",
          text: t("share.text"),
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t("share.copied"));
    }
  }

  return (
    <div className="toptop min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-40 space-y-8">
        {!hasImages && (
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>
        )}

        <ImageUploader
          onFiles={addImages}
          disabled={isProcessing}
          hasImages={hasImages}
        />

        {hasImages && (
          <EditorView
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
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ufo-green border border-border/60 text-sm text-black hover:text-foreground hover:border-ufo-green hover:bg-muted/40 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {t("share.button")}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
