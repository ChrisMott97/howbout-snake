const params = new URLSearchParams(window.location.search);
const testing = params.has('test');

let testsPassed = 0;
let testsFailed = 0;

const tickIcon = '\u2714';
const crossIcon = '\u2718';

function it(desc, fn) {
  try {
    console.log(`%cRunning test: ${desc}`, 'color: blue');
    fn();
    testsPassed += 1;
    console.log(`%c${tickIcon} ${desc}`, 'color: green');
  } catch (error) {
    testsFailed += 1;
    console.log(`%c${crossIcon} ${desc}`, 'color: red');
    console.error(error);
  }
}

function assert(condition) {
  if (!condition) {
    throw new Error();
  }
}

function complete() {
  const testsTotal = testsPassed + testsFailed;
  if (testsTotal === 0) {
    console.log('%c0 TESTS FOUND!', 'color: red');
  } else if (testsPassed === testsTotal) {
    console.log(`%cALL ${testsPassed} TESTS PASSED!`, 'color: green');
  } else {
    console.log(`%c${testsFailed}/${testsTotal} TESTS FAILED!`, 'color: red');
  }
}

if (testing) {
  /**
   * Testing Setup
   */
  console.group('Testing beginning...');

  /**
   * Tests
   */
  it('initiates the game score to 0.', () => {
    assert(game.score === 0);
  });

  it('shows where the start position is.', () => {
    assert(game.snake.tail[0].textContent);
  });

  it('creates div grid of correct size.', () => {
    const rows = game.boardEl.childElementCount - 1;
    const { lastChild } = game.boardEl;
    const cols = lastChild.childElementCount;
    const correctRows = rows === SnakeGame.NUM_ROWS;
    const correctCols = cols === SnakeGame.NUM_COLS;
    assert(correctRows && correctCols);
  });

  it('sets the score in DOM when score variable is set.', () => {
    game.score = 10;
    assert(game.scoreEl.textContent == 10);
  });

  it('keeps board variable and element in sync.', () => {
    assert(game.board[1][1] === document.querySelector('.row-1 .col-1'));
  });

  it('increases score by 1 by default.', () => {
    const oldScore = game.score;
    game.increaseScore();
    const newScore = game.score;
    assert(newScore === oldScore + 1);
  });

  it('increases score by more if specified.', () => {
    const oldScore = game.score;
    game.increaseScore(5);
    const newScore = game.score;
    assert(newScore === oldScore + 5);
  });

  it('resets score to 0.', () => {
    game.score = 50;
    const oldScore = game.score;
    game.resetScore();
    assert(oldScore === 50 && game.score === 0);
  });

  it('keeps the emoji list up to date with the head emoji.', () => {
    game.snake.headEmoji = '🤯';
    assert(game.snake.tailEmojis[0] === '🤯');
  });

  it('adds one to score when friend hit with snake.', () => {
    game.resetScore();

    const { x } = game.snake.position;
    const y = game.snake.position.y - 1;
    game.snake.setDirection('up');

    game.friend.move(x, y);
    game.snake.move();
    game.snake.pause();

    assert(game.score === 1);
  });

  it('increases speed when friend hit with snake.', () => {
    game.gameOver();
    game.restart();
    game.snake.pause();

    const oldSpeed = game.snake.speed;

    const { x } = game.snake.position;
    const y = game.snake.position.y - 1;
    game.snake.setDirection('up');

    game.friend.move(x, y);
    game.snake.move();
    game.snake.pause();

    const newSpeed = game.snake.speed;

    assert(newSpeed < oldSpeed);
  });

  it('increases tail length when friend hit with snake.', () => {
    game.gameOver();
    game.restart();
    game.snake.pause();

    const oldLength = game.snake.tailLength;

    const { x } = game.snake.position;
    const y = game.snake.position.y - 1;
    game.snake.setDirection('up');

    game.friend.move(x, y);
    game.snake.move();
    game.snake.pause();

    const newLength = game.snake.tailLength;

    assert(oldLength + 1 === newLength);
  });

  /**
   * Testing Cleanup
   */
  game.gameOver();
  game.restart();
  game.snake.pause();

  complete();
  console.groupEnd();
}
