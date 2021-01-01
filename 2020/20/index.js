const fs = require('fs');

const tileList = fs.readFileSync('input.txt', 'utf8').split('\n\n');

const DIMENSION = Math.sqrt(tileList.length);

/**
 * SOLUTION FOR PART 1
 */

const tileBorderMap = tileList.reduce((acc, tile) => {
  const imageRows = tile.split('\n').slice(1);
  const tileId = tile.match(/\d+/)[0];
  return {
    ...acc,
    [tileId]: {
      top: imageRows[0],
      right: imageRows.reduce((acc, row) => acc + row[row.length - 1], ''),
      bottom: imageRows[imageRows.length - 1],
      left: imageRows.reduce((acc, row) => acc + row[0], ''),
    }
  }
}, {});

const findMatchingTileForBorder = (border, currentTileId) =>
  Object.keys(tileBorderMap).find((key) => {
    // Don't try to match with the current tile
    if (key === currentTileId) return false;
    const borders = Object.values(tileBorderMap[key]);
    return borders.includes(border) || borders.includes(border.split('').reverse().join(''));
  });

const countTileMatches = (tileId) => {
  const tilesToMatch = tileBorderMap[tileId];
  return Object.values(tilesToMatch)
    .reduce((acc, border) =>
      findMatchingTileForBorder(border, tileId) ? acc + 1 : acc,
    0);
}

const getCornerTiles = () =>
  Object.keys(tileBorderMap).reduce((acc, id) =>
    // Corner tiles are those having two borders that don't match anything?
    countTileMatches(id) === 2 ? acc * +id : acc, 1);

/**
 * BEGIN PART 2, aka the way more complicated part
 * I'm totally self-aware of how ugly this code is
 * I'd take the time to clean this up if it wasn't already 2021
 */

class Tile {
  constructor(id, image) {
    // This will never change
    this.id = id;

    // Set the entire contents - a 2d array
    this.image = image;

    // Borders will change every time rotation or flipping occurs
    this.leftBorder = null;
    this.topBorder = null;
    this.rightBorder = null;
    this.bottomBorder = null;

    this.updateBorders();

    // These will be set later during processing
    this.left = null;
    this.top = null;
    this.right = null;
    this.bottom = null;
  }

  updateBorders() {
    // Borders will change every time rotation or flipping occurs
    this.leftBorder = this.getLeftBorder();
    this.topBorder = this.getTopBorder();
    this.rightBorder = this.getRightBorder();
    this.bottomBorder = this.getBottomBorder();
  }

  getAllBorders() {
    return [
      this.getLeftBorder(),
      this.getTopBorder(),
      this.getRightBorder(),
      this.getBottomBorder()
    ];
  }

  rotateClockwise() {
    // 90 degrees
    const rotatedImage = [];
    for (let i = 0; i < this.image.length; i++) {
      rotatedImage.push(this.image.reduce((acc, row) => row[i] + acc, ''));
    }
    this.image = rotatedImage;

    this.updateBorders();
  }

  verticalFlip() {
    this.image = this.image.reverse();

    this.updateBorders();
  }

  horizontalFlip() {
    // Each nested array is a row, so reverse all of them
    this.image = this.image.map((row) => row.split('').reverse().join(''));

    this.updateBorders();
  }

  getLeftBorder() {
    // Goes from top to bottom, for ease of comparison with right borders
    return this.image.reduce((acc, row) => acc + row[0], '');
  }

  getTopBorder() {
    return this.image[0];
  }

  getRightBorder() {
    return this.image.reduce((acc, row) => acc + row[row.length - 1], '');
  }

  getBottomBorder() {
    return this.image[this.image.length - 1];
  }

  getCopyWithoutBorders() {
    return this.image
      .slice(1, this.image.length - 1)
      .map((row) => row.slice(1, row.length - 1));
  }
}

const tileMap = tileList.reduce((acc, tile) => {
  const imageRows = tile.split('\n').slice(1);
  const tileId = tile.match(/\d+/)[0];
  const newTile = new Tile(tileId, imageRows);
  return {
    ...acc,
    [tileId]: newTile
  }
}, {});

const getCurrentBorders = () =>
  Object.values(tileMap).map((tile) => ({
    id: tile.id,
    borders: tile.getAllBorders(),
  }));

