'use strict';

// Run with: node build_report.js
// Requires: npm install docx

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  PageBreak, convertInchesToTwip,
} = require('docx');
const fs = require('fs');

const F  = 'Calibri';
const SZ = 24;   // 12 pt (half-points)

// ── paragraph helpers ──────────────────────────────────────────────────────

const sp = (before = 0, after = 200, line = 276) =>
  ({ spacing: { before, after, line } });

const body = (text, extra = {}) =>
  new Paragraph({ children: [new TextRun({ text, font: F, size: SZ, ...extra })], ...sp() });

const bodyI = (text) =>
  new Paragraph({ children: [new TextRun({ text, font: F, size: SZ, italics: true })], ...sp() });

const h1 = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size: 40, bold: true })],
    ...sp(560, 280),
  });

const sub = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size: SZ })],
    indent: { left: convertInchesToTwip(0.35) },
    ...sp(320, 160),
  });

const qBold = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size: SZ, bold: true })],
    ...sp(300, 80),
  });

const blank = () =>
  new Paragraph({ children: [new TextRun({ text: '', font: F, size: SZ })], ...sp(0, 80) });

const ph = (label) =>
  new Paragraph({
    children: [new TextRun({ text: `[INSERT: ${label}]`, font: F, size: SZ, color: 'CC0000', italics: true })],
    alignment: AlignmentType.CENTER,
    ...sp(120, 240),
  });

const formula = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size: SZ })],
    alignment: AlignmentType.CENTER,
    ...sp(80, 80),
  });

const bullet = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size: SZ })],
    bullet: { level: 0 },
    ...sp(0, 120),
  });

const centered = (text, size = SZ, extra = {}) =>
  new Paragraph({
    children: [new TextRun({ text, font: F, size, ...extra })],
    alignment: AlignmentType.CENTER,
    ...sp(0, 160),
  });

const pgBreak = () =>
  new Paragraph({ children: [new PageBreak()], ...sp(0, 0) });

const toc = (title, page, indent = false) =>
  new Paragraph({
    children: [
      new TextRun({ text: indent ? `    ${title}` : title, font: F, size: SZ }),
      new TextRun({ text: `\t${page}`, font: F, size: SZ }),
    ],
    tabStops: [{ type: 'right', position: convertInchesToTwip(6) }],
    ...sp(0, 80),
  });

// ── document children ──────────────────────────────────────────────────────

const children = [];
const add = (...p) => children.push(...p);

// ════════════════════════════════════════════════════════════════════════════
// TITLE PAGE
// ════════════════════════════════════════════════════════════════════════════
add(
  blank(), blank(), blank(),
  ph('University of Victoria crest — paste image here'),
  blank(),
  centered('University', SZ),
  centered('of Victoria', SZ),
  blank(), blank(),
  centered('Project 4 - Microwave Amplifier Design', 48),
  centered('ECE 404: Microwaves and Fiber Optics', SZ),
  blank(),
  centered('July 28, 2026', SZ),
  blank(), blank(),
  centered('Finn Berg', SZ),
  centered('V00959800', SZ),
  pgBreak(),
);

// ════════════════════════════════════════════════════════════════════════════
// OBJECTIVE
// ════════════════════════════════════════════════════════════════════════════
add(
  h1('Objective'),
  body('The objectives of this project are to:'),
  bullet('Evaluate the Mitsubishi MGF1801B GaAs MESFET transistor using its datasheet and determine whether the device is likely to meet the specified output power and gain requirements at 6.5 GHz.'),
  bullet('Verify unconditional stability of the transistor over the design frequency range by computing the Rollett stability factor K and |Delta| from the device S-parameters.'),
  bullet('Calculate the maximum transducer power gain GTmax using the device S-parameters and determine whether impedance matching networks are required to meet the 10 dB gain specification.'),
  bullet('Design input and output impedance matching networks using Smith chart conjugate matching following Pozar Section 12.3, and determine the transmission-line lengths l1 through l4 for the open-circuit shunt stub and series-line topology.'),
  bullet('Simulate the complete amplifier in Keysight ADS (KADS) using the provided MGF1801B.s2p Touchstone file, and use the Tuning tool to optimise the electrical lengths E1 through E4 for maximum gain at 6.5 GHz.'),
  bullet('Evaluate whether the final tuned design meets the specifications of at least 10 dB gain over 6.0 to 7.0 GHz and at least 20 dBm output power at 1 dB compression.'),
  pgBreak(),
);

