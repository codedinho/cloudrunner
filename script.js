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


let playerLives = 3; // Initial lives
let isGameStarted = false; // Flag to track game status
let currentLevel = 1; // Initial level
let raindropInterval = 135; // Initial raindrop interval in milliseconds
let isRainFalling = false;
let isGameOver = false; // Flag to track game over state
let isInvincible = false;
let isDoggyLife = false;

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

// Function to start the game
function startGame() {
    isGameStarted = true; // Flag to track game status
    isRainFalling = true;
    // Hide the start game box
    startGameBox.style.display = 'none';
    // Add your game initialization logic here

    // Start increasing the level every 25 seconds
    levelIncreaseInterval = setInterval(increaseLevel, 20000); // 20 seconds in milliseconds
}

function increaseLevel() {
    currentLevel++;
    // Decrease the raindrop interval slightly (adjust this value as needed)
    if (raindropInterval > 25) {
        raindropInterval -= 15; // Decrease the raindrop interval by 15 milliseconds
    }
    updateLevelDisplay();

    // Add a console.log statement to check if the function is called
    console.log('Level increased to', currentLevel);
}


// Function to display the current level
function updateLevelDisplay() {
    const levelDisplay = document.querySelector('.level-display');
    levelDisplay.textContent = `Level: ${currentLevel}`;
}

// Event listener for the "Start Game" button
startButton.addEventListener('click', startGame);

// Show the start game box initially
startGameBox.style.display = 'block';


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
    // Clear the level increase interval when the game is over
    clearInterval(levelIncreaseInterval);
}

// Function to hide the game over screen
function hideGameOverScreen() {
    gameOverBox.style.display = 'none';
}

// Function to reset the player's position
function resetPlayerPosition() {
    playerX = gameContainer.clientWidth / 2; // Set the default starting position
}

function resetGame() {
    playerLives = 3; // Reset player lives
    updateHearts(); // Update heart icons
    currentLevel = 1; // Reset level
    updateLevelDisplay(); // Update level display
    isGameOver = false;

    revertDoggyLifeAbility();

    // Reset player position
    resetPlayerPosition();

    // Clear key states
    clearKeyStates();
    // Reset player state to 'neutral'
    updatePlayerState('neutral');

    currentHealth = maxHealth; // Reset current health to max health

    // Reset the health bar width to its initial state
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;

    // Reset clickedAbilities object
    clickedAbilities = {
        freeze: false,
        sunny: false,
        umbrella: false,
        'doggy-life': false,
    };

    // Clear the power boxes of all icons
    clearPowerBoxes();

    // Reset any other game-specific variables and elements here
    isGameStarted = true;
    isRainFalling = true;
    isDoggyLife = false;
    isInvincible = false;
    hideGameOverScreen(); // Hide the game over screen
    startGame(); // Start a new game
}



// Event listener for the "Play Again" button
playAgainButton.addEventListener('click', resetGame);

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


const healthBar = document.querySelector('.health-fill');
const maxHealth = 100; // Adjust the maximum health as needed
let currentHealth = maxHealth; // Initialize current health to max

function decreaseHealth(amount) {
    if (!isInvincible && !isDoggyLife) {
        currentHealth -= amount;
        if (currentHealth < 0) {
            currentHealth = 0;
        }
    }
    // Update the health bar width instantly
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;
}


// Function to decrease health over time
function decreaseHealthOverTime() {
    const decreaseAmount = 1; // Adjust the amount to control the rate of decrease
    
    if (isGameStarted && currentHealth > 0) {
        decreaseHealth(decreaseAmount);
    } else if (currentHealth <= 0) {
        // Player has no health left, you can handle game over logic here
    }
}


// Call decreaseHealthOverTime at regular intervals to gradually decrease health
setInterval(decreaseHealthOverTime, 1000); // Decrease health every 1 second (adjust the interval as needed)

function handlePowerUpCollision(raindrop) {
    // Check if the game is over
    if (isGameOver) {
        return;
    }

    if (!raindrop.classList.contains('random-ability')) {
        // Increase player lives by 50%
        const increaseAmount = Math.ceil(currentHealth * 0.5);

        // Update the health bar
        currentHealth += increaseAmount;

        // Ensure the currentHealth does not exceed the maxHealth
        if (currentHealth > maxHealth) {
            currentHealth = maxHealth;
        }

        // Update the health bar width
        const healthPercentage = (currentHealth / maxHealth) * 100;
        healthBar.style.width = `${healthPercentage}%`;
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
        isRainFalling = true; // Resume raindrop falling after 3 seconds
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
        updatePlayerState('happy');
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
        currentHealth -= 20;
        raindrop.remove();
        updatePlayerState('angry');
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
        currentHealth -= 20;
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

let specialItemsEnabled = false; // Initialize to false

// Initial player position update
updatePlayerPosition();

function createRaindrop() {
    if (isRainFalling) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        gameContainer.appendChild(raindrop);

        // Randomly decide if it's a raindrop or a special item
        const isPower = Math.random() < 0.1; // 10% chance for power.png
        const isHealth = Math.random() < 0.0025; // 10% chance for power.png
        const isAcidRain = Math.random() < 0.02; // 10% chance for power.png
        const isRandomAbility = Math.random() < 0.5; // 10% chance for power.png
        const isTrapPower = Math.random() < 0.02; // 10% chance for power.png

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

// Start regular raindrops falling for the first 5 seconds
setTimeout(() => {
    specialItemsEnabled = true; // Enable special items after 5 seconds
}, 5000);

// Call createRaindrop at regular intervals to simulate rainfall with the updated interval
setInterval(createRaindrop, raindropInterval);
