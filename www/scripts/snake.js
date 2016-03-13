var directions = {
  "up": new Position(0, -1),
  "down": new Position(0, 1),
  "left": new Position(-1, 0),
  "right": new Position(1, 0)
};

class Snake {
  constructor(field) {
    this.direction = directions.right;
    
    this.positions = [];
    
    // this.positions.push(new Position(0, 5));
    // this.positions.push(new Position(1, 5));
    // this.positions.push(new Position(2, 5));
    // this.positions.push(new Position(3, 5));
    
    this.length = 4;
    
    this.positions.push(new Position(-3, 5));
    this.positions.push(new Position(-2, 5));
    this.positions.push(new Position(-1, 5));
    this.positions.push(new Position( 0, 5));
  }
  
  loadImages() {
    this.images = {};
    
    this.images.tail        = imageLoader.queueImage("images/Untitled.png");
    this.images.preTail     = imageLoader.queueImage("images/Untitled.png");
    this.images.preTailTurn = imageLoader.queueImage("images/Untitled.png");
    this.images.body        = imageLoader.queueImage("images/Untitled.png");
    this.images.bodyTurn    = imageLoader.queueImage("images/Untitled.png");
    this.images.neck        = imageLoader.queueImage("images/Untitled.png");
    this.images.neckTurn    = imageLoader.queueImage("images/Untitled.png");
    this.images.head        = imageLoader.queueImage("images/Untitled.png");
  }
  
  keyDown(e) {
    if (e.keyCode == 38) {
      if (this.direction.y == 0) {
        this.updatedDirection = directions.up;
      }
    } else if (e.keyCode == 40) {
      if (this.direction.y == 0) {
        this.updatedDirection = directions.down;
      }
    } else if (e.keyCode == 37) {
      if (this.direction.x == 0) {
        this.updatedDirection = directions.left;
      }
    } else if (e.keyCode == 39) {
      if (this.direction.x == 0) {
        this.updatedDirection = directions.right;
      }
    }
  }
  
  update() {
    // Updating direction
    
    if (this.updatedDirection) {
      this.direction = this.updatedDirection;
      delete this.updatedDirection;
    }
    
    var headPosition = this.positions[this.positions.length - 1];
    
    // Checking for collision
    
    var nextHeadPosition = Position.add(headPosition, this.direction);
    
    var collides = false;
    
    for (var i = 0; i < field.obstacles.length && !collides; i++) {
      collides = field.obstacles[i].equals(nextHeadPosition);
    }
    for (var i = 0; i < this.positions.length && !collides; i++) {
      collides = this.positions[i].equals(nextHeadPosition);
    }
    
    if (collides) {
      clearInterval(mainInterval);
      dieded = true;
      return;
    }
    
    // Growing
    
    if (this.length > this.positions.length) {
      this.positions.unshift(new Position(0, 0));
    }
    
    // Moving
    
    for (var i = 0; i < this.positions.length - 1; i++) {
      this.positions[i].moveTo(this.positions[i + 1]);
    }
    
    headPosition.move(this.direction);
    
    if (headPosition.equals(field.food)) {
      this.length++;
      field.generateFood();
    }
  }
  
  draw() {
    var
    tailPosition      = this.positions[0],
    preTailPosition   = this.positions[1],
    firstBodyPosition = this.positions[2],
    lastBodyPosition  = this.positions[this.positions.length - 3],
    neckPosition      = this.positions[this.positions.length - 2],
    headPosition      = this.positions[this.positions.length - 1]
    ;
    
    // Tail
    
    arenaDrawer.drawTile(
      this.images.tail,
      ...tailPosition.toArray(),
      Position.getRotation(tailPosition, preTailPosition)
    );
    
    // PreTail
    
    if (firstBodyPosition.x - preTailPosition.x == preTailPosition.x - tailPosition.x ) {
      arenaDrawer.drawTile(
        this.images.preTail,
        ...preTailPosition.toArray(),
        Position.getRotation(preTailPosition, firstBodyPosition)
      );
    } else {
      arenaDrawer.drawTile(
        this.images.preTailTurn,
        ...preTailPosition.toArray(),
        Position.getRotation(preTailPosition, firstBodyPosition)
      );
    }
    
    // Body
    
    for (var i = 2; i < this.positions.length - 2; i++) {
      arenaDrawer.drawTile(
        this.images.body,
        ...this.positions[i].toArray(),
        Position.getRotation(this.positions[i], this.positions[i + 1])
      );
    }
    
    // Neck
    
    if (headPosition.x - neckPosition.x == neckPosition.x - lastBodyPosition.x ) {
      arenaDrawer.drawTile(
        this.images.neck,
        ...neckPosition.toArray(),
        Position.getRotation(neckPosition, headPosition)
      );
    } else {
      arenaDrawer.drawTile(
        this.images.neckTurn,
        ...neckPosition.toArray(),
        Position.getRotation(neckPosition, headPosition)
      );
    }
    
    // Head
    
    arenaDrawer.drawTile(
      this.images.head,
      ...headPosition.toArray(),
      Position.getRotation(neckPosition, headPosition)
    );
  }
}
