const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const playerSpeed = 2; // Adjust the player's movement speed
// Get references to the elements
const startGameBox = document.querySelector('.start-game-box');
const startButton = document.getElementById('start-button');
// Add these variables at the beginning of your script
const heartsContainer = document.querySelector('.hearts-container');
const hearts = document.querySelectorAll('.heart');
// Add these variables at the beginning of your script
const gameOverBox = document.querySelector('.game-over-box');
const playAgainButton = document.getElementById('play-again-button');

const abilities = ['freeze', 'sunny', 'umbrella', 'doggy-life'];

let wavesData = [];
let playerLives = 3; // Initial lives
let isGameStarted = false; // Flag to track game status
let isRainFalling = false;
let isGameOver = false; // Flag to track game over state
let isInvincible = false;
let isDoggyLife = false;
let currentWave = 1; // Initialize the current wave to 1
let waveData; // Store the current wave's data
let roundTimer; // Timer for each round
let roundDuration = 5000; // 20 seconds per round
let specialItemsEnabled = false; // Initialize to false
let raindropIntervalId;
let raindropInterval = 500;


// Add event listeners for all power boxes when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const powerBoxes = document.querySelectorAll('.power-box');
    powerBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const abilityClass = box.classList[1]; // Get the ability class from the button
            if (abilityClass) {
                // Trigger the ability
                executeAbilityByClass(abilityClass);
                
                // Remove the ability from the button
                box.classList.remove(abilityClass);
                box.innerHTML = ''; // Remove any child elements
            }
        });
    });
});

// Add these variables at the beginning of your script to track the clicked ability icons.
let clickedAbilities = {
    freeze: false,
    sunny: false,
    umbrella: false,
    'doggy-life': false,
};

function startGameWithWave(currentWave) {
    currentWave = 1; // Update the current wave to 1
    updateWaveData(currentWave); // Update the wave data

    console.log('Starting game with wave:', currentWave);
    console.log('currentWave:', currentWave);
    console.log('wavesData length:', wavesData.length);

    // Reset any game-specific variables and elements as needed for the new wave

    // Start regular raindrops falling for the first 5 seconds
    setTimeout(() => {
        specialItemsEnabled = true; // Enable special items after 5 seconds
    }, 5000);

    raindropInterval = 500;

    // Clear any existing intervals to prevent multiple intervals from running simultaneously
    clearInterval(raindropIntervalId);

    // Call createRaindrop at regular intervals to simulate rainfall with the updated interval
    raindropIntervalId = setInterval(createRaindrop, raindropInterval);
    
    console.log(raindropInterval)
}


function advanceToNextWave() {
    if (!isGameOver) {
    const nextWaveNumber = currentWave + 1;
    if (nextWaveNumber <= wavesData.length) {
        // Pause raindrops, display start wave message
        isRainFalling = false;
        setTimeout(() => {
            // Resume raindrops after the break
            startRound();
            console.log(raindropInterval)

        }, 5000); // Wait for 5 seconds before starting the 20-second wave
    } else {
        // All waves completed, handle game completion logic
    }
  }
}

// Event listener for the "Start Game" button
startButton.addEventListener('click', startGame);

// Show the start game box initially
startGameBox.style.display = 'block';

async function startGame() {
    // Reset the wave data to wave 1
    console.log("Start Game button clicked.");
    resetGame();
    resetWaveData();
    specialItemsEnabled = false;
    isGameOver = false;
    isGameStarted = true; // Flag to track game status
    isRainFalling = false; // Stop raindrops

    // Hide the start game box
    startGameBox.style.display = 'none';

    // Load wave data and start the game with the first wave
    try {
        await loadWaveData(); // Wait for wave data to load
        startRound(); // Start the first round
    } catch (error) {
        console.error(error);
        // Handle any errors that occur during wave data loading
    }
}


// Inside your script, add the following function to display the wave message:
function displayWaveMessage(message) {
    if (isGameStarted) {
        const waveMessageElement = document.querySelector('.wave-message');
        waveMessageElement.textContent = message;
        waveMessageElement.style.display = 'block';

        // Hide the message after a delay (e.g., 3 seconds)
        setTimeout(() => {
            waveMessageElement.style.display = 'none';
            startRain(); // Start the rain after hiding the message
        }, 5000); // Display the message for 5 seconds
    }
}

