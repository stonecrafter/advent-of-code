const fs = require('fs');

const tileList = fs.readFileSync('input.txt', 'utf8').split('\n\n');

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

console.log('Part 1: ', getCornerTiles());
