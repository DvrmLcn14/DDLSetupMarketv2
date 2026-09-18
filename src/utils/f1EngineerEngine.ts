import { TRACKS } from '../data/mockData';
import { Language } from '../i18n/LanguageContext';

export interface DriverSetupValues {
  frontWing: number; // e.g. 38 (0-50)
  rearWing: number; // e.g. 34 (0-50)
  diffOnThrottle: number; // e.g. 58 (50-100%)
  diffOffThrottle: number; // e.g. 52 (50-100%)
  frontARB: number; // e.g. 8 (1-11)
  rearARB: number; // e.g. 5 (1-11)
  frontSuspension: number; // e.g. 30 (1-41)
  rearSuspension: number; // e.g. 22 (1-41)
  frontRideHeight: number; // e.g. 35 (30-50)
  rearRideHeight: number; // e.g. 40 (30-60)
  brakeBias: number; // e.g. 55 (50-70%)
  brakePressure: number; // e.g. 100 (80-100%)
  frontTyrePressure: number; // e.g. 22.5 (20.0-25.5 PSI)
  rearTyrePressure: number; // e.g. 20.5 (19.0-24.5 PSI)
}

export const DEFAULT_SETUP_PRESETS: Record<string, { labelTr: string; labelEn: string; values: DriverSetupValues }> = {
  balanced: {
    labelTr: '⚖️ Dengeli / Standart Espor (36-32)',
    labelEn: '⚖️ Balanced / Standard Esports (36-32)',
    values: {
      frontWing: 36,
      rearWing: 32,
      diffOnThrottle: 58,
      diffOffThrottle: 52,
      frontARB: 8,
      rearARB: 5,
      frontSuspension: 30,
      rearSuspension: 22,
      frontRideHeight: 35,
      rearRideHeight: 40,
      brakeBias: 55,
      brakePressure: 100,
      frontTyrePressure: 22.5,
      rearTyrePressure: 20.5,
    },
  },
  high_downforce: {
    labelTr: '🏙️ Yüksek Kanat / Şehir Pisti (46-42)',
    labelEn: '🏙️ High Downforce / Street Circuit (46-42)',
    values: {
      frontWing: 46,
      rearWing: 42,
      diffOnThrottle: 54,
      diffOffThrottle: 50,
      frontARB: 6,
      rearARB: 3,
      frontSuspension: 24,
      rearSuspension: 18,
      frontRideHeight: 36,
      rearRideHeight: 41,
      brakeBias: 55,
      brakePressure: 100,
      frontTyrePressure: 22.5,
      rearTyrePressure: 20.5,
    },
  },
  low_drag: {
    labelTr: '🚀 Düşük Drag / Hız Tapınağı (24-19)',
    labelEn: '🚀 Low Drag / Speed Temple (24-19)',
    values: {
      frontWing: 24,
      rearWing: 19,
      diffOnThrottle: 60,
      diffOffThrottle: 54,
      frontARB: 9,
      rearARB: 6,
      frontSuspension: 34,
      rearSuspension: 26,
      frontRideHeight: 33,
      rearRideHeight: 38,
      brakeBias: 54,
      brakePressure: 100,
      frontTyrePressure: 23.0,
      rearTyrePressure: 21.0,
    },
  },
};

