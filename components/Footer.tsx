"use client";

import { ShieldCheck, ExternalLink, Keyboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OPEN_SHORTCUTS_EVENT } from "./ShortcutsModal";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className=" mt-0 py-4 bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-ufo-green shrink-0" />
          <span>{t("privacy")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">{t("community")}</span>
          <Link
            href="/changelog"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            {t("changelog")}
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT))}
            className="hidden items-center gap-1 hover:text-foreground transition-colors sm:flex"
          >
            <Keyboard className="w-3.5 h-3.5" />
            {t("shortcuts")}
          </button>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            {t("privacyLink")}
          </Link>
          <a
            href="https://github.com/JosueVanegas/JosueVanegas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-ufo-green">JosueVanegas</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
