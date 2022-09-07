class SnakeGame {

    static NUM_ROWS = 20;
    static NUM_COLS = 20;
    static EMOJIS = ['🧒', '👩', '👵', '👨‍🦳', '👩‍🦰', '🧑‍🦰', '💂‍♀️', '👩‍🎤']
    
    board = [];
    #score = 0;

    constructor(boardEl, controlsEl) {
        this.boardEl = boardEl;
        this.controlsEl = controlsEl;

        this.scoreEl = document.querySelector('.score');
        this.scoreboard = document.querySelector('.scoreboard');
        this.nameForm = document.querySelector('#nameForm');
        this.nameInput = document.querySelector('#nameInput');

        this.nameForm.addEventListener("submit", function(evt) {
            evt.preventDefault();
        }, true);

        this.initBoard();
        this.refreshScoreboard();

        this.snake = new Snake(this);
        this.food = new Food(this);

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

    get score(){
        return this.#score;
    }

    set score(newScore){
        this.#score = newScore;
        this.scoreEl.textContent = newScore;
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
     * Build and load the scoreboard
     */
    refreshScoreboard() {

        const generateHeadRow = () => {
            const row = document.createElement('tr');
            const headings = ['Score', 'Name', 'Date']
            const ids = ['score', 'name', 'date']

            for (const [i, heading] of headings.entries()) {
                let th = document.createElement('th');
                th.innerHTML = `<u>${heading}</u>`;
                th.id = ids[i]
                row.appendChild(th);
            }

            return row;
        }

        const generateScoreRow = (record) => {
            const row = document.createElement('tr');
            const props = ['score', 'name', 'created_at']

            for (const prop of props) {
                let td = document.createElement('td');
                if(prop === 'created_at'){
                    td.innerHTML = new Date(record[prop]).toLocaleDateString();
                }else{
                    td.innerHTML = record[prop];
                }
                row.appendChild(td);
            }

            return row;
        }

        const scoreboard = document.querySelector('#scoreboard>table')

        // Clear all elements to refresh scoreboard
        scoreboard.replaceChildren();

        const headRow = generateHeadRow();
        scoreboard.appendChild(headRow);

        fetch("https://snake.howbout.app/api/mott/high-scores").then((res) => {
            if(res.ok){
                res.json().then((records)=>{
                    records = records.sort((a, b) => b.score - a.score);
                    for (const record of records) {
                        const el = generateScoreRow(record);
                        scoreboard.appendChild(el);
                    }
                })
            }
        })

    }

    /**
     * Begin the game
     */
    play() {

        this.controlsEl.classList.add('playing');

        this.snake.move();
        this.food.move();

    }

    /**
     * Restart the game after game over
     */
    restart() {

        this.snake.reset();
        this.food.reset();

        this.controlsEl.classList.remove('game-over');
        this.boardEl.classList.remove('game-over');

        this.resetScore();
        this.play();

    }

    getRandomEmoji() {
        return SnakeGame.EMOJIS[Math.floor(Math.random() * SnakeGame.EMOJIS.length)];
    }

    /**
     * End the game
     */
    async gameOver() {
        
        this.snake.pause();

        this.controlsEl.classList.remove('playing');
        this.controlsEl.classList.add('game-over');
        this.boardEl.classList.add('game-over');

    }

}

class Snake {

    static STARTING_EDGE_OFFSET = 6;

    constructor(game) {
        this.setDefaults();
        this.game = game;
        this.init();
    }

    setDefaults(){
        this.tail = [];
        this.tailSpecifics = [];
        this.tailLength = 2;
        this.directionQueue = [];
        this.directionQueueLength = 2
        this.direction = 'up';
        this.speed = 160;
        this.moving = false;
        this.headEmoji = "😎";
    }

    /**
     * Place the snake initially
     */
    init() {

        // check for uneven starting edge offset
        const x = Math.floor(Math.random() * (SnakeGame.NUM_COLS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
        const y = Math.floor(Math.random() * (SnakeGame.NUM_ROWS - Snake.STARTING_EDGE_OFFSET)) + (Snake.STARTING_EDGE_OFFSET / 2);
        this.position = { x, y };

        const startCell = this.game.board[y][x];
        startCell.classList.add('snake');

        this.tailSpecifics.push(this.headEmoji);

        for (let i = 0; i < this.tailLength - 1; i++) {
            this.tailSpecifics.push(this.game.getRandomEmoji());
        }
        
        this.tail.push(startCell);

        this.updateTail();

    }

    updateTail(){
        const reversedTailSpecifics = [...this.tailSpecifics].reverse()
        const partToRemove = this.tail[0]

        if(this.tail.length > this.tailLength){
            partToRemove.classList.remove('snake');
            partToRemove.innerText = "";
            this.tail.shift()
        }

        for (const [i, part] of this.tail.entries()) {
            part.innerText = reversedTailSpecifics[i]
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

        if(this.directionQueue.length > 0){
            this.direction = this.directionQueue[0]
            this.directionQueue.shift()
        }

        switch(this.direction){
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
        
        if(this.hasCollided()){
            this.game.gameOver();
            this.pause();
            return;
        }

        const {x,y} = this.position;
        const nextSnake = this.game.board[y][x];

        if(nextSnake === this.game.food.currentFood){
            this.upgrade()
            this.game.food.move()
        }

        nextSnake.classList.add('snake');
        this.tail.push(nextSnake);

        this.updateTail()

        // Move another step in `this.speed` number of milliseconds
        this.movementTimer = setTimeout(() => { this.move(); }, this.speed);

    }

    /**
     * Set the snake's direction
     */
    setDirection(direction) {
        const firstItemCheck = !(this.direction === this.reverseDirection(direction)) && !(this.direction === direction)
        const secondItemCheck = !(this.directionQueue[0] === this.reverseDirection(direction)) && !(this.directionQueue[0] === direction)
        switch(this.directionQueue.length){
            case 0:
                if(firstItemCheck){
                    this.directionQueue.push(direction);
                }
                break;
            case 1:
                if(secondItemCheck){
                    this.directionQueue.push(direction)
                }
                break;
            case 2:
                if(secondItemCheck){
                    this.directionQueue[1] = direction
                }
                break;
        }
        
    }

    upgrade(){
        this.game.increaseScore();
        this.speed -= 2;
        this.tailLength += 1;
        this.tailSpecifics.push(this.game.food.currentFood.innerText)
    }

    reverseDirection(direction){
        switch(direction){
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
        const {x,y} = this.position

        // Snake wall collision detection
        const rightCollide = x >= SnakeGame.NUM_COLS
        const leftCollide = x < 0
        const upCollide = y < 0
        const downCollide = y >= SnakeGame.NUM_ROWS

        if(upCollide || downCollide || rightCollide || leftCollide){
            return true;
        }

        // Snake tail collision detection
        const nextSnake = this.game.board[y][x]
        if(this.tail.includes(nextSnake)){
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
            tailPart.innerText = ""
        }

        this.setDefaults();
        this.init();

    }

}

class Food {

    constructor(game) {
        this.game = game;
        this.currentFood = null;
    }

    /**
     * Place the food randomly on the boardEl, by adding the class 'food' to one of the cells
     */
    move() {

        let invalidPosition = true;
        let nextFood;

        do {
            const x = Math.floor(Math.random() * SnakeGame.NUM_COLS);
            const y = Math.floor(Math.random() * SnakeGame.NUM_ROWS);
            nextFood = this.game.board[y][x];

            const snakeClash = nextFood.classList.contains('snake');
            const foodClash = nextFood.classList.contains('food');

            if(!snakeClash && !foodClash){
                invalidPosition = false;
            }

            if(snakeClash) console.log("Snake clash");
            if(foodClash) console.log("Food clash")

        } while (invalidPosition);

        nextFood.innerText = this.game.getRandomEmoji();

        if(this.currentFood){
            this.reset()
        }

        nextFood.classList.add('food');
        this.currentFood = nextFood;
    }

    reset(){
        this.currentFood.classList.remove('food');
        this.currentFood.innerText = "";
    }

}