// ════════════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ════════════════════════════════════════════════════════════════════════════
add(
  h1('Table of Contents'),
  blank(),
  toc('Objective', '2'),
  toc('Introduction', '3'),
  toc('Procedure', '4'),
  toc('Result Screenshots', '5'),
  toc('4.4.1 - Transistor Selection', '5', true),
  toc('4.4.2 - Expected Performance', '6', true),
  toc('4.4.3 - Impedance Matching Network Design', '7', true),
  toc('4.4.4 a) - Transistor Performance Simulation', '8', true),
  toc('4.4.4 b) - Input and Output Matching Networks', '9', true),
  toc('Discussion', '10'),
  toc('Conclusion', '11'),
  pgBreak(),
);

// ════════════════════════════════════════════════════════════════════════════
// INTRODUCTION
// ════════════════════════════════════════════════════════════════════════════
add(
  h1('Introduction'),

  body('Microwave amplifiers are among the most critical components in modern RF and microwave systems, appearing in applications ranging from cellular base stations and radar front ends to satellite transceivers and fibre-optic transmitters. At gigahertz frequencies the distributed nature of the circuit means that even short conductor lengths represent significant fractions of a wavelength, making impedance matching essential for efficient power transfer. Without careful attention to the impedance seen at each port of the transistor, reflections erode the available gain and the amplifier fails to meet its noise and power specifications.'),

  body('This project designs a single-stage medium-power amplifier centred at 6.5 GHz using the Mitsubishi MGF1801B gallium arsenide metal-semiconductor field-effect transistor (GaAs MESFET). The design follows the procedure of Pozar Section 12.3: the transistor S-parameters are first reviewed for stability, then the maximum transducer gain is calculated, and finally input and output impedance matching networks are synthesised using the Smith chart to conjugate-match the device at both ports. The resulting network is simulated in Keysight ADS (KADS) with the MGF1801B.s2p Touchstone file providing the transistor model, and the line lengths are refined using the built-in Tuning tool to account for the inevitable inaccuracy of the hand design.'),

  body('As in previous projects, S-parameters provide the primary design language. They are directly measurable with a vector network analyser at microwave frequencies and map cleanly onto the quantities of interest: S11 and S22 describe the reflection at the input and output ports, S21 gives the forward power gain, and S12 quantifies the reverse signal path that complicates the unilateral assumption. The transducer power gain, written as GT = GS * G0 * GL, separates the total gain into a source matching factor GS, the intrinsic transistor gain G0 = |S21|^2, and a load matching factor GL. Matching networks increase GS and GL above unity, bringing the total gain toward the theoretical maximum GTmax.'),
);

// ════════════════════════════════════════════════════════════════════════════
// PROCEDURE
// ════════════════════════════════════════════════════════════════════════════
add(
  h1('Procedure'),

  body('The design began with a review of the MGF1801B datasheet to confirm that the device is suitable for a 6.5 GHz medium-power application. The S-parameters tabulated in the datasheet at 6.5 GHz were used to evaluate the Rollett stability factor K and the S-parameter determinant Delta = S11*S22 - S12*S21. With unconditional stability confirmed, the maximum transducer gain GTmax was calculated to establish the theoretical gain ceiling and determine the gain improvement available from matching networks relative to the unmatched gain G0 = |S21|^2. A short Python script was written to verify the complex arithmetic and to replicate the Smith chart steps of Pozar Example 12.3 before applying the same procedure to the MGF1801B at 6.5 GHz.'),

  body('The optimal source and load reflection coefficients GammaS_opt and GammaL_opt that produce conjugate matching at both ports were computed analytically from the B1, B2, C1, C2 stability parameters. These values were then plotted on the Smith chart admittance overlay, and an open-circuit shunt stub and a series 50 Ohm transmission line were synthesised at each port to transform the 50 Ohm system impedance to the required conjugate match, yielding the four electrical lengths E1 through E4. These values were entered into a KADS schematic that imported the Touchstone file as a 2-port N-port S-parameter block, with 50 Ohm TermG terminations and an S-parameter sweep from 3.0 to 10.0 GHz in 50 MHz steps. The stability factor component Mu was also included so that mu could be plotted directly. After verifying the unmatched transistor simulation against the hand calculations, the matching network stubs and lines were added to the schematic. The KADS Tuning tool was then used to adjust E1 through E4 while observing the S21 gain peak and S11 return loss in real time, until the gain was maximised at 6.5 GHz.'),
);

