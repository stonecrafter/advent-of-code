const fs = require('fs');

const inputLines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

// All columns are of equal length in the input file
const colCount = inputLines[0].length;

const getTreeCount = (right, evenOnly = false) =>
  inputLines.reduce((acc, line, rowNum) => {
    // Skip the first column
    if (!rowNum) return acc;

    // If we only want even rows, skip odd rows
    if (evenOnly && rowNum % 2 !== 0) return acc;

    // Increment to the right, then check if there is a tree
    const increment = acc.col += right;
    // Wrap around the columns if it goes over, don't forget index 0
    const newCol = increment > colCount - 1 ? increment - colCount : increment;
    return {
      trees: line[newCol] === '#' ? acc.trees += 1 : acc.trees,
      col: newCol
    }
  }, { trees: 0, col: 0 })
  .trees;

const checkSeveralSlopes = () =>
  getTreeCount(1) *
  getTreeCount(3) *
  getTreeCount(5) *
  getTreeCount(7) *
  getTreeCount(1, true)

console.log('Part 1: ', getTreeCount(3));
console.log('Part 2: ', checkSeveralSlopes());
