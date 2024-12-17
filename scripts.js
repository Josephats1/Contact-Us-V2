// Canvas Setup
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle Arrays
let particlesArray = [];
let mouseParticlesArray = [];

// Particle Count
const particleCount = 100;

// Mouse Position
const mouse = {
  x: null,
  y: null
};

// Mouse Particle Class
class MouseParticle {
  constructor(x, y, size, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.size = size; // Radius
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.alpha = 1; // Opacity for fade-out effect
  }

  // Draw Mouse Particle
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha; // Apply opacity
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }

  // Update Mouse Particle
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Reduce size and opacity over time
    this.size *= 0.96;
    this.alpha -= 0.02;
  }
}

// Particle Class (Existing Main Particles)
class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Reverse direction at canvas edges
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY = -this.speedY;
    }
  }
}

// Initialize Main Particles
function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;
    particlesArray.push(new Particle(x, y, size, speedX, speedY));
  }
}

// Draw Lines Between Particles
function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

// Handle Mouse Movement
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;

  // Add Mouse Particles on Move
  const size = Math.random() * 5 + 2; // Random size for mouse bubbles
  const speedX = (Math.random() - 0.5) * 2;
  const speedY = (Math.random() - 0.5) * 2;
  const color = `hsl(${Math.random() * 360}, 100%, 60%)`; // Random bright colors
  mouseParticlesArray.push(new MouseParticle(mouse.x, mouse.y, size, speedX, speedY, color));
});

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and Draw Main Particles
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();

  // Update and Draw Mouse Particles
  for (let i = 0; i < mouseParticlesArray.length; i++) {
    mouseParticlesArray[i].update();
    mouseParticlesArray[i].draw();

    // Remove particles that fade out
    if (mouseParticlesArray[i].alpha <= 0) {
      mouseParticlesArray.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

// Handle Window Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Initialize and Animate
initParticles();
animate();

