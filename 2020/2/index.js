const fs = require('fs');

const passwordsList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');
const passwordSettings = passwordsList.map((str) => {
  const [range, letter, password] = str.split(' ');
  const [min, max] = range.split('-');
  return {
    min,
    max,
    letter: letter[0], // Assume always a single letter followed by :
    password,
  };
});

const getValidPasswordsByMinMaxCount = () => passwordSettings.reduce((acc, {
  min, max, letter, password,
}) => {
  const count = password.split('').filter((char) => char === letter).length;
  return (count >= min && count <= max) ? acc + 1 : acc;
}, 0);

const getValidPasswordsByIndexCount = () => passwordSettings.reduce((acc, {
  min: firstIndex, max: secondIndex, letter, password,
}) => {
  const matchOne = password.length >= firstIndex && password[firstIndex - 1] === letter;
  const matchTwo = password.length >= secondIndex && password[secondIndex - 1] === letter;

  return ((matchOne && !matchTwo) || (!matchOne && matchTwo)) ? acc + 1 : acc;
}, 0);

console.log('Part 1: ', getValidPasswordsByMinMaxCount());
console.log('Part 2: ', getValidPasswordsByIndexCount());
