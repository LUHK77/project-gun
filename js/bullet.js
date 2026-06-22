// bullet.js

const bullets = [];

const bulletSprite = new Image();
bulletSprite.src = `assets/guns/bullet/sprite_0.png`;

// Tamanho visual do sprite da bala
const bulletSize = 40;

function spawnBullet(angulo) {
    bullets.push({
        x: player.x + Math.cos(angulo) * 20,
        y: player.y + Math.sin(angulo) * 20,
        velocidade: 3,
        tamanho: 8, // hitbox da bala
        dx: Math.cos(angulo),
        dy: Math.sin(angulo),
        acertou: false,
        timerDano: 0,
    });
}

function batuMapa(x, y) {
    const col = Math.floor(x / blocoTamanho);
    const row = Math.floor(y / blocoTamanho);
    return ehSolido(col, row);
}

function updateBullets(deltaTime) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];

        if (b.acertou) {
            b.timerDano--;
            if (b.timerDano <= 0) bullets.splice(i, 1);
            continue;
        }

        const passos = 3;
        const stepX = (b.dx * b.velocidade * 400 * deltaTime) / passos;
        const stepY = (b.dy * b.velocidade * 400 * deltaTime) / passos;

        let removida = false;
        for (let s = 0; s < passos; s++) {
            b.x += stepX;
            b.y += stepY;

            if (batuMapa(b.x, b.y)) {
                bullets.splice(i, 1);
                removida = true;
                break;
            }

            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                const dist = Math.sqrt((b.x - e.x) ** 2 + (b.y - e.y) ** 2);
                if (dist < e.size / 2 + b.tamanho) {
                    e.hp -= gun.dano;
                    e.ultimoDano = Date.now();
                    if (e.hp <= 0) enemies.splice(j, 1);
                    b.acertou = true;
                    b.timerDano = 40;
                    removida = true;
                    break;
                }
            }
            if (removida) break;
        }
    }
}

function drawBullets() {
    const camX = player.x - canvas.width  / 2;
    const camY = player.y - canvas.height / 2;

    for (const b of bullets) {
        if (b.acertou) {
            const opacidade = b.timerDano / 40;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacidade})`;
            ctx.font = "bold 14px GamerFonte";
            ctx.fillText("-" + gun.dano, b.x - camX, b.y - camY);
        } else {
            const screenX = b.x - camX;
            const screenY = b.y - camY;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(Math.atan2(b.dy, b.dx));
            // Sprite grande centralizado — cobre a área da arma visualmente
            ctx.drawImage(bulletSprite, -bulletSize / 2, -bulletSize / 2, bulletSize, bulletSize);
            ctx.restore();
        }
    }
}