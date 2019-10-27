import { combineReducers } from 'redux';
import { searchReducer } from './SearchReducer';

export default combineReducers({
  search: searchReducer
});
