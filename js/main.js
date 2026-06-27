import { ctx, canvas, drawMap, LARGURA, ALTURA } from './map.js';
import { player } from './Models/Player.js';
import { updateEnemies, drawEnemies } from './Models/Enemy.js';
import { gun } from './Models/Pistol.js';
import { angulo, mouse } from './Models/Gun.js';
import { updateBullets, drawBullets } from './Models/Bullet.js';
import { spawnEnemy } from './spawner.js';
import { state as upgradeState, drawUpgrade, handleUpgradeClick } from './upgradeUI.js';
import {initUI, updateTimer, drawTimer, drawGameOver, drawMenu, drawControls, mostrandoControles, jogoIniciado} from './ui.js';

// cliques do jogo
window.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const p = player.retrato;

    // abre tela de upgrades quando clica no retrato do player no canto esquerdo da tela
    if (p && mx >= p.x && mx <= p.x + p.w && my >= p.y && my <= p.y + p.h) {
        upgradeState.escolhendoUpgrade = true;
        gun.segurando = false;
        return;
    }

    // seleciona um upgrade
    if (upgradeState.escolhendoUpgrade) {
        handleUpgradeClick(mx, my);
        gun.segurando = false;
        return;
    }

    // da tiro quando o player segura o mouse
    gun.segurando = true;
});

window.addEventListener("mouseup", () => gun.segurando = false);
window.addEventListener("blur", () => gun.segurando = false);

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        upgradeState.escolhendoUpgrade = !upgradeState.escolhendoUpgrade;
        return;
    }

    // Recarrega a arma
    if (e.key.toLowerCase() === "r") {
        gun.recarregar();
    }
});

initUI(spawnEnemy);

let ultimoFrame = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    ctx.clearRect(0, 0, LARGURA, ALTURA);

    //menu inicial
    if (!jogoIniciado) {
        mostrandoControles ? drawControls() : drawMenu();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Atualiza o jogo apenas se não estiver pausado
    if (player.hp > 0 && !upgradeState.escolhendoUpgrade) {
        player.update(deltaTime, mouse);
        updateBullets(deltaTime);
        updateEnemies(deltaTime);
        gun.update(deltaTime, angulo);
        updateTimer(spawnEnemy);
    }

    // desenha os elementos do jogo
    drawMap(player.x, player.y); 
    drawEnemies();
    drawBullets();

    player.draw(mouse);
    gun.draw();
    gun.drawBarra();

    drawTimer();
    drawUpgrade();
    //desenha o game over quando jogador perde
    if (player.hp <= 0) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// inicia o jogo após carregar as fontes
document.fonts.ready.then(() => requestAnimationFrame(gameLoop));