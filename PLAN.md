# Plan
## Checklist
- [x] Add Docker support
- [x] Implement basic test library
- [ ] Reset function to reset classes and HTML for testing
- [ ] Test existing code
- [ ] Implement Snake body movement
- [ ] Implement Snake tail creation and movement
- [ ] Implement Food generation
- [ ] Implement collision detection
  - [ ] Wall
  - [ ] Tail
  - [ ] Food
- [ ] Implement scoreboard score submission
- [ ] Implement scoreboard view
- [ ] Design Howbout-like interface around game
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