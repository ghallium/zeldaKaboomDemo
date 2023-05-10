kaboom({
  global: true,
  width: 256,
  height: 240,
  font: "sinko",
  scale: 3,
  debug: true,
  clearColor: [0, 0, 1, 1],
});

const MOVE_SPEED = 50;
const SLICER_SPEED = 100
const SKELETOR_SPEED = 60;
const SNAKE_SPEED = 60;
let numKeys = 0;
let numBombs = 0;



// Assets loading

loadSprite("sheet", "sprites/AniaZelda-alt.png", {
  sliceX: 4,
  sliceY: 5,
});

loadSprite("sword-sheet", "sprites/sword-sheet.png", {
  sliceX: 4,
  sliceY: 1,
} )

loadSprite('skeleton', 'sprites/skeleton.png');
loadSprite('block', 'sprites/block.png');
loadSprite('bg', 'sprites/bg.png');
loadSprite('locked-door1', 'sprites/locked-door1.png');
loadSprite('locked-door2', 'sprites/locked-door2.png');
loadSprite('left-statue', 'sprites/left-statue.png');
loadSprite('right-statue', 'sprites/right-statue.png');
loadSprite('downstairs', 'sprites/downstairs.png');
loadSprite('upstairs', 'sprites/upstairs.png');
loadSprite('slicer', 'sprites/slicer.png');
loadSprite('key', 'sprites/key.png');
loadSprite('bomb', 'sprites/bomb.png');
loadSprite('boom', 'sprites/boom.png');
loadSprite('snake', 'sprites/snake.png');
loadSprite('bombable-block', 'sprites/bombable-block.png');
loadSprite('oldman', 'sprites/oldman.png');
loadSprite('door-open', 'sprites/black.png');
loadSprite('exit', 'sprites/black.png');




