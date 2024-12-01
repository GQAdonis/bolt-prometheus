import type { ChatHistoryItem } from '~/lib/persistence';

export function binDates(list: ChatHistoryItem[]): [string, ChatHistoryItem[]][] {
  const sorted = list.toSorted((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const bins = new Map<string, ChatHistoryItem[]>();

  sorted.forEach((item) => {
    const date = new Date(item.timestamp);
    const category = dateCategory(date);
    
    if (!bins.has(category)) {
      bins.set(category, []);
    }
    bins.get(category)!.push(item);
  });

  return Array.from(bins.entries());
}

function dateCategory(date: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, now)) {
    return 'Today';
  }
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }
  if (isThisWeek(date, now)) {
    return 'This Week';
  }
  if (isLastWeek(date, now)) {
    return 'Last Week';
  }
  if (isThisMonth(date, now)) {
    return 'This Month';
  }
  return 'Older';
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isThisWeek(date: Date, now: Date): boolean {
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  return date >= weekStart && date <= now;
}

function isLastWeek(date: Date, now: Date): boolean {
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() - 7);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() - now.getDay() - 1);
  return date >= weekStart && date <= weekEnd;
}

function isThisMonth(date: Date, now: Date): boolean {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}
