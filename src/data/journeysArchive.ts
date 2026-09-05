export interface JourneyRecord {
  id: number;
  slug: string;
  title: string;
  destination: string;
  region: string;
  year: number;
  dates: string;
  monthYear: string;
  role: 'Participant' | 'Trip Leader' | 'Solo Explorer' | 'Friend Road Trip';
  groupType: 'With Raw Diaries' | 'Solo' | 'With Friends' | 'Raw Diaries OG Gang';
  coverImage?: string;
  journalSlug?: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export function getTripTravelStyle(trip?: { groupType?: string; role?: string } | null): 'With Friends' | 'With Raw Diaries' | 'Solo' {
  if (!trip) return 'With Raw Diaries';
  const g = (trip.groupType || '').toLowerCase();
  const r = (trip.role || '').toLowerCase();
  if (g.includes('solo') || r.includes('solo')) return 'Solo';
  if (g.includes('friend') || r.includes('friend')) return 'With Friends';
  return 'With Raw Diaries';
}

export const journeysArchive: JourneyRecord[] = [
  {
    id: 1,
    slug: 'gokarna-2023',
    title: 'Gokarna: The First Journey',
    destination: 'Gokarna',
    region: 'Karnataka Coast',
    year: 2023,
    dates: 'January 2023',
    monthYear: 'Jan 2023',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/gokarna/gokarna-1.jpg',
    journalSlug: 'gokarna-2023',
    summary: 'The trip where the road began. Wandering along Kudle beach and Om beach cliff paths, ocean sunsets, and learning the rhythm of travel with a group.',
    highlights: ['First ever journey with Raw Diaries', 'Cliff trails between Kudle and Paradise beach', 'Temple lanes and coastal sea breezes'],
    tags: ['#first-trip', '#arabian-sea', '#raw-diaries', '#coast']
  },
  {
    id: 2,
    slug: 'bir-2023',
    title: 'Bir Billing: First Taste of Himachal',
    destination: 'Bir Billing',
    region: 'Kangra Valley, Himachal Pradesh',
    year: 2023,
    dates: 'April 2023',
    monthYear: 'Apr 2023',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/bir/bir-hero.jpg',
    journalSlug: 'bir-billing',
    summary: 'First time entering the Dhauladhar foothills. Monasteries in the Tibetan colony, tea garden sunsets, and the high ridge of Billing.',
    highlights: ['Sunset at the Billing landing site', 'Chokling and Palpung Sherabling monasteries', 'Quiet tea garden footpath walks'],
    tags: ['#dhauladhar', '#first-himachal', '#raw-diaries', '#monasteries']
  },
  {
    id: 3,
    slug: 'chitkul-2023',
    title: 'Chitkul: The Last Village of Kinnaur',
    destination: 'Chitkul & Sangla',
    region: 'Kinnaur, Himachal Pradesh',
    year: 2023,
    dates: 'June 2023',
    monthYear: 'Jun 2023',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/chitkul/chitkul-3.jpg',
    journalSlug: 'chitkul-kinnaur',
    summary: 'Traversing the Sutlej and Baspa river valleys to reach the last inhabited Indian village near the border. Wooden houses and turquoise glacier melt.',
    highlights: ['Baspa river gravel banks in Chitkul', 'Centuries-old wooden temples of Sangla', 'Granite cliffs and apple orchards'],
    tags: ['#kinnaur', '#border-village', '#raw-diaries', '#baspa-river']
  },
  {
    id: 4,
    slug: 'jibhi-2023',
    title: 'Jibhi 2.0: Cedar Cabins & Waterfalls',
    destination: 'Jibhi',
    region: 'Seraj Valley, Himachal Pradesh',
    year: 2023,
    dates: 'July 2023',
    monthYear: 'Jul 2023',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/jibhi-2023/jibhi-2023-3.jpg',
    journalSlug: 'jibhi-seraj-2023',
    summary: 'Monsoon lushness in the Seraj valley. Rain dripping from pine eaves, morning walks along rushing trout streams, and wooden homestay evenings.',
    highlights: ['Mist-shrouded cedar canopies', 'Local trout stream strolls', 'Kathkuni village hamlets'],
    tags: ['#seraj-valley', '#monsoon-greens', '#raw-diaries', '#pine-woods']
  },
  {
    id: 5,
    slug: 'manali-sissu-2024',
    title: 'Manali & Sissu: Through the Snow Tunnel',
    destination: 'Manali & Sissu',
    region: 'Kullu & Lahaul Valley, HP',
    year: 2024,
    dates: 'January 2024',
    monthYear: 'Jan 2024',
    role: 'Friend Road Trip',
    groupType: 'With Friends',
    coverImage: '/images/journeys/manali-sissu/manali-sissu-2.jpg',
    journalSlug: 'manali-sissu-winter',
    summary: 'A deep winter journey with Sahaj. Passing through the Atal Tunnel from snow-dusted Old Manali into the freezing glaciated starkness of Sissu.',
    highlights: ['Frozen Sissu waterfall', 'Stark white Lahaul valley landscape', 'Winter wood fires in Old Manali'],
    tags: ['#winter-snow', '#lahaul', '#with-sahaj', '#atal-tunnel']
  },
  {
    id: 6,
    slug: 'banaras-2024',
    title: 'Banaras: River Ghats & Dawn Light',
    destination: 'Varanasi',
    region: 'Uttar Pradesh',
    year: 2024,
    dates: '16–20 February 2024',
    monthYear: 'Feb 2024',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/banaras/banaras-3.jpg',
    journalSlug: 'banaras-ghats',
    summary: 'Five days along the eternal river. Rowing past ancient stone ghats at 5:30 AM, exploring labyrinthine silk alleyways, and the quiet rhythm of the evening river.',
    highlights: ['Sunrise rowboat on the Ganga', 'Assi to Manikarnika walking trail', 'Kachori and malaiyo in Thatheri Bazaar'],
    tags: ['#varanasi', '#ganga-ghats', '#raw-diaries', '#old-city']
  },
  {
    id: 7,
    slug: 'lucknow-2024',
    title: 'Lucknow: Solo in the City of Nawabs',
    destination: 'Lucknow',
    region: 'Uttar Pradesh',
    year: 2024,
    dates: '21–22 February 2024',
    monthYear: 'Feb 2024',
    role: 'Solo Explorer',
    groupType: 'Solo',
    coverImage: '/images/journeys/lucknow/lucknow-1.jpg',
    journalSlug: 'lucknow-heritage',
    summary: 'Detouring on my own for two quiet days. Walking past the grand archways of Rumi Darwaza, the whispers of Bara Imambara, and old tea houses.',
    highlights: ['Solo walk through Hazratganj and old Chowk', 'Bara Imambara labyrinth corridor', 'Street food reflections and chai stalls'],
    tags: ['#solo-travel', '#awadh-heritage', '#architecture', '#food-walks']
  },
  {
    id: 8,
    slug: 'manali-spring-2024',
    title: 'Manali: Spring Thaw with Raw Diaries',
    destination: 'Old Manali',
    region: 'Kullu Valley, Himachal Pradesh',
    year: 2024,
    dates: 'March 2024',
    monthYear: 'Mar 2024',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/manali-spring/manali-spring-3.jpg',
    journalSlug: 'manali-spring-thaw',
    summary: 'Snow melting from the high ridges, apple orchards beginning to bud, and unhurried days spent sharing stories across wooden floorboards.',
    highlights: ['Spring thaw walking trails to Goshal village', 'Quiet cafes in Old Manali', 'Snowy Solang ridge views'],
    tags: ['#spring-thaw', '#old-manali', '#raw-diaries', '#kullu']
  },
  {
    id: 9,
    slug: 'shangarh-secret-2024',
    title: 'Shangarh: The Secret Meadow Retreat',
    destination: 'Shangarh',
    region: 'Sainj Valley, Himachal Pradesh',
    year: 2024,
    dates: '11–13 May 2024',
    monthYear: 'May 2024',
    role: 'Participant',
    groupType: 'With Raw Diaries',
    coverImage: '/images/shangarh/shangarh-1.jpg',
    journalSlug: 'shangarh-meadows',
    summary: 'A secret gathering in the hidden alpine bowl of Sainj. Three unhurried days sitting on the grass beneath the Sangchul Mahadev temple tower.',
    highlights: ['Vast green meadow untouched by roads', 'Traditional Kathkuni temple architecture', 'Evening temple bells across the valley'],
    tags: ['#secret-trip', '#shangarh', '#sainj-valley', '#raw-diaries']
  },
  {
    id: 10,
    slug: 'jibhi-leader-2024',
    title: 'Jibhi: Stepping Up as Trip Leader',
    destination: 'Jibhi & Bahu',
    region: 'Seraj Valley, Himachal Pradesh',
    year: 2024,
    dates: '19–21 June 2024',
    monthYear: 'Jun 2024',
    role: 'Trip Leader',
    groupType: 'With Raw Diaries',
    coverImage: '/images/journeys/jibhi-leader/jibhi-leader-1.jpg',
    journalSlug: 'jibhi-trip-leader',
    summary: 'A milestone transition from traveler to trip leader. Guiding a full group through the Seraj valley, coordinating logistics, and creating a safe, warm space.',
    highlights: ['First trip leading for Raw Diaries', 'Guiding travelers to hidden waterfalls', 'Managing group rhythm and mountain hosting'],
    tags: ['#trip-leader', '#community', '#milestone', '#raw-diaries']
  },
  {
    id: 11,
    slug: 'jibhi-nye-2024',
    title: 'Jibhi NYE: Reunion of the OG Gang',
    destination: 'Jibhi',
    region: 'Seraj Valley, Himachal Pradesh',
    year: 2024,
    dates: '29–31 December 2024',
    monthYear: 'Dec 2024',
    role: 'Participant',
    groupType: 'Raw Diaries OG Gang',
    coverImage: '/images/journeys/jibhi-nye/jibhi-nye-1.jpg',
    journalSlug: 'jibhi-nye-gang',
    summary: 'Closing out 2024 in the mountains with the core Raw Diaries tribe. Free of commercial hosting pressures—just old friends, cold starlight, and laughter.',
    highlights: ['New Year’s Eve beneath freezing deodars', 'Reunion of the original travel gang', 'Woodstove conversations into the night'],
    tags: ['#nye-2024', '#og-gang', '#winter-escape', '#friends']
  },
  {
    id: 12,
    slug: 'shojha-solo-2025',
    title: 'Shojha: Four Days of Pure Solitude',
    destination: 'Shojha & Jalori Pass',
    region: 'Seraj Valley, Himachal Pradesh',
    year: 2025,
    dates: '11–14 May 2025',
    monthYear: 'May 2025',
    role: 'Solo Explorer',
    groupType: 'Solo',
    coverImage: '/images/shoja/shoja-4.jpg',
    journalSlug: 'shoja-jalori',
    summary: 'A deliberate solo retreat into the cedar heights of Shojha. Walking the windy ridge of Jalori Pass to the sacred Serolsar Lake alone with a book.',
    highlights: ['Solo crossing of Jalori Pass (3,120m)', 'Quiet forest walk to Serolsar Lake', 'Unhurried diary reflections in wooden homestay'],
    tags: ['#solo-retreat', '#shojha', '#jalori-pass', '#silence']
  },
  {
    id: 13,
    slug: 'rajasthan-roadtrip-2025',
    title: 'Rajasthan: A Two-Week Desert Traverse',
    destination: 'Rajasthan Circuit',
    region: 'Rajasthan',
    year: 2025,
    dates: 'November 2025',
    monthYear: 'Nov 2025',
    role: 'Friend Road Trip',
    groupType: 'With Friends',
    coverImage: '/images/journeys/rajasthan/rajasthan-1.jpg',
    journalSlug: 'rajasthan-roadtrip',
    summary: 'Two full weeks on the road with two close friends. Traversing sand dunes, historic sandstone forts, roadside dhabas, and golden desert sunsets.',
    highlights: ['14 unhurried days across desert highways', 'Sunsets over ancient sandstone ramparts', 'Campfires under starry Thar desert skies'],
    tags: ['#rajasthan', '#2-week-roadtrip', '#with-friends', '#desert']
  },
  {
    id: 14,
    slug: 'nye-2026',
    title: 'New Year 2026: The Long Way Home',
    destination: 'Himachal Foothills',
    region: 'Himachal Pradesh',
    year: 2026,
    dates: 'January 2026',
    monthYear: 'Jan 2026',
    role: 'Participant',
    groupType: 'With Friends',
    coverImage: '/images/journeys/nye-2026/nye-2026-1.jpg',
    journalSlug: 'nye-bir-2026',
    summary: 'Welcoming 2026 in the cold mountain air. Three years after that first nervous step in Gokarna, the road has become second nature.',
    highlights: ['Ring in 2026 with mountain air', 'Reflecting on 3 full years of travel', 'Marking 14 journeys across India'],
    tags: ['#nye-2026', '#3-years-travel', '#the-long-way-home']
  }
];
