const DAY_IN_MS = 1000 * 60 * 60 * 24;

const pad = (value: number) => value.toString().padStart(2, '0');

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export function formatEventPrice(price?: number | null, isFree?: boolean, priceMax?: number | null) {
  if (isFree) {
    return '무료';
  }
  const min = typeof price === 'number' ? price : typeof priceMax === 'number' ? priceMax : 0;
  const max = typeof priceMax === 'number' ? priceMax : min;
  if (!min && !max) {
    return '무료';
  }
  const normalizedMin = Math.max(0, min);
  const normalizedMax = Math.max(normalizedMin, max);
  // 한국어 주석: 최소/최대가 같으면 단일가, 다르면 범위 표기를 반환해 화면 전반의 규칙을 통일한다.
  if (!normalizedMax || normalizedMin === normalizedMax) {
    return `${normalizedMin.toLocaleString()}원`;
  }
  return `${normalizedMin.toLocaleString()}원 ~ ${normalizedMax.toLocaleString()}원`;
}

export function formatDateOnly(dateString?: string) {
  const parsed = parseDate(dateString);
  if (!parsed) {
    return dateString ?? '';
  }

  const year = parsed.getFullYear();
  const month = pad(parsed.getMonth() + 1);
  const day = pad(parsed.getDate());
  return `${year}-${month}-${day}`;
}

export function formatTimeOnly(timeString?: string) {
  if (!timeString) {
    return '';
  }

  // when backend already returns HH:MM
  const timeParts = timeString.split(':');
  if (timeParts.length >= 2 && Number.isInteger(Number.parseInt(timeParts[0], 10))) {
    return `${pad(Number(timeParts[0]))}:${pad(Number(timeParts[1]))}`;
  }

  const parsed = parseDate(timeString);
  if (!parsed) {
    return timeString;
  }

  return `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

export function formatEventDateTime(dateString?: string, timeString?: string) {
  const datePart = formatDateOnly(dateString);
  const timePart = formatTimeOnly(timeString);

  if (datePart && timePart) {
    return `${datePart} ${timePart}`;
  }

  return datePart || timePart || '';
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

export function formatTimestamp(value?: string) {
  if (!value) return '';
  const parsed = parseDate(value);
  if (!parsed) {
    return value;
  }
  const datePart = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
  const timePart = `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
  return `${datePart} ${timePart}`;
}
