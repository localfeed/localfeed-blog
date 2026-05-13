#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src/content/local');

// ─── CITIES (20 NZ cities, rich local context) ────────────────────────────────

const CITIES = [
  {
    name: 'Auckland', slug: 'auckland',
    region: 'Auckland',
    population: '1.7 million',
    character: "NZ's largest and most competitive hospitality market",
    neighbourhoods: 'Ponsonby, Grey Lynn, Parnell, the CBD, Takapuna, Newmarket, and Devonport',
    diningNote: 'Auckland diners are sophisticated, time-poor, and have more options than anywhere else in the country',
    quietNight: 'Monday through Thursday',
    keySearch: 'Auckland restaurants',
    context: "New Zealand's largest city with over 1.7 million people and a food scene that reflects the country's most diverse population",
  },
  {
    name: 'Wellington', slug: 'wellington',
    region: 'Wellington',
    population: '440,000',
    character: 'the café capital of the world, with more restaurants per capita than New York',
    neighbourhoods: 'Te Aro, Cuba Street, Lambton Quay, Thorndon, Newtown, and Petone',
    diningNote: 'Wellington diners are loyal, food-literate, and willing to walk further and wait longer for quality',
    quietNight: 'Tuesday and Wednesday',
    keySearch: 'Wellington restaurants',
    context: 'the capital city with a punchy café culture, a strong after-work dining scene, and some of NZ\'s best independent venues per capita',
  },
  {
    name: 'Christchurch', slug: 'christchurch',
    region: 'Canterbury',
    population: '400,000',
    character: 'a city that rebuilt and in doing so created one of NZ\'s most exciting emerging food scenes',
    neighbourhoods: 'the CBD, Addington, Sydenham, Riccarton, Sumner, and the new retail precinct',
    diningNote: 'Christchurch diners support the rebuild by choosing local and independent venues over chains',
    quietNight: 'midweek dinners',
    keySearch: 'Christchurch restaurants',
    context: 'a city that rebuilt itself and in doing so created one of NZ\'s most exciting and bold food scenes',
  },
  {
    name: 'Hamilton', slug: 'hamilton',
    region: 'Waikato',
    population: '185,000',
    character: 'a university city with a growing food culture and a loyal local customer base',
    neighbourhoods: 'the CBD, Anglesea Street, Hood Street, Victoria Street, and the river precinct',
    diningNote: 'Hamilton diners know their venues well and word-of-mouth drives more bookings than platforms',
    quietNight: 'Tuesday through Thursday',
    keySearch: 'Hamilton restaurants',
    context: 'a university city with a growing food culture and a loyal local customer base that wants good value without the Auckland prices',
  },
  {
    name: 'Tauranga', slug: 'tauranga',
    region: 'Bay of Plenty',
    population: '155,000',
    character: 'one of NZ\'s fastest-growing cities with a beach lifestyle and strong local pride',
    neighbourhoods: 'the CBD, Greerton, Mount Maunganui, Bethlehem, and the waterfront',
    diningNote: 'Tauranga\'s rapid growth has brought new diners who are exploring a maturing food scene',
    quietNight: 'midweek',
    keySearch: 'Tauranga restaurants',
    context: 'one of NZ\'s fastest-growing cities with a beach lifestyle, strong local pride, and a food scene that punches well above its size',
  },
  {
    name: 'Dunedin', slug: 'dunedin',
    region: 'Otago',
    population: '135,000',
    character: 'a student city with a creative food scene, strong community values, and genuine local loyalty',
    neighbourhoods: 'the Octagon, George Street, Roslyn, South Dunedin, and the Warehouse Precinct',
    diningNote: 'Dunedin diners span students seeking value to professionals seeking craft — both respond to genuine quality',
    quietNight: 'semester break periods and winter',
    keySearch: 'Dunedin restaurants',
    context: 'a student city with a creative food scene, strong community values, and diners who support local venues with genuine loyalty',
  },
  {
    name: 'Palmerston North', slug: 'palmerston-north',
    region: 'Manawatu',
    population: '90,000',
    character: 'a regional city where locals know their venues and word-of-mouth still rules',
    neighbourhoods: 'The Square, George Street, Fitzherbert Avenue, and the university precinct',
    diningNote: 'In Palmerston North, a venue that earns community trust builds durable, repeat business that platforms cannot replicate',
    quietNight: 'midweek',
    keySearch: 'Palmerston North restaurants',
    context: 'a city where locals know their venues well and word-of-mouth still drives more covers than any platform',
  },
  {
    name: 'Napier', slug: 'napier',
    region: "Hawke's Bay",
    population: '65,000',
    character: "the art deco capital of NZ with a strong wine tourism trade",
    neighbourhoods: 'Emerson Street, Marine Parade, Ahuriri, and the CBD',
    diningNote: 'Napier serves both high-spending wine tourists and loyal locals — the best venues serve both well',
    quietNight: 'May through August',
    keySearch: 'Napier restaurants',
    context: "the art deco capital of NZ with a strong wine tourism trade and a local dining scene that serves both visitors and year-round regulars",
  },
  {
    name: 'Hastings', slug: 'hastings',
    region: "Hawke's Bay",
    population: '80,000',
    character: "the heart of Hawke's Bay's food bowl with access to the best local produce in NZ",
    neighbourhoods: 'the CBD, Karamu Road, Havelock North village, and the winery district',
    diningNote: "Hastings diners have access to extraordinary local produce and venues that use it are the ones they return to",
    quietNight: 'winter',
    keySearch: 'Hastings restaurants',
    context: "the heart of Hawke's Bay's food bowl, with access to the best local produce in NZ and venues that know how to use it",
  },
  {
    name: 'Nelson', slug: 'nelson',
    region: 'Nelson',
    population: '55,000',
    character: 'a sunny, creative city with a strong artisan food culture and a thriving brewery scene',
    neighbourhoods: 'Hardy Street, Trafalgar Street, the waterfront, and the arts precinct',
    diningNote: 'Nelson diners value independent venues, local provenance, and the creative food culture the city is known for',
    quietNight: 'May through August',
    keySearch: 'Nelson restaurants',
    context: 'a sunny, creative city with a strong artisan food culture, brewery scene, and diners who value independent venues over chains',
  },
  {
    name: 'Rotorua', slug: 'rotorua',
    region: 'Bay of Plenty',
    population: '75,000',
    character: "NZ's geothermal tourism capital with a market split between high-spending visitors and loyal locals",
    neighbourhoods: 'the lakefront, Fenton Street, Tutanekai Street, and the CBD',
    diningNote: 'Rotorua venues that master both tourist and local trade build the most resilient businesses',
    quietNight: 'winter',
    keySearch: 'Rotorua restaurants',
    context: 'a tourist hub where the challenge is building loyalty from a transient visitor base while also serving a tight-knit local community',
  },
  {
    name: 'New Plymouth', slug: 'new-plymouth',
    region: 'Taranaki',
    population: '85,000',
    character: 'a coastal city with a strong arts scene and locals who know which venues are worth their time',
    neighbourhoods: 'Devon Street, the CBD, the waterfront, and Fitzroy',
    diningNote: 'New Plymouth diners support the venues that reflect the city\'s creative, community-minded character',
    quietNight: 'midweek',
    keySearch: 'New Plymouth restaurants',
    context: 'a coastal city with a strong arts scene, good energy, and locals who know exactly which venues are worth their time',
  },
  {
    name: 'Whanganui', slug: 'whanganui',
    region: 'Whanganui',
    population: '47,000',
    character: 'a rising creative city where independent venues are core to the community',
    neighbourhoods: 'Victoria Avenue, the CBD, Taupo Quay, and Aramoho',
    diningNote: 'Whanganui\'s arts-and-culture revival is driving a hospitality revival — the two are intertwined',
    quietNight: 'most weeknights',
    keySearch: 'Whanganui restaurants',
    context: 'a rising creative city where independent venues are core to the community and where every regular feels like part of the story',
  },
  {
    name: 'Invercargill', slug: 'invercargill',
    region: 'Southland',
    population: '56,000',
    character: 'the southernmost major city in NZ with a loyal local base and venues that rely on repeat business',
    neighbourhoods: 'Dee Street, the CBD, Wachner Place, and Newfield',
    diningNote: 'Invercargill has a tight-knit community where reputation travels fast and loyalty runs deep',
    quietNight: 'most evenings outside Friday and Saturday',
    keySearch: 'Invercargill restaurants',
    context: 'the southernmost major city in NZ with a loyal local base and venues that rely on repeat business more than tourist traffic',
  },
  {
    name: 'Whangarei', slug: 'whangarei',
    region: 'Northland',
    population: '60,000',
    character: 'the gateway to Northland with a growing café and dining scene',
    neighbourhoods: 'the Town Basin, Cameron Street, Okara, and the harbour precinct',
    diningNote: 'Whangarei serves both its growing local population and the stream of travellers heading further north',
    quietNight: 'winter weekdays',
    keySearch: 'Whangarei restaurants',
    context: 'the gateway to Northland with a growing café and dining scene that serves both locals and the touring crowd heading north',
  },
  {
    name: 'Gisborne', slug: 'gisborne',
    region: 'Gisborne',
    population: '36,000',
    character: 'the first city in the world to see the sun, with a warm climate and strong surf culture',
    neighbourhoods: 'the CBD, Gladstone Road, the harbour, and Kaiti',
    diningNote: "Gisborne's warm climate and wine region create a relaxed, outdoor-friendly dining culture",
    quietNight: 'most evenings',
    keySearch: 'Gisborne restaurants',
    context: 'the first city in the world to see the sun, with a warm climate, strong surf culture, and a food scene built on exceptional local produce',
  },
  {
    name: 'Blenheim', slug: 'blenheim',
    region: 'Marlborough',
    population: '32,000',
    character: "the wine capital of NZ surrounded by Marlborough's iconic vineyards",
    neighbourhoods: 'Market Place, the town centre, and the Wairau Valley wine district',
    diningNote: "Blenheim's proximity to world-class Marlborough wineries shapes its entire dining culture",
    quietNight: 'winter',
    keySearch: 'Blenheim restaurants',
    context: "the wine capital of NZ surrounded by Marlborough's vineyards, where food and wine culture is woven into daily life",
  },
  {
    name: 'Queenstown', slug: 'queenstown',
    region: 'Otago',
    population: '15,000 residents, 3+ million visitors/year',
    character: "NZ's adventure capital with more restaurants per capita than anywhere else in the country",
    neighbourhoods: 'the Mall, Beach Street, Frankton, Arrowtown, and Fernhill',
    diningNote: 'Queenstown venues face the dual challenge of serving high-spending tourists and price-aware locals',
    quietNight: 'midweek outside peak season',
    keySearch: 'Queenstown restaurants',
    context: "NZ's adventure capital with the highest concentration of restaurants per capita and a market split between tourists chasing experiences and locals wanting value",
  },
  {
    name: 'Timaru', slug: 'timaru',
    region: 'Canterbury',
    population: '46,000',
    character: 'a working port city with strong community ties and loyal local hospitality support',
    neighbourhoods: 'Stafford Street, the CBD, Caroline Bay, and Washdyke',
    diningNote: 'Timaru diners support their local hospitality community with real loyalty — earning that loyalty takes consistency',
    quietNight: 'most weeknights',
    keySearch: 'Timaru restaurants',
    context: 'a working port city with strong community ties and locals who support their own hospitality scene with real loyalty',
  },
  {
    name: 'Pukekohe', slug: 'pukekohe',
    region: 'Auckland',
    population: '35,000',
    character: 'a rapidly growing South Auckland town with a local dining scene catching up fast',
    neighbourhoods: 'the town centre, Manukau Road, and Edinburgh Street',
    diningNote: "Pukekohe's growing population brings demand that the local hospitality scene is actively expanding to meet",
    quietNight: 'most weeknights',
    keySearch: 'Pukekohe restaurants',
    context: 'a growing South Auckland town with a rapidly expanding population and a local dining scene that is catching up fast',
  },
];

