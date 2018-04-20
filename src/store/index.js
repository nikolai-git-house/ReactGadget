import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import fetchQueueReducer from '../polling/poll';

export default createStore(
  combineReducers({
    fetchQueueReducer,
  }),
  applyMiddleware(
    thunk,
    logger,
  ),
);
