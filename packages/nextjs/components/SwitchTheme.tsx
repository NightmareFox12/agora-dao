"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "./ui/shadcn/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type SwitchThemeProps = {
  className?: string;
  moonIconDark?: boolean;
  sunIconDark?: boolean;
};

export const SwitchTheme: React.FC<SwitchThemeProps> = ({ className, moonIconDark, sunIconDark }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  const handleToggle = () => {
    if (isDarkMode) {
      setTheme("light");
      return;
    }
    setTheme("dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
      <Switch className="dark:bg-accent-foreground" checked={isDarkMode} onCheckedChange={handleToggle} />
      {isDarkMode ? (
        <Moon className={moonIconDark ? "text-black" : "text-white"} />
      ) : (
        <Sun className={sunIconDark ? "text-black" : "text-white"} />
      )}
    </div>
  );
};
