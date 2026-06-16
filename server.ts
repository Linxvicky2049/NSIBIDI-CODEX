import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Ensure standard port binding
const PORT = 3000;

// Initialize Google GenAI securely and lazily
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini GenAI initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini GenAI:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found in environment variables. Falling back to deterministic procedural generator.");
}

// Structured schema for Nsibidi Translations
const nsibidiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    origin: {
      type: Type.STRING,
      description: "Brief linguistic or cultural origin (e.g., Igbo, Ejagham, Anglo-Latin translated conceptually, etc.)",
    },
    meaning: {
      type: Type.STRING,
      description: "Literal translation or direct concept behind the name",
    },
    essence: {
      type: Type.STRING,
      description: "Deeper spiritual, philosophical, or historic meaning in 1-2 powerful sentences.",
    },
    reasoning: {
      type: Type.STRING,
      description: "The conceptual rationale explaining why the chosen codex glyphs and geometric forms match this name, in 1-2 details.",
    },
    poetic: {
      type: Type.STRING,
      description: "A single, highly dramatic and beautiful poetic sentence summarizing the name's spirit.",
    },
    glyphs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 2 to 3 glyph IDs chosen strictly from the authorized list of Nsibidi codex glyphs.",
    },
    symbolElements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          t: {
            type: Type.STRING,
            description: "Primitive type: 'c' (circle), 'e' (ellipse), 'l' (line), 'd' (filled dot), 'p' (polygon), 'pl' (polyline), 'a' (arc), 'pa' (path).",
          },
          cx: { type: Type.NUMBER, description: "Center X (range: 20 to 180, 100 is middle)" },
          cy: { type: Type.NUMBER, description: "Center Y (range: 20 to 180, 100 is middle)" },
          r: { type: Type.NUMBER, description: "Radius for circles/arcs (range: 5 to 75)" },
          rx: { type: Type.NUMBER, description: "X-radius for ellipse" },
          ry: { type: Type.NUMBER, description: "Y-radius for ellipse" },
          x1: { type: Type.NUMBER, description: "Start X for lines" },
          y1: { type: Type.NUMBER, description: "Start Y for lines" },
          x2: { type: Type.NUMBER, description: "End X for lines" },
          y2: { type: Type.NUMBER, description: "End Y for lines" },
          a1: { type: Type.NUMBER, description: "Start angle in degrees (arcs)" },
          a2: { type: Type.NUMBER, description: "End angle in degrees (arcs)" },
          pts: { type: Type.STRING, description: "Space coordinates 'x1,y1 x2,y2 x3,y3' for polygon/polyline" },
          d: { type: Type.STRING, description: "SVG path commands (M, L, C, Q, Z) with no quotes inside" },
          fw: { type: Type.NUMBER, description: "Stroke width (1 to 3)" },
          f: { type: Type.INTEGER, description: "Fill flag: 1 = fill with gold, 0 = outline-only" },
        },
        required: ["t"],
      },
      description: "List of 8-14 geometric primitives that compose into a gorgeous, balanced, cohesive Nsibidi tribal sigil.",
    },
  },
  required: ["origin", "meaning", "essence", "reasoning", "poetic", "glyphs", "symbolElements"],
};

