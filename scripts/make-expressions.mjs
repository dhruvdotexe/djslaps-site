/**
 * Generates wojak expression variants by compositing SVG overlays
 * onto the base mascot with sharp. Run: node scripts/make-expressions.mjs
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";

const BASE = "public/mascot/wojak-default.png";
const OUT = "public/mascot";

// Face geometry (measured from the 880x903 source):
const EYE_L = { cx: 408, cy: 346, w: 26, h: 24 };
const EYE_R = { cx: 502, cy: 346, w: 26, h: 24 };
const MOUTH = { x0: 398, y0: 452, x1: 522, y1: 528 }; // open smile region
const LINE = "#24262f"; // outline color sampled from the art

/** Cover helper: opaque skin patch to erase original features. */
function patch(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 4}" fill="${fill}" />`;
}

function eyes(expression) {
  const { cx: lx, cy, w, h } = EYE_L;
  const { cx: rx } = EYE_R;

  switch (expression.eyes) {
    case "normal":
      return "";
    case "scared": {
      // wide round eyes with small pupils + raised inner brows
      return `
        ${patch(lx - 20, cy - 18, 44, 38, expression.skin)}
        ${patch(rx - 22, cy - 18, 48, 38, expression.skin)}
        <ellipse cx="${lx}" cy="${cy}" rx="14" ry="16" fill="#fff" stroke="${LINE}" stroke-width="3"/>
        <circle cx="${lx}" cy="${cy + 2}" r="4.5" fill="${LINE}"/>
        <ellipse cx="${rx}" cy="${cy}" rx="14" ry="16" fill="#fff" stroke="${LINE}" stroke-width="3"/>
        <circle cx="${rx}" cy="${cy + 2}" r="4.5" fill="${LINE}"/>
        <path d="M ${lx - 18} ${cy - 24} Q ${lx} ${cy - 32}, ${lx + 18} ${cy - 22}" stroke="${LINE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M ${rx - 18} ${cy - 23} Q ${rx} ${cy - 32}, ${rx + 18} ${cy - 25}" stroke="${LINE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    }
    case "smug": {
      // half-lidded: flat upper lid over the whites
      return `
        <rect x="${lx - 16}" y="${cy - 12}" width="36" height="11" fill="${expression.skin}"/>
        <rect x="${rx - 18}" y="${cy - 12}" width="38" height="11" fill="${expression.skin}"/>
        <path d="M ${lx - 15} ${cy - 1} L ${lx + 19} ${cy - 1}" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>
        <path d="M ${rx - 17} ${cy - 1} L ${rx + 19} ${cy - 1}" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`;
    }
    case "sleepy": {
      // closed curved-down lids
      return `
        ${patch(lx - 20, cy - 16, 44, 34, expression.skin)}
        ${patch(rx - 22, cy - 16, 48, 34, expression.skin)}
        <path d="M ${lx - 14} ${cy - 2} Q ${lx} ${cy + 10}, ${lx + 14} ${cy - 2}" stroke="${LINE}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M ${rx - 14} ${cy - 2} Q ${rx} ${cy + 10}, ${rx + 14} ${cy - 2}" stroke="${LINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    default:
      return "";
  }
}

function mouth(expression) {
  const mx = MOUTH.x0;
  const my = MOUTH.y0;
  const mw = MOUTH.x1 - MOUTH.x0;
  const mh = MOUTH.y1 - MOUTH.y0;

  switch (expression.mouth) {
    case "normal":
      return "";
    case "grit": {
      // scared grimace: wide rectangle, clenched teeth
      return `
        ${patch(mx + 6, my + 6, mw - 16, mh - 14, expression.skin)}
        <rect x="${mx + 14}" y="${my + 16}" width="${mw - 30}" height="${mh - 42}" rx="10" fill="#fff" stroke="${LINE}" stroke-width="3.5"/>
        <line x1="${mx + 28}" y1="${my + 16}" x2="${mx + 28}" y2="${my + mh - 26}" stroke="${LINE}" stroke-width="2"/>
        <line x1="${mx + 44}" y1="${my + 16}" x2="${mx + 44}" y2="${my + mh - 26}" stroke="${LINE}" stroke-width="2"/>
        <line x1="${mx + 60}" y1="${my + 16}" x2="${mx + 60}" y2="${my + mh - 26}" stroke="${LINE}" stroke-width="2"/>
        <line x1="${mx + 14}" y1="${my + (mh - 42) / 2 + 16}" x2="${mx + mw - 16}" y2="${my + (mh - 42) / 2 + 16}" stroke="${LINE}" stroke-width="2.5"/>`;
    }
    case "smirk": {
      // closed lopsided smirk
      return `
        ${patch(mx + 4, my + 4, mw - 10, mh - 10, expression.skin)}
        <path d="M ${mx + 30} ${my + 34} Q ${mx + 70} ${my + 58}, ${mx + 108} ${my + 26}"
          stroke="${LINE}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    }
    case "open-small": {
      // sleepy small o-mouth
      return `
        ${patch(mx + 4, my + 4, mw - 10, mh - 10, expression.skin)}
        <ellipse cx="${mx + mw / 2}" cy="${my + 36}" rx="17" ry="21" fill="#5a3d33" stroke="${LINE}" stroke-width="3.5"/>`;
    }
    case "flat": {
      // merch/neutral flat line
      return `
        ${patch(mx + 4, my + 4, mw - 10, mh - 10, expression.skin)}
        <line x1="${mx + 30}" y1="${my + 38}" x2="${mx + 106}" y2="${my + 38}" stroke="${LINE}" stroke-width="4.5" stroke-linecap="round"/>`;
    }
    default:
      return "";
  }
}

function extras(expression) {
  switch (expression.extras) {
    case "sweat": {
      return `<path d="M 552 300 q 14 22 0 34 q -13 -12 0 -34" fill="#7ec8f2" opacity="0.95"/>`;
    }
    case "zzz": {
      return `<g fill="none" stroke="${LINE}" stroke-width="4" stroke-linejoin="round">
          <text x="560" y="290" font-family="sans-serif" font-weight="700" font-size="44" fill="${LINE}">z</text>
          <text x="592" y="252" font-family="sans-serif" font-weight="700" font-size="56" fill="${LINE}">Z</text>
        </g>`;
    }
    case "blush": {
      return `
        <ellipse cx="${EYE_L.cx - 6}" cy="${EYE_L.cy + 52}" rx="20" ry="10" fill="#e88a7a" opacity="0.45"/>
        <ellipse cx="${EYE_R.cx + 6}" cy="${EYE_R.cy + 52}" rx="20" ry="10" fill="#e88a7a" opacity="0.45"/>`;
    }
    default:
      return "";
  }
}

const EXPRESSIONS = [
  {
    file: "wojak-scared.png",
    skin: "#eec49b",
    eyes: "scared",
    mouth: "grit",
    extras: "sweat",
  },
  {
    file: "wojak-smug.png",
    skin: "#eec49b",
    eyes: "smug",
    mouth: "smirk",
    extras: "none",
  },
  {
    file: "wojak-sleeping.png",
    skin: "#eec49b",
    eyes: "sleepy",
    mouth: "open-small",
    extras: "zzz",
  },
  {
    file: "wojak-crying.png",
    skin: "#eec49b",
    eyes: "normal",
    mouth: "flat",
    extras: "tears",
  },
];

async function render(expr) {
  const tears =
    expr.extras === "tears"
      ? `<g fill="#7ec8f2" opacity="0.9">
          <path d="M ${EYE_L.cx - 8} ${EYE_L.cy + 14} q 6 26 -2 40 q -10 -14 -4 -40 z"/>
          <path d="M ${EYE_R.cx + 8} ${EYE_R.cy + 14} q 6 26 -2 40 q -10 -14 -4 -40 z"/>
        </g>`
      : "";

  const svg = `<svg width="880" height="903" xmlns="http://www.w3.org/2000/svg">
    ${eyes(expr)}
    ${mouth(expr)}
    ${extras(expr).includes("zzz") && expr.extras === "zzz" ? extras(expr) : ""}
    ${tears}
    ${expr.extras === "sweat" ? extras(expr) : ""}
    ${expr.extras === "blush" ? extras(expr) : ""}
  </svg>`;

  await sharp(BASE)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(`${OUT}/${expr.file}`);
  console.log("wrote", expr.file);
}

await mkdir(OUT, { recursive: true });
for (const expr of EXPRESSIONS) {
  await render(expr);
}
console.log("done");
