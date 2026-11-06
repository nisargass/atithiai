// AtithiAI Master Application Controller & Router
import { renderNavbar } from './components/navbar.js';
import { renderAuthModal } from './components/authModal.js';
import { renderCustomerDashboard } from './components/customerDashboard.js';
import { renderExploreTab } from './components/explore.js';
import { renderPackagesTab } from './components/packages.js';
import { renderSeniorModeTab } from './components/seniorMode.js';
import { renderEcoRewardsTab } from './components/ecoRewards.js';
import { renderTravelTransitTab } from './components/travelTransit.js';
import { renderHotelsTab } from './components/hotels.js';
import { renderARScannerTab } from './components/arScanner.js';
import { renderAIChatDrawer } from './components/aiChat.js';
import { renderBookingModal } from './components/bookingModal.js';
import { authService } from './services/authService.js';

class AtithiApp {
  constructor() {
    this.activeTab = 'explore'; // 'explore' | 'packages' | 'senior' | 'eco' | 'travel' | 'hotels' | 'ar' | 'dashboard'
    this.activeDashboardSubtab = 'bookings';
    this.hasPromptedInitialAuth = false;
    this.init();
  }

  init() {
    this.navbarContainer = document.getElementById('navbar-mount');
    this.mainContainer = document.getElementById('main-content-mount');
    this.modalContainer = document.getElementById('modal-mount');
    this.chatContainer = document.getElementById('chat-mount');

    this.bindGlobalEvents();
    this.render();

    // FEATURE 10: REAL AUTHENTICATION GATEWAY ON WEBSITE OPEN
    const currentUser = authService.getCurrentUser();
    if (!currentUser && !this.hasPromptedInitialAuth) {
      this.hasPromptedInitialAuth = true;
      setTimeout(() => {
        renderAuthModal(this.modalContainer, {
          onSuccess: (user) => {
            this.activeTab = 'dashboard';
            this.render();
          }
        });
      }, 350);
    }
  }

  bindGlobalEvents() {
    // Navigate Tab Event
    window.addEventListener('atithi:navigate_tab', (e) => {
      if (e.detail && e.detail.tab) {
        this.activeTab = e.detail.tab;
        if (e.detail.subtab) {
          this.activeDashboardSubtab = e.detail.subtab;
        }
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Open Auth Modal
    window.addEventListener('atithi:open_auth', (e) => {
      const redirect = e.detail && e.detail.onSuccessRedirect;
      renderAuthModal(this.modalContainer, {
        onSuccess: (user) => {
          if (redirect) {
            this.activeTab = redirect;
          }
          this.render();
        }
      });
    });

    // Open Booking Modal
    window.addEventListener('atithi:open_booking_modal', (e) => {
      if (e.detail && e.detail.hotel) {
        renderBookingModal(this.modalContainer, e.detail.hotel);
      }
    });

    // Auth State Changed
    window.addEventListener('atithi:auth_change', () => {
      this.render();
    });
  }

  render() {
    // 1. Render Navbar
    renderNavbar(this.navbarContainer, this.activeTab);

    // 2. Render Active Tab View
    switch (this.activeTab) {
      case 'dashboard':
        renderCustomerDashboard(this.mainContainer, this.activeDashboardSubtab);
        break;
      case 'packages':
        renderPackagesTab(this.mainContainer);
        break;
      case 'senior':
        renderSeniorModeTab(this.mainContainer);
        break;
      case 'eco':
        renderEcoRewardsTab(this.mainContainer);
        break;
      case 'travel':
        renderTravelTransitTab(this.mainContainer);
        break;
      case 'hotels':
        renderHotelsTab(this.mainContainer);
        break;
      case 'ar':
        renderARScannerTab(this.mainContainer);
        break;
      case 'explore':
      default:
        renderExploreTab(this.mainContainer);
        break;
    }

    // 3. Render AI Chat Drawer
    renderAIChatDrawer(this.chatContainer);
  }
}

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AtithiApp();
});
