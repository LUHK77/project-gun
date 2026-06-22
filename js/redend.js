// redend.js

setInterval(spawnEnemy, 3000);
spawnEnemy();

function gameLoop() {
    if (player.hp > 0) {
        updatePlayer(); // <- updateAnimacao já é chamado dentro daqui
        updateBullets();
        updateEnemies();
        updateGun();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawEnemies();
    drawBullets();
    drawPlayer();
    drawGun();

    requestAnimationFrame(gameLoop);
}

gameLoop();