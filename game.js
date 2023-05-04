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

  
  loadSprite('skeleton', 'sprites/skeleton.png');
  loadSprite('block', 'sprites/block.png');
  loadSprite('bg', 'sprites/bg.png')
  loadSprite('locked-door1', 'sprites/locked-door1.png')
  loadSprite('locked-door2', 'sprites/locked-door2.png')
  loadSprite('left-statue', 'sprites/left-statue.png')
  loadSprite('right-statue', 'sprites/right-statue.png')
  loadSprite('downstairs', 'sprites/downstairs.png')
  loadSprite('upstairs', 'sprites/upstairs.png')
  loadSprite('slicer', 'sprites/slicer.png')
  loadSprite('sword-right', 'sprites/sword-right.png')
  loadSprite('key', 'sprites/key.png')
  loadSprite('bomb', 'sprites/bomb.png')
  loadSprite('boom', 'sprites/boom.png')
  loadSprite('snake', 'sprites/snake.png')

  

  scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");
    

    // Maps 

    const maps = [
    [

    'aaaaaaaaaaaaaaaa',
    'a  &        @  a',
    'a    x         a',
    'a              a',
    'a  a      > a  a',
    'a  a    }   a  a',
    'a  a        a  |',
    'a  a        a  )',
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
    'a              a',
    'a          è   a',
    'a&            @a',
    'aaaaaaaaaaaaaaaa',
  
      ],
    ];  
     

  // Configuration des niveaux

    const levelCfg = {
        width: 16,
        height: 16,
        'a': () => [sprite('block'), 'wall', area(), solid()],
        '}': () => [sprite('skeleton'), 'skeleton', 'dangerous', area(), solid(), {dir: -1, timer: 0}],
        'x': () => [sprite('bomb'), area(), solid(), 'bomb'],
        'k': () => [sprite('key'), area(), solid(), 'key'],        
        'è': () => [sprite('slicer'), 'slicer', 'dangerous', area(), {dir: -1}],
        '$': () => [sprite('snake'), 'snake', 'dangerous', area(), {dir: -1}],
        '|': () => [sprite("locked-door1"), area(), solid()],
        ')': () => [sprite("locked-door2")],
        '&': () => [sprite("left-statue"), area(), solid()],
        '@': () => [sprite("right-statue"), area(), solid() ],
        '<': () => [sprite("upstairs"), area(), 'previous-level' ],
        '>': () => [sprite("downstairs"), area(), 'next-level'],
        

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
      { value: score },
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
      scale(0.7),
    ]);

    
    // Fond

    add([sprite('bg'), layer('bg')])
     

    // Joueur 

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

    // Attaques 

    function spawnKaboom(p) {
      const obj = add([sprite('boom'), pos(p), area(),  'boom'])
      wait(1, () => {
        destroy(obj)
      })
    }

    onKeyPress('space', () => {
      spawnKaboom(player.pos.add(player.dir.scale(12)))
    })

    // Ramasser objets 

    function addKey() {
      numKeys++;
      keysLabel.text = 'Keys : ${numKeys}';
    }

    function addBomb() {
      numKeys++;
      bombsLabel.text = 'Bombs : ${numBombs}';
    }

    function removeKey() {
      numKeys--;
      keysLabel.text = 'Keys : ${numKeys}';
    }

    function removeBomb() {
      numBombs--;
      bombsLabel.text = 'Bombs : ${numBombs}';
    }

    // Ouvrir porte 



    // Ennemis

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

    player.onCollide('locked-door1', (l) => {
      
      if(numKeys = 0) {
        add([
          text('You need a key to open that door'),
          pos(20, 200)
        ])
      }
    })

    // Collisions

    player.onCollide('next-level', () => {
      go("game", {
        level: (level + 1),
        score: scoreLabel.value,
      });
    });

    player.onCollide('previous-level', () => {
      go("game", {
        level: (level - 1),
        score: scoreLabel.value,
      });
    });

    // Ramasser objets
    player.onCollide('bomb', (b) => {
      addBomb();
      destroy(b);
      
      
    })

    player.onCollide('key', (k) => {
      addKey();
      destroy(k)
      
      
    })
    // Détruire ennemis
    onCollide('boom', 'skeleton', (b,s) => {
      
      wait(1, () => {
        destroy(b)
      })
      destroy(s)
      scoreLabel.value++
      scoreLabel.text = scoreLabel.value
    })

    onCollide('boom', 'snake', (b,s) => {
      
      wait(1, () => {
        destroy(b)
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
    onKeyPress(() => 	go("game", {
          level: 0, score: 0
        }));
  });
  
  
  go("game", { level: 0, score: 0 });
