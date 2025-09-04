"use client";

import { useEffect, useState } from "react";
import { Switch } from "./ui/shadcn/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const SwitchTheme = ({ className }: { className?: string }) => {
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
      <Switch checked={isDarkMode} onCheckedChange={handleToggle} />
      {isDarkMode ? <Moon /> : <Sun />}
    </div>
  );
};

// <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
//      <input
//       id="theme-toggle"
//       type="checkbox"
//       className="toggle bg-secondary toggle-primary hover:bg-accent transition-all"
//       onChange={handleToggle}
//       checked={isDarkMode}
//     />
//     <label htmlFor="theme-toggle" className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}>
//       {/* <SunIcon className="swap-on h-5 w-5" />
//       {/* <MoonIcon className="swap-off h-5 w-5" />
//     </label>
//   </div>
