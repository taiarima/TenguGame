`use strict`;

// Later I will put this code block into the new game button event
window.onload = function () {};

// Selecting elements
const player0Ele = document.querySelector(`.player--0`);
const player1Ele = document.querySelector(`.player--1`);
const score0Ele = document.getElementById(`score--0`);
const score1Ele = document.getElementById(`score--1`);
const cardEle = document.querySelector(`.card`);
const btnNew = document.querySelector(`.btn--new`);
const btnDraw = document.querySelector(`.btn--draw`);
const btnHold = document.querySelector(`.btn--hold`);
const btnSpell = document.querySelector(`.btn--spell`);
const btnTurn = document.querySelector(`.btn--turn`);
const btnLog = document.querySelector(`.btn--log`);
const currScorePlayer0 = document.getElementById(`current--0`);
const currScorePlayer1 = document.getElementById(`current--1`);
const btnAbout = document.querySelector(`.about`); // this isn't a button so it should be renamed
const modalAbout = document.querySelector(`.modal-about`);
const overlay = document.querySelector(`.overlay`);
const gameLog = document.querySelector(`.log`);

// Variables for card effects
let tsuruBool = false;
let ofudaBool = [false, false];
let onibabaBool = [false, false];
let omusubiBool = false;
let sarukaniRevenge = -1; // This will keep track of if any player can take revenge. -1 means neither player, 0 is player 1, 1 is player 2.
let issunBool = false;
let urashimaCounter = 0;
let warashibeCounter = [1, 1];
let kintarouBool = false;
let kasajizouBool = [false, false];
let kaniRevengeTracker = [0, 0];
const monkeyAttackPts = 100;

// Deck of card objects
const deck = [
  {
    cardId: `saruKani`,
    source: `01 Monkey-Crab Quarrel Monkey Attack.png`,
    altSource: `01-2 Monkey-Crab Quarrel Crab Revenge.png`,
    points: 15,
    spell: true,
    cardText: `Monkey-Crab Quarrel`,
  },
  {
    cardId: `momotarou`,
    source: `02 Momotarou.png`,
    altSource: null,
    points: 10,
    spell: false,
    cardText: `Momotarou`,
  },
  {
    cardId: `issunboushi`,
    source: `03 Issnboushi.png`,
    altSource: null,
    points: 20,
    spell: false,
    cardText: `Issunboushi`,
  },
  {
    cardId: `tengu`,
    source: `04 Tengu.png`,
    altSource: null,
    points: 0,
    spell: false,
    cardText: `TENGU`,
  },
  {
    cardId: `urashimaTarou`,
    source: `05 Urashima Tarou.png`,
    altSource: null,
    points: 15,
    spell: false,
    cardText: `Urashima Tarou`,
  },
  {
    cardId: `tsurunoOngaeshi`,
    source: `06 Tsuru no ongaeshi.png`,
    altSource: null,
    points: 15,
    spell: false,
    cardText: `Tsuru no Ongaeshi`,
  },
  {
    cardId: `omusubiKororin`,
    source: `07 Omusubi Kororin.png`,
    altSource: null,
    points: 15,
    spell: false,
    cardText: `Omusubi Kororin`,
  },
  {
    cardId: `sanmainoOfuda`,
    source: `08-1 Sanmai no Ofuda.png`,
    altSource: `08-2 Onibaba.png`,
    points: 15,
    altPoints: -50,
    spell: true,
    cardText: `Sanmai no Ofuda`,
  },
  {
    cardId: `kintarou`,
    source: `09 Kintarou.png`,
    altSource: null,
    points: 20,
    spell: true,
    cardText: `Kintarou`,
  },
  {
    cardId: `bunbukuChagama`,
    source: `10-1 Bunbuku chagama.png`,
    altSource: `10-2 Bunbuku chagama.png`,
    points: -25,
    altPoints: 30,
    spell: false,
    cardText: `Bunbuku Chagama`,
  },
  {
    cardId: `kasaJizou`,
    source: `11 Kasa Jizou.png`,
    altSource: null,
    points: 5,
    spell: true,
    cardText: `Kasa Jizou`,
  },
  {
    cardId: `warashibe`,
    source: `12 Warashibe Tyouja.png`,
    altSource: null,
    points: 15,
    spell: false,
    cardText: `Warashibe Chouja`,
  },
  {
    cardId: `kamotori`,
    source: `13  kamotori gonbei.png`,
    altSource: null,
    points: 15,
    spell: true, // TODO haven't coded in spell yet
    cardText: `Kamo-tori Gonbei`,
  },
  {
    cardId: `ikkyuu`,
    source: `14 ikkyuusan.png`,
    altSource: null,
    points: 25,
    spell: true, // TODO haven't coded in spell yet
    cardText: `Ikkyuu-san`,
  },
  {
    cardId: `kobutori`,
    source: `15 kobutori jiisan.png`,
    altSource: null,
    points: 25,
    spell: true, // TODO haven't coded in spell yet
    cardText: `Kobu-tori Jiisan`,
  },
];

