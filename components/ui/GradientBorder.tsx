import React from "react";
import { cn } from "@/lib/utils";

interface GradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  borderRadius?: string; // e.g. "rounded-xl", "rounded-2xl", etc.
}

export default function GradientBorder({
  children,
  className,
  innerClassName,
  borderRadius = "rounded-2xl",
  ...props
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        "p-[1.5px] bg-gradient-to-br from-accent-from/20 via-accent-mid/10 to-accent-to/20 transition-all duration-300 hover:from-accent-from/40 hover:via-accent-mid/30 hover:to-accent-to/40",
        borderRadius,
        className
      )}
      {...props}
    >
      <div className={cn("bg-surface w-full h-full", borderRadius, innerClassName)}>
        {children}
      </div>
    </div>
  );
}