// Handcrafted templates for the four core names requested by the user
const HANDCRAFTED_CORE: { [key: string]: any } = {
  blacksun: {
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
  },
  somto: {
    origin: "Igbo (Southeastern Nigeria)",
    meaning: "Somtochukwu — 'Praise / Join me to praise the Divine Creator'",
    essence: "A name of harmony and deep communal worship, requesting all people to join together to praise the ultimate source of life.",
    reasoning: "Utilizes the 'Interlocked-Loops' representing love and relational peace, paired with 'Knot-Bond' for agreements, and 'Three-Dots' for sacred spiritual completeness.",
    poetic: "Two sacred paths that weave an infinite loop, anchored by the ancient knot of peaceful gathering.",
    glyphs: ["Interlocked-Loops", "Three-Dots", "Knot-Bond"],
    symbolElements: [
      { t: "c", cx: 100, cy: 100, r: 60, fw: 1, f: 0 },
      { t: "pa", d: "M 60 100 C 60 65, 100 58, 100 100 C 100 58, 140 65, 140 100 C 140 135, 100 142, 100 100 C 100 142, 60 135, 60 100 Z", fw: 2.2, f: 0 },
      { t: "l", x1: 40, y1: 100, x2: 160, y2: 100, fw: 1 },
      { t: "d", cx: 100, cy: 100, r: 6 },
      { t: "d", cx: 80, cy: 75, r: 3 },
      { t: "d", cx: 100, cy: 65, r: 3 },
      { t: "d", cx: 120, cy: 75, r: 3 },
      { t: "d", cx: 80, cy: 125, r: 3 },
      { t: "d", cx: 100, cy: 135, r: 3 },
      { t: "d", cx: 120, cy: 125, r: 3 },
      { t: "c", cx: 100, cy: 100, r: 24, fw: 1.2, f: 0 }
    ]
  },
  victor: {
    origin: "Latin origin, conceptually translated to Igbo (Onye Mmeri)",
    meaning: "Onye Mmeri — The Winner, Conqueror, or Crowned Spearman",
    essence: "A direct emblem of victory, resilience, and unshakeable mastery, signifying one who has walked through battles and emerged crowned with power.",
    reasoning: "Employs the 'Crown' for authorized royal status, 'Parallel-Cuts' as the ancient Nsibidi indicator of battle scars and tallies of success, and 'Arrow-Up' for upward destiny.",
    poetic: "The spear of purpose stands tall on conquered ground, blessed by the scars of victory and a sovereign crown.",
    glyphs: ["Crown", "Parallel-Cuts", "Arrow-Up"],
    symbolElements: [
      { t: "l", x1: 30, y1: 150, x2: 170, y2: 150, fw: 2.5 },
      { t: "l", x1: 100, y1: 25, x2: 100, y2: 150, fw: 2.5 },
      { t: "p", pts: "100,10 108,30 100,24 92,30", fw: 2, f: 1 },
      { t: "pl", pts: "60,95 100,60 140,95", fw: 2 },
      { t: "c", cx: 60, cy: 95, r: 4.5, fw: 1.5, f: 1 },
      { t: "c", cx: 140, cy: 95, r: 4.5, fw: 1.5, f: 1 },
      { t: "l", x1: 70, y1: 112, x2: 70, y2: 138, fw: 1.5 },
      { t: "l", x1: 80, y1: 108, x2: 80, y2: 134, fw: 1.5 },
      { t: "l", x1: 62, y1: 121, x2: 88, y2: 121, fw: 1.5 },
      { t: "l", x1: 130, y1: 112, x2: 130, y2: 138, fw: 1.5 },
      { t: "l", x1: 120, y1: 108, x2: 120, y2: 134, fw: 1.5 },
      { t: "l", x1: 112, y1: 121, x2: 138, y2: 121, fw: 1.5 },
      { t: "c", cx: 100, cy: 50, r: 12, fw: 1.2, f: 0 }
    ]
  },
  light: {
    origin: "Yoruba & Igbo Philosophical Metaphor (Ìmọlẹ / Ihe Ọcha)",
    meaning: "Ìmọlẹ / Ihe Ọcha — Radiance, Illumination, First Source",
    essence: "The original cosmic energy of clarity, separating existence from void. It is the wisdom that illuminates the spirit and guides travelers home safely.",
    reasoning: "Forged from 'Sun-Rays' for total daytime clarity, 'Six-Point-Star' for night-sky stellar guidance, and 'Flame' for purifying inner truth.",
    poetic: "A golden solar fire spreading into sixteen infinite branches, driving all shadows from the corners of the soul.",
    glyphs: ["Sun-Rays", "Six-Point-Star", "Flame"],
    symbolElements: [
      { t: "c", cx: 100, cy: 100, r: 35, fw: 2, f: 0 },
      { t: "c", cx: 100, cy: 100, r: 22, fw: 1.2, f: 0 },
      { t: "c", cx: 100, cy: 100, r: 10, fw: 1.5, f: 0 },
      { t: "d", cx: 100, cy: 100, r: 4 },
      { t: "l", x1: 100, y1: 15, x2: 100, y2: 52, fw: 2.2 },
      { t: "l", x1: 100, y1: 148, x2: 100, y2: 185, fw: 2.2 },
      { t: "l", x1: 15, y1: 100, x2: 52, y2: 100, fw: 2.2 },
      { t: "l", x1: 148, y1: 100, x2: 185, y2: 100, fw: 2.2 },
      { t: "l", x1: 40, y1: 40, x2: 66, y2: 66, fw: 1.8 },
      { t: "l", x1: 134, y1: 134, x2: 160, y2: 160, fw: 1.8 },
      { t: "l", x1: 160, y1: 40, x2: 134, y2: 66, fw: 1.8 },
      { t: "l", x1: 40, y1: 160, x2: 66, y2: 134, fw: 1.8 }
    ]
  }
};