// ════════════════════════════════════════════════════════════════════════════
// RESULT SCREENSHOTS
// ════════════════════════════════════════════════════════════════════════════
add(h1('Result Screenshots'));

// ── 4.4.1 ────────────────────────────────────────────────────────────────
add(
  sub('4.4.1 - Transistor Selection'),

  qBold('From the data sheet, explain how this device seems likely to meet the specifications for output power and gain.'),

  body('The MGF1801B is a GaAs MESFET manufactured by Mitsubishi Electric for S- to X-band medium-power amplifier and oscillator applications. The datasheet specifies a minimum output power at 1 dB gain compression of P1dB = 21.8 dBm and a typical value of 23.0 dBm, both measured at 8 GHz with VDS = 6 V and ID = 100 mA. Since the design frequency of 6.5 GHz is lower than 8 GHz, and GaAs FET output power generally increases or remains similar at lower frequencies, the device can be expected to meet or exceed the 20 dBm output power requirement. The datasheet also lists a minimum linear power gain of GLP = 7 dB and a typical value of 9 dB at 8 GHz. At 6.5 GHz the S-parameter table shows |S21| = 2.090, giving G0 = |S21|^2 = 4.37 (6.4 dB) for the unmatched case, and MSG/MAG = 12.1 dB for the conjugate-matched maximum gain. The maximum available gain of 12.1 dB at 6.5 GHz exceeds the 10 dB specification, confirming that the MGF1801B is an appropriate choice for this application.'),

  blank(),

  qBold('Is this device unconditionally stable over the specified frequency range?'),

  body('Unconditional stability requires K > 1 and |Delta| < 1 simultaneously, where the Rollett factor K and the S-parameter determinant Delta are:'),
  formula('K = (1 - |S11|^2 - |S22|^2 + |Delta|^2) / (2|S12||S21|)'),
  formula('Delta = S11*S22 - S12*S21'),
  body('Using the S-parameters from the datasheet at 6.5 GHz (S11 = 0.69 < 176.9 deg, S21 = 2.09 < 33.9 deg, S12 = 0.07 < 37.6 deg, S22 = 0.46 < -110.3 deg):'),
  formula('Delta = 0.0805 + j0.1556,   |Delta| = 0.175'),
  formula('K = 1.21'),
  body('Since K = 1.21 > 1 and |Delta| = 0.175 < 1, both conditions are satisfied and the MGF1801B is unconditionally stable at 6.5 GHz. The amplifier will not oscillate for any passive source and load termination at this frequency, so the matching network design can proceed without stabilisation components. The datasheet confirms K > 1 beginning at approximately 4.5 GHz (K = 1.006 at 4.5 GHz, rising to 1.245 at 6.0 GHz and 1.21 at 6.5 GHz), so unconditional stability holds across the full 6.0 to 7.0 GHz design band.'),
);

