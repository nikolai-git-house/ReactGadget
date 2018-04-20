import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'rxjs';
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
import { agentaGetRequest } from './polling/services';
import { dropCallAction, removeRowAction } from './polling/actions';

const Dashboard = {
  init(root, cb) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      root,
    );
    registerServiceWorker();
    // notify init completed
    if (cb) {
      cb();
    }
  },

  start(agentID, agentExtension, iDbg) {
    store.dispatch({
      type: 'INIITIALIZE_STORE',
      payload: {
        agentID,
        agentExtension,
        iDbg,
      },
    });
  },

  addDialog(dialog) {
    store.dispatch({
      type: 'ADD_DIALOG_STORE',
      payload: {
        dialog,
      },
    });
  },

  end() {
    store.dispatch({
      type: 'CLEAR_STORE',
    });
  },

  callStates(callstate, fromAddress) {
    const state = store.getState();
    const {
      queue = [],
    } = state.fetchQueueReducer;
    console.log(queue, callstate, store.getState(), '<--- queue', fromAddress);
    const calltoAct = queue.find(x => x.ani === fromAddress);
    console.log(calltoAct, '<--- calltoAct');
    if (Object.keys(calltoAct).length > 0) {
      const cID = calltoAct.callID;
      console.log(cID, '<--- cID');
      if (callstate === 'drop') {
        store.dispatch(removeRowAction(cID));
        store.dispatch(agentaGetRequest('delete', cID));
      } else if (callstate === 'answer') {
        store.dispatch(dropCallAction(cID));
      }
    }
  },
};

export default Dashboard;

