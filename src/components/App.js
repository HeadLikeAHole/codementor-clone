import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MDBContainer } from 'mdbreact';

import store from '../store';
import { loadAuth } from '../actions/auth';
import Navbar from './common/Navbar';
import Messages from './common/Messages';
import PrivateRoute from './accounts/PrivateRoute';
import Login from './accounts/Login';
import Register from './accounts/Register';
import JobList from './jobs/JobList';
import JobDetail from './jobs/JobDetail';
import JobForm from './jobs/JobForm';
import FreelancerList from  './accounts/FreelancerList';
import Profile from './accounts/Profile';
import ProfileEdit from './accounts/ProfileEdit';


const App = () => {
  useEffect(() => store.dispatch(loadAuth()), []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Messages />
        <MDBContainer>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/" component={JobList} />
            <Route exact path="/jobs/:id" component={JobDetail} />
            <PrivateRoute exact path="/job-form" component={JobForm} />
            <Route exact path="/freelancers" component={FreelancerList} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/profile-edit" component={ProfileEdit} />
          </Switch>
        </MDBContainer>
      </Router>
    </Provider>
  )
};


export default App;
