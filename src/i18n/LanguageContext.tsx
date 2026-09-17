import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tr';

export const translations = {
  en: {
    // Header & Brand
    brandSubtitle: 'Official F1 24, F1 25 & F1 26 Setup Marketplace',
    setupsTab: 'Setups',
    favoritesTab: 'Favorites',
    adminReview: 'Admin Review',
    panelBadge: 'Panel',
    submitSetup: 'Submit Setup',
    signIn: 'Sign In',
    register: 'Register',
    signOut: 'Sign Out',

    // Language selector label
    languageLabel: 'Language',
    turkish: 'Türkçe',
    english: 'English',

    // Marketplace Titles & Filters
    marketplaceTitle: 'F1® Telemetry & Race Setup Database',
    marketplaceSubtitle:
      'Verified esports telemetry setups, lap time screenshots, and setup sheets for F1® 24, F1® 25, and F1® 26.',
    searchPlaceholder: 'Search by track, car, creator or setup notes...',
    allTracks: 'All Tracks',
    allWeather: 'All Weather',
    dryOnly: 'Dry Setups',
    wetOnly: 'Wet Setups',
    intermediate: 'Intermediate',
    allTypes: 'All Types',
    timeTrial: 'Time Trial',
    race: 'Race',
    qualifying: 'Qualifying',

    // Sort options
    sortBy: 'Sort By',
    highestRated: 'Highest Rated',
    mostRecent: 'Most Recent',
    topSpeed: 'Top Speed',
    mostFavorited: 'Most Favorited',
    mostDownloaded: 'Most Downloaded',
    verifiedOnly: 'Verified Only',

    // Status Badges
    telemetryVerified: 'Telemetry Verified',
    verifiedProof: 'Proof Verified',
    pendingVerification: 'Pending Verification',
    rejected: 'Rejected',

    // Setup Card & Modal
    viewSetup: 'View Setup',
    setupCopied: 'Setup Copied!',
    downloadSetup: 'Download Setup',
    bestLapTime: 'Best Lap Time',
    downforceLevel: 'Downforce',
    creator: 'Creator',
    addedDate: 'Added',
    downloads: 'Downloads',
    favorites: 'Favorites',

    // Tuning Spec Categories
    aerodynamics: 'Aerodynamics',
    frontWing: 'Front Wing Aero',
    rearWing: 'Rear Wing Aero',

    transmission: 'Transmission & Differential',
    diffOnThrottle: 'Diff On Throttle',
    diffOffThrottle: 'Diff Off Throttle',

    suspensionGeometry: 'Suspension Geometry',
    frontCamber: 'Front Camber',
    rearCamber: 'Rear Camber',
    frontToe: 'Front Toe',
    rearToe: 'Rear Toe',

    suspension: 'Suspension & Anti-Roll Bar',
    frontSuspension: 'Front Suspension',
    rearSuspension: 'Rear Suspension',
    frontAntiRollBar: 'Front Anti-Roll Bar',
    rearAntiRollBar: 'Rear Anti-Roll Bar',
    frontRideHeight: 'Front Ride Height',
    rearRideHeight: 'Rear Ride Height',

    brakes: 'Brakes',
    brakePressure: 'Brake Pressure',
    brakeBias: 'Brake Bias',

    tyres: 'Tyre Pressures',
    frontLeftTyre: 'Front Left',
    frontRightTyre: 'Front Right',
    rearLeftTyre: 'Rear Left',
    rearRightTyre: 'Rear Right',

    notesAndStrategy: 'Creator Notes & Strategy',
    reviewsAndDiscussions: 'Discussions & Reviews',
    writeReviewPlaceholder: 'Share feedback or ask questions about this setup...',
    submitReview: 'Post Review',
    noReviewsYet: 'No reviews yet for this setup. Be the first to post feedback!',

    // Submit Modal
    submitModalTitle: 'Submit F1 Setup Sheet & Telemetry',
    submitModalSubtitle: 'Share your esports setup with lap time proof and telemetry screenshots.',
    setupTitleLabel: 'Setup Title',
    gameLabel: 'Game Version',
    trackLabel: 'Track Location',
    carLabel: 'Car Model',
    lapTimeLabel: 'Best Lap Time (e.g. 1:28.452)',
    conditionLabel: 'Weather Condition',
    typeLabel: 'Session Type',
    notesLabel: 'Setup Notes / Driving Tips',
    proofScreenshotLabel: 'Lap Time / Telemetry Screenshot Proof',
    submitButtonText: 'Submit Setup for Verification',
    closeModal: 'Close',

    // Weather & Track Conditions
    dryWeather: 'Dry Weather',
    wetWeather: 'Wet Weather',
    trackConditionAll: 'TRACK CONDITION: All',
    trackConditionDry: 'TRACK CONDITION: Dry',
    trackConditionWet: 'TRACK CONDITION: Wet',

    // Verification & Setup Types
    adminVerified: 'Admin Verified',
    pending: 'Pending',
    racePace: 'Race Pace',
    showing: 'Showing',
    setupsCountText: 'setups',
    filterAll: 'All',

    // Card Actions & Buttons
    copySetup: 'Copy Setup',
    copiedSetup: 'Copied',
    discuss: 'Discuss',
    edit: 'Edit',
    delete: 'Delete',
    viewDetails: 'View Details',

    // Ratings & Reviews
    noRatingsYet: 'No ratings yet',
    ratedStar: 'Rated',
    reviewsCountText: 'reviews',
    rateButton: '+ Rate',

    // Hero Header
    activeGameLabel: 'ACTIVE GAME:',

    // Floating Banner Ads
    adBadgeText: 'ADVERTISEMENT',
    announcementBadge1: 'ANNOUNCEMENT 1',
    announcementBadge2: 'ANNOUNCEMENT 2',
    sponsorBadge: 'SPONSOR / AD',
    onlineText: 'online',

    // No Results
    noSetupsFound: 'No setups found matching your active filters.',
    resetFilters: 'Reset All Filters',
  },
  tr: {
    // Header & Brand
    brandSubtitle: 'Resmî F1 24, F1 25 ve F1 26 Setup Pazarı',
    setupsTab: 'Setuplar',
    favoritesTab: 'Favoriler',
    adminReview: 'Admin İnceleme',
    panelBadge: 'Panel',
    submitSetup: 'Setup Gönder',
    signIn: 'Giriş Yap',
    register: 'Kayıt Ol',
    signOut: 'Çıkış Yap',

    // Language selector label
    languageLabel: 'Dil',
    turkish: 'Türkçe',
    english: 'English',

    // Marketplace Titles & Filters
    marketplaceTitle: 'F1® Telemetri ve Yarış Setup Veritabanı',
    marketplaceSubtitle:
      'F1® 24, F1® 25 ve F1® 26 için doğrulanmış espor telemetri setupları, tur zamanı ekran görüntüleri ve ayar sayfaları.',
    searchPlaceholder: 'Pist, araç, geliştirici veya setup notlarına göre ara...',
    allTracks: 'Tüm Pistler',
    allWeather: 'Tüm Hava Durumu',
    dryOnly: 'Kuru Zemin Setupları',
    wetOnly: 'Islak Zemin Setupları',
    intermediate: 'Geçiş / Orta Islak',
    allTypes: 'Tüm Setup Tipleri',
    timeTrial: 'Zaman Turu',
    race: 'Yarış',
    qualifying: 'Sıralama',

    // Weather & Track Conditions
    dryWeather: 'Kuru Hava',
    wetWeather: 'Yağışlı Hava',
    trackConditionAll: 'PİST DURUMU: Tümü',
    trackConditionDry: 'PİST DURUMU: Kuru',
    trackConditionWet: 'PİST DURUMU: Yağışlı',

    // Verification & Setup Types
    adminVerified: 'Admin Onaylı',
    pending: 'Beklemede',
    racePace: 'Yarış Temposu',
    showing: 'Gösterilen',
    setupsCountText: 'adet setup',
    filterAll: 'Tümü',

    // Card Actions & Buttons
    copySetup: "Setup'u Kopyala",
    copiedSetup: 'Kopyalandı',
    discuss: 'Tartışma',
    edit: 'Düzenle',
    delete: 'Sil',
    viewDetails: 'Detayları Gör',

    // Ratings & Reviews
    noRatingsYet: 'Henüz puan yok',
    ratedStar: 'Puan',
    reviewsCountText: 'değerlendirme',
    rateButton: '+ Puan Ver',

    // Hero Header
    activeGameLabel: 'AKTİF OYUN:',

    // Sort options
    sortBy: 'Sırala',
    highestRated: 'En Yüksek Puan',
    mostRecent: 'En Yeniler',
    topSpeed: 'En Yüksek Hız',
    mostFavorited: 'En Çok Favorilenen',
    mostDownloaded: 'En Çok İndirilen',
    verifiedOnly: 'Sadece Doğrulanmışlar',

    // Status Badges
    telemetryVerified: 'Telemetri Doğrulanmış',
    verifiedProof: 'Kanıt Doğrulandı',
    pendingVerification: 'Doğrulama Bekliyor',
    rejected: 'Reddedildi',

    // Setup Card & Modal
    viewSetup: "Setup'ı İncele",
    setupCopied: 'Setup Kopyalandı!',
    downloadSetup: 'Setup\'ı İndir',
    bestLapTime: 'En İyi Tur Zamanı',
    downforceLevel: 'Basma Kuvveti (Downforce)',
    creator: 'Geliştirici',
    addedDate: 'Eklendi',
    downloads: 'İndirmeler',
    favorites: 'Favoriler',

    // Tuning Spec Categories
    aerodynamics: 'Aerodinami',
    frontWing: 'Ön Kanat Aerodinami',
    rearWing: 'Arka Kanat Aerodinami',

    transmission: 'Şanzıman ve Diferansiyel',
    diffOnThrottle: 'Hızlanmada Diferansiyel (On-Throttle)',
    diffOffThrottle: 'Yavaşlamada Diferansiyel (Off-Throttle)',

    suspensionGeometry: 'Süspansiyon Geometrisi',
    frontCamber: 'Ön Kamber',
    rearCamber: 'Arka Kamber',
    frontToe: 'Ön Toe',
    rearToe: 'Arka Toe',

    suspension: 'Süspansiyon ve Viraj Demiri',
    frontSuspension: 'Ön Süspansiyon',
    rearSuspension: 'Arka Süspansiyon',
    frontAntiRollBar: 'Ön Viraj Demiri (ARB)',
    rearAntiRollBar: 'Arka Viraj Demiri (ARB)',
    frontRideHeight: 'Ön Araç Yüksekliği',
    rearRideHeight: 'Arka Araç Yüksekliği',

    brakes: 'Frenler',
    brakePressure: 'Fren Basıncı',
    brakeBias: 'Ön Fren Dengesi (Bias)',

    tyres: 'Lastik Basınçları',
    frontLeftTyre: 'Sol Ön Lastik',
    frontRightTyre: 'Sağ Ön Lastik',
    rearLeftTyre: 'Sol Arka Lastik',
    rearRightTyre: 'Sağ Arka Lastik',

    notesAndStrategy: 'Geliştirici Notları ve Strateji',
    reviewsAndDiscussions: 'Tartışmalar ve Değerlendirmeler',
    writeReviewPlaceholder: 'Bu setup hakkında görüşlerinizi paylaşın veya soru sorun...',
    submitReview: 'Yorum Yayınla',
    noReviewsYet: 'Bu setup için henüz yorum yazılmadı. İlk yorum yapan siz olun!',

    // Submit Modal
    submitModalTitle: 'F1 Setup Sayfası ve Telemetri Gönder',
    submitModalSubtitle: 'Espor setup ayarlarınızı tur zamanı kanıtı ve telemetri ekran görüntüleri ile paylaşın.',
    setupTitleLabel: 'Setup Başlığı',
    gameLabel: 'Oyun Sürümü',
    trackLabel: 'Pist Seçimi',
    carLabel: 'Araç Modeli',
    lapTimeLabel: 'En İyi Tur Zamanı (Örn. 1:28.452)',
    conditionLabel: 'Hava Durumu',
    typeLabel: 'Seans Tipi',
    notesLabel: 'Setup Notları / Sürüş İpuçları',
    proofScreenshotLabel: 'Tur Zamanı / Telemetri Ekran Görüntüsü Kanıtı',
    submitButtonText: 'Setup\'ı İncelemeye Gönder',
    closeModal: 'Kapat',

    // Floating Banner Ads
    adBadgeText: 'REKLAM',
    announcementBadge1: 'DUYURU 1',
    announcementBadge2: 'DUYURU 2',
    sponsorBadge: 'SPONSOR / REKLAM',
    onlineText: 'çevrim içi',

    // No Results
    noSetupsFound: 'Filtrelerinize uygun setup bulunamadı.',
    resetFilters: 'Tüm Filtreleri Sıfırla',
  },
};

