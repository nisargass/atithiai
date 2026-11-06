// Dynamic Curated Holiday Packages for Mysuru & Beyond
// Supports filtering by Duration, Budget Tier, Themes, Senior Fit Score & Inclusions
export const PACKAGES_DATA = [
  // ==================== MYSURU & SURROUNDING CIRCUIT ====================
  {
    id: "pkg-mys-royal-2d",
    cityId: "mysuru",
    cityName: "Mysuru",
    title: "Royal Mysuru & Silk Trail Experience",
    duration: "2 Days / 1 Night",
    daysCount: 2,
    budgetTier: "Premium", // "Budget", "Premium", "Royal Luxury"
    theme: "Royal Heritage & Culinary",
    seniorScore: 95,
    rating: 4.9,
    reviewsCount: 420,
    pricePerPerson: 4999,
    originalPrice: 6500,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "1 Night Heritage Hotel Stay (Royal Orchid Metropole / Lalitha Mahal)",
      "VIP Fast-Track Pass for Mysore Palace Illumination & Varaha Gate Drop",
      "Private AC Chauffeur with Exact Entrance Navigation",
      "Guided KSIC Silk Weaving Workshop & Artisan Visit",
      "Authentic Mylari Dosa & Royal Guru Sweets Mysore Pak Tasting"
    ],
    dayPlan: [
      { 
        day: 1, 
        title: "Palace Grandeur & Agrahara Culinary Walk", 
        desc: "Step-free Varaha Gate drop-off, guided audio tour of Amba Vilas, lunch at Original Mylari Agrahara Mess, evening 100,000 bulb illumination ceremony." 
      },
      { 
        day: 2, 
        title: "Chamundi Hill & Railway Museum", 
        desc: "Senior-accessible VIP Hilltop darshan, visit Nandi monolith, afternoon vintage royal saloon exploration, and KSIC silk loom artisan visit." 
      }
    ],
    ecoPoints: 60,
    weatherResilient: true
  },
  {
    id: "pkg-mys-nature-3d",
    cityId: "mysuru",
    cityName: "Mysuru",
    title: "Mysuru Eco-Heritage & Wildlife Sanctuary",
    duration: "3 Days / 2 Nights",
    daysCount: 3,
    budgetTier: "Royal Luxury",
    theme: "Eco-Tourism & Nature",
    seniorScore: 92,
    rating: 4.8,
    reviewsCount: 280,
    pricePerPerson: 8499,
    originalPrice: 10500,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "2 Nights Eco-Resort Stay near Chamundi Foothills / The Green Hotel",
      "Ranganathittu Bird Sanctuary Guided Boat Safari with Naturalist",
      "Mysuru Zoo Battery EV Buggy Pass & Walk-through Aviary",
      "Kukkarahalli Lake Sunrise Wetland Trail",
      "KRS Brindavan Gardens Musical Fountain Pass",
      "Organic Farm-to-Table Meals Included"
    ],
    dayPlan: [
      { 
        day: 1, 
        title: "Arrival & Srirangapatna Island Fortress", 
        desc: "Ranganathaswamy Temple, Tipu Sultan Summer Palace, Kaveri riverside heritage trail." 
      },
      { 
        day: 2, 
        title: "Bird Sanctuary & Royal Palace", 
        desc: "Early morning boat safari with pelicans & painted storks, afternoon Mysore Palace & Karanji walk-through aviary." 
      },
      { 
        day: 3, 
        title: "Melukote Heritage & Wetland Trail", 
        desc: "Sanskrit Research Academy, sacred Kalyani pond, and return transfer via scenic highway." 
      }
    ],
    ecoPoints: 75,
    weatherResilient: true
  },
  {
    id: "pkg-mys-slow-5d",
    cityId: "mysuru",
    cityName: "Mysuru",
    title: "Grand 5-Day Slow Heritage & Artisan Immersion",
    duration: "5 Days / 4 Nights",
    daysCount: 5,
    budgetTier: "Royal Luxury",
    theme: "Comprehensive Slow Tourism & Elder-Care",
    seniorScore: 98,
    rating: 5.0,
    reviewsCount: 190,
    pricePerPerson: 14999,
    originalPrice: 18500,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "4 Nights Palace Stay at Lalitha Mahal Palace & Green Hotel",
      "Dedicated Wheelchair & Senior Assistant throughout the trip",
      "VIP Fast-Track Entries to All 12 Major & Hidden Heritage Landmarks",
      "Mysuru Sand Sculpture, Railway & Folklore Museums (100% sheltered)",
      "Bandipur Project Tiger EV Safari Day Trip",
      "GI Sandalwood & Silk Master Artisan Workshops",
      "All Commission-Free Heritage Mess Banquets Included"
    ],
    dayPlan: [
      { 
        day: 1, 
        title: "Royal Arrival & Mysore Palace Illumination", 
        desc: "Check-in at Lalitha Mahal, afternoon Ravi Varma Jaganmohan Art Gallery, evening front-row palace lights." 
      },
      { 
        day: 2, 
        title: "Wildlife & Avian Eco-Havens", 
        desc: "Mysuru Zoo guided EV Buggy tour, Karanji Lake butterfly park, and quiet Kukkarahalli sunset promenade." 
      },
      { 
        day: 3, 
        title: "Srirangapatna & Kaveri Sanctuary", 
        desc: "Daria Daulat teak palace, Tipu Sultan fort, boat safari at Ranganathittu, and riverside lunch." 
      },
      { 
        day: 4, 
        title: "Bandipur Eco-Safari & Sandalwood Factory", 
        desc: "Morning forest EV safari in Bandipur Tiger Reserve, afternoon government Sandalwood Oil distillation tour." 
      },
      { 
        day: 5, 
        title: "Hidden Melukote & Devaraja Market Farewells", 
        desc: "Melukote Vedic manuscript archive, sacred Kalyani stepped pond, Guru Sweets Mysore Pak packaging." 
      }
    ],
    ecoPoints: 100,
    weatherResilient: true
  },
  {
    id: "pkg-coorg-kabini-4d",
    cityId: "mysuru_circuit",
    cityName: "Mysuru - Kabini - Coorg",
    title: "Kabini Wildlife Safari & Coorg Coffee Mist Escape",
    duration: "4 Days / 3 Nights",
    daysCount: 4,
    budgetTier: "Royal Luxury",
    theme: "Wilderness Safari & Plantation Retreat",
    seniorScore: 88,
    rating: 4.9,
    reviewsCount: 310,
    pricePerPerson: 11999,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "1 Night Jungle Lodge at Kabini Nagarhole Reservoir",
      "2 Nights Boutique Coffee Plantation Homestay in Madikeri (Coorg)",
      "Open Gypsy Jungle Safari with Forest Department Naturalist",
      "Dubare Elephant Camp River Interaction",
      "Abbey Falls & Raja's Seat Sunset Viewpoint",
      "All meals & private AC SUV transfers from Mysuru"
    ],
    dayPlan: [
      { day: 1, title: "Mysuru to Kabini Jungle Lodge", desc: "Scenic drive from Mysuru to Kabini reservoir, evening Kaveri river boat safari spotting elephants & crocodiles." },
      { day: 2, title: "Morning Tiger Safari & Drive to Coorg", desc: "Dawn Nagarhole forest jeep safari, drive to lush Coorg coffee estates, evening campfire." },
      { day: 3, title: "Dubare Elephants & Tibetan Golden Temple", desc: "Visit Dubare river camp, explore Bylakuppe Namdroling Tibetan Monastery, and Madikeri spice walk." },
      { day: 4, title: "Abbey Falls & Return to Mysuru", desc: "Morning Abbey Falls canopy walk, visit Raja's Seat, return transfer to Mysuru Railway Station / Airport." }
    ],
    ecoPoints: 90,
    weatherResilient: true
  },
  {
    id: "pkg-hampi-unesco-4d",
    cityId: "karnataka_heritage",
    cityName: "Hampi - Badami UNESCO Trail",
    title: "Vijayanagara Imperial UNESCO & Cave Temple Circuit",
    duration: "4 Days / 3 Nights",
    daysCount: 4,
    budgetTier: "Premium",
    theme: "Ancient Architecture & Rock-Cut Wonders",
    seniorScore: 85,
    rating: 4.9,
    reviewsCount: 220,
    pricePerPerson: 9499,
    originalPrice: 12500,
    image: "https://images.unsplash.com/photo-1600100397608-f010e421d017?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "3 Nights Heritage Resort Stay near Tungabhadra River",
      "Guided Battery Cart Tour of Hampi Stone Chariot & Vittala Musical Pillars",
      "Badami Rock-Cut Cave Temples & Agastya Lake Excursion",
      "Pattadakal UNESCO World Heritage Complex Tour",
      "Coracle River Boat Ride across Tungabhadra"
    ],
    dayPlan: [
      { day: 1, title: "Hampi Sacred Center & Virupaksha", desc: "Arrival, Virupaksha temple active bazaar, Hemakuta hill sunset boulder landscape." },
      { day: 2, title: "Vittala Temple & Royal Enclosure", desc: "Electric cart tour of Stone Chariot, Queen's Bath, Lotus Mahal, and elephant stables." },
      { day: 3, title: "Badami Caves & Pattadakal Temples", desc: "Full-day excursion to 6th-century Badami cave shrines, Bhutanatha lake temples, and Pattadakal." },
      { day: 4, title: "Anegundi Crafts Village & Departure", desc: "Kishkindha monkey kingdom landscape, water hyacinth artisan handicraft workshop, return transfer." }
    ],
    ecoPoints: 90,
    weatherResilient: true
  },
  {
    id: "pkg-mys-budget-weekend-2d",
    cityId: "mysuru",
    cityName: "Mysuru",
    title: "Essential Mysuru Weekend Saver Package",
    duration: "2 Days / 1 Night",
    daysCount: 2,
    budgetTier: "Budget",
    theme: "Budget Explorer & Heritage",
    seniorScore: 90,
    rating: 4.7,
    reviewsCount: 510,
    pricePerPerson: 2799,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "1 Night Comfortable 3-Star AC Hotel near City Bus Stand",
      "2-Day Unlimited Mysuru KSRTC Electric Bus Pass",
      "Composite Entry Tickets to Palace, Zoo & Rail Museum",
      "Complimentary Traditional South Indian Breakfast",
      "Digital Audio Guide Access for All Major Monuments"
    ],
    dayPlan: [
      { day: 1, title: "Heritage Classics & Evening Lights", desc: "Mysore Palace interior tour, St. Philomena's Cathedral crypt, Devaraja fruit & spice market, palace night lights." },
      { day: 2, title: "Zoo, Lakes & Silk Souvenirs", desc: "Morning Mysuru Zoo & Karanji aviary, afternoon Rail Museum locomotives, Cauvery Arts & Crafts Emporium." }
    ],
    ecoPoints: 50,
    weatherResilient: true
  }
];
