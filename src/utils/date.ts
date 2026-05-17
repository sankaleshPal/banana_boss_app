export function getTodayRange(): { from: number; to: number } {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}

export function getYesterdayRange(): { from: number; to: number } {
  const from = new Date();
  from.setDate(from.getDate() - 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setDate(to.getDate() - 1);
  to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}

export function getThisWeekRange(): { from: number; to: number } {
  const now = new Date();
  const day = now.getDay();
  const from = new Date(now);
  from.setDate(now.getDate() - day);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}

export function getThisMonthRange(): { from: number; to: number } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}

export function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Billing-timing helpers (ported from banana_boss reportDateRange.ts) ──────

/**
 * Apply a billing start/end time (minutes-from-midnight) to a calendar Date.
 * Handles the legacy case where a full timestamp was stored instead of minutes:
 * any value > 1440 is treated as a timestamp and hours/minutes are extracted.
 */
export function applyBillingTime(date: Date, rawValue: number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  let minutes = typeof rawValue === 'number' ? rawValue : 0;
  if (minutes > 1440) {
    const tmp = new Date(minutes);
    minutes = tmp.getHours() * 60 + tmp.getMinutes();
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Convert a calendar date-range into the correct billing window.
 * Mirrors banana_boss getBusinessDayRange exactly:
 *  - from = billingStartTime on the first selected day
 *  - to   = billingEndTime on (last day + 1), minus 1 ms
 * When both times are 0, produces a standard midnight-to-midnight range.
 */
export function getBusinessDayRange(
  from: Date,
  to: Date,
  startTime: number,
  endTime: number,
): { from: Date; to: Date } {
  const fromDate = applyBillingTime(from, startTime);
  const nextDay = new Date(to);
  nextDay.setDate(nextDay.getDate() + 1);
  const rawToDate = applyBillingTime(nextDay, endTime);
  const toDate = new Date(rawToDate.getTime() - 1);
  return { from: fromDate, to: toDate };
}