// Corner tiles don't match 2 sides
const getCornerTileIds = () => {
  const currentBorders = getCurrentBorders();
  return Object.values(tileMap).reduce((acc, tile) => {
    const borders = tile.getAllBorders();
    const matchCount = borders.reduce((acc, border) => {
      const matched = currentBorders.some((otherTile) =>
        (otherTile.id !== tile.id) &&
        (otherTile.borders.includes(border) || otherTile.borders.includes(border.split('').reverse().join('')))
      )
      return matched ? acc + 1 : acc;
    }, 0);

    return matchCount === 2 ? [...acc, tile.id] : acc;
  }, []);
}

const findMatchingTile = (border, id) => {
  const currentBorders = getCurrentBorders();
  const match = currentBorders.find((otherTile) =>
    (otherTile.id !== id) && otherTile.borders.includes(border)
  )

  // Don't bother checking reverse if already found a positive match
  if (match) return { match, reversed: false };

  const matchReversed = currentBorders.find((otherTile) =>
    (otherTile.id !== id) && otherTile.borders.includes(border.split('').reverse().join(''))
  )

  if (matchReversed) return { match: matchReversed, reversed: true };

  return null;
}

const buildFirstRow = (startingTile) => {
  let currentTile = startingTile;
  let firstRow = [startingTile.id];
  while (firstRow.length < DIMENSION) {
    // Current tile's right pointer will already be another tile id
    // But which one of that tile's borders is a match?
    const targetTile = tileMap[currentTile.right];
    while (!targetTile.left) {
      if (currentTile.rightBorder === targetTile.leftBorder) {
        // Yay, an exact match!
        targetTile.left = currentTile.id;
      } else if (currentTile.rightBorder === targetTile.leftBorder.split('').reverse().join('')) {
        // The current tile is already in place, so the target tile should be flipped
        targetTile.verticalFlip();
        // Now it is a proper match
        targetTile.left = currentTile.id;
      } else {
        // The left border is not a match... rotate and try again
        targetTile.rotateClockwise();
      }
    }

    // Now that the target tile is in place, we need to
    // find the id of the tile to its right... if there is one
    const matchRight = findMatchingTile(targetTile.rightBorder, targetTile.id);
    if (matchRight) {
      targetTile.right = matchRight.match.id;
    }

    // Get the bottom match too - it'll come in handy later
    const matchBottom = findMatchingTile(targetTile.bottomBorder, targetTile.id);
    // For the first row, a match should always exist
    targetTile.bottom = matchBottom.match.id;

    // This tile is ready to be added to the list and then we can move on
    firstRow.push(targetTile.id);
    currentTile = targetTile;
  }

  return firstRow;
}

const buildRow = (prevRow) => {
  const newRow = [];
  let currIdx = 0;
  while (newRow.length < DIMENSION) {
    let upstairsTile = tileMap[prevRow[currIdx]];
    const targetTile = tileMap[upstairsTile.bottom];
    while (!targetTile.top) {
      if (upstairsTile.bottomBorder === targetTile.topBorder) {
        // Yay, an exact match!
        targetTile.top = upstairsTile.id;
      } else if (upstairsTile.bottomBorder === targetTile.topBorder.split('').reverse().join('')) {
        // The current tile is already in place, so the target tile should be flipped
        targetTile.horizontalFlip();
        // Now it is a proper match
        targetTile.top = upstairsTile.id;
      } else {
        // The top border is not a match... rotate and try again
        targetTile.rotateClockwise();
      }
    }

    // Now that the target tile is in place, we need to
    // find the id of the tile below it... if there is one
    const matchBottom = findMatchingTile(targetTile.bottomBorder, targetTile.id);
    if (matchBottom) {
      // Will not exist if this is the final row
      targetTile.bottom = matchBottom.match.id;
    }

    // This tile is ready to be added to the list and then we can move on
    newRow.push(targetTile.id);
    currIdx += 1;
  }

  return newRow;
}

