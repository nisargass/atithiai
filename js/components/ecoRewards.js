// Eco Rewards, Partner Vouchers & Community Discovery Verification Program
import { ECO_VOUCHERS } from '../data/vouchers.js';
import { authService } from '../services/authService.js';

export function renderEcoRewardsTab(container) {
  let isSubmitModalOpen = false;
  let submissionCategory = 'New Hidden Gem';

  function updateView() {
    const user = authService.getCurrentUser();
    const ecoPoints = user ? (user.ecoPoints || 0) : 150;
    const submissions = user ? (user.discoverySubmissions || []) : [];
    const ecoLedger = user ? (user.ecoLedger || []) : [];

    container.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- ECO BANNER -->
        <div class="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0">
                🌱
              </div>
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Sustainable Tourism Initiative
                  </span>
                  <span class="text-xs text-slate-400">Mysuru Green Mobility</span>
                </div>
                <h2 class="text-2xl font-serif font-bold text-white">Mysuru Eco-Points & Rewards</h2>
                <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Earn points by submitting verified 5km GPS reviews (<strong class="text-white">+15 Pts for Hidden/Rare Gems</strong>, <strong class="text-white">+10 Pts for Popular landmarks</strong>), booking certified eco/heritage hotels (<strong class="text-white">+15 Pts</strong> budget/mid-range, <strong class="text-white">+20 Pts</strong> premium), booking curated packages (<strong class="text-white">+50 to +100 Pts</strong>), and contributing verified community spots (+5 Pts).
                </p>
              </div>
            </div>

            <!-- Points Wallet -->
            <div class="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl text-center min-w-[200px] shrink-0">
              <span class="text-xs text-slate-400 block">Available Eco-Balance</span>
              <div class="flex items-baseline justify-center space-x-1.5 mt-1">
                <span class="text-3xl font-bold font-mono text-amber-400">${ecoPoints}</span>
                <span class="text-xs text-amber-300 font-bold">Points</span>
              </div>
              ${!user ? `
                <button id="eco-login-prompt-btn" class="mt-2 text-[11px] text-amber-400 underline hover:text-amber-300 block w-full">
                  Sign In to save rewards
                </button>
              ` : `
                <span class="text-[10px] text-emerald-400 mt-1 block">✓ Synced to Customer Profile</span>
              `}
            </div>

          </div>
        </div>

        <!-- FEATURE 3: COMMUNITY ECO-DISCOVERY VERIFICATION PROGRAM -->
        <div class="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div class="space-y-1 max-w-2xl">
              <div class="flex items-center space-x-2">
                <span class="text-lg">🌿</span>
                <h3 class="text-lg font-bold text-white">Eco Discovery Verification Program</h3>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +5 Eco Points / Verified Discovery
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Users can contribute new cultural and sustainable discoveries to AtithiAI. Submitted discoveries are reviewed and verified by the AtithiAI team before Eco Points are awarded. (This contribution and verification mechanism is designed to be expanded operationally over future development iterations).
              </p>
            </div>
            
            <button id="open-submit-discovery-btn" class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 shrink-0">
              <span>+ Submit New Discovery</span>
            </button>
          </div>

          <!-- SUBMISSION CATEGORY INFO CARDS -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span class="text-base">💎</span>
              <h5 class="font-bold text-white text-[11px]">1. New Hidden Gem</h5>
              <p class="text-[10px] text-slate-400">Off-beat temples, quiet lakes & sacred groves.</p>
            </div>
            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span class="text-base">🚆</span>
              <h5 class="font-bold text-white text-[11px]">2. Low-Carbon Transit</h5>
              <p class="text-[10px] text-slate-400">EV routes, bicycle trails & heritage rail paths.</p>
            </div>
            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span class="text-base">🧵</span>
              <h5 class="font-bold text-white text-[11px]">3. Heritage Weaver</h5>
              <p class="text-[10px] text-slate-400">Traditional handlooms & natural dye artisans.</p>
            </div>
            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span class="text-base">🏡</span>
              <h5 class="font-bold text-white text-[11px]">4. Green Stay</h5>
              <p class="text-[10px] text-slate-400">Zero-waste homestays & solar eco-resorts.</p>
            </div>
          </div>

          <!-- USER SUBMISSIONS TRACKER -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Your Submitted Discoveries (${submissions.length})</span>
              <span class="text-[11px] text-slate-500 font-normal lowercase">review status & verification ledger</span>
            </h4>

            ${submissions.length === 0 ? `
              <div class="p-5 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
                You haven't submitted any discoveries yet. Click "+ Submit New Discovery" to share an eco spot!
              </div>
            ` : `
              <div class="space-y-3">
                ${submissions.map(s => {
                  const isPending = s.status === 'Pending Verification';
                  const isVerified = s.status === 'Verified';
                  const isRejected = s.status === 'Rejected';

                  return `
                    <div class="p-4 bg-slate-950 rounded-2xl border ${isVerified ? 'border-emerald-500/30' : isRejected ? 'border-rose-500/30' : 'border-amber-500/30'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div class="space-y-1 max-w-xl">
                        <div class="flex items-center space-x-2">
                          <span class="font-bold text-white text-sm">${s.title}</span>
                          <span class="px-2 py-0.5 text-[9px] font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            ${s.category}
                          </span>
                        </div>
                        <p class="text-[11px] text-slate-400">${s.description}</p>
                        <p class="text-[10px] text-slate-500">📍 ${s.location} • Submitted on ${new Date(s.submittedAt).toLocaleDateString()}</p>
                      </div>

                      <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span class="px-2.5 py-1 text-[11px] font-bold rounded-xl border ${
                          isVerified 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-mono' 
                            : isRejected 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }">
                          ${isVerified ? '✓ Verified (+5 Pts Credited)' : isRejected ? '✗ Rejected (0 Pts)' : '⏳ Pending Verification (0 Pts)'}
                        </span>

                        <!-- PROTOTYPE / DEMO VERIFICATION ACTIONS -->
                        ${isPending ? `
                          <div class="flex items-center gap-1">
                            <button class="verify-action-btn px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-lg shadow transition" data-id="${s.id}" data-action="approve" title="Simulate AtithiAI Team Review -> Approve (+5 Eco-Points)">
                              ✓ Approve (Demo)
                            </button>
                            <button class="verify-action-btn px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-rose-300 text-[10px] rounded-lg border border-slate-700 transition" data-id="${s.id}" data-action="reject" title="Simulate AtithiAI Team Review -> Reject">
                              ✗ Reject
                            </button>
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

        </div>

        <!-- REDEEMABLE VOUCHERS -->
        <div>
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎁 Available Partner Vouchers</span>
            <span class="text-xs text-slate-500 font-normal">(Instant digital voucher upon claim)</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            ${ECO_VOUCHERS.map(v => {
              const canAfford = ecoPoints >= v.cost;
              return `
                <div class="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition space-y-4">
                  <div class="space-y-2">
                    <div class="flex justify-between items-start">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ${v.cost} PTS
                      </span>
                      <span class="text-[10px] text-slate-500">${v.category}</span>
                    </div>
                    <h4 class="text-sm font-bold text-white">${v.title}</h4>
                    <p class="text-[11px] text-slate-400">${v.desc}</p>
                    <p class="text-[10px] text-slate-500 font-medium">Partner: ${v.partner}</p>
                  </div>

                  <button 
                    class="claim-voucher-btn w-full py-2.5 text-xs font-bold rounded-xl transition ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}" 
                    data-id="${v.id}"
                    ${!canAfford ? 'disabled' : ''}
                  >
                    ${canAfford ? 'Redeem Voucher →' : `Need ${v.cost - ecoPoints} More Pts`}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ECO TRANSACTION LEDGER HISTORY -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>📜 Eco-Wallet Activity Ledger</span>
            <span class="text-xs text-slate-500 font-normal font-mono">Immutable audit history</span>
          </h3>

          ${ecoLedger.length === 0 ? `
            <div class="p-4 text-center bg-slate-950 rounded-2xl text-xs text-slate-500">
              No transactions recorded yet. Discover a Hidden Gem to earn your first +10 Eco Points!
            </div>
          ` : `
            <div class="divide-y divide-slate-800 text-xs">
              ${ecoLedger.slice(0, 8).map(txn => {
                const isCredit = txn.points > 0;
                return `
                  <div class="py-2.5 flex items-center justify-between">
                    <div class="space-y-0.5">
                      <p class="font-semibold text-slate-200">${txn.title}</p>
                      <p class="text-[10px] text-slate-500">${new Date(txn.timestamp).toLocaleString()}</p>
                    </div>
                    <span class="font-mono font-bold text-xs ${isCredit ? 'text-emerald-400' : 'text-rose-400'}">
                      ${isCredit ? `+${txn.points}` : txn.points} pts
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

      </div>

      <!-- SUBMISSION MODAL -->
      ${isSubmitModalOpen ? `
        <div id="submit-discovery-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div class="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-slate-100">
            
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center space-x-2.5">
                <span class="text-xl">🌿</span>
                <div>
                  <h3 class="text-base font-bold text-white">Contribute Sustainable Discovery</h3>
                  <p class="text-[11px] text-slate-400">Reviewed & verified by the AtithiAI team for +5 Eco-Points.</p>
                </div>
              </div>
              <button id="close-submit-modal-btn" class="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">✕</button>
            </div>

            <form id="submit-discovery-form" class="space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Discovery Category</label>
                <select id="disc-cat" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500">
                  <option value="New Hidden Gem">💎 1. New Hidden Gem (Off-beat cultural or natural spot)</option>
                  <option value="New Low-Carbon Rail Transit">🚆 2. New Low-Carbon Rail Transit (Clean mobility route)</option>
                  <option value="New Heritage Weaver">🧵 3. New Heritage Weaver (Handloom artisan / Khadi unit)</option>
                  <option value="New Green Hotel/Homestay">🏡 4. New Green Hotel/Homestay (Certified eco-stay)</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">Discovery Title / Attraction Name</label>
                <input type="text" id="disc-title" required placeholder="e.g. Mahadevapura Bamboo Forest Weaving Hut" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">Location / Coordinates / Village</label>
                <input type="text" id="disc-loc" required placeholder="e.g. Srirangapatna Taluk, 18km from Mysuru" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>

              <div>
                <label class="block font-semibold text-slate-300 mb-1">Sustainability & Cultural Value Description</label>
                <textarea id="disc-desc" required rows="3" placeholder="Describe the ecological features, heritage craftsmanship, or public access notes..." class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"></textarea>
              </div>

              <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                ⚠️ <strong>Verification Notice:</strong> Submissions are initially tagged <em>"Pending Verification"</em>. <strong>5 Eco Points</strong> will be credited to your wallet once verified by the team.
              </div>

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" id="cancel-submit-modal-btn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md">Submit for Verification</button>
              </div>
            </form>

          </div>
        </div>
      ` : ''}
    `;

    bindEcoEvents();
  }

  function bindEcoEvents() {
    const loginPrompt = document.getElementById('eco-login-prompt-btn');
    if (loginPrompt) {
      loginPrompt.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('atithi:open_auth'));
      });
    }

    // Claim vouchers
    document.querySelectorAll('.claim-voucher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const voucher = ECO_VOUCHERS.find(v => v.id === id);
        if (!voucher) return;

        const user = authService.getCurrentUser();
        if (!user) {
          window.dispatchEvent(new CustomEvent('atithi:open_auth'));
          return;
        }

        const res = authService.claimVoucher(voucher);
        if (res.success) {
          alert(`🎉 Voucher "${voucher.title}" claimed successfully! It is now in your Customer Dashboard under "Claimed Vouchers".`);
          updateView();
        } else {
          alert(res.error);
        }
      });
    });

    // Open submit modal
    const openModalBtn = document.getElementById('open-submit-discovery-btn');
    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        const user = authService.getCurrentUser();
        if (!user) {
          window.dispatchEvent(new CustomEvent('atithi:open_auth'));
          return;
        }
        isSubmitModalOpen = true;
        updateView();
      });
    }

    // Close submit modal
    const closeModalBtn = document.getElementById('close-submit-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-submit-modal-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { isSubmitModalOpen = false; updateView(); });
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => { isSubmitModalOpen = false; updateView(); });

    // Submit form
    const submitForm = document.getElementById('submit-discovery-form');
    if (submitForm) {
      submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('disc-cat').value;
        const title = document.getElementById('disc-title').value;
        const loc = document.getElementById('disc-loc').value;
        const desc = document.getElementById('disc-desc').value;

        const res = authService.submitCommunityDiscovery({
          category: cat,
          title: title,
          location: loc,
          description: desc
        });

        if (res.success) {
          isSubmitModalOpen = false;
          alert(`✅ Discovery "${title}" submitted as "Pending Verification". The AtithiAI review team will inspect it for the +5 Eco-Points award!`);
          updateView();
        } else {
          alert(res.error);
        }
      });
    }

    // Prototype / Demo Verify Simulator action buttons
    document.querySelectorAll('.verify-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const isApproved = action === 'approve';

        const res = authService.verifyDiscoverySubmission(id, isApproved);
        if (res.success) {
          if (isApproved) {
            alert(`🎉 Verification Approved! +5 Eco-Points credited to your wallet.`);
          } else {
            alert(`Discovery submission marked as Rejected.`);
          }
          updateView();
        } else {
          alert(res.error);
        }
      });
    });
  }

  updateView();
}
