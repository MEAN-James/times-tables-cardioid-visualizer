window.onload = () => {
  const app = document.querySelector("#app");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { cos, sin, PI } = Math;
  const Tao = PI * 2;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;
  const baseNumberingSystem = 432 * 2;
  const degreeIncriments = 360 / baseNumberingSystem;
  const stop = null;
  const strokeOutterCircles = false;
  let color = "teal";
  let multiplier = 0;
  let drawQue = [];

  // setup canvas
  canvas.width = width;
  canvas.height = height;

  class Circle {
    constructor(x, y, r, strokeColor, fillColor, degree) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.strokeColor = strokeColor || "#fff";
      this.fillColor = fillColor || "#fff";
      this.degree = degree || 0;
    }

    draw(stroke, fill) {
      ctx.moveTo(this.x, this.y);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Tao);
      ctx.closePath();

      if (fill) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
      }

      if (stroke) {
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
      }
    }

    createChildCircleAt(degree, radius, strokeColor, fillColor) {
      const radian = degreeToRadian(degree);
      const x = this.x + this.r * cos(radian);
      const y = this.y + this.r * sin(radian);
      return new Circle(
        x,
        y,
        radius,
        strokeColor,
        fillColor,
        raidanToDegree(radian)
      );
    }

    divideCircle(nTimes, radius) {
      const degree = 360 / nTimes;
      let division = 1;
      while (division <= nTimes) {
        drawQue.push(this.createChildCircleAt(division * degree, radius));
        division++;
      }
    }
  }

  function degreeToRadian(degree) {
    return degree * (PI / 180);
  }
  function raidanToDegree(radian) {
    return radian * (180 / PI);
  }

  function draw() {
    const mainCircle = new Circle(cx, cy, cy * 0.9);

    // empty the que
    drawQue = [];
    // clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // redraw everything
    mainCircle.draw(true);
    mainCircle.divideCircle(baseNumberingSystem, 10);
    drawQue.forEach((item) => item.draw(strokeOutterCircles));

    // draw modular times table
    for (let i = 1; i <= drawQue.length; i++) {
      const product = i * multiplier;
      const newIndex = product % drawQue.length;
      const firstPoint = drawQue[i];
      const secondPoint = drawQue[newIndex];

      if (firstPoint && secondPoint) {
        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        ctx.strokeStyle = color;
        ctx.lineTo(secondPoint.x, secondPoint.y);
        ctx.closePath();
        ctx.stroke();
      } else if (!secondPoint) {
        const percent = newIndex % 1;
        const closest = drawQue[Math.floor(newIndex)];
        const newDegree = closest.degree + degreeIncriments * percent;
        const target = mainCircle.createChildCircleAt(newDegree, 4);

        if (firstPoint && target) {
          ctx.beginPath();
          ctx.moveTo(firstPoint.x, firstPoint.y);
          ctx.strokeStyle = color;
          ctx.lineTo(target.x, target.y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    multiplier += 0.01;
    multiplier = parseFloat(multiplier.toFixed(2));
    draw();
    if (multiplier === stop) {
      return;
    }
    requestAnimationFrame(animate);
  }
  app.appendChild(canvas);
  animate();
};
