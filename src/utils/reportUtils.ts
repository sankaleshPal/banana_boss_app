export function itemTypeLabel(type: string): string {
  switch (type?.toUpperCase()) {
    case 'VEG':
      return 'VEG';
    case 'NON-VEG':
    case 'NON_VEG':
      return 'NON-VEG';
    case 'VEGAN':
      return 'VEGAN';
    default:
      return type || '-';
  }
}

export function formatHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function formatValue(val: unknown): string {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? val.toString() : val.toFixed(2);
  }
  return String(val);
}
