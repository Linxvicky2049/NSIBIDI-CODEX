import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Search, 
  Download, 
  AlertCircle, 
  Check, 
  Clock, 
  Globe2,
  Mail,
  Phone,
  MapPin,
  User,
  Share2,
  Terminal,
  Camera,
  Cpu,
  Compass,
  Activity,
  ArrowRight
} from "lucide-react";
import { GLYPHS } from "./glyphsData";
import { SigilRenderer } from "./components/SigilRenderer";
import { GlyphCard } from "./components/GlyphCard";
import { NsibidiOracleCalendar } from "./components/NsibidiOracleCalendar";
import { NsibidiArCamera } from "./components/NsibidiArCamera";
import { OracleResult } from "./types";
import { jsPDF } from "jspdf";

// Demonstration initial placeholder based on "BLACKSUN"
const DEFAULT_INITIAL_RESULT: OracleResult = {
  origin: "Igbo / West African Celestial Metaphor",
  meaning: "Anyanwụ Oji — The Eclipsed Sun, Dark Radiance",
  essence: "An ancient celestial state representing unmanifested potential, where the void of the night holds the fiery source of all creation.",
  reasoning: "Combines the 'Sun-Rays' glyph signifying outer radiance with the 'Origin-Dot' at the exact center to show darkness binding light, and the 'Eye' of divine witness.",
  poetic: "A golden eye of daylight captured in a midnight crown, radiating silent strength from the cosmic deep.",
  glyphs: ["Sun-Rays", "Origin-Dot", "Eye"],
  symbolElements: [
    { t: "c", cx: 100, cy: 100, r: 62, fw: 1.5, f: 0 },
    { t: "c", cx: 100, cy: 100, r: 42, fw: 2, f: 0 },
    { t: "l", x1: 100, y1: 20, x2: 100, y2: 38, fw: 2 },
    { t: "l", x1: 100, y1: 162, x2: 100, y2: 180, fw: 2 },
    { t: "l", x1: 20, y1: 100, x2: 38, y2: 100, fw: 2 },
    { t: "l", x1: 162, y1: 100, x2: 180, y2: 100, fw: 2 },
    { t: "l", x1: 43, y1: 43, x2: 56, y2: 56, fw: 1.5 },
    { t: "l", x1: 144, y1: 144, x2: 157, y2: 157, fw: 1.5 },
    { t: "l", x1: 157, y1: 43, x2: 144, y2: 56, fw: 1.5 },
    { t: "l", x1: 43, y1: 157, x2: 56, y2: 144, fw: 1.5 },
    { t: "l", x1: 100, y1: 58, x2: 100, y2: 142, fw: 1.5 },
    { t: "l", x1: 58, y1: 100, x2: 142, y2: 100, fw: 1.5 },
    { t: "p", pts: "100,68 132,100 100,132 68,100", fw: 1, f: 0 },
    { t: "d", cx: 100, cy: 100, r: 5 }
  ]
};

const CATEGORIES = ["All", "Conflict", "Community", "Journey", "Power", "Celestial", "Nature", "Human"];

interface ArchiveItem {
  name: string;
  timestamp: string;
  result: OracleResult;
}

