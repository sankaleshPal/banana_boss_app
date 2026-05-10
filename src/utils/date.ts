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
