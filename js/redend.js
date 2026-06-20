// redend.js

setInterval(spawnEnemy, 3000); // spawna um inimigo a cada 3 segundos
spawnEnemy(); // primeiro inimigo na largada

function gameLoop() {
    if (player.hp != 0) {
        updatePlayer();
        updateEnemies();
        checaColisaoPlayerEnemy();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawEnemies();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();