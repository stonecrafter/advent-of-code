const fs = require('fs');

const tileList = fs.readFileSync('input.txt', 'utf8').split('\n').map((tile) => {
  // Get a list of all the matches
  const directions = [];
  for (let i = 0; i < tile.length; i++) {
    if (tile[i] === 'n' || tile[i] === 's') {
      directions.push(tile.slice(i, i + 2));
      i += 1;
    } else {
      directions.push(tile[i]);
    }
  }

  return directions;
});

const setupTiles = (tileSet) => {
  tileList.forEach((tile) => {
    // Assume center of hex is 0, 0
    // Directions:
    // nw: -1, 1
    // ne: 1, 1
    // e: 2, 0
    // se: 1, -1
    // sw: -1, -1
    // w: -2, 0
    const endTile = tile.reduce(([x, y], moveDir) => {
      switch (moveDir) {
        case 'nw':
          return [x - 1, y + 1];
        case 'ne':
          return [x + 1, y + 1];
        case 'e':
          return [x + 2, y];
        case 'se':
          return [x + 1, y - 1];
        case 'sw':
          return [x - 1, y - 1];
        case 'w':
          return [x - 2, y];
      }
    }, [0, 0]).join(',');

    if (tileSet.has(endTile)) {
      tileSet.delete(endTile);
    } else {
      tileSet.add(endTile);
    }
  });
}

const getActiveTileCount = () => {
  const activeTiles = new Set();

  setupTiles(activeTiles);

  return activeTiles.size;
}

const getNeighbourPositions = (pos) => {
  const [x, y] = pos.split(',').map(Number);
  return [
    `${x - 1},${y + 1}`,
    `${x + 1},${y + 1}`,
    `${x + 2},${y}`,
    `${x + 1},${y - 1}`,
    `${x - 1},${y - 1}`,
    `${x - 2},${y}`
  ];
}

// Shamelessly copied over from day 17
const getNumActive = (listToCheck, activeSet) =>
  listToCheck.reduce((acc, cell) => activeSet.has(cell) ? acc + 1 : acc, 0);

// Should this position be active ("black") or inactive in the next iteration?
const shouldItemBeActive = (position, isActive, activeSet) => {
  const neighbours = getNeighbourPositions(position);
  const activeNeighboursCount = getNumActive(neighbours, activeSet);
  
  if (isActive) {
    // Stays active if exactly 1 or 2 active neighbours
    return (activeNeighboursCount === 1 || activeNeighboursCount === 2);
  } else {
    // Becomes active if exactly 2 neighbours are active
    return activeNeighboursCount === 2;
  }
}

const iterate = (activeSet) => {
  const checkedItems = new Set();
  const newSet = new Set(activeSet);
  activeSet.forEach((activeItem) => {
    // Get all neighbours - include oneself
    const neighboursAndSelf = [...getNeighbourPositions(activeItem), activeItem];

    // Check if each item should be active
    neighboursAndSelf.forEach((item) => {
      // Skip checking if it has already been checked before
      if (!checkedItems.has(item)) {
        checkedItems.add(item);
        const isItemActive = activeSet.has(item);
        const shouldBeActive = shouldItemBeActive(item, isItemActive, activeSet);
        if (!isItemActive && shouldBeActive) {
          newSet.add(item);
        } else if (isItemActive && !shouldBeActive) {
          newSet.delete(item);
        }
      }
    });
  });

  return newSet;
}

const getCountAfterRounds = (rounds) => {
  let activeTiles = new Set();

  // This gets the initial tile configuration
  setupTiles(activeTiles);

  for (let i = 0; i < rounds; i++) {
    activeTiles = iterate(activeTiles);
  }

  return activeTiles.size;
}

console.log('Part 1: ', getActiveTileCount());
console.log('Part 2: ', getCountAfterRounds(100));
