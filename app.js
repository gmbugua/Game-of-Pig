// GAME RULES:

/*  - The game has 2 players, playing in turns
	- Click 'NEW GAME' to begin Playing
	- Before 
    - In each turn, a player rolls two dice as many times as he 
      whishes. Each result gets added to their TURN score.
    - BUT, if the player rolls a 1, all of their TURN score becomes 0 
      Then it's the next player's turn.
    - IF the Player rolls a DOUBLE (both dice share the same value) their GLOBAL 
      Score is reduced to 0 and it is the next Player's turn.
    - Before rolling, a player can choose to 'Hold', which means that their TURN 
      score gets added to their GLOBAL score. After holding, it is the next player's turn.
    - The first player to reach either the PRE-SET GLOBAL Score of 21 points or the CUSTOM
      GLOBAL Score  
*/


// *** GAME CODE ***

var scores, turnScore, activePlayer, dice, dice_1, doubles, gameRunning, winScore, scoreSet, currentScore;

// BUTTON EVENTS

// NEW
document.querySelector('.btn-new').addEventListener('click', function () {

	// RESET GAME SCORES AND DICE
	init();
	resetDice();
	resetOutcome();
	resetWinScoreDOM();
	resetScoresDOM();

});

// WIN SCORE
document.querySelector('.btn-setScore').addEventListener('click', function () {
	if (gameRunning === true && scoreSet === true) {
		var winScore_user = document.querySelector('#win-input').value;
		if (winScore_user !== '0' && winScore_user !== '') {
			winScore = winScore_user;
			scoreSet = false;
			document.querySelector('.btn-setScore').style.display = 'none';
			document.querySelector('#win-input').style.display = 'none';
		} else {
			document.querySelector('#win-input').value = 'ERROR';
		}
	}
});

// ROLL 
document.querySelector('.btn-roll').addEventListener('click', function () {

	if (gameRunning === true) {

		// CUSTOM SCORE SET TO FALSE if user rolls
		scoreSet = false;
		document.querySelector('.btn-setScore').style.display = 'none';
		document.querySelector('#win-input').style.display = 'none';

		var currDOM, diceDOM, prevRoll, dice1_DOM, diceSum;

		// DOM Selectors
		currDOM = document.querySelector('#current-' + activePlayer);
		diceDOM = document.querySelector('.dice');
		dice1_DOM = document.querySelector('#dice-1');

		// Math.floor drops the decimal
		// Math.random by default selects a random number between 0 and 1
		dice = Math.floor(Math.random() * 6) + 1;
		dice_1 = Math.floor(Math.random() * 6) + 1;

		// Display different dice faces upon roll
		diceDOM.style.display = 'block';
		dice1_DOM.style.display = 'block';

		diceDOM.src = 'dice-' + dice + '.png';
		dice1_DOM.src = 'dice-' + dice_1 + '.png';

		// Update Score based on rules above.
		if (dice !== 1 && dice_1 !== 1) {

			// Sum the Two Dice
			diceSum = dice + dice_1;

			// UPDATE + Check for Doubles
			turnScore += diceSum;
			testDoubles();

			if (doubles === true) {

				resetScore(activePlayer);
				setActive();
				doubles = false;

			} else {
				currDOM.textContent = turnScore;
			}

		} else {
			setActive();
		}

	}

});

// HOLD
document.querySelector('.btn-hold').addEventListener('click', function () {

	testCurrentScore(activePlayer);

	if ((gameRunning === true) && (currentScore === true)) {

		// DOM Selectors
		var scoreDOM = document.querySelector('#score-' + activePlayer);

		// Increment scores array for the activePlayer using the turnScore
		scores[activePlayer] += turnScore;

		// Update DOM to reflect scores array
		scoreDOM.textContent = scores[activePlayer];

		// Win Condition: Score of 21 or greater
		if (scores[activePlayer] >= winScore) {

			var inactivePlayer = getInactive(activePlayer);
			resetDice();

			// DOM Manipulation: Changing the lucky Player's  Name to reflect a Win
			document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

			// DOM Manipulation: Changing the unlucky Player's Name to reflect a Loss
			document.querySelector('#name-' + inactivePlayer).textContent = 'Loser!';
			document.querySelector('.player-' + inactivePlayer + '-panel').classList.add('loser')

			gameRunning = false;

		} else {
			setActive();
		}

	}

});

// *** UTILITY FUNCTIONS ***

// INITIALIZATION
function init() {

	// SET CORE VARIABLES TO 0 or 1
	scores = [0, 0];
	turnScore = 0;
	activePlayer = 0;
	winScore = 21;
	currentScore = false;
	scoreSet = true;
	doubles = false;
	gameRunning = true;

}

// ACCESS

// Returns which player is inactive
function getInactive(actvPlayer) {
	if (actvPlayer === 0) {
		return 1;
	} else {
		return 0;
	}
}

function testDoubles() {
	if (dice === dice_1) {
		doubles = true;
	}
}

function testCurrentScore(actvPlayer) {
	var currScore = document.querySelector('#current-' + actvPlayer).textContent;
	if (currScore === '0') {
		currentScore = false;
	} else {
		currentScore = true;
	}
}

// *** RESETS ***

// PLAYER SCORE
function resetScore(actvPlayer) {
	document.getElementById('score-' + actvPlayer).textContent = '0';
	scores[actvPlayer] = 0;
}

// WIN SCORE
function resetWinScoreDOM() {
	document.querySelector('.btn-setScore').style.display = 'inline-block';
	document.querySelector('#win-input').style.display = 'inline-block';
	document.querySelector('#win-input').value = '';
}

// DICE 
// Removes dice from the document display
function resetDice() {
	document.querySelector('.dice').style.display = 'none';
	document.querySelector('#dice-1').style.display = 'none';
}


// DOM SCORES
// Sets ALL Scores on DOM to 0
function resetScoresDOM() {

	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';

}

// WINNER or LOSER
// Resets DOM to reflect pre-outcome UI. No winner, no Loser. 
function resetOutcome() {

	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';

	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');

	document.querySelector('.player-0-panel').classList.remove('loser');
	document.querySelector('.player-1-panel').classList.remove('loser');

	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');

	document.querySelector('.player-0-panel').classList.add('active');

}

// ACTIVE PLAYER
// Sets Active Player and Resets the turn Score. I.O NextPlayer
function setActive() {

	var currDOM = document.querySelector('#current-' + activePlayer);

	// RESET SCORE
	turnScore = 0;
	currDOM.textContent = turnScore;

	// Change activePlayer Based on Current Value
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

	// Switching active UI appearence
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

}