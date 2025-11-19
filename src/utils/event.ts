const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function formatEventPrice(price?: number, isFree?: boolean) {
  if (isFree || !price || price <= 0) {
    return '무료';
  }

  return `${price.toLocaleString()}원`;
}

export function getDDayLabel(dateString?: string | null) {
  if (!dateString) {
    return 'D-0';
  }

  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) {
    return 'D-0';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = Math.round((target.getTime() - today.getTime()) / DAY_IN_MS);
  if (diff === 0) return 'D-Day';
  if (diff < 0) return '종료';
  return `D-${diff}`;
}

export function getShortDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}
