class Grupo {
  constructor() {
    this.nombre = "si_falta"; /* Nombre del grupo */
    this.triangulos = new Array(); /* Arreglo de índice de triangulos */
    this.material = 0; /* Indice del color del material del grupo */
  }
  setNombre(nombre) {
    this.nombre = nombre;
  }
  getNombre() {
    return this.nombre;
  }
  adiTriangulo(t) {
    this.triangulos.push(t);
  }
  getTriangulo(indice) {
    return this.triangulos[indice];
  }
  getNumTriangulos() {
    return this.triangulos.length;
  }
  setMaterial(material) {
    this.material = material;
  }
  getMaterial() {
    return this.material;
  }
  toString() {
    return (
      this.nombre +
      "<br> triangulos: " +
      this.triangulos +
      "<br> material  : " +
      this.material
    );
  }
}

class Material {
  constructor() {
    this.nombre = "si_falta"; /* Nombre del material */
    this.ambiente = [0.2, 0.2, 0.2]; /* Arreglo del color ambiente */
    this.difuso = [0.8, 0.8, 0.8]; /* Arreglo del color difuso */
    this.especular = [0.0, 0.0, 0.0]; /* Arreglo del color especular */
    this.brillo = 0; /* Exponente del brillo */
  }
  setNombre(nombre) {
    this.nombre = nombre;
  }
  getNombre() {
    return this.nombre;
  }
  setAmbiente(ambiente) {
    this.ambiente = ambiente;
  }
  getAmbiente() {
    return this.ambiente;
  }
  setDifuso(difuso) {
    this.difuso = difuso;
  }
  getDifuso() {
    return this.difuso;
  }
  setEspecular(especular) {
    this.especular = especular;
  }
  getEspecular() {
    return this.especular;
  }
  setBrillo(brillo) {
    this.brillo = brillo;
  }
  getBrillo() {
    return this.brillo;
  }
  toString() {
    return (
      this.nombre +
      "<br> Ka: " +
      this.ambiente +
      "<br> Kd: " +
      this.difuso +
      "<br> Ks: " +
      this.especular +
      "<br> Ns: " +
      this.brillo
    );
  }
}

class Cadena {
  constructor(cadena) {
    this.cadena = cadena;
    this.indice = 0;
  }
  esDelimitador(c) {
    return (
      c == " " || c == "\t" || c == "(" || c == ")" || c == '"' || c == "'"
    );
  }
  saltaDelimitadores() {
    let n = this.cadena.length;
    while (
      this.indice < n &&
      this.esDelimitador(this.cadena.charAt(this.indice))
    ) {
      this.indice++;
    }
  }
  obtLongPalabra(inicio) {
    var i = inicio;
    while (
      i < this.cadena.length &&
      !this.esDelimitador(this.cadena.charAt(i))
    ) {
      i++;
    }
    return i - inicio;
  }
  getToken() {
    var n, subcadena;
    this.saltaDelimitadores();
    n = this.obtLongPalabra(this.indice);
    if (n === 0) {
      return null;
    }
    subcadena = this.cadena.substr(this.indice, n);
    this.indice = this.indice + (n + 1);
    return subcadena.trim();
  }
  getInt() {
    var token = this.getToken();
    if (token) {
      return parseInt(token, 10);
    }
    return null;
  }
  getFloat() {
    var token = this.getToken();
    if (token) {
      return parseFloat(token);
    }
    return null;
  }
}

