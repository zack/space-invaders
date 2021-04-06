class Player {
  constructor(game_width, game_height, canvas) {
    this.x = game_width / 2;
    this.y = game_height - 30;

    this.player_size = 20;

    this.min_x = 0;
    this.max_x = game_width - this.player_size;

    this.sprite = new Image();
    this.sprite.src = 'assets/ship.png';

    this.canvas = canvas;
  }

  getLocation() {
    return {'x': this.x, 'y': this.y};
  }

  collidesWith(coord) {
    return (coord['x'] === this.x && coord['y'] === this.y);
  }

  move(direction) {
    if (direction === 'left') {
      this.x = Math.max(this.min_x + this.player_size / 2, this.x - 5);
    } else if (direction === 'right') {
      this.x = Math.min(this.max_x + this.player_size / 2, this.x + 5);
    }
  }

  draw() {
    this.canvas.drawImage(
      this.sprite,
      this.x - this.player_size/2,
      this.y,
      this.player_size,
      this.player_size
    );
  }
}

