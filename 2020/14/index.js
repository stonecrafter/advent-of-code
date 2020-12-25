const fs = require('fs');

const inputLines = fs.readFileSync('input.txt', 'utf8').split('\n');

const applyMask = (mask, value) => {
  // Value is a base 10 number, convert it to binary and
  // pad with leading 0s so it has length of 36
  let binaryValue = (+value).toString(2);
  while (binaryValue.length < 36) {
    binaryValue = '0' + binaryValue;
  }

  let maskedVal = '';
  for (let i = 0; i < 36; i++) {
    const nextBit = mask[i] === 'X' ? binaryValue[i] : mask[i];
    maskedVal = maskedVal + nextBit;
  }

  return maskedVal;
}

const getMemorySums = () => {
  let currentMask;
  const memoryMap = inputLines.reduce((memMap, line) => {
    const [instr, value] = line.split(' = ');
    if (instr === 'mask') {
      currentMask = value;
      return memMap;
    } else {
      // mem lines always come in this form: "mem[xxxx]"
      const key = instr.slice(4, instr.length - 1);
      const newVal = applyMask(currentMask, value);
      return {
        ...memMap,
        [key]: newVal,
      }
    }
  }, {});

  return Object.values(memoryMap).reduce((acc, val) => acc + parseInt(val, 2), 0)
}

console.log('Part 1: ', getMemorySums());
