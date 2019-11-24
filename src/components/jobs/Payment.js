import React, { Component } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import { connect } from 'react-redux';
import { CardElement, injectStripe, Elements, StripeProvider } from "react-stripe-elements";
import api from "../../api";
import { displayMessage } from '../../actions/messages';


class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: "USD",
      clientSecret: null,
      error: null,
      metadata: null,
      disabled: false,
      succeeded: false,
      processing: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {jobID} = this.props;
    // Step 1: Fetch job details such as amount and currency from API to make sure it can't be tampered with in the client.
    api.getJobDetails(jobID).then(jobDetails => {
      this.setState({ amount: jobDetails.budget });
    });
  }

  async handleSubmit(ev) {
    ev.preventDefault();
    
    // Step 1: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
        payment_method_types: ["card"],
        job: this.props.jobID
      })
      .then(clientSecret => {
        this.setState({
          clientSecret: clientSecret,
          disabled: true,
          processing: true
        });

        // Step 2: Use clientSecret from PaymentIntent to handle payment in stripe.handleCardPayment() call
        this.props.stripe
          .handleCardPayment(this.state.clientSecret)
          .then(payload => {
            if (payload.error) {
              this.setState({
                error: `Payment failed: ${payload.error.message}`,
                disabled: false,
                processing: false
              });
              console.log("[error]", payload.error);
            } else {
              this.setState({
                processing: false,
                succeeded: true,
                error: "",
                metadata: payload.paymentIntent
              });
              displayMessage('green', 'Payment successful')
              console.log("[PaymentIntent]", payload.paymentIntent);
            }
          });
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  }

  renderSuccess() {
    return (
      <div className="sr-field-success message">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre>
      </div>
    );
  }

  renderForm() {
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>
          ${this.state.currency.toLocaleUpperCase()}{" "}
          {this.state.amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2
          })}{" "}
        </h1>

        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
            <CardElement className="sr-input sr-card-element" style={style} />
          </div>
        </div>

        {this.state.error && (
          <div className="message sr-field-error">{this.state.error}</div>
        )}

        {!this.state.succeeded && (
          <button className="btn" disabled={this.state.disabled}>
            {this.state.processing ? "Processing…" : "Pay"}
          </button>
        )}
      </form>
    );
  }

  render() {
    return (
      <div className="checkout-form">
        <div className="sr-payment-form">
          <div className="sr-form-row" />
          {this.state.succeeded && this.renderSuccess()}
          {!this.state.succeeded && this.renderForm()}
        </div>
      </div>
    );
  }
}

const InjectedStripeForm = connect(null, {displayMessage})(injectStripe(CheckoutForm));


class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: null
    };
  }

  componentDidMount() {
    api.getPublicStripeKey().then(apiKey => {
      this.setState({
        apiKey: apiKey
      });
    });
  }

  render() {
    const {job} = this.props;
    return (
      <MDBCard className="my-5">
        <MDBCardBody>
          <MDBCardTitle>Pay to start the project</MDBCardTitle>
          <MDBCardText>
            The payment will be held in escrow until you confirm the project is completed and satisfactory. 
          </MDBCardText>
          {this.state.apiKey && (
            <StripeProvider apiKey={this.state.apiKey}>
              <Elements>
                <InjectedStripeForm jobID={job.id} />
              </Elements>
            </StripeProvider>
          )}
        </MDBCardBody>        
      </MDBCard>
    );
  }
}

export default Checkout;