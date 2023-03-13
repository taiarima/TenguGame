`use strict`;

// TODO TENGU OFUDA BUG, game log not displaying correctly, can't end turn after using ofuda
// couldn't replicate the bug, but it must still be there somewhere

// TODO ofuda button needs to be disabled during opponents turn

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
const btnAbout = document.querySelector(`.about`); // this isn't a button so maybe it should be renamed(?)
const modalAbout = document.querySelector(`.modal-about`);
const overlay = document.querySelector(`.overlay`);
const gameLog = document.querySelector(`.log`);
const roundMsg0 = document.getElementById(`msg--0`);
const roundMsg1 = document.getElementById(`msg--1`);
const btnOfuda0 = document.querySelector(`.ofuda--0`);
const btnOfuda1 = document.querySelector(`.ofuda--1`);
const btnCloseModal = document.querySelector(`.close-modal`);
const closeHowTo = document.querySelector(`.close-modal-how`);
const btnHowTo = document.querySelector(`.how-to`); // this isn't a button so maybe it should be renamed(?)
const modalHowTo = document.querySelector(`.modal-how-to`);
const modalLore = document.querySelector(`.modal-lore`);
const modalHelp = document.querySelector(`.modal-help`);
const allModals = document.querySelector(`.modal-window`);
const btnLore = document.querySelector(`.lore`);
const btnHelp = document.querySelector(`.help`);
const closeLore = document.querySelector(`.close-lore`);
const closeHelp = document.querySelector(`.close-help`);
const modalNew = document.querySelector(`.modal-new`);
const closeNew = document.querySelector(`.close-new`);
const btnRounds = document.querySelector(`.btn--rounds`);
const btnPoints = document.querySelector(`.btn--points`);
const roundRulesMsg = document.querySelector(`.rounds-rules-msg`);
const pointsRulesMsg = document.querySelector(`.points-rules-msg`);
const btnSubmitNewGame = document.querySelector(`.submit-button`);