class Objeto {
  constructor(gl, nombreArchivo) {
    var lineas, token, x, y, z, a, b;
    var minX, maxX, minY, maxY, minZ, maxZ;
    var numVertices, numTriangulos, indiceDeGrupo;
    var hayGrupos;
    this.vertices = [];
    this.indices = [];

    /* Número de Vértices */
    numVertices = 0;

    /* Número de Triángulos */
    numTriangulos = 0;

    /* Arreglo de Grupos */
    this.grupos = [];

    hayGrupos = false;

    /* Arreglo de los colores de los Materiales */
    this.materiales = [];

    /* Lee el archivo .obj */
    let datos_obj = this.leeArchivo(nombreArchivo);

    /* Divide por lineas */
    lineas = datos_obj.split("\n");

    minX = Number.MAX_VALUE;
    maxX = Number.MIN_VALUE;
    minY = Number.MAX_VALUE;
    maxY = Number.MIN_VALUE;
    minZ = Number.MAX_VALUE;
    maxZ = Number.MIN_VALUE;

    for (let i = 0; i < lineas.length; i++) {
      let cad = new Cadena(lineas[i]); // Inicia el procesamiento de cadenas
      token = cad.getToken();
      if (token != null) {
        switch (token) {
          case "#":
            continue;
          case "mtllib" /* nombre del arch. de materiales */:
            let nombreArchivoMTL = cad.getToken();
            this.lee_datos_archivo_mtl(nombreArchivoMTL);
            break;
          case "v" /* vértice */:
            x = cad.getFloat();
            y = cad.getFloat();
            z = cad.getFloat();
            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(z);
            numVertices++;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
            break;
          case "g":
          case "group" /* nombre de grupo */:
            let nombreGrupo = cad.getToken();
            indiceDeGrupo = this.buscaGrupo(nombreGrupo);
            if (indiceDeGrupo == -1) {
              /* Agrega a la lista de grupo un nuevo grupo*/
              let grupo = new Grupo();
              grupo.setNombre(nombreGrupo);
              this.grupos.push(grupo); /* Guarda en el arreglo de grupos */
              indiceDeGrupo = this.grupos.length - 1;
            }
            hayGrupos = true;
            break;
          case "usemtl" /* nombre del material */:
            let nombreMaterial = cad.getToken();
            let indiceDeMaterial = this.buscaMaterial(nombreMaterial);
            if (!hayGrupos) {
              // Si no hay un grupo
              indiceDeGrupo = this.buscaMaterialPorGrupo(indiceDeMaterial);
              if (indiceDeGrupo == -1) {
                /* Agrega a la lista de grupo un nuevo grupo*/
                let grupo = new Grupo();
                grupo.setNombre(nombreMaterial);
                this.grupos.push(grupo); /* Guarda en el arreglo de grupos */
                indiceDeGrupo = this.grupos.length - 1;
              }
            }
            /* Asigna al grupo el indice del material */
            this.grupos[indiceDeGrupo].setMaterial(indiceDeMaterial);
            break;
          case "f" /* cara */:
            a = cad.getInt() - 1;
            this.indices.push(a); // v0
            b = cad.getInt() - 1;
            this.indices.push(b); // v1
            b = cad.getInt() - 1;
            this.indices.push(b); // v2

            /* Asigna al grupo el indice del material */
            this.grupos[indiceDeGrupo].adiTriangulo(numTriangulos);

            numTriangulos++;

            var tokenEntero = cad.getInt();
            while (tokenEntero != null) {
              this.indices.push(a); // v0
              this.indices.push(b); // v2
              b = tokenEntero - 1;
              this.indices.push(b); // v3

              /* Asigna al grupo el indice del material */
              this.grupos[indiceDeGrupo].adiTriangulo(numTriangulos);

              numTriangulos++;

              tokenEntero = cad.getInt();
            }

            break;
        }
      }
    }

    /* Redimensiona las coordenadas entre [-1,1] */
    var tam_max = 0,
      escala;
    tam_max = Math.max(tam_max, maxX - minX);
    tam_max = Math.max(tam_max, maxY - minY);
    tam_max = Math.max(tam_max, maxZ - minZ);
    escala = 2.0 / tam_max;

    /* Actualiza los vértices */
    for (let i = 0; i < numVertices * 3; i += 3) {
      this.vertices[i] = escala * (this.vertices[i] - minX) - 1.0;
      this.vertices[i + 1] = escala * (this.vertices[i + 1] - minY) - 1.0;
      this.vertices[i + 2] = escala * (this.vertices[i + 2] - minZ) - 1.0;
    }
  }

