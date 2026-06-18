// ─── Autocon Solutions LLP – Static Configuration ────────────────────────────
export const tenant = {
  name: "Autocon Solutions LLP",
  tagline: "Material Handling & Conveyor Systems",
  shortName: "Autocon",
  established: "2023",
  branding: {
    primaryColor: "#0f172a",   // slate-900 – dark industrial
    accentColor:  "#F59E0B",   // amber-500 – golden accent
    logo: null,                // set to image path when logo is ready
  },
  contact: {
    email: "Sales@autocon.co.in",
    phone1: "+91 87883 45829",
    phone2: "+91 91726 09787",
    director1: { name: "Akshay More", phone: "+91 87883 45829" },
    director2: { name: "Shashikant Darekar", phone: "+91 91726 09787" },
    whatsapp: "918788345829",  // include country code for wa.me link
    address: "Pune, Maharashtra, India",
  },
  social: {
    instagram: "https://www.instagram.com/autocon_solutions_llp",
    linkedin:  "https://www.linkedin.com/in/autocon-solutions-616b1b3b7",
  },
};

// ─── Products (10 Conveyor Categories) ────────────────────────────────────────────
export const PRODUCTS = [
  {
    slug: "belt-conveyors",
    name: "Belt Conveyors",
    shortDesc: "Versatile and efficient conveying systems ideal for general material handling, food processing, and packaging industries.",
    image: "/images/modern_blue_belt_conveyor_1774170860378.png",
  },
  {
    slug: "roller-conveyors",
    name: "Roller Conveyors",
    shortDesc: "Gravity and motorized roller systems for fast, reliable product flow across warehouses and robust production lines.",
    image: "/images/roller_conveyor_1773902757204.png",
  },
  {
    slug: "chain-conveyors",
    name: "Chain Conveyors",
    shortDesc: "Heavy-duty chain systems designed for transporting heavy loads like pallets, automotive parts, and industrial equipment.",
    image: "/images/chain_conveyor_1773902777149.png",
  },
  {
    slug: "slat-conveyors",
    name: "Slat Conveyors",
    shortDesc: "Durable steel and aluminum slat platforms built for abrasive, hot, or sharp-edged products with zero belt wear.",
    image: "/images/industrial-conveyor-1.jpg",
  },
  {
    slug: "modular-conveyors",
    name: "Modular Conveyors",
    shortDesc: "FDA-compliant plastic modular belts offering maximum flexibility, easy cleaning, and high impact resistance.",
    image: "/images/modular_conveyor_1773902794000.png",
  },
  {
    slug: "spiral-conveyors",
    name: "Spiral Conveyors",
    shortDesc: "Space-saving vertical elevation solutions that transport items smoothly between different facility floor levels.",
    image: "/images/spiral_conveyor_1773902810373.png",
  },
  {
    slug: "wiremesh-conveyors",
    name: "Wiremesh Conveyors",
    shortDesc: "Stainless steel wiremesh belts perfect for high-temperature ovens, cooling lines, and coating applications.",
    image: "/images/industrial-conveyor-2.jpg",
  },
  {
    slug: "telescopic-conveyors",
    name: "Telescopic Conveyors",
    shortDesc: "Extendable systems designed to radically speed up the loading and unloading of trucks, trailers, and shipping containers.",
    image: "/images/industrial-conveyor-3.jpg",
  },
  {
    slug: "flexible-conveyors",
    name: "Flexible Conveyors",
    shortDesc: "Expandable, curved, and easily repositionable roller belts for dynamic warehouse layouts and dispatch zones.",
    image: "/images/bright_warehouse_conveyor_1774170894702.png",
  },
  {
    slug: "screw-conveyors",
    name: "Screw Conveyors",
    shortDesc: "Enclosed helical screw systems designed for efficiently transporting bulk powder, granular, and semi-solid materials.",
    image: "/images/bright_blue_roller_conveyor_1774170831815.png",
  },
];

// ─── Industries ───────────────────────────────────────────────────────────────
export const INDUSTRIES = [
  { name: "Food Processing",        icon: "🍎", desc: "Hygienic conveying for food-grade applications."       },
  { name: "Packaging",              icon: "📦", desc: "High-speed packaging line integrations."                },
  { name: "Pharmaceutical",         icon: "💊", desc: "Clean-room compliant material handling systems."        },
  { name: "FMCG",                   icon: "🛒", desc: "Fast-moving consumer goods distribution lines."         },
  { name: "Automobile",             icon: "🚗", desc: "Heavy-duty conveyors for auto parts assembly."          },
  { name: "Warehousing & Logistics",icon: "🏭", desc: "Sorting, accumulation and dispatch conveying systems."  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────
export const PROCESS_STEPS = [
  { step: 1, title: "Requirement Understanding", desc: "We study your layout, load specs and production goals." },
  { step: 2, title: "Design & Engineering",      desc: "Custom 3D designs and material selection for your system." },
  { step: 3, title: "Manufacturing",             desc: "In-house fabrication with high-quality materials and precision." },
  { step: 4, title: "Quality Check",             desc: "Rigorous testing before dispatch to ensure zero defects." },
  { step: 5, title: "Installation & Support",    desc: "On-site commissioning and dedicated after-sales support." },
];

// ─── Why Choose Us ────────────────────────────────────────────────────────────
export const WHY_CHOOSE_US = [
  "Fully customized conveyor design",
  "High-quality, durable materials",
  "Reliable and efficient operation",
  "Competitive and transparent pricing",
  "On-time delivery, every time",
  "Dedicated after-sales support",
  "2+ years of industry experience",
];

// ─── Clients / Partners ───────────────────────────────────────────────────────
export const CLIENTS = [
  { name: "Accurate Engineering",   logo: null },
  { name: "Raph Technology Labs",   logo: null },
];
