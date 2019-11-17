import React, { useState, useReducer, useEffect } from 'react';
import { MDBAlert } from 'mdbreact';
import { connect } from 'react-redux';


const Messages = props => {
  const [isVisible, setVisible] = useState(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (props.messages.color) {
      setVisible(true);
    }
  }, [props.messages]);

  let message;
  let messages = [];
  if (Object.keys(props.messages).length) {
    if (typeof props.messages.message === 'string') {
      message = props.messages.message;
      messages.push(message)
    }
    if (typeof props.messages.message === 'object') {
      for (const [key, value] of Object.entries(props.messages.message)) {
        message = `${key}: ${value}`;
        messages.push(message)
      }
    }
  }

  return (
    <>
      {
        isVisible &&
          messages.map((message, index) => (
            <MDBAlert color={props.messages.color} dismiss className="text-center" key={index}>
              {message}
            </MDBAlert>
          ))
      }
    </>
  )
};


const mapStateToProps = state => ({ messages: state.messages });


export default connect(mapStateToProps)(Messages);
