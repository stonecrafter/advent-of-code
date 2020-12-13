const fs = require('fs');

const bagsList = fs.readFileSync('input.txt', 'utf8').split('\n');

const bagsMap = bagsList.reduce((bagsAcc, bag) => {
  // Split into bag id and contents, ie:
  // muted crimson bags contain 1 clear violet bag, 5 dark coral bags, 1 pale salmon bag, 3 light red bags.
  // ['muted crimson bags', '1 clear violet bag, 5 dark coral bags, 1 pale salmon bag, 3 light red bags.']
  const [name, contents] = bag.split(' contain ');
  // 'muted crimson'
  const bagName = name.split(' ').splice(0, 2).join(' ');

  if (contents === 'no other bags.') {
    return {
      ...bagsAcc,
      [bagName]: null,
    }
  } else {
    const contentMap = contents.split(', ').reduce((contentAcc, item) => {
      const [count, type, color] = item.split(' ');
      // 'clear violet'
      const itemName = [type, color].join(' ');
      return {
        ...contentAcc,
        [itemName]: +count,
      }
    }, {});
  
    return {
      ...bagsAcc,
      [bagName]: contentMap,
    }
  }
}, {});

const findBag = (currentBagId, targetBagId) => {
  // Found the bag!
  if (currentBagId === targetBagId) return true;

  // Base case, nowhere else to go
  if (bagsMap[currentBagId] === null) return false;

  // Recurse...
  const childBags = Object.keys(bagsMap[currentBagId]);
  return childBags.some((bag) => findBag(bag, targetBagId));
}

const getPossibilitiesCount = (targetBag) =>
  Object.keys(bagsMap).filter((bag) => findBag(bag, targetBag)).length;

const getTotalChildBags = (targetBag) => {
  const childBags = bagsMap[targetBag];

  if (!childBags) return 0;

  return Object.keys(childBags).reduce((acc, bagId) =>
    acc + childBags[bagId] + childBags[bagId] * getTotalChildBags(bagId), 0);
}

console.log('Part 1: ', getPossibilitiesCount('shiny gold'));
console.log('Part 2: ', getTotalChildBags('shiny gold'));
