// redend.js

setInterval(spawnEnemy, 3000);
spawnEnemy();

let ultimoFrame = 0;

function gameLoop(timestamp) {
    // deltaTime: quanto tempo passou desde o último frame (em segundos)
    // num monitor 60hz = ~0.016, num 144hz = ~0.007
    // multiplicando pela velocidade garante o mesmo resultado em qualquer monitor
    const deltaTime = (timestamp - ultimoFrame) / 1000;
    ultimoFrame = timestamp;

    if (player.hp > 0) {
        updatePlayer(deltaTime);
        updateBullets(deltaTime);
        updateEnemies(deltaTime);
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

gameLoop(0);