export interface Itinerary {
  slug: string;
  title: string;
  duration: string;
  region: string;
  price: string;
  overview: string;
  highlights: string[];
  days: {
    day: string;
    title: string;
    description: string;
  }[];
  practicalNotes: string[];
}

export const itineraries: Itinerary[] = [
  {
    slug: 'spiti-valley-circuit',
    title: 'Spiti Valley Complete Circuit via Shimla & Manali',
    duration: '9 Days',
    region: 'Himachal Pradesh',
    price: '₹59',
    overview: 'A balanced acclimatization route starting from Shimla through Kinnaur, entering Spiti via Tabo and Kaza, and exiting over Kunzum Pass to Manali.',
    highlights: [
      'Gradual elevation gain to avoid acute mountain sickness (AMS)',
      'Homestays in Langza, Komic, and Dhankar',
      'Timing guide for Kunzum Pass and Rohtang crossing'
    ],
    days: [
      {
        day: 'Day 1–2',
        title: 'Shimla to Kalpa via Narkanda',
        description: 'Drive along the Sutlej river gorge. Stop at Sarahan for the Bhimakali temple before staying the night overlooking Kinner Kailash.'
      },
      {
        day: 'Day 3',
        title: 'Kalpa to Tabo',
        description: 'Crossing into Spiti district. Stop at Nako lake and Gue village to see the preserved mummy. Arrive in Tabo by late afternoon.'
      },
      {
        day: 'Day 4–5',
        title: 'Tabo, Dhankar, and Kaza',
        description: 'Explore the 1000-year-old mud monastery at Tabo and hike to Dhankar Lake. Base in Kaza for high village loops (Hikkim, Komic, Langza).'
      },
      {
        day: 'Day 6–7',
        title: 'Kaza to Chandratal via Kunzum Pass',
        description: 'Ascend to Kunzum La (4,551m) and take the rugged diversion to Chandratal Lake. Night camping under high-altitude starlight.'
      },
      {
        day: 'Day 8–9',
        title: 'Chandratal to Manali and return',
        description: 'Traverse the Batal-Gramphu riverbed road, enter the Atal Tunnel, and descend to Manali.'
      }
    ],
    practicalNotes: [
      'Best travel window: Mid-June to early October.',
      'Cash is essential: Kaza has only two ATMs that frequently run dry.',
      'Offline maps: Download before leaving Reckong Peo.'
    ]
  },
  {
    slug: 'parvati-grahan-trail',
    title: 'Parvati Valley: Chalal, Grahan & Pulga Slow Route',
    duration: '5 Days',
    region: 'Himachal Pradesh',
    price: '₹59',
    overview: 'A quieter alternative to the crowded party strips of Parvati. Focuses on trail walks, pine forests, and village homestays.',
    highlights: [
      'Forest walk from Kasol to the isolated village of Grahan',
      'Fairy Forest trails in Pulga',
      'Low daily budget, zero vehicular noise'
    ],
    days: [
      {
        day: 'Day 1',
        title: 'Arrival in Kasol & walk to Chalal',
        description: 'Cross the suspension bridge over the Parvati river and set up at a quiet guesthouse in Chalal.'
      },
      {
        day: 'Day 2',
        title: 'Trek to Grahan Village',
        description: 'A 9km moderate trek along Grahan nallah through rhododendron and pine woods. No mobile network; traditional wooden architecture.'
      },
      {
        day: 'Day 3',
        title: 'Grahan to Pulga via Manikaran',
        description: 'Descend to Kasol, take a shared cab past Manikaran and Barshaini, then walk up through apple orchards to Pulga.'
      },
      {
        day: 'Day 4–5',
        title: 'Fairy Forest & Kalga trail',
        description: 'Quiet mornings with local tea, walks through the moss-covered pine forest, and sunset across the valley in Kalga.'
      }
    ],
    practicalNotes: [
      'Pack light: all villages past Barshaini require foot travel.',
      'Respect village customs: photography of sacred village temples is strictly prohibited.',
      'Carry your own trash back down to Kasol.'
    ]
  },
  {
    slug: 'tirthan-gnhp-retreat',
    title: 'Tirthan Valley & Great Himalayan National Park Walks',
    duration: '4 Days',
    region: 'Himachal Pradesh',
    price: '₹59',
    overview: 'Clean riverbanks, trout streams, and day hikes along the buffer zone of the UNESCO World Heritage Great Himalayan National Park.',
    highlights: [
      'Pekhri to Ropa forest day hike',
      'Riverside stays along the Tirthan river',
      'Jalori Pass & Serolsar Lake day trip'
    ],
    days: [
      {
        day: 'Day 1',
        title: 'Aut to Gushaini',
        description: 'Leave the highway at Aut tunnel and follow the winding river road into Tirthan. Settle into a riverside homestay.'
      },
      {
        day: 'Day 2',
        title: 'GHNP Gate Hike',
        description: 'A scenic 8km walk from Gushaini to the eco-zone entrance of the national park, passing through traditional stone-and-timber hamlets.'
      },
      {
        day: 'Day 3',
        title: 'Jalori Pass & Serolsar Lake',
        description: 'Drive up to Jalori Pass (3,120m) and hike 5km through oak and spruce forests to the sacred lake.'
      },
      {
        day: 'Day 4',
        title: 'Chhoie Waterfall & departure',
        description: 'Short morning hike to Chhoie waterfall before heading back toward Chandigarh or Delhi.'
      }
    ],
    practicalNotes: [
      'Permits: Required at the park gate for entering the core zone.',
      'Weather: Evenings get cold even in May/June; carry a fleece layer.'
    ]
  }
];
