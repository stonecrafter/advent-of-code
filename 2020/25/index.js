const fs = require('fs');

const [cardPubKey, doorPubKey] = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number);

const SUBJECT_NUM = 7;

const getLoopSize = (pubKey) => {
  let val = 1;
  let loopSize = 0;
  while (val !== pubKey) {
    val = (val * SUBJECT_NUM) % 20201227;
    loopSize += 1;
  }

  return loopSize;
}

const getKeyForLoopSize = (loopSize, subjectNum) => {
  let val = 1;
  let currentLoop = 0;
  while (currentLoop < loopSize) {
    val = (val * subjectNum) % 20201227;
    currentLoop += 1;
  }

  return val;
}

const getEncryptionKey = () =>
  getKeyForLoopSize(getLoopSize(cardPubKey), doorPubKey);

console.log('Part 1: ', getEncryptionKey());
