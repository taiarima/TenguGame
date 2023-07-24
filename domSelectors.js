"use strict";
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
const closeModalBtn = document.querySelectorAll(`.close-modal`);
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
