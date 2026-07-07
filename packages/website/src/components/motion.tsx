"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Motion helpers — ringan, tanpa dependency tambahan.
   Scroll-reveal pakai IntersectionObserver (sangat reliabel di SSR),
   parallax pakai rAF + transform. Semua menghormati prefers-reduced-motion.
   ───────────────────────────────────────────────────────────── */

// useSyncExternalStore (bukan useState+useEffect) — cara resmi React untuk
// membaca & subscribe ke state eksternal seperti matchMedia, tanpa
// setState sinkron di efek (react-hooks/set-state-in-effect).
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener?.("change", callback);
      return () => mq.removeEventListener?.("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type RevealDirection = "up" | "down" | "left" | "right" | "fade" | "zoom";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Arah masuk animasi. */
  direction?: RevealDirection;
  /** Delay dalam milidetik. */
  delay?: number;
  /** Durasi dalam milidetik. */
  duration?: number;
  /** Jarak translasi (px). */
  distance?: number;
  /** Hanya animasikan sekali. */
  once?: boolean;
  /** Render sebagai elemen lain (mis. "li", "section"). */
  as?: React.ElementType;
  /** Threshold IntersectionObserver. */
  amount?: number;
};

const DIRECTION_OFFSET: Record<
  RevealDirection,
  (d: number) => { x: number; y: number; scale: number }
> = {
  up: (d) => ({ x: 0, y: d, scale: 1 }),
  down: (d) => ({ x: 0, y: -d, scale: 1 }),
  left: (d) => ({ x: d, y: 0, scale: 1 }),
  right: (d) => ({ x: -d, y: 0, scale: 1 }),
  fade: () => ({ x: 0, y: 0, scale: 1 }),
  zoom: () => ({ x: 0, y: 0, scale: 0.92 }),
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = 28,
  once = true,
  as,
  amount = 0.18,
}: RevealProps) {
  const Tag = (as ?? "div") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  // Setelah animasi masuk selesai, transform + will-change dilepas supaya
  // tidak ada compositing layer permanen. Penting: iframe (mis. Google Maps)
  // bisa render blank kalau ada leluhur dengan transform/will-change.
  const [settled, setSettled] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    // reduced=true: style di bawah sudah selalu render tampil penuh terlepas
    // dari `visible`, jadi tidak perlu setState sinkron di sini sama sekali.
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, amount, reduced]);

  // Lepas transform/will-change sesudah transisi selesai (hanya untuk once,
  // karena mode berulang masih butuh transform untuk re-animate).
  React.useEffect(() => {
    if (reduced || !once || !visible) return;
    const t = setTimeout(() => setSettled(true), duration + delay + 60);
    return () => clearTimeout(t);
  }, [reduced, once, visible, duration, delay]);

  const offset = DIRECTION_OFFSET[direction](distance);

  const style: React.CSSProperties = reduced
    ? {}
    : settled
      ? { opacity: 1 }
      : {
          transitionProperty: "opacity, transform",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: `${delay}ms`,
          willChange: "opacity, transform",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate3d(0,0,0) scale(1)"
            : `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${offset.scale})`,
        };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/* Reveal anak-anak secara berurutan (stagger). */
export function RevealGroup({
  children,
  className,
  step = 90,
  startDelay = 0,
  direction = "up",
  ...rest
}: Omit<RevealProps, "children" | "delay"> & {
  children: React.ReactNode;
  step?: number;
  startDelay?: number;
}) {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal
          key={i}
          direction={direction}
          delay={startDelay + i * step}
          {...rest}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/* Parallax — menggeser konten relatif terhadap scroll viewport. */
export function Parallax({
  children,
  className,
  speed = 0.15,
  axis = "y",
}: {
  children: React.ReactNode;
  className?: string;
  /** Positif = bergerak lebih lambat dari scroll (efek kedalaman). */
  speed?: number;
  axis?: "x" | "y";
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      // Posisi relatif elemen terhadap tengah viewport (-1 .. 1)
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      const shift = -progress * speed * 100;
      el.style.transform =
        axis === "y"
          ? `translate3d(0, ${shift}px, 0)`
          : `translate3d(${shift}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, axis, reduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/* Tilt 3D halus saat pointer hover (desktop). */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* Angka yang menghitung naik saat masuk viewport. */
export function CountUp({
  to,
  from = 0,
  duration = 1400,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = React.useState(from);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    // reduced=true ditangani via displayValue di bawah, bukan setState di sini.
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from + (to - from) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, from, duration, reduced]);

  const displayValue = reduced ? to : value;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Awwwards-style primitives
   ───────────────────────────────────────────────────────────── */

/* Bar progres scroll halaman — fixed di paling atas. */
export function ScrollProgress({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(scrollTop / height, 1) : 0;
      el.style.transform = `scaleX(${pct})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        ref={ref}
        className={cn(
          "h-full origin-left bg-gradient-to-r from-[#00b4d8] via-[#1a9ec9] to-[#e8861e]",
          className,
        )}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* Reveal teks per-kata dengan efek "mask" naik dari bawah. */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 60,
  duration = 800,
  as,
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
  duration?: number;
  as?: React.ElementType;
  once?: boolean;
}) {
  const Tag = (as ?? "span") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  React.useEffect(() => {
    // reduced=true: style di bawah mengabaikan `visible` sepenuhnya (pakai
    // undefined), jadi tidak perlu setState sinkron di sini.
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, reduced]);

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-flex overflow-hidden align-bottom"
          style={{ paddingBottom: "0.4em", marginBottom: "-0.4em" }}
        >
          <span
            className={cn("inline-block will-change-transform", wordClassName)}
            style={
              reduced
                ? undefined
                : {
                    transform: visible ? "translateY(0)" : "translateY(170%)",
                    opacity: visible ? 1 : 0,
                    transition: `transform ${duration}ms cubic-bezier(0.16,1,0.3,1), opacity ${duration}ms ease`,
                    transitionDelay: `${delay + i * step}ms`,
                  }
            }
          >
            {word}
          </span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

/* Marquee horizontal tak-berujung (dua salinan). */
export function Marquee({
  children,
  className,
  itemClassName,
  duration = 28,
  reverse = false,
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={cn("marquee-mask group flex w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0",
          !reduced && "animate-gallery-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={
          {
            ["--duration"]: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className={cn("flex shrink-0 items-center", itemClassName)}>
          {children}
        </div>
        <div
          aria-hidden="true"
          className={cn("flex shrink-0 items-center", itemClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* Efek magnetik: elemen tertarik ke arah kursor (desktop). */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn("inline-flex transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  );
}

/* Reveal gambar dengan tirai clip-path yang membuka. */
export function ClipReveal({
  children,
  className,
  delay = 0,
  duration = 1000,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    // reduced=true: style di bawah mengabaikan `visible` sepenuhnya (pakai
    // undefined), jadi tidak perlu setState sinkron di sini.
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? undefined
          : {
              clipPath: visible
                ? "inset(0% 0% 0% 0%)"
                : "inset(0% 0% 100% 0%)",
              transition: `clip-path ${duration}ms cubic-bezier(0.77,0,0.18,1)`,
              transitionDelay: `${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}
