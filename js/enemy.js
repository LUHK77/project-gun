const enemies = []; // array com todos os inimigos vivos

/**
 * Cria um inimigo em uma posição aleatória ao redor do player,
 * longe o suficiente pra não nascer em cima dele.
 */
function spawnEnemy() {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 400 + Math.random() * 200; // entre 400 e 600px do player

    enemies.push({
        x: player.x + Math.cos(angulo) * distancia,
        y: player.y + Math.sin(angulo) * distancia,
        size: 20,
        speed: 1,
        hp: 100
    });
}

/**
 * Atualiza todos os inimigos do array.
 */
function updateEnemies() {
    for (const e of enemies) {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) continue;

        const vx = (dx / dist) * e.speed;
        const vy = (dy / dist) * e.speed;

        //Colisão com blocos solidos
        if (!bateu(e.x + vx, e.y)) e.x += vx;
        if (!bateu(e.x, e.y + vy)) e.y += vy;

        //Colisão com player
        if (dist < (player.size / 2) + (e.size / 2)) {
            const agora = Date.now();
            if (!e.ultimoDano || agora - e.ultimoDano > 1000) {
                player.hp -= 10;
                player.ultimoDano = Date.now();
                e.ultimoDano = agora;
            }
        }
    }
}

/**
 * Desenha todos os inimigos.
 */
function drawEnemies() {
    const camX = player.x - canvas.width  / 2;
    const camY = player.y - canvas.height / 2;

    for (const e of enemies) {
        ctx.fillStyle = "brown";
        ctx.fillRect(e.x - camX - e.size / 2, e.y - camY - e.size / 2, e.size, e.size);
    }
}

function checaColisaoPlayerEnemy() {
    for (const e of enemies) {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        if (Math.sqrt(dx * dx + dy * dy) < (player.size / 2) + (e.size / 2)) {
            player.vivo = false;
        }
    }
}