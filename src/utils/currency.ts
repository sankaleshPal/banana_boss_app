export function formatINR(n: any): string {
  const val = Number(n);
  const safeNum = isNaN(val) || !isFinite(val) ? 0 : val;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNum);
}
