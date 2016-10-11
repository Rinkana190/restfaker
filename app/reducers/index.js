// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import homePage from './homePage';

const rootReducer = combineReducers({
  counter,
  homePage,
  routing
});

export default rootReducer;
