import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { convertToOptions } from '../../utils';


const SelectField = props => {
  const { initialState, setState, url, fieldName, label } = props;

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(initialState);

  useEffect(() => {
    axios.get(url)
      .then(response => setOptions(convertToOptions(response.data)))
      .catch(error => console.log(`Status: ${error.response.status}`, error.response.data));
    setSelected(initialState)
  }, [initialState]);

  const handleChange = e => {
    const value = e.target.value;
    // field name is supplied if useReducer is used, if useState is used then field name isn't necessary
    if (fieldName) {
      setState({ [fieldName]: value })
    } else {
      setState(value)
    }
  };

  return (
    <>
      {label && <p>{label}</p>}
      <select className="mb-3 browser-default custom-select" value={selected} onChange={handleChange}>
        <option>Choose your time zone</option>
        {
          options.map((option, index) => {
            if (option.value === selected) {
              return <option key={index} value={option.value} selected>{option.label}</option>
            } else {
              return <option key={index} value={option.value}>{option.label}</option>
            }
          })
        }
      </select>
    </>
  )
};


SelectField.propTypes = {
  initialState: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string.isRequired
};


export default SelectField;
