const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth / 2;  // rimpicciolisco l'arena a metà larghezza
canvas.height = window.innerHeight;

const playerImage = new Image();
playerImage.src = "secchio.png";

const favaImage = new Image();
favaImage.src = "prova.png";

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10
};

const keys = {
    left: false,
    right: false
};

let score = 0;
let missed = 0;  // fave cadute senza raccolta
const maxMissed = 5;
let gameOver = false;

// Colonne dove cadono le fave (sinistra, centro, destra)
const columns = [
    canvas.width / 6 - 15,   // sinistra (1/6 larghezza - metà fave)
    canvas.width / 2 - 15,   // centro (metà canvas - metà fave)
    canvas.width * 5 / 6 - 15 // destra (5/6 larghezza - metà fave)
];

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});

document.addEventListener("touchstart", e => {
    const touchX = e.touches[0].clientX;
    keys.left = touchX < canvas.width / 2;
    keys.right = touchX > canvas.width / 2;
});

document.addEventListener("touchend", () => {
    keys.left = false;
    keys.right = false;
});

const fave = [];

function createFava() {
    if (gameOver) return;
    // Scegli colonna casuale tra le 3
    const colIndex = Math.floor(Math.random() * columns.length);
    fave.push({
        x: columns[colIndex],
        y: -30,
        size: 30,
        speed: 1.5 + Math.random() // più lento di prima (3+ --> 1.5+)
    });
}

function update() {
    if (gameOver) return;

    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    // Boundaries del player limitati alla nuova arena
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Update fave
    for (let i = fave.length - 1; i >= 0; i--) {
        fave[i].y += fave[i].speed;

        // Collision con secchio
        if (
            fave[i].x < player.x + player.width &&
            fave[i].x + fave[i].size > player.x &&
            fave[i].y < player.y + player.height &&
            fave[i].y + fave[i].size > player.y
        ) {
            fave.splice(i, 1);
            score++;
        } else if (fave[i].y > canvas.height) {
            fave.splice(i, 1);
            missed++;
            if (missed >= maxMissed) {
                gameOver = true;
            }
        }
    }
}


const restartBtn = document.getElementById("restartBtn");

function resetGame() {
    score = 0;
    missed = 0;
    fave.length = 0;
    player.x = canvas.width / 2 - player.width / 2;
    gameOver = false;
    restartBtn.style.display = "none";
    gameLoop();
}

restartBtn.addEventListener("click", resetGame);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (secchio)
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw fave (immagine)
    fave.forEach(fava => {
        ctx.drawImage(favaImage, fava.x, fava.y, fava.size, fava.size);
    });

    // Draw score e fave mancate centrati in alto
    ctx.fillStyle = "#000";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Fave raccolte: " + score, canvas.width / 2, 40);

    ctx.font = "20px sans-serif";
    ctx.fillText("Fave mancate: " + missed, canvas.width / 2, 70);

    // Se game over
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);

        ctx.fillStyle = "#fff";
        ctx.font = "36px sans-serif";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px sans-serif";
        ctx.fillText(`Hai raccolto ${score} fave`, canvas.width / 2, canvas.height / 2 + 40);

        restartBtn.style.display = "block";  // mostra il bottone
    }
}


setInterval(() => {
    createFava();
}, 1000); // più lento (prima 800ms)

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
