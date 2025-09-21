// --- Elementos del DOM ---
const gameBoard = document.getElementById('game-board');
const movesCountSpan = document.getElementById('moves-count');
const restartButton = document.getElementById('restart-button');

// --- Configuración del Juego ---
// MODIFICADO: Cambiamos los emojis por las rutas a tus imágenes.
// ¡Asegúrate de que los nombres coincidan con los de tu carpeta "images"!
const IMAGE_PATHS = [
    'images/1.png',
    'images/2.jpeg',
    'images/3.jpeg',
    'images/4.jpeg',
    'images/5.jpeg',
    'images/6.jpeg',
    'images/7.jpeg',
    'images/8.jpeg'
];

let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

// --- Funciones del Juego ---

// 1. Barajar un arreglo (Algoritmo Fisher-Yates) - SIN CAMBIOS
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// 2. Iniciar o Reiniciar el Juego - MODIFICADO
function startGame() {
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;
    movesCountSpan.textContent = moves;
    gameBoard.innerHTML = '';

    // Usa las rutas de las imágenes para crear el mazo
    const fullDeck = shuffle([...IMAGE_PATHS, ...IMAGE_PATHS]);

    fullDeck.forEach(imagePath => {
        const card = createCard(imagePath);
        gameBoard.appendChild(card);
    });
}

// 3. Crear el HTML de una carta - MODIFICADO
function createCard(imagePath) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imagePath; // Guarda la ruta de la imagen como identificador

    // Crea una etiqueta <img> en la cara frontal de la carta
    card.innerHTML = `
        <div class="card-face card-front">
            <img src="${imagePath}" alt="Carta de memoria">
        </div>
        <div class="card-face card-back"></div>
    `;

    card.addEventListener('click', flipCard);
    return card;
}

// 4. Voltear una carta - SIN CAMBIOS
function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return;
    this.classList.add('flipped');
    flippedCards.push(this);
    if (flippedCards.length === 2) {
        incrementMoves();
        checkForMatch();
    }
}

// 5. Comprobar si las dos cartas volteadas son iguales - MODIFICADO
function checkForMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;

    // Compara el dataset "image" en lugar de "emoji"
    if (card1.dataset.image === card2.dataset.image) {
        disableCards();
    } else {
        unflipCards();
    }
}

// 6. Si son un par, deshabilitarlas - MODIFICADO
function disableCards() {
    const [card1, card2] = flippedCards;
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    resetBoard();

    // Comprueba la victoria comparando con la cantidad de imágenes únicas
    if (matchedPairs === IMAGE_PATHS.length) {
        setTimeout(() => {
            alert(`¡Felicidades! 🎉 Has ganado en ${moves} movimientos.`);
        }, 500);
    }
}

// 7. Si no son un par, voltearlas de nuevo - SIN CAMBIOS
function unflipCards() {
    setTimeout(() => {
        const [card1, card2] = flippedCards;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// 8. Resetear el estado del turno - SIN CAMBIOS
function resetBoard() {
    flippedCards = [];
    lockBoard = false;
}

// 9. Incrementar el contador de movimientos - SIN CAMBIOS
function incrementMoves() {
    moves++;
    movesCountSpan.textContent = moves;
}

// --- Eventos ---
restartButton.addEventListener('click', startGame);

// --- Iniciar el juego al cargar la página ---
startGame();