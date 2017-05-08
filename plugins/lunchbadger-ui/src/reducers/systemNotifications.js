const SystemNotifications = (state = [], action) => {
  switch (action.type) {
    case 'SYSTEM_NOTIFICATIONS/ADD':
      if (state.filter(item => item.output === action.notification.output).length === 0) {
        return [action.notification, ...state];
      }
      return state;
    case 'SYSTEM_NOTIFICATIONS/REMOVE':
      return [];
    default:
      return state;
  }
}

export default SystemNotifications;
