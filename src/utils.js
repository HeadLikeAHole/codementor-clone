import React from 'react';
import { MDBIcon } from 'mdbreact';


export const addToken = () => (
  {
    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
  }
);


export const truncateWords = (text, wordsNumber) => {
  const wordArray = text.split(' ');

  if (wordArray.length <= wordsNumber) {
    return text
  } else {
    return wordArray.slice(0, wordsNumber).join(' ') + '...';
  }
};


export const truncateCharacters = (text, characterNumber) => {
  if (text.length <= characterNumber) {
    return text
  } else {
    return text.slice(0, characterNumber) + '...';
  }
};


export const convertToOptions = arr => arr.map(el => ({ value: el[0], label: el[1] }));


export const checkJobStatus = bool => (
  bool ?
    <MDBIcon icon="check-circle text-success" />
  :
    <MDBIcon icon="times-circle text-danger" />
);
