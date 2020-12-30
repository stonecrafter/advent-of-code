const fs = require('fs');

const inputList = fs.readFileSync('input.txt', 'utf8').split('\n');

const { mapByAllergen, listByFood, mapByIngredient } = inputList.reduce((acc, food, foodItemIndex) => {
  const [ingredients, allergens] = food.split(' (');
  const ingredientsList = ingredients.split(' ');
  const allergenList = allergens.split(' ').slice(1).map((item) => item.replace(/\)|,/g, ''));

  const newAllergenMap = allergenList.reduce((map, allergen) => ({
    ...map,
    [allergen]: [...(acc.mapByAllergen[allergen] || []), ...ingredientsList],
  }), {});

  const newIngredientsMap = ingredientsList.reduce((map, ingredient) => ({
    ...map,
    [ingredient]: [...(acc.mapByIngredient[ingredient] || []), foodItemIndex]
  }), {});

  return {
    mapByAllergen: {
      ...acc.mapByAllergen,
      ...newAllergenMap,
    },
    listByFood: [].concat(acc.listByFood, {
      items: ingredientsList,
      allergens: allergenList,
    }),
    mapByIngredient: {
      ...acc.mapByIngredient,
      ...newIngredientsMap,
    }
  }
}, { mapByAllergen: {}, listByFood: [], mapByIngredient: {} });

const countOccurrences = (arr, val) =>
  arr.reduce((acc, item) => item === val ? acc + 1 : acc, 0);

const getUnsafeItems = () => {
  const unsafeItems = Object.keys(mapByAllergen).reduce((acc, allergen) => {
    // Go through the list of allergens, and inside each allergen,
    // look at every item. If the count of that item is equal
    // to the number of foods listed as containing that allergen,
    // that ingredient is potentially unsafe
    const allergenList = mapByAllergen[allergen];
    const notThisAllergen = allergenList.filter((item) => {
      const itemCountInList = countOccurrences(allergenList, item);
      const foodsWithAllergen = listByFood.filter((food) => food.allergens.includes(allergen));
      return itemCountInList === foodsWithAllergen.length;
    });

    return [...acc, ...notThisAllergen];
  }, []);

  // Remove duplicates
  return Array.from(new Set(unsafeItems));
}

const getAllergenCount = () => {
  // All foods that are not in the unsafe list, is safe
  const unsafeItems = getUnsafeItems();
  const safeItems = Object.keys(mapByIngredient).reduce((acc, item) =>
    unsafeItems.includes(item) ? acc : [...acc, item], []);

  // Get all occurrences of any of the safe foods
  return safeItems.reduce((acc, item) => acc + mapByIngredient[item].length, 0);
}

const getAllergenList = () => {
  const unsafeItems = getUnsafeItems();
  // Keep track of which ingredients are potentially still allergens
  const potentialAllergens = Object.keys(mapByAllergen).reduce((acc, key) => {
    const items = Array.from(new Set(mapByAllergen[key].filter((item) => unsafeItems.includes(item))))
    return {
      ...acc,
      [key]: items
    };
  }, {});

  // Do all items containing this allergen, also contain this ingredient?
  // This nested loop hurts a little :D
  Object.keys(mapByAllergen).forEach((allergen) => {
    unsafeItems.forEach((unsafeItem) => {
      listByFood.forEach((food) => {
        if (food.allergens.includes(allergen) && !food.items.includes(unsafeItem)) {
          // Remove this item as a potential candidate for this allergen
          potentialAllergens[allergen] =
            potentialAllergens[allergen].filter((i) => i !== unsafeItem);
        }
      });
    });
  });

  // Keep going until every allergen maps to exactly one ingredient
  // This is guaranteed to be possible in the puzzle input
  while (Object.values(potentialAllergens).some((arr) => arr.length > 1)) {
    // If an allergen maps to only one ingredient, remove that ingredient
    // from the potential list of all other allergens
    Object.keys(potentialAllergens).forEach((allergen) => {
      const potentialItems = potentialAllergens[allergen];
      if (potentialItems.length === 1) {

        Object.keys(potentialAllergens).forEach((otherAllergen) => {
          if (otherAllergen !== allergen) {
            potentialAllergens[otherAllergen] =
              potentialAllergens[otherAllergen].filter((i) => i !== potentialItems[0]);
          }
        });
      }
    });
  }

  // Get alphabetically sorted list of ingredients
  return Object.keys(potentialAllergens)
    .sort((a, b) => a.localeCompare(b))
    .map((sortedAllergen) => potentialAllergens[sortedAllergen])
    .join(',');
}

console.log('Part 1: ', getAllergenCount());
console.log('Part 2: ', getAllergenList());
