class SnakeGame {

	static NUM_ROWS = 20;
	static NUM_COLS = 20;
	static EMOJIS = ["👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👩‍🦱", "🧑‍🦱", "👨‍🦱", "👩‍🦰", "🧑‍🦰", "👨‍🦰", "👱‍♀️", "👱", "👱‍♂️", "👩‍🦳", "🧑‍🦳", "👨‍🦳", "👩‍🦲", "🧑‍🦲", "👨‍🦲", "🧔", "👵", "🧓", "👴", "👲", "👳‍♀️", "👳", "👳‍♂️", "🧕", "👮‍♀️", "👮", "👮‍♂️", "👷‍♀️", "👷", "👷‍♂️", "💂‍♀️", "💂", "💂‍♂️", "🕵️‍♀️", "🕵️", "🕵️‍♂️", "👩‍⚕️", "🧑‍⚕️", "👨‍⚕️", "👩‍🌾", "🧑‍🌾", "👨‍🌾", "👩‍🍳", "🧑‍🍳", "👨‍🍳", "👩‍🎓", "🧑‍🎓", "👨‍🎓", "👩‍🎤", "🧑‍🎤", "👨‍🎤", "👩‍🏫", "🧑‍🏫", "👨‍🏫", "👩‍🏭", "🧑‍🏭", "👨‍🏭", "👩‍💻", "🧑‍💻", "👨‍💻", "👩‍💼", "🧑‍💼", "👨‍💼", "👩‍🔧", "🧑‍🔧", "👨‍🔧", "👩‍🔬", "🧑‍🔬", "👨‍🔬", "👩‍🎨", "🧑‍🎨", "👨‍🎨", "👩‍🚒", "🧑‍🚒", "👨‍🚒", "👩‍✈️", "🧑‍✈️", "👨‍✈️", "👩‍🚀", "🧑‍🚀", "👨‍🚀", "👩‍⚖️", "🧑‍⚖️", "👨‍⚖️", "👰‍♀️", "👰", "👰‍♂️", "🤵‍♀️", "🤵", "🤵‍♂️", "👸", "🤴", "🥷", "🦸‍♀️", "🦸", "🦸‍♂️", "🦹‍♀️", "🦹", "🦹‍♂️", "🤶", "🧑‍🎄", "🎅", "🧙‍♀️", "🧙", "🧙‍♂️", "🧝‍♀️", "🧝", "🧝‍♂️", "🧛‍♀️", "🧛", "🧛‍♂️", "🧟‍♀️", "🧟", "🧟‍♂️", "🧞‍♀️", "🧞", "🧞‍♂️", "🧜‍♀️", "🧜", "🧜‍♂️", "🧚‍♀️", "🧚", "🧚‍♂️", "👼", "🤰", "🤱", "👩‍🍼", "🧑‍🍼", "👨‍🍼", "🍿", "⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🧗‍♂️", "🚵‍♀️", "🧘‍♂️", "🏄‍♀️", "⛳️", "🪁", "🏹", "🎣", "🤿", "🥊"]

	board = [];
	#score = 0;

