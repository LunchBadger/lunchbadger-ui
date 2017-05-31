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

export const showSystemDefcon1 = message => ({
  type: 'SYSTEM_DEFCON1/SHOW',
  message,
});

export const selectMultiEnvironment = index => ({
  type: 'MULTIENVIRONMENTS/SELECT',
  index,
});

export const addMultiEnvironment = () => ({
  type: 'MULTIENVIRONMENTS/ADD',
});

export const toggleMultiEnvironmentDelta = index => ({
  type: 'MULTIENVIRONMENTS/TOGGLE_DELTA',
  index,
});