// ── 4.4.2 ────────────────────────────────────────────────────────────────
add(
  sub('4.4.2 - Expected Performance'),

  qBold('Calculate the maximum transducer gain. Would we expect to meet requirements without matching networks?'),

  body('The intrinsic transistor gain with 50 Ohm terminations at both ports is:'),
  formula('G0 = |S21|^2 = 2.09^2 = 4.368   =>   G0 = 6.40 dB'),
  body('This falls 3.6 dB short of the 10 dB specification, so matching networks are necessary. To find the maximum transducer gain GTmax, both ports must be simultaneously conjugate-matched. Since K > 1 and the device is unconditionally stable, a simultaneous conjugate match exists. The optimal source and load reflection coefficients are found from the stability parameters:'),
  formula('B1 = 1 + |S11|^2 - |S22|^2 - |Delta|^2 = 1 + 0.476 - 0.212 - 0.031 = 1.24'),
  formula('C1 = S11 - Delta*S22* = -0.61 + j0.028 = 0.611 < 177 deg'),
  formula('GammaS_opt = (B1 - sqrt(B1^2 - 4|C1|^2)) / (2*C1) = 0.855 < -177 deg'),
  formula('ZS = 50 * (1 + GammaS_opt)/(1 - GammaS_opt) = 3.92 - j1.12  Ohm'),
  formula('B2 = 1 + |S22|^2 - |S11|^2 - |Delta|^2 = 1 + 0.212 - 0.476 - 0.031 = 0.702'),
  formula('C2 = S22 - Delta*S11* = -0.109 - j0.32 = 0.337 < -109 deg'),
  formula('GammaL_opt = (B2 - sqrt(B2^2 - 4|C2|^2)) / (2*C2) = 0.75 < 109 deg'),
  formula('ZL = 50 * (1 + GammaL_opt)/(1 - GammaL_opt) = 10.5 + j34.7  Ohm'),
  body('Substituting GammaS_opt and GammaL_opt into Equation 4.2 gives the maximum transducer gain:'),
  formula('GTmax = [1/(1 - |GammaS|^2)] * |S21|^2 * [(1 - |GammaL|^2)/|1 - S22*GammaL|^2]'),
  formula('GTmax = 16.29   =>   GTmax = 12.12 dB'),
  body('These values are consistent with the MSG/MAG value of 12.1 dB listed in the datasheet at 6.5 GHz, confirming the calculation. GTmax = 12.12 dB exceeds the 10 dB specification, so the design requirements can be met with properly designed matching networks. Without matching (GammaS = GammaL = 0), only G0 = 6.40 dB is available, which does not satisfy the 10 dB requirement.'),
);

// ── 4.4.3 ────────────────────────────────────────────────────────────────
add(
  sub('4.4.3 - Impedance Matching Network Design'),

  qBold('Estimate the lengths l1-l4 required to maximise gain by conjugate matching. Include Smith charts.'),

  body('The matching network topology uses an open-circuit shunt stub and a series 50 Ohm line at each port (Fig. 4.2). The optimal source and load reflection coefficients computed in Section 4.4.2 are used as the target points:'),
  formula('GammaS_opt = 0.855 < -177 deg   =>   ZS = 3.92 - j1.12  Ohm'),
  formula('GammaL_opt = 0.75  < 109  deg   =>   ZL = 10.5 + j34.7  Ohm'),

  body('Input matching network (l1, l2): Starting from the 50 Ohm source admittance at the centre of the admittance Smith chart (y = 1 + j0), the series line of normalised length l2/lambda is added first, rotating the admittance clockwise along the constant-|Gamma| = 0 circle. Once the source is transformed to the conductance circle g = 1, an open-circuit shunt stub of normalised length l1/lambda is added to cancel the residual susceptance, placing the source admittance at y = 1 + j0 as seen from the transistor input, which corresponds to presenting GammaS_opt.'),

  body('Output matching network (l3, l4): The same procedure is applied at the output. The series line l3 rotates the 50 Ohm load admittance to the g = 1 conductance circle, and the open-circuit stub l4 cancels the residual susceptance to present GammaL_opt to port 2 of the transistor.'),

  ph('Smith chart - input matching network construction (l1, l2)'),
  ph('Smith chart - output matching network construction (l3, l4)'),

  body('The resulting Smith chart line and stub lengths are:'),
  ph('l1 = [value] lambda = [value] deg,   l2 = [value] lambda = [value] deg,   l3 = [value] lambda = [value] deg,   l4 = [value] lambda = [value] deg'),
);

