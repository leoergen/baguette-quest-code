import k from '../kaboom';

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
    } = k;
    loadSprite("pirate", "pirate.png");
    loadSprite('background', 'map.jpg');
     add([
        sprite('background'),
        pos(-100, -1000),
        scale(3)
    ]);
    const player = add([
        scale(8),
        sprite("pirate"),
				area(),
				body(),
        pos(width() / 2, height() / 2),
        anchor("center"),
    ]);


    // keypresses
    onKeyDown("a", () => {
        player.move(-120, 0);
    });
    onKeyDown("d", () => {
        player.move(120, 0);
    });
    onKeyDown("s", () => {
        player.move(0, 120);
    });
    onKeyDown("w", () => {
        player.move(0, -120);
    });

};
