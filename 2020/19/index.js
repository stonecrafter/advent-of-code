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

const isFullyProcessed = (rule) =>
  rule.split('').every((char) => 'ab|() '.indexOf(char) > -1);

const getRuleRegex = (startRule) => {
  let rule = startRule;
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
    const firstNumRules = rulesMap[firstNum];
    // Does this cause a split?
    const hasSplit = firstNumRules.indexOf('|') > -1;
    const newRulePiece = hasSplit ? `( ${firstNumRules} )` : firstNumRules;

    rule = rule.replace(firstNum, newRulePiece);
  }

  // Remove space delimiters
  return new RegExp(`^${rule.replace(/\s/g, '')}$`);
}

const getMatchCountForRule = (ruleId) => {
  const startRules = rulesMap[ruleId];
  const regex = getRuleRegex(startRules);

  return messagesList.reduce((acc, message) => !!message.match(regex) ? acc + 1 : acc, 0);
}

console.log('Part 1: ', getMatchCountForRule(0));
