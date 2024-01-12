import { combineReducers } from 'redux';
import auth from './auth';
import ui from './ui';
import { api } from '@grc/services/api';

export default combineReducers({
  [api.reducerPath]: api.reducer,
  auth,
  ui,
});