// ─── AUCKLAND SUBURBS ─────────────────────────────────────────────────────────

const AUCKLAND_SUBURBS = [
  {
    name: 'Ponsonby', slug: 'ponsonby',
    region: 'Auckland',
    population: 'inner-city suburb',
    character: "Auckland's most iconic dining and bar strip",
    neighbourhoods: 'Ponsonby Road, Franklin Road, Jervois Road, and the Ponsonby Central precinct',
    diningNote: 'Ponsonby diners expect quality, are willing to pay for it, and will tell their entire network when they find something exceptional',
    quietNight: 'Sunday through Tuesday',
    keySearch: 'Ponsonby restaurants',
    context: "home to Ponsonby Road, Auckland's most celebrated dining strip, where independent restaurants, bars, and cafés set the standard for the rest of the city",
  },
  {
    name: 'Grey Lynn', slug: 'grey-lynn',
    region: 'Auckland',
    population: 'inner-city suburb',
    character: 'indie, artsy, and deeply community-oriented',
    neighbourhoods: 'Richmond Road, Great North Road, and the Grey Lynn village',
    diningNote: 'Grey Lynn diners support venues that reflect their values: local, independent, and genuine',
    quietNight: 'Sunday through Tuesday',
    keySearch: 'Grey Lynn cafes',
    context: 'an inner-Auckland suburb with a creative community, independent hospitality spirit, and diners who care where their food comes from',
  },
  {
    name: 'Parnell', slug: 'parnell',
    region: 'Auckland',
    population: 'inner-city suburb',
    character: 'Auckland\'s established dining village with a mix of fine dining and quality casual',
    neighbourhoods: 'Parnell Road, the Parnell village strip, and the Domain area',
    diningNote: 'Parnell diners skew older and more established — they value consistency and reliability as much as innovation',
    quietNight: 'midweek',
    keySearch: 'Parnell restaurants',
    context: 'one of Auckland\'s most established dining precincts, with a mix of fine dining, wine bars, and quality casual venues that have been serving the neighbourhood for decades',
  },
  {
    name: 'Newmarket', slug: 'newmarket',
    region: 'Auckland',
    population: 'inner suburb and shopping precinct',
    character: 'Auckland\'s upmarket retail district with a strong corporate lunch and after-work dining scene',
    neighbourhoods: 'Broadway, Teed Street, and the Westfield precinct',
    diningNote: 'Newmarket diners include shopping day visitors, office workers, and evening diners looking for a quality meal before heading home',
    quietNight: 'Sunday and Monday',
    keySearch: 'Newmarket restaurants',
    context: 'a busy Auckland retail and dining precinct that serves a mix of corporate lunchers, Saturday shoppers, and evening diners looking for something good near the train station',
  },
  {
    name: 'Mt Eden', slug: 'mt-eden',
    region: 'Auckland',
    population: 'inner suburb',
    character: 'a village-feel inner suburb with strong local loyalty and independent hospo',
    neighbourhoods: 'Mt Eden Road, Dominion Road, and the village centre',
    diningNote: 'Mt Eden has a neighbourhood feel that is increasingly rare in Auckland — locals genuinely know and support their venues',
    quietNight: 'Sunday through Tuesday',
    keySearch: 'Mt Eden cafes and restaurants',
    context: 'an Auckland suburb with genuine village character, a strong community of loyal local diners, and independent hospo venues that have earned their place',
  },
  {
    name: 'Takapuna', slug: 'takapuna',
    region: 'Auckland',
    population: 'North Shore suburb',
    character: "the North Shore's most active dining precinct, with beach-town energy and quality options",
    neighbourhoods: 'Hurstmere Road, Lake Road, and the beachfront',
    diningNote: 'Takapuna diners are North Shore locals who want great food without crossing the bridge — a strong local loyalty market',
    quietNight: 'midweek',
    keySearch: 'Takapuna restaurants',
    context: "Auckland's North Shore dining hub, with the beachside village energy of Takapuna Beach setting the scene for a vibrant and growing hospitality strip",
  },
  {
    name: 'Auckland CBD', slug: 'auckland-cbd',
    region: 'Auckland',
    population: 'central business district',
    character: 'Auckland\'s densest dining and bar precinct, from Britomart to the waterfront',
    neighbourhoods: 'Britomart, Fort Street, the Viaduct, SkyCity precinct, and Federal Street',
    diningNote: 'Auckland CBD diners are mostly corporate lunchers, post-work drinkers, tourists, and event-goers — a high-volume, diverse market',
    quietNight: 'Sunday and public holidays',
    keySearch: 'Auckland CBD restaurants',
    context: "Auckland's commercial heart and the city's highest-concentration dining and bar district, from the Viaduct waterfront to the Britomart precinct",
  },
  {
    name: 'Devonport', slug: 'devonport',
    region: 'Auckland',
    population: 'North Shore village',
    character: 'a ferry-accessed village with heritage character, weekend tourism, and loyal locals',
    neighbourhoods: 'Victoria Road, the waterfront, and the historic village centre',
    diningNote: 'Devonport attracts a mix of weekend day-trippers and locals who treat the village\'s dining as their own — both are worth serving well',
    quietNight: 'weekday evenings',
    keySearch: 'Devonport restaurants',
    context: 'a historic North Shore village accessed by a 12-minute ferry from Auckland\'s CBD, with a hospitality scene that serves both loyal locals and weekend day-trippers',
  },
];

