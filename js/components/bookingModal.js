// Hotel / Stay Reservation Modal
import { authService } from '../services/authService.js';

export function renderBookingModal(container, hotel) {
  const user = authService.getCurrentUser();
  let checkIn = new Date().toISOString().split('T')[0];
  let checkOut = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  let guests = '2 Adults';
  let roomType = 'Deluxe Heritage Room';
  let name = user ? user.name : '';
  let email = user ? user.email : '';
  let phone = user ? user.phone : '';

  function closeModal() {
    container.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  function handleConfirmBooking(e) {
    e.preventDefault();
    if (!authService.getCurrentUser()) {
      alert('Please sign in or verify your email first to confirm reservations.');
      window.dispatchEvent(new CustomEvent('atithi:open_auth'));
      return;
    }

    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
    const totalCost = '₹' + (hotel.price_per_night * nights).toLocaleString();

    const bookingPayload = {
      hotelName: hotel.name,
      category: 'Heritage Stay',
      location: hotel.location,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      roomType: roomType,
      totalCost: totalCost,
      ecoPointsEarned: hotel.eco_points * nights,
      image: hotel.image_url
    };

    authService.addBooking(bookingPayload);
    closeModal();
    alert(`🎉 Booking Confirmed at ${hotel.name}! Your digital QR ticket has been added to your Customer Dashboard.`);
    window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
  }

  document.body.style.overflow = 'hidden';
  container.innerHTML = `
    <div id="booking-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div class="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 animate-scaleUp">
        
        <button id="booking-close-btn" class="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="space-y-1 mb-5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            Instant Confirmation
          </span>
          <h3 class="text-xl font-serif font-bold text-white">${hotel.name}</h3>
          <p class="text-xs text-slate-400">${hotel.location}</p>
        </div>

        <form id="hotel-booking-form" class="space-y-4 text-xs">
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Check-in Date</label>
              <input type="date" id="book-checkin" value="${checkIn}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Check-out Date</label>
              <input type="date" id="book-checkout" value="${checkOut}" required class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Guests</label>
              <select id="book-guests" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500">
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults" selected>2 Adults</option>
                <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                <option value="Family Suite (4 Pax)">Family Suite (4 Pax)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Room Category</label>
              <select id="book-room" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500">
                <option value="Deluxe Heritage Room">Deluxe Heritage Room</option>
                <option value="Royal Garden Suite">Royal Garden Suite</option>
                <option value="Maharaja Luxury Suite">Maharaja Luxury Suite</option>
              </select>
            </div>
          </div>

          <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-slate-400 block text-[11px]">Tariff per night:</span>
              <span class="text-base font-bold font-mono text-amber-400">₹${hotel.price_per_night}</span>
            </div>
            <div class="text-right">
              <span class="text-emerald-400 block font-bold text-[11px]">🌱 Eco-Bonus:</span>
              <span class="font-mono text-xs text-emerald-300 font-bold">+${hotel.eco_points} Points credited</span>
            </div>
          </div>

          <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition">
            Confirm Reservation & Issue Digital Pass
          </button>

        </form>

      </div>
    </div>
  `;

  document.getElementById('booking-close-btn').addEventListener('click', closeModal);
  document.getElementById('booking-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'booking-modal-backdrop') closeModal();
  });
  document.getElementById('hotel-booking-form').addEventListener('submit', handleConfirmBooking);
}
