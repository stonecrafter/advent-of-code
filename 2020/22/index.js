const fs = require('fs');

const [player1, player2] = fs.readFileSync('input.txt', 'utf8').split('\n\n');

// Start of array is the top of the deck
// Shift to play from top, push to add to bottom
const playerOneStart = player1.split('\n').slice(1).map(Number);
const playerTwoStart = player2.split('\n').slice(1).map(Number);

const playRound = (deck1, deck2) => {
  const playOne = deck1.shift();
  const playTwo = deck2.shift();

  if (playOne > playTwo) {
    deck1.push(playOne, playTwo);
  } else {
    // Card numbers are guaranteed to be unique in the deck
    deck2.push(playTwo, playOne);
  }
}

// Keep track of card configurations in each round
const playRecursiveRound = (deck1, deck2, roundConfigs) => {
  // Someone's deck has no cards, stop
  // This shouldn't happen, but just in case
  if (deck1.length === 0 || deck2.length === 0) return;

  // If this configuration has existed before,
  // player 1 instantly wins... we can represent this for now by
  // killing all of player 2's cards
  const areBothDecksEqual = roundConfigs.some((round) =>
    ((round.deck1.join(',') === deck1.join(',')) &&
    (round.deck2.join(',') === deck2.join(',')))
  );
  if (areBothDecksEqual) {
    return deck2.splice(0, deck2.length);
  }

  roundConfigs.push({ deck1: [...deck1], deck2: [...deck2] });

  // Each draw a new card
  const playOne = deck1.shift();
  const playTwo = deck2.shift();

  // If both players have at least as many cards remaining
  // in their deck as the value of the card they just drew,
  // the winner of the round is determined by playing
  // a new sub-game
  if (deck1.length >= playOne && deck2.length >= playTwo) {
    const deck1Copy = deck1.slice(0, playOne);
    const deck2Copy = deck2.slice(0, playTwo);
    const newRoundConfigs = [];
    while (deck1Copy.length > 0 && deck2Copy.length > 0) {
      playRecursiveRound(deck1Copy, deck2Copy, newRoundConfigs);
    }
    
    if (deck1Copy.length === 0) {
      // Player 2 wins
      deck2.push(playTwo, playOne);
    } else {
      deck1.push(playOne, playTwo);
    }
  } else {
    // Otherwise, the winner of the round is the player with the higher-value card
    if (playOne > playTwo) {
      deck1.push(playOne, playTwo);
    } else {
      // Card numbers are guaranteed to be unique in the deck
      deck2.push(playTwo, playOne);
    }
  }
}

const getWinningScore = (deck1, deck2, recursive = false) => {
  // Make a copy for sanity's sake
  const roundConfigs = [];
  const one = [...deck1];
  const two = [...deck2];

  // Keep playing until someone runs out of cards
  while (one.length > 0 && two.length > 0) {
    if (recursive) {
      playRecursiveRound(one, two, roundConfigs);
    } else {
      playRound(one, two);
    }
  }

  // The one who ran out of cards is the loser
  const winningDeck = one.length === 0 ? two : one;

  return winningDeck
    .reverse()
    .reduce((acc, card, idx) => acc + card * (idx + 1), 0);
}

console.log('Part 1: ', getWinningScore(playerOneStart, playerTwoStart));
console.log('Part 2: ', getWinningScore(playerOneStart, playerTwoStart, true));