export const countryTranslations: Record<string, string> = {
  Belgium: 'Belçika',
  'Great Britain': 'Büyük Britanya',
  Italy: 'İtalya',
  Spain: 'İspanya',
  Netherlands: 'Hollanda',
  Japan: 'Japonya',
  Bahrain: 'Bahreyn',
  'Saudi Arabia': 'Suudi Arabistan',
  Australia: 'Avustralya',
  China: 'Çin',
  Miami: 'Miami',
  Monaco: 'Monako',
  Canada: 'Kanada',
  Austria: 'Avusturya',
  Hungary: 'Macaristan',
  Singapore: 'Singapur',
  'United States': 'Amerika Birleşik Devletleri',
  Mexico: 'Meksika',
  Brazil: 'Brezilya',
  'Las Vegas': 'Las Vegas',
  Qatar: 'Katar',
  'Abu Dhabi': 'Abu Dabi',
  Azerbaijan: 'Azerbaycan',
};

export function translateLocation(country: string, lang: Language): string {
  if (lang === 'tr' && countryTranslations[country]) {
    return countryTranslations[country];
  }
  return country;
}

export type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ddl_language');
      if (saved === 'tr' || saved === 'en') return saved;
    } catch {
      // ignore fallback
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ddl_language', language);
    } catch {
      // ignore
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
