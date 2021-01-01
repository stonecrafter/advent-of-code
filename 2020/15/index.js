const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(',').map(Number);

const getNumberSpoken = (iter) => {
  // Turns out using Map is way faster than object
  const numAndTurns = new Map();
  let mostRecentNum;

  for (let i = 1; i <= iter; i++) {
    // Go through starting numbers first
    // The list of numbers is always unique
    if (i <= input.length) {
      mostRecentNum = input[i - 1];
      numAndTurns.set(mostRecentNum, [i]);
    } else {
      // Always at least length of 1, since this is the
      // previously spoken number
      const turnsMap = numAndTurns.get(mostRecentNum);

      // If the number has been spoken only once,
      // next number is 0. If it has been spoken at least twice,
      // take the difference of those two turn numbers.
      // The most recent turn number comes in the beginning.
      const newNum = (turnsMap.length === 1) ? 0 : turnsMap[0] - turnsMap[1];
      const newTurnsMap = numAndTurns.get(newNum);

      // Add the current number to the start of the turns map
      // Or start a new array if this number has never been spoken before
      const newArray = !!newTurnsMap ? [i, newTurnsMap[0]] : [i];
      numAndTurns.set(newNum, newArray);

      // Now this becomes the most recently spoken number
      mostRecentNum = newNum;
    }
  }

  return mostRecentNum;
}

console.log('Part 1: ', getNumberSpoken(2020));
console.log('Part 2: ', getNumberSpoken(30000000));
