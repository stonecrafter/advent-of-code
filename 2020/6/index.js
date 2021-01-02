const fs = require('fs');

const groupsList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n');

const getTotalYesCount = () => {
  const answersPerGroup = groupsList.map((group) => {
    const allYes = group.replace(/\n/g, '');
    return Array.from(new Set(allYes)).length;
  });

  return answersPerGroup.reduce((acc, numYes) => acc + numYes, 0);
};

const getTotalYesQuestionsCount = () => {
  const sharedAnswers = groupsList.map((group) => {
    // Get unique questions for each person
    const yesPerPerson = group.split('\n').map((yes) => Array.from(new Set(yes)));
    // Multi-array intersection: get questions everyone answered yes to
    // Not the most efficient, but it works
    return yesPerPerson.reduce((a, b) => a.filter((c) => b.includes(c))).length;
  });

  return sharedAnswers.reduce((acc, numYes) => acc + numYes, 0);
};

console.log('Part 1: ', getTotalYesCount());
console.log('Part 2: ', getTotalYesQuestionsCount());
