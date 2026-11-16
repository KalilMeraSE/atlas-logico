/* Práctica 05: sumador de dos números de 2 bits con un DIP físico de 8 posiciones. */
(() => {
  const switchNames = ['A1', 'A0', 'B1', 'B0'];
  const signalColors = { A1: '#3eaa78', A0: '#398fcb', B1: '#e4b847', B0: '#9a75cc', P1: '#52a5c4', C0: '#f2a854', G1: '#b485cf', T: '#e8bc4b' };
  const results = [
    { bit: 'S0', led: 54, output: 19, color: '#39aa68', name: 'Unidad' },
    { bit: 'S1', led: 58, output: 23, color: '#d45055', name: 'Dos' },
    { bit: 'C2', led: 62, output: 45, color: '#bc4147', name: 'Cuatro' }
  ];
  function compute(bits) {
    const [a1, a0, b1, b0] = bits;
    const A = 2 * a1 + a0;
    const B = 2 * b1 + b0;
    const p0 = a0 ^ b0;
    const c0 = a0 & b0;
    const p1 = a1 ^ b1;
    const s1 = p1 ^ c0;
    const g1 = a1 & b1;
    const t = p1 & c0;
    const c2 = g1 | t;
    return { A, B, sum: A + B, S0: p0, S1: s1, C2: c2, C0: c0, P1: p1, G1: g1, T: t };
  }
  function circuit({ X, Y, boardBase, chip, path, horizontalResistor, led, resistor, bits }) {
    const v = compute(bits);
    let out = boardBase();
    const wire = (fromCol, fromRow, toCol, toRow, lane, color, className = 'adder-signal') =>
      path(`M${X(fromCol)} ${Y[fromRow]} V${lane} H${X(toCol)} V${Y[toRow]}`, color, className);
    const top = (a, b, lane, color, className = 'adder-signal') =>
      path(`M${X(a)} ${Y.A} V${lane} H${X(b)} V${Y.A}`, color, className);
    for (const yy of [Y['+'], Y['−'], Y['b−']]) out += path(`M${X(30)} ${yy} H${X(34)}`, yy === Y['+'] ? '#e83232' : '#333');

    // La carcasa tiene ocho interruptores; solo los cuatro primeros llevan señales.
    out += `<g class="adder-dip"><rect x="${X(3) - 15}" y="235" width="${X(10) - X(3) + 30}" height="54" rx="4" fill="#1077bd"/><text x="${X(6.5)}" y="249" text-anchor="middle">DIP 8 · ON ↑</text>`;
    for (let i = 0; i < 8; i++) {
      const n = i + 3, active = i < 4, on = active && bits[i];
      out += `<rect x="${X(n) - 6}" y="251" width="12" height="23" rx="1" fill="${active ? '#075b92' : '#4b6e84'}"/><rect x="${X(n) - 5}" y="${on ? 253 : 262}" width="10" height="10" fill="${active ? '#f3f2e9' : '#a9b8c1'}"/><text x="${X(n)}" y="284" text-anchor="middle">${i + 1}</text>`;
    }
    out += '</g>';
    for (let i = 0; i < 8; i++) out += `<text x="${X(i + 3)}" y="220" text-anchor="middle" class="adder-dip-label ${i > 3 ? 'unused' : ''}">${i < 4 ? switchNames[i] : '–'}</text>`;
    for (let i = 0; i < 4; i++) {
      const n = i + 3;
      out += path(`M${X(n)} ${Y['+']} V${Y.A}`, '#e83232');
      out += resistor(X(n), Y.J + 1, Y['b−'] - 2, '10 kΩ pull-down');
    }

    for (const [start, name] of [[17, '74HC86'], [30, '74HC08'], [43, '74HC32']]) {
      out += path(`M${X(start)} ${Y['+']} V${Y.A}`, '#e83232');
      out += path(`M${X(start + 6)} ${Y.J} V${Y['b−']}`, '#333');
      out += chip({ start, chip: name });
    }
    // Gate 4 de XOR y AND; gates 2–4 de OR: entradas sin uso a GND.
    for (const n of [18, 19, 31, 32, 44, 45, 47, 48]) out += path(`M${X(n)} ${Y['−']} V${Y.A}`, '#6f7780', 'lab-unused');
    for (const n of [46, 47]) out += path(`M${X(n)} ${Y.J} V${Y['b−']}`, '#6f7780', 'lab-unused');

    const inputWires = [
      ['A1', 3, 'H', 20, 'H', 343], ['A1', 3, 'I', 33, 'I', 382],
      ['A0', 4, 'H', 17, 'H', 349], ['A0', 4, 'I', 30, 'I', 388],
      ['B1', 5, 'H', 21, 'H', 355], ['B1', 5, 'I', 34, 'I', 394],
      ['B0', 6, 'H', 18, 'H', 361], ['B0', 6, 'I', 31, 'I', 400]
    ];
    for (const [signal, a, rowA, b, rowB, lane] of inputWires) out += wire(a, rowA, b, rowB, lane, signalColors[signal]);

    // P1 = A1 XOR B1: pin 6 de XOR -> entradas 9 de XOR y AND.
    out += wire(22, 'H', 25, 'H', 370, signalColors.P1);
    out += path(`M${X(25)} ${Y.F} V${Y.E}`, signalColors.P1, 'adder-crossing');
    out += top(25, 22, 128, signalColors.P1);
    out += path(`M${X(25)} ${Y.B} V122 H${X(35)} V${Y.A}`, signalColors.P1, 'adder-signal');

    // C0 = A0 AND B0: pin 3 de AND -> entradas 10 de XOR y AND.
    out += wire(32, 'H', 38, 'H', 376, signalColors.C0);
    out += path(`M${X(38)} ${Y.F} V${Y.E}`, signalColors.C0, 'adder-crossing');
    out += top(38, 21, 116, signalColors.C0);
    out += path(`M${X(38)} ${Y.B} V134 H${X(34)} V${Y.A}`, signalColors.C0, 'adder-signal');

    // G1 = A1 AND B1; T = P1 AND C0; ambos entran a la OR.
    out += wire(35, 'H', 43, 'H', 367, signalColors.G1);
    out += top(36, 42, 140, signalColors.T);
    out += path(`M${X(42)} ${Y.E} V${Y.F}`, signalColors.T, 'adder-crossing');
    out += wire(42, 'H', 44, 'H', 373, signalColors.T);

    // S1 sale por el lado A–E de la XOR y cruza al lado F–J cerca de los LED.
    out += top(23, 51, 110, results[1].color, 'adder-output-wire');
    out += path(`M${X(51)} ${Y.E} V${Y.F}`, results[1].color, 'adder-crossing');
    out += wire(51, 'H', 56, 'H', 407, results[1].color, 'adder-output-wire');
    out += wire(19, 'H', 52, 'H', 412, results[0].color, 'adder-output-wire');
    out += wire(45, 'H', 60, 'H', 417, results[2].color, 'adder-output-wire');
    for (const item of results) {
      out += horizontalResistor(item.led - 2, item.led, '1 kΩ LED');
      out += led(item.led, item.color, v[item.bit], item.bit);
      out += path(`M${X(item.led + 1)} ${Y.J} V${Y['b−']}`, '#333');
    }
    out += `<text x="${X(7)}" y="318" class="adder-unused-label">S5–S8 sin conectar</text>`;
    return out;
  }
  function lesson(bits) {
    const v = compute(bits);
    const binary = n => n.toString(2).padStart(2, '0');
    let rows = '';
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
      const s = a + b;
      rows += `<tr class="${a === v.A && b === v.B ? 'current' : ''}"><td>${binary(a)}</td><td>${binary(b)}</td><td>${(s >> 2) & 1}</td><td>${(s >> 1) & 1}</td><td>${s & 1}</td><td>${s}</td></tr>`;
    }
    return `<div class="adder-intro"><span class="lab-kicker">PRÁCTICA 05 · SUMADOR DE 2 BITS</span><h3>Cuatro entradas. Tres LED para el resultado.</h3><p>La foto usa cuatro interruptores marcados A1, A0, B1 y B0. Aquí el DIP sigue teniendo <strong>8 posiciones físicas</strong>: solo S1–S4 participan; S5–S8 quedan libres y sin cables.</p></div>
      <div class="lab-control-row"><div><strong>Prueba A + B</strong><p>S1=A1, S2=A0, S3=B1, S4=B0. ON significa 1. Cambia los cuatro controles y observa S0, S1 y C2.</p></div><div class="lab-switches" role="group" aria-label="DIP de 8 posiciones; cuatro activas">${Array.from({ length: 8 }, (_, i) => i < 4 ? `<button type="button" class="lab-switch adder-active ${bits[i] ? 'on' : ''}" data-adder-switch="${i}" aria-pressed="${!!bits[i]}" aria-label="S${i + 1} ${switchNames[i]}, ${bits[i] ? 'ON' : 'OFF'}"><span>S${i + 1}<small>${switchNames[i]}</small></span><b>${bits[i] ? 'ON' : 'OFF'}</b></button>` : `<span class="lab-switch adder-spare" aria-label="S${i + 1} libre"><span>S${i + 1}<small>libre</small></span><b>—</b></span>`).join('')}</div></div>
      <div class="adder-result"><div><span>NÚMERO A</span><strong>${binary(v.A)}<small> = ${v.A}</small></strong></div><span class="adder-plus">+</span><div><span>NÚMERO B</span><strong>${binary(v.B)}<small> = ${v.B}</small></strong></div><span class="adder-plus">=</span><div class="adder-total"><span>RESULTADO</span><strong>${v.C2}${v.S1}${v.S0}<small> = ${v.sum}</small></strong></div></div>
      <div class="adder-leds" aria-label="Estado de los tres LED de salida">${results.map(item => `<div class="adder-led-card"><i class="${v[item.bit] ? 'on' : ''}" style="--led-color:${item.color}"></i><span><strong>${item.bit} = ${v[item.bit]}</strong><small>${item.name}: valor ${item.bit === 'S0' ? 1 : item.bit === 'S1' ? 2 : 4}</small></span></div>`).join('')}</div>
      <div class="lab-columns"><article class="lab-guide"><span class="lab-kicker">CÓMO FUNCIONA</span><h3>El acarreo pasa de una etapa a la otra</h3><p><strong>S0 = A0 XOR B0.</strong> Si ambos bits bajos valen 1, el AND produce un acarreo C0.</p><p><strong>P1 = A1 XOR B1.</strong> Luego S1 = P1 XOR C0.</p><p><strong>C2 = (A1 AND B1) OR (P1 AND C0).</strong> Los tres LED representan C2 S1 S0, de mayor a menor valor.</p><p>Ejemplo: 11₂ + 01₂ = 100₂. Los LED muestran C2=1, S1=0, S0=0.</p></article><article class="lab-guide"><span class="lab-kicker">MONTAJE</span><h3>Antes de cablear</h3><p>Usa fuente regulada de <strong>5 V</strong>, 3 integrados 74HC en DIP-14, 3 LED, tres resistencias de <strong>1 kΩ</strong>, cuatro pull-down de <strong>10 kΩ</strong>, tres condensadores de <strong>100 nF</strong> y un DIP de 8 posiciones.</p><p>La muesca de cada chip queda a la izquierda. Apaga la fuente al insertar o mover cables. Comprueba con multímetro los rieles partidos antes de alimentar. Los cables que se cruzan en el dibujo solo se conectan cuando sus extremos comparten un agujero.</p></article></div>
      <details class="lab-extra" open><summary>Coordenadas completas, cable por cable</summary><p><strong>Alimentación:</strong> +5 V a +1 superior, GND a −1 inferior y puente −1 superior→−1 inferior. Si los rieles están partidos, puentea +30→+34 superior, −30→−34 superior y −30→−34 inferior.</p><p><strong>DIP de ocho:</strong> colócalo sobre la ranura desde la columna 3 a la 10. Solo estas cuatro posiciones reciben cables: S1=A1 en E3/F3; S2=A0 en E4/F4; S3=B1 en E5/F5; S4=B0 en E6/F6. Une +3→A3, +4→A4, +5→A5 y +6→A6. Pon 10 kΩ entre J3→−3, J4→−4, J5→−5 y J6→−6 del riel inferior. S5–S8, en E7/F7 hasta E10/F10, <strong>no se conectan</strong>.</p><p><strong>Chips:</strong> 74HC86 en columnas 17–23: pin 14 en E17 con +17→A17; pin 7 en F23 con J23→−23 inferior. 74HC08 en 30–36: pin 14 en E30 con +30→A30; pin 7 en F36 con J36→−36 inferior. 74HC32 en 43–49: pin 14 en E43 con +43→A43; pin 7 en F49 con J49→−49 inferior.</p><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>Entradas: cada bit llega a XOR y AND</caption><thead><tr><th>Bit</th><th>Desde DIP a XOR</th><th>Desde DIP a AND</th></tr></thead><tbody><tr><th>A1 · S1</th><td>H3→H20 (pin 4)</td><td>I3→I33 (pin 4)</td></tr><tr><th>A0 · S2</th><td>H4→H17 (pin 1)</td><td>I4→I30 (pin 1)</td></tr><tr><th>B1 · S3</th><td>H5→H21 (pin 5)</td><td>I5→I34 (pin 5)</td></tr><tr><th>B0 · S4</th><td>H6→H18 (pin 2)</td><td>I6→I31 (pin 2)</td></tr></tbody></table></div><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>Conexiones internas entre compuertas</caption><thead><tr><th>Señal</th><th>Origen</th><th>Puentes exactos</th><th>Destino</th></tr></thead><tbody><tr><th>P1 = A1 XOR B1</th><td>XOR pin 6, F22</td><td>H22→H25; F25→E25; A25→A22; B25→A35</td><td>XOR pin 9 en E22; AND pin 9 en E35</td></tr><tr><th>C0 = A0 AND B0</th><td>AND pin 3, F32</td><td>H32→H38; F38→E38; A38→A21; B38→A34</td><td>XOR pin 10 en E21; AND pin 10 en E34</td></tr><tr><th>G1 = A1 AND B1</th><td>AND pin 6, F35</td><td>H35→H43</td><td>OR pin 1 en F43</td></tr><tr><th>T = P1 AND C0</th><td>AND pin 8, E36</td><td>A36→A42; E42→F42; H42→H44</td><td>OR pin 2 en F44</td></tr></tbody></table></div><div class="lab-table-scroll"><table class="lab-wiring-table"><caption>Salidas y LED</caption><thead><tr><th>LED</th><th>Desde chip</th><th>1 kΩ</th><th>LED y retorno</th></tr></thead><tbody><tr><th>S0 · unidad</th><td>XOR pin 3, F19: H19→H52</td><td>J52→J54</td><td>F54 ánodo, F55 cátodo; J55→−55 inferior</td></tr><tr><th>S1 · dos</th><td>XOR pin 8, E23: A23→A51; E51→F51; H51→H56</td><td>J56→J58</td><td>F58 ánodo, F59 cátodo; J59→−59 inferior</td></tr><tr><th>C2 · cuatro</th><td>OR pin 3, F45: H45→H60</td><td>J60→J62</td><td>F62 ánodo, F63 cátodo; J63→−63 inferior</td></tr></tbody></table></div><p><strong>Entradas no usadas a GND:</strong> en XOR, A18 y A19 al riel − superior; en AND, A31 y A32 al riel − superior; en OR, A44, A45, A47 y A48 al riel − superior, más J46 y J47 al riel − inferior. Deja las salidas no usadas sin conexión.</p><p><strong>Desacoplo:</strong> coloca 100 nF entre B17 y −17 superior, entre B30 y −30 superior, y entre B43 y −43 superior. Comprueba que no hay cortocircuitos entre +5 V y GND antes de encender.</p><p>Pinajes: <a href="https://www.ti.com/lit/ds/symlink/sn74hc86.pdf" target="_blank" rel="noopener noreferrer">74HC86</a>, <a href="https://www.ti.com/lit/ds/symlink/sn74hc08.pdf" target="_blank" rel="noopener noreferrer">74HC08</a> y <a href="https://www.ti.com/lit/ds/symlink/sn74hc32.pdf" target="_blank" rel="noopener noreferrer">74HC32</a>. Fundamento del <a href="https://www.uvm.edu/~cbcafier/cs2210/content/05_cpu_alu/ripple_carry_adder.html" target="_blank" rel="noopener noreferrer">sumador con acarreo</a>.</p></details>
      <details class="lab-extra"><summary>Tabla completa de las 16 combinaciones</summary><div class="lab-table-scroll"><table class="lab-wiring-table adder-truth"><caption>Las 16 sumas posibles de A y B</caption><thead><tr><th>A1A0</th><th>B1B0</th><th>C2</th><th>S1</th><th>S0</th><th>A + B</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
  }
  window.AtlasAdder = { circuit, lesson, compute };
})();
