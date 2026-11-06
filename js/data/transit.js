// Transit & Intercity Booking Dataset with Official KSRTC & IRCTC Portals
export const OFFICIAL_BOOKING_PORTALS = {
  ksrtc: {
    name: "KSRTC (Karnataka State Road Transport Corporation)",
    tagline: "Official Government Bus Booking Portal",
    url: "https://www.ksrtc.in/",
    booking_url: "https://ksrtc.in/oprs-web/guest/home.do",
    support_phone: "080-49596666",
    badge: "Official State Transport"
  },
  irctc: {
    name: "IRCTC (Indian Railway Catering and Tourism Corporation)",
    tagline: "Official Ministry of Railways Booking Gateway",
    url: "https://www.irctc.co.in/nget/train-search",
    pnr_url: "https://www.irctc.co.in/nget/enquiry/pnr-status",
    support_phone: "14646 / 0755-6610661",
    badge: "Official Indian Railways"
  }
};

export const POPULAR_TRAINS = [
  {
    train_no: "20608",
    name: "MYS-MAS Vande Bharat Express",
    route: "Mysuru Jn (MYS) ➔ KSR Bengaluru (SBC) ➔ Chennai Central (MAS)",
    departure: "06:00 AM",
    arrival_sbc: "07:45 AM",
    duration: "1h 45m to Bengaluru",
    frequency: "Daily (Except Wed)",
    classes: ["Executive Chair (EC)", "Chair Car (CC)"],
    fare: "₹515 - ₹1,020",
    booking_url: "https://www.irctc.co.in/nget/train-search"
  },
  {
    train_no: "12008",
    name: "MYS-MAS Shatabdi Express",
    route: "Mysuru Jn (MYS) ➔ Mandya ➔ Bengaluru (SBC) ➔ Chennai",
    departure: "02:15 PM",
    arrival_sbc: "04:10 PM",
    duration: "1h 55m to Bengaluru",
    frequency: "Daily (Except Thu)",
    classes: ["Executive Class (EC)", "AC Chair (CC)"],
    fare: "₹480 - ₹960",
    booking_url: "https://www.irctc.co.in/nget/train-search"
  },
  {
    train_no: "16215",
    name: "Chamundi Express",
    route: "Mysuru Jn (MYS) ➔ Pandavapura ➔ Mandya ➔ Ramanagara ➔ KSR Bengaluru",
    departure: "06:45 AM",
    arrival_sbc: "09:35 AM",
    duration: "2h 50m",
    frequency: "Daily (All 7 Days)",
    classes: ["AC Chair (CC)", "Second Seating (2S)"],
    fare: "₹75 - ₹285",
    booking_url: "https://www.irctc.co.in/nget/train-search"
  },
  {
    train_no: "12613",
    name: "Tipu Superfast Express",
    route: "Mysuru Jn (MYS) ➔ Mandya ➔ KSR Bengaluru (SBC)",
    departure: "11:15 AM",
    arrival_sbc: "01:30 PM",
    duration: "2h 15m (Non-stop Mandya)",
    frequency: "Daily (All 7 Days)",
    classes: ["AC Chair (CC)", "Second Seating (2S)"],
    fare: "₹85 - ₹310",
    booking_url: "https://www.irctc.co.in/nget/train-search"
  }
];

export const POPULAR_BUSES = [
  {
    service_type: "EV Power Plus (Zero-Emission AC Electric)",
    route: "Mysuru Suburban Bus Stand ⇄ Bengaluru Kempegowda (Majestic)",
    frequency: "Every 15 Minutes",
    duration: "2h 15m (via Mysuru-Bengaluru Expressway)",
    fare: "₹320 - ₹340",
    eco_tag: "🍃 100% Electric Bus",
    booking_url: "https://www.ksrtc.in/"
  },
  {
    service_type: "Airavat Club Class (Multi-Axle Volvo AC)",
    route: "Mysuru ⇄ Coorg / Madikeri / Kushalnagar",
    frequency: "Every 30 Minutes",
    duration: "2h 30m",
    fare: "₹240 - ₹310",
    eco_tag: "Comfort Cruiser",
    booking_url: "https://www.ksrtc.in/"
  },
  {
    service_type: "KSRTC Rajahamsa Executive",
    route: "Mysuru ⇄ Ooty / Nilgiri Hills (via Bandipur)",
    frequency: "6 Services Daily",
    duration: "3h 45m",
    fare: "₹210 - ₹280",
    eco_tag: "Scenic Forest Route",
    booking_url: "https://www.ksrtc.in/"
  },
  {
    service_type: "Ambaari Utsav (Dream Class AC Sleeper)",
    route: "Mysuru ⇄ Mangaluru / Udupi / Goa",
    frequency: "Night Express Services",
    duration: "6h 30m",
    fare: "₹650 - ₹1,150",
    eco_tag: "Luxury Sleeper",
    booking_url: "https://www.ksrtc.in/"
  }
];

export const TRANSIT_OPTIONS = [
  {
    id: "trans_1",
    title: "KSRTC Mysuru City Electric Bus",
    icon: "bus",
    tag: "100% Zero Emission",
    desc: "Frequent air-conditioned electric buses linking Railway Station, Mysore Palace, Zoo, and Chamundi Hill.",
    hub_location: "City Bus Stand (CBS), K.R. Circle, Mysuru",
    latitude: 12.3098,
    longitude: 76.6545,
    google_maps_url: "https://www.google.com/maps/dir/?api=1&destination=12.3098,76.6545",
    fare: "₹15 - ₹35",
    carbon_saved: "2.4 kg CO₂ per trip",
    eco_points: 20
  },
  {
    id: "trans_2",
    title: "Heritage Royal Tonga (Horse Carriage)",
    icon: "carriage",
    tag: "Traditional Heritage",
    desc: "Iconic Mysore brass-decorated wooden tonga ride around Palace outer gates, Devaraja Market & Chamarajapuram.",
    hub_location: "Palace North Gate Stand, Sayyaji Rao Road, Mysuru",
    latitude: 12.3068,
    longitude: 76.6550,
    google_maps_url: "https://www.google.com/maps/dir/?api=1&destination=12.3068,76.6550",
    fare: "₹150 - ₹300 / ride",
    carbon_saved: "Zero Fuel",
    eco_points: 30
  },
  {
    id: "trans_3",
    title: "Chamundi Hill EV Shuttle Buggy",
    icon: "zap",
    tag: "Senior Priority",
    desc: "Special electric shuttles from hilltop parking to Temple main entrance, ramp-equipped for elders.",
    hub_location: "Hilltop Parking & EV Terminal, Chamundi Hill, Mysuru",
    latitude: 12.2745,
    longitude: 76.6710,
    google_maps_url: "https://www.google.com/maps/dir/?api=1&destination=12.2745,76.6710",
    fare: "Free for Seniors / ₹20",
    carbon_saved: "1.8 kg CO₂",
    eco_points: 25
  },
  {
    id: "trans_4",
    title: "Trin Trin Public Bike Sharing Hubs",
    icon: "bike",
    tag: "Active Mobility",
    desc: "Smart bicycle dock stations located across 52 tourist junctions in Mysuru. First 30 mins free.",
    hub_location: "Central Dock, Mysore Railway Station & Sayyaji Rao Rd",
    latitude: 12.3135,
    longitude: 76.6450,
    google_maps_url: "https://www.google.com/maps/dir/?api=1&destination=12.3135,76.6450",
    fare: "₹5 / hour",
    carbon_saved: "1.5 kg CO₂",
    eco_points: 15
  }
];