// ─── WELLINGTON SUBURBS ───────────────────────────────────────────────────────

const WELLINGTON_SUBURBS = [
  {
    name: 'Te Aro', slug: 'te-aro',
    region: 'Wellington',
    population: 'inner Wellington suburb',
    character: "Wellington's most creative and independent hospitality precinct",
    neighbourhoods: 'Cuba Street, Tory Street, Courtenay Place, and the LBQ precinct',
    diningNote: 'Te Aro diners include students, creatives, public servants, and visitors — all expect quality and authenticity',
    quietNight: 'Sunday and Monday',
    keySearch: 'Te Aro cafes and restaurants',
    context: 'the beating heart of Wellington\'s independent hospitality scene, home to Cuba Street\'s iconic cafés, Tory Street\'s creative venues, and Courtenay Place\'s bar precinct',
  },
  {
    name: 'Thorndon', slug: 'thorndon',
    region: 'Wellington',
    population: 'inner Wellington suburb',
    character: 'Wellington\'s government and embassy precinct with a strong corporate dining culture',
    neighbourhoods: 'Tinakori Road, Mulgrave Street, and the parliamentary precinct',
    diningNote: 'Thorndon serves Wellington\'s political and diplomatic community — discretion, reliability, and quality matter most',
    quietNight: 'weekend evenings',
    keySearch: 'Thorndon restaurants Wellington',
    context: 'Wellington\'s parliamentary and embassy quarter, where venue reliability and quality are valued above novelty by the city\'s professional and political dining community',
  },
  {
    name: 'Newtown', slug: 'newtown',
    region: 'Wellington',
    population: 'inner Wellington suburb',
    character: 'Wellington\'s most multicultural suburb with diverse independent dining',
    neighbourhoods: 'Riddiford Street, Adelaide Road, and the hospital precinct',
    diningNote: 'Newtown diners value diversity, value, and genuineness — it is one of Wellington\'s most authentic dining areas',
    quietNight: 'weekday evenings',
    keySearch: 'Newtown restaurants Wellington',
    context: 'Wellington\'s most culturally diverse suburb, with a hospitality scene that reflects a genuine mix of cuisines and an independent spirit that Wellingtonians love',
  },
  {
    name: 'Petone', slug: 'petone',
    region: 'Wellington',
    population: 'Lower Hutt waterfront suburb',
    character: 'a gentrifying waterfront strip with strong community identity and indie venues',
    neighbourhoods: 'Jackson Street, the waterfront, and the craft precinct',
    diningNote: 'Petone has built a reputation as Wellington\'s go-to strip for independent discovery dining — a destination in its own right',
    quietNight: 'midweek',
    keySearch: 'Petone restaurants Wellington',
    context: 'a Lower Hutt waterfront suburb that has become one of the Wellington region\'s most exciting hospitality streets, anchored by Jackson Street\'s growing strip of independent venues',
  },
];

