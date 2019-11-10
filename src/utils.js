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


export const convertToOptions = arr => arr.map(el => ({ value: el[0], label: el[1] }));