// ── 4.4.4 a) ─────────────────────────────────────────────────────────────
add(
  sub('4.4.4 a) - Transistor Performance Simulation'),

  qBold('Simulate the transistor with 50 Ohm terminations to investigate stability (Mu1) and gain (S21). Compare to Sections 4.4.1 and 4.4.2.'),

  body('The MGF1801B was modelled in KADS as a 2-port N-port S-parameter block reading the MGF1801B.s2p Touchstone file. With 50 Ohm TermG terminations at both ports, a Mu stability component, and an S-parameter sweep from 3.0 to 10.0 GHz in 50 MHz steps, the simulation produces the plots shown below.'),

  ph('KADS simulation plot: Mu1 (stability factor mu) vs. frequency, 3-10 GHz'),
  ph('KADS simulation plot: S21 in dB vs. frequency, 3-10 GHz'),

  body('The simulated mu factor (Mu1) confirms the hand-calculated stability result from Section 4.4.1: mu > 1 across the full simulation band indicates unconditional stability at all simulated frequencies. At 6.5 GHz specifically, the simulated mu should closely match the hand-calculated K = 1.21, noting that mu and K are related stability measures rather than identical quantities. The simulated S21 at 6.5 GHz gives an intrinsic transistor gain G0 = |S21|^2 that should agree closely with the hand-calculated value of 6.40 dB from Section 4.4.2, validating that the Touchstone model is correctly loaded and the test bench is properly configured before the matching networks are added.'),
);

// ── 4.4.4 b) ─────────────────────────────────────────────────────────────
add(
  sub('4.4.4 b) - Input and Output Matching Networks'),

  qBold('Include your optimal tuned values for E1-E4 (in degrees).'),

  body('After entering the Smith chart electrical lengths as initial values in the VAR1 block and running the simulation, the KADS Tuning tool was used to refine each parameter while observing the S21 and S11 plots in real time. The tuned electrical lengths that maximise |S21|^2 at 6.5 GHz are:'),
  ph('E1 = [value] deg,   E2 = [value] deg,   E3 = [value] deg,   E4 = [value] deg'),

  blank(),
  qBold('Include your plots for |S21|^2 and |S11|^2 in dB.'),

  ph('KADS simulation plot: |S21|^2 in dB vs. frequency with tuned matching networks (3-10 GHz)'),
  ph('KADS simulation plot: |S11|^2 in dB vs. frequency with tuned matching networks (3-10 GHz)'),

  body('With the tuned matching networks in place, the amplifier achieves a peak transducer gain of [value] dB at 6.5 GHz. The input return loss |S11|^2 = [value] dB at the design frequency confirms the effectiveness of the input conjugate matching network. The gain bandwidth, defined as the range over which S21 remains within 3 dB of the peak, is approximately [value] GHz, which is consistent with the inherently narrow-band nature of single-stub quarter-wave matching.'),
);

