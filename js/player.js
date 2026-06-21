//Objeto do player

const player = {
    x: 0,
    y: 0,
    size: 20,
    sprite: 64,
    speed: 1,
    hp: 100
};

// Carrega frames parado
const framesIdle = [];
for (let i = 0; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/player/PlayerDefault/sprite_${i}.png`; // <- tirou o ../
    framesIdle.push(img);
}

// Carrega frames andando
const framesMove = [];
for (let i = 0; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/player/PlayerMove/sprite_${i}.png`;
    
    framesMove.push(img);
}

const animacao = {
    frame: 0,
    timer: 0,
    velocidade: 12,
    frames: framesIdle // <- inicia com idle por padrão
};

function updateAnimacao(movendo) {
    animacao.timer++;
    if (animacao.timer >= animacao.velocidade) {
        animacao.timer = 0;
        animacao.frame = (animacao.frame + 1) % 9;
    }

    // Escolhe o array certo baseado se está movendo
    animacao.frames = movendo ? framesMove : framesIdle;
}

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

function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy--;
    if (keys["s"] || keys["arrowdown"]) dy++;
    if (keys["a"] || keys["arrowleft"]) dx--;
    if (keys["d"] || keys["arrowright"]) dx++;

    // Checa ANTES de normalizar
    const movendo = dx !== 0 || dy !== 0;
    updateAnimacao(movendo);

    const tamanho = Math.sqrt(dx * dx + dy * dy);
    if (tamanho > 0) {
        dx /= tamanho;
        dy /= tamanho;
    }

    const novoX = player.x + dx * player.speed;
    if (!bateu(novoX, player.y)) player.x = novoX;

    const novoY = player.y + dy * player.speed;
    if (!bateu(player.x, novoY)) player.y = novoY;
}

// -------------------------
// Desenha o player
// -------------------------

function drawPlayer() {
    const px = canvas.width / 2;
    const py = canvas.height / 2;

    // Efeito de dano
    const piscando = player.ultimoDano && Date.now() - player.ultimoDano < 100;
    if (piscando) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "white";
        ctx.fillRect(px - player.sprite / 2, py - player.sprite / 2, player.sprite, player.sprite);
        ctx.globalAlpha = 1.0;
    }

    ctx.save();
    ctx.translate(px, py);

    // Espelha se o mouse estiver à esquerda do player
    if (mouse.x < px) ctx.scale(-1, 1);

    // Desenha o frame atual da animação
    ctx.drawImage(animacao.frames[animacao.frame], -player.sprite / 2, -player.sprite / 2, player.sprite, player.sprite);
    ctx.restore();

    // Barra de vida
    let barraL = 100;
    let barraA = 20;
    ctx.fillStyle = "red";
    ctx.fillRect(10 + 10 + barraL, 10 + barraA, barraL, barraA);
    ctx.fillStyle = "yellow";
    ctx.fillRect(10 + 10 + barraL, 10 + barraA, player.hp, barraA);
}