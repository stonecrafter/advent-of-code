const fs = require('fs');

const [rules, messages] = fs.readFileSync('input.txt', 'utf8').split('\n');

const getMatchCountForRule = (ruleId) => {
  
}

console.log('Part 1: ', getMatchCountForRule(0));
