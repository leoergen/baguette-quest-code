import {k} from './game';

import { mainScene } from './scenes';

const {
    scene,
    go
} = k;

// Define a scene.
scene('main', mainScene);

// Start the game!
go('main');

