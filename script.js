`use strict`;

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
const roundMsg0 = document.getElementById(`msg--0`);
const roundMsg1 = document.getElementById(`msg--1`);

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
const kanjiRevengePts = -300;

let bunbukuAltTextBool = false;
let fudaAltTextBool = false;

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
const winningScore = 10;
let playerNames = [];
let player1Name = `Player 1`;
let player2Name = `Player 2`;
playerNames.push(player1Name);
playerNames.push(player2Name);

cardEle.classList.add(`hidden`);
score1Ele.textContent = 0;
score0Ele.textContent = 0;

const newGame = function () {
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
  totalScores[0] = 0;
  totalScores[1] = 0;

  // Reset any boolean values that might remain switched on
  tsuruBool = false;
  ofudaBool = [false, false];
  onibabaBool = [false, false];
  omusubiBool = false;
  sarukaniRevenge = -1; // This will keep track of if any player can take revenge. -1 means neither player, 0 is player 1, 1 is player 2.
  issunBool = false;
  urashimaCounter = 0;
  warashibeCounter = [1, 1];
  kintarouBool = false;
  kasajizouBool = [false, false];
  kaniRevengeTracker = [0, 0];
  bunbukuAltTextBool = false;
  fudaAltTextBool = false;

  // Clear log
  gameLog.value = ``;
  newTurn();
};

