import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Radio,
  Send,
  X,
  RefreshCw,
  Sparkles,
  Sliders,
  Copy,
  Check,
  Search,
  ArrowRight,
  Maximize2,
  Minimize2,
  ChevronRight,
  Gauge,
  SlidersHorizontal,
  ClipboardPaste,
  ShieldAlert,
  Flame,
  Zap,
  RotateCcw,
  Compass,
  Activity,
  Disc,
} from 'lucide-react';
import { TRACKS } from '../data/mockData';
import { TrackFlagIcon } from '../utils/trackFlags';
import { useLanguage } from '../i18n/LanguageContext';
import {
  DriverSetupValues,
  DEFAULT_SETUP_PRESETS,
  getCommonHandlingIssues,
  diagnoseHandlingIssueWithSetup,
  parseSetupFromText,
  DiagnosisResult,
} from '../utils/f1EngineerEngine';

export interface F1SetupEngineerChatProps {
  activeGameId?: string;
  activeTrackId?: string;
  onFilterMarketplace?: (trackId: string, gameId?: string) => void;
  onOpenSetupModal?: () => void;
}

type DiagnosticStep = 1 | 2 | 3;
type SetupCategoryTab = 'all' | 'aero' | 'transmission' | 'geometry' | 'suspension' | 'brakes' | 'tyres';

interface ChatMessage {
  id: string;
  sender: 'engineer' | 'user';
  text: string;
  timestamp: string;
  step?: DiagnosticStep;
  diagnosis?: DiagnosisResult;
  setupSnapshot?: DriverSetupValues;
  selectedTrack?: string;
}

