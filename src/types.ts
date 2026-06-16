export interface Glyph {
  id: string;
  cat: "Conflict" | "Community" | "Journey" | "Power" | "Celestial" | "Nature" | "Human";
  name: string;
  local: string;
  meaning: string;
  svg: string;
}

export interface SigilElement {
  t: "c" | "e" | "l" | "d" | "p" | "pl" | "a" | "pa";
  cx?: number;
  cy?: number;
  r?: number;
  rx?: number;
  ry?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  a1?: number;
  a2?: number;
  pts?: string;
  d?: string;
  fw?: number;
  f?: number;
}

export interface OracleResult {
  origin: string;
  meaning: string;
  essence: string;
  reasoning: string;
  poetic: string;
  glyphs: string[];
  symbolElements: SigilElement[];
}
