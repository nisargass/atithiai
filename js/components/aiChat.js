// AI Concierge Chat Drawer Component
export function renderAIChatDrawer(container) {
  let isOpen = false;
  let messages = [
    { sender: 'bot', text: 'Namaskara! I am AtithiAI, your smart Mysuru heritage concierge. Ask me about palace lighting timings, senior-friendly darshans, rain-safe spots, or genuine Mysore Pak!', time: '10:00 AM' }
  ];

  function updateView() {
    container.innerHTML = `
      <!-- FLOATING CHAT BUTTON -->
      <button id="ai-chat-fab" class="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-2xl shadow-2xl shadow-amber-500/40 hover:scale-105 transition transform flex items-center gap-2.5 font-bold text-xs" title="Ask AtithiAI Concierge">
        <span class="text-xl">🤖</span>
        <span class="hidden sm:inline">Ask AI Guide</span>
      </button>

      <!-- CHAT MODAL / DRAWER -->
      ${isOpen ? `
        <div class="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[92vw] sm:w-96 z-50 bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl shadow-slate-950/80 flex flex-col h-[520px] overflow-hidden animate-scaleUp text-slate-100">
          
          <!-- Chat Header -->
          <div class="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base">
                🤖
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">AtithiAI Concierge</h4>
                <span class="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online • Mysuru Travel Assistant
                </span>
              </div>
            </div>
            <button id="ai-chat-close-btn" class="text-slate-400 hover:text-white p-1 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Messages Scroll Area -->
          <div id="ai-messages-list" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            ${messages.map(m => `
              <div class="flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[82%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'} space-y-1">
                  <p class="leading-relaxed">${m.text}</p>
                  <span class="text-[9px] ${m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'} block text-right">${m.time}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            ${[
              "When are Palace lights on?",
              "Best indoor spots for rain?",
              "Where to find original Mysore Pak?",
              "Is Mysore Palace senior accessible?"
            ].map(q => `
              <button class="ai-chip-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] whitespace-nowrap transition" data-q="${q}">
                ${q}
              </button>
            `).join('')}
          </div>

          <!-- Input Footer -->
          <form id="ai-chat-form" class="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input 
              type="text" 
              id="ai-chat-input" 
              placeholder="Ask about Mysuru history, timings, dosas..." 
              class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              autocomplete="off"
            />
            <button type="submit" class="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

        </div>
      ` : ''}
    `;

    bindChatEvents();
  }

  function handleSend(userQuery) {
    if (!userQuery.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.push({ sender: 'user', text: userQuery, time: nowTime });
    updateView();

    // Scroll to bottom
    setTimeout(() => {
      const el = document.getElementById('ai-messages-list');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);

    // AI Bot Response logic
    setTimeout(() => {
      let botAnswer = "Mysuru has magnificent royal heritage and vibrant cuisine! Let me know if you need specific opening hours or route planning.";
      const q = userQuery.toLowerCase();

      if (q.includes("light") || q.includes("illumination")) {
        botAnswer = "✨ Mysore Palace illumination takes place on Sundays, National Holidays, and during state festivals from 7:00 PM to 7:45 PM. During Dasara, it is illuminated daily with 100,000 bulbs!";
      } else if (q.includes("rain") || q.includes("indoor")) {
        botAnswer = "🌧️ For rainy weather in Mysuru, visit Jaganmohan Palace Art Gallery, Railway Museum indoor galleries, Devaraja Market, or explore the covered halls of Amba Vilas Palace.";
      } else if (q.includes("pak") || q.includes("sweet")) {
        botAnswer = "🧈 The original Mysore Pak was invented by royal chef Kakasura Madappa in 1935. Visit 'Guru Sweet Mart' on Sayyaji Rao Road for the authentic melt-in-mouth original version!";
      } else if (q.includes("senior") || q.includes("accessible") || q.includes("wheelchair")) {
        botAnswer = "♿ Mysore Palace, Mysuru Zoo, and Jaganmohan Gallery provide wheelchair ramps, step-free access, and battery buggies. Free buggy transport is available for seniors at the Zoo!";
      } else if (q.includes("hotel") || q.includes("stay")) {
        botAnswer = "🏨 For a royal experience, check out Lalitha Mahal Palace Hotel. For eco-conscious travelers, The Green Hotel offers zero-plastic organic dining.";
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      messages.push({ sender: 'bot', text: botAnswer, time: botTime });
      updateView();

      setTimeout(() => {
        const el = document.getElementById('ai-messages-list');
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    }, 450);
  }

  function bindChatEvents() {
    const fab = document.getElementById('ai-chat-fab');
    const closeBtn = document.getElementById('ai-chat-close-btn');
    if (fab) {
      fab.addEventListener('click', () => {
        isOpen = !isOpen;
        updateView();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isOpen = false;
        updateView();
      });
    }

    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-chat-input');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input) {
          handleSend(input.value);
          input.value = '';
        }
      });
    }

    document.querySelectorAll('.ai-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-q');
        handleSend(q);
      });
    });

    window.addEventListener('atithi:ask_ai', (e) => {
      isOpen = true;
      updateView();
      if (e.detail && e.detail.query) {
        handleSend(e.detail.query);
      }
    });
  }

  updateView();
}
