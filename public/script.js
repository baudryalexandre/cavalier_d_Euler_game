const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game');
const startButton = document.getElementById('start-button');
const endScreen = document.getElementById('end-screen');
const finalScoreDisplay = document.getElementById('final-score');

let knightPosition = { x: 0, y: 0 };
const visited = Array.from({ length: 9 }, () => Array(8).fill(false));
let score = 0; // Initialisation du score
let gameEnded = false; // Variable pour vérifier si le jeu est terminé
let gameMode = 'solo'; // Mode par défaut
let playerName = ''; // Variable pour stocker le nom du joueur
let globalScores = []; // Tableau pour stocker les scores des joueurs en mode compétition


// Démarrer le jeu
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    createBoard(); // Crée le plateau de jeu
});


// Événement de sélection du mode
document.getElementById('mode').addEventListener('change', function () {
    gameMode = this.value; // Met à jour le mode de jeu
});

// Fonction pour créer l'échiquier
function createBoard() {
    board.innerHTML = ''; // Vide le plateau pour s'assurer qu'il n'y a pas de résidus de l'ancienne partie

    // Position aléatoire pour le cavalier
    knightPosition.x = Math.floor(Math.random() * 8);
    knightPosition.y = Math.floor(Math.random() * 8);
    visited[knightPosition.x][knightPosition.y] = true; // Marquer la case initiale comme visitée

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = i;
            cell.dataset.y = j;

            // Supprimez les anciennes classes ici si nécessaire
            cell.classList.remove('knight', 'possible-move');

            cell.addEventListener('click', () => moveKnight(i, j));
            board.appendChild(cell);
        }
    }
    updateKnightPosition(); // Met à jour la position du cavalier sur le nouveau plateau
}

// Fonction pour déplacer le cavalier
function moveKnight(x, y) {
    const moves = [
        { x: 2, y: 1 }, { x: 2, y: -1 },
        { x: -2, y: 1 }, { x: -2, y: -1 },
        { x: 1, y: 2 }, { x: 1, y: -2 },
        { x: -1, y: 2 }, { x: -1, y: -2 },
    ];

    const isValidMove = moves.some(move =>
        knightPosition.x + move.x === x && knightPosition.y + move.y === y &&
        !visited[x][y]
    );

    if (isValidMove) {
        visited[knightPosition.x][knightPosition.y] = true;
        knightPosition = { x, y };
        updateKnightPosition();
        updateScore(); // Met à jour le score à chaque mouvement valide
        checkVictory(); // Vérifie si le joueur a gagné
    }
}

// Met à jour la position du cavalier sur l'échiquier
function updateKnightPosition() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('knight', 'possible-move'); // Réinitialise l'état des cases
    });

    const currentCell = cells[knightPosition.x * 8 + knightPosition.y];
    currentCell.classList.add('knight');
    currentCell.textContent = '♞'; // Symbole du cavalier

    highlightPossibleMoves(); // Met à jour les mouvements possibles
}

// Met à jour le score
function updateScore() {
    score++; // Incrémente le score
    scoreDisplay.textContent = score; // Met à jour l'affichage du score
}

// Met en couleur les coups possibles du cavalier
function highlightPossibleMoves() {
    const moves = [
        { x: 2, y: 1 }, { x: 2, y: -1 },
        { x: -2, y: 1 }, { x: -2, y: -1 },
        { x: 1, y: 2 }, { x: 1, y: -2 },
        { x: -1, y: 2 }, { x: -1, y: -2 },
    ];

    moves.forEach(move => {
        const newX = knightPosition.x + move.x;
        const newY = knightPosition.y + move.y;

        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && !visited[newX][newY]) {
            const possibleCell = board.children[newX * 8 + newY];
            possibleCell.classList.add('possible-move');
        }
    });
}

// Vérifie si le joueur a gagné
function checkVictory() {
    if (visited.flat().every(cell => cell)) {
        gameEnded = true; // Le jeu est terminé (toutes les cases visitées)
    } else {
        // Si le joueur ne peut plus faire de mouvement
        const moves = getPossibleMoves(knightPosition.x, knightPosition.y);
        if (moves.length === 0) {
            gameEnded = true; // Le jeu est terminé (aucun mouvement possible)
        }
    }

    if (gameEnded) {
        endGame(); // Appel à la fonction pour finir le jeu
    }
}

