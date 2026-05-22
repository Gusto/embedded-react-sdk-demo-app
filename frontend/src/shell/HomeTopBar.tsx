import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SCROLL_THRESHOLD = 24;

interface HomeTopBarProps {
  scrollContainer: HTMLElement | null;
}

export function HomeTopBar({ scrollContainer }: HomeTopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!scrollContainer) return;
    const update = () =>
      setIsScrolled(scrollContainer.scrollTop > SCROLL_THRESHOLD);
    update();
    scrollContainer.addEventListener("scroll", update, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", update);
  }, [scrollContainer]);

  return (
    <header
      className={`flex h-14 items-center px-6 transition-colors duration-200 ${
        isScrolled
          ? "border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950/60 dark:backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Link
        to="/"
        className="m-0 text-lg font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-400"
      >
        Demo
      </Link>
    </header>
  );
}
