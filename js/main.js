// js/main.js

import { ctx, drawMap } from './map.js';
import { player } from './Models/Player.js';
import { updateEnemies, drawEnemies } from './Models/Enemy.js';
import { gun } from './Models/Pistol.js';
import { angulo, mouse } from './Models/Gun.js';
import { updateBullets, drawBullets } from './Models/Bullet.js';
import { spawnEnemy } from './spawner.js';

import {
    initUI,
    updateTimer,
    drawTimer,
    drawGameOver,
    drawMenu,
    jogoIniciado
} from './ui.js';

// Clique para atirar
window.addEventListener("click", () => {

    if (!jogoIniciado) return;
    if (player.hp <= 0) return;

    gun.atirar(angulo);
});

// Inicializa a UI
initUI(spawnEnemy);

let ultimoFrame = 0;

function gameLoop(timestamp) {

    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    ctx.clearRect(0, 0, 1440, 850);

    // MENU
    if (!jogoIniciado) {

        drawMenu();

        requestAnimationFrame(gameLoop);
        return;
    }

    // JOGO RODANDO
    if (player.hp > 0) {

        player.update(deltaTime, mouse);

        updateBullets(deltaTime);

        updateEnemies(deltaTime);

        gun.update(deltaTime);

        updateTimer(spawnEnemy);
    }

    drawMap(player.x, player.y);

    drawEnemies();

    drawBullets();

    player.draw(mouse);

    gun.draw();
    gun.drawBarra();

    drawTimer();

    if (player.hp <= 0) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

document.fonts.ready.then(() => {
    requestAnimationFrame(gameLoop);
});