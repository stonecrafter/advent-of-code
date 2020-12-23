const fs = require('fs');

const [timestamp, schedules] = fs.readFileSync('input.txt', 'utf8').split('\n');

const getWaitTimes = () => {
  const runningBusses = schedules.split(',').filter((bus) => bus !== 'x').map((x) => +x);
  const departureTime = +timestamp;
  const firstBus = runningBusses.reduce((acc, busId) => {
    const waitTime = busId - (departureTime % busId);
    return waitTime < acc.waitTime ? { busId, waitTime } : acc;
  }, { busId: 0, waitTime: Number.MAX_SAFE_INTEGER });

  return firstBus.busId * firstBus.waitTime;
}

const getEarliestConsecutiveTimestamp = () => {
  const runningBusses = schedules.split(',')
    .map((busId, idx) => ({ busId: +busId, idx }))
    .filter(({ busId }) => !Number.isNaN(busId))

  const { timestamp } = runningBusses.reduce((acc, { busId, idx }) => {
    // The first bus in the schedule
    if (idx === 0) return { ...acc, interval: busId };

    // Increment by the existing interval until one is
    // found which matches the expected time of the next bus
    let currTime = acc.timestamp;
    while ((currTime + idx) % busId !== 0) {
      currTime += acc.interval;
    }

    // The same position of these busses will recur at
    // their lowest common multiplier, so increasing the interval
    // by that number to check the next bus will guarantee the
    // condition remains satisfied for all previous busses
    return { timestamp: currTime, interval: acc.interval * busId };
  }, { timestamp: 0, interval: 0 });

  return timestamp;
}

console.log('Part 1: ', getWaitTimes());
console.log('Part 2: ', getEarliestConsecutiveTimestamp());
