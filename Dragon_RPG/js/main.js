// Variables declaration and initialization
let xp = 0; // Experience points
let health = 100; // Current health
let gold = 50; // Gold or coins collected
let currentWeapon = 0; // Index of the currently equipped weapon
let fighting; // Variable to track if the player is fighting
let monsterHealth; // Health of the montser the player is fighting
let inventory = ["stick"]; // Items currently in the player's inventory

// Selecting HTML elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Array of weapons with their properties
const weapons = [
    {
        name: "stick",
        power: 5,
    },
    {
        name: "dagger",
        power: 30,
    },
    {
        name: "claw hammer",
        power: 50,
    },
    {
        name: "sword",
        power: 100,
    },
];

// Array of monsters with their properties
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15,
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60,
    },
    {
        name: "dragon",
        level: 20,
        health: 300,
    },
];

// Array of locations with their properties
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: 'You are in the town square. You see a sign that says "Store".',
    },
    {
        name: "store",
        "button text": [
            "Buy 10 health (10 gold)",
            "Buy weapon (30 gold)",
            "Go to town square",
        ],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store.",
    },
    {
        name: "cave",
        "button text": [
            "Fight slime",
            "Fight fanged beast",
            "Go to town square",
        ],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters.",
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster.",
    },
    {
        name: "kill monster",
        "button text": [
            "Go to town square",
            "Go to town square",
            "Go to town square",
        ],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. ☠️",
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
    },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Function to update the current location
function update(location) {
    // Hide monster stats
    monsterStats.style.display = "none";
    // Update button texts and functions
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    // Update text
    text.innerHTML = location.text;
}

// Function to go to the town square
function goTown() {
    update(locations[0]);
}

// Function to go to the store
function goStore() {
    update(locations[1]);
}

// Function to go to the cave
function goCave() {
    update(locations[2]);
}

// Function to buy health in the store
function buyHealth() {
    // Check if the player has enough gold
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        // Update gold and health texts
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

// Function to buy a weapon in the store
function buyWeapon() {
    // Check if the player has enough gold and if they don't already have the most powerful weapon
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

// Function to sell a weapon in the store
function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

// Function to fight the slime
function fightSlime() {
    fighting = 0;
    goFight();
}

// Function to fight the fanged beast
function fightBeast() {
    fighting = 1;
    goFight();
}

// Function to fight the dragon
function fightDragon() {
    fighting = 2;
    goFight();
}

// Function to start fighting a monster
function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsters[fighting].health;
}

// Function to attack a monster
function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText +=
        " You attack it with your " + weapons[currentWeapon].name + ".";
    // Calculate damage to the player
    health -= getMonsterAttackValue(monsters[fighting].level);
    // Check if the monster was hit
    if (isMonsterHit()) {
        // Calculate damage to the monster
        monsterHealth -=
            weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " You miss.";
    }
    // Update health text
    healthText.innerText = health;
    // Update monster health text
    monsterHealthText.innerText = monsterHealth;
    // Check if the player's health is <= 0
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        // Check if the player defeated the dragon
        fighting === 2 ? winGame() : defeatMonster();
    }
    // Check if there's a chance the player's weapon will break
    if (Math.random() <= 0.1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}

// Function to calculate the attack value of a monster
function getMonsterAttackValue(level) {
    const hit = level * 5 - Math.floor(Math.random() * xp);
    console.log(hit);
    return hit > 0 ? hit : 0;
}

// Function to check if the monster was hit
function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

// Function to dodge a monster's attack
function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

// Function to handle losing the game
function lose() {
    update(locations[5]);
}

// Function to handle winning the game
function winGame() {
    update(locations[6]);
}

// Function to handle defeating a monster
function defeatMonster() {
    // Add gold and experience points
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    // Update gold and experience texts
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

// Function to restart the game
function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    // Update gold, health, and experience texts
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

// Function to handle the Easter egg
function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

// Function to pick a number for the Easter egg game
function pick(guess) {
    const numbers = [];
    // Generate 10 random numbers
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    // Display the 10 random numbers
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    // Check if the player's guess matches one of the random numbers
    if (numbers.includes(guess)) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}