// Helper to download any arbitrary sigil completely client-side in seconds
const downloadArbitrarySigil = (name: string, elements: any[]) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(svgNS, "svg");
  svgEl.setAttribute("viewBox", "0 0 200 200");
  svgEl.setAttribute("width", "800");
  svgEl.setAttribute("height", "800");
  svgEl.setAttribute("style", "background:#0a0805; color:#f5f0e1;");

  let innerHTML = `
    <circle cx="100" cy="100" r="95" fill="#0a0805" stroke="#d4af37" stroke-width="1.2" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="#d4af37" stroke-width="0.6" stroke-dasharray="2 3" opacity="0.6" />
  `;

  // Draw 24 Ticks
  for (let i = 0; i < 24; i++) {
    const angle = i * 15 * (Math.PI / 180);
    const outerR = 92;
    const innerR = 86;
    const x1 = (100 + outerR * Math.cos(angle)).toFixed(1);
    const y1 = (100 + outerR * Math.sin(angle)).toFixed(1);
    const x2 = (100 + innerR * Math.cos(angle)).toFixed(1);
    const y2 = (100 + innerR * Math.sin(angle)).toFixed(1);
    innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d4af37" stroke-width="1.2" opacity="0.4" />`;
  }

  // Draw dynamically configured layers
  elements.forEach((el) => {
    const fw = el.fw ?? 2;
    const stroke = "currentColor";
    const fill = el.f ? "currentColor" : "none";
    if (el.t === "c") {
      innerHTML += `<circle cx="${el.cx ?? 100}" cy="${el.cy ?? 100}" r="${el.r ?? 30}" fill="${fill}" stroke="${stroke}" stroke-width="${fw}" stroke-linecap="round" />`;
    } else if (el.t === "e") {
      innerHTML += `<ellipse cx="${el.cx ?? 100}" cy="${el.cy ?? 100}" rx="${el.rx ?? 30}" ry="${el.ry ?? 20}" fill="${fill}" stroke="${stroke}" stroke-width="${fw}" stroke-linecap="round" />`;
    } else if (el.t === "l") {
      innerHTML += `<line x1="${el.x1 ?? 100}" y1="${el.y1 ?? 50}" x2="${el.x2 ?? 100}" y2="${el.y2 ?? 150}" stroke="${stroke}" stroke-width="${fw}" stroke-linecap="round" />`;
    } else if (el.t === "d") {
      innerHTML += `<circle cx="${el.cx ?? 100}" cy="${el.cy ?? 100}" r="${el.r ?? 4}" fill="currentColor" stroke="none" />`;
    } else if (el.t === "p") {
      innerHTML += `<polygon points="${el.pts ?? ""}" fill="${fill}" stroke="${stroke}" stroke-width="${fw}" stroke-linejoin="round" />`;
    } else if (el.t === "pl") {
      innerHTML += `<polyline points="${el.pts ?? ""}" fill="none" stroke="${stroke}" stroke-width="${fw}" stroke-linecap="round" stroke-linejoin="round" />`;
    }
  });

  // Central Hub
  innerHTML += `<circle cx="100" cy="100" r="4.5" fill="#f5f0e1" />`;

  // Path script
  const nameUpper = name.trim().toUpperCase();
  innerHTML += `
    <path id="temp-name-path" d="M 32,150 A 73,73 0 0,0 168,150" fill="none" stroke="none" />
    <text font-family="serif" font-size="10" letter-spacing="4" fill="#d4af37" opacity="0.85">
      <textPath href="#temp-name-path" startOffset="50%" text-anchor="middle">${nameUpper}</textPath>
    </text>
  `;

  svgEl.innerHTML = innerHTML;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgEl);
  source = `<?xml version="1.0" encoding="utf-8"?>\n${source}`;

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `nsibidi-shield-${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generates high-fidelity PDF report client-side using jsPDF
const generateOracleReportPdf = (name: string, result: OracleResult) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const bgIvory = [252, 251, 247];
  const charcoal = [20, 20, 20];
  const goldBronze = [199, 143, 62];
  const lightGrey = [240, 238, 230];

  doc.setFillColor(bgIvory[0], bgIvory[1], bgIvory[2]);
  doc.rect(0, 0, 210, 297, "F");

  doc.setDrawColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, 194, 281);

  doc.setLineWidth(0.3);
  doc.rect(10, 10, 190, 277);
  
  doc.line(7, 10, 13, 10);
  doc.line(10, 7, 10, 13);
  doc.line(203, 10, 197, 10);
  doc.line(200, 7, 200, 13);
  doc.line(10, 290, 10, 284);
  doc.line(7, 287, 13, 287);
  doc.line(200, 290, 200, 284);
  doc.line(203, 287, 197, 287);

  doc.setDrawColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(12, 12, 186, 15, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("NSIBIDI COSMOLOGICAL ORACLE ALIGNMENT ARCHIVE", 105, 21.5, { align: "center", charSpace: 2 });

  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text(name.toUpperCase(), 105, 43, { align: "center", charSpace: 4 });

  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.text("Traditional Divination Calibration Seal and Metadata Record", 105, 49.5, { align: "center" });

  const pdf_cx = 105;
  const pdf_cy = 94;
  const scale = 0.28;

  doc.setDrawColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.setLineWidth(0.8);
  doc.circle(pdf_cx, pdf_cy, 95 * scale, "S");
  doc.setLineWidth(0.25);
  doc.circle(pdf_cx, pdf_cy, 88 * scale, "S");

  doc.setDrawColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.setLineWidth(0.25);
  for (let i = 0; i < 24; i++) {
    const angle = i * 15 * (Math.PI / 180);
    const outerR = 92 * scale;
    const innerR = 86 * scale;
    const x1 = pdf_cx + outerR * Math.cos(angle);
    const y1 = pdf_cy + outerR * Math.sin(angle);
    const x2 = pdf_cx + innerR * Math.cos(angle);
    const y2 = pdf_cy + innerR * Math.sin(angle);
    doc.line(x1, y1, x2, y2);
  }

  doc.setDrawColor(charcoal[0], charcoal[1], charcoal[2]);
  result.symbolElements.forEach((el) => {
    const fw = (el.fw ?? 2) * 0.35;
    doc.setLineWidth(fw);
    const fill = el.f ? "FD" : "S";

    if (el.t === "c") {
      const rx = (el.r ?? 30) * scale;
      const x = pdf_cx + ((el.cx ?? 100) - 100) * scale;
      const y = pdf_cy + ((el.cy ?? 100) - 100) * scale;
      doc.circle(x, y, rx, fill);
    } else if (el.t === "l") {
      const x1 = pdf_cx + ((el.x1 ?? 100) - 100) * scale;
      const y1 = pdf_cy + ((el.y1 ?? 50) - 100) * scale;
      const x2 = pdf_cx + ((el.x2 ?? 100) - 100) * scale;
      const y2 = pdf_cy + ((el.y2 ?? 150) - 100) * scale;
      doc.line(x1, y1, x2, y2);
    } else if (el.t === "d") {
      const x = pdf_cx + ((el.cx ?? 100) - 100) * scale;
      const y = pdf_cy + ((el.cy ?? 100) - 100) * scale;
      const rx = (el.r ?? 4) * scale;
      doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.circle(x, y, rx, "F");
    } else if (el.t === "p" || el.t === "pl") {
      const ptsStr = el.pts || "";
      const pairs = ptsStr.split(" ");
      if (pairs.length > 1) {
        for (let idx = 0; idx < pairs.length; idx++) {
          const startPt = pairs[idx].split(",");
          const endPt = pairs[(idx + 1) === pairs.length ? (el.t === "p" ? 0 : idx) : (idx + 1)].split(",");
          if (startPt.length === 2 && endPt.length === 2) {
            const sx = pdf_cx + (parseFloat(startPt[0]) - 100) * scale;
            const sy = pdf_cy + (parseFloat(startPt[1]) - 100) * scale;
            const ex = pdf_cx + (parseFloat(endPt[0]) - 100) * scale;
            const ey = pdf_cy + (parseFloat(endPt[1]) - 100) * scale;
            doc.line(sx, sy, ex, ey);
          }
        }
      }
    }
  });

  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.circle(pdf_cx, pdf_cy, 1.2, "F");

  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.setTextColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.text("CALIBRATED SHIELD GEOMETRY", 105, pdf_cy + 106 * scale, { align: "center", charSpace: 1 });

  let startY = 142;

  doc.setDrawColor(goldBronze[0], goldBronze[1], goldBronze[2]);
  doc.setLineWidth(0.4);
  doc.line(20, startY, 190, startY);

  startY += 7;
  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("1. CONCEPTUAL COSMIC REGION", 20, startY);
  
  startY += 4.5;
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(result.origin, 22, startY);

  startY += 10;
  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("2. ETYMO-LOGOGRAPHIC ROOT SIGNIFICANCE", 20, startY);

  startY += 4.5;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const wrappedMeaning = doc.splitTextToSize(result.meaning, 168);
  doc.text(wrappedMeaning, 22, startY);
  startY += wrappedMeaning.length * 4.2;

  startY += 4;
  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("3. THE STEADFAST SPIRITUAL ESSENCE", 20, startY);

  startY += 4.5;
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const wrappedEssence = doc.splitTextToSize(result.essence, 168);
  doc.text(wrappedEssence, 22, startY);
  startY += wrappedEssence.length * 4.2;

  startY += 4;
  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("4. LOGOGRAM ARCHITECTURE AND REASONING", 20, startY);

  startY += 4.5;
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const wrappedReasoning = doc.splitTextToSize(result.reasoning, 168);
  doc.text(wrappedReasoning, 22, startY);
  startY += wrappedReasoning.length * 4.2;

  if (result.poetic) {
    startY += 6;
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.setDrawColor(goldBronze[0], goldBronze[1], goldBronze[2]);
    doc.setLineWidth(0.25);
    
    const wrappedPoetic = doc.splitTextToSize(`"${result.poetic}"`, 160);
    const boxHeight = wrappedPoetic.length * 4 + 5;
    
    doc.rect(20, startY - 2, 170, boxHeight, "FD");
    
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(goldBronze[0], goldBronze[1], goldBronze[2]);
    doc.text(wrappedPoetic, 25, startY + 2);
    startY += boxHeight;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text("NSIBIDI CODEX AND TRANSLATION COMPILING SYSTEM • PERSISTENT DIVISION RECORD", 105, 276, { align: "center" });
  doc.setFont("times", "bold");
  doc.text("DEVELOPED BY OKAFOR VICTOR (BLACKSUN) • DELTA STATE NIGERIA", 105, 281, { align: "center" });

  doc.save(`nsibidi-alignment-report-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};