// ─── CHRISTCHURCH AREAS ───────────────────────────────────────────────────────

const CHRISTCHURCH_AREAS = [
  {
    name: 'Addington', slug: 'addington',
    region: 'Canterbury',
    population: 'Christchurch suburb',
    character: 'Christchurch\'s most established independent dining strip',
    neighbourhoods: 'Lincoln Road, Eliza\'s Lane, and the racecourse precinct',
    diningNote: 'Addington has been Christchurch\'s hospo heart since before the earthquake and has rebuilt stronger',
    quietNight: 'Sunday and Monday',
    keySearch: 'Addington restaurants Christchurch',
    context: 'Christchurch\'s most established suburban dining precinct, where independent cafés, restaurants, and wine bars have built loyal followings that survived the earthquakes and rebuilt stronger',
  },
  {
    name: 'Sydenham', slug: 'sydenham',
    region: 'Canterbury',
    population: 'Christchurch suburb',
    character: 'Christchurch\'s emerging industrial-chic dining district',
    neighbourhoods: 'Colombo Street, Selwyn Street, and the Sydenham strip',
    diningNote: 'Sydenham is where Christchurch\'s next generation of hospo is establishing itself — raw, creative, and community-minded',
    quietNight: 'midweek',
    keySearch: 'Sydenham restaurants Christchurch',
    context: 'a Christchurch suburb that has become the home of the city\'s next generation of independent hospitality — creative venues in adapted spaces, with an energy that reflects a city still rebuilding its identity',
  },
  {
    name: 'Sumner', slug: 'sumner',
    region: 'Canterbury',
    population: 'Christchurch beachside village',
    character: 'a beachside village with a loyal local community and relaxed dining culture',
    neighbourhoods: 'The Esplanade, Nayland Street, and the beach village centre',
    diningNote: 'Sumner diners are locals who take pride in their village and visitors making the drive for the coastal experience',
    quietNight: 'winter weekdays',
    keySearch: 'Sumner restaurants Christchurch',
    context: 'a relaxed beachside village on the edge of Christchurch, where independent cafés and restaurants serve a loyal local community and weekend visitors who make the drive for the sea air and the food',
  },
];

// ─── VENUE TYPES (15, each with rich, unique content) ─────────────────────────

