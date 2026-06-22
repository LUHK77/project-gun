// bullet.js

const bullets = [];

function spawnBullet(angulo) {
    bullets.push({
        x: player.x,
        y: player.y,
        velocidade: 6,
        tamanho: 5,
        dx: Math.cos(angulo),
        dy: Math.sin(angulo),
        acertou: false,  // flag de acerto
        timerDano: 0,    // timer do número
    });
}

function batuMapa(x, y) {
    const col = Math.floor(x / blocoTamanho);
    const row = Math.floor(y / blocoTamanho);
    return ehSolido(col, row);
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];

        // Se já acertou, só conta o timer e remove quando zerar
        if (b.acertou) {
            b.timerDano--;
            if (b.timerDano <= 0) bullets.splice(i, 1);
            continue;
        }

        b.x += b.dx * b.velocidade;
        b.y += b.dy * b.velocidade;

        if (batuMapa(b.x, b.y)) {
            bullets.splice(i, 1);
            continue;
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            const dist = Math.sqrt((b.x - e.x) ** 2 + (b.y - e.y) ** 2);
            if (dist < e.size / 2 + b.tamanho) {
                e.hp -= gun.dano;
                e.ultimoDano = Date.now();
                if (e.hp <= 0) enemies.splice(j, 1);
                // Para a bala e inicia o timer do número
                b.acertou = true;
                b.timerDano = 40;
                break;
            }
        }
    }
}

function drawBullets() {
    const camX = player.x - canvas.width  / 2;
    const camY = player.y - canvas.height / 2;

    for (const b of bullets) {
        if (b.acertou) {
            // Mostra o número de dano onde a bala parou
            const opacidade = b.timerDano / 40;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacidade})`;
            ctx.font = "bold 14px Arial";
            ctx.fillText("-" + gun.dano, b.x - camX, b.y - camY);
        } else {
            // Desenha a bala normalmente
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(b.x - camX, b.y - camY, b.tamanho, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}