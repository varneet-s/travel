export interface ItineraryDay {
  day: string;
  title: string;
  narrative: string;
  distanceOrTime: string;
  stayTip: string;
}

export interface Itinerary {
  slug: string;
  title: string;
  duration: string;
  region: string;
  bestSeason: string;
  elevation: string;
  lastUpdated: string;
  image: string;
  gallery: string[];
  moodTags: string[];
  overview: string;
  trailCompanionBook?: {
    title: string;
    author: string;
    trailNote: string;
  };
  highlights: string[];
  routeMapPoints: {
    stop: string;
    altitude: string;
    highlight: string;
  }[];
  days: ItineraryDay[];
  practicalNotes: string[];
}

export const itineraries: Itinerary[] = [
  {
    slug: 'spiti-valley-circuit',
    title: 'Spiti Valley Complete Circuit via Kinnaur & Kunzum',
    duration: '9 Days',
    region: 'Trans-Himalaya, Himachal Pradesh',
    bestSeason: 'Mid-June to early October',
    elevation: '2,200m – 4,551m (Kunzum Pass)',
    lastUpdated: 'September 2026',
    image: '/images/bir/bir-hero.jpg',
    gallery: [
      '/images/bir/bir-hero.jpg',
      '/images/bir/bir-1.jpg',
      '/images/bir/bir-2.jpg',
    ],
    moodTags: ['#high-altitude', '#solo-friendly', '#budget-slow', '#monasteries'],
    overview: 'An unhurried overland traverse beginning in the apple valleys of Shimla, climbing through the granite gorges of Kinnaur, and descending into the cold desert moonscapes of Spiti before exiting over high glaciated passes.',
    trailCompanionBook: {
      title: 'What I Talk About When I Talk About Running',
      author: 'Haruki Murakami',
      trailNote: 'Read during the long 8-hour bus rides along the Sutlej river gorge — a reminder of endurance and quiet cadence.',
    },
    highlights: [
      'Gradual acclimatization avoiding altitude sickness by entering via Kinnaur',
      'Mud-brick homestays in Langza under Chau Chau Kang Nilda peak',
      '1,000-year-old frescoed meditation chambers of Tabo monastery',
      'Sleeping beneath high-altitude stars at Chandratal lake'
    ],
    routeMapPoints: [
      { stop: 'Shimla', altitude: '2,276m', highlight: 'HRTC ordinary bus boarding' },
      { stop: 'Kalpa', altitude: '2,960m', highlight: 'Sunrise over Kinner Kailash' },
      { stop: 'Nako & Gue', altitude: '3,662m', highlight: 'Ancient mud village & 500-yr mummy' },
      { stop: 'Tabo & Dhankar', altitude: '3,894m', highlight: 'Cliffside monastery & lake walk' },
      { stop: 'Kaza & Langza', altitude: '4,400m', highlight: 'Marine fossils & world highest post office' },
      { stop: 'Kunzum La', altitude: '4,551m', highlight: 'Prayer flags & Chandra river pass' },
      { stop: 'Manali', altitude: '2,050m', highlight: 'Descent via Atal Tunnel' },
    ],
    days: [
      {
        day: 'Day 1–2',
        title: 'Entering the Gorge: Shimla to Kalpa via Sarahan',
        narrative: 'The road leaves behind the colonial ridge of Shimla and dives into the Sutlej valley. By afternoon, the air smells of wet slate and pine resin. I stopped at Sarahan to sit quietly in the courtyard of the 800-year-old wooden Bhimakali temple, then continued up to Kalpa. Woke up at 5:30 AM to see the first pink sunlight strike the snow peaks of Kinner Kailash while the village woodsmoke curled into the cold sky.',
        distanceOrTime: '240 km · 8 hrs on HRTC bus',
        stayTip: 'Homestays in upper Roghi village cost half of Kalpa town and have unobstructed valley views.'
      },
      {
        day: 'Day 3',
        title: 'Crossing the Boundary: Kalpa to Tabo via Nako',
        narrative: 'Beyond Reckong Peo, the trees vanish. Green deodars yield to sheer scree cliffs and wind-carved sandstone. We crossed into Spiti district near Sumdo. The village of Nako was bathed in stark afternoon light, its small sacred lake reflecting prayer stones. Reached Tabo at twilight, where the air had cooled to near-freezing.',
        distanceOrTime: '150 km · 6.5 hrs shared Sumo',
        stayTip: 'Stay in the monastery guesthouse in Tabo — quietest rooms in the valley, simple dal-chawal at night.'
      },
      {
        day: 'Day 4–5',
        title: 'Ancient Clay & High Villages: Tabo, Dhankar, Kaza & Langza',
        narrative: 'Spent two full hours sitting inside the dim, unlit clay caves of Tabo’s Chokh-khor monastery, dating back to 996 AD. The scent of ancient cedar beams and butter lamps is unmistakable. In the afternoon, hitched a ride up to Dhankar, whose fortress perches precariously on erosion needles. Later, based in Kaza and hiked up to Langza, where local children showed me marine fossils embedded in limestone at 4,400 meters.',
        distanceOrTime: 'Local village loops · 3–5 hrs walking',
        stayTip: 'Homestays in Langza provide traditional dry compost toilets, thick wool quilts, and hearty seabuckthorn tea.'
      },
      {
        day: 'Day 6–7',
        title: 'The Great Divide: Kaza to Chandratal over Kunzum Pass',
        narrative: 'Departed Kaza on an early morning Sumo toward Kunzum La. At 4,551 meters, the pass was swept by biting winds; we circumambulated the temple shrine alongside mountain drivers seeking safe passage. The 14km gravel detour to Chandratal felt like walking on another planet. By dusk, the crescent lake turned deep turquoise beneath the razor ridges of the CB range.',
        distanceOrTime: '90 km off-road · 5 hrs',
        stayTip: 'Camping is restricted 2km back from the water to preserve delicate alpine tundra. Bring your warmest fleece layer.'
      },
      {
        day: 'Day 8–9',
        title: 'The Batal Boulder Run to Manali',
        narrative: 'Stopped for hot kadhi-chawal at Chacha-Chachi’s legendary stone dhaba at Batal, where stranded travelers have found shelter for decades. The road through Gramphu is raw riverbed and tumbling boulders, until suddenly the smooth tarmac of the Atal Tunnel appears, dropping you into the lush cedar forests of Manali.',
        distanceOrTime: '120 km · 6 hrs transit',
        stayTip: 'Rest up in Old Manali near the Manu temple away from the crowded Mall Road before boarding evening buses south.'
      }
    ],
    practicalNotes: [
      'Cash: Only two ATMs in Kaza, both frequently offline. Withdraw full cash in Shimla or Rampur.',
      'AMS Prevention: Do not fly directly to high altitudes; this Kinnaur route provides the safest natural acclimatization curve.',
      'Inner Line Permits: Required for foreign nationals between Reckong Peo and Kaza (issued easily at DC office in Reckong Peo).'
    ]
  },
  {
    slug: 'parvati-grahan-trail',
    title: 'Parvati Valley: Chalal, Grahan & Pulga Slow Route',
    duration: '5 Days',
    region: 'Kullu District, Himachal Pradesh',
    bestSeason: 'April to June & September to November',
    elevation: '1,580m – 2,300m',
    lastUpdated: 'September 2026',
    image: '/images/shoja/shoja-1.jpg',
    gallery: [
      '/images/shoja/shoja-1.jpg',
      '/images/shoja/shoja-2.jpg',
      '/images/shoja/shoja-4.jpg',
    ],
    moodTags: ['#forest-trails', '#slow-travel', '#offbeat', '#budget-friendly'],
    overview: 'A quiet, unhurried alternative to the commercialized party strips of lower Parvati. Following footpath-only trails through moss-covered cedar woods, isolated timber hamlets, and riverbank homestays.',
    trailCompanionBook: {
      title: '1984',
      author: 'George Orwell',
      trailNote: 'Read on a wooden balcony in Chalal overlooking the rushing river — a strange, thought-provoking contrast to the timeless mountain silence.',
    },
    highlights: [
      'Footpath-only walk from Kasol to the quiet river glades of Chalal',
      'The 9km uphill forest trek through rhododendron tunnels to Grahan',
      'Mornings in the Fairy Forest of Pulga under century-old deodar trees',
      'Zero vehicle noise past Barshaini'
    ],
    routeMapPoints: [
      { stop: 'Bhuntar Junction', altitude: '1,089m', highlight: 'Local HRTC bus transfer point' },
      { stop: 'Chalal', altitude: '1,600m', highlight: 'Quiet riverside guesthouses' },
      { stop: 'Grahan Village', altitude: '2,280m', highlight: 'Ancient Kathkuni architecture, no road access' },
      { stop: 'Barshaini & Pulga', altitude: '2,200m', highlight: 'Apple orchards & Fairy Forest walks' },
      { stop: 'Kalga', altitude: '2,280m', highlight: 'Open meadow ridge & valley sunset' },
    ],
    days: [
      {
        day: 'Day 1',
        title: 'Leaving the Noise: Kasol to Chalal along the River',
        narrative: 'Crossed the swaying cable bridge over the roaring grey waters of the Parvati and took the dirt path into Chalal. Within ten minutes, the market chaos vanished. The path weaves between apple orchards and giant mossy boulders. Found a simple wooden room with a small balcony facing the river for ₹400 a night.',
        distanceOrTime: '2 km walk · 30 mins',
        stayTip: 'Head past the first cluster of cafes toward the village school for quietest homestay rooms.'
      },
      {
        day: 'Day 2',
        title: 'Into the Wild Woods: Trek to Grahan Village',
        narrative: 'Started at 7:30 AM following the Grahan Nallah stream upstream. The trail is purely for foot travelers and pack mules. Sunlight filters through ancient rhododendron and deodar trees like stained glass. After three hours of steady climbing, the wooden roofs of Grahan appeared on the mountain ridge. No cellular signal here — just temple bells and the sound of firewood chopping.',
        distanceOrTime: '9 km climb · 4 hrs on foot',
        stayTip: 'Grahan has strictly enforced village rules: never touch or photograph the sacred Kanwar temple.'
      },
      {
        day: 'Day 3',
        title: 'Descent & Climb to the Apple Hamlets: Pulga via Barshaini',
        narrative: 'Walked down from Grahan under cool morning clouds. Caught a shared Sumo from Manikaran to Barshaini, where the motorable road ends permanently. Hiked up the steep stone trail to Pulga village through terraced apple trees. The village houses are built in traditional Kathkuni style — interlocking deodar logs and stone without mortar.',
        distanceOrTime: '12 km total trail + shared cab',
        stayTip: 'Pulga has legendary bakery chai and clean wooden rooms managed by local families.'
      },
      {
        day: 'Day 4–5',
        title: 'The Fairy Forest & Sunset in Kalga',
        narrative: 'Woke to deodar tea and walked into the Fairy Forest behind Pulga. The ground is a thick carpet of pine needles and soft green moss, quiet enough to hear mountain birds overhead. In the afternoon, crossed the dam valley over to Kalga village for sunset, watching the golden light fade from the towering snow peaks of Tosh.',
        distanceOrTime: 'Forest day rambles · unhurried pace',
        stayTip: 'Pack your own trash back to Kasol or Bhuntar — high villages lack municipal waste management.'
      }
    ],
    practicalNotes: [
      'Pack light: everything past Barshaini must be carried on your back across steep village trails.',
      'Mobile connectivity: Jio and Airtel work decently in Chalal and Pulga; zero signal in Grahan.',
      'Atmosphere: Respect local temple courtyards and dress respectfully when walking through village lanes.'
    ]
  },
  {
    slug: 'tirthan-gnhp-retreat',
    title: 'Tirthan Valley & Great Himalayan National Park Walks',
    duration: '4 Days',
    region: 'Seraj Region, Himachal Pradesh',
    bestSeason: 'March to June & September to November',
    elevation: '1,450m – 3,120m (Jalori Pass)',
    lastUpdated: 'September 2026',
    image: '/images/shangarh/shangarh-1.jpg',
    gallery: [
      '/images/shangarh/shangarh-1.jpg',
      '/images/shangarh/shangarh-2.jpg',
      '/images/shangarh/shangarh-3.jpg',
    ],
    moodTags: ['#river-valley', '#national-park', '#monsoon-safe', '#quiet-escapes'],
    overview: 'Crystal-clear trout streams, ancient cedar groves, and buffer-zone nature walks along the pristine UNESCO World Heritage Great Himalayan National Park.',
    trailCompanionBook: {
      title: 'Men Without Women',
      author: 'Haruki Murakami',
      trailNote: 'Read beside the cold green pools of the Tirthan river in Gushaini — quiet, unhurried afternoon company.',
    },
    highlights: [
      'Riverside wooden stays along the clean, cold Tirthan river',
      'The 8km day hike to the Great Himalayan National Park eco-zone gate',
      'Panoramic ridge crossing at Jalori Pass (3,120m) to sacred Serolsar Lake',
      'Untouched village life in Pekhri and Nagini'
    ],
    routeMapPoints: [
      { stop: 'Aut Tunnel', altitude: '1,000m', highlight: 'Bus alighting point & river diversion' },
      { stop: 'Gushaini', altitude: '1,500m', highlight: 'Riverside homestays & trout stream' },
      { stop: 'Ropa & GHNP Gate', altitude: '1,800m', highlight: 'National park buffer zone trail' },
      { stop: 'Jalori Pass', altitude: '3,120m', highlight: 'Wind-swept ridge overlooking Dhauladhar' },
      { stop: 'Serolsar Lake', altitude: '3,100m', highlight: 'Sacred oak forest shrine' },
    ],
    days: [
      {
        day: 'Day 1',
        title: 'Entering the River Sanctuary: Aut to Gushaini',
        narrative: 'Left the Delhi-Manali highway immediately after the dark Aut tunnel and turned into the narrow Tirthan gorge. The difference in atmosphere is instantaneous. The river is crystalline, cold, and loud. Checked into a family-run riverside homestay in Gushaini with a wooden porch facing apple orchards.',
        distanceOrTime: '30 km scenic drive from Aut · 1 hr',
        stayTip: 'Stay in Gushaini or Nagini rather than Banjar town for immediate river access and quiet.'
      },
      {
        day: 'Day 2',
        title: 'The Great Himalayan National Park Eco-Zone Walk',
        narrative: 'Set out on foot from Gushaini toward Ropa, following the river trail into the buffer zone of the UNESCO World Heritage park. Passed traditional stone-and-slate houses where villagers dry red chilies on wooden roofs. The forest grows denser with walnut, horse chestnut, and ancient deodar trees. Reached the park gate at Hippo Point for lunch by the water.',
        distanceOrTime: '8 km round-trip walk · gentle gradient',
        stayTip: 'Day permits for the eco-zone are available on spot at the park information center in Sai Ropa.'
      },
      {
        day: 'Day 3',
        title: 'Ridge Crossing: Jalori Pass to Sacred Serolsar Lake',
        narrative: 'Took an early morning shared cab up through switchbacks to Jalori Pass at 3,120 meters. From the breezy ridge, the snow peaks of the Kinnaur and Pir Panjal ranges stand clear. The 5km trail to Serolsar Lake is a gentle, shaded stroll through dense oak and rhododendron woods. The emerald lake is held sacred by locals; not a single leaf is allowed to float on its surface.',
        distanceOrTime: '10 km return trek · 4 hrs',
        stayTip: 'Carry a warm windcheater; weather at Jalori Pass changes rapidly by mid-afternoon.'
      },
      {
        day: 'Day 4',
        title: 'Morning Waterfall Walk & Departure',
        narrative: 'A short, steep morning scramble through deodar woods to Chhoie waterfall, where mountain spray cools the rocky basin. Sipped hot ginger-lemon-honey tea at a trailside wooden shack before heading back to Aut to catch the evening return bus.',
        distanceOrTime: '3 km forest hike · 2 hrs',
        stayTip: 'Local buses to Aut run regularly until 4:00 PM from Banjar bus stand.'
      }
    ],
    practicalNotes: [
      'Eco-Conscious Valley: Plastic littering is heavily fined throughout the Tirthan eco-zone. Carry reusable water bottles.',
      'Trout Fishing: Catch-and-release fly fishing permits can be arranged via the fisheries department in Nagini.'
    ]
  }
];

