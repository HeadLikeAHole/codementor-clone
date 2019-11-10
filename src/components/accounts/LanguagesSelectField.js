import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MultiSelect from "@khanacademy/react-multi-select";

import { languageListUrl } from '../../endpoints';
import { convertToOptions } from '../../utils';


const LanguagesSelectField = props => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(props.initialValues);

  useEffect(() => {
    axios.get(languageListUrl)
      .then(response => setOptions(convertToOptions(response.data)))
      .catch(error => console.log(`Status: ${error.response.status}`, error.response.data));
  }, []);

  const handleChange = selected => {
    setSelected(selected);
    props.setState({ 'languages': selected })
  };

  return (
    <MultiSelect
      options={options}
      selected={selected}
      onSelectedChanged={handleChange}
      overrideStrings={{
        selectSomeItems: "Select languages you speak",
      }}
    />
  )
};


LanguagesSelectField.propTypes = {
  initialValues: PropTypes.array.isRequired,
  setState: PropTypes.func.isRequired
};


export default LanguagesSelectField;
