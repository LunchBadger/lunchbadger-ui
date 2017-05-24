export const addSystemInformationMessage = message => ({
  type: 'SYSTEM_INFORMATION_MESSAGES/ADD',
  message,
});

export const removeSystemInformationMessages = messages => ({
  type: 'SYSTEM_INFORMATION_MESSAGES/REMOVE',
  messages,
});

export const addSystemNotification = notification => ({
  type: 'SYSTEM_NOTIFICATIONS/ADD',
  notification,
});

export const toggleSystemNotifications = visible => ({
  type: 'SYSTEM_NOTIFICATIONS/TOGGLE',
  visible,
});

export const addSystemDefcon1 = error => ({
  type: 'SYSTEM_DEFCON1/ADD',
  error,
});

export const toggleSystemDefcon1 = () => ({
  type: 'SYSTEM_DEFCON1/TOGGLE',
});
