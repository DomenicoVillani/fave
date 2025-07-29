(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const birdImg = new Image();
  birdImg.src = 'prova.png';

  // Elimino l'uso di pipeImg per ora

  const gravity = 0.1;
  const jumpStrength = -5;
  const pipeGap = 150;
  const pipeWidth = 80;
  const pipeSpeed = 2;

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

    // Disegno l'uccellino come immagine (se carica)
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Disegno rettangoli al posto dei tubi per mostrare le loro dimensioni
    for (let pipe of pipes) {
      ctx.fillStyle = 'green';  // tubo superiore
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

      ctx.fillStyle = 'darkgreen';  // tubo inferiore
      ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
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
    } else {
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
  birdImg.onload = () => {
    assetsLoaded++;
    if (assetsLoaded === 1) {
      resetGame();
    }
  };
})();
