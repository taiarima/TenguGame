`use strict`;

// Selecting elements
const score0Ele = document.getElementById(`score--0`);
const score1Ele = document.getElementById(`score--1`);
const diceEle = document.querySelector(`.dice`);
const btnNew = document.querySelector(`.btn--new`);
const btnRoll = document.querySelector(`.btn--roll`);
const btnHold = document.querySelector(`.btn--hold`);
const currScorePlay1 = document.getElementById(`current--0`);

// Variables for game logic
let shufflerArray = [...Array(10).keys()]; // Creates an array with values 0-9
let deckIndex = 0;
let currentScore = 0;
let player1Score = 0;
let player2Score = 0;

diceEle.classList.add(`hidden`);
score1Ele.textContent = 0;
score0Ele.textContent = 0;
console.log(`testing`);
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

function newTurn() {
  shufflerArray = [...Array(10).keys()]; // Creates an array with values 0-9
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
  deckIndex = 0;

  console.log(shufflerArray);
  console.log(deck[0]);
}

// This will later be the draw card listener
btnNew.addEventListener(`click`, function () {
  console.log(`test`);
  //newTurn();
  diceEle.classList.remove(`hidden`);
  diceEle.src = deck[shufflerArray[deckIndex]].source;
  if (deck[shufflerArray[deckIndex]].cardId === `tengu`) {
    currentScore = 0;
    // end turn
    return;
  }
  currentScore += deck[shufflerArray[deckIndex]].points;
  currScorePlay1.textContent = currentScore;
  deckIndex = deckIndex === 9 ? 0 : deckIndex + 1;
});

// Boolean values for card effects
let tsuruBool = false;
let urashimaBool = false;
let omusubiBool = false;
let sarukaniBool = false;
let issunBool = false;
let ofudaBool = false;
let kintarouBool = false;

const deck = [
  {
    cardId: `monkeyCrabQuarrel`,
    source: `01 Monkey-Crab Quarrel Monkey Attack.png`,
    altSource: `01-2 Monkey-Crab Quarrel Crab Revenge.png`,
    points: 15,
    click: true,
  },
  {
    cardId: `momotarou`,
    source: `02 Momotarou.png`,
    points: 10,
    click: false,
  },
  {
    cardId: `issunboushi`,
    source: `03 Issnboushi.png`,
    points: 20,
    click: false,
  },
  {
    cardId: `tengu`,
    source: `04 Tengu.png`,
    points: 0,
    click: false,
  },
  {
    cardId: `urashimaTarou`,
    source: `05 Urashima Tarou.png`,
    points: 15,
    click: false,
  },
  {
    cardId: `tsurunoOngaeshi`,
    source: `06 Tsuru no ongaeshi.png`,
    points: 15,
    click: false,
  },
  {
    cardId: `omusubiKororin`,
    source: `07 Omusubi Kororin.png`,
    points: 15,
    click: false,
  },
  {
    cardId: `sanmainoOfuda`,
    source: `08-1 Sanmai no Ofuda.png`,
    altSource: `08-2 Onibaba.png`,
    points: 15,
    click: true,
  },
  {
    cardId: `kintarou`,
    source: `09 Kintarou.png`,
    points: 20,
    click: false,
  },
  {
    cardId: `bunbukuChagama`,
    source: `10-1 Bunbuku chagama.png`,
    altSource: `10-2 Bunbuku chagama.png`,
    points: -15,
    click: true,
  },
];