// Variables for card effects
let tsuruBool = false;
let ofudaBool = [false, false];
let onibabaBool = [false, false];
let omusubiBool = false;
let issunBool = false;
let urashimaCounter = 0;
let warashibeCounter = [1, 1];
let kintarouBool = false;
let kasajizouBool = [false, false];
let kaniRevengeTracker = [0, 0]; // this is a multiplier, the number in the opponent's index indicates how many times they have monkey attacked
const monkeyAttackPts = 100;
const kanjiRevengePts = -300; // this isn't coded in
let bunbukuAltTextBool = false;
let fudaAltTextBool = false;
let ikkyuuBool = false;
let kamotoriCounter = 0;
let kamotoriBool = false;
let kobutoriCounter = 0;
let tenguBool = false;

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
    source: `saya momotarou.png`,
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
    altPoints: -100,
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
    source: `10-2 Bunbuku chagama.png`,
    altSource: `10-1 Bunbuku chagama.png`,
    points: 30,
    altPoints: -25,
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
    spell: true,
    cardText: `Kamo-tori Gonbei`,
  },
  {
    cardId: `ikkyuu`,
    source: `14 ikkyuusan.png`,
    altSource: null,
    points: 25,
    spell: true,
    cardText: `Ikkyuu-san`,
  },
  {
    cardId: `kobutori`,
    source: `15 kobutori jiisan.png`,
    altSource: null,
    points: 25,
    spell: true,
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
let penaltyScore = 0;

// Game end conditions
let roundsRulesBool = false;
let pointsRulesBool = false;
let pointsToWin = 1000;
let roundsToEnd = 5;
let roundsCounter = 1;

const newGame = function () {
  btnNew.classList.toggle(`hidden`);
  btnTurn.classList.toggle(`hidden`); // this is silly but it should work for now
  btnSpell.classList.toggle(`hidden`);
  document.querySelector(`.player--0`).classList.remove(`player--winner`);
  document.querySelector(`.player--1`).classList.remove(`player--winner`);
  document.querySelector(`.player--0`).classList.remove(`player--loser`);
  document.querySelector(`.player--1`).classList.remove(`player--loser`);
  document.querySelector(`.player--0`).classList.add(`player--active`); // change this later
  document.querySelector(`.player--1`).classList.remove(`player--active`);
  activePlayer = 0;
  roundsCounter = 1;

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
  issunBool = false;
  urashimaCounter = 0;
  warashibeCounter = [1, 1];
  kintarouBool = false;
  kasajizouBool = [false, false];
  kaniRevengeTracker = [0, 0];
  bunbukuAltTextBool = false;
  fudaAltTextBool = false;
  btnOfuda0.classList.add(`hidden`);
  btnOfuda1.classList.add(`hidden`);

  // Clear log
  gameLog.value = ``;
  newTurn();
};

const drawCard = function () {
  document.querySelector(`.tengu-img`).src = `tenguCenter.png`;
  document.querySelector("body").style.backgroundColor = `#242624`;
  btnHold.disabled = false;

  if (tsuruBool) {
    tsuruBool = false;
    gameLog.value += `${playerNames[activePlayer]} drew another card, sacrificing their Tsuru no Ongaeshi bonus! \n`;
  }

  // Remove any messages from Ikkyuu-san spell that might be present
  if (ikkyuuBool) {
    document.getElementById(`msg--${activePlayer}`).classList.add(`hidden`);
  }

  cardEle.classList.remove(`hidden`);
  btnSpell.classList.remove(`hidden`);

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

  // if (kintarouBool) {
  //   btnSpell.disabled = true;
  //   btnSpell.textContent = `☑️ Spell used`;
  // }

  let suppString = cardHandler(cardDrawn);
  logTextHandler(cardDrawn, cardText, points, suppString);

  deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
};

function endTurn() {
  // Player gets extra points if ended turn with tsuru no ongaesi
  if (tsuruBool) {
    currentScore += 40;
    gameLog.value += `${playerNames[activePlayer]} received an extra 40 points from the Tsuru no Ongaeshi bonus! \n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    tsuruBool = false;
  }

  if (tenguBool) {
    tenguEffect();
    tenguBool = false;
    btnDraw.disabled = false;
  }

  if (ikkyuuBool) {
    document.getElementById(`msg--${activePlayer}`).classList.add(`hidden`);
  }

  if (kamotoriBool) {
    if (currentScore - kamotoriCounter >= 100) {
      currentScore *= 2;
      gameLog.value += `${playerNames[activePlayer]} won Kamo-tori Gonbei's gamble to double their points!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
    } else {
      currentScore -= 100;
      gameLog.value += `${playerNames[activePlayer]} lost Kamo-tori Gonbei's gamble and received a 100 point penalty!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
    }
  }

  // Turn off any boolean values that are no longer relevant
  kintarouBool = false;
  omusubiBool = false;
  issunBool = false;
  urashimaCounter = 0;
  ikkyuuBool = false;
  kamotoriCounter = 0;
  kamotoriBool = false;
  kobutoriCounter = false;
  // Re-enable hold button if Urashima effect had disabled it
  btnHold.disabled = false;
  btnHold.textContent = `⏹️ Hold`;

  // Add any points gained/lost to total and update GUI
  document.getElementById(`msg--${activePlayer}`).classList.remove(`hidden`);
  document.getElementById(`msg--${activePlayer}`).textContent = `${
    currentScore >= 0 ? `+` : ``
  }${currentScore} points this round!`;
  gameLog.value += `${playerNames[activePlayer]} earned ${
    currentScore >= 0 ? `+` : ``
  }${currentScore} points this round!`;
  gameLog.scrollTop = gameLog.scrollHeight;

  totalScores[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    totalScores[activePlayer];
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  // Rounds Counter
  if (activePlayer == 1) {
    roundsCounter++;
  }

  // End game conditions
  if (pointsRulesBool) {
    if (totalScores[activePlayer] >= pointsToWin) {
      endGame();
      return; // Function should not proceed further if endGame function has been invoked
    }
  } else if (roundsRulesBool) {
    if (roundsCounter > roundsToEnd) {
      if (totalScores[0] != totalScores[1] && activePlayer == 1) {
        endGame();
        return;
      }
      // if there is a tie in a rounds rules game, the game will go into a "sudden death" mode, an extra round will be added
      // and the game will continue until there is no longer a tie at the end of the round
    }
  }

  document.querySelector(`.ofuda--${activePlayer}`).disabled = true;
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
}

function endGame() {
  // This is a silly way to do this, but it makes it so I don't have to reprogram everything for adding rounds rules
  // It just switches the active player to whoever has more points
  if (roundsRulesBool) {
    activePlayer = totalScores[0] > totalScores[1] ? 0 : 1;
  }

  opponent = activePlayer == 0 ? 1 : 0;

  // Add winning visual effects
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add(`player--winner`);

  document.querySelector(`.player--${opponent}`).classList.add(`player--loser`);

  // Hide buttons
  btnHold.classList.add(`hidden`);
  btnSpell.classList.add(`hidden`);
  btnDraw.classList.add(`hidden`);
  btnNew.classList.toggle(`hidden`);

  // Show winning messages
  document.getElementById(
    `msg--${activePlayer}`
  ).textContent += `\n${playerNames[activePlayer]} wins!`;
  console.log(playerNames[activePlayer]);
  document.getElementById(
    `msg--${opponent}`
  ).textContent = `${playerNames[opponent]} suffers the curse of \n the TENGU!`;
  document.getElementById(`msg--0`).classList.remove(`hidden`);
  document.getElementById(`msg--1`).classList.remove(`hidden`);

  gameLog.value += `\n${playerNames[activePlayer]} has won! \n${playerNames[opponent]} has lost, and suffers the curse of the TENGU!\n`;
  gameLog.value += `Press "New Game" to play again! But beware of the TENGU! \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
}

function newTurn() {
  if (activePlayer == 0) {
    let roundsText = `Round ${roundsCounter}`;
    if (roundsRulesBool && roundsCounter == roundsToEnd) {
      roundsText = `FINAL ROUND!`;
    } else if (roundsRulesBool && roundsCounter > roundsToEnd) {
      roundsText = `SUDDEN DEATH!`;
    }
    gameLog.value += `\n${roundsText}`;
    gameLog.scrollTop = gameLog.scrollHeight;
    newRoundAnimation(roundsText);
  }

  document.querySelector(`.tengu-img`).src = `tenguCenter.png`;
  gameLog.value += `\n>>> Begin ${playerNames[activePlayer]}'s turn!! >>>> \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
  // Reveal all buttons
  btnDraw.classList.toggle(`hidden`);
  // btnSpell.classList.toggle(`hidden`);
  btnHold.classList.toggle(`hidden`);

  // Hide new turn button
  btnTurn.classList.toggle(`hidden`);
  btnSpell.classList.add(`hidden`);

  roundMsg0.classList.add(`hidden`);
  roundMsg1.classList.add(`hidden`);

  btnHold.disabled = true;
  btnDraw.disabled = false;
  document.querySelector("body").style.backgroundColor = `#242624`;
  //Shuffle the deck
  shufflerArray = [...Array(deck.length).keys()]; // Creates an array of deck.length starting at 0
  let currentIndex = shufflerArray.length;
  let randomIndex;
  while (currentIndex != 0) {
    // Fischer-Yates shuffle to randomize the values

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shufflerArray[currentIndex], shufflerArray[randomIndex]] = [
      shufflerArray[randomIndex],
      shufflerArray[currentIndex],
    ];
  }

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
    currentScore += 200;
    kasajizouBool[activePlayer] = false;
    gameLog.value += `${playerNames[activePlayer]} received 200 points at the beginning of this round from the effect of the Kasa Jizou spell!\n`;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
  }

  penaltyScore = 0;
}

