`use strict`;

// Selecting elements
const score0Ele = document.getElementById(`score--0`);
const score1Ele = document.getElementById(`score--1`);
const diceEle = document.querySelector(`.dice`);
const cardEle = document.querySelector(`.card`);
const btnNew = document.querySelector(`.btn--new`);
const btnRoll = document.querySelector(`.btn--roll`);
const btnHold = document.querySelector(`.btn--hold`);
const btnSpell = document.querySelector(`btn--spell`);
const currScorePlayer0 = document.getElementById(`current--0`);
const currScorePlayer1 = document.getElementById(`current--1`);
const btnAbout = document.querySelector(`.about`);
const modalAbout = document.querySelector(`.modal-about`);
const overlay = document.querySelector(`.overlay`);

// Boolean values for card effects
let tsuruBool = false;
let urashimaBool = [false, false];
let omusubiBool = false;
let sarukaniRevenge = -1; // This will keep track of if any player can take revenge. -1 means neither player, 0 is player 1, 1 is player 2.
let issunBool = false;
let ofudaBool = false;
let kintarouBool = false;

const deck = [
  {
    cardId: `saruKani`,
    source: `01 Monkey-Crab Quarrel Monkey Attack.png`,
    altSource: `01-2 Monkey-Crab Quarrel Crab Revenge.png`,
    points: 15,
    spell: true,
  },
  {
    cardId: `momotarou`,
    source: `02 Momotarou.png`,
    altSource: null,
    points: 10,
    spell: false,
  },
  {
    cardId: `issunboushi`,
    source: `03 Issnboushi.png`,
    altSource: null,
    points: 20,
    spell: false,
  },
  {
    cardId: `tengu`,
    source: `04 Tengu.png`,
    altSource: null,
    points: 0,
    spell: false,
  },
  {
    cardId: `urashimaTarou`,
    source: `05 Urashima Tarou.png`,
    altSource: null,
    points: 15,
    spell: false,
  },
  {
    cardId: `tsurunoOngaeshi`,
    source: `06 Tsuru no ongaeshi.png`,
    altSource: null,
    points: 15,
    spell: false,
  },
  {
    cardId: `omusubiKororin`,
    source: `07 Omusubi Kororin.png`,
    altSource: null,
    points: 15,
    spell: false,
  },
  {
    cardId: `sanmainoOfuda`,
    source: `08-1 Sanmai no Ofuda.png`,
    altSource: `08-2 Onibaba.png`,
    points: 15,
    altPoints: -50,
    spell: true,
  },
  {
    cardId: `kintarou`,
    source: `09 Kintarou.png`,
    altSource: null,
    points: 20,
    spell: true,
  },
  {
    cardId: `bunbukuChagama`,
    source: `10-1 Bunbuku chagama.png`,
    altSource: `10-2 Bunbuku chagama.png`,
    points: 25,
    altPoints: 30,
    spell: false,
  },
];

let altSrcCards = [];

for (let card of deck) {
  if (card.altSource != null) {
    altSrcCards.push(card.cardId);
  }
}

let cardsWithSpells = [];
for (let card of deck) {
  if (card.spell === true) {
    cardsWithSpells.push(card.cardId);
  }
}

// Variables for game logic
let shufflerArray = [...Array(deck.length).keys()]; // Creates an array with ascending integer values starting at 0
let deckIndex = 0;
let currentScore = 0;
let player1Score = 0;
let player2Score = 0;
let activePlayer = 0;
const totalScores = [0, 0];

diceEle.classList.add(`hidden`);
score1Ele.textContent = 0;
score0Ele.textContent = 0;
console.log(`testing`);

function endTurn() {
  // Player gets extra points if ended turn with tsuru no ongaesi
  if (tsuruBool) {
    currentScore += 40;
    tsuruBool = false;
  }

  // if player ended turn with omusubi, this will be turned off
  if (omusubiBool) {
    omusubiBool = false;
  }

  currentScore += 1;
  totalScores[activePlayer] += currentScore;
  console.log(totalScores[activePlayer]);
  document.getElementById(`score--${activePlayer}`).textContent =
    totalScores[activePlayer];
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  // switch player
  activePlayer = activePlayer === 0 ? 1 : 0;
  newTurn(); // this is sitting here now but will be moved once it has its own button
}

