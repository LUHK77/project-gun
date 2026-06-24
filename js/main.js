// js/main.js

import { ctx, drawMap, LARGURA, ALTURA } from './map.js';
import { player } from './Models/Player.js';
import { updateEnemies, drawEnemies } from './Models/Enemy.js';
import { gun } from './Models/Pistol.js';
import { angulo, mouse } from './Models/Gun.js';
import { updateBullets, drawBullets } from './Models/Bullet.js';
import { spawnEnemy } from './spawner.js';
import { escolhendoUpgrade, drawUpgrade, handleUpgradeClick } from './upgradeUI.js';

import {
    initUI,
    updateTimer,
    drawTimer,
    drawGameOver,
    drawMenu,
    jogoIniciado
} from './ui.js';

// Clique para atirar / upgrade
window.addEventListener("mousedown", (e) => {
    if (escolhendoUpgrade) {
        const rect = canvas.getBoundingClientRect();
        handleUpgradeClick(e.clientX - rect.left, e.clientY - rect.top);
        return;
    }
    gun.segurando = true;
});

window.addEventListener("mouseup", () => { gun.segurando = false; });

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") gun.recarregar();
});

// Inicializa a UI
initUI(spawnEnemy);

let ultimoFrame = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    ctx.clearRect(0, 0, LARGURA, ALTURA);

    // MENU
    if (!jogoIniciado) {
        drawMenu();
        requestAnimationFrame(gameLoop);
        return;
    }

    // JOGO RODANDO — pausa quando escolhendo upgrade
    if (player.hp > 0 && !escolhendoUpgrade) {
        player.update(deltaTime, mouse);
        updateBullets(deltaTime);
        updateEnemies(deltaTime);
        gun.update(deltaTime, angulo);
        updateTimer(spawnEnemy);
    }

    drawMap(player.x, player.y);
    drawEnemies();
    drawBullets();
    player.draw(mouse);
    gun.draw();
    gun.drawBarra();
    drawTimer();

    if (player.hp <= 0) drawGameOver();

    // Upgrade por cima de tudo
    drawUpgrade();

    requestAnimationFrame(gameLoop);
}

document.fonts.ready.then(() => {
    requestAnimationFrame(gameLoop);
});