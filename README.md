# AtithiAI 2.0 — Mysuru Smart Tourism & Sustainable Mobility Platform

A modern, accessible, gamified smart tourism platform for Mysuru and the surrounding 70km heritage circuit.

---

## Key Features in AtithiAI 2.0

### 1. 💎 Gamified Eco-Rewards (Strictly for Hidden & Rare Gems)
- **10 Eco-Points**: Awarded strictly for discovering verified **Hidden Gems** and **Rare Gems** (e.g. Mahadevapura Bamboo Forest, Hadinaru Lake, Varuna Lake, Melukote Cheluvanarayana Swamy Temple).
- **0 Points**: Awarded for popular landmarks (e.g. Mysore Palace, Chamundi Hills) to promote sustainable distribution of tourist footfall.
- **Duplicate Prevention & Immutable Ledger**: Prevents duplicate point claims and records every reward in the customer's `ecoLedger`.

### 2. ♿ Senior Mode Grounded in Verified Physical Accessibility
- **3 Real-World Accessibility Tiers**:
  1. 🟢 **Recommended for Seniors & Limited Mobility**: Step-free access, wheelchair elevators, battery buggy fleets, resting gazebos, accessible toilets (e.g. Mysuru Zoo, Mysore Palace, Jaganmohan Palace, Rail Museum).
  2. 🟡 **Suitable With Assistance**: Companion recommended, minor step negotiation, direct vehicle drop close to entrance (e.g. Srirangapatna, Somnathpura Chennakesava, Nanjangud).
  3. 🔴 **Not Recommended for Limited Mobility**: Substantial stairs (100–1,008 steps), steep inclines, uneven boulder terrain, shifting sand dunes (e.g. Chamundi Hills 1,008 stone steps walking route, Shivanasamudra gorge, Talakadu sand dunes, Melukote Yoga Narasimha 350+ hill steps).
- Includes step counts, walking intensity, and authoritative verification sources (KSTDC, Zoo Authority, ASI).

### 3. 🌿 Eco Discovery Verification Program
- Community contribution portal for 4 sustainable categories:
  1. *New Hidden Gem*
  2. *New Low-Carbon Rail Transit*
  3. *New Heritage Weaver*
  4. *New Green Hotel/Homestay*
- Submissions are initially saved as `⏳ Pending Verification` (0 pts). Once reviewed and verified by the AtithiAI team, **+5 Eco Points** are credited to the wallet.
- Includes a live prototype verification simulator for demo and administrative reviews.

### 4. ⚡ Time-Based Dynamic Weather Replanner & Live User Reporting
- Retains daily chronological itinerary structure (`09:00 AM`, `11:30 AM`, `01:00 PM`, `04:00 PM`, `06:30 PM`, `08:30 PM`).
- **Live Travel Trouble / Weather Report Box**: Accepts real-time visitor alerts (e.g. *"there is heavy rain near zoo"* or *"sudden downpour at brindavan gardens"*).
- **Intelligent Place Swapping**: Automatically swaps outdoor affected spots with weather-safe covered indoor attractions (e.g. Jaganmohan Palace Art Gallery) and reschedules outdoor visits to the next morning dry slot.
- Prominently displays the **Live Travel Advisory Update** and a visual timeline before/after comparison.

### 5. 📷 AR Facade Scanner & Multilingual Audio Guide
- **Real Camera Feed**: Integrates `navigator.mediaDevices.getUserMedia()` for environment rear camera scanning with reticle HUD overlay and track cleanup on unmount.
- **High-Resolution Fallback**: Seamless fallback mode if camera permissions are unavailable.
- **Trilingual Audio Guide**: Authentic narration scripts in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)** with speech synthesis matching (`en-IN`, `kn-IN`, `hi-IN`).

### 6. 🔐 Customer Authentication Gateway & Security
- **Dual Authentication Paths**:
  - **Option A**: Email + Password with PBKDF2 hashing (`hashlib.pbkdf2_hmac`, 100,000 iterations), salt, and 64-char session tokens.
  - **Option B**: Mobile Number / Email + 6-Digit OTP verification.
- **Auto-Prompt Gateway**: Automatically prompts unauthenticated visitors on opening while restoring existing sessions for returning users.
- **Data Persistence**: Preserves customer bookings with scannable QR entry passes, claimed vouchers, wishlist items, and eco-wallet transactions.

---

## Project Structure

```
├── index.html                  # Main application shell
├── serve.py                    # Threaded Python server with PBKDF2 auth & OTP endpoints
├── config.json                 # SMTP and SMS provider configurations
├── users_auth.json             # Secure hashed credentials database
├── netlify.toml                # Netlify SPA routing rules
├── css/
│   └── custom.css              # Custom styling and animations
└── js/
    ├── app.js                  # Master application router & gateway orchestrator
    ├── services/
    │   └── authService.js      # User state, discovery rewards, and session manager
    ├── data/
    │   ├── destinations.js     # 30 Curated destinations with rich accessibility metadata
    │   ├── arLandmarks.js      # AR landmarks with authentic trilingual narrations
    │   ├── transit.js          # Green transit & EV mobility options
    │   ├── vouchers.js         # Redeemable partner vouchers
    │   └── hotels.js           # Heritage hotels & eco stays
    └── components/
        ├── navbar.js           # Responsive navigation header
        ├── explore.js          # Gamified destination circuit & hidden gem discovery
        ├── seniorMode.js       # 3-Tier accessibility & senior mobility guide
        ├── ecoRewards.js       # Eco-wallet, partner vouchers & community discovery
        ├── travelTransit.js    # Time-based replanner & live trouble reporting
        ├── arScanner.js        # Camera scanner & multilingual speech guide
        ├── authModal.js        # Unified Authentication Gateway modal
        ├── customerDashboard.js# Customer tickets, QR passes & saved preferences
        ├── hotels.js           # Hotel booking list & filters
        ├── bookingModal.js     # Heritage booking checkout modal
        └── aiChat.js           # 24/7 AI Heritage Concierge
```

---

## How to Run Locally

1. Open PowerShell / Terminal in this project directory:
   ```bash
   cd C:\Users\DELL\.gemini\antigravity\scratch\atithiai-mysuru-tourism
   ```
2. Launch the backend server:
   ```bash
   python serve.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Default Demo Credentials (PBKDF2 Verified):
- **Royal Member**: `ananya.rao@gmail.com` | Password: `Mysuru@2026`
- **Green Explorer**: `tourist.mysuru@gmail.com` | Password: `Mysuru@2026`