// Reassuring ancestral loading lines to rotate through
const LOADING_LINES = [
  "Consulting the collective memory...",
  "Gathering sacred etymological seeds...",
  "Applying West African design structures...",
  "Tracing matching geometry lines...",
  "Weaving personal sigil coordinates...",
  "Blessing the seal under ancient codes..."
];

export default function App() {
  const [nameInput, setNameInput] = useState("");
  const [activeName, setActiveName] = useState("BLACKSUN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OracleResult | null>(DEFAULT_INITIAL_RESULT);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedGlyphs, setHighlightedGlyphs] = useState<string[]>(["Sun-Rays", "Origin-Dot", "Eye"]);
  const [currentLoadingLineIndex, setCurrentLoadingLineIndex] = useState(0);
  const [currentUtcTime, setCurrentUtcTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"transliterator" | "camera" | "oracle" | "codex" | "creator">("transliterator");
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [altarMode, setAltarMode] = useState<"vector" | "ai">("ai");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Hologram cyber particles background animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    // Initialize quantum matrix dots
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? "0, 240, 255" : "255, 0, 171",
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    let mouseCoords = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.x = e.clientX;
      mouseCoords.y = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(5, 4, 10, 0.45)";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle holographic background mesh
      ctx.strokeStyle = "rgba(0, 240, 255, 0.02)";
      ctx.lineWidth = 0.5;
      const step = 65;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap logic
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gravity pull for cursor
        const dx = mouseCoords.x - p.x;
        const dy = mouseCoords.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const intensity = (180 - dist) / 180;
          p.x += (dx / dist) * intensity * 0.65;
          p.y += (dy / dist) * intensity * 0.65;
        }

        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Join nodes within distance
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distanceBetween = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (distanceBetween < 110) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distanceBetween / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getActiveAIImageUrl = () => {
    if (!result || !result.glyphs || result.glyphs.length === 0) {
      return "/src/assets/images/holographic_glyph_knot_1781607571710.jpg";
    }
    const primary = result.glyphs[0];
    if (primary === "Sun-Rays" || primary === "Celestial" || primary === "Eye" || primary === "Origin-Dot" || primary === "Flame" || primary === "Six-Point-Star" || primary === "Crescent") {
      return "/src/assets/images/holographic_glyph_sun_1781607539494.jpg";
    }
    if (primary === "Crown" || primary === "Power" || primary === "Diamond" || primary === "Upward-Triangle" || primary === "Crossroads") {
      return "/src/assets/images/holographic_glyph_crown_1781607555322.jpg";
    }
    return "/src/assets/images/holographic_glyph_knot_1781607571710.jpg";
  };


  // Load archive from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("nsibidi_sigil_archive");
    if (stored) {
      try {
        setArchive(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored archive items:", e);
      }
    } else {
      const demoItems: ArchiveItem[] = [
        {
          name: "BLACKSUN",
          timestamp: "03:44 AM",
          result: DEFAULT_INITIAL_RESULT
        },
        {
          name: "SOMTO",
          timestamp: "02:15 AM",
          result: {
            origin: "Igbo Community Covenant",
            meaning: "Somtochukwu — Praise with Me, Sacred Unity",
            essence: "A visual signpost of human alignment, signifying standard paths crossing to form an unbreakable bond under divine grace.",
            reasoning: "Utilizes the 'Paths-Meeting' coordinate indicating friendship and the 'Knot' glyph signifying unbreakable covenant vows.",
            poetic: "Separate streams flowing into a single golden river of ancestral praise.",
            glyphs: ["Knot", "Relationship"],
            symbolElements: [
              { t: "c", cx: 100, cy: 100, r: 50, fw: 1.5, f: 0 },
              { t: "l", x1: 50, y1: 100, x2: 150, y2: 100, fw: 2 },
              { t: "l", x1: 100, y1: 50, x2: 100, y2: 150, fw: 2 },
              { t: "c", cx: 100, cy: 100, r: 15, fw: 2, f: 0 },
              { t: "d", cx: 70, cy: 70, r: 5 },
              { t: "d", cx: 130, cy: 130, r: 5 }
            ]
          }
        }
      ];
      setArchive(demoItems);
      localStorage.setItem("nsibidi_sigil_archive", JSON.stringify(demoItems));
    }
  }, []);

  // Poll UTC Time updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading line rotation cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingLineIndex((prev) => (prev + 1) % LOADING_LINES.length);
      }, 1600);
    } else {
      setCurrentLoadingLineIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handle manual etymology query submission
  const handleReveal = async (nameToFetch: string) => {
    const targetName = nameToFetch.trim();
    if (!targetName) return;

    setLoading(true);
    setError(null);
    setActiveName(targetName);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });

      if (!response.ok) {
        throw new Error("The network oracle answered with an error state.");
      }

      const data: OracleResult = await response.json();
      setResult(data);
      setHighlightedGlyphs(data.glyphs || []);

      // Append new sigil configuration to local archive securely
      const newItem: ArchiveItem = {
        name: targetName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: data
      };
      setArchive((prev) => {
        const filtered = prev.filter(item => item.name.toUpperCase() !== targetName.toUpperCase());
        const updated = [newItem, ...filtered];
        localStorage.setItem("nsibidi_sigil_archive", JSON.stringify(updated));
        return updated;
      });
      
      // Auto-focus and scroll to results pane
      setTimeout(() => {
        document.getElementById("resultsScrollAnchor")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 250);

    } catch (err: any) {
      console.error(err);
      setError("The oracle is operating at standard local capacity. Running fallback procedural generator.");
    } finally {
      setLoading(false);
    }
  };

  const executeDemo = (demoName: string) => {
    setNameInput(demoName);
    handleReveal(demoName);
  };

  // Safe vector SVG serializing and download trigger
  const downloadSigilAsSvg = () => {
    const svgEl = document.getElementById("sigilSvg");
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);

    // Add XML standards and embed dark background style to make it fully pristine and shareable
    source = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="800" height="800" style="background:#0B0805">
  ${source.replace(/<svg[^>]*>/, "").replace("</svg>", "")}
