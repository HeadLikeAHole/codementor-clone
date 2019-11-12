import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MultiSelect from '@khanacademy/react-multi-select';

import { convertToOptions } from '../../utils';


const MultiSelectField = props => {
  const { initialState, setState, url, fieldName, label } = props;

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios.get(url)
      .then(response => setOptions(convertToOptions(response.data)))
      .catch(error => console.log(`Status: ${error.response.status}`, error.response.data));
    setSelected(initialState)
  }, [initialState]);


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
      <MultiSelect
        options={options}
        selected={selected}
        onSelectedChanged={handleChange}
      />
    </>
  )
};


MultiSelectField.propTypes = {
  initialState: PropTypes.array.isRequired,
  setState: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string.isRequired
};


export default MultiSelectField;
