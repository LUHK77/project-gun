// -------------------------
// Renderização
// -------------------------

function draw() {
    drawMap();
    drawPlayer();
}

// -------------------------
// Loop principal
// -------------------------

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop(); 