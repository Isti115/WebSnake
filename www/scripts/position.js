class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  toArray() {
    return [this.x, this.y];
  }
  
  equals(p) {
    return p.x == this.x && p.y == this.y;
  }
  
  move(p) {
    this.x += p.x;
    this.y += p.y;
  }
  
  moveTo(p) {
    this.x = p.x;
    this.y = p.y;
  }
  
  static add(p1, p2) {
    return new Position(p1.x + p2.x, p1.y + p2.y);
  }
  
  static substract(p1, p2) {
    return new Position(p1.x - p2.x, p1.y - p2.y);
  }
  
  static getRotation(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) / Math.PI * 180;
  }
}
