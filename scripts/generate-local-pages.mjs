#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src/content/local');

const CITIES = [
  { name: 'Auckland', slug: 'auckland', context: 'New Zealand\'s largest city with over 1.7 million people and a food scene as diverse as its population', region: 'Auckland' },
  { name: 'Wellington', slug: 'wellington', context: 'the capital city with a punchy cafe culture, a strong after-work dining scene, and some of NZ\'s best independent venues per capita', region: 'Wellington' },
  { name: 'Christchurch', slug: 'christchurch', context: 'a city that rebuilt itself and in doing so created one of NZ\'s most exciting emerging food scenes', region: 'Canterbury' },
  { name: 'Hamilton', slug: 'hamilton', context: 'a university city with a growing food culture and a loyal local customer base that wants good value without the Auckland prices', region: 'Waikato' },
  { name: 'Tauranga', slug: 'tauranga', context: 'one of NZ\'s fastest-growing cities with a beach lifestyle, strong local pride, and a food scene that punches well above its size', region: 'Bay of Plenty' },
  { name: 'Dunedin', slug: 'dunedin', context: 'a student city with a creative food scene, strong community values, and diners who support local venues with genuine loyalty', region: 'Otago' },
  { name: 'Palmerston North', slug: 'palmerston-north', context: 'a city where locals know their venues well and word-of-mouth still drives more covers than any platform', region: 'Manawatu' },
  { name: 'Napier', slug: 'napier', context: 'the art deco capital of NZ with a strong wine tourism trade and a local dining scene that serves both visitors and year-round regulars', region: 'Hawke\'s Bay' },
  { name: 'Hastings', slug: 'hastings', context: 'the heart of Hawke\'s Bay\'s food bowl, with access to the best local produce in NZ and venues that know how to use it', region: 'Hawke\'s Bay' },
  { name: 'Nelson', slug: 'nelson', context: 'a sunny, creative city with a strong artisan food culture, brewery scene, and diners who value independent venues over chains', region: 'Nelson' },
  { name: 'Rotorua', slug: 'rotorua', context: 'a tourist hub where the challenge is building loyalty from a transient visitor base while also serving a tight-knit local community', region: 'Bay of Plenty' },
  { name: 'New Plymouth', slug: 'new-plymouth', context: 'a coastal city with a strong arts scene, good energy, and locals who know exactly which venues are worth their time', region: 'Taranaki' },
  { name: 'Whanganui', slug: 'whanganui', context: 'a rising creative city where independent venues are core to the community and where every regular feels like part of the story', region: 'Whanganui' },
  { name: 'Invercargill', slug: 'invercargill', context: 'the southernmost major city in NZ with a loyal local base and venues that rely on repeat business more than tourist traffic', region: 'Southland' },
  { name: 'Whangarei', slug: 'whangarei', context: 'the gateway to Northland with a growing cafe and dining scene that serves both locals and the touring crowd heading north', region: 'Northland' },
  { name: 'Gisborne', slug: 'gisborne', context: 'the first city in the world to see the sun, with a warm climate, strong surf culture, and a food scene built on local produce', region: 'Gisborne' },
  { name: 'Blenheim', slug: 'blenheim', context: 'the wine capital of NZ surrounded by Marlborough\'s vineyards, where food and wine culture is woven into daily life', region: 'Marlborough' },
  { name: 'Queenstown', slug: 'queenstown', context: 'NZ\'s adventure capital with the highest concentration of restaurants per capita and a market split between tourists chasing experiences and locals wanting value', region: 'Otago' },
  { name: 'Timaru', slug: 'timaru', context: 'a working port city with strong community ties and locals who support their own hospitality scene with real loyalty', region: 'Canterbury' },
  { name: 'Pukekohe', slug: 'pukekohe', context: 'a growing South Auckland town with a rapidly expanding population and a local dining scene that is catching up fast', region: 'Auckland' },
];

