import type { TFunction } from 'i18next';
import i18n from '../i18n/config';

export function getErrorDetail(err: unknown): string | undefined {
  const e = err as {
    response?: { data?: { detail?: unknown } };
  };
  const d = e.response?.data?.detail;
  if (typeof d === 'string') return d;
  if (Array.isArray(d) && d.length > 0) {
    const first = d[0] as { msg?: string };
    if (typeof first?.msg === 'string') return first.msg;
  }
  return undefined;
}

export function translateBackendError(
  detail: string | undefined,
  t: TFunction,
  fallbackKey = 'backErrors.UNKNOWN'
): string {
  if (!detail) return t(fallbackKey);
  const key = `backErrors.${detail}`;
  const translated = t(key);
  if (translated && translated !== key) return translated;
  return detail;
}

export function translateBackendErrorFromErr(
  err: unknown,
  t: TFunction,
  fallbackKey = 'backErrors.UNKNOWN'
): string {
  return translateBackendError(getErrorDetail(err), t, fallbackKey);
}

export function translateBackendErrorSync(
  detail: string | undefined,
  fallbackKey = 'backErrors.UNKNOWN'
): string {
  if (!detail) return i18n.t(fallbackKey);
  const key = `backErrors.${detail}`;
  if (i18n.exists(key)) return i18n.t(key);
  return detail;
}
