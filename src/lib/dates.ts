const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format manually instead of using Intl so server and client time zones never disagree.
export function formatMonth(date: string | null) {
  if (!date) return "Present";
  const [year, month] = date.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}

// Stored as the first of the month; <input type="month"> wants YYYY-MM.
export const toMonthInput = (date?: string | null) => date?.slice(0, 7) ?? "";