// Generates a fully coherent procedural name translation fallback
function generateDeterministicFallback(name: string): any {
  const norm = name.trim().toLowerCase();
  
  // Return pre-crafted profiles immediately if matching key
  if (HANDCRAFTED_CORE[norm]) {
    return HANDCRAFTED_CORE[norm];
  }

  // Linear feedback generator to parse string into pseudo-numbers
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = (hash * 37 + norm.charCodeAt(i)) & 0xffffffff;
  }
  hash = Math.abs(hash);

  const roll = (max: number, offset = 0) => (hash + offset) % max;

  // Set of culturally diverse and profound spiritual descriptions
  const origins = [
    "Igbo (Niger Delta Territory)",
    "Ejagham Ancestral Covenant",
    "Efik / Ibibio Traditional",
    "African-Diasporic Spiritual Path",
    "Conceptual Translation to Nsibidi",
    "West African Cross-Cultural Translation"
  ];

  const profiles = [
    {
      meaning: "The Steadfast Walker (Onye Ije)",
      essence: "One who journeys through physical and spiritual fields with protective ancestral guidance. Their steps leave markings of peace and wisdom for those who follow.",
      reasoning: "Features the 'Footprints' glyph recording ancestral guidance, linked with 'Spiral' to show outward lifecycle growth, and 'Crossroads' for perfect choices.",
      glyphs: ["Footprints", "Spiral", "Crossroads"]
    },
    {
      meaning: "The Carrier of Harmony (Ụzọ Udo)",
      essence: "A life destined to unite separate halves into a coherent whole. They bind community boundaries with bonds of trust and eternal love.",
      reasoning: "Formed of 'Interlocked-Loops' representing love and relational peace, matched with 'Concentric-Circles' to highlight community belonging.",
      glyphs: ["Interlocked-Loops", "Concentric-Circles", "Knot-Bond"]
    },
    {
      meaning: "The Fiery Spirit (Ọkụ Ahụ')",
      essence: "Purified by fire and armed with unmeasurable willpower. They represent an active light that consumes stagnation and ignites purpose in others.",
      reasoning: "Fuses the 'Flame' of spiritual purification with the 'Upward-Triangle' of active male strength and 'Arrow-Up' for rising authority.",
      glyphs: ["Flame", "Upward-Triangle", "Arrow-Up"]
    },
    {
      meaning: "The Wise Healer (Anya Eke)",
      essence: "A keeper of ancestral secrets, deep medicine, and spiritual agility. Like the serpent, they shed old skins to embrace sacred truths and continuous self-regeneration.",
      reasoning: "Employs the 'Serpent' signifying ancient transformational wisdom, aligned with 'Eye' for all-seeing spiritual awareness and divine witness.",
      glyphs: ["Serpent", "Eye", "Double-Spiral"]
    },
    {
      meaning: "The Overflowing Gift (Miri Abụọ)",
      essence: "A life of continuous flow and watery fertility, representing pure abundance and natural adaptability. They wash away obstacles and bring growth to thirsty lands.",
      reasoning: "Drawn using the 'Zigzag' representing ocean/river currents, connected with the 'Fish' of water prosperity and 'Wave' of permanent change.",
      glyphs: ["Zigzag", "Fish", "Wave"]
    },
    {
      meaning: "The Guarded Shelter (Osisi Eze)",
      essence: "A great tree whose roots run deep into our ancestral soil, providing shade, health, and standard safety to an entire community.",
      reasoning: "Features 'Tree-Leaf' for profound generational roots, capped with 'Crown' indicating sacred leadership and guardian presence.",
      glyphs: ["Tree-Leaf", "Crown", "Three-Dots"]
    }
  ];

  const poetryList = [
    "Like a seedling rising through dry stone, you stand tall, drawing strength from deep roots.",
    "A flowing stream that carves valleys from mountain stone, moving with silent but unstoppable force.",
    "A sovereign light that does not demand attention, yet guides the community through the dense wild.",
    "Two lives woven into a golden cord, sealed by ancestral pacts and held safely by the village hearth.",
    "With heavy steps that mark the red earth, you trace the paths laid down by our ancient protectors.",
    "A starburst of golden authority, shining at the crossroads of choice and guiding the traveler home."
  ];

  const selectedOrigin = origins[roll(origins.length, 1)];
  const selectedProfile = profiles[roll(profiles.length, 2)];
  const selectedPoetic = poetryList[roll(poetryList.length, 3)];

  // Create coordinates procedural SVG sigils dynamically using pseudo-random seeds from hash
  const elements = [];
  
  // Core geometric frame based on hash
  const frames = ["c", "p", "e"];
  const selectedFrame = frames[roll(3, 4)];
  
  if (selectedFrame === "c") {
    elements.push({ t: "c", cx: 100, cy: 100, r: 55 + roll(15, 5), fw: 1.5, f: 0 });
    elements.push({ t: "c", cx: 100, cy: 100, r: 35 + roll(10, 6), fw: 1.2, f: 0 });
  } else if (selectedFrame === "e") {
    elements.push({ t: "e", cx: 100, cy: 100, rx: 60 + roll(10, 7), ry: 40 + roll(10, 8), fw: 1.5, f: 0 });
    elements.push({ t: "c", cx: 100, cy: 100, r: 28 + roll(10, 9), fw: 1.2, f: 0 });
  } else {
    elements.push({ t: "p", pts: `100,${35 - roll(10, 10)} ${155 + roll(10, 11)},${135 + roll(10, 12)} ${45 - roll(10, 13)},${135 + roll(10, 14)}`, fw: 1.5, f: 0 });
    elements.push({ t: "c", cx: 100, cy: 100, r: 25 + roll(10, 15), fw: 1.2, f: 0 });
  }

  // Add symmetrical structural spokes or cardinal crosslines
  if (roll(2, 16)) {
    elements.push({ t: "l", x1: 100, y1: 25 + roll(15, 17), x2: 100, y2: 175 - roll(15, 18), fw: 1.5 });
  }
  if (roll(2, 19)) {
    elements.push({ t: "l", x1: 25 + roll(15, 20), y1: 100, x2: 175 - roll(15, 21), fw: 1.5 });
  }
  if (roll(2, 22)) {
    // Elegant diagonal cuts or marks
    elements.push({ t: "l", x1: 45, y1: 45, x2: 155, y2: 155, fw: 1 });
    elements.push({ t: "l", x1: 155, y1: 45, x2: 45, y2: 155, fw: 1 });
  }

  // Arc loop
  const arcRadius = 15 + roll(20, 23);
  const angStart = roll(180, 24);
  elements.push({ t: "a", cx: 100, cy: 100, r: arcRadius, a1: angStart, a2: angStart + 120 + roll(120, 25), fw: 2 });

  // Add filled sentinel detail dots
  const sDots = 2 + roll(4, 26);
  for (let d = 0; d < sDots; d++) {
    const angle = (d * (360 / sDots) + roll(45, 27)) * (Math.PI / 180);
    const dist = 32 + roll(20, 28);
    elements.push({
      t: "d",
      cx: Math.round(100 + dist * Math.cos(angle)),
      cy: Math.round(100 + dist * Math.sin(angle)),
      r: 3 + roll(3, 29)
    });
  }

  // Anchor center dot
  elements.push({ t: "d", cx: 100, cy: 100, r: 4 });

  return {
    origin: selectedOrigin,
    meaning: selectedProfile.meaning,
    essence: selectedProfile.essence,
    reasoning: selectedProfile.reasoning,
    poetic: selectedPoetic,
    glyphs: selectedProfile.glyphs,
    symbolElements: elements
  };
}

