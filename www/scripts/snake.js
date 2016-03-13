class Snake {
  constructor(field) {
    this.direction = new Position(1, 0);
    
    this.positions = [];
    
    this.positions.push(new Position(0, 5));
    this.positions.push(new Position(1, 5));
    this.positions.push(new Position(2, 5));
    this.positions.push(new Position(3, 5));
    
    // this.positions.push(new Position(-3, 5));
    // this.positions.push(new Position(-2, 5));
    // this.positions.push(new Position(-1, 5));
    // this.positions.push(new Position( 0, 5));
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
  
  update() {
    for (var i = 0; i < this.positions.length - 1; i++) {
      this.positions[i].moveTo(this.positions[i + 1]);
    }
    
    this.positions[this.positions.length - 1].move(this.direction);
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
      console.log("neckturn");
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
