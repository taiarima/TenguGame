"use strict";

function initGameRules() {
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
    if (pointsToWin < 500 || pointsToWin > 1000000) {
      alert(`\nYou must select a point value between 500 and 1,000,000!\n\n`);
      return;
    }
  } else if (roundsRulesBool) {
    roundsToEnd = document.getElementById(`rounds-input`).value;
    if (roundsToEnd < 1 || roundsToEnd > 100) {
      alert(`\nYou must select an amount of rounds between 1 and 100!\n\n`);
      return;
    }
  } else {
    console.log(roundsRulesBool);
    // The user has not selected which rules they want to play with
    alert(`\nYou must select which game mode you wish to play with!\n\n\n`);
    return;
  }

  closeModal();
  newGame();

  // Remove these so that when users start a new game neither will be highlighted
  btnRounds.classList.remove(`form-button-clicked`);
  btnPoints.classList.remove(`form-button-clicked`);
  pointsRulesMsg.classList.add(HIDDEN);
  roundRulesMsg.classList.add(HIDDEN);
}

const newGame = function () {
  resetGUI();
  resetGameValues();

  if (pointsRulesBool) {
    gameLog.value += `You are playing a game with points rules. The first person to reach ${pointsToWin} will win the game!\n`;
  } else {
    gameLog.value += `You are playing a game with rounds rules. The game will end after ${roundsToEnd} turns.   If there is a tie at the end of ${roundsToEnd} rounds, then sudden death rounds will be added until there is no longer a tie.\n`;
  }

  newTurn();
};

function resetGUI() {
  btnNew.classList.toggle(HIDDEN);
  btnTurn.classList.toggle(HIDDEN); // this is silly but it should work for now
  btnSpell.classList.toggle(HIDDEN);
  document.querySelector(PLAYER_ZERO).classList.remove(PLAYER_WINNER);
  document.querySelector(PLAYER_ONE).classList.remove(PLAYER_WINNER);
  document.querySelector(PLAYER_ZERO).classList.remove(PLAYER_LOSER);
  document.querySelector(PLAYER_ONE).classList.remove(PLAYER_LOSER);
  document.querySelector(PLAYER_ZERO).classList.add(PLAYER_ACTIVE); // change this later
  document.querySelector(PLAYER_ONE).classList.remove(PLAYER_ACTIVE);
  activePlayer = 0;
  roundsCounter = 1;

  // Clear log
  gameLog.value = "";
}

function resetGameValues() {
  // Set scores back to zero
  // score0Ele.textContent = 0;
  // score1Ele.textContent = 0;
  totalScores[0] = 0;
  totalScores[1] = 0;

  // Reset any boolean values that might remain switched on
  tsuruBool = false;
  ofudaBool = [false, false];
  onibabaBool = [false, false];
  omusubiBool = false;
  issunBool = false;
  urashimaCounter = 0;
  // warashibeCounter = [1, 1]; experimenting with removing this
  kintarouBool = false;
  kasajizouBool = [false, false];
  kaniRevengeTracker = [0, 0];
  bunbukuAltTextBool = false;
  fudaAltTextBool = false;
  btnOfuda0.classList.add(HIDDEN);
  btnOfuda1.classList.add(HIDDEN);
}

function resetTenguImg() {}

function resetBackground() {
  // Set Tengu and background back to default settings
  document.querySelector(`.tengu-img`).src = `tenguCenter.png`;
  document.querySelector("body").style.backgroundColor = DARK_GRAY;
}

const drawCard = function () {
  resetBackground();

  btnHold.disabled = false;

  if (tsuruBool) {
    tsuruBool = false;
    gameLog.value += `${playerNames[activePlayer]} drew another card, sacrificing their Tsuru no Ongaeshi bonus! \n`;
  }

  // Remove any messages from Ikkyuu-san spell that might be present
  if (ikkyuuBool) {
    document.getElementById(`msg--${activePlayer}`).classList.add(HIDDEN);
  }

  // TODO, seems like this is only relevant first turn
  cardEle.classList.remove(HIDDEN);
  btnSpell.classList.remove(HIDDEN);

  // Actual card drawing function
  const cardText = deck[shufflerArray[deckIndex]].cardText;
  const points = deck[shufflerArray[deckIndex]].points;
  const cardDrawn = deck[shufflerArray[deckIndex]].cardId;
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

  const suppString = cardHandler(cardDrawn);
  logTextHandler(cardDrawn, cardText, points, suppString);

  // In the event that the user used Kintarou effect to go through entire deck,
  // loop back from beginning of deck
  deckIndex = deckIndex === deck.length - 1 ? 0 : deckIndex + 1;
};

function endTurn() {
  // resetTurnBools includes application of end of turn card effects
  resetTurnBools();

  // Re-enable hold button if Urashima effect had disabled it
  btnHold.disabled = false;
  btnHold.textContent = `⏹️ Hold`;

  // Rounds Counter
  if (activePlayer == 1) {
    roundsCounter++;
  }

  computeScores();

  // Check end game conditions
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

  // Switch player
  switchPlayer();

  resetPlayButtons();
}

function resetPlayButtons() {
  // Hide all buttons
  btnDraw.classList.toggle(HIDDEN);
  btnSpell.classList.toggle(HIDDEN);
  btnHold.classList.toggle(HIDDEN);

  // Show new turn button
  btnTurn.classList.toggle(HIDDEN);
}

