// Main Navigation Bar Component (Clean Single-Row Header)
import { authService } from '../services/authService.js';

export function renderNavbar(container, activeTab = 'explore') {
  const user = authService.getCurrentUser();
  let isMobileMenuOpen = false;
  let isProfileDropdownOpen = false;

  function updateView() {
    const ecoPoints = user ? (user.ecoPoints || 0) : 150;

    container.innerHTML = `
      <header class="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all shadow-2xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- SINGLE MAIN HEADER ROW -->
          <div class="flex items-center justify-between h-16 sm:h-20">
            
            <!-- LOGO & BRAND -->
            <div class="flex items-center space-x-3 cursor-pointer shrink-0" id="nav-brand-logo">
              <div class="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-500/10 border border-slate-700/60 p-1 flex items-center justify-center">
                <img src="./images/logo.png" alt="AtithiAI Logo" class="h-9 sm:h-11 w-auto object-contain rounded-xl" />
              </div>
              <div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">Atithi<span class="text-amber-400">AI</span></span>
                </div>
                <p class="text-[10px] text-slate-400 hidden sm:block">Wander wisely. Experience truly</p>
              </div>
            </div>

            <!-- DESKTOP NAV TABS (SINGLE ROW) -->
            <nav class="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mx-2">
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'explore' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="explore">
                🏛️ Explore
              </button>
              <button class="nav-tab-link px-3.5 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'packages' ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/30' : 'text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30'}" data-tab="packages">
                🎒 Packages
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-amber-300 hover:text-white hover:bg-slate-800/60'}" data-tab="dashboard">
                👑 Dashboard
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'senior' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="senior">
                ♿ Senior Mode
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'eco' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="eco">
                🌱 Eco-Rewards
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'travel' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="travel">
                ⚡ Transit
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'hotels' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="hotels">
                🏨 Hotels
              </button>
              <button class="nav-tab-link px-3 py-2 text-xs font-semibold rounded-xl transition ${activeTab === 'ar' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}" data-tab="ar">
                📷 AR Guide
              </button>
            </nav>

            <!-- RIGHT ACTIONS (ECO WALLET + AUTH / PROFILE) -->
            <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              <!-- Eco Points Indicator -->
              <button id="nav-eco-pill" class="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-xs text-slate-200 transition shadow-inner">
                <span class="text-amber-400">🌱</span>
                <span class="font-mono font-bold text-amber-300">${ecoPoints}</span>
                <span class="text-[10px] text-slate-400 hidden sm:inline">pts</span>
              </button>

              <!-- AUTH / DASHBOARD BUTTON -->
              ${user ? `
                <div class="relative">
                  <button id="nav-profile-menu-btn" class="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500/20 to-slate-900 border border-amber-500/40 rounded-2xl hover:border-amber-400 transition shadow-md">
                    <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-amber-400" />
                    <div class="text-left hidden sm:block">
                      <span class="text-xs font-bold text-white block leading-tight">${user.name.split(' ')[0]}</span>
                      <span class="text-[9px] text-amber-400 block leading-tight">👑 Dashboard</span>
                    </div>
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <!-- Profile Dropdown Menu -->
                  ${isProfileDropdownOpen ? `
                    <div class="absolute right-0 mt-2 w-64 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-scaleUp">
                      
                      <div class="p-3 border-b border-slate-800">
                        <p class="text-xs font-bold text-white">${user.name}</p>
                        <p class="text-[11px] text-slate-400 truncate">${user.email}</p>
                        <span class="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          👑 ${user.memberTier || 'Royal Member'}
                        </span>
                      </div>

                      <div class="py-1 text-xs">
                        <button class="nav-dropdown-item w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2" data-nav="dashboard" data-subtab="bookings">
                          <span>🎟️</span>
                          <span>My Bookings & Passes</span>
                          <span class="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">${(user.bookings || []).length}</span>
                        </button>
                        <button class="nav-dropdown-item w-full text-left px-3 py-2 text-blue-300 hover:bg-slate-800 rounded-xl transition flex items-center gap-2 font-bold" data-nav="packages">
                          <span>🎒</span>
                          <span>Browse Holiday Packages</span>
                        </button>
                        <button class="nav-dropdown-item w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2" data-nav="dashboard" data-subtab="wallet">
                          <span>🌱</span>
                          <span>Eco-Rewards Wallet</span>
                        </button>
                        <button class="nav-dropdown-item w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2" data-nav="dashboard" data-subtab="wishlist">
                          <span>❤️</span>
                          <span>Saved Wishlist</span>
                        </button>
                        <button class="nav-dropdown-item w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2" data-nav="dashboard" data-subtab="settings">
                          <span>⚙️</span>
                          <span>Preferences & Settings</span>
                        </button>
                      </div>

                      <div class="pt-1 border-t border-slate-800">
                        <button id="nav-dropdown-logout" class="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/40 rounded-xl transition text-xs flex items-center gap-2">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  ` : ''}
                </div>
              ` : `
                <!-- Unauthenticated Sign In Button -->
                <button id="nav-signin-btn" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 transform active:scale-95">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </button>
              `}

              <!-- MOBILE HAMBURGER BUTTON -->
              <button id="nav-mobile-hamburger" class="md:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}" />
                </svg>
              </button>

            </div>

          </div>

        </div>

        <!-- MOBILE MENU DRAWER -->
        ${isMobileMenuOpen ? `
          <div class="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1 animate-fadeIn">
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'explore' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="explore">
              🏛️ Explore Destinations
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition ${activeTab === 'packages' ? 'bg-blue-600 text-white font-extrabold' : 'text-blue-300 bg-blue-950/40 border border-blue-500/30'}" data-tab="packages">
              🎒 Holiday Packages (Curated 2D to 5D)
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 bg-slate-900'}" data-tab="dashboard">
              👑 Customer Dashboard ${user ? `(${user.name.split(' ')[0]})` : ''}
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'senior' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="senior">
              ♿ Senior Mode
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'eco' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="eco">
              🌱 Eco-Rewards
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'travel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="travel">
              ⚡ Transit & Routes
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'hotels' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="hotels">
              🏨 Hotels & Stays
            </button>
            <button class="mobile-nav-link w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${activeTab === 'ar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}" data-tab="ar">
              📷 AR Monument Scanner
            </button>
          </div>
        ` : ''}

      </header>
    `;

    bindNavbarEvents();
  }

  function bindNavbarEvents() {
    // Brand click -> Explore
    const brand = document.getElementById('nav-brand-logo');
    if (brand) {
      brand.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'explore' } }));
      });
    }

    // Nav tabs
    document.querySelectorAll('.nav-tab-link, .mobile-nav-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        isMobileMenuOpen = false;
        if (tab === 'dashboard' && !authService.getCurrentUser()) {
          window.dispatchEvent(new CustomEvent('atithi:open_auth', {
            detail: { onSuccessRedirect: 'dashboard' }
          }));
          return;
        }
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab } }));
      });
    });

    // Eco pill -> Eco rewards
    const ecoPill = document.getElementById('nav-eco-pill');
    if (ecoPill) {
      ecoPill.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'eco' } }));
      });
    }

    // Sign in trigger
    const signInBtn = document.getElementById('nav-signin-btn');
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:open_auth'));
      });
    }

    // Profile menu toggle
    const profileBtn = document.getElementById('nav-profile-menu-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isProfileDropdownOpen = !isProfileDropdownOpen;
        updateView();
      });
    }

    // Dropdown items
    document.querySelectorAll('.nav-dropdown-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const navTab = btn.getAttribute('data-nav') || 'dashboard';
        const subtab = btn.getAttribute('data-subtab');
        isProfileDropdownOpen = false;
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: navTab, subtab } }));
      });
    });

    // Logout
    const logoutBtn = document.getElementById('nav-dropdown-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        isProfileDropdownOpen = false;
        authService.logout();
        window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'explore' } }));
      });
    }

    // Mobile hamburger toggle
    const hamburger = document.getElementById('nav-mobile-hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        updateView();
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (isProfileDropdownOpen && !e.target.closest('#nav-profile-menu-btn')) {
        isProfileDropdownOpen = false;
        updateView();
      }
    });
  }

  updateView();
}