function newRoundAnimation(roundText) {
  let roundAnimationText = document.querySelector(`.rounds-animation`);
  roundAnimationText.classList.remove(`hidden`);
  roundAnimationText.style.animation = `none`;
  // if (roundsRulesBool && roundsCounter == roundsToEnd) {
  //   roundAnimationText.textContent = `FINAL ROUND`;
  // } else {
  //   roundAnimationText.textContent = `ROUND ${roundsCounter}`;
  // }
  roundAnimationText.textContent = roundText;
  setTimeout(function () {
    roundAnimationText.style.animation = ``;
  }, 10);
  setTimeout(function () {
    roundAnimationText.classList.add(`hidden`);
  }, 3000);
}

function cardHandler(cardDrawn) {
  let suppString = ``;
  let opponent = activePlayer == 0 ? 1 : 0;

  // Handling boolean card effects
  if (omusubiBool && cardDrawn != `tengu`) {
    currentScore += 40;
    omusubiBool = false;
    gameLog.value += `${playerNames[activePlayer]} drew another card, earning a 40 point bonus from Omusubi Kororin!\n`;
  }

  if (issunBool) {
    currentScore *= 4;
    gameLog.value += `${playerNames[activePlayer]}'s points are doubled!\n`;
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
        gameLog.value += `${playerNames[activePlayer]} is awarded a tamatebako bonus of 100 points from Urashima Tarou for drawing three additional cards!\n`;
      }
    }
  }
  if (kobutoriCounter > 0) {
    kobutoriCounter--;
    btnHold.disabled = true;
    btnHold.textContent = `❌ Cannot hold`;
    if (kobutoriCounter == 0 && cardDrawn != `tengu`) {
      currentScore += 100;
      gameLog.value += `You drew two more cards and won 100 points from the Kobu-tori Jiisan spell bonus!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      btnHold.textContent = `⏹️ Hold`;
      btnHold.disabled = false;
    }
  }

  // Cards with alternate versions are handled first, according to their conditiosn
  if (altSrcCards.includes(cardDrawn)) {
    switch (cardDrawn) {
      // Bunbuku Chagama has 50% chance of showing one face or another
      case `bunbukuChagama`: {
        if (Math.random() < 0.5) {
          bunbukuAltTextBool = true;
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
        } else {
          bunbukuAltTextBool = false;
          cardEle.src = deck[shufflerArray[deckIndex]].altSource;
          currentScore += deck[shufflerArray[deckIndex]].altPoints;
          penaltyScore += deck[shufflerArray[deckIndex]].altPoints;
        }
        break;
      }

      case `sanmainoOfuda`: {
        if (onibabaBool[activePlayer] === true) {
          // Give player opportunity to use ofuda
          cardEle.src = deck[shufflerArray[deckIndex]].altSource;
          currentScore += deck[shufflerArray[deckIndex]].altPoints;
          penaltyScore += deck[shufflerArray[deckIndex]].altPoints;
          // disable spell button
          btnSpell.disabled = true;
          btnSpell.textContent = `🈚 No spell`;
          fudaAltTextBool = true;
        } else {
          cardEle.src = deck[shufflerArray[deckIndex]].source;
          currentScore += deck[shufflerArray[deckIndex]].points;
          fudaAltTextBool = false;
          suppString = `If you use your spell to obtain a protective Ofuda, your turn will be over!`;
        }
        if (urashimaCounter > 0 || kobutoriCounter > 0) {
          btnSpell.disabled = true;
          suppString = `You cannot obtain an ofuda right now because you committed to drawing more cards!\n`;
        }
        break;
      }
      // SaruKani - Players can take revenge if relevant
      case `saruKani`: {
        if (kaniRevengeTracker[opponent] != 0) {
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
        btnDraw.disabled = true;
        btnHold.textContent = `👺 ACCEPT YOUR FATE`;
        tenguBool = true;
        // change hold buutton to "Accept fate"
        // player can either use ofuda or accept fate, all other buttons disabled
        // 30 second timer
        return ``;
      } else {
        suppString = tenguEffect();
      }
      // currentScore = 0;
      // document.querySelector("body").style.backgroundColor = `crimson`;
      // suppString = `Your turn is over! \n`;
      // return suppString;

      return suppString;
    }

    case `omusubiKororin`: {
      omusubiBool = true;
      break;
    }

    case `momotarou`: {
      if (currentScore > 0) {
        currentScore *= 3;
        suppString += `Momotarou triples your current score!`;
      } else {
        currentScore = 0;
        suppString += `Momotarou got rid of all your negative points!`;
      }

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
      suppString = `❗If you do not end your turn now, you commit to drawing another three cards!`;
      break;
    }

    case `warashibe`: {
      // deck index of warashibe is 11, maybe make this code more intelligent later
      currentScore -= deck[11].points;
      currentScore += deck[11].points * warashibeCounter[activePlayer];
      warashibeCounter[activePlayer] *= 2;
      break;
    }

    case `kintarou`: {
      if (kintarouBool) {
        btnSpell.disabled = true;
        btnSpell.textContent = `☑️ Spell used`;
        suppString = `You have already used Kintarou's spell once, so you cannot use it again this turn!`;
      }
      break;
    }
  }

  // Update the current score
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  return suppString;
}

