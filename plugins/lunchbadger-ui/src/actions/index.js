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

export const toggleMultiEnvironmentNameEdit = (index, edit) => ({
  type: 'MULTIENVIRONMENTS/TOGGLE_NAME_EDIT',
  index,
  edit,
});

export const updateMultiEnvironmentName= (index, name) => ({
  type: 'MULTIENVIRONMENTS/UPDATE_NAME',
  index,
  name,
});

export const tooltipSet = (content, left, top) => ({
  type: 'TOOLTIP/SET',
  content,
  left,
  top,
});
