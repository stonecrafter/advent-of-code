const fs = require('fs');

const inputLines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

const applyMask = (mask, value, unchangedBit) => {
  // Value is a base 10 number, convert it to binary and
  // pad with leading 0s so it has length of 36
  let binaryValue = (+value).toString(2);
  while (binaryValue.length < 36) {
    binaryValue = '0' + binaryValue;
  }

  let maskedVal = '';
  for (let i = 0; i < 36; i++) {
    const nextBit = mask[i] === unchangedBit ? binaryValue[i] : mask[i];
    maskedVal = maskedVal + nextBit;
  }

  return maskedVal;
}

const applyMaskWithFloats = (mask, memAddr, value) => {
  const maskedAddr = applyMask(mask, memAddr, '0');
  const binaryVal = (+value).toString(2);
  const numFloats = (maskedAddr.match(/X/g)).length;

  if (!numFloats) {
    // No floats, only need to write to one memory address
    return {
      [parseInt(maskedAddr, 2)]: binaryVal,
    }
  }

  const allAddrs = maskedAddr.split('').reduce((addrList, bit, idx) => {
    if (bit !== 'X') return addrList;

    return addrList.reduce((acc, inProgAddr) =>
      [
        ...acc,
        inProgAddr.substring(0, idx) + '0' + inProgAddr.substring(idx + 1),
        inProgAddr.substring(0, idx) + '1' + inProgAddr.substring(idx + 1),
      ], []);
  }, [maskedAddr]);

  return allAddrs.reduce((acc, addr) => ({
    ...acc,
    [parseInt(addr, 2)]: binaryVal,
  }), {});
}

const getMemorySums = (isV2 = false) => {
  let currentMask;
  const memoryMap = inputLines.reduce((memMap, line) => {
    const [instr, value] = line.split(' = ');
    if (instr === 'mask') {
      currentMask = value;
      return memMap;
    }
    
    // mem lines always come in this form: "mem[xxxx]"
    const key = instr.slice(4, instr.length - 1);

    if (!isV2) {
      const newVal = applyMask(currentMask, value, 'X');
      return {
        ...memMap,
        [key]: newVal,
      }
    }

    return {
      ...memMap,
      ...applyMaskWithFloats(currentMask, key, value),
    }
  }, {});

  return Object.values(memoryMap).reduce((acc, val) => acc + parseInt(val, 2), 0)
}

console.log('Part 1: ', getMemorySums());
console.log('Part 2: ', getMemorySums(true));
