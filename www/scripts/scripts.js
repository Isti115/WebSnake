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
var canvas, context;

var width = 640, height = 480;
var tileSize = 32;

var obstacleCount = 4;

var hudDrawer, arenaDrawer;
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
  canvas = document.getElementById("gameCanvas");
  
  width = parseInt(document.getElementById("widthInput").value) * 32;
  height = (parseInt(document.getElementById("heightInput").value) + 1) * 32;
  obstacleCount = parseInt(document.getElementById("obstacleCountInput").value);
  
  canvas.width = width;
  canvas.height = height;
  
  context = canvas.getContext("2d");
  
  gameContainer.addEventListener("keydown", keyDown, false);
  gameContainer.focus();
  
  hudDrawer = new TileDrawer(context, 0, 0, 32);
  arenaDrawer = new TileDrawer(context, 0, 32, 32);
  
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
  imageLoader.processQueue(countdown);
}

function countdown() {
  if (countdownStatus == 3) {
    field.audio.start.play();
  }
  
  context.font = "30px Courier New";
  context.fillStyle = "#000000";
  
  context.clearRect(0, 0, width, height);
  context.fillText(`Game begins in: ${countdownStatus}`, 10, 25);
  
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
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#aaff00";
  context.fillRect(0, 0, width, 32);
  
  field.draw();
  snake.draw();
  
  context.font = "30px Courier New";
  context.fillStyle = "#000000";
  
  if (snake.died) {
    scoreDisplay.innerHTML = `Game over: ${snake.length - 4}`;
  } else {
    scoreDisplay.innerHTML = `Score: ${snake.length - 4}`;
  }
  
  if (snake.activeEffect) {
    hudDrawer.drawTile(field.images.scrolls[snake.activeEffect], 3.75, 0);
    context.fillText(`Scroll: ${snake.activeEffect}`, 5, 25);
  }
}
