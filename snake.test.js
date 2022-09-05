const params = new URLSearchParams(window.location.search)
const testing = params.has('test')

let testsPassed = 0
let testsFailed = 0

const greenText = '\x1b[32m%s\x1b[0m'
const redText = '\x1b[31m%s\x1b[0m'
const tickIcon = '\u2714'
const crossIcon = '\u2718'

function it(desc, fn) {
  try {
    fn();
    testsPassed += 1
    console.log(greenText, `${tickIcon} ${desc}`);
  } catch (error) {
    testsFailed += 1
    console.log(redText, `${crossIcon} ${desc}`);
    console.error(error);
  }
}

function assert(condition) {
  if (!condition) {
    throw new Error();
  }
}

function complete(){
  const testsTotal = testsPassed + testsFailed;
  if(testsTotal === 0){
    console.log(redText, "0 TESTS FOUND!")
  }else if(testsPassed === testsTotal){
    console.log(greenText, `ALL ${testsPassed} TESTS PASSED!`)
  }else{
    console.log(redText, `${testsFailed}/${testsTotal} TESTS FAILED!`)
  }
}


if(testing){
  /**
   * Testing Setup
   */
  console.log("Testing beginning...")

  // const board = document.getElementById('board');
  // const controls = document.getElementById('controls');
  board.style.display = 'none';
  controls.style.display = 'none';

  // const game = new SnakeGame(board, controls);

  /**
   * Tests
   */
  it("initiates the game score to 0.", ()=>{
    assert(game.score === 0)
  })

  /**
   * Testing Cleanup
   */
  complete()
  console.log("Testing complete.")
}



