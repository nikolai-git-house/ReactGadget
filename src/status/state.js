const initial = {
  progress: false,
  message: {
  },
};

export default (state = initial, action) => {
  let state2 = state;
  const { type, payload } = action;
  switch (type) {
    case 'STATUS_BEGIN_FETCH':
      state2 = {
        ...state2,
        progress: true,
        message: payload,
      };
      break;
    case 'STATUS_END_FETCH':
      state2 = {
        ...state2,
        progress: false,
        message: payload,
      };
      break;
    case 'STATUS_SET_ERROR':
      state2 = {
        ...state2,
        progress: false,
        message: payload,
      };
      break;
    default:
  }
  return state2;
};
