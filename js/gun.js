// gun.js

const gun = {
    largura: 16,
    altura: 6,
    dano: 20,
    sprite: 50,
    spriteRecoil: 30,
    cadencia: 500,
    ultimoTiro: 0,
    atirando: false,
    balas: 6,        // munição atual
    maxBalas: 6,     // munição máxima
    recarregando: false,
    tempoRecarga: 2000, // 2 segundos pra recarregar
    inicioRecarga: 0,
};

// Sprite parado
const spriteGunIdle = new Image();
spriteGunIdle.src = `assets/guns/pistol/pistolD.png`;

// Frames do disparo
const framesShot = [];
for (let i = 0; i <= 7; i++) {
    const img = new Image();
    img.src = `assets/guns/pistol/pistolShot/sprite_${i}.png`;
    framesShot.push(img);
}

// Frames da recarga — cria a pasta pistolReload com os sprites depois
const framesReload = [];
for (let i = 0; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/guns/pistol/pistolReload/sprite_${i}.png`;
    framesReload.push(img);
}

const animacaoGun = {
    frame: 0,
    timer: 0,
    velocidade: 6,
};

const mouse = { x: 0, y: 0 };
let angulo = 0;

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    angulo = Math.atan2(mouse.y - canvas.height / 2, mouse.x - canvas.width / 2);
});

window.addEventListener("click", () => {
    // Não atira se estiver recarregando ou sem balas
    if (gun.recarregando || gun.balas <= 0) return;

    const agora = Date.now();
    if (agora - gun.ultimoTiro < gun.cadencia) return;

    gun.ultimoTiro = agora;
    gun.atirando = true;
    gun.balas--;
    animacaoGun.frame = 0;
    animacaoGun.timer = 0;
    spawnBullet(angulo);

    // Sem balas — inicia recarga automática
    if (gun.balas <= 0) {
        gun.recarregando = true;
        gun.atirando = false;
        gun.inicioRecarga = Date.now();
        animacaoGun.frame = 0;
        animacaoGun.timer = 0;
    }
});

function updateGun() {
    const agora = Date.now();

    if (gun.recarregando) {
        // Avança animação de recarga
        animacaoGun.timer++;
        if (animacaoGun.timer >= animacaoGun.velocidade) {
            animacaoGun.timer = 0;
            animacaoGun.frame = (animacaoGun.frame + 1) % 8;
        }

        // Terminou o tempo de recarga
        if (agora - gun.inicioRecarga >= gun.tempoRecarga) {
            gun.recarregando = false;
            gun.balas = gun.maxBalas;
            animacaoGun.frame = 0;
        }
        return;
    }

    if (gun.atirando) {
        animacaoGun.timer++;
        if (animacaoGun.timer >= animacaoGun.velocidade) {
            animacaoGun.timer = 0;
            animacaoGun.frame++;
            if (animacaoGun.frame >= 8) {
                animacaoGun.frame = 0;
                gun.atirando = false;
            }
        }
    }
}

function drawGun() {
    const px = canvas.width / 2;
    const py = canvas.height / 2;

    let sprite;
    let tamanho;

    if (gun.recarregando) {
        sprite = framesReload[animacaoGun.frame];
        tamanho = gun.spriteRecoil;
    } else if (gun.atirando) {
        sprite = framesShot[animacaoGun.frame];
        tamanho = gun.sprite;
    } else {
        sprite = spriteGunIdle;
        tamanho = gun.sprite;
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angulo);
    if (mouse.x < px) ctx.scale(1, -1);
    ctx.drawImage(sprite, -15, -tamanho / 2 + 5, tamanho, tamanho);
    ctx.restore();

    // Barra de munição — variáveis renomeadas pra não conflitar
    const barraX = px - 20;
    const barraY = py + player.sprite / 2 + 8;
    const barraW = 40;
    const barraH = 6;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(barraX, barraY, barraW, barraH);

    ctx.fillStyle = gun.recarregando ? "gray" : "white";
    ctx.fillRect(barraX, barraY, barraW * (gun.balas / gun.maxBalas), barraH);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(barraX, barraY, barraW, barraH);
}