# Plan
## Checklist
- [x] Add Docker support
- [x] Implement basic test library
- [ ] Reset function to reset classes and HTML for testing
- [ ] Test existing code
- [x] Implement Snake body movement
- [x] Implement Snake tail creation and movement
- [x] Implement Food generation
- [x] Implement collision detection
  - [x] Wall
  - [x] Tail
  - [x] Food
- [x] Implement scoreboard score submission
  - [x] Don't allow 0 score submission
  - [x] Don't allow no name submission
  - [x] Handle API not reachable
- [x] Implement scoreboard view
  - [x] Handle API not reachable
  - [x] Handle API returns nothing
- [x] Design Howbout-like interface around game
- [ ] Scale emojis with varying size board grid
- [x] Queue 2 moves to ensure accurate input
- [ ] Add Space keyboard shortcut to pause and play
- [ ] Decide on collision based on current snake or next snake
- [ ] Plan end-to-end tests

## Test Plan
### Existing Code
- [ ] Correct methods exist and correct types returned
  - [ ] SnakeGame
  - [ ] Snake
  - [ ] Food
- [ ] SnakeGame initBoard creates correct amount of divs as static props
- [ ] SnakeGame score increase variable check
- [ ] All SnakeGame method DOM checks(?)
### New Code
- [ ] Snake hitting wall will end game
- [ ] Snake hitting self will end game
- [ ] Snake hitting food will speed up, add length and add score
- [ ] WASD/Up/Down/Left/Right trigger correct directions
- [ ] Triggering the same direction or opposite should have no effect
- [ ] Ending the game triggers scoreboard submission
- [ ] Scoreboard submission leads to scoreboard view regardless as to successful submission
- [ ] Game can be restart without any side effects