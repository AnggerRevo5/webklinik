declare module 'aos' {
  interface AosOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
    delay?: number;
    anchor?: string;
    anchorPlacement?: string;
    disable?: boolean | string | (() => boolean);
  }

  interface Aos {
    init(options?: AosOptions): void;
    refresh(initialize?: boolean): void;
    refreshHard(): void;
  }

  const aos: Aos;
  export default aos;
}