  dibuja(gl, uColor, modoMalla = false, mostrarColores = true) {
    var numTriangulos, indiceDeMaterial, color, k;
    for (let i = 0; i < this.grupos.length; i++) {
      numTriangulos = this.grupos[i].getNumTriangulos();
      if (numTriangulos == 0) continue;

      let indAux = [];

      for (let j = 0; j < numTriangulos; j++) {
        let numTrian = this.grupos[i].getTriangulo(j);
        let i0 = this.indices[numTrian * 3 + 0];
        let i1 = this.indices[numTrian * 3 + 1];
        let i2 = this.indices[numTrian * 3 + 2];

        if (modoMalla) {
          // Añadir líneas por cada arista del triángulo
          indAux.push(i0, i1);
          indAux.push(i1, i2);
          indAux.push(i2, i0);
        } else {
          indAux.push(i0, i1, i2); // Triángulos normales
        }
      }

      var codigoVertices = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.vertices),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

      this.codigoDeIndices = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.codigoDeIndices);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indAux),
        gl.STATIC_DRAW
      );

      indiceDeMaterial = this.grupos[i].getMaterial();
      color = this.materiales[indiceDeMaterial].getDifuso();
      gl.uniform4f(uColor, color[0], color[1], color[2], 1);

      if (typeof mostrarColores !== "undefined" && !mostrarColores) {
        gl.uniform4f(uColor, 0.5, 0.5, 0.5, 1); // Gris
      } else {
        color = this.materiales[indiceDeMaterial].getDifuso();
        gl.uniform4f(uColor, color[0], color[1], color[2], 1);
      }

      // Elegir el modo de dibujo
      const modoDibujo = modoMalla ? gl.LINES : gl.TRIANGLES;
      gl.drawElements(modoDibujo, indAux.length, gl.UNSIGNED_SHORT, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  /* Lee el archivo OBJ */
  leeArchivo(nombreArchivo) {
    var byteArray = [];
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status !== 404) {
        byteArray = request.responseText;
      }
    };
    request.open("GET", nombreArchivo, false); // Crea una solicitud para abrir el archivo
    request.send(null); // Enviando la solicitud
    return byteArray;
  }

  /* Lee los datos de un archivo .MTL (archivo de los colores de los materiales) */
  lee_datos_archivo_mtl(nombreArchivoMTL) {
    let datos_mtl = this.leeArchivo("Modelos/" + nombreArchivoMTL);

    /* Divide por lineas */
    let lineas = datos_mtl.split("\n");

    let token;
    for (let i = 0; i < lineas.length; i++) {
      let cad = new Cadena(lineas[i]); // Inicia el procesamiento de cadenas
      token = cad.getToken();
      if (token != null) {
        switch (token) {
          case "#":
            continue;
          case "newmtl" /* nombre del material */:
            let nombreMaterial = cad.getToken();
            let material = new Material();
            material.setNombre(nombreMaterial);
            this.materiales.push(material);
            break;
          case "Ka" /* ambiente */:
            let ambiente = new Array(3);
            ambiente[0] = cad.getFloat();
            ambiente[1] = cad.getFloat();
            ambiente[2] = cad.getFloat();
            this.materiales[this.materiales.length - 1].setAmbiente(ambiente);
            break;
          case "Kd" /* difuso */:
            var difuso = new Array(3);
            difuso[0] = cad.getFloat();
            difuso[1] = cad.getFloat();
            difuso[2] = cad.getFloat();
            this.materiales[this.materiales.length - 1].setDifuso(difuso);
            break;
          case "Ks" /* especular */:
            var especular = new Array(3);
            especular[0] = cad.getFloat();
            especular[1] = cad.getFloat();
            especular[2] = cad.getFloat();
            this.materiales[this.materiales.length - 1].setEspecular(especular);
            break;
          case "Ns" /* brillo */:
            var brillo = cad.getFloat();
            this.materiales[this.materiales.length - 1].setBrillo(brillo);
            break;
        }
      }
    }
  }

  /* Busca el grupo */
  buscaGrupo(nombre) {
    for (let i = 0; i < this.grupos.length; i++)
      if (nombre == this.grupos[i].getNombre()) return i;
    return -1;
  }

  /* Busca el Material */
  buscaMaterial(nombre) {
    for (let i = 0; i < this.materiales.length; i++)
      if (nombre == this.materiales[i].getNombre()) return i;
    return -1;
  }

  /* Busca el Material que se encuentra en el grupo */
  buscaMaterialPorGrupo(indice) {
    for (let i = 0; i < this.grupos.length; i++)
      if (indice == this.grupos[i].getMaterial()) return i;
    return -1;
  }
}

export { Objeto };
