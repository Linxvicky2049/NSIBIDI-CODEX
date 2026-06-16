import { Glyph } from "./types";

export const GLYPHS: Glyph[] = [
  {
    id: "X-Mark",
    cat: "Conflict",
    name: "X-Mark",
    local: "Nkita / Agha",
    meaning: "War, conflict, warning — representing a territorial boundary crossed or a declaration of active hostiles.",
    svg: `<line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <circle cx="20" cy="20" r="4.5" fill="currentColor" />
          <circle cx="80" cy="20" r="4.5" fill="currentColor" />
          <circle cx="20" cy="80" r="4.5" fill="currentColor" />
          <circle cx="80" cy="80" r="4.5" fill="currentColor" />`
  },
  {
    id: "Parallel-Cuts",
    cat: "Conflict",
    name: "Parallel Cuts",
    local: "Ọwa / Ihe Agha",
    meaning: "Tally marks of conquest and survival — each horizontal or vertical slit representing battles survived.",
    svg: `<line x1="24" y1="22" x2="24" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="36" y1="22" x2="36" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="48" y1="22" x2="48" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="60" y1="22" x2="60" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="72" y1="22" x2="72" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
          <line x1="15" y1="64" x2="85" y2="36" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" fill="none" />`
  },
  {
    id: "Concentric-Circles",
    cat: "Community",
    name: "Concentric Circles",
    local: "Obodo / Ogwe",
    meaning: "The community closely gathered around its shared center — settlement, citizenship, and defensive walls.",
    svg: `<circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />`
  },
  {
    id: "Interlocked-Loops",
    cat: "Community",
    name: "Interlocked Loops",
    local: "Ọchịchọ Obi",
    meaning: "Love and sacred union — two souls intertwined in cooperative marriage, fidelity, and unbreakable friendship.",
    svg: `<path d="M50,50 C50,24 18,24 18,50 C18,76 50,76 50,50 C50,24 82,24 82,50 C82,76 50,76 50,50 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />`
  },
  {
    id: "Spiral",
    cat: "Journey",
    name: "Spiral",
    local: "Ụzọ Ndụ",
    meaning: "The dynamic journey of life — progressive growth radiating outward from the first moment of ancestral origin.",
    svg: `<path d="M50,50 C50,44 55,41 58,45 C63,51 59,62 50,64 C37,67 27,57 29,44 C31,27 45,18 58,22 C74,27 82,44 78,58 C73,77 55,86 38,80" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />`
  },
  {
    id: "Footprints",
    cat: "Journey",
    name: "Footprints",
    local: "Ụzọ / Ije",
    meaning: "Marks of passage and migration — carrying the weight of those who walked before and paving ancestral roads.",
    svg: `<ellipse cx="37" cy="68" rx="11" ry="16" stroke="currentColor" stroke-width="1.8" fill="none" />
          <circle cx="27" cy="55" r="3" fill="currentColor" />
          <circle cx="33" cy="52" r="3" fill="currentColor" />
          <circle cx="40" cy="51" r="3" fill="currentColor" />
          <circle cx="47" cy="54" r="3" fill="currentColor" />
          <ellipse cx="63" cy="33" rx="11" ry="16" stroke="currentColor" stroke-width="1.8" fill="none" />
          <circle cx="53" cy="20" r="3" fill="currentColor" />
          <circle cx="59" cy="17" r="3" fill="currentColor" />
          <circle cx="66" cy="17" r="3" fill="currentColor" />
          <circle cx="73" cy="20" r="3" fill="currentColor" />`
  },
  {
    id: "Arrow-Up",
    cat: "Journey",
    name: "Arrow Up",
    local: "Ebube / Amụma",
    meaning: "Steadfast aspiration and sacred purpose — the dynamic ascent of the soul toward its higher destiny.",
    svg: `<line x1="50" y1="82" x2="50" y2="24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <polyline points="30,44 50,18 70,44" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="32" y1="82" x2="68" y2="82" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`
  },
  {
    id: "Zigzag",
    cat: "Journey",
    name: "Zigzag",
    local: "Mmiri / Osimiri",
    meaning: "The flowing river of change — undulating currents representing adaptation and the active flow of life events.",
    svg: `<polyline points="8,34 22,24 36,34 50,24 64,34 78,24 92,34" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="8,50 22,40 36,50 50,40 64,50 78,40 92,50" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="8,66 22,56 36,66 50,56 64,66 78,56 92,66" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  {
    id: "Crossroads",
    cat: "Power",
    name: "Crossroads",
    local: "Odo / Ihe Ọzọ",
    meaning: "The cosmic intersection and spiritual choice — where paths converge and decisive resolutions are settled.",
    svg: `<line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <polygon points="50,34 66,50 50,66 34,50" fill="currentColor" />`
  },
  {
    id: "Crown",
    cat: "Power",
    name: "Crown",
    local: "Igwe / Eze",
    meaning: "Rightful sovereignty and spiritual authority — representing leadership assigned by elder councils and deities.",
    svg: `<path d="M20,76 L20,38 L36,56 L50,22 L64,56 L80,38 L80,76 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
          <line x1="14" y1="76" x2="86" y2="76" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="50" cy="22" r="5" fill="currentColor" />
          <circle cx="20" cy="38" r="3.5" fill="currentColor" />
          <circle cx="80" cy="38" r="3.5" fill="currentColor" />`
  },
  {
    id: "Diamond",
    cat: "Power",
    name: "Diamond",
    local: "Agbara / Àjà",
    meaning: "Unbreakable spiritual strength — highly compressed wisdom, representing clarity, resilience, and wealth.",
    svg: `<polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" stroke-width="2" fill="none"/>
          <polygon points="50,26 74,50 50,74 26,50" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <circle cx="50" cy="50" r="5" fill="currentColor" />`
  },
  {
    id: "Upward-Triangle",
    cat: "Power",
    name: "Upward Triangle",
    local: "Nwoke / Ọkụ Ikenga",
    meaning: "Masculine flame and outward execution — the Ikenga strength, protecting family status and achieving goals.",
    svg: `<polygon points="50,12 88,82 12,82" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
          <line x1="50" y1="30" x2="50" y2="68" stroke="currentColor" stroke-width="1.8" />
          <line x1="36" y1="58" x2="64" y2="58" stroke="currentColor" stroke-width="1.8" />`
  },
  {
    id: "Sun-Rays",
    cat: "Celestial",
    name: "Sun Rays",
    local: "Anyanwụ",
    meaning: "The vital energy of the great Sun deity — daylight clearance, supreme witness, and cosmic source of warmth.",
    svg: `<circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="50" y1="8" x2="50" y2="24"/>
            <line x1="50" y1="76" x2="50" y2="92"/>
            <line x1="8" y1="50" x2="24" y2="50"/>
            <line x1="76" y1="50" x2="92" y2="50"/>
            <line x1="20" y1="20" x2="32" y2="32"/>
            <line x1="68" y1="68" x2="80" y2="80"/>
            <line x1="80" y1="20" x2="68" y2="32"/>
            <line x1="20" y1="80" x2="32" y2="68"/>
          </g>`
  },
  {
    id: "Crescent",
    cat: "Celestial",
    name: "Crescent",
    local: "Ọnwa",
    meaning: "The moon and biological cycles — guardian of memory, night fertility, and soft feminine mysteries.",
    svg: `<path d="M50,14 A36,36 0 1,1 50,86 A24,24 0 1,0 50,14 Z" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="70" cy="26" r="3.5" fill="currentColor" />
          <circle cx="80" cy="40" r="2.5" fill="currentColor" />
          <circle cx="76" cy="56" r="2" fill="currentColor" />`
  },
  {
    id: "Six-Point-Star",
    cat: "Celestial",
    name: "Six-Point Star",
    local: "Kpakpando",
    meaning: "Stellar steering and protection — a dynamic mark of divine guidance shimmering on chosen travelers.",
    svg: `<polygon points="50,10 58,38 88,38 64,56 72,84 50,66 28,84 36,56 12,38 42,38" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
          <circle cx="50" cy="50" r="6" fill="currentColor" />`
  },
  {
    id: "Eye",
    cat: "Celestial",
    name: "Eye",
    local: "Anya Chukwu",
    meaning: "The all-seeing eye of spiritual awareness — active vigilance, sight, and clear intuitive understanding.",
    svg: `<path d="M10,50 Q50,18 90,50 Q50,82 10,50 Z" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="14" stroke="currentColor" stroke-width="1.8" fill="none" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <line x1="50" y1="18" x2="50" y2="26" stroke="currentColor" stroke-width="1.5"/>
          <line x1="50" y1="74" x2="50" y2="82" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: "Origin-Dot",
    cat: "Celestial",
    name: "Origin Dot",
    local: "Mmalite / Ibite",
    meaning: "The absolute source and first moment of cosmic manifestation, before any formatting or design took place.",
    svg: `<circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" fill="none" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="1.5" fill="none" />
          <circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />`
  },
  {
    id: "Flame",
    cat: "Celestial",
    name: "Flame",
    local: "Ọkụ Mmụọ",
    meaning: "Sacred hearth fire and mental purification — the intense spark of internal passion that eats away confusion.",
    svg: `<path d="M50,84 C28,70 26,48 40,38 C36,52 46,58 50,46 C54,36 52,22 50,14 C64,30 70,52 60,64 C70,54 68,36 62,28 C76,44 78,68 64,78 C58,88 54,90 50,84 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>`
  },
  {
    id: "Bird",
    cat: "Nature",
    name: "Bird",
    local: "Nnụnụ / Ọkụkọ Mmụọ",
    meaning: "Spiritual messenger and freedom — the wind traveler that transmits prayers and declarations to internal skies.",
    svg: `<path d="M14,54 Q28,30 50,40 Q64,46 80,28 Q72,50 60,52 Q76,58 86,48 Q76,68 56,62 Q40,56 24,74 Q18,64 14,54 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
          <circle cx="80" cy="28" r="4" fill="currentColor" />`
  },
  {
    id: "Fish",
    cat: "Nature",
    name: "Fish",
    local: "Azụ",
    meaning: "Abundance and coastal prosperity — drawing nourishment, adaptive speed, and life from the deep river beds.",
    svg: `<path d="M22,50 Q42,28 66,40 Q82,30 94,50 Q82,70 66,60 Q42,72 22,50 Z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
          <path d="M22,50 L8,38 L8,62 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
          <circle cx="75" cy="46" r="4" fill="currentColor" />
          <line x1="32" y1="44" x2="62" y2="42" stroke="currentColor" stroke-width="1" />
          <line x1="32" y1="56" x2="62" y2="58" stroke="currentColor" stroke-width="1" />
          <line x1="47" y1="38" x2="47" y2="62" stroke="currentColor" stroke-width="1" />`
  },
  {
    id: "Serpent",
    cat: "Nature",
    name: "Serpent",
    local: "Eke / Agwụ",
    meaning: "Mystic transformation, rebirth, and continuous medicine — shedding past structures to live in health.",
    svg: `<path d="M18,28 Q50,18 66,38 Q80,58 50,68 Q20,78 28,90" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="18" cy="28" rx="8" ry="5" transform="rotate(-30,18,28)" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <line x1="11" y1="23" x2="7" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="11" y1="33" x2="7" y2="39" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
  },
  {
    id: "Tree-Leaf",
    cat: "Nature",
    name: "Tree / Leaf",
    local: "Osisi / Nkụ Ndụ",
    meaning: "Generational rootedness and ancestral identity — maintaining connection and memory through continuous sap.",
    svg: `<line x1="50" y1="88" x2="50" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M50,42 C50,20 28,12 22,28 C18,38 30,48 50,42 Z" stroke="currentColor" stroke-width="1.8" fill="none" />
          <path d="M50,52 C50,30 72,22 78,38 C82,48 70,58 50,52 Z" stroke="currentColor" stroke-width="1.8" fill="none" />
          <path d="M50,64 C38,44 18,48 20,60 C22,72 38,72 50,64 Z" stroke="currentColor" stroke-width="1.8" fill="none" />`
  },
  {
    id: "Wave",
    cat: "Nature",
    name: "Wave",
    local: "Omi / Iyi",
    meaning: "Dynamic fluctuation and cyclical change — the realization that nothing stands entirely still.",
    svg: `<path d="M8,36 Q20,24 32,36 Q44,48 56,36 Q68,24 80,36 Q88,44 94,36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M8,52 Q20,40 32,52 Q44,64 56,52 Q68,40 80,52 Q88,60 94,52" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M8,68 Q20,56 32,68 Q44,80 56,68 Q68,56 80,68 Q88,76 94,68" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>`
  },
  {
    id: "Double-Spiral",
    cat: "Nature",
    name: "Double Spiral",
    local: "Mgbanwe / Ụdị Abụọ",
    meaning: "Unified duality — the breath in and out of the world, balancing active and receptive principles.",
    svg: `<path d="M50,50 C50,42 58,38 62,44 C68,52 60,64 50,66 C36,68 26,58 28,46 C30,30 44,20 58,24" stroke="currentColor" stroke-width="2" fill="none" />
          <path d="M50,50 C50,58 42,62 38,56 C32,48 40,36 50,34 C64,32 74,42 72,54 C70,70 56,80 42,76" stroke="currentColor" stroke-width="2" fill="none" />`
  },
  {
    id: "Hand",
    cat: "Human",
    name: "Hand",
    local: "Aka / Aka Mmadụ",
    meaning: "Action, creation, and sacred giving — the human limb that crafts, guides, and presents blessings.",
    svg: `<path d="M36,80 L36,44 C36,38 44,38 44,44 L44,34 C44,28 52,28 52,34 L52,28 C52,22 60,22 60,28 L60,36 C60,30 68,30 68,38 L68,54 L74,52 C80,50 82,56 78,60 L64,76 C58,84 44,86 36,80 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>`
  },
  {
    id: "Heart-Womb",
    cat: "Human",
    name: "Heart / Womb",
    local: "Obi / Ime Ụlọ",
    meaning: "The dynamic chamber of deep love and creation — representing emotional truth and bodily potential.",
    svg: `<path d="M50,78 C18,56 14,32 30,22 C40,16 50,28 50,28 C50,28 60,16 70,22 C86,32 82,56 50,78 Z" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="52" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <line x1="50" y1="42" x2="50" y2="62" stroke="currentColor" stroke-width="1.5"/>
          <line x1="40" y1="52" x2="60" y2="52" stroke="currentColor" stroke-width="1.5"/>`
  },
  {
    id: "Three-Dots",
    cat: "Human",
    name: "Three Dots",
    local: "Ihe Atọ / Nke Atọ",
    meaning: "Sacred completion — past, present, future; representing balance, stable support, and eternal law.",
    svg: `<circle cx="50" cy="20" r="8" fill="currentColor" />
          <circle cx="26" cy="70" r="8" fill="currentColor" />
          <circle cx="74" cy="70" r="8" fill="currentColor" />
          <line x1="50" y1="28" x2="34" y2="62" stroke="currentColor" stroke-width="1.5" />
          <line x1="50" y1="28" x2="66" y2="62" stroke="currentColor" stroke-width="1.5" />
          <line x1="34" y1="70" x2="66" y2="70" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" />`
  },
  {
    id: "Knot-Bond",
    cat: "Human",
    name: "Knot / Bond",
    local: "Ọkwá / Nkwụkọ",
    meaning: "A sealed pact and sacred covenant — binding parties under blood laws, representing stable commitment.",
    svg: `<rect x="28" y="28" width="44" height="44" rx="2" stroke="currentColor" stroke-width="2" fill="none" />
          <path d="M28,40 L14,40 L14,60 L28,60" stroke="currentColor" stroke-width="1.8" fill="none" />
          <path d="M72,40 L86,40 L86,60 L72,60" stroke="currentColor" stroke-width="1.8" fill="none" />
          <path d="M40,28 L40,14 L60,14 L60,28" stroke="currentColor" stroke-width="1.8" fill="none" />
          <path d="M40,72 L40,86 L60,86 L60,72" stroke="currentColor" stroke-width="1.8" fill="none" />
          <circle cx="50" cy="50" r="7" fill="currentColor" />`
  },
  {
    id: "Downward-Triangle",
    cat: "Human",
    name: "Downward Triangle",
    local: "Nwanyị / Mmiri Ndụ",
    meaning: "Feminine receptivity and earthly depths — water potential, fertility, and holding within.",
    svg: `<polygon points="12,18 88,18 50,86" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
          <line x1="50" y1="34" x2="50" y2="68" stroke="currentColor" stroke-width="1.8" />
          <line x1="36" y1="46" x2="64" y2="46" stroke="currentColor" stroke-width="1.8" />
          <circle cx="50" cy="18" r="5" fill="currentColor" />`
  },
  {
    id: "Drum",
    cat: "Human",
    name: "Drum",
    local: "Igba / Ọjị Olu",
    meaning: "The public voice of traditional authority — active sound pacing and broadcasting history across spans.",
    svg: `<ellipse cx="50" cy="32" rx="26" ry="10" stroke="currentColor" stroke-width="1.8" fill="none" />
          <ellipse cx="50" cy="68" rx="26" ry="10" stroke="currentColor" stroke-width="1.8" fill="none" />
          <line x1="24" y1="32" x2="24" y2="68" stroke="currentColor" stroke-width="1.8"/>
          <line x1="76" y1="32" x2="76" y2="68" stroke="currentColor" stroke-width="1.8"/>
          <path d="M24,32 Q50,22 76,32" stroke="currentColor" stroke-width="1.2" fill="none" />
          <path d="M24,68 Q50,78 76,68" stroke="currentColor" stroke-width="1.2" fill="none" />
          <line x1="24" y1="42" x2="10" y2="54" stroke="currentColor" stroke-width="1.2" />
          <line x1="76" y1="42" x2="90" y2="54" stroke="currentColor" stroke-width="1.2" />
          <line x1="24" y1="58" x2="10" y2="54" stroke="currentColor" stroke-width="1.2" />
          <line x1="76" y1="58" x2="90" y2="54" stroke="currentColor" stroke-width="1.2" />`
  }
];
