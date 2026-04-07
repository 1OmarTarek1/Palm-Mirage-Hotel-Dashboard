/**
 * Lets any dashboard socket instance nudge the persisted notification inbox (badge + list)
 * without coupling table components to inbox state.
 */
let refreshFn: (() => void) | null = null;
let throttleTimer: ReturnType<typeof setTimeout> | null = null;

export function registerPersistedNotificationRefresh(fn: () => void) {
  refreshFn = fn;
}

export function unregisterPersistedNotificationRefresh(fn: () => void) {
  if (refreshFn === fn) {
    refreshFn = null;
  }
}

export function triggerPersistedNotificationRefresh() {
  if (!refreshFn) return;
  if (throttleTimer) return;
  throttleTimer = setTimeout(() => {
    throttleTimer = null;
    refreshFn?.();
  }, 400);
}
