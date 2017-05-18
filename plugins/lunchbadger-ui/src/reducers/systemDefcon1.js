const systemDefcon1 = (state = '', action) => {
  switch (action.type) {
    case 'SYSTEM_DEFCON1/SHOW':
      return action.message;
    default:
      return state;
  }
}

export default systemDefcon1;
