const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variabel game
let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 30,
  gravity: 0.4,
  lift: -8,
  velocity: 0,
}; // Gravitasi dan lift lebih ringan
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;
// Gambar latar belakang bergerak
let backgroundOffset = 0;
const backgroundSpeed = 1;
const bgImage = new Image();
bgImage.src = "img/sky.jpg"; // Path ke folder img

// Gambar latar belakang bergerak
function drawBackground() {
  // Gambar latar belakang dua kali untuk efek scroll tanpa jeda
  ctx.drawImage(bgImage, backgroundOffset, 0, canvas.width, canvas.height);
  ctx.drawImage(
    bgImage,
    backgroundOffset + canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // Geser latar belakang
  backgroundOffset -= backgroundSpeed;
  if (backgroundOffset <= -canvas.width) {
    backgroundOffset = 0;
  }
}

// Gambar burung
function drawBird() {
  ctx.save(); // Simpan state canvas
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2); // Pindahkan origin ke tengah burung
  ctx.rotate((Math.PI / 180) * bird.velocity * 2); // Rotasi burung berdasarkan kecepatan

  // Gambar tubuh burung
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gambar mata
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(10, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  // Gambar paruh
  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.moveTo(15, -5); // Mulai dari ujung kiri atas paruh
  ctx.lineTo(25, 5); // Ujung depan paruh
  ctx.lineTo(15, 5); // Ujung kiri bawah paruh
  ctx.closePath();
  ctx.fill();

  // Gambar sayap
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.moveTo(-15, 0);
  ctx.lineTo(-30, -20);
  ctx.lineTo(-15, -10);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Kembalikan state canvas
}

// Gambar pipa
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

// Update posisi burung dan pipa
function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Cek tabrakan dengan pipa
  pipes.forEach((pipe) => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    // Cek jika burung melewati pipa
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }

    // Gerakkan pipa ke kiri (lebih lambat)
    pipe.x -= 1.5; // Kecepatan pipa dikurangi
  });

  // Hapus pipa yang sudah lewat
  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);

  // Tambah pipa baru
  if (frame % 120 === 0) {
    // Pipa muncul lebih jarang
    let gap = 120; // Jarak antara pipa atas dan bawah diperbesar
    let top = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: canvas.height - top - gap,
      passed: false,
    });
  }

  frame++;
}

// Gambar skor
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Reset game
function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
}

// Main loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText(
      "Click to Restart",
      canvas.width / 2 - 100,
      canvas.height / 2 + 40
    );
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBird();
  drawPipes();
  update();
  drawScore();
  requestAnimationFrame(gameLoop);
}

// Event listener untuk mengontrol burung
canvas.addEventListener("click", () => {
  if (gameOver) {
    resetGame();
    gameLoop();
  } else {
    bird.velocity = bird.lift;
  }
});
bgImage.onload = () => {
  gameLoop();
};
