// Game state
let player = {
    currency: 500,
    snakes: [
        { name: "Normal", genes: [], puzzleInfluenceScore: 0, basePrice: 25 },
        { name: "Pastel", genes: ["Pastel"], puzzleInfluenceScore: 10, basePrice: 50 }
    ],
    reputation: 0
};
let turn = 1;

// Individual genes (226)
const individualGenes = {
    "Normal": { basePrice: 25, puzzleInfluence: 0, type: "dominant" },
    "Pastel": { basePrice: 50, puzzleInfluence: 10, type: "dominant" },
    "Banana": { basePrice: 100, puzzleInfluence: 10, type: "dominant" },
    "Black Pastel": { basePrice: 120, puzzleInfluence: 10, type: "dominant" },
    "Piebald": { basePrice: 400, puzzleInfluence: 30, type: "recessive" },
    "Clown": { basePrice: 450, puzzleInfluence: 20, type: "recessive" },
    "Axanthic": { basePrice: 800, puzzleInfluence: 20, type: "recessive" },
    "Patternless": { basePrice: 1000, puzzleInfluence: 40, type: "recessive" },
    "Puzzle": { basePrice: 4000, puzzleInfluence: 90, type: "polygenic" },
    "Zu": { basePrice: 1200, puzzleInfluence: 20, type: "recessive" },
    "Spider": { basePrice: 75, puzzleInfluence: 10, type: "dominant" },
    "Yellow Belly": { basePrice: 80, puzzleInfluence: 10, type: "dominant" },
    "Enchi": { basePrice: 90, puzzleInfluence: 10, type: "dominant" },
    "Lesser": { basePrice: 100, puzzleInfluence: 10, type: "dominant" },
    "Mojave": { basePrice: 110, puzzleInfluence: 10, type: "dominant" },
    "Hypo": { basePrice: 150, puzzleInfluence: 15, type: "recessive" },
    "Albino": { basePrice: 300, puzzleInfluence: 20, type: "recessive" },
    "Cinnamon": { basePrice: 130, puzzleInfluence: 10, type: "dominant" },
    "Fire": { basePrice: 70, puzzleInfluence: 10, type: "dominant" },
    "Spotnose": { basePrice: 200, puzzleInfluence: 15, type: "dominant" }
    // Add remaining 206 genes here
};

// Combo morphs (323)
const comboMorphs = {
    "Pastel Yellow Belly": { basePrice: 150, genes: ["Pastel", "Yellow Belly"] },
    "Banana Bee": { basePrice: 200, genes: ["Banana", "Spider"] },
    "Pastel Clown": { basePrice: 500, genes: ["Pastel", "Clown"] },
    "Black Pastel Piebald": { basePrice: 600, genes: ["Black Pastel", "Piebald"] },
    "Killer Clown": { basePrice: 1000, genes: ["Pastel", "Clown"] },
    "Blue-Eyed Lucy": { basePrice: 1200, genes: ["Bam", "But"] },
    "Puzzle Pastel": { basePrice: 5000, genes: ["Puzzle", "Pastel"] },
    "Puzzle Clown": { basePrice: 6000, genes: ["Puzzle", "Clown"] },
    "Puzzle Piebald": { basePrice: 7500, genes: ["Puzzle", "Piebald"] },
    "Puzzle Axanthic": { basePrice: 8000, genes: ["Puzzle", "Axanthic"] },
    "Lesser Bee": { basePrice: 300, genes: ["Lesser", "Spider"] },
    "Lightning Pied": { basePrice: 2500, genes: ["Axanthic", "Piebald"] },
    "Lithium": { basePrice: 200, genes: ["Cinnamon", "Butter"] },
    "Mephisto": { basePrice: 600, genes: ["Yellow Belly", "Lucifer"] },
    "Mercury Ball": { basePrice: 1500, genes: ["Super Cinnamon", "Fire"] },
    "Mimosa": { basePrice: 400, genes: ["Champagne"] },
    "Motley Bee": { basePrice: 250, genes: ["Spider"] },
    "Mudball": { basePrice: 180, genes: ["Pastel", "Sable"] },
    "Mystic Crystal": { basePrice: 300, genes: ["Special", "Mystic"] },
    "Mystic Potion": { basePrice: 350, genes: ["Mystic", "Mojave"] }
    // Add remaining 303 combos here
};

