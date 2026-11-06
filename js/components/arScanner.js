// AR Facade Scanner & Multilingual Audio Guide Component
// Supports real environment camera stream with fallback & authentic Kannada/Hindi/English TTS
import { AR_LANDMARKS } from '../data/arLandmarks.js';
import { geoService } from '../services/geoService.js';

let activeMediaStream = null;

export function renderARScannerTab(container) {
  let selectedLandmark = 'palace';
  let selectedLanguage = 'en'; // 'en' | 'kn' | 'hi'
  let isScanning = false;
  let scanResult = null;
  let isSpeaking = false;
  let cameraMode = 'live'; // 'live' | 'simulation'
  let cameraPermissionState = 'prompt'; // 'prompt' | 'granted' | 'denied' | 'unsupported'
  let cameraErrorMessage = '';
  let availableVoices = [];

  // Stop active camera stream when leaving or unmounting
  function stopCameraStream() {
    if (activeMediaStream) {
      activeMediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {}
      });
      activeMediaStream = null;
    }
  }

  // Load available speech synthesis voices
  function loadVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices() || [];
      if (availableVoices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          availableVoices = window.speechSynthesis.getVoices() || [];
        };
      }
    }
  }
  loadVoices();

  async function initCamera() {
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraPermissionState = 'unsupported';
      cameraMode = 'simulation';
      cameraErrorMessage = 'Camera API not supported on this browser engine. Falling back to high-resolution simulated view.';
      updateView();
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeMediaStream = stream;
      cameraPermissionState = 'granted';
      cameraMode = 'live';
      cameraErrorMessage = '';
      updateView();

      setTimeout(() => {
        const videoEl = document.getElementById('ar-live-video-element');
        if (videoEl && activeMediaStream) {
          videoEl.srcObject = activeMediaStream;
          videoEl.play().catch(() => {});
        }
      }, 50);

    } catch (err) {
      cameraPermissionState = 'denied';
      cameraMode = 'simulation';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        cameraErrorMessage = 'Camera permission denied. Displaying high-resolution simulated monument view.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        cameraErrorMessage = 'No hardware camera detected. Displaying high-resolution simulated monument view.';
      } else {
        cameraErrorMessage = `Camera unavailable (${err.message || 'Error'}). Switched to simulated facade mode.`;
      }
      updateView();
    }
  }

  function updateView() {
    const l = AR_LANDMARKS[selectedLandmark] || AR_LANDMARKS.palace;
    const narrationData = l.narration[selectedLanguage] || l.narration.en;

    // Check if voice exists for selected language
    const hasRegionalVoice = availableVoices.some(v => v.lang.toLowerCase().startsWith(narrationData.locale.split('-')[0].toLowerCase()));

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        
        <!-- HEADER -->
        <div class="text-center space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Augmented Reality & Multilingual Voice Guide
          </span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white">Monument Facade Scanner</h2>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            Point your device camera at a monument facade or choose a simulated heritage site to trigger architectural recognition and audio tour.
          </p>
        </div>

        <!-- CONTROLS ROW: LANDMARK SELECTOR + LANGUAGE SELECTOR -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
          
          <!-- Landmark Tabs -->
          <div class="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button class="landmark-select-btn px-3.5 py-2 text-xs font-bold rounded-xl transition ${selectedLandmark === 'palace' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'}" data-key="palace">
              👑 Mysore Palace
            </button>
            <button class="landmark-select-btn px-3.5 py-2 text-xs font-bold rounded-xl transition ${selectedLandmark === 'temple' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'}" data-key="temple">
              🛕 Chamundi Hill
            </button>
            <button class="landmark-select-btn px-3.5 py-2 text-xs font-bold rounded-xl transition ${selectedLandmark === 'cathedral' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'}" data-key="cathedral">
              ⛪ St. Philomena's
            </button>
          </div>

          <!-- Language Selector -->
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="text-[11px] text-slate-400 font-medium mr-1">🎙️ Language:</span>
            <button class="lang-select-btn px-2.5 py-1.5 text-xs font-bold rounded-xl transition ${selectedLanguage === 'en' ? 'bg-amber-500 text-slate-950 font-extrabold shadow' : 'bg-slate-950 text-slate-300 border border-slate-800'}" data-lang="en">
              English
            </button>
            <button class="lang-select-btn px-2.5 py-1.5 text-xs font-bold rounded-xl transition ${selectedLanguage === 'kn' ? 'bg-amber-500 text-slate-950 font-extrabold shadow' : 'bg-slate-950 text-slate-300 border border-slate-800'}" data-lang="kn">
              ಕನ್ನಡ (Kannada)
            </button>
            <button class="lang-select-btn px-2.5 py-1.5 text-xs font-bold rounded-xl transition ${selectedLanguage === 'hi' ? 'bg-amber-500 text-slate-950 font-extrabold shadow' : 'bg-slate-950 text-slate-300 border border-slate-800'}" data-lang="hi">
              हिन्दी (Hindi)
            </button>
          </div>

        </div>

        <!-- CAMERA STATUS ALERT / TOGGLE -->
        ${cameraErrorMessage ? `
          <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-center justify-between gap-3 animate-fadeIn">
            <div class="flex items-center space-x-2">
              <span>📷</span>
              <span>${cameraErrorMessage}</span>
            </div>
            <button id="retry-camera-btn" class="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-amber-400 transition shrink-0">
              Retry Real Camera
            </button>
          </div>
        ` : ''}

        <!-- AR VIEWPORT (REAL CAMERA OR SIMULATED MONUMENT) -->
        <div class="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
          
          <!-- Real Camera Stream View -->
          ${cameraMode === 'live' && cameraPermissionState === 'granted' ? `
            <video id="ar-live-video-element" class="absolute inset-0 w-full h-full object-cover" autoplay playsinline muted></video>
            <div class="absolute top-3 left-3 bg-slate-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5 z-20">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Environment Camera Active</span>
            </div>
          ` : `
            <!-- Fallback High-Res Simulated Facade Image -->
            <img src="${l.image}" class="absolute inset-0 w-full h-full object-cover filter brightness-75" />
            <div class="absolute inset-0 bg-slate-950/30"></div>
            <div class="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-xl backdrop-blur-md z-20">
              <span>🖼️ High-Resolution Monument View (Simulated)</span>
            </div>
          `}

          <!-- Switch Mode Toggle Button Top Right -->
          <div class="absolute top-3 right-3 z-20">
            <button id="toggle-camera-mode-btn" class="px-2.5 py-1 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-[10px] backdrop-blur-md transition">
              ${cameraMode === 'live' ? 'Switch to Simulation 🖼️' : 'Request Real Camera 📷'}
            </button>
          </div>

          <!-- AR SCANNING RETICLE / OVERLAY -->
          <div class="relative z-10 w-64 h-64 border-2 border-dashed border-amber-400/80 rounded-3xl flex flex-col items-center justify-center p-4 text-center ${isScanning ? 'animate-pulse scale-105 border-emerald-400' : ''} transition">
            
            <!-- Corner Brackets -->
            <div class="w-12 h-12 rounded-2xl bg-slate-950/70 border border-amber-400/50 text-amber-400 flex items-center justify-center text-2xl mb-2 backdrop-blur-md">
              ${isScanning ? '🔍' : '📷'}
            </div>
            
            <span class="text-xs font-bold text-white bg-slate-950/80 px-2.5 py-0.5 rounded-md backdrop-blur-md">
              ${selectedLanguage === 'kn' ? (l.nameKn || l.name) : selectedLanguage === 'hi' ? (l.nameHi || l.name) : l.name}
            </span>
            <span class="text-[10px] text-amber-300 mt-1 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md">
              ${selectedLanguage === 'kn' ? 'ಮುಖಮಂಟಪವನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿ ಜೋಡಿಸಿ' : selectedLanguage === 'hi' ? 'मुखौटे को फ्रेम में संरेखित करें' : 'Align facade in reticle box'}
            </span>
          </div>

          <!-- SCAN ACTION BUTTON -->
          <button id="ar-scan-action-btn" class="absolute bottom-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-xl shadow-amber-500/30 z-20 flex items-center gap-2 transition transform active:scale-95">
            ${isScanning ? `
              <svg class="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>${selectedLanguage === 'kn' ? 'ವಾಸ್ತುಶಿಲ್ಪ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : selectedLanguage === 'hi' ? 'स्थापत्य शैली का विश्लेषण...' : 'Analyzing Facade & Architectural Era...'}</span>
            ` : `
              <span>${selectedLanguage === 'kn' ? `ಮುಖಮಂಟಪ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (+${l.points} ಅಂಕ)` : selectedLanguage === 'hi' ? `स्मारक स्कैन करें (+${l.points} अंक)` : `Scan Monument Facade (+${l.points} pts)`}</span>
            `}
          </button>
        </div>

        <!-- SCAN RESULTS & MULTILINGUAL AUDIO GUIDE CARD -->
        ${scanResult ? `
          <div class="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ${selectedLanguage === 'kn' ? 'ವಾಸ್ತುಶಿಲ್ಪ ಯುಗ ಗುರುತಿಸುವಿಕೆ' : selectedLanguage === 'hi' ? 'ऐतिहासिक स्थापत्य पहचान' : 'Architectural Era Recognition'}
                </span>
                <h3 class="text-xl font-bold text-white mt-1.5">
                  ${selectedLanguage === 'kn' ? (scanResult.nameKn || scanResult.name) : selectedLanguage === 'hi' ? (scanResult.nameHi || scanResult.name) : scanResult.name}
                </h3>
              </div>
              <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl font-mono">
                +${scanResult.points} Points Awarded
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase font-semibold">
                  ${selectedLanguage === 'kn' ? 'ಯುಗ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪಿ' : selectedLanguage === 'hi' ? 'काल एवं वास्तुकार' : 'ERA & ARCHITECT'}
                </span>
                <span class="text-slate-200 font-medium">
                  ${selectedLanguage === 'kn' ? (scanResult.eraKn || scanResult.era) : selectedLanguage === 'hi' ? (scanResult.eraHi || scanResult.era) : scanResult.era}
                </span>
              </div>
              <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase font-semibold">
                  ${selectedLanguage === 'kn' ? 'ವಾಸ್ತುಶಿಲ್ಪ ಶೈಲಿ' : selectedLanguage === 'hi' ? 'स्थापत्य शैली' : 'ARCHITECTURAL STYLE'}
                </span>
                <span class="text-slate-200 font-medium">
                  ${selectedLanguage === 'kn' ? (scanResult.styleKn || scanResult.style) : selectedLanguage === 'hi' ? (scanResult.styleHi || scanResult.style) : scanResult.style}
                </span>
              </div>
            </div>

            <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  ${selectedLanguage === 'kn' ? 'ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು' : selectedLanguage === 'hi' ? 'प्रमुख विशेषताएं' : 'Key Highlights'}
                </span>
                <span class="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span class="text-emerald-400">📍 Satellite GPS:</span>
                  <span>${scanResult.latitude}°N, ${scanResult.longitude}°E</span>
                </span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                ${selectedLanguage === 'kn' ? (scanResult.highlightsKn || scanResult.highlights) : selectedLanguage === 'hi' ? (scanResult.highlightsHi || scanResult.highlights) : scanResult.highlights}
              </p>
              
              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                <a 
                  href="${geoService.getGoogleMapsDirectionsUrl(scanResult)}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>📍 Live Route to Landmark (Google Maps ↗)</span>
                </a>
              </div>
            </div>

            <!-- FEATURE 9: MULTILINGUAL SPEECH AUDIO PLAYER -->
            <div class="p-5 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl space-y-3">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center space-x-3">
                  <div class="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                    🎧
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Audio Guide Narration</span>
                      <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono">${narrationData.langName}</span>
                    </h5>
                    <p class="text-[11px] text-slate-400 mt-0.5">
                      Locale: <code class="font-mono text-amber-400">${narrationData.locale}</code> • Voice Engine: ${hasRegionalVoice ? '✓ Native Voice Found' : '⚠️ System Fallback'}
                    </p>
                  </div>
                </div>

                <button id="play-audio-speech-btn" class="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2">
                  <span>${isSpeaking ? '⏹ Stop Narration' : `▶ Play Narration (${narrationData.langName.split(' ')[0]})`}</span>
                </button>
              </div>

              <!-- Full Display of Narration Text in Selected Language -->
              <div class="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                <p>"${narrationData.text}"</p>
              </div>

              ${!hasRegionalVoice && selectedLanguage !== 'en' ? `
                <div class="text-[10px] text-slate-500 italic">
                  ℹ️ Note: If your operating system lacks a native ${narrationData.langName} voice pack, text synthesis will request the closest multilingual engine while preserving full ${narrationData.langName} script accuracy.
                </div>
              ` : ''}

            </div>

          </div>
        ` : ''}

      </div>
    `;

    bindAREvents();
  }

  function bindAREvents() {
    // Landmark selection
    document.querySelectorAll('.landmark-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLandmark = btn.getAttribute('data-key');
        scanResult = null;
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        isSpeaking = false;
        updateView();
      });
    });

    // Language selection
    document.querySelectorAll('.lang-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLanguage = btn.getAttribute('data-lang');
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        isSpeaking = false;
        updateView();
      });
    });

    // Toggle camera mode / Request real camera
    const toggleCameraBtn = document.getElementById('toggle-camera-mode-btn');
    if (toggleCameraBtn) {
      toggleCameraBtn.addEventListener('click', () => {
        if (cameraMode === 'live') {
          stopCameraStream();
          cameraMode = 'simulation';
          updateView();
        } else {
          initCamera();
        }
      });
    }

    const retryCameraBtn = document.getElementById('retry-camera-btn');
    if (retryCameraBtn) {
      retryCameraBtn.addEventListener('click', () => {
        initCamera();
      });
    }

    // Scan action button
    const scanBtn = document.getElementById('ar-scan-action-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        isScanning = true;
        scanResult = null;
        updateView();

        setTimeout(() => {
          isScanning = false;
          scanResult = AR_LANDMARKS[selectedLandmark] || AR_LANDMARKS.palace;
          updateView();
        }, 900);
      });
    }

    // Audio speech button with true multilingual speech synthesis
    const audioBtn = document.getElementById('play-audio-speech-btn');
    if (audioBtn && scanResult) {
      audioBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            updateView();
          } else {
            window.speechSynthesis.cancel(); // clear previous
            
            const narrationData = scanResult.narration[selectedLanguage] || scanResult.narration.en;
            const utterance = new SpeechSynthesisUtterance(narrationData.text);
            utterance.lang = narrationData.locale; // 'kn-IN', 'hi-IN', 'en-IN'
            utterance.rate = 0.92;

            // Attempt to select matching voice
            const voices = window.speechSynthesis.getVoices();
            const targetPrefix = narrationData.locale.split('-')[0].toLowerCase();
            const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix) || v.lang.toLowerCase() === narrationData.locale.toLowerCase());
            
            if (matchingVoice) {
              utterance.voice = matchingVoice;
            }

            utterance.onend = () => {
              isSpeaking = false;
              updateView();
            };

            utterance.onerror = (e) => {
              console.warn("Speech synthesis notice:", e);
              isSpeaking = false;
              updateView();
            };

            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            updateView();
          }
        } else {
          const narrationData = scanResult.narration[selectedLanguage] || scanResult.narration.en;
          alert(`Multilingual Narration (${narrationData.langName}):\n\n"${narrationData.text}"`);
        }
      });
    }
  }

  // Auto-cleanup when navigating to another tab or leaving page
  window.addEventListener('atithi:navigate_tab', (e) => {
    if (e.detail && e.detail.tab !== 'ar') {
      stopCameraStream();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  });
  window.addEventListener('beforeunload', () => {
    stopCameraStream();
  });

  // Auto-attempt real camera on first load if supported
  if (cameraPermissionState === 'prompt' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    initCamera();
  } else {
    updateView();
  }
}
