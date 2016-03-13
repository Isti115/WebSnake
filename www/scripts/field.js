class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Field {
  constructor(width, height, obstacleCount) {
    this.obstacles = [];
    
    for (var i = 0; i < obstacleCount; i++) {
      var currentObstacleX = Math.floor(Math.random() * width);
      var currentObstacleY = Math.floor(Math.random() * height);
      this.obstacles.push(new Position(currentObstacleX, currentObstacleY));
    }
  }
  
  loadImages() {
    this.images = {};
    
    this.images.obstacle     = imageLoader.queueImage("images/Untitled.png");
    this.images.neck     = imageLoader.queueImage("images/Untitled.png");
    this.images.neckTurn = imageLoader.queueImage("images/Untitled.png");
    this.images.body     = imageLoader.queueImage("images/Untitled.png");
    this.images.bodyTurn = imageLoader.queueImage("images/Untitled.png");
    this.images.tail     = imageLoader.queueImage("images/Untitled.png");
  }
  
  draw(context) {
    for (var currentObstacle of this.obstacles) {
      arenaDrawer.drawTile(this.images.obstacle, currentObstacle.x, currentObstacle.y);
    }
  }
}
