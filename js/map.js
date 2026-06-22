const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// no topo do map.js — carrega as imagens dos tiles
const imgSolo = [
    new Image(), // solo1
    new Image(), // solo2
    new Image(), // solo3
    new Image(), // Pedra
];

const imgStone = [
    new Image(), // Pedra
];

imgSolo[0].src = "../assets/map/sprite_0.png";
imgSolo[1].src = "../assets/map/sprite_1.png";
imgSolo[2].src = "../assets/map/sprite_2.png";

imgStone[0].src= "../assets/map/pedra_0.png";



// Tamanho de cada tile em pixels
//Tamanho padrão: const blocoTamanho = 32;
const blocoTamanho = 64;
const chunkSize = 10;

/**
 * Retorna o tipo de tile ("grass" ou "stone") para uma posição (tileX, tileY).
 * - Área segura de 5x5 ao redor do spawn sempre é grama.
 * - Fora disso, usa seed baseada no chunk para espalhar pedras de forma determinística.
 */
function geraBloco(tileX, tileY) {
    // Área segura ao redor do spawn (sempre grama)
    if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) {
        return "grass";
    }

    // Descobre em qual chunk esse tile está
    const chunkX = Math.floor(tileX / chunkSize);
    const chunkY = Math.floor(tileY / chunkSize);

    // Seed determinística para o chunk
    const seed = Math.abs(chunkX * 37 + chunkY * 71);

    // Apenas 10% dos chunks terão pedra
    if (seed % 10 !== 0) return "grass";

    // Posição fixa da pedra dentro do chunk
    const pedraX = seed % chunkSize;
    const pedraY = Math.floor(seed / chunkSize) % chunkSize;

    // Posição local do tile dentro do chunk
    const localX = ((tileX % chunkSize) + chunkSize) % chunkSize;
    const localY = ((tileY % chunkSize) + chunkSize) % chunkSize;

    if (localX === pedraX && localY === pedraY) return "stone";

    return "grass";
}

/**
 * Retorna true se o tile na posição (tileX, tileY) for sólido (bloqueante).
 */
function ehSolido(tileX, tileY) {
    return geraBloco(tileX, tileY) === "stone";
}

/**
 * Desenha apenas os tiles visíveis na tela, com a câmera centralizada no player.
 */
function drawMap() {
    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;

    const firstTileX = Math.floor(camX / blocoTamanho);
    const firstTileY = Math.floor(camY / blocoTamanho);
    const lastTileX  = firstTileX + Math.ceil(canvas.width  / blocoTamanho) + 1;
    const lastTileY  = firstTileY + Math.ceil(canvas.height / blocoTamanho) + 1;

    for (let y = firstTileY; y <= lastTileY; y++) {
        for (let x = firstTileX; x <= lastTileX; x++) {
            const screenX = x * blocoTamanho - camX;
            const screenY = y * blocoTamanho - camY;
            const tile = geraBloco(x, y);

            // Gera uma grama e define o tamanho e pocição dela
            if (tile === "grass") {
            const variacao = Math.abs((x * 374761393 + y * 668265263) >>> 0) % 3;
            ctx.drawImage(imgSolo[variacao], screenX, screenY, blocoTamanho, blocoTamanho);
            } else {
            // Gera uma pedra e define o tamanho e pocição dela
                ctx.drawImage(imgStone[0], screenX, screenY, blocoTamanho, blocoTamanho);
            }
        }
    }
}
