//Objeto do player

const player = {
    x: 0,
    y: 0,
    size: 20,
    speed: 2
};

// -------------------------
// Controle do teclado
// -------------------------

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Função de colisão 

function bateu(x, y) {

    const esquerda = Math.floor((x - player.size / 2) / blocoTamanho);
    const direita  = Math.floor((x + player.size / 2) / blocoTamanho);
    const cima     = Math.floor((y - player.size / 2) / blocoTamanho);
    const baixo    = Math.floor((y + player.size / 2) / blocoTamanho);

    return (
        ehSolido(esquerda, cima) ||
        ehSolido(direita, cima) ||
        ehSolido(esquerda, baixo) ||
        ehSolido(direita, baixo)
    );
}

// -------------------------
// Atualiza jogador
// -------------------------

function update() {

    let dx = 0;
    let dy = 0;

    // Detecta direção
    if (keys["w"] || keys["arrowup"]) dy--;
    if (keys["s"] || keys["arrowdown"]) dy++;
    if (keys["a"] || keys["arrowleft"]) dx--;
    if (keys["d"] || keys["arrowright"]) dx++;

    // Corrige velocidade na diagonal
    const tamanho = Math.sqrt(dx * dx + dy * dy);

    if (tamanho > 0) {
        dx /= tamanho;
        dy /= tamanho;
    }

    // Testa movimento no eixo X
    const novoX = player.x + dx * player.speed;

    if (!bateu(novoX, player.y)) {
        player.x = novoX;
    }

    // Testa movimento no eixo Y
    const novoY = player.y + dy * player.speed;

    if (!bateu(player.x, novoY)) {
        player.y = novoY;
    }
}

// -------------------------
// Desenha jogador
// -------------------------

function drawPlayer() {

    ctx.fillStyle = "red";

    ctx.fillRect(
        canvas.width / 2 - player.size / 2,
        canvas.height / 2 - player.size / 2,
        player.size,
        player.size
    );
}