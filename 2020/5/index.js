const fs = require('fs');

const inputList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

const seatIds = inputList.map((seat) => {
  // Min and max should be equal at the end so we only need one of them
  const { minRow, minCol } = seat.split('').reduce((acc, code) => {
    const rowIncrement = Math.ceil((acc.maxRow - acc.minRow) / 2);
    const colIncrement = Math.ceil((acc.maxCol - acc.minCol) / 2);

    switch (code) {
      case 'F':
        return {
          ...acc,
          maxRow: acc.maxRow - rowIncrement,
        };
      case 'B':
        return {
          ...acc,
          minRow: acc.minRow + rowIncrement,
        };
      case 'L':
        return {
          ...acc,
          maxCol: acc.maxCol - colIncrement,
        };
      case 'R':
        return {
          ...acc,
          minCol: acc.minCol + colIncrement,
        };
      default:
        // Should never happen
        return acc;
    }
  }, {
    minRow: 0, maxRow: 127, minCol: 0, maxCol: 7,
  });

  return (minRow * 8) + minCol;
});

const getHighestSeatId = () => seatIds.reduce((a, b) => Math.max(a, b));

const getMissingSeatId = () => {
  // Don't modify the original array, just in case
  const sortedSeatIds = [...seatIds].sort();
  const startingSeatId = sortedSeatIds[0];

  // Numbers should appear one after another in order
  // If we skipped a number at some point, then the missing one is the one immediately before it
  return sortedSeatIds.find((seatId, idx) => seatId !== startingSeatId + idx) - 1;
};

console.log('Part 1: ', getHighestSeatId());
console.log('Part 2: ', getMissingSeatId());
