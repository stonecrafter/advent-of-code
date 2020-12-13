const fs = require('fs');

const inputList = fs.readFileSync('input.txt', 'utf8').split('\n');

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

const getHighestAccVal = () => {
  let idx = 0;
  let acc = 0;
  let duplicateFound = false;
  let currInstr;

  const parsedInstructions = getParsedInstructions();

  while (!duplicateFound) {
    currInstr = parsedInstructions[idx];

    if (currInstr.acc) {
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
          break;
        default:
          // Should never happen?
      }
    }
  }

  return acc;
}

console.log('Part 1: ', getHighestAccVal());
