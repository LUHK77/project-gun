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
        altura: 40,
        largura: 28,
        size: 20,
        speed: 1,
        sprite: 64,
        damage: 10,
        hp: 40
    });
}


// Carrega frames dos inimigos
const framesEnemys = [];
for (let i = 0; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/enemys/zombie/sprite_${i}.png`;
    
    framesEnemys.push(img);
}

// Carrega frames de dano (sprites brancos)
const framesEnemysDano = [];
for (let i = 0; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/enemys/zombie/hit/sprite_${i}.png`;
    framesEnemysDano.push(img);
}

const animacaoI = {
    frame: 0,
    timer: 0,
    velocidade: 15,
    frames: framesEnemys 
};

function updateAnimacaoI() {
    animacaoI.timer++;
    if (animacaoI.timer >= animacaoI.velocidade) {
        animacaoI.timer = 0;
        animacaoI.frame = (animacaoI.frame + 1) % 9;
    }

    // Escolhe o array certo baseado se está movendo
    animacaoI.frames = framesEnemys;
}


/**
 * Atualiza todos os inimigos do array.
 */
function updateEnemies(deltaTime) {
    updateAnimacaoI(); // <- fora do loop, roda 1 vez por frame

    for (const e of enemies) {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) continue;
        if (e.timerDano > 0) e.timerDano--;

        const vx = (dx / dist) * e.speed * 100 * deltaTime;
        const vy = (dy / dist) * e.speed * 100 * deltaTime;

        if (!bateu(e.x + vx, e.y)) e.x += vx;
        if (!bateu(e.x, e.y + vy)) e.y += vy;

        if (dist < (player.size / 2) + (e.size / 2)) {
        const agora = Date.now();
        if (!e.ultimoAtaque || agora - e.ultimoAtaque > 1000) {
            player.hp -= e.damage;
            player.ultimoDano = Date.now();
            e.ultimoAtaque = agora; // <- separado do ultimoDano
        }
      }
    }
}

/**
 * Desenha todos os inimigos.
 */
function drawEnemies() {
    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;

    for (const e of enemies) {
        // Usa frame branco se tomou dano há menos de 100ms
        const piscando = e.ultimoDano && Date.now() - e.ultimoDano < 100;
        const frames = piscando ? framesEnemysDano : framesEnemys;

        ctx.save();
        ctx.translate(e.x - camX, e.y - camY);
        if (player.x < e.x) ctx.scale(-1, 1);
        ctx.drawImage(frames[animacaoI.frame], -e.sprite / 2, -e.sprite / 2, e.sprite, e.sprite);
        ctx.restore();
    }
}