const VENUE_TYPES = [
  {
    name: 'cafes', slug: 'cafes', display: 'Cafes',
    advice: [
      'Look for cafes that source local milk, eggs, and bread — it shows in the quality of every dish',
      'The best cafes know their regulars by name and remember their usual order',
      'Check when the coffee machine was last serviced — a well-maintained machine makes a consistent flat white',
      'A good cafe handles the breakfast rush without cutting corners on presentation or portions',
      'Seasonal menus mean the kitchen is engaged and the produce is genuinely fresh',
    ],
    intro: (city, context) => `${city} has no shortage of places to get a coffee and something to eat. But ${context}. The venues worth your time are the ones that treat every morning service with the same care as a dinner sitting.`,
  },
  {
    name: 'restaurants', slug: 'restaurants', display: 'Restaurants',
    advice: [
      'A tight, seasonal menu beats a long menu full of freezer items every time',
      'Ask where the protein is sourced — the best NZ restaurants name their suppliers',
      'Service tempo matters as much as food quality — you should feel looked after, not chased out',
      'Wine lists that feature NZ producers alongside their international picks show genuine engagement',
      'Reservation policies that respect your time are a sign of a well-run operation',
    ],
    intro: (city, context) => `Finding a great restaurant in ${city} takes more than scrolling through aggregator apps. ${context.charAt(0).toUpperCase() + context.slice(1)}. The venues that earn repeat business are the ones that focus on the plate, not the promotion.`,
  },
  {
    name: 'pubs', slug: 'pubs', display: 'Pubs',
    advice: [
      'Look for pubs that rotate their taps seasonally and feature NZ craft breweries',
      'A good pub kitchen runs proper mise en place — not everything comes from a packet',
      'Happy hour that\'s actually generous shows a venue confident in its regular base',
      'Sports coverage that does not drown out conversation is a sign of thoughtful design',
      'Staff who know their beer list and can give a genuine recommendation make a real difference',
    ],
    intro: (city, context) => `${city}'s pub scene is where locals go after work, after sport, and after everything else. ${context.charAt(0).toUpperCase() + context.slice(1)}. The best pubs in ${city} feel like a second living room — comfortable, honest, and never trying too hard.`,
  },
  {
    name: 'bars', slug: 'bars', display: 'Bars',
    advice: [
      'Cocktail bars worth going to have bartenders who can talk about their spirits and make recommendations',
      'A bar with a thoughtful non-alcoholic menu shows it cares about every customer, not just the drinking ones',
      'Good bars keep glassware clean and well-maintained — it is a visible signal of overall standards',
      'Lighting and music levels that let you have a conversation are rarer than they should be',
      'Look for bars that collaborate with local distilleries, breweries, and producers',
    ],
    intro: (city, context) => `The bar scene in ${city} ranges from dive spots to destination cocktail bars. ${context.charAt(0).toUpperCase() + context.slice(1)}. The venues worth finding are the ones where the drinks are genuinely considered and the experience respects your evening.`,
  },
  {
    name: 'breweries', slug: 'breweries', display: 'Breweries',
    advice: [
      'Taprooms that brew on-site and serve fresh give you something no bottleshop can replicate',
      'Look for breweries that rotate seasonals and offer tasting paddles so you can explore the range',
      'Food menus at breweries should be designed to complement the beer, not compete with it',
      'Breweries that collaborate with other NZ producers tend to have more interesting and varied output',
      'A good taproom has staff who can explain the brewing process and help you find your style',
    ],
    intro: (city, context) => `NZ craft brewing has grown into one of the world's most interesting scenes, and ${city} is part of that story. ${context.charAt(0).toUpperCase() + context.slice(1)}. The breweries worth visiting are the ones that treat every pour as a chance to show what local ingredients and real craft can do.`,
  },
  {
    name: 'wine-bars', slug: 'wine-bars', display: 'Wine Bars',
    advice: [
      'A wine bar with a genuine by-the-glass programme lets you explore without committing to a bottle',
      'The best NZ wine bars feature producers from all major regions, not just the obvious ones',
      'Small plates designed to pair with wine show a kitchen that understands the whole experience',
      'Natural wine lists have grown significantly — look for bars that can explain what they\'re offering',
      'Venues that change their list seasonally and talk about their producers are the ones worth returning to',
    ],
    intro: (city, context) => `Wine bars in ${city} sit at the intersection of hospitality and education. ${context.charAt(0).toUpperCase() + context.slice(1)}. The best wine bars make NZ's exceptional wine regions feel accessible without the intimidation.`,
  },
  {
    name: 'food-trucks', slug: 'food-trucks', display: 'Food Trucks',
    advice: [
      'Food trucks that focus on one cuisine or even one dish tend to execute better than those trying to do everything',
      'Check their social media for weekly location updates — the best trucks build a loyal following',
      'Queue length at lunch is usually a reliable signal of quality — locals know where to go',
      'Look for trucks that source local ingredients even at scale — it is possible and it shows',
      'Trucks that appear at farmers markets tend to value quality ingredients over volume margins',
    ],
    intro: (city, context) => `Food trucks have become a genuine part of ${city}'s food culture. ${context.charAt(0).toUpperCase() + context.slice(1)}. The best trucks have built loyal followings by doing one thing exceptionally well and showing up consistently.`,
  },
  {
    name: 'bakeries', slug: 'bakeries', display: 'Bakeries',
    advice: [
      'A bakery that starts from scratch every morning and sells out by early afternoon is doing it right',
      'Sourdough that has real flavour and crust comes from proper fermentation time, not shortcuts',
      'Seasonal pastries and specials show a team that is engaged and creative, not just running a formula',
      'Local flour and butter sourcing makes a difference in the final product that you can taste',
      'Bakeries that are honest about sell-out times help you plan your visit and avoid disappointment',
    ],
    intro: (city, context) => `The rise of serious bread and pastry culture in ${city} has been one of the best developments in NZ hospo. ${context.charAt(0).toUpperCase() + context.slice(1)}. A great bakery is not just about the product — it is about the craft and the people behind it.`,
  },
  {
    name: 'pie-shops', slug: 'pie-shops', display: 'Pie Shops',
    advice: [
      'Pastry that is properly flaky and baked fresh that morning is the starting point, not an achievement',
      'Fillings made from real cuts of meat rather than reformed protein are worth seeking out',
      'Gluten-free and vegetarian options that are genuinely good, not afterthoughts, show a thoughtful kitchen',
      'Local pie shops that use regional produce in their fillings create something you cannot get anywhere else',
      'A mince and cheese that has depth of flavour and the right sauce-to-pastry ratio is harder to find than it should be',
    ],
    intro: (city, context) => `The pie is a New Zealand institution, and ${city} takes it seriously. ${context.charAt(0).toUpperCase() + context.slice(1)}. The pie shops worth knowing are the ones that treat the humble pie with the respect it deserves.`,
  },
  {
    name: 'takeaways', slug: 'takeaways', display: 'Takeaways',
    advice: [
      'Takeaways that cook to order rather than keeping food sitting in a bain marie are always worth the extra five minutes',
      'Family-run takeaways with recipes passed through generations tend to have flavour depth that larger operations cannot replicate',
      'Look for takeaways that change their specials board regularly — it signals genuine kitchen engagement',
      'Portion sizes that are honest and consistent build the repeat business that sustains a takeaway long-term',
      'Takeaways that have been operating in the same location for years have usually earned their local reputation',
    ],
    intro: (city, context) => `Takeaways are the backbone of everyday eating in ${city}. ${context.charAt(0).toUpperCase() + context.slice(1)}. The best takeaways have been feeding the same families for years because they earn that loyalty with every order.`,
  },
  {
    name: 'delis', slug: 'delis', display: 'Delis',
    advice: [
      'A good deli knows its suppliers by name and can tell you the story behind every product on the shelf',
      'In-house cured meats, house-made condiments, and scratch-made salads separate a real deli from a glorified bottle shop',
      'Cheese selections that feature NZ producers alongside European imports show genuine curation',
      'Delis that host tastings or events build community in a way that pure retail never can',
      'Look for delis that change their ready-to-eat selection with the seasons rather than running the same rotation year-round',
    ],
    intro: (city, context) => `Delis in ${city} have become destinations in their own right. ${context.charAt(0).toUpperCase() + context.slice(1)}. The best delis are curators as much as retailers — they make decisions about quality on your behalf so you do not have to.`,
  },
  {
    name: 'dessert-shops', slug: 'dessert-shops', display: 'Dessert Shops',
    advice: [
      'Dessert venues that make their own ice cream or gelato in-house have full control over flavour and quality',
      'Seasonal flavours using local fruit show a team that is engaged with what is actually good right now',
      'Smaller, rotating menus at dessert shops tend to indicate better quality than long standing lists',
      'Dietary options that are genuinely delicious, not just technically compliant, show real kitchen craft',
      'Late opening hours that match the after-dinner crowd make a dessert venue genuinely useful',
    ],
    intro: (city, context) => `The dessert scene in ${city} has grown into something worth building an evening around. ${context.charAt(0).toUpperCase() + context.slice(1)}. The venues that stand out are the ones treating dessert as a craft rather than a margin play.`,
  },
  {
    name: 'bistros', slug: 'bistros', display: 'Bistros',
    advice: [
      'Bistros that change their menu weekly based on what is available show a kitchen in genuine dialogue with its suppliers',
      'A well-maintained wine list that does not try to be a full restaurant wine programme but hits the right notes is a good sign',
      'Bistro service should feel informed and easy, not formal — the best ones feel like dining with people who love food',
      'Chalkboard specials done well are a sign of a kitchen that is engaged with what is fresh and seasonal',
      'Bistros that take walk-ins and manage the floor with genuine hospitality outperform reservation-only spots for overall experience',
    ],
    intro: (city, context) => `A proper bistro is one of the hardest hospitality formats to get right, and ${city} has some that do it well. ${context.charAt(0).toUpperCase() + context.slice(1)}. The bistro model — simple, quality-led, relationship-driven — is what NZ hospo does best when it is not overthinking.`,
  },
  {
    name: 'pizzerias', slug: 'pizzerias', display: 'Pizzerias',
    advice: [
      'Wood-fired or proper high-temperature ovens produce leopard-spotted crust that gas deck ovens simply cannot replicate',
      'Dough that has fermented for 48-72 hours has better flavour and digestibility — look for venues that mention their process',
      'Imported 00 flour and San Marzano tomatoes are worth paying for and the difference is visible in the finished pizza',
      'Simple topping combinations done perfectly beat crowded, overly complex pizzas every time',
      'Pizzerias that make their own fresh pasta and sides show a team committed to from-scratch cooking across the board',
    ],
    intro: (city, context) => `Pizza done properly is one of the most satisfying meals there is, and ${city} has venues getting it right. ${context.charAt(0).toUpperCase() + context.slice(1)}. The pizzerias worth returning to are the ones that understand fermentation, heat, and restraint.`,
  },
  {
    name: 'brunch-spots', slug: 'brunch-spots', display: 'Brunch Spots',
    advice: [
      'Free-range eggs from named local farms make a visible difference to every egg dish on the plate',
      'Good brunch coffee means proper espresso-based drinks with freshly ground beans, not a supermarket blend',
      'Smashed avo that uses ripe, in-season avocado and good bread is one of NZ\'s genuine culinary contributions',
      'Weekend brunch menus that go beyond the standard fare and include something genuinely inventive are worth seeking out',
      'Venues that manage their weekend queue well, with honest wait times and a system, respect your Saturday morning',
    ],
    intro: (city, context) => `Brunch is a serious cultural institution in ${city}, and the competition for the best spot on a Saturday morning is real. ${context.charAt(0).toUpperCase() + context.slice(1)}. The brunch spots worth the queue are the ones where every element — coffee, egg, bread — is done with genuine care.`,
  },
];

