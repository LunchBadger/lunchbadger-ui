const systemInformationMessages = (state = [], action) => {
  switch (action.type) {
    case 'SYSTEM_INFORMATION_MESSAGES/ADD':
      return [...state, action.message];
    default:
      return state
  }
}

export default systemInformationMessages;
