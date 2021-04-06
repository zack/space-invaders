class Game {
  constructor(width, height) {
    this.CANVAS = document.getElementById('space-invaders-field');
    this.FIELD = this.CANVAS.getContext('2d');

    this.CANVAS_HEIGHT = height;
    this.CANVAS_WIDTH = width;

    this.CANVAS.width = this.CANVAS_WIDTH;
    this.CANVAS.height = this.CANVAS_HEIGHT;

    this.GAME_HEIGHT = this.CANVAS_HEIGHT;
    this.GAME_WIDTH  = this.CANVAS_WIDTH;

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
    const aliens = this.generateStartingAliens();

    return {
      pendingDirection: null,
      running: 1,
      player: starting_player,
      aliens: aliens,
      alienDirection: 1,
      alienSpeed: 1,
    };
  }

  generateStartingAliens() {
    let aliens = [];

    const alien_row_length = 11;
    const alien_column_height = 5;

    const alien_x_spacing = 35;
    const alien_y_spacing = 35;

    const starting_x_offset = 20;
    const starting_y_offset = 20;

    for (var x = 0; x < alien_row_length; x++) {
      for (var y = 0; y < alien_column_height; y++) {
        let alien = new Alien(
          x * alien_x_spacing + starting_x_offset,
          y * alien_y_spacing + starting_y_offset,
          this.FIELD
        );

        aliens.push(alien);
      }
    }

    return aliens;
  }

  generateStartingPlayer() {
    return new Player(
      this.GAME_WIDTH,
      this.GAME_HEIGHT,
      this.FIELD
    );
  }

  killGameClock() {
    clearInterval(this.game_clock);
  }

  startGame() {
    this.killGameClock();
    this.clearField(this.FIELD);
    this.game_state = this.generateInitState();

    this.game_clock = setInterval(this.gameTick.bind(this), 1000/60);
  }

  killGame() {
    console.log('killGame');
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

  drawGame({direction, player, aliens}) {
    this.clearField();
    player.draw(this.FIELD);
    aliens.forEach((alien) => alien.draw());
    this.updateScore(0);
  }

  updateScore(score) {
    document.getElementById('points').textContent = score;
  }

  updateAliens(state, aliensAreAtEdge) {
    state.aliens.forEach((alien) => {
      const currentCoords = alien.getLocation();
      const alienMovement = state.alienDirection * state.alienSpeed;
      const newX = currentCoords['x'] + alienMovement;
      alien.updateCoords({'x': newX });
      if (aliensAreAtEdge) {
        alien.updateCoords({'y': currentCoords['y'] += 32 });
      }
    });
  }

  aliensAreAtEdge(aliens, alienDirection) {
    const leftmostX = aliens.reduce((memo, alien) => {
      return Math.min(alien.getLocation()['x'], memo);
    }, aliens[0].getLocation()['x']);

    const rightmostX = aliens.reduce((memo, alien) => {
      return Math.max(alien.getLocation()['x'], memo);
    }, aliens[0].getLocation()['x']);

    return (rightmostX >= this.GAME_WIDTH - 28 || leftmostX <= 1);
  };

  updateGame(state) {
    if (state.pendingDirection !== null) {
      state.player.move(state.pendingDirection);
    }

    const aliensAreAtEdge = this.aliensAreAtEdge(state.aliens, state.alienDirection);
    if (aliensAreAtEdge){
      state.alienDirection = state.alienDirection *= -1;
    }

    this.updateAliens(state, aliensAreAtEdge);
  }

  handleKeyDown(key, state) {
    if (key === 'r' || key === 'R') {
      this.startGame();
    } else {
      this.game_state.pendingDirection = this.getSelectedDir(key);
    }
  }

  handleKeyUp(key, state) {
    const selected_dir = this.getSelectedDir(key);

    if (selected_dir === state.pendingDirection) {
      this.game_state.pendingDirection = null;
    }
  }

  getSelectedDir(key) {
    return Object.keys(this.DIRECTIONS).reduce((acc, dir) => {
      if (this.DIRECTIONS[dir].includes(key)) {
        return dir;
      } else {
        return acc;
      }
    }, null);
  }

  playerLoses(state) {
    const playerCoords = state.player.getLocation();

    let playerLoses = false;

    return state.aliens.reduce((memo, alien) => {
      const alienCoords = alien.getLocation();
      return (memo || (
        playerCoords['y'] > alienCoords['y']
        && playerCoords['y'] < alienCoords['y'] + 28
        && playerCoords['x'] > alienCoords['x']
        && playerCoords['x'] < alienCoords['x'] + 28
      ));
    }, false);
  }

  gameTick() {
    this.updateGame(this.game_state);

    this.drawGame(this.game_state);
    if (this.playerLoses(this.game_state)) {
      this.killGame();
    }
  }
}

