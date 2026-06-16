export interface CustomHistoricalContext {
  id: string;
  culturalOrigin: string;
  eraOfUse: string;
  archaeologicalFindings: string;
  narrativeText: string;
}

export const getHistoricalDetails = (id: string): CustomHistoricalContext => {
  const defaults: { [key: string]: Partial<CustomHistoricalContext> } = {
    "X-Mark": {
      culturalOrigin: "Ejagham Council of Elders (Cross River Basin) and military sentinel lines of the Ekpe society",
      eraOfUse: "Thrived from pre-15th century trade network eras; still implemented visually during private traditional events",
      archaeologicalFindings: "Similar protective boundaries appear etched into ancient Ikom Monolith structures near Calabar, Nigeria",
      narrativeText: "Historically written as nkita/agha, this critical logogram was sketched on physical boundaries or tree bark to warn uninitiated travelers. Intruders breaching this marker faced immediate trial by the elder tribunal."
    },
    "Parallel-Cuts": {
      culturalOrigin: "Efik military sentinel lines and West African coastal guilds",
      eraOfUse: "Commonly recorded on colonial boundary documents and traditional trade ledgers from 1600 to 1850 AD",
      archaeologicalFindings: "Carven markings found on preserved ceremonial spears and defensive copper shields in Cross River collections",
      narrativeText: "Used by warriors to track personal or community accomplishments. Every parallel slash indicates an dynamic covenant kept, a challenge overcome, or a boundary secured."
    },
    "Concentric-Circles": {
      culturalOrigin: "Igbo and Ejagham village settlement administrators",
      eraOfUse: "Ancient origins, dating back to regional migrations and early soil defense groupings (circa 1100–1700 AD)",
      archaeologicalFindings: "Symmetric rings featured deeply in Igbo-Ukwu bronze vessels (9th century AD) showing community status",
      narrativeText: "Represents the layout of traditional fortified compounds (Obodo). The innermost circle anchors the spiritual covenant stone, with progressive defensive lines protecting children and agricultural stockpiles."
    },
    "Interlocked-Loops": {
      culturalOrigin: "Matrimonial councils and secret marriage societies among the Efik-Ibibio and Annang peoples",
      eraOfUse: "Widely visible in traditional betrothal materials and body paintings (Uli and Nsibidi) from 1400 AD onward",
      archaeologicalFindings: "Preserved on decorated pottery fragments and carved wooden dowries recovered in Calabar province",
      narrativeText: "Synthesizes the merger of two paths into a cooperative covenant. This signifier states that individual trials are resolved; both parties are bound to protect mutual lineage secrets."
    },
    "Spiral": {
      culturalOrigin: "Cross River and Igbo cosmological astronomers",
      eraOfUse: "Predates written registers, continuously active across ancestral generations to trace cosmological seasons",
      archaeologicalFindings: "Observed on ancient stone monolith monoliths in the Alok-Ikom Archaeological Zone",
      narrativeText: "Symbolizes progressive life expansion. It shows that although life returns to the same calendar points, the mind moves outwards in higher state levels of realization."
    },
    "Footprints": {
      culturalOrigin: "Traditional hunting guilds and long-distance trade messengers",
      eraOfUse: "Extensively active in trade networks from the Niger Delta to the Cameroon mountain tracks (1200–1800 AD)",
      archaeologicalFindings: "Drawn inside pre-colonial guide maps and message stones found along ancient trade nodes",
      narrativeText: "Used to guide group movements through dense forests. Sketched on trail crossings to confirm that elders passed safely, providing reassurance to migrating columns."
    },
    "Arrow-Up": {
      culturalOrigin: "Igbo Ikenga societal administrators and developmental guilds",
      eraOfUse: "High pre-colonial era; traditionally inscribed on wooden shrine posts (Ikenga shrines) since 1500 AD",
      archaeologicalFindings: "Carved into primary support pillars of royal houses in the Awka and Nri administrative divisions",
      narrativeText: "Signifies ascension and steadfast dedication to goals. The dual horizontal barriers confirm that challenges are anchored and will act as strong foundations rather than obstacles."
    },
    "Zigzag": {
      culturalOrigin: "Riverine communities of the Niger Delta and Mami Wata priesthood line",
      eraOfUse: "Continuous spiritual usage since early settlement eras in Delta fishing nodes (approx. 13th century AD)",
      archaeologicalFindings: "Etched into coastal Calabar clay water vessels and ancient ritual brass vessels",
      narrativeText: "Commonly known as Osimiri. Represents the continuous fluctuation of the River of Dreams. Teaches initiated members to adapt quickly to tides rather than fighting currents."
    },
    "Crossroads": {
      culturalOrigin: "Igbo and Ejagham shrine boundaries and public market surveyors",
      eraOfUse: "Dating back multiple centuries, defining meeting points of internal and external dimensions",
      archaeologicalFindings: "Inscribed on shrine entry stones in Akwete and old trade roads near Enugu",
      narrativeText: "The sacred Odo represents choice. It alerts initiates that they are stepping into a crossroads where default paths cease; they must invoke ancestral advice before moving forward."
    },
    "Crown": {
      culturalOrigin: "Eze-Nri royal cabinets and kingmakers of Calabar kingdoms",
      eraOfUse: "Established by monarchical peer networks since the 10th century AD",
      archaeologicalFindings: "Matched beautifully with ceremonial crown fragments and iron rods excavated at Igbo-Ukwu site",
      narrativeText: "A mark of absolute accountability. Traditionally granted to leaders which have demonstrated extreme compassion and alignment with local laws."
    },
    "Diamond": {
      culturalOrigin: "Guilds of traditional metallurgists and smiths in Awka region",
      eraOfUse: "Iron and bronze age expansion eras (approx. 800–1600 AD)",
      archaeologicalFindings: "Perfect geometric symmetry found in excavated bronze ornaments in Igbo-Ukwu",
      narrativeText: "Represents compressed wisdom. Just as charcoal withstands depth to become solid diamond, the initiate learns to withstand hardships to build resilient character."
    },
    "Upward-Triangle": {
      culturalOrigin: "Warrior councils and blacksmith clans among northern Igbo communities",
      eraOfUse: "Generations of pre-colonial administration; used to signal active work of the blacksmith hearth",
      archaeologicalFindings: "Etched on forge markers and ancestral bronze shields preserved in Nigeria museum",
      narrativeText: "A clear signifier of positive exertion and outward focus. Aligns state energy with physical growth, protection, and manual craft execution."
    },
    "Sun-Rays": {
      culturalOrigin: "Solar priests of Nri cosmological alliance",
      eraOfUse: "Dating to early solar calendar tracking methods (estimated 12th century AD or earlier)",
      archaeologicalFindings: "Central solar motifs found on monolith monuments and ancient Igbo brass pendants",
      narrativeText: "Known as Anyanwu, representing the Supreme Witness that sees all things during the golden hours of daylight. Guides daylight contracts and public oaths."
    },
    "Crescent": {
      culturalOrigin: "Lunar priestesses and agricultural planning circles",
      eraOfUse: "Continuous agricultural tracking since regional agriculture began",
      archaeologicalFindings: "Carved on calendar sticks and ceremonial ivory items retrieved from Calabar palaces",
      narrativeText: "Known as Onwa, representing soft night rhythms and cyclical tides. Tells the community when to plant, when to harvest, and when to regroup."
    },
    "Six-Point-Star": {
      culturalOrigin: "West African deep night navigators",
      eraOfUse: "Widely used to guide long forest treks and desert trade caravans across Africa",
      archaeologicalFindings: "Astronomy tracking plates and navigational stone markers showing early planetary grids",
      narrativeText: "Represents stellar steering. Reminds initiated members that they carry a personal star in their design that helps orient them during moments of heavy confusion."
    },
    "Eye": {
      culturalOrigin: "All-seeing Oracle circles of Cross River prophets",
      eraOfUse: "Thrived across centuries in sacred divination houses",
      archaeologicalFindings: "Inscribed on public meeting house pillars and sacred visual screens",
      narrativeText: "Anya Chukwu represents cosmic sight. Warns individuals that they can hide secrets from neighbors, but the supreme creative matrix witnesses every event."
    },
    "Origin-Dot": {
      culturalOrigin: "Cosmological creation priests of ancient Igbo areas",
      eraOfUse: "Deep prehistory, marking the unmanifest source of physical world dimensions",
      archaeologicalFindings: "Perfect concentric dotted matrices discovered on basalt monolith monoliths",
      narrativeText: "The cosmic origin dot. Proclaims that everything comes from a single unified energy core before it branches into multiple elements and directions."
    },
    "Flame": {
      culturalOrigin: "Sacred fire templars and ceremonial guardians of Nri",
      eraOfUse: "Active continuously across spiritual purifying rites and seasonal soil preparation",
      archaeologicalFindings: "Asymmetrical flame patterns found of old copper burners",
      narrativeText: "Represents mental heat (Oku Mmuo) that boils away distractions. Prepares students for advanced initiation by burning away greed and jealousy."
    },
    "Bird": {
      culturalOrigin: "Forest trackers and herbalist guilds",
      eraOfUse: "Continuously active in communication codes and dream interpretation guides",
      archaeologicalFindings: "Exquisite bird statues made in bronze found in major West African dig zones",
      narrativeText: "Bird motifs represent the flight of messenger spirits. Sketched when sending a dynamic message across distances, ensuring it arrives safely."
    },
    "Fish": {
      culturalOrigin: "Delta fishermen and water network administrators",
      eraOfUse: "Centuries of coastal trade, dating to early delta maritime networks",
      archaeologicalFindings: "Carvings on sea-going canoes and marine clay plaques",
      narrativeText: "Known as Azu. Celebrates riverine abundance and speed. Points initiates toward adaptation and utilizing natural currents to catch opportunities."
    },
    "Serpent": {
      culturalOrigin: "Python priests of Ala earth mother shrines",
      eraOfUse: "Sacred Python protection eras, maintained meticulously across centuries",
      archaeologicalFindings: "Mummified python traces and brass python figures on ancient shrine altars",
      narrativeText: "The Python (Eke) is the sacred companion of the Earth. Sheds its skin to remind initiates that physical obstacles can be outgrown through character transformation."
    },
    "Tree-Leaf": {
      culturalOrigin: "Traditional medicine fraternities (Dibia guilds)",
      eraOfUse: "Thrived across centuries, guiding forest conservation laws and herb gathering",
      archaeologicalFindings: "Inscribed on sacred medicine wooden chest lids and healing spoons",
      narrativeText: "Osisi is the tree of life. Connects underground ancestors with current living family members through continuous, flowing generational sap."
    },
    "Wave": {
      culturalOrigin: "Coastal Efik and dual marine societies of Cross River",
      eraOfUse: "Early maritime trade seasons; recorded inside pre-colonial harbor journals",
      archaeologicalFindings: "Wave patterns on coastal clay storage jars of old Calabar",
      narrativeText: "Iyi represent water cycles. Informs initiates that temporary storms always pass, and their primary focus must be maintaining internal steady balance."
    },
    "Double-Spiral": {
      culturalOrigin: "High dualism philosophers of Igbo-Ukwu",
      eraOfUse: "Observed since the 9th century AD in sophisticated copper-alloy casts",
      archaeologicalFindings: "Found in double-spiral bronze pendant ornaments at excavated burials of nobles",
      narrativeText: "The balancing spiral. Tracks the breathing of the universe in and out. Shows that masculine and feminine principles must exist in equal strength."
    },
    "Hand": {
      culturalOrigin: "Artisans and manual smithing guilds of Calabar and Awka",
      eraOfUse: "Thrived during the expansion of industrial craft guilds (15th–19th century AD)",
      archaeologicalFindings: "Etched on ivory handle-carvings and tools recovered in ancient sites",
      narrativeText: "Known as Aka Mmadu. Proclaims the dignity of manual labor. Emphasizes that our hands have the divine duty to build, protect, and feed."
    },
    "Heart-Womb": {
      culturalOrigin: "Maternal protectors and midwives association across West Africa",
      eraOfUse: "Ancient lineage records tracking household wealth and birth charts",
      archaeologicalFindings: "Inscribed on ceramic fertility plaques and baby carrying sheets",
      narrativeText: "The womb of Ala represents absolute care and unconditional shelter. Acts as a reminder to handle the emotional states of neighbors with soft respect."
    },
    "Three-Dots": {
      culturalOrigin: "Afa Oracle systems and boundary treaty judges",
      eraOfUse: "Continuously active in resolving land disputes and sealing treaties",
      archaeologicalFindings: "Dotted stone borders designating treaty territories in old Igbo maps",
      narrativeText: "The triad of balance (Ihe Ato). Represents past, present, and future meeting together. Reminds players that stable systems always require three legs to stand."
    },
    "Knot-Bond": {
      culturalOrigin: "High oath binders of the Ekpe and Okonko secret councils",
      eraOfUse: "Thrived across pre-colonial administration and regional commerce (1600–1890)",
      archaeologicalFindings: "Found on brass staff plaques used as safe-passage passes by official caravans",
      narrativeText: "An unbreakable oath (Nkwuko). This signifier is drawn to bind parties to a verbal contract. Breaking this contract was considered a crime against the soil."
    },
    "Downward-Triangle": {
      culturalOrigin: "Feminine spiritual organizations and crop planners",
      eraOfUse: "Continuously active, linked with traditional soil seed planning",
      archaeologicalFindings: "Clay plaques from ancient earth temples found across Cross River province",
      narrativeText: "A sign of deep receptivity and protection. Keeps the community aligned with replenishment, ensuring natural resources are not over-extracted."
    },
    "Drum": {
      culturalOrigin: "Royal drum broadcasting masters and Ikoro messengers",
      eraOfUse: "Established during the creation of public message broadcasting nodes",
      archaeologicalFindings: "Enormous hollow-wood logs (Ikoro) with etched logograms in village centers",
      narrativeText: "Known as Igba. The drum is the voice of the community. Sketched when proclamations are issued, demanding that all listen and comply with communal laws."
    }
  };

  const chosen = defaults[id];
  return {
    id: id,
    culturalOrigin: chosen?.culturalOrigin || "Ejagham and Efik lineage channels of the Cross River Basin",
    eraOfUse: chosen?.eraOfUse || "Active since the 14th century AD in pre-colonial communal panels",
    archaeologicalFindings: chosen?.archaeologicalFindings || "Carvings on ancient ceremonial basalt stone monoliths and ceramic vessels",
    narrativeText: chosen?.narrativeText || "A historic Nsibidi representation of conceptual West African visual messaging networks, codifying laws and local knowledge systems."
  };
};