	constructor(boardEl, controlsEl) {
		this.boardEl = boardEl;
		this.controlsEl = controlsEl;
		this.scoreEl = document.querySelector('.score');

		this.initBoard();

		this.scoreboard = new Scoreboard(this);
		this.snake = new Snake(this);
		this.friend = new Friend(this);
		this.powerup = new ReversePowerup(this);

		window.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'ArrowLeft':
				case 'a':
					this.snake.setDirection('left');
					break;

				case 'ArrowUp':
				case 'w':
					this.snake.setDirection('up');
					break;

				case 'ArrowRight':
				case 'd':
					this.snake.setDirection('right');
					break;

				case 'ArrowDown':
				case 's':
					this.snake.setDirection('down');
					break;

				case 'Escape':
					this.snake.pause();
					break;
			}
		});

	}
	/**
	 * Score getter
	 */
	get score() {
		return this.#score;
	}
	/**
	 * Score setter to ensure DOM is always up to date
	 */
	set score(newScore) {
		this.#score = newScore;
		this.scoreEl.textContent = newScore;
	}

	/**
	 * Build the boardEl using rows of cells
	 */
	initBoard() {

		// Generate a new row
		const newRow = (rowNum) => {
			const row = document.createElement('div');
			row.classList.add('row');
			row.classList.add('row-' + rowNum);
			return row;
		}
		// Generate a new column
		const newCol = (colNum) => {
			const col = document.createElement('div');
			col.classList.add('col');
			col.classList.add('col-' + colNum);
			return col;
		}

		// For each number of rows make a new row element and fill with columns
		for (let r = 0; r < SnakeGame.NUM_ROWS; r++) {

			const row = newRow(r);
			const bCellsRow = [];

			// For each number of columns make a new column element and add to the row
			for (let c = 0; c < SnakeGame.NUM_COLS; c++) {

				const col = newCol(c);
				row.appendChild(col);
				bCellsRow.push(col);

			}

			// cols and rows are passed by reference so changing board
			// affects boardEl
			this.boardEl.appendChild(row);
			this.board.push(bCellsRow);

		}

	}

	/**
	 * Determines if coordinates are within the board
	 * @param {number} x 
	 * @param {number} y 
	 * @returns boolean
	 */
	boordCoordsExist(x, y) {
		const yValid = (y < SnakeGame.NUM_ROWS) && (y >= 0);
		const xValid = (x < SnakeGame.NUM_COLS) && (x >= 0);
		return yValid && xValid;
	}

	/**
	 * Increment the user's score
	 */
	increaseScore(amount = 1) {
		this.score += amount;
	}

	/**
	 * Reset the user's score
	 */
	resetScore() {
		this.score = 0;
	}

	/**
	 * Begin the game
	 */
	play() {

		this.controlsEl.classList.add('playing');

		this.snake.move();
		this.friend.move();
	}

	/**
	 * Restart the game after game over
	 */
	restart() {

		this.snake.reset();
		this.friend.reset();

		this.controlsEl.classList.remove('game-over');
		this.boardEl.classList.remove('game-over');

		this.resetScore();
		this.play();

	}

	/**
	 * Chooses a random EMOJI
	 * @returns string
	 */
	getRandomEmoji() {
		return SnakeGame.EMOJIS[Math.floor(Math.random() * SnakeGame.EMOJIS.length)];
	}

	/**
	 * End the game
	 */
	gameOver() {

		this.snake.pause();

		this.controlsEl.classList.remove('playing');
		this.controlsEl.classList.add('game-over');
		this.boardEl.classList.add('game-over');
		this.scoreboard.resetVisibility();
		this.scoreboard.nameInputEl.focus();

	}

}

class Snake {

	static STARTING_EDGE_OFFSET = 6;
	#headEmoji = "😎";

	constructor(game) {
		this.setDefaults();
		this.game = game;
		this.init();
	}

	/**
	 * Setter for the head emoji
	 */
	set headEmoji(newEmoji) {
		this.#headEmoji = newEmoji;
		this.tailEmojis[0] = newEmoji;
	}

	/**
	 * Getter for the head emoji
	 */
	get headEmoji() {
		return this.#headEmoji;
	}

	/**
	 * Ensures defaults can easily be reset
	 */
	setDefaults() {
		this.tail = [];
		this.tailEmojis = [];
		this.tailLength = 2;
		this.directionQueue = [];
		this.directionQueueLength = 2;
		this.direction = 'up';
		this.speed = 160;
		this.moving = false;
		this.#headEmoji = "😎";
		this.reversed = 0;
	}