const drawCard = function () {
  btnHold.disabled = false;
  // If someone draws a card, they no longer get the Tsuru no Ongaeshi bonus
  if (tsuruBool) {
    tsuruBool = false;
    gameLog.value += `${playerNames[activePlayer]} drew another card, sacrificing their Tsuru no Ongaeshi bonus! \n`;
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
  let points = deck[shufflerArray[deckIndex]].points;
  let cardDrawn = deck[shufflerArray[deckIndex]].cardId;
  if (cardsWithSpells.includes(cardDrawn)) {
    btnSpell.disabled = false;
    btnSpell.textContent = `🔮 Use Spell`;
  } else {
    btnSpell.disabled = true;
    btnSpell.textContent = `🈚 No spell`;
  }
  let suppString = cardHandler(cardDrawn);
  logTextHandler(cardDrawn, cardText, points, suppString);

  deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
};

function endTurn() {
  // Player gets extra points if ended turn with tsuru no ongaesi
  if (tsuruBool) {
    currentScore += 40;
    gameLog.value += `${playerNames[activePlayer]} received an extra 40 points from the Tsuru no Ongaeshi bonus! \n`;
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
  document.getElementById(`msg--${activePlayer}`).classList.remove(`hidden`);
  document.getElementById(`msg--${activePlayer}`).textContent = `${
    currentScore >= 0 ? `+` : `-`
  }${currentScore} points this round!`;
  gameLog.value += `${playerNames[activePlayer]} earned ${
    currentScore >= 0 ? `+` : `-`
  }${currentScore} points this round!`;
  gameLog.scrollTop = gameLog.scrollHeight;

  totalScores[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    totalScores[activePlayer];
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  // End game condition. Experimental TODO
  if (totalScores[activePlayer] >= winningScore) {
    endGame();
    return; // Function should not proceed further if endGame function has been invoked
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

function endGame() {
  opponent = activePlayer == 0 ? 1 : 0;

  // Add winning visual effects
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add(`player--winner`);
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove(`player--active`);

  // Hide buttons
  btnHold.classList.add(`hidden`);
  btnSpell.classList.add(`hidden`);
  btnDraw.classList.add(`hidden`);
  btnNew.classList.toggle(`hidden`);

  // Show winning messages
  document.getElementById(
    `msg--${activePlayer}`
  ).textContent += `\n ${playerNames[activePlayer]} wins!`;
  document.getElementById(
    `msg--${opponent}`
  ).textContent = `You suffer the curse of \n the TENGU!`;
  document.getElementById(`msg--${opponent}`).classList.remove(`hidden`);

  gameLog.value += `\n${playerNames[activePlayer]} has won! \n${playerNames[opponent]} has lost, and suffers the curse of the TENGU!\n`;
  gameLog.value += `Press "New Game" to play again! But beware of the TENGU! \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
}

function newTurn() {
  gameLog.value += `\n >>> Begin ${playerNames[activePlayer]}'s turn!! >>>> \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
  // Reveal all buttons
  btnDraw.classList.toggle(`hidden`);
  btnSpell.classList.toggle(`hidden`);
  btnHold.classList.toggle(`hidden`);

  // Hide new turn button
  btnTurn.classList.toggle(`hidden`);

  roundMsg0.classList.add(`hidden`);
  roundMsg1.classList.add(`hidden`);

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
  let suppString = ``;

  // Handling of any boolean effects that apply
  if (omusubiBool) {
    currentScore += 40;
    omusubiBool = false;
    gameLog.value += `${playerNames[activePlayer]} drew another card, earning a 40 point bonus from Omusubi Kororin!`;
  }

  if (issunBool) {
    currentScore *= 4;
    gameLog.value += `${playerNames[activePlayer]}'s points are doubled!`;
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
      if (cardDrawn != `tengu`) {
        gameLog.value += `${playerNames[activePlayer]} is awareded a tamatebako bonus pf 100 points from Urashima Tarou for drawing three additional cards!`;
      }
    }
  }

  // Cards with alternate versions are handled first, according to their conditiosn
  if (altSrcCards.includes(cardDrawn)) {
    switch (cardDrawn) {
      // Bunbuku Chagama has 50% chance of showing one face or another
      case `bunbukuChagama`: {
        if (Math.random() < 0.5) {
          bunbukuAltTextBool = false;
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
        } else {
          bunbukuAltTextBool = true;
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
          fudaAltTextBool = true;
        } else {
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
          fudaAltTextBool = false;
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
      suppString = `Your turn is over! \n`;
      return suppString;
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
      suppString += `Momotarou triples your current score!`;
      break;
    }

    case `issunboushi`: {
      currentScore = Math.trunc(currentScore / 2);
      issunBool = true;
      suppString = `${playerNames[activePlayer]}'s points are halved!`;
      break;
    }

    case `tsurunoOngaeshi`: {
      tsuruBool = true;
      suppString = `❗You will be rewarded if you heed her words and refrain from looking at the next card!`;
      break;
    }

    case `urashimaTarou`: {
      urashimaCounter = 3;
      suppString = `❗ If you do not end your turn now, you commit to drawing another three cards!`;
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
  return suppString;
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
      totalScores[opponent] += 50; // TODO fix this
      kasajizouBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Kasa Jizou spell to donate their points to the temple! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }
  }
}

function logTextHandler(cardDrawn, cardText, points, suppString) {
  switch (cardDrawn) {
    case `sanmainoOfuda`: {
      if (fudaAltTextBool) {
        // something
        gameLog.scrollTop = gameLog.scrollHeight;
      } else {
        // something else
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }
    case `bunbukuChagama`: {
      if (!bunbukuAltTextBool) {
        // this is mixed up right now
        gameLog.value += `${
          playerNames[activePlayer]
        } has drawn ${cardText} and had to pay ${30} points!${suppString} \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      } else {
        gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText} and earned +${points}! ${suppString} \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }
    case `warashibe`: {
      gameLog.value += `${
        playerNames[activePlayer]
      } has drawn ${cardText} and earned +${
        points * warashibeCounter[activePlayer]
      }! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }
    case `tengu`: {
      gameLog.value +=
        `${playerNames[activePlayer]} has drawn TENGU! You earn zero points this round! ` +
        suppString;
      gameLog.scrollTop = gameLog.scrollHeight;
      endTurn(); // this is a weird place for this but it works
      break;
    }
    default: {
      gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText} and earned ${points} points! ${suppString} \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
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

btnNew.addEventListener(`click`, newGame);

btnDraw.addEventListener(`click`, drawCard);

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
