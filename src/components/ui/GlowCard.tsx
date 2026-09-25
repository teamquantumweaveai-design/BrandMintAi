"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  borderRadius?: string;
  innerClassName?: string;
}

export default function GlowCard({
  children,
  className,
  glowColor = "rgba(255, 92, 53, 0.08)",
  borderColor = "rgba(255, 92, 53, 0.3)",
  borderRadius = "rounded-2xl",
  innerClassName,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative p-[1px] overflow-hidden bg-white border border-[#CBD6E2] shadow-[0_4px_18px_rgba(46,56,77,0.04)] hover:shadow-[0_10px_30px_rgba(46,56,77,0.08)] transition-all duration-300",
        borderRadius,
        className
      )}
      {...props}
    >
      {/* Outer Border Glow Mask */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(250px circle at ${coords.x}px ${coords.y}px, ${borderColor}, transparent 70%)`,
        }}
      />
      
      {/* Card Content Inner Container */}
      <div className={cn("relative z-10 w-full h-full bg-white p-6", borderRadius, innerClassName)}>
        {/* Inside background glow */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
        <div className="relative z-20">
          {children}
        </div>
      </div>
    </div>
  );
}
