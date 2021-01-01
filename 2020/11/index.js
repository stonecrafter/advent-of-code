const fs = require('fs');

// 2d array, equal columns
const seatMap = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map((line) => line.split(''));

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
  let currSeat;
  let currRow = row;
  let currCol = col;

  // Find the first thing that is not a floor
  do {
    currRow = currRow - 1;
    currCol = currCol - 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleTopCenter = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currRow = currRow - 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleTopRight = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currRow = currRow - 1;
    currCol = currCol + 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleCenterLeft = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currCol = currCol - 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleCenterRight = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currCol = currCol + 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleBottomLeft = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currRow = currRow + 1;
    currCol = currCol - 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleBottomCenter = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currRow = currRow + 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
}

const getFirstVisibleBottomRight = (row, col, seats) => {
  let currSeat;
  let currRow = row;
  let currCol = col;

  do {
    currRow = currRow + 1;
    currCol = currCol + 1;
    currSeat = (seats[currRow] || [])[currCol];
  } while (currSeat === '.')

  return currSeat === '#';
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

const getFinalTakenSeatsCount = (adjacentOnly = false) => {
  let currentSeats;
  let newSeats = seatMap;

  do {
    currentSeats = newSeats;
    newSeats = changeSeats(currentSeats, adjacentOnly)
  } while (JSON.stringify(newSeats) !== JSON.stringify(currentSeats));

  return getTakenSeatsCount(newSeats);
}

console.log('Part 1: ', getFinalTakenSeatsCount(true));
console.log('Part 2: ', getFinalTakenSeatsCount());