const RELATED_POSTS = [
  { slug: 'what-booking-platforms-actually-cost-nz-venues', title: 'What Booking Platforms Actually Cost Your NZ Venue' },
  { slug: 'commission-free-restaurant-platforms-nz-compared', title: 'Commission-Free Restaurant Platforms NZ: Compared' },
  { slug: 'restaurant-marketing-nz-what-actually-works', title: 'Restaurant Marketing NZ: What Actually Works' },
  { slug: 'how-to-fill-quiet-tables-without-discounting-your-brand', title: 'How to Fill Quiet Tables Without Discounting Your Brand' },
  { slug: 'tauranga-cafe-marketing-guide', title: 'Tauranga Cafe Marketing Guide' },
  { slug: 'why-venue-owned-customer-data-matters', title: 'Why Venue-Owned Customer Data Matters' },
  { slug: 'how-nz-restaurants-can-compete-without-advertising-budget', title: 'How NZ Restaurants Can Compete Without an Advertising Budget' },
];

function getRelated(citySlug, venueTypeSlug) {
  // Pick 3 posts based on a deterministic selection
  const seed = citySlug.length + venueTypeSlug.length;
  const shuffled = [...RELATED_POSTS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 1)) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

function getLFParagraph(venueType, city, variant) {
  const paragraphs = [
    `LocalFeed works differently from every other platform in the NZ market. Venues list their own offers, set their own prices, and run their own deals without giving up 50% of food revenue or paying a commission on every cover. When you find a ${venueType.name} deal on LocalFeed, the price you pay is the price the venue chose, not a platform-forced discount.`,
    `The problem with most booking and discovery platforms is the extraction model: they charge venues a commission on every booking, or force deep discounts to generate traffic. LocalFeed charges a flat weekly fee and takes nothing from the food bill. For ${city.name} ${venueType.name}, that means they can list a genuine offer without having to build the platform's margin into their pricing.`,
    `For diners in ${city.name}, LocalFeed means finding real deals from venues that designed them. No $15 booking fee charged to you at checkout. No artificially inflated menu prices to offset what the platform takes. The venue keeps the relationship, the margin, and the customer. That is better for everyone except the platforms that depend on extraction to survive.`,
  ];
  return paragraphs[variant % paragraphs.length];
}

