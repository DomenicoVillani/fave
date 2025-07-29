    (() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const birdImg = new Image();
    birdImg.src = 'prova.png';

    const pipeImg = new Image();
    pipeImg.src = 'image.png';

    const pipeTopImg = new Image();
pipeTopImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABACAYAAACp5kh7AAAACXBIWXMAAAsTAAALEwEAmpwYAAABaElEQVR4nO3ZQQrDMBCE4f7/x2TZQKUURxGp2DtBvH1PkIm0pOKjk1NQKCQe7TR5OyYAAAAAAAAA4ANB/bm57AeUuMYxgAfTHXH9Pq/DAEjxIDQcBwmMXAIwPIaALB8X6GwDI+7XzqdzCQPCe62k2EfQWj5jyN8nQxcQCzvVYsVk5sn5Fx8B41vfDGB0Dr0mXnCtK5F9D0xwHqG+oZ8OQHnd9Jo7MkG7sXvhx6B6H7rZxpxiR9tccBqA+PQGcfxGuLpAaLFVnR9GeTsGkHwwBPx/g+7W0IY/wB6u+vwDWt8XwK4CXH6UwE1wXOcaA7Z9FYB1wPqGcR4D3AJ51zPxLg7q7cB8XcFwHcTwHA4bqDf20Xv9P+Z/14mW0tuQyAAAAAAAAAAAC4HvgB9yDWyLqZbD+MAAAAASUVORK5CYII=';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABACAYAAACp5kh7AAAACXBIWXMAAAsTAAALEwEAmpwYAAABaUlEQVR4nO3ZwQmDMBSE4ef9vX1b8RRVGqSwH0F7db9O0GSbMkJgqZT03h54sAAAAAAAAA8C0PeTvtxlA98Z7v9QMA5HoVzvP7PCUDQfBPwIExAIxhAwG0Yh7hPteh9AwA1AOC8owDw4H9hyAwD8XDA/AEB/XrX8ykBIAkB4HAAwd5H0JZAHAYAEBhAbcPfNyoCAPAOxeR6AYHwDQRAAgDwPAFB7Xvt/RqE7+ufVA+Ao/AOG8f7j9rQ/I8b0d0vvEDKADge72qf+AXr+W//X+egx9XWzO0wAAQAAAAAAAAAAAOA34ABRsJ/kKiJe3wAAAABJRU5ErkJggg==';

    const gravity = 0.1;
    const jumpStrength = -5;
    const pipeGap = 150;
    const pipeWidth = 80;
    const pipeSpeed = 1.5;

    let bird = {
    x: 80,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    velocity: 0
    };

    let pipes = [];
    let frameCount = 0;
    let score = 0;
    let gameOver = false;

    const restartBtn = document.getElementById('restartBtn');

    function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
    restartBtn.style.display = 'none';
    loop();
    }

    function createPipe() {
    const topHeight = 50 + Math.random() * (canvas.height - pipeGap - 100);
    pipes.push({
        x: canvas.width,
        topHeight,
        bottomY: topHeight + pipeGap,
        passed: false
    });
    }

    function update() {
    if (gameOver) return;

    frameCount++;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (frameCount % 140 === 0) {
        createPipe();
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
        score++;
        pipes[i].passed = true;
        }

        if (pipes[i].x + pipeWidth < 0) {
        pipes.splice(i, 1);
        }
    }

    for (let pipe of pipes) {
        if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
        ) {
        gameOver = true;
        }
    }

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    if (gameOver) {
        restartBtn.style.display = 'inline-block';
    }
    }

    function draw() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let pipe of pipes) {
        ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeImg, pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    }

    ctx.fillStyle = '#000';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, canvas.width / 2, 50);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);

        ctx.fillStyle = '#fff';
        ctx.font = '36px sans-serif';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        restartBtn.style.display = 'block';
    }else{
        restartBtn.style.display = 'none';
    }
    }

    function loop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
    }

    function jump() {
    if (!gameOver) {
        bird.velocity = jumpStrength;
    }
    }

    canvas.addEventListener('mousedown', jump);
    canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    jump();
    }, { passive: false });

    window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        jump();
    }
    });

    restartBtn.addEventListener('click', resetGame);

    let assetsLoaded = 0;
    [birdImg, pipeImg].forEach(img => {
    img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === 2) {
        resetGame();
        }
    };
    });
    })();
