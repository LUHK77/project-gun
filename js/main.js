// js/main.js
import { ctx, canvas, drawMap } from './map.js';
import { player } from './Models/Player.js';
import { updateEnemies, drawEnemies } from './Models/Enemy.js';
import { gun } from './Models/Pistol.js';
import { angulo, mouse } from './Models/Gun.js';
import { updateBullets, drawBullets } from './Models/Bullet.js';
import { spawnEnemy } from './spawner.js';
import { initUI, updateTimer, drawTimer, drawGameOver } from './ui.js';

// Listener de tiro
window.addEventListener("click", () => gun.atirar(angulo));

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
        gun.recarregar();
    }
});

// Inicia UI e spawn
initUI(spawnEnemy);
spawnEnemy();

let ultimoFrame = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    if (player.hp > 0) {
        player.update(deltaTime, mouse);
        updateBullets(deltaTime);
        updateEnemies(deltaTime);
        gun.update(deltaTime);
        updateTimer(spawnEnemy);
    }

    ctx.clearRect(0, 0, 1440, 850);
    drawMap(player.x, player.y);
    drawEnemies();
    drawBullets();
    player.draw(mouse);
    gun.draw();
    gun.drawBarra();
    drawTimer();

    if (player.hp <= 0) drawGameOver();

    requestAnimationFrame(gameLoop);
}

document.fonts.ready.then(() => gameLoop(0));