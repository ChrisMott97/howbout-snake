# Howbout... a game of Snake?

## Challenge
Snake should e implemented in HTML, JavaScript and CSS based on the partial implementation provided. Complete the creation of the game and implement the High Scores feature.
## Rules
- Must only be completed using raw JavaScript, HTML and CSS with no external libraries
- Must work in the latest version of Google Chrome
- Try not to change existing source code
- HTTP requests use JSON
- User controls snake around game board
- Snake is in continuous motion and can change direction using arrow keys
- Eating an apple will increase the user's score, length and speed
- Eating an apple will generate a new apple
- If the snake hits its own tail, or the edge of the board, the game is over
## Usage
### User

### Developer

## API Contract
- **Base URL** `https://snake.howbout.app/api/{your api key}`
- **Get** `/high-scores`
  - Returns all the high score entries (ordered by creation date)
  - **Parameters** `None`
  - **Response**
    ```json
    [
      {
          "name": "Duncan",
          "score": 53,
          "created_at": "2022-01-26T15:46:32.000000Z"
      },
      {
          "name": "Calum",
          "score": 2,
          "created_at": "2022-01-27T06:28:51.000000Z"
      }
    ]
    ```
- **Post** `/high-scores`
  - Adds a new high score entry
  - **Parameters**
    ```json
    {
      "name": "John",
      "score": 23
    }
    ```
  - **Response** `Status: 201 Created`

## Design Notes
- Main logo colour `#00b5a9`
- Icon colour gradient `#00b5a9` bottom to `#00e0d1` top

## Future Features
- [ ] Food type that reduces grid size for x moves
- [ ] Food type that increases or decreases speed for x moves
- [ ] Food type that opens borders for x moves