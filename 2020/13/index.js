const fs = require('fs');

const [timestamp, schedules] = fs.readFileSync('input.txt', 'utf8').split('\n');
const runningBusses = schedules.split(',').filter((bus) => bus !== 'x').map((x) => +x);

const getWaitTimes = () => {
  const departureTime = +timestamp;
  const firstBus = runningBusses.reduce((acc, busId) => {
    const waitTime = busId - (departureTime % busId);
    return waitTime < acc.waitTime ? { busId, waitTime } : acc;
  }, { busId: 0, waitTime: Number.MAX_SAFE_INTEGER });

  return firstBus.busId * firstBus.waitTime;
}

console.log('Part 1: ', getWaitTimes());
