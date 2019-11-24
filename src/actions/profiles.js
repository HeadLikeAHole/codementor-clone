import axios from 'axios';

import {
  FREELANCER_LIST_LOADING,
  FREELANCER_LIST_LOADED,
  FREELANCER_LIST_ERROR,
  PROFILE_LOADING,
  PROFILE_LOADED,
  PROFILE_ERROR,
  AUTH_LOGOUT
} from './types';
import {
  freelancerListUrl,
  profileDetailEditDeleteUrl,
  becomeFreelancerUrl,
  unbecomeFreelancerUrl,
  hireFreelancerUrl
} from '../endpoints';
import { addToken } from '../utils';
import { displayMessage } from './messages';
import { loadUser } from './auth';


export const loadFreelancerList = () => dispatch => {
  dispatch({ type: FREELANCER_LIST_LOADING });
  axios.get(freelancerListUrl)
    .then(response => dispatch({ type: FREELANCER_LIST_LOADED, payload: response.data }))
    .catch(error => {
      dispatch({ type: FREELANCER_LIST_ERROR });
      console.log(error)
    });
};


export const loadProfile = (id, prepopulateForm) => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios.get(profileDetailEditDeleteUrl(id))
    .then(response => {
      dispatch({ type: PROFILE_LOADED, payload: response.data });
      if (prepopulateForm) prepopulateForm(response.data)
    })
    .catch(error => {
      dispatch({ type: PROFILE_ERROR });
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};


const headers = {
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'multipart/form-data'
  }
};


export const editProfile = (profile, history) => dispatch => {
  const data = new FormData();

  data.append('username', profile.username);
  data.append('email', profile.email);
  data.append('first_name', profile.first_name);
  data.append('last_name', profile.last_name);

  data.append('photo', profile.photoFile);
  data.append('social_accounts', profile.social_accounts);
  data.append('time_zone', profile.time_zone);
  data.append('languages', profile.languages);

  if (profile.freelancer) {
    data.append('bio', profile.bio);
    data.append('technologies', profile.technologies);
  }
  axios.put(profileDetailEditDeleteUrl(profile.id), data, headers)
    .then(response => {
      dispatch({ type: PROFILE_LOADED, payload: response.data });
      loadUser(dispatch);
      history.push(`/profile/${profile.id}`)
    })
    .catch(error => {
      dispatch({ type: PROFILE_ERROR });
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};


export const deleteProfile = (id, history) => dispatch => {
  axios.delete(profileDetailEditDeleteUrl(id), addToken())
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      dispatch({ type: AUTH_LOGOUT});
      history.push('/')
    })
    .catch(error => {
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};


export const becomeFreelancer = (data, setFormIsVisible) => dispatch => {
  axios.post(becomeFreelancerUrl, data, addToken())
    .then(response => {
      dispatch({ type: PROFILE_LOADED, payload: response.data });
      setFormIsVisible(false);
      loadUser(dispatch);
      dispatch(displayMessage('success', 'Success! You\'ve become a freelancer.'))
    })
    .catch(error => {
      dispatch({ type: PROFILE_ERROR });
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};


export const unbecomeFreelancer = () => dispatch => {
  axios.get(unbecomeFreelancerUrl, addToken())
    .then(response => {
      dispatch({ type: PROFILE_LOADED, payload: response.data });
      loadUser(dispatch);
    })
    .catch(error => {
      dispatch({ type: PROFILE_ERROR });
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};


export const hireFreelancer = (freelancer_id, job_id) => dispatch => {
  axios.get(hireFreelancerUrl(freelancer_id, job_id), addToken())
    .then(response => dispatch({ type: PROFILE_LOADED, payload: response.data }))
    .catch(error => {
      dispatch(displayMessage('danger', error.response.data));
      console.log(`Status: ${error.response.status}`, error.response.data)
    });
};

// todo implement logout function inside deleteProfile function

