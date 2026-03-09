'use client';

export type Platform = 'web' | 'ios' | 'android';

export function getPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';

  const userAgent = navigator.userAgent || '';

  // Capacitor sets this on native platforms
  if ((window as unknown as Record<string, unknown>).Capacitor) {
    const capacitor = (window as unknown as Record<string, unknown>).Capacitor as Record<string, unknown>;
    const platform = capacitor.getPlatform as () => string | undefined;
    if (typeof platform === 'function') {
      const p = platform();
      if (p === 'ios') return 'ios';
      if (p === 'android') return 'android';
    }
  }

  // Fallback detection
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  if (/android/i.test(userAgent)) return 'android';

  return 'web';
}

export function isNative(): boolean {
  return typeof window !== 'undefined' && !!(window as unknown as Record<string, unknown>).Capacitor;
}

export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

export function isAndroid(): boolean {
  return getPlatform() === 'android';
}