function generatePage(city, venueType, index) {
  const title = `Best ${venueType.display} in ${city.name} NZ — Local Deals & Offers`;
  const description = `Find the best ${venueType.name} in ${city.name} on LocalFeed. Commission-free deals, venue-designed offers, and no booking fees. Discover ${city.name} ${venueType.name} worth your time.`;
  const related = getRelated(city.slug, venueType.slug);
  const lfVariant = index % 3;

  const content = `---
title: "${title}"
description: "${description}"
city: "${city.name}"
venueType: "${venueType.display}"
citySlug: "${city.slug}"
venueTypeSlug: "${venueType.slug}"
---

# Best ${venueType.display} in ${city.name}

${venueType.intro(city.name, city.context)}

## What to look for in a great ${venueType.name.replace(/-/g, ' ')} in ${city.name}

${venueType.advice.map(a => `- ${a}`).join('\n')}

## Why LocalFeed is different for ${city.name} ${venueType.name}

${getLFParagraph(venueType, city, lfVariant)}

${getLFParagraph(venueType, city, lfVariant + 1)}

${getLFParagraph(venueType, city, lfVariant + 2)}

## Discover ${venueType.name} in ${city.name} on LocalFeed

LocalFeed is where ${city.name} locals find deals from venues that actually want to give them. No platform forcing a venue to slash prices. No booking fee charged to the diner. Just real offers from real ${city.name} ${venueType.name}.

Download the LocalFeed app or visit [localfeed.app](https://localfeed.app) to find the best ${venueType.name} deals in ${city.name} right now.

---

**Related reading:**
${related.map(p => `- [${p.title}](/blog/${p.slug})`).join('\n')}
`;

  return content;
}

// Create output directory
fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (let ci = 0; ci < CITIES.length; ci++) {
  const city = CITIES[ci];
  for (let vi = 0; vi < VENUE_TYPES.length; vi++) {
    const venueType = VENUE_TYPES[vi];
    const filename = `${city.slug}-${venueType.slug}.md`;
    const filepath = path.join(OUT_DIR, filename);
    const content = generatePage(city, venueType, ci * VENUE_TYPES.length + vi);
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
  }
}

console.log(`Generated ${count} local SEO pages in ${OUT_DIR}`);
