/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Constants */
var SPEED = 40;
var SHOOTING_FREQ = 250;
var SHOOTING_SPEED = 15;
var ENEMY_FREQ = 1500;
var ENEMY_SHOOTING_FREQ = 750;
var SCORE_INCREASE = 10;
var HERO_Y = canvas.height - 30;

/* Helper functions */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colision(target1, target2) {
  return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
         (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width,y);
  ctx.fill();
}

function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(function(star) {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

function paintEnemies(enemies) {
  enemies.forEach(function(enemy) {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    }

    enemy.shots.forEach(function(shot) {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
    });
  });
}

function paintScore(score) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Score: ' + score, 40, 43);
}

function isVisible(obj) {
  return obj.x > -40 && obj.x < canvas.width + 40 &&
         obj.y > -40 && obj.y < canvas.height + 40;
}

function paintHeroShots(heroShots, enemies) {
  heroShots.forEach(function(shot, i) {
    var impact = false;
    for (var l=0; l<enemies.length; l++) {
      var enemy = enemies[l];
      if (!enemy.isDead && colision(shot, enemy)) {
        ScoreSubject.onNext(SCORE_INCREASE);
        enemy.isDead = true;
        shot.x = shot.y = -100;
        impact = true;
        break;
      }
    }

    if (!impact) {
      shot.y -= SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
    }
  });
}

function gameOver(player, enemies) {
  return enemies.some(function(enemy) {
    if (colision(player, enemy)) {
      return true;
    }

    return enemy.shots.some(function(shot) {
      return colision(player, shot);
    });
  });
}

/* Reactive code */

var playerShots = Rx.Observable.merge(
  Rx.Observable.fromEvent(canvas, 'click'),
  Rx.Observable.fromEvent(document, 'keydown')
    .filter(function(evt) {
      return evt.keyCode === 32;
    })
);
var StarStream = Rx.Observable.range(1, 250)
  .map(function() {
    return {
      x: parseInt(Math.random() * canvas.width),
      y: parseInt(Math.random() * canvas.height),
      size: Math.random() * 3 + 1
    };
  })
  .toArray()
  .flatMap(function(arr) {
    return Rx.Observable.interval(SPEED).map(function() {
      return arr.map(function(star) {
        if (star.y >= canvas.height) {
          star.y = 0;
        }
        star.y += star.size;
        return star;
      });
    });
  });

var mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');
var SpaceShip = mouseMove
  .map(function(event) {
    return {x: event.clientX, y: HERO_Y};
  })
  .startWith({x: canvas.width / 2, y: HERO_Y});

var playerFiring = playerShots
  .startWith({})
  .sample(200)
  .timestamp();

var HeroShots = Rx.Observable.combineLatest(
  playerFiring,
  SpaceShip,
  function(shotEvents, spaceShip) {
    return {
      timestamp: shotEvents.timestamp,
      x: spaceShip.x
    };
  })
  .distinct(function(shot) { return shot.timestamp; })
  .scan(function(shotArray, shot) {
    shotArray.push({ x:shot.x, y: HERO_Y });
    return shotArray.filter(isVisible);
  }, []);

var Enemies = Rx.Observable.interval(ENEMY_FREQ)
  .scan(function(enemyArray) {
    var enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30,
      shots: []
    };

    Rx.Observable.interval(ENEMY_SHOOTING_FREQ).subscribe(function() {
      if (!enemy.isDead) {
        enemy.shots.push({ x: enemy.x, y: enemy.y });
      }
      enemy.shots = enemy.shots.filter(isVisible);
    });

    return enemyArray
      .concat(enemy)
      .filter(function(enemy) {
        return isVisible(enemy) && !(enemy.isDead && enemy.shots.length === 0);
      });
  }, []);

var ScoreSubject = new Rx.Subject();
var score = ScoreSubject.scan(function (prev, cur) {
  return prev + cur;
}, 0).startWith(0);

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.enemies);
  paintHeroShots(actors.heroShots, actors.enemies);
  paintScore(actors.score);
}

var Game = Rx.Observable
  .combineLatest(StarStream, SpaceShip, Enemies, HeroShots, score,
    function(stars, spaceship, enemies, heroShots, score) {
      return {
        stars: stars,
        spaceship: spaceship,
        enemies: enemies,
        heroShots: heroShots,
        score: score
      };
    })
  .sample(SPEED)
  .takeWhile(function(actors) {
    var isGameOver = gameOver(actors.spaceship, actors.enemies);
    if (isGameOver === true) {
      actors.enemies.forEach(function(enemy) {
        enemy.isDead = true;
      });
    }
    return isGameOver === false;
  });

Game.subscribe(renderScene);
