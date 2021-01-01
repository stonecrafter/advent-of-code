const fs = require('fs');

const inputList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map((num) => +num);

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

const findRangeForTargetSum = (targetSum, numList) => {
  let currSum = 0;
  let endIdx = 0;
  numList.some((num, idx) => {
    if (currSum < targetSum) {
      currSum += num;
    } else {
      endIdx = idx;
      return true;
    }
  });

  return {
    isExactSum: currSum === targetSum,
    numRange: numList.slice(0, endIdx)
  };
}

const getEncryptionWeakness = () => {
  const targetSum = getFirstBadNumber();

  let result;
  inputList.some((_num, idx) => {
    const range = findRangeForTargetSum(targetSum, inputList.slice(idx, inputList.length));
    // A match is guaranteed in this dataset
    if (range.isExactSum) {
      result = range;
      return true;
    }
  });

  return Math.max(...result.numRange) + Math.min(...result.numRange);
}

console.log('Part 1: ', getFirstBadNumber());
console.log('Part 2: ', getEncryptionWeakness());