function newTurn() {
  document.querySelector("body").style.backgroundColor = `green`;
  //Shuffle the deck
  shufflerArray = [...Array(deck.length).keys()]; // Creates an array with values 0-9
  let currentIndex = shufflerArray.length;
  let randomIndex;
  while (currentIndex != 0) {
    // Fischer-Yates shuffle to randomize the values

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shufflerArray[currentIndex], shufflerArray[randomIndex]] = [
      shufflerArray[randomIndex],
      shufflerArray[currentIndex],
    ];
  }

  // Prevent Tengu from being first card
  if (deck[shufflerArray[0]].cardId === `tengu`) {
    let indexOfTengu = shufflerArray[0]; // Tengu's index number in deck
    let newTenguIndex = Math.trunc(Math.random() * (deck.length - 1)) + 1; // Get a new random index from 1 to deck.length -1
    shufflerArray[0] = shufflerArray[newTenguIndex];
    shufflerArray[newTenguIndex] = indexOfTengu;
  }

  // Start at the beginning of the shuffled deck
  deckIndex = 0;

  // Show card back at new turn
  diceEle.src = `cardBack.png`;
}

function cardHandler(cardDrawn) {
  if (omusubiBool) {
    currentScore += 40;
    omusubiBool = false;
  }

  // Cards with alternate versions are handled first, according to their conditiosn
  if (altSrcCards.includes(cardDrawn)) {
    // Bunbuku Chagama has 50% chance of showing one face or another
    if (cardDrawn === `bunbukuChagama`) {
      if (Math.random() < 0.5) {
        diceEle.src = deck[shufflerArray[deckIndex]].source;
        currentScore += deck[shufflerArray[deckIndex]].points;
      } else {
        diceEle.src = deck[shufflerArray[deckIndex]].altSource;
        currentScore += deck[shufflerArray[deckIndex]].altPoints;
      }
    }
    diceEle.src = deck[shufflerArray[deckIndex]].altSource; // TODO Fix later

    // Sanmai no Ofuda
    if (cardDrawn === `sanmainoOfuda`) {
      if (ofudaBool[activePlayer] === true) {
        diceEle.src = deck[shufflerArray[deckIndex]].altSource;
        currentScore += deck[shufflerArray[deckIndex]].altPoints;
      } else {
        diceEle.src = deck[shufflerArray[deckIndex]].source;
        currentScore += deck[shufflerArray[deckIndex]].points;
      }
    }

    // SaruKani - Players will take revenge if relevant
    if (cardDrawn === `saruKani`) {
      if (sarukaniRevenge === activePlayer) {
        diceEle.src = deck[shufflerArray[deckIndex]].altSource;
        currentScore += deck[shufflerArray[deckIndex]].points;
      } else {
        diceEle.src = deck[shufflerArray[deckIndex]].source;
        currentScore += deck[shufflerArray[deckIndex]].points;
      }
    }
  } else {
    // Cards without alternate versions will simply be shown and had their standard point values added
    diceEle.src = deck[shufflerArray[deckIndex]].source;
    currentScore += deck[shufflerArray[deckIndex]].points;
  }

  if (cardDrawn === `tengu`) {
    currentScore = 0;
    document.querySelector("body").style.backgroundColor = `black`;
    endTurn();
    return;
  }

  if (cardDrawn === `omusubiKororin`) {
    omusubiBool = true;
  }

  if (cardDrawn == `momotarou` && currentScore > 0) {
    currentScore *= 3;
  }

  //   if (cardDrawn === `sanmainoOfuda`) { // --> This will be moved to spell
  //     ofudaBool[activePlayer] = true;
  //   }

  if (cardDrawn === `tsurunoOngaeshi`) {
    tsuruBool = true;
  }

  if (cardDrawn.spell) {
    // activate use spell button
  }
}

function useSpell(cardDrawn) {
  if (cardDrawn === `saruKani`) {
    console.log(`saru kani spell`);
  }
}

// Event Listeners

// This will later be the draw card listener
btnNew.addEventListener(`click`, function () {
  diceEle.classList.remove(`hidden`);
  let cardDrawn = deck[shufflerArray[deckIndex]].cardId;
  // if (cardsWithSpells.includes(cardDrawn)) {
  //   btnSpell.disabled = false;
  // } else {
  //   btnSpell.disabled = true;
  // }
  cardHandler(cardDrawn);

  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
});

// Roll the die
btnRoll.addEventListener(`click`, function () {
  // 1. Generate roll, add score
  const diceVal = Math.trunc(Math.random() * 6) + 1;
  console.log(diceVal);

  // 2. Display dice/card
  diceEle.classList.remove(`hidden`);
  diceEle.src = `dice-${diceVal}.png`;

  // 3. Check for event

  deckIndex++;
});

// Hold to end turn
btnHold.addEventListener(`click`, function () {
  endTurn();
});

btnSpell.addEventListener(`click`, function () {
  useSpell(cardDrawn);
});

// TODO Under construction
btnAbout.addEventListener(`click`, function () {
  modalAbout.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
});

const closeModal = function () {
  modalAbout.classList.add(`hidden`);
  overlay.classList.add(`hidden`);
};

overlay.addEventListener(`click`, closeModal);