function startRound() {
    if (isGameStarted) {
    console.log("Entering startRound. Current wave:", currentWave, "Total waves:", wavesData.length);
    // Inside your startRound function, clear the existing interval:
    if (currentWave <= wavesData.length) {
        console.log("Starting round, setting isRainFalling to false");

        isRainFalling = false; // Stop raindrops initially in each round
        // Set up the round
        updateWaveData(currentWave);
        displayWaveMessage(`Wave ${currentWave}`); // Display the wave message for 5 seconds

        // Clear the previous round timer (if any)
        if (roundTimer) {
            clearTimeout(roundTimer);
        }

        // Update the raindropInterval based on the current wave's data
        raindropInterval = waveData.raindropInterval;

        roundTimer = setTimeout(() => {
            console.log("Round timer expired. Enabling rain after 5 seconds");

            // Round timer expired; progress to the next round or restart
            currentWave++;
            if (currentWave <= wavesData.length) {
                // Re-enable raindrops and move to the next round (20-second wave)
                advanceToNextWave(); // Call the function to advance to the next wave
                raindropInterval = waveData.raindropInterval;
            } else {
                // All waves completed, handle game completion logic
                handleGameCompletion();
            }
        }, roundDuration + 20000); // Add 5000 milliseconds (20 seconds) to roundDuration
    } else {
        console.log("Invalid currentWave:", currentWave, "wavesData length:", wavesData.length);
    }
  }
}


// Add a function to start the rain:
function startRain() {
    if (isGameStarted) {
        isRainFalling = true; // Start raindrops
        // Inside your startRain function:
        raindropIntervalId = setInterval(() => {
            if (isRainFalling) {
                createRaindrop(); // Create a raindrop
            }
        }, raindropInterval);
    }
}


function handleGameCompletion() {
    isGameOver = true; // Set the game over flag
    isRainFalling = false; // Stop raindrops
    clearInterval(raindropIntervalId); // Clear the raindrop interval

}


// Initialize player's position
let playerX = gameContainer.clientWidth / 2;
let isMovingLeft = false;
let isMovingRight = false;
let isSad = false; // Flag to track player's state

// Function to update the player's position
function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    requestAnimationFrame(updatePlayerPosition);
}

// Function to update player's state
function updatePlayerState(newState) {
    if (!isInvincible) {
        player.classList.remove('neutral', 'happy', 'sad', 'love', 'angry', 'worried', 'protected');
        player.classList.add(newState);
    } else {
        // If the player is invincible, set their state to 'umbrella'
        player.classList.remove('neutral', 'happy', 'sad', 'love', 'angry', 'worried');
        player.classList.add('protected'); // Change 'protected' to 'umbrella' if that's the intended class name
    }
}



// Event listener for keydown event to start movement
document.addEventListener('keydown', (event) => {
    if (isGameStarted) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            isMovingLeft = true;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            isMovingRight = true;
        }
    }
});

// Event listener for keyup event to stop movement
document.addEventListener('keyup', (event) => {
    if (isGameStarted) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            isMovingLeft = false;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            isMovingRight = false;
        }
    }
});


// Function to update heart icons based on player lives and doggy life state
function updateHearts() {
    for (let i = 0; i < hearts.length; i++) {
        if (i < playerLives) {
            if (isDoggyLife) {
                hearts[i].src = './assets/icons/gold-heart.png'; // Use gold hearts if doggy life is active
            } else {
                hearts[i].src = './assets/icons/heart-full.png'; // Use regular hearts if not in doggy life
            }
        } else {
            hearts[i].src = './assets/icons/heart-empty.png'; // Empty hearts for remaining slots
        }
    }
}


// Modify the code that sets isDoggyLife to update the heart icons
function executeDoggyLifeAbility() {
    isDoggyLife = true; // Use lowercase "true" here
    console.log('Doggy Life ability triggered');

    // Update heart icons
    updateHearts();
}



function revertDoggyLifeAbility() {
    isDoggyLife = false;
    // Update heart icons
    updateHearts();
}



function clearKeyStates() {
    isMovingLeft = false;
    isMovingRight = false;
}

