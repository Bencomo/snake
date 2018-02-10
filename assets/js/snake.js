//Copyright (c) 2016-2018 Benfont, Ltd. all rights reserved

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  window.ctx = canvas.getContext('2d');
  document.addEventListener('keydown', keyPush);
};
// disabling arrow keys to scroll in browser so the player can use them during gameplay
window.addEventListener(
  'keydown',
  function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false,
);

// global variables
px = py = 10; // playerx, playery
gs = tc = 20; // grid size, tile counts
ax = ay = 15; // red dot x, red dot y
xv = yv = 0; // x and y velocity values for the snake
trail = []; // path to follow by the snake tale
tail = 5; // original tail value (snake original size)
var dead = false;
var gameState = 0;

//---------------FPS--------------//
var FPS = 60;
setInterval(function() {
  main();
}, 1000 / 15);

//---------------MAIN FUNCTION-(siblings)--------------//
function main() {
  gameStateZero();
  start();
  restart();
  gameOver();
  game();
}

//-----------------Loading images------------------//
imgIntro = new Image();
imgDead = new Image();
imgIntro.src = 'assets/images/intro.jpg';
imgDead.src = 'assets/images/gameover.jpg';

//-----------------ON LOAD - INTRO SCREEN------------------//
function gameStateZero() {
  if (gameState == 0) {
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(imgIntro, 0, 0, 400, 400, 0, 0, 400, 400);
  }
}

//-----------------START ON CLICK------------------//
function start() {
  document.addEventListener('mousedown', function(event) {
    if (event.isTrusted && gameState == 0) {
      gameState = 1;
      game();
    }
  });
}
//-----------------RESTART ON CLICK------------------//
function restart() {
  document.addEventListener('mousedown', function(event) {
    if (event.isTrusted && dead == true) {
      location.reload(false); // reloading game from cache
    }
  });
}

//-----------------GAME OVER------------------//
function gameOver() {
  if (dead == true) {
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(imgDead, 0, 0, 400, 400, 0, 0, 400, 400);
    gameState = 2;
  }
}

//-----------------START THE GAME = FUNCTION GAME------------------//

function game() {
  if (gameState == 1) {
    px += xv; // player position
    py += yv; // player velocity
    if (px < 0) {
      px = tc - 1;
    }
    if (px > tc - 1) {
      px = 0;
    }
    if (py < 0) {
      py = tc - 1;
    }
    if (py > tc - 1) {
      py = 0;
    }
    ctx.fillStyle = 'black';
    //ctx.fillStyle = 'black'; // drawing the background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white'; // drawing the player
    for (var i = 0; i < trail.length; i++) {
      ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
      //-------------GAME OVER-----------//
      if (trail[i].x == px && trail[i].y == py && (yv !== 0 || xv !== 0)) {
        dead = true; // player is dead
        tail = 5; // resetting the size of the snake
        trail = []; // stop trail from following leader
        xv = 0; // x speed
        yv = 0; // y speed
        // if snake touches itself it goes back to 5 (original size) and GAME OVER
      }
    }
    trail.push({ x: px, y: py });
    while (trail.length > tail) {
      trail.shift();
    }

    if (ax == px && ay == py) {
      tail++; // adding +1 to the snake (tail +1)
      ax = Math.floor(Math.random() * tc);
      ay = Math.floor(Math.random() * tc);
    }
    ctx.fillStyle = 'red'; // drawing the +1 dot
    ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
  }
}

//detecting keyboard input
function keyPush(evt) {
  switch (evt.keyCode) {
    case 37: // key left
      xv = -1;
      yv = 0;
      break;
    case 38: // key up
      xv = 0;
      yv = -1;
      break;
    case 39: // key right
      xv = 1;
      yv = 0;
      break;
    case 40: // key down
      xv = 0;
      yv = 1;
      break;
  }
}
