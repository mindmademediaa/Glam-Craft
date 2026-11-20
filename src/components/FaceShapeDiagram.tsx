import React from 'react';
import { FaceShape } from '../types/academy';

interface FaceShapeDiagramProps {
  shape: FaceShape;
  activeZone: 'highlight' | 'blush' | 'contour' | null;
  onSelectZone: (zone: 'highlight' | 'blush' | 'contour') => void;
}

interface ShapeGeometry {
  headPath: string;
  hairlinePath: string;
  foreheadHighlight: string;
  chinHighlight: string;
  leftBlush: { cx: number; cy: number; rx: number; ry: number; rot: number };
  rightBlush: { cx: number; cy: number; rx: number; ry: number; rot: number };
  leftContour: string;
  rightContour: string;
  extraContour?: string;
  highlightAnchor: [number, number];
  blushAnchor: [number, number];
  contourAnchor: [number, number];
}

const SHAPE_GEOMETRIES: Record<FaceShape, ShapeGeometry> = {
  Oval: {
    headPath: 'M146 66 C146 28, 254 28, 254 66 C262 104, 256 164, 239 200 C225 228, 212 242, 200 242 C188 242, 175 228, 161 200 C144 164, 138 104, 146 66 Z',
    hairlinePath: 'M144 102 C148 64, 172 52, 200 52 C228 52, 252 64, 256 102',
    foreheadHighlight: 'M172 78 C184 68, 216 68, 228 78 C231 86, 216 96, 207 104 L205 152 C205 158, 195 158, 195 152 L193 104 C184 96, 169 86, 172 78 Z',
    chinHighlight: 'M186 221 C193 215, 207 215, 214 221 C212 232, 188 232, 186 221 Z',
    leftBlush: { cx: 168, cy: 162, rx: 18, ry: 12, rot: 22 },
    rightBlush: { cx: 232, cy: 162, rx: 18, ry: 12, rot: -22 },
    leftContour: 'M148 156 C158 171, 167 183, 172 204 C162 203, 152 188, 148 156 Z',
    rightContour: 'M252 156 C242 171, 233 183, 228 204 C238 203, 248 188, 252 156 Z',
    highlightAnchor: [200, 82],
    blushAnchor: [234, 161],
    contourAnchor: [162, 189],
  },
  Round: {
    headPath: 'M142 74 C142 32, 258 32, 258 74 C268 118, 264 176, 245 208 C230 232, 215 240, 200 240 C185 240, 170 232, 155 208 C136 176, 132 118, 142 74 Z',
    hairlinePath: 'M140 104 C146 66, 172 55, 200 55 C228 55, 254 66, 260 104',
    foreheadHighlight: 'M182 74 C192 67, 208 67, 218 74 C218 88, 209 98, 205 106 L204 156 C204 161, 196 161, 196 156 L195 106 C191 98, 182 88, 182 74 Z',
    chinHighlight: 'M187 218 C194 212, 206 212, 213 218 C210 233, 190 233, 187 218 Z',
    leftBlush: { cx: 164, cy: 155, rx: 16, ry: 10, rot: 34 },
    rightBlush: { cx: 236, cy: 155, rx: 16, ry: 10, rot: -34 },
    leftContour: 'M141 112 C152 128, 155 152, 169 180 C172 198, 172 213, 162 214 C145 196, 138 158, 141 112 Z',
    rightContour: 'M259 112 C248 128, 245 152, 231 180 C228 198, 228 213, 238 214 C255 196, 262 158, 259 112 Z',
    highlightAnchor: [200, 82],
    blushAnchor: [238, 155],
    contourAnchor: [158, 188],
  },
  Square: {
    headPath: 'M142 66 C142 32, 258 32, 258 66 C261 110, 260 176, 251 206 C243 226, 222 238, 200 239 C178 238, 157 226, 149 206 C140 176, 139 110, 142 66 Z',
    hairlinePath: 'M142 96 C148 64, 170 54, 200 54 C230 54, 252 64, 258 96',
    foreheadHighlight: 'M176 78 C186 70, 214 70, 224 78 C222 92, 212 100, 205 106 L204 154 C204 159, 196 159, 196 154 L195 106 C188 100, 178 92, 176 78 Z',
    chinHighlight: 'M185 219 C193 213, 207 213, 215 219 C212 230, 188 230, 185 219 Z',
    leftBlush: { cx: 170, cy: 164, rx: 16, ry: 13, rot: 12 },
    rightBlush: { cx: 230, cy: 164, rx: 16, ry: 13, rot: -12 },
    leftContour: 'M146 182 C158 190, 169 206, 175 224 C159 224, 149 213, 146 182 Z',
    rightContour: 'M254 182 C242 190, 231 206, 225 224 C241 224, 251 213, 254 182 Z',
    extraContour: 'M145 78 C156 66, 168 64, 172 72 C164 84, 155 96, 145 102 Z M255 78 C244 66, 232 64, 228 72 C236 84, 245 96, 255 102 Z',
    highlightAnchor: [200, 82],
    blushAnchor: [232, 164],
    contourAnchor: [160, 204],
  },
  Heart: {
    headPath: 'M140 66 C140 30, 260 30, 260 66 C265 104, 256 156, 236 196 C220 226, 209 244, 200 245 C191 244, 180 226, 164 196 C144 156, 135 104, 140 66 Z',
    hairlinePath: 'M140 100 C152 68, 184 56, 200 69 C216 56, 248 68, 260 100',
    foreheadHighlight: 'M184 82 C192 77, 208 77, 216 82 C214 96, 207 104, 205 110 L204 156 C204 161, 196 161, 196 156 L195 110 C193 104, 186 96, 184 82 Z',
    chinHighlight: 'M165 204 C172 208, 179 214, 183 220 C172 218, 166 212, 165 204 Z M235 204 C228 208, 221 214, 217 220 C228 218, 234 212, 235 204 Z',
    leftBlush: { cx: 168, cy: 166, rx: 18, ry: 11, rot: 24 },
    rightBlush: { cx: 232, cy: 166, rx: 18, ry: 11, rot: -24 },
    leftContour: 'M142 82 C156 76, 167 84, 162 114 C152 116, 144 106, 142 82 Z',
    rightContour: 'M258 82 C244 76, 233 84, 238 114 C248 116, 256 106, 258 82 Z',
    extraContour: 'M190 230 C196 226, 204 226, 210 230 C206 242, 194 242, 190 230 Z',
    highlightAnchor: [200, 88],
    blushAnchor: [233, 166],
    contourAnchor: [152, 98],
  },
  Diamond: {
    headPath: 'M152 66 C158 30, 242 30, 248 66 C262 106, 266 146, 250 184 C234 216, 214 243, 200 244 C186 243, 166 216, 150 184 C134 146, 138 106, 152 66 Z',
    hairlinePath: 'M148 100 C156 64, 176 54, 200 54 C224 54, 244 64, 252 100',
    foreheadHighlight: 'M174 78 C186 68, 214 68, 226 78 C227 89, 214 98, 206 105 L205 154 C205 159, 195 159, 195 154 L194 105 C186 98, 173 89, 174 78 Z',
    chinHighlight: 'M186 220 C193 214, 207 214, 214 220 C212 234, 188 234, 186 220 Z',
    leftBlush: { cx: 170, cy: 158, rx: 17, ry: 10, rot: 8 },
    rightBlush: { cx: 230, cy: 158, rx: 17, ry: 10, rot: -8 },
    leftContour: 'M142 146 C152 148, 161 158, 162 178 C150 176, 143 164, 142 146 Z',
    rightContour: 'M258 146 C248 148, 239 158, 238 178 C250 176, 257 164, 258 146 Z',
    highlightAnchor: [200, 82],
    blushAnchor: [232, 158],
    contourAnchor: [152, 164],
  },
  Long: {
    headPath: 'M152 62 C152 26, 248 26, 248 62 C254 108, 252 172, 238 212 C226 238, 213 248, 200 248 C187 248, 174 238, 162 212 C148 172, 146 108, 152 62 Z',
    hairlinePath: 'M149 96 C154 60, 174 49, 200 49 C226 49, 246 60, 251 96',
    foreheadHighlight: 'M195 112 L205 112 L204 152 C204 156, 196 156, 196 152 Z',
    chinHighlight: 'M161 146 C167 142, 179 144, 184 151 C176 155, 165 153, 161 146 Z M239 146 C233 142, 221 144, 216 151 C224 155, 235 153, 239 146 Z',
    leftBlush: { cx: 170, cy: 162, rx: 19, ry: 9, rot: 2 },
    rightBlush: { cx: 230, cy: 162, rx: 19, ry: 9, rot: -2 },
    leftContour: 'M162 64 C180 54, 220 54, 238 64 C236 74, 220 78, 200 78 C180 78, 164 74, 162 64 Z',
    rightContour: 'M182 229 C192 224, 208 224, 218 229 C214 244, 186 244, 182 229 Z',
    highlightAnchor: [228, 148],
    blushAnchor: [232, 163],
    contourAnchor: [190, 236],
  },
};

