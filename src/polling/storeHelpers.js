import { agentaPostRequest } from './services';

export const organizeStore = (payload1, props) => {
  let tmpState = [];
  const queue = props.queue || [];
  const payload = payload1 || [];
  if (payload.length > 0 && queue.length < 1) {
    tmpState = payload;
  } else {
    payload.forEach((value) => {
      const tmp = queue.filter(x => value.callID !== x.callID);
      tmpState = tmpState.concat(tmp);
      tmpState = tmpState.filter(x => x);
    });
  }
  tmpState = tmpState.concat(payload);
  const hash = o => (o.callID);
  const hashesFound = {};
  tmpState.forEach((o) => {
    hashesFound[hash(o)] = o;
  });
  let results1 = Object.keys(hashesFound).map(k => hashesFound[k]);
  results1 = results1.filter(x => x.isRemoved !== 'true');
  const results = [];
  results1.forEach((obj) => {
    obj.dialog = obj.dialog || undefined;
    if (obj.dialog) {
      if (obj.dialog._data.state === 'ALERTING') {
        props.agentAction = 'ANSWER';
        props.callID = obj.callID;
        props.dialog = obj.dialog;
        obj.agentAction = 'ANSWER';
      }
    }
    results.push(obj);
  });
  return results;
};
export const removeRow = (value, queue) => {
  let results = queue;
  results = results.filter(obj => obj.callID !== value);
  return results;
};
export const addDialog = (dialog, props) => {
  const results1 = props.queue || [];
  const results = [];
  results1.forEach((obj) => {
    obj.dialog = obj.dialog || undefined;
    obj.dialog = obj.ani === dialog._data.fromAddress ? dialog : obj.dialog;
    if (obj.dialog) {
      if (obj.dialog._data.state === 'ALERTING') {
        props.agentAction = 'ANSWER';
        props.callID = obj.callID;
        props.dialog = obj.dialog;
        obj.agentAction = 'ANSWER';
        agentaPostRequest('update', obj.callID, props.agentID, props.agentExtension, (data) => {
          console.log(data);
        });
      }
    }
    results.push(obj);
  });
  return results;
};
export const addActions = (agentAction, callID, queue) => {
  const results1 = queue || [];
  const results = [];
  results1.forEach((obj) => {
    obj.agentAction = obj.agentAction || '';
    obj.agentAction = obj.callID === callID ? agentAction : obj.agentAction;
    obj.isParked = false;
    if (agentAction === 'PARK') {
      obj.isParked = true;
    }
    results.push(obj);
  });
  return results;
};
export const btnStates = (disableBtns, callID, queue) => {
  const results1 = queue || [];
  const results = [];
  results1.forEach((obj) => {
    obj.disableBtns = obj.disableBtns || false;
    obj.disableBtns = obj.callID === callID ? disableBtns : obj.disableBtns;
    results.push(obj);
  });
  return results;
};