function computeScores() {
  // Add any points gained/lost to total and update GUI
  document.getElementById(`msg--${activePlayer}`).classList.remove(HIDDEN);
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
}

function resetTurnBools() {
  // Player gets extra points if ended turn with tsuru no ongaesi
  if (tsuruBool) {
    currentScore += tsuruBonus;
    gameLog.value += `${playerNames[activePlayer]} received an extra ${tsuruBonus} points from the Tsuru no Ongaeshi bonus! \n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    tsuruBool = false;
  }

  if (tenguBool) {
    tenguEffect();
    tenguBool = false;
    btnDraw.disabled = false;
  }

  if (ikkyuuBool) {
    document.getElementById(`msg--${activePlayer}`).classList.add(HIDDEN);
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
}

function switchPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  inactivePlayer = inactivePlayer === 0 ? 1 : 0;
  player0Ele.classList.toggle(PLAYER_ACTIVE);
  player1Ele.classList.toggle(PLAYER_ACTIVE);
  player0Ele.classList.toggle(PLAYER_INACTIVE);
  player1Ele.classList.toggle(PLAYER_INACTIVE);

  // Disabling Ofuda button for player ending turn TODO should be conditional
  document
    .querySelector(`.ofuda--${activePlayer}`)
    .classList.add(`disabled-ofuda`);
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
    .classList.add(PLAYER_WINNER);

  document.querySelector(`.player--${opponent}`).classList.add(PLAYER_LOSER);

  // Hide buttons
  btnHold.classList.add(HIDDEN);
  btnSpell.classList.add(HIDDEN);
  btnDraw.classList.add(HIDDEN);
  btnNew.classList.toggle(HIDDEN);

  // Show winning messages
  document.getElementById(
    `msg--${activePlayer}`
  ).textContent += `\n${playerNames[activePlayer]} wins!`;
  console.log(playerNames[activePlayer]);
  document.getElementById(
    `msg--${opponent}`
  ).textContent = `${playerNames[opponent]} suffers the curse of \n the TENGU!`;
  document.getElementById(`msg--0`).classList.remove(HIDDEN);
  document.getElementById(`msg--1`).classList.remove(HIDDEN);

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

  //Enabling Ofuda for player starting turn
  // This should be conditional TODO
  document
    .querySelector(`.ofuda--${activePlayer}`)
    .classList.remove(`disabled-ofuda`);

  document.querySelector(`.tengu-img`).src = `tenguCenter.png`;
  gameLog.value += `\n>>> Begin ${playerNames[activePlayer]}'s turn!! >>>> \n`;
  gameLog.scrollTop = gameLog.scrollHeight;
  // Reveal all buttons
  btnDraw.classList.toggle(HIDDEN);
  // btnSpell.classList.toggle(HIDDEN);
  btnHold.classList.toggle(HIDDEN);

  // Hide new turn button
  btnTurn.classList.toggle(HIDDEN);
  btnSpell.classList.add(HIDDEN);

  // roundMsg0.classList.add(HIDDEN);
  // roundMsg1.classList.add(HIDDEN);

  btnHold.disabled = true;
  btnDraw.disabled = false;
  document.querySelector("body").style.backgroundColor = DARK_GRAY;
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
  // cardEle.classList.remove(HIDDEN);
  // cardEle.src = `card back green conversion.png`;

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
  roundAnimationText.classList.remove(HIDDEN);
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
    roundAnimationText.classList.add(HIDDEN);
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
        btnHold.disabled = false;
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
      // TODO: Something is wrong with the points for this card !!! BUG !!!
      // deck index of warashibe is 11, maybe make this code more intelligent later
      currentScore -= deck[11].points;
      warashibeMultiplier = roundsCounter > 5 ? roundsCounter : 5;
      currentScore += deck[11].points * warashibeMultiplier;
      // warashibeCounter[activePlayer] *= 2;
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
    currentScore += penaltyScore;
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
        .classList.remove(HIDDEN);
      ofudaBool[activePlayer] = true;
      onibabaBool[activePlayer] = true;
      gameLog.value += `${playerNames[activePlayer]} used the Sanmai no Ofuda spell to obtain one protective ofuda! \n`;
      gameLog.scrollTop = gameLog.scrollHeight;
      btnDraw.disabled = true;
      btnHold.disabled = false;
      btnHold.textContent = `⏹️ End turn`;
      // Disabling Ofuda button after they receive it
      document
        .querySelector(`.ofuda--${activePlayer}`)
        .classList.add(`disabled-ofuda`);
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
      document.getElementById(`msg--${activePlayer}`).classList.remove(HIDDEN);
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
        points * warashibeMultiplier
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
  // If condition to make sure only the user whose turn it is can use their ofuda
  if (
    document
      .querySelector(`.ofuda--${activePlayer}`)
      .classList.contains(`disabled-ofuda`)
  ) {
    gameLog.value += `You cannot use your Ofuda because it's not your turn!\n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    return;
  }

  let cardDrawn = deck[shufflerArray[deckIndex - 1]].cardId;
  if (cardDrawn != `tengu` && cardDrawn != `sanmainoOfuda`) {
    gameLog.value += `You cannot use your Ofuda against this card!\n`;
    gameLog.scrollTop = gameLog.scrollHeight;
    return;
  }
  ofudaBool[activePlayer] = false;
  document.querySelector(`.ofuda--${activePlayer}`).classList.add(HIDDEN);
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
    penaltyScore += 100;
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