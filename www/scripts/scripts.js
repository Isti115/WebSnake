"use strict";

window.addEventListener("load", init, false);

var canvas, context;
var width = 640, height = 480;
var tileSize = 32;

var obstacleCount = 4;

var hudDrawer, arenaDrawer;
var field, snake;

var stepDelay = 200;
var mainInterval;

var dieded = false;

function init() {
  canvas = document.getElementById("gameCanvas");
  
  canvas.width = width;
  canvas.height = height;
  
  context = canvas.getContext("2d");
  
  window.addEventListener("keydown", keyDown, false);
  
  hudDrawer = new TileDrawer(context, 0, 0, 32);
  arenaDrawer = new TileDrawer(context, 0, 32, 32);
  
  field = new Field(width / tileSize, (height - arenaDrawer.offsetY) / tileSize, obstacleCount);
  snake = new Snake();
  
  field.loadImages();
  snake.loadImages();
  
  field.generateObstacles(obstacleCount);
  field.generateFood();

  imageLoader.processQueue(start);
}

function start() {
  console.log("%cImages loaded -> Game started.", "color:green;font-size:20px;");
  
  draw();
  
  mainInterval = setInterval(main, stepDelay);
}

function main() {
  update();
  draw();
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
  
  field.draw();
  snake.draw();
  
  if (dieded) {
    context.fillText(`dieded: ${snake.length - 4}`, 100, 100);
  }
}