const VENUE_TYPES = [
  {
    name: 'restaurants', slug: 'restaurants', display: 'Restaurants',
    titleWord: 'Restaurants',
    advice: [
      'A tight seasonal menu of 10–12 dishes beats a long menu built around freezer items every time',
      'Ask where the proteins are sourced — the best NZ restaurants name their farms and fisheries',
      'Service tempo matters as much as food quality: you should feel cared for, not chased out',
      'Wine lists that lead with NZ producers show genuine engagement with the local food ecosystem',
      'Reservation policies with clear cancellation terms signal a professionally run operation',
      'A restaurant that knows your dietary requirement without you repeating it is a restaurant worth returning to',
    ],
    intro: (city) => `Finding a restaurant worth returning to in ${city.name} takes more than opening a booking app and sorting by rating. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The restaurants that earn real loyalty are the ones that make the full experience — the welcome, the food, the pace, the farewell — feel considered.`,
    lfVenueIntro: (city) => `For restaurants in ${city.name}, LocalFeed removes the margin pressure that forces venues into deep discounting. Instead of giving away 50% of food revenue to a platform, they list their own offers — a midweek set menu, a Sunday special, a prix-fixe at their own price — and keep the customer relationship that follows.`,
  },
  {
    name: 'cafes', slug: 'cafes', display: 'Cafés',
    titleWord: 'Cafés',
    advice: [
      'The best cafés in NZ source local milk, eggs, and bread — it shows in the quality of every dish',
      'A café that knows your order by your third visit is building the kind of relationship that lasts years',
      'Specialty coffee with clear origin information signals a kitchen that takes ingredients seriously',
      'A seasonal brunch menu that changes quarterly means the kitchen is engaged, not coasting',
      'Queue management that gives honest wait times respects your Saturday morning',
      'The café that feeds its team well from the same kitchen that serves you is telling you something about its values',
    ],
    intro: (city) => `${city.name} has no shortage of places to get a coffee and something to eat. But ${city.context}. The cafés worth your time treat every morning service with the same intention as an evening sitting at a destination restaurant.`,
    lfVenueIntro: (city) => `Cafés in ${city.name} using LocalFeed can list their brunch events, their long-table weekend specials, or their quieter weekday offers without mandatory discounting. The customer data from every booking stays with the café — building the direct list that fills a quiet Monday with one email.`,
  },
  {
    name: 'bars', slug: 'bars', display: 'Bars',
    titleWord: 'Bars',
    advice: [
      'Bartenders who can talk intelligently about spirits and make genuine recommendations are worth seeking',
      'A thoughtful non-alcoholic menu signals a bar that cares about every customer in the room',
      'Glassware condition is a visible proxy for overall operational standards — it tells you a lot',
      'Lighting and music levels that allow conversation are rarer than they should be and worth seeking',
      'Bars that pour NZ craft spirits and work with local producers have more character than those that do not',
      'A bar with a genuine food programme, not just bar snacks, can hold an evening by itself',
    ],
    intro: (city) => `${city.name}'s bar scene spans everything from no-frills locals to genuinely ambitious cocktail venues. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The bars worth building your evening around are the ones where the drinks are considered and the experience respects your time and your company.`,
    lfVenueIntro: (city) => `For ${city.name} bars, LocalFeed enables custom offers — cocktail and canape packages, after-work specials, Friday pre-dinner drinks at a set price — without forcing a specific discount structure. The venue designs the offer. The customer comes on the venue's terms.`,
  },
  {
    name: 'pubs', slug: 'pubs', display: 'Pubs',
    titleWord: 'Pubs',
    advice: [
      'A pub that rotates taps seasonally and features NZ craft breweries is engaged with its product',
      'A good pub kitchen runs proper mise en place — not everything comes out of a pre-made packet',
      'Genuinely generous happy hour shows a venue confident in its regular base and not just chasing margin',
      'Sports coverage that does not drown out conversation on the other side of the bar is a design achievement',
      'Staff who know their beer list and can recommend based on your preference are the difference between a pub and a bar',
      'The best pubs remember your face, your team, and your usual — it is hospitality, not transaction',
    ],
    intro: (city) => `${city.name}'s pubs are where locals go after work, after sport, and after everything else that needs processing over a drink. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The best pubs feel like an extension of the neighbourhood — comfortable, honest, and never trying too hard.`,
    lfVenueIntro: (city) => `${city.name} pubs using LocalFeed can list their own specials — a weeknight happy hour package, a Sunday roast offer, a craft beer tasting event — without platform-mandated pricing. The customer comes to the pub on terms the pub designed.`,
  },
  {
    name: 'bistros', slug: 'bistros', display: 'Bistros',
    titleWord: 'Bistros',
    advice: [
      'Bistros that change their menu weekly around what is available from suppliers show genuine kitchen engagement',
      'A focused wine list that does not try to be a wine bar but hits the right notes is a real achievement',
      'Bistro service should feel informed and warm, not formal — the best ones feel like dining with people who love food',
      'Chalkboard specials done well signal a kitchen in active dialogue with the season',
      'A bistro that takes walk-ins and manages the floor with genuine hospitality often outperforms reservation-only venues',
      'The French bistro tradition — simple, quality-led, relationship-driven — translates perfectly to the NZ context',
    ],
    intro: (city) => `A proper bistro is one of the hardest hospitality formats to execute well. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The bistro model — simple, quality-driven, regular-facing — is what NZ hospitality does best when it is not overthinking.`,
    lfVenueIntro: (city) => `Bistros in ${city.name} that use LocalFeed can design their own midweek bistro offer: a two-course prix-fixe, a wine-and-two-courses package, or a set dinner that makes Tuesday worth planning around — all at a price the bistro sets, not the platform.`,
  },
  {
    name: 'breweries', slug: 'breweries', display: 'Breweries',
    titleWord: 'Breweries',
    advice: [
      'Taprooms that brew on-site and serve fresh produce something that no bottleshop can replicate',
      'Seasonal and rotating taps with tasting paddles let you explore the full range without committing to a full pint',
      'Food menus at breweries should complement the beer, not try to be a full restaurant programme',
      'Breweries that collaborate with other NZ producers — farmers, bakers, cheesemakers — tend to have more creative output',
      'A taproom team who can explain the brewing process and help you find your style is worth seeking out',
      'The best NZ craft breweries treat every pour as an expression of local ingredients and genuine craft',
    ],
    intro: (city) => `NZ craft brewing has become one of the country's genuine cultural exports, and ${city.name} is part of that story. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The breweries worth visiting are the ones that treat what goes into the tank with the same seriousness as what comes out.`,
    lfVenueIntro: (city) => `${city.name} breweries using LocalFeed can list their own taproom events — tasting evenings, new release launches, brewer Q&As — and keep the customer contact data that builds a direct mailing list of the people who genuinely care about what they are brewing.`,
  },
  {
    name: 'wine-bars', slug: 'wine-bars', display: 'Wine Bars',
    titleWord: 'Wine Bars',
    advice: [
      'A genuine by-the-glass programme across multiple styles lets you explore without committing to a bottle',
      'The best NZ wine bars feature producers from across all major regions, not just the obvious popular names',
      'Small plates and sharing dishes designed to pair with wine show a kitchen that understands the whole experience',
      'Natural wine lists have grown significantly in NZ — the best bars can explain what they are and why they chose them',
      'Wine bars that change their list seasonally and know their producers by name are the ones worth returning to',
      'Staff who can recommend based on your taste, not just the most expensive option, build the most loyal following',
    ],
    intro: (city) => `Wine bars in ${city.name} have grown from a novelty into a genuine category of venue. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The best wine bars make NZ\'s exceptional wine regions — Marlborough, Hawke\'s Bay, Central Otago, Martinborough — feel approachable and personal without the intimidation of a fine-dining wine programme.`,
    lfVenueIntro: (city) => `Wine bars in ${city.name} that use LocalFeed can list their own winery dinners, tasting events, and by-the-glass specials at their own price. The platform brings discovery without extracting margin from every cover.`,
  },
  {
    name: 'food-trucks', slug: 'food-trucks', display: 'Food Trucks',
    titleWord: 'Food Trucks',
    advice: [
      'Food trucks that focus on one cuisine — or even one dish — tend to execute better than those trying to do everything',
      'Following their social media for weekly location updates is how you find the best trucks — they build loyal followings',
      'Queue length at a lunchtime spot is almost always a reliable quality signal — locals know where to go',
      'Trucks that appear at farmers markets tend to prioritise quality ingredients over volume margin',
      'The best food trucks have been running long enough to have refined their recipe to near-perfection',
      'Look for trucks that use locally sourced proteins and produce even at scale — it makes a difference you can taste',
    ],
    intro: (city) => `Food trucks have become a genuine and beloved part of ${city.name}'s food culture. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The best trucks have built loyal followings over years by doing one thing exceptionally well and showing up at the same spots with genuine consistency.`,
    lfVenueIntro: (city) => `Food trucks operating in ${city.name} can list their regular locations and special event appearances on LocalFeed — building a direct customer list from the people who follow them across the city.`,
  },
  {
    name: 'bakeries', slug: 'bakeries', display: 'Bakeries',
    titleWord: 'Bakeries',
    advice: [
      'A bakery that starts from scratch every morning and sells out by early afternoon is doing it right',
      'Sourdough with real flavour and crust comes from proper fermentation time, not shortcuts — ask about their process',
      'Seasonal pastries and specials show a team that is genuinely engaged, not just running the same formula year-round',
      'Local flour, butter, and eggs make a difference in the final product that experienced palates recognise',
      'Bakeries honest about sell-out times help you plan your visit and avoid the disappointment of empty shelves',
      'The smell of a real bakery at 7am — actual fermentation, actual butter — is a quality signal you can use',
    ],
    intro: (city) => `The rise of serious bread and pastry culture in ${city.name} has been one of the most exciting developments in NZ hospitality. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The bakeries worth going out of your way for are the ones where the craft is visible in every loaf and the staff can tell you about the flour.`,
    lfVenueIntro: (city) => `${city.name} bakeries with a café component or regular events — morning pastry tastings, seasonal baking classes, artisan market appearances — can build their direct customer base through LocalFeed bookings that capture every attendee's contact.`,
  },
  {
    name: 'pie-shops', slug: 'pie-shops', display: 'Pie Shops',
    titleWord: 'Pie Shops',
    advice: [
      'Pastry that is properly flaky, buttery, and baked fresh that morning is the minimum, not an achievement',
      'Fillings made from real cuts of slow-cooked meat rather than reformed protein are worth the premium',
      'Gluten-free and vegetarian pies that are genuinely good — not afterthoughts — show a kitchen that respects all its customers',
      'Local pie shops using regional produce in their fillings create something genuinely distinctive to their city',
      'A mince and cheese with depth of flavour and the right sauce-to-pastry ratio is harder to find than it should be',
      'Pie shops that win local baking awards and enter national competitions tend to back it up with quality every day',
    ],
    intro: (city) => `The pie is one of New Zealand's most democratic and beloved foods, and ${city.name} takes its pie culture seriously. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The pie shops worth going back to are the ones that treat the humble pie with the craft and respect the format deserves.`,
    lfVenueIntro: (city) => `Pie shops in ${city.name} running catering, corporate orders, or special event baking can use LocalFeed to manage pre-orders and build the customer contact base that drives repeat business.`,
  },
  {
    name: 'takeaways', slug: 'takeaways', display: 'Takeaways',
    titleWord: 'Takeaways',
    advice: [
      'Takeaways that cook to order rather than keeping food in a bain marie are worth the extra five minutes',
      'Family-run takeaways with recipes refined over years have flavour depth that chains cannot replicate',
      'A changing specials board signals genuine kitchen engagement — someone is thinking about what is good right now',
      'Portion sizes that are honest and consistent build the repeat business that sustains a takeaway long-term',
      'Takeaways that have served the same neighbourhood for a decade have earned their local reputation one meal at a time',
      'Look for takeaways that are properly licensed and inspected — it is a basic quality and safety signal',
    ],
    intro: (city) => `Takeaways are the backbone of everyday eating in ${city.name}. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The best takeaways have been feeding the same families for years — not because they are the only option, but because they earn that loyalty with every meal.`,
    lfVenueIntro: (city) => `Takeaways in ${city.name} with a loyal local following can use LocalFeed to build their direct customer list — enabling pre-orders, event catering bookings, and direct communication that platforms do not provide.`,
  },
  {
    name: 'delis', slug: 'delis', display: 'Delis',
    titleWord: 'Delis',
    advice: [
      'A good deli knows its producers by name and can tell you the story behind every product on the shelf',
      'In-house cured meats, house-made condiments, and scratch-made salads separate a real deli from a glorified bottle shop',
      'Cheese selections that feature NZ producers alongside genuine European imports show real curation and knowledge',
      'Delis that host tastings or producer events build community in a way that pure retail never achieves',
      'A counter that changes with the seasons — fresh takes on summer produce, preserved goods in winter — shows genuine engagement',
      'The deli that can build you a picnic box from what is genuinely at its best today is the one worth finding',
    ],
    intro: (city) => `Delis in ${city.name} have become destinations in their own right rather than just convenience stores with better cheese. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The best delis are curators as much as retailers — they make decisions about quality on your behalf so you do not have to.`,
    lfVenueIntro: (city) => `${city.name} delis running tasting events, producer dinners, or regular cooking demonstrations can list them on LocalFeed and capture the email of every attendee — building the customer list that fills the next event without paid advertising.`,
  },
  {
    name: 'dessert-shops', slug: 'dessert-shops', display: 'Dessert Shops',
    titleWord: 'Dessert Shops',
    advice: [
      'Dessert venues that churn their own ice cream or gelato in-house control the quality and the flavour fully',
      'Seasonal flavours built around what local fruit is genuinely at its peak show a kitchen engaged with the ingredient',
      'Smaller, rotating menus at dessert shops tend to indicate fresher, higher-quality product than long static lists',
      'Genuinely good gluten-free and dairy-free options — not just compliant ones — show real kitchen craft',
      'Late opening hours that match the after-dinner crowd make a dessert venue actually useful to its neighbourhood',
      'House-made sauces, fresh waffle batter, and scratch-made cones are the details that separate good from great',
    ],
    intro: (city) => `The dessert scene in ${city.name} has grown into something worth building part of an evening around. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The venues that stand out are the ones treating dessert as a craft rather than a margin opportunity.`,
    lfVenueIntro: (city) => `Dessert shops in ${city.name} running seasonal specials, launch events for new flavours, or evening dessert experiences can list on LocalFeed and build the direct customer list that turns one-time visitors into weekly regulars.`,
  },
  {
    name: 'pizzerias', slug: 'pizzerias', display: 'Pizzerias',
    titleWord: 'Pizzerias',
    advice: [
      'Wood-fired or proper high-temperature ovens produce the leopard-spotted crust that gas deck ovens cannot replicate',
      'Dough fermented for 48–72 hours has better flavour and digestibility — look for venues that mention their process',
      'Imported 00 flour and San Marzano tomatoes make a difference that is visible in the finished product',
      'Simple topping combinations executed perfectly beat crowded, overly-complex pizzas every single time',
      'Pizzerias that make their own pasta and sides show a team committed to from-scratch cooking across the board',
      'The crust should stand alone as something worth eating — good pizza is good bread with toppings, not the other way around',
    ],
    intro: (city) => `Pizza done properly is one of the most satisfying meals there is, and ${city.name} has venues that get it right. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The pizzerias worth returning to are the ones that understand fermentation, temperature, and restraint — three things most pizza places do not fully commit to.`,
    lfVenueIntro: (city) => `${city.name} pizzerias can use LocalFeed to list their own midweek offers — a two-pizza deal, a pizza and natural wine package, a family set menu — without the mandatory 50% off model that platforms like First Table require.`,
  },
  {
    name: 'brunch-spots', slug: 'brunch-spots', display: 'Brunch Spots',
    titleWord: 'Brunch Spots',
    advice: [
      'Free-range eggs from named local farms make a visible difference to every egg dish on the plate',
      'Good brunch coffee means properly extracted espresso from freshly ground specialty beans, not a supermarket blend',
      'Smashed avo that uses ripe, in-season avocado and genuinely good toast is NZ\'s authentic contribution to brunch culture',
      'Weekend menus that go beyond the standard and include something genuinely inventive reward regulars for coming back',
      'Honest queue management — accurate wait times and a visible system — respects your Saturday morning',
      'Brunch spots that source everything from the farmers market at 7am before service tell you everything about their priorities',
    ],
    intro: (city) => `Brunch is one of New Zealand's most serious cultural institutions, and ${city.name}'s competition for the best weekend spot is intense. ${city.context.charAt(0).toUpperCase() + city.context.slice(1)}. The brunch spots worth the queue are the ones where the coffee, the eggs, and the toast are all done with genuine craft — not just the Instagram shot.`,
    lfVenueIntro: (city) => `Brunch spots in ${city.name} that want to extend their trade into weekday bookings can list a weekday brunch or lunch offer on LocalFeed — reaching the work-from-home and late-riser segment with an offer designed for quieter sessions.`,
  },
];

