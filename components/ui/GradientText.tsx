import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}

export default function GradientText({
  children,
  className,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        "bg-gradient-to-r from-accent-from via-accent-mid to-accent-to bg-clip-text text-transparent inline-block font-bold",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
