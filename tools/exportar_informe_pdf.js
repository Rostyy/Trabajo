const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const origen = path.join(raiz, 'docs', 'INFORME_TPI.md');
const destino = path.join(raiz, 'docs', 'INFORME_TPI.pdf');

function normalizar(valor) {
  return valor
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2192/g, '->')
    .replace(/\u2022/g, '*');
}

function escaparPdf(valor) {
  return normalizar(valor)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function dividirLinea(texto, limite) {
  const palabras = texto.split(/\s+/);
  const lineas = [];
  let actual = '';
  for (const palabra of palabras) {
    if (!actual) {
      actual = palabra;
    } else if (`${actual} ${palabra}`.length <= limite) {
      actual += ` ${palabra}`;
    } else {
      lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas.length ? lineas : [''];
}

function obtenerLineas(markdown) {
  const salida = [];
  let enCodigo = false;
  let lenguaje = '';

  for (const original of markdown.split(/\r?\n/)) {
    const linea = original.trimEnd();
    const inicioCodigo = linea.match(/^```(.*)$/);
    if (inicioCodigo) {
      if (!enCodigo) {
        enCodigo = true;
        lenguaje = inicioCodigo[1] || 'texto';
        salida.push({ texto: `[Bloque ${lenguaje}]`, tamano: 8, fuente: 'F2', espacio: 11 });
      } else {
        enCodigo = false;
      }
      continue;
    }
    if (enCodigo) {
      salida.push({ texto: linea || ' ', tamano: 7.5, fuente: 'F3', espacio: 9, limite: 96 });
      continue;
    }
    if (!linea.trim()) {
      salida.push({ texto: '', tamano: 8, fuente: 'F1', espacio: 7 });
      continue;
    }
    const titulo = linea.match(/^(#{1,3})\s+(.+)$/);
    if (titulo) {
      const nivel = titulo[1].length;
      salida.push({
        texto: titulo[2],
        tamano: nivel === 1 ? 17 : nivel === 2 ? 13 : 10.5,
        fuente: 'F2',
        espacio: nivel === 1 ? 22 : nivel === 2 ? 17 : 14,
        limite: nivel === 1 ? 58 : 78,
      });
      continue;
    }
    if (/^---+$/.test(linea)) {
      salida.push({ texto: '', tamano: 8, fuente: 'F1', espacio: 10, regla: true });
      continue;
    }
    if (/^\|/.test(linea)) {
      if (/^\|?\s*:?-{3,}/.test(linea.replace(/^\|\s*/, ''))) continue;
      salida.push({ texto: linea.split('|').slice(1, -1).map((v) => v.trim()).join(' | '), tamano: 7.5, fuente: 'F1', espacio: 10, limite: 105 });
      continue;
    }
    salida.push({ texto: linea.replace(/`/g, '').replace(/\*\*/g, ''), tamano: 9, fuente: 'F1', espacio: 12, limite: 94 });
  }
  return salida;
}

function crearPaginas(lineas) {
  const paginas = [[]];
  let y = 790;
  for (const item of lineas) {
    const partes = item.texto ? dividirLinea(item.texto, item.limite || 94) : [''];
    for (const parte of partes) {
      const alto = item.espacio;
      if (y - alto < 52) {
        paginas.push([]);
        y = 790;
      }
      if (item.regla) {
        paginas.at(-1).push(`0.70 0.78 0.85 RG 48 ${y} m 547 ${y} l S`);
      } else if (parte) {
        paginas.at(-1).push(`BT /${item.fuente} ${item.tamano} Tf 48 ${y} Td (${escaparPdf(parte)}) Tj ET`);
      }
      y -= alto;
    }
  }
  return paginas;
}

function crearPdf(paginas) {
  const objetos = [
    null,
    '<< /Type /Catalog /Pages 2 0 R >>',
    null,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ];
  const idsPagina = [];
  for (const lineas of paginas) {
    const contenido = lineas.join('\n');
    const idContenido = objetos.length;
    objetos.push(`<< /Length ${Buffer.byteLength(contenido, 'latin1')} >>\nstream\n${contenido}\nendstream`);
    const idPagina = objetos.length;
    objetos.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${idContenido} 0 R >>`);
    idsPagina.push(idPagina);
  }
  objetos[2] = `<< /Type /Pages /Kids [${idsPagina.map((id) => `${id} 0 R`).join(' ')}] /Count ${idsPagina.length} >>`;

  const partes = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary')];
  const offsets = [0];
  let posicion = partes[0].length;
  for (let id = 1; id < objetos.length; id += 1) {
    offsets[id] = posicion;
    const objeto = Buffer.from(`${id} 0 obj\n${objetos[id]}\nendobj\n`, 'latin1');
    partes.push(objeto);
    posicion += objeto.length;
  }
  const inicioXref = posicion;
  let xref = `xref\n0 ${objetos.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objetos.length; id += 1) xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;
  partes.push(Buffer.from(xref, 'ascii'));
  return Buffer.concat(partes);
}

const markdown = fs.readFileSync(origen, 'utf8');
const pdf = crearPdf(crearPaginas(obtenerLineas(markdown)));
fs.writeFileSync(destino, pdf);
console.log(`PDF generado: ${destino}`);
