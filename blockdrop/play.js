import { Game } from "./game.js";

const tickSpeed = 800;

const gameWidth = 10;
const gameHeight = 23;
const gameScale = 20; 

const gameCanvas = document.getElementById("game");
const gameCtx = gameCanvas.getContext("2d");  

gameCanvas.width = gameWidth * gameScale;
gameCanvas.height = gameHeight * gameScale;

const pauseButton = document.getElementById("pause");
const restartButton = document.getElementById("restart");
//const highScoreField = document.getElementById("high-score");
const scoreField = document.getElementById("score");


pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", newGame);

document.addEventListener('keydown', onKeyDown);


var tick;
var intervalId;
var paused;
var game;



const keys = {}


function onKeyDown(e) {
    if (paused) {
        return;
    }

    game.onKeyPress(e.key, gameCtx);
    scoreField.innerHTML = "Score: " + game.getScore();
    
}



function unpause() {
    pauseButton.src = "images/play-button.png"
    paused = false;
}


function pause() {
    pauseButton.src = "images/pause-button.png"
    paused = true;
}


function newGame() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    game = new Game();
    unpause()
    tick = 0;
    intervalId = setInterval(updateGame, tickSpeed)
}


function updateGame() {
    if (paused) {
        return;
    }

    tick += 1;

    //update game every 5 ticks
    game.update(gameCtx);

    scoreField.innerHTML = "Score: " + game.getScore();

    if (game.isOver) {
        clearInterval(intervalId);
        newGame();
    }    
}


function togglePause() {
    if (paused) {
        unpause()
    }
    else {
        pause()
    }
}


newGame();