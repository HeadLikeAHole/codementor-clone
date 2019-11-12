import React, {useEffect, useState} from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBRow } from 'mdbreact';
import { useParams, useLocation, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadProfile, hireFreelancer } from '../../actions/profiles';
import ProfileDeleteButton from './ProfileDeleteButton';
import UnbecomeFreelancerButton from './UnbecomeFreelancerButton';
import FreelancerForm from './FreelancerForm';


const Profile = props => {
  const { id } = useParams();
  const location_job_id = useLocation().job_id;

  if (location_job_id) {
    localStorage.setItem('location_job_id', location_job_id)
  }

  const job_id = parseInt(localStorage.getItem('location_job_id'), 10);

  useEffect(() => props.loadProfile(id), [id]);

  const [formIsVisible, setFormIsVisible] = useState(false);

  const { auth } = props;
  const { user, freelancer, taken_jobs, photo, social_accounts, time_zone, languages_display } = props.profile.profile;

  let isOwner;

  if (Object.keys(auth.user).length && user) {
    if (auth.user.id === user.id) {
      isOwner = true
    }
  }

  let isFreelancer;
  // on unbecomeFreelancer server returns freelancer object with id=null
  // then on refresh object becomes null
  if (freelancer && freelancer.id) {
    isFreelancer = true
  }

  // check if used has been hired
  const isHired = taken_jobs && !!taken_jobs.filter(job => job.id === job_id).length;
  const hireButton = (
      <MDBBtn color={isHired ? 'deep-orange' : 'primary'} className="mt-2 btn-block" onClick={() => props.hireFreelancer(id, job_id)}>
        {isHired ? 'Hired' : 'Hire Now'}
      </MDBBtn>
  );

  return (
    <>
      <MDBCard className="my-4 position-relative">
        {
          isOwner &&
            <div style={{ position: 'absolute', top: '8px', right: '5px' }}>
              <Link to="/profile-edit"><MDBBtn size="sm">Edit</MDBBtn></Link>
              <ProfileDeleteButton />
            </div>
        }
        <MDBCardTitle className="mt-3 text-center">
          {user && user.first_name} {user && user.last_name} {isOwner && isFreelancer && '(You are a freelancer)'}
        </MDBCardTitle>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md={2}>
              <img src={photo} className="img-fluid rounded" />
              {!isOwner && isFreelancer && hireButton}
              {
                isOwner && !isFreelancer &&
                  <MDBBtn
                    color="success"
                    className="mt-2 btn-block"
                    onClick={() => setFormIsVisible(!formIsVisible)}
                  >
                    {formIsVisible ? <span>Hide<br />Form</span> : 'Become Freelancer'}
                  </MDBBtn>
              }
              {isOwner && isFreelancer && <UnbecomeFreelancerButton />}
            </MDBCol>
            <MDBCol md={10}>
              <div>Social Accounts: {social_accounts}</div>
              <br />
              <div>Time zone: {time_zone}</div>
              <br />
              <div>Languages: {languages_display}</div>
              <br />
              {
                isFreelancer &&
                  <>
                    <div>Experience: {freelancer.bio}</div>
                    <br />
                    <div>Technologies: {freelancer.technologies_display}</div>
                    <br />
                  </>
              }
              <br />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
      {formIsVisible && <FreelancerForm setFormIsVisible={setFormIsVisible} />}
    </>
  )
};


const mapStateToProps = state => ({ auth: state.auth, profile: state.profile });


export default connect(mapStateToProps, { loadProfile, hireFreelancer })(Profile);
