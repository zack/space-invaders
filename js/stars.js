const canvas = document.getElementById("starfield");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
const stars = 1000;

for (var i = 0; i < stars; i++) {
  const x = Math.random() * canvas.offsetWidth;
  const y = Math.random() * canvas.offsetHeight;
  const radius = 1;//Math.random() * 1.2;
  context.beginPath();
  context.arc(x, y, radius, 0, 360);
  context.fillStyle = "hsla(0, 0%, 100%, 0.8)";
  context.fill();
}