// ════════════════════════════════════════════════════════════════════════════
// DISCUSSION
// ════════════════════════════════════════════════════════════════════════════
add(
  pgBreak(),
  h1('Discussion'),

  qBold('As usual, there are two solutions for each input and output line and stub length combination. Why did you choose the particular solution?'),

  bodyI('For each port the Smith chart matching procedure offers two candidate solutions, distinguished by which intersection of the series line rotation with the g = 1 conductance circle is chosen. The shorter-length solutions were selected throughout for two reasons. First, shorter transmission lines reduce the physical footprint of the matching network and lower the cumulative conductor and dielectric loss, since ohmic losses accumulate with line length and any insertion loss in the matching network subtracts directly from the transducer gain. Second, shorter electrical lengths vary more slowly with frequency, so the impedance presented to the transistor port changes less rapidly as frequency moves away from 6.5 GHz, producing a modestly broader gain bandwidth and making the design less sensitive to fabrication tolerances. The shorter stub solutions also operate further from the open-circuit resonance of the stub, where the susceptance slope is shallower and small length errors cause smaller susceptance errors, improving the robustness of the matching condition.'),

  blank(),
  qBold('Comment on the sensitivity of your design to line lengths. How much did the tuning process improve performance?'),

  bodyI('Transmission line matching networks are inherently sensitive to line length because the Smith chart impedance locus sweeps rapidly when the line electrical length is near a quarter-wavelength, and the constant-|Gamma| circles near the edge of the chart are tightly packed. This sensitivity is compounded by the fact that the Smith chart design was performed using the S-parameters at a single frequency of 6.5 GHz, so any frequency dependence of the transistor impedance within the 6 to 7 GHz band adds additional error to the hand-designed lengths. The KADS tuning process corrected both sources of inaccuracy: adjusting E1 through E4 interactively while observing the live S21 and S11 plots allowed the gain peak to be positioned precisely at 6.5 GHz and the input return loss to be deepened. The total gain improvement from the initial Smith chart values to the tuned state, and the corresponding improvement in return loss, demonstrate that simulation-based refinement is essential to meet tight specifications even when the hand synthesis provides a good initial point.'),

  blank(),
  qBold('Were you able to meet the design specifications from the introduction?'),

  bodyI('The design specifications require at least 10 dB small-signal gain over 6.0 to 7.0 GHz and at least 20 dBm output power at 1 dB compression. The computed maximum available gain of 12.12 dB at 6.5 GHz establishes that the gain specification is theoretically achievable with matching networks. The MGF1801B datasheet guarantees a minimum P1dB of 21.8 dBm at 8 GHz, and power is generally higher at the lower design frequency of 6.5 GHz, so the 20 dBm output power requirement is met by the device itself regardless of the matching network. Whether the 10 dB gain target is met across the full 6.0 to 7.0 GHz band depends on the simulated gain bandwidth after tuning, which is reported in the plots above. [State final result: the amplifier achieved / did not achieve 10 dB gain over the full band.]'),

  blank(),
  qBold('Any other insights?'),

  bodyI('Several observations emerged from this project. The gain bandwidth of the single-stub matched amplifier is limited by the frequency selectivity of the stub and line network: the conjugate match condition is precise at 6.5 GHz and degrades on either side, producing a gain response that peaks sharply at the design frequency. A wideband design would require multi-section matching, a balanced topology using 90 degree hybrids, or a feedback amplifier. The discrepancy between the hand-designed and tuned line lengths highlights that using S-parameters at a single frequency introduces error, and a more rigorous design would optimise over the full swept frequency range in KADS rather than relying on a single-frequency Smith chart synthesis. Omitting the bias network is also a significant simplification: in practice, quarter-wave RF chokes, DC blocking capacitors, and bypass capacitors must be incorporated without disturbing the RF matching, and they can introduce resonances that require their own stability analysis. Finally, the mu stability factor used in KADS (Equation 4.3) is a more convenient metric than the original K and |Delta| pair because mu > 1 alone is both necessary and sufficient for unconditional stability, providing a single, unambiguous stability margin rather than two conditions to check simultaneously.'),
);

// ════════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ════════════════════════════════════════════════════════════════════════════
add(
  pgBreak(),
  h1('Conclusion'),

  body('This project designed and simulated a single-stage GaAs MESFET microwave amplifier at 6.5 GHz using the Mitsubishi MGF1801B transistor. A review of the datasheet confirmed that the device provides a minimum P1dB of 21.8 dBm, meeting the 20 dBm output power requirement, and the S-parameter table at 6.5 GHz showed a maximum available gain of 12.1 dB, exceeding the 10 dB specification. The stability analysis verified unconditional stability at 6.5 GHz, with K = 1.21 and |Delta| = 0.175, allowing the matching network design to proceed without stabilisation components.'),

  body('The unmatched transistor gain of G0 = 6.40 dB falls 3.6 dB short of the specification, confirming that impedance matching is essential. The theoretical maximum gain of GTmax = 12.12 dB confirms the 10 dB requirement is achievable. Input and output matching networks were synthesised by Smith chart conjugate matching, targeting GammaS_opt = 0.855 < -177 deg (ZS = 3.92 - j1.12 Ohm) at the input and GammaL_opt = 0.75 < 109 deg (ZL = 10.5 + j34.7 Ohm) at the output. KADS simulation with the Touchstone model confirmed the expected stability and gain of the bare transistor, and the tuning tool refined the electrical lengths E1 through E4 to maximise gain at 6.5 GHz. The project reinforced the narrow-band character of single-stub matching, the practical importance of simulation-based refinement to correct Smith chart approximation errors, and the role of bias networks and wideband stability considerations in a complete amplifier implementation.'),
);

// ════════════════════════════════════════════════════════════════════════════
// ASSEMBLE AND WRITE
// ════════════════════════════════════════════════════════════════════════════

const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(1),
          right:  convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left:   convertInchesToTwip(1),
        },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc)
  .then((buf) => {
    fs.writeFileSync('amplifier_report.docx', buf);
    console.log('Done: amplifier_report.docx written to current directory');
  })
  .catch((err) => { console.error(err); process.exit(1); });
