import { useMemo } from 'react';
import './cardGraph.css';

const PALETTE = {
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
  stroke: "#2b2b2b",
};

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + Math.round(255 * (percent / 100)));
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
  const b = clamp((num & 0xff) + Math.round(255 * (percent / 100)));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function getBaseColorForPct(pct) {
  if (pct >= 100) return PALETTE.red;
  if (pct >= 50) return PALETTE.yellow;
  return PALETTE.green;
}

const CardGraph = ({ data, images }) => {
  const uid = useMemo(() => Math.random().toString(36).slice(2, 9), []);

  const aPct = Math.max(0, Math.min(100, Number(data?.A) || 0));
  const bPct = Math.max(0, Math.min(100, Number(data?.B) || 0));
  const cPct = Math.max(0, Math.min(100, Number(data?.C) || 0));

  const aBase = getBaseColorForPct(aPct);
  const bBase = getBaseColorForPct(bPct);
  const cBase = getBaseColorForPct(cPct);

  const aLight = shadeColor(aBase, 18);
  const aDark = shadeColor(aBase, -12);
  const bLight = shadeColor(bBase, 10);
  const bDark = shadeColor(bBase, -12);
  const cLight = shadeColor(cBase, 10);
  const cDark = shadeColor(cBase, -12);

  const idGradA = `gradA-${uid}`;
  const idGradB = `gradB-${uid}`;
  const idGradC = `gradC-${uid}`;
  const idShadow = `softShadow-${uid}`;

  const aHeight = 150;
  const aFillHeight = (aPct / 100) * aHeight;
  const aFillY = 165 - aFillHeight;

  const bHeight = 75;
  const bFillHeight = (bPct / 100) * bHeight;
  const bFillY = 90 - bFillHeight;

  const cHeight = 75;
  const cFillHeight = (cPct / 100) * cHeight;
  const cFillY = 165 - cFillHeight;

  return (
    <div className="card-graph-root" role="img" aria-label={`Compartimentos A ${aPct}%, B ${bPct}%, C ${cPct}%`}>
      <svg viewBox="0 0 280 180" className="card-graph-3d-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={idGradA} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={aLight} />
            <stop offset="50%" stopColor={aBase} />
            <stop offset="100%" stopColor={aDark} />
          </linearGradient>

          <linearGradient id={idGradB} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bLight} />
            <stop offset="50%" stopColor={bBase} />
            <stop offset="100%" stopColor={bDark} />
          </linearGradient>

          <linearGradient id={idGradC} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cLight} />
            <stop offset="50%" stopColor={cBase} />
            <stop offset="100%" stopColor={cDark} />
          </linearGradient>

          <filter id={idShadow} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Compartimento A */}
        <path
          d="M 18 15 L 140 15 L 140 165 L 18 165 Q 15 165 15 162 L 15 18 Q 15 15 18 15 Z"
          fill="#f5f5f5"
          stroke={PALETTE.stroke}
          strokeWidth="1.5"
          filter={`url(#${idShadow})`}
        />
        {aPct > 0 && (
          <path
            d={`M 18 ${aFillY} L 140 ${aFillY} L 140 165 L 18 165 Q 15 165 15 162 L 15 ${aFillY} Z`}
            fill={`url(#${idGradA})`}
            stroke="none"
          />
        )}
        <text x="35" y="45" textAnchor="middle" className="cg3d-label-large" fill="#333" fontSize="14" fontWeight="700">
          A
        </text>
        {images.A && (
          <g transform="translate(77.5,95)">
           <image href={images.A} x="-95" y="-90" width="190" height="190" />
          </g>
        )}
        <text x="77.5" y="157" textAnchor="middle" className="cg3d-label-small" fill="#333" style={{ fontSize: '14px', fontWeight: '600' }}>
          {aPct}%
        </text>

        {/* Compartimento B */}
        <path
          d="M 140 15 L 262 15 Q 265 15 265 18 L 265 90 L 140 90 L 140 15 Z"
          fill="#f5f5f5"
          stroke={PALETTE.stroke}
          strokeWidth="1.5"
          filter={`url(#${idShadow})`}
        />
        {bPct > 0 && (
          <path
            d={`M 140 ${bFillY} L 262 ${bFillY} Q 265 ${bFillY + (bFillY === 15 ? 3 : 0)} 265 ${Math.max(bFillY, 18)} L 265 90 L 140 90 Z`}
            fill={`url(#${idGradB})`}
            stroke="none"
          />
        )}
        <g transform="translate(202.5,52.5)">
          <text x="-55" y="-20" fill="#333" fontSize="14" fontWeight="700">B</text>
          {images.B && <image href={images.B} x="-40" y="-32" width="75" height="65" />}
          <text textAnchor="middle" y="30" fill="#333" fontSize="12" fontWeight="600">{bPct}%</text>
        </g>

        {/* Compartimento C */}
        <path
          d="M 140 90 L 265 90 L 265 162 Q 265 165 262 165 L 140 165 L 140 90 Z"
          fill="#f5f5f5"
          stroke={PALETTE.stroke}
          strokeWidth="1.5"
          filter={`url(#${idShadow})`}
        />
        {cPct > 0 && (
          <path
            d={`M 140 ${cFillY} L 265 ${cFillY} L 265 162 Q 265 165 262 165 L 140 165 Z`}
            fill={`url(#${idGradC})`}
            stroke="none"
          />
        )}
        <g transform="translate(202.5,127.5)">
          <text x="-55" y="-20" fill="#333" fontSize="14" fontWeight="700">C</text>
          {images.C && <image href={images.C} x="-40" y="-32" width="75" height="65" />}
          <text textAnchor="middle" y="30" fill="#333" fontSize="12" fontWeight="600">{cPct}%</text>
        </g>
      </svg>
    </div>
  );
};

export default CardGraph;