export const addSystemNotification = notification => ({
  type: 'SYSTEM_NOTIFICATIONS/ADD',
  notification,
});

export const toggleSystemNotifications = visible => ({
  type: 'SYSTEM_NOTIFICATIONS/TOGGLE',
  visible,
});

export const tooltipSet = (content, left, top) => ({
  type: 'TOOLTIP/SET',
  content,
  left,
  top,
});
