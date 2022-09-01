export function getStartOfDayDate(): string {
  const date: Date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}
