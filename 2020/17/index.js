const fs = require('fs');

const inputLines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

const getInitialState = (is4d = false) => {
  const state = [];
  inputLines.forEach((row, rowIdx) => {
    row.split('').forEach((cell, colIdx) => {
      if (cell === '#') {
        const startLocation = is4d ? `${rowIdx},${colIdx},0,0` : `${rowIdx},${colIdx},0`;
        state.push(startLocation);
      }
    });
  });

  return state;
}

const getNeighbourPositions = (pos) =>
  pos.split(',').reduce((processingArray, char, idx) => {
    if (char === ',') return processingArray;

    // Split this character into +, - and self
    const num = +char;
    return processingArray.reduce((acc, item) => {
      const splitItem = item.split(',');
      const lowItem = [...splitItem];
      const highItem = [...splitItem];
      lowItem[idx] = (num - 1);
      highItem[idx] = (num + 1);

      return [
        ...acc,
        lowItem.join(','),
        item,
        highItem.join(',')
      ]
    }, []);
  }, [pos])
  // Don't include self as a neighbour
  .filter((neighbour) => neighbour !== pos);

const getNumActive = (cellList, activeList) =>
  cellList.reduce((acc, cell) => activeList.includes(cell) ? acc + 1 : acc, 0);

// Should this cube be active or inactive in the next iteration?
const shouldCubeBeActive = (cubePos, isActive, activeList) => {
  const neighbours = getNeighbourPositions(cubePos);
  const activeNeighboursCount = getNumActive(neighbours, activeList);

  if (isActive) {
    // Stays active if exactly 2 or 3 active neighbours
    return (activeNeighboursCount === 2 || activeNeighboursCount === 3);
  } else {
    // Becomes active if exactly 3 neighbours are active
    return activeNeighboursCount === 3;
  }
}

const iterate = (activeList) => {
  const newActiveList = [];
  const checkedItems = [];
  activeList.forEach((activeItem) => {
    // Get all neighbours - include oneself
    const neighboursAndSelf = [...getNeighbourPositions(activeItem), activeItem];

    // Check if each item should be active
    neighboursAndSelf.forEach((item) => {
      // Skip checking if it has already been checked before
      if (!checkedItems.includes(item)) {
        checkedItems.push(item);
        const isItemActive = activeList.includes(item);
        if (shouldCubeBeActive(item, isItemActive, activeList)) {
          newActiveList.push(item);
        }
      }
    });
  });

  return newActiveList;
}

const getActiveCubes = (iterations, is4d) => {
  let activeList = getInitialState(is4d);
  for (let i = 0; i < iterations; i++) {
    activeList = iterate(activeList);
  }

  return activeList.length;
}

console.log('Part 1: ', getActiveCubes(6));
console.log('Part 2: ', getActiveCubes(6, true));