	/**
	 * Place the snake initially
	 */
	init() {

		const x = Math.floor(Math.random() * (SnakeGame.NUM_COLS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
		const y = Math.floor(Math.random() * (SnakeGame.NUM_ROWS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
		this.position = { x, y };

		const startCell = this.game.board[y][x];
		startCell.classList.add('snake');

		// start to keep track of which emojis make up the snake
		this.tailEmojis.push(this.headEmoji);

		for (let i = 0; i < this.tailLength - 1; i++) {
			this.tailEmojis.push(this.game.getRandomEmoji());
		}

		this.tail.push(startCell);

		this.updateTail();

	}

	/**
	 * Ensure the actual snake has the correct emojis
	 */
	updateTail() {
		const reversedTailSpecifics = [...this.tailEmojis].reverse();
		const partToRemove = this.tail[0];

		if (this.tail.length > this.tailLength) {
			partToRemove.classList.remove('snake');
			partToRemove.textContent = "";
			this.tail.shift();
		}

		for (const [i, part] of this.tail.entries()) {
			part.textContent = reversedTailSpecifics[i];
		}
	}


	/**
	 * Move the snake
	 */
	move() {

		// If this is the first move, make sure the game isn't paused
		if (!this.moving) {
			this.moving = true;
			this.game.controlsEl.classList.remove('paused');
		}

		// Work through the queue of directions
		if (this.directionQueue.length > 0) {
			this.direction = this.directionQueue[0];
			this.directionQueue.shift();
		}

		switch (this.direction) {
			case 'up':
				this.position.y -= 1;
				break;
			case 'down':
				this.position.y += 1;
				break;
			case 'right':
				this.position.x += 1;
				break;
			case 'left':
				this.position.x -= 1;
				break;
		}

		// Determine end game collision
		if (this.hasCollided()) {
			this.game.gameOver();
			this.pause();
			return;
		}

		const { x, y } = this.position;
		const nextSnake = this.game.board[y][x];

		// Check if next snake position is a friend/food
		if (nextSnake === this.game.friend.currentItem) {

			// upgrade snake differently while in reversed mode
			if (this.reversed > 0) {
				this.partialUpgrade();
			} else {
				this.fullUpgrade();
			}

			this.game.friend.move();

			if (!this.game.powerup.spawned && this.reversed === 0) {
				this.game.powerup.move();
			}

			if (this.reversed > 0) {
				this.reversed -= 1;
			}

			if (this.reversed === 1) {
				this.headEmoji = "🤮";
			}

			if (this.reversed === 0) {
				this.headEmoji = "😎";
			}
		}

		// Check is next snake position is powerup
		if (nextSnake === this.game.powerup.currentItem) {
			this.game.powerup.spawned = false;
			this.reversed = 3;
			this.headEmoji = "🤢";
		}

		nextSnake.classList.add('snake');
		this.tail.push(nextSnake);

		this.updateTail();

		// Move another step in `this.speed` number of milliseconds
		this.movementTimer = setTimeout(() => { this.move(); }, this.speed);

	}

	/**
	 * Set the snake's direction
	 */
	setDirection(direction) {
		// If powerup is active, reverse directions
		if (this.reversed > 0) {
			direction = this.reverseDirection(direction);
		}

		// Ensure directions are only added to queue if valid
		const firstItemCheck = !(this.direction === this.reverseDirection(direction)) && !(this.direction === direction);
		const secondItemCheck = !(this.directionQueue[0] === this.reverseDirection(direction)) && !(this.directionQueue[0] === direction);
		switch (this.directionQueue.length) {
			case 0:
				if (firstItemCheck) {
					this.directionQueue.push(direction);
				}
				break;
			case 1:
				if (secondItemCheck) {
					this.directionQueue.push(direction);
				}
				break;
			case 2:
				if (secondItemCheck) {
					this.directionQueue[1] = direction;
				}
				break;
		}

	}
	/**
	 * snake upgrade that happens at every food/friend consumption
	 */
	fullUpgrade() {
		this.game.increaseScore();
		this.speed -= 2;
		this.tailLength += 1;
		this.tailEmojis.push(this.game.friend.currentItem.textContent);
	}

	/**
	 * snake upgrade that happens at every powerup consumption
	 */
	partialUpgrade() {
		this.game.increaseScore(3);
		this.tailLength += 1;
		this.tailEmojis.push(this.game.friend.currentItem.textContent);
	}

	reverseDirection(direction) {
		switch (direction) {
			case 'up':
				return 'down';
			case 'down':
				return 'up';
			case 'right':
				return 'left';
			case 'left':
				return 'right';
		}
	}

	hasCollided() {
		const { x, y } = this.position;

		// Snake wall collision detection
		const rightCollide = x >= SnakeGame.NUM_COLS;
		const leftCollide = x < 0;
		const upCollide = y < 0;
		const downCollide = y >= SnakeGame.NUM_ROWS;

		if (upCollide || downCollide || rightCollide || leftCollide) {
			return true;
		}

		// Snake tail collision detection
		const nextSnake = this.game.board[y][x];
		if (this.tail.includes(nextSnake)) {
			return true;
		}

		return false;
	}

	/**
	 * Pause the snake's movement
	 */
	pause() {
		clearTimeout(this.movementTimer);
		this.moving = false;
		this.game.controlsEl.classList.add('paused');
	}

	/**
	 * Reset the snake back to the initial defaults
	 */
	reset() {
		for (const tailPart of this.tail) {
			tailPart.classList.remove('snake');
			tailPart.textContent = "";
		}

		this.setDefaults();
		this.init();

	}

}

/**
 * Parent class for food/friend and powerup
 */
class Item {
	constructor(game, itemTag, probability = 1.0) {
		this.game = game;
		this.currentItem;
		this.itemTag = itemTag;
		this.probability = probability;
		this.spawned = false;
	}

	/**
	 * Initiates moving an item, arguments used for testing only
	 */
	move(x = null, y = null) {
		// allows items to only spawn under certain probability
		if (this.probability != 1.0) {
			const random = Math.random();
			if (random > this.probability) {
				return;
			}
		}

		let invalidPosition = true;
		let nextItem;

		if (x && y) {
			invalidPosition = false;
			nextItem = this.game.board[y][x];
		}

		// ensure item is not spawned at invalid position
		while (invalidPosition) {
			const x = Math.floor(Math.random() * SnakeGame.NUM_COLS);
			const y = Math.floor(Math.random() * SnakeGame.NUM_ROWS);
			nextItem = this.game.board[y][x];

			let snakeClash = nextItem.classList.contains('snake');
			const itemClash = nextItem.classList.contains('item');

			let checks = [];

			// don't allow spawn immediately next to snake
			if (this.game.boordCoordsExist(x, y - 1)) checks.push(this.game.board[y - 1][x]);
			if (this.game.boordCoordsExist(x, y + 1)) checks.push(this.game.board[y + 1][x]);
			if (this.game.boordCoordsExist(x + 1, y)) checks.push(this.game.board[y][x + 1]);
			if (this.game.boordCoordsExist(x - 1, y)) checks.push(this.game.board[y][x - 1]);

			for (const check of checks) {
				if (check && check.classList.contains('snake')) {
					snakeClash = true;
					break;
				}
			}

			if (!snakeClash && !itemClash) {
				invalidPosition = false;
			}

		}

		nextItem.textContent = this.getEmoji();

		if (this.currentItem) {
			this.reset();
		}

		nextItem.classList.add('item');
		nextItem.classList.add(this.itemTag);
		this.spawned = true;
		this.currentItem = nextItem;
	}

	getEmoji() {
		return this.game.getRandomEmoji();
	}

	reset() {
		this.currentItem.classList.remove('item');
		this.currentItem.classList.remove(this.itemTag);
		this.currentItem.textContent = "";
	}
}

/**
 * Main food type "Friend"
 */
class Friend extends Item {
	constructor(game) {
		super(game, "food", 1.0);
	}
}
/**
 * Powerup that gives more score but reverses directions
 */
class ReversePowerup extends Item {
	constructor(game) {
		super(game, "reverse", 0.5);
	}
	getEmoji() {
		return "🤪";
	}
}

/**
 * Responsible for generating the scoreboard
 */
class Scoreboard {
	// Should be stored in secret manager or behind a backend
	static API_KEY = 'mott';
	static URL = `https://snake.howbout.app/api/${Scoreboard.API_KEY}/high-scores`;

	#records = [];

	constructor(game) {
		this.game = game;

		this.scoreboardEl = document.querySelector('#scoreboard>table');
		this.nameFormEl = document.querySelector('#name-form');
		this.nameInputEl = document.querySelector('#name-input');
		this.submitAreaEl = document.querySelector('#submit-score');
		this.thankYouEl = document.querySelector('#thank-you');
		this.tryAgainEl = document.querySelector('#try-again');
		this.errorEl = document.querySelector('#error>h3');


		this.retrieveRecords().then((retrievedRecords) => {
			this.records = retrievedRecords;
		}).catch(err => {
			this.scoreboardEl.textContent = err;
		})

		this.nameFormEl.addEventListener("submit", (evt) => {
			evt.preventDefault();
			let nameValue = this.nameInputEl.value;
			let scoreValue = this.game.score;

			let record = this.constructRecord(nameValue, scoreValue);

			// when name for scoreboard is submitted
			this.submitRecord(record).then(() => {
				this.retrieveRecords().then((retrievedRecords) => {
					this.records = retrievedRecords;
				}).catch(err => {
					this.scoreboardEl.textContent = err;
				})

				this.submitAreaEl.classList.add('hidden');
				this.thankYouEl.classList.remove('hidden');

			}).catch(err => {
				this.submitAreaEl.classList.add('hidden');
				this.errorEl.textContent = `${err} Want to play again?`;
			})

		}, true);
	}
	/**
	 * records getter
	 */
	get records() {
		return this.#records;
	}
	/**
	 * records setter to ensure scoreboard DOM is always up to date
	 */
	set records(newRecords) {
		this.#records = newRecords;
		this.buildScoreboard(newRecords);
	}

	/**
	 * Ensures that scoreboard is in correct state after restart
	 */
	resetVisibility() {
		if (this.records.length === 0) {
			this.retrieveRecords().then((retrievedRecords) => {
				this.records = retrievedRecords;
			}).catch(err => {
				this.scoreboardEl.textContent = err;
			})
		}

		this.thankYouEl.classList.add('hidden');
		this.errorEl.textContent = "";

		if (this.game.score === 0) {
			this.tryAgainEl.classList.remove('hidden');
			this.submitAreaEl.classList.add('hidden');
		} else {
			this.submitAreaEl.classList.remove('hidden');
			this.tryAgainEl.classList.add('hidden');
		}
	}

	constructRecord(name, score) {
		return { name, score };
	}

	/**
	 * Submit name and score to API
	 */
	async submitRecord(record) {
		// try block manages no internet connection
		try {
			const res = await fetch(Scoreboard.URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(record),
			})
			// res check manages incorrect (non-2xx) API response
			if (!res.ok) {
				return Promise.reject("Scoreboard could not be accessed.");
			}
		} catch (error) {
			return Promise.reject("Internet connection unavailable.");
		}
	}

	/**
	 * Retrieves records from API
	 */
	async retrieveRecords() {
		try {
			const res = await fetch(Scoreboard.URL);
			if (res.ok) {
				const records = await res.json();
				return records.sort((a, b) => b.score - a.score).slice(0, 50);
			} else {
				return Promise.reject("Scoreboard could not be accessed.");
			}
		} catch (error) {
			return Promise.reject("Internet connection unavailable.");
		}
	}

	/**
	 * Build and load the scoreboard
	 */
	buildScoreboard(records) {

		const generateHeadRow = () => {
			const row = document.createElement('tr');
			const headings = ['Score', 'Name', 'Date']
			const classes = ['score-header', 'name-header', 'date-header']

			for (const [i, heading] of headings.entries()) {
				let th = document.createElement('th');
				th.innerHTML = `<u>${heading}</u>`;
				th.classList.add(classes[i])
				row.appendChild(th);
			}

			return row;
		}

		const generateScoreRow = (record) => {
			const row = document.createElement('tr');
			const props = ['score', 'name', 'created_at']

			for (const prop of props) {
				let td = document.createElement('td');
				if (prop === 'created_at') {
					td.textContent = new Date(record[prop]).toLocaleDateString();
				} else if (prop === 'name') {
					td.classList.add('limit');
					td.textContent = record[prop];
				} else {
					td.textContent = record[prop];
				}
				row.appendChild(td);
			}

			return row;
		}

		// Clear all elements to refresh scoreboard
		this.scoreboardEl.replaceChildren();

		const headRow = generateHeadRow();
		this.scoreboardEl.appendChild(headRow);

		if (records.length) {
			for (const record of records) {
				const el = generateScoreRow(record);
				this.scoreboardEl.appendChild(el);
			}
		}

	}
}