function tenguEffect() {
  if (currentScore > 0) {
    currentScore = 0;
    currentScore -= penaltyScore;
  }
  document.querySelector("body").style.backgroundColor = `crimson`;
  let suppString = `Your turn is over! \n`;
  // add logging and endturn here
  return suppString;
}

function useSpell() {
  let cardDrawn = deck[shufflerArray[deckIndex - 1]].cardId;
  let opponent = activePlayer === 1 ? 0 : 1;

  btnSpell.disabled = true;
  btnSpell.textContent = `☑️ Spell used`;

  switch (cardDrawn) {
    case `saruKani`: {
      if (kaniRevengeTracker[opponent] == 0) {
        totalScores[opponent] -= monkeyAttackPts;
        currentScore += monkeyAttackPts;
        document.getElementById(`current--${activePlayer}`).textContent =
          currentScore;
        document.getElementById(`score--${opponent}`).textContent =
          totalScores[opponent];
        // activate revenge
        kaniRevengeTracker[activePlayer]++;
        gameLog.value += `${playerNames[activePlayer]} used the Monkey Attack Spell to steal ${monkeyAttackPts} from ${playerNames[opponent]}!\n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      } else {
        let revengePts = kanjiRevengePts * kaniRevengeTracker[opponent];
        totalScores[opponent] -= revengePts;
        kaniRevengeTracker[opponent] = 0;
        document.getElementById(`score--${opponent}`).textContent =
          totalScores[opponent];
        // deactivate revenge
        gameLog.value += `${playerNames[activePlayer]} used the Crab Revenge Spell to subtract ${revengePts} points from ${playerNames[opponent]}!\n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }

    case `sanmainoOfuda`: {
      document
        .querySelector(`.ofuda--${activePlayer}`)
        .classList.remove(`hidden`);
      ofudaBool[activePlayer] = true;
      onibabaBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Sanmai no Ofuda spell to obtain one protective ofuda! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      btnDraw.disabled = true;
      btnHold.disabled = false;
      btnHold.textContent = `⏹️ End turn`;
      break;
    }

    case `kintarou`: {
      deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
      gameLog.value += `${playerNames[activePlayer]} used Kintarou's overwhelming power spell to skip over one card! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      kintarouBool = true;
      drawCard();
      break;
    }

    case `kasaJizou`: {
      currentScore = 0;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
      kasajizouBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Kasa Jizou spell to donate their points to the temple!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }

    case `ikkyuu`: {
      currentScore -= 75;
      penaltyScore -= 75;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
      let nextCard = deck[shufflerArray[deckIndex]].cardText;
      gameLog.value += `${playerNames[activePlayer]} used Ikkyuu-san's spell and paid 75 points to peek at the identity of the next card! \n`;
      gameLog.value += `The next card you will draw is ${nextCard} \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      document
        .getElementById(`msg--${activePlayer}`)
        .classList.remove(`hidden`);
      document.getElementById(
        `msg--${activePlayer}`
      ).textContent = `The next card you will draw is ${nextCard}`;
      ikkyuuBool = true;
      break;
    }

    case `kamotori`: {
      kamotoriBool = true;
      gameLog.value += `You have used Kamo-tori Gonbei's spell to gamble to double your points!\nIf you can earn another 100 points this round, your points will be doubled!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      kamotoriCounter = currentScore;
      break;
    }

    case `kobutori`: {
      kobutoriCounter = 2;
      gameLog.value += `You have used Kobu-tori Jiisan's spell! You must draw two cards to receive a bonus!\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }
  }
}

function logTextHandler(cardDrawn, cardText, points, suppString) {
  switch (cardDrawn) {
    case `sanmainoOfuda`: {
      if (fudaAltTextBool) {
        gameLog.value += `${playerNames[activePlayer]} has drawn ONIBABA! You lose ${deck[7].altPoints} points!\n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      } else {
        gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText} and earned ${points} points! ${suppString} \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }
    case `bunbukuChagama`: {
      if (!bunbukuAltTextBool) {
        gameLog.value += `${
          playerNames[activePlayer]
        } drew ${cardText} and had to pay ${25} points!${suppString} \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      } else {
        gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText} and earned +${points} points! ${suppString} \n`;
        gameLog.scrollTop = gameLog.scrollHeight;
      }
      break;
    }
    case `warashibe`: {
      gameLog.value += `${
        playerNames[activePlayer]
      } has drawn ${cardText} and earned +${
        points * (warashibeCounter[activePlayer] / 2)
      } points! \n`; // Warashibe counter needs to be decremented by one since it is incremented after points calculated
      gameLog.scrollTop = gameLog.scrollHeight;
      break;
    }
    case `tengu`: {
      if (!ofudaBool[activePlayer]) {
        gameLog.value +=
          `${playerNames[activePlayer]} has drawn TENGU! You earn zero points this round! ` +
          suppString;
      }
      gameLog.scrollTop = gameLog.scrollHeight;
      if (!ofudaBool[activePlayer]) {
        endTurn(); // this is a weird place for this but it works
      }
      break;
    }
    default: {
      gameLog.value += `${playerNames[activePlayer]} has drawn ${cardText} and earned ${points} points!\n${suppString}\n`;
      gameLog.scrollTop = gameLog.scrollHeight;
    }
  }
}

