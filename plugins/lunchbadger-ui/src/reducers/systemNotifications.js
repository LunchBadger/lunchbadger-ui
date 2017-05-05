const SystemNotifications = (state = [], action) => {
  switch (action.type) {
    case 'SYSTEM_NOTIFICATIONS/ADD':
      return [...state, action.notification];
    default:
      return state;
  }
}

export default SystemNotifications;
