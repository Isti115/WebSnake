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
  
  generateFood() {
    delete this.food;
    
    while (!this.food) {
      var currentFoodX = Math.floor(Math.random() * this.width);
      var currentFoodY = Math.floor(Math.random() * this.height);
      var currentFood = new Position(currentFoodX, currentFoodY);
      
      var collides = false;
      
      for (var i = 0; i < this.obstacles.length && !collides; i++) {
        collides = this.obstacles[i].equals(currentFood);
      }
      
      for (var i = 0; i < snake.positions.length && !collides; i++) {
        collides = snake.positions[i].equals(currentFood);
      }
      
      if (!collides) {
        this.food = currentFood;
      }
    }
  }
  
  loadImages() {
    this.images = {};
    
    this.images.obstacle = imageLoader.queueImage("images/Untitled.png");
    this.images.food     = imageLoader.queueImage("images/Untitled.png");
    this.images.scrolls  = {
      "wisdom"    : imageLoader.queueImage("images/Untitled.png"),
      "mirror"    : imageLoader.queueImage("images/Untitled.png"),
      "reverse"   : imageLoader.queueImage("images/Untitled.png"),
      "greedy"    : imageLoader.queueImage("images/Untitled.png"),
      "lazy"      : imageLoader.queueImage("images/Untitled.png"),
      "voracious" : imageLoader.queueImage("images/Untitled.png")
    }
  }
  
  keyDown(e) {
    
  }
  
  update() {
    
  }
  
  draw() {
    for (var currentObstacle of this.obstacles) {
      arenaDrawer.drawTile(this.images.obstacle, currentObstacle.x, currentObstacle.y);
    }
    
    arenaDrawer.drawTile(this.images.food, this.food.x, this.food.y, 180);
  }
}
