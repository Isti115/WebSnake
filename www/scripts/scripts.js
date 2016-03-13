"use strict";

window.addEventListener("load", init, false);

var canvas, context;
var width = 640, height = 480;
var tileSize = 32;

var obstacleCount = 4;

var stepDelay;

var hudDrawer, arenaDrawer;
var field, snake;


var untitled;

function init() {
  canvas = document.getElementById("gameCanvas");
  
  canvas.width = width;
  canvas.height = height;
  
  context = canvas.getContext("2d");
  
  hudDrawer = new TileDrawer(context, 0, 0, 32);
  arenaDrawer = new TileDrawer(context, 0, 32, 32);
  
  field = new Field(width / tileSize, (height - arenaDrawer.offsetY) / tileSize, obstacleCount);
  field.generateObstacles(obstacleCount);
  field.loadImages();
  
  snake = new Snake();
  snake.loadImages();
  
  untitled = imageLoader.queueImage("images/Untitled.png");
  imageLoader.processQueue(start);
}

function start() {
  console.log("started");
  
  // arenaDrawer.drawTile(untitled, 10, 10);
  
  field.draw();
  snake.draw();
  
  setInterval(main, 500);
}

function main() {
  update();
  draw();
}

function update() {
  snake.update();
  field.update();
}

function draw() {
  context.clearRect(0, 0, width, height);
  
    field.draw();
    snake.draw();
}
