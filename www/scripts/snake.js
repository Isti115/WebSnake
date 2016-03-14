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
    
    this.images.tail        = imageLoader.queueImage("images/tail.png");
    this.images.preTail     = imageLoader.queueImage("images/preTail.png");
    this.images.preTailTurn = {
                      "-90" : imageLoader.queueImage("images/preTailTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/preTailTurnRight.png")
    };
    this.images.body        = imageLoader.queueImage("images/body.png");
    this.images.bodyTurn    = {
                      "-90" : imageLoader.queueImage("images/bodyTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/bodyTurnRight.png")
    };
    this.images.neck = imageLoader.queueImage("images/neck.png");
    this.images.neckTurn    = {
                      "-90" : imageLoader.queueImage("images/neckTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/neckTurnRight.png")
    };
    this.images.head        = imageLoader.queueImage("images/head.png");
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
    
    if (
      nextHeadPosition.x < 0 || nextHeadPosition.x > field.width - 1 ||
      nextHeadPosition.y < 0 || nextHeadPosition.y > field.height - 1
    ) {
      collides = true;
    }
    
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
      let firstAngle = Position.getRotation(tailPosition, preTailPosition);
      let secondAngle = Position.getRotation(preTailPosition, firstBodyPosition);
      let relativeAngle = (firstAngle - secondAngle + 360) % 360 - 180;
      
      arenaDrawer.drawTile(
        this.images.preTailTurn[relativeAngle],
        ...preTailPosition.toArray(),
        Position.getRotation(preTailPosition, firstBodyPosition)
      );
    }
    
    // Body
    
    for (var i = 2; i < this.positions.length - 2; i++) {
      if (this.positions[i + 1].x - this.positions[i].x == this.positions[i].x - this.positions[i - 1].x ) {
        arenaDrawer.drawTile(
          this.images.body,
          ...this.positions[i].toArray(),
          Position.getRotation(this.positions[i], this.positions[i + 1])
        );
      } else {
        let firstAngle = Position.getRotation(this.positions[i - 1], this.positions[i]);
        let secondAngle = Position.getRotation(this.positions[i], this.positions[i + 1]);
        let relativeAngle = (firstAngle - secondAngle + 360) % 360 - 180;
        
        arenaDrawer.drawTile(
          this.images.bodyTurn[relativeAngle],
          ...this.positions[i].toArray(),
          Position.getRotation(this.positions[i], this.positions[i + 1])
        );
      }
    }
    
    // Neck
    
    if (headPosition.x - neckPosition.x == neckPosition.x - lastBodyPosition.x ) {
      arenaDrawer.drawTile(
        this.images.neck,
        ...neckPosition.toArray(),
        Position.getRotation(neckPosition, headPosition)
      );
    } else {
      let firstAngle = Position.getRotation(lastBodyPosition, neckPosition);
      let secondAngle = Position.getRotation(neckPosition, headPosition);
      let relativeAngle = (firstAngle - secondAngle + 360) % 360 - 180;
      
      arenaDrawer.drawTile(
        this.images.neckTurn[relativeAngle],
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
