import React from "react";
import { SigilElement } from "../types";

interface SigilRendererProps {
  name: string;
  elements: SigilElement[];
  id?: string;
  className?: string;
}

// Helper to translate angular degrees into polar SVG coordinates
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: +(cx + r * Math.cos(angleInRadians)).toFixed(2),
    y: +(cy + r * Math.sin(angleInRadians)).toFixed(2),
  };
};

export const SigilRenderer: React.FC<SigilRendererProps> = ({
  name,
  elements,
  id = "sigilSvg",
  className = "w-full h-full",
}) => {
  // Generate 24 tickmarks spaced 15 degrees apart along the perimeter
  const tickMarks = Array.from({ length: 24 }).map((_, i) => {
    const angle = i * 15 * (Math.PI / 180);
    const outerR = 92;
    const innerR = 86;
    const x1 = +(100 + outerR * Math.cos(angle)).toFixed(1);
    const y1 = +(100 + outerR * Math.sin(angle)).toFixed(1);
    const x2 = +(100 + innerR * Math.cos(angle)).toFixed(1);
    const y2 = +(100 + innerR * Math.sin(angle)).toFixed(1);

    return (
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-ochre/40"
        strokeWidth="1.2"
      />
    );
  });

  const parsedName = name.trim().toUpperCase();

  return (
    <svg
      id={id}
      key={`${name}-${elements.length}`}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-gold`}
    >
      {/* Outer framing borders */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="#0a0805"
        stroke="#d4af37"
        strokeWidth="1.2"
        className="animate-draw"
        style={{ animationDelay: "0ms", animationFillMode: "both" }}
      />
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.6"
        strokeDasharray="2 3"
        className="opacity-60 animate-draw"
        style={{ animationDelay: "150ms", animationFillMode: "both" }}
      />

      {/* traditional tick-marks along dial */}
      <g>{tickMarks}</g>

      {/* Layer of dynamically drawn primitives */}
      <g className="opacity-90">
        {elements.map((el, index) => {
          const fw = el.fw ?? 2;
          const stroke = "currentColor";
          const fill = el.f ? "currentColor" : "none";
          const delayStyle = {
            animationDelay: `${300 + index * 120}ms`,
            animationFillMode: "both" as const,
          };

          switch (el.t) {
            case "c":
              return (
                <circle
                  key={`prim-${index}`}
                  cx={el.cx ?? 100}
                  cy={el.cy ?? 100}
                  r={el.r ?? 30}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            case "e":
              return (
                <ellipse
                  key={`prim-${index}`}
                  cx={el.cx ?? 100}
                  cy={el.cy ?? 100}
                  rx={el.rx ?? 30}
                  ry={el.ry ?? 20}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            case "l":
              return (
                <line
                  key={`prim-${index}`}
                  x1={el.x1 ?? 100}
                  y1={el.y1 ?? 50}
                  x2={el.x2 ?? 100}
                  y2={el.y2 ?? 150}
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            case "d":
              return (
                <circle
                  key={`prim-${index}`}
                  cx={el.cx ?? 100}
                  cy={el.cy ?? 100}
                  r={el.r ?? 4}
                  fill="currentColor"
                  stroke="none"
                  className="animate-pop"
                  style={delayStyle}
                />
              );

            case "p":
              return (
                <polygon
                  key={`prim-${index}`}
                  points={el.pts ?? ""}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinejoin="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            case "pl":
              return (
                <polyline
                  key={`prim-${index}`}
                  points={el.pts ?? ""}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            case "a": {
              const r = el.r ?? 25;
              const cx = el.cx ?? 100;
              const cy = el.cy ?? 100;
              const a1 = el.a1 ?? 0;
              const a2 = el.a2 ?? 180;

              const p1 = polarToCartesian(cx, cy, r, a1);
              const p2 = polarToCartesian(cx, cy, r, a2);
              const largeArcFlag = a2 - a1 > 180 ? 1 : 0;

              return (
                <path
                  key={`prim-${index}`}
                  d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );
            }

            case "pa":
              return (
                <path
                  key={`prim-${index}`}
                  d={el.d ?? ""}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={fw}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw"
                  style={delayStyle}
                />
              );

            default:
              return null;
          }
        })}
      </g>

      {/* Decorative core pivot anchor */}
      <circle cx="100" cy="100" r="4.5" fill="#f5f0e1" className="animate-pop" style={{ animationDelay: "1.2s", animationFillMode: "both" }} />

      {/* Centered arched base name inscription inside borders */}
      <path
        id={`name-path-${parsedName}`}
        d="M 32,150 A 73,73 0 0,0 168,150"
        fill="none"
        stroke="none"
      />
      <text className="font-serif text-[10px] tracking-[4px] fill-ochre animate-text-fade" opacity="0.85" style={{ animationDelay: "1.4s", animationFillMode: "both" }}>
        <textPath href={`#name-path-${parsedName}`} startOffset="50%" textAnchor="middle">
          {parsedName}
        </textPath>
      </text>
    </svg>
  );
};