const ofudaHandler = function () {
  let cardDrawn = deck[shufflerArray[deckIndex - 1]].cardId;
  if (cardDrawn != `tengu` && cardDrawn != `sanmainoOfuda`) {
    gameLog.value += `You cannot use your Ofuda against this card!\n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    return;
  }
  ofudaBool[activePlayer] = false;
  document.querySelector(`.ofuda--${activePlayer}`).classList.add(`hidden`);
  document.querySelector(`body`).style.backgroundColor = `#22b14c`;
  document.querySelector(`.tengu-img`).src = `tenguAlt.png`;
  // Make tengu face different
  if (cardDrawn == `tengu`) {
    cardEle.src = `grayTengu.png`;
    gameLog.value += `You used your Ofuda to escape from the TENGU!\n`;
    gameLog.value += `You lose no points, but your turn is over!\n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    tenguBool = false;
    btnHold.textContent = `⏹️ End turn`;
  } else if (cardDrawn == `sanmainoOfuda`) {
    cardEle.src = `grayOnibaba.png`;
    currentScore += Math.abs(deck[7].altPoints);
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
    gameLog.value += `You used your Ofuda to escape from ONIBABA! But beware, she might come back!\n`;
    gameLog.value += `You get the ${deck[7].altPoints} points she stole back, and can continue your turn!\n`;
    gameLog.scrollTop = gameLog.scrollHeight;
  }

  // deliver a message in the roundmsg

  // set up in cardHandler
  // if cardDrawn != tengu or onibaba
  // --> disable ofuda button
};

// const rollDice = function () {
//   // 1. Generate roll, add score
//   const diceVal = Math.trunc(Math.random() * 6) + 1;
//   console.log(diceVal);

//   // 2. Display die
//   diceEle.classList.remove(`hidden`);
//   diceEle.src = `dice-${diceVal}.png`;
// };

// Event Listeners

// btnNew.addEventListener(`click`, newGame); // TODO -- Currently reworking function of this button
btnNew.addEventListener(`click`, function () {
  modalNew.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
});

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

btnHowTo.addEventListener(`click`, function () {
  modalHowTo.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
});

btnHelp.addEventListener(`click`, function () {
  modalHelp.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
});

btnLore.addEventListener(`click`, function () {
  modalLore.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
});

const closeModal = function () {
  modalAbout.classList.add(`hidden`);
  modalHowTo.classList.add(`hidden`);
  modalLore.classList.add(`hidden`);
  modalHelp.classList.add(`hidden`);
  modalNew.classList.add(`hidden`);
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

btnOfuda0.addEventListener(`click`, ofudaHandler);
btnOfuda1.addEventListener(`click`, ofudaHandler);
btnCloseModal.addEventListener(`click`, closeModal);
closeHowTo.addEventListener(`click`, closeModal);
closeLore.addEventListener(`click`, closeModal);
closeHelp.addEventListener(`click`, closeModal);
closeNew.addEventListener(`click`, closeModal);

btnRounds.addEventListener(`click`, function () {
  btnRounds.classList.add(`form-button-clicked`);
  btnPoints.classList.remove(`form-button-clicked`);
  roundRulesMsg.classList.remove(`hidden`);
  pointsRulesMsg.classList.add(`hidden`);
  roundsRulesBool = true;
  pointsRulesBool = false;
});

btnPoints.addEventListener(`click`, function () {
  btnPoints.classList.add(`form-button-clicked`);
  btnRounds.classList.remove(`form-button-clicked`);
  pointsRulesMsg.classList.remove(`hidden`);
  roundRulesMsg.classList.add(`hidden`);
  pointsRulesBool = true;
  roundsRulesBool = false;
});

btnSubmitNewGame.addEventListener(`click`, function () {
  player1Name = document.getElementById(`player-0-name`).value;
  player2Name = document.getElementById(`player-1-name`).value;

  if (player1Name == ``) {
    player1Name = `Player 1`;
  } else if (player1Name.length > 12) {
    // do something
  }
  playerNames[0] = player1Name;

  if (player2Name == ``) {
    player2Name = `Player 2`;
  } else if (player2Name.length > 12) {
    // do something
  }

  playerNames[1] = player2Name;

  document.getElementById(`name--0`).textContent = player1Name;
  document.getElementById(`name--1`).textContent = player2Name;

  if (pointsRulesBool) {
    pointsToWin = document.getElementById(`points-input`).value;
    // maybe set a default here in case they didn't input anything
  } else if (roundsRulesBool) {
    roundsToEnd = document.getElementById(`rounds-input`).value;
    // same for this, maybe add a default in case nothing was input
  }

  //add validation to make sure user names are valid TODO
  closeModal();
  newGame();

  // Remove these so that when users start a new game neither will be highlighted
  btnRounds.classList.remove(`form-button-clicked`);
  btnPoints.classList.remove(`form-button-clicked`);
  pointsRulesMsg.classList.add(`hidden`);
  roundRulesMsg.classList.add(`hidden`);
});
