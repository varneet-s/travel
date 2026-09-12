import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Compatibility shim for ScrollTrigger.matchMedia forwarding to gsap.matchMedia
if (typeof (ScrollTrigger as any).matchMedia !== 'function') {
  (ScrollTrigger as any).matchMedia = (vars: Record<string, () => void | (() => void)>) => {
    const mm = gsap.matchMedia();
    for (const [key, func] of Object.entries(vars)) {
      mm.add(key, func as any);
    }
    return mm;
  };
}

export { gsap, ScrollTrigger };

export interface ScrollEngineInstance {
  lenis: Lenis;
  ctx: gsap.Context;
  destroy: () => void;
}

export interface ScrollEngineOptions {
  smoothWheel?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  [key: string]: any;
}

/**
 * Initialize centralized smooth scrolling engine synchronizing Lenis with GSAP ScrollTrigger.
 */
export function initScrollEngine(options?: ScrollEngineOptions): ScrollEngineInstance {
  if (typeof window === 'undefined') {
    return {
      lenis: null as any,
      ctx: gsap.context(() => {}),
      destroy: () => {},
    };
  }

  // Clean up any existing global instance to prevent duplicate ticker loops
  if ((window as any).__scrollEngineInstance) {
    try {
      (window as any).__scrollEngineInstance.destroy();
    } catch {
      // Ignore cleanup error from previous instance
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize Lenis smooth scroller
  const lenis = new Lenis({
    duration: prefersReducedMotion ? 0.05 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReducedMotion,
    touchMultiplier: 1.5,
    ...options,
  });

  // 2. Synchronize ScrollTrigger with Lenis scroll updates
  lenis.on('scroll', ScrollTrigger.update);

  // 3. Bind Lenis RAF to GSAP's optimized ticker
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);

  // Disable GSAP lag smoothing to eliminate stutter during fast scrolling / tab changes
  gsap.ticker.lagSmoothing(0);

  // 4. Wrap GSAP animation context for unified lifecycle management
  const ctx = gsap.context(() => {});

  // 5. Expose global references for debugging & cross-component access
  (window as any).__lenis = lenis;

  // 6. Provide comprehensive teardown function
  const destroy = () => {
    gsap.ticker.remove(tickerCallback);
    lenis.off('scroll', ScrollTrigger.update);
    ctx.revert();
    lenis.destroy();
    if ((window as any).__lenis === lenis) {
      delete (window as any).__lenis;
    }
    if ((window as any).__scrollEngineInstance?.destroy === destroy) {
      delete (window as any).__scrollEngineInstance;
    }
  };

  const instance: ScrollEngineInstance = { lenis, ctx, destroy };
  (window as any).__scrollEngineInstance = instance;

  return instance;
}

/**
 * Bind reading progress bar updates directly to Lenis scroll events.
 * Eliminates unthrottled native window.addEventListener('scroll') listeners.
 */
export function bindReadingProgress(lenis: Lenis, progressBarId: string = 'readingProgress'): () => void {
  if (typeof document === 'undefined') return () => {};
  const progressBar = document.getElementById(progressBarId);
  if (!progressBar || !lenis) return () => {};

  const onScroll = (e: any) => {
    const scroll = typeof e.scroll === 'number' ? e.scroll : window.scrollY;
    const limit = typeof e.limit === 'number' ? e.limit : (document.documentElement.scrollHeight - window.innerHeight);
    if (limit > 0) {
      const progress = Math.min(Math.max((scroll / limit) * 100, 0), 100);
      progressBar.style.width = `${progress}%`;
    }
  };

  lenis.on('scroll', onScroll);
  // Initial sync
  onScroll({ scroll: lenis.scroll, limit: lenis.limit });

  return () => lenis.off('scroll', onScroll);
}

/**
 * Bind side wayfinding dots active tracking directly to Lenis scroll events.
 * Eliminates unthrottled native window.addEventListener('scroll') listeners.
 */
export function bindWayfindingDots(
  lenis: Lenis,
  sectionIds: string[] = ['hero', 'dispatch', 'atlas', 'consuming', 'letters', 'volunteer']
): () => void {
  if (typeof document === 'undefined') return () => {};
  const wayfindingDots = document.querySelectorAll<HTMLElement>('.wayfinding-dot');
  if (wayfindingDots.length === 0 || !lenis) return () => {};

  const onScroll = (e: any) => {
    const scrollPos = (typeof e.scroll === 'number' ? e.scroll : window.scrollY) + window.innerHeight * 0.35;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sec = document.getElementById(sectionIds[i]);
      if (sec && sec.offsetTop <= scrollPos) {
        wayfindingDots.forEach((d) => d.classList.remove('active'));
        const activeDot = document.querySelector(`.wayfinding-dot[data-target="${sectionIds[i]}"]`);
        activeDot?.classList.add('active');
        break;
      }
    }
  };

  lenis.on('scroll', onScroll);
  // Initial sync
  onScroll({ scroll: lenis.scroll });

  return () => lenis.off('scroll', onScroll);
}
