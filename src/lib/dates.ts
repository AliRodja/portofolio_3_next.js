const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2025-01-01" -> "Jan 2025", and no date -> "Present". Done by hand rather
// than with Intl, so the server and the browser never disagree because of a
// time zone.
export function formatMonth(date: string | null) {
  if (!date) return "Present";
  const [year, month] = date.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}

// Stored as the first of the month; <input type="month"> wants YYYY-MM.
export const toMonthInput = (date?: string | null) => date?.slice(0, 7) ?? "";