</svg>`;

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nsibidi-shield-${activeName.toLowerCase().replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Web Share API with rich PNG conversion and multi-platform text/fallback support
  const handleShare = async () => {
    if (!result) return;
    const textSummary = `NSIBIDI ALIGNMENT: ${activeName.toUpperCase()}\n\nTraditional Meaning: ${result.meaning}\n\nEssence: ${result.essence}\n\nExplore African logographic writing traditions using the sacred Nsibidi Codex Display. Configured by Okafor Victor (Blacksun).`;

    setShareStatus("Preparing alignment data...");

    try {
      const svgEl = document.getElementById("sigilSvg");
      if (svgEl && navigator.canShare && navigator.share) {
        setShareStatus("Generating shareable vector frame...");
        const serializer = new XMLSerializer();
        const source = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="800" height="800" style="background:#05040a">
  ${serializer.serializeToString(svgEl).replace(/<svg[^>]*>/, "").replace("</svg>", "")}
</svg>`;

        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const blobUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 800;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              // High fidelity dark background
              ctx.fillStyle = "#05040a";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, 800, 800);

              canvas.toBlob(async (pngBlob) => {
                if (!pngBlob) {
                  // Fallback to text + link
                  await navigator.share({
                    title: `Nsibidi Alignment — ${activeName.toUpperCase()}`,
                    text: textSummary,
                    url: window.location.href,
                  });
                  setShareStatus("Summary shared!");
                  setTimeout(() => setShareStatus(null), 3000);
                  return;
                }

                const file = new File([pngBlob], `nsibidi-shield-${activeName.toLowerCase()}.png`, { type: "image/png" });
                const shareData = {
                  title: `Nsibidi Alignment — ${activeName.toUpperCase()}`,
                  text: textSummary,
                  url: window.location.href,
                  files: [file],
                };

                if (navigator.canShare(shareData)) {
                  await navigator.share(shareData);
                  setShareStatus("Sacred shield shared successfully!");
                } else {
                  await navigator.share({
                    title: `Nsibidi Alignment — ${activeName.toUpperCase()}`,
                    text: textSummary,
                    url: window.location.href,
                  });
                  setShareStatus("Summary shared!");
                }
                setTimeout(() => setShareStatus(null), 3000);
              }, "image/png");
            }
          } catch (err) {
            console.error("Canvas raster failed:", err);
            // Text fallback on capture error
            await navigator.share({
              title: `Nsibidi Alignment — ${activeName.toUpperCase()}`,
              text: textSummary,
              url: window.location.href,
            });
            setShareStatus("Alignment shared!");
            setTimeout(() => setShareStatus(null), 3000);
          } finally {
            URL.revokeObjectURL(blobUrl);
          }
        };
        img.src = blobUrl;
      } else if (navigator.share) {
        // Direct text sharing if file share canShare is false or SVG isn't found
        await navigator.share({
          title: `Nsibidi Alignment — ${activeName.toUpperCase()}`,
          text: textSummary,
          url: window.location.href,
        });
        setShareStatus("Details shared!");
        setTimeout(() => setShareStatus(null), 3000);
      } else {
        // Desktop clipboard copy fallback
        await navigator.clipboard.writeText(textSummary + "\n\nConnection URL: " + window.location.href);
        setShareStatus("Copied to Clipboard!");
        setTimeout(() => setShareStatus(null), 3000);
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      setShareStatus("Share canceled");
      setTimeout(() => setShareStatus(null), 2500);
    }
  };

  // Tactile click handler: scroll smoothly to highlighted dictionary cards
  const scrollToGlyph = (glyphId: string) => {
    setActiveCategory("All");
    setSearchQuery("");
    
    setTimeout(() => {
      const element = document.getElementById(`glyph-card-${glyphId}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, 120);
  };

  // Filter 30 Glyph Codex
  const filteredGlyphs = GLYPHS.filter((glyph) => {
    const catMatch = activeCategory === "All" || glyph.cat === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      glyph.name.toLowerCase().includes(searchLower) ||
      glyph.local.toLowerCase().includes(searchLower) ||
      glyph.meaning.toLowerCase().includes(searchLower);

    return catMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#05040a] text-white relative overflow-hidden font-sans select-none hologram-mesh hologram-scanline pb-20">
      
      {/* Interactive Canvas Star/Particle Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-70" />

      {/* Cybernetic Laser Flares */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyber-blue/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyber-magenta/15 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-45 left-1/4 w-[600px] h-[600px] bg-cyber-violet/10 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* Immersive Cybernetic Top Dashboard Header Banner */}
      <nav className="border-b border-cyber-blue/20 bg-black/60 backdrop-blur-md py-4 px-6 relative z-10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <p className="font-mono text-[11px] uppercase tracking-[4px] text-cyber-blue font-semibold">
              Nsibidi Codex Engine v3.5
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-ash/90">
            <div className="flex items-center gap-2 border border-cyber-blue/10 px-2.5 py-1 rounded bg-[#010915]/40">
              <span className="text-cyber-magenta">COORDINATES:</span>
              <span className="text-white">Active Grid F30</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyber-blue" />
              <span>{currentUtcTime || "ONLINE CHRONO"}</span>
            </div>
            <span className="text-cyber-blue/30 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <Globe2 className="w-3.5 h-3.5 text-cyber-magenta" />
              <span className="font-semibold text-white tracking-widest uppercase">HyperLink Connect</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* Brand Header Showcase featuring the stunning 3D liquid metal AI logo */}
        <header className="mb-12 glass-card border border-cyber-blue/20 p-6 md:p-8 rounded-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)]">
          {/* Cyber scanlines overlay on header */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Liquid metal 3D animated morph avatar center */}
            <div className="relative w-22 h-22 md:w-26 md:h-26 rounded-2xl overflow-hidden shrink-0 border-2 border-cyber-blue/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-gradient-to-br from-[#0c051a] to-[#250055] group cursor-pointer transition-transform duration-300 hover:scale-105">
              <img
                src="/src/assets/images/logo_liquid_metal_1781607523361.jpg"
                alt="AI 3D Liquid Metal morphing logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-115 group-hover:rotate-6 select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_4%,rgba(0,240,255,0.15))]" />
            </div>

            <div className="text-center md:text-left">
              <p className="font-mono text-[10px] uppercase tracking-[6px] text-cyber-magenta mb-2 font-bold animate-pulse">
                HOLOGRAPHIC TRANSLITERATION INTERFACE
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-[3px] leading-tight">
                NSIBIDI <span className="bg-gradient-to-r from-cyber-blue to-cyber-magenta bg-clip-text text-transparent font-light">CODEX DISPLAY</span>
              </h1>
              <p className="text-xs text-ash mt-2 max-w-xl font-sans leading-relaxed">
                Experience Africa's oldest secretive logographic writing tradition projected into a futuristic interactive console. Decode names and download vector shields.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="border-2 border-cyber-magenta bg-cyber-magenta/10 hover:bg-cyber-magenta text-white font-cinzel text-xs tracking-widest uppercase px-6 py-4 transition-all duration-300 rounded-lg cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_15px_rgba(255,0,85,0.2)] hover:shadow-[0_0_25px_rgba(255,0,85,0.45)] hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-cyber-blue" />
              Ritual Archive ({archive.length})
            </button>
          </div>
        </header>

        {/* Interactive Cyber-Segmented Navigation Control Bar */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12 border-b border-cyber-blue/15 pb-8 relative z-20 select-none">
          {[
            { id: "transliterator", label: "Oracle Console", icon: Cpu },
            { id: "camera", label: "AR Scope View", icon: Camera },
            { id: "oracle", label: "Oracle Dynamics", icon: Compass },
            { id: "codex", label: "Glyph Codex", icon: BookOpen },
            { id: "creator", label: "Creator (Blacksun)", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3.5 text-[10px] uppercase font-mono tracking-[3px] font-bold rounded-lg flex items-center gap-2.5 border cursor-pointer transition-all duration-300 select-none active:scale-95
                  ${
                    isSelected
                      ? "bg-cyber-blue text-black border-cyber-blue hover:bg-cyber-magenta hover:border-cyber-magenta hover:text-white shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                      : "border-cyber-blue/20 bg-black/40 hover:border-cyber-blue hover:text-cyber-blue text-ash"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Views Viewport utilizing AnimatePresence for cinematic cyber transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full relative z-10"
          >
            {activeTab === "transliterator" && (
              <>
                {/* Main Immersive Split Workspace Container */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
          
          {/* Left Side: The Initiate/Translation Control Center */}
          <div className="lg:col-span-4 glass-card border border-cyber-blue/30 p-8 flex flex-col justify-between rounded-xl relative group hover:border-cyber-blue/60 transition-colors shadow-2xl overflow-hidden">
            {/* Animated glowing mesh line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyber-blue via-cyber-magenta to-cyber-blue animate-pulse" />
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-cyber-blue mb-3 font-semibold font-mono">
                  Initiate Transliteration
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReveal(nameInput)}
                    placeholder="ENTER NAME TO ENCODE..."
                    className="w-full bg-[#05040a]/90 border border-cyber-blue/40 p-4 pr-24 text-lg tracking-[0.15em] uppercase font-mono text-white focus:outline-none focus:border-cyber-magenta focus:ring-1 focus:ring-cyber-magenta placeholder:text-white/20 outline-none transition-all rounded-lg text-cyber-blue font-bold shadow-inner"
                    maxLength={32}
                    disabled={loading}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => handleReveal(nameInput)}
                      disabled={loading || !nameInput.trim()}
                      className="bg-cyber-blue hover:bg-cyber-magenta text-black hover:text-white px-4 py-2.5 font-cinzel font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded-md shadow-md hover:scale-105 active:scale-95"
                    >
                      {loading ? "..." : "DECODE"}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] italic text-[#f5f0e1]/55 leading-relaxed mt-3 font-sans">
                  Each key sequence is recursively mapped into Niger Delta symbolic subgrids, generating a custom vector sigil alignment.
                </p>
              </div>

              {/* Incarnation Shortcuts list */}
              <div className="border-t border-cyber-blue/15 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-cyber-magenta font-mono mb-4 font-semibold">
                  Core Architectural Alignments
                </h3>
                <div className="space-y-3">
                  {[
                    { display: "BLACKSUN", desc: "Eclipsed Celestial Sun", icon: "✦" },
                    { display: "SOMTO", desc: "Infinite Communion Loop", icon: "✦" },
                    { display: "VICTOR", desc: "Tally Conqueror Scars", icon: "✦" },
                    { display: "LIGHT", desc: "First Radiance Wisdom", icon: "✦" }
                  ].map((item) => (
                    <div
                      key={item.display}
                      onClick={() => executeDemo(item.display)}
                      className={`flex justify-between items-center text-sm p-3.5 border transition-all duration-300 cursor-pointer rounded-lg select-none hover:-translate-y-0.5
                        ${
                          activeName.toUpperCase() === item.display
                            ? "bg-cyber-magenta/15 border-cyber-magenta text-cyber-magenta font-bold shadow-[0_0_12px_rgba(255,0,85,0.15)] scale-102"
                            : "bg-[#0c0a15]/40 border-cyber-blue/10 hover:border-cyber-blue/40 hover:bg-cyber-blue/5 text-white/90"
                        }`}
                    >
                      <span className="tracking-[0.15em] font-mono flex items-center gap-2">
                        <span className="opacity-70 text-cyber-blue text-xs">{item.icon}</span>
                        {item.display}
                      </span>
                      <span className="text-[9px] font-mono tracking-wider opacity-60 uppercase">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cultural Footers */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 text-[10px] tracking-[0.25em] text-[#d4af37]/45 font-mono font-semibold relative z-10">
              <span>EJAGHAM</span>
              <span>EFIK</span>
              <span>IGBO</span>
            </div>
          </div>

          {/* Right Side: The Altar Panel & Visual Analyzer */}
          <div className="lg:col-span-8 glass-card border border-cyber-blue/30 p-6 md:p-10 flex flex-col justify-between rounded-xl relative overflow-hidden">
            {/* Holographic scanning grids inside Altar card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-blue/[0.02] filter blur-3xl pointer-events-none" />
            
            {/* Minimal corner ornaments */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-blue/30" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-blue/30" />

            {/* Error Overlay / Loading lines */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-6 text-center gap-4"
                >
                  <div className="w-12 h-12 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
                  <motion.p
                    key={currentLoadingLineIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="font-mono text-xs text-cyber-blue uppercase tracking-widest"
                  >
                    {LOADING_LINES[currentLoadingLineIndex]}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Altar Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="resultsScrollAnchor">
              
              {/* Altar Segment 1: The spinning outer gear wrapping the golden sigil or AI 3D Hologram */}
              <div className="md:col-span-6 flex flex-col items-center justify-center relative py-6">
                
                {/* 3D and Vector view switcher */}
                <div className="flex bg-[#070512] border border-cyber-blue/20 rounded-lg p-1 mb-6 text-xs font-mono relative z-10">
                  <button
                    onClick={() => setAltarMode("ai")}
                    className={`px-3 py-1.5 rounded-md transition-all ${altarMode === "ai" ? "bg-cyber-blue text-black font-bold" : "text-ash hover:text-white"}`}
                  >
                    AI 3D HOLOGRAM
                  </button>
                  <button
                    onClick={() => setAltarMode("vector")}
                    className={`px-3 py-1.5 rounded-md transition-all ${altarMode === "vector" ? "bg-cyber-blue text-black font-bold" : "text-ash hover:text-white"}`}
                  >
                    VECTOR TRACE
                  </button>
                </div>

                <div 
                  className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] flex items-center justify-center rounded-xl bg-black/30 border border-cyber-blue/10 backdrop-blur-md overflow-hidden"
                >
                  {/* Decorative Outer Rotation Ring */}
                  <svg className="absolute inset-x-2 inset-y-2 w-[90%] h-[90%] animate-slow-spin text-cyber-blue/20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                  </svg>

                  {/* Dynamic Sigil Inside */}
                  {result && (
                    <div className="w-[180px] h-[180px] md:w-[210px] md:h-[210px] relative z-10 transition-all duration-500 transform hover:scale-105 flex items-center justify-center">
                      {altarMode === "ai" ? (
                        <div className="relative w-44 h-44 rounded-xl overflow-hidden border-2 border-cyber-magenta/50 shadow-[0_0_25px_rgba(255,0,85,0.4)] bg-black/70 flex items-center justify-center">
                          {/* Low opacity background holographic projection of texture mapping */}
                          <img
                            src={getActiveAIImageUrl()}
                            alt="Quantum AI 3D Sigil representation"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-20 transition-opacity duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                          
                          {/* Complete 3D hovering image of the symbol/glyph */}
                          <div className="relative z-10 w-36 h-36 flex items-center justify-center p-4 animate-float-glyph filter drop-shadow-[0_0_15px_rgba(0,240,255,0.9)]">
                            <SigilRenderer name={activeName} elements={result.symbolElements} className="w-full h-full" />
                          </div>
                          
                          {/* Scanning energy sweep line */}
                          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-magenta to-transparent animate-bounce opacity-40 pointer-events-none top-1/2" />
                        </div>
                      ) : (
                        <SigilRenderer name={activeName} elements={result.symbolElements} />
                      )}
                    </div>
                  )}
                </div>

                <div className="text-center mt-6">
                  <div className="text-[9px] tracking-[0.4em] text-cyber-blue font-mono uppercase mb-1">QUANTUM ALIGNMENT DECRYPTED</div>
                  <div className="text-xl md:text-2xl tracking-[0.4em] font-bold bg-gradient-to-r from-cyber-blue to-cyber-magenta bg-clip-text text-transparent uppercase font-cinzel">
                    {activeName}
                  </div>
                </div>
              </div>

              {/* Altar Segment 2: Etymological analysis properties */}
              <div className="md:col-span-6 flex flex-col justify-between h-full space-y-6">
                
                {result && (
                  <>
                    <div>
                      <div className="text-cyber-blue text-[10px] uppercase tracking-widest mb-3 border-b border-cyber-blue/20 pb-2 inline-block font-mono font-semibold">
                        🧬 Codex Alignment Telemetry
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-[9px] text-cyber-magenta tracking-widest font-mono uppercase mb-1">Conceptual Root</div>
                          <div className="text-base text-white font-mono font-bold">{result.origin}</div>
                        </div>

                        <div>
                          <div className="text-[9px] text-cyber-magenta tracking-widest font-mono uppercase mb-0.5">Meaning</div>
                          <div className="text-sm text-white/95 leading-snug font-serif italic">
                            {result.meaning}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] text-cyber-magenta tracking-widest font-mono uppercase mb-0.5">Spiritual Essence</div>
                          <div className="text-xs text-ash/90 leading-relaxed font-sans mt-0.5">
                            {result.essence}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] text-cyber-magenta tracking-widest font-mono uppercase mb-0.5">Symbolic Structure</div>
                          <div className="text-xs text-ash leading-relaxed font-sans opacity-75">
                            {result.reasoning}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Poetic Quote summary display */}
                    {result.poetic && (
                      <div className="border-l-2 border-cyber-magenta pl-4 py-2 bg-cyber-magenta/5 rounded-r">
                        <p className="font-serif text-sm text-cyber-magenta italic leading-relaxed">
                          “{result.poetic}”
                        </p>
                      </div>
                    )}

                    {/* Trigger buttons & corresponding list links */}
                    <div className="pt-2">
                      <div className="flex flex-col xl:flex-row gap-3">
                        <button
                          onClick={downloadSigilAsSvg}
                          className="border-2 border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black px-4 py-3 text-[10px] uppercase tracking-widest transition-all rounded-lg font-cinzel cursor-pointer font-bold flex-1 text-center shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:scale-102"
                        >
                          {copied ? "Saved Vector SVG!" : "Download Vector SVG"}
                        </button>
                        
                        <button
                          onClick={() => generateOracleReportPdf(activeName, result)}
                          className="border-2 border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta hover:text-white px-4 py-3 text-[10px] uppercase tracking-widest transition-all rounded-lg font-cinzel cursor-pointer font-bold flex-1 text-center shadow-[0_0_10px_rgba(255,0,85,0.15)] hover:shadow-[0_0_20px_rgba(255,0,85,0.45)] hover:scale-102 animate-pulse"
                        >
                          Generate Oracle Report (PDF)
                        </button>

                        <div className="flex gap-1">
                          {result.glyphs && result.glyphs.map((gId) => (
                            <button
                              key={gId}
                              onClick={() => scrollToGlyph(gId)}
                              title={`Scroll to ${gId} inside dictionary`}
                              className="px-2.5 py-2 bg-black/60 border border-cyber-blue/30 hover:border-cyber-magenta text-cyber-blue hover:text-cyber-magenta text-[9px] uppercase tracking-wider font-mono rounded-lg transition-colors cursor-pointer"
                            >
                              {gId}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>
        </section>
              </>
            )}

            {activeTab === "camera" && (
              <div className="space-y-4 mb-20 w-full animate-fade-in select-none">
                <div className="border-b border-cyber-blue/25 pb-4 mb-6">
                  <h2 className="font-display text-2xl font-black uppercase tracking-[3px] text-white flex items-center gap-2">
                    <Camera className="w-6 h-6 text-cyber-blue" />
                    AR SCOPE VIEW
                  </h2>
                  <p className="text-xs text-ash mt-1 leading-relaxed">
                    Overlay and capture your custom generated {activeName.toUpperCase()} vector sigil onto your real-world environment feed.
                  </p>
                </div>
                {result && <NsibidiArCamera currentSigilName={activeName} result={result} />}
              </div>
            )}

            {activeTab === "oracle" && (
              <div className="space-y-4 mb-20 w-full select-none">
                <div className="border-b border-[#c78f3e]/25 pb-4 mb-6">
                  <h2 className="font-display text-2xl font-black uppercase tracking-[3px] text-white flex items-center gap-2">
                    <Compass className="w-6 h-6 text-[#c78f3e]" />
                    ORACLE DYNAMICS
                  </h2>
                  <p className="text-xs text-ash mt-1 leading-relaxed">
                    Sync with Efik and Igbo lunar cycles, decode daily destiny lots, and flip traditional 3D Nsibidi tarot arche codes.
                  </p>
                </div>
                <NsibidiOracleCalendar />
              </div>
            )}

            {activeTab === "codex" && (
              <section className="pt-2 mb-20 w-full select-none animate-fade-in" id="codexListSection">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display text-2xl font-black uppercase tracking-[3px] text-white">
                🗂️ THE GLYPH CODEX
              </h2>
              <p className="text-xs text-ash mt-1 leading-relaxed">
                Explore thirty living logographic ideograms, organized by traditional domains of significance. Use the switcher inside cards to trace vector lines or view AI 3D Holograms.
              </p>
            </div>

            {/* Keyword Search field */}
            <div className="relative w-full max-w-xs shrink-0 bg-black/60 border border-cyber-blue/20 rounded-lg group hover:border-cyber-blue/60 transition-colors">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-blue/70 group-hover:text-cyber-blue transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH TRANSMISSION CODEX..."
                className="w-full bg-transparent pl-11 pr-4 py-3 font-mono text-xs text-white tracking-widest outline-none transition-colors rounded-lg placeholder:text-white/20 uppercase"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {CATEGORIES.map((catName) => (
              <button
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`py-2 px-5 border text-[10px] tracking-widest font-mono rounded-lg transition-all uppercase cursor-pointer select-none font-bold
                  ${
                    activeCategory === catName
                      ? "bg-cyber-blue border-cyber-blue text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                      : "border-cyber-blue/25 hover:border-cyber-blue text-ash hover:text-white bg-black/40"
                  }`}
              >
                {catName}
              </button>
            ))}
          </div>

          {/* Dictionary card layout grid */}
          {filteredGlyphs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-ochre/15 rounded-xs">
              <AlertCircle className="w-8 h-8 text-ash/40 mx-auto mb-4" />
              <p className="font-serif text-sm text-ash italic">
                No matching logograms found in this branch of the codex.
              </p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredGlyphs.map((glyph) => (
                <div key={glyph.id} id={`glyph-card-${glyph.id}`}>
                  <GlyphCard
                    glyph={glyph}
                    isHighlighted={highlightedGlyphs.includes(glyph.id)}
                    onClick={() => {
                      // Clicking on a card toggles or triggers highlight status
                      if (highlightedGlyphs.includes(glyph.id)) {
                        setHighlightedGlyphs((prev) => prev.filter((id) => id !== glyph.id));
                      } else {
                        setHighlightedGlyphs((prev) => [...prev, glyph.id]);
                      }
                    }}
                  />
                </div>
              ))}
            </motion.div>
          )}

        </section>
            )}

            {activeTab === "creator" && (
              <section className="glass-card border border-cyber-blue/20 p-8 rounded-xl relative overflow-hidden mb-10 select-none animate-fade-in text-left">
                {/* Cyber scans backgrounds for Okafor page */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-blue/[0.015] blur-3xl pointer-events-none" />
                
                <h2 className="font-display text-2xl font-black uppercase tracking-[3px] text-white border-b border-cyber-blue/15 pb-4 mb-8 flex items-center gap-2">
                  <User className="w-6 h-6 text-cyber-blue" />
                  CREATOR PROFILE
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Left Column: Creator Identity Showcase */}
                  <div className="lg:col-span-4 flex flex-col items-center text-center p-6 border border-cyber-blue/15 bg-black/45 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyber-blue to-cyber-magenta" />
                    
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyber-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-4">
                      <img 
                        src="/src/assets/images/logo_liquid_metal_1781607523361.jpg" 
                        alt="Okafor Victor" 
                        className="w-full h-full object-cover scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <h3 className="font-mono text-lg font-black text-white tracking-widest uppercase">
                      OKAFOR VICTOR
                    </h3>
                    <p className="font-mono text-[10px] text-cyber-magenta uppercase tracking-[4px] font-bold mt-1">
                      Alias: Blacksun
                    </p>

                    <div className="my-5 w-full border-t border-cyber-blue/10 pt-4 space-y-3.5 text-left font-mono text-[10.5px]">
                      <div className="flex items-center gap-2.5 text-ash">
                        <MapPin className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
                        <span>Coordinates: Delta State, Nigeria</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-ash">
                        <Mail className="w-3.5 h-3.5 text-cyber-magenta shrink-0 mt-0.5" />
                        <div className="break-all space-y-0.5">
                          <p>Victor4all2015@gmail.com</p>
                          <p>Blaksun8888@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-ash">
                        <Phone className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
                        <span>+234 812 291 1210</span>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/2348122911210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25d366]/10 hover:bg-[#25d366] text-white hover:text-black border border-[#25d366]/40 hover:border-[#25d366] py-3 text-[10px] uppercase font-mono tracking-widest font-bold transition-all duration-300 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(37,211,102,0.15)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                    >
                      <Phone className="w-4 h-4" />
                      Connect on WhatsApp
                    </a>
                  </div>

                  {/* Right Column: Creative Bio & Architectural Vibe */}
                  <div className="lg:col-span-8 space-y-6 text-left">
                    <div className="glass-card border border-cyber-blue/10 bg-[#07050f]/60 p-6 rounded-lg">
                      <h4 className="font-mono text-xs uppercase tracking-[3px] text-cyber-blue font-bold mb-3">
                        About Me
                      </h4>
                      <p className="font-sans text-xs text-ash leading-relaxed mb-4">
                        I am <strong className="text-white">OKAFOR VICTOR</strong>, Alias <strong className="text-cyber-magenta font-mono">Blacksun</strong>, a creative visionary dedicated to blending ancient wisdom with futuristic design. My work explores the deep symbolism of Igbo Nsibidi knowledge, weaving it into modern digital experiences that feel both sacred and immersive.
                      </p>
                      <p className="font-sans text-xs text-ash leading-relaxed">
                        From interactive divination calendars to holographic displays, every project I create is not just design, but a living oracle — a bridge between past and future. Tradition meets science in a synthesis of heritage and futuristic UI mechanics.
                      </p>
                    </div>

                    <div className="glass-card border border-cyber-blue/15 bg-black/40 p-6 rounded-lg relative overflow-hidden">
                      <h4 className="font-mono text-xs uppercase tracking-[3px] text-cyber-magenta font-bold mb-3">
                        Creative Alignment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-cyber-blue/5 bg-black/30 p-4 rounded">
                          <h5 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold mb-1">IMMEDIATE INTUITION</h5>
                          <p className="text-[10px] text-ash/90 leading-relaxed font-sans mt-1">
                            Blending Efik, Ejagham, and Igbo logographic heritage with generative procedural web layouts.
                          </p>
                        </div>
                        <div className="border border-cyber-blue/5 bg-black/30 p-4 rounded">
                          <h5 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold mb-1">FUTURE RETROFITTING</h5>
                          <p className="text-[10px] text-ash/90 leading-relaxed font-sans mt-1">
                            Deploying real-time WebGL, matrix shaders, and advanced cybernetic vector fields for cultural preservation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Footer */}
      <footer className="border-t border-cyber-blue/15 py-12 bg-black/60 text-center relative z-10 select-none">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-sans text-xs leading-relaxed text-ash/80">
            <strong className="text-cyber-blue">Nsibidi</strong> is one of the African continent's oldest indigenous script systems, originating as a secretive, conceptual visual medium among the Ejagham and Efik peoples, later expanding through Igbo guilds. Each glyph expresses a holistic idea rather than sound units. The Quantum Name Oracle uses composite geometries aligned with these classic values to synthesize a custom visual signifier for you.
          </p>
          <div className="mt-8 font-mono text-[10px] tracking-[6px] text-cyber-magenta uppercase opacity-75 font-semibold">
            ✦ ORU OJUKWU · THE WORK OF THE HAND · MATRIX ✦
          </div>
        </div>
      </footer>

      {/* The Sliding Ritual Archive Side Drawer */}
      <AnimatePresence>
        {isArchiveOpen && (
          <>
            {/* Dark interactive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sliding Drawer Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080510]/95 backdrop-blur-xl border-l border-cyber-blue/20 z-50 flex flex-col p-6 shadow-2xl relative select-none"
            >
              {/* Mythical Corner Ornaments inside drawer */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-blue/30" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-blue/30 pointer-events-none" />

              <div className="flex justify-between items-center border-b border-cyber-blue/15 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-lg font-black text-white uppercase tracking-widest">Ritual Archive</h2>
                  <p className="text-[9px] font-mono uppercase tracking-[2px] text-cyber-magenta mt-0.5">Saved Sacred Alignments</p>
                </div>
                <button
                  onClick={() => setIsArchiveOpen(false)}
                  className="text-ash hover:text-white font-mono text-xs border border-cyber-blue/25 hover:border-cyber-magenta px-3 py-1.5 transition-all rounded-lg cursor-pointer bg-black/60 active:scale-95 font-semibold"
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Archive Item list container (custom high-performance scroll) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {archive.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-52 text-center text-ash/80 italic border border-dashed border-cyber-blue/20 p-6 rounded-lg bg-black/40">
                    <BookOpen className="w-8 h-8 opacity-45 mb-3 text-cyber-blue" />
                    No sigils saved in the present epoch yet.<br />
                    Generate name translations to immortalize them in your archive.
                  </div>
                ) : (
                  archive.map((item, idx) => {
                    const miniResult = item.result;
                    return (
                      <div
                        key={`${item.name}-${miniResult.origin}-${idx}`}
                        className="bg-[#05040a]/80 border border-cyber-blue/15 p-4 rounded-lg flex flex-col gap-3 hover:border-cyber-magenta/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Mini dynamic SVG Preview */}
                          <div className="w-16 h-16 bg-[#030206] border border-cyber-blue/20 flex items-center justify-center shrink-0 rounded-lg">
                            <SigilRenderer name={item.name} elements={miniResult.symbolElements} className="w-14 h-14" />
                          </div>

                          <div className="flex-1 select-none min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white tracking-widest uppercase truncate">{item.name}</span>
                              <span className="text-[8px] text-cyber-blue font-mono tracking-tighter shrink-0">{item.timestamp}</span>
                            </div>
                            <p className="text-[9px] text-cyber-magenta truncate uppercase font-mono tracking-wider mt-1">{miniResult.origin || "Traditional Lore"}</p>
                            <p className="text-[11px] text-ash/90 italic line-clamp-2 leading-relaxed mt-1 font-serif">{miniResult.meaning}</p>
                          </div>
                        </div>

                        {/* Interactive trigger tools */}
                        <div className="flex gap-2 border-t border-white/5 pt-2 mt-1">
                          <button
                            onClick={() => {
                              setActiveName(item.name);
                              setNameInput(item.name);
                              setResult(miniResult);
                              setHighlightedGlyphs(miniResult.glyphs || []);
                              setIsArchiveOpen(false);
                              
                              setTimeout(() => {
                                document.getElementById("resultsScrollAnchor")?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start"
                                });
                              }, 250);
                            }}
                            className="flex-1 bg-cyber-blue hover:bg-cyber-magenta text-black hover:text-white border border-cyber-blue/30 text-[9px] font-mono tracking-widest uppercase py-2 px-3 transition-all rounded-lg cursor-pointer text-center font-bold"
                          >
                            Load Altar
                          </button>
                          
                          <button
                            onClick={() => downloadArbitrarySigil(item.name, miniResult.symbolElements)}
                            className="border border-cyber-blue/20 hover:border-cyber-magenta text-ash hover:text-white text-[9px] font-mono tracking-widest uppercase py-2 px-3 transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 bg-black/40"
                          >
                            <Download className="w-3 h-3 text-cyber-blue" />
                            SVG
                          </button>

                          <button
                            onClick={() => {
                              const remaining = archive.filter((_, i) => i !== idx);
                              setArchive(remaining);
                              localStorage.setItem("nsibidi_sigil_archive", JSON.stringify(remaining));
                            }}
                            title="Purge record"
                            className="border border-red-950/40 hover:border-red-500/80 text-red-400 hover:text-red-200 text-xs px-2.5 py-1 rounded-lg cursor-pointer font-bold transition-colors bg-red-950/10 active:scale-95"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Clear Ritual History tool */}
              {archive.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm("Do you want to clear your complete ritual archive? This action cannot be undone.")) {
                        setArchive([]);
                        localStorage.removeItem("nsibidi_sigil_archive");
                      }
                    }}
                    className="text-[9px] tracking-[2px] font-mono uppercase text-red-400/80 hover:text-red-300 transition-colors underline cursor-pointer"
                  >
                    Clear Entire Archive
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
