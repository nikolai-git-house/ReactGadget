import store from './poll';
import { parkCallAction } from './actions';

export const callActions = (props) => {
  const {
    dialog,
    agentAction,
    callID,
    extension,
  } = props;
  console.log(dialog, '<----- is dialog present');
  if (dialog) {
    console.log(dialog, agentAction, '<-----2');
    dialog.getParticipants().forEach((participant) => {
      console.log(participant, '<-----3');
      console.log(participant.mediaAddress, '<-----4', agentAction, extension);
      if (participant.mediaAddress === extension) {
        console.log(participant.mediaAddress, '<-----5', dialog.requestAction);
        const buttonAction = dialog.requestAction.bind(
          dialog, participant.mediaAddress, agentAction, {
            error: (rsp) => {
              if (rsp) {
                console.log(`==>(snapjs) error in error, dialog action attempt ${agentAction}+  and response returned is +${JSON.stringify(rsp)}`);
              } else {
                console.error(`==>(snapjs) error in error1, dialog action attempt ${agentAction} and response returned is ${rsp}`);
              }
            },
            success: (rsp) => {
              console.info(`==>(snapjs)[dialog,events] Success returned , ${agentAction}, and response ,${JSON.stringify(rsp)}`);
            },
          },
        );
        if (agentAction === 'ANSWER') {
          const el = document.getElementById(`answer${callID}`);
          console.log(`answer${callID}`, '090909090909090909090909090909090990---1');
          el[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? 'click' : 'onclick', buttonAction, false);
        } else if (agentAction === 'DROP') {
          const el = document.getElementById(`hangup${callID}`);
          console.log(`hangup${callID}`, '090909090909090909090909090909090990---2');
          el[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? 'click' : 'onclick', buttonAction, false);
        } else if (agentAction === 'HOLD') {
          const el = document.getElementById(`park${callID}`);
          console.log(`park${callID}`, '090909090909090909090909090909090990---3');
          el[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? 'click' : 'onclick', buttonAction, false);
        }
      }
    });
  }
};
export const transferAction = (props) => {
  const {
    dialog,
    toAddress,
    callID,
    extension,
  } = props;
  if (dialog) {
    dialog.getParticipants().forEach((participant) => {
      console.log(participant, '<-----3a');
      console.log(participant.mediaAddress, '<-----4a', toAddress, '749923');
      if (participant.mediaAddress === extension) {
        console.log(participant.mediaAddress, '<-----5a', dialog.initiateDirectTransfer);
        const buttonAction = dialog.initiateDirectTransfer.bind(
          dialog, participant.mediaAddress, toAddress, {
            error: (rsp) => {
              if (rsp) {
                console.log(`==>(snapjs) error in error, dialog action attempt ${toAddress}+  and response returned is +${JSON.stringify(rsp)}`);
              } else {
                console.error(`==>(snapjs) error in error1, dialog action attempt ${toAddress} and response returned is ${rsp}`);
              }
            },
            success: (rsp) => {
              console.info(`==>(snapjs)[dialog,events] Success returned , ${toAddress}, and response ,${JSON.stringify(rsp)}`);
              store.dispatch(parkCallAction(callID));
            },
          },
        );
        const el = document.getElementById(`park${callID}`);
        console.log(`park${callID}`, '090909090909090909090909090909090990---1a');
        el[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? 'click' : 'onclick', buttonAction, false);
      }
    });
  }
};
