// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics (Tuned for 30 FPS)
let velocityX = -4.2;
let velocityY = -1.2;
let gravity = 0.4;
let jumpStrength = -6;

let gameOver = false;
let flapscore = 0;
let gameStarted = false;

// FPS Logic
let fps = 30;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;
let frameCount = 0;
let lastFpsUpdate = 0;
let displayedFps = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    birdImg = new Image();
    birdImg.src = "./flappybird0.png";

    topPipeImg = new Image();
    topPipeImg.src = "./topPipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottomPipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2000);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;

    // Fixed 30 FPS Gate
    if (delta > interval) {
        then = now - (delta % interval);

        // Calculate FPS
        frameCount++;
        if (now - lastFpsUpdate >= 1000) {
            displayedFps = frameCount;
            frameCount = 0;
            lastFpsUpdate = now;
        }

        if (gameOver) {
            context.fillStyle = "white";
            context.font = "45px sans-serif";
            context.fillText("GAME OVER", 60, 300);
            return;
        }

        context.clearRect(0, 0, board.width, board.height);

        // Bird Logic
        if (gameStarted) {
            velocityY += gravity;
            bird.y += velocityY;
        }

        if (bird.y > board.height - bird.height) {
            bird.y = board.height - bird.height;
            gameOver = true;
        }
        if (bird.y < 0) {
            bird.y = 0;
            velocityY = 0;
        }
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        // Pipe Logic
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                flapscore += 0.5;
                pipe.passed = true;
            }
            if (detectCollision(bird, pipe)) {
                gameOver = true;
            }
        }

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }

        // UI Drawing
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(Math.floor(flapscore) + "", 5, 45);

        // FPS Display
        context.fillStyle = "yellow";
        context.font = "16px sans-serif";
        context.fillText("FPS: " + displayedFps, boardWidth - 65, 25);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    pipeArray.push({
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    });

    pipeArray.push({
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    });
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        if (!gameStarted) gameStarted = true;
        velocityY = jumpStrength;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            flapscore = 0;
            velocityY = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

