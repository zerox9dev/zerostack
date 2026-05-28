"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const order = ["light", "dark", "system"] as const;
type Mode = (typeof order)[number];

const icon = { light: Sun, dark: Moon, system: Monitor };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Avoid hydration mismatch: theme is only known client-side.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const current = (mounted ? (theme as Mode) : "system") ?? "system";
  const Icon = icon[current] ?? Monitor;
  const next = () => {
    const nextMode = order[(order.indexOf(current) + 1) % order.length];
    if (nextMode) setTheme(nextMode);
  };

  return (
    <Button
      type="button"
      onClick={next}
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${current}. Click to switch.`}
    >
      <Icon className="size-4" />
    </Button>
  );
}
