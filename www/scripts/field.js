class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    
    this.entrance = Math.floor(this.height / 2);
    
    this.obstacles = [];
  }
  
  generateObstacles(obstacleCount) {
    while (this.obstacles.length < obstacleCount) {
      var currentObstacleX = Math.floor(Math.random() * this.width);
      var currentObstacleY = Math.floor(Math.random() * this.height);
      var currentObstacle = new Position(currentObstacleX, currentObstacleY);
      
      var collides = currentObstacle.y == this.entrance && currentObstacle.x < 5;
      
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
      // var currentFood = new Position(currentFoodX, currentFoodY);
      var currentFood = new Position(-1, -1);
      
      var collides = false;
      
      for (var i = 0; i < this.obstacles.length && !collides; i++) {
        collides = this.obstacles[i].equals(currentFood);
      }
      
      for (var i = 0; i < snake.positions.length && !collides; i++) {
        collides = snake.positions[i].equals(currentFood);
      }
      
      if (!collides && !(this.scroll && this.scroll.position.equals(currentFood))) {
        this.food = currentFood;
      }
    }
  }
  
  generateScroll() {
    delete this.scroll;
    
    this.scroll = {};
    
    var random = Math.random() * 100;
    // var random = 75 + Math.random() * 25;
    
    if (random < 80) {
      this.scroll.type = "wisdom";
    } else if (random < 84) {
      this.scroll.type = "mirror";
    } else if (random < 88) {
      this.scroll.type = "reverse";
    } else if (random < 92) {
      this.scroll.type = "greedy";
    } else if (random < 96) {
      this.scroll.type = "lazy";
    } else {
      this.scroll.type = "voracious";
    }
    
    while (!this.scroll.position) {
      var currentScrollPositionX = Math.floor(Math.random() * this.width);
      var currentScrollPositionY = Math.floor(Math.random() * this.height);
      var currentScrollPosition = new Position(currentScrollPositionX, currentScrollPositionY);
      
      var collides = false;
      
      for (var i = 0; i < this.obstacles.length && !collides; i++) {
        collides = this.obstacles[i].equals(currentScrollPosition);
      }
      
      for (var i = 0; i < snake.positions.length && !collides; i++) {
        collides = snake.positions[i].equals(currentScrollPosition);
      }
      
      if (!collides && !this.food.equals(currentScrollPosition)) {
        this.scroll.position = currentScrollPosition;
      }
    }
  }
  
  loadImages() {
    this.images = {};
    
    this.images.obstacle = imageLoader.queueImage("images/Untitled.png");
    this.images.food     = imageLoader.queueImage("images/Untitled.png");
    this.images.scrolls  = {
      "wisdom"    : imageLoader.queueImage("images/scrolls/wisdom.png"),
      "mirror"    : imageLoader.queueImage("images/scrolls/mirror.png"),
      "reverse"   : imageLoader.queueImage("images/scrolls/reverse.png"),
      "greedy"    : imageLoader.queueImage("images/scrolls/greedy.png"),
      "lazy"      : imageLoader.queueImage("images/scrolls/lazy.png"),
      "voracious" : imageLoader.queueImage("images/scrolls/voracious.png")
    };
  }
  
  loadAudio() {
    this.audio = {};
    
    this.audio.start      = new Audio("audio/start.mp3");
    this.audio.background = new Audio("audio/background.mp3");
    this.audio.background.volume = 0.3;
    this.audio.background.loop = true;
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
    
    arenaDrawer.drawTile(this.images.scrolls[this.scroll.type], this.scroll.position.x, this.scroll.position.y);
  }
}
