export function setupGL(canvas) {
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    document.body.innerHTML = "WebGL 2.0 no está disponible en tu navegador.";
    return null;
  }
  return gl;
}

export function compilaEnlazaLosShaders(gl) {
  // Obtener código fuente de los shaders desde el HTML
  const shaderSourceVS = document.getElementById("vs").textContent.trim();
  const shaderSourceFS = document.getElementById("fs").textContent.trim();

  // Crear y compilar el vertex shader
  const shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shaderDeVertice, shaderSourceVS);
  gl.compileShader(shaderDeVertice);
  if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
    console.error("Error compilando Vertex Shader:\n", gl.getShaderInfoLog(shaderDeVertice));
  }

  // Crear y compilar el fragment shader
  const shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shaderDeFragmento, shaderSourceFS);
  gl.compileShader(shaderDeFragmento);
  if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
    console.error("Error compilando Fragment Shader:\n", gl.getShaderInfoLog(shaderDeFragmento));
  }

  // Crear programa y enlazar shaders
  const programaID = gl.createProgram();
  gl.attachShader(programaID, shaderDeVertice);
  gl.attachShader(programaID, shaderDeFragmento);
  gl.linkProgram(programaID);

  if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
    console.error("Error enlazando programa:\n", gl.getProgramInfoLog(programaID));
  }

  return programaID;
}