const getSeaMonsterCount = (tile) => {
  const { image } = tile;
  // Use this one to determine the starting index for testing the other two
  const BODY = new RegExp(/#....##....##....###/);
  const HEAD = new RegExp(/^.{18}#./);
  const TAIL = new RegExp(/^.#..#..#..#..#..#.../);

  let count = 0;
  for (let i = 1; i < image.length - 1; i++) {
    const bodyMatch = image[i].match(BODY);
    if (bodyMatch) {
      // Check the head and tail also match, starting from
      // the index of the body match
      const headToCheck = image[i - 1].slice(bodyMatch.index);
      const tailToCheck = image[i + 1].slice(bodyMatch.index);
      if (headToCheck.match(HEAD) && tailToCheck.match(TAIL)) {
        count += 1;
      }
    }
  }

  return count;
}

const buildImage = () => {
  const cornerTiles = getCornerTileIds();

  // Start by taking an arbitrary corner tile
  // At the end we may need to rotate the entire image anyway
  const startingTile = tileMap[cornerTiles[0]];
  // We want to find an orientation where the right and bottom borders
  // has a match and the top and left ones do not
  while (!startingTile.right) {
    const matchRight = findMatchingTile(startingTile.rightBorder, startingTile.id);
    const matchBottom = findMatchingTile(startingTile.bottomBorder, startingTile.id);
    const matchTop = findMatchingTile(startingTile.topBorder, startingTile.id);
    const matchLeft = findMatchingTile(startingTile.leftBorder, startingTile.id);

    if (!matchTop && !matchLeft && matchRight && matchBottom) {
      startingTile.right = matchRight.match.id;
      startingTile.bottom = matchBottom.match.id;
    } else {
      startingTile.rotateClockwise();
    }
  }

  // With the starting tile in place, get the rest of the first row
  const firstRow = buildFirstRow(startingTile);

  const imageIdList = [firstRow];
  // Now we can build the rest of the rows, one at a time,
  // using bottom pointers from the previous row
  let currentRow = firstRow;
  while (imageIdList.length < DIMENSION) {
    const newRow = buildRow(currentRow);
    imageIdList.push(newRow);
    currentRow = newRow;
  }

  const finalImage = imageIdList.reduce((finalRows, tileRow) => {
    const imageRows = tileRow.reduce((acc, tileId) => {
      const croppedTile = tileMap[tileId].getCopyWithoutBorders();
      if (!acc) {
        return croppedTile;
      } else {
        return croppedTile.map((rowInImage, idx) => acc[idx] + rowInImage);
      }
    }, null);

    return [].concat(finalRows, imageRows);
  }, []);

  // Turn it into a tile to take advantage of rotate and flip functionality
  // id can just be something arbitrary
  return new Tile('final', finalImage);
}

const findSeaMonstersFromImage = (imageTile) => {
  let seaMonsterCount = 0;
  // At least one sea monster is guaranteed to exist
  while (seaMonsterCount === 0) {
    seaMonsterCount = getSeaMonsterCount(imageTile);
    if (seaMonsterCount) break;

    // Try a horizontal flip
    imageTile.horizontalFlip();
    seaMonsterCount = getSeaMonsterCount(imageTile);
    if (seaMonsterCount) break;

    // Try a horizontal AND vertical flip
    imageTile.verticalFlip();
    seaMonsterCount = getSeaMonsterCount(imageTile);
    if (seaMonsterCount) break;

    // Try just a vertical flip (by reverting the horizontal flip)
    imageTile.horizontalFlip();
    seaMonsterCount = getSeaMonsterCount(imageTile);
    if (seaMonsterCount) break;

    // Reset to original position, then try rotating...
    imageTile.verticalFlip();
    imageTile.rotateClockwise();
  }

  return seaMonsterCount;
}

const getNonSeaMonsterCount = () => {
  // A seamonster consists of 15 '#' symbols
  const SEAMONSTER_SIZE = 15;

  const imageTile = buildImage();
  const seaMonsterCount = findSeaMonstersFromImage(imageTile);
  const hashtagCount = imageTile.image.reduce((acc, row) =>
    acc + row.split('').reduce((acc1, cell) => cell === '#' ? acc1 + 1 : acc1, 0),
    0);

  return hashtagCount - (seaMonsterCount * SEAMONSTER_SIZE);
}

console.log('Part 1: ', getCornerTiles());
console.log('Part 2: ', getNonSeaMonsterCount());