scene("game", ({ level, score, numBombs, numKeys }) => {
  layers(["bg", "obj", "ui"], "obj");


  // Maps 

  const maps = [
    [

      'aaaaaaaaaaaaaaaa',
      'a  &        @  a',
      'a    x         a',
      'a              a',
      'a  a      > a  a',
      'ak a    }   a  a',
      'a  a        a  |',
      'b  a        a  )',
      'a  a        a  a',
      'a  a        a  a',
      'a  a}       a  a',
      'a              a',
      'a          è   a',
      'a  &       @   a',
      'aaaaaaaaaaaaaaaa',

    ],
    [

      'aaaaaaaaaaaaaaaa',
      'a&            @a',
      'a <            a',
      'a              a',
      'a  aaaaaaaaaa  a',
      'a  a$       a  a',
      'a  a        a  a',
      'a  a   k    a  a',
      'a  a        a  a',
      'a  a       $a  a',
      'a  aa      aa  a',
      'a    x         a',
      'a          è   a',
      'a&            @a',
      'aaaaaaaaaaaaaaaa',

    ],
    [

      'aaaaaaaaaaaaaaaa',
      'a&            @a',
      'a              a',
      'a              a',
      'a  aaaaaaaaaa  a',
      'a  a        a  a',
      'a  a    o   a  a',
      'e  aa      aa  a',
      'e              a',
      'a              a',
      'a              a',
      'a              a',
      'a              a',
      'a&            @a',
      'aaaaaaaaaaaaaaaa',

    ],
  ];


  // Level config

  const levelCfg = {
    width: 16,
    height: 16,
    'a': () => [sprite('block'), 'wall', area(), solid()],
    'b': () => [sprite('bombable-block'), 'wall', area(), solid()],
    '}': () => [sprite('skeleton'), 'skeleton', 'dangerous', area(), solid(), { dir: -1, timer: 0 }],
    'x': () => [sprite('bomb'), area(), solid(), 'bomb'],
    'k': () => [sprite('key'), area(), solid(), 'key'],
    'è': () => [sprite('slicer'), 'slicer', 'dangerous', area(), { dir: -1 }],
    '$': () => [sprite('snake'), 'snake', 'dangerous', area(), { dir: -1 }],
    '|': () => [sprite("locked-door1"), 'locked-door1', area()],
    ')': () => [sprite("locked-door2")],
    '&': () => [sprite("left-statue"), area(), solid()],
    '@': () => [sprite("right-statue"), area(), solid()],
    '<': () => [sprite("upstairs"), area(), 'previous-level'],
    '>': () => [sprite("downstairs"), area(), 'next-level'],
    'o': () => [sprite("oldman"), area(), 'oldman'],
    '#': () => [sprite("door-open"), area(), 'go-locked-room'],
    'e': () => [sprite("exit"), area(), 'back-main-level'],


  }
  addLevel(maps[level], levelCfg);

  // UI

  const scoreLabel = add([
    text("0"),
    pos(200, 180),
    layer("ui"),
    { value: score },
    // { value: 2 },
    scale(0.7),
  ]);

  const keysLabel = add([
    text("Keys : "),
    pos(200, 200),
    layer("ui"),
    { value: numKeys },
    // { value: 2 },
    scale(0.7),
  ]);

  const levelLabel = add([
    text("Room " + parseInt(level + 1)), //
    pos(200, 215),
    scale(0.7),
  ]);

  const bombsLabel = add([
    text("Bombs : "), //
    pos(200, 230),
    layer("ui"),
    { value: numBombs },
    scale(0.7),
  ]);


  // Background

  add([sprite('bg'), layer('bg')])


  // Player 

  const player = add([
    sprite("sheet", { frame: 14 }), //
    pos(30, 60),
    area(),
    solid(),
    { dir: vec2(1, 0) },
  ]);

  onKeyDown("left", () => {
    player.frame = 15;
    player.move(-MOVE_SPEED, 0);
    player.dir = vec2(-1, 0);
  });

  onKeyDown("right", () => {
    player.frame = 14;
    player.move(MOVE_SPEED, 0);
    player.dir = vec2(1, 0);
  });

  onKeyDown("up", () => {
    player.frame = 13;
    player.move(0, -MOVE_SPEED);
    player.dir = vec2(0, -1);
  });

  onKeyDown("down", () => {
    player.frame = 12;
    player.move(0, MOVE_SPEED);
    player.dir = vec2(0, 1);
  });

  // Attacks 

  let attacking = false; 
  let attackDir;

  function attack() {
    const playerPos = player.pos;
  
    const swordFrames = add([
      sprite("sword-sheet", { frame: 0 }),
      'sword',
      pos(playerPos),
      area(),
    ]);
  
    attacking = true;
  
    if (player.frame === 13) {
      attackDir = vec2(0, -1);
      swordFrames.frame = 0;
      swordFrames.pos.y -= 12;
    } else if (player.frame === 12) {
      attackDir = vec2(0, 1);
      swordFrames.frame = 1;
      swordFrames.pos.y += 12;
    } else if (player.frame === 15) {
      attackDir = vec2(-1, 0);
      swordFrames.frame = 2;
      swordFrames.pos.x -= 12;
    } else if (player.frame === 14) {
      attackDir = vec2(1, 0);
      swordFrames.frame = 3;
      swordFrames.pos.x += 12;
    }
  
    wait(0.2, () => {
      attacking = false;
      if (player.frame === 13) {
        player.frame = 13; // Go back to frame 13 (player look up)
      } else if (player.frame === 12) {
        player.frame = 12; // Go back to frame 12 (player look down)
      } else {
        player.frame = player.dir.x === 1 ? 14 : 15;
      }
    });
  
    wait(0.2, () => {
      destroy(swordFrames);
    });
  }
  
  onKeyPress('space', () => { // bind to the space key
  if (!attacking) { // only attack if not already attacking
    attack(); 
  }
})

  function dropBomb(playerPos) {
    const bomb = add([sprite('bomb'), pos(playerPos), area(), 'bomb'])
    wait(1, () => {
      destroy(bomb)
    })
  }

  onKeyPress('b', () => {
    if (numBombs >= 1) {
      dropBomb(player.pos.add(player.dir.scale(12)))
    }
    
  })
 
  function spawnFire(p) {
    const obj = add([sprite('boom'), pos(p), area(), 'boom'])
    wait(1, () => {
      destroy(obj)
    })
  }

  onKeyPress('z', () => {
    spawnFire(player.pos.add(player.dir.scale(12)))
  })

  // Items functions

  function addKey() {
    numKeys++;
    keysLabel.text = 'Keys : ' + numKeys;

  }

  function addBomb() {
    numBombs++;
    bombsLabel.text = 'Bombs : ' + numBombs;

  }

  function removeKey() {
    numKeys--;
    keysLabel.text = 'Keys : ' + numKeys;
  }

  function removeBomb() {
    numBombs--;
    bombsLabel.text = 'Bombs : ' + numBombs;
  }

  // Enemies

  onUpdate('slicer', (s) => {

    s.move(s.dir * SLICER_SPEED, 0)
  });

  onCollide('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  onUpdate('snake', (s) => {

    s.move(s.dir * SNAKE_SPEED, 0)
  });

  onCollide('snake', 'wall', (s) => {
    s.dir = -s.dir
  })

  onUpdate('skeleton', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  });

  /*
  ------------------
  COLLISIONS
  ------------------
  */

  // Open door 

  player.onCollide('locked-door1', (l) => {
  if (numKeys > 0) {
    l.use(sprite('door-open')),
    removeKey(),
    go("game", {
      level: 2, // go level 2
      score: scoreLabel.value,
      numBombs: numBombs,
      numKeys: numKeys,
    });
  } else {
    // Player doesn't have the key to open the doom
    // Add a logic here to display a message or do another action
    const textObject = add([
        pos(20, 180),
        text("The door is locked. Find a key.", {
            size: 12, // 12 pixels tall
            width: 150, // it'll wrap to next line when width exceeds this value
            font: "sinko", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
        })
        
      ]);
      wait(1, () => {
        destroy(textObject);
      });  
  }
});


  /*player.onCollide('locked-door1', (l) => {

    if (numKeys === 0) {
      const textObject = add([
        pos(20, 180),
        text("The door is locked. Find a key, connard.", {
            size: 12, // 12 pixels tall
            width: 150, // it'll wrap to next line when width exceeds this value
            font: "sinko", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
        })
        
      ]);
      wait(1, () => {
        destroy(textObject);
      });  
    } else if (numKeys >= 0) {
      l.use(sprite('door-open'))
      
    }
  })*/

  // Old Man 

  player.onCollide('oldman', () => {
    const textObject = add([
      pos(20, 180),
      text("Hahah, wrong way son ! Have you found a bomb ?", {
          size: 12, // 12 pixels tall
          width: 150, // it'll wrap to next line when width exceeds this value
          font: "sinko", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
      }),
    ]);
    
    wait(1, () => {
      destroy(textObject);
    });
  })

  // Change level

  player.onCollide('next-level', () => {
    go("game", {
      level: (level + 1),
      score: scoreLabel.value,
      numBombs: numBombs,
      numKeys: numKeys,
    });
  });

  player.onCollide('go-locked-room', () => {
    go("game", {
      level: (level + 2),
      score: scoreLabel.value,
      numBombs: numBombs,
      numKeys: numKeys,
    });
    removeKey();
  });

  player.onCollide('previous-level', () => {
    go("game", {
      level: (level - 1),
      score: scoreLabel.value,
      numBombs: numBombs,
      numKeys: numKeys,
    });
  });

  player.onCollide('back-main-level', () => {
    go("game", {
      level: (level - 2),
      score: scoreLabel.value,
      numBombs: numBombs,
      numKeys: numKeys,
    });
  });

  // Picking items
  player.onCollide('bomb', (b) => {
    addBomb();
    destroy(b);


  })

  player.onCollide('key', (k) => {
    addKey();
    destroy(k)


  })
  // Destroy enemies
  onCollide('boom', 'skeleton', (b, s) => {

    wait(1, () => {
      destroy(b)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  onCollide('sword', 'skeleton', (w, s) => {

    wait(1, () => {
      destroy(w)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  onCollide('boom', 'snake', (b, s) => {

    wait(1, () => {
      destroy(b)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  onCollide('sword', 'snake', (w, s) => {

    wait(1, () => {
      destroy(w)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  // die
  player.onCollide('dangerous', () => {
    go('lose');
  });
})

scene("lose", () => {
  add([
    text("Game Over"),
    pos(85, 100),
  ])
  add([
    text("Press any key to try again"),
    pos(20, 115),
  ])
  onKeyPress(() => go("game", {
    level: 0, score: 0
  }));
});


go("game", { level: 0, score: 0, numBombs: numBombs, numKeys: numKeys });
