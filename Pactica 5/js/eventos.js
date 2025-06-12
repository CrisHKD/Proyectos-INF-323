import { Cuaternion } from "./cuaternion.js";
import { multiplica } from "./matrices.js";

export function setupEventos(
  canvas,
  reinicia,
  arcBall,
  MatrizRotacion,
  onTransformChange
) {
  let boton_izq_presionado = false;
  let boton_der_presionado = false;
  let Matriz = new Array(16);

  let tx = 0,
    ty = 0;
  let sx = 1,
    sy = 1,
    sz = 1;

  let inicioTx = 0,
    inicioTy = 0;
  let mouseInicioX = 0,
    mouseInicioY = 0;

  canvas.addEventListener("mousedown", (event) => {
    const { x, y } = getMousePos(canvas, event);

    if (event.button === 0) {
      // botón izquierdo
      Matriz = MatrizRotacion.slice(); // Copiar estado actual
      arcBall.primerPunto(x, y);
      boton_izq_presionado = true;
    } else if (event.button === 2) {
      // botón derecho
      boton_der_presionado = true;
      inicioTx = tx;
      inicioTy = ty;
      mouseInicioX = x;
      mouseInicioY = y;
    }

    event.preventDefault();
  });

  canvas.addEventListener("mouseup", () => {
    boton_izq_presionado = false;
    boton_der_presionado = false;
  });

  canvas.addEventListener("mouseout", () => {
    boton_izq_presionado = false;
    boton_der_presionado = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    const { x, y } = getMousePos(canvas, event);

    if (boton_izq_presionado) {
      const q = arcBall.segundoPunto(x, y);
      Cuaternion.rota2(MatrizRotacion, q);
      multiplica(MatrizRotacion, MatrizRotacion, Matriz);
    } else if (boton_der_presionado) {
      const dx = ((x - mouseInicioX) * 10) / canvas.width;
      const dy = ((y - mouseInicioY) * 10) / canvas.height;
      tx = inicioTx + dx;
      ty = inicioTy - dy;
      if (onTransformChange) onTransformChange({ tx, ty });
    }
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.9 : 1.1;
      sx *= factor;
      sy *= factor;
      sz *= factor;
      if (onTransformChange) onTransformChange({ sx, sy, sz });
    },
    { passive: false }
  );

  const btnReset = document.getElementById("reset");
  if (btnReset) {
    btnReset.onclick = () => {
      tx = 0;
      ty = 0;
      sx = sy = sz = 2;
      MatrizRotacion.fill(0);
      MatrizRotacion[0] =
        MatrizRotacion[5] =
        MatrizRotacion[10] =
        MatrizRotacion[15] =
          1;
      reinicia();
      if (onTransformChange) onTransformChange({ tx, ty, sx, sy, sz });
    };
  }
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
