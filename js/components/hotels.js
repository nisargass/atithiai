// Hotels & Economical Stays Component
import { HOTELS } from '../data/hotelsData.js';
import { geoService } from '../services/geoService.js';

export function renderHotelsTab(container) {
  let activeFilter = 'All'; // 'All' | 'economical' | 'midrange' | 'luxury'
  let sortBy = 'featured'; // 'featured' | 'price_low' | 'price_high' | 'eco_points'

  function updateView() {
    let filtered = HOTELS.filter(h => {
      if (activeFilter === 'economical' && h.tier !== 'economical') return false;
      if (activeFilter === 'midrange' && h.tier !== 'midrange') return false;
      if (activeFilter === 'luxury' && h.tier !== 'luxury') return false;
      return true;
    });

    if (sortBy === 'price_low') {
      filtered.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sortBy === 'eco_points') {
      filtered.sort((a, b) => b.eco_points - a.eco_points);
    }

    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- HERO BANNER -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  🌿 Budget & Heritage Certified Stays
                </span>
                <span class="text-xs text-slate-400">Tariffs from ₹650/night</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                Economical Lodges, Eco-Resorts & Royal Palaces
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose from verified budget-friendly lodges (₹650–₹1,650), zero-waste eco-resorts, and royal Maharaja suites. Every verified stay awards bonus <strong>Eco-Points</strong> directly credited to your Customer Dashboard.
              </p>
            </div>

            <!-- Quick Stats Pill -->
            <div class="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5 shrink-0">
              <span class="text-[11px] text-slate-400 block">Available Stays</span>
              <div class="text-2xl font-bold font-mono text-amber-400">${HOTELS.length} Properties</div>
              <span class="text-[10px] text-emerald-400 font-semibold block">✓ 5 Budget Stays under ₹1,800</span>
            </div>
          </div>
        </div>

        <!-- FILTER CHIPS & SORT -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <!-- Filter Tabs -->
          <div class="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            ${[
              { id: 'All', label: '🏨 All Stays (10)' },
              { id: 'economical', label: '💰 Budget Economical (₹650 - ₹1,650)' },
              { id: 'midrange', label: '🌿 Eco & Mid-Range (₹2,800 - ₹3,800)' },
              { id: 'luxury', label: '👑 Royal Palaces (₹7,200+)' }
            ].map(tab => {
              const active = activeFilter === tab.id;
              return `
                <button class="hotel-filter-btn px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${active ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-filter="${tab.id}">
                  ${tab.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Sort Select -->
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <span class="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select id="hotel-sort-select" class="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500">
              <option value="featured" ${sortBy === 'featured' ? 'selected' : ''}>🌟 Recommended</option>
              <option value="price_low" ${sortBy === 'price_low' ? 'selected' : ''}>💰 Lowest Price First</option>
              <option value="price_high" ${sortBy === 'price_high' ? 'selected' : ''}>👑 Highest Price First</option>
              <option value="eco_points" ${sortBy === 'eco_points' ? 'selected' : ''}>🌱 Max Eco-Points</option>
            </select>
          </div>

        </div>

        <!-- HOTELS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(h => {
            const isBudget = h.tier === 'economical';
            const tierBadge = 
              h.tier === 'economical' 
                ? '<span class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">💰 Economical Value</span>'
                : h.tier === 'midrange'
                ? '<span class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">🌿 Eco Resort</span>'
                : '<span class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">👑 Royal Heritage</span>';

            return `
              <div class="bg-slate-900 border ${isBudget ? 'border-emerald-500/30 hover:border-emerald-400' : 'border-slate-800 hover:border-amber-500/40'} rounded-3xl overflow-hidden shadow-xl transition flex flex-col justify-between group">
                
                <!-- Card Header Image -->
                <div class="relative h-52 overflow-hidden bg-slate-950">
                  <img 
                    src="${h.image_url}" 
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';" 
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                  <!-- Tier Badge Top Left -->
                  <div class="absolute top-3 left-3">
                    ${tierBadge}
                  </div>

                  <!-- Eco Points Top Right -->
                  <span class="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    🌱 +${h.eco_points} Eco Pts
                  </span>

                  <!-- Price Bottom Left -->
                  <div class="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-xl text-amber-400 font-bold font-mono text-sm">
                    ₹${h.price_per_night.toLocaleString()} <span class="text-[10px] text-slate-400 font-normal">/ night</span>
                  </div>

                  <!-- Rating Bottom Right -->
                  <div class="absolute bottom-3 right-3 bg-slate-950/80 px-2 py-1 rounded-lg text-amber-400 font-bold font-mono text-xs flex items-center gap-1">
                    <span>★</span>
                    <span>${h.rating}</span>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500">${h.category}</span>
                    <h4 class="text-base font-bold text-white mt-0.5 group-hover:text-amber-300 transition">${h.name}</h4>
                    <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">${h.description}</p>
                    <p class="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span class="truncate">${h.location}</span>
                    </p>
                    <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/60">
                      <span class="flex items-center gap-1">
                        <span class="text-emerald-400">📍 Satellite GPS:</span>
                        <span>${h.latitude}°N, ${h.longitude}°E</span>
                      </span>
                    </div>
                  </div>

                  <!-- Amenities Chips -->
                  <div class="flex flex-wrap gap-1 pt-2 border-t border-slate-800">
                    ${(h.amenities || []).map(a => `
                      <span class="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        ${a}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="p-4 pt-0 space-y-2">
                  <a 
                    href="${geoService.getGoogleMapsDirectionsUrl(h)}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>📍 Live Directions (Google Maps ↗)</span>
                  </a>
                  
                  <button class="book-hotel-now-btn w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5" data-id="${h.id}">
                    <span>Book Stay (₹${h.price_per_night.toLocaleString()})</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    bindHotelEvents();
  }

  function bindHotelEvents() {
    // Filter buttons
    document.querySelectorAll('.hotel-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        updateView();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('hotel-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        updateView();
      });
    }

    // Book buttons
    document.querySelectorAll('.book-hotel-now-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const hotel = HOTELS.find(h => h.id === id);
        if (hotel) {
          window.dispatchEvent(new CustomEvent('atithi:open_booking_modal', { detail: { hotel } }));
        }
      });
    });
  }

  updateView();
}
