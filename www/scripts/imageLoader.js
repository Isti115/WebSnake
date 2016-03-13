class QueuedImage {
  constructor(filePath) {
    this.image = new Image;
    this.filePath = filePath;
  }
}

class ImageLoader {
  constructor() {
    this.inProgressImageCount = 0;
    this.queue = [];
  }
  
  queueImage(filePath) {
    var queuedImage = new QueuedImage(filePath);
    
    this.queue.push(queuedImage);
    
    return queuedImage.image;
  }
  
  processQueue(callback) {
    this.callback = callback;
    
    while (this.queue.length > 0) {
      var currentImage = this.queue.shift();
      this.loadImage(currentImage);
    }
  }
  
  loadImage(queuedImage) {
    queuedImage.image.addEventListener("load", this.makeLoadedCallback());
    this.inProgressImageCount++;
    
    queuedImage.image.src = queuedImage.filePath;
  }
  
  makeLoadedCallback() {
    var caller = this;
    
    return function () {
      caller.inProgressImageCount--;
      
      if (caller.isAllLoaded) {
        caller.callback();
      }
    }
  }
  
  imageLoaded() {
    this.inProgressImageCount--;
    
    if (this.isAllLoaded) {
      this.callback();
    }
  }
  
  get isAllLoaded() {
    return this.inProgressImageCount == 0;
  }
}

var imageLoader = new ImageLoader();
