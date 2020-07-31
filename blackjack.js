//Blackjack Game
document.querySelector("#hitButton").addEventListener('click', hitButton);
document.querySelector("#standButton").addEventListener('click', standButton);
document.querySelector("#dealButton").addEventListener('click', dealButton);

var blackjack = {
	'you': { 'div': '#yourScore-div', 'score-span': '#yourScore-span', 'score': 0 },
	'dealer': { 'div': '#dealerScore-div', 'score-span': '#dealerScore-span', 'score': 0 },
	'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
	'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
	'wins': 0,
	'loses': 0,
	'draws': 0,
	'isStand': false,
	'isDeal': false,
}

const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];

const cardMusic = new Audio('sounds/swish.m4a');
const winMusic = new Audio('sounds/cash.mp3');
const lostMusic = new Audio('sounds/aww.mp3');

function hitButton() {

	if (blackjack['isStand'] === false) {
		var card = randomCard();
		showCard(card, YOU);
		updateScore(card, YOU);
		showScore(YOU);
	}
}

function randomCard() {

	var randomNo = Math.floor(Math.random() * 13);
	return blackjack['cards'][randomNo];

}

function showCard(card, activePlayer) {

	if (activePlayer['score'] <= 21) {
		var cardImg = document.createElement('img');
		cardImg.src = "images/" + card + ".png"
		document.querySelector(activePlayer['div']).appendChild(cardImg);
		cardMusic.play();
	}
}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve,ms));
	}
	
	async function standButton() {

			blackjack['isStand'] = true;
			
		while (DEALER['score'] <16  &&  blackjack['isStand'] === true) {
			var card = randomCard();
			showCard(card,DEALER);
			updateScore(card,DEALER);
		//	console.log(DEALER['score']);
			showScore(DEALER);
			await sleep(1000);
		}
			
			if(DEALER['score'] > 15) {
				blackjack['isDeal'] = true;
				var winner = computeWinner();
				showWinner(winner);
			//	console.log(blackjack['isDeal']);
			
		}
	}

function dealButton() {

	if (blackjack['isDeal'] === true) {
		var allImages = document.querySelector('#blackjack-row1').querySelectorAll('img');

		for (var i = 0; i < allImages.length; i++) {
			allImages[i].remove();
		}

		YOU['score'] = 0;
		DEALER['score'] = 0;

		document.querySelector('#yourScore-span').textContent = YOU['score'];
		document.querySelector('#yourScore-span').style.color = "white";

		document.querySelector('#dealerScore-span').textContent = DEALER['score'];
		document.querySelector('#dealerScore-span').style.color = "white";

		document.querySelector('#blackjackResult').textContent = "Let's Play";
		document.querySelector('#blackjackResult').style.color = "black";

		blackjack['isDeal'] = false;
		blackjack['isStand'] = false;

	}
}

function updateScore(card, activePlayer) {

	if (card === 'A') {
		if (activePlayer['score'] + blackjack['cardsMap'][card][1] <= 21) {
			activePlayer['score'] += blackjack['cardsMap'][card][1];
		} else {
			activePlayer['score'] += blackjack['cardsMap'][card][0];
		}
	} else {
		activePlayer['score'] += blackjack['cardsMap'][card];
	}

}


function showScore(activePlayer) {

	if (activePlayer['score'] > 21) {
		document.querySelector(activePlayer['score-span']).textContent = "BUST!";
		document.querySelector(activePlayer['score-span']).style.color = "red";
	} else {
		document.querySelector(activePlayer['score-span']).textContent = activePlayer['score'];
	}

}

function computeWinner() {
	let winner;

	if (YOU['score'] <= 21) {

		if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
			winner = YOU;
			blackjack['wins']++;
		} else if (YOU['score'] < DEALER['score']) {
			winner = DEALER;
			blackjack['loses']++;
		} else if (YOU['score'] === DEALER['score']) {
			blackjack['draws']++;
		}
	} else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
		winner = DEALER;
		blackjack['loses']++;
	} else {
		blackjack['draws']++;
	}

	return winner;
	console.log(winner);

}

function showWinner(winner) {

	let message, messagColor;

	if (winner === YOU) {

		message = "You Won!";
		messageColor = 'green';
		document.querySelector('#wins-span').textContent = blackjack['wins'];
		winMusic.play();

	} else if (winner === DEALER) {

		message = "You Lost!";
		messageColor = 'red';
		document.querySelector('#loses-span').textContent = blackjack['loses'];
		lostMusic.play();

	} else {

		message = "You Drew!";
		messageColor = 'black';
		document.querySelector('#draws-span').textContent = blackjack['draws'];

	}

	document.querySelector('#blackjackResult').textContent = message;
	document.querySelector('#blackjackResult').style.color = messageColor;

}

