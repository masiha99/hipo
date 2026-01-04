document.addEventListener("DOMContentLoaded", () => {


    const btn = document.getElementById("dinoBtn");
    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const score = document.getElementById("score");



    btn.addEventListener("click", () => {


        menu.style.display = "none";
        game.style.display = "block";
        score.style.display = "block";
    });
});


const dino = document.getElementById("dino");
const rock = document.getElementById("rock");
const score = document.getElementById("score");
function jump() {
    if (!dino.classList.contains("jump-animation")) {
        dino.classList.add("jump-animation");

        setTimeout(() => {
            dino.classList.remove("jump-animation");
        }, 500); // must match CSS animation duration
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") { // spacebar
        jump();
    }
});

setInterval(() => {
    score.innerText++;
    const dinoTop = parseInt(window.getComputedStyle(dino)
         .getPropertyValue("top"));
    const rockLeft = parseInt(window.getComputedStyle(rock)
          .getPropertyValue("left"));

    if (rockLeft < 0) {
        rock.style.display = "none";
    } else {
        rock.style.display = '';
    }


    if (rockLeft <50 && rockLeft > 0 && dinoTop>150) {
        alert("you got:" + score.innerText +
            "\n\nplay again");
        location.reload();
    }


}, 60);

