// Enemies our player must avoid
class Enemy {
  constructor(rightBoundaryLimit = 410) {
    this.sprite = "images/enemy-bug.png";
    this.configureInitialPosition();
    this.rightBoundaryLimit = rightBoundaryLimit;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(dt) {
    this.x += this.speed * dt;
    this.keepEnemyInsideCanvas();
    if (this.didCollideWithPlayer(player)) {
      player.resetPosition();
    }
  }

  didCollideWithPlayer(player) {
    // Source: http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/#d-collision-detection
    // Here object 1 is Player, Object 2 is enemy
    const playerWidth = 60;
    const enemyWidth = 100;
    const height = 30;
    if (
      player.x < this.x + enemyWidth &&
      player.x + playerWidth > this.x &&
      player.y < this.y + height &&
      player.y + height > this.y
    ) {
      // The objects are touching
      return true;
    }
    return false;
  }

  configureInitialPosition() {
    this.x = -50;
    // Giving a random position;
    const minLimit = 50;
    const maxLimit = 200;
    this.y = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
    this.initialPosition = { x: this.x, y: this.y };
    /// Giving a random speed;
    this.speed = Math.floor(Math.random() * 101);
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Keeping the player within limits. This is more of a bounding box check.
  keepEnemyInsideCanvas() {
    /// Resetting position if enemy crosses the right boundary since they flow from the left.
    /// Giving an offset so that the transition from right most position to initial position looks smooth.
    const offset = 130;
    const rightBoundaryLimit = this.rightBoundaryLimit + offset;
    if (this.x > rightBoundaryLimit) {
      this.configureInitialPosition();
    }
  }
}

class Player {
  /// Giving an initial position of left-bottom-corner.
  constructor(
    x = 0,
    y = 410,
    leftBoundaryLimit = 0,
    rightBoundaryLimit = 410,
    bottomBoundaryLimit = 430,
    upperBoundaryLimit = 0
  ) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
    this.rightBoundaryLimit = rightBoundaryLimit;
    this.leftBoundaryLimit = leftBoundaryLimit;
    this.bottomBoundaryLimit = bottomBoundaryLimit;
    this.upperBoundaryLimit = upperBoundaryLimit;
    this.initialPosition = { x, y };
  }
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  update(dt) {
    this.keepPlayerInsideCanvas();
    this.resetPositionIfGoalIsReached();
  }

  /// Resetting player's position to initial position if player reaches water.
  resetPositionIfGoalIsReached() {
    if (this.y < this.upperBoundaryLimit) {
        alert("Yayy! You won!")
      this.resetPosition();
    }
  }

  resetPosition() {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
  }
  // Keeping the player within limits. This is more of a bounding box check.
  keepPlayerInsideCanvas() {
    /// Making sure player is not behind the left canvas boundary.
    if (this.x < this.leftBoundaryLimit) {
      this.x = this.leftBoundaryLimit;
    }
    /// Making sure player is not across the right canvas boundary.
    if (this.x > this.rightBoundaryLimit) {
      this.x = this.rightBoundaryLimit;
    }
    /// Making sure player is not above the bottom canvas boundary.
    if (this.y > this.bottomBoundaryLimit) {
      this.y = this.bottomBoundaryLimit;
    }
  }

  // Draw the Player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(keyPressed) {
    const delta = 50;
    switch (keyPressed) {
      case leftKeyPress:
        this.x -= delta;
        break;
      case upKeyPress:
        this.y -= delta;
        break;
      case rightKeyPress:
        this.x += delta;
        break;
      case downKeyPress:
        this.y += delta;
        break;
    }
  }
}

// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];

let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
const leftKeyPress = Symbol("leftKeyPress");
const upKeyPress = Symbol("upKeyPress");
const rightKeyPress = Symbol("rightKeyPress");
const downKeyPress = Symbol("downKeyPress");
document.addEventListener("keyup", function(e) {
  const allowedKeys = {
    37: leftKeyPress,
    38: upKeyPress,
    39: rightKeyPress,
    40: downKeyPress
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
