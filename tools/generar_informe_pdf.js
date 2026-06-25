const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const entrada = path.join(raiz, 'docs', 'INFORME_TPI.md');
const salida = path.join(raiz, 'docs', 'INFORME_TPI.html');

function escaparHtml(valor) {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function textoEnLinea(valor) {
  return escaparHtml(valor)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function convertirTabla(lineas) {
  const filas = lineas
    .filter((linea) => !/^\|?\s*:?-{3,}/.test(linea.replace(/^\|\s*/, '')))
    .map((linea) => linea.split('|').slice(1, -1).map((celda) => textoEnLinea(celda.trim())));

  const encabezado = filas.shift() || [];
  return `<table><thead><tr>${encabezado.map((celda) => `<th>${celda}</th>`).join('')}</tr></thead>` +
    `<tbody>${filas.map((fila) => `<tr>${fila.map((celda) => `<td>${celda}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function markdownAHtml(markdown) {
  const bloques = [];
  let texto = markdown.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lenguaje, contenido) => {
    const clase = lenguaje === 'mermaid' ? 'mermaid' : 'codigo';
    bloques.push(`<pre class="${clase}">${escaparHtml(contenido.trim())}</pre>`);
    return `@@BLOQUE_${bloques.length - 1}@@`;
  });

  const lineas = texto.split(/\r?\n/);
  const html = [];
  let indice = 0;

  while (indice < lineas.length) {
    const linea = lineas[indice];
    if (!linea.trim()) {
      indice += 1;
      continue;
    }
    if (/^\|/.test(linea)) {
      const tabla = [];
      while (indice < lineas.length && /^\|/.test(lineas[indice])) tabla.push(lineas[indice++]);
      html.push(convertirTabla(tabla));
      continue;
    }
    if (/^- /.test(linea)) {
      const items = [];
      while (indice < lineas.length && /^- /.test(lineas[indice])) items.push(lineas[indice++].slice(2));
      html.push(`<ul>${items.map((item) => `<li>${textoEnLinea(item)}</li>`).join('')}</ul>`);
      continue;
    }
    const encabezado = linea.match(/^(#{1,3})\s+(.+)$/);
    if (encabezado) {
      const nivel = encabezado[1].length;
      html.push(`<h${nivel}>${textoEnLinea(encabezado[2])}</h${nivel}>`);
    } else if (/^---+$/.test(linea)) {
      html.push('<hr>');
    } else if (/^\d+\. /.test(linea)) {
      const items = [];
      while (indice < lineas.length && /^\d+\. /.test(lineas[indice])) items.push(lineas[indice++].replace(/^\d+\. /, ''));
      html.push(`<ol>${items.map((item) => `<li>${textoEnLinea(item)}</li>`).join('')}</ol>`);
      continue;
    } else if (/^@@BLOQUE_\d+@@$/.test(linea)) {
      html.push(linea);
    } else {
      html.push(`<p>${textoEnLinea(linea)}</p>`);
    }
    indice += 1;
  }

  return html.join('\n').replace(/@@BLOQUE_(\d+)@@/g, (_, posicion) => bloques[Number(posicion)]);
}

const contenido = fs.readFileSync(entrada, 'utf8');
const cuerpo = markdownAHtml(contenido);
const documento = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Informe Tecnico - Sistema de Gestion de Servicio Tecnico</title>
  <style>
    @page { size: A4; margin: 16mm 14mm 18mm; }
    * { box-sizing: border-box; }
    body { color: #1d2939; font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; }
    h1 { color: #0f3d66; font-size: 23pt; margin: 0 0 18pt; page-break-before: always; }
    h1:first-child { page-break-before: auto; text-align: center; margin-top: 85mm; }
    h2 { color: #0f3d66; font-size: 16pt; border-bottom: 1px solid #9cc4df; margin: 24pt 0 10pt; padding-bottom: 4pt; page-break-after: avoid; }
    h3 { color: #175c8a; font-size: 12.5pt; margin: 18pt 0 8pt; page-break-after: avoid; }
    p { margin: 0 0 8pt; }
    ul, ol { margin: 4pt 0 10pt; padding-left: 22pt; }
    li { margin: 2pt 0; }
    table { border-collapse: collapse; font-size: 8.5pt; margin: 10pt 0 14pt; width: 100%; }
    th { background: #0f3d66; color: white; font-weight: bold; }
    th, td { border: 1px solid #b8c8d6; padding: 5pt; text-align: left; vertical-align: top; }
    tr:nth-child(even) { background: #f4f8fb; }
    code { background: #edf2f7; border-radius: 2px; font-family: Consolas, monospace; font-size: 8.5pt; padding: 1pt 3pt; }
    pre.codigo { background: #17212b; color: #e5edf5; font-family: Consolas, monospace; font-size: 7.5pt; overflow-wrap: break-word; padding: 9pt; white-space: pre-wrap; }
    pre.mermaid { background: #f4f8fb; border: 1px solid #9cc4df; color: #17324d; font-family: Consolas, monospace; font-size: 7.5pt; padding: 9pt; page-break-inside: avoid; white-space: pre-wrap; }
    svg { max-width: 100%; height: auto; }
    hr { border: 0; border-top: 1px solid #9cc4df; margin: 20pt 0; }
  </style>
</head>
<body>
${cuerpo}
</body>
</html>`;

fs.writeFileSync(salida, documento, 'utf8');
console.log(`HTML generado: ${salida}`);
