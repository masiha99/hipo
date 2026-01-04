// menu.js
const menu = document.getElementById("menu");
const dinoGame = document.getElementById("dinoGame");
const snakeGame = document.getElementById("snakeGame");
const backBtn = document.getElementById("backBtn");

document.getElementById("dinoBtn").onclick = () => {
    menu.style.display = "none";
    dinoGame.style.display = "block";
    backBtn.style.display = "block";
};

document.getElementById("snakeBtn").onclick = () => {
    menu.style.display = "none";
    snakeGame.style.display = "block";
    backBtn.style.display = "block";
};

backBtn.onclick = () => location.reload();