export interface SetupAdjustment {
  category: 'Aero' | 'Transmission' | 'Geometry' | 'Suspension' | 'Brakes' | 'Tyres';
  parameter: string;
  currentValue: string | number;
  recommendedValue: string | number;
  changeDelta: string;
  adjustment: string;
  impact: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface DiagnosisResult {
  title: string;
  summary: string;
  problemAnalysis: string;
  adjustments: SetupAdjustment[];
  telemetryTip: string;
  quickActionSummary: string;
}

export interface HandlingIssue {
  id: string;
  label: string;
  category: 'oversteer' | 'understeer' | 'speed' | 'braking' | 'tyres' | 'kerbs' | 'wet';
  icon: string;
  description: string;
}

export function getCommonHandlingIssues(lang: Language = 'tr'): HandlingIssue[] {
  const isTr = lang === 'tr';
  return [
    {
      id: 'lack_of_top_speed',
      label: isTr ? 'Düzlük Hızım Yetersiz / Aşırı Drag' : 'Low Top Speed / Excessive Drag',
      category: 'speed',
      icon: '🚀',
      description: isTr
        ? 'Düzlüklerde ve DRS bölgelerinde rakiplere göre son hızım düşük kalıyor.'
        : 'Struggling with top speed and straight-line acceleration on DRS straights.',
    },
    {
      id: 'exit_oversteer',
      label: isTr ? 'Viraj Çıkışında Arkadan Kayma / Arkası Kopuyor (Snap Oversteer)' : 'Rear Instability on Exit / Rear Snapping Out',
      category: 'oversteer',
      icon: '🏎️',
      description: isTr
        ? 'Apexten çıkarken gaza basıldığında arka tekerleklerin aniden tutuşu bırakması.'
        : 'The rear snaps or steps out when applying throttle upon corner exit.',
    },
    {
      id: 'low_speed_understeer',
      label: isTr ? 'Yavaş Virajlarda & Şikanlarda Kafadan Kayma (Understeer)' : 'Understeer in Slow Corners & Chicanes (Front Wash)',
      category: 'understeer',
      icon: '🛑',
      description: isTr
        ? 'Direksiyon çevrilmesine rağmen aracın burnu viraja girmiyor, dışa açılıyor.'
        : 'The front tires fail to grip at low speeds, washing out and missing apexes.',
    },
    {
      id: 'high_speed_understeer',
      label: isTr ? 'Hızlı Virajlarda Apexe Oturmama (Aero Understeer)' : 'High-Speed Corner Washout (Aero Understeer)',
      category: 'understeer',
      icon: '🌀',
      description: isTr
        ? 'Yüksek hızlı akıcı virajlarda aracın dışa doğru sürüklenmesi.'
        : 'Car lacks front downforce in high-speed sweeping corners like Copse or Pouhon.',
    },
    {
      id: 'entry_oversteer',
      label: isTr ? 'Viraj Girişinde & Fren Anında Arka Savrulması' : 'Entry Instability & Trail-Braking Oversteer',
      category: 'oversteer',
      icon: '⚡',
      description: isTr
        ? 'Frenleme sırasında ve direksiyon ilk çevrildiğinde arka aksın dengesizleşmesi.'
        : 'Rear axle becomes loose when turning in under deceleration or trail braking.',
    },
    {
      id: 'braking_instability',
      label: isTr ? 'Frenlemede Ön/Arka Kilitlenme (Lock-Up) & Dengesizlik' : 'Brake Lock-Up & Braking Zone Instability',
      category: 'braking',
      icon: '🎯',
      description: isTr
        ? 'Sert frenleme anında ön tekerlekler kilitleniyor veya arka kayıyor.'
        : 'Front wheels lock up easily or the car pulls laterally under heavy braking.',
    },
    {
      id: 'kerb_instability',
      label: isTr ? 'Kerblerde / Bordürlerde Sekme ve Taban Vurma' : 'Instability Over Kerbs & Bottoming Out',
      category: 'kerbs',
      icon: '🚧',
      description: isTr
        ? 'Bordürlerin üstünden geçerken araç zıplıyor ve taban yere vuruyor.'
        : 'Violent bouncing, jarring vibrations, or loss of control when clipping kerbs.',
    },
    {
      id: 'rear_tyre_overheating',
      label: isTr ? 'Arka Lastiklerin Aşırı Isınması & Hızlı Aşınma' : 'Rear Tyre Overheating & Thermal Degradation',
      category: 'tyres',
      icon: '🔥',
      description: isTr
        ? 'Yarış içinde arka lastik sıcaklıkları kırmızıya (105°C+) çıkıyor.'
        : 'Rear surface temps spiking past 105°C, causing early traction loss.',
    },
    {
      id: 'wet_weather_struggle',
      label: isTr ? 'Yağmurlu Zeminde Tutuşsuzluk & Kızaklama' : 'Wet Weather Lack of Traction & Aquaplaning',
      category: 'wet',
      icon: '🌧️',
      description: isTr
        ? 'Islak pistte su birikintilerinde kızaklama ve virajlarda genel tutunma kaybı.'
        : 'Car slides uncontrollably or aquaplanes on standing water puddles.',
    },
  ];
}

export function parseSetupFromText(input: string, base: DriverSetupValues): DriverSetupValues {
  const result = { ...base };
  const str = input.toLowerCase();

  // Try parsing numbers in sequence or regex matches
  const wingMatch = str.match(/kanat[^\d]*(\d+)[^\d]+(\d+)/i) || str.match(/wing[^\d]*(\d+)[^\d]+(\d+)/i);
  if (wingMatch) {
    result.frontWing = parseInt(wingMatch[1], 10);
    result.rearWing = parseInt(wingMatch[2], 10);
  }

  const diffMatch = str.match(/diff[^\d]*(\d+)/i) || str.match(/diferansiyel[^\d]*(\d+)/i);
  if (diffMatch) {
    result.diffOnThrottle = parseInt(diffMatch[1], 10);
  }

  const arbMatch = str.match(/arb[^\d]*(\d+)[^\d]+(\d+)/i) || str.match(/viraj demiri[^\d]*(\d+)[^\d]+(\d+)/i);
  if (arbMatch) {
    result.frontARB = parseInt(arbMatch[1], 10);
    result.rearARB = parseInt(arbMatch[2], 10);
  }

  const brakeMatch = str.match(/fren[^\d]*(\d+)/i) || str.match(/brake[^\d]*(\d+)/i) || str.match(/bias[^\d]*(\d+)/i);
  if (brakeMatch) {
    const val = parseInt(brakeMatch[1], 10);
    if (val >= 50 && val <= 70) result.brakeBias = val;
  }

  return result;
}

export function diagnoseHandlingIssueWithSetup(
  issueIdOrQuery: string,
  setup: DriverSetupValues,
  trackId?: string,
  lang: Language = 'tr'
): DiagnosisResult {
  const isTr = lang === 'tr';
  const track = trackId
    ? TRACKS[trackId] || Object.values(TRACKS).find((t) => t.id === trackId || t.name.toLowerCase().includes(trackId.toLowerCase()))
    : undefined;
  const trackName = track ? track.name : trackId || (isTr ? 'Aktif Pist' : 'Current Circuit');
  const query = issueIdOrQuery.toLowerCase();

  // 1. Düzlük Hızı Yetersiz / Lack of top speed
  if (
    query.includes('lack_of_top_speed') ||
    query.includes('düzlük') ||
    query.includes('son hız') ||
    query.includes('top speed') ||
    query.includes('drag') ||
    query.includes('hızım az') ||
    query.includes('yavaş kalıyor')
  ) {
    const targetRearWing = Math.max(10, setup.rearWing - 4);
    const targetFrontWing = Math.max(15, setup.frontWing - 3);
    const targetFrontRide = Math.max(30, setup.frontRideHeight - 2);
    const targetRearRide = Math.max(32, setup.rearRideHeight - 2);
    const targetRearPSI = +(setup.rearTyrePressure + 0.5).toFixed(1);

    return isTr
      ? {
          title: `🚀 ${trackName} — Düzlük Hızı Artırma & Drag Düşürme Analizi`,
          summary: `Mevcut kanat açılarınız (${setup.frontWing}/${setup.rearWing}) ve sürüş yüksekliğiniz (${setup.frontRideHeight}/${setup.rearRideHeight}) düzlüklerde aşırı aerodinamik sürtünme (drag) yaratıyor.`,
          problemAnalysis: `Arka kanadın ${setup.rearWing} kademede bulunması DRS açıkken bile son hızı törpülüyor. Kanatları ve taban yüksekliğini düşürerek düzlükte +6 ila +9 km/h kazanabiliriz.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Arka Kanat Açısı (Rear Wing)',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `-${setup.rearWing - targetRearWing} kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'dan ${targetRearWing}'e düşür (-${setup.rearWing - targetRearWing} tık)`,
              impact: 'Düzlükte hava sürtünmesini keserek maksimum son hıza ulaştırır.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Ön Kanat Açısı (Front Wing)',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `-${setup.frontWing - targetFrontWing} kademe`,
              adjustment: `Ön kanadı ${setup.frontWing}'den ${targetFrontWing}'e düşür (-${setup.frontWing - targetFrontWing} tık)`,
              impact: 'Arka kanattaki düşüşü dengeleyerek yüksek hızda aşırı savrulmayı önler.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Sürüş Yüksekliği (Ön / Arka)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `-2 / -2 tık`,
              adjustment: `Ön tabanı ${setup.frontRideHeight}'den ${targetFrontRide}'e, Arka tabanı ${setup.rearRideHeight}'den ${targetRearRide}'e alçalt`,
              impact: 'Ön kesit alanını küçültür ve Venturi zemin emişini artırır.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basıncı',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `+0.5 PSI`,
              adjustment: `Arka lastik basıncını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a yükselt`,
              impact: 'Yuvarlanma direncini düşürerek ivmelenmeyi hızlandırır.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Düzlük öncesi son apexe erken oturup tam gaza erken oturarak düzlüğe çıkış hızınızı yükseltin.',
          quickActionSummary: `Arka kanadı ${setup.rearWing} -> ${targetRearWing}, ön kanadı ${setup.frontWing} -> ${targetFrontWing} yapın ve tabanı 2 tık alçaltın.`,
        }
      : {
          title: `🚀 ${trackName} — Top Speed Optimization & Drag Reduction`,
          summary: `Your current wing levels (${setup.frontWing}/${setup.rearWing}) and ride heights (${setup.frontRideHeight}/${setup.rearRideHeight}) are generating excessive aerodynamic parasitic drag on straights.`,
          problemAnalysis: `A rear wing setting of ${setup.rearWing} caps straight-line terminal velocity even with DRS active. Trimming wings and lowering floor heights unlocks +6 to +9 km/h on straight sectors.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Rear Wing Level',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `-${setup.rearWing - targetRearWing} clicks`,
              adjustment: `Reduce rear wing from ${setup.rearWing} down to ${targetRearWing} (-${setup.rearWing - targetRearWing} clicks)`,
              impact: 'Cuts straight-line air resistance to boost top-end speed.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Front Wing Level',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `-${setup.frontWing - targetFrontWing} clicks`,
              adjustment: `Reduce front wing from ${setup.frontWing} down to ${targetFrontWing} (-${setup.frontWing - targetFrontWing} clicks)`,
              impact: 'Keeps high-speed aero balance harmonized with rear downforce.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ride Height (Front / Rear)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `-2 / -2 clicks`,
              adjustment: `Lower front ride height from ${setup.frontRideHeight} to ${targetFrontRide}, and rear from ${setup.rearRideHeight} to ${targetRearRide}`,
              impact: 'Reduces frontal drag profile and optimizes underfloor venturi suction.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Rear Tyre Pressure',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `+0.5 PSI`,
              adjustment: `Increase rear tyre pressure from ${setup.rearTyrePressure} up to ${targetRearPSI} PSI`,
              impact: 'Decreases rolling friction resistance for quicker acceleration.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Prioritize corner exit trajectory in the turn leading onto the main straight to carry higher launch speed.',
          quickActionSummary: `Drop rear wing from ${setup.rearWing} to ${targetRearWing}, front wing from ${setup.frontWing} to ${targetFrontWing}, and lower ride height by 2 clicks.`,
        };
  }

  // 2. Viraj Çıkışında Arkası Kopuyor / Exit snap oversteer
  if (
    query.includes('exit_oversteer') ||
    query.includes('arkadan kayma') ||
    query.includes('arkası kopuyor') ||
    query.includes('arkası kay') ||
    query.includes('snap') ||
    query.includes('oversteer') ||
    query.includes('gaza basınca') ||
    query.includes('spin')
  ) {
    const targetDiff = Math.max(50, Math.min(setup.diffOnThrottle - 6, 52));
    const targetRearARB = Math.max(1, setup.rearARB - 3);
    const targetRearWing = Math.min(50, setup.rearWing + 2);
    const targetRearSusp = Math.max(1, setup.rearSuspension - 3);
    const targetRearPSI = +(setup.rearTyrePressure - 0.5).toFixed(1);

    return isTr
      ? {
          title: `🏎️ ${trackName} — Viraj Çıkışında Arka Savrulması & Snap Teşhisi`,
          summary: `Gaza bastığınızda diferansiyel kilidinizin (%${setup.diffOnThrottle}) ve Arka Viraj Demiri sertliğinizin (${setup.rearARB}) yüksek olması arka lastiklerin aniden kopmasına yol açıyor.`,
          problemAnalysis: `Viraj çıkışında %${setup.diffOnThrottle} on-throttle diferansiyeli iki tekerleği aynı devirde dönmeye zorluyor. Viraj açısından dolayı iç arka lastik kaymaya başlayınca anında arkadan savrulma (snap oversteer) tetikleniyor.`,
          adjustments: [
            {
              category: 'Transmission',
              parameter: 'Gaza Basarken Diferansiyel (% On-Throttle)',
              currentValue: `%${setup.diffOnThrottle}`,
              recommendedValue: `%${targetDiff}`,
              changeDelta: `-%${setup.diffOnThrottle - targetDiff}`,
              adjustment: `Diferansiyeli %${setup.diffOnThrottle}'den %${targetDiff}'ye düşür (-%${setup.diffOnThrottle - targetDiff})`,
              impact: 'Arka tekerleklerin bağımsız dönmesine izin vererek çıkışta spin riskini yok eder.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Arka Viraj Demiri (Rear ARB)',
              currentValue: setup.rearARB,
              recommendedValue: targetRearARB,
              changeDelta: `-${setup.rearARB - targetRearARB} tık`,
              adjustment: `Arka ARB'yi ${setup.rearARB}'den ${targetRearARB}'e yumuşat (-${setup.rearARB - targetRearARB} tık)`,
              impact: 'Arka aksın esnemesini sağlayarak mekanik çekişi devasa oranda artırır.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Arka Kanat Açısı',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+${targetRearWing - setup.rearWing} kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'den ${targetRearWing}'e artır (+${targetRearWing - setup.rearWing} tık)`,
              impact: 'Çıkış ivmelenmesinde arka aksı aerodinamik olarak asfalta yapıştırır.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Arka Yay Sertliği',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} tık`,
              adjustment: `Arka yay sertliğini ${setup.rearSuspension}'den ${targetRearSusp}'e yumuşat`,
              impact: 'Gaza basıldığında ağırlığın arka lastiklere daha homojen transfer olmasını sağlar.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basıncı',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.5 PSI`,
              adjustment: `Arka lastik basıncını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a düşür`,
              impact: 'Lastik taban temas alanını genişleterek patinajı ve aşırı ısınmayı önler.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Apexten sonra gaza aniden %100 basmak yerine kademeli gaz (%30 -> %60 -> %100) uygulayın.',
          quickActionSummary: `Diferansiyeli %${setup.diffOnThrottle} -> %${targetDiff} yapın, Arka ARB'yi ${setup.rearARB} -> ${targetRearARB}'e yumuşatın ve arka kanadı ${setup.rearWing} -> ${targetRearWing} artırın.`,
        }
      : {
          title: `🏎️ ${trackName} — Rear Instability & Power-On Exit Snap Oversteer`,
          summary: `Your high on-throttle differential (%${setup.diffOnThrottle}) and stiff rear ARB (${setup.rearARB}) are causing the rear axle to break traction violently on throttle application.`,
          problemAnalysis: `At %${setup.diffOnThrottle} on-throttle diff, the rear wheels are forced at identical speed. As you feed in power on lock, the inside tire breaks loose and snaps into a spin.`,
          adjustments: [
            {
              category: 'Transmission',
              parameter: 'Differential On-Throttle',
              currentValue: `${setup.diffOnThrottle}%`,
              recommendedValue: `${targetDiff}%`,
              changeDelta: `-${setup.diffOnThrottle - targetDiff}%`,
              adjustment: `Reduce on-throttle differential from ${setup.diffOnThrottle}% down to ${targetDiff}% (-${setup.diffOnThrottle - targetDiff}%)`,
              impact: 'Allows rear wheel speed differentiation to eliminate snap spins on exit.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Rear Anti-Roll Bar (ARB)',
              currentValue: setup.rearARB,
              recommendedValue: targetRearARB,
              changeDelta: `-${setup.rearARB - targetRearARB} clicks`,
              adjustment: `Soften rear ARB from ${setup.rearARB} down to ${targetRearARB} (-${setup.rearARB - targetRearARB} clicks)`,
              impact: 'Permits lateral chassis compliance to generate immense mechanical traction.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Rear Wing Downforce',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+${targetRearWing - setup.rearWing} clicks`,
              adjustment: `Increase rear wing from ${setup.rearWing} to ${targetRearWing} (+${targetRearWing - setup.rearWing} clicks)`,
              impact: 'Plants the rear axle aerodynamically through acceleration zones.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Rear Suspension Springs',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} clicks`,
              adjustment: `Soften rear springs from ${setup.rearSuspension} down to ${targetRearSusp}`,
              impact: 'Smoothes dynamic weight transfer onto the rear tyres during launch.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Rear Tyre Pressure',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.5 PSI`,
              adjustment: `Lower rear tyre pressure from ${setup.rearTyrePressure} to ${targetRearPSI} PSI`,
              impact: 'Expands the rubber contact patch to prevent micro-wheelspin.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Apply progressive throttle feed (30% -> 60% -> 100%) rather than instantly matting the pedal on corner exit.',
          quickActionSummary: `Drop diff from ${setup.diffOnThrottle}% -> ${targetDiff}%, soften rear ARB from ${setup.rearARB} -> ${targetRearARB}, and bump rear wing to ${targetRearWing}.`,
        };
  }

  // 3. Yavaş Virajlarda Kafadan Kayma / Low speed understeer
  if (
    query.includes('low_speed_understeer') ||
    query.includes('önden kayma') ||
    query.includes('dönmüyor') ||
    query.includes('kafadan') ||
    query.includes('yavaş viraj') ||
    query.includes('understeer') ||
    query.includes('burnu girmiyor')
  ) {
    const targetFrontWing = Math.min(50, setup.frontWing + 3);
    const targetFrontARB = Math.max(1, setup.frontARB - 3);
    const targetDiffOff = Math.max(50, Math.min(setup.diffOffThrottle - 4, 50));
    const targetFrontSusp = Math.max(1, setup.frontSuspension - 3);

    return isTr
      ? {
          title: `🛑 ${trackName} — Düşük Hızlı Virajlarda Kafadan Kayma (Understeer) Çözümü`,
          summary: `Ön Viraj Demiri sertliğiniz (${setup.frontARB}) ve Gaz Kesme diferansiyeliniz (%${setup.diffOffThrottle}) ön lastiklerin viraj içine yönlenmesini (turn-in) kısıtlıyor.`,
          problemAnalysis: `Yavaş virajlarda aero etkisi azaldığı için mekanik tutuş belirleyicidir. Ön ARB ${setup.frontARB} seviyesinde aşırı sert kaldığında ön lastikler dışa kayar.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Ön Kanat Açısı (Front Wing)',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `+${targetFrontWing - setup.frontWing} kademe`,
              adjustment: `Ön kanadı ${setup.frontWing}'den ${targetFrontWing}'e artır (+${targetFrontWing - setup.frontWing} tık)`,
              impact: 'Direksiyon çevrildiği anda ön lastiklere doğrudan ısırma ve yönlenme sağlar.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Viraj Demiri (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} tık`,
              adjustment: `Ön ARB'yi ${setup.frontARB}'den ${targetFrontARB}'e yumuşat (-${setup.frontARB - targetFrontARB} tık)`,
              impact: 'Viraj girişinde ön lastiklerin yolu tam kavramasına olanak tanır.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Gaz Kesildiğinde Diferansiyel (% Off-Throttle)',
              currentValue: `%${setup.diffOffThrottle}`,
              recommendedValue: `%${targetDiffOff}`,
              changeDelta: `-%${setup.diffOffThrottle - targetDiffOff}`,
              adjustment: `Off-Throttle Diff'i %${setup.diffOffThrottle}'den %${targetDiffOff}'ye düşür`,
              impact: 'Ayak gazdan çekildiğinde aracın burnunu apexe doğru çeker (rotation).',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Yay Sertliği',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} tık`,
              adjustment: `Ön yay sertliğini ${setup.frontSuspension}'den ${targetFrontSusp}'e yumuşat`,
              impact: 'Viraj girişinde ağırlığın ön aksa yüklenmesini kolaylaştırır.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Frenden ayağınızı birden bırakmayın; %5-10 hafif trail-braking ile apexe kadar ön tekerlek yükünü koruyun.',
          quickActionSummary: `Ön kanadı ${setup.frontWing} -> ${targetFrontWing} yapın, Ön ARB'yi ${setup.frontARB} -> ${targetFrontARB}'e yumuşatın ve Off-Throttle Diff'i %${targetDiffOff}'ye çekin.`,
        }
      : {
          title: `🛑 ${trackName} — Slow-Speed Understeer & Apex Turn-In Deficit`,
          summary: `Your stiff front ARB (${setup.frontARB}) and coast differential (%${setup.diffOffThrottle}) are resisting yaw rotation and washing out the front axle.`,
          problemAnalysis: `At low speed, mechanical grip dictates turning authority. A front roll stiffness of ${setup.frontARB} overloads the outer front tyre, creating front scrub.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Front Wing Level',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `+${targetFrontWing - setup.frontWing} clicks`,
              adjustment: `Increase front wing from ${setup.frontWing} up to ${targetFrontWing} (+${targetFrontWing - setup.frontWing} clicks)`,
              impact: 'Adds instantaneous front authority as soon as the wheel turns.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Anti-Roll Bar (ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} clicks`,
              adjustment: `Soften front ARB from ${setup.frontARB} down to ${targetFrontARB} (-${setup.frontARB - targetFrontARB} clicks)`,
              impact: 'Allows independent front wheel articulation to maximize mechanical grip.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Differential Off-Throttle (Coast)',
              currentValue: `${setup.diffOffThrottle}%`,
              recommendedValue: `${targetDiffOff}%`,
              changeDelta: `-${setup.diffOffThrottle - targetDiffOff}%`,
              adjustment: `Decrease off-throttle differential from ${setup.diffOffThrottle}% down to ${targetDiffOff}%`,
              impact: 'Unlocks mid-corner rotation to actively pull the nose into the apex.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Suspension Springs',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} clicks`,
              adjustment: `Soften front suspension springs from ${setup.frontSuspension} to ${targetFrontSusp}`,
              impact: 'Facilitates forward weight transfer under braking turn-in.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Maintain subtle trail-braking pressure (5-10%) into the apex rather than coasting on turn-in.',
          quickActionSummary: `Increase front wing from ${setup.frontWing} -> ${targetFrontWing}, soften front ARB from ${setup.frontARB} -> ${targetFrontARB}, and drop coast diff to ${targetDiffOff}%.`,
        };
  }

  // 4. Frenleme Kilitlenmesi & Kararsızlık / Braking Lock-up
  if (
    query.includes('braking') ||
    query.includes('fren') ||
    query.includes('kilitlen') ||
    query.includes('lock up') ||
    query.includes('frenleme')
  ) {
    const targetBias = setup.brakeBias > 55 ? 54 : 56;
    const targetPressure = Math.max(95, setup.brakePressure - 3);
    const targetDiffOff = Math.min(60, setup.diffOffThrottle + 4);

    return isTr
      ? {
          title: `🎯 ${trackName} — Fren Kararlılığı & Kilitlenme (Lock-Up) Önleme`,
          summary: `Fren dengenizin (%${setup.brakeBias}) ve basıncınızın (%${setup.brakePressure}) kalibrasyonu sert frenajda lastik kilitlenmesine neden oluyor.`,
          problemAnalysis: `Ön fren dengesi %${setup.brakeBias} olduğunda ağırlık öne yığıldıkça ön lastikler dönerken kilitlenir. Dengeyi geriye kaydırıp basıncı yumuşatıyoruz.`,
          adjustments: [
            {
              category: 'Brakes',
              parameter: 'Ön Fren Dengesi (Front Brake Bias)',
              currentValue: `%${setup.brakeBias}`,
              recommendedValue: `%${targetBias}`,
              changeDelta: `${targetBias - setup.brakeBias > 0 ? '+' : ''}${targetBias - setup.brakeBias}%`,
              adjustment: `Ön fren dengesini %${setup.brakeBias}'den %${targetBias}'e ayarla`,
              impact: 'Fren gücünü 4 lastiğe dengeli yayarak ön tekerleğin kitlenmesini önler.',
              urgency: 'high',
            },
            {
              category: 'Brakes',
              parameter: 'Fren Basıncı (Brake Pressure)',
              currentValue: `%${setup.brakePressure}`,
              recommendedValue: `%${targetPressure}`,
              changeDelta: `-%${setup.brakePressure - targetPressure}`,
              adjustment: `Fren basıncını %${setup.brakePressure}'den %${targetPressure}'e indir`,
              impact: 'Eşik hissini yumuşatarak ABS kapalıyken tekerleğin kitlenmesini engeller.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Gaz Kesildiğinde Diferansiyel (% Off-Throttle)',
              currentValue: `%${setup.diffOffThrottle}`,
              recommendedValue: `%${targetDiffOff}`,
              changeDelta: `+%${targetDiffOff - setup.diffOffThrottle}`,
              adjustment: `Off-Throttle diferansiyeli %${setup.diffOffThrottle}'den %${targetDiffOff}'e yükselt`,
              impact: 'Fren anında arka tekerleklerin aynı oranda yavaşlamasını sağlayarak aracı ray gibi tutar.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Frene ilk temas anında %100 basın, ancak viraja girerken hız düştükçe freni kademeli serbest bırakın (Trail-braking).',
          quickActionSummary: `Fren dengesini %${setup.brakeBias} -> %${targetBias} yapın, basıncı %${targetPressure}'e çekin ve Off-Throttle Diff'i %${targetDiffOff} yapın.`,
        }
      : {
          title: `🎯 ${trackName} — Brake Stability & Lock-Up Prevention`,
          summary: `Your brake bias (%${setup.brakeBias}) and threshold pressure (%${setup.brakePressure}) are inducing tire lock-ups in heavy braking zones.`,
          problemAnalysis: `At %${setup.brakeBias} brake bias, dynamic weight transfer overloads the front axle under deceleration, locking up the front wheels.`,
          adjustments: [
            {
              category: 'Brakes',
              parameter: 'Front Brake Bias',
              currentValue: `${setup.brakeBias}%`,
              recommendedValue: `${targetBias}%`,
              changeDelta: `${targetBias - setup.brakeBias > 0 ? '+' : ''}${targetBias - setup.brakeBias}%`,
              adjustment: `Adjust front brake bias from ${setup.brakeBias}% to ${targetBias}%`,
              impact: 'Distributes stopping torque evenly across all four tires.',
              urgency: 'high',
            },
            {
              category: 'Brakes',
              parameter: 'Brake Pressure',
              currentValue: `${setup.brakePressure}%`,
              recommendedValue: `${targetPressure}%`,
              changeDelta: `-${setup.brakePressure - targetPressure}%`,
              adjustment: `Reduce brake pressure from ${setup.brakePressure}% down to ${targetPressure}%`,
              impact: 'Prevents aggressive threshold wheel locking without sacrificing deceleration.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Differential Off-Throttle (Coast)',
              currentValue: `${setup.diffOffThrottle}%`,
              recommendedValue: `${targetDiffOff}%`,
              changeDelta: `+${targetDiffOff - setup.diffOffThrottle}%`,
              adjustment: `Increase off-throttle differential from ${setup.diffOffThrottle}% up to ${targetDiffOff}%`,
              impact: 'Stabilizes the rear axle under straight-line deceleration.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Hit peak brake pressure in a straight line, then bleed off pressure progressively as steering angle increases.',
          quickActionSummary: `Set brake bias from ${setup.brakeBias}% -> ${targetBias}%, brake pressure to ${targetPressure}%, and off-throttle diff to ${targetDiffOff}%.`,
        };
  }

  // 5. Bordürlerde Sekme ve Taban Vurma / Kerb instability
  if (
    query.includes('kerb') ||
    query.includes('bordür') ||
    query.includes('sekme') ||
    query.includes('zıplama') ||
    query.includes('taban') ||
    query.includes('bottoming')
  ) {
    const targetFrontRide = setup.frontRideHeight + 3;
    const targetRearRide = setup.rearRideHeight + 3;
    const targetFrontSusp = Math.max(1, setup.frontSuspension - 4);
    const targetFrontARB = Math.max(1, setup.frontARB - 3);

    return isTr
      ? {
          title: `🚧 ${trackName} — Bordür (Kerb) Uyumluluğu & Taban Vurma Çözümü`,
          summary: `Mevcut sürüş yüksekliğiniz (${setup.frontRideHeight}/${setup.rearRideHeight}) ve sert süspansiyonunuz (${setup.frontSuspension}) bordür darbelerini ememeyip aracı zıplatıyor.`,
          problemAnalysis: `Alçak taban bordür tepesinde yere çarpınca (bottoming out) Venturi tünellerinin hava akışı anında kopar ve araç kontrolsüz savrulur.`,
          adjustments: [
            {
              category: 'Suspension',
              parameter: 'Sürüş Yüksekliği (Ön / Arka)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `+3 / +3 tık`,
              adjustment: `Ön tabanı ${setup.frontRideHeight}'den ${targetFrontRide}'e, Arka tabanı ${setup.rearRideHeight}'den ${targetRearRide}'e yükselt (+3 tık)`,
              impact: 'Bordür tepelerinde tabanın yere çarpmasını ve ani tutuş kaybını önler.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Süspansiyon Yay Sertliği',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} tık`,
              adjustment: `Ön yay sertliğini ${setup.frontSuspension}'den ${targetFrontSusp}'e yumuşat (-${setup.frontSuspension - targetFrontSusp} tık)`,
              impact: 'Amortisörlerin bordür sarsıntılarını sönümleyerek lastiklerin asfaltta kalmasını sağlar.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Viraj Demiri (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} tık`,
              adjustment: `Ön ARB'yi ${setup.frontARB}'den ${targetFrontARB}'e düşür (-${setup.frontARB - targetFrontARB} tık)`,
              impact: 'Şasideki yanal rijitliği azaltarak bordürde tekerleklerin askıda kalmasını engeller.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Bordürün en dik sarı sosis bölümünden kaçının; tekerleği bordürün düz basamağında tutun.',
          quickActionSummary: `Sürüş yüksekliğini ${setup.frontRideHeight}/${setup.rearRideHeight} -> ${targetFrontRide}/${targetRearRide} yükseltin ve yayları yumuşatın.`,
        }
      : {
          title: `🚧 ${trackName} — Kerb Compliance & Bottoming-Out Resolution`,
          summary: `Your current ride heights (${setup.frontRideHeight}/${setup.rearRideHeight}) and stiff springs (${setup.frontSuspension}) cannot absorb aggressive kerb strikes.`,
          problemAnalysis: `Bottoming out on kerbs severs ground effect suction, instantly destabilizing the chassis and throwing the car off-line.`,
          adjustments: [
            {
              category: 'Suspension',
              parameter: 'Ride Height (Front / Rear)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `+3 / +3 clicks`,
              adjustment: `Raise front ride height from ${setup.frontRideHeight} to ${targetFrontRide}, and rear from ${setup.rearRideHeight} to ${targetRearRide} (+3 clicks)`,
              impact: 'Prevents floor planks from bottoming out over harsh kerb crowns.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Suspension Springs',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} clicks`,
              adjustment: `Soften front suspension springs from ${setup.frontSuspension} down to ${targetFrontSusp}`,
              impact: 'Allows dampers to soak up high-frequency kerb impacts.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Anti-Roll Bar (ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} clicks`,
              adjustment: `Soften front ARB from ${setup.frontARB} to ${targetFrontARB}`,
              impact: 'Reduces lateral jarring across chassis over curbs.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Clip flat painted concrete kerb sections and avoid striking sausage curb pyramids directly.',
          quickActionSummary: `Raise ride heights to ${targetFrontRide}/${targetRearRide} and soften front springs to ${targetFrontSusp}.`,
        };
  }

  // 6. Lastik Aşırı Isınması / Tyre overheating
  if (
    query.includes('lastik') ||
    query.includes('ısı') ||
    query.includes('sıcaklık') ||
    query.includes('overheating') ||
    query.includes('aşınma') ||
    query.includes('tyre')
  ) {
    const targetRearPSI = +(setup.rearTyrePressure - 0.8).toFixed(1);
    const targetDiffOn = Math.max(50, setup.diffOnThrottle - 6);
    const targetRearWing = Math.min(50, setup.rearWing + 2);

    return isTr
      ? {
          title: `🔥 ${trackName} — Lastik Aşırı Isınması & Termal Aşınma Önleme`,
          summary: `Arka lastik basıncınız (${setup.rearTyrePressure} PSI) ve diferansiyel kilidiniz (%${setup.diffOnThrottle}) viraj çıkışında mikro patinaj yaratarak lastik hamurunu aşırı ısıtıyor.`,
          problemAnalysis: `Yüksek basınç lastik temas alanını daraltır. Viraj çıkışında kayan lastik 105°C+ sıcaklığa çıkarak tutuşunu hızla kaybeder.`,
          adjustments: [
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basınçları',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.8 PSI`,
              adjustment: `Arka lastik basınçlarını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a düşür (-0.8 PSI)`,
              impact: 'İç gaz genleşmesini dengeler ve sıcaklık artışını anında keser.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Gaza Basarken Diferansiyel (% On-Throttle)',
              currentValue: `%${setup.diffOnThrottle}`,
              recommendedValue: `%${targetDiffOn}`,
              changeDelta: `-%${setup.diffOnThrottle - targetDiffOn}`,
              adjustment: `Diferansiyeli %${setup.diffOnThrottle}'den %${targetDiffOn}'ye düşür`,
              impact: 'Viraj çıkışlarındaki mikro patinajı ve lastik sürtünmesini engeller.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Arka Kanat Açısı',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+2 kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'den ${targetRearWing}'e yükselt`,
              impact: 'Arka tarafın kaymasını engelleyerek sürtünme kaynaklı termal yıpranmayı bitirir.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Arka lastikleri soğutmak için viraj çıkışlarında 1 vites yüksek kalın (Early upshift) ve ani gaz hareketlerinden kaçının.',
          quickActionSummary: `Arka lastik basıncını ${setup.rearTyrePressure} -> ${targetRearPSI} PSI'a indirin ve diferansiyeli %${targetDiffOn} yapın.`,
        }
      : {
          title: `🔥 ${trackName} — Tyre Overheating & Thermal Degradation Control`,
          summary: `Your rear tyre pressure (${setup.rearTyrePressure} PSI) and on-throttle diff (%${setup.diffOnThrottle}) are causing continuous micro-wheelspin and thermal spikes.`,
          problemAnalysis: `High pressures reduce the tyre contact patch. Under lateral loads, sliding surface friction overheats the carcass past 105°C.`,
          adjustments: [
            {
              category: 'Tyres',
              parameter: 'Rear Tyre Pressures',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.8 PSI`,
              adjustment: `Lower rear tyre pressures from ${setup.rearTyrePressure} down to ${targetRearPSI} PSI (-0.8 PSI)`,
              impact: 'Compensates for thermal air expansion and cools the contact surface.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Differential On-Throttle',
              currentValue: `${setup.diffOnThrottle}%`,
              recommendedValue: `${targetDiffOn}%`,
              changeDelta: `-${setup.diffOnThrottle - targetDiffOn}%`,
              adjustment: `Reduce on-throttle differential from ${setup.diffOnThrottle}% down to ${targetDiffOn}%`,
              impact: 'Eliminates micro-wheelspin on exit to preserve rubber compound.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Rear Wing Level',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+2 clicks`,
              adjustment: `Increase rear wing from ${setup.rearWing} to ${targetRearWing}`,
              impact: 'Locks down rear traction to prevent lateral tire scrubbing.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Short-shift one gear higher out of slow corners to avoid aggressive wheelspin on straights.',
          quickActionSummary: `Lower rear tyre pressure from ${setup.rearTyrePressure} -> ${targetRearPSI} PSI and drop diff to ${targetDiffOn}%.`,
        };
  }

  // Fallback generic diagnosis using exact setup values
  const targetDiff = Math.max(50, setup.diffOnThrottle - 4);
  const targetRearARB = Math.max(1, setup.rearARB - 2);

  return isTr
    ? {
        title: `🔧 ${trackName} — Telemetri ve Setup İnce Ayar Paketi`,
        summary: `Mevcut setup parametrelerinize (${setup.frontWing}/${setup.rearWing} kanat, %${setup.diffOnThrottle} diff, ${setup.frontARB}/${setup.rearARB} ARB) göre önerilen telemetri revizyonu:`,
        problemAnalysis: `Bildirilen araç davranışı dengesizliği çoğunlukla Diferansiyel, Viraj Demiri ve Kanat oranlarının pist karakteristiğiyle tam örtüşmemesinden kaynaklanır.`,
        adjustments: [
          {
            category: 'Transmission',
            parameter: 'Gaza Basarken Diferansiyel (% On-Throttle)',
            currentValue: `%${setup.diffOnThrottle}`,
            recommendedValue: `%${targetDiff}`,
            changeDelta: `-%${setup.diffOnThrottle - targetDiff}`,
            adjustment: `Diferansiyeli %${setup.diffOnThrottle}'den %${targetDiff}'ye düşür`,
            impact: 'Viraj dönüş çevikliği ve dengeli çıkış çekişi sağlar.',
            urgency: 'high',
          },
          {
            category: 'Suspension',
            parameter: 'Arka Viraj Demiri (Rear ARB)',
            currentValue: setup.rearARB,
            recommendedValue: targetRearARB,
            changeDelta: `-${setup.rearARB - targetRearARB} tık`,
            adjustment: `Arka ARB'yi ${setup.rearARB}'den ${targetRearARB}'e yumuşat`,
            impact: 'Viraj çıkışında arka aksın yola oturmasını destekler.',
            urgency: 'medium',
          },
        ],
        telemetryTip: 'Pistin en çok zaman kazanılan sektöründeki virajlara odaklanıp telemetri apex hızınızı referans alın.',
        quickActionSummary: `Diferansiyeli %${targetDiff} seviyesine çekin ve Arka ARB'yi ${targetRearARB} yapın.`,
      }
    : {
        title: `🔧 ${trackName} — Telemetry & Setup Calibration Package`,
        summary: `Tailored adjustments based on your current setup (${setup.frontWing}/${setup.rearWing} wings, ${setup.diffOnThrottle}% diff, ${setup.frontARB}/${setup.rearARB} ARB):`,
        problemAnalysis: `Chassis handling deficits usually trace back to differential preload, anti-roll bar distribution, and aerodynamic wing ratios.`,
        adjustments: [
          {
            category: 'Transmission',
            parameter: 'Differential On-Throttle',
            currentValue: `${setup.diffOnThrottle}%`,
            recommendedValue: `${targetDiff}%`,
            changeDelta: `-${setup.diffOnThrottle - targetDiff}%`,
            adjustment: `Reduce on-throttle differential from ${setup.diffOnThrottle}% down to ${targetDiff}%`,
            impact: 'Enhances mid-corner rotation paired with smooth exit traction.',
            urgency: 'high',
          },
          {
            category: 'Suspension',
            parameter: 'Rear Anti-Roll Bar (ARB)',
            currentValue: setup.rearARB,
            recommendedValue: targetRearARB,
            changeDelta: `-${setup.rearARB - targetRearARB} clicks`,
            adjustment: `Soften rear ARB from ${setup.rearARB} down to ${targetRearARB}`,
            impact: 'Allows progressive mechanical weight transfer on acceleration.',
            urgency: 'medium',
          },
        ],
        telemetryTip: 'Focus on corner exit speed in the primary traction zones for maximum lap time gain.',
        quickActionSummary: `Set on-throttle diff to ${targetDiff}% and soften rear ARB to ${targetRearARB}.`,
      };
}
