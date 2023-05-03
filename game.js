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
  let numberOfKeys = 0;
  let numberOfBombs = 0;
  

  // Assets loading

  loadSprite("sheet", "sprites/AniaZelda-alt.png", {
    sliceX: 4,
    sliceY: 5,
  });

  
  loadSprite('skeleton', 'sprites/skeleton.png');
  loadSprite('block', 'sprites/block.png');
  loadSprite('bg', 'sprites/bg.png')
  loadSprite('right-door', 'sprites/right-door.png')
  loadSprite('left-statue', 'sprites/left-statue.png')
  loadSprite('right-statue', 'sprites/right-statue.png')
  loadSprite('downstairs', 'sprites/downstairs.png')
  loadSprite('slicer', 'sprites/slicer.png')
  loadSprite('sword-right', 'sprites/sword-right.png')
  loadSprite('key', 'sprites/key.png')
  loadSprite('bomb', 'sprites/bomb.png')
  loadSprite('boom', 'sprites/boom.png')

  

  scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");
    

    // Maps 

    const maps = 
    [

    'aaaaaaaaaaaaaaaa',
    'a  &        @  a',
    'a      x       a',
    'a              a',
    'a  a      > a  a',
    'a  a    }   a  a',
    'a  a        a  |',
    'a  a     k  a  a',
    'a  a        a  a',
    'a  a        a  a',
    'a  a}       a  a',
    'a              a',
    'a          è   a',
    'a  &       @   a',
    'aaaaaaaaaaaaaaaa',

    ];
     

  // Configuration des niveaux

    const levelCfg = {
        width: 16,
        height: 16,
        'a': () => [sprite('block'), area(), solid()],
        '}': () => [sprite('skeleton'), 'skeleton', 'dangerous', area(), solid(), {dir: -1, timer: 0}],
       
        'è': () => [sprite('slicer'), 'slicer', 'dangerous', area(), solid(), {dir: -1}],
        '|': () => [sprite("right-door")],
        '&': () => [sprite("left-statue"), area(), solid()],
        '@': () => [sprite("right-statue"), area(), solid() ],
        '>': () => [sprite("downstairs"), 'next-level'],
        'x': () => [sprite("bomb")],
        'k': () => [sprite("key"), area(), solid()],

    }
    addLevel(maps, levelCfg);
    
    // UI

    const scoreLabel = add([
      text("0"),
      pos(200, 200),
      layer("ui"),
      { value: score },
      // { value: 2 },
      scale(0.7),
    ]);
  
    add([
      text("level " + parseInt(level + 1)), //
      pos(200, 215),
      scale(0.7),
    ]);

    add([
      text("Bombs : " + numberOfBombs), //
      pos(200, 230),
      scale(0.7),
    ]);

    
    

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

    // Ennemis

    onUpdate('slicer', (s) => {
      
      s.move(s.dir * SLICER_SPEED, 0)
    });

    onUpdate('skeleton', (s) => {
      s.move(0, s.dir * SKELETOR_SPEED)
      s.timer -= dt()
      if (s.timer <= 0) {
        s.dir = -s.dir
        s.timer = rand(5)
      }
    });

    // Collisions

    player.onCollide("next-level", () => {
      go("game", {
        level: (level + 1) % maps.length,
        score: scoreLabel.value,
      });
    });

    player.onCollide("bomb", (b) => {
      numberOfBombs.value++;
      destroy(b);
    });

    onCollide('boom', 'skeleton', (b,s) => {
      
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
