//Objeto do player

const player = {
    x: 0,
    y: 0,
    size: 20,
    speed: 2,
    hp: 100
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

function updatePlayer() {

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
    // Verifica se o player colidiu no eixo y
    if (!bateu(novoX, player.y)) {
        player.x = novoX;
    }

    // Testa movimento no eixo Y
    const novoY = player.y + dy * player.speed;
    // Verifica se o player colidiu no eixo y
    if (!bateu(player.x, novoY)) {
        player.y = novoY;
    }
}

// -------------------------
// Desenha o player
// -------------------------

function drawPlayer() {

    //Efeito visual pra quando o player receber dano
    const piscando = player.ultimoDano && Date.now() - player.ultimoDano < 100;
    //Define a cor do player
    ctx.fillStyle = piscando ? "white" : "red";

    //Desenha o player e defina sua pocição no mapa
    ctx.fillRect(
        canvas.width / 2 - player.size / 2,
        canvas.height / 2 - player.size / 2,
        player.size,
        player.size
    );

    //Barra de vida:
    let barraL = 100;
    let barraA = 20;  
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 10 - barraL, 10 + barraA, barraL, barraA);

    ctx.fillStyle = "yellow";
    ctx.fillRect(canvas.width - 10 - barraL, 10 + barraA, player.hp, barraA);
}