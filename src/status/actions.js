export const statusBeginFetch = msg => ({
  type: 'STATUS_BEGIN_FETCH',
  payload: msg,
});

export const statusEndFetch = msg => ({
  type: 'STATUS_END_FETCH',
  payload: msg,
});

export const statusSetError = msg => ({
  type: 'STATUS_SET_ERROR',
  payload: msg,
});
