const convert = require('xml-js');

const FETCH_QUEUE_FULFILLED = 'FETCH_QUEUE_FULFILLED';
const FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED';
const API_SERVER = 'https://vm-ephraim-1.dev.in.spinsci.com/visualq/';
const FINESSE_USER_ENDPOINT = 'https://vm-ephraim-1.dev.in.spinsci.com/finesse/api/User/';
const QUEUE_END_POINT = 'bindFromFinesse?agentID=';

export const fetchQueue = aID => (
  (dispatch) => {
    fetch(`${API_SERVER}${QUEUE_END_POINT}${aID}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data, 'in reposnse the removeCall is DONE SOMEHOW.');
        dispatch(fetchQueue(aID));
        dispatch({
          type: FETCH_QUEUE_FULFILLED,
          payload: data.response,
        });
      });
  }
);

export const agentaPostRequest = (actionType, callID, agentID, agentExtension, cb) => (
  () => {
    const opts = {
      callID,
      agentID,
      agentExtension,
    };
    fetch(`${API_SERVER}${actionType}Call`, {
      method: 'post',
      body: JSON.stringify(opts),
    })
      .then(response => response.json())
      .then((data) => {
        cb(data);
        console.log(data, '<------Test');
      });
  }
);

export const getUser = aID => (
  (dispatch) => {
    fetch(`${FINESSE_USER_ENDPOINT}${aID}`)
      .then(response => response.json())
      .then((data) => {
        console.log('GetUser Resonse = ');
        console.log(data.response);
        console.log('Converted JS Response =');
        const jsData = convert.xml2json(data.response, { compact: true, spaces: 4 });
        console.log(jsData);
        dispatch({
          type: FETCH_USER_FULFILLED,
          payload: jsData,
        });
      });
  }
);

export const agentaGetRequest = (actionType, callID) => (
  () => {
    console.log(`Deq--->${actionType}---->${callID}--->${API_SERVER}${actionType}Call`);
    fetch(`${API_SERVER}${actionType}Call/${callID}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
      });
  }
);
