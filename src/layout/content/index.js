import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactTable from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';
import faCheck from '@fortawesome/fontawesome-free-solid/faHandPointer';
import faSignal from '@fortawesome/fontawesome-free-solid/faSignal';
import faCheckMark from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faShare from '@fortawesome/fontawesome-free-solid/faShare';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faPhoneVolume from '@fortawesome/fontawesome-free-solid/faPhoneVolume';
import Ionicon from 'react-ionicons';

import style from './main.css';
import Footer from '../footer';
import { fetchUser, fetchQueue, agentaPostRequest, agentaGetRequest } from '../../polling/services';
import { callActions, transferAction } from '../../polling/finesseActions';
import { enableButtonsAction, disableButtonsAction, dropCallAction, removeRowAction, answerCallAction, parkCallAction } from '../../polling/actions';

const handleChange = () => {};
const commonButtonName = 'btnIdentify';
const vmNumber = '999123456';
const enableColor = 'black';
const disableColor = 'lightgray';

class Content extends Component {
  componentDidMount = () => {
    console.log('Component mounted.', this.props);
  };
  componentDidUpdate = () => {
    if ((this.props.agentAction === 'ANSWER' || this.props.agentAction === 'DROP') && this.props.callID !== '' && this.props.dialog !== undefined) {
      const calltoAct = this.props.queue.filter(x => x.callID === this.props.callID);
      if (calltoAct.length > 0) {
        const cActions = {
          dialog: calltoAct[0].dialog,
          agentAction: calltoAct[0].agentAction,
          callID: this.props.callID,
          extension: this.props.agentExtension,
        };
        callActions(cActions);
        if (this.props.agentAction === 'ANSWER') {
          const parkActions = {
            toAddress: vmNumber,
            dialog: calltoAct[0].dialog,
            callID: this.props.callID,
            extension: this.props.agentExtension,
          };
          transferAction(parkActions);
        }
      }
    }
  };
  componentWillReceiveProps(newProp){
    if(newProp.agentID != this.props.agentID)
    {
      this.props.getuser(newProp.agentID);
    }
  }
  componentWillUnmount = () => {
    console.log('Component un-mounted.');
  };
  handleRefresh = () => {
    this.props.getQueue(this.props.agentID);
    this.props.getUser(this.props.agentID);
  };
  handlePick = (callID) => {
    this.props.pickCall('pick', callID, this.props.agentID, this.props.agentExtension, this.props.iDebug);
  };
  handleAnswer = (callID) => {
    this.props.answerCall(callID, this.props.agentExtension, this.props.iDebug);
  };
  handleHangup= (callID) => {
    this.props.hangupCall(callID, this.props.iDebug);
  };
  handleDequeue = (callID) => {
    this.props.dequeueCall('dequeue', callID, this.props.agentID, this.props.agentExtension);
    this.props.removeUIRow(callID);
  };
  handlePark = (callID, dialog) => {
    this.props.handleParkCall(callID, this.props.iDebug);
    console.log(callID, dialog, '<----- call parked');
  };
  handleVM = (callID) => {
    console.log('transfered call....');
    this.props.vmCall('vm', callID);
    this.props.removeUIRow(callID);
  };
  tableClick = (state, rowInfo) => {
    // (state, rowInfo, column, instance)
    let rowColor = '';
    if (rowInfo) {
      if (rowInfo.original.agentAction === 'DROP') {
        rowColor = 'lightBlue';
      }
    }
    return {
      onClick: (e, handleOriginal) => {
        /*
        console.log('A Td Element was clicked!');
        console.log('it produced this event:', e);
        console.log('It was in this column:', column);
        console.log('It was in this row:', rowInfo);
        console.log('It was in this table instance:', instance);
        */
        if (handleOriginal) {
          handleOriginal();
        }
      },
      style: {
        background: rowColor,
        color: 'black',
      },
    };
  }
  renderPICKButtons = (e) => {
    e.agentAction = e.agentAction || '';
    const disableClass = e.disableBtns ? style.disableAllBtns : '';
    const iconColors = e.agentAction !== '' && e.agentAction === 'ANSWER' ? style.gray : style.black;

    let pickBtn = (
      <div className={style.centerdiv}>
        <button className={[commonButtonName, disableClass, style.callbuttons].join(' ')} id={`pick${e.callID}`} onClick={() => this.handlePick(e.callID)}>
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" className={iconColors} />
          <p className={[style.buttonlabel, iconColors].join(' ')}>Pick</p>
        </button>
      </div>
    );
    if (e.agentAction !== '') {
      const pickStyle = e.agentAction === 'ANSWER' ? style.disable : style.enable;
      pickBtn = (
        <div className={style.centerdiv}>
          <button id={`park${e.callID}`} className={[pickStyle, commonButtonName, disableClass, style.callbuttons].join(' ')} onClick={() => this.handlePark(e.callID, e.dialog)}>
            <FontAwesomeIcon icon={faPause} aria-hidden="true" className={iconColors} />
            <p className={[style.buttonlabel, iconColors].join(' ')}>Hold</p>
          </button>
        </div>
      );
    }
    return pickBtn;
  };
  renderANSButtons = (e) => {
    e.agentAction = e.agentAction || '';
    const disableClass = e.disableBtns ? style.disableAllBtns : '';
    const answerStyle = e.agentAction === '' ? style.disable : style.enable;
    const answerIconStyle = e.agentAction === 'DROP' ? style.hangup : style.answer;
    const iconColors = e.agentAction === '' ? style.gray : '';

    let idAnswer = 'answer';
    if (e.agentAction === 'DROP') {
      idAnswer = 'hangup';
    }
    let clickEventHandler = this.handleAnswer;
    if (e.agentAction === 'DROP') {
      clickEventHandler = this.handleHangup;
    }
    const ansBtn = (
      <div className={style.centerdiv}>
        <button onClick={() => clickEventHandler(e.callID)} className={[answerStyle, commonButtonName, disableClass, style.callbuttons].join(' ')} aria-hidden={false} id={`${idAnswer}${e.callID}`}>
          <FontAwesomeIcon className={[answerIconStyle, iconColors].join(' ')} icon={faPhone} aria-hidden="true" />
          <p className={[style.buttonlabel, iconColors].join(' ')}>{idAnswer.charAt(0).toUpperCase() + idAnswer.slice(1)}</p>
        </button>
      </div>
    );
    return ansBtn;
  };
  renderVMButtons = (e) => {
    e.agentAction = e.agentAction || '';
    const disableClass = e.disableBtns ? style.disableAllBtns : '';
    const iconColors = e.agentAction !== '' ? style.gray : style.black;
    const vmColor = e.agentAction !== '' ? disableColor : enableColor;
    let vmBtn = (
      <div className={style.centerdiv}>
        <button className={[commonButtonName, disableClass, style.callbuttons].join(' ')} id={`vm${e.callID}`} onClick={() => this.handleVM(e.callID)}>
          {/*
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" className={iconColors} />
          */}
          <Ionicon icon="ios-recording-outline" color={vmColor} md="md-recording" />
          <p className={[style.buttonlabel, iconColors].join(' ')}>Voicemail</p>
        </button>
      </div>
    );
    //if (e.agentAction !== '') { //Disable VM Button
    if (e.call_type.charAt(0) == 'G') { // If This is QueueCall disable VM Button
      const vmStyle = style.disable;
      vmBtn = (
        <div className={style.centerdiv}>
          <button className={[commonButtonName, disableClass, vmStyle, style.callbuttons].join(' ')} id={`vm${e.callID}`} onClick={() => this.handleVM(e.callID)}>
            {/*
              <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" className={iconColors} />
            */}
            <Ionicon icon="ios-recording-outline" color={vmColor} md="md-recording" />
            <p className={[style.buttonlabel, iconColors].join(' ')}>Voicemail</p>
          </button>
        </div>
      );
    }
    return vmBtn;
  };
  renderDQButtons = (e) => {
    e.agentAction = e.agentAction || '';
    const disableClass = e.disableBtns ? style.disableAllBtns : '';
    const iconColors = e.agentAction !== '' ? style.gray : style.black;
    let dqBtn = (
      <div className={style.centerdiv}>
        <button className={[commonButtonName, disableClass, style.callbuttons].join(' ')} id={`dq${e.callID}`} onClick={() => this.handleDequeue(e.callID)}>
          <FontAwesomeIcon icon={faShare} aria-hidden="true" className={iconColors} />
          <p className={[style.buttonlabel, iconColors].join(' ')}>Dequeue</p>
        </button>
      </div>
    );
    //if (e.agentAction !== '') { // Disable DQ Button
    if (e.call_type.charAt(0) == 'D' || (this.props.userRole='agent' && e.call_type.charAt(0) == 'G')) { // When DirectCall or (QueueCall && user=Agent )
      const dqStyle = style.disable;
      dqBtn = (
        <div className={style.centerdiv}>
          <button className={[commonButtonName, disableClass, dqStyle, style.callbuttons].join(' ')} id={`dq${e.callID}`} onClick={() => this.handleDequeue(e.callID)}>
            <FontAwesomeIcon icon={faShare} aria-hidden="true" className={iconColors} />
            <p className={[style.buttonlabel, iconColors].join(' ')}>Dequeue</p>
          </button>
        </div>
      );
    }
    return dqBtn;
  };
  render() {
    /*
    const data = [{
      firstName: 'qw',
      lastName: 'po',
      age: 23,
      visits: 4,
      progress: Math.floor(Math.random() * 100),
      status: 'single',
    }, {
      firstName: 'qw1',
      lastName: 'po1',
      age: 24,
      visits: 5,
      progress: Math.floor(Math.random() * 100),
      status: 'complicated',
    }];
    */
    const teamName = this.props.queue ? this.props.queue.map(e => (
      <option value={e.team_name}>{e.team_name}</option>
    )) : '';
    const agentState = this.props.queue ? this.props.queue.map(e => (
      <option value={e.state}>{e.state}</option>
    )) : '';
    const agentName = this.props.queue ? this.props.queue.map(e => (
      <option value={e.agent_id}>{e.agent_id}</option>
    )) : '';
    const callType = this.props.queue ? this.props.queue.map(e => (
      <option value={e.call_type}>{e.call_type}</option>
    )) : '';

    const pickBtn = this.renderPICKButtons;
    const ansBtn = this.renderANSButtons;
    const vmBtn = this.renderVMButtons;
    const dqBtn = this.renderDQButtons;

    const rows = this.props.queue ? this.props.queue : [];
    const data = [];
    rows.forEach((obj) => {
      obj.pick = pickBtn(obj);
      obj.ans = ansBtn(obj);
      obj.vm = vmBtn(obj);
      obj.dq = dqBtn(obj);
      if (obj.agentAction === 'DROP') {
        obj.agentActionIcon = <FontAwesomeIcon icon={faPhoneVolume} aria-hidden="true" className={style.black} />;
      } else if (obj.agentAction === 'ANSWER') {
        obj.agentActionIcon = <FontAwesomeIcon icon={faCheckMark} aria-hidden="true" className={style.black} />;
      } else if (obj.isParked) {
        obj.agentActionIcon = <FontAwesomeIcon icon={faPause} aria-hidden="true" className={style.black} />;
      } else if (obj.agentAction === '') {
        obj.agentActionIcon = <FontAwesomeIcon icon={faSignal} aria-hidden="true" className={style.black} />;
      }
      data.push(obj);
    });

    return (
      <div>
        <div className={style.contain}>
          <select className={style.filtercontain} value="" onChange={handleChange}>
            <option value="">Team Name</option>
            {teamName}
          </select>
          <select className={style.filtercontain} value="" onChange={handleChange}>
            <option value="">Agent State</option>
            {agentState}
          </select>
          <select className={style.filtercontain} value="" onChange={handleChange}>
            <option value="">Agent Name</option>
            {agentName}
          </select>
          <select className={style.calltype} value="" onChange={handleChange}>
            <option value="">Queued/Direct/All</option>
            {callType}
          </select>
          <button className={style.refresh} onClick={this.handleRefresh} >
            refresh
          </button>
        </div>
        <ReactTable
          getTdProps={this.tableClick}
          loadingText="Loading Queue..."
          noDataText="No Calls Available"
          data={data}
          columns={[
            {
              Header: 'Queue',
              columns: [
                {
                  Header: 'State',
                  accessor: 'agentActionIcon',
                  width: 50,
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>State</div>,
                },
                {
                  Header: 'Visual Q Type',
                  accessor: 'visualQType',
                  width: 100,
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>Visual Q Type</div>,
                },
                {
                  Header: 'Agent ID',
                  accessor: 'agentID',
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>Agent ID</div>,
                },
                {
                  Header: 'ANI',
                  accessor: 'ani',
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>ANI</div>,
                },
                {
                  Header: 'DNIS',
                  accessor: 'dnis',
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>DNIS</div>,
                },
                {
                  Header: 'Customer Name',
                  accessor: 'custName',
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>Customer Name</div>,
                },
                {
                  Header: 'Agent Name',
                  accessor: 'agentName',
                  Footer: () =>
                    <div style={{ textAlign: 'center' }}>Agent Name</div>,
                },
              ],
            },
            {
              Header: 'Actions',
              columns: [
                {
                  Header: '',
                  accessor: 'pick',
                  width: 50,
                },
                {
                  Header: '',
                  accessor: 'ans',
                  width: 50,
                },
                {
                  Header: '',
                  accessor: 'vm',
                  width: 50,
                },
                {
                  Header: '',
                  accessor: 'dq',
                  width: 50,
                },
              ],
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          SubComponent={
            () => <div style={{ padding: '10px' }}>COMING SOON..</div>
          }
        />
        <br />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { fetchQueueReducer: {
    agentID,
    agentExtension,
    agentAction,
    callID,
    queue = [],
    dialog,
    disableBtns,
    iDebug,
    userRole,
    user
  } = {} } = state;

  return {
    queue,
    agentID,
    dialog,
    agentExtension,
    agentAction,
    callID,
    disableBtns,
    iDebug,
    userRole,
    user
  };
};
const mapDispatchToProps = dispatch => ({
  getQueue(aID) {
    dispatch(fetchQueue(aID));
  },
  getUser(aID) {
    dispatch(fetchUser(aID));
  },
  pickCall(aType, cID, aID, aExtension, iDbg) {
    disableButtonsAction(cID);
    dispatch(agentaPostRequest(aType, cID, aID, aExtension, () => {
      enableButtonsAction(cID);
      if (iDbg) {
        dispatch(answerCallAction(cID));
      }
    }));
  },
  answerCall(cID, iDbg) {
    if (iDbg) {
      dispatch(dropCallAction(cID));
    }
  },
  hangupCall(cID, iDbg) {
    if (iDbg) {
      dispatch(removeRowAction(cID));
      dispatch(agentaGetRequest('delete', cID));
    }
  },
  handleParkCall(cID, iDbg) {
    if (iDbg) {
      dispatch(parkCallAction(cID));
    }
  },
  removeUIRow(cID) {
    dispatch(removeRowAction(cID));
  },
  dequeueCall(aType, cID) {
    dispatch(agentaGetRequest(aType, cID));
  },
  vmCall(aType, cID) {
    dispatch(agentaGetRequest(aType, cID));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(
  Content,
);
