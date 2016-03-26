class TileDrawer {
  constructor(context, offsetX, offsetY, tileSize) {
    this.context = context;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.tileSize = tileSize;
  }
  
  drawTile(image, x, y, rotation = 0) {
    this.context.save();
    
    this.context.translate(
      this.offsetX + (this.tileSize / 2) + x * this.tileSize,
      this.offsetY + (this.tileSize / 2) + y * this.tileSize
    );
    
    this.context.rotate(rotation * (Math.PI / 180));
    
    this.context.drawImage(image, -(image.width / 2), -(image.width / 2));
    
    this.context.restore();
  }
  
  drawImage(image, x, y) {
    this.context.drawImage(image, this.offsetX + x, this.offsetY + y);
  }
}
