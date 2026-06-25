// data/animals.js
// Curated, accurate reference dataset for the animals WildMind features.
// Class is one of: Mammal | Bird | Reptile | Marine | Insect | Amphibian.
// Conservation status uses IUCN Red List categories.
// This is the source of truth for taxonomy/status so the UI never mislabels
// a species — the AI narrative and Wikipedia text are supplementary.

export const ANIMALS = {
  // ── Mammals ──────────────────────────────────────────────────────────
  lion: {
    name: 'Lion',
    class: 'Mammal',
    scientificName: 'Panthera leo',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Savanna, grassland, open woodland',
    region: 'Sub-Saharan Africa; one population in India',
    lifespan: '10–14 years in the wild',
    size: '1.7–2.5 m body; up to 250 kg',
    description:
      'The only truly social big cat, living in cooperative prides led by related females, with males defending territory.',
    fact: 'A lion’s roar can be heard up to 8 km away and helps prides coordinate across the savanna.',
  },
  tiger: {
    name: 'Tiger',
    class: 'Mammal',
    scientificName: 'Panthera tigris',
    status: 'Endangered',
    diet: 'Carnivore',
    habitat: 'Tropical forest, mangrove, grassland, taiga',
    region: 'South & Southeast Asia, Russian Far East',
    lifespan: '8–10 years in the wild',
    size: 'Up to 3.3 m and 300 kg (Amur tiger)',
    description:
      'The largest of all cats, a solitary ambush hunter whose stripes are as unique as a human fingerprint.',
    fact: 'No two tigers share the same stripe pattern — and the stripes mark the skin, not just the fur.',
  },
  'snow leopard': {
    name: 'Snow Leopard',
    class: 'Mammal',
    scientificName: 'Panthera uncia',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Alpine and subalpine zones, 3,000–4,500 m',
    region: 'Mountains of Central & South Asia',
    lifespan: '10–12 years in the wild',
    size: '1.0–1.3 m body; tail nearly as long; up to 55 kg',
    description:
      'The elusive "ghost of the mountains," superbly adapted to cold, thin air and steep, rocky terrain.',
    fact: 'Its tail can be a metre long — used for balance on cliffs and wrapped around the body like a scarf.',
  },
  'african elephant': {
    name: 'African Elephant',
    class: 'Mammal',
    scientificName: 'Loxodonta africana',
    status: 'Endangered',
    diet: 'Herbivore',
    habitat: 'Savanna, forest, desert margins, marshes',
    region: 'Sub-Saharan Africa',
    lifespan: '60–70 years',
    size: 'Up to 4 m at the shoulder; 6,000 kg',
    description:
      'The largest living land animal, living in tight matriarchal herds with remarkable memory and emotional intelligence.',
    fact: 'Elephants communicate over kilometres using infrasonic rumbles felt through the ground by their feet.',
  },
  'red fox': {
    name: 'Red Fox',
    class: 'Mammal',
    scientificName: 'Vulpes vulpes',
    status: 'Least Concern',
    diet: 'Omnivore',
    habitat: 'Forest, grassland, mountains, urban areas',
    region: 'Northern Hemisphere — the most widespread wild carnivore',
    lifespan: '2–5 years in the wild',
    size: '45–90 cm body; up to 14 kg',
    description:
      'A famously adaptable omnivore that thrives from arctic tundra to city centres.',
    fact: 'Red foxes may use Earth’s magnetic field to judge distance when pouncing on hidden prey.',
  },
  'gray wolf': {
    name: 'Gray Wolf',
    class: 'Mammal',
    scientificName: 'Canis lupus',
    status: 'Least Concern',
    diet: 'Carnivore',
    habitat: 'Forest, tundra, grassland, desert',
    region: 'North America, Europe, Asia',
    lifespan: '6–8 years in the wild',
    size: '1.0–1.6 m body; up to 80 kg',
    description:
      'The largest wild canid, a cooperative pack hunter and the ancestor of the domestic dog.',
    fact: 'A wolf pack is usually a single family — a breeding pair and their offspring of several years.',
  },
  'giant panda': {
    name: 'Giant Panda',
    class: 'Mammal',
    scientificName: 'Ailuropoda melanoleuca',
    status: 'Vulnerable',
    diet: 'Herbivore (99% bamboo)',
    habitat: 'Temperate mountain bamboo forest',
    region: 'Central China (Sichuan, Shaanxi, Gansu)',
    lifespan: '20 years in the wild',
    size: '1.2–1.9 m; up to 120 kg',
    description:
      'A bear that traded a carnivore’s gut for a near-exclusive bamboo diet, and a global symbol of conservation.',
    fact: 'Pandas have a "pseudo-thumb" — an enlarged wrist bone — that lets them grip bamboo stalks.',
  },
  chimpanzee: {
    name: 'Chimpanzee',
    class: 'Mammal',
    scientificName: 'Pan troglodytes',
    status: 'Endangered',
    diet: 'Omnivore',
    habitat: 'Tropical rainforest and savanna woodland',
    region: 'Equatorial Africa',
    lifespan: '33 years in the wild',
    size: 'Up to 1.7 m standing; 70 kg',
    description:
      'One of our closest living relatives, sharing ~98.8% of our DNA, with rich tool use and culture.',
    fact: 'Chimps make and use tools — stripping twigs to "fish" termites and using stones as hammers.',
  },
  'mountain gorilla': {
    name: 'Mountain Gorilla',
    class: 'Mammal',
    scientificName: 'Gorilla beringei beringei',
    status: 'Endangered',
    diet: 'Herbivore',
    habitat: 'High-altitude cloud forest, 2,200–4,300 m',
    region: 'Virunga Massif & Bwindi, Central Africa',
    lifespan: '35–40 years',
    size: 'Up to 1.8 m; 200 kg (silverback)',
    description:
      'The largest living primate, living in stable family groups led by a dominant silverback male.',
    fact: 'A conservation success: numbers have climbed back above 1,000 thanks to intensive protection.',
  },
  'polar bear': {
    name: 'Polar Bear',
    class: 'Mammal',
    scientificName: 'Ursus maritimus',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Arctic sea ice and coastlines',
    region: 'Arctic Circle',
    lifespan: '25–30 years',
    size: 'Up to 3 m; 700 kg',
    description:
      'The largest land carnivore, a marine specialist that hunts seals from the sea ice.',
    fact: 'Polar bear skin is black and their fur is hollow and translucent — not actually white.',
  },
  cheetah: {
    name: 'Cheetah',
    class: 'Mammal',
    scientificName: 'Acinonyx jubatus',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Open grassland and savanna',
    region: 'Africa and a tiny population in Iran',
    lifespan: '10–12 years in the wild',
    size: '1.1–1.5 m body; up to 65 kg',
    description:
      'The fastest land animal, built entirely for the sprint with a flexible spine and semi-retractable claws.',
    fact: 'A cheetah can hit 100 km/h in about three seconds — faster acceleration than most supercars.',
  },

  // ── Marine mammals & fish ────────────────────────────────────────────
  'blue whale': {
    name: 'Blue Whale',
    class: 'Marine',
    scientificName: 'Balaenoptera musculus',
    status: 'Endangered',
    diet: 'Carnivore (krill)',
    habitat: 'Open ocean, all major oceans',
    region: 'Worldwide',
    lifespan: '80–90 years',
    size: 'Up to 30 m; 150,000 kg',
    description:
      'The largest animal known to have ever existed — bigger than any dinosaur.',
    fact: 'Its heart is the size of a small car, and its call is the loudest sound made by any animal.',
  },
  'great white shark': {
    name: 'Great White Shark',
    class: 'Marine',
    scientificName: 'Carcharodon carcharias',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Coastal and offshore temperate seas',
    region: 'Worldwide in cool, productive waters',
    lifespan: '70+ years',
    size: 'Up to 6 m; 2,000 kg',
    description:
      'The ocean’s most iconic apex predator, with electroreception that detects prey’s muscle twitches.',
    fact: 'Great whites can sense the faint electric fields of hidden prey using organs called ampullae of Lorenzini.',
  },
  'bottlenose dolphin': {
    name: 'Bottlenose Dolphin',
    class: 'Marine',
    scientificName: 'Tursiops truncatus',
    status: 'Least Concern',
    diet: 'Carnivore',
    habitat: 'Coastal and open tropical-to-temperate seas',
    region: 'Worldwide',
    lifespan: '40–60 years',
    size: '2–4 m; up to 650 kg',
    description:
      'A highly intelligent, social cetacean that hunts cooperatively and uses echolocation.',
    fact: 'Dolphins sleep with one brain hemisphere at a time so they can keep surfacing to breathe.',
  },
  orca: {
    name: 'Orca',
    class: 'Marine',
    scientificName: 'Orcinus orca',
    status: 'Data Deficient',
    diet: 'Carnivore',
    habitat: 'All oceans, from polar to tropical',
    region: 'Worldwide',
    lifespan: 'Up to 80–90 years (females)',
    size: 'Up to 9 m; 6,000 kg',
    description:
      'The ocean’s top predator — actually the largest dolphin — living in matrilineal pods with distinct cultures.',
    fact: 'Different orca pods have unique "dialects" of calls passed down through generations.',
  },
  'humpback whale': {
    name: 'Humpback Whale',
    class: 'Marine',
    scientificName: 'Megaptera novaeangliae',
    status: 'Least Concern',
    diet: 'Carnivore (krill, small fish)',
    habitat: 'Open ocean; coastal breeding grounds',
    region: 'Worldwide',
    lifespan: '45–100 years',
    size: 'Up to 17 m; 30,000 kg',
    description:
      'A baleen whale famous for breaching, bubble-net feeding, and the complex songs of the males.',
    fact: 'Male humpbacks sing hours-long songs that evolve and spread between populations like pop music.',
  },
  vaquita: {
    name: 'Vaquita',
    class: 'Marine',
    scientificName: 'Phocoena sinus',
    status: 'Critically Endangered',
    diet: 'Carnivore',
    habitat: 'Shallow, turbid coastal waters',
    region: 'Northern Gulf of California, Mexico',
    lifespan: '~20 years',
    size: '1.2–1.5 m; up to 55 kg',
    description:
      'The world’s smallest and most endangered porpoise, with only around ten individuals left.',
    fact: 'The entire species lives in one small patch of sea — the smallest range of any marine mammal.',
  },

  // ── Birds ────────────────────────────────────────────────────────────
  'bald eagle': {
    name: 'Bald Eagle',
    class: 'Bird',
    scientificName: 'Haliaeetus leucocephalus',
    status: 'Least Concern',
    diet: 'Carnivore (mostly fish)',
    habitat: 'Near large bodies of open water',
    region: 'North America',
    lifespan: '20–30 years',
    size: 'Wingspan up to 2.3 m',
    description:
      'A powerful sea eagle and emblem of the United States, recovered from the brink after DDT was banned.',
    fact: 'Its eyesight is roughly four times sharper than a human’s — it can spot a rabbit 3 km away.',
  },
  'emperor penguin': {
    name: 'Emperor Penguin',
    class: 'Bird',
    scientificName: 'Aptenodytes forsteri',
    status: 'Near Threatened',
    diet: 'Carnivore (fish, squid, krill)',
    habitat: 'Antarctic sea ice and surrounding ocean',
    region: 'Antarctica',
    lifespan: '15–20 years',
    size: 'Up to 1.2 m; 45 kg',
    description:
      'The largest penguin, breeding through the brutal Antarctic winter where males incubate the egg.',
    fact: 'Males fast for ~65 days in −60°C winds, balancing the egg on their feet under a belly fold.',
  },
  'scarlet macaw': {
    name: 'Scarlet Macaw',
    class: 'Bird',
    scientificName: 'Ara macao',
    status: 'Least Concern',
    diet: 'Herbivore (fruit, nuts, seeds)',
    habitat: 'Humid lowland rainforest',
    region: 'Central & South America',
    lifespan: '40–50 years',
    size: 'Up to 90 cm including tail',
    description:
      'A brilliantly coloured parrot, highly intelligent and capable of mimicking human speech.',
    fact: 'Macaws gather at riverbank "clay licks" to eat mineral-rich clay that neutralises toxins in their diet.',
  },
  'snowy owl': {
    name: 'Snowy Owl',
    class: 'Bird',
    scientificName: 'Bubo scandiacus',
    status: 'Vulnerable',
    diet: 'Carnivore',
    habitat: 'Arctic tundra; winters further south',
    region: 'Circumpolar Arctic',
    lifespan: '10 years in the wild',
    size: 'Wingspan up to 1.5 m',
    description:
      'A large, day-hunting owl of the open tundra whose numbers track the boom-and-bust of lemmings.',
    fact: 'Unlike most owls, the snowy owl hunts in daylight — an adaptation to the 24-hour Arctic summer.',
  },

  // ── Reptiles ─────────────────────────────────────────────────────────
  'komodo dragon': {
    name: 'Komodo Dragon',
    class: 'Reptile',
    scientificName: 'Varanus komodoensis',
    status: 'Endangered',
    diet: 'Carnivore',
    habitat: 'Tropical savanna and dry forest',
    region: 'Lesser Sunda Islands, Indonesia',
    lifespan: '30+ years',
    size: 'Up to 3 m; 90 kg',
    description:
      'The largest living lizard, an ambush predator with serrated teeth and venom glands.',
    fact: 'Komodo dragons can detect carrion up to 9.5 km away using their forked, scent-sampling tongue.',
  },
  'king cobra': {
    name: 'King Cobra',
    class: 'Reptile',
    scientificName: 'Ophiophagus hannah',
    status: 'Vulnerable',
    diet: 'Carnivore (mainly other snakes)',
    habitat: 'Forest, mangrove, agricultural land',
    region: 'South & Southeast Asia',
    lifespan: '~20 years',
    size: 'Up to 5.5 m — the longest venomous snake',
    description:
      'The world’s longest venomous snake and the only one that builds a nest for its eggs.',
    fact: 'A single king cobra bite delivers enough neurotoxin to kill an elephant — or about 20 people.',
  },
  'green sea turtle': {
    name: 'Green Sea Turtle',
    class: 'Reptile',
    scientificName: 'Chelonia mydas',
    status: 'Endangered',
    diet: 'Herbivore (as adults)',
    habitat: 'Tropical and subtropical coastal seas',
    region: 'Worldwide warm oceans',
    lifespan: '70+ years',
    size: 'Up to 1.5 m shell; 160 kg',
    description:
      'A large sea turtle named for the greenish fat from its seagrass diet, migrating thousands of kilometres to nest.',
    fact: 'Females return to lay eggs on the very beach where they themselves hatched decades earlier.',
  },
  'nile crocodile': {
    name: 'Nile Crocodile',
    class: 'Reptile',
    scientificName: 'Crocodylus niloticus',
    status: 'Least Concern',
    diet: 'Carnivore',
    habitat: 'Rivers, lakes, marshes, estuaries',
    region: 'Sub-Saharan Africa',
    lifespan: '70–100 years',
    size: 'Up to 5 m; 750 kg',
    description:
      'Africa’s largest crocodilian and an apex ambush predator largely unchanged for millions of years.',
    fact: 'It has the strongest measured bite of any living animal — over 2,200 kg of force.',
  },
  'hawksbill sea turtle': {
    name: 'Hawksbill Sea Turtle',
    class: 'Reptile',
    scientificName: 'Eretmochelys imbricata',
    status: 'Critically Endangered',
    diet: 'Omnivore (mainly sponges)',
    habitat: 'Coral reefs and rocky coastal areas',
    region: 'Tropical oceans worldwide',
    lifespan: '50+ years',
    size: 'Up to 1 m shell; 80 kg',
    description:
      'A reef-dwelling turtle whose beautiful shell made it a target of the tortoiseshell trade.',
    fact: 'By eating sponges, hawksbills keep reefs healthy and let corals compete for space.',
  },

  // ── Insects ──────────────────────────────────────────────────────────
  'honey bee': {
    name: 'Honey Bee',
    class: 'Insect',
    scientificName: 'Apis mellifera',
    status: 'Least Concern',
    diet: 'Herbivore (nectar & pollen)',
    habitat: 'Almost any flowering habitat',
    region: 'Worldwide (native to Eurasia & Africa)',
    lifespan: 'Workers ~6 weeks; queens up to 5 years',
    size: '12–15 mm',
    description:
      'A keystone pollinator living in highly organised colonies built around a single queen.',
    fact: 'Bees "dance" — a figure-eight waggle that encodes the direction and distance to flowers.',
  },
  'monarch butterfly': {
    name: 'Monarch Butterfly',
    class: 'Insect',
    scientificName: 'Danaus plexippus',
    status: 'Vulnerable',
    diet: 'Herbivore (nectar; larvae eat milkweed)',
    habitat: 'Meadows, fields, roadsides',
    region: 'North & Central America',
    lifespan: '2–6 weeks; migrants up to 8 months',
    size: 'Wingspan 9–10 cm',
    description:
      'Famous for an epic multi-generational migration of up to 4,000 km across North America.',
    fact: 'No single butterfly makes the round trip — it takes three to four generations to complete the migration.',
  },
  'praying mantis': {
    name: 'Praying Mantis',
    class: 'Insect',
    scientificName: 'Mantodea (order)',
    status: 'Least Concern',
    diet: 'Carnivore',
    habitat: 'Gardens, grassland, forest',
    region: 'Worldwide in temperate & tropical zones',
    lifespan: '~1 year',
    size: '1–15 cm depending on species',
    description:
      'A patient ambush predator with raptorial forelegs and uniquely swivelling, almost human-like head movement.',
    fact: 'A mantis is the only insect that can turn its head 180° to look over its "shoulder."',
  },
  dragonfly: {
    name: 'Dragonfly',
    class: 'Insect',
    scientificName: 'Anisoptera (suborder)',
    status: 'Least Concern',
    diet: 'Carnivore',
    habitat: 'Near ponds, rivers, wetlands',
    region: 'Worldwide except Antarctica',
    lifespan: 'Adults a few weeks to months',
    size: 'Wingspan 2–15 cm',
    description:
      'An ancient, supremely agile aerial hunter that can fly in any direction, including backwards.',
    fact: 'Dragonflies catch prey mid-air with a ~95% success rate — among the highest of any predator.',
  },
  grasshopper: {
    name: 'Grasshopper',
    class: 'Insect',
    scientificName: 'Caelifera (suborder)',
    status: 'Least Concern',
    diet: 'Herbivore',
    habitat: 'Grassland, meadows, fields',
    region: 'Worldwide',
    lifespan: '~1 year',
    size: '1–7 cm',
    description:
      'A jumping, plant-eating insect with powerful hind legs; some species swarm into devastating locust plagues.',
    fact: 'A grasshopper can leap about 20 times its body length — like a human jumping a basketball court.',
  },

  // ── Amphibians ───────────────────────────────────────────────────────
  'poison dart frog': {
    name: 'Poison Dart Frog',
    class: 'Amphibian',
    scientificName: 'Dendrobatidae (family)',
    status: 'Near Threatened',
    diet: 'Carnivore (ants, mites)',
    habitat: 'Humid tropical rainforest floor',
    region: 'Central & South America',
    lifespan: '3–15 years',
    size: '1.5–6 cm',
    description:
      'Tiny, dazzlingly coloured frogs whose skin toxins warn predators to stay away.',
    fact: 'Their poison comes from their diet — frogs raised in captivity without those insects are harmless.',
  },
  axolotl: {
    name: 'Axolotl',
    class: 'Amphibian',
    scientificName: 'Ambystoma mexicanum',
    status: 'Critically Endangered',
    diet: 'Carnivore',
    habitat: 'Freshwater lakes and canals',
    region: 'Xochimilco, Mexico City',
    lifespan: '10–15 years',
    size: '15–45 cm',
    description:
      'A salamander that stays aquatic and larval for life, famous for regrowing limbs, organs, and even parts of its brain.',
    fact: 'Axolotls can regenerate entire limbs — and even spinal cord and heart tissue — without scarring.',
  },

  // ── Endangered tracker extras ────────────────────────────────────────
  'javan rhino': {
    name: 'Javan Rhino',
    class: 'Mammal',
    scientificName: 'Rhinoceros sondaicus',
    status: 'Critically Endangered',
    diet: 'Herbivore',
    habitat: 'Dense lowland tropical rainforest',
    region: 'Ujung Kulon National Park, Indonesia',
    lifespan: '30–45 years',
    size: 'Up to 3.2 m; 2,300 kg',
    description:
      'The rarest large mammal on Earth, surviving in a single protected population.',
    fact: 'Only one wild population remains — around 76 individuals in one Indonesian park.',
  },
  'amur leopard': {
    name: 'Amur Leopard',
    class: 'Mammal',
    scientificName: 'Panthera pardus orientalis',
    status: 'Critically Endangered',
    diet: 'Carnivore',
    habitat: 'Temperate broadleaf and mixed forest',
    region: 'Russian Far East & northeast China',
    lifespan: '10–15 years',
    size: '1.0–1.4 m body; up to 50 kg',
    description:
      'The world’s rarest big cat, adapted to cold forests with a thick, pale winter coat.',
    fact: 'Its fur grows up to 7 cm long in winter — far longer than any tropical leopard’s.',
  },
  'sumatran orangutan': {
    name: 'Sumatran Orangutan',
    class: 'Mammal',
    scientificName: 'Pongo abelii',
    status: 'Critically Endangered',
    diet: 'Omnivore (mostly fruit)',
    habitat: 'Tropical rainforest canopy',
    region: 'Sumatra, Indonesia',
    lifespan: '45–50 years',
    size: 'Up to 1.5 m; 90 kg',
    description:
      'A highly intelligent great ape that spends almost its entire life in the trees.',
    fact: 'Orangutans craft tools and even make a fresh leafy "umbrella" or sleeping nest each night.',
  },
  'sumatran tiger': {
    name: 'Sumatran Tiger',
    class: 'Mammal',
    scientificName: 'Panthera tigris sumatrae',
    status: 'Critically Endangered',
    diet: 'Carnivore',
    habitat: 'Lowland and montane rainforest',
    region: 'Sumatra, Indonesia',
    lifespan: '15 years',
    size: 'Up to 2.5 m; 140 kg — the smallest tiger',
    description:
      'The last of Indonesia’s tigers, smaller and darker than its mainland cousins.',
    fact: 'It is the most heavily striped tiger and has webbed paws that make it a strong swimmer.',
  },
  'african forest elephant': {
    name: 'African Forest Elephant',
    class: 'Mammal',
    scientificName: 'Loxodonta cyclotis',
    status: 'Critically Endangered',
    diet: 'Herbivore',
    habitat: 'Dense tropical rainforest',
    region: 'Congo Basin, Central Africa',
    lifespan: '60–70 years',
    size: 'Up to 2.4 m at the shoulder; 2,700 kg',
    description:
      'A smaller, elusive elephant whose seed-dispersing role makes it the "gardener" of the rainforest.',
    fact: 'It plants forests — some Central African trees depend almost entirely on it to disperse their seeds.',
  },
}

