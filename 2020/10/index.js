const fs = require('fs');

// Numbers in ascending order
const inputList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map((num) => +num).sort((a, b) => a - b);

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

const getTotalCombinations = () => {
  const deviceJolts = Math.max(...inputList) + 3;
  const listWithDevice = [...inputList, deviceJolts];

  // Only one way to get to the first adapter
  let comboList = [1];
  for (let i = 1; i <= deviceJolts; i++) {
    // This value is not in the adapter list, so there is no way to get to it
    if (!listWithDevice.includes(i)) {
      comboList.push(0);
    } else {
      const combos = (comboList[i - 1] || 0) + (comboList[i - 2] || 0) + (comboList[i - 3] || 0);
      comboList.push(combos);
    }
  }

  // How many ways are there to get to the final item - the device
  return comboList.pop();
};

console.log('Part 1: ', getJoltDifference());
console.log('Part 2: ', getTotalCombinations());
