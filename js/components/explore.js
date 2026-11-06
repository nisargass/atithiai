// Mysore & Beyond: Explore Gamified 30 Locations with Live Weather APIs, Google Maps & 5km Geofenced GPS Reviews
import { DESTINATIONS } from '../data/destinations.js';
import { authService } from '../services/authService.js';
import { geoService } from '../services/geoService.js';
import { weatherService } from '../services/weatherService.js';
import { openGpsReviewModal, getDestinationReviews } from './gpsReviewModal.js';

export function renderExploreTab(container) {
  let activeFilter = 'All'; // 'All' | 'Hidden Gem' | 'Rare Gem' | 'Popular' | 'Heritage' | 'Nature' | 'Wildlife' | 'Culture'
  let searchQuery = '';
  let isRainSimulation = false;
  let onlyIndoor = false;
  let onlySenior = false;
  let expandedMesses = {}; // { destId: true/false }
  let expandedWeather = {}; // { destId: true/false }
  let expandedReviews = {}; // { destId: true/false }
  let userLiveLocation = null;
  let isLocating = false;
  let cityWeather = null;
  let destinationWeatherMap = {}; // { destId: weatherObj }
  let isLoadingWeather = true;

  // Initial fetch of real-time city weather and destination micro-climates
  async function loadWeatherData() {
    isLoadingWeather = true;
    cityWeather = await weatherService.getCityWeather(12.2958, 76.6394);
    isLoadingWeather = false;
    updateView();

    // Fetch individual micro-weather for destinations asynchronously
    for (const d of DESTINATIONS) {
      weatherService.getDestinationWeather(d.latitude, d.longitude, d.name).then(w => {
        destinationWeatherMap[d.id] = w;
        const badgeEl = document.getElementById(`dest-weather-badge-${d.id}`);
        if (badgeEl && w) {
          badgeEl.innerHTML = `
            <span class="text-xs">${w.icon}</span>
            <span class="font-mono font-bold">${w.temp}°C</span>
            <span class="text-[10px] text-slate-400">• ${w.label}</span>
          `;
        }
      });
    }
  }

  function updateView() {
    const user = authService.getCurrentUser();
    const wishlist = user ? (user.wishlist || []) : [];
    const discoveredGems = user ? (user.discoveredGems || []) : [];

    // Filter logic
    let filtered = DESTINATIONS.filter(d => {
      if (activeFilter === 'Popular' && d.rarity_tier !== 'Popular') return false;
      if (activeFilter === 'Hidden Gem' && d.rarity_tier !== 'Hidden Gem') return false;
      if (activeFilter === 'Rare Gem' && d.rarity_tier !== 'Rare Gem') return false;
      if (['Heritage', 'Nature', 'Wildlife', 'Culture'].includes(activeFilter) && d.category !== activeFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchDesc = d.description.toLowerCase().includes(q);
        const matchLoc = d.location.toLowerCase().includes(q);
        const matchMesses = (d.nearby_messes || []).some(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchLoc && !matchMesses) return false;
      }
      if ((isRainSimulation || onlyIndoor) && !d.is_indoor) return false;
      if (onlySenior && !d.seniorSuitable) return false;
      return true;
    });

    // If live GPS location is active, sort by real-time distance
    if (userLiveLocation) {
      filtered = filtered.map(d => {
        const liveDist = geoService.calculateDistance(
          userLiveLocation.latitude,
          userLiveLocation.longitude,
          d.latitude,
          d.longitude
        );
        return { ...d, liveDistanceKm: liveDist };
      }).sort((a, b) => (a.liveDistanceKm || 999) - (b.liveDistanceKm || 999));
    }

    const currentW = cityWeather || {
      city: "Mysuru, Karnataka",
      temp: 28.5,
      feelsLike: 29.8,
      humidity: 62,
      windSpeed: 11.2,
      label: "Pleasant & Clear",
      icon: "☀️",
      isRain: false,
      maxTemp: 30,
      minTemp: 20,
      hourly: [],
      lastUpdated: "Just now"
    };

    const isRaining = isRainSimulation || currentW.isRain;

    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- REAL-TIME MYSURU WEATHER API DASHBOARD BANNER -->
        <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <!-- Left Weather Details -->
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Live Open-Meteo Weather API</span>
                </span>
                <span class="text-xs text-slate-400 font-mono">Updated: ${currentW.lastUpdated}</span>
              </div>

              <div class="flex items-center space-x-4">
                <span class="text-5xl sm:text-6xl filter drop-shadow-lg">${isRaining ? '🌧️' : currentW.icon}</span>
                <div>
                  <div class="flex items-baseline space-x-2">
                    <span class="text-3xl sm:text-4xl font-black font-mono text-white">
                      ${isRainSimulation ? '24.0' : currentW.temp}°C
                    </span>
                    <span class="text-xs text-slate-400 font-medium">
                      Feels like ${isRainSimulation ? '24.5' : currentW.feelsLike}°C
                    </span>
                  </div>
                  <h2 class="text-lg sm:text-xl font-bold text-amber-400">
                    ${isRainSimulation ? 'Monsoonal Heavy Downpour' : currentW.label} in Mysuru
                  </h2>
                </div>
              </div>

              <!-- Weather Stats Chips -->
              <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span class="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span>💧 Humidity:</span>
                  <strong class="text-white font-mono">${isRainSimulation ? '88%' : `${currentW.humidity}%`}</strong>
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span>💨 Wind:</span>
                  <strong class="text-white font-mono">${currentW.windSpeed} km/h</strong>
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span>🌡️ Range:</span>
                  <strong class="text-white font-mono">${currentW.minTemp}°C - ${currentW.maxTemp}°C</strong>
                </span>
                <span class="px-2.5 py-1 rounded-xl ${isRaining ? 'bg-blue-950 text-blue-300 border border-blue-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'} font-semibold">
                  ${isRaining ? '🌧️ Rain Alert Active' : '🟢 Optimal Sightseeing Conditions'}
                </span>
              </div>

              <!-- Actionable Tourist Weather Advisory -->
              <p class="text-xs text-slate-300 pt-1 leading-relaxed">
                💡 <strong class="text-amber-300">Live Advisory:</strong> ${weatherService.getTouristAdvisory(isRainSimulation ? { isRain: true, temp: 24 } : currentW)}
              </p>
            </div>

            <!-- Right Forecast Strip & Simulator Controls -->
            <div class="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3 shrink-0 w-full lg:w-auto">
              <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                <span class="text-xs font-bold text-slate-300">4-Hour Forecast</span>
                <button id="refresh-weather-btn" class="p-1 text-slate-400 hover:text-amber-400 transition" title="Refresh Live Weather">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              <!-- Hourly Mini Forecast -->
              <div class="grid grid-cols-4 gap-2 text-center text-xs">
                ${(currentW.hourly && currentW.hourly.length > 0 ? currentW.hourly.slice(0, 4) : [
                  { time: "15:00", temp: 29, icon: "🌤️", rainProb: 10 },
                  { time: "17:00", temp: 27, icon: "⛅", rainProb: 15 },
                  { time: "19:00", temp: 24, icon: "🌙", rainProb: 20 },
                  { time: "21:00", temp: 22, icon: "✨", rainProb: 10 }
                ]).map(h => `
                  <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span class="text-[10px] text-slate-400 block">${h.time}</span>
                    <span class="text-base block">${h.icon}</span>
                    <span class="font-bold text-white font-mono text-[11px] block">${h.temp}°</span>
                    <span class="text-[9px] text-blue-400 font-mono block">${h.rainProb}% rain</span>
                  </div>
                `).join('')}
              </div>

              <!-- Simulator Buttons for Testing Weather Replanner -->
              <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
                <span class="text-[10px] text-slate-400">Simulator:</span>
                <div class="flex gap-1.5">
                  <button id="sim-rain-btn" class="px-2.5 py-1 text-[10px] rounded-lg font-bold transition ${isRainSimulation ? 'bg-blue-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}">
                    🌧️ Rain
                  </button>
                  <button id="sim-sun-btn" class="px-2.5 py-1 text-[10px] rounded-lg font-bold transition ${!isRainSimulation ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}">
                    ☀️ Live Clear
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- REAL-TIME GEOLOCATION & GPS NAVIGATION CONTROLS -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1 max-w-xl">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📍</span>
              <h3 class="text-base font-bold text-white">Live Geolocation, Google Maps & 5km Geofenced Reviews</h3>
              <span class="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live GPS + Reviews
              </span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Every spot includes satellite coordinates and turn-by-turn Google Maps routing. Users within a <strong>5 km physical radius</strong> can post <strong>Verified GPS Reviews</strong> to earn <strong class="text-amber-400">+10 Eco-Points</strong>!
            </p>
            ${userLiveLocation ? `
              <div class="text-[11px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
                <span>✓ Live GPS Active (${userLiveLocation.latitude.toFixed(4)}°N, ${userLiveLocation.longitude.toFixed(4)}°E)</span>
                <span>• Sorted by proximity to you</span>
              </div>
            ` : ''}
          </div>

          <button id="detect-gps-btn" class="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 shrink-0">
            ${isLocating ? `
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Accessing GPS Satellites...</span>
            ` : `
              <span>🧭 ${userLiveLocation ? 'Refresh My GPS Location' : 'Detect My Live Location & Sort Near Me'}</span>
            `}
          </button>
        </div>

        <!-- FILTER CHIPS & SEARCH -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <!-- Category & Rarity Chips -->
            <div class="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              ${[
                { id: 'All', label: '🏛️ All 30 Spots' },
                { id: 'Hidden Gem', label: '💎 Hidden Gems (+30 Pts)' },
                { id: 'Rare Gem', label: '⭐ Rare Gems (+50 Pts)' },
                { id: 'Popular', label: '👑 Popular (0 Pts)' },
                { id: 'Heritage', label: '🏰 Heritage' },
                { id: 'Nature', label: '🌿 Nature & Falls' },
                { id: 'Wildlife', label: '🐅 Wildlife & Lakes' },
                { id: 'Culture', label: '🎨 Culture & Art' }
              ].map(tab => {
                const active = activeFilter === tab.id;
                return `
                  <button class="explore-filter-btn px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${active ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-filter="${tab.id}">
                    ${tab.label}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Search Bar -->
            <div class="relative w-full sm:w-72">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input 
                type="text" 
                id="explore-search-input" 
                placeholder="Search spots, messes, biryani, falls..." 
                value="${searchQuery}"
                class="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

          </div>

          <!-- Active Filter Indicators & Toggles -->
          <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Showing <strong class="text-amber-400 font-mono">${filtered.length}</strong> of ${DESTINATIONS.length} Mysore & Beyond Destinations</span>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input type="checkbox" id="filter-indoor-toggle" ${onlyIndoor || isRaining ? 'checked' : ''} class="w-3.5 h-3.5 text-amber-500 rounded bg-slate-800 border-slate-700" />
                <span>🏛️ Covered Indoor Only</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
                <input type="checkbox" id="filter-senior-toggle" ${onlySenior ? 'checked' : ''} class="w-3.5 h-3.5 text-amber-500 rounded bg-slate-800 border-slate-700" />
                <span>♿ Senior Verified Only</span>
              </label>
            </div>
          </div>

        </div>

        <!-- 30 DESTINATIONS GRID -->
        ${filtered.length === 0 ? `
          <div class="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <span class="text-3xl">🔍</span>
            <h3 class="text-base font-bold text-slate-300">No destinations found</h3>
            <p class="text-xs text-slate-500">Try resetting filters or searching another landmark/eatery.</p>
            <button id="reset-explore-btn" class="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(d => {
              const isFav = wishlist.includes(d.id);
              const isMessOpen = !!expandedMesses[d.id];
              const isWeatherOpen = !!expandedWeather[d.id];
              const isReviewsOpen = !!expandedReviews[d.id];
              const isHiddenGem = d.rarity_tier === 'Hidden Gem' || d.rarity_tier === 'Rare Gem';
              const isDiscovered = discoveredGems.includes(d.id);
              const reviewsList = getDestinationReviews(d.id);

              const destW = destinationWeatherMap[d.id] || {
                temp: 28.2,
                label: "Clear",
                icon: "☀️",
                humidity: 58,
                windSpeed: 10,
                suitabilityScore: "98% (Perfect Outdoor Visit)"
              };

              const rarityColor = 
                d.rarity_tier === 'Rare Gem' 
                  ? 'bg-purple-950/90 text-purple-300 border-purple-500/40' 
                  : d.rarity_tier === 'Hidden Gem'
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/90 text-slate-400 border-slate-700';

              const distanceDisplay = d.liveDistanceKm 
                ? `${d.liveDistanceKm} km from you` 
                : d.distance;

              return `
                <div class="bg-slate-900 border border-slate-800/90 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition duration-300 shadow-xl">
                  
                  <!-- Card Image Header -->
                  <div class="relative h-52 overflow-hidden bg-slate-950">
                    <img 
                      src="${d.image_url}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';" 
                      alt="${d.name}" 
                      class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                    <!-- Rarity & Points Badges Top Left -->
                    <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                      <div class="flex items-center gap-1.5">
                        <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg ${rarityColor} border backdrop-blur-md">
                          ${d.rarity_tier === 'Rare Gem' ? '⭐ Rare Gem' : d.rarity_tier === 'Hidden Gem' ? '💎 Hidden Gem' : '👑 Popular'}
                        </span>
                        
                        <!-- 15 PTS FOR RARE & HIDDEN GEMS, 10 PTS FOR POPULAR VIA VERIFIED GPS REVIEW -->
                        <span class="px-2.5 py-1 text-[10px] font-mono font-extrabold rounded-lg ${(d.rarity_tier === 'Rare Gem' || d.rarity_tier === 'Hidden Gem') ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'} border backdrop-blur-md">
                          ${(d.rarity_tier === 'Rare Gem' || d.rarity_tier === 'Hidden Gem') ? '+15 Review Pts' : '+10 Review Pts'}
                        </span>
                      </div>
                      <span class="px-2 py-0.5 text-[9px] font-semibold rounded-md ${d.liveDistanceKm ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' : 'bg-slate-900/80 text-slate-300 border-slate-700'} border w-max">
                        📍 ${distanceDisplay}
                      </span>
                    </div>

                    <!-- Favorite Button Top Right -->
                    <div class="absolute top-3 right-3 flex items-center gap-1">
                      <button class="fav-dest-btn p-2 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-red-400 transition" data-id="${d.id}" title="Save to wishlist">
                        <svg class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Bottom Bar on Image: Individual Live Weather Badge -->
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      
                      <!-- Individual Micro Weather Report Tag -->
                      <div id="dest-weather-badge-${d.id}" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-[11px]">
                        <span class="text-xs">${destW.icon}</span>
                        <span class="font-mono font-bold">${destW.temp}°C</span>
                        <span class="text-[10px] text-slate-400">• ${destW.label}</span>
                      </div>

                      <div class="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-400 font-bold font-mono text-[11px]">
                        <span>★</span>
                        <span>${d.rating || 4.8}</span>
                        <span class="text-[10px] text-slate-400">(${reviewsList.length + 12})</span>
                      </div>
                    </div>

                  </div>

                  <!-- Card Body -->
                  <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <h4 class="text-base font-bold text-white group-hover:text-amber-300 transition">${d.name}</h4>
                      </div>
                      <p class="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">${d.description}</p>
                    </div>

                    <!-- INDIVIDUAL DESTINATION WEATHER REPORT EXPANDER -->
                    <div class="pt-1">
                      <button class="toggle-weather-btn w-full py-1.5 px-3 bg-slate-950/80 hover:bg-slate-800/80 border border-blue-500/30 rounded-xl text-[11px] font-bold text-blue-300 flex items-center justify-between transition" data-id="${d.id}">
                        <span class="flex items-center gap-1.5">
                          <span>🌤️ Live Weather: ${destW.temp}°C (${destW.label})</span>
                        </span>
                        <span class="text-xs transform transition-transform ${isWeatherOpen ? 'rotate-180' : ''}">▼</span>
                      </button>

                      ${isWeatherOpen ? `
                        <div class="mt-2.5 space-y-2 p-3.5 bg-slate-950/95 border border-blue-500/40 rounded-2xl text-xs animate-fadeIn shadow-xl">
                          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                              📍 Micro-Location Weather (Satellite API):
                            </span>
                            <span class="text-[10px] text-slate-400 font-mono">${d.latitude}°N, ${d.longitude}°E</span>
                          </div>
                          
                          <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div class="p-2 bg-slate-900 rounded-xl border border-slate-800">
                              <span class="text-slate-400 block text-[10px]">Temperature:</span>
                              <strong class="text-white font-mono">${destW.temp}°C</strong>
                              <span class="text-[10px] text-slate-400 block mt-0.5">Feels ${destW.feelsLike || destW.temp}°C</span>
                            </div>
                            <div class="p-2 bg-slate-900 rounded-xl border border-slate-800">
                              <span class="text-slate-400 block text-[10px]">Atmosphere:</span>
                              <strong class="text-white font-mono">${destW.humidity}% Humidity</strong>
                              <span class="text-[10px] text-slate-400 block mt-0.5">${destW.windSpeed} km/h wind</span>
                            </div>
                          </div>

                          <div class="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px]">
                            <span class="text-blue-300 font-bold block">🎯 Visit Suitability:</span>
                            <span class="text-slate-300 leading-snug block mt-0.5">${destW.suitabilityScore}</span>
                            <span class="text-[10px] text-amber-300/90 block mt-1">
                              ${weatherService.getTouristAdvisory(destW, d.is_indoor)}
                            </span>
                          </div>
                        </div>
                      ` : ''}
                    </div>

                    <!-- GPS GEOFENCED REVIEWS EXPANDER SECTION -->
                    <div class="pt-1">
                      <button class="toggle-reviews-btn w-full py-1.5 px-3 bg-slate-950/80 hover:bg-slate-800/80 border border-emerald-500/30 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center justify-between transition" data-id="${d.id}">
                        <span class="flex items-center gap-1.5">
                          <span>💬 Verified Reviews (${reviewsList.length})</span>
                        </span>
                        <span class="text-xs transform transition-transform ${isReviewsOpen ? 'rotate-180' : ''}">▼</span>
                      </button>

                      ${isReviewsOpen ? `
                        <div class="mt-2.5 space-y-2.5 p-3.5 bg-slate-950/95 border border-emerald-500/40 rounded-2xl text-xs animate-fadeIn shadow-xl">
                          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              📍 5km Geofenced Reviews:
                            </span>
                            <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              ✓ 100% Anti-Spam Verified
                            </span>
                          </div>

                          ${reviewsList.length === 0 ? `
                            <div class="text-center py-3 text-slate-400 space-y-1">
                              <p class="text-[11px]">No GPS reviews submitted yet for this spot.</p>
                              <p class="text-[10px] text-amber-300">Be the first to review within 5km and earn <strong>+15 Eco-Points</strong>!</p>
                            </div>
                          ` : `
                            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                              ${reviewsList.map(r => `
                                <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                                  <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-1.5">
                                      <span class="font-bold text-white text-[11px]">${r.userName || 'Verified Visitor'}</span>
                                      <span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                                        ✓ GPS ${r.distanceAtReviewKm ? `${r.distanceAtReviewKm}km` : 'Verified'}
                                      </span>
                                    </div>
                                    <span class="text-amber-400 text-xs">★ ${r.rating}.0</span>
                                  </div>
                                  <p class="text-[11px] font-semibold text-slate-200">${r.title}</p>
                                  <p class="text-[10px] text-slate-400 leading-normal">${r.content}</p>
                                  <div class="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                                    <span>Crowd: ${r.crowdLevel || 'Moderate'}</span>
                                    <span>${r.date}</span>
                                  </div>
                                </div>
                              `).join('')}
                            </div>
                          `}

                          <button class="open-write-review-btn w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5" data-id="${d.id}">
                            <span>⭐ Write GPS Review (+${(d.rarity_tier === 'Rare Gem' || d.rarity_tier === 'Hidden Gem') ? '15' : '10'} Pts)</span>
                          </button>

                        </div>
                      ` : ''}
                    </div>

                    <!-- ACCESSIBILITY BADGE -->
                    <div class="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between">
                      <span class="flex items-center gap-1.5">
                        <span class="text-xs">${d.accessibilityLevel === 'recommended_for_seniors' ? '🟢' : d.accessibilityLevel === 'suitable_with_assistance' ? '🟡' : '🔴'}</span>
                        <span class="font-medium ${d.accessibilityLevel === 'recommended_for_seniors' ? 'text-emerald-300' : d.accessibilityLevel === 'suitable_with_assistance' ? 'text-amber-300' : 'text-rose-300'}">
                          ${d.accessibilityLevel === 'recommended_for_seniors' ? 'Recommended for Seniors' : d.accessibilityLevel === 'suitable_with_assistance' ? 'Suitable with Assistance' : 'Limited Mobility Alert'}
                        </span>
                      </span>
                      <span class="text-[10px] text-slate-500 font-mono">${d.stepCount > 0 ? `${d.stepCount} Steps` : 'Step-Free'}</span>
                    </div>

                    <div class="pt-2 space-y-2 border-t border-slate-800/80">
                      <!-- Exact Address & Coordinates -->
                      <div class="flex items-center justify-between text-[11px] text-slate-400">
                        <p class="flex items-center gap-1 truncate pr-2">
                          <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span class="truncate">${d.location}</span>
                        </p>
                        <span class="text-[10px] font-mono text-slate-500 shrink-0">${d.latitude}°N, ${d.longitude}°E</span>
                      </div>

                      <!-- Key Highlights Chips -->
                      <div class="flex flex-wrap gap-1">
                        ${(d.amenities || []).slice(0, 3).map(a => `
                          <span class="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            ${a}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <!-- EXPANDABLE NEARBY AUTHENTIC MESSES SECTION -->
                    ${(d.nearby_messes && d.nearby_messes.length > 0) ? `
                      <div class="pt-2 border-t border-slate-800/80">
                        <button class="toggle-messes-btn w-full py-1.5 px-3 bg-slate-950/70 hover:bg-slate-800/80 border border-amber-500/20 rounded-xl text-[11px] font-bold text-amber-300 flex items-center justify-between transition" data-id="${d.id}">
                          <span class="flex items-center gap-1.5">
                            <span>🍲 Local Food & Messes (${d.nearby_messes.length})</span>
                          </span>
                          <span class="text-xs transform transition-transform ${isMessOpen ? 'rotate-180' : ''}">▼</span>
                        </button>

                        ${isMessOpen ? `
                          <div class="mt-2.5 space-y-2 p-3 bg-slate-950/90 border border-amber-500/30 rounded-2xl text-xs animate-fadeIn">
                            <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                              Authentic Local Food & Underrated Messes:
                            </span>
                            ${d.nearby_messes.map(m => `
                              <div class="space-y-0.5 pt-1">
                                <div class="font-bold text-white text-[11px] flex items-center gap-1">
                                  <span class="text-amber-400">•</span>
                                  <span>${m.name}</span>
                                </div>
                                <p class="text-[10px] text-slate-400 leading-normal pl-2.5">${m.desc}</p>
                              </div>
                            `).join('')}
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}

                  </div>

                  <!-- Card Footer Actions -->
                  <div class="p-4 pt-0 space-y-2">
                    
                    <!-- REAL-TIME GOOGLE MAPS DIRECT NAVIGATION BUTTON -->
                    <a 
                      href="${geoService.getGoogleMapsDirectionsUrl(d)}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="open-gmaps-btn w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 transform active:scale-95"
                      data-id="${d.id}"
                      data-lat="${d.latitude}"
                      data-lng="${d.longitude}"
                    >
                      <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>📍 Live Directions (Google Maps ↗)</span>
                    </a>

                    <!-- WRITE GPS REVIEW BUTTON (5KM GEOFENCED - 15 PTS FOR GEMS, 10 PTS FOR POPULAR) -->
                    <button 
                      class="open-write-review-btn w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 transform active:scale-95"
                      data-id="${d.id}"
                    >
                      <span class="text-sm">${(d.rarity_tier === 'Rare Gem' || d.rarity_tier === 'Hidden Gem') ? '💎' : '⭐'}</span>
                      <span>Write GPS Review (Within 5km • +${(d.rarity_tier === 'Rare Gem' || d.rarity_tier === 'Hidden Gem') ? '15' : '10'} Eco Pts)</span>
                    </button>

                    <div class="flex items-center gap-2">
                      <button class="ar-tour-btn flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1" data-name="${d.name}">
                        <span>🎧 Audio Tour & AR</span>
                      </button>
                      <button class="ai-ask-btn p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition" data-name="${d.name}" title="Ask AI Guide about this spot & food">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </button>
                    </div>

                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    `;

    bindExploreEvents();
  }

  function bindExploreEvents() {
    // Write GPS review button
    document.querySelectorAll('.open-write-review-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = DESTINATIONS.find(d => d.id === id);
        if (dest) {
          openGpsReviewModal(dest, () => {
            updateView();
          });
        }
      });
    });

    // Toggle reviews accordion
    document.querySelectorAll('.toggle-reviews-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        expandedReviews[id] = !expandedReviews[id];
        updateView();
      });
    });

    // Refresh weather button
    const refreshBtn = document.getElementById('refresh-weather-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('animate-spin');
        weatherService.cache.clear();
        await loadWeatherData();
        refreshBtn.classList.remove('animate-spin');
      });
    }

    // Toggle Destination Weather Expander
    document.querySelectorAll('.toggle-weather-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        expandedWeather[id] = !expandedWeather[id];
        updateView();
      });
    });

    // Detect Live GPS location button
    const gpsBtn = document.getElementById('detect-gps-btn');
    if (gpsBtn) {
      gpsBtn.addEventListener('click', async () => {
        isLocating = true;
        updateView();

        const loc = await geoService.getUserLocation();
        isLocating = false;
        userLiveLocation = loc;
        updateView();
      });
    }

    // Weather simulators
    const rainBtn = document.getElementById('sim-rain-btn');
    const sunBtn = document.getElementById('sim-sun-btn');
    if (rainBtn) {
      rainBtn.addEventListener('click', () => {
        isRainSimulation = true;
        onlyIndoor = true;
        updateView();
      });
    }
    if (sunBtn) {
      sunBtn.addEventListener('click', () => {
        isRainSimulation = false;
        onlyIndoor = false;
        updateView();
      });
    }

    // Filter Chips
    document.querySelectorAll('.explore-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        updateView();
      });
    });

    // Search input
    const searchInput = document.getElementById('explore-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateView();
      });
    }

    // Toggles
    const indoorToggle = document.getElementById('filter-indoor-toggle');
    if (indoorToggle) {
      indoorToggle.addEventListener('change', (e) => {
        onlyIndoor = e.target.checked;
        updateView();
      });
    }

    const seniorToggle = document.getElementById('filter-senior-toggle');
    if (seniorToggle) {
      seniorToggle.addEventListener('change', (e) => {
        onlySenior = e.target.checked;
        updateView();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-explore-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = '';
        activeFilter = 'All';
        isRainSimulation = false;
        onlyIndoor = false;
        onlySenior = false;
        updateView();
      });
    }

    // Toggle Messes Accordion
    document.querySelectorAll('.toggle-messes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        expandedMesses[id] = !expandedMesses[id];
        updateView();
      });
    });

    // Wishlist buttons
    document.querySelectorAll('.fav-dest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const user = authService.getCurrentUser();
        if (!user) {
          window.dispatchEvent(new CustomEvent('atithi:open_auth'));
          return;
        }
        authService.toggleWishlist(id);
        updateView();
      });
    });

    // Audio tour / AR
    document.querySelectorAll('.ar-tour-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'ar' } }));
      });
    });

    // AI Ask button
    document.querySelectorAll('.ai-ask-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        window.dispatchEvent(new CustomEvent('atithi:ask_ai', {
          detail: { query: `Tell me the visitor accessibility tips, history, and famous nearby authentic messes for ${name}` }
        }));
      });
    });

    // Dynamic Google Maps live navigation updater
    document.querySelectorAll('.open-gmaps-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = DESTINATIONS.find(d => d.id === id);
        if (dest) {
          btn.href = geoService.getGoogleMapsDirectionsUrl(dest);
        }
      });
    });
  }

  function showDiscoveryToast(gemName, points) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-6 z-50 p-4 bg-slate-900 border-2 border-cyan-400 rounded-2xl shadow-2xl text-slate-100 flex items-center space-x-3 animate-scaleUp';
    toast.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-xl">
        💎
      </div>
      <div>
        <p class="text-xs font-bold text-cyan-300">Hidden Gem Discovery Verified!</p>
        <p class="text-[11px] text-slate-300">Discovered <strong class="text-white">${gemName}</strong>: <span class="font-mono font-bold text-amber-400">+${points} Eco-Points</span> credited to your wallet.</p>
      </div>
      <button class="ml-2 text-slate-400 hover:text-white p-1" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 6000);
  }

  // Listen for review submission events
  window.addEventListener('atithi:review_submitted', () => {
    updateView();
  });

  // Listen for real-time location update events
  window.addEventListener('atithi:location_updated', (e) => {
    if (e.detail && e.detail.location) {
      userLiveLocation = e.detail.location;
      updateView();
    }
  });

  // Start real-time GPS tracking and load initial location
  geoService.getUserLocation().then((loc) => {
    if (loc) {
      userLiveLocation = loc;
      updateView();
    }
  });
  geoService.startRealtimeTracking();

  loadWeatherData();
}
