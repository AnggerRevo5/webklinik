import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

type SectionProps = {
  id?: string;
  bg?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  bg,
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("section-shell", bg, className)}>
      <div className={cn("section-wrap", innerClassName)}>{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h2" | "h3";
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  className,
  titleClassName,
  as: HeadingTag = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "section-header",
        align === "center" && "text-center",
        className,
      )}
    >
      {label && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2",
            align === "center" && "justify-center",
          )}
        >
          <Star className="h-5 w-5 fill-[#00b4d8] text-[#00b4d8]" aria-hidden />
          <span className="t-overline text-[#00b4d8]">{label}</span>
        </div>
      )}
      <HeadingTag
        className={cn(
          "t-h2 font-bold text-[#3f3f3f]",
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <p
          className={cn(
            "t-body mt-3 max-w-[640px] text-[#6b7280]",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
