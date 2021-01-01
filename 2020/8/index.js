const fs = require('fs');

const inputList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

const INSTRUCTIONS = {
  NOOP: 'nop',
  JUMP: 'jmp',
  ACC: 'acc',
};

const getParsedInstructions = () =>
  inputList.map((item) => {
    const [cmd, value] = item.split(' ');
    return { cmd, value: +value };
  });

const getHighestAccVal = (instructions) => {
  let idx = 0;
  let acc = 0;
  let duplicateFound = false;
  let currInstr;

  while (!duplicateFound && idx !== Object.keys(instructions).length) {
    currInstr = instructions[idx];

    if (currInstr.acc !== undefined) {
      duplicateFound = true;
    } else {
      switch (currInstr.cmd) {
        case INSTRUCTIONS.NOOP:
          idx += 1;
          break;
        case INSTRUCTIONS.ACC:
          acc += currInstr.value;
          currInstr.acc = acc;
          idx += 1;
          break;
        case INSTRUCTIONS.JUMP:
          idx = idx + currInstr.value;
          if (currInstr.value === 0) {
            // Prevent infinite loop in case of jumping back to itself
            currInstr.acc = 0;
          }
          break;
        default:
          // Should never happen?
      }
    }
  }

  return { finalVal: acc, terminated: !duplicateFound };
}

const getHighestValWithError = () => {
  const result = getHighestAccVal(getParsedInstructions());
  return result.finalVal;
}

const getAllFlippedInstructions = () => {
  const instructions = getParsedInstructions();

  // 2d array, each element is the full set of instructions with one instruction replaced
  return instructions.reduce((acc, line, idx) => {
    if (line.cmd === INSTRUCTIONS.ACC) return acc;

    const newInstrSet = [
      // Deep copy array of objects
      ...JSON.parse(JSON.stringify(instructions.slice(0, idx))),
      {
        ...line,
        cmd: (line.cmd === INSTRUCTIONS.NOOP) ? INSTRUCTIONS.JUMP : INSTRUCTIONS.NOOP,
      },
      ...JSON.parse(JSON.stringify(instructions.slice(idx + 1, instructions.length))),
    ];

    return [...acc, newInstrSet];
  }, []);
}

const getCorrectedFinalVal = () => {
  let val;
  const allPossibilities = getAllFlippedInstructions();
  // Stop when we find the value we care about
  allPossibilities.find((item) => {
    const { finalVal, terminated } = getHighestAccVal(item);
    if (terminated) {
      val = finalVal;
      return true;
    }
  });

  return val;
}

console.log('Part 1: ', getHighestValWithError());
console.log('Part 2: ', getCorrectedFinalVal());