// ─── ALL RELATED BLOG POSTS (link to all relevant new content) ────────────────

const ALL_BLOG_POSTS = [
  { slug: 'first-table-vs-localfeed-nz', title: 'First Table vs LocalFeed NZ: A Direct Comparison' },
  { slug: 'is-first-table-worth-it-for-nz-restaurants', title: 'Is First Table Worth It for NZ Restaurants?' },
  { slug: 'first-table-nz-for-restaurants-how-it-works', title: 'How First Table Works for NZ Restaurants' },
  { slug: 'first-table-review-nz-restaurant-owners', title: 'First Table NZ Review for Restaurant Owners' },
  { slug: 'best-restaurant-booking-app-nz-2026', title: 'Best Restaurant Booking Apps in NZ 2026' },
  { slug: 'restaurant-booking-system-nz', title: 'Restaurant Booking Systems in NZ 2026' },
  { slug: 'what-booking-platforms-actually-cost-nz-venues', title: 'What Booking Platforms Actually Cost NZ Venues' },
  { slug: 'commission-free-restaurant-platforms-nz-compared', title: 'Commission-Free Restaurant Platforms NZ Compared' },
  { slug: 'restaurant-no-shows-nz-cost-and-solutions', title: 'Restaurant No-Shows in NZ: Cost and Solutions' },
  { slug: 'how-to-fill-quiet-weekday-tables-nz', title: 'How to Fill Quiet Weekday Tables in NZ' },
  { slug: 'reducing-platform-dependency-nz-restaurants', title: 'How NZ Restaurants Can Reduce Platform Dependency' },
  { slug: 'restaurant-customer-data-nz', title: 'Restaurant Customer Data in NZ: Why It Matters' },
  { slug: 'why-venue-owned-customer-data-matters', title: 'Why Venue-Owned Customer Data Matters' },
  { slug: 'restaurant-cash-flow-nz', title: 'Restaurant Cash Flow in NZ' },
  { slug: 'restaurant-profit-margins-nz', title: 'Restaurant Profit Margins in NZ 2026' },
  { slug: 'restaurant-pricing-strategy-nz', title: 'Restaurant Pricing Strategy in NZ' },
  { slug: 'nz-restaurant-survival-guide-2026', title: 'NZ Restaurant Survival Guide 2026' },
  { slug: 'restaurant-email-marketing-nz', title: 'Restaurant Email Marketing in NZ' },
  { slug: 'restaurant-local-seo-nz', title: 'Restaurant Local SEO in NZ' },
  { slug: 'restaurant-google-reviews-nz', title: 'Restaurant Google Reviews in NZ' },
  { slug: 'restaurant-instagram-marketing-nz', title: 'Restaurant Instagram Marketing in NZ' },
  { slug: 'restaurant-groups-bookings-nz', title: 'Restaurant Groups Bookings in NZ' },
  { slug: 'restaurant-private-dining-nz', title: 'Restaurant Private Dining in NZ' },
  { slug: 'how-to-run-restaurant-events-nz', title: 'How to Run Restaurant Events in NZ' },
  { slug: 'midweek-restaurant-specials-nz', title: 'Midweek Restaurant Specials in NZ' },
  { slug: 'restaurant-loyalty-program-nz', title: 'Restaurant Loyalty Programs in NZ' },
  { slug: 'restaurant-staff-retention-nz', title: 'Restaurant Staff Retention in NZ' },
  { slug: 'restaurant-menu-design-nz', title: 'Restaurant Menu Design in NZ' },
  { slug: 'nz-restaurant-opening-checklist', title: 'NZ Restaurant Opening Checklist 2026' },
  { slug: 'nz-hospo-cost-of-living-impact', title: 'How Cost of Living is Reshaping NZ Dining' },
  { slug: 'nz-restaurant-industry-2026', title: 'NZ Restaurant Industry 2026' },
  { slug: 'restaurant-marketing-nz-what-actually-works', title: 'Restaurant Marketing NZ: What Actually Works' },
  { slug: 'how-nz-restaurants-can-compete-without-advertising-budget', title: 'How NZ Restaurants Compete Without an Advertising Budget' },
  { slug: 'first-table-alternative-nz', title: 'First Table Alternatives in NZ' },
];

