import { Game } from "./blockdrop/game.js";


const tickSpeed = 100;

const gameWidth = 10;
const gameHeight = 24;
const gameScale = 20; 

const gameCanvas = document.getElementById("game");
const gameCtx = this.gameCanvas.getContext("2d");  

gameCanvas.width = gameWidth * gameScale;
gameCanvas.height = gameHeight * gameScale;

const pauseButton = document.getElementById("pause");
const restartButton = document.getElementById("restart");
//const highScoreField = document.getElementById("high-score");
const scoreField = document.getElementById("score");


pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", newGame);


var tick;
var intervalId;
var paused;
var game;


function newGame() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    game = new Game();
    paused = false;
    tick = 0;
    intervalId = setInterval(updateGame, tickSpeed)
}


function updateGame() {
    if (paused) {
        return;
    }
    
    tick += 1;

    //update game every 5 ticks
    if (tick % 5) {
        game.update(gameCtx)
    }

    scoreField.innerHTML = game.getScore();

    if (game.isOver) {
        clearInterval(intervalId)
        newGame()
    }    
}


function togglePause() {
    paused = !paused;
}

