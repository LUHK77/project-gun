const enemy = {
    x: 200,   // Posição inicial no mundo (não na tela)
    y: 200,
    size: 20,
    speed: 1
};


function bateu(x, y) {

    const esquerda = Math.floor((x - enemy.size / 2) / blocoTamanho);
    const direita  = Math.floor((x + enemy.size / 2) / blocoTamanho);
    const cima     = Math.floor((y - enemy.size / 2) / blocoTamanho);
    const baixo    = Math.floor((y + enemy.size / 2) / blocoTamanho);

    return (
        ehSolido(esquerda, cima) ||
        ehSolido(direita, cima) ||
        ehSolido(esquerda, baixo) ||
        ehSolido(direita, baixo)
    );
}

/**
 * Atualiza a posição do inimigo a cada frame.
 * Ele se move em direção ao player usando o vetor normalizado entre os dois.
 */

function checaColisaoPlayerEnemy() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    // Se a distância for menor que a soma dos raios, colidiu
    if (distancia < (player.size / 2) + (enemy.size / 2)) {
        player.hp = 0;
    }
}

function updateEnemy() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < 1) return; // já está em cima do player

    // Vetor normalizado (velocidade constante independente da distância)
    const vx = (dx / distancia) * enemy.speed;
    const vy = (dy / distancia) * enemy.speed;

    // Testa e aplica movimento em X
    if (!bateu(enemy.x + vx, enemy.y)) {
        enemy.x += vx;
    }

    // Testa e aplica movimento em Y
    if (!bateu(enemy.x, enemy.y + vy)) {
        enemy.y += vy;
    }
}

/**
 * Desenha o inimigo na tela usando a câmera centralizada no player.
 * Converte posição de mundo para posição de tela antes de desenhar.
 */
function drawEnemy() {
    const camX = player.x - canvas.width  / 2;
    const camY = player.y - canvas.height / 2;

    // Posição do inimigo na tela
    const screenX = enemy.x - camX - enemy.size / 2;
    const screenY = enemy.y - camY - enemy.size / 2;

    ctx.fillStyle = "brown";
    ctx.fillRect(screenX, screenY, enemy.size, enemy.size);
}