// Start API Setup
const app = express();
app.use(express.json());

// Main Translation Endpoint with robust API fail-safes and procedural backups
app.post("/api/translate", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Please enter a valid name." });
  }

  const queryName = name.trim();
  const normalizedKey = queryName.toLowerCase();

  // If request matches a core name precisely, return immediate maximum-fidelity rendering
  if (HANDCRAFTED_CORE[normalizedKey]) {
    console.log(`Serving high-fidelity custom seal for core name: ${queryName}`);
    return res.json(HANDCRAFTED_CORE[normalizedKey]);
  }

  if (!ai) {
    // If no API key is specified, gracefully utilize procedural fallback instantly
    console.log(`Using procedural mathematical engine for: ${queryName}`);
    return res.json(generateDeterministicFallback(queryName));
  }

  try {
    const prompt = `Translate the name "${queryName}" into West African cultural etymology and provide its conceptual Nsibidi meaning, spirit essence, matching glyphs, and custom-composed Nsibidi-style vector geometric sigil drawn inside a 200x200 grid. Make it visually gorgeous and reflective of the name's underlying concept.`;

    const systemInstruction = `You are a distinguished scholar of West African etymology, African-diasporic names, and Nsibidi script dynamics (an ancient logographic writing tradition of Ejagham, Efik, and Igbo peoples of Nigeria).

Perform etymology for any name (West African, European, Latin, Hebrew, etc.). If the name is non-African, etymologize it from its correct source culture (e.g. Latin, Hebrew) and project its concepts conceptually into West African Nsibidi context.

Respond strictly inside the requested JSON response layout. Do NOT pad your answer with markdown templates or other formatting.

AUTHORIZED NSIBIDI CODEX GLYPH LIST:
- "X-Mark" (War/conflict)
- "Parallel-Cuts" (Tally of conquest)
- "Concentric-Circles" (Community/settlement)
- "Interlocked-Loops" (Love/union)
- "Spiral" (Life-journey)
- "Footprints" (Ancestors' walk)
- "Arrow-Up" (Rising destiny/purpose)
- "Zigzag" (Flowing water)
- "Crossroads" (Choice/convergence)
- "Crown" (Royalty/authority)
- "Diamond" (Strength/vitality)
- "Upward-Triangle" (Masculine power/Ikenga)
- "Sun-Rays" (Solar clearance)
- "Crescent" (Lunar mystery)
- "Six-Point-Star" (Stellar guidance)
- "Eye" (Divine eye)
- "Origin-Dot" (First source)
- "Flame" (Fire purification)
- "Bird" (Freedom messenger)
- "Fish" (Piscine prosperity)
- "Serpent" (Transformation wisdom)
- "Tree-Leaf" (Rooted memory)
- "Wave" (Ceaseless flow)
- "Double-Spiral" (Unified duality)
- "Hand" (Activity blessing)
- "Heart-Womb" (Creativity womb)
- "Three-Dots" (Triarchic sacred completeness)
- "Knot-Bond" (Pact agreement)
- "Downward-Triangle" (Feminine water/depth)
- "Drum" (Rhythm communication)

DESIGNING THE COMPOSITE SIGIL:
- Your canvas is exactly 200x200, centered at (100,100).
- All primitives must reside securely inside (20,20) to (180,180) to avoid clip edges.
- Build an elegant, highly cohesive tribal sigil of 8-14 detailed primitives.
- Match name spirit to geometries:
  - Radiance/Knowledge: radiating elements, inner dots, nested loops, star frames.
  - Power/Warrior Strength: sharp angles, polygons, arrows, crowns, straight bold tallies.
  - River/Water/Journey: waving paths, soft nested curves, spirals, fluid arches.
  - Union/Family/Peace: linked circles, interlaced loops, bounding grids.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: nsibidiResponseSchema,
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini API.");
    }

    const resultObject = JSON.parse(responseText.trim());
    console.log(`Successfully generated dynamic AI Nsibidi profile for: ${queryName}`);
    return res.json(resultObject);

  } catch (apiError) {
    console.error("Gemini API call failed, falling back to procedural procedurals:", apiError);
    return res.json(generateDeterministicFallback(queryName));
  }
});

// Configure client hot reloading dev server vs production static asset serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware integrated successfully into Express.");
  } else {
    // Standard static serving of dist files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
