class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    
    this.obstacles = [];
  }
  
  generateObstacles(obstacleCount) {
    while (this.obstacles.length < obstacleCount) {
      var currentObstacleX = Math.floor(Math.random() * this.width);
      var currentObstacleY = Math.floor(Math.random() * this.height);
      var currentObstacle = new Position(currentObstacleX, currentObstacleY);
      
      var collides = false;
      
      for (var i = 0; i < this.obstacles.length && !collides; i++) {
        collides = this.obstacles[i].equals(currentObstacle);
      }
      
      if (!collides) {
        this.obstacles.push(currentObstacle);
      }
    }
  }
  
  loadImages() {
    this.images = {};
    
    this.images.obstacle = imageLoader.queueImage("images/Untitled.png");
    this.images.food     = imageLoader.queueImage("images/Untitled.png");
    this.images.scroll   = imageLoader.queueImage("images/Untitled.png");
  }
  
  update() {
    
  }
  
  draw(context) {
    for (var currentObstacle of this.obstacles) {
      arenaDrawer.drawTile(this.images.obstacle, currentObstacle.x, currentObstacle.y);
    }
  }
}
