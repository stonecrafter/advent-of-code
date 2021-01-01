const fs = require('fs');

const passportList = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n');

const REQUIRED_FIELDS = [
  'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
];

const passportData = passportList.map((passport) =>
  // Whitespace match: newline, tab, space are valid delimiters within a passport
  passport.split(/\s/).reduce((acc, dataField) => {
    const [key, val] = dataField.split(':');
    return {
      ...acc,
      [key]: val,
    }
  }, {}));

// Validating only field presence
const getValidFieldsPassportsCount = () =>
  passportData.reduce((acc, passport) => 
    REQUIRED_FIELDS.every((field) => !!passport[field]) ? acc += 1 : acc, 0);

// Helper functions for validating the input of each field
const isValidNumRange = (year, min, max) =>
  year && year >= min && year <= max;

const isValidHeight = (height) => {
  if (!height) return false;

  const isMetric = height.match(/^\d+cm$/);
  const isImperial = height.match(/^\d+in$/);
  const heightValue = +height.substring(0, height.length - 2);

  if (isMetric) {
    return isValidNumRange(heightValue, 150, 193);
  } else if (isImperial) {
    return isValidNumRange(heightValue, 59, 76);
  }

  return false;
}

const isValidHairColour = (hairColour) =>
  hairColour && hairColour.match(/^#[0-9a-f]{6}$/)

const isValidEyeColour = (eyeColour) => {
  const EYE_COLOURS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  return eyeColour && EYE_COLOURS.includes(eyeColour);
}

const isValidPassportId = (id) =>
  id && id.match(/^\d{9}$/)

// Put it all together
const getValidInputsPassportsCount = () =>
  passportData.reduce((acc, passport) => {
    const validBirthYear = isValidNumRange(passport.byr, 1920, 2002);
    const validIssueYear = isValidNumRange(passport.iyr, 2010, 2020);
    const validExpirationYear = isValidNumRange(passport.eyr, 2020, 2030);
    const validHeight = isValidHeight(passport.hgt);
    const validHairColour = isValidHairColour(passport.hcl);
    const validEyeColour = isValidEyeColour(passport.ecl);
    const validPassportId = isValidPassportId(passport.pid);

    return validBirthYear &&
      validIssueYear && 
      validExpirationYear &&
      validHeight &&
      validHairColour &&
      validEyeColour &&
      validPassportId ?
      acc += 1 :
      acc;
  }, 0);

console.log('Part 1: ', getValidFieldsPassportsCount());
console.log('Part 2: ', getValidInputsPassportsCount());
