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
const kanjiRevengePts = 300;
const tsuruBonus = 50;
let bunbukuAltTextBool = false;
let fudaAltTextBool = false;
let ikkyuuBool = false;
let kamotoriCounter = 0;
let kamotoriBool = false;
let kobutoriCounter = 0;
let tenguBool = false;
let warashibeMultiplier = 1;

// Deck of card objects
const deck = [
  {
    cardId: `saruKani`,
    source: `saya monkeyattack with text.png`,
    altSource: `saya kanirevenge.jpg  `,
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
    source: `saya tsuru with text.png`,
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
    altSource: `saya onibaba.jpg`,
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

let penaltyScore = 0;

// Game end conditions
let roundsRulesBool = false;
let pointsRulesBool = false;
let pointsToWin = 1000;
let roundsToEnd = 5;
let roundsCounter = 1;
