const fs = require('fs');

const [rules, messages] = fs.readFileSync('input.txt', 'utf8').split('\n\n');

const messagesList = messages.split('\n');

const rulesMap = rules.split('\n').reduce((acc, rule) => {
  const [ruleId, mappings] = rule.split(': ');
  return {
    ...acc,
    [ruleId]: mappings.replace(/"/g, ''),
  }
}, {});

// Part 2 is crazy. According to the problem description we
// only care about handling these two numbers, not a generic case.
const rulesMapWithLoop = {
  ...rulesMap,
  8: '42 | 42 8',
  11: '42 31 | 42 11 31',
}

// Just the lowest number to get the right answer for my input....
const RECURSION_LIMIT = 5;

const isFullyProcessed = (rule) =>
  rule.split('').every((char) => 'ab|() '.indexOf(char) > -1);

const getRuleRegex = (startRule, withLoop, mapOfRules) => {
  let rule = startRule;
  let eightCount = 0;
  let elevenCount = 0;
  while (!isFullyProcessed(rule)) {    
    // Get the start index of the first number in the rule string
    const firstNumStart = rule.search(/\d/);
    // And then where the number ends
    // Account for possibility that this is the right-most number
    const nextSpace = rule.slice(firstNumStart).search(/\s/);
    const firstNumEnd = (nextSpace === -1) ? rule.length : firstNumStart + nextSpace;
    // And then the number itself
    const firstNum = rule.slice(firstNumStart, firstNumEnd);
    // What are that number's rules? ie. the numbers to replace this one with
    const firstNumRules = mapOfRules[firstNum];
    // Does this cause a split?
    const hasSplit = firstNumRules.indexOf('|') > -1;
    // If there is a split, we should include both...
    let newRulePiece = hasSplit ? `( ${firstNumRules} )` : firstNumRules;

    // Handle withLoop case for 8 and 11
    // These are part of the starting numbers and only referred to by the
    // starting number, no other numbers. So if we come across it more than once,
    // we can guarantee that it only came from a self referencing origin
    // Based on that we can just limit the number of recursions to something reasonable
    if (withLoop) {
      if (firstNum === '8') {
        if (eightCount < RECURSION_LIMIT) {
          eightCount += 1;
        } else {
          // Once we reach the limit, discard the recursive part of the split
          newRulePiece = firstNumRules.split(' |')[0];
        }
      } else if (firstNum === '11') {
        if (elevenCount < RECURSION_LIMIT) {
          elevenCount += 1;
        } else {
          newRulePiece = firstNumRules.split(' |')[0];
        }
      }
    }

    rule = rule.replace(firstNum, newRulePiece);
  }

  // Remove space delimiters
  return new RegExp(`^${rule.replace(/\s/g, '')}$`);
}

const getMatchCountForRule = (ruleId, withLoop = false) => {
  const mapOfRules = withLoop ? rulesMapWithLoop : rulesMap;
  const startRules = mapOfRules[ruleId];
  const regex = getRuleRegex(startRules, withLoop, mapOfRules);

  return messagesList.reduce((acc, message) => !!message.match(regex) ? acc + 1 : acc, 0);
}

console.log('Part 1: ', getMatchCountForRule(0));
console.log('Part 2: ', getMatchCountForRule(0, true));