// Fonction pour obtenir les mouvements possibles
function getPossibleMoves(x, y) {
    const moves = [
        { x: 2, y: 1 }, { x: 2, y: -1 },
        { x: -2, y: 1 }, { x: -2, y: -1 },
        { x: 1, y: 2 }, { x: 1, y: -2 },
        { x: -1, y: 2 }, { x: -1, y: -2 },
    ];

    return moves.filter(move => {
        const newX = x + move.x;
        const newY = y + move.y;
        return newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && !visited[newX][newY];
    });
}

// Gérer la fin du jeu
function endGame() {
    finalScoreDisplay.textContent = score; // Afficher le score final
    endScreen.style.display = 'block'; // Afficher l'écran de fin
    gameContainer.style.display = 'none'; // Cacher le conteneur de jeu
}

// Fonction pour normaliser les mots (pour les mots bannis)
function normalizeWord(word) {
    return word
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Enlève tout sauf les lettres et chiffres
        .replace(/0/g, 'o') // Remplace "0" par "o"
        .replace(/1/g, 'i') // Remplace "1" par "i"
        .replace(/1/g, 'l') // Remplace "1" par "l"
        .replace(/2/g, 'z') // Remplace "2" par "z"
        .replace(/3/g, 'e') // Remplace "3" par "e"
        .replace(/4/g, 'h') // Remplace "4" par "h"
        .replace(/5/g, 's') // Remplace "5" par "s"
        .replace(/6/g, 'g') // Remplace "0" par "o"
        .replace(/7/g, 't') // Remplace "7" par "t"
        .replace(/8/g, 'b') // Remplace "8" par "b"
        .replace(/9/g, 'q') // Remplace "9" par "q"
        .replace(/(.)\1+/g, '$1'); // Supprime les répétitions de lettres successives

}

// Gérer la soumission du score
// Gérer la soumission du score
document.getElementById('submit-score').addEventListener('click', () => {
    const playerNameEnd = document.getElementById('player-name-end').value.trim(); // Récupère le nom du joueur

    if (!playerNameEnd) {
        alert("Veuillez entrer votre nom !");
        return; // Ne pas soumettre sans nom
    }

    // Vérifier si le pseudo contient des espaces
    if (playerNameEnd.includes(" ")) {
        alert("Le nom ne doit pas contenir d'espaces. Veuillez choisir un autre nom !");
        return; // Ne pas soumettre si le pseudo contient des espaces
    }

    // Vérifier les mots bannis
    fetch('/banned-words.txt') // Assurez-vous que le chemin est correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            return response.text(); // Lire le contenu comme texte
        })
        .then(text => {
            // Séparer les mots par ligne et normaliser
            const bannedWords = text.split('\n').map(word => word.trim());
            const normalizedBannedWords = bannedWords.map(normalizeWord);

            // Normaliser le pseudo du joueur
            const normalizedPlayerName = normalizeWord(playerNameEnd); // Normaliser le pseudo

            // Vérifier si le pseudo normalisé est un mot banni
            if (normalizedBannedWords.includes(normalizedPlayerName)) {
                alert("Le nom contient des mots bannis. Veuillez choisir un autre nom !");
                return; // Ne pas soumettre si le pseudo contient un mot banni
            }

            // En mode compétition, ajoute le score au tableau global
            if (gameMode === 'compet') {
                globalScores.push({ name: playerNameEnd, score });
                afficherScores(); // Met à jour l'affichage des scores
            } else {
                const scoreItem = document.createElement('li');
                scoreItem.textContent = `${playerNameEnd}: Score: ${score}`; // Affiche le nom et le score
                document.getElementById('score-list').appendChild(scoreItem);
            }

            // Réinitialiser le score et le plateau pour la prochaine partie
            resetGame(); // Réinitialise le jeu et vide le plateau
            endScreen.style.display = 'none'; // Masquer l'écran de fin
            startScreen.style.display = 'flex'; // Retourner au menu principal
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des mots bannis:', error);
        });
});


