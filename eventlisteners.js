"use strict";

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
  console.log("closeModal function called");
};

overlay.addEventListener(`click`, closeModal);

// btnLog.addEventListener(`click`, function () {
//   gameLog.classList.toggle(`hidden`);
//   if (gameLog.classList.contains(`hidden`)) {
//     btnLog.textContent = `📜 Show Log`;
//   } else {
//     btnLog.textContent = `📜 Hide Log`;
//   }
// });

btnOfuda0.addEventListener(`click`, ofudaHandler);
btnOfuda1.addEventListener(`click`, ofudaHandler);
closeModalBtn.forEach((btn) =>
  btn.addEventListener("click", function () {
    closeModal();
  })
);

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
  initGameRules();
});
