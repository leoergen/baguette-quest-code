import {k} from '../game';

export const mainScene = (): void => {
    const {
        add,
        height,
        pos,
        width,
        anchor,
        loadSprite,
        sprite,
        area,
        body,
        onKeyDown,
        scale,
        loadSound,
        setGravity,
        on,
        dt,
        move,
        vec2,
        offscreen,
        scene,
        addLevel,
        camPos,
        go,
        play,
        lerp
    } = k;
    // // loadSprite("pirate", "pirate.png");
    // // loadSprite('background', 'map.jpg');
   
    // // load assets
    loadSprite("bean", "bean.png")
    loadSprite("ghosty", "bean.png")

    loadSprite("spike", "bean.png")

   

    // loadSprite("bag", "/sprites/bag.png")
    // loadSprite("ghosty", "/sprites/ghosty.png")
    // loadSprite("spike", "/sprites/spike.png")
     loadSprite("grass", "dirt.png")
    // loadSprite("steel", "/sprites/steel.png")
    // loadSprite("prize", "/sprites/jumpy.png")
    // loadSprite("apple", "/sprites/apple.png")
    // loadSprite("portal", "/sprites/portal.png")
    // loadSprite("coin", "/sprites/coin.png")
    // loadSound("coin", "/examples/sounds/score.mp3")
    // loadSound("powerup", "/examples/sounds/powerup.mp3")
    // loadSound("blip", "/examples/sounds/blip.mp3")
    // loadSound("hit", "/examples/sounds/hit.mp3")
    // loadSound("portal", "/examples/sounds/portal.mp3")
    
    setGravity(3200)
    
    // custom component controlling enemy patrol movement
    function patrol(speed = 60, dir = 1) {
        return {
            id: "patrol",
            require: [ "pos", "area" ],
            add() {
                on("collide", (obj:any , col:any) => {
                    if (col.isLeft() || col.isRight()) {
                        dir = -dir
                    }
                })
            },
            update() {
                move(speed * dir, 0)
            },
        }
    }
    
    // custom component that makes stuff grow big
    function big() {
        let timer = 0
        let isBig = false
        let destScale = 1
        return {
            // component id / name
            id: "big",
            // it requires the scale component
            require: [ "scale" ],
            // this runs every frame
            update() {
                if (isBig) {
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
                //k.scale = lerp(vec2(destScale), dt() * 6)
            },
            // custom methods
            isBig() {
                return isBig
            },
            smallify() {
                destScale = 1
                timer = 0
                isBig = false
            },
            biggify(time: any) {
                destScale = 2
                timer = time
                isBig = true
            },
        }
    }
    
    // define some constants
    const JUMP_FORCE = 1320
    const MOVE_SPEED = 480
    const FALL_DEATH = 2400
    
    const LEVELS = [
        [
            "                         -                                               ",
            "                             -                                           ",
            "                                                              -          ",
            "                                                         -               ",
            "          -   =>  =                                      --              ",
            "       -      =====                         =>  =                        ",
            "========               =      =      =      =====                        ",
        ],
        [
            "                          $",
            "                          $",
            "                          $",
            "                          $",
            "                          $",
            "           $$         =   $",
            "  %      ====         =   $",
            "                      =   $",
            "                      =    ",
            "               = >    =   @",
            "===========================",
        ],
        [
            "     $    $    $    $     $",
            "     $    $    $    $     $",
            "                           ",
            "                           ",
            "                           ",
            "                           ",
            "                           ",
            " ^^^^>^^^^>^^^^>^^^^>^^^^^@",
            "===========================",
        ],
    ]
    
    // define what each symbol means in the level graph
    const levelConf = {
        tileWidth: 64,
        tileHeight: 64,
        tiles: {
            "=": () => [
                sprite("grass"),
                area(),
                body({ isStatic: true }),
                anchor("bot"),
                offscreen({ hide: true }),
            ],
            "-": () => [
                sprite("bean"),
                area(),
                body({ isStatic: true }),
                offscreen({ hide: true }),
                anchor("bot"),
                "platform"
            ],
            "0": () => [
                sprite("bean"),
                area(),
                body({ isStatic: true }),
                offscreen({ hide: true }),
                anchor("bot"),
            ],
            "$": () => [
                sprite("bean"),
                area(),
                pos(0, -9),
                anchor("bot"),
                offscreen({ hide: true }),
                "coin",
            ],
            "%": () => [
                sprite("bean"),
                area(),
                body({ isStatic: true }),
                anchor("bot"),
                offscreen({ hide: true }),
                "prize",
            ],
            "^": () => [
                sprite("bean"),
                area(),
                body({ isStatic: true }),
                anchor("bot"),
                offscreen({ hide: true }),
                "danger",
            ],
            "#": () => [
                sprite("bean"),
                area(),
                anchor("bot"),
                body(),
                offscreen({ hide: true }),
                "apple",
            ],
            ">": () => [
                sprite("bean"),
                area(),
                anchor("bot"),
                body(),
                patrol(),
                offscreen({ hide: true }),
                "enemy",
            ],
            "@": () => [
                sprite("bean"),
                area({ scale: 0.5 }),
                anchor("bot"),
                pos(0, -12),
                offscreen({ hide: true }),
                "portal",
            ],
        },
    }
    
    scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
    
        // add level to scene
        const level = addLevel(LEVELS[levelId ?? 0], levelConf)
    
        // define player object
        const player = add([
            sprite("bean"),
            pos(0, 0),
            area(),
            scale(1),
            // makes it fall to gravity and jumpable
            body(),
            // the custom component we defined above
            big(),
            anchor("bot"),
        ])
    
        // action() runs every frame
        player.onUpdate(() => {
            // center camera to player
            camPos(player.pos)
            // check fall death
            if (player.pos.y >= FALL_DEATH) {
                go("lose")
            }
        })
    
        player.onBeforePhysicsResolve((collision: any) => {
            if (collision.target.is(["platform"]) ) {
    
                if( player.weight > 1 ){
                    player.move(0,-1)
                collision.preventResolution()
                }
                if( collision.target.pos.y - 50  <= player.pos.y || player.isJumping()){
                collision.preventResolution()
            }
            }
            
        })
    
        player.onPhysicsResolve(() => {
            // Set the viewport center to player.pos
            camPos(player.pos)
        })
    
        // if player onCollide with any obj with "danger" tag, lose
        player.onCollide("danger", () => {
            go("lose")
            play("hit")
        })
    
        player.onCollide("portal", () => {
            play("portal")
            if (levelId + 1 < LEVELS.length) {
                go("game", {
                    levelId: levelId + 1,
                    coins: coins,
                })
            } else {
                go("win")
            }
        })
    
        player.onGround((l:any) => {
            if (l.is("enemy")) {
                player.jump(JUMP_FORCE * 1.5)
                k.destroy(l)
                k.addKaboom(player.pos)
               // play("powerup")
            }
        })
    
        player.onCollide("enemy", (e:any, col:any) => {
            // if it's not from the top, die
            if (!col.isBottom()) {
                go("lose")
                //play("hit")
            }
        })
    
        let hasApple = false
    
        // grow an apple if player's head bumps into an obj with "prize" tag
        player.onHeadbutt((obj:any) => {
            if (obj.is("prize") && !hasApple) {
                const apple = level.spawn("#", obj.tilePos.sub(0, 1))
                apple.jump()
                hasApple = true
              //  play("blip")
            }
        })
    
        // player grows big onCollide with an "apple" obj
        player.onCollide("apple", (a:any) => {
            k.destroy(a)
            // as we defined in the big() component
            player.biggify(3)
            hasApple = false
           // play("powerup")
        })
    
        let coinPitch = 0
    
        k.onUpdate(() => {
            if (coinPitch > 0) {
                coinPitch = Math.max(0, coinPitch - dt() * 100)
            }
        })
    
        player.onCollide("coin", (c:any) => {
            k.destroy(c)
            // play("coin", {
            //     detune: coinPitch,
            // })
            coinPitch += 100
            coins += 1
            coinsLabel.text = coins
        })
    
        const coinsLabel = add([
            k.text(coins),
            pos(24, 24),
            k.fixed(),
        ])
    
        function jump() {
            // these 2 functions are provided by body() component
            if (player.isGrounded()) {
                player.jump(JUMP_FORCE)
            }
        }
    
        // jump with space
        k.onKeyPress("space", jump)
    
        onKeyDown("a", () => {
            player.move(-MOVE_SPEED, 0)
        })
    
        onKeyDown("d", () => {
            player.move(MOVE_SPEED, 0)
        })
    
        k.onKeyPress("s", () => {
            player.weight = 3
        })
    
        k.onKeyRelease("s", () => {
            player.weight = 1
        })
        k.onKeyPress("w", () => {
            player.weight = 0.5
        })
       k. onKeyRelease("w", () => {
            player.weight = 1
        })
    
        k.onGamepadButtonPress("south", jump)
    
       k. onGamepadStick("left", (v:any) => {
            player.move(v.x * MOVE_SPEED, 0)
        })
    
        k.onKeyPress("f", () => {
            k.setFullscreen(!k.isFullscreen())
        })
    
    })
    
    scene("lose", () => {
        add([
            k.text("You Lose"),
        ])
       k. onKeyPress(() => go("game"))
    })
    
    scene("win", () => {
        add([
            k.text("You Win"),
        ])
        k.onKeyPress(() => go("game"))
    })
    
    go("game")
};