// Select 4 contextually relevant posts for each city/venue combo
function getRelated(city, venueType) {
  const seed = city.slug.length * 7 + venueType.slug.length * 13;
  const pool = [...ALL_BLOG_POSTS];
  // Prioritise platform-relevant posts
  const priority = pool.filter(p =>
    p.slug.includes('first-table') || p.slug.includes('booking') || p.slug.includes('platform') || p.slug.includes('customer-data')
  );
  const rest = pool.filter(p => !priority.includes(p));
  const shuffleRest = rest.slice().sort((a, b) => ((seed + a.slug.length * 3) % rest.length) - ((seed + b.slug.length * 5) % rest.length));
  return [...priority.slice(0, 2), ...shuffleRest.slice(0, 2)];
}

// ─── PAGE GENERATOR ───────────────────────────────────────────────────────────

function generatePage(city, venueType) {
  const title = `Best ${venueType.display} in ${city.name} NZ — Discover Local Deals & Offers on LocalFeed`;
  const description = `Find the best ${venueType.name} in ${city.name}, New Zealand. LocalFeed features venue-designed offers from ${city.name} ${venueType.name} — no forced discounts, no booking fees, just real deals from real venues.`;
  const related = getRelated(city, venueType);

  return `---
title: "${title}"
description: "${description}"
city: "${city.name}"
venueType: "${venueType.display}"
citySlug: "${city.slug}"
venueTypeSlug: "${venueType.slug}"
---

# Best ${venueType.display} in ${city.name}

${venueType.intro(city)}

## What makes a great ${venueType.name.replace(/-/g, ' ')} in ${city.name}

${venueType.advice.map(a => `- ${a}`).join('\n')}

## Why ${city.name} diners are choosing LocalFeed

Most booking platforms in NZ extract margin from venues through commission or force deep discounts that venues absorb. The result: ${city.name} venues have to build the platform's cost into their pricing, or give away 50% of their food revenue to generate a booking.

${venueType.lfVenueIntro(city)}

LocalFeed operates differently: venues list their own offer at their own price. No commission per booking. No mandatory 50% food discount. The diner gets a genuine deal from a venue that chose to offer it. The venue keeps the customer relationship — including their contact details — for every booking that comes through.

For ${city.name} diners, this means discovering ${venueType.name} offers that are genuine rather than platform-engineered. The price you see is the price the ${city.name} venue decided to charge, not a platform-dictated markdown.

## Find ${venueType.display} deals in ${city.name} on LocalFeed

LocalFeed is where ${city.name} locals find ${venueType.name} offers from venues that actually designed them. No $15 booking fee charged to you at checkout. No artificially inflated prices to offset platform commission. Just real offers from ${city.name} ${venueType.name} that want to fill their tables on their own terms.

Visit [localfeed.app](https://localfeed.app) to discover the best ${venueType.name} deals in ${city.name} right now.

---

**Related reading for ${city.name} venue owners:**
${related.map(p => `- [${p.title}](/blog/${p.slug})`).join('\n')}
`;
}

