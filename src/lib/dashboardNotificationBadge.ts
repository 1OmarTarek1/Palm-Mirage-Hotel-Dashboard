import type { DashboardAlert } from "@/components/dashboard/types";

/**
 * Placeholder cards shown when there is nothing actionable — they should not inflate the bell badge.
 */
const NON_ACTION_ALERT_TITLES = new Set([
  "Operations look healthy",
  "Room operations look stable",
  "Activity operations look stable",
  "Restaurant floor looks stable",
]);

export function countAttentionAlertsForBadge(alerts: DashboardAlert[]): number {
  return alerts.filter((a) => !NON_ACTION_ALERT_TITLES.has(a.title)).length;
}

/**
 * Bell badge = unread inbox items + page "Notifications & attention" cards that represent real items to review.
 * (Previously used Math.max(inbox, alerts.length), which hid inbox when both were non-zero.)
 */
export function dashboardBellBadgeCount(inboxUnread: number, alerts: DashboardAlert[]): number {
  return inboxUnread + countAttentionAlertsForBadge(alerts);
}
