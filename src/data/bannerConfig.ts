import { FloatingBannerConfig, FloatingBannerItem } from '../types';

export const DEFAULT_FLOATING_BANNER_ITEMS: FloatingBannerItem[] = [
  {
    id: 'prl-league-ad',
    title: 'Join PRL League',
    highlightText: 'Official League',
    description: 'Access exclusive PRL League setups, race results, and connect with fellow league drivers.',
    buttonText: 'Join PRL League',
    buttonUrl: 'https://discord.gg/aFzAhfBy3',
    badgeText: 'ADVERTISEMENT',
    onlineCount: 428,
    iconType: 'discord',
    accentColor: 'indigo',
  },
  {
    id: 'custom-announcement-slot',
    title: 'Custom Announcement Slot',
    highlightText: 'Custom Slot',
    description: 'Easily customize this slot with your partner links, sponsors, race leagues, or setup guides.',
    buttonText: 'Configure Link',
    buttonUrl: 'https://discord.gg/aFzAhfBy3',
    badgeText: 'ANNOUNCEMENT',
    onlineCount: 150,
    iconType: 'sparkles',
    accentColor: 'amber',
  },
];

export const DEFAULT_FLOATING_BANNER_CONFIG: FloatingBannerConfig = {
  enabled: true,
  autoRotate: true,
  intervalSeconds: 5,
  items: DEFAULT_FLOATING_BANNER_ITEMS,
  // Fallbacks for backwards compatibility
  title: DEFAULT_FLOATING_BANNER_ITEMS[0].title,
  highlightText: DEFAULT_FLOATING_BANNER_ITEMS[0].highlightText,
  description: DEFAULT_FLOATING_BANNER_ITEMS[0].description,
  buttonText: DEFAULT_FLOATING_BANNER_ITEMS[0].buttonText,
  buttonUrl: DEFAULT_FLOATING_BANNER_ITEMS[0].buttonUrl,
  badgeText: DEFAULT_FLOATING_BANNER_ITEMS[0].badgeText,
  onlineCount: DEFAULT_FLOATING_BANNER_ITEMS[0].onlineCount,
  iconType: DEFAULT_FLOATING_BANNER_ITEMS[0].iconType,
  accentColor: DEFAULT_FLOATING_BANNER_ITEMS[0].accentColor,
};