// ─── WRITE ALL PAGES ──────────────────────────────────────────────────────────

fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;

// All cities × all venue types (300 pages)
for (const city of CITIES) {
  for (const venueType of VENUE_TYPES) {
    const filename = `${city.slug}-${venueType.slug}.md`;
    fs.writeFileSync(path.join(OUT_DIR, filename), generatePage(city, venueType), 'utf8');
    count++;
  }
}

// Auckland suburbs × key venue types (8 suburbs × 7 types = 56 pages)
const SUBURB_VENUE_TYPES = VENUE_TYPES.filter(v =>
  ['restaurants', 'cafes', 'bars', 'pubs', 'bistros', 'brunch-spots', 'wine-bars'].includes(v.slug)
);
for (const suburb of AUCKLAND_SUBURBS) {
  for (const venueType of SUBURB_VENUE_TYPES) {
    const filename = `${suburb.slug}-${venueType.slug}.md`;
    fs.writeFileSync(path.join(OUT_DIR, filename), generatePage(suburb, venueType), 'utf8');
    count++;
  }
}

// Wellington suburbs × key venue types (4 suburbs × 7 types = 28 pages)
for (const suburb of WELLINGTON_SUBURBS) {
  for (const venueType of SUBURB_VENUE_TYPES) {
    const filename = `${suburb.slug}-${venueType.slug}.md`;
    fs.writeFileSync(path.join(OUT_DIR, filename), generatePage(suburb, venueType), 'utf8');
    count++;
  }
}

// Christchurch areas × key venue types (3 areas × 7 types = 21 pages)
for (const area of CHRISTCHURCH_AREAS) {
  for (const venueType of SUBURB_VENUE_TYPES) {
    const filename = `${area.slug}-${venueType.slug}.md`;
    fs.writeFileSync(path.join(OUT_DIR, filename), generatePage(area, venueType), 'utf8');
    count++;
  }
}

console.log(`Generated ${count} local SEO pages in ${OUT_DIR}`);
