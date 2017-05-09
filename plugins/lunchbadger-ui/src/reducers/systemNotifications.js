const initialState = {
  errors: [],
  visible: true,
}

const SystemNotifications = (state = initialState, action) => {
  switch (action.type) {
    case 'SYSTEM_NOTIFICATIONS/ADD':
      const {notification} = action;
      notification.output = notification.output.replace(/^(\n)*/, '');
      if (state.errors.filter(item => item.output === notification.output).length === 0) {
        return {
          errors: [notification, ...state.errors],
          visible: state.visible,
        };
      }
      return state;
    case 'SYSTEM_NOTIFICATIONS/TOGGLE':
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
}

export default SystemNotifications;
