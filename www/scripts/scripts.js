"use strict";

window.addEventListener("load", init, false);

var delay = 500;

function init() {
  var board = document.getElementById("board");
  
  for (var i = 0; i < 10; i++) {
    var bodyDiv = document.createElement("div");
    
    bodyDiv.classList.add("snake-body");
    
    bodyDiv.style.width = "30px";
    bodyDiv.style.height = "30px";
    
    bodyDiv.style.position = "absolute";
    bodyDiv.style.top = "50px";
    bodyDiv.style.left = 50 + 35 * i + "px";
    
    var td = (delay / 2000) - ((delay / 2000) / 10) * i;
    
    bodyDiv.style.transition = "all " + delay / 1000 + "s";
    bodyDiv.style.transitionDelay = td + "s";
    console.log(td);
    
    board.appendChild(bodyDiv);
  }
  
  setInterval(update, delay);
}

function update() {
  var bodyList = document.getElementsByClassName("snake-body");
  
  for (var i = 0; i < bodyList.length; i++) {
    bodyList[i].style.left = parseInt(bodyList[i].style.left) + 35 + "px";
  }
}
