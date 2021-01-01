const fs = require('fs');

const [rules, myTicket, otherTickets] = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n');

const { departureIndices, parsedRules } = rules.split('\n')
  .reduce((acc, rule, idx) => {
    const [instruction, values] = rule.split(': ');

    // Not the most intuitive datastructure, but it works for now
    // min1-max1 or min2-max2 => [min1, max1, min2, max2]
    return {
      departureIndices:
        instruction.startsWith('departure') ?
          [...acc.departureIndices, idx] :
          acc.departureIndices,
      parsedRules: [
        ...acc.parsedRules,
        values.split(' or ').join('-').split('-').map(Number),
      ]
    }
  }, { departureIndices: [], parsedRules: [] });

const isValidForAnyRule = (value) =>
  parsedRules.some((rule) => isValidForRule(rule, value));

const isValidForRule = (rule, value) => {
  const [min1, max1, min2, max2] = rule;
  return (value >= min1 && value <= max1) || (value >= min2 && value <= max2);
}

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

const validTickets = otherTickets
  .split('\n')
  .slice(1)
  .reduce((acc, ticket) => {
    const parsedTicket = ticket.split(',').map(Number);
    const isInvalid = parsedTicket
      .some((detail) => !isValidForAnyRule(detail));
    return isInvalid ? acc : [...acc, parsedTicket];
  }, []);

const hasDepartureKeys = (arr) =>
  departureIndices.every((index) => arr.includes(`${index}`));

const getMatchingColumns = (rule) => {
  const matchingColumns = [];
  // All tickets have same length
  for (let i = 0; i < validTickets[0].length; i++) {
    if (validTickets.every((ticket) => isValidForRule(rule, ticket[i]))) {
      matchingColumns.push(i);
    }
  }

  return matchingColumns;
}

const getDepartureCode = () => {
  // Key - rule, value - column in the ticket
  const ruleToColumn = {};

  // Keep going until every rule has been matched to a column
  while (!hasDepartureKeys(Object.keys(ruleToColumn))) {
    parsedRules.forEach((rule, idx) => {
      // Don't bother with already matched rules
      if (!ruleToColumn[rule]) {
        const matchingColumns = getMatchingColumns(rule);
        const filteredColumns = matchingColumns.filter((col) => !Object.values(ruleToColumn).includes(col));
        if (filteredColumns.length === 1) {
          ruleToColumn[idx] = filteredColumns[0];
        }
      }
    });
  }

  const myParsedTicket = myTicket.split(',').map(Number);
  return departureIndices.reduce((acc, index) =>
    acc * myParsedTicket[ruleToColumn[index]], 1);
}

console.log('Part 1: ', getErrorRate());
console.log('Part 2: ', getDepartureCode());