// This array holds any cards who have different versions depending on the conditions
let altSrcCards = [];
for (let card of deck) {
  if (card.altSource != null) {
    altSrcCards.push(card.cardId);
  }
}

// This array holds cards that have usable spell effects
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
let activePlayer = 0;
const totalScores = [0, 0];
const winningScore = 1000;
let playerNames = [];
let player1Name = `Player 1`;
let player2Name = `Player 2`;
playerNames.push(player1Name);
playerNames.push(player2Name);

cardEle.classList.add(`hidden`);
score1Ele.textContent = 0;
score0Ele.textContent = 0;

const newGame = function () {
  btnLog.classList.toggle(`hidden`);
  btnNew.classList.toggle(`hidden`);
  btnTurn.classList.toggle(`hidden`); // this is silly but it should work for now
  btnSpell.classList.toggle(`hidden`);
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove(`player--winner`);
  document.querySelector(`.player--0`).classList.add(`player--active`); // change this later
  activePlayer = 0;

  // Set scores back to zero
  score0Ele.textContent = 0;
  score1Ele.textContent = 0;
  newTurn();
};

const drawCard = function () {
  btnHold.disabled = false;
  // If someone draws a card, they no longer get the Tsuru no Ongaeshi bonus
  if (tsuruBool) {
    tsuruBool = false;
  }

  cardEle.classList.remove(`hidden`);
  btnSpell.classList.remove(`hidden`);
  console.log(
    `deckIndex = ` +
      deckIndex +
      ` and shufflerArray[deckIndex] = ` +
      shufflerArray[deckIndex]
  );
  let cardText = deck[shufflerArray[deckIndex]].cardText;
  gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText}! \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
  let cardDrawn = deck[shufflerArray[deckIndex]].cardId;
  if (cardsWithSpells.includes(cardDrawn)) {
    btnSpell.disabled = false;
    btnSpell.textContent = `🔮 Use Spell`;
  } else {
    btnSpell.disabled = true;
    btnSpell.textContent = `🈚 No spell`;
  }
  cardHandler(cardDrawn);

  deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
};

