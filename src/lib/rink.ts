// Ice rink geometry (IIHF rule book, NHL-style zones adopted by the IIHF in 2021), in centimetres.
// Used to draw real rink markings as SVG — the site's graphic language comes from the rules of the game.
//
// Rink 6000 × 3000 cm (the Bolshoy was built to the international 60 × 30 m), corner radius 850 cm.
// Lines: goal lines 5 cm red at 400 cm from the end boards; blue lines 30 cm at 2286 cm from the end
// boards; centre line 30 cm red. Circles r = 450 cm, line 5 cm. Spots 60 cm.

export const RINK = {
  length: 6000,
  width: 3000,
  corner: 850,
  goalLine: 400,
  blueLine: 2286,
  lineWide: 30,
  lineThin: 5,
  circleR: 450,
  spot: 60,
  endSpotFromGoal: 600,
  spotOffset: 700,
  neutralSpotFromBlue: 150,
  creaseR: 183,
  goalWidth: 183,
} as const;

export const COLORS = {
  red: 'var(--c-red-line, #C8102E)',
  blue: 'var(--c-blue-line, #0033A0)',
  crease: 'var(--c-crease, #41B6E6)',
  ice: 'var(--c-ice, #F6F9FB)',
  board: 'var(--c-board, #FFFFFF)',
};

type Opts = {
  /** draw the rink upright (length along the y axis) — good for phones */
  portrait?: boolean;
  /** stroke widths are exaggerated so thin lines survive small sizes */
  minLine?: number;
  showBoards?: boolean;
  /** unique id prefix when several rinks are on one page */
  id?: string;
};

const circle = (cx: number, cy: number, r: number, stroke: string, w: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;

/** End-zone face-off circle with hash marks and the two-tone spot. */
function faceoff(cx: number, cy: number, w: number) {
  const { circleR: r, spot } = RINK;
  const hash = 60;
  const gap = 85; // half of 170 cm between the hash marks
  const marks = [-1, 1]
    .flatMap((side) =>
      [-1, 1].map(
        (dir) =>
          `<line x1="${cx + side * gap}" y1="${cy + dir * r}" x2="${cx + side * gap}" y2="${cy + dir * (r + hash)}" stroke="${COLORS.red}" stroke-width="${w}"/>`,
      ),
    )
    .join('');
  return (
    circle(cx, cy, r, COLORS.red, w) +
    marks +
    `<circle cx="${cx}" cy="${cy}" r="${spot / 2}" fill="${COLORS.red}"/>`
  );
}

export function rinkSvg(opts: Opts = {}) {
  const { length: L, width: W, corner, goalLine, blueLine, lineWide, circleR, spot } = RINK;
  const clip = `${opts.id ?? "rink"}-clip`;
  const thin = Math.max(RINK.lineThin, opts.minLine ?? 0);
  const wide = Math.max(lineWide, (opts.minLine ?? 0) * 2);
  const cy = W / 2;
  const endX = [goalLine + RINK.endSpotFromGoal, L - goalLine - RINK.endSpotFromGoal];
  const neutralX = [blueLine + RINK.neutralSpotFromBlue, L - blueLine - RINK.neutralSpotFromBlue];
  const offs = [cy - RINK.spotOffset, cy + RINK.spotOffset];

  const crease = (x: number, dir: 1 | -1) =>
    `<path d="M ${x} ${cy - RINK.creaseR} A ${RINK.creaseR} ${RINK.creaseR} 0 0 ${dir === 1 ? 1 : 0} ${x} ${cy + RINK.creaseR} Z" fill="${COLORS.crease}" fill-opacity=".55" stroke="${COLORS.red}" stroke-width="${thin}"/>`;

  const body = [
    `<rect width="${L}" height="${W}" rx="${corner}" fill="${COLORS.ice}"/>`,
    `<g clip-path="url(#${clip})">`,
    // goal lines
    `<rect x="${goalLine - thin / 2}" y="0" width="${thin}" height="${W}" fill="${COLORS.red}"/>`,
    `<rect x="${L - goalLine - thin / 2}" y="0" width="${thin}" height="${W}" fill="${COLORS.red}"/>`,
    // blue lines and centre line
    `<rect x="${blueLine - wide / 2}" y="0" width="${wide}" height="${W}" fill="${COLORS.blue}"/>`,
    `<rect x="${L - blueLine - wide / 2}" y="0" width="${wide}" height="${W}" fill="${COLORS.blue}"/>`,
    `<rect x="${L / 2 - wide / 2}" y="0" width="${wide}" height="${W}" fill="${COLORS.red}"/>`,
    // centre circle and spot
    circle(L / 2, cy, circleR, COLORS.blue, thin),
    `<circle cx="${L / 2}" cy="${cy}" r="15" fill="${COLORS.blue}"/>`,
    // end-zone circles
    ...endX.flatMap((x) => offs.map((y) => faceoff(x, y, thin))),
    // neutral-zone spots
    ...neutralX.flatMap((x) => offs.map((y) => `<circle cx="${x}" cy="${y}" r="${spot / 2}" fill="${COLORS.red}"/>`)),
    // creases
    crease(goalLine, 1),
    crease(L - goalLine, -1),
    // referee crease at the bench side
    `<path d="M ${L / 2 - 300} ${W} A 300 300 0 0 1 ${L / 2 + 300} ${W}" fill="none" stroke="${COLORS.red}" stroke-width="${thin}"/>`,
    `</g>`,
    opts.showBoards !== false
      ? `<rect width="${L}" height="${W}" rx="${corner}" fill="none" stroke="currentColor" stroke-width="${Math.max(20, thin * 3)}"/>`
      : '',
  ].join('');

  const defs = `<defs><clipPath id="${clip}"><rect width="${L}" height="${W}" rx="${corner}"/></clipPath></defs>`;
  if (opts.portrait) {
    return `<svg viewBox="0 0 ${W} ${L}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}<g transform="translate(${W} 0) rotate(90)">${body}</g></svg>`;
  }
  return `<svg viewBox="0 0 ${L} ${W}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${body}</svg>`;
}
