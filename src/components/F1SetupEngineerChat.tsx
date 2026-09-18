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
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedSetupText, setPastedSetupText] = useState('');

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initial Step 1 greeting
  const getGreetingMessage = (): ChatMessage => ({
    id: 'welcome-step1',
    sender: 'engineer',
    text: isTr
      ? '📻 **F1 Canlı Telsiz & Telemetri Hattı Bağlandı.**\n\nMerhaba! Ben F1 Baş Yarış & Setup Mühendisin.\n\n🏎️ **Adım 1 (Mevcut Setup Değerleri):** Lütfen şu an kullandığın araç setup değerlerini gir, hazır şablonlardan seç veya metin olarak yapıştır:'
      : '📻 **F1 Pit Wall Live Telemetry Connected.**\n\nHello driver! I am your Senior Race & Setup Engineer.\n\n🏎️ **Step 1 (Setup Input):** Please enter or paste your current setup numbers (wing angles, suspension, differential, tyre pressures) or select a baseline preset:',
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
      ? `📋 **Kullanılan Setup:** Kanatlar: ${currentSetup.frontWing}/${currentSetup.rearWing} | Diff: %${currentSetup.diffOnThrottle} | ARB: ${currentSetup.frontARB}/${currentSetup.rearARB} | Yaylar: ${currentSetup.frontSuspension}/${currentSetup.rearSuspension} | Yükseklik: ${currentSetup.frontRideHeight}/${currentSetup.rearRideHeight} | Lastik: ${currentSetup.frontTyrePressure}/${currentSetup.rearTyrePressure} PSI`
      : `📋 **Current Setup Values:** Wings: ${currentSetup.frontWing}/${currentSetup.rearWing} | Diff: ${currentSetup.diffOnThrottle}% | ARB: ${currentSetup.frontARB}/${currentSetup.rearARB} | Springs: ${currentSetup.frontSuspension}/${currentSetup.rearSuspension} | Ride: ${currentSetup.frontRideHeight}/${currentSetup.rearRideHeight} | Tyres: ${currentSetup.frontTyrePressure}/${currentSetup.rearTyrePressure} PSI`;

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
          ? `Setup değerleriniz kaydedildi ve telemetri modeline işlendi.\n\n⚠️ **Adım 2 (Sorun Girişi):** Pistte tam olarak hangi sürüş veya denge problemini yaşıyorsunuz? (Örn: 'Düzlük hızım az', 'Viraj çıkışında arkası kopuyor')`
          : `Setup baseline telemetry mapped into analytical engine.\n\n⚠️ **Step 2 (Issue Input):** What specific handling problem or issue are you experiencing on track? (e.g., 'Low top speed', 'Rear snap oversteer on corner exit')`,
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
      text: `⚠️ **Sorun:** ${issueLabel}`,
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
          ? `🔧 **Adım 3 (Detaylı Analiz & Hassas Değer Değişimleri):** Girdiğiniz setup sayıları (${currentSetup.frontWing}/${currentSetup.rearWing} kanat, %${currentSetup.diffOnThrottle} diff, ${currentSetup.frontARB}/${currentSetup.rearARB} ARB) ve yaşadığınız problem analiz edildi. İşte yapılması gereken net tık/sayı değişimleri:`
          : `🔧 **Step 3 (Detailed Analysis & Incremental Tweaks):** Telemetry evaluated against your specific setup numbers (${currentSetup.frontWing}/${currentSetup.rearWing} wings, ${currentSetup.diffOnThrottle}% diff, ${currentSetup.frontARB}/${currentSetup.rearARB} ARBs). Here are the exact click-by-click adjustments:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        step: 3,
        diagnosis: diagnosis,
        selectedTrack: selectedTrack,
        setupSnapshot: { ...currentSetup },
      };
      setMessages((prev) => [...prev, engMsg]);
    }, 700);
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
          ? `🔧 **Adım 3 (Detaylı Analiz & Değer Değişimleri):** "${query}" sorununuz mevcut setup değerlerinize göre simüle edildi. Önerilen net değişimler:`
          : `🔧 **Step 3 (Detailed Analysis & Exact Tweaks):** Analyzed "${query}" against your exact setup numbers. Here are the precise parameter changes:`,
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
    setMessages([getGreetingMessage()]);
  };

  // Copy diagnosis with exact numbers
  const handleCopySetup = (id: string, diagnosis: DiagnosisResult) => {
    const textToCopy =
      `=== ${diagnosis.title} ===\n${diagnosis.summary}\n\n` +
      `${isTr ? 'ÖNERİLEN NET SAYISAL DEĞİŞİMLER:' : 'EXACT NUMERICAL ADJUSTMENTS:'}\n` +
      diagnosis.adjustments
        .map((a) => `• [${a.category}] ${a.parameter}: ${a.currentValue} -> ${a.recommendedValue} (${a.changeDelta}) | ${a.impact}`)
        .join('\n') +
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
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse absolute -top-1 -right-1" />
            <div className="w-6 h-6 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight">
                {isTr ? 'F1 Setup Mühendisi' : 'F1 Setup Engineer'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                AI 3-Step
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">
              {isTr ? 'Setup Gir -> Sorun Seç -> Analiz Al' : 'Setup -> Issue -> Exact Tweaks'}
            </span>
          </div>

          {hasUnread && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-1" />
          )}
        </motion.button>
      </div>

      {/* Main 3-Step Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 transition-all duration-300 ${
              isExpanded
                ? 'inset-2 sm:inset-6 md:inset-8 max-w-5xl mx-auto h-[92vh]'
                : 'bottom-16 left-2 sm:left-4 w-[calc(100vw-1rem)] sm:w-[500px] max-h-[86vh] h-[680px]'
            } bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 border border-red-400/30 flex items-center justify-center text-white shadow-md shadow-red-600/20">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
                      {isTr ? 'F1 Setup Baş Mühendisi' : 'F1 Chief Race Engineer'}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {isTr ? 'CANLI TELEMETRİ' : 'LIVE TELEMETRY'}
                      </span>
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <TrackFlagIcon trackId={selectedTrack} size="xs" />
                    <span>{currentTrackObj.name}</span>
                    <span>•</span>
                    <span className="text-red-400 font-medium">
                      {isTr ? 'Adım Adım İnce Ayar Botu' : 'Step-by-Step Tweak Bot'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title={isTr ? 'Baştan Başlat (Adım 1)' : 'Restart from Step 1'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? (isTr ? 'Küçült' : 'Minimize') : (isTr ? 'Genişlet' : 'Expand')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={isTr ? 'Kapat' : 'Close'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3-Step Visual Progress Bar */}
            <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[10px] select-none shrink-0">
              <div className="flex items-center gap-1.5 w-full">
                <div
                  className={`flex-1 py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStep === 1
                      ? 'bg-red-600/30 border-red-500 text-red-300 shadow-sm'
                      : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  <span>1. {isTr ? 'Setup Girişi' : 'Setup Input'}</span>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

                <div
                  className={`flex-1 py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStep === 2
                      ? 'bg-red-600/30 border-red-500 text-red-300 shadow-sm'
                      : currentStep > 2
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>2. {isTr ? 'Sorun Bildirimi' : 'Issue Input'}</span>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

                <div
                  className={`flex-1 py-1 px-2 rounded-md font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStep === 3
                      ? 'bg-red-600/30 border-red-500 text-red-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>3. {isTr ? 'Detaylı Analiz & Ayarlar' : 'Analysis & Tweaks'}</span>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  <div
                    className={`max-w-[96%] sm:max-w-[90%] rounded-2xl p-3 sm:p-3.5 shadow-md leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-xs'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {/* Engineer Radio Header */}
                    {msg.sender === 'engineer' && (
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/80 text-[10px] text-red-400 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>{isTr ? 'MÜHENDİS GIANPIERO' : 'RACE ENGINEER GIANPIERO'}</span>
                        </div>
                        {msg.step && (
                          <span className="text-slate-400 font-mono">
                            {isTr ? `ADIM ${msg.step}/3` : `STEP ${msg.step}/3`}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message content */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.text.split('\n\n').map((para, i) => (
                        <p key={i} className="text-slate-200 leading-normal">
                          {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      ))}
                    </div>

                    {/* STEP 1: Interactive Setup Value Input Panel */}
                    {msg.step === 1 && currentStep === 1 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/90 space-y-3">
                        {/* Preset Quick Loadout Chips */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300">
                              {isTr ? 'Hızlı Setup Şablonu Yükle:' : 'Quick Baseline Presets:'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setPasteMode(!pasteMode)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <ClipboardPaste className="w-3 h-3" />
                              <span>{pasteMode ? (isTr ? 'Arayüze Dön' : 'Back to Sliders') : (isTr ? 'Metin Yapıştır' : 'Paste Text')}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            {Object.entries(DEFAULT_SETUP_PRESETS).map(([key, preset]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handleApplyPreset(key)}
                                className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-left transition-all cursor-pointer truncate ${
                                  activePresetKey === key
                                    ? 'bg-red-600/30 border-red-500 text-red-200 shadow-xs'
                                    : 'bg-slate-900 border-slate-850 hover:border-slate-700 text-slate-300'
                                }`}
                              >
                                {isTr ? preset.labelTr : preset.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Paste Box Mode */}
                        {pasteMode ? (
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                            <label className="text-[10px] font-bold text-slate-300 block">
                              {isTr ? 'Setup Metnini veya Rakamlarını Yapıştırın:' : 'Paste Setup Text or Numbers:'}
                            </label>
                            <textarea
                              rows={2}
                              value={pastedSetupText}
                              onChange={(e) => setPastedSetupText(e.target.value)}
                              placeholder={isTr ? 'Örn: Kanat: 38-34, Diff: %58, ARB: 8-5, Lastikler: 22.5 PSI...' : 'e.g., Wings: 38-34, Diff: 58%, ARB: 8-5, Tyres: 22.5 PSI...'}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-red-500"
                            />
                            <button
                              type="button"
                              onClick={handleParsePastedSetup}
                              className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer transition-all"
                            >
                              {isTr ? 'Değerleri Uygula' : 'Apply Parsed Values'}
                            </button>
                          </div>
                        ) : (
                          /* Interactive Steppers / Sliders Grid */
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                            {/* Aerodynamics */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-sky-400">
                                <span>🌪️ {isTr ? 'Aerodinamik (Ön / Arka Kanat)' : 'Aerodynamics (Front / Rear Wing)'}</span>
                                <span className="font-mono text-slate-200">{currentSetup.frontWing} - {currentSetup.rearWing}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'Ön:' : 'Front:'}</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={currentSetup.frontWing}
                                    onChange={(e) => handleUpdateSetupField('frontWing', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'Arka:' : 'Rear:'}</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={currentSetup.rearWing}
                                    onChange={(e) => handleUpdateSetupField('rearWing', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Transmission / Differential */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                                <span>⚙️ {isTr ? 'Diferansiyel (Gaz Açık / Kapalı %)' : 'Differential (On / Off Throttle %)'}</span>
                                <span className="font-mono text-slate-200">%{currentSetup.diffOnThrottle} / %{currentSetup.diffOffThrottle}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'On %:' : 'On %:'}</span>
                                  <input
                                    type="number"
                                    min={50}
                                    max={100}
                                    value={currentSetup.diffOnThrottle}
                                    onChange={(e) => handleUpdateSetupField('diffOnThrottle', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'Off %:' : 'Off %:'}</span>
                                  <input
                                    type="number"
                                    min={50}
                                    max={100}
                                    value={currentSetup.diffOffThrottle}
                                    onChange={(e) => handleUpdateSetupField('diffOffThrottle', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Suspension ARB */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                                <span>🔄 {isTr ? 'Viraj Demiri ARB (Ön / Arka)' : 'Anti-Roll Bars (Front / Rear ARB)'}</span>
                                <span className="font-mono text-slate-200">{currentSetup.frontARB} - {currentSetup.rearARB}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'Ön ARB:' : 'Front:'}</span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={11}
                                    value={currentSetup.frontARB}
                                    onChange={(e) => handleUpdateSetupField('frontARB', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <span className="text-[9px] text-slate-400">{isTr ? 'Arka ARB:' : 'Rear:'}</span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={11}
                                    value={currentSetup.rearARB}
                                    onChange={(e) => handleUpdateSetupField('rearARB', Number(e.target.value))}
                                    className="w-full bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Ride Height & Tyres */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 mb-0.5">
                                  {isTr ? 'Taban Yüksekliği:' : 'Ride Height:'}
                                </div>
                                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <input
                                    type="number"
                                    value={currentSetup.frontRideHeight}
                                    onChange={(e) => handleUpdateSetupField('frontRideHeight', Number(e.target.value))}
                                    className="w-10 bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                  <span className="text-slate-500">/</span>
                                  <input
                                    type="number"
                                    value={currentSetup.rearRideHeight}
                                    onChange={(e) => handleUpdateSetupField('rearRideHeight', Number(e.target.value))}
                                    className="w-10 bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 mb-0.5">
                                  {isTr ? 'Lastik Basıncı (PSI):' : 'Tyre Pressures (PSI):'}
                                </div>
                                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                  <input
                                    type="number"
                                    step={0.1}
                                    value={currentSetup.frontTyrePressure}
                                    onChange={(e) => handleUpdateSetupField('frontTyrePressure', Number(e.target.value))}
                                    className="w-12 bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                  <span className="text-slate-500">/</span>
                                  <input
                                    type="number"
                                    step={0.1}
                                    value={currentSetup.rearTyrePressure}
                                    onChange={(e) => handleUpdateSetupField('rearTyrePressure', Number(e.target.value))}
                                    className="w-12 bg-transparent text-xs font-bold text-slate-100 focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 1 Confirm Button */}
                        <button
                          type="button"
                          onClick={handleConfirmSetupStep1}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <span>{isTr ? '✅ Bu Setup Değerleriyle Devam Et (Adım 2)' : '✅ Confirm Setup & Proceed (Step 2)'}</span>
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
                              {isTr ? 'Hassas Sayısal Değişim Tablosu:' : 'Precise Numerical Tweak Table:'}
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
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                                        adj.category === 'Aero'
                                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                          : adj.category === 'Transmission'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                          : adj.category === 'Suspension'
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                          : adj.category === 'Brakes'
                                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
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
                                  ? 'Aynı setup üzerinde başka hangi virajda veya durumda sorun yaşıyorsun? (Örn: "Düzlük hızım az", "Kerblerde zıplıyor")'
                                  : 'On this setup, what other handling issue are you experiencing? (e.g. "Low top speed", "Bouncing on kerbs")',
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
                    {isTr ? 'Mühendis telemetriyi analiz ediyor...' : 'Engineer analyzing telemetry...'}
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
                      ? 'Setup değerlerini yazın (Örn: Ön 38, Arka 34, Diff %58)...'
                      : 'Type setup values (e.g. Front 38, Rear 34, Diff 58%)...'
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
