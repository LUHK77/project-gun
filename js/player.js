//Objeto do player
const player = {
    x: 0,
    y: 0,
    size: 20,
    sprite: 64,
    speed: 2,
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

//Configura a animação do player
const animacao = {
    frame: 0,
    timer: 0,
    velocidade: 6,
    frames: framesIdle // <- inicia com idle por padrão
};

//Atualiza a animação do player sempre que ele se move ou para
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
    //Direção do eixo X
    let dx = 0;
    //Direção do eixo Y
    let dy = 0;

    // Checa quais teclas estão pressionadas e ajusta dx e dy
    if (keys["w"] || keys["arrowup"]) dy--;
    if (keys["s"] || keys["arrowdown"]) dy++;
    if (keys["a"] || keys["arrowleft"]) dx--;
    if (keys["d"] || keys["arrowright"]) dx++;

    // Verifica se o player está se movendo para atualizar a animação
    const movendo = dx !== 0 || dy !== 0;
    updateAnimacao(movendo);

    // Normaliza o vetor de movimento para evitar movimento mais rápido na diagonal
    const tamanho = Math.sqrt(dx * dx + dy * dy);
    if (tamanho > 0) {
        dx /= tamanho;
        dy /= tamanho;
    }

    // Calcula a nova posição do player e verifica colisão no eixo X
    const novoX = player.x + dx * player.speed;
    if (!bateu(novoX, player.y)) player.x = novoX;

    // Calcula a nova posição do player e verifica colisão no eixo Y
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

    // Texto HP
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.fillText("HP:", 65, 11 + barraA);

    // Borda da barra
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(10 + barraL, 10, barraL + 6, barraA + 6);

    // Preenchimento proporcional ao hp
    ctx.fillStyle = "white";
    ctx.fillRect(10 + barraL + 3, 13, player.hp, barraA);
}