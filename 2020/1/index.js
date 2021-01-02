const fs = require('fs');

const numbersList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map((num) => +num);

// Assuming all numbers in input is unique

const findTwoNumbers = () => {
  let sum;
  numbersList.some((num) => {
    const targetNum = 2020 - num;

    if (numbersList.includes(targetNum)) {
      sum = targetNum * num;
      return true;
    }

    return false;
  });

  return sum;
};

const findThreeNumbers = () => {
  let sum;
  numbersList.some((num1, i) => numbersList.some((num2, j) => {
    if (i === j || num1 + num2 >= 2020) return false;

    const targetNum = 2020 - num1 - num2;

    if (numbersList.includes(targetNum)) {
      sum = targetNum * num1 * num2;
      return true;
    }

    return false;
  }));

  return sum;
};

console.log('Part 1: ', findTwoNumbers());
console.log('Part 2: ', findThreeNumbers());
