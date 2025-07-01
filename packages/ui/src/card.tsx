import * as React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  href?: string;
}

export function Card({
  title,
  children,
  href,
  className,
  ...props
}: CardProps) {
  if (href && title) {
    // Legacy card with link behavior
    return (
      <a
        className={cn(
          "group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30",
          className
        )}
        href={`${href}?utm_source=create-turbo&utm_medium=with-tailwind&utm_campaign=create-turbo"`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          {title}{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">{children}</p>
      </a>
    );
  }

  // New shadcn/ui card behavior
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
