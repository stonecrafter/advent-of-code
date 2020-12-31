// The input for this day is just a number...
const PUZZLE_INPUT = 219347865;
const ONE_MILLION = 1000000;
const TEN_MILLION = 10000000;

class Cup {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Create a linked list out of numerical array
// and return the head (first item) of the list
// The last list item will point to the first one
// so it will be circular
// For faster access, also create a map of values
// to their associated nodes, to avoid traversing
// the entire linked list in search of a single
// node of a given value
const generateCups = (numArray) => {
  let prevCup = null;
  let finalCup = null;
  const valueMap = new Map();
  numArray.reverse().forEach((item, idx) => {
    const currentCup = new Cup(item, prevCup);
    valueMap.set(item, currentCup);

    // The last one is created first
    if (idx === 0) {
      finalCup = currentCup;
    }

    prevCup = currentCup;
  });

  // Set the final array element to point to the first one
  finalCup.next = prevCup;

  return { firstCup: prevCup, valueMap };
}

const playRound = ({ firstCup, valueMap, rounds, highestNum, lowestNum }) => {
  let currentCup = firstCup;
  for (let i = 0; i < rounds; i++) {
    // Pick up items - and remove from linked list
    const pickedUpItems = [
      currentCup.next,
      currentCup.next.next,
      currentCup.next.next.next,
    ];
    currentCup.next = pickedUpItems[2].next;

    // Find the destination
    let destItem = null;
    let destNum = currentCup.value - 1;
    while (!destItem) {
      // If number went too low, wrap around to the highest
      if (destNum < lowestNum) {
        destNum = highestNum;
      } else if (!pickedUpItems.map((item) => item.value).includes(destNum)) {
        // If number is not in the picked up items, and is not lower
        // than the lowest number, it must be in the list
        destItem = valueMap.get(destNum);
      } else {
        // Decrement the number to check, by 1
        destNum -= 1;
      }
    }

    // Put the picked up items back down after the destination
    const destNext = destItem.next;
    destItem.next = pickedUpItems[0];
    pickedUpItems[2].next = destNext;

    // Now look at the number after the current one
    currentCup = currentCup.next;
  }
}

const getCupOrder = (startConfig, rounds) => {
  const startList = startConfig.toString().split('').map(Number);
  const highestNum = Math.max(...startList);
  const lowestNum = Math.min(...startList);

  // This is a pointer to the first cup we will consider
  const { firstCup, valueMap } = generateCups(startList);

  playRound({ firstCup, valueMap, rounds, highestNum, lowestNum });

  // Get the final ordering of numbers starting from '1'
  let itemNode = valueMap.get(1).next;
  let order = '';
  while (itemNode.value !== 1) {
    order += itemNode.value.toString();
    itemNode = itemNode.next;
  }
  
  return order;
}

const getMillionCupNumbers = (startConfig, rounds) => {
  const startNumList = startConfig.toString().split('').map(Number);
  const highestNum = Math.max(...startNumList);
  const lowestNum = Math.min(...startNumList);

  for (let i = highestNum; i < ONE_MILLION; i++) {
    startNumList.push(i + 1);
  }

  const { firstCup, valueMap } = generateCups(startNumList);

  playRound({ firstCup, valueMap, rounds, highestNum: ONE_MILLION, lowestNum });

  let itemNode = valueMap.get(1).next;
  return itemNode.value * itemNode.next.value;
}

console.log('Part 1: ', getCupOrder(PUZZLE_INPUT, 100));
console.log('Part 2: ', getMillionCupNumbers(PUZZLE_INPUT, TEN_MILLION));