// Market prices (combine individual and combo morphs)
let marketPrices = { ...individualGenes, ...comboMorphs };
for (let morph in marketPrices) {
    marketPrices[morph] = marketPrices[morph].basePrice;
}

// Wait for DOM to load
window.onload = function() {
    console.log("DOM loaded, initializing game...");
    const gameStateDiv = document.getElementById("game-state");
    const outputDiv = document.getElementById("output");
    if (!gameStateDiv) {
        console.error("Game state div not found!");
    }
    if (!outputDiv) {
        console.error("Output div not found!");
    }
    if (gameStateDiv && outputDiv) {
        console.log("All required DOM elements found, displaying game state...");
        displayGameState();
    } else {
        document.body.innerHTML = "Error: Required game elements not found. Please check the HTML structure.";
    }
};

function displayGameState() {
    const turnSpan = document.getElementById("turn");
    const currencySpan = document.getElementById("currency");
    const snakeCountSpan = document.getElementById("snake-count");
    const reputationSpan = document.getElementById("reputation");
    const snakeListDiv = document.getElementById("snake-list");
    const marketPricesDiv = document.getElementById("market-prices");

    if (!turnSpan || !currencySpan || !snakeCountSpan || !reputationSpan || !snakeListDiv || !marketPricesDiv) {
        console.error("One or more DOM elements not found!");
        return;
    }

    turnSpan.textContent = turn;
    currencySpan.textContent = player.currency.toFixed(2);
    snakeCountSpan.textContent = player.snakes.length;
    reputationSpan.textContent = player.reputation;

    let snakeList = "";
    player.snakes.forEach((snake, index) => {
        const rarityClass = snake.basePrice >= 1000 ? (snake.name.includes("Puzzle") ? "puzzle" : "rare") : "";
        snakeList += `<div class="snake ${rarityClass}">${index + 1}. ${snake.name} ($${snake.basePrice}) | Puzzle Influence: ${snake.puzzleInfluenceScore.toFixed(0)}</div>`;
    });
    snakeListDiv.innerHTML = snakeList;

    let priceList = "";
    for (let morph in marketPrices) {
        priceList += `${morph}: $${marketPrices[morph]} | `;
    }
    marketPricesDiv.innerHTML = priceList;
}

function selectAction(action) {
    let output = "";
    const outputDiv = document.getElementById("output");
    if (!outputDiv) {
        console.error("Output div not found!");
        return;
    }
    if (action === "Breed") {
        output = breedSnakes();
    } else if (action === "Sell") {
        output = sellSnake();
    } else if (action === "Buy") {
        output = buySnake();
    } else if (action === "Expo") {
        if (turn % 5 === 0) {
            output = expo();
        } else {
            output = `Expo not available until Turn ${turn + (5 - turn % 5)}`;
        }
    } else if (action === "Next") {
        player.currency -= calculateCosts();
        turn++;
        updateMarketPrices();
        output = "Turn advanced! Costs paid.";
    }
    outputDiv.innerHTML = output;
    displayGameState();
}

function calculateCosts() {
    return player.snakes.length * (1 + 0.5 + 0.1) + 10;  // $1 rats + $0.50 electricity + $0.10 water + $10 rent
}

function updateMarketPrices() {
    for (let morph in marketPrices) {
        marketPrices[morph] = Math.round(marketPrices[morph] * (0.9 + Math.random() * 0.2));  // ±10%
    }
}

