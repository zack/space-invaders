class Alien {
  constructor(x, y, canvas) {
    this.sprite = new Image();
    this.sprite.src = 'assets/alien.png';
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.direction = 1;
  }

  draw() {
    this.canvas.drawImage(
      this.sprite,
      this.x,
      this.y,
      28,
      20,
    );
  }

  getLocation() {
    return {'x': this.x, 'y': this.y};
  }

  updateCoords({x, y}) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  getDirection() {
    return this.direction;
  }

  setDirection(dir) {
    this.direction = dir;
  }
}
