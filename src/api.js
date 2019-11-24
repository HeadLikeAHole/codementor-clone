import axios from 'axios'
import {endpoint} from './endpoints'
import { addToken } from './utils';

const createPaymentIntent = data => {
  return axios.post(`${endpoint}payments/create-payment-intent/`, data, addToken())
    .then(res => {
      if (!res.data || res.data.error) {
        console.log("API error:", { data: res.data });
        throw new Error("PaymentIntent API Error");
      } else {
        return res.data.client_secret;
      }
    });
};
  
const getPublicStripeKey = data => {
  return axios
    .get(`${endpoint}payments/public-key/`, addToken())
    .then(res => {
      if (!res.data || res.data.error) {
        console.log("API error:", { data: res.data });
        throw Error("API Error");
      } else {
        return res.data.publicKey;
      }
    });
};

const getJobDetails = jobID => {
  return axios
    .get(`${endpoint}payments/job-detail/${jobID}/`, addToken())
    .then(res => {
      if (!res.data || res.data.error) {
        console.log("API error:", { data: res.data });
        throw Error("API Error");
      } else {
        return res.data;
      }
    });
};
  
const api = {
  createPaymentIntent: createPaymentIntent,
  getPublicStripeKey: getPublicStripeKey,
  getJobDetails: getJobDetails
};
  
export default api;