const fs = require('fs');

const inputLines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n');

const getCoordinates = (present, instr, newVal) => {
  let newPlace;

  switch (instr) {
    case 'N':
      newPlace = {
        ...present,
        y: present.y + newVal,
      };
      break;
    case 'S':
      newPlace = {
        ...present,
        y: present.y - newVal,
      };
      break;
    case 'E':
      newPlace = {
        ...present,
        x: present.x + newVal,
      };
      break;
    case 'W':
      newPlace = {
        ...present,
        x: present.x - newVal,
      };
      break;
    default:
      newPlace = present;
  }

  return newPlace;
};

const getValueWithDirection = (instr, value, currDir) => {
  const compass = ['N', 'E', 'S', 'W'];
  const numTurns = value / 90;
  const currIdx = compass.indexOf(currDir);

  let retVal = {};
  let newIdx;
  switch (instr) {
    case 'F':
      // Use the current face direction
      retVal = {
        newDir: currDir,
        newVal: value,
      };
      break;
    case 'L':
      newIdx = currIdx - numTurns < 0 ? (currIdx - numTurns + 4) : currIdx - numTurns;
      retVal = {
        newDir: compass[newIdx],
        newVal: 0,
      };
      break;
    case 'R':
      newIdx = currIdx + numTurns > 3 ? (currIdx + numTurns - 4) : currIdx + numTurns;
      retVal = {
        newDir: compass[newIdx],
        newVal: 0,
      };
      break;
    default:
      // No special direction instruction
      retVal = {
        newDir: instr,
        newVal: value,
      };
  }

  return retVal;
};

const getManhattanDistance = () => {
  let faceDirection = 'E';

  const coordinates = inputLines.reduce((acc, line) => {
    const instr = line[0];
    const value = +(line.slice(1, line.length));

    const { newVal, newDir } = getValueWithDirection(instr, value, faceDirection);

    if ('LR'.indexOf(instr) >= 0) {
      // Ship has changed face direction
      faceDirection = newDir;
    }

    return getCoordinates(acc, newDir, newVal);
  }, { x: 0, y: 0 });

  return Math.abs(coordinates.x) + Math.abs(coordinates.y);
};

const getRotatedCoordinates = ({ x, y }, instr, value) => {
  // 90, 180, 270 are the only valid values
  if (value === 180) {
    // Just flip the sign for both
    return { x: -x, y: -y };
  }

  if ((instr === 'L' && value === 90) || (instr === 'R' && value === 270)) {
    return { x: -y, y: x };
  } if ((instr === 'L' && value === 270) || (instr === 'R' && value === 90)) {
    return { x: y, y: -x };
  }

  // Default case
  return { x, y };
};

const getManhattanDistanceWithWaypoint = () => {
  const coordinates = inputLines.reduce((acc, line) => {
    const {
      waypointX, waypointY, actualX, actualY,
    } = acc;
    const instr = line[0];
    const value = +(line.slice(1, line.length));

    let newAcc;
    if ('NSEW'.indexOf(instr) >= 0) {
      // Move only the waypoint
      const newWaypoint = getCoordinates({ x: waypointX, y: waypointY }, instr, value);
      newAcc = {
        ...acc,
        waypointX: newWaypoint.x,
        waypointY: newWaypoint.y,
      };
    } else if ('LR'.indexOf(instr) >= 0) {
      // Rotate the waypoint
      const newWaypoint = getRotatedCoordinates({ x: waypointX, y: waypointY }, instr, value);
      newAcc = {
        ...acc,
        waypointX: newWaypoint.x,
        waypointY: newWaypoint.y,
      };
    } else if (instr === 'F') {
      // Move only the actual position
      newAcc = {
        ...acc,
        actualX: actualX + (value * waypointX),
        actualY: actualY + (value * waypointY),
      };
    } else {
      newAcc = acc;
    }

    return newAcc;
  }, {
    waypointX: 10, waypointY: 1, actualX: 0, actualY: 0,
  });

  return Math.abs(coordinates.actualX) + Math.abs(coordinates.actualY);
};

console.log('Part 1: ', getManhattanDistance());
console.log('Part 2: ', getManhattanDistanceWithWaypoint());
