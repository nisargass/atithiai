// Holiday Packages View Component for AtithiAI
import { PACKAGES_DATA } from '../data/packages.js';
import { authService } from '../services/authService.js';
import { geoService } from '../services/geoService.js';

export function renderPackagesTab(container) {
  let filterDuration = 'all'; // 'all' | '2' | '3' | '4' | '5'
  let filterBudget = 'all'; // 'all' | 'Budget' | 'Premium' | 'Royal Luxury'
  let filterCircuit = 'all'; // 'all' | 'mysuru' | 'mysuru_circuit' | 'karnataka_heritage'
  let expandedDayPlans = {}; // { pkgId: true/false }

  function updateView() {
    const user = authService.getCurrentUser();

    const filteredPackages = PACKAGES_DATA.filter(pkg => {
      if (filterDuration !== 'all' && pkg.daysCount !== Number(filterDuration)) return false;
      if (filterBudget !== 'all' && pkg.budgetTier !== filterBudget) return false;
      if (filterCircuit !== 'all' && pkg.cityId !== filterCircuit) return false;
      return true;
    });

    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- HERO BANNER -->
        <div class="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/40 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  🎒 All-Inclusive Multi-Day Packages
                </span>
                <span class="text-xs text-slate-400">Curated Mysore & Karnataka Circuits</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                Curated Holiday & Heritage Packages
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All-inclusive multi-day itineraries dynamically adapting to weather, crowd levels, and senior pace. Includes verified heritage stays, VIP palace access, electric transit passes, authentic meals, and dedicated elder assistance.
              </p>
              
              <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                  <span>✓ 100% Commission-Free Stays</span>
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold flex items-center gap-1">
                  <span>♿ Senior Care Pace & Step-Free Drops</span>
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1">
                  <span>🌱 Earn 350 to 1,200 Eco-Points / Booking</span>
                </span>
              </div>
            </div>

            <!-- Stats Mini Card -->
            <div class="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 shrink-0 w-full lg:w-auto text-xs">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tour Highlights</span>
              <div class="font-mono text-amber-400 text-sm font-bold">★ 4.9 Average Traveler Rating</div>
              <p class="text-[11px] text-slate-400">Instant digital QR voucher confirmation.</p>
            </div>
          </div>
        </div>

        <!-- FILTER BAR -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl text-xs shadow-xl">
          
          <!-- Duration Filter -->
          <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span class="text-slate-400 font-bold mr-1">Duration:</span>
            ${[
              { id: 'all', label: 'All Days' },
              { id: '2', label: '2 Days (Weekend)' },
              { id: '3', label: '3 Days (Explorer)' },
              { id: '4', label: '4 Days (Safari/UNESCO)' },
              { id: '5', label: '5 Days (Grand Slow Tour)' }
            ].map(d => {
              const active = filterDuration === d.id;
              return `
                <button class="pkg-filter-dur px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${active ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'}" data-dur="${d.id}">
                  ${d.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Tier & Circuit Filter -->
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <div class="flex items-center space-x-1">
              <span class="text-slate-400 font-bold mr-1">Tier:</span>
              ${[
                { id: 'all', label: 'All Tiers' },
                { id: 'Budget', label: 'Budget' },
                { id: 'Premium', label: 'Premium' },
                { id: 'Royal Luxury', label: 'Royal Luxury' }
              ].map(b => {
                const active = filterBudget === b.id;
                return `
                  <button class="pkg-filter-tier px-2.5 py-1.5 rounded-xl font-bold transition text-[11px] ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'}" data-tier="${b.id}">
                    ${b.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- PACKAGES GRID -->
        ${filteredPackages.length === 0 ? `
          <div class="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <span class="text-3xl">🎒</span>
            <h3 class="text-base font-bold text-slate-300">No holiday packages matching selected filters</h3>
            <p class="text-xs text-slate-500">Try selecting "All Days" or "All Tiers" to view full packages.</p>
            <button id="pkg-reset-filters-btn" class="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredPackages.map(pkg => {
              const isPlanOpen = !!expandedDayPlans[pkg.id];

              return `
                <div class="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition group">
                  
                  <!-- Card Header Image -->
                  <div class="relative h-52 overflow-hidden bg-slate-950">
                    <img 
                      src="${pkg.image}" 
                      onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';" 
                      alt="${pkg.title}" 
                      class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    <!-- Top Badges -->
                    <div class="absolute top-3 left-3 flex gap-1.5">
                      <span class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase shadow-md">
                        ${pkg.duration}
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white font-bold text-[10px] backdrop-blur-md">
                        ${pkg.budgetTier}
                      </span>
                    </div>

                    <div class="absolute top-3 right-3 flex items-center gap-1">
                      <span class="px-2 py-0.5 rounded-lg bg-slate-950/90 text-purple-300 border border-purple-500/30 font-bold text-[10px] backdrop-blur-md">
                        ♿ Senior Fit: ${pkg.seniorScore}%
                      </span>
                    </div>

                    <!-- Bottom Bar on Image -->
                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span class="text-[10px] font-bold text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-amber-500/20">
                        📍 ${pkg.cityName}
                      </span>
                      <div class="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-400 font-bold font-mono text-[11px]">
                        <span>★</span>
                        <span>${pkg.rating}</span>
                        <span class="text-slate-400 font-normal text-[10px]">(${pkg.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <!-- Card Body -->
                  <div class="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between text-xs">
                    <div class="space-y-3">
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400">${pkg.theme}</span>
                        <h3 class="text-base font-bold text-white mt-0.5 leading-snug group-hover:text-blue-300 transition">${pkg.title}</h3>
                      </div>

                      <!-- All-Inclusive Inclusions -->
                      <div class="space-y-1.5 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
                        <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                          All-Inclusive Package Inclusions:
                        </span>
                        ${(pkg.inclusions || []).map(inc => `
                          <div class="flex items-start space-x-2 text-slate-300 text-[11px] leading-tight">
                            <span class="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>${inc}</span>
                          </div>
                        `).join('')}
                      </div>

                      <!-- Day-by-Day Adaptive Plan Accordion -->
                      <div class="border-t border-slate-800/80 pt-2">
                        <button class="toggle-dayplan-btn w-full py-1.5 px-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center justify-between transition" data-id="${pkg.id}">
                          <span>📅 View Day-by-Day Itinerary (${pkg.dayPlan.length} Days)</span>
                          <span class="transform transition-transform ${isPlanOpen ? 'rotate-180' : ''}">▼</span>
                        </button>

                        ${isPlanOpen ? `
                          <div class="mt-2.5 space-y-2 p-3 bg-slate-950 border border-blue-500/30 rounded-2xl text-xs animate-fadeIn">
                            <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                              Daily Weather-Adaptive Schedule:
                            </span>
                            ${pkg.dayPlan.map(d => `
                              <div class="space-y-0.5 pt-1">
                                <div class="font-bold text-slate-200 text-[11px]">
                                  <span class="text-amber-400 font-mono">Day ${d.day}:</span> ${d.title}
                                </div>
                                <p class="text-[10px] text-slate-400 leading-relaxed pl-2">${d.desc}</p>
                              </div>
                            `).join('')}
                          </div>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Pricing & Action Footer -->
                    <div class="pt-3 border-t border-slate-800 space-y-2">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="flex items-baseline space-x-1.5">
                            <span class="text-lg font-black text-white font-mono">₹${pkg.pricePerPerson}</span>
                            <span class="text-xs text-slate-500 line-through font-mono">₹${pkg.originalPrice}</span>
                            <span class="text-[10px] text-slate-400">/ person</span>
                          </div>
                          <span class="text-[10px] text-emerald-400 font-bold block">
                            🌱 +${pkg.ecoPoints} Eco-Points Awarded
                          </span>
                        </div>

                        <button class="book-package-btn px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition transform active:scale-95" data-id="${pkg.id}">
                          Book Package →
                        </button>
                      </div>

                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.title + ', ' + pkg.cityName + ', Karnataka')}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
                      >
                        <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>📍 View Tour Circuit in Google Maps ↗</span>
                      </a>
                    </div>

                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    `;

    bindPackageEvents();
  }

  function bindPackageEvents() {
    // Duration filter
    document.querySelectorAll('.pkg-filter-dur').forEach(btn => {
      btn.addEventListener('click', () => {
        filterDuration = btn.getAttribute('data-dur');
        updateView();
      });
    });

    // Tier filter
    document.querySelectorAll('.pkg-filter-tier').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBudget = btn.getAttribute('data-tier');
        updateView();
      });
    });

    // Reset filters
    const resetBtn = document.getElementById('pkg-reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        filterDuration = 'all';
        filterBudget = 'all';
        filterCircuit = 'all';
        updateView();
      });
    }

    // Toggle day plan accordion
    document.querySelectorAll('.toggle-dayplan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        expandedDayPlans[id] = !expandedDayPlans[id];
        updateView();
      });
    });

    // Book package action
    document.querySelectorAll('.book-package-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pkg = PACKAGES_DATA.find(p => p.id === id);
        if (!pkg) return;

        const user = authService.getCurrentUser();
        if (!user) {
          window.dispatchEvent(new CustomEvent('atithi:open_auth', {
            detail: { onSuccessRedirect: 'packages' }
          }));
          return;
        }

        // Add confirmed package booking to customer account
        const res = authService.addBooking({
          title: pkg.title,
          category: `Tour Package (${pkg.duration})`,
          location: pkg.cityName,
          checkIn: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000 * (2 + pkg.daysCount)).toISOString().split('T')[0],
          guests: '2 Travelers',
          roomType: `${pkg.budgetTier} All-Inclusive`,
          totalCost: `₹${pkg.pricePerPerson * 2}`,
          ecoPointsEarned: pkg.ecoPoints,
          image: pkg.image
        });

        if (res.success) {
          showPackageBookingSuccessToast(pkg);
          updateView();
        } else {
          alert(res.error || 'Booking failed.');
        }
      });
    });
  }

  function showPackageBookingSuccessToast(pkg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 p-5 bg-slate-900 border-2 border-emerald-400 rounded-3xl shadow-2xl text-slate-100 flex items-start space-x-4 animate-scaleUp max-w-md';
    toast.innerHTML = `
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-2xl shrink-0">
        🎒
      </div>
      <div class="space-y-1">
        <p class="text-sm font-bold text-white">Holiday Package Confirmed!</p>
        <p class="text-xs text-slate-300"><strong class="text-amber-300">${pkg.title}</strong> is reserved with all inclusions.</p>
        <p class="text-[11px] text-emerald-400 font-mono font-bold">✓ +${pkg.ecoPoints} Eco-Points Credited to Wallet</p>
        <div class="pt-2 flex gap-2">
          <button id="toast-view-pass-btn" class="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow">
            View Digital Pass in Dashboard →
          </button>
        </div>
      </div>
      <button class="text-slate-400 hover:text-white p-1" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);

    const passBtn = toast.querySelector('#toast-view-pass-btn');
    if (passBtn) {
      passBtn.addEventListener('click', () => {
        toast.remove();
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
      });
    }

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 8000);
  }

  updateView();
}
