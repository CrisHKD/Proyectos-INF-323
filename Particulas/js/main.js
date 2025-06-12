import { identidad, traslacion, escalacion, ortho } from "./matrices.js";
import { Ejes } from "./Ejes.js";
import { Circulo } from "./Circulo.js";
import { Ball } from "./Ball.js";
import { Vector } from "./Vector.js";

let programaID, gl;
let ejes, circulo;
let uColor, uMatrizProyeccion, uMatrizVista, uMatrizModelo;
let MatrizProyeccion = new Array(16);
let MatrizVista = new Array(16);
let MatrizModelo = new Array(16);

const balls = [];
const numBalls = 5;

let clicked = false;
let mouseX = 0;
let mouseY = 0;

let viento = false;
let gravedad = false;

let frameCount = 0;
var framesPorNuevaBall = 10; // cada 60 frames (~1 segundo a 60fps)
const particles = [];

let lluvia = false;

const checkViento = document.getElementById("checkViento");
const inputFactor = document.getElementById("inputFactor");
const inputCantidad = document.getElementById("inputCantidad");
const checkLluvia = document.getElementById("checkLluvia");
const checkGravedad = document.getElementById("checkGravedad");

checkViento.addEventListener("change", () => {
  viento = checkViento.checked;
});
checkGravedad.addEventListener("change", () => {
  gravedad = checkGravedad.checked;
});
checkLluvia.addEventListener("change", () => {
  lluvia = checkLluvia.checked;
  console.log("Lluvia:", lluvia);
});

const canvas = document.getElementById("webglcanvas");

// Cuando se presiona el botón del mouse sobre el canvas
canvas.addEventListener("mousedown", (e) => {
  clicked = true;
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  console.log("Mouse down en:", mouseX, mouseY);
});

// Cuando se suelta el botón del mouse
canvas.addEventListener("mouseup", (e) => {
  clicked = false;
  console.log("Mouse up");
});

// Opcional: cuando el mouse se mueve mientras está presionado
canvas.addEventListener("mousemove", (e) => {
  if (clicked) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    console.log("x: " + mouseX, "Y: " + mouseY);
    // console.log("Mouse drag en:", mouseX, mouseY);
  }
});

const inputGravedadX = document.getElementById("inputGravedadX");
const inputGravedadY = document.getElementById("inputGravedadY");

for (let i = 0; i < numBalls; i++) {
  balls.push(
    new Ball(0.7 + Math.random() * 0.5, (i*2)-9, 0)
  );
}

