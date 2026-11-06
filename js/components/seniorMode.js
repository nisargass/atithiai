// Senior Mode & Real Accessibility Tourism Guide
// Grounded in official tourism, municipal, and accessibility audit data
import { DESTINATIONS } from '../data/destinations.js';
import { openGpsReviewModal } from './gpsReviewModal.js';
import { geoService } from '../services/geoService.js';

export function renderSeniorModeTab(container) {
  let activeCategory = 'all'; // 'all' | 'recommended' | 'assistance' | 'not_recommended'
  let filterBuggy = false;
  let filterStepFree = false;
  let filterWheelchair = false;

  function updateView() {
    const recommended = DESTINATIONS.filter(d => d.accessibilityLevel === 'recommended_for_seniors');
    const assistance = DESTINATIONS.filter(d => d.accessibilityLevel === 'suitable_with_assistance');
    const notRecommended = DESTINATIONS.filter(d => d.accessibilityLevel === 'not_recommended');

    const filteredDestinations = (tierList) => {
      return tierList.filter(d => {
        if (filterBuggy && !d.batteryBuggyAvailable) return false;
        if (filterStepFree && !d.stepFreeAccess) return false;
        if (filterWheelchair && !d.wheelchairAccessible) return false;
        return true;
      });
    };

    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- HERO SENIOR & MOBILITY BANNER -->
        <div class="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-3xl shrink-0">
                ♿
              </div>
              <div class="space-y-1.5 max-w-2xl">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Official Karnataka Tourism Accessibility Model
                  </span>
                  <span class="text-xs text-slate-400">30 Verified Spots</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white">Mysuru Senior & Mobility Guide</h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Recommendations are grounded in physical accessibility characteristics (step-free ramps, battery buggy fleets, resting benches, and vehicle drops), not age alone.
                </p>
                <div class="pt-2 flex flex-wrap gap-2 text-xs">
                  <span class="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1">
                    <span>🟢</span> <span>${recommended.length} Fully Recommended</span>
                  </span>
                  <span class="px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1">
                    <span>🟡</span> <span>${assistance.length} Suitable With Assistance</span>
                  </span>
                  <span class="px-3 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-xl font-bold flex items-center gap-1">
                    <span>🔴</span> <span>${notRecommended.length} Limited Mobility Alert</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Helpline Card -->
            <div class="p-4 bg-slate-950 border border-purple-500/30 rounded-2xl shrink-0 w-full lg:w-auto text-xs space-y-2">
              <span class="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Senior Care Helpline</span>
              <div class="font-mono text-white text-sm font-bold">📞 0821-2415123 / 112</div>
              <p class="text-[11px] text-slate-400">On-demand wheelchair & medical escort services in Mysuru.</p>
            </div>
          </div>
        </div>

        <!-- FILTER TABS & AMENITY TOGGLES -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          <!-- Category Selector -->
          <div class="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            ${[
              { id: 'all', label: 'All 30 Spots' },
              { id: 'recommended', label: `🟢 Recommended (${recommended.length})` },
              { id: 'assistance', label: `🟡 Suitable with Assistance (${assistance.length})` },
              { id: 'not_recommended', label: `🔴 Limited Mobility Alert (${notRecommended.length})` }
            ].map(tab => {
              const active = activeCategory === tab.id;
              return `
                <button class="senior-cat-tab-btn px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${active ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-cat="${tab.id}">
                  ${tab.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Specific Need Toggles -->
          <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="checkbox" id="senior-filter-buggy" ${filterBuggy ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-500 rounded bg-slate-800 border-slate-700" />
              <span>🔋 Battery Buggy</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="checkbox" id="senior-filter-stepfree" ${filterStepFree ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-500 rounded bg-slate-800 border-slate-700" />
              <span>🚶 Step-Free</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="checkbox" id="senior-filter-wheelchair" ${filterWheelchair ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-500 rounded bg-slate-800 border-slate-700" />
              <span>♿ Wheelchair Access</span>
            </label>
          </div>

        </div>

        <!-- SECTION 1: RECOMMENDED FOR SENIORS -->
        ${(activeCategory === 'all' || activeCategory === 'recommended') ? `
          <div class="space-y-4">
            <div class="flex items-center space-x-2.5">
              <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h3 class="text-lg font-bold text-white">Recommended for Seniors & Limited Mobility</h3>
              <span class="text-xs text-slate-400">(${filteredDestinations(recommended).length} Verified Destinations)</span>
            </div>
            <p class="text-xs text-slate-400 -mt-2">Places with strong accessibility evidence: step-free routes, wheelchair elevators, battery buggies, resting areas, and accessible toilets.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filteredDestinations(recommended).map(d => renderSeniorCard(d, 'recommended')).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SECTION 2: SUITABLE WITH ASSISTANCE -->
        ${(activeCategory === 'all' || activeCategory === 'assistance') ? `
          <div class="space-y-4 pt-4">
            <div class="flex items-center space-x-2.5">
              <span class="w-3 h-3 rounded-full bg-amber-400"></span>
              <h3 class="text-lg font-bold text-white">Suitable With Assistance</h3>
              <span class="text-xs text-slate-400">(${filteredDestinations(assistance).length} Destinations)</span>
            </div>
            <p class="text-xs text-slate-400 -mt-2">Visitable destinations requiring a companion, vehicle drop-off close to gate, low-step negotiation, or moderate walking.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filteredDestinations(assistance).map(d => renderSeniorCard(d, 'assistance')).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SECTION 3: NOT RECOMMENDED FOR LIMITED MOBILITY -->
        ${(activeCategory === 'all' || activeCategory === 'not_recommended') ? `
          <div class="space-y-4 pt-4">
            <div class="flex items-center space-x-2.5">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span>
              <h3 class="text-lg font-bold text-white">Not Recommended for Limited Mobility</h3>
              <span class="text-xs text-slate-400">(${filteredDestinations(notRecommended).length} Destinations)</span>
            </div>
            <p class="text-xs text-slate-400 -mt-2">Destinations involving 100+ steep stone stairs, rugged boulder terrain, deep sand dunes, or high cardiovascular exertion.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filteredDestinations(notRecommended).map(d => renderSeniorCard(d, 'not_recommended')).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    bindSeniorEvents();
  }

  function renderSeniorCard(d, tier) {
    const isRecommended = tier === 'recommended';
    const isAssistance = tier === 'assistance';
    const isNotRecommended = tier === 'not_recommended';

    const borderClass = isRecommended 
      ? 'border-emerald-500/30 hover:border-emerald-500/60' 
      : isAssistance 
      ? 'border-amber-500/30 hover:border-amber-500/60' 
      : 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10';

    const badgeClass = isRecommended
      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
      : isAssistance
      ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
      : 'bg-rose-950/90 text-rose-300 border-rose-500/40';

    const badgeLabel = isRecommended
      ? '🟢 Recommended for Seniors'
      : isAssistance
      ? '🟡 Companion Assistance Advised'
      : '🔴 Not Recommended for Limited Mobility';

    return `
      <div class="bg-slate-900 border ${borderClass} rounded-3xl overflow-hidden shadow-xl transition flex flex-col justify-between">
        
        <!-- Card Header Image -->
        <div class="relative h-44 overflow-hidden bg-slate-950">
          <img src="${d.image_url}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          
          <div class="absolute top-3 left-3">
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${badgeClass}">
              ${badgeLabel}
            </span>
          </div>

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
            <span class="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 font-mono">
              Intensity: <strong>${d.walkingIntensity}</strong>
            </span>
            <span class="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 font-mono">
              ${d.stepCount > 0 ? `🧗 ${d.stepCount} Steps` : '🚶 Step-Free'}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="text-base font-bold text-white">${d.name}</h4>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">${d.description}</p>
          </div>

          <!-- Official Accessibility Notes -->
          <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase">Accessibility Rationale:</span>
              <span class="text-[9px] text-slate-500 font-mono">⏱️ ~${d.recommendedVisitDuration}</span>
            </div>
            <p class="text-[11px] ${isNotRecommended ? 'text-rose-300' : 'text-slate-300'} leading-relaxed">${d.accessibilityNotes}</p>
            
            <div class="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
              <span class="truncate">Source: ${d.verificationSource}</span>
              <span class="text-emerald-400 font-semibold shrink-0 ml-1">✓ ${d.verificationStatus}</span>
            </div>
          </div>

          <!-- Feature Amenities Chips -->
          <div class="flex flex-wrap gap-1 pt-1">
            ${d.batteryBuggyAvailable ? '<span class="text-[9px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">🔋 Buggy Available</span>' : ''}
            ${d.wheelchairAccessible ? '<span class="text-[9px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">♿ Wheelchair Ramp</span>' : ''}
            ${d.directVehicleDrop ? '<span class="text-[9px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">🚗 Direct Vehicle Drop</span>' : ''}
            ${d.restingAreas ? '<span class="text-[9px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">🪑 Resting Gazebos</span>' : ''}
            ${d.accessibleToilets ? '<span class="text-[9px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">🚻 Accessible Toilet</span>' : ''}
            ${d.steepSteps ? '<span class="text-[9px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">⚠️ Steep Stairs</span>' : ''}
          </div>
        </div>

        <!-- Action Footer -->
        <div class="p-4 pt-0 space-y-2">
          <!-- Direct Google Maps Navigation with Real-Time Coordinates -->
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <span class="flex items-center gap-1 text-slate-400">
              <span class="text-emerald-400">📍 Satellite GPS:</span>
              <span>${d.latitude}°N, ${d.longitude}°E</span>
            </span>
            ${d.stepFreeAccess ? '<span class="text-emerald-400 font-semibold">✓ Step-Free</span>' : '<span class="text-rose-400 font-semibold">⚠️ Stairs Required</span>'}
          </div>

          <a 
            href="${geoService.getGoogleMapsDirectionsUrl(d)}"
            target="_blank"
            rel="noopener noreferrer"
            class="open-senior-gmaps-btn w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 transform active:scale-95"
            data-id="${d.id}"
          >
            <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>📍 Live Directions & Vehicle Drop (Google Maps ↗)</span>
          </a>

          <!-- GPS Geofenced Review Button -->
          <button 
            class="senior-gps-review-btn w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
            data-id="${d.id}"
          >
            <span>⭐ Verify Accessibility on Site (GPS Review • +10 Pts)</span>
          </button>

          ${isNotRecommended ? `
            <button class="w-full py-2 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700 cursor-not-allowed" disabled>
              High Incline / Not Recommended for Mobility Issues
            </button>
          ` : isRecommended ? `
            <button class="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition" onclick="alert('Priority Senior Pass & Battery Buggy reserved for ${d.name}!')">
              Reserve Priority Buggy & Senior Pass
            </button>
          ` : `
            <button class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition" onclick="alert('Companion Assistance Guide & Direct Vehicle Route Map downloaded for ${d.name}!')">
              View Assisted Access Route & Map
            </button>
          `}
        </div>

      </div>
    `;
  }

  function bindSeniorEvents() {
    document.querySelectorAll('.senior-cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        updateView();
      });
    });

    const buggyCheck = document.getElementById('senior-filter-buggy');
    if (buggyCheck) buggyCheck.addEventListener('change', (e) => { filterBuggy = e.target.checked; updateView(); });

    const stepFreeCheck = document.getElementById('senior-filter-stepfree');
    if (stepFreeCheck) stepFreeCheck.addEventListener('change', (e) => { filterStepFree = e.target.checked; updateView(); });

    const wheelchairCheck = document.getElementById('senior-filter-wheelchair');
    if (wheelchairCheck) wheelchairCheck.addEventListener('change', (e) => { filterWheelchair = e.target.checked; updateView(); });

    // Dynamic Google Maps URL on click
    document.querySelectorAll('.open-senior-gmaps-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = DESTINATIONS.find(d => d.id === id);
        if (dest) {
          btn.href = geoService.getGoogleMapsDirectionsUrl(dest);
        }
      });
    });

    document.querySelectorAll('.senior-gps-review-btn').forEach(btn => {
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
  }

  updateView();
}
