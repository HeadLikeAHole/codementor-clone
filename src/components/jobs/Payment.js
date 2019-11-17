import React from 'react';
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import { MDBBtn } from 'mdbreact';
import axios from 'axios';
import { connect } from 'react-redux';

import { paymentUrl } from '../../endpoints';
import { addToken } from '../../utils';
import { displayMessage } from '../../actions/messages';


const Form = props => {
  const submit = () => {
    let { token } = props.stripe.createToken();
    axios.post(paymentUrl, { token: token.id }, addToken())
      .then(response => console.log(response))
      .catch(error => console.log(error))
  };

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      <MDBBtn onClick={submit}>Submit</MDBBtn>
    </div>
  )
};


const InjectedForm = injectStripe(connect(null, { displayMessage })(Form));


const Payment = () => {
  return (
    <StripeProvider apiKey="pk_test_BrudTsvC4uETu4XVJXuoQhDZ00dudyBmFF">
      <div className="example">
        <h1>React Stripe Elements Example</h1>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  );
};


export default Payment;
