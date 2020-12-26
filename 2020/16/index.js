const fs = require('fs');

const [rules, myTicket, otherTickets] = fs.readFileSync('input.txt', 'utf8').split('\n\n');

const parsedRules = rules.split('\n').map((rule) => {
  const [_, values] = rule.split(': ');
  // Not the most intuitive datastructure, but it works for now
  // min1-max1 or min2-max2 => [min1, max1, min2, max2]
  return values.split(' or ').join('-').split('-').map(Number);
});

const isValidForAnyRule = (value) =>
  parsedRules.some((rule) => {
    const [min1, max1, min2, max2] = rule;
    return (value >= min1 && value <= max1) || (value >= min2 && value <= max2);
  });

const getErrorRate = () => {
  // The first line is not a ticket
  const tickets = otherTickets.split('\n').slice(1);

  let invalidCount = 0;
  tickets.forEach((ticket) => {
    ticket.split(',').forEach((detail) => {
      const val = +detail;
      if (!isValidForAnyRule(val)) {
        invalidCount += val;
      }
    });
  });

  return invalidCount;
}

console.log('Part 1: ', getErrorRate());