export const F1SetupEngineerChat: React.FC<F1SetupEngineerChatProps> = ({
  activeGameId = 'f1_25',
  activeTrackId = 'spa',
  onFilterMarketplace,
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Diagnostic State
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>(activeTrackId || 'spa');
  const [currentSetup, setCurrentSetup] = useState<DriverSetupValues>(DEFAULT_SETUP_PRESETS.balanced.values);
  const [activePresetKey, setActivePresetKey] = useState<string>('balanced');
  const [categoryTab, setCategoryTab] = useState<SetupCategoryTab>('all');
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedSetupText, setPastedSetupText] = useState('');

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initial Step 1 greeting
  const getGreetingMessage = (): ChatMessage => ({
    id: 'welcome-step1',
    sender: 'engineer',
    text: isTr
      ? '📻 **F1 Canlı Telsiz & Telemetri Hattı Bağlandı.**\n\nMerhaba! Ben F1 Baş Yarış & Setup Mühendisin.\n\n🏎️ **Adım 1 (Tam 6 Kategori Setup Girişi):** Lütfen mevcut araç ayarlarınızı (Aerodinamik, Şanzıman, Geometri, Süspansiyon, Frenler, Lastikler) girin, espor şablonlarından seçin veya metin olarak yapıştırın:'
      : '📻 **F1 Pit Wall Live Telemetry Connected.**\n\nHello driver! I am your Senior Race & Setup Engineer.\n\n🏎️ **Step 1 (Complete 6-Category Setup Input):** Please configure your car parameters (Aerodynamics, Transmission, Geometry, Suspension, Brakes, Tyres), pick an esports baseline preset, or paste raw setup values:',
    timestamp: isTr ? 'Şimdi' : 'Now',
    step: 1,
    selectedTrack: activeTrackId,
    setupSnapshot: currentSetup,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getGreetingMessage()]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-sync messages when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].step === 1) {
        return [getGreetingMessage()];
      }
      return prev;
    });
  }, [language]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping, currentStep]);

  // Apply preset
  const handleApplyPreset = (presetKey: string) => {
    const preset = DEFAULT_SETUP_PRESETS[presetKey];
    if (preset) {
      setActivePresetKey(presetKey);
      setCurrentSetup({ ...preset.values });
    }
  };

  // Quick field updater
  const handleUpdateSetupField = (field: keyof DriverSetupValues, val: number) => {
    setCurrentSetup((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // Handle parse pasted text
  const handleParsePastedSetup = () => {
    if (!pastedSetupText.trim()) return;
    const parsed = parseSetupFromText(pastedSetupText, currentSetup);
    setCurrentSetup(parsed);
    setPasteMode(false);
    setPastedSetupText('');
  };

  // Confirm Step 1: Proceed to Step 2 (Issue Input)
  const handleConfirmSetupStep1 = () => {
    setCurrentStep(2);

    const userSummaryText = isTr
      ? `📋 **Kullanılan F1 Setup Değerleri (6 Kategori):**
• **Aerodinamik:** Ön Kanat: ${currentSetup.frontWing} | Arka Kanat: ${currentSetup.rearWing}
• **Transmisyon:** On-Throttle Diff: %${currentSetup.diffOnThrottle} | Off-Throttle Diff: %${currentSetup.diffOffThrottle} | Motor Freni: %${currentSetup.engineBraking}
• **Süspansiyon Geometrisi:** Ön Kamber: ${currentSetup.frontCamber}° | Arka Kamber: ${currentSetup.rearCamber}° | Ön Toe-Out: ${currentSetup.frontToe}° | Arka Toe-In: ${currentSetup.rearToe}°
• **Süspansiyon:** Ön/Arka Yay: ${currentSetup.frontSuspension}/${currentSetup.rearSuspension} | Ön/Arka ARB: ${currentSetup.frontARB}/${currentSetup.rearARB} | Taban: ${currentSetup.frontRideHeight}/${currentSetup.rearRideHeight}
• **Frenler:** Basınç: %${currentSetup.brakePressure} | Denge: %${currentSetup.brakeBias}
• **Lastikler:** Ön: ${currentSetup.frontTyrePressure} PSI | Arka: ${currentSetup.rearTyrePressure} PSI`
      : `📋 **F1 Setup Parameter Telemetry (6 Categories):**
• **Aerodynamics:** Front Wing: ${currentSetup.frontWing} | Rear Wing: ${currentSetup.rearWing}
• **Transmission:** On-Throttle Diff: ${currentSetup.diffOnThrottle}% | Off-Throttle Diff: ${currentSetup.diffOffThrottle}% | Engine Braking: ${currentSetup.engineBraking}%
• **Suspension Geometry:** Front Camber: ${currentSetup.frontCamber}° | Rear Camber: ${currentSetup.rearCamber}° | Front Toe-Out: ${currentSetup.frontToe}° | Rear Toe-In: ${currentSetup.rearToe}°
• **Suspension:** Springs (F/R): ${currentSetup.frontSuspension}/${currentSetup.rearSuspension} | ARBs (F/R): ${currentSetup.frontARB}/${currentSetup.rearARB} | Ride: ${currentSetup.frontRideHeight}/${currentSetup.rearRideHeight}
• **Brakes:** Pressure: ${currentSetup.brakePressure}% | Front Bias: ${currentSetup.brakeBias}%
• **Tyres:** Front Pressure: ${currentSetup.frontTyrePressure} PSI | Rear Pressure: ${currentSetup.rearTyrePressure} PSI`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userSummaryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      setupSnapshot: { ...currentSetup },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const engMsg: ChatMessage = {
        id: `eng-${Date.now()}`,
        sender: 'engineer',
        text: isTr
          ? `Tüm 6 kategorideki setup telemetriniz kaydedildi ve yarış analiz motoruna işlendi.\n\n⚠️ **Adım 2 (Sorun Girişi):** Pistte tam olarak hangi sürüş veya denge problemini yaşıyorsunuz? (Örn: 'Düzlük hızım az', 'Viraj çıkışında arkası kopuyor', 'Yavaş virajlarda kafadan kayıyor')`
          : `All 6 categories mapped into the race engineering telemetry model.\n\n⚠️ **Step 2 (Issue Input):** What specific handling problem or issue are you experiencing on track? (e.g., 'Low top speed / excessive drag', 'Rear snapping out on corner exit', 'Turn-in understeer')`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        step: 2,
        selectedTrack: selectedTrack,
        setupSnapshot: { ...currentSetup },
      };
      setMessages((prev) => [...prev, engMsg]);
    }, 500);
  };

  // Step 2 -> Step 3: Handle Selected Issue or Custom Input
  const handleSelectIssue = (issueId: string, issueLabel: string) => {
    setCurrentStep(3);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `⚠️ **${isTr ? 'Bildirilen Sorun' : 'Reported Issue'}:** ${issueLabel}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const diagnosis = diagnoseHandlingIssueWithSetup(issueId, currentSetup, selectedTrack, language);

      const engMsg: ChatMessage = {
        id: `eng-${Date.now()}`,
        sender: 'engineer',
        text: isTr
          ? `🔧 **Adım 3 (Detaylı Analiz & Hassas Değer Değişimleri):** Girdiğiniz 6 kategorideki setup sayıları ve yaşadığınız problem analiz edildi. İşte yapılması gereken net tık/sayı değişimleri:`
          : `🔧 **Step 3 (Detailed Analysis & Incremental Tweaks):** Telemetry evaluated against your complete 6-category setup. Here are the exact click-by-click adjustments:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        step: 3,
        diagnosis: diagnosis,
        selectedTrack: selectedTrack,
        setupSnapshot: { ...currentSetup },
      };
      setMessages((prev) => [...prev, engMsg]);
    }, 600);
  };

  // Handle Free-Form Text from Input Bar (can be issue or setup)
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    if (currentStep === 1) {
      // User typed setup numbers or issue
      const parsed = parseSetupFromText(query, currentSetup);
      setCurrentSetup(parsed);
      handleConfirmSetupStep1();
      return;
    }

    setCurrentStep(3);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const diagnosis = diagnoseHandlingIssueWithSetup(query, currentSetup, selectedTrack, language);
      const engMsg: ChatMessage = {
        id: `eng-${Date.now()}`,
        sender: 'engineer',
        text: isTr
          ? `🔧 **Adım 3 (Detaylı Analiz & Değer Değişimleri):** "${query}" sorununuz 6 kategorideki mevcut setup değerlerinize göre simüle edildi. Önerilen net değişimler:`
          : `🔧 **Step 3 (Detailed Analysis & Exact Tweaks):** Analyzed "${query}" against your exact 6-category setup numbers. Here are the precise parameter changes:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        step: 3,
        diagnosis: diagnosis,
        selectedTrack: selectedTrack,
        setupSnapshot: { ...currentSetup },
      };
      setMessages((prev) => [...prev, engMsg]);
    }, 600);
  };

  // Reset conversation to Step 1
  const handleReset = () => {
    setCurrentStep(1);
    setCategoryTab('all');
    setMessages([getGreetingMessage()]);
  };

  // Copy diagnosis with exact numbers
  const handleCopySetup = (id: string, diagnosis: DiagnosisResult) => {
    const textToCopy =
      `=== ${diagnosis.title} ===\n${diagnosis.summary}\n\n` +
      `${isTr ? 'ÖNERİLEN NET SAYISAL DEĞİŞİMLER (6 KATEGORİ):' : 'EXACT NUMERICAL ADJUSTMENTS (6 CATEGORIES):'}\n` +
      diagnosis.adjustments
        .map(
          (a) =>
            `• [${a.category}] ${a.parameter}: ${a.currentValue} -> ${a.recommendedValue} (${a.changeDelta})\n   ${isTr ? 'Ayar' : 'Action'}: ${a.adjustment}\n   ${isTr ? 'Etki' : 'Impact'}: ${a.impact}`
        )
        .join('\n\n') +
      `\n\n💡 ${isTr ? 'Telemetri Sürüş Tavsiyesi' : 'Telemetry Driving Tip'}: ${diagnosis.telemetryTip}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const currentTrackObj = TRACKS[selectedTrack] || Object.values(TRACKS)[0];
  const handlingIssues = getCommonHandlingIssues(language);

  return (
    <>
      {/* Floating Toggle Button (Bottom-Left launcher) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 select-none">
        <motion.button
          id="f1-engineer-chat-trigger"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer backdrop-blur-md ${
            isOpen
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-red-600/30 ring-2 ring-red-500/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-700/80 shadow-black/50 hover:border-red-500/60'
          }`}
        >
          <div className="relative">
            <Radio className={`w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? 'animate-pulse text-white' : 'text-red-400'}`} />
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-ping" />
            )}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="flex items-center gap-1.5 font-extrabold tracking-wide">
              <span>{isTr ? 'AI Setup Mühendisi' : 'AI Setup Engineer'}</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 bg-red-600/30 text-red-300 rounded-md border border-red-500/40">
                LIVE
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              {isTr ? '6-Kategori Telemetri & Teşhis' : '6-Category Telemetry & Diagnostics'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Main Chat Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="f1-engineer-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden rounded-2xl ${
              isExpanded
                ? 'inset-2 sm:inset-6 md:inset-10'
                : 'bottom-20 left-2 right-2 sm:left-4 sm:right-auto sm:w-[560px] md:w-[620px] max-h-[85vh] sm:h-[680px]'
            }`}
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                      <span>{isTr ? 'AI Setup & Yarış Mühendisi' : 'AI Setup & Race Engineer'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                        {currentTrackObj.name.split('(')[0].trim()}
                      </span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isTr ? 'F1 24/25 Telemetri Simülatörü' : 'F1 24/25 Live Telemetry Engine'}</span>
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title={isTr ? 'Sıfırla' : 'Reset'}
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title={isExpanded ? (isTr ? 'Küçült' : 'Minimize') : isTr ? 'Büyüt' : 'Maximize'}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer hidden sm:flex"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  title={isTr ? 'Kapat' : 'Close'}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none w-full justify-between">
                <div
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-1.5 cursor-pointer font-bold transition-colors ${
                    currentStep === 1 ? 'text-red-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      currentStep === 1
                        ? 'bg-red-500 text-white font-black'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    1
                  </span>
                  <span className="text-[11px] whitespace-nowrap">
                    {isTr ? 'Adım 1: Setup Parametreleri' : 'Step 1: Setup Values'}
                  </span>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

                <div
                  onClick={() => currentStep > 1 && setCurrentStep(2)}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    currentStep === 2
                      ? 'text-amber-400'
                      : currentStep > 2
                      ? 'text-slate-400 cursor-pointer hover:text-slate-200'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      currentStep === 2
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    2
                  </span>
                  <span className="text-[11px] whitespace-nowrap">
                    {isTr ? 'Adım 2: Sorun Bildirimi' : 'Step 2: Handling Issue'}
                  </span>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

                <div
                  className={`flex items-center gap-1.5 font-bold ${
                    currentStep === 3 ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      currentStep === 3
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    3
                  </span>
                  <span className="text-[11px] whitespace-nowrap">
                    {isTr ? 'Adım 3: Telemetri Değişimleri' : 'Step 3: Setup Tweaks'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[90%] rounded-2xl p-3 sm:p-3.5 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-medium text-xs sm:text-sm rounded-br-xs'
                        : 'bg-slate-900/95 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-bl-xs'
                    }`}
                  >
                    {/* Message Header if from Engineer */}
                    {msg.sender === 'engineer' && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 mb-1.5 border-b border-slate-800 pb-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>{isTr ? 'PIT WALL — TELSİZ & TELEMETRİ' : 'PIT WALL — LIVE TELEMETRY'}</span>
                      </div>
                    )}

                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>

                    {/* STEP 1: INTERACTIVE 6-CATEGORY SETUP INPUT CARD */}
                    {msg.step === 1 && currentStep === 1 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-3">
                        {/* Track & Preset Selector Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                            <span>{isTr ? '⚡ Espor Hazır Taban Şablonları:' : '⚡ Esports Baseline Presets:'}</span>
                            <button
                              type="button"
                              onClick={() => setPasteMode(!pasteMode)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer flex items-center gap-1"
                            >
                              <ClipboardPaste className="w-3 h-3" />
                              <span>{pasteMode ? (isTr ? 'Forma Dön' : 'Switch to Sliders') : isTr ? 'Metin Yapıştır' : 'Paste Text'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {Object.entries(DEFAULT_SETUP_PRESETS).map(([key, preset]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleApplyPreset(key)}
                                className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-left transition-all cursor-pointer truncate ${
                                  activePresetKey === key
                                    ? 'bg-red-600/30 border-red-500 text-red-200 shadow-xs ring-1 ring-red-500/40'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                              >
                                {isTr ? preset.labelTr : preset.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Paste Box Mode */}
                        {pasteMode ? (
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-300 block">
                              {isTr
                                ? 'Setup Metnini veya Rakamlarını Yapıştırın (Tüm 6 Kategori Desteklenir):'
                                : 'Paste Setup Text or Numbers (All 6 Categories Supported):'}
                            </label>
                            <textarea
                              rows={3}
                              value={pastedSetupText}
                              onChange={(e) => setPastedSetupText(e.target.value)}
                              placeholder={
                                isTr
                                  ? 'Örn: Kanat: 36-32, Diff: %58-%52, Motor Freni: %60, Kamber: -2.50/-1.00, Toe: 0.00/0.10, Yay: 30-22, ARB: 8-5, Taban: 35-40, Fren: %100-%55, Lastik: 22.5-20.5 PSI'
                                  : 'e.g. Wings: 36-32, Diff: 58%-52%, Engine Braking: 60%, Camber: -2.50/-1.00, Toe: 0.00/0.10, Springs: 30-22, ARB: 8-5, Ride: 35-40, Brakes: 100%-55%, Tyres: 22.5-20.5 PSI'
                              }
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-red-500 font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleParsePastedSetup}
                              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isTr ? 'Değerleri Çözümle ve Uygula' : 'Parse & Apply Values'}</span>
                            </button>
                          </div>
                        ) : (
                          /* Interactive Categorized Steppers / Sliders Grid */
                          <div className="space-y-2.5">
                            {/* Category Filter Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
                              {[
                                { id: 'all', labelTr: '🌟 Tümü (6)', labelEn: '🌟 All (6)' },
                                { id: 'aero', labelTr: '🌪️ Aerodinamik', labelEn: '🌪️ Aero' },
                                { id: 'transmission', labelTr: '⚙️ Şanzıman', labelEn: '⚙️ Transmission' },
                                { id: 'geometry', labelTr: '📐 Geometri', labelEn: '📐 Geometry' },
                                { id: 'suspension', labelTr: '🔄 Süspansiyon', labelEn: '🔄 Suspension' },
                                { id: 'brakes', labelTr: '🎯 Frenler', labelEn: '🎯 Brakes' },
                                { id: 'tyres', labelTr: '🏁 Lastikler', labelEn: '🏁 Tyres' },
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setCategoryTab(tab.id as SetupCategoryTab)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    categoryTab === tab.id
                                      ? 'bg-red-600 text-white shadow-xs'
                                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                  }`}
                                >
                                  {isTr ? tab.labelTr : tab.labelEn}
                                </button>
                              ))}
                            </div>

                            {/* 1. AERODYNAMICS */}
                            {(categoryTab === 'all' || categoryTab === 'aero') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>🌪️</span>
                                    <span>{isTr ? '1. Aerodinamik (0 - 50)' : '1. Aerodynamics (0 - 50)'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    {currentSetup.frontWing} - {currentSetup.rearWing}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Kanat:' : 'Front Wing:'}</span>
                                      <span className="font-mono text-white font-bold">{currentSetup.frontWing}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0}
                                      max={50}
                                      value={currentSetup.frontWing}
                                      onChange={(e) => handleUpdateSetupField('frontWing', Number(e.target.value))}
                                      className="w-full accent-sky-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Kanat:' : 'Rear Wing:'}</span>
                                      <span className="font-mono text-white font-bold">{currentSetup.rearWing}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0}
                                      max={50}
                                      value={currentSetup.rearWing}
                                      onChange={(e) => handleUpdateSetupField('rearWing', Number(e.target.value))}
                                      className="w-full accent-sky-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 2. TRANSMISSION / DIFFERENTIAL & ENGINE BRAKING */}
                            {(categoryTab === 'all' || categoryTab === 'transmission') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>⚙️</span>
                                    <span>{isTr ? '2. Şanzıman & Transmisyon' : '2. Transmission & Differential'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    %{currentSetup.diffOnThrottle} / %{currentSetup.diffOffThrottle} | EB: %{currentSetup.engineBraking}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Gaza Basarken (%):' : 'Diff On-Throttle:'}</span>
                                      <span className="font-mono text-amber-300 font-bold">%{currentSetup.diffOnThrottle}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={10}
                                      max={100}
                                      value={currentSetup.diffOnThrottle}
                                      onChange={(e) => handleUpdateSetupField('diffOnThrottle', Number(e.target.value))}
                                      className="w-full accent-amber-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Gaz Kesince (%):' : 'Diff Off-Throttle:'}</span>
                                      <span className="font-mono text-amber-300 font-bold">%{currentSetup.diffOffThrottle}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={10}
                                      max={100}
                                      value={currentSetup.diffOffThrottle}
                                      onChange={(e) => handleUpdateSetupField('diffOffThrottle', Number(e.target.value))}
                                      className="w-full accent-amber-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Motor Freni (EB):' : 'Engine Braking:'}</span>
                                      <span className="font-mono text-amber-300 font-bold">%{currentSetup.engineBraking}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0}
                                      max={100}
                                      value={currentSetup.engineBraking}
                                      onChange={(e) => handleUpdateSetupField('engineBraking', Number(e.target.value))}
                                      className="w-full accent-amber-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 3. SUSPENSION GEOMETRY (CAMBER & TOE) */}
                            {(categoryTab === 'all' || categoryTab === 'geometry') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-violet-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>📐</span>
                                    <span>{isTr ? '3. Süspansiyon Geometrisi (Kamber & Toe)' : '3. Suspension Geometry (Camber & Toe)'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    {currentSetup.frontCamber}° / {currentSetup.rearCamber}° | {currentSetup.frontToe}° / {currentSetup.rearToe}°
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Kamber:' : 'Front Camber:'}</span>
                                      <span className="font-mono text-violet-300 font-bold">{currentSetup.frontCamber}°</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={-3.50}
                                      max={-2.50}
                                      step={0.05}
                                      value={currentSetup.frontCamber}
                                      onChange={(e) => handleUpdateSetupField('frontCamber', Number(e.target.value))}
                                      className="w-full accent-violet-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Kamber:' : 'Rear Camber:'}</span>
                                      <span className="font-mono text-violet-300 font-bold">{currentSetup.rearCamber}°</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={-2.20}
                                      max={-0.70}
                                      step={0.05}
                                      value={currentSetup.rearCamber}
                                      onChange={(e) => handleUpdateSetupField('rearCamber', Number(e.target.value))}
                                      className="w-full accent-violet-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Toe-Out:' : 'Front Toe-Out:'}</span>
                                      <span className="font-mono text-violet-300 font-bold">{currentSetup.frontToe}°</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0.00}
                                      max={0.50}
                                      step={0.01}
                                      value={currentSetup.frontToe}
                                      onChange={(e) => handleUpdateSetupField('frontToe', Number(e.target.value))}
                                      className="w-full accent-violet-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Toe-In:' : 'Rear Toe-In:'}</span>
                                      <span className="font-mono text-violet-300 font-bold">{currentSetup.rearToe}°</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={0.00}
                                      max={0.50}
                                      step={0.01}
                                      value={currentSetup.rearToe}
                                      onChange={(e) => handleUpdateSetupField('rearToe', Number(e.target.value))}
                                      className="w-full accent-violet-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 4. SUSPENSION (SPRINGS, ARB & RIDE HEIGHT) */}
                            {(categoryTab === 'all' || categoryTab === 'suspension') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>🔄</span>
                                    <span>{isTr ? '4. Süspansiyon (Yaylar, ARB & Taban Yüksekliği)' : '4. Suspension (Springs, ARBs & Ride Height)'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    S:{currentSetup.frontSuspension}/{currentSetup.rearSuspension} | ARB:{currentSetup.frontARB}/{currentSetup.rearARB} | R:{currentSetup.frontRideHeight}/{currentSetup.rearRideHeight}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {/* Front/Rear Springs */}
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Süspansiyon:' : 'Front Suspension:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.frontSuspension}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={1}
                                      max={41}
                                      value={currentSetup.frontSuspension}
                                      onChange={(e) => handleUpdateSetupField('frontSuspension', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Süspansiyon:' : 'Rear Suspension:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.rearSuspension}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={1}
                                      max={41}
                                      value={currentSetup.rearSuspension}
                                      onChange={(e) => handleUpdateSetupField('rearSuspension', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>

                                  {/* Front/Rear ARB */}
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön ARB:' : 'Front ARB:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.frontARB}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={1}
                                      max={21}
                                      value={currentSetup.frontARB}
                                      onChange={(e) => handleUpdateSetupField('frontARB', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka ARB:' : 'Rear ARB:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.rearARB}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={1}
                                      max={21}
                                      value={currentSetup.rearARB}
                                      onChange={(e) => handleUpdateSetupField('rearARB', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>

                                  {/* Ride Heights */}
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Taban:' : 'Front Ride Height:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.frontRideHeight}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={10}
                                      max={45}
                                      value={currentSetup.frontRideHeight}
                                      onChange={(e) => handleUpdateSetupField('frontRideHeight', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Taban:' : 'Rear Ride Height:'}</span>
                                      <span className="font-mono text-emerald-300 font-bold">{currentSetup.rearRideHeight}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={30}
                                      max={65}
                                      value={currentSetup.rearRideHeight}
                                      onChange={(e) => handleUpdateSetupField('rearRideHeight', Number(e.target.value))}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 5. BRAKES (PRESSURE & BIAS) */}
                            {(categoryTab === 'all' || categoryTab === 'brakes') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-red-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>🎯</span>
                                    <span>{isTr ? '5. Frenler (Basınç & Ön Fren Dengesi)' : '5. Brakes (Pressure & Front Bias)'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    %{currentSetup.brakePressure} | %{currentSetup.brakeBias}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Fren Basıncı (%):' : 'Brake Pressure (%):'}</span>
                                      <span className="font-mono text-red-300 font-bold">%{currentSetup.brakePressure}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={80}
                                      max={100}
                                      value={currentSetup.brakePressure}
                                      onChange={(e) => handleUpdateSetupField('brakePressure', Number(e.target.value))}
                                      className="w-full accent-red-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Fren Dengesi (%):' : 'Front Brake Bias (%):'}</span>
                                      <span className="font-mono text-red-300 font-bold">%{currentSetup.brakeBias}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={50}
                                      max={70}
                                      value={currentSetup.brakeBias}
                                      onChange={(e) => handleUpdateSetupField('brakeBias', Number(e.target.value))}
                                      className="w-full accent-red-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 6. TYRES (FRONT & REAR PRESSURES) */}
                            {(categoryTab === 'all' || categoryTab === 'tyres') && (
                              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-orange-400">
                                  <span className="flex items-center gap-1.5">
                                    <span>🏁</span>
                                    <span>{isTr ? '6. Lastikler (Ön / Arka Basınç PSI)' : '6. Tyres (Front / Rear Pressures PSI)'}</span>
                                  </span>
                                  <span className="font-mono text-slate-200 text-xs font-bold">
                                    {currentSetup.frontTyrePressure} / {currentSetup.rearTyrePressure} PSI
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Ön Lastik Basıncı:' : 'Front Tyres Pressure:'}</span>
                                      <span className="font-mono text-orange-300 font-bold">{currentSetup.frontTyrePressure} PSI</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={20.0}
                                      max={29.5}
                                      step={0.1}
                                      value={currentSetup.frontTyrePressure}
                                      onChange={(e) => handleUpdateSetupField('frontTyrePressure', Number(Number(e.target.value).toFixed(1)))}
                                      className="w-full accent-orange-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>{isTr ? 'Arka Lastik Basıncı:' : 'Rear Tyres Pressure:'}</span>
                                      <span className="font-mono text-orange-300 font-bold">{currentSetup.rearTyrePressure} PSI</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={19.0}
                                      max={26.5}
                                      step={0.1}
                                      value={currentSetup.rearTyrePressure}
                                      onChange={(e) => handleUpdateSetupField('rearTyrePressure', Number(Number(e.target.value).toFixed(1)))}
                                      className="w-full accent-orange-500 cursor-pointer h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step 1 Confirm Button */}
                        <button
                          type="button"
                          onClick={handleConfirmSetupStep1}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <span>{isTr ? '✅ Tüm 6 Kategori Setupı Onayla (Adım 2)' : '✅ Confirm 6-Category Setup & Proceed (Step 2)'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* STEP 2: Issue Input Selection Grid */}
                    {msg.step === 2 && currentStep === 2 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/90 space-y-2">
                        <div className="text-[11px] font-bold text-slate-300">
                          {isTr ? 'Yaşadığınız Spesifik Denge Problemini Seçin veya Aşağıya Yazın:' : 'Select Your Specific Handling Problem or Type Below:'}
                        </div>
                        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                          {handlingIssues.map((issue) => (
                            <button
                              key={issue.id}
                              type="button"
                              onClick={() => handleSelectIssue(issue.id, issue.label)}
                              className="w-full p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-red-500/70 text-left transition-all cursor-pointer flex items-start gap-2.5 group"
                            >
                              <span className="text-base shrink-0 mt-0.5">{issue.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-200 group-hover:text-red-400 text-xs transition-colors truncate">
                                  {issue.label}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                  {issue.description}
                                </div>
                              </div>
                              <span className="text-slate-600 group-hover:text-red-400 shrink-0 text-sm">
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Detailed Analysis & Numerical Value Changes */}
                    {msg.step === 3 && msg.diagnosis && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                        {/* Title & Physics Summary */}
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
                          <div className="font-extrabold text-slate-100 text-xs flex items-center gap-1.5 text-red-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{msg.diagnosis.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-normal">{msg.diagnosis.summary}</p>
                          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 mt-1">
                            <strong className="text-slate-300">
                              {isTr ? 'Fiziksel Telemetri Analizi:' : 'Telemetry Diagnosis:'}
                            </strong>{' '}
                            {msg.diagnosis.problemAnalysis}
                          </div>
                        </div>

                        {/* Exact Numerical Tweaks Table */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Sliders className="w-3 h-3 text-red-400" />
                              {isTr ? 'Hassas Sayısal Değişim Tablosu (6 Kategori):' : 'Precise Numerical Tweak Table (6 Categories):'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopySetup(msg.id, msg.diagnosis!)}
                              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">{isTr ? 'Kopyalandı!' : 'Copied!'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>{isTr ? 'Değişimleri Kopyala' : 'Copy Tweaks'}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.diagnosis.adjustments.map((adj, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col gap-1.5 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                        adj.category === 'Aero'
                                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                          : adj.category === 'Transmission'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                          : adj.category === 'Geometry'
                                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                          : adj.category === 'Suspension'
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                          : adj.category === 'Brakes'
                                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                          : adj.category === 'Tyres'
                                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      }`}
                                    >
                                      {adj.category}
                                    </span>
                                    <span className="font-bold text-slate-200 text-xs">{adj.parameter}</span>
                                  </div>

                                  {/* Numerical Delta Pill */}
                                  <div className="flex items-center gap-1 font-mono text-[11px] font-extrabold">
                                    <span className="text-slate-400">{adj.currentValue}</span>
                                    <span className="text-slate-500">→</span>
                                    <span className="text-emerald-400">{adj.recommendedValue}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {adj.changeDelta}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs font-bold text-emerald-300 bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                                  <span>🔧</span>
                                  <span>{adj.adjustment}</span>
                                </div>

                                <p className="text-[10px] text-slate-400 leading-tight">{adj.impact}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Telemetry Driving Tip */}
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-start gap-2">
                          <span className="text-base shrink-0">💡</span>
                          <div>
                            <strong className="text-amber-200">
                              {isTr ? 'Telemetri Sürüş Tavsiyesi:' : 'Telemetry Driving Tip:'}
                            </strong>{' '}
                            {msg.diagnosis.telemetryTip}
                          </div>
                        </div>

                        {/* Quick Action Navigation */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {onFilterMarketplace && (
                            <button
                              type="button"
                              onClick={() => onFilterMarketplace(msg.selectedTrack || selectedTrack, activeGameId)}
                              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>{currentTrackObj.name} {isTr ? 'Setupları' : 'Setups'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentStep(2);
                              const engMsg: ChatMessage = {
                                id: `eng-${Date.now()}`,
                                sender: 'engineer',
                                text: isTr
                                  ? 'Aynı setup üzerinde başka hangi virajda veya durumda sorun yaşıyorsun? (Örn: "Düzlük hızım az", "Kerblerde zıplıyor", "Turn-in understeer")'
                                  : 'On this setup, what other handling issue are you experiencing? (e.g. "Low top speed", "Bouncing on kerbs", "Turn-in understeer")',
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                step: 2,
                                selectedTrack: selectedTrack,
                                setupSnapshot: { ...currentSetup },
                              };
                              setMessages((prev) => [...prev, engMsg]);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                          >
                            {isTr ? 'Başka Bir Sorun Analiz Et' : 'Diagnose Another Deficit'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-slate-950/80 rounded-2xl w-fit border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isTr ? 'Mühendis 6-kategori telemetriyi analiz ediyor...' : 'Engineer analyzing 6-category telemetry...'}
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  currentStep === 1
                    ? isTr
                      ? 'Setup değerlerini yazın (Örn: Kanat 36-32, Diff %58, Motor Freni %60)...'
                      : 'Type setup values (e.g. Wings 36-32, Diff 58%, Engine Braking 60%)...'
                    : isTr
                    ? 'Sorununuzu yazın (Örn: Düzlük hızım az, viraj çıkışında arkası kopuyor)...'
                    : 'Type handling issue (e.g. Low top speed, snap oversteer on exit)...'
                }
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-red-500/80 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center ${
                  inputText.trim() && !isTyping
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
