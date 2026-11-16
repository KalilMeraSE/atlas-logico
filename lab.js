/* Laboratorio: dibujo SVG generado a partir de las mismas coordenadas que la guía. */
(() => {
  const root = document.getElementById('lab-app');
  if (!root) return;
  const X = n => 166 + (n - 1) * 19;
  const Y = { '+': 78, '−': 100, A: 150, B: 170, C: 190, D: 210, E: 230, F: 292, G: 312, H: 332, I: 352, J: 372, 'b+': 426, 'b−': 448 };
  const state = { lesson: 'five', selected: 'xor', selectedFive: 'xor1', selectedSplit: 'xor1', route: 'near-led', switches: [1, 0, 1, 0, 1, 0, 0, 0] };
  const gateData = [
    { id: 'xor', label: 'XOR', chip: '74HC86', start: 18, switches: [0, 1], color: '#eb6060', led: 54, output: 20, result: (a, b) => a ^ b, rule: 'Se enciende cuando solo uno de los dos interruptores está en ON.' },
    { id: 'and', label: 'AND', chip: '74HC08', start: 31, switches: [2, 3], color: '#56c57d', led: 58, output: 33, result: (a, b) => a & b, rule: 'Se enciende cuando los dos interruptores están en ON.' },
    { id: 'or', label: 'OR', chip: '74HC32', start: 44, switches: [4, 5], color: '#e5bb53', led: 62, output: 46, result: (a, b) => a | b, rule: 'Se enciende cuando al menos un interruptor está en ON.' }
  ];
  const fiveData = [
    { id: 'xor1', label: 'XOR 1', type: 'XOR', chip: '74HC86', start: 14, switches: [0, 1], inputs: [14, 15], output: 16, pins: '1 y 2 → 3', led: 44, color: '#e85d64', result: (a, b) => a ^ b, rule: 'Se enciende cuando S1 y S2 son diferentes.' },
    { id: 'and1', label: 'AND 1', type: 'AND', chip: '74HC08', start: 24, switches: [2, 3], inputs: [24, 25], output: 26, pins: '1 y 2 → 3', led: 48, color: '#4cbf78', result: (a, b) => a & b, rule: 'Se enciende cuando S3 y S4 están en ON.' },
    { id: 'or1', label: 'OR 1', type: 'OR', chip: '74HC32', start: 34, switches: [4, 5], inputs: [34, 35], output: 36, pins: '1 y 2 → 3', led: 52, color: '#e1b847', result: (a, b) => a | b, rule: 'Se enciende cuando S5 o S6 está en ON.' },
    { id: 'xor2', label: 'XOR 2', type: 'XOR', chip: '74HC86', start: 14, switches: [6, 7], inputs: [17, 18], output: 19, pins: '4 y 5 → 6', led: 56, color: '#3da9d0', result: (a, b) => a ^ b, rule: 'Compara S7 y S8: se enciende si son diferentes.' },
    { id: 'or2', label: 'OR 2', type: 'OR', chip: '74HC32', start: 34, switches: [6, 7], inputs: [37, 38], output: 39, pins: '4 y 5 → 6', led: 60, color: '#a783d7', result: (a, b) => a | b, rule: 'Usa también S7 y S8: se enciende si alguno está en ON.' }
  ];
  const splitData = [
    { id: 'xor1', label: 'XOR 1', type: 'XOR', chip: '74HC86', start: 14, switches: [0, 1], inputs: [14, 15], output: 16, pins: '1 y 2 → 3', led: 44, color: '#e85d64', result: (a, b) => a ^ b, rule: 'Se enciende cuando S1 y S2 son diferentes.' },
    { id: 'and1', label: 'AND 1', type: 'AND', chip: '74HC08', start: 24, switches: [2, 3], inputs: [24, 25], output: 26, pins: '1 y 2 → 3', led: 48, color: '#4cbf78', result: (a, b) => a & b, rule: 'Se enciende cuando S3 y S4 están en ON.' },
    { id: 'or1', label: 'OR 1', type: 'OR', chip: '74HC32', start: 34, switches: [4, 5], inputs: [34, 35], output: 36, pins: '1 y 2 → 3', led: 52, color: '#e1b847', result: (a, b) => a | b, rule: 'Se enciende cuando S5 o S6 está en ON.' },
    { id: 'xor2', label: 'XOR 2', type: 'XOR', chip: '74HC86', start: 14, switches: [6, 7], inputs: [17, 18], output: 19, pins: '4 y 5 → 6', led: 56, bridge: 21, bridgeMid: 33, color: '#3da9d0', result: (a, b) => a ^ b, rule: 'Compara S7 y S8: se enciende si son diferentes.' },
    { id: 'or2', label: 'OR 2', type: 'OR', chip: '74HC32', start: 34, switches: [6, 7], inputs: [37, 38], output: 39, pins: '4 y 5 → 6', led: 61, bridge: 41, bridgeMid: 47, color: '#a783d7', result: (a, b) => a | b, rule: 'Usa también S7 y S8: se enciende si alguno está en ON.' }
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
  function horizontalResistor(n1, n2, label, y = Y.J) {
    const cx = (X(n1) + X(n2)) / 2;
    return `<g class="lab-resistor"><path d="M${X(n1)} ${y}H${cx - 14}M${cx + 14} ${y}H${X(n2)}" stroke="#a6a6a6" stroke-width="3"/><rect x="${cx - 14}" y="${y - 7}" width="28" height="14" rx="4" fill="#c5a16c" stroke="#88693f"/><path d="M${cx - 7} ${y - 7}v14M${cx} ${y - 7}v14M${cx + 7} ${y - 7}v14" stroke="#c12b2b" stroke-width="3"/><title>${label}</title></g>`;
  }
  function led(n, color, on, label) {
    const cx = (X(n) + X(n + 1)) / 2;
    return `<g class="lab-led ${on ? 'is-lit' : ''}"><ellipse cx="${cx}" cy="${Y.F + 2}" rx="12" ry="17" fill="${color}" stroke="#6f6f6f" stroke-width="2"/><path d="M${X(n)} ${Y.F + 16}V${Y.J}M${X(n + 1)} ${Y.F + 16}V${Y.J}" stroke="#888" stroke-width="2"/><text x="${cx}" y="${Y.F - 22}" text-anchor="middle" class="lab-led-label">${label}</text></g>`;
  }
  function topLed(n, color, on, label) {
    const cx = (X(n) + X(n + 1)) / 2;
    return `<g class="lab-led ${on ? 'is-lit' : ''}"><ellipse cx="${cx}" cy="185" rx="12" ry="17" fill="${color}" stroke="#6f6f6f" stroke-width="2"/><path d="M${X(n)} ${Y.D}V200M${X(n + 1)} ${Y.D}V200" stroke="#888" stroke-width="2"/><text x="${cx}" y="165" text-anchor="middle" class="lab-led-label">${label}</text></g>`;
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
  function fiveCircuit() {
    let s = boardBase();
    for (const yy of [Y['+'], Y['−'], Y['b−']]) s += path(`M${X(30)} ${yy} H${X(34)}`, yy === Y['+'] ? '#e83232' : '#333');
    s += `<g class="lab-dip"><rect x="${X(3) - 15}" y="236" width="${X(10) - X(3) + 30}" height="52" rx="3" fill="#d72825"/><text x="${X(6.5)}" y="249" text-anchor="middle">DIP 8 · ON ↑</text>`;
    for (let i = 0; i < 8; i++) {
      const n = i + 3;
      s += `<rect x="${X(n) - 6}" y="250" width="12" height="23" rx="1" fill="#a31b1b"/><rect x="${X(n) - 5}" y="${state.switches[i] ? 252 : 260}" width="10" height="10" fill="#f0eee5"/><text x="${X(n)}" y="284" text-anchor="middle">${i + 1}</text>`;
    }
    s += '</g>';
    for (let i = 0; i < 8; i++) {
      const n = i + 3;
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += resistor(X(n), Y.J + 1, Y['b−'] - 2, '10 kΩ pull-down');
    }
    for (const [n, name] of [[14, '74HC86'], [24, '74HC08'], [34, '74HC32']]) {
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += path(`M${X(n + 6)} ${Y.J} V${Y['b−']}`, '#333');
      s += chip({ start: n, chip: name });
      for (const k of [n + 1, n + 2, n + 4, n + 5]) s += path(`M${X(k)} ${Y['−']} V${Y.A}`, '#6f7780', 'lab-unused');
      if (n === 24) for (const k of [n + 3, n + 4]) s += path(`M${X(k)} ${Y.J} V${Y['b−']}`, '#6f7780', 'lab-unused');
    }
    const lanes = [345, 351, 357, 363, 369, 375, 381, 387, 393, 399];
    let wireIndex = 0;
    for (const gate of fiveData) {
      gate.inputs.forEach((target, j) => {
        s += link(gate.switches[j] + 3, target, lanes[wireIndex++], gate.color, 'lab-input-wire');
      });
    }
    fiveData.forEach((gate, i) => {
      s += link(gate.output, gate.led - 2, 407 + i * 3, gate.color, 'lab-output-wire');
      s += horizontalResistor(gate.led - 2, gate.led, '1 kΩ LED');
      s += led(gate.led, gate.color, lit(gate), `L${i + 1}`);
      s += path(`M${X(gate.led + 1)} ${Y.J} V${Y['b−']}`, '#333');
    });
    s += `<text x="${X(3)}" y="215" class="lab-component-label">S1–S8 · TODOS EN USO</text>`;
    return s;
  }
  function splitCircuit() {
    let s = boardBase();
    for (const yy of [Y['+'], Y['−'], Y['b−']]) s += path(`M${X(30)} ${yy} H${X(34)}`, yy === Y['+'] ? '#e83232' : '#333');
    s += `<g class="lab-dip"><rect x="${X(3) - 15}" y="236" width="${X(10) - X(3) + 30}" height="52" rx="3" fill="#d72825"/><text x="${X(6.5)}" y="249" text-anchor="middle">DIP 8 · ON ↑</text>`;
    for (let i = 0; i < 8; i++) {
      const n = i + 3;
      s += `<rect x="${X(n) - 6}" y="250" width="12" height="23" rx="1" fill="#a31b1b"/><rect x="${X(n) - 5}" y="${state.switches[i] ? 252 : 260}" width="10" height="10" fill="#f0eee5"/><text x="${X(n)}" y="284" text-anchor="middle">${i + 1}</text>`;
    }
    s += '</g>';
    for (let i = 0; i < 8; i++) {
      const n = i + 3;
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += resistor(X(n), Y.J + 1, Y['b−'] - 2, '10 kΩ pull-down');
    }
    for (const [n, name] of [[14, '74HC86'], [24, '74HC08'], [34, '74HC32']]) {
      s += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      s += path(`M${X(n + 6)} ${Y.J} V${Y['b−']}`, '#333');
      s += chip({ start: n, chip: name });
      for (const k of [n + 1, n + 2, n + 4, n + 5]) s += path(`M${X(k)} ${Y['−']} V${Y.A}`, '#6f7780', 'lab-unused');
      if (n === 24) for (const k of [n + 3, n + 4]) s += path(`M${X(k)} ${Y.J} V${Y['b−']}`, '#6f7780', 'lab-unused');
    }
    const lanes = [345, 351, 357, 363, 369, 375, 381, 387, 393, 399];
    let wireIndex = 0;
    for (const gate of splitData) {
      gate.inputs.forEach((target, j) => {
        s += link(gate.switches[j] + 3, target, lanes[wireIndex++], gate.color, 'lab-input-wire');
      });
    }
    splitData.forEach((gate, i) => {
      const entry = gate.led - 2;
      if (i < 3) {
        s += link(gate.output, entry, 407 + i * 3, gate.color, 'lab-output-wire');
        s += horizontalResistor(entry, gate.led, '1 kΩ LED');
        s += led(gate.led, gate.color, lit(gate), `L${i + 1}`);
        s += path(`M${X(gate.led + 1)} ${Y.J} V${Y['b−']}`, '#333');
      } else {
        const crossing = state.route === 'near-led' ? entry : state.route === 'middle' ? gate.bridgeMid : gate.bridge;
        s += link(gate.output, crossing, 397 + i * 5, gate.color, 'lab-output-wire');
        s += path(`M${X(crossing)} ${Y.F} V${Y.E}`, gate.color, 'lab-crossing-wire');
        if (crossing !== entry) s += path(`M${X(crossing)} ${Y.A} V${126 + i * 5} H${X(entry)} V${Y.A}`, gate.color, 'lab-output-wire');
        s += horizontalResistor(entry, gate.led, '1 kΩ LED', Y.A);
        s += topLed(gate.led, gate.color, lit(gate), `L${i + 1}`);
        s += path(`M${X(gate.led + 1)} ${Y.E} V${Y['−']}`, '#333');
      }
    });
    s += `<text x="${X(3)}" y="215" class="lab-component-label">S1–S8 · TODOS EN USO</text>`;
    return s;
  }
  const svg = content => `<svg class="lab-svg" viewBox="0 0 1390 500" role="img" aria-label="Protoboard horizontal de 63 columnas, agujeros A a J y rieles de alimentación; ${state.lesson === 'split' ? 'DIP de ocho posiciones, tres integrados, tres LED abajo y dos arriba' : state.lesson === 'five' ? 'DIP de ocho posiciones, tres integrados y cinco LED abajo' : state.lesson === 'gates' ? 'tres integrados, interruptor DIP y tres LED' : 'resistencia y LED'}">${content}</svg>`;
  const truth = gate => `<table class="lab-truth"><thead><tr><th>A</th><th>B</th><th>${gate.label}</th></tr></thead><tbody>${[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => `<tr class="${state.switches[gate.switches[0]] === a && state.switches[gate.switches[1]] === b ? 'current' : ''}"><td>${a}</td><td>${b}</td><td>${gate.result(a, b)}</td></tr>`).join('')}</tbody></table>`;
  function fiveOutputWiring(g) {
    const entry = g.led - 2;
    if (splitData.indexOf(g) < 3) return `<li>Salida <strong>H${g.output}→H${entry}</strong>; resistencia de 1 kΩ entre <strong>J${entry} y J${g.led}</strong>.</li><li>LED abajo: ánodo <strong>F${g.led}</strong>, cátodo <strong>F${g.led + 1}</strong> y puente <strong>J${g.led + 1}→−${g.led + 1}</strong> inferior.</li>`;
    const crossing = state.route === 'near-led' ? entry : state.route === 'middle' ? g.bridgeMid : g.bridge;
    const route = crossing === entry
      ? `H${g.output}→H${entry}; cruza la ranura con F${entry}→E${entry}`
      : `H${g.output}→H${crossing}; cruza la ranura con F${crossing}→E${crossing}; lleva A${crossing}→A${entry}`;
    return `<li>Salida hacia arriba, ruta elegida: <strong>${route}</strong>.</li><li>Resistencia de 1 kΩ entre <strong>A${entry} y A${g.led}</strong>. LED arriba: ánodo <strong>D${g.led}</strong>, cátodo <strong>D${g.led + 1}</strong> y puente <strong>E${g.led + 1}→−${g.led + 1}</strong> superior.</li>`;
  }
  function fiveOutputRow(g, i) {
    const entry = g.led - 2;
    const bottom = i < 3;
    const crossing = state.route === 'near-led' ? entry : state.route === 'middle' ? g.bridgeMid : g.bridge;
    const route = bottom ? `H${g.output}→H${entry}` : crossing === entry
      ? `H${g.output}→H${entry}; F${entry}→E${entry}`
      : `H${g.output}→H${crossing}; F${crossing}→E${crossing}; A${crossing}→A${entry}`;
    return `<tr><th>L${i + 1}<br>${bottom ? 'ABAJO' : 'ARRIBA'}</th><td>${g.label} · ${g.chip}<br>pines ${g.pins}</td><td>H${g.switches[0] + 3}→H${g.inputs[0]}<br>H${g.switches[1] + 3}→H${g.inputs[1]}</td><td>${route}</td><td>${bottom ? `J${entry}→J${g.led}` : `A${entry}→A${g.led}`}</td><td>${bottom ? `F${g.led} ánodo, F${g.led + 1} cátodo<br>J${g.led + 1}→−${g.led + 1} inferior` : `D${g.led} ánodo, D${g.led + 1} cátodo<br>E${g.led + 1}→−${g.led + 1} superior`}</td></tr>`;
  }
  function fiveLessonHtml() {
    const active = fiveData.find(g => g.id === state.selectedFive);
    return `<div class="lab-control-row"><div><strong>Prueba los ocho interruptores</strong><p>ON conecta la entrada a +5 V; OFF la deja en 0 mediante su resistencia pull-down de 10 kΩ. S7 y S8 alimentan dos compuertas distintas, por eso L4 y L5 pueden comportarse diferente.</p></div><div class="lab-switches" role="group" aria-label="DIP switch de ocho posiciones">${state.switches.map((v, i) => `<button type="button" class="lab-switch ${v ? 'on' : ''}" data-switch="${i}" aria-pressed="${!!v}" aria-label="Interruptor S${i + 1}, ${v ? 'ON' : 'OFF'}"><span>S${i + 1}</span><b>${v ? 'ON' : 'OFF'}</b></button>`).join('')}</div></div>
      <div class="lab-five-grid" role="group" aria-label="Seleccionar uno de los cinco LED">${fiveData.map((g, i) => `<button type="button" data-five="${g.id}" class="lab-five-card ${active.id === g.id ? 'active' : ''}" aria-pressed="${active.id === g.id}"><span class="lab-five-light ${lit(g) ? 'on' : ''}" style="--gate-color:${g.color}"></span><span><strong>L${i + 1} · ${g.label}</strong><small>${g.chip} · S${g.switches[0] + 1}/S${g.switches[1] + 1}</small></span><b>${lit(g) ? 'ENCENDIDO' : 'APAGADO'}</b></button>`).join('')}</div>
      <div class="lab-columns"><article class="lab-guide"><span class="lab-kicker">LED ${fiveData.indexOf(active) + 1} · ${active.chip}</span><h3>${active.label}: tabla y resultado</h3><p>${active.rule}</p><div class="lab-state-readout">S${active.switches[0] + 1} = ${state.switches[active.switches[0]]} · S${active.switches[1] + 1} = ${state.switches[active.switches[1]]} · salida = <strong>${lit(active)}</strong> · L${fiveData.indexOf(active) + 1} <strong>${lit(active) ? 'ENCENDIDO' : 'APAGADO'}</strong></div>${truth(active)}<p>Esta tabla pertenece solo a <strong>${active.label}</strong>. Selecciona otro LED para ver la suya.</p></article>
      <article class="lab-guide"><span class="lab-kicker">CABLEADO DE L${fiveData.indexOf(active) + 1}</span><h3>Coordenadas exactas</h3><ol><li>En el DIP, S${active.switches[0] + 1} ocupa <strong>E${active.switches[0] + 3}/F${active.switches[0] + 3}</strong> y S${active.switches[1] + 1} ocupa <strong>E${active.switches[1] + 3}/F${active.switches[1] + 3}</strong>.</li><li>Entradas de ${active.chip}: <strong>H${active.switches[0] + 3}→H${active.inputs[0]}</strong> y <strong>H${active.switches[1] + 3}→H${active.inputs[1]}</strong> (pines ${active.pins}).</li><li>Salida: <strong>H${active.output}→H${active.led - 2}</strong>. Resistencia de <strong>1 kΩ</strong> entre <strong>J${active.led - 2} y J${active.led}</strong>.</li><li>Ánodo del LED en <strong>F${active.led}</strong>, cátodo en <strong>F${active.led + 1}</strong>; une <strong>J${active.led + 1}→−${active.led + 1}</strong> del riel inferior.</li></ol><p>S7 y S8 se ramifican hacia L4 y L5. Cada LED conserva su propia salida y su propia resistencia; <strong>no unas las salidas</strong> de las compuertas.</p></article></div>
      <details class="lab-extra" open><summary>Montaje completo de los cinco LED</summary><p><strong>Materiales:</strong> fuente de 5 V regulada, DIP de 8 posiciones, 74HC86, 74HC08 y 74HC32 en encapsulado DIP-14, 5 LED, 5 resistencias de 1 kΩ, 8 resistencias de 10 kΩ, 3 condensadores cerámicos de 100 nF y cables.</p><p><strong>Alimentación:</strong> con la fuente apagada, rojo a +1 del riel superior y negro a −1 del riel inferior; une −1 superior con −1 inferior. Si los rieles están partidos, puentea +30→+34 superior, −30→−34 superior y −30→−34 inferior. Comprueba continuidad y tensión con el multímetro.</p><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>DIP de 8 posiciones y resistencias pull-down</caption><thead><tr><th>Interruptor</th><th>Contactos DIP</th><th>+5 V al contacto superior</th><th>10 kΩ del contacto inferior a GND</th></tr></thead><tbody>${state.switches.map((_, i) => { const n = i + 3; return `<tr><th>S${i + 1}</th><td>E${n} / F${n}</td><td>+${n}→A${n}</td><td>J${n}→−${n} inferior</td></tr>`; }).join('')}</tbody></table></div><p><strong>Integrados:</strong> coloca cada uno cruzando la ranura central, con la muesca hacia la izquierda. 74HC86 en columnas 14–20: pin 14 en E14 mediante +14→A14; pin 7 en F20 mediante J20→−20 inferior. 74HC08 en 24–30: pin 14 en E24 mediante +24→A24; pin 7 en F30 mediante J30→−30 inferior. 74HC32 en 34–40: pin 14 en E34 mediante +34→A34; pin 7 en F40 mediante J40→−40 inferior.</p><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>Cinco salidas independientes</caption><thead><tr><th>LED</th><th>Compuerta</th><th>Entradas desde el DIP</th><th>Salida</th><th>Resistencia 1 kΩ</th><th>LED y GND</th></tr></thead><tbody>${fiveData.map((g, i) => `<tr><th>L${i + 1}</th><td>${g.label} · ${g.chip}<br>pines ${g.pins}</td><td>H${g.switches[0] + 3}→H${g.inputs[0]}<br>H${g.switches[1] + 3}→H${g.inputs[1]}</td><td>H${g.output}→H${g.led - 2}</td><td>J${g.led - 2}→J${g.led}</td><td>F${g.led} ánodo, F${g.led + 1} cátodo<br>J${g.led + 1}→−${g.led + 1} inferior</td></tr>`).join('')}</tbody></table></div><p><strong>Entradas CMOS no usadas:</strong> en 74HC86 conecta A15, A16, A18 y A19 al riel − superior de su columna. En 74HC08 conecta A25, A26, A28 y A29 al riel − superior, y J27 y J28 al riel − inferior. En 74HC32 conecta A35, A36, A38 y A39 al riel − superior. Deja sin conectar las salidas de las compuertas que no usas.</p><p><strong>Desacoplo:</strong> coloca 100 nF entre B14 y −14 superior, B24 y −24 superior, B34 y −34 superior. Conecta la fuente solo después de revisar orientación, resistencia en serie y ausencia de cortocircuitos.</p><p>Consulta el pinaje de <a href="https://www.ti.com/lit/ds/symlink/sn74hc86.pdf" target="_blank" rel="noopener noreferrer">74HC86</a>, <a href="https://www.ti.com/lit/ds/symlink/sn74hc08.pdf" target="_blank" rel="noopener noreferrer">74HC08</a> y <a href="https://www.ti.com/lit/ds/symlink/sn74hc32.pdf" target="_blank" rel="noopener noreferrer">74HC32</a>.</p></details>`;
  }
  function splitLessonHtml() {
    const active = splitData.find(g => g.id === state.selectedSplit);
    const number = splitData.indexOf(active) + 1;
    return `<div class="lab-control-row"><div><strong>Prueba los ocho interruptores</strong><p>ON conecta la entrada a +5 V; OFF la deja en 0 mediante su resistencia pull-down de 10 kΩ. S7 y S8 alimentan dos compuertas distintas, por eso L4 y L5 pueden comportarse diferente.</p></div><div class="lab-switches" role="group" aria-label="DIP switch de ocho posiciones">${state.switches.map((v, i) => `<button type="button" class="lab-switch ${v ? 'on' : ''}" data-switch="${i}" aria-pressed="${!!v}" aria-label="Interruptor S${i + 1}, ${v ? 'ON' : 'OFF'}"><span>S${i + 1}</span><b>${v ? 'ON' : 'OFF'}</b></button>`).join('')}</div></div>
      <div class="lab-route-picker"><div><strong>¿Por dónde cruzamos la ranura?</strong><p>L1–L3 quedan abajo. L4 y L5 van arriba. Elige una ruta para llevar sus salidas del lado F–J al lado A–E; las tres llegan a los mismos nodos.</p></div><div role="group" aria-label="Elegir ubicación del puente"><button type="button" data-route="near-led" class="${state.route === 'near-led' ? 'active' : ''}" aria-pressed="${state.route === 'near-led'}">Junto al LED</button><button type="button" data-route="middle" class="${state.route === 'middle' ? 'active' : ''}" aria-pressed="${state.route === 'middle'}">En medio</button><button type="button" data-route="near-chip" class="${state.route === 'near-chip' ? 'active' : ''}" aria-pressed="${state.route === 'near-chip'}">Junto al chip</button></div></div>
      <div class="lab-five-grid" role="group" aria-label="Seleccionar uno de los cinco LED">${splitData.map((g, i) => `<button type="button" data-five="${g.id}" class="lab-five-card ${active.id === g.id ? 'active' : ''}" aria-pressed="${active.id === g.id}"><span class="lab-five-light ${lit(g) ? 'on' : ''}" style="--gate-color:${g.color}"></span><span><strong>L${i + 1} · ${g.label}</strong><small>${i < 3 ? 'ABAJO' : 'ARRIBA'} · ${g.chip} · S${g.switches[0] + 1}/S${g.switches[1] + 1}</small></span><b>${lit(g) ? 'ENCENDIDO' : 'APAGADO'}</b></button>`).join('')}</div>
      <div class="lab-columns"><article class="lab-guide"><span class="lab-kicker">LED ${number} · ${active.chip}</span><h3>${active.label}: tabla y resultado</h3><p>${active.rule}</p><div class="lab-state-readout">S${active.switches[0] + 1} = ${state.switches[active.switches[0]]} · S${active.switches[1] + 1} = ${state.switches[active.switches[1]]} · salida = <strong>${lit(active)}</strong> · L${number} <strong>${lit(active) ? 'ENCENDIDO' : 'APAGADO'}</strong></div>${truth(active)}<p>Esta tabla pertenece solo a <strong>${active.label}</strong>. Selecciona otro LED para ver la suya.</p></article>
      <article class="lab-guide"><span class="lab-kicker">CABLEADO DE L${number} · ${number < 4 ? 'ABAJO' : 'ARRIBA'}</span><h3>Coordenadas exactas</h3><ol><li>En el DIP, S${active.switches[0] + 1} ocupa <strong>E${active.switches[0] + 3}/F${active.switches[0] + 3}</strong> y S${active.switches[1] + 1} ocupa <strong>E${active.switches[1] + 3}/F${active.switches[1] + 3}</strong>.</li><li>Entradas de ${active.chip}: <strong>H${active.switches[0] + 3}→H${active.inputs[0]}</strong> y <strong>H${active.switches[1] + 3}→H${active.inputs[1]}</strong> (pines ${active.pins}).</li>${fiveOutputWiring(active)}</ol><p>S7 y S8 se ramifican hacia L4 y L5. Cada LED conserva su propia salida y resistencia: <strong>no unas las salidas</strong> de las compuertas. Apaga la fuente antes de cambiar de ruta.</p></article></div>
      <div class="lab-route-compare"><h3>Tres formas de pasar la señal hacia arriba</h3><div class="lab-table-scroll"><table class="lab-wiring-table"><thead><tr><th>LED superior</th><th>Junto al LED</th><th>En medio</th><th>Junto al chip</th><th>Después del puente</th></tr></thead><tbody><tr><th>L4 · XOR 2</th><td>H19→H54<br>F54→E54</td><td>H19→H33<br>F33→E33<br>A33→A54</td><td>H19→H21<br>F21→E21<br>A21→A54</td><td>A54→A56 (1 kΩ)<br>D56 ánodo, D57 cátodo<br>E57→−57 superior</td></tr><tr><th>L5 · OR 2</th><td>H39→H59<br>F59→E59</td><td>H39→H47<br>F47→E47<br>A47→A59</td><td>H39→H41<br>F41→E41<br>A41→A59</td><td>A59→A61 (1 kΩ)<br>D61 ánodo, D62 cátodo<br>E62→−62 superior</td></tr></tbody></table></div><p>El puente E/F cruza la separación central: esos dos grupos no están unidos dentro de la protoboard. Para probar otra forma, apaga la fuente y cambia solo los cables de la ruta de salida.</p></div>
      <details class="lab-extra" open><summary>Montaje completo de los cinco LED</summary><p><strong>Materiales:</strong> fuente de 5 V regulada, DIP de 8 posiciones, 74HC86, 74HC08 y 74HC32 en encapsulado DIP-14, 5 LED, 5 resistencias de 1 kΩ, 8 resistencias de 10 kΩ, 3 condensadores cerámicos de 100 nF y cables.</p><p><strong>Alimentación:</strong> con la fuente apagada, rojo a +1 del riel superior y negro a −1 del riel inferior; une −1 superior con −1 inferior. Si los rieles están partidos, puentea +30→+34 superior, −30→−34 superior y −30→−34 inferior. Comprueba continuidad y tensión con el multímetro.</p><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>DIP de 8 posiciones y resistencias pull-down</caption><thead><tr><th>Interruptor</th><th>Contactos DIP</th><th>+5 V al contacto superior</th><th>10 kΩ del contacto inferior a GND</th></tr></thead><tbody>${state.switches.map((_, i) => { const n = i + 3; return `<tr><th>S${i + 1}</th><td>E${n} / F${n}</td><td>+${n}→A${n}</td><td>J${n}→−${n} inferior</td></tr>`; }).join('')}</tbody></table></div><p><strong>Integrados:</strong> coloca cada uno cruzando la ranura central, con la muesca hacia la izquierda. 74HC86 en columnas 14–20: pin 14 en E14 mediante +14→A14; pin 7 en F20 mediante J20→−20 inferior. 74HC08 en 24–30: pin 14 en E24 mediante +24→A24; pin 7 en F30 mediante J30→−30 inferior. 74HC32 en 34–40: pin 14 en E34 mediante +34→A34; pin 7 en F40 mediante J40→−40 inferior.</p><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>Tres LED abajo y dos arriba</caption><thead><tr><th>LED</th><th>Compuerta</th><th>Entradas desde el DIP</th><th>Ruta de salida</th><th>Resistencia 1 kΩ</th><th>LED y GND</th></tr></thead><tbody>${splitData.map(fiveOutputRow).join('')}</tbody></table></div><p><strong>Entradas CMOS no usadas:</strong> en 74HC86 conecta A15, A16, A18 y A19 al riel − superior de su columna. En 74HC08 conecta A25, A26, A28 y A29 al riel − superior, y J27 y J28 al riel − inferior. En 74HC32 conecta A35, A36, A38 y A39 al riel − superior. Deja sin conectar las salidas de las compuertas que no usas.</p><p><strong>Desacoplo:</strong> coloca 100 nF entre B14 y −14 superior, B24 y −24 superior, B34 y −34 superior. Conecta la fuente solo después de revisar orientación, resistencia en serie y ausencia de cortocircuitos.</p><p>Consulta el <a href="https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard/" target="_blank" rel="noopener noreferrer">funcionamiento de la protoboard</a> y el pinaje de <a href="https://www.ti.com/lit/ds/symlink/sn74hc86.pdf" target="_blank" rel="noopener noreferrer">74HC86</a>, <a href="https://www.ti.com/lit/ds/symlink/sn74hc08.pdf" target="_blank" rel="noopener noreferrer">74HC08</a> y <a href="https://www.ti.com/lit/ds/symlink/sn74hc32.pdf" target="_blank" rel="noopener noreferrer">74HC32</a>.</p></details>`;
  }  function lessonHtml() {
    if (state.lesson === 'basic') return `<div class="lab-columns"><div class="lab-guide"><h3>Práctica 01 · Un LED</h3><ol><li>Fuente regulada apagada: rojo a <strong>+14</strong>, negro a <strong>−16</strong>.</li><li>Resistencia de <strong>330 Ω</strong> entre <strong>+14 y A14</strong>.</li><li>Ánodo del LED en <strong>B14</strong>; cátodo en <strong>B16</strong>.</li><li>Cable de <strong>E16 a −16</strong>. Revisa y enciende la fuente a 5 V.</li></ol><p>A–E de la misma columna se conectan entre sí. F–J forman otro grupo, separado por la ranura central.</p></div><div class="lab-guide lab-callout"><h3>Antes de conectar</h3><p>La pata larga suele ser el ánodo. El lado plano y la pata corta suelen señalar el cátodo. La resistencia puede ir antes o después del LED, siempre en serie.</p><p>Si la placa tiene rieles partidos, une sus tramos cuando el circuito los use. Compruébalo con un multímetro.</p></div></div>`;
    if (state.lesson === 'five') return fiveLessonHtml();
    if (state.lesson === 'split') return splitLessonHtml();
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
    root.innerHTML = `<div class="section-heading"><div><div class="kicker">02 / LABORATORIO</div><h2>Del agujero al <em>resultado.</em></h2><p>Una protoboard horizontal de 63 columnas, con orificios, rieles y coordenadas A–J. Compara dos prácticas distintas con cinco LED.</p></div><span class="section-index">PRÁCTICAS 01–04<br>5 V · SERIE 74HC</span></div>
      <div class="lab-lesson-tabs" role="group" aria-label="Elegir práctica"><button type="button" data-lesson="basic" class="${state.lesson === 'basic' ? 'active' : ''}" aria-pressed="${state.lesson === 'basic'}">01 · Encender un LED</button><button type="button" data-lesson="gates" class="${state.lesson === 'gates' ? 'active' : ''}" aria-pressed="${state.lesson === 'gates'}">02 · Tres LED con compuertas</button><button type="button" data-lesson="five" class="${state.lesson === 'five' ? 'active' : ''}" aria-pressed="${state.lesson === 'five'}">03 · Cinco LED abajo</button><button type="button" data-lesson="split" class="${state.lesson === 'split' ? 'active' : ''}" aria-pressed="${state.lesson === 'split'}">04 · Tres abajo y dos arriba</button></div>
      <div class="lab-panel"><div class="lab-panel-top"><span><i></i> VISTA SUPERIOR · 63 COLUMNAS</span><span>Desliza horizontalmente si usas móvil</span></div><div class="lab-board-scroll">${svg(state.lesson === 'basic' ? basicCircuit() : state.lesson === 'gates' ? gatesCircuit() : state.lesson === 'five' ? fiveCircuit() : splitCircuit())}</div><div class="lab-legend"><span><i class="red"></i> +5 V</span><span><i class="dark"></i> GND</span><span><i class="blue"></i> Entradas</span><span><i class="gold"></i> Resistencias y LED</span></div></div>
      <div class="lab-safety"><strong>Antes de encender:</strong> fuente de 5 V de corriente continua regulada, polaridad verificada y alimentación desconectada mientras cableas. El dibujo muestra la familia <strong>74HC</strong>; si tu integrado es 74LS, consulta su hoja de datos.</div>${lessonHtml()}`;
    root.querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', () => { state.lesson = b.dataset.lesson; render(); }));
    root.querySelectorAll('[data-switch]').forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.switch); state.switches[i] ^= 1; render(); }));
    root.querySelectorAll('[data-gate]').forEach(b => b.addEventListener('click', () => { state.selected = b.dataset.gate; render(); }));
    root.querySelectorAll('[data-five]').forEach(b => b.addEventListener('click', () => { if (state.lesson === 'split') state.selectedSplit = b.dataset.five; else state.selectedFive = b.dataset.five; render(); }));
    root.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => { state.route = b.dataset.route; render(); }));
  }
  render();
})();
