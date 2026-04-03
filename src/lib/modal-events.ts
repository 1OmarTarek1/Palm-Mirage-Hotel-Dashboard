export const DASHBOARD_MODAL_EVENTS = {
  usersAdd: "dashboard:users:add",
  roomsAdd: "dashboard:rooms:add",
  facilitiesAdd: "dashboard:facilities:add",
  activitiesAdd: "dashboard:activities:add",
  menuAdd: "dashboard:menu:add",
  activitySchedulesAdd: "dashboard:activity-schedules:add",
} as const;

export type DashboardModalEvent =
  (typeof DASHBOARD_MODAL_EVENTS)[keyof typeof DASHBOARD_MODAL_EVENTS];
