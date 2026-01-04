//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //
let birdHeight = 24;
let birdX = boardWidth /8;
let birdY = boardHeight /2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//pysic
let velocityX = -1.5; // pipe moviing left
let velocityY = -1.2;// bired jump
let gravity = 0.1;
let jumpStrength = -3.9

let gameOver = false;
let flapscore = 0;

let fps = 30;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d'); //used for drawing

    // draw bird
   // context.fillStyle = 'green';
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load
    birdImg = new Image();
    birdImg.src = "./flappybird0.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./topPipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottomPipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1300)// every1.5s
    document.addEventListener("keydown", moveBird);
}
let gameStarted = false;
function update() {
    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
    }

    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    if (gameStarted){
        velocityY += gravity;
        bird.y += velocityY;

    }
    if (bird.y > board.height - bird.height) {
        bird.y = board.height - bird.height;
        velocityY =0;
    }
    if (bird.y < 0){
        bird.y = 0;
        velocityY = 0;
    }
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);


    //pipe
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            flapscore += 0.5
            pipe.passed = true;
        }
        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(flapscore, 5, 45);

    if (gameOver){
        context.fillText("game over", 5, 90)
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    };
    pipeArray.push(bottomPipe);

}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        if (!gameStarted) {
            gameStarted = true;
        }

        velocityY = jumpStrength;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            flapscore = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
}
