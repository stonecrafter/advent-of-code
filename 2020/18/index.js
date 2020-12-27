const fs = require('fs');

const inputLines = fs.readFileSync('input.txt', 'utf8').split('\n');

const calculateNoBrackets = (line) => {
  const splitLine = line.split(' ');
  // Will always be a number
  let result = +splitLine[0];
  for (let i = 1; i < (splitLine.length - 1); i += 2) {
    const operator = splitLine[i];
    const operand = +splitLine[i + 1];

    if (operator === '*') {
      result = result * operand;
    } else {
      result = result + operand;
    }
  }

  return result;
}

const getResult = (line) => {
  let newEquation = line;

  // Brackets will always have a match
  // If the equation has any brackets, deal with them
  if (line.includes('(')) {
    // Find the index of every matching closing bracket
    // That should be replaced by a number
    while (newEquation.includes('(')) {
      let bracketCount = 0;
      let startIndex = newEquation.indexOf('(');
      let foundIndex = null;

      for (let i = startIndex + 1; foundIndex === null; i++) {
        if (newEquation[i] === ')') {
          if (bracketCount === 0) {
            foundIndex = i;
          } else {
            bracketCount--;
          }
        }

        if (newEquation[i] === '(') {
          bracketCount++
        }
      }

      const valueInBrackets = getResult(newEquation.slice(startIndex + 1, foundIndex));
      newEquation = newEquation.substring(0, startIndex) + valueInBrackets + newEquation.substring(foundIndex + 1);
    }
  }

  return calculateNoBrackets(newEquation);
}

const getResultSum = () =>
  inputLines.reduce((acc, line) => acc + getResult(line), 0);

console.log('Part 1: ', getResultSum());
