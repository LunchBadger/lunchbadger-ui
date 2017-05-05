const systemInformationMessages = (state = [], action) => {
  switch (action.type) {
    case 'SYSTEM_INFORMATION_MESSAGES/ADD':
      return [...state, action.message];
    case 'SYSTEM_INFORMATION_MESSAGES/SHIFT':
      return state.filter((item, idx) => idx > 0);
    default:
      return state
  }
}

export default systemInformationMessages;
