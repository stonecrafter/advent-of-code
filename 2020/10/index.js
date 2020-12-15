const fs = require('fs');

// Numbers in ascending order
const inputList = fs.readFileSync('input.txt', 'utf8').split('\n').map((num) => +num).sort((a, b) => a - b);

const getJoltDifference = () => {
  const totals = inputList.reduce(({ currVoltage, one, two, three }, num) => {
    const diff = num - currVoltage;

    return {
      currVoltage: num,
      one: diff === 1 ? one + 1 : one,
      two: diff === 2 ? two + 1 : two,
      three: diff === 3 ? three + 1 : three,
    }
  },
  {
    currVoltage: 0,
    one: 0,
    two: 0,
    three: 0
  });

  // The device is always a 3 jolt difference
  return totals.one * (totals.three + 1);
}

console.log('Part 1: ', getJoltDifference());
