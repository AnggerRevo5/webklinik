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
            "mb-3 flex w-fit items-center gap-2 rounded-full border border-[#00b4d8]/20 bg-[#00b4d8]/8 px-3 py-1",
            align === "center" && "mx-auto justify-center",
          )}
        >
          <Star className="h-4 w-4 fill-[#00b4d8] text-[#00b4d8]" aria-hidden />
          <span className="t-overline text-[#00b4d8]">{label}</span>
        </div>
      )}
      <HeadingTag
        className={cn(
          "t-h2 accent-underline inline-block font-bold text-[#3f3f3f]",
          align === "center" && "after:left-1/2 after:-translate-x-1/2",
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <p
          className={cn(
            "t-body mt-6 max-w-[640px] text-[#6b7280]",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
