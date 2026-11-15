/* Laboratorio: dibujo SVG generado a partir de las mismas coordenadas que la guía. */
(() => {
  const root = document.getElementById('lab-app');
  if (!root) return;
  const X = n => 166 + (n - 1) * 19;
  const Y = { '+': 78, '−': 100, A: 150, B: 170, C: 190, D: 210, E: 230, F: 292, G: 312, H: 332, I: 352, J: 372, 'b+': 426, 'b−': 448 };
  const state = { lesson: 'gates', selected: 'xor', switches: [1, 0, 1, 0, 1, 0, 0, 0] };
  const gateData = [
    { id: 'xor', label: 'XOR', chip: '74HC86', start: 18, switches: [0, 1], color: '#eb6060', led: 54, output: 20, result: (a, b) => a ^ b, rule: 'Se enciende cuando solo uno de los dos interruptores está en ON.' },
    { id: 'and', label: 'AND', chip: '74HC08', start: 31, switches: [2, 3], color: '#56c57d', led: 58, output: 33, result: (a, b) => a & b, rule: 'Se enciende cuando los dos interruptores están en ON.' },
    { id: 'or', label: 'OR', chip: '74HC32', start: 44, switches: [4, 5], color: '#e5bb53', led: 62, output: 46, result: (a, b) => a | b, rule: 'Se enciende cuando al menos un interruptor está en ON.' }
  ];
  const lit = gate => gate.result(state.switches[gate.switches[0]], state.switches[gate.switches[1]]);
  const hole = (x, y, cls = '') => `<circle class="lab-hole ${cls}" cx="${x}" cy="${y}" r="3.8"/><circle class="lab-hole-core" cx="${x}" cy="${y}" r="2.2"/>`;
  const path = (d, color, extra = '') => `<path class="lab-wire ${extra}" d="${d}" stroke="${color}"/>`;
  const link = (a, b, lane, color, extra = '') => path(`M${X(a)} ${Y.H} L${X(a)} ${lane} L${X(b)} ${lane} L${X(b)} ${Y.H}`, color, extra);
  function boardBase() {
    let out = `<rect x="140" y="48" width="1234" height="422" rx="12" fill="#d9d9d9" stroke="#c9c9c9"/>
      <rect x="148" y="116" width="1218" height="20" fill="#d1d1d1" opacity=".6"/>
      <rect x="148" y="390" width="1218" height="20" fill="#d1d1d1" opacity=".6"/>
      <path d="M154 121H1360M154 402H1360" stroke="#bcbcbc" stroke-width="1"/>
      <path d="M153 245H1361" stroke="#c4c4c4" stroke-width="4"/>
      <path d="M154 88H1360M154 436H1360" stroke="#f0aaa8" stroke-width="2" opacity=".5"/>
      <path d="M154 110H1360M154 458H1360" stroke="#91b8cf" stroke-width="2" opacity=".5"/>
      <text x="150" y="92" class="lab-rail-plus">+</text><text x="150" y="112" class="lab-rail-minus">−</text>
      <text x="150" y="440" class="lab-rail-plus">+</text><text x="150" y="462" class="lab-rail-minus">−</text>`;
    for (const [letter, y] of Object.entries(Y)) {
      if (!/^[A-J]$/.test(letter)) continue;
      out += `<text x="147" y="${y + 4}" class="lab-row-label">${letter}</text><text x="1361" y="${y + 4}" class="lab-row-label">${letter}</text>`;
    }
    for (let n = 1; n <= 63; n++) {
      for (const key of ['+', '−', 'b+', 'b−', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) out += hole(X(n), Y[key]);
      if (n === 1 || n % 5 === 0 || n === 63) out += `<text x="${X(n)}" y="140" class="lab-number">${n}</text>`;
    }
    // Muchos modelos tienen rieles partidos: las marcas indican dónde se debe puentear.
    for (const yy of [78, 100, 426, 448]) out += `<rect x="${X(31) + 5}" y="${yy - 5}" width="10" height="10" fill="#d9d9d9"/>`;
    out += `<g class="lab-supply"><rect x="8" y="166" width="113" height="183" rx="5" fill="#dedede" stroke="#bcbcbc"/><rect x="18" y="240" width="42" height="94" rx="2" fill="#b7c2c5" stroke="#777"/><rect x="67" y="240" width="42" height="94" rx="2" fill="#b7c2c5" stroke="#777"/><circle cx="38" cy="207" r="17" fill="#777"/><circle cx="92" cy="207" r="17" fill="#777"/><circle cx="121" cy="263" r="7" fill="#c92d2d"/><circle cx="121" cy="228" r="7" fill="#414141"/><text x="18" y="160" class="lab-supply-label">FUENTE 5 V</text></g>`;
    out += path(`M121 263 H132 Q140 263 140 275 V${Y['+']} H${X(1)}`, '#e83232');
    out += path(`M121 228 V75 Q121 68 131 68 H${X(1)} V${Y['−']}`, '#333');
    out += path(`M${X(1)} ${Y['−']} V${Y['b−']}`, '#333');
    return out;
  }
  function chip(gate) {
    const n = gate.start, w = X(n + 6) - X(n) + 20;
    let out = `<g class="lab-chip"><rect x="${X(n) - 10}" y="238" width="${w}" height="47" rx="4"/><circle cx="${X(n) - 10}" cy="261" r="5" fill="#d9d9d9"/><text x="${X(n + 3)}" y="266" text-anchor="middle">${gate.chip}</text>`;
    for (let i = 0; i < 7; i++) out += `<rect x="${X(n + i) - 3}" y="229" width="6" height="10" rx="1" fill="#aaa"/><rect x="${X(n + i) - 3}" y="283" width="6" height="10" rx="1" fill="#aaa"/>`;
    return out + '</g>';
  }
  function resistor(x, y1, y2, label = '') {
    const mid = (y1 + y2) / 2;
    return `<g class="lab-resistor"><path d="M${x} ${y1}V${mid - 12}M${x} ${mid + 12}V${y2}" stroke="#a6a6a6" stroke-width="3"/><rect x="${x - 7}" y="${mid - 12}" width="14" height="24" rx="4" fill="#c5a16c" stroke="#88693f"/><path d="M${x - 7} ${mid - 6}h14M${x - 7} ${mid}h14M${x - 7} ${mid + 6}h14" stroke="#c12b2b" stroke-width="3"/><title>${label}</title></g>`;
  }
  function horizontalResistor(n1, n2, label) {
    const cx = (X(n1) + X(n2)) / 2;
    return `<g class="lab-resistor"><path d="M${X(n1)} ${Y.J}H${cx - 14}M${cx + 14} ${Y.J}H${X(n2)}" stroke="#a6a6a6" stroke-width="3"/><rect x="${cx - 14}" y="${Y.J - 7}" width="28" height="14" rx="4" fill="#c5a16c" stroke="#88693f"/><path d="M${cx - 7} ${Y.J - 7}v14M${cx} ${Y.J - 7}v14M${cx + 7} ${Y.J - 7}v14" stroke="#c12b2b" stroke-width="3"/><title>${label}</title></g>`;
  }
  function led(n, color, on, label) {
    const cx = (X(n) + X(n + 1)) / 2;
    return `<g class="lab-led ${on ? 'is-lit' : ''}"><ellipse cx="${cx}" cy="${Y.F + 2}" rx="12" ry="17" fill="${color}" stroke="#6f6f6f" stroke-width="2"/><path d="M${X(n)} ${Y.F + 16}V${Y.J}M${X(n + 1)} ${Y.F + 16}V${Y.J}" stroke="#888" stroke-width="2"/><text x="${cx}" y="${Y.F - 22}" text-anchor="middle" class="lab-led-label">${label}</text></g>`;
  }
  function basicCircuit() {
    let s = boardBase();
    s += resistor(X(14), Y['+'], Y.A, '330 Ω');
    s += `<g class="lab-led is-lit"><path d="M${X(14)} ${Y.B}V${Y.B + 30}H${X(15) - 11}M${X(15) + 11} ${Y.B + 30}H${X(16)}V${Y.B}" fill="none" stroke="#888" stroke-width="3"/><ellipse cx="${X(15)}" cy="${Y.B + 30}" rx="12" ry="15" fill="#dc4f4c" stroke="#6f6f6f" stroke-width="2"/><text x="${X(15)}" y="${Y.B - 12}" text-anchor="middle" class="lab-led-label">LED</text></g>`;
    s += path(`M${X(16)} ${Y.E} V${Y['−']}`, '#333');
    s += `<text x="${X(14) - 8}" y="${Y.J + 22}" class="lab-note">A14 / B14 → B16 / E16</text>`;
    return s;
  }
  function gatesCircuit() {
    let s = boardBase();
    // Los rieles positivos y de tierra se puentean cuando están partidos.
    for (const yy of [Y['+'], Y['−'], Y['b−']]) s += path(`M${X(30)} ${yy} H${X(34)}`, yy === Y['+'] ? '#e83232' : '#333');
    s += `<g class="lab-dip"><rect x="${X(3) - 15}" y="236" width="${X(10) - X(3) + 30}" height="52" rx="3" fill="#d72825"/><text x="${X(6.5)}" y="249" text-anchor="middle">DIP 8 · ON ↑</text>`;
    for (let i = 0; i < 8; i++) {
      const n = i + 3;
      s += `<rect x="${X(n) - 6}" y="250" width="12" height="23" rx="1" fill="#a31b1b"/><rect x="${X(n) - 5}" y="${state.switches[i] ? 252 : 260}" width="10" height="10" fill="#f0eee5"/><text x="${X(n)}" y="284" text-anchor="middle">${i + 1}</text>`;
    }
    s += '</g>';
    for (let i = 0; i < 6; i++) {
      const n = i + 3;
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += resistor(X(n), Y.J + 1, Y['b−'] - 2, '10 kΩ pull-down');
    }
    const inputTargets = [18, 19, 31, 32, 44, 45];
    const inputColors = ['#3d9bd0', '#3d9bd0', '#47b472', '#47b472', '#e6ad42', '#e6ad42'];
    for (let i = 0; i < 6; i++) s += link(i + 3, inputTargets[i], 345 + (i % 2) * 12 + Math.floor(i / 2) * 14, inputColors[i]);
    for (const gate of gateData) {
      const n = gate.start;
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += path(`M${X(n + 6)} ${Y.J} V${Y['b−']}`, '#333');
      // Seis entradas no usadas por integrado: cuatro arriba y dos abajo.
      for (const k of [n + 1, n + 2, n + 4, n + 5]) s += path(`M${X(k)} ${Y['−']} V${Y.A}`, '#6f7780', 'lab-unused');
      for (const k of [n + 3, n + 4]) s += path(`M${X(k)} ${Y.J} V${Y['b−']}`, '#6f7780', 'lab-unused');
      s += chip(gate);
      const c = gate.led - 2;
      s += link(gate.output, c, 405 - (gate.id === 'xor' ? 0 : gate.id === 'and' ? 10 : 20), gate.color, 'lab-output-wire');
      s += horizontalResistor(gate.led - 2, gate.led, '1 kΩ LED');
      s += led(gate.led, gate.color, lit(gate), gate.label);
      s += path(`M${X(gate.led + 1)} ${Y.J} V${Y['b−']}`, '#333');
    }
    s += `<text x="${X(3)}" y="215" class="lab-component-label">S1–S8</text>`;
    return s;
  }
  const svg = content => `<svg class="lab-svg" viewBox="0 0 1390 500" role="img" aria-label="Protoboard horizontal de 63 columnas, agujeros A a J y rieles de alimentación; ${state.lesson === 'gates' ? 'tres integrados, interruptor DIP y tres LED' : 'resistencia y LED'}">${content}</svg>`;
  const truth = gate => `<table class="lab-truth"><thead><tr><th>A</th><th>B</th><th>${gate.label}</th></tr></thead><tbody>${[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => `<tr class="${state.switches[gate.switches[0]] === a && state.switches[gate.switches[1]] === b ? 'current' : ''}"><td>${a}</td><td>${b}</td><td>${gate.result(a, b)}</td></tr>`).join('')}</tbody></table>`;
  function lessonHtml() {
    if (state.lesson === 'basic') return `<div class="lab-columns"><div class="lab-guide"><h3>Práctica 01 · Un LED</h3><ol><li>Fuente regulada apagada: rojo a <strong>+14</strong>, negro a <strong>−16</strong>.</li><li>Resistencia de <strong>330 Ω</strong> entre <strong>+14 y A14</strong>.</li><li>Ánodo del LED en <strong>B14</strong>; cátodo en <strong>B16</strong>.</li><li>Cable de <strong>E16 a −16</strong>. Revisa y enciende la fuente a 5 V.</li></ol><p>A–E de la misma columna se conectan entre sí. F–J forman otro grupo, separado por la ranura central.</p></div><div class="lab-guide lab-callout"><h3>Antes de conectar</h3><p>La pata larga suele ser el ánodo. El lado plano y la pata corta suelen señalar el cátodo. La resistencia puede ir antes o después del LED, siempre en serie.</p><p>Si la placa tiene rieles partidos, une sus tramos cuando el circuito los use. Compruébalo con un multímetro.</p></div></div>`;
    const active = gateData.find(g => g.id === state.selected);
    return `<div class="lab-control-row"><div><strong>DIP switch de 8 posiciones</strong><p>ON = 1 (+5 V). OFF = 0 por la resistencia pull-down de 10 kΩ. Cambia los interruptores para probar el circuito.</p></div><div class="lab-switches" role="group" aria-label="Simulador del DIP switch">${state.switches.map((v, i) => `<button type="button" class="lab-switch ${v ? 'on' : ''} ${i > 5 ? 'spare' : ''}" data-switch="${i}" aria-pressed="${!!v}" aria-label="Interruptor S${i + 1}, ${v ? 'ON' : 'OFF'}${i > 5 ? ', libre' : ''}"><span>S${i + 1}</span><b>${v ? 'ON' : 'OFF'}</b></button>`).join('')}</div></div>
    <div class="lab-gate-tabs" role="group" aria-label="Seleccionar montaje">${gateData.map(g => `<button type="button" data-gate="${g.id}" class="${active.id === g.id ? 'active' : ''}" aria-pressed="${active.id === g.id}"><span class="lab-status" style="--gate-color:${g.color};opacity:${lit(g) ? 1 : .4}"></span>${g.label} <small>${g.chip}</small></button>`).join('')}</div>
    <div class="lab-columns"><article class="lab-guide"><span class="lab-kicker">MONTAJE ${active.label} · ${active.chip}</span><h3>Un LED controlado por ${active.label}</h3><p>${active.rule}</p><p>Interruptores <strong>S${active.switches[0] + 1} / S${active.switches[1] + 1}</strong> → entradas <strong>1 / 2</strong> del integrado → salida <strong>3</strong> → resistencia de <strong>1 kΩ</strong> → LED.</p><div class="lab-state-readout">A = ${state.switches[active.switches[0]]} · B = ${state.switches[active.switches[1]]} · salida = <strong>${lit(active)}</strong> · LED <strong>${lit(active) ? 'ENCENDIDO' : 'APAGADO'}</strong></div>${truth(active)}</article>
    <article class="lab-guide"><span class="lab-kicker">COORDENADAS EXACTAS</span><h3>Conecta ${active.chip}</h3>${coordinateHtml(active)}</article></div>
    <details class="lab-extra"><summary>Pines libres, condensadores y comprobaciones</summary><p><strong>Entradas no usadas:</strong> conéctalas a GND; no dejes entradas CMOS flotando. Para cada chip que empieza en la columna N, conecta A(N+1), A(N+2), A(N+4), A(N+5) al riel − superior y J(N+3), J(N+4) al riel − inferior. N es 18, 31 o 44. Esas conexiones aparecen en gris en el dibujo.</p><p>Coloca un condensador cerámico de <strong>100 nF</strong> entre B18 y −18 superior, otro entre B31 y −31 superior, y otro entre B44 y −44 superior. B18, B31 y B44 comparten nodo con los respectivos VCC. Comprueba con multímetro que los rieles estén a 5 V y que los segmentos de riel que uses estén unidos.</p><p>Los tres circuitos comparten alimentación, pero sus entradas, salidas, resistencias y LED son independientes. S7 y S8 quedan libres.</p><p>Pinajes del fabricante: <a href="https://www.ti.com/lit/ds/symlink/sn74hc86.pdf" target="_blank" rel="noopener noreferrer">74HC86</a>, <a href="https://www.ti.com/lit/ds/symlink/sn74hc08.pdf" target="_blank" rel="noopener noreferrer">74HC08</a> y <a href="https://www.ti.com/lit/ds/symlink/sn74hc32.pdf" target="_blank" rel="noopener noreferrer">74HC32</a>.</p></details>`;
  }
  function coordinateHtml(g) {
    const n = g.start, d = g.led, a = g.switches[0] + 3, b = g.switches[1] + 3;
    return `<ol><li>Con fuente apagada: +5 V al <strong>riel + superior, columna 1</strong>; GND al <strong>riel − inferior, columna 1</strong>. Une − superior con − inferior. Puentea cada riel partido que uses, de la columna 30 a la 34.</li><li>Coloca el DIP cruzando la ranura central: S${g.switches[0] + 1} en <strong>E${a}/F${a}</strong>, S${g.switches[1] + 1} en <strong>E${b}/F${b}</strong>. Del riel +${a} a A${a} y +${b} a A${b}. Resistencias de 10 kΩ de J${a} a −${a} inferior y J${b} a −${b} inferior.</li><li>${g.chip} cruza la ranura desde la columna <strong>${n} hasta ${n + 6}</strong>, con la muesca a la izquierda: pin 14 en <strong>E${n}</strong>, pin 7 en <strong>F${n + 6}</strong>. Conecta +${n}→A${n} y J${n + 6}→−${n + 6} inferior.</li><li>Entradas: <strong>H${a}→H${n}</strong> (pin 1) y <strong>H${b}→H${n + 1}</strong> (pin 2). Salida pin 3: <strong>H${n + 2}→H${d - 2}</strong>.</li><li>Resistencia de 1 kΩ entre <strong>J${d - 2} y J${d}</strong>. LED: ánodo en <strong>F${d}</strong>, cátodo en <strong>F${d + 1}</strong>. Une <strong>J${d + 1}→−${d + 1}</strong> inferior.</li></ol>`;
  }
  function render() {
    root.innerHTML = `<div class="section-heading"><div><div class="kicker">02 / LABORATORIO</div><h2>Del agujero al <em>resultado.</em></h2><p>Una protoboard horizontal de 63 columnas, con orificios, rieles y coordenadas A–J. Cada compuerta se prueba por separado.</p></div><span class="section-index">PRÁCTICAS 01–02<br>5 V · SERIE 74HC</span></div>
      <div class="lab-lesson-tabs" role="group" aria-label="Elegir práctica"><button type="button" data-lesson="basic" class="${state.lesson === 'basic' ? 'active' : ''}" aria-pressed="${state.lesson === 'basic'}">01 · Encender un LED</button><button type="button" data-lesson="gates" class="${state.lesson === 'gates' ? 'active' : ''}" aria-pressed="${state.lesson === 'gates'}">02 · LED con XOR, AND y OR</button></div>
      <div class="lab-panel"><div class="lab-panel-top"><span><i></i> VISTA SUPERIOR · 63 COLUMNAS</span><span>Desliza horizontalmente si usas móvil</span></div><div class="lab-board-scroll">${svg(state.lesson === 'basic' ? basicCircuit() : gatesCircuit())}</div><div class="lab-legend"><span><i class="red"></i> +5 V</span><span><i class="dark"></i> GND</span><span><i class="blue"></i> Entradas</span><span><i class="gold"></i> Resistencias y LED</span></div></div>
      <div class="lab-safety"><strong>Antes de encender:</strong> fuente de 5 V de corriente continua regulada, polaridad verificada y alimentación desconectada mientras cableas. El dibujo muestra la familia <strong>74HC</strong>; si tu integrado es 74LS, consulta su hoja de datos.</div>${lessonHtml()}`;
    root.querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', () => { state.lesson = b.dataset.lesson; render(); }));
    root.querySelectorAll('[data-switch]').forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.switch); state.switches[i] ^= 1; render(); }));
    root.querySelectorAll('[data-gate]').forEach(b => b.addEventListener('click', () => { state.selected = b.dataset.gate; render(); }));
  }
  render();
})();
