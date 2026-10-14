/**
 * Throwaway: the page -> Unsplash search query + alt text mapping for the amkor demo.
 * Shared by _tmp-unsplash-fetch-pools.mjs and _tmp-unsplash-source.mjs.
 */

/** Per-page query + alt text. */
export const PAGE_PLAN = {
  '/': { query: 'semiconductor cleanroom factory', alt: 'Semiconductor manufacturing cleanroom' },

  // --- Packaging -----------------------------------------------------------
  '/Packaging': { query: 'microchip macro', alt: 'Close-up of an integrated circuit package' },
  '/Packaging/Laminate': {
    query: 'printed circuit board macro',
    alt: 'Laminate substrate circuitry detail',
  },
  '/Packaging/Leadframe': {
    query: 'electronic chip closeup',
    alt: 'Leadframe package on a circuit board',
  },
  '/Packaging/Power': { query: 'power electronics', alt: 'Power semiconductor components' },
  '/Packaging/Wafer-Level': {
    query: 'silicon wafer',
    alt: 'Silicon wafer used in wafer-level packaging',
  },
  '/Packaging/Memory': {
    query: 'computer memory module',
    alt: 'Memory modules on a circuit board',
  },
  '/Packaging/MEMS-and-Sensors': {
    query: 'electronic sensor module',
    alt: 'MEMS sensor components',
  },
  '/Packaging/System-in-Package-SiP': {
    query: 'microprocessor chip detail',
    alt: 'System-in-Package microelectronics detail',
  },

  // --- Technology ----------------------------------------------------------
  '/Technology': { query: 'semiconductor technology', alt: 'Advanced semiconductor technology' },

  // --- Services / Test / Quality -------------------------------------------
  '/Services': {
    query: 'semiconductor manufacturing equipment',
    alt: 'Semiconductor production line',
  },
  '/Services/Design-Services': {
    query: 'engineer cad design computer',
    alt: 'Engineer working on chip design software',
  },
  '/Services/Package-Characterization': {
    query: 'laboratory measurement instrument',
    alt: 'Package characterization laboratory equipment',
  },
  '/Services/Wafer-Bumping': { query: 'silicon wafer manufacturing', alt: 'Wafer bumping process' },
  '/Test-Services': {
    query: 'laboratory electronics',
    alt: 'Electronics test and measurement laboratory',
  },
  '/Quality': {
    query: 'precision inspection microscope',
    alt: 'Precision inspection under a microscope',
  },

  // --- Applications --------------------------------------------------------
  '/Applications': { query: 'technology devices', alt: 'Connected technology devices' },
  '/Applications/Artificial-Intelligence': {
    query: 'artificial intelligence data center',
    alt: 'AI data center compute hardware',
  },
  '/Applications/Automotive': {
    query: 'automotive electronics dashboard',
    alt: 'Automotive electronics and dashboard technology',
  },
  '/Applications/Communications': {
    query: 'telecom tower 5g',
    alt: '5G communications infrastructure',
  },
  '/Applications/Computing': {
    query: 'server room computing',
    alt: 'High-performance computing servers',
  },
  '/Applications/Consumer': {
    query: 'consumer electronics devices',
    alt: 'Consumer electronics devices',
  },
  '/Applications/Industrial': {
    query: 'industrial automation robotics factory',
    alt: 'Industrial automation and robotics',
  },
  '/Applications/Internet-of-Things': {
    query: 'internet of things smart devices',
    alt: 'Connected IoT smart devices',
  },
  '/Applications/Networking': {
    query: 'network switch data cables',
    alt: 'Networking equipment and data cabling',
  },

  // --- About Us ------------------------------------------------------------
  '/About-Us': { query: 'modern corporate office building', alt: 'Modern corporate headquarters' },
  '/About-Us/Amkor-Overview': {
    query: 'chip manufacturing',
    alt: 'Semiconductor factory floor',
  },
  '/About-Us/Company-History': {
    query: 'vintage electronics circuit',
    alt: 'Historic electronics technology',
  },
  '/About-Us/Mission': {
    query: 'business team collaboration',
    alt: 'Team collaborating on shared goals',
  },
  '/About-Us/Leadership': {
    query: 'boardroom meeting',
    alt: 'Leadership team in a boardroom',
  },
  '/About-Us/Corporate-Responsibility': {
    query: 'solar panels sustainability',
    alt: 'Renewable energy and sustainability',
  },
  '/About-Us/Memberships-and-Partnerships': {
    query: 'business partnership meeting',
    alt: 'Industry partnership meeting',
  },
  '/About-Us/Smart-Manufacturing-I40': {
    query: 'smart factory automation',
    alt: 'Smart manufacturing automation',
  },
  '/About-Us/Contact-Us': { query: 'office reception desk', alt: 'Corporate office reception' },
  '/About-Us/Customer-Center': {
    query: 'customer service office team',
    alt: 'Customer support team at work',
  },
  '/About-Us/Customer-Center/Amkor-Mechanical-Samples': {
    query: 'engineering components samples',
    alt: 'Mechanical sample components',
  },
  '/About-Us/Customer-Center/B2B-Integration-Services': {
    query: 'data server network',
    alt: 'B2B data integration systems',
  },
  '/About-Us/Customer-Center/Document-Library': {
    query: 'document archive shelves',
    alt: 'Technical document library',
  },

  // --- Careers -------------------------------------------------------------
  '/About-Us/Careers': { query: 'diverse team office', alt: 'Colleagues working together' },
  '/About-Us/Careers/China': { query: 'shanghai skyline', alt: 'Shanghai city skyline, China' },
  '/About-Us/Careers/France': { query: 'paris cityscape', alt: 'Paris cityscape, France' },
  '/About-Us/Careers/Germany': { query: 'munich germany city', alt: 'German cityscape' },
  '/About-Us/Careers/Japan': { query: 'tokyo skyline', alt: 'Tokyo skyline, Japan' },
  '/About-Us/Careers/Korea': { query: 'seoul south korea city', alt: 'Seoul skyline, South Korea' },
  '/About-Us/Careers/Malaysia': {
    query: 'kuala lumpur skyline',
    alt: 'Kuala Lumpur skyline, Malaysia',
  },
  '/About-Us/Careers/Philippines': {
    query: 'manila philippines city',
    alt: 'Manila cityscape, Philippines',
  },
  '/About-Us/Careers/Portugal': {
    query: 'lisbon portugal city',
    alt: 'Lisbon cityscape, Portugal',
  },
  '/About-Us/Careers/Singapore': { query: 'singapore skyline', alt: 'Singapore skyline' },
  '/About-Us/Careers/Taiwan': { query: 'taipei taiwan skyline', alt: 'Taipei skyline, Taiwan' },
  '/About-Us/Careers/United-States': {
    query: 'phoenix arizona city',
    alt: 'Arizona cityscape, United States',
  },
  '/About-Us/Careers/Vietnam': { query: 'hanoi vietnam city', alt: 'Vietnamese cityscape' },

  // --- News ----------------------------------------------------------------
  '/About-Us/News': { query: 'newsroom press media', alt: 'Newsroom and press media' },
  '/About-Us/News/Blog': { query: 'writing desk laptop', alt: 'Writing desk with laptop' },
  '/About-Us/News/Events': {
    query: 'business conference audience',
    alt: 'Industry conference session',
  },
  '/About-Us/News/Press-Releases': {
    query: 'newspaper press',
    alt: 'Press releases and newspapers',
  },
  '/About-Us/News/Press-Releases/Amkor-Technology-Announces-Strategic-Partnership-with-NVIDIA': {
    query: 'gpu data center hardware',
    alt: 'AI accelerator hardware in a data center',
  },
  '/About-Us/News/Press-Releases/Amkor-Technology-Reports-Financial-Results-for-the-Second-Quarter-2026':
    {
      query: 'financial charts stock market',
      alt: 'Financial results charts',
    },
  '/About-Us/News/Press-Releases/Amkor-Technology-Declares-Quarterly-Dividend': {
    query: 'investment growth chart',
    alt: 'Investment and dividend growth',
  },
};