function getRandomAbility() {
    const abilities = [
        'umbrella',
        'sunny',
        'freeze',
        'doggy-life'
    ];

    const randomIndex = Math.floor(Math.random() * abilities.length);
    return abilities[randomIndex];
}

// Function to show the game over screen
function showGameOverScreen() {
    gameOverBox.style.display = 'block';
}

// Function to hide the game over screen
function hideGameOverScreen() {
    gameOverBox.style.display = 'none';
}

// Function to reset the player's position
function resetPlayerPosition() {
    playerX = gameContainer.clientWidth / 2 - 20; // Set the default starting position
}

function resetGame() {
    // Reset all game-related variables and elements here
    playerLives = 3;
    updateHearts();
    isGameStarted = false;
    revertDoggyLifeAbility();
    resetPlayerPosition();
    resetWaveData();
    clearKeyStates();
    updatePlayerState('neutral');
    clickedAbilities = {
        freeze: false,
        sunny: false,
        umbrella: false,
        'doggy-life': false,
    };
    clearPowerBoxes();
    currentWave = 1;
    isGameStarted = false;
    isRainFalling = false;
    isDoggyLife = false;
    isInvincible = false;
    hideGameOverScreen();

    // Clear any existing intervals
    clearInterval(roundTimer);

    // Reset the player's position and state
    playerX = gameContainer.clientWidth / 2;
    updatePlayerState('neutral');

    // Reset the wave data and special items
    wavesData = [];
    specialItemsEnabled = false;

    // Hide any visible elements like game over box
    gameOverBox.style.display = 'none';

    currentWave = 1; // Reset the current wave to 1
    resetWaveData(); // Reset wave-specific data

    clearInterval(raindropIntervalId); // Clear the raindrop interval
}

playAgainButton.addEventListener('click', () => {
    location.reload(); // Refresh the page
});



function decreasePlayerLives() {
    // Check if the player is invincible before decreasing lives
    if (!isInvincible && !isDoggyLife) {
        playerLives--;

        // Check if the player has lost all lives
        if (playerLives === 0) {
            // Show game over screen
            isGameStarted = false; // Flag to track game status
            isRainFalling = false;
            isGameOver = true; // Set the game over flag
            showGameOverScreen();
        }

        updateHearts();
    }
}

function increasePlayerLives() {
    // Check if the player already has the maximum lives (3)
    if (playerLives < 3) {
        playerLives++;
        updateHearts();
    }
}

function handlePowerUpCollision(raindrop) {
    // Check if the game is over
    if (isGameOver) {
        return;
    }

    // Remove the raindrop
    raindrop.remove();
}

function clearPowerBoxes() {
    const powerBoxes = document.querySelectorAll('.power-box');
    powerBoxes.forEach(box => {
        box.innerHTML = ''; // Remove all child elements (icons)
        box.classList.remove('ability-icon'); // Remove the ability-icon class

        // Remove the click event listener
        const clonedBox = box.cloneNode(true);
        box.parentNode.replaceChild(clonedBox, box);
    });
}

// Function to execute the Freeze ability
function executeFreezeAbility() {
    console.log('Freeze ability triggered');
    isRainFalling = false; // Stop raindrops from falling
    setTimeout(() => {
        startRain(); // Resume raindrop falling after 3 seconds
        console.log('Freeze ability ended');
    }, 3000);
}

// Function to execute the Wipe ability
function executeSunnyAbility() {
    console.log('Wipe ability triggered');
    // Remove all raindrops from the game container
    const raindrops = document.querySelectorAll('.raindrop');
    raindrops.forEach(raindrop => {
        raindrop.remove();
    });
    console.log('Wipe ability ended');
}

// Function to execute the Umbrella ability
function executeUmbrellaAbility() {
    console.log('Umbrella ability triggered');
    // Make the character invincible for 10 seconds
    isInvincible = true;
    updatePlayerState('protected');
    setTimeout(() => {
        isInvincible = false; // Disable invincibility after 10 seconds
        console.log('Umbrella ability ended');
        updatePlayerState('neutral');
    }, 8000);
}