// Aliases: common short search terms → canonical dataset key.
const ALIASES = {
  elephant: 'african elephant',
  leopard: 'snow leopard',
  whale: 'blue whale',
  shark: 'great white shark',
  panda: 'giant panda',
  gorilla: 'mountain gorilla',
  penguin: 'emperor penguin',
  wolf: 'gray wolf',
  dolphin: 'bottlenose dolphin',
  bee: 'honey bee',
  butterfly: 'monarch butterfly',
  cobra: 'king cobra',
  eagle: 'bald eagle',
  owl: 'snowy owl',
  frog: 'poison dart frog',
  rhino: 'javan rhino',
  rhinoceros: 'javan rhino',
  orangutan: 'sumatran orangutan',
  crocodile: 'nile crocodile',
  croc: 'nile crocodile',
  turtle: 'green sea turtle',
  mantis: 'praying mantis',
  killer: 'orca',
  'killer whale': 'orca',
  macaw: 'scarlet macaw',
  fox: 'red fox',
}

export function normalizeKey(name = '') {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Look up an animal in the curated dataset (exact, alias, or singular match).
 * Returns the data object or null if unknown.
 */
export function getAnimal(name) {
  const key = normalizeKey(name)
  if (!key) return null
  if (ANIMALS[key]) return ANIMALS[key]
  if (ALIASES[key] && ANIMALS[ALIASES[key]]) return ANIMALS[ALIASES[key]]
  // Try a singular form (drop a trailing "s").
  const singular = key.replace(/s$/, '')
  if (ANIMALS[singular]) return ANIMALS[singular]
  if (ALIASES[singular] && ANIMALS[ALIASES[singular]]) return ANIMALS[ALIASES[singular]]
  return null
}

// Word-boundary keyword matching used ONLY when an animal isn't in the dataset.
// Order matters: more specific classes are checked first. We match against the
// animal NAME only (never free Wikipedia text) to avoid false positives like
// "eleph-ant" → Insect or "impo-rtant"/"g-ray" hits.
const CLASS_PATTERNS = [
  ['Amphibian', /\b(frog|toad|salamander|newt|axolotl|amphibian|caecilian)\b/],
  ['Reptile', /\b(reptile|snake|lizard|cobra|crocodile|gecko|dragon|python|iguana|tortoise|turtle|chameleon|viper|alligator|skink|monitor|anaconda)\b/],
  ['Bird', /\b(bird|eagle|owl|penguin|parrot|falcon|hawk|macaw|sparrow|crane|duck|goose|swan|robin|finch|heron|stork|flamingo|peacock|vulture|kiwi|ostrich|emu|pelican|woodpecker|toucan|hummingbird|pigeon|seagull|gull)\b/],
  ['Insect', /\b(insect|butterfly|bee|beetle|ant|mantis|moth|dragonfly|wasp|grasshopper|cricket|locust|cockroach|termite|firefly|ladybug|caterpillar|hornet|cicada|aphid|flea)\b/],
  ['Marine', /\b(whale|dolphin|shark|fish|octopus|seal|sealion|ray|orca|coral|jellyfish|squid|manatee|walrus|narwhal|dugong|porpoise|stingray|eel|seahorse|crab|lobster|starfish|urchin)\b/],
]

/**
 * Determine an animal's class. Prefers the curated dataset; otherwise falls
 * back to word-boundary keyword matching on the name. Defaults to Mammal.
 */
export function classifyAnimal(name) {
  const data = getAnimal(name)
  if (data) return data.class
  const n = normalizeKey(name)
  for (const [cls, pattern] of CLASS_PATTERNS) {
    if (pattern.test(n)) return cls
  }
  return 'Mammal'
}

// Animals grouped for the Explore page and category browsing.
export const EXPLORE_ANIMALS = [
  'African Elephant',
  'Snow Leopard',
  'Red Fox',
  'Bald Eagle',
  'Emperor Penguin',
  'Scarlet Macaw',
  'Komodo Dragon',
  'King Cobra',
  'Great White Shark',
  'Bottlenose Dolphin',
  'Honey Bee',
  'Monarch Butterfly',
]

export const CATEGORIES = ['All', 'Mammal', 'Bird', 'Reptile', 'Marine', 'Insect', 'Amphibian']

/**
 * Suggest related animals of the same class (excluding the given one).
 */
export function getRelated(name, limit = 4) {
  const cls = classifyAnimal(name)
  const key = normalizeKey(name)
  return Object.values(ANIMALS)
    .filter((a) => a.class === cls && normalizeKey(a.name) !== key)
    .slice(0, limit)
    .map((a) => a.name)
}