/** Section prefixes whose children inherit the section query (each child gets a distinct photo). */
export const INHERIT_PREFIXES = [
  '/Packaging/Laminate/',
  '/Packaging/Leadframe/',
  '/Packaging/Power/',
  '/Packaging/Wafer-Level/',
  '/Technology/',
];

/**
 * Sections with more children than a single 30-result query can cover without
 * repetition get extra fallback queries appended to their candidate pool.
 */
export const EXTRA_QUERIES = {
  'printed circuit board macro': ['circuit board detail', 'electronics substrate'],
  'electronic chip closeup': ['microchip circuit', 'integrated circuit board'],
  'power electronics': ['electrical components', 'power supply circuit', 'transistor electronics'],
  'silicon wafer': ['semiconductor wafer'],
  'semiconductor technology': ['microchip technology', 'nanotechnology circuit', 'computer chip'],
};

const titleize = (segment) => segment.replace(/-/g, ' ');

/** Resolve the query + alt for a page path, or null when unmapped. */
export function planFor(pagePath) {
  if (PAGE_PLAN[pagePath]) return { ...PAGE_PLAN[pagePath] };
  const prefix = INHERIT_PREFIXES.find((p) => pagePath.startsWith(p));
  if (!prefix) return null;
  const parent = PAGE_PLAN[prefix.slice(0, -1)];
  const leaf = titleize(pagePath.split('/').pop());
  return { query: parent.query, alt: `${leaf} — ${parent.alt.toLowerCase()}` };
}

/** Every distinct query we need a candidate pool for. */
export const QUERIES = [
  ...new Set([
    ...Object.values(PAGE_PLAN).map((p) => p.query),
    ...Object.values(EXTRA_QUERIES).flat(),
  ]),
];