// Fonction pour afficher tous les scores dans le tableau en mode compétition
function afficherScores() {
    const scoreList = document.getElementById('score-list');
    // scoreList.innerHTML = ''; // Vider la liste actuelle

    // Afficher chaque score avec le nom dans le tableau
    globalScores.forEach(entry => {
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${entry.name}: Score: ${entry.score}`; // Affiche le nom et le score
        scoreList.appendChild(scoreItem);
    });
}

let botRunning = false; // Pour contrôler l'état du bot
let botUsed = false;    // Pour vérifier si le bot a été utilisé

document.getElementById('algo-button').addEventListener('click', () => {
    if (botRunning) return; // Empêche plusieurs clics pendant l'exécution du bot

    botRunning = true;
    botUsed = true;
    document.getElementById('algo-button').disabled = true;

    const startX = knightPosition.x;
    const startY = knightPosition.y;
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    // Appel à l'API pour récupérer la solution
    fetch(`http://127.0.0.1:5000/run-algo?start_x=${startX}&start_y=${startY}`)
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';
            if (data.erreur) {
                alert(data.erreur);
            } else {
                afficherSolution(data.solution);
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'exécution de l\'algorithme:', error);
            loadingIndicator.style.display = 'none';
        });
});

function afficherSolution(solution) {
    let moveIndex = 1;

    function simulateClickMove() {
        if (!botRunning) return;

        const currentMove = solution.flat().indexOf(moveIndex);
        if (currentMove === -1) return;

        const x = Math.floor(currentMove / 8);
        const y = currentMove % 8;

        knightPosition = { x, y };
        visited[x][y] = true;
        updateKnightPosition();

        if (moveIndex > 1) updateScore(); // Incrémenter le score après le premier mouvement
        moveIndex++;

        if (moveIndex <= 64) {
            setTimeout(simulateClickMove, 300);
        } else {
            checkVictory();
            botRunning = false;
            document.getElementById('algo-button').disabled = false;
        }

        if (botUsed) {
            botFinishGame(); // Verrouiller le champ de texte si le bot est utilisé
        } else {
            const nameInput = document.getElementById('player-name-end');
            nameInput.value = ""; // Vide le champ de texte
            nameInput.removeAttribute('readonly'); // Déverrouille le champ
            nameInput.style.backgroundColor = ''; // Rétablit le style initial
        }
    }

    simulateClickMove();
}

function botFinishGame() {
    const nameInput = document.getElementById('player-name-end');
    nameInput.value = "BOT-imbattable-tricheur";
    nameInput.setAttribute('readonly', true);
    nameInput.style.backgroundColor = '#e0e0e0';
}

function resetGame() {
    // Réinitialiser l'état du bot
    botUsed = false;
    botRunning = false;
    document.getElementById('algo-button').disabled = false;

    // Réinitialisation du champ de texte
    const nameInput = document.getElementById('player-name-end');
    nameInput.value = ""; // Efface le contenu du champ de texte
    nameInput.removeAttribute('readonly'); // Déverrouille le champ
    nameInput.style.backgroundColor = ''; // Rétablit le style par défaut

    // Réinitialisation de l'état du jeu
    knightPosition = { x: 0, y: 0 };
    visited.forEach(row => row.fill(false)); // Réinitialise les cases visitées

    score = 0;
    scoreDisplay.textContent = score; // Met à jour l'affichage du score
    gameEnded = false;
    createBoard(); // Créer un nouveau plateau de jeu

}

// Réinitialiser le jeu
document.getElementById('play-again').addEventListener('click', () => {
    endScreen.style.display = 'none'; // Cacher l'écran de fin
    gameContainer.style.display = 'flex'; // Afficher le conteneur de jeu
    resetGame(); // Réinitialise le jeu
});

document.getElementById('menu').addEventListener('click', () => {
    endScreen.style.display = 'none'; // Cacher l'écran de fin
    startScreen.style.display = 'flex'; // Afficher l'écran de démarrage
    resetGame(); // Réinitialise le jeu en revenant au menu principal
});

// Événement pour le bouton Passer à l'écran de fin
document.getElementById('skip-to-end').addEventListener('click', () => {
    endGame(); // Appelle la fonction pour finir le jeu
});

// Réinitialise le jeu
resetButton.addEventListener('click', () => {
    knightPosition = { x: 0, y: 0 };
    visited.forEach(row => row.fill(false));
    score = 0; // Réinitialise le score
    scoreDisplay.textContent = score; // Met à jour l'affichage du score
    createBoard();
});

// Initialisation
createBoard();
