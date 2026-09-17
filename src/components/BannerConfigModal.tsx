import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw,
  Sparkles,
  Trophy,
  Zap,
  Flag,
  Plus,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { FloatingBannerConfig, FloatingBannerItem } from '../types';
import { DEFAULT_FLOATING_BANNER_CONFIG, DEFAULT_FLOATING_BANNER_ITEMS } from '../data/bannerConfig';
import { DiscordIcon } from './FloatingBanner';

interface BannerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FloatingBannerConfig;
  onSaveConfig: (updated: FloatingBannerConfig) => void;
}

export const BannerConfigModal: React.FC<BannerConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  // Ensure items list is initialized
  const initialItems = React.useMemo(() => {
    if (config.items && config.items.length > 0) return config.items;
    if (config.title || config.description) {
      return [
        {
          id: 'slide-1',
          title: config.title || 'Join PRL League',
          highlightText: config.highlightText || 'Official League',
          description: config.description || 'Access exclusive PRL League setups, race results, and connect with fellow league drivers.',
          buttonText: config.buttonText || 'Join PRL League',
          buttonUrl: config.buttonUrl || 'https://discord.gg/aFzAhfBy3',
          badgeText: config.badgeText || 'ADVERTISEMENT',
          onlineCount: config.onlineCount || 428,
          iconType: config.iconType || 'discord',
          customIconUrl: config.customIconUrl,
          accentColor: config.accentColor || 'indigo',
        },
      ];
    }
    return DEFAULT_FLOATING_BANNER_ITEMS;
  }, [config]);

  const [formData, setFormData] = useState<FloatingBannerConfig>({
    ...config,
    items: initialItems,
    autoRotate: config.autoRotate !== false,
    intervalSeconds: config.intervalSeconds || 3,
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentItems = formData.items && formData.items.length > 0 ? formData.items : DEFAULT_FLOATING_BANNER_ITEMS;
  const safeSlideIndex = Math.min(Math.max(0, activeSlideIndex), currentItems.length - 1);
  const currentSlide = currentItems[safeSlideIndex] || currentItems[0];

  const handleUpdateCurrentSlide = (field: keyof FloatingBannerItem, value: any) => {
    const updated = currentItems.map((item, idx) => {
      if (idx === safeSlideIndex) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({
      ...formData,
      items: updated,
      // sync top-level backwards compatibility fields with slide 0
      ...(safeSlideIndex === 0 ? { [field]: value } : {}),
    });
  };

  const handleAddSlide = () => {
    const newSlide: FloatingBannerItem = {
      id: `slide-${Date.now()}`,
      title: 'New Announcement / Deal',
      highlightText: 'Featured',
      description: 'Highlight hot setups, tournament registration, or Discord announcements here.',
      buttonText: 'Check It Out',
      buttonUrl: 'https://discord.gg/aFzAhfBy3',
      badgeText: 'NEW',
      onlineCount: 250,
      iconType: 'sparkles',
      accentColor: 'indigo',
    };
    const updated = [...currentItems, newSlide];
    setFormData({ ...formData, items: updated });
    setActiveSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (idxToDelete: number) => {
    if (currentItems.length <= 1) {
      alert('You must have at least one announcement slide.');
      return;
    }
    const updated = currentItems.filter((_, idx) => idx !== idxToDelete);
    setFormData({ ...formData, items: updated });
    setActiveSlideIndex(Math.max(0, idxToDelete - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_FLOATING_BANNER_CONFIG });
    setActiveSlideIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Floating Announcement &amp; Ad Slideshow Manager
              </h3>
              <p className="text-xs text-slate-400">
                Configure rotating banner slides, auto-rotation timer, links, and badges.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Global Controls: Enable & Auto-Rotate Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            {/* Enabled Switch */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Enable Floating Banner</span>
                <span className="text-[11px] text-slate-400">Display widget on bottom-right</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5865F2]"></div>
              </label>
            </div>

            {/* Auto Rotate & Interval */}
            <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
              <div>
                <span className="text-xs font-bold text-white block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Auto-Rotate Interval
                </span>
                <span className="text-[11px] text-slate-400">Switch slides automatically</span>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={formData.intervalSeconds || 5}
                  onChange={(e) =>
                    setFormData({ ...formData, intervalSeconds: parseInt(e.target.value, 10) })
                  }
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>3 sec</option>
                  <option value={5}>5 sec (Default)</option>
                  <option value={7}>7 sec</option>
                  <option value={10}>10 sec</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slide Tabs Navigation & Add Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Slideshow Queue</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                  {currentItems.length} Slide{currentItems.length > 1 ? 's' : ''}
                </span>
              </span>
              <button
                type="button"
                onClick={handleAddSlide}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {currentItems.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    idx === safeSlideIndex
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>Slide {idx + 1}</span>
                  <span className="max-w-[100px] truncate text-[11px] opacity-75 font-normal">
                    {slide.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide Form Fields */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                Editing Slide #{safeSlideIndex + 1}
              </span>
              {currentItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(safeSlideIndex)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:bg-rose-950/40 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Slide</span>
                </button>
              )}
            </div>

            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slide Title:
                </label>
                <input
                  type="text"
                  required
                  value={currentSlide.title}
                  onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                  placeholder="e.g. Join DDL Setup Discord"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Badge Tag (Optional):
                </label>
                <input
                  type="text"
                  value={currentSlide.badgeText || ''}
                  onChange={(e) => handleUpdateCurrentSlide('badgeText', e.target.value)}
                  placeholder="e.g. HOT COMMUNITY, PRIZE POOL"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description Body:
              </label>
              <textarea
                rows={2}
                required
                value={currentSlide.description}
                onChange={(e) => handleUpdateCurrentSlide('description', e.target.value)}
                placeholder="Short catchy explanation of announcements or benefits..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            {/* Button Text & Target URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Button Action Label:
                </label>
                <input
                  type="text"
                  required
                  value={currentSlide.buttonText}
                  onChange={(e) => handleUpdateCurrentSlide('buttonText', e.target.value)}
                  placeholder="e.g. Join Discord, View Hotlaps"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Online Member Count (Optional):
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentSlide.onlineCount || 0}
                  onChange={(e) =>
                    handleUpdateCurrentSlide('onlineCount', parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                />
              </div>
            </div>

            {/* Button URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Button Target Link / Discord Invite:
              </label>
              <input
                type="text"
                required
                value={currentSlide.buttonUrl}
                onChange={(e) => handleUpdateCurrentSlide('buttonUrl', e.target.value)}
                placeholder="https://discord.gg/... or #marketplace"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            {/* Color & Icon Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slide Icon:
                </label>
                <select
                  value={currentSlide.iconType}
                  onChange={(e) => handleUpdateCurrentSlide('iconType', e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                >
                  <option value="discord">Discord Icon</option>
                  <option value="trophy">Trophy (Esports / Laps)</option>
                  <option value="sparkles">Sparkles (Featured / New)</option>
                  <option value="zap">Zap (Pro Tuning / Speed)</option>
                  <option value="flag">Racing Flag (Championship)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color Accent Theme:
                </label>
                <select
                  value={currentSlide.accentColor || 'indigo'}
                  onChange={(e) => handleUpdateCurrentSlide('accentColor', e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                >
                  <option value="indigo">Discord Blurple / Indigo</option>
                  <option value="amber">Amber Gold</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="cyan">Cyan Telemetry</option>
                  <option value="red">Racing Red</option>
                  <option value="purple">Esports Purple</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default Slides</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg shadow-[#5865F2]/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saveSuccess ? 'Saved!' : 'Save Slideshow Config'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
