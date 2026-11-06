// Customer Dashboard Component
// Features: Overview stats, My Bookings with digital QR passes,
// Eco-Rewards Wallet with transaction ledger, Community Submissions, Saved Wishlist, and Profile Settings.

import { authService } from '../services/authService.js';
import { DESTINATIONS } from '../data/destinations.js';
import { geoService } from '../services/geoService.js';

export function renderCustomerDashboard(container, activeSubTab = 'bookings') {
  const user = authService.getCurrentUser();
  
  if (!user) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div class="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-xl shadow-blue-500/10 border border-slate-700/60 mx-auto">
            <img src="./images/logo.png" alt="AtithiAI" class="h-14 w-auto object-contain rounded-xl" />
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Atithi<span class="text-amber-400">AI</span> Customer Dashboard
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Wander wisely. Experience truly • Access your digital entry QR passes, Eco-Points wallet, claimed vouchers, and travel preferences.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div class="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span class="text-lg">🎟️</span>
              <h4 class="text-xs font-bold text-white mt-1">Digital QR Passes</h4>
              <p class="text-[11px] text-slate-400">Boarding & entrance passes ready to scan.</p>
            </div>
            <div class="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span class="text-lg">🌱</span>
              <h4 class="text-xs font-bold text-white mt-1">Eco-Wallet (240+ Pts)</h4>
              <p class="text-[11px] text-slate-400">Redeem at Mysore Silk & heritage messes.</p>
            </div>
            <div class="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <span class="text-lg">❤️</span>
              <h4 class="text-xs font-bold text-white mt-1">Saved Wishlist</h4>
              <p class="text-[11px] text-slate-400">Keep track of your top 30 destinations.</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button id="instant-demo-login-btn" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2">
              <span>⚡ 1-Click Demo Login (Ananya Rao)</span>
            </button>
            <button id="dashboard-login-btn" class="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition">
              🔑 Email + Password
            </button>
            <button id="dashboard-otp-btn" class="w-full sm:w-auto px-5 py-3 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 font-semibold text-xs rounded-xl border border-blue-500/30 transition">
              📱 Mobile / OTP
            </button>
          </div>
        </div>
      </div>
    `;

    const instantBtn = document.getElementById('instant-demo-login-btn');
    if (instantBtn) {
      instantBtn.addEventListener('click', async () => {
        await authService.login('ananya.rao@gmail.com', 'Mysuru@2026');
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
      });
    }

    const emailBtn = document.getElementById('dashboard-login-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:open_auth', { detail: { onSuccessRedirect: 'dashboard' } }));
      });
    }

    const otpBtn = document.getElementById('dashboard-otp-btn');
    if (otpBtn) {
      otpBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:open_auth', { detail: { onSuccessRedirect: 'dashboard' } }));
      });
    }
    return;
  }

  let currentTab = activeSubTab; // 'bookings' | 'wallet' | 'wishlist' | 'settings'

  function updateDashboardView() {
    const bookings = user.bookings || [];
    const vouchers = user.claimedVouchers || [];
    const wishlistIds = user.wishlist || [];
    const wishlistDestinations = DESTINATIONS.filter(d => wishlistIds.includes(d.id));
    const ecoLedger = user.ecoLedger || [];
    const discoverySubmissions = user.discoverySubmissions || [];

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        
        <!-- PROFILE HEADER CARD -->
        <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            <!-- User Info Left -->
            <div class="flex items-center space-x-5">
              <div class="relative">
                <img 
                  src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" 
                  alt="${user.name}" 
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/20"
                />
                <span class="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full text-xs font-bold border-2 border-slate-900" title="Verified Customer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>

              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">${user.name}</h1>
                  <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    👑 ${user.memberTier || 'Royal Heritage Explorer'}
                  </span>
                </div>
                <p class="text-xs text-slate-400 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verified: ${user.email}</span>
                </p>
                <p class="text-xs text-slate-500">Mysuru Smart Tourism Customer ID: <span class="font-mono text-slate-400">#MST-88219</span></p>
              </div>
            </div>

            <!-- Quick Action Right -->
            <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button id="dash-book-now-btn" class="flex-1 md:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Book Heritage Stay</span>
              </button>
              <button id="dash-logout-btn" class="px-4 py-2.5 bg-slate-800/80 hover:bg-red-950 hover:text-red-300 hover:border-red-500/30 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          <!-- METRICS RIBBON -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
            
            <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <span class="text-[11px] text-slate-400">Eco-Points Balance</span>
              <div class="flex items-baseline space-x-1.5 mt-1">
                <span class="text-2xl font-bold font-mono text-amber-400">${user.ecoPoints || 0}</span>
                <span class="text-xs text-amber-300/80">pts</span>
              </div>
            </div>

            <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <span class="text-[11px] text-slate-400">Active Passes</span>
              <div class="flex items-baseline space-x-1.5 mt-1">
                <span class="text-2xl font-bold font-mono text-emerald-400">${bookings.filter(b => b.status === 'Confirmed').length}</span>
                <span class="text-xs text-slate-500">passes</span>
              </div>
            </div>

            <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <span class="text-[11px] text-slate-400">Claimed Vouchers</span>
              <div class="flex items-baseline space-x-1.5 mt-1">
                <span class="text-2xl font-bold font-mono text-blue-400">${vouchers.length}</span>
                <span class="text-xs text-slate-500">active</span>
              </div>
            </div>

            <div class="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <span class="text-[11px] text-slate-400">Carbon Saved</span>
              <div class="flex items-baseline space-x-1.5 mt-1">
                <span class="text-2xl font-bold font-mono text-emerald-300">${user.carbonSavedKg || 0}</span>
                <span class="text-xs text-slate-500">kg CO₂</span>
              </div>
            </div>

          </div>

        </div>

        <!-- DASHBOARD NAVIGATION TABS -->
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button class="dash-tab-btn px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${currentTab === 'bookings' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-tab="bookings">
            🎟️ My Bookings & Passes (${bookings.length})
          </button>
          <button class="dash-tab-btn px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${currentTab === 'wallet' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-tab="wallet">
            🌱 Eco-Wallet & Ledger (${user.ecoPoints || 0} Pts)
          </button>
          <button class="dash-tab-btn px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${currentTab === 'wishlist' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-tab="wishlist">
            ❤️ Saved Wishlist (${wishlistDestinations.length})
          </button>
          <button class="dash-tab-btn px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${currentTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}" data-tab="settings">
            ⚙️ Preferences & Accessibility
          </button>
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div class="space-y-6">

          <!-- TAB 1: MY BOOKINGS -->
          ${currentTab === 'bookings' ? `
            <div class="space-y-4">
              ${bookings.length === 0 ? `
                <div class="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                  <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h3 class="text-base font-bold text-slate-300">No Active Bookings Yet</h3>
                  <p class="text-xs text-slate-500 max-w-sm mx-auto">Explore heritage palaces, reserve nature stays, or grab electric transit passes.</p>
                  <button id="dash-explore-hotels-btn" class="mt-2 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md">
                    Explore Hotels & Stays
                  </button>
                </div>
              ` : `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  ${bookings.map(b => `
                    <div class="bg-slate-900/90 border ${b.status === 'Confirmed' ? 'border-amber-500/30' : 'border-slate-800'} rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                      
                      <!-- Ticket Top -->
                      <div class="p-5 sm:p-6 space-y-4">
                        <div class="flex items-start justify-between gap-3">
                          <div class="flex items-center space-x-3">
                            <img src="${b.image || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';" class="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                            <div>
                              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                ${b.category || 'Heritage Stay'}
                              </span>
                              <h4 class="text-base font-bold text-white mt-1">${b.title}</h4>
                              <p class="text-xs text-slate-400">${b.location}</p>
                            </div>
                          </div>
                          
                          <span class="px-2.5 py-1 text-[11px] font-bold rounded-full ${b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}">
                            ${b.status}
                          </span>
                        </div>

                        <!-- Ticket details grid -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-xs">
                          <div>
                            <span class="text-[10px] text-slate-500 block">Check In</span>
                            <span class="font-medium text-slate-200">${b.checkIn}</span>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 block">Check Out</span>
                            <span class="font-medium text-slate-200">${b.checkOut}</span>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 block">Guests / Pass</span>
                            <span class="font-medium text-slate-200">${b.guests || '2 Guests'}</span>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 block">Total Paid</span>
                            <span class="font-bold text-amber-400 font-mono">${b.amountPaid}</span>
                          </div>
                        </div>

                        <!-- Eco Points credited info -->
                        <div class="flex items-center justify-between text-xs px-3 py-2 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-300">
                          <span>🌱 Eco-Rewards Earned:</span>
                          <span class="font-bold font-mono">+${b.ecoPointsEarned || 50} pts credited</span>
                        </div>

                      </div>

                      <!-- Ticket Stub / QR Code Area -->
                      <div class="bg-slate-950 p-4 border-t border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center space-x-3">
                          <!-- High-Contrast QR Code -->
                          <div class="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow">
                            <svg class="w-12 h-12 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm6-2h2v4h-2v-4z"/>
                            </svg>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-500 block">Scan at Entrance / Front Desk</span>
                            <span class="font-mono text-xs font-bold text-amber-400">${b.id}</span>
                            <span class="block text-[10px] text-slate-400">Digital Smart Pass</span>
                          </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <a 
                            href="${geoService.getGoogleMapsDirectionsUrl(b)}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                          >
                            <svg class="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span>📍 Directions ↗</span>
                          </a>

                          <button class="print-ticket-btn px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition flex items-center gap-1" data-id="${b.id}">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Pass</span>
                          </button>
                          ${b.status === 'Confirmed' ? `
                            <button class="cancel-booking-btn px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition" data-id="${b.id}">
                              Cancel
                            </button>
                          ` : ''}
                        </div>

                      </div>

                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 2: ECO-WALLET, CLAIMED VOUCHERS & DISCOVERIES -->
          ${currentTab === 'wallet' ? `
            <div class="space-y-6">
              
              <!-- Wallet Summary Banner -->
              <div class="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="space-y-1">
                  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Green Tourist Rewards Wallet</span>
                  <h3 class="text-xl font-bold text-white">Your Available Balance: <span class="font-mono text-amber-400">${user.ecoPoints || 0} Points</span></h3>
                  <p class="text-xs text-slate-400">Earn +10 Pts on Hidden Gems, +5 Pts on verified community discoveries, and save carbon on EV buses.</p>
                </div>
                <button id="dash-redeem-vouchers-btn" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition">
                  Redeem Partner Vouchers →
                </button>
              </div>

              <!-- Activity Ledger -->
              <div class="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Transaction History</h4>
                <div class="divide-y divide-slate-800 text-xs">
                  ${ecoLedger.map(t => `
                    <div class="py-2 flex items-center justify-between">
                      <div>
                        <span class="text-white font-medium block">${t.title}</span>
                        <span class="text-[10px] text-slate-500">${new Date(t.timestamp).toLocaleString()}</span>
                      </div>
                      <span class="font-mono font-bold ${t.points > 0 ? 'text-emerald-400' : 'text-rose-400'}">
                        ${t.points > 0 ? `+${t.points}` : t.points} pts
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Claimed Vouchers Grid -->
              <div>
                <h4 class="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <span>🎟️ My Claimed Vouchers</span>
                  <span class="text-xs text-slate-500 font-normal">(Show at partner store in Mysuru)</span>
                </h4>

                ${vouchers.length === 0 ? `
                  <div class="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                    No claimed vouchers yet. Redeem your eco-points for Mysore Silk, Zoo Buggy Passes, and High Tea!
                  </div>
                ` : `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${vouchers.map(v => `
                      <div class="p-5 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-3 relative overflow-hidden">
                        <div class="flex justify-between items-start">
                          <div>
                            <span class="text-[10px] text-amber-400 font-bold uppercase">${v.partner}</span>
                            <h5 class="text-sm font-bold text-white mt-0.5">${v.title}</h5>
                          </div>
                          <span class="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            Active
                          </span>
                        </div>
                        
                        <!-- Voucher Code & Barcode -->
                        <div class="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800">
                          <div>
                            <span class="text-[10px] text-slate-500 block">VOUCHER CODE</span>
                            <span class="font-mono text-sm font-bold text-amber-400 tracking-wider">${v.voucherCode}</span>
                          </div>
                          <div class="text-right">
                            <span class="text-[10px] text-slate-500 block">EXPIRES</span>
                            <span class="text-xs text-slate-300">${v.expiresDate}</span>
                          </div>
                        </div>

                        <p class="text-[11px] text-slate-400">Present this digital code or barcode at billing counter to claim your discount.</p>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

            </div>
          ` : ''}

          <!-- TAB 3: SAVED WISHLIST -->
          ${currentTab === 'wishlist' ? `
            <div>
              ${wishlistDestinations.length === 0 ? `
                <div class="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                  <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 class="text-base font-bold text-slate-300">Your Wishlist is Empty</h3>
                  <p class="text-xs text-slate-500 max-w-sm mx-auto">Click the heart icon on any destination or hotel in the Explore tab to save it here.</p>
                  <button id="dash-go-explore-btn" class="mt-2 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md">
                    Explore Mysuru Destinations
                  </button>
                </div>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  ${wishlistDestinations.map(d => `
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition">
                      <div class="relative h-44 overflow-hidden">
                        <img src="${d.image_url}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <span class="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-950/80 text-amber-300 border border-amber-500/30">
                          ${d.category}
                        </span>
                      </div>
                      <div class="p-4 space-y-2">
                        <h4 class="text-sm font-bold text-white">${d.name}</h4>
                        <p class="text-xs text-slate-400 line-clamp-2">${d.description}</p>
                        <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                          <span class="flex items-center gap-1 text-emerald-400">
                            <span>📍</span>
                            <span>${d.latitude}°N, ${d.longitude}°E</span>
                          </span>
                          <span class="text-slate-500">${d.distance}</span>
                        </div>
                      </div>
                      <div class="p-4 pt-0 space-y-2">
                        <a 
                          href="${geoService.getGoogleMapsDirectionsUrl(d)}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                        >
                          <svg class="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>📍 Live Directions (Google Maps ↗)</span>
                        </a>
                        <div class="flex gap-2">
                          <button class="remove-wishlist-btn flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition" data-id="${d.id}">
                            Remove
                          </button>
                          <button class="view-dest-btn flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition" data-name="${d.name}">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 4: PREFERENCES & ACCESSIBILITY -->
          ${currentTab === 'settings' ? `
            <div class="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 class="text-lg font-bold text-white border-b border-slate-800 pb-3">Traveler Preferences & Accessibility</h3>
              
              <form id="dash-settings-form" class="space-y-5">
                
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Customer Display Name</label>
                  <input type="text" id="pref-name" value="${user.name}" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Contact Phone Number</label>
                  <input type="text" id="pref-phone" value="${user.phone || ''}" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Language</label>
                  <select id="pref-lang" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                    <option value="English" ${user.preferredLanguage === 'English' ? 'selected' : ''}>English (International)</option>
                    <option value="Kannada" ${user.preferredLanguage === 'Kannada' ? 'selected' : ''}>ಕನ್ನಡ (Kannada - State Language)</option>
                    <option value="Hindi" ${user.preferredLanguage === 'Hindi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
                  </select>
                </div>

                <div class="pt-2 space-y-3">
                  <label class="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                    <div>
                      <span class="text-xs font-bold text-slate-200 block">♿ Enable Senior / Wheelchair Mode by Default</span>
                      <span class="text-[11px] text-slate-500">Auto-filter destinations with ramps, battery buggies & step-free access</span>
                    </div>
                    <input type="checkbox" id="pref-senior" ${user.seniorModeDefault ? 'checked' : ''} class="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 bg-slate-800 border-slate-700" />
                  </label>

                  <label class="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                    <div>
                      <span class="text-xs font-bold text-slate-200 block">🌧️ Smart Monsoon & Weather Advisory Alerts</span>
                      <span class="text-[11px] text-slate-500">Notify during heavy rain with covered indoor itinerary recommendations</span>
                    </div>
                    <input type="checkbox" id="pref-weather" ${user.weatherAlerts ? 'checked' : ''} class="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 bg-slate-800 border-slate-700" />
                  </label>
                </div>

                <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition">
                  Save Preferences
                </button>

              </form>

            </div>
          ` : ''}

        </div>

      </div>
    `;

    bindDashboardEvents();
  }

  function bindDashboardEvents() {
    // Sub-tab switcher
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.getAttribute('data-tab');
        updateDashboardView();
      });
    });

    // Logout
    const logoutBtn = document.getElementById('dash-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authService.logout();
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'explore' } }));
      });
    }

    // Quick booking trigger
    const bookNowBtn = document.getElementById('dash-book-now-btn');
    if (bookNowBtn) {
      bookNowBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'hotels' } }));
      });
    }

    // Explore hotels button in empty state
    const expHotelsBtn = document.getElementById('dash-explore-hotels-btn');
    if (expHotelsBtn) {
      expHotelsBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'hotels' } }));
      });
    }

    // Redeem vouchers button
    const redeemBtn = document.getElementById('dash-redeem-vouchers-btn');
    if (redeemBtn) {
      redeemBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'eco' } }));
      });
    }

    // Explore button in empty wishlist
    const goExpBtn = document.getElementById('dash-go-explore-btn');
    if (goExpBtn) {
      goExpBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'explore' } }));
      });
    }

    // Print / Download Ticket Pass
    document.querySelectorAll('.print-ticket-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        alert(`🎟️ Digital Boarding Pass #${id} ready! In a full environment, this opens a print-ready PDF with high-resolution entry barcode.`);
      });
    });

    // Cancel Booking
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to cancel booking #${id}?`)) {
          authService.cancelBooking(id);
          updateDashboardView();
        }
      });
    });

    // Remove wishlist
    document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        authService.toggleWishlist(id);
        updateDashboardView();
      });
    });

    // Settings form
    const settingsForm = document.getElementById('dash-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('pref-name').value;
        const phone = document.getElementById('pref-phone').value;
        const lang = document.getElementById('pref-lang').value;
        const senior = document.getElementById('pref-senior').checked;
        const weather = document.getElementById('pref-weather').checked;

        authService.updateProfile({
          name: name,
          phone: phone,
          preferredLanguage: lang,
          seniorModeDefault: senior,
          weatherAlerts: weather
        });

        alert('✅ Preferences saved successfully!');
        updateDashboardView();
      });
    }
  }

  updateDashboardView();
}
