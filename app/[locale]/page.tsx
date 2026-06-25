"use client";

import { useTranslations } from "next-intl";
import { ArrowLeftRight, Sparkles, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { ToolMode } from "@/types";

const TOOLS: { mode: ToolMode; Icon: typeof Sparkles }[] = [
  { mode: "optimize", Icon: Sparkles },
  { mode: "convert", Icon: ArrowLeftRight },
];

export default function Landing() {
  const t = useTranslations();

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-40 pb-16 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {t("landing.title")}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("landing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TOOLS.map(({ mode, Icon }) => (
            <Link
              key={mode}
              href={`/${mode}`}
              className="group relative rounded-3xl border border-border/60 bg-card p-7 md:p-8 flex flex-col gap-4 hover:border-ufo-green hover:shadow-lg hover:shadow-ufo-green/5 transition-all animate-card-appear"
            >
              <div className="w-14 h-14 rounded-2xl bg-ufo-green/10 text-ufo-green flex items-center justify-center group-hover:bg-ufo-green group-hover:text-black transition-colors">
                <Icon className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-bold">
                  {t(`tool.${mode}.title` as Parameters<typeof t>[0])}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t(`tool.${mode}.cardDesc` as Parameters<typeof t>[0])}
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ufo-green shrink-0" />
                    {t(`tool.${mode}.feature${i}` as Parameters<typeof t>[0])}
                  </li>
                ))}
              </ul>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ufo-green">
                {t(`tool.${mode}.cta` as Parameters<typeof t>[0])}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t("landing.privacyNote")}
        </p>
      </main>

      <Footer />
    </div>
  );
}
