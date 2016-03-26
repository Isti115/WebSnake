"use strict";

window.addEventListener("load", init, false);

function windowKeyDown(e) {
  if ([37, 38, 39, 40].indexOf(e.keyCode) != -1) {
    e.preventDefault();
  }
  
  if (e.keyCode == 13) {
    start();
  }
}

window.addEventListener("keydown", windowKeyDown, false);

var gameContainer;
var scoreDisplay;
var backgroundCanvas, backgroundContext;
var gameCanvas, gameContext;

var width = 640, height = 480;
var tileSize = 32;

var obstacleCount = 4;

var backgroundDrawer, hudDrawer, arenaDrawer;
var field, snake;

var countdownStatus;

var baseStepDelay = 150;
var stepDelay = baseStepDelay;
// var mainInterval;

function init() {
  document.getElementById("startButton").addEventListener("click", start, false);
}

function start() {
  gameContainer = document.getElementById("gameContainer");
  scoreDisplay = document.getElementById("scoreDisplay");
  backgroundCanvas = document.getElementById("backgroundCanvas");
  gameCanvas = document.getElementById("gameCanvas");
  
  width = parseInt(document.getElementById("widthInput").value) * 32;
  height = (parseInt(document.getElementById("heightInput").value) + 1) * 32;
  obstacleCount = parseInt(document.getElementById("obstacleCountInput").value);
  
  gameCanvas.width = width;
  gameCanvas.height = height;
  
  backgroundContext = backgroundCanvas.getContext("2d");
  gameContext = gameCanvas.getContext("2d");
  
  gameContainer.addEventListener("keydown", keyDown, false);
  gameContainer.focus();
  
  backgroundDrawer = new TileDrawer(backgroundContext, 0, 0, 32);
  hudDrawer = new TileDrawer(gameContext, 0, 0, 32);
  arenaDrawer = new TileDrawer(gameContext, 0, 32, 32);
  
  field = new Field(width / tileSize, (height - arenaDrawer.offsetY) / tileSize, obstacleCount);
  snake = new Snake();
  
  field.loadImages();
  snake.loadImages();
  
  field.loadAudio();
  snake.loadAudio();
  
  field.generateObstacles(obstacleCount);
  field.generateFood();
  field.generateScroll();

  countdownStatus = 3;
  imageLoader.processQueue(ready);
}

function ready() {
  backgroundCanvas.width = field.width * tileSize;
  backgroundCanvas.height = field.height * tileSize;
  field.generateBackground();
  countdown();
}

function countdown() {
  if (countdownStatus == 3) {
    field.audio.start.play();
  }
  
  gameContext.font = "30px Courier New";
  gameContext.fillStyle = "#000000";
  
  gameContext.clearRect(0, 0, width, height);
  gameContext.fillText(`Game begins in: ${countdownStatus}`, 10, 25);
  
  countdownStatus--;
  if (countdownStatus >= 0) {
    setTimeout(countdown, 1000);
  } else {
    field.audio.background.play();
    begin();
  }
}

function begin() {
  console.log("%cImages loaded -> Game started.", "color:green;font-size:20px;");
  
  draw();
  main();
  // mainInterval = setInterval(main, stepDelay);
}

function main() {
  update();
  draw();
  
  if (!snake.died) {
    setTimeout(main, stepDelay);
  }
}

function keyDown(e) {
  field.keyDown(e);
  snake.keyDown(e);
}

function update() {
  field.update();
  snake.update();
}

function draw() {
  gameContext.clearRect(0, 0, width, height);
  gameContext.fillStyle = "#aaff00";
  gameContext.fillRect(0, 0, width, 32);
  
  field.draw();
  snake.draw();
  
  gameContext.font = "30px Courier New";
  gameContext.fillStyle = "#000000";
  
  if (snake.died) {
    scoreDisplay.innerHTML = `Game over: ${snake.length - 4}`;
  } else {
    scoreDisplay.innerHTML = `Score: ${snake.length - 4}`;
  }
  
  if (snake.activeEffect) {
    hudDrawer.drawTile(field.images.scrolls[snake.activeEffect], 3.75, 0);
    gameContext.fillText(`Scroll: ${snake.activeEffect}`, 5, 25);
  }
}
