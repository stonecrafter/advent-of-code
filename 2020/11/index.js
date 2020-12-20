const fs = require('fs');

// 2d array, equal columns
const seatMap = fs.readFileSync('input.txt', 'utf8').split('\n').map((line) => line.split(''));

const getSeatOccupied = (row, col, seats) => {
  const seat = (seats[row] || [])[col];
  return seat === '#'
}

const getAdjacentOccupiedCount = (row, col, seats) => {
  const occupiedSeats = [
    getSeatOccupied(row - 1, col - 1, seats),
    getSeatOccupied(row - 1, col, seats),
    getSeatOccupied(row - 1, col + 1, seats),
    getSeatOccupied(row, col - 1, seats),
    getSeatOccupied(row, col + 1, seats),
    getSeatOccupied(row + 1, col - 1, seats),
    getSeatOccupied(row + 1, col, seats),
    getSeatOccupied(row + 1, col + 1, seats),
  ];

  // Count total number of occupied adjacent seats
  return occupiedSeats.reduce((acc, seat) => !!seat ? acc + 1 : acc, 0);
}

const getFirstVisibleTopLeft = (row, col, seats) => {

}

const getFirstVisibleTopCenter = (row, col, seats) => {

}

const getFirstVisibleTopRight = (row, col, seats) => {

}

const getFirstVisibleCenterLeft = (row, col, seats) => {

}

const getFirstVisibleCenterRight = (row, col, seats) => {

}

const getFirstVisibleBottomLeft = (row, col, seats) => {

}

const getFirstVisibleBottomCenter = (row, col, seats) => {

}

const getFirstVisibleBottomRight = (row, col, seats) => {

}

const getVisibleOccupiedCount = (row, col, seats) => {
  const occupiedSeats = [
    getFirstVisibleTopLeft(row, col, seats),
    getFirstVisibleTopCenter(row, col, seats),
    getFirstVisibleTopRight(row, col, seats),
    getFirstVisibleCenterLeft(row, col, seats),
    getFirstVisibleCenterRight(row, col, seats),
    getFirstVisibleBottomLeft(row, col, seats),
    getFirstVisibleBottomCenter(row, col, seats),
    getFirstVisibleBottomRight(row, col, seats),
  ];

  return occupiedSeats.reduce((acc, seat) => !!seat ? acc + 1 : acc, 0);
}

const changeSeats = (currentSeats, adjacentOnly) =>
  currentSeats.map((row, rowNum) =>
    row.map((seat, colNum) => {
      const occupiedCount = adjacentOnly ?
        getAdjacentOccupiedCount(rowNum, colNum, currentSeats) :
        getVisibleOccupiedCount(rowNum, colNum, currentSeats);

      // Adjacent rules make humans pickier, apparently
      const limit = adjacentOnly ? 3 : 4;

      // Should an empty seat become occupied
      if (seat === 'L' && occupiedCount === 0) {
        return '#';
      }

      // Should an occupied seat become empty
      if (seat === '#' && occupiedCount > limit) {
        return 'L'
      }

      return seat;
    })
  );

const getTakenSeatsCount = (seats) =>
    seats.reduce((acc, row) =>
      acc + row.reduce((rowAcc, seat) => seat === '#' ? rowAcc + 1 : rowAcc, 0), 0);

const getFinalTakenSeatsCount = (adjacentOnly) => {
  let currentSeats;
  let newSeats = seatMap;

  do {
    currentSeats = newSeats;
    newSeats = changeSeats(currentSeats, adjacentOnly)
  } while (JSON.stringify(newSeats) !== JSON.stringify(currentSeats));

  return getTakenSeatsCount(newSeats);
}

console.log('Part 1: ', getFinalTakenSeatsCount(adjacentOnly));
console.log('Part 2: ', getFinalTakenSeatsCount());
