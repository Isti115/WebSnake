var normalDirections = {
  "up": new Position(0, -1),
  "down": new Position(0, 1),
  "left": new Position(-1, 0),
  "right": new Position(1, 0)
};

var mirroredDirections = {
  "down": new Position(0, -1),
  "up": new Position(0, 1),
  "right": new Position(-1, 0),
  "left": new Position(1, 0)
};

var effects = {
  "wisdom"    : function(snake) {
    snake.length += 4;
  },
  "mirror"    : function(snake) {
    snake.activeDirections = mirroredDirections;
  },
  "reverse"   : function(snake) {
    snake.direction = new Position(
      snake.positions[0].x - snake.positions[1].x,
      snake.positions[0].y - snake.positions[1].y
    );
    snake.positions.reverse();
  },
  "greedy"    : function(snake) {
    stepDelay = baseStepDelay / 1.5;
    
    snake.activeEffectEnd = new Date();
    snake.activeEffectEnd.setSeconds(snake.activeEffectEnd.getSeconds() + 5);
  },
  "lazy"      : function(snake) {
    stepDelay = baseStepDelay * 1.5;
    
    snake.activeEffectEnd = new Date();
    snake.activeEffectEnd.setSeconds(snake.activeEffectEnd.getSeconds() + 5);
  },
  "voracious" : function(snake) {
    snake.length += 10;
  }
};

class Snake {
  constructor() {
    this.activeDirections = normalDirections;
    this.direction = this.activeDirections.right;
    
    this.positions = [];
        
    this.positions.push(new Position(-3, field.entrance));
    this.positions.push(new Position(-2, field.entrance));
    this.positions.push(new Position(-1, field.entrance));
    this.positions.push(new Position( 0, field.entrance));

    this.length = this.positions.length;
    
    this.died = false;
  }
  
  loadImages() {
    this.images = {};
    
    this.images.tail        = imageLoader.queueImage("images/snake/tail.png");
    this.images.preTail     = imageLoader.queueImage("images/snake/preTail.png");
    this.images.preTailTurn = {
                      "-90" : imageLoader.queueImage("images/snake/preTailTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/snake/preTailTurnRight.png")
    };
    this.images.body        = imageLoader.queueImage("images/snake/body.png");
    this.images.bodyTurn    = {
                      "-90" : imageLoader.queueImage("images/snake/bodyTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/snake/bodyTurnRight.png")
    };
    this.images.neck        = imageLoader.queueImage("images/snake/neck.png");
    this.images.neckTurn    = {
                      "-90" : imageLoader.queueImage("images/snake/neckTurnLeft.png"),
                       "90" : imageLoader.queueImage("images/snake/neckTurnRight.png")
    };
    this.images.head        = imageLoader.queueImage("images/snake/head.png");
  }
  
  loadAudio() {
    this.audio = {};
    
    this.audio.eat = new Audio("audio/eat.mp3");
    
    this.audio.effects = {
      "wisdom"    : new Audio("audio/wisdom.mp3"),
      "mirror"    : new Audio("audio/mirror.mp3"),
      "reverse"   : new Audio("audio/reverse.mp3"),
      "greedy"    : new Audio("audio/greedy.mp3"),
      "lazy"      : new Audio("audio/lazy.mp3"),
      "voracious" : new Audio("audio/voracious.mp3")
    };
    
    this.audio.end = new Audio("audio/end.mp3");
  }
  
  applyEffect(effectName) {
    console.log(`Applying: ${effectName}`);
    
    // Clearing
    
    delete this.activeEffectEnd;
    this.activeDirections = normalDirections;
    stepDelay = baseStepDelay;
    
    if (effectName == "clear") {
      return;
    }
    
    this.activeEffect = effectName;
    this.audio.effects[effectName].play();
    effects[effectName](this);
  }
  
  keyDown(e) {
    if (e.keyCode == 38) {
      if (this.direction.y == 0) {
        this.updatedDirection = this.activeDirections.up;
        delete this.queuedDirection;
      } else {
        this.queuedDirection = this.activeDirections.up;
      }
    } else if (e.keyCode == 40) {
      if (this.direction.y == 0) {
        this.updatedDirection = this.activeDirections.down;
        delete this.queuedDirection;
      } else {
        this.queuedDirection = this.activeDirections.down;
      }
    } else if (e.keyCode == 37) {
      if (this.direction.x == 0) {
        this.updatedDirection = this.activeDirections.left;
        delete this.queuedDirection;
      } else {
        this.queuedDirection = this.activeDirections.left;
      }
    } else if (e.keyCode == 39) {
      if (this.direction.x == 0) {
        this.updatedDirection = this.activeDirections.right;
        delete this.queuedDirection;
      } else {
        this.queuedDirection = this.activeDirections.right;
      }
    }
    
    // Cheats
    
    if (e.keyCode == 192) {
      this.died = false;
      
      main();
      // mainInterval = setInterval(main, stepDelay);
    }
    
    if (e.keyCode == 82) {
      snake.applyEffect("reverse");
    }
  }
  
  update() {
    if (this.activeEffectEnd && this.activeEffectEnd < new Date()) {
      this.applyEffect("clear");
      delete this.activeEffectEnd;
    }
    
    // Updating direction
    
    if (this.updatedDirection) {
      this.direction = this.updatedDirection;
      delete this.updatedDirection;
      
      if (this.queuedDirection) {
        this.updatedDirection = this.queuedDirection;
        delete this.queuedDirection;
      }
    }
    
    var headPosition = this.positions[this.positions.length - 1];
    
    // Checking for collision
    
    var nextHeadPosition = Position.add(headPosition, this.direction);
    
    var collides = (
      nextHeadPosition.x < 0 || nextHeadPosition.x > field.width - 1 ||
      nextHeadPosition.y < 0 || nextHeadPosition.y > field.height - 1
    );

    for (var i = 0; i < field.obstacles.length && !collides; i++) {
      collides = field.obstacles[i].equals(nextHeadPosition);
    }
    for (var i = (this.length > this.positions.length ? 0 : 1); i < this.positions.length && !collides; i++) {
      collides = this.positions[i].equals(nextHeadPosition);
    }
    
    if (collides) {
      // clearInterval(mainInterval);
      field.audio.background.pause();
      this.audio.end.play();
      this.died = true;
      console.log("%cSnek dieded -> Game ended.", "color:red;font-size:20px;");
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
      this.audio.eat.play();
      this.length++;
      field.generateFood();
    }
    
    if (headPosition.equals(field.scroll.position)) {
      this.applyEffect(field.scroll.type);
      field.generateScroll();
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