function endTurn() {
  // Player gets extra points if ended turn with tsuru no ongaesi
  if (tsuruBool) {
    currentScore += 40;
    tsuruBool = false;
  }

  // Turn off any boolean values that are no longer relevant
  omusubiBool = false;
  issunBool = false;
  urashimaCounter = 0;
  // Re-enable hold button if Urashima effect had disabled it
  btnHold.disabled = false;
  btnHold.textContent = `⏹️ Hold`;

  // Add any points gained/lost to total and update GUI
  totalScores[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    totalScores[activePlayer];
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  // End game condition. Experimental TODO
  if (totalScores[activePlayer] >= winningScore - 999) {
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add(`player--winner`);
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove(`player--active`);
    btnHold.classList.add(`hidden`);
    btnSpell.classList.add(`hidden`);
    btnDraw.classList.add(`hidden`);
    btnNew.classList.toggle(`hidden`);
    return;
  }

  // Switch player
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0Ele.classList.toggle(`player--active`);
  player1Ele.classList.toggle(`player--active`);

  // Hide all buttons
  btnDraw.classList.toggle(`hidden`);
  btnSpell.classList.toggle(`hidden`);
  btnHold.classList.toggle(`hidden`);

  // Show new turn button
  btnTurn.classList.toggle(`hidden`);

  //newTurn(); // this is sitting here now but will be moved once it has its own button
}

function newTurn() {
  // Reveal all buttons
  btnDraw.classList.toggle(`hidden`);
  btnSpell.classList.toggle(`hidden`);
  btnHold.classList.toggle(`hidden`);

  // Hide new turn button
  btnTurn.classList.toggle(`hidden`);

  btnHold.disabled = true;
  document.querySelector("body").style.backgroundColor = `#242624`;
  //Shuffle the deck
  shufflerArray = [...Array(deck.length).keys()]; // Creates an array of deck.length starting at 0
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

  for (let i = 0; i < shufflerArray.length; i++) {
    console.log(`shufflerArray[${i}] = ` + shufflerArray[i]);
  }
  //   shufflerArray[0] = 3;
  let newTenguIndex = Math.trunc(Math.random() * (deck.length - 1)) + 1; // Get a new random index from 1 to deck.length -1
  // Prevent Tengu from being first card
  if (deck[shufflerArray[0]].cardId === `tengu`) {
    let indexOfTengu = shufflerArray[0]; // Tengu's index number in deck
    // let newTenguIndex = Math.trunc(Math.random() * (deck.length - 1)) + 1; // Get a new random index from 1 to deck.length -1
    shufflerArray[0] = shufflerArray[newTenguIndex];
    shufflerArray[newTenguIndex] = indexOfTengu;
  }

  // Start at the beginning of the shuffled deck
  deckIndex = 0;

  // Show card back at new turn
  cardEle.classList.remove(`hidden`);
  cardEle.src = `cardBack.png`;

  // Kasajizou Spell effect, maybe change later TODO
  if (kasajizouBool[activePlayer]) {
    currentScore += 100;
    kasajizouBool[activePlayer] = false;
  }
}

function cardHandler(cardDrawn) {
  // Handling of any boolean effects that apply
  if (omusubiBool) {
    currentScore += 40;
    omusubiBool = false;
  }

  if (issunBool) {
    currentScore *= 4;
    issunBool = false;
  }

  if (urashimaCounter > 0) {
    urashimaCounter--;
    btnHold.disabled = true;
    btnHold.textContent = `❌ Cannot hold`;
    if (urashimaCounter === 0) {
      btnHold.disabled = false;
      btnHold.textContent = `⏹️ Hold`;
      currentScore += 100; // TODO Urashima score decide exact value for bonus later
    }
  }

  // Cards with alternate versions are handled first, according to their conditiosn
  if (altSrcCards.includes(cardDrawn)) {
    switch (cardDrawn) {
      // Bunbuku Chagama has 50% chance of showing one face or another
      case `bunbukuChagama`: {
        if (Math.random() < 0.5) {
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
        } else {
          cardEle.src = deck[shufflerArray[deckIndex]].altSource;
          currentScore += deck[shufflerArray[deckIndex]].altPoints;
        }
        break;
      }

      case `sanmainoOfuda`: {
        if (onibabaBool[activePlayer] === true) {
          // Give player opportunity to use ofuda
          cardEle.src = deck[shufflerArray[deckIndex]].altSource;
          currentScore += deck[shufflerArray[deckIndex]].altPoints;
        } else {
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
        }
        break;
      }
      // SaruKani - Players can take revenge if relevant
      case `saruKani`: {
        if (sarukaniRevenge === activePlayer) {
          cardEle.src = deck[shufflerArray[deckIndex]].altSource;
          currentScore += deck[shufflerArray[deckIndex]].points;
        } else {
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
        }
      }
    }
  } else {
    // Cards without alternate versions will simply be shown and have their standard point values added
    cardEle.src = deck[shufflerArray[deckIndex]].source;
    currentScore += deck[shufflerArray[deckIndex]].points;
  }

  // Handle any special effects of cards
  switch (cardDrawn) {
    case `tengu`: {
      // give player opportunity to use ofuda if available
      if (ofudaBool[activePlayer]) {
        // ask player if they want to use their ofuda
        console.log(`do you want to use your ofuda`);
      }
      currentScore = 0;
      document.querySelector("body").style.backgroundColor = `crimson`;
      endTurn();
      return;
    }

    case `omusubiKororin`: {
      omusubiBool = true;
      break;
    }

    case `momotarou`: {
      if (currentScore > 0) {
        currentScore *= 3;
      } else {
        currentScore = 0;
      }
      break;
    }

    case `issunboushi`: {
      currentScore = Math.trunc(currentScore / 2);
      issunBool = true;
      break;
    }

    case `tsurunoOngaeshi`: {
      tsuruBool = true;
      break;
    }

    case `urashimaTarou`: {
      urashimaCounter = 3;
      break;
    }

    case `warashibe`: {
      currentScore -= 15;
      currentScore += 15 * warashibeCounter[activePlayer];
      warashibeCounter[activePlayer] += 1;
      break;
    }
  }

  // Update the current score
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
}

function useSpell() {
  let cardDrawn = deck[shufflerArray[deckIndex - 1]].cardId;
  let opponent = activePlayer === 1 ? 0 : 1;

  btnSpell.disabled = true;
  btnSpell.textContent = `☑️ Spell used`;

  switch (cardDrawn) {
    case `saruKani`: {
      if (!sarukaniRevenge == activePlayer) {
        totalScores[opponent] -= monkeyAttackPts;
        currentScore += monkeyAttackPts;
        document.getElementById(`current--${activePlayer}`).textContent =
          currentScore;
        document.getElementById(`score--${opponent}`).textContent =
          totalScores[opponent];
        sarukaniRevenge = opponent;
        kaniRevengeTracker[opponent]++; // TODO This seems to not be working
        gameLog.value += `${playerNames[activePlayer]} used the Monkey Attack Spell to steal ${monkeyAttackPts} from ${playerNames[opponent]}! \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      } else if (sarukaniRevenge == activePlayer) {
        let revengePts = 250 * kaniRevengeTracker[activePlayer];
        totalScores[opponent] -= revengePts;
        kaniRevengeTracker[activePlayer] = 0;
        document.getElementById(`score--${opponent}`).textContent =
          totalScores[activePlayer];
        sarukaniRevenge = -1; // deactivate revenge
        gameLog.value += `${playerNames[activePlayer]} used the Crab Revenge Spell to subtract ${revengePts} from ${playerNames[opponent]}! \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }

    case `sanmainoOfuda`: {
      ofudaBool[activePlayer] = true;
      onibabaBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Sanmai no Ofuda spell to obtain one protective ofuda! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      // Show some fuda graphic element on that player's thing
      break;
    }

    case `kintarou`: {
      deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
      gameLog.value += `${playerNames[activePlayer]} used Kintarou's overwhelming power spell to skip over one card! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      drawCard();
      break;
    }

    case `kasaJizou`: {
      totalScores[opponent] += 50;
      kasajizouBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Kasa Jizou spell to donate their points to the temple! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }
  }
}

// const rollDice = function () {
//   // 1. Generate roll, add score
//   const diceVal = Math.trunc(Math.random() * 6) + 1;
//   console.log(diceVal);

//   // 2. Display die
//   diceEle.classList.remove(`hidden`);
//   diceEle.src = `dice-${diceVal}.png`;
// };

// Event Listeners

// This will later be the draw card listener
btnNew.addEventListener(`click`, newGame);

// Roll the die
btnDraw.addEventListener(`click`, drawCard);

// Hold to end turn
btnHold.addEventListener(`click`, function () {
  endTurn();
});

btnSpell.addEventListener(`click`, function () {
  useSpell();
});

btnTurn.addEventListener(`click`, function () {
  newTurn();
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

btnLog.addEventListener(`click`, function () {
  gameLog.classList.toggle(`hidden`);
  if (gameLog.classList.contains(`hidden`)) {
    btnLog.textContent = `📜 Show Log`;
  } else {
    btnLog.textContent = `📜 Hide Log`;
  }
});
