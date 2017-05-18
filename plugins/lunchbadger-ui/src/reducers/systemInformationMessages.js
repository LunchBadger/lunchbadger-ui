const systemInformationMessages = (state = [], action) => {
  switch (action.type) {
    case 'SYSTEM_INFORMATION_MESSAGES/ADD':
      const newStateAdd = [...state];
      const validUntil = Date.now() + 5000;
      if (state.filter(item => item.message === action.message.message).length > 0) {
        newStateAdd.forEach((item, idx) => {
          if (item.message === action.message.message) {
            newStateAdd[idx].validUntil = validUntil;
          }
        });
        return newStateAdd;
      }
      return [
        {
          ...action.message,
          validUntil,
        },
        ...state,
      ];
    case 'SYSTEM_INFORMATION_MESSAGES/REMOVE':
      const newStateRemove = [];
      state.forEach((item) => {
        if (!action.messages.includes(item.message)) {
          newStateRemove.push(item);
        }
      });
      return newStateRemove;
    default:
      return state;
  }
}

export default systemInformationMessages;
