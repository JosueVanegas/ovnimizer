import { ThemeToggle } from "./shared/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-10 z-100 flex items-center justify-center">
      <div className="max-w-5xl mx-4 w-full px-4 md:px-10 h-14 flex items-center justify-between border gap-4 md:gap-20 rounded-full py-10 bg-background/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <div className="animate-float flex items-center justify-center w-10 h-10 rounded-lg  text-white shrink-0">
            <img src="/logo.png" className="w-full h-full object-contain"></img>
          </div>
          <span className="font-semibold text-14 tracking-[10px]">
            VNIMIZER
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
