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
  }, []);

  const handleChange = selected => {
    setSelected(selected);
    // field name is supplied if useReducer is used, if useState is used then field name isn't necessary
    if (fieldName) {
      setState({ [fieldName]: selected })
    } else {
      setState(selected)
    }
  };

  return (
    <>
      {label && <p>{label}</p>}
      <select className="browser-default custom-select">
        <option>Choose your option</option>
        {options.map(option => <option value={option.value}>{option.label}</option>)}
      </select>
    </>
  )
};


SelectField.propTypes = {
  initialState: PropTypes.array.isRequired,
  setState: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string.isRequired
};


export default SelectField;