// Function to execute abilities based on their class
function executeAbilityByClass(abilityClass) {
    if (abilityClass === 'freeze') {
        executeFreezeAbility();
    } else if (abilityClass === 'sunny') {
        executeSunnyAbility();
    } else if (abilityClass === 'umbrella') {
        executeUmbrellaAbility();
    } else if (abilityClass === 'doggy-life') {
        executeDoggyLifeAbility();
    }
}

function handleRaindropCollision(raindrop) {
    if (raindrop.classList.contains('power-raindrop')) {
        try {
            updatePlayerState('happy');
            handlePowerUpCollision(raindrop); // Pass the raindrop element to handlePowerUpCollision
            // Revert to neutral after 2 seconds
            setTimeout(() => {
                updatePlayerState('neutral');
            }, 2000);
        } catch (error) {
            console.error('Error changing player state:', error);
        }
    } else if (raindrop.classList.contains('heart')) {
        // Collided with a heart, increase player lives
        updatePlayerState('love');
        setTimeout(() => {
            updatePlayerState('neutral');
        }, 2000);
        increasePlayerLives();
        // Remove the heart raindrop
        raindrop.remove();
    } else if (raindrop.classList.contains('acid-rain')) {
        // Collided with acid rain, decrease player lives
        updatePlayerState('sad');
        decreasePlayerLives();
        decreasePlayerLives();
        decreasePlayerLives();
        raindrop.remove();
        revertDoggyLifeAbility();
    } else if (raindrop.classList.contains('trap-power')) {
        decreasePlayerLives();
        raindrop.remove();
        updatePlayerState('angry');
        setTimeout(() => {
            updatePlayerState('neutral');
        }, 2000);
        revertDoggyLifeAbility();
    } else if (raindrop.classList.contains('random-ability')) {
        updatePlayerState('happy');
        // Get a random ability class
        const abilityClass = getRandomAbility();

        setTimeout(() => {
            updatePlayerState('neutral');
        }, 2000);

        // Find the leftmost empty power box
        const powerBoxes = document.querySelectorAll('.power-box');
        const emptyBox = Array.from(powerBoxes).find(box => !box.classList.contains('ability-icon'));

        if (emptyBox) {
            // Create an image element for the ability icon
            const icon = document.createElement('img');
            icon.src = `./assets/icons/${abilityClass}.png`; // Set the source to your ability icon path
            icon.alt = abilityClass; // Set alt text for accessibility

            // Append the icon to the empty power box
            emptyBox.appendChild(icon);
            emptyBox.classList.add('ability-icon', abilityClass);

            powerBoxes.forEach(box => {
                box.addEventListener('click', () => {
                    const abilityClass = box.classList[1]; // Get the ability class from the button
                    if (abilityClass) {
                        // Trigger the ability
                        executeAbilityByClass(abilityClass);
                        
                        // Remove the ability from the button
                        box.classList.remove(abilityClass);
                        box.innerHTML = ''; // Remove any child elements
                    }
                });
            });
        }
        raindrop.remove();
    } else if (!isSad) {
        isSad = true;
        updatePlayerState('sad');
        // Decrease player lives
        decreasePlayerLives();
        // Revert to neutral after 2 seconds
        revertDoggyLifeAbility();
        setTimeout(() => {
            isSad = false;
            updatePlayerState('neutral');
        }, 2000);   
    } 
}