export function FaceShapeDiagram({ shape, activeZone, onSelectZone }: FaceShapeDiagramProps) {
  const geo = SHAPE_GEOMETRIES[shape];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#DFB7AA] bg-white px-3 py-4 shadow-[0_12px_32px_rgba(61,31,52,0.06)]">
      <svg
        viewBox="0 0 400 284"
        className="mx-auto w-full max-w-[420px] select-none"
        role="img"
        aria-label={`${shape} face shape highlight, blush, and contour placement diagram`}
      >
        <defs>
          <radialGradient id="highlightGrad" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#E9C7BE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F5E4DE" stopOpacity="0.45" />
          </radialGradient>
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#DF9597" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#EBB5B5" stopOpacity="0.12" />
          </radialGradient>
          <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A6827C" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#C8A9A3" stopOpacity="0.34" />
          </linearGradient>
        </defs>

        {/* Neck */}
        <path
          d="M174 226 C175 248, 171 264, 162 276 L238 276 C229 264, 225 248, 226 226"
          fill="#FFF7F3"
          stroke="#2D1B2E"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Ears */}
        <path
          d="M144 134 C133 134, 132 152, 136 164 C139 173, 145 178, 150 176"
          fill="#FFF9F6"
          stroke="#2D1B2E"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M256 134 C267 134, 268 152, 264 164 C261 173, 255 178, 250 176"
          fill="#FFF9F6"
          stroke="#2D1B2E"
          strokeWidth="1.9"
          strokeLinecap="round"
        />

        {/* Face Base Silhouette */}
        <path d={geo.headPath} fill="#FFFDFB" stroke="#2D1B2E" strokeWidth="2.1" />

        {/* Hairband / Hairline */}
        <path d={geo.hairlinePath} fill="none" stroke="#2D1B2E" strokeWidth="1.7" />
        <path
          d={geo.hairlinePath}
          fill="none"
          stroke="#C29B92"
          strokeWidth="0.9"
          strokeDasharray="2.5 2.5"
          transform="translate(0 4)"
        />

        {/* HIGHLIGHT ZONES */}
        <g
          className="cursor-pointer transition-opacity duration-200"
          opacity={activeZone && activeZone !== 'highlight' ? 0.35 : 1}
          onClick={() => onSelectZone('highlight')}
        >
          <path
            d={geo.foreheadHighlight}
            fill="url(#highlightGrad)"
            stroke="#9B7570"
            strokeWidth={activeZone === 'highlight' ? 1.4 : 0.8}
            strokeDasharray="2.5 2"
          />
          <path
            d={geo.chinHighlight}
            fill="url(#highlightGrad)"
            stroke="#9B7570"
            strokeWidth={activeZone === 'highlight' ? 1.4 : 0.8}
            strokeDasharray="2.5 2"
          />
          {/* Under-eye highlight crescents */}
          <path
            d="M158 140 C166 138, 178 140, 185 144 C178 150, 165 151, 158 140 Z"
            fill="url(#highlightGrad)"
            stroke="#9B7570"
            strokeWidth="0.7"
            strokeDasharray="2 2"
          />
          <path
            d="M242 140 C234 138, 222 140, 215 144 C222 150, 235 151, 242 140 Z"
            fill="url(#highlightGrad)"
            stroke="#9B7570"
            strokeWidth="0.7"
            strokeDasharray="2 2"
          />
        </g>

        {/* BLUSH ZONES */}
        <g
          className="cursor-pointer transition-opacity duration-200"
          opacity={activeZone && activeZone !== 'blush' ? 0.35 : 1}
          onClick={() => onSelectZone('blush')}
        >
          <ellipse
            cx={geo.leftBlush.cx}
            cy={geo.leftBlush.cy}
            rx={geo.leftBlush.rx}
            ry={geo.leftBlush.ry}
            transform={`rotate(${geo.leftBlush.rot} ${geo.leftBlush.cx} ${geo.leftBlush.cy})`}
            fill="url(#blushGrad)"
            stroke={activeZone === 'blush' ? '#C06D73' : 'none'}
            strokeWidth="1.2"
          />
          <ellipse
            cx={geo.rightBlush.cx}
            cy={geo.rightBlush.cy}
            rx={geo.rightBlush.rx}
            ry={geo.rightBlush.ry}
            transform={`rotate(${geo.rightBlush.rot} ${geo.rightBlush.cx} ${geo.rightBlush.cy})`}
            fill="url(#blushGrad)"
            stroke={activeZone === 'blush' ? '#C06D73' : 'none'}
            strokeWidth="1.2"
          />
        </g>

        {/* CONTOUR ZONES */}
        <g
          className="cursor-pointer transition-opacity duration-200"
          opacity={activeZone && activeZone !== 'contour' ? 0.35 : 1}
          onClick={() => onSelectZone('contour')}
        >
          <path
            d={geo.leftContour}
            fill="url(#contourGrad)"
            stroke="#7B5956"
            strokeWidth={activeZone === 'contour' ? 1.4 : 0.75}
            strokeDasharray="2.5 2"
          />
          <path
            d={geo.rightContour}
            fill="url(#contourGrad)"
            stroke="#7B5956"
            strokeWidth={activeZone === 'contour' ? 1.4 : 0.75}
            strokeDasharray="2.5 2"
          />
          {geo.extraContour && (
            <path
              d={geo.extraContour}
              fill="url(#contourGrad)"
              stroke="#7B5956"
              strokeWidth={activeZone === 'contour' ? 1.4 : 0.75}
              strokeDasharray="2.5 2"
            />
          )}
        </g>

        {/* FACIAL LINE-ART FEATURES */}
        {/* Eyebrows */}
        <path d="M156 112 C164 103, 179 104, 189 111 C180 110, 166 109, 156 112 Z" fill="#2D1B2E" />
        <path d="M244 112 C236 103, 221 104, 211 111 C220 110, 234 109, 244 112 Z" fill="#2D1B2E" />

        {/* Closed Eyelids & Lashes */}
        <path d="M159 128 C166 135, 178 135, 186 128" fill="none" stroke="#2D1B2E" strokeWidth="2" strokeLinecap="round" />
        <path d="M159 128 L155 125 M163 131 L160 135 M168 133 L167 137 M175 133 L175 137 M181 131 L183 135" stroke="#2D1B2E" strokeWidth="1.15" strokeLinecap="round" />

        <path d="M214 128 C222 135, 234 135, 241 128" fill="none" stroke="#2D1B2E" strokeWidth="2" strokeLinecap="round" />
        <path d="M241 128 L245 125 M237 131 L240 135 M232 133 L233 137 M225 133 L225 137 M219 131 L217 135" stroke="#2D1B2E" strokeWidth="1.15" strokeLinecap="round" />

        {/* Nose */}
        <path d="M195 117 C194 136, 193 151, 190 162" fill="none" stroke="#2D1B2E" strokeWidth="1.1" opacity="0.65" />
        <path d="M205 117 C206 136, 207 151, 210 162" fill="none" stroke="#2D1B2E" strokeWidth="1.1" opacity="0.65" />
        <path d="M189 167 C187 171, 191 174, 195 173 C197 176, 203 176, 205 173 C209 174, 213 171, 211 167" fill="none" stroke="#2D1B2E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Lips */}
        <path d="M181 196 C188 190, 195 190, 200 193 C205 190, 212 190, 219 196 C210 198, 190 198, 181 196 Z" fill="#F2D7D2" stroke="#2D1B2E" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M182 197 C189 207, 211 207, 218 197" fill="#F5DFDA" stroke="#2D1B2E" strokeWidth="1.5" strokeLinecap="round" />

        {/* CALLOUT LEADER LINES & LABELS */}
        {/* Highlight Callout (Top-Right) */}
        <g className="cursor-pointer" onClick={() => onSelectZone('highlight')}>
          <line
            x1={geo.highlightAnchor[0]}
            y1={geo.highlightAnchor[1]}
            x2="294"
            y2="82"
            stroke="#8B6B73"
            strokeWidth="1.2"
          />
          <circle cx={geo.highlightAnchor[0]} cy={geo.highlightAnchor[1]} r="3" fill="#8B6B73" />
          <circle cx="294" cy="82" r="2.8" fill="#8B6B73" />
          <text
            x="302"
            y="87"
            fill={activeZone === 'highlight' ? '#B97664' : '#2D1B2E'}
            fontSize="14.5"
            fontWeight={activeZone === 'highlight' ? '700' : '500'}
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Highlight
          </text>
        </g>

        {/* Blush Callout (Mid-Right) */}
        <g className="cursor-pointer" onClick={() => onSelectZone('blush')}>
          <line
            x1={geo.blushAnchor[0]}
            y1={geo.blushAnchor[1]}
            x2="294"
            y2="161"
            stroke="#8B6B73"
            strokeWidth="1.2"
          />
          <circle cx={geo.blushAnchor[0]} cy={geo.blushAnchor[1]} r="3" fill="#8B6B73" />
          <circle cx="294" cy="161" r="2.8" fill="#8B6B73" />
          <text
            x="302"
            y="166"
            fill={activeZone === 'blush' ? '#B97664' : '#2D1B2E'}
            fontSize="14.5"
            fontWeight={activeZone === 'blush' ? '700' : '500'}
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Blush
          </text>
        </g>

        {/* Contour Callout (Lower-Left) */}
        <g className="cursor-pointer" onClick={() => onSelectZone('contour')}>
          <line
            x1={geo.contourAnchor[0]}
            y1={geo.contourAnchor[1]}
            x2="105"
            y2="195"
            stroke="#8B6B73"
            strokeWidth="1.2"
          />
          <circle cx={geo.contourAnchor[0]} cy={geo.contourAnchor[1]} r="3" fill="#8B6B73" />
          <circle cx="105" cy="195" r="2.8" fill="#8B6B73" />
          <text
            x="30"
            y="200"
            fill={activeZone === 'contour' ? '#B97664' : '#2D1B2E'}
            fontSize="14.5"
            fontWeight={activeZone === 'contour' ? '700' : '500'}
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Contour
          </text>
        </g>
      </svg>

      <div className="mt-1 flex items-center justify-center gap-4 text-[11px] text-[#7A6572]">
        <button
          type="button"
          onClick={() => onSelectZone('highlight')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            activeZone === 'highlight' ? 'bg-[#F5E6E1] text-[#2D1B2E] font-semibold' : 'hover:text-[#2D1B2E]'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#E9C7BE] border border-[#C58371]" />
          Highlight
        </button>
        <button
          type="button"
          onClick={() => onSelectZone('blush')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            activeZone === 'blush' ? 'bg-[#F5E6E1] text-[#2D1B2E] font-semibold' : 'hover:text-[#2D1B2E]'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#DF9597]" />
          Blush
        </button>
        <button
          type="button"
          onClick={() => onSelectZone('contour')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            activeZone === 'contour' ? 'bg-[#F5E6E1] text-[#2D1B2E] font-semibold' : 'hover:text-[#2D1B2E]'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#A6827C]" />
          Contour
        </button>
      </div>
    </div>
  );
}
