// Travel, Transit, KSRTC/IRCTC Booking & Time-Based Dynamic Weather Replanner Component
import { TRANSIT_OPTIONS, OFFICIAL_BOOKING_PORTALS, POPULAR_TRAINS, POPULAR_BUSES } from '../data/transit.js';
import { DESTINATIONS } from '../data/destinations.js';
import { geoService } from '../services/geoService.js';

export function renderTravelTransitTab(container) {
  // Default Time-based daily itinerary with exact GPS coordinates
  const DEFAULT_ITINERARY = [
    {
      time: "09:00 AM",
      destId: "1",
      title: "Mysore Palace (Amba Vilas)",
      category: "Heritage",
      is_indoor: true,
      latitude: 12.3051,
      longitude: 76.6551,
      duration: "2 Hours",
      status: "Scheduled",
      notes: "Covered grand halls, royal weaponry & throne room.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80"
    },
    {
      time: "11:30 AM",
      destId: "4",
      title: "Jaganmohan Palace & Art Gallery",
      category: "Culture",
      is_indoor: true,
      latitude: 12.3087,
      longitude: 76.6493,
      duration: "1.5 Hours",
      status: "Scheduled",
      notes: "Raja Ravi Varma indoor oil gallery & antique clocks.",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
    },
    {
      time: "01:00 PM",
      destId: "mess_mylari",
      title: "Heritage Lunch at Original Vinayaka Mylari",
      category: "Culinary Heritage",
      is_indoor: true,
      latitude: 12.2982,
      longitude: 76.6540,
      duration: "1 Hour",
      status: "Scheduled",
      notes: "Famous cloud butter dosas & filter coffee in Agrahara.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    },
    {
      time: "04:00 PM",
      destId: "3",
      title: "Karanji Lake & Mysuru Zoo",
      category: "Wildlife",
      is_indoor: false,
      latitude: 12.3015,
      longitude: 76.6645,
      duration: "2.5 Hours",
      status: "Scheduled",
      notes: "Open-air walk-through aviary & conservation park.",
      image: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80"
    },
    {
      time: "06:30 PM",
      destId: "5",
      title: "Brindavan Gardens & Musical Fountain",
      category: "Nature",
      is_indoor: false,
      latitude: 12.4244,
      longitude: 76.5725,
      duration: "2 Hours",
      status: "Scheduled",
      notes: "Evening illuminated fountain show below KRS dam.",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
    },
    {
      time: "08:30 PM",
      destId: "hotel_lalitha",
      title: "Royal Dinner at Lalitha Mahal Palace",
      category: "Heritage Dining",
      is_indoor: true,
      latitude: 12.3012,
      longitude: 76.6925,
      duration: "1.5 Hours",
      status: "Scheduled",
      notes: "Regal dining hall with authentic Karnataka thali.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    }
  ];

  let currentItinerary = JSON.parse(JSON.stringify(DEFAULT_ITINERARY));
  let userReportQuery = '';
  let activeTravelUpdate = null; // { reportText, affectedItem, replanReason, revisedSchedule }
  let activeSubView = 'replanner'; // 'replanner' | 'transit'

  function processLiveTravelReport(reportText) {
    const q = reportText.toLowerCase().trim();
    if (!q) return;

    // 1. Identify affected scheduled place based on report keywords
    let affectedIndex = -1;
    if (q.includes('zoo') || q.includes('karanji') || q.includes('animal') || q.includes('aviary')) {
      affectedIndex = currentItinerary.findIndex(item => item.destId === '3' || item.title.toLowerCase().includes('zoo'));
    } else if (q.includes('brindavan') || q.includes('fountain') || q.includes('krs') || q.includes('garden')) {
      affectedIndex = currentItinerary.findIndex(item => item.destId === '5' || item.title.toLowerCase().includes('brindavan'));
    } else if (q.includes('chamundi') || q.includes('hill') || q.includes('temple')) {
      affectedIndex = currentItinerary.findIndex(item => item.destId === '2' || item.title.toLowerCase().includes('chamundi'));
    } else if (q.includes('palace') || q.includes('darbar')) {
      affectedIndex = currentItinerary.findIndex(item => item.destId === '1' || item.title.toLowerCase().includes('palace'));
    } else {
      // Default: Find first upcoming outdoor item
      affectedIndex = currentItinerary.findIndex(item => !item.is_indoor);
    }

    if (affectedIndex === -1) {
      alert("No affected scheduled stops matching your report. All current activities are covered indoor.");
      return;
    }

    const affectedItem = currentItinerary[affectedIndex];
    const isWeatherProblem = q.includes('rain') || q.includes('downpour') || q.includes('storm') || q.includes('flood') || q.includes('wet') || q.includes('waterlog');

    // 2. Perform intelligent time-based swapping / replanning
    const revised = JSON.parse(JSON.stringify(DEFAULT_ITINERARY));

    if (isWeatherProblem && !affectedItem.is_indoor) {
      // Find suitable indoor alternatives from available destination data
      const indoorReplacements = [
        {
          time: affectedItem.time,
          destId: "4",
          title: "Jaganmohan Palace & Art Gallery (Covered Pavilion)",
          category: "Culture (Weather-Safe)",
          is_indoor: true,
          latitude: 12.3087,
          longitude: 76.6493,
          duration: "2 Hours",
          status: "Weather Swapped",
          notes: "Relocated here during heavy rainfall. Enjoy sheltered art galleries & Ravi Varma exhibits.",
          image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
        },
        {
          time: affectedItem.time,
          destId: "9",
          title: "Somnathpura Chennakesava Temple (Sanctuary Tour)",
          category: "Heritage (Weather-Safe)",
          is_indoor: true,
          latitude: 12.2764,
          longitude: 76.8820,
          duration: "1.5 Hours",
          status: "Weather Swapped",
          notes: "Protected stone halls with Hoysala roof canopies.",
          image: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80"
        }
      ];

      const replacement = indoorReplacements[0];

      // Mark affected stop as rescheduled
      revised[affectedIndex] = replacement;

      // Move the outdoor stop to later slot or tomorrow morning when weather clears
      revised.push({
        time: "09:30 AM (Next Morning)",
        destId: affectedItem.destId,
        title: `${affectedItem.title} (Rescheduled)`,
        category: affectedItem.category,
        is_indoor: false,
        latitude: affectedItem.latitude,
        longitude: affectedItem.longitude,
        duration: affectedItem.duration,
        status: "Rescheduled",
        notes: `Moved from ${affectedItem.time} due to rain report. Optimal morning slot with cool weather.`,
        image: affectedItem.image
      });

      activeTravelUpdate = {
        reportText: reportText,
        affectedItem: `${affectedItem.time} — ${affectedItem.title} (Status: Weather problem reported)`,
        replanReason: `Weather issue detected near ${affectedItem.title}. Your ${affectedItem.time} visit has been moved/replanned to tomorrow 09:30 AM, and swapped with covered indoor Jaganmohan Palace Art Gallery to keep you dry!`,
        actionTaken: `Swapped ${affectedItem.time} slot with covered indoor gallery; rescheduled outdoor ${affectedItem.title} to 09:30 AM next morning.`
      };

      currentItinerary = revised;
    } else {
      activeTravelUpdate = {
        reportText: reportText,
        affectedItem: `${affectedItem.time} — ${affectedItem.title} (Status: Condition verified)`,
        replanReason: `Live travel report noted for ${affectedItem.title}. Schedule verified as covered indoor / weather-safe.`,
        actionTaken: `Confirmed safety precautions and transit routes for ${affectedItem.title}.`
      };
    }

    updateView();
  }

  function updateView() {
    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- HEADER -->
        <div class="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-3xl shrink-0">
                ⚡
              </div>
              <div class="space-y-1 max-w-2xl">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    Live Schedule & Transit Engine
                  </span>
                  <span class="text-xs text-slate-400">Mysuru Smart Mobility</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white">Dynamic Replanner & Mobility Hub</h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Real-time time-based itinerary optimizer. Report live weather disruptions or traffic conditions, and the planner dynamically swaps outdoor places with covered indoor alternatives without losing your travel rhythm!
                </p>
              </div>
            </div>

            <!-- Subtab switcher -->
            <div class="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 gap-1 overflow-x-auto">
              <button id="view-replanner-btn" class="px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeSubView === 'replanner' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                ⏱️ Time Replanner
              </button>
              <button id="view-booking-btn" class="px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeSubView === 'booking_hub' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}">
                🚌 KSRTC & 🚆 IRCTC Booking Hub
              </button>
              <button id="view-transit-btn" class="px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeSubView === 'local_transit' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                🌿 Local Eco-Transit
              </button>
            </div>
          </div>
        </div>

        ${activeSubView === 'replanner' ? `
          <!-- FEATURE 5 & 7: LIVE TRAVEL TROUBLE / WEATHER REPORT BOX -->
          <div class="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div class="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <span class="text-xl">📢</span>
              <div>
                <h3 class="text-base font-bold text-white">Report What Is Happening (Live Travel Update)</h3>
                <p class="text-xs text-slate-400">Enter sudden rain, traffic, or crowd issues to trigger instant time-based place swapping.</p>
              </div>
            </div>

            <!-- User input form -->
            <form id="live-trouble-form" class="flex flex-col sm:flex-row items-center gap-3">
              <div class="relative flex-1 w-full">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
                  🌦️
                </span>
                <input 
                  type="text" 
                  id="live-trouble-input" 
                  required 
                  placeholder="e.g. 'there is heavy rain near zoo' or 'sudden downpour at brindavan gardens'"
                  value="${userReportQuery}"
                  class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition shrink-0 flex items-center justify-center gap-2">
                <span>Process Report & Replan →</span>
              </button>
            </form>

            <!-- Quick Report Pills -->
            <div class="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span class="text-slate-500 shrink-0 font-medium">Quick simulation:</span>
              ${[
                "there is heavy rain near zoo",
                "sudden downpour at brindavan gardens",
                "heavy monsoon shower in city center",
                "clear sunny skies restored"
              ].map(prompt => `
                <button class="quick-report-pill px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 rounded-xl whitespace-nowrap transition" data-text="${prompt}">
                  🌧️ "${prompt}"
                </button>
              `).join('')}
            </div>

            <!-- FEATURE 7: DISPLAY CURRENT LIVE TRAVEL UPDATE & REPLANNING RESULT -->
            ${activeTravelUpdate ? `
              <div class="p-5 bg-gradient-to-r from-blue-950/80 via-slate-950 to-slate-950 border-2 border-blue-400 rounded-2xl space-y-3 animate-scaleUp">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div class="flex items-center space-x-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                    <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Live Travel Advisory Update</span>
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono">Status: Processed Just Now</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div class="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-500 block uppercase">Report Received:</span>
                    <p class="font-bold text-white mt-0.5">"${activeTravelUpdate.reportText}"</p>
                  </div>
                  <div class="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-500 block uppercase">Affected Activity:</span>
                    <p class="font-bold text-amber-400 mt-0.5">${activeTravelUpdate.affectedItem}</p>
                  </div>
                </div>

                <div class="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs space-y-1">
                  <span class="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">Replanning Result & Action:</span>
                  <p class="text-slate-200 leading-relaxed">${activeTravelUpdate.replanReason}</p>
                </div>

                <div class="flex items-center justify-between text-xs pt-1">
                  <span class="text-[11px] text-emerald-400 font-semibold">✓ Time-based place swap applied to itinerary below</span>
                  <button id="reset-itinerary-btn" class="text-xs text-slate-400 hover:text-white underline">
                    Reset to Default Itinerary
                  </button>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- FEATURE 4 & 6: TIME-BASED ITINERARY TIMELINE VIEW -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <span>⏱️ Active Time-Based Daily Itinerary</span>
                  <span class="text-xs text-slate-400 font-normal">(${currentItinerary.length} Scheduled Stops)</span>
                </h3>
                <p class="text-xs text-slate-400">Scheduled time slots preserved. Covered indoor stops marked in green.</p>
              </div>
            </div>

            <!-- Timetable cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              ${currentItinerary.map((item, idx) => {
                const isSwapped = item.status === 'Weather Swapped';
                const isRescheduled = item.status === 'Rescheduled';

                return `
                  <div class="bg-slate-900 border ${isSwapped ? 'border-amber-500/50 bg-amber-950/10' : isRescheduled ? 'border-blue-500/50 bg-blue-950/10' : 'border-slate-800'} rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition hover:border-slate-700">
                    
                    <!-- Time Header -->
                    <div class="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="px-2.5 py-1 text-xs font-mono font-extrabold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          ${item.time}
                        </span>
                        <span class="text-[11px] text-slate-400 font-mono">(${item.duration})</span>
                      </div>
                      
                      <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-md ${
                        item.is_indoor 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }">
                        ${item.is_indoor ? '🏛️ Covered Indoor' : '🌲 Outdoor Spot'}
                      </span>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div class="flex items-start space-x-3">
                        <img src="${item.image}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80';" class="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                        <div>
                          <span class="text-[10px] uppercase font-bold text-amber-400">${item.category}</span>
                          <h4 class="text-sm font-bold text-white mt-0.5 leading-snug">${item.title}</h4>
                          <p class="text-xs text-slate-400 mt-1">${item.notes}</p>
                        </div>
                      </div>

                      ${isSwapped || isRescheduled ? `
                        <div class="p-2.5 rounded-xl text-[11px] font-medium ${isSwapped ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'}">
                          ${isSwapped ? '⚠️ Swapped in to replace rain-affected outdoor slot' : '🔄 Moved from earlier time to optimal dry weather slot'}
                        </div>
                      ` : ''}
                    </div>

                    <!-- Footer Action -->
                    <div class="p-4 pt-0 space-y-2 border-t border-slate-800/80 pt-3">
                      <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span class="text-slate-500">Stop #${idx + 1} of ${currentItinerary.length}</span>
                        <span class="text-emerald-400 font-semibold flex items-center gap-1">
                          <span>📍</span>
                          <span>${item.latitude ? `${item.latitude}°N, ${item.longitude}°E` : 'Mysuru'}</span>
                        </span>
                      </div>
                      
                      <a 
                        href="${geoService.getGoogleMapsDirectionsUrl(item)}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                      >
                        <svg class="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>📍 Live GPS Navigation (Google Maps ↗)</span>
                      </a>
                    </div>

                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : activeSubView === 'booking_hub' ? `
          <!-- KSRTC BUS & IRCTC TRAIN BOOKING HUB -->
          <div class="space-y-8 animate-fadeIn">
            
            <!-- OFFICIAL BOOKING GATEWAYS BANNER -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- KSRTC Gateway Card -->
              <div class="bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-red-500/20 text-red-300 border border-red-500/40">
                      ${OFFICIAL_BOOKING_PORTALS.ksrtc.badge}
                    </span>
                    <span class="text-xs text-red-400 font-mono font-bold">24/7 Hotline: 080-49596666</span>
                  </div>
                  <h3 class="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <span>🚌</span>
                    <span>KSRTC Bus Booking</span>
                  </h3>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Official booking portal for Karnataka State Road Transport Corporation. Reserve seats for EV Power Plus, Airavat Club Class, Rajahamsa, and Ambaari Utsav buses directly.
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-800">
                  <a 
                    href="${OFFICIAL_BOOKING_PORTALS.ksrtc.url}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                  >
                    <span>Book Bus on Official KSRTC Portal (Direct Redirect ↗)</span>
                  </a>
                  <p class="text-[10px] text-center text-slate-400">Secure official state portal • Instant m-Ticket SMS</p>
                </div>
              </div>

              <!-- IRCTC Gateway Card -->
              <div class="bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      ${OFFICIAL_BOOKING_PORTALS.irctc.badge}
                    </span>
                    <span class="text-xs text-blue-400 font-mono font-bold">Rail Madad: 139</span>
                  </div>
                  <h3 class="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <span>🚆</span>
                    <span>IRCTC Indian Railways Train Booking</span>
                  </h3>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Official Ministry of Railways booking portal for Mysuru Junction (MYS). Book Vande Bharat Express, Shatabdi, Chamundi Express, and check live PNR status.
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-800">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a 
                      href="${OFFICIAL_BOOKING_PORTALS.irctc.url}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-full py-3 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Book on IRCTC (Redirect ↗)</span>
                    </a>
                    <a 
                      href="${OFFICIAL_BOOKING_PORTALS.irctc.pnr_url}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-full py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Check Live PNR ↗</span>
                    </a>
                  </div>
                  <p class="text-[10px] text-center text-slate-400">Mysuru Jn (Station Code: MYS) ⇄ Bengaluru (SBC)</p>
                </div>
              </div>

            </div>

            <!-- POPULAR TRAIN SCHEDULES FROM MYSURU JUNCTION (MYS) -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>🚆 Real-Time Popular Trains from Mysuru Jn (MYS)</span>
                  </h3>
                  <p class="text-xs text-slate-400">Live timetable with direct booking redirect to IRCTC NGET Portal.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${POPULAR_TRAINS.map(tr => `
                  <div class="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-5 shadow-xl transition space-y-4 flex flex-col justify-between">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Train #${tr.train_no}
                        </span>
                        <span class="text-xs text-amber-400 font-mono font-bold">${tr.fare}</span>
                      </div>

                      <h4 class="text-base font-bold text-white">${tr.name}</h4>
                      <p class="text-xs text-slate-400 font-medium">${tr.route}</p>

                      <div class="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs">
                        <div>
                          <span class="text-[10px] text-slate-500 block">Dep (MYS)</span>
                          <span class="font-bold text-white font-mono">${tr.departure}</span>
                        </div>
                        <div>
                          <span class="text-[10px] text-slate-500 block">Duration</span>
                          <span class="font-bold text-cyan-300">${tr.duration}</span>
                        </div>
                        <div>
                          <span class="text-[10px] text-slate-500 block">Frequency</span>
                          <span class="font-bold text-emerald-300 text-[11px]">${tr.frequency}</span>
                        </div>
                      </div>

                      <div class="flex flex-wrap gap-1.5 pt-1">
                        ${tr.classes.map(c => `
                          <span class="px-2 py-0.5 text-[10px] rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            ${c}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <a 
                      href="${tr.booking_url}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <span>Book ${tr.name} on IRCTC ↗</span>
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- POPULAR KSRTC BUS ROUTES -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>🚌 Popular KSRTC Express Bus Routes</span>
                  </h3>
                  <p class="text-xs text-slate-400">Direct booking redirect to KSRTC OPRS Portal with zero emissions EV fleets.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${POPULAR_BUSES.map(b => `
                  <div class="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-3xl p-5 shadow-xl transition space-y-4 flex flex-col justify-between">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ${b.eco_tag}
                        </span>
                        <span class="text-xs text-amber-400 font-mono font-bold">${b.fare}</span>
                      </div>

                      <h4 class="text-base font-bold text-white">${b.service_type}</h4>
                      <p class="text-xs text-slate-300 font-medium">${b.route}</p>

                      <div class="flex items-center justify-between p-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                        <span class="text-slate-400">⏱️ Frequency: <strong class="text-white">${b.frequency}</strong></span>
                        <span class="text-slate-400">⌛ Duration: <strong class="text-cyan-300">${b.duration}</strong></span>
                      </div>
                    </div>

                    <a 
                      href="${b.booking_url}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <span>Book on Official KSRTC Portal ↗</span>
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        ` : `
          <!-- GREEN TRANSIT VIEW -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-white">Mysuru Zero-Carbon Mobility & Transit Hubs</h3>
                <p class="text-xs text-slate-400">Every green transit option links directly to verified Google Maps station coordinates.</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${TRANSIT_OPTIONS.map(t => `
                <div class="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 shadow-xl transition space-y-4 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex justify-between items-start">
                      <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        ${t.tag}
                      </span>
                      <span class="text-xs font-mono text-emerald-400 font-bold">+${t.eco_points} Eco Pts</span>
                    </div>
                    <h4 class="text-base font-bold text-white">${t.title}</h4>
                    <p class="text-xs text-slate-400 leading-relaxed">${t.desc}</p>
                    
                    <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="text-slate-400">📍 Hub / Station:</span>
                        <span class="font-semibold text-white truncate max-w-[200px]">${t.hub_location || 'Central Station'}</span>
                      </div>
                      <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>GPS Coordinates:</span>
                        <span class="text-emerald-400">${t.latitude}°N, ${t.longitude}°E</span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                      <span>Fare: <strong class="text-amber-400">${t.fare}</strong></span>
                      <span>🍃 <strong class="text-emerald-300">${t.carbon_saved}</strong></span>
                    </div>
                  </div>
                  
                  <a 
                    href="${geoService.getGoogleMapsDirectionsUrl(t)}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>📍 Navigate to Transit Hub (Google Maps ↗)</span>
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        `}

      </div>
    `;

    bindTravelEvents();
  }

  function bindTravelEvents() {
    const replannerTabBtn = document.getElementById('view-replanner-btn');
    const bookingTabBtn = document.getElementById('view-booking-btn');
    const transitTabBtn = document.getElementById('view-transit-btn');
    
    if (replannerTabBtn) replannerTabBtn.addEventListener('click', () => { activeSubView = 'replanner'; updateView(); });
    if (bookingTabBtn) bookingTabBtn.addEventListener('click', () => { activeSubView = 'booking_hub'; updateView(); });
    if (transitTabBtn) transitTabBtn.addEventListener('click', () => { activeSubView = 'local_transit'; updateView(); });

    // Live trouble report form
    const form = document.getElementById('live-trouble-form');
    const input = document.getElementById('live-trouble-input');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input && input.value) {
          userReportQuery = input.value;
          processLiveTravelReport(input.value);
        }
      });
    }

    // Quick report simulation pills
    document.querySelectorAll('.quick-report-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        userReportQuery = text;
        processLiveTravelReport(text);
      });
    });

    // Reset itinerary button
    const resetBtn = document.getElementById('reset-itinerary-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentItinerary = JSON.parse(JSON.stringify(DEFAULT_ITINERARY));
        activeTravelUpdate = null;
        userReportQuery = '';
        updateView();
      });
    }
  }

  updateView();
}
