/*
Fix line 45 below.
*/


import { organizeStore, removeRow, addDialog, addActions, btnStates } from './storeHelpers';

const initial = {
  agentID: '',
  agentExtension: '',
  agentAction: '',
  callID: '',
  dialog: undefined,
  queue: [],
  doIt: false,
  doItPayload: {},
  disableBtns: false,
  iDebug: false,
  userRole: 'agent',
};
const FETCH_QUEUE_FULFILLED = 'FETCH_QUEUE_FULFILLED';
const INIITIALIZE_STORE = 'INIITIALIZE_STORE';
const CLEAR_STORE = 'CLEAR_STORE';
const ADD_DIALOG_STORE = 'ADD_DIALOG_STORE';
const AGENT_ACTION = 'AGENT_ACTION';
const REMOVE_ROW = 'REMOVE_ROW';
const UI_ACTIONS = 'UI_ACTIONS';
const DO_IT = 'DO_IT';

export default (state = {}, action) => {
  let state2 = state;
  const payload = action.payload ? action.payload : [];
  switch (action.type) {
    case INIITIALIZE_STORE:
      state2 = {
        ...initial,
        iDebug: action.payload.iDbg,
        agentID: action.payload.agentID,
        agentExtension: action.payload.agentExtension,
      };
      break;
    case ADD_DIALOG_STORE:
      state2 = {
        ...state2,
        queue: addDialog(action.payload.dialog, state),
        dialog: action.payload.dialog,
      };
      break;
    case FETCH_QUEUE_FULFILLED:
      state2 = {
        ...state2,
        queue: payload.length > 0 ?
          organizeStore(action.payload, state) : state.queue,
      };
      break;
    case REMOVE_ROW:
      state2 = {
        ...state2,
        agentAction: '',
        callID: '',
        queue: state2.queue.length > 0 ?
          removeRow(action.payload.callID, state.queue) : state.queue,
      };
      break;
    case AGENT_ACTION:
      state2 = {
        ...state2,
        agentAction: action.payload.action,
        callID: action.payload.callID,
        queue: addActions(action.payload.action, action.payload.callID, state.queue),
      };
      break;
    case DO_IT:
      state2 = {
        ...state2,
        doIt: true,
        doItPayload: {
          callID: action.payload.callID,
        },
      };
      break;
    case CLEAR_STORE:
      state2 = {
        ...state2,
        agentAction: '',
        callID: '',
        dialog: undefined,
      };
      break;
    case UI_ACTIONS:
      state2 = {
        ...state2,
        callID: action.payload.callID,
        disableBtns: action.payload.disableBtns,
        queue: btnStates(action.payload.disableBtns, action.payload.callID, state.queue),
      };
      break;
    default:
  }
  return state2;
};