function mapValue(value, fromLow, fromHigh, toLow, toHigh) {
  return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  frameCount++;
  frameCount = frameCount % 60;

  // Crear y agregar una particula
  framesPorNuevaBall = parseInt(60/inputCantidad.value)


  if(frameCount % framesPorNuevaBall === 0 && lluvia){
    const x = 0;
    const y = (0.1 + Math.random() * -1 ) / 100;

    var BALL = new Ball(
      0.1 + Math.random() * 0.03,
      Math.random() * 30 - 15,
      10,
      true,
      parseFloat(inputFactor.value)
    );
    BALL.velocity.x = x;
    BALL.velocity.y = y;

    particles.push(BALL);
  }
  if (frameCount % framesPorNuevaBall === 0 && clicked && !lluvia) {
    const x = (0.1+Math.random() * 2 - 1) / 20;
    const y = (0.1 + Math.random() * 2 - 1) / 10;

    const mappedX = mapValue(mouseX, 0, 660, -10, 10);
    const mappedY = mapValue(mouseY, 0, 600, 10, -10);

    var BALL = new Ball(
      0.2 + Math.random() * 0.2,
      mappedX,
      mappedY,
      true,
      parseFloat(inputFactor.value)
    );
    BALL.velocity.x = x;
    BALL.velocity.y = y;

    particles.push(BALL);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const ball = particles[i];

    ball.update();
    //-------------------------------------------------------------------
    //ball.checkEdges(10, 9); // Ejemplo límites de [-1,1]

    if (ball.timeToLive < 0) {
      particles.splice(i, 1); // elimina la bola en la posición i
      continue; // salta a la siguiente iteración
    }

    if (viento) ball.applyForce(new Vector(0.002, 0));

    if (gravedad) {
      const gx = parseFloat(inputGravedadX.value)/1000 || 0;
      const gy = parseFloat(inputGravedadY.value)/100 || 0;
      
      ball.applyForce(new Vector(gx, gy));
    }

    let matrizModelo = new Array(16);
    identidad(matrizModelo);
    traslacion(matrizModelo, ball.position.x, ball.position.y, 0);
    escalacion(matrizModelo, ball.mass, ball.mass, 1);

    gl.uniformMatrix4fv(uMatrizModelo, false, matrizModelo);
    gl.uniform4f(uColor, 1, 0, 0, 1);
    circulo.dibuja(gl, true);
  }

  // Actualizar las esferas
  balls.forEach((ball) => {
    ball.update();
    ball.checkEdges(10, 9); // Ejemplo límites de [-1,1]

    // Construir matriz modelo para trasladar y escalar el círculo
    let matrizModelo = new Array(16);

    if (viento) {
      ball.applyForce(new Vector(0.003, 0));
    }
    ball.applyForce(new Vector(0, -0.01));

    identidad(matrizModelo);
    traslacion(matrizModelo, ball.position.x, ball.position.y, 0);
    escalacion(matrizModelo, ball.mass, ball.mass, 1);

    gl.uniformMatrix4fv(uMatrizModelo, false, matrizModelo);

    // Define color (puedes variar por bola)
    gl.uniform4f(uColor, 1, 0, 0, 1);

    // Dibuja el círculo en la posición y escala de la bola
    circulo.dibuja(gl, true);
  });

  requestAnimationFrame(render);
}

function compilaEnlazaLosShaders() {
  const vsSource = document.getElementById("vs").text.trim();
  const fsSource = document.getElementById("fs").text.trim();

  const shaderVert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shaderVert, vsSource);
  gl.compileShader(shaderVert);
  if (!gl.getShaderParameter(shaderVert, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shaderVert));
  }

  const shaderFrag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shaderFrag, fsSource);
  gl.compileShader(shaderFrag);
  if (!gl.getShaderParameter(shaderFrag, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shaderFrag));
  }

  programaID = gl.createProgram();
  gl.attachShader(programaID, shaderVert);
  gl.attachShader(programaID, shaderFrag);
  gl.linkProgram(programaID);
  if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(programaID));
  }
  gl.useProgram(programaID);
}

function dibuja() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  identidad(MatrizModelo);

  gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
  ejes.dibuja(gl);

  // Azul - círculo en origen
  gl.uniform4f(uColor, 0, 0, 1, 1);
  gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
  circulo.dibuja(gl, true);

  // Rojo - círculo trasladado a x=8
  gl.uniform4f(uColor, 1, 0, 0, 1);
  traslacion(MatrizModelo, 8, 0, 0);
  gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
  circulo.dibuja(gl, true);

  // Verde - círculo trasladado y escalado
  gl.uniform4f(uColor, 0, 1, 0, 1);
  traslacion(MatrizModelo, -3, 2, 0);
  escalacion(MatrizModelo, 1, 4, 1);
  gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
  circulo.dibuja(gl, true);
}

function main() {
  const canvas = document.getElementById("webglcanvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("WebGL 2.0 no está disponible en tu navegador");
    return;
  }
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  compilaEnlazaLosShaders();

  ejes = new Ejes(
    gl,
    programaID ? gl.getUniformLocation(programaID, "uColor") : null
  );
  circulo = new Circulo(gl);

  gl.useProgram(programaID);

  uColor = gl.getUniformLocation(programaID, "uColor");
  uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
  uMatrizVista = gl.getUniformLocation(programaID, "uMatrizVista");
  uMatrizModelo = gl.getUniformLocation(programaID, "uMatrizModelo");

  ortho(MatrizProyeccion, -10, 10, -10, 10, -10, 10);
  gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);

  identidad(MatrizVista);
  gl.uniformMatrix4fv(uMatrizVista, false, MatrizVista);

  gl.clearColor(0, 0, 0, 1);

  dibuja();
  render();
}

window.onload = main;
