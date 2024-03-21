<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Treasure Hunter Game</title>
<style>
  /* Add CSS styles for grid cells, buttons, and message display */
  #gameContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  #gridContainer {
    display: grid;
    grid-template-columns: repeat(10, 50px);
    grid-template-rows: repeat(10, 50px);
    gap: 2px;
    border: 2px solid black;
    margin-bottom: 10px;
  }
  .gridCell {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer; /* Add cursor pointer for better UX */
  }

  #statusContainer {
    margin-bottom: 10px;
  }

  #errorMessage {
    color: red;
  }
</style>
</head>
<body>
<div id="gameContainer">
  <div id="gridContainer">
    <!-- The grid will be dynamically generated here -->
  </div>
  <div id="statusContainer">
    <!-- Status information and message display -->
    <p id="statusInfo"></p>
    <p id="errorMessage"></p>
  </div>
  <div id="buttonContainer">
    <!-- Buttons for setup, play, and end stages -->
    <button id="startSetupButton">Start Setup</button>
    <button id="endSetupButton" style="display: none;">End Setup</button>
    <button id="startPlayButton" style="display: none;">Start Play</button>
    <button id="endButton" style="display: none;">End Game</button>
  </div>
</div>

<script>
  // JavaScript code for the game
  // Constants
  const GRID_SIZE = 10;
  const DIRECTIONS = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's'
  };

  // Game state
  let gameState = {
    stage: 'setup',
    round: 0,
    treasuresRemaining: {
      5: 0,
      6: 0,
      7: 0,
      8: 0
    },
    score: 0,
    treasureHunterPosition: null,
    grid: [],
    obstacles: [],
    treasurePositions: []
  };

  // Initialize the game
  document.getElementById('startSetupButton').addEventListener('click', setupStage);

  // Functions for managing game stages
  function setupStage() {
    gameState.stage = 'setup';
    gameState.grid = initializeGrid();
    displayGrid();
    document.getElementById('startSetupButton').style.display = 'none';
    document.getElementById('endSetupButton').style.display = 'block';
    document.getElementById('endSetupButton').addEventListener('click', endSetupStage);
    document.getElementById('gridContainer').addEventListener('click', handleGridClick);
  }

  function endSetupStage() {
    if (!gameState.treasureHunterPosition) {
      displayMessage('Error: Treasure hunter not placed.');
      return;
    }
    gameState.stage = 'play';
    gameState.round = 1; // Start from round 1
    displayGrid();
    document.getElementById('endSetupButton').style.display = 'none';
    document.getElementById('startPlayButton').style.display = 'block';
    document.getElementById('startPlayButton').addEventListener('click', startPlayStage);
    document.removeEventListener('click', handleGridClick); // Remove click event listener for setup stage
  }

  function startPlayStage() {
    gameState.stage = 'play';
    document.getElementById('startPlayButton').style.display = 'none';
    document.getElementById('endButton').style.display = 'block';
    document.getElementById('endButton').addEventListener('click', endStage);
    document.addEventListener('keydown', handleKeyDown);
    updateStatus();
  }

  function endStage() {
    gameState.stage = 'end';
    const performanceIndex = (gameState.round > 0) ? (gameState.score / gameState.round).toFixed(2) : 0;
    displayMessage(`Performance Index: ${performanceIndex}`);
    document.getElementById('endButton').style.display = 'none';
  }

  // Helper functions
  function initializeGrid() {
    const grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push('empty');
      }
      grid.push(row);
    }
    return grid;
  }

  function displayGrid() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    gameState.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'gridCell';
        cellElement.textContent = ''; // Remove this line after adding logic for displaying objects
        cellElement.setAttribute('data-row', rowIndex);
        cellElement.setAttribute('data-col', colIndex);
        gridContainer.appendChild(cellElement);
      });
    });
  }

  function displayMessage(message) {
    document.getElementById('errorMessage').textContent = message;
  }

  function handleGridClick(event) {
    const target = event.target;
    if (!target.classList.contains('gridCell')) return; // Clicked outside grid cells
    const row = parseInt(target.getAttribute('data-row'));
    const col = parseInt(target.getAttribute('data-col'));
    if (gameState.grid[row][col] === 'empty') {
      const objectType = prompt('Enter object type (treasure value, "o" for obstacle, "h" for treasure hunter):');
      if (objectType === null) return; // User cancelled prompt
      switch (objectType.toLowerCase()) {
        case 'o':
          gameState.grid[row][col] = 'obstacle';
          break;
        case 'h':
          if (!gameState.treasureHunterPosition) {
            gameState.grid[row][col] = 'treasureHunter';
            gameState.treasureHunterPosition = [row, col];
          } else {
            alert('Error: Treasure hunter already placed.');
          }
          break;
        default:
          const treasureValue = parseInt(objectType);
          if (!isNaN(treasureValue) && treasureValue >= 5 && treasureValue <= 8) {
            gameState.grid[row][col] = 'treasure';
            gameState.treasurePositions.push([row, col]);
            gameState.treasuresRemaining[treasureValue]++;
          } else {
            alert('Error: Invalid input. Please enter "o" for obstacle, "h" for treasure hunter, or a number between 5 and 8 for treasure value.');
         
        }
          break;
      }
      displayGrid();
    }
  }

  function updateStatus() {
    const treasuresRemaining = Object.keys(gameState.treasuresRemaining).map(key => {
      return `Value ${key}: ${gameState.treasuresRemaining[key]}`;
    }).join(', ');
    document.getElementById('statusInfo').textContent = `Round: ${gameState.round}, Treasures Remaining: ${treasuresRemaining}, Score: ${gameState.score}`;
  }

  function handleKeyDown(event) {
    // Handle key presses during the play stage
    const keyPressed = event.key.toLowerCase();
    if (Object.values(DIRECTIONS).includes(keyPressed)) {
      // Handle movement logic
    }
  }
</script>
</body>
</html>
