export const addSystemInformationMessage = message => ({
  type: 'SYSTEM_INFORMATION_MESSAGES/ADD',
  message,
});

export const shiftSystemInformationMessage = () => ({
  type: 'SYSTEM_INFORMATION_MESSAGES/SHIFT',
});

export const addSystemNotification = notification => ({
  type: 'SYSTEM_NOTIFICATIONS/ADD',
  notification,
});