// Call updateHearts to initialize the hearts display
updateHearts();
// Function to continuously update player's position based on key state
function movePlayer() {
    if (isGameStarted) {
        if (isMovingLeft) {
            playerX -= playerSpeed;
        } else if (isMovingRight) {
            playerX += playerSpeed;
        }

        // Ensure the player stays within the game container boundaries
        if (playerX < 0) {
            playerX = 0;
        } else if (playerX > gameContainer.clientWidth - player.clientWidth) {
            playerX = gameContainer.clientWidth - player.clientWidth;
        }

        // Check for collision with raindrops
        const playerRect = player.getBoundingClientRect();
        const raindrops = document.querySelectorAll('.raindrop');

        // Inside your code where you handle raindrop collision, pass the raindrop element
        raindrops.forEach((raindrop) => {
            const raindropRect = raindrop.getBoundingClientRect();

            // Calculate the center of the player and raindrop
            const playerCenterX = playerRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top + playerRect.height / 2;
            const raindropCenterX = raindropRect.left + raindropRect.width / 2;
            const raindropCenterY = raindropRect.top + raindropRect.height / 2;

            // Calculate the distance between centers
            const distance = Math.sqrt(
                (playerCenterX - raindropCenterX) ** 2 +
                (playerCenterY - raindropCenterY) ** 2
            );

            // Check if the distance is less than the sum of player and raindrop radii
            if (distance < playerRect.width / 2 + raindropRect.width / 2) {
                // Collision with raindrop
                handleRaindropCollision(raindrop);
                raindrop.remove();
            }
        });
        // Touch-based movement
        // Calculate the maximum x-coordinate for the player's position
        const maxX = window.innerWidth - player.clientWidth;

        // Touch event listener to handle player movement
        gameContainer.addEventListener('touchmove', (event) => {
            if (isGameStarted) {
                // Calculate the new x-coordinate based on touch position
                playerX = event.touches[0].clientX - player.clientWidth / 2;

                // Ensure the player stays within the screen boundaries
                if (playerX < 0) {
                    playerX = 0;
                } else if (playerX > maxX) {
                    playerX = maxX;
                }
            }
        });
    }

    requestAnimationFrame(movePlayer);
}


// Start the movement loop
movePlayer();

// Initial player position update
updatePlayerPosition();

// Function to update the current wave data based on the wave number
function updateWaveData(waveNumber) {
    waveData = wavesData.find(data => data.waveNumber === waveNumber);
}

function resetWaveData() {
    currentWave = 1; // Reset the current wave to 1

    // Check if wavesData is populated and contains data for wave 1
    if (wavesData && wavesData.length >= currentWave) {
        waveData = wavesData[currentWave - 1]; // Get wave data for wave 1
        raindropInterval = waveData.raindropInterval; // Set the raindrop interval for wave 1
        
    } else {
        // Handle the case where wavesData is not yet loaded or doesn't contain data for wave 1
        // You can set a default raindrop interval here if needed
        raindropInterval = 500; // Default interval value
    }
}

async function loadWaveData() {
    try {
        const response = await fetch('./assets/json/waves.json');
        if (!response.ok) {
            throw new Error('Failed to load wave data');
        }
        const data = await response.json();
        wavesData = data;

        console.log('Waves Data:', wavesData); // Add this line for debugging

        // Ensure wavesData is populated before starting the game
        startGameWithWave(1);
    } catch (error) {
        console.error(error);
    }
}

function createRaindrop() {
    if (isRainFalling && waveData) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        gameContainer.appendChild(raindrop);

        // Use the wave-specific raindrop interval
        const raindropInterval = waveData.raindropInterval;

        // Randomly decide if it's a raindrop or a special item based on wave data
        const isPower = Math.random() < waveData.specialItemProbabilities.power;
        const isHealth = Math.random() < waveData.specialItemProbabilities.health;
        const isAcidRain = Math.random() < waveData.specialItemProbabilities.acidRain;
        const isRandomAbility = Math.random() < waveData.specialItemProbabilities.randomAbility;
        const isTrapPower = Math.random() < waveData.specialItemProbabilities.trapPower;

        if (specialItemsEnabled) {
            if (isPower) {
                raindrop.classList.add('power-raindrop');
            } else if (isHealth) {
                raindrop.classList.add('heart');
            } else if (isAcidRain) {
                raindrop.classList.add('acid-rain');
            } else if (isRandomAbility) {
                raindrop.classList.add('random-ability');
            } else if (isTrapPower) {
                raindrop.classList.add('trap-power');
            }
        } else {
            // Only regular raindrops for the first 5 seconds
            raindrop.classList.add('raindrop');
        }

        // Randomly position the raindrop along the X-axis
        const randomX = Math.random() * (gameContainer.clientWidth - 20) + 1;
        raindrop.style.left = `${randomX}px`;

        raindrop.addEventListener('animationiteration', () => {
            // Remove the raindrop when it reaches the bottom
            raindrop.remove();
        });

        // Inside the createRaindrop function where you add the click event listener for power-up raindrops
        if (isPower) {
            raindrop.addEventListener('click', () => {
                handlePowerUpCollision(raindrop); // Pass the raindrop element
            });
        }
    }
}