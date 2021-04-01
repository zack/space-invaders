class Game {
  constructor(width, height, fps) {
    this.CANVAS = document.getElementById('space-invaders-field');
    this.FIELD = this.CANVAS.getContext('2d');

    this.CANVAS_HEIGHT = height;
    this.CANVAS_WIDTH = width;

    this.CANVAS.width = this.CANVAS_WIDTH;
    this.CANVAS.height = this.CANVAS_HEIGHT;

    this.GAME_HEIGHT = this.CANVAS_HEIGHT;
    this.GAME_WIDTH  = this.CANVAS_WIDTH;

    this.GAME_TICK_RATE = fps/60;

    this.DIRECTIONS = {
      'left':  ['a', 'A', 'ArrowLeft'],
      'right': ['d', 'D', 'ArrowRight']
    }

    this.initEventBindings();
    this.game_clock = null;
  }

  initEventBindings() {
    window.addEventListener("keydown", (e) => {
      this.handleKeyDown(e.key, this.game_state);
    });

    window.addEventListener("keyup", (e) => {
      this.handleKeyUp(e.key, this.game_state);
    });
  }

  generateInitState() {
    const starting_player = this.generateStartingPlayer();

    return {
      pending_direction: null,
      running: 1,
      player: starting_player,
    };
  }

  generateStartingPlayer() {
    return new Player(
      this.GAME_WIDTH,
      this.GAME_HEIGHT
    );
  }

  killGameClock() {
    clearInterval(this.game_clock);
  }

  startGame() {
    this.killGameClock();
    this.clearField(this.FIELD);
    this.game_state = this.generateInitState();

    this.game_clock = setInterval(this.gameTick.bind(this), this.GAME_TICK_RATE);
  }

  killGame() {
    this.killGameClock();
    this.drawGameOver();
  }


  drawGameOver() {
    this.FIELD.font = "30px Helvetica";
    const go_text = "GAME OVER";
    const go_text_width = this.FIELD.measureText(go_text).width;

    this.FIELD.fillStyle = "red";
    this.FIELD.fillText(
      go_text,
      this.CANVAS_WIDTH/2 - go_text_width/2,
      this.CANVAS_HEIGHT/2
    );

    this.FIELD.font = "15px Helvetica";
    const instr_text = "PRESS 'R' TO PLAY AGAIN";
    const instr_text_width = this.FIELD.measureText(instr_text).width;

    this.FIELD.fillStyle = "black";
    this.FIELD.fillText(
      instr_text,
      this.CANVAS_WIDTH/2 - instr_text_width/2,
      this.CANVAS_HEIGHT/2 + 15
    );
  }

  clearField() {
    this.FIELD.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  }

  drawGame({direction, player}) {
    this.clearField();
    player.draw(this.FIELD);
    this.updateScore(0);
  }

  updateScore(score) {
    document.getElementById('points').textContent = score;
  }

  updateGame(state) {
    if (state.pending_direction !== null) {
      state.player.move(state.pending_direction);
    }

    return {
      pending_direction: state.pending_direction,
      running: state.running,
      player: state.player
    }
  }

  handleKeyDown(key, state) {
    if (key === 'r' || key === 'R') {
      this.startGame();
    } else {
      const selected_dir = Object.keys(this.DIRECTIONS).reduce((acc, dir) => {
        if (this.DIRECTIONS[dir].includes(key)) {
          return dir;
        } else {
          return acc;
        }
      }, null);

      this.game_state.pending_direction = selected_dir;
    }
  }

  handleKeyUp(key, state) {
    const selected_dir = Object.keys(this.DIRECTIONS).reduce((acc, dir) => {
      if (this.DIRECTIONS[dir].includes(key)) {
        return dir;
      } else {
        return acc;
      }
    }, null);

    if (selected_dir === state.pending_direction) {
      this.game_state.pending_direction = null;
    }
  }

  gameTick() {
    this.game_state = this.updateGame(this.game_state);

    if (false) {
      this.killGame();
    } else {
      this.drawGame(this.game_state);
    }
  }
}

class Player {
  constructor(game_width, game_height) {
    this.player_x = game_width / 2;
    this.player_y = game_height - 30;

    this.player_size = 20;

    this.min_x = 0;
    this.max_x = game_width - this.player_size;

    this.sprite = new Image();
    this.sprite.src = 'ship.png';

  }

  getLocation() {
    return {'x': this.player_x, 'y': this.player_y};
  }

  collidesWith(coord) {
    return (coord['x'] === this.player_x && coord['y'] === this.player_y);
  }

  move(direction) {
    if (direction === 'left') {
      this.player_x = Math.max(this.min_x + this.player_size / 2, this.player_x - 5);
    } else if (direction === 'right') {
      this.player_x = Math.min(this.max_x + this.player_size / 2, this.player_x + 5);
    }
  }

  draw(canvas) {
    canvas.drawImage(
      this.sprite,
      this.player_x - this.player_size/2,
      this.player_y,
      this.player_size,
      this.player_size
    );
  }
}

const game = new Game(500, 560, 60);
game.startGame();