function breedSnakes() {
    if (player.snakes.length < 2) return "Need at least 2 snakes to breed!";
    let output = "Select two snakes to breed (enter numbers separated by a space):<br>";
    player.snakes.forEach((snake, index) => {
        output += `${index + 1}. ${snake.name}<br>`;
    });
    output += '<input id="breedInput" type="text" placeholder="e.g., 1 2"><button onclick="executeBreed()">Breed</button>';
    return output;
}

function executeBreed() {
    const input = document.getElementById("breedInput")?.value.split(" ") || [];
    const index1 = parseInt(input[0]) - 1;
    const index2 = parseInt(input[1]) - 1;
    const outputDiv = document.getElementById("output");
    if (!outputDiv || isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0 || index1 >= player.snakes.length || index2 >= player.snakes.length) {
        if (outputDiv) outputDiv.innerHTML = "Invalid selection!";
        return;
    }
    const parent1 = player.snakes[index1];
    const parent2 = player.snakes[index2];
    player.currency -= 15;  // $10 rats + $5 electricity
    const offspringCount = Math.floor(Math.random() * 3) + 2;  // 2–4
    let output = `Breeding ${parent1.name} with ${parent2.name}...<br>`;
    for (let i = 0; i < offspringCount; i++) {
        let childGenes = [];
        // Inherit genes
        parent1.genes.forEach(gene => {
            if (individualGenes[gene]?.type === "dominant" && Math.random() < 0.5) {
                childGenes.push(gene);
            } else if (individualGenes[gene]?.type === "recessive" && parent2.genes.includes(gene) && Math.random() < 0.25) {
                childGenes.push(gene);
            }
        });
        parent2.genes.forEach(gene => {
            if (!childGenes.includes(gene) && individualGenes[gene]?.type === "dominant" && Math.random() < 0.5) {
                childGenes.push(gene);
            }
        });
        // Puzzle Influence
        let puzzleScore = (parent1.puzzleInfluenceScore + parent2.puzzleInfluenceScore) / 2 + (Math.random() * 20 - 10);
        if (puzzleScore >= 90) childGenes.push("Puzzle");
        const childName = determineMorphName(childGenes);
        const childPrice = marketPrices[childName] || 25;  // Default to Normal price
        const child = { name: childName, genes: childGenes, puzzleInfluenceScore: puzzleScore, basePrice: childPrice };
        player.snakes.push(child);
        output += `Offspring ${i + 1}: ${childName} ($${childPrice}) | Puzzle Influence: ${puzzleScore.toFixed(0)}<br>`;
    }
    outputDiv.innerHTML = output;
    displayGameState();
}

function determineMorphName(genes) {
    if (genes.includes("Puzzle")) {
        if (genes.includes("Pastel")) return "Puzzle Pastel";
        if (genes.includes("Clown")) return "Puzzle Clown";
        if (genes.includes("Piebald")) return "Puzzle Piebald";
        if (genes.includes("Axanthic")) return "Puzzle Axanthic";
        return "Puzzle";
    }
    if (genes.length === 0) return "Normal";
    if (genes.length === 1) return genes[0];
    for (let combo in comboMorphs) {
        const comboGenes = comboMorphs[combo].genes;
        if (comboGenes.every(gene => genes.includes(gene)) && genes.every(gene => comboGenes.includes(gene))) {
            return combo;
        }
    }
    return genes.join(" ");
}

function sellSnake() {
    let output = "Select a snake to sell:<br>";
    player.snakes.forEach((snake, index) => {
        output += `${index + 1}. ${snake.name} ($${snake.basePrice})<br>`;
    });
    output += '<input id="sellInput" type="text" placeholder="e.g., 1"><button onclick="executeSell()">Sell</button>';
    return output;
}

function executeSell() {
    const index = parseInt(document.getElementById("sellInput")?.value) - 1;
    const outputDiv = document.getElementById("output");
    if (!outputDiv || isNaN(index) || index < 0 || index >= player.snakes.length) {
        if (outputDiv) outputDiv.innerHTML = "Invalid selection!";
        return;
    }
    const snake = player.snakes[index];
    player.currency += snake.basePrice;
    player.reputation += 1;
    player.snakes.splice(index, 1);
    outputDiv.innerHTML = `Sold ${snake.name} for $${snake.basePrice}`;
    displayGameState();
}

