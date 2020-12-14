const fs = require('fs');

const inputList = fs.readFileSync('input.txt', 'utf8').split('\n').map((num) => +num);

const WINDOW = 25;

const isSumOfTwo = (target, numList) =>
  numList.some((num) => numList.includes(target - num));

const getFirstBadNumber = () => {
  const badNumber = inputList.find((num, idx) => {
    // Ignore preamble
    if (idx < WINDOW) return false;
    return !isSumOfTwo(num, inputList.slice(idx - WINDOW, idx));
  });

  return badNumber;
}

console.log('Part 1: ', getFirstBadNumber());
