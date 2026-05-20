"use client";

import { useCallback, useState } from "react";

export function isTouchPrimaryDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export function portfolioImageColorClass(colorRevealed: boolean, duration = "duration-500") {
  return [
    "h-full w-full object-cover grayscale transition-all",
    duration,
    "[@media(hover:hover)]:group-hover:grayscale-0",
    "[@media(hover:hover)]:group-hover:scale-105",
    "[@media(hover:none)]:active:grayscale-0",
    colorRevealed ? "scale-105 grayscale-0" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function useTapColorReveal() {
  const [colorRevealedId, setColorRevealedId] = useState<string | null>(null);

  const handleTileClick = useCallback((e: React.MouseEvent, id: string) => {
    if (!isTouchPrimaryDevice()) return;
    e.preventDefault();
    setColorRevealedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleTileColor = useCallback((id: string) => {
    if (!isTouchPrimaryDevice()) return;
    setColorRevealedId((prev) => (prev === id ? null : id));
  }, []);

  const isRevealed = useCallback(
    (id: string) => colorRevealedId === id,
    [colorRevealedId],
  );

  const clearRevealed = useCallback(() => setColorRevealedId(null), []);

  return {
    colorRevealedId,
    handleTileClick,
    toggleTileColor,
    isRevealed,
    clearRevealed,
  };
}
