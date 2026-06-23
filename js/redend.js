// redend.js
let taxaSpawn = 3000;
let intervalSpawn = setInterval(spawnEnemy, taxaSpawn);
spawnEnemy();

let ultimoFrame = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    if (player.hp > 0) {
        updatePlayer(deltaTime);
        updateBullets(deltaTime);
        updateEnemies(deltaTime);
        updateGun(deltaTime);
        updateTimer();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawEnemies();
    drawBullets();
    drawPlayer();
    drawGun();
    drawTimer();

    // Sempre por último, por cima de tudo
    if (player.hp <= 0) drawGameOver();

    requestAnimationFrame(gameLoop);
}

gameLoop(0);