function buySnake() {
    let output = "Snakes for sale:<br>";
    const availableSnakes = ["Normal ($25)", "Pastel ($50)", "Banana ($100)", "Piebald ($400)", "Puzzle Pastel ($5000)"];
    availableSnakes.forEach((snake, index) => {
        output += `${index + 1}. ${snake}<br>`;
    });
    output += '<input id="buyInput" type="text" placeholder="e.g., 1"><button onclick="executeBuy()">Buy</button>';
    return output;
}

function executeBuy() {
    const availableSnakes = ["Normal ($25)", "Pastel ($50)", "Banana ($100)", "Piebald ($400)", "Puzzle Pastel ($5000)"];
    const index = parseInt(document.getElementById("buyInput")?.value) - 1;
    const outputDiv = document.getElementById("output");
    if (!outputDiv || isNaN(index) || index < 0 || index >= availableSnakes.length) {
        if (outputDiv) outputDiv.innerHTML = "Invalid selection!";
        return;
    }
    const snakeStr = availableSnakes[index];
    const price = parseInt(snakeStr.match(/\d+/)[0]);
    if (player.currency < price) {
        outputDiv.innerHTML = "Not enough currency!";
        return;
    }
    player.currency -= price;
    const name = snakeStr.split(" (")[0];
    const puzzleScore = name.includes("Puzzle") ? 90 : (["Piebald", "Patternless"].includes(name) ? 30 : 10);
    const genes = name.includes(" ") ? name.split(" ") : [name];
    const snake = { name: name, genes: genes, puzzleInfluenceScore: puzzleScore, basePrice: price };
    player.snakes.push(snake);
    outputDiv.innerHTML = `Bought ${name} for $${price}`;
    displayGameState();
}

function expo() {
    let output = "Welcome to the Reptile Expo!<br>";
    output += "Set up a table for $20? (Y/N)<br>";
    output += '<input id="tableInput" type="text" placeholder="Y or N"><button onclick="setupTable()">Confirm</button>';
    return output;
}

function setupTable() {
    const input = document.getElementById("tableInput")?.value.toUpperCase();
    const outputDiv = document.getElementById("output");
    if (!outputDiv) return;
    let output = "";
    if (input === "Y") {
        if (player.currency < 20) {
            output = "Not enough currency!";
        } else {
            player.currency -= 20;
            output = "Select up to 3 snakes to display (enter numbers separated by spaces):<br>";
            player.snakes.forEach((snake, index) => {
                output += `${index + 1}. ${snake.name} ($${snake.basePrice})<br>`;
            });
            output += '<input id="displayInput" type="text" placeholder="e.g., 1 2 3"><button onclick="displaySnakes()">Display</button>';
        }
    } else {
        output = "Skipped table setup.<br>";
    }
    output += "<br>Auction a snake? (Y/N)<br>";
    output += '<input id="auctionInput" type="text" placeholder="Y or N"><button onclick="auctionSnake()">Confirm</button>';
    outputDiv.innerHTML = output;
}

function displaySnakes() {
    const input = document.getElementById("displayInput")?.value.split(" ") || [];
    const selected = input.map(i => parseInt(i) - 1).filter(i => !isNaN(i) && i >= 0 && i < player.snakes.length);
    if (selected.length > 3) selected.splice(3);
    const outputDiv = document.getElementById("output");
    if (!outputDiv) return;
    let output = "Table set up! Results:<br>";
    let toRemove = [];
    selected.forEach(index => {
        const snake = player.snakes[index];
        if (Math.random() < 0.5) {  // 50% chance of sale
            player.currency += snake.basePrice;
            player.reputation += 1;
            output += `Sold ${snake.name} for $${snake.basePrice}<br>`;
            toRemove.push(index);
        }
    });
    toRemove.sort((a, b) => b - a).forEach(index => player.snakes.splice(index, 1));
    output += "<br>Auction a snake? (Y/N)<br>";
    output += '<input id="auctionInput" type="text" placeholder="Y or N"><button onclick="auctionSnake()">Confirm</button>';
    outputDiv.innerHTML = output;
    displayGameState();
}

function auctionSnake() {
    const input = document.getElementById("auctionInput")?.value.toUpperCase();
    const outputDiv = document.getElementById("output");
    if (!outputDiv) return;
    let output = "";
    if (input === "Y") {
        output = "Select a snake to auction:<br>";
        player.snakes.forEach((snake, index) => {
            output += `${index + 1}. ${snake.name}<br>`;
        });
        output += '<input id="auctionSelect" type="text" placeholder="e.g., 1"><button onclick="executeAuction()">Auction</button>';
    } else {
        output = "Skipped auction.<br>";
    }
    output += "<br>Buy from other players:<br>";
    const availableSnakes = ["Banana ($100)", "Piebald ($400)", "Puzzle Pastel ($5000)", "Clown ($450)", "Normal ($25)"];
    availableSnakes.forEach((snake, index) => {
        output += `${index + 1}. ${snake}<br>`;
    });
    output += '<input id="buyExpoInput" type="text" placeholder="e.g., 1"><button onclick="buyFromExpo()">Buy</button>';
    outputDiv.innerHTML = output;
}

function executeAuction() {
    const index = parseInt(document.getElementById("auctionSelect")?.value) - 1;
    const outputDiv = document.getElementById("output");
    if (!outputDiv || isNaN(index) || index < 0 || index >= player.snakes.length) {
        if (outputDiv) outputDiv.innerHTML = "Invalid selection!";
        return;
    }
    const snake = player.snakes[index];
    const bid = Math.round(snake.basePrice * (0.7 + Math.random() * 0.8));  // 70%–150%
    player.currency += bid * 0.9;  // 10% fee
    player.reputation += 2;
    player.snakes.splice(index, 1);
    let output = `Auctioned ${snake.name} for $${bid}<br>`;
    output += "<br>Buy from other players:<br>";
    const availableSnakes = ["Banana ($100)", "Piebald ($400)", "Puzzle Pastel ($5000)", "Clown ($450)", "Normal ($25)"];
    availableSnakes.forEach((snake, index) => {
        output += `${index + 1}. ${snake}<br>`;
    });
    output += '<input id="buyExpoInput" type="text" placeholder="e.g., 1"><button onclick="buyFromExpo()">Buy</button>';
    outputDiv.innerHTML = output;
    displayGameState();
}

function buyFromExpo() {
    const availableSnakes = ["Banana ($100)", "Piebald ($400)", "Puzzle Pastel ($5000)", "Clown ($450)", "Normal ($25)"];
    const index = parseInt(document.getElementById("buyExpoInput")?.value) - 1;
    const outputDiv = document.getElementById("output");
    if (!outputDiv || isNaN(index) || index < 0 || index >= availableSnakes.length) {
        if (outputDiv) outputDiv.innerHTML = "Invalid selection!";
        return;
    }
    const snakeStr = availableSnakes[index];
    const price = parseInt(snakeStr.match(/\d+/)[0]);
    if (player.currency < price) {
        outputDiv.innerHTML = "Not enough currency!";
        return;
    }
    player.currency -= price;
    const name = snakeStr.split(" (")[0];
    const puzzleScore = name.includes("Puzzle") ? 90 : (["Piebald", "Patternless"].includes(name) ? 30 : 10);
    const genes = name.includes(" ") ? name.split(" ") : [name];
    const snake = { name: name, genes: genes, puzzleInfluenceScore: puzzleScore, basePrice: price };
    player.snakes.push(snake);
    outputDiv.innerHTML = `Bought ${name} for $${price}`;
    displayGameState();
}
