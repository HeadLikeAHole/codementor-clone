import React, { useState } from 'react';
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { becomeFreelancer } from '../../actions/profiles';
import { technologyListUrl } from '../../endpoints';
import MultiSelectField from '../common/MultiSelectField';


const FreelancerForm = props => {
  const [bio, setBio] = useState('');
  const [technologies, setTechnologies] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    const { becomeFreelancer, setFormIsVisible } = props;
    becomeFreelancer({ bio, technologies }, setFormIsVisible);
  };

  return (
    <MDBRow className="mb-4">
      <MDBCol md="6" className="offset-md-3">
        <MDBCard>
          <MDBCardBody>
            <form onSubmit={handleSubmit}>
              <p className="h4 text-center py-2">Freelancer Form</p>
              <div className="grey-text">
                <MDBInput
                  label="Type your experience"
                  group
                  type="textarea"
                  rows="5"
                  validate
                  error="wrong"
                  success="right"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
                <MultiSelectField
                  initialState={technologies}
                  setState={setTechnologies}
                  url={technologyListUrl}
                  label="Technologies you know"
                />
              </div>
              <div className="mt-4 text-center">
                <MDBBtn type="submit">Submit</MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};


FreelancerForm.propTypes = {
  becomeFreelancer: PropTypes.func.isRequired,
  setFormIsVisible: PropTypes.func.isRequired
};


export default connect(null, { becomeFreelancer })(FreelancerForm);
