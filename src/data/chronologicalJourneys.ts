/**
 * Chronological Journeys Dataset for travel.varneet.in
 * Ordered strictly by physical travel dates (January 2023 → January 2026).
 * Altitude in meters drives the opening sequence road elevation profile.
 */

export interface ChronologicalJourney {
  id: number;
  chronologicalIndex: number;
  slug: string;
  title: string;
  destination: string;
  region: string;
  state: 'HP' | 'KA' | 'UP' | 'RJ';
  year: number;
  dates: string;
  season: string;
  altitudeMeters: number;
  altitudeFormatted: string;
  // Normalized 0.0 to 1.0 elevation for the bezier road profile (15m -> ~0.05, 3450m -> 1.0)
  elevationNormalized: number;
  lat: number;
  lng: number;
  coverImage: string;
  summary: string;
  highlights: string[];
  role: 'Participant' | 'Trip Leader' | 'Solo Explorer' | 'Friend Road Trip';
  groupType: 'With Raw Diaries' | 'Solo' | 'With Friends' | 'Raw Diaries OG Gang';
  tags: string[];
}

export const chronologicalJourneys: ChronologicalJourney[] = [
  {
    id: 1,
    chronologicalIndex: 1,
    slug: 'gokarna-2023',
    title: 'Gokarna: The First Journey',
    destination: 'Gokarna',
    region: 'Karnataka Coast',
    state: 'KA',
    year: 2023,
    dates: 'January 2023',
    season: 'Winter 2023',
    altitudeMeters: 15,
    altitudeFormatted: '15m',
    elevationNormalized: 0.05,
    lat: 14.5479,
    lng: 74.3188,
    coverImage: '/images/journeys/gokarna/gokarna-1.jpg',
    summary: 'The trip where the road began. Wandering along Kudle beach and Om beach cliff paths, ocean sunsets, and learning the rhythm of travel with a group.',
    highlights: ['First ever journey with Raw Diaries', 'Cliff trails between Kudle and Paradise beach', 'Temple lanes and coastal sea breezes'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#first-trip', '#arabian-sea', '#raw-diaries', '#coast']
  },
  {
    id: 2,
    chronologicalIndex: 2,
    slug: 'bir-billing',
    title: 'Bir Billing: First Taste of Himachal',
    destination: 'Bir Billing',
    region: 'Kangra Valley, Himachal Pradesh',
    state: 'HP',
    year: 2023,
    dates: 'April 2023',
    season: 'Spring 2023',
    altitudeMeters: 2400,
    altitudeFormatted: '2,400m',
    elevationNormalized: 0.70,
    lat: 32.0428,
    lng: 76.7221,
    coverImage: '/images/bir/bir-hero.jpg',
    summary: 'First time entering the Dhauladhar foothills. Monasteries in the Tibetan colony, tea garden sunsets, and the high ridge of Billing.',
    highlights: ['Sunset at the Billing landing site', 'Chokling and Palpung Sherabling monasteries', 'Quiet tea garden footpath walks'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#dhauladhar', '#first-himachal', '#raw-diaries', '#monasteries']
  },
  {
    id: 3,
    chronologicalIndex: 3,
    slug: 'chitkul-kinnaur',
    title: 'Chitkul: The Last Village of Kinnaur',
    destination: 'Chitkul & Sangla',
    region: 'Kinnaur, Himachal Pradesh',
    state: 'HP',
    year: 2023,
    dates: 'June 2023',
    season: 'Summer 2023',
    altitudeMeters: 3450,
    altitudeFormatted: '3,450m',
    elevationNormalized: 1.00,
    lat: 31.3533,
    lng: 78.4354,
    coverImage: '/images/journeys/chitkul/chitkul-3.jpg',
    summary: 'Traversing the Sutlej and Baspa river valleys to reach the last inhabited Indian village near the border. Wooden houses and turquoise glacier melt.',
    highlights: ['Baspa river gravel banks in Chitkul', 'Centuries-old wooden temples of Sangla', 'Granite cliffs and apple orchards'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#kinnaur', '#border-village', '#raw-diaries', '#baspa-river']
  },
  {
    id: 4,
    chronologicalIndex: 4,
    slug: 'jibhi-seraj-2023',
    title: 'Jibhi 2.0: Cedar Cabins & Waterfalls',
    destination: 'Jibhi',
    region: 'Seraj Valley, Himachal Pradesh',
    state: 'HP',
    year: 2023,
    dates: 'July 2023',
    season: 'Monsoon 2023',
    altitudeMeters: 1600,
    altitudeFormatted: '1,600m',
    elevationNormalized: 0.46,
    lat: 31.6373,
    lng: 77.3475,
    coverImage: '/images/journeys/jibhi-2023/jibhi-2023-3.jpg',
    summary: 'Monsoon lushness in the Seraj valley. Rain dripping from pine eaves, morning walks along rushing trout streams, and wooden homestay evenings.',
    highlights: ['Mist-shrouded cedar canopies', 'Local trout stream strolls', 'Kathkuni village hamlets'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#seraj-valley', '#monsoon-greens', '#raw-diaries', '#pine-woods']
  },
  {
    id: 5,
    chronologicalIndex: 5,
    slug: 'manali-sissu-winter',
    title: 'Manali & Sissu: Through the Snow Tunnel',
    destination: 'Manali & Sissu',
    region: 'Kullu & Lahaul Valley, Himachal Pradesh',
    state: 'HP',
    year: 2024,
    dates: 'January 2024',
    season: 'Deep Winter 2024',
    altitudeMeters: 3120,
    altitudeFormatted: '3,120m',
    elevationNormalized: 0.90,
    lat: 32.2432,
    lng: 77.1892,
    coverImage: '/images/journeys/manali-sissu/manali-sissu-2.jpg',
    summary: 'Deep winter journey through the Atal Tunnel into glaciated Sissu, and unhurried spring thaw days in Old Manali.',
    highlights: ['Traversing the Atal Tunnel into frozen Lahaul', 'Sissu waterfall encased in blue ice', 'Silent deodar trails in Old Manali'],
    role: 'Friend Road Trip',
    groupType: 'With Friends',
    tags: ['#atal-tunnel', '#sissu-snow', '#lahaul-winter', '#frozen-falls']
  },
  {
    id: 6,
    chronologicalIndex: 6,
    slug: 'banaras-ghats',
    title: 'Banaras: River Ghats & Dawn Light',
    destination: 'Varanasi',
    region: 'Ganga Plains, Uttar Pradesh',
    state: 'UP',
    year: 2024,
    dates: '16–20 February 2024',
    season: 'Late Winter 2024',
    altitudeMeters: 80,
    altitudeFormatted: '80m',
    elevationNormalized: 0.08,
    lat: 25.3176,
    lng: 82.9739,
    coverImage: '/images/journeys/banaras/banaras-3.jpg',
    summary: 'Rowing past ancient stone ghats at 5:30 AM, labyrinthine silk alleys, and floating diyas on the eternal river.',
    highlights: ['Dawn wooden boat crossing past Assi to Manikarnika', 'Blue lassi in alleyways older than history', 'Evening Ganga aarti bells'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#varanasi', '#ganga-ghats', '#ancient-alleys', '#dawn-rowing']
  },
  {
    id: 7,
    chronologicalIndex: 7,
    slug: 'lucknow-heritage',
    title: 'Lucknow: Solo in the City of Nawabs',
    destination: 'Lucknow',
    region: 'Awadh, Uttar Pradesh',
    state: 'UP',
    year: 2024,
    dates: '21–22 February 2024',
    season: 'Late Winter 2024',
    altitudeMeters: 120,
    altitudeFormatted: '120m',
    elevationNormalized: 0.10,
    lat: 26.8467,
    lng: 80.9462,
    coverImage: '/images/journeys/lucknow/lucknow-1.jpg',
    summary: 'Two solitary days wandering past the grand arches of Rumi Darwaza and the sunlit stone terrace of Bara Imambara.',
    highlights: ['Acoustic exploration of Bhool Bhulaiya', 'Sun setting behind the Rumi Darwaza', 'Tunday kababi in old Chowk'],
    role: 'Solo Explorer',
    groupType: 'Solo',
    tags: ['#lucknow', '#nawabi-architecture', '#solo-walks', '#chowk']
  },
  {
    id: 8,
    chronologicalIndex: 8,
    slug: 'manali-spring-thaw',
    title: 'Manali: Spring Thaw with Raw Diaries',
    destination: 'Old Manali',
    region: 'Kullu Valley, Himachal Pradesh',
    state: 'HP',
    year: 2024,
    dates: 'March 2024',
    season: 'Early Spring 2024',
    altitudeMeters: 2050,
    altitudeFormatted: '2,050m',
    elevationNormalized: 0.59,
    lat: 32.2530,
    lng: 77.1800,
    coverImage: '/images/journeys/manali-spring/manali-spring-3.jpg',
    summary: 'Snow melting from the high ridges, apple orchards beginning to bud, and unhurried days spent sharing stories across wooden floorboards.',
    highlights: ['Fresh apple blossom scents along the trail', 'Cozy evenings at cafes listening to acoustic sets', 'Spring melting water filling the Manalsu nallah'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#old-manali', '#spring-thaw', '#raw-diaries', '#apple-blossoms']
  },
  {
    id: 9,
    chronologicalIndex: 9,
    slug: 'shangarh-meadows',
    title: 'Shangarh: Secret Alpine Meadow',
    destination: 'Shangarh',
    region: 'Sainj Valley, Himachal Pradesh',
    state: 'HP',
    year: 2024,
    dates: '11–13 May 2024',
    season: 'Spring 2024',
    altitudeMeters: 2100,
    altitudeFormatted: '2,100m',
    elevationNormalized: 0.61,
    lat: 31.7686,
    lng: 77.3789,
    coverImage: '/images/shangarh/shangarh-1.jpg',
    summary: 'A hidden alpine bowl in the Great Himalayan National Park fringe. Unhurried days beside the Sangchul Mahadev temple tower.',
    highlights: ['Vast emerald lawn untouched by motor vehicles', 'Timber tower temples of Sangchul Mahadev', 'Evening golden light across the deodar ridge'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#shangarh-meadows', '#sainj-valley', '#ghnp', '#temple-towers']
  },
  {
    id: 10,
    chronologicalIndex: 10,
    slug: 'jibhi-trip-leader',
    title: 'Jibhi: Stepping Up as Trip Leader',
    destination: 'Jibhi & Bahu',
    region: 'Seraj Valley, Himachal Pradesh',
    state: 'HP',
    year: 2024,
    dates: '19–21 June 2024',
    season: 'Early Summer 2024',
    altitudeMeters: 1750,
    altitudeFormatted: '1,750m',
    elevationNormalized: 0.51,
    lat: 31.6200,
    lng: 77.3350,
    coverImage: '/images/journeys/jibhi-leader/jibhi-leader-1.jpg',
    summary: 'A milestone transition from traveler to trip leader. Guiding a full group through the Seraj valley, coordinating logistics, and creating a safe, warm space.',
    highlights: ['First journey leading travelers in the mountains', 'Group hike up to the hidden meadow of Bahu', 'Shared meals and circle conversations around the hearth'],
    role: 'Trip Leader',
    groupType: 'With Raw Diaries',
    tags: ['#trip-leader', '#community', '#bahu-meadow', '#leadership']
  },
  {
    id: 11,
    chronologicalIndex: 11,
    slug: 'jibhi-nye-gang',
    title: 'Jibhi NYE: Reunion of the OG Gang',
    destination: 'Jibhi',
    region: 'Seraj Valley, Himachal Pradesh',
    state: 'HP',
    year: 2024,
    dates: '29–31 December 2024',
    season: 'Winter NYE 2024',
    altitudeMeters: 1600,
    altitudeFormatted: '1,600m',
    elevationNormalized: 0.46,
    lat: 31.5950,
    lng: 77.3550,
    coverImage: '/images/journeys/jibhi-nye/jibhi-nye-1.jpg',
    summary: 'Closing out 2024 in the mountains with the core Raw Diaries tribe. Free of commercial hosting pressures—just old friends, cold starlight, and laughter.',
    highlights: ['Ring of friends beneath freezing mountain constellations', 'Woodsmoke and tandoor potatoes by the river', 'No agenda, just deep companionship'],
    role: 'Participant',
    groupType: 'Raw Diaries OG Gang',
    tags: ['#nye-2024', '#og-gang', '#mountain-winter', '#raw-diaries-tribe']
  },
  {
    id: 12,
    chronologicalIndex: 12,
    slug: 'shoja-jalori',
    title: 'Shojha: Solitude at Jalori Pass',
    destination: 'Shojha & Jalori Pass',
    region: 'Seraj Valley, Himachal Pradesh',
    state: 'HP',
    year: 2025,
    dates: '11–14 May 2025',
    season: 'Spring 2025',
    altitudeMeters: 3120,
    altitudeFormatted: '3,120m',
    elevationNormalized: 0.90,
    lat: 31.5356,
    lng: 77.3992,
    coverImage: '/images/shoja/shoja-4.jpg',
    summary: 'Solo retreat into high deodar heights. Walking the windy ridge of Jalori Pass (3,120m) to sacred Serolsar Lake alone with a book.',
    highlights: ['Solo walk along the ridge of Jalori Pass', 'Reflection at the emerald water of Serolsar Lake', 'Balcony reading hours watching clouds pass below'],
    role: 'Solo Explorer',
    groupType: 'Solo',
    tags: ['#jalori-pass', '#serolsar-lake', '#solo-trail', '#high-ridge']
  },
  {
    id: 13,
    chronologicalIndex: 13,
    slug: 'rajasthan-roadtrip',
    title: 'Rajasthan: A Two-Week Desert Traverse',
    destination: 'Jodhpur, Jaisalmer & Udaipur',
    region: 'Thar Desert, Rajasthan',
    state: 'RJ',
    year: 2025,
    dates: 'November 2025',
    season: 'Autumn 2025',
    altitudeMeters: 225,
    altitudeFormatted: '225m',
    elevationNormalized: 0.12,
    lat: 26.9157,
    lng: 70.9083,
    coverImage: '/images/journeys/rajasthan/rajasthan-1.jpg',
    summary: 'Fourteen days in a car across the desert ribbon. Starlit sand dunes in Sam, blue labyrinth of Jodhpur, and marble ghats of Udaipur.',
    highlights: ['Sleeping under open galaxies in the Thar dunes', 'Early morning walk through Jodhpur blue city', 'Sunset over Lake Pichola'],
    role: 'Friend Road Trip',
    groupType: 'With Friends',
    tags: ['#rajasthan-roadtrip', '#thar-desert', '#jaisalmer-dunes', '#udaipur-ghats']
  },
  {
    id: 14,
    chronologicalIndex: 14,
    slug: 'nye-bir-2026',
    title: 'NYE in Bir: Paragliders & Bonfires',
    destination: 'Bir Billing',
    region: 'Kangra Valley, Himachal Pradesh',
    state: 'HP',
    year: 2026,
    dates: '30 Dec 2025 – 1 Jan 2026',
    season: 'Winter NYE 2026',
    altitudeMeters: 2400,
    altitudeFormatted: '2,400m',
    elevationNormalized: 0.70,
    lat: 32.0510,
    lng: 76.7140,
    coverImage: '/images/journeys/bir-nye/bir-nye-1.jpg',
    summary: 'Welcoming 2026 where my Himalayan journeys began. Paragliders painting the winter twilight, cedar wood fires, and reflections on 3 years of road life.',
    highlights: ['Golden hour paraglider silhouette landings', 'Acoustic sessions around the cedar bonfire', 'Completing a full 3-year circle of mountain travel'],
    role: 'Participant',
    groupType: 'With Raw Diaries',
    tags: ['#bir-nye-2026', '#dhauladhar-skies', '#bonfire-circle', '#full-circle']
  }
];

/**
 * Generate an SVG path string representing the rising and falling road based on altitudes.
 * Width: total width (e.g. 1800), Height: total height (e.g. 400).
 * Lower elevation places road near bottom (y ~ 340), higher altitude lifts road near top (y ~ 80).
 */
export function generateElevationRoadPath(width = 1800, baseHeight = 400, roadMarginY = 60): {
  path: string;
  milestones: Array<{ x: number; y: number; journey: ChronologicalJourney }>;
} {
  const count = chronologicalJourneys.length;
  const stepX = (width - 160) / (count - 1);
  const startX = 80;

  const points = chronologicalJourneys.map((j, i) => {
    const x = Math.round(startX + i * stepX);
    // Invert normalized elevation: 1.0 (highest) -> road is at top (min Y), 0.0 (lowest) -> road is at bottom (max Y)
    const y = Math.round(baseHeight - roadMarginY - j.elevationNormalized * (baseHeight - roadMarginY * 2));
    return { x, y, journey: j };
  });

  // Build a smooth cubic bezier path connecting all points
  let d = `M ${points[0].x - 100},${points[0].y + 10} C ${points[0].x - 50},${points[0].y + 5} ${points[0].x - 20},${points[0].y} ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = Math.round(p0.x + (p1.x - p0.x) * 0.45);
    const cpY1 = p0.y;
    const cpX2 = Math.round(p0.x + (p1.x - p0.x) * 0.55);
    const cpY2 = p1.y;
    d += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
  }

  // Extend road past the last point
  const last = points[points.length - 1];
  d += ` C ${last.x + 40},${last.y} ${last.x + 80},${last.y - 10} ${last.x + 150},${last.y - 20}`;

  return {
    path: d,
    milestones: points
  };
}
