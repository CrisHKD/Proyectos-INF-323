import { setupGL, compilaEnlazaLosShaders } from "./shaders.js";
import {
  identidad,
  traslacion,
  escalacion,
  multiplica,
  ortho,
} from "./matrices.js";
import { Cubo } from "./cubo.js";
import { ArcBall } from "./arcball.js";
import { setupEventos } from "./eventos.js";
import { Objeto } from "./objLoader.js";

let canvas, gl;
let programaID;
let cubo, arcBall;

let mostrarMalla = false;
let mostrarColores = true;

// Uniforms
let modelo;

let uMatrizProyeccion, uMatrizVista, uMatrizModelo, uColor;

const modelos = [
  "Modelos/dolphins.obj",
  "Modelos/al.obj",
  "Modelos/cubo2.obj",
  "Modelos/Bosque.obj",
  "Modelos/f-16.obj",
  "Modelos/flowers.obj",
  "Modelos/forest_nature_set_all_in.obj",
  "Modelos/porsche.obj",
];
let indiceModelo = 0;

// Matrices
const MatrizProyeccion = new Array(16);
const MatrizVista = new Array(16);
const MatrizModelo = new Array(16);
const MatrizRotacion = new Array(16);

// Transformaciones
let tx = 0,
  ty = 0;
let sx = 2,
  sy = 2,
  sz = 2;

function dibuja() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  identidad(MatrizModelo);
  traslacion(MatrizModelo, tx, ty, 0);
  escalacion(MatrizModelo, sx, sy, sz);
  escalacion(MatrizModelo, sx, sy, sz);
  multiplica(MatrizModelo, MatrizModelo, MatrizRotacion);

  gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);

  modelo.dibuja(gl, uColor, mostrarMalla, mostrarColores);

  requestAnimationFrame(dibuja);
}

function hexToRgbArray(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function reinicia() {
  tx = 0;
  ty = 0;
  sx = sy = sz = 2;
  identidad(MatrizRotacion);
}

window.onload = () => {
  canvas = document.getElementById("webglcanvas");
  gl = setupGL(canvas);
  if (!gl) return;

  programaID = compilaEnlazaLosShaders(gl);
  gl.useProgram(programaID);

  // Obtener ubicaciones de los uniforms
  uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
  uMatrizVista = gl.getUniformLocation(programaID, "uMatrizVista");
  uMatrizModelo = gl.getUniformLocation(programaID, "uMatrizModelo");
  uColor = gl.getUniformLocation(programaID, "uColor");
  modelo = new Objeto(gl, "Modelos/dolphins.obj");

  document.getElementById("cambiar").onclick = () => {
    indiceModelo = (indiceModelo + 1) % modelos.length;
    modelo = new Objeto(gl, modelos[indiceModelo]); // solo carga rutas locales
    reinicia();
  };

  document.getElementById("toggleMalla").onclick = () => {
    mostrarMalla = !mostrarMalla;
  };

  document.getElementById("toggleColores").onclick = () => {
    mostrarColores = !mostrarColores;
  };

  document.getElementById("escalarMas").onclick = () => {
    sx *= 1.1;
    sy *= 1.1;
    sz *= 1.1;
  };

  document.getElementById("escalarMenos").onclick = () => {
    sx *= 0.9;
    sy *= 0.9;
    sz *= 0.9;
  };

  const btnColorPicker = document.getElementById("btnColorPicker");
  const colorPicker = document.getElementById("colorPicker");

  let colorPersonalizado = [0.53, 0.53, 0.53]; // gris inicial (r, g, b)

  btnColorPicker.onclick = () => {
    colorPicker.click();
  };

  colorPicker.oninput = (event) => {
    const hexColor = event.target.value;
    colorPersonalizado = hexToRgbArray(hexColor).map((c) => c / 255.0); // Normaliza a [0, 1]
  };

  // Configurar matriz de proyección ortográfica
  ortho(MatrizProyeccion, -10, 10, -10, 10, -10, 10);
  gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);

  // Matriz de vista (identidad)
  identidad(MatrizVista);
  gl.uniformMatrix4fv(uMatrizVista, false, MatrizVista);

  // Matriz de rotación inicial
  identidad(MatrizRotacion);

  // Crear geometría y arcball
  //cubo = new Cubo(gl);
  arcBall = new ArcBall(canvas.width, canvas.height);

  // Habilitar pruebas de profundidad y color de fondo
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Eventos de interacción
  setupEventos(
    canvas,
    reinicia,
    arcBall,
    MatrizRotacion,
    ({ tx: ntx, ty: nty, sx: nsx, sy: nsy, sz: nsz } = {}) => {
      if (ntx !== undefined) tx = ntx;
      if (nty !== undefined) ty = nty;
      if (nsx !== undefined) sx = nsx;
      if (nsy !== undefined) sy = nsy;
      if (nsz !== undefined) sz = nsz;
    }
  );

  // Iniciar render
  dibuja();
};
