import { combineReducers } from 'redux';

import auth from './auth';
import jobList from './jobList';
import jobDetail from './jobDetail';
import profile from './profile';
import freelancerList from './freelancerList';
import messages from './messages';


export default combineReducers({
  auth,
  jobList,
  jobDetail,
  profile,
  freelancerList,
  messages
})
