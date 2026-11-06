// Customer Authentication Gateway (Email+Password PBKDF2 & 6-Digit OTP Verification)
import { authService } from '../services/authService.js';

export function renderAuthModal(container, options = {}) {
  let authMode = 'password'; // 'password' | 'otp'
  let passwordTab = 'login'; // 'login' | 'register'
  
  // Form fields
  let email = '';
  let password = '';
  let name = '';
  let phone = '';
  
  // OTP state
  let otpStep = 'target'; // 'target' | 'verify'
  let otpTarget = '';
  let otpValues = ['', '', '', '', '', ''];
  let timerSeconds = 60;
  let timerInterval = null;
  let serverResponse = null;
  
  let errorMessage = '';
  let successMessage = '';
  let isLoading = false;

  function closeModal() {
    if (timerInterval) clearInterval(timerInterval);
    container.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSeconds = 60;
    timerInterval = setInterval(() => {
      timerSeconds--;
      const timerEl = document.getElementById('auth-timer-count');
      const resendBtn = document.getElementById('auth-resend-btn');
      if (timerEl) timerEl.textContent = `${timerSeconds}s`;
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.classList.remove('opacity-40', 'cursor-not-allowed');
          resendBtn.classList.add('text-amber-400', 'hover:text-amber-300');
        }
      }
    }, 1000);
  }

  // Handle Email + Password Login
  async function handlePasswordLogin(loginEmail, loginPwd) {
    errorMessage = '';
    successMessage = '';
    isLoading = true;
    updateView();

    const res = await authService.login(loginEmail, loginPwd);
    isLoading = false;

    if (res.success) {
      closeModal();
      window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
      if (options.onSuccess) options.onSuccess(res.user);
    } else {
      errorMessage = res.error || 'Authentication failed. Please check your credentials.';
      updateView();
    }
  }

  // Handle Email + Password Registration
  async function handlePasswordRegister(regEmail, regPwd, regName, regPhone) {
    errorMessage = '';
    successMessage = '';
    isLoading = true;
    updateView();

    const res = await authService.register(regEmail, regPwd, regName, regPhone);
    isLoading = false;

    if (res.success) {
      closeModal();
      window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
      if (options.onSuccess) options.onSuccess(res.user);
    } else {
      errorMessage = res.error || 'Registration failed.';
      updateView();
    }
  }

  // Handle Send OTP
  async function handleSendOtp(target) {
    errorMessage = '';
    successMessage = '';
    isLoading = true;
    updateView();

    const res = await authService.sendOtp(target);
    isLoading = false;

    if (res.success) {
      otpTarget = target;
      serverResponse = res;
      otpStep = 'verify';
      otpValues = ['', '', '', '', '', ''];
      updateView();
      startTimer();
    } else {
      errorMessage = res.error || 'Failed to send verification code.';
      updateView();
    }
  }

  // Handle Verify OTP
  async function handleVerifyOtp() {
    const fullCode = otpValues.join('');
    if (fullCode.length < 6) {
      errorMessage = 'Please enter all 6 digits of the verification code.';
      updateView();
      return;
    }

    isLoading = true;
    errorMessage = '';
    updateView();

    const res = await authService.verifyOtp(otpTarget, fullCode);
    isLoading = false;

    if (res.success) {
      closeModal();
      window.dispatchEvent(new CustomEvent('atithi:navigate_tab', { detail: { tab: 'dashboard', subtab: 'bookings' } }));
      if (options.onSuccess) options.onSuccess(res.user);
    } else {
      errorMessage = res.error || 'Incorrect verification code.';
      updateView();
    }
  }

  function updateView() {
    document.body.style.overflow = 'hidden';
    const currentCode = serverResponse ? (serverResponse.dev_code || '849201') : '849201';

    container.innerHTML = `
      <div id="auth-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
        <div class="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-slate-100 transform transition-all animate-scaleUp my-8">
          
          <!-- Close Button -->
          <button id="auth-close-btn" class="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Brand Header -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center p-1.5 rounded-2xl bg-white shadow-xl shadow-blue-500/10 border border-slate-700/60 mb-3">
              <img src="./images/logo.png" alt="AtithiAI Logo" class="h-12 w-auto object-contain rounded-xl" />
            </div>
            <h3 class="text-2xl font-serif font-bold text-white tracking-wide">
              Atithi<span class="text-amber-400">AI</span> Customer Gateway
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Wander wisely. Experience truly • Digital passes & eco-wallet
            </p>
          </div>

          <!-- AUTH PATH SWITCHER TABS -->
          <div class="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
            <button id="auth-tab-pwd" class="flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'password' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}">
              🔑 Option A: Email + Password
            </button>
            <button id="auth-tab-otp" class="flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'otp' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}">
              📱 Option B: Mobile / OTP
            </button>
          </div>

          <!-- Error Alert -->
          ${errorMessage ? `
            <div class="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-shake">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          <!-- OPTION A: EMAIL + PASSWORD (LOGIN & SIGN UP) -->
          ${authMode === 'password' ? `
            <div class="space-y-4">
              
              <!-- Sub-tab for Login vs Register -->
              <div class="flex items-center justify-center space-x-4 border-b border-slate-800 pb-3 text-xs">
                <button id="pwd-tab-login" class="font-bold transition pb-1 ${passwordTab === 'login' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}">
                  Sign In (Existing User)
                </button>
                <button id="pwd-tab-reg" class="font-bold transition pb-1 ${passwordTab === 'register' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}">
                  Create New Account (Register)
                </button>
              </div>

              ${passwordTab === 'login' ? `
                <!-- LOGIN FORM -->
                <form id="auth-pwd-login-form" class="space-y-3.5 text-xs">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="login-email-input" 
                      required 
                      placeholder="your.name@gmail.com" 
                      value="${email}"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Password</label>
                    <input 
                      type="password" 
                      id="login-pwd-input" 
                      required 
                      placeholder="••••••••" 
                      value="${password}"
                      class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <!-- Quick Demo Autofill Option -->
                  <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1.5">
                    <span class="text-[11px] text-slate-400 font-medium block">⚡ Instant 1-Click Evaluation Logins (PBKDF2 Verified):</span>
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="demo-acc-pill px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 rounded-lg transition" data-email="ananya.rao@gmail.com" data-pwd="Mysuru@2026">
                        👤 ananya.rao@gmail.com (Royal Member)
                      </button>
                      <button type="button" class="demo-acc-pill px-2.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition" data-email="tourist.mysuru@gmail.com" data-pwd="Mysuru@2026">
                        🌿 tourist.mysuru@gmail.com (Green Explorer)
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    ${isLoading ? 'disabled' : ''} 
                    class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                  >
                    ${isLoading ? 'Authenticating...' : 'Sign In with Password →'}
                  </button>
                </form>
              ` : `
                <!-- REGISTRATION FORM -->
                <form id="auth-pwd-reg-form" class="space-y-3 text-xs">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Full Name</label>
                    <input type="text" id="reg-name-input" required placeholder="e.g. Ramesh Kumar" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Email Address</label>
                    <input type="email" id="reg-email-input" required placeholder="e.g. ramesh@gmail.com" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Mobile Phone (Optional)</label>
                    <input type="tel" id="reg-phone-input" placeholder="+91 98450 XXXXX" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Choose Password (Min. 6 Characters)</label>
                    <input type="password" id="reg-pwd-input" required minlength="6" placeholder="Create secure password" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>

                  <button 
                    type="submit" 
                    ${isLoading ? 'disabled' : ''} 
                    class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                  >
                    ${isLoading ? 'Registering Account...' : 'Create Account & Enter (+100 Bonus Pts) →'}
                  </button>
                </form>
              `}

            </div>
          ` : `
            <!-- OPTION B: MOBILE NUMBER / EMAIL OTP AUTHENTICATION -->
            <div class="space-y-4">
              
              ${otpStep === 'target' ? `
                <form id="auth-otp-target-form" class="space-y-4 text-xs">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1.5">Enter Mobile Number or Gmail Address</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        📱
                      </span>
                      <input 
                        type="text" 
                        id="otp-target-input" 
                        required 
                        placeholder="+91 98450 12345 or your.name@gmail.com" 
                        value="${otpTarget}"
                        class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <!-- Quick Demo options -->
                  <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                    <span class="text-[11px] text-slate-400 font-medium block mb-1.5">1-Click Test Numbers / Emails:</span>
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="demo-otp-pill px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 rounded-lg transition" data-target="+91 98450 12345">
                        📱 +91 98450 12345
                      </button>
                      <button type="button" class="demo-otp-pill px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition" data-target="ananya.rao@gmail.com">
                        📬 ananya.rao@gmail.com
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    ${isLoading ? 'disabled' : ''} 
                    class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                  >
                    ${isLoading ? 'Dispatching 6-Digit Code...' : 'Send 6-Digit OTP Code →'}
                  </button>
                </form>
              ` : `
                <!-- STEP 2: 6-DIGIT OTP ENTRY & SIMULATED INBOX -->
                <div class="space-y-4 text-xs">
                  
                  <div class="p-3 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span class="text-xs font-bold text-white">📬 Security Code Generated</span>
                      <span class="font-mono text-[10px] text-emerald-400">Valid for 10m</span>
                    </div>
                    <p class="text-[11px] text-slate-300">Code for <strong class="text-amber-400">${otpTarget}</strong>:</p>
                    <div class="p-2 bg-slate-900 rounded-lg text-center font-mono text-2xl font-extrabold text-amber-400 tracking-widest border border-amber-500/20">
                      ${currentCode}
                    </div>
                    <button id="auth-otp-autofill-btn" class="text-xs text-amber-400 font-bold hover:text-amber-300 underline block text-center w-full">
                      ⚡ 1-Click Auto-Fill Code (${currentCode})
                    </button>
                  </div>

                  <!-- Segmented Inputs -->
                  <div>
                    <label class="block font-semibold text-slate-300 text-center mb-2">
                      Enter 6-Digit Verification Code
                    </label>
                    <div class="flex justify-between gap-1.5 sm:gap-2">
                      ${[0, 1, 2, 3, 4, 5].map(i => `
                        <input 
                          type="text" 
                          maxlength="1" 
                          data-index="${i}" 
                          value="${otpValues[i]}" 
                          class="otp-digit-input w-11 h-12 text-center text-xl font-bold bg-slate-950 border border-slate-700 rounded-xl text-amber-400 focus:outline-none focus:border-amber-400 transition"
                          autocomplete="off"
                        />
                      `).join('')}
                    </div>
                  </div>

                  <button 
                    id="auth-verify-otp-btn" 
                    ${isLoading ? 'disabled' : ''} 
                    class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition"
                  >
                    ${isLoading ? 'Verifying Code...' : 'Verify OTP & Open Dashboard →'}
                  </button>

                  <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800 text-slate-400">
                    <button id="auth-otp-back-btn" class="hover:text-amber-400">← Change Number/Email</button>
                    <span id="auth-timer-count" class="font-mono text-amber-400">${timerSeconds}s</span>
                  </div>
                </div>
              `}

            </div>
          `}

        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const backdrop = document.getElementById('auth-modal-backdrop');
    const closeBtn = document.getElementById('auth-close-btn');
    if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Auth Path Switchers
    const tabPwd = document.getElementById('auth-tab-pwd');
    const tabOtp = document.getElementById('auth-tab-otp');
    if (tabPwd) tabPwd.addEventListener('click', () => { authMode = 'password'; updateView(); });
    if (tabOtp) tabOtp.addEventListener('click', () => { authMode = 'otp'; updateView(); });

    // Password sub-tabs
    const pwdTabLogin = document.getElementById('pwd-tab-login');
    const pwdTabReg = document.getElementById('pwd-tab-reg');
    if (pwdTabLogin) pwdTabLogin.addEventListener('click', () => { passwordTab = 'login'; updateView(); });
    if (pwdTabReg) pwdTabReg.addEventListener('click', () => { passwordTab = 'register'; updateView(); });

    // Option A: Password Login Form
    const loginForm = document.getElementById('auth-pwd-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lEmail = document.getElementById('login-email-input').value;
        const lPwd = document.getElementById('login-pwd-input').value;
        handlePasswordLogin(lEmail, lPwd);
      });
    }

    // Demo pills for password login
    document.querySelectorAll('.demo-acc-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const dEmail = btn.getAttribute('data-email');
        const dPwd = btn.getAttribute('data-pwd');
        handlePasswordLogin(dEmail, dPwd);
      });
    });

    // Option A: Password Register Form
    const regForm = document.getElementById('auth-pwd-reg-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rName = document.getElementById('reg-name-input').value;
        const rEmail = document.getElementById('reg-email-input').value;
        const rPhone = document.getElementById('reg-phone-input').value;
        const rPwd = document.getElementById('reg-pwd-input').value;
        handlePasswordRegister(rEmail, rPwd, rName, rPhone);
      });
    }

    // Option B: OTP Target Form
    const otpForm = document.getElementById('auth-otp-target-form');
    if (otpForm) {
      otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const target = document.getElementById('otp-target-input').value;
        handleSendOtp(target);
      });
    }

    // Demo pills for OTP
    document.querySelectorAll('.demo-otp-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        handleSendOtp(target);
      });
    });

    // OTP verification inputs & autofill
    if (authMode === 'otp' && otpStep === 'verify') {
      const otpInputs = document.querySelectorAll('.otp-digit-input');
      const verifyBtn = document.getElementById('auth-verify-otp-btn');
      const autoFillBtn = document.getElementById('auth-otp-autofill-btn');
      const backBtn = document.getElementById('auth-otp-back-btn');

      const currentCode = serverResponse ? (serverResponse.dev_code || '849201') : '849201';

      if (autoFillBtn) {
        autoFillBtn.addEventListener('click', () => {
          for (let i = 0; i < 6; i++) {
            otpValues[i] = currentCode[i] || '';
          }
          updateView();
          handleVerifyOtp();
        });
      }

      if (backBtn) {
        backBtn.addEventListener('click', () => {
          otpStep = 'target';
          updateView();
        });
      }

      otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (val.length >= 1) {
            otpValues[index] = val.slice(-1);
            input.value = otpValues[index];
            if (index < 5) otpInputs[index + 1].focus();
          } else {
            otpValues[index] = '';
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
          } else if (e.key === 'Enter') {
            handleVerifyOtp();
          }
        });

        input.addEventListener('paste', (e) => {
          e.preventDefault();
          const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
          if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
            for (let i = 0; i < 6; i++) {
              otpValues[i] = pastedData[i];
            }
            updateView();
          }
        });
      });

      if (verifyBtn) verifyBtn.addEventListener('click', handleVerifyOtp);
    }
  }

  updateView();
}
