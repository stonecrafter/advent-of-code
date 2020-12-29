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

const getAllergenCount = () => {
  // Go through the list of allergens, and inside each allergen,
  // look at every item. If the count of that item is equal
  // to the number of foods listed as containing that allergen,
  // that ingredient is potentially unsafe
  const unsafeItems = Object.keys(mapByAllergen).reduce((acc, allergen) => {
    const allergenList = mapByAllergen[allergen];
    const notThisAllergen = allergenList.filter((item) => {
      const itemCountInList = countOccurrences(allergenList, item);
      const foodsWithAllergen = listByFood.filter((food) => food.allergens.includes(allergen));
      return itemCountInList === foodsWithAllergen.length;
    });

    return [...acc, ...notThisAllergen];
  }, []);

  // All foods that are not in the unsafe list, is safe
  const safeItems = Object.keys(mapByIngredient).reduce((acc, item) =>
    unsafeItems.includes(item) ? acc : [...acc, item], []);

  // Get all occurrences of any of the safe foods
  return safeItems.reduce((acc, item) => acc + mapByIngredient[item].length, 0);
}

console.log('Part 1: ', getAllergenCount());
