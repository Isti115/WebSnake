class Snake {
  constructor(field) {
    this.direction = [1, 0];
    this.positions = [];
    this.head = new Position(0, 5);
  }
  
  loadImages() {
    this.images = {};
    
    this.images.head     = imageLoader.queueImage("images/Untitled.png");
    this.images.neck     = imageLoader.queueImage("images/Untitled.png");
    this.images.neckTurn = imageLoader.queueImage("images/Untitled.png");
    this.images.body     = imageLoader.queueImage("images/Untitled.png");
    this.images.bodyTurn = imageLoader.queueImage("images/Untitled.png");
    this.images.tail     = imageLoader.queueImage("images/Untitled.png");
  }
  
  draw() {
    
  }
}
