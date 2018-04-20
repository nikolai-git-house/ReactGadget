export const enableButtonsAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'UI_ACTIONS',
      payload: {
        callID,
        disableBtns: false,
      },
    });
  }
);
export const disableButtonsAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'UI_ACTIONS',
      payload: {
        callID,
        disableBtns: true,
      },
    });
  }
);
export const answerCallAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'AGENT_ACTION',
      payload: {
        action: 'ANSWER',
        callID,
      },
    });
  }
);
export const dropCallAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'AGENT_ACTION',
      payload: {
        action: 'DROP',
        callID,
      },
    });
  }
);
export const removeRowAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'REMOVE_ROW',
      payload: {
        callID,
      },
    });
  }
);
export const parkCallAction = callID => (
  (dispatch) => {
    dispatch({
      type: 'AGENT_ACTION',
      payload: {
        action: 'PARK',
        callID,
      },
    });
  }
);
