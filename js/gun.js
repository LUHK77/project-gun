// gun.js

const gun = {
    largura: 16,
    altura: 6,
    dano: 10,
};

const mouse = { x: 0, y: 0 };
let angulo = 0; // <- agora é global, acessível pelo click

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    angulo = Math.atan2(mouse.y - canvas.height / 2, mouse.x - canvas.width / 2); // <- atualiza aqui
});

window.addEventListener("click", () => spawnBullet(angulo)); // agora consegue ler o angulo

function drawGun() {
    const px = canvas.width  / 2;
    const py = canvas.height / 2;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angulo); // usa a variável global
    ctx.fillStyle = "gray";
    ctx.fillRect(0, -gun.altura / 2, gun.largura, gun.altura);
    ctx.restore();
}