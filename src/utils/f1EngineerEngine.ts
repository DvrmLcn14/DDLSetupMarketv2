import { TRACKS } from '../data/mockData';
import { Language } from '../i18n/LanguageContext';

export interface DriverSetupValues {
  // 1. Aerodynamics
  frontWing: number; // 0 - 50
  rearWing: number; // 0 - 50

  // 2. Transmission
  diffOnThrottle: number; // 10 - 100%
  diffOffThrottle: number; // 10 - 100%
  engineBraking: number; // 0 - 100% (Engine Braking Adjustment)

  // 3. Suspension Geometry
  frontCamber: number; // -3.50° to -2.50°
  rearCamber: number; // -2.20° to -0.70°
  frontToe: number; // 0.00° to 0.50° (Front Toe-Out)
  rearToe: number; // 0.00° to 0.50° (Rear Toe-In)

  // 4. Suspension
  frontSuspension: number; // 1 - 41
  rearSuspension: number; // 1 - 41
  frontARB: number; // 1 - 21 (Front Anti-Roll Bar)
  rearARB: number; // 1 - 21 (Rear Anti-Roll Bar)
  frontRideHeight: number; // 10 - 45
  rearRideHeight: number; // 30 - 65

  // 5. Brakes
  brakePressure: number; // 80 - 100%
  brakeBias: number; // 50 - 70% (Front Brake Bias)

  // 6. Tyres
  frontTyrePressure: number; // 20.0 - 29.5 PSI
  rearTyrePressure: number; // 19.0 - 26.5 PSI
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
      engineBraking: 60,
      frontCamber: -2.50,
      rearCamber: -1.00,
      frontToe: 0.00,
      rearToe: 0.10,
      frontSuspension: 30,
      rearSuspension: 22,
      frontARB: 8,
      rearARB: 5,
      frontRideHeight: 35,
      rearRideHeight: 40,
      brakePressure: 100,
      brakeBias: 55,
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
      engineBraking: 80,
      frontCamber: -2.50,
      rearCamber: -1.20,
      frontToe: 0.02,
      rearToe: 0.12,
      frontSuspension: 24,
      rearSuspension: 18,
      frontARB: 6,
      rearARB: 3,
      frontRideHeight: 36,
      rearRideHeight: 41,
      brakePressure: 100,
      brakeBias: 55,
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
      engineBraking: 50,
      frontCamber: -2.70,
      rearCamber: -0.90,
      frontToe: 0.00,
      rearToe: 0.08,
      frontSuspension: 34,
      rearSuspension: 26,
      frontARB: 9,
      rearARB: 6,
      frontRideHeight: 33,
      rearRideHeight: 38,
      brakePressure: 100,
      brakeBias: 54,
      frontTyrePressure: 23.0,
      rearTyrePressure: 21.0,
    },
  },
  wet_weather: {
    labelTr: '🌧️ Islak Zemin / Yağmur Şablonu (48-44)',
    labelEn: '🌧️ Wet Weather / Rain Spec (48-44)',
    values: {
      frontWing: 48,
      rearWing: 44,
      diffOnThrottle: 50,
      diffOffThrottle: 50,
      engineBraking: 40,
      frontCamber: -2.50,
      rearCamber: -1.00,
      frontToe: 0.05,
      rearToe: 0.15,
      frontSuspension: 18,
      rearSuspension: 14,
      frontARB: 4,
      rearARB: 2,
      frontRideHeight: 40,
      rearRideHeight: 46,
      brakePressure: 95,
      brakeBias: 53,
      frontTyrePressure: 21.5,
      rearTyrePressure: 20.0,
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

  // 1. Aerodynamics: Front Wing, Rear Wing
  const wingMatch =
    str.match(/(?:kanat|wing|aero)[^\d]*(\d+)[^\d]+(\d+)/i) ||
    str.match(/(\d+)\s*[-/]\s*(\d+)\s*(?:kanat|wing)/i);
  if (wingMatch) {
    result.frontWing = Math.min(50, Math.max(0, parseInt(wingMatch[1], 10)));
    result.rearWing = Math.min(50, Math.max(0, parseInt(wingMatch[2], 10)));
  }

  // 2. Transmission: Diff on/off, engine braking
  const diffBothMatch = str.match(/(?:diff|diferansiyel)[^\d]*(\d+)[^\d]+(\d+)/i);
  if (diffBothMatch) {
    result.diffOnThrottle = Math.min(100, Math.max(10, parseInt(diffBothMatch[1], 10)));
    result.diffOffThrottle = Math.min(100, Math.max(10, parseInt(diffBothMatch[2], 10)));
  } else {
    const diffOnMatch = str.match(/(?:diff\s*on|on-throttle|gaza basarken)[^\d]*(\d+)/i);
    if (diffOnMatch) {
      result.diffOnThrottle = Math.min(100, Math.max(10, parseInt(diffOnMatch[1], 10)));
    }
    const diffOffMatch = str.match(/(?:diff\s*off|off-throttle|gaz kes)[^\d]*(\d+)/i);
    if (diffOffMatch) {
      result.diffOffThrottle = Math.min(100, Math.max(10, parseInt(diffOffMatch[1], 10)));
    }
  }

  const ebMatch = str.match(/(?:engine\s*brak|motor\s*fren|eb)[^\d]*(\d+)/i);
  if (ebMatch) {
    result.engineBraking = Math.min(100, Math.max(0, parseInt(ebMatch[1], 10)));
  }

  // 3. Suspension Geometry: Camber & Toe
  const camberMatch = str.match(/(?:camber|kamber)[^\d-]*(-?\d+\.?\d*)[^\d-]+(-?\d+\.?\d*)/i);
  if (camberMatch) {
    result.frontCamber = parseFloat(camberMatch[1]);
    result.rearCamber = parseFloat(camberMatch[2]);
  }
  const toeMatch = str.match(/(?:toe)[^\d]*(\d+\.?\d*)[^\d]+(\d+\.?\d*)/i);
  if (toeMatch) {
    result.frontToe = parseFloat(toeMatch[1]);
    result.rearToe = parseFloat(toeMatch[2]);
  }

  // 4. Suspension: Front/Rear Susp, ARBs, Ride Height
  const arbMatch = str.match(/(?:arb|viraj\s*demir|anti-roll)[^\d]*(\d+)[^\d]+(\d+)/i);
  if (arbMatch) {
    result.frontARB = Math.min(21, Math.max(1, parseInt(arbMatch[1], 10)));
    result.rearARB = Math.min(21, Math.max(1, parseInt(arbMatch[2], 10)));
  }

  const suspMatch = str.match(/(?:susp|süspansiyon|yay)[^\d]*(\d+)[^\d]+(\d+)/i);
  if (suspMatch) {
    result.frontSuspension = Math.min(41, Math.max(1, parseInt(suspMatch[1], 10)));
    result.rearSuspension = Math.min(41, Math.max(1, parseInt(suspMatch[2], 10)));
  }

  const rideMatch = str.match(/(?:ride|yükseklik|taban|height)[^\d]*(\d+)[^\d]+(\d+)/i);
  if (rideMatch) {
    result.frontRideHeight = Math.min(45, Math.max(10, parseInt(rideMatch[1], 10)));
    result.rearRideHeight = Math.min(65, Math.max(30, parseInt(rideMatch[2], 10)));
  }

  // 5. Brakes: Pressure & Bias
  const brakeMatch = str.match(/(?:bias|fren\s*dengesi)[^\d]*(\d+)/i);
  if (brakeMatch) {
    const val = parseInt(brakeMatch[1], 10);
    if (val >= 50 && val <= 70) result.brakeBias = val;
  }
  const pressureMatch = str.match(/(?:brake\s*pressure|fren\s*basınç)[^\d]*(\d+)/i);
  if (pressureMatch) {
    const val = parseInt(pressureMatch[1], 10);
    if (val >= 80 && val <= 100) result.brakePressure = val;
  }

  // 6. Tyres: Front & Rear Pressures
  const tyreMatch = str.match(/(?:tyre|lastik|psi|pressure)[^\d]*(\d+\.?\d*)[^\d]+(\d+\.?\d*)/i);
  if (tyreMatch) {
    result.frontTyrePressure = parseFloat(tyreMatch[1]);
    result.rearTyrePressure = parseFloat(tyreMatch[2]);
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

  // 1. Düzlük Hızı Yetersiz / Lack of top speed / Low Top Speed
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
    const targetEngineBraking = Math.max(30, setup.engineBraking - 15);
    const targetFrontRide = Math.max(10, setup.frontRideHeight - 2);
    const targetRearRide = Math.max(30, setup.rearRideHeight - 2);
    const targetFrontCamber = -2.50;
    const targetRearPSI = +(setup.rearTyrePressure + 0.6).toFixed(1);

    return isTr
      ? {
          title: `🚀 ${trackName} — Düzlük Hızı & Drag Düşürme Analizi`,
          summary: `Mevcut kanat açılarınız (${setup.frontWing}/${setup.rearWing}), motor freniniz (%${setup.engineBraking}) ve sürüş yüksekliğiniz (${setup.frontRideHeight}/${setup.rearRideHeight}) düzlüklerde aşırı aerodinamik ve mekanik sürüklenme (drag) yaratıyor.`,
          problemAnalysis: `Arka kanadın ${setup.rearWing} seviyesinde bulunması DRS açıldığında dahi terminal hızı sınırlar. Ayrıca yüksek motor freni (%${setup.engineBraking}) viraj çıkışında düzlüğe ilk ivmelenmede direnç oluşturur. Kanatlar, taban yüksekliği ve motor freni kalibre edilerek düzlükte +7 ile +11 km/h kazanılır.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Arka Kanat (Rear Wing)',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `-${setup.rearWing - targetRearWing} kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'dan ${targetRearWing}'e düşür (-${setup.rearWing - targetRearWing} tık)`,
              impact: 'Düzlükte hava sürtünmesini keserek maksimum son hızı ve DRS verimini artırır.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Ön Kanat (Front Wing)',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `-${setup.frontWing - targetFrontWing} kademe`,
              adjustment: `Ön kanadı ${setup.frontWing}'den ${targetFrontWing}'e düşür (-${setup.frontWing - targetFrontWing} tık)`,
              impact: 'Arka kanattaki düşüşü dengeleyerek yüksek hızda şasiyi aerodinamik nötr dengede tutar.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Motor Freni (Engine Braking)',
              currentValue: `%${setup.engineBraking}`,
              recommendedValue: `%${targetEngineBraking}`,
              changeDelta: `-%${setup.engineBraking - targetEngineBraking}`,
              adjustment: `Motor frenini %${setup.engineBraking}'den %${targetEngineBraking}'e düşür`,
              impact: 'Gaz kesme anında motorun arka aksa uyguladığı iç sürtünmeyi azaltıp düzlük öncesi ivmeyi korur.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Sürüş Yüksekliği (Ride Height Ön / Arka)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `-2 / -2 tık`,
              adjustment: `Ön tabanı ${setup.frontRideHeight}'den ${targetFrontRide}'e, Arka tabanı ${setup.rearRideHeight}'den ${targetRearRide}'e alçalt`,
              impact: 'Ön kesit alanını küçültür ve Venturi zemin emiş tünellerini hızlandırır.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Ön Kamber (Front Camber)',
              currentValue: `${setup.frontCamber}°`,
              recommendedValue: `${targetFrontCamber}°`,
              changeDelta: `${(targetFrontCamber - setup.frontCamber).toFixed(2)}°`,
              adjustment: `Ön kamberi ${targetFrontCamber}° seviyesine yaklaştır`,
              impact: 'Düzlükte lastik tabanının asfalta temas direncini düşürerek hızlanmayı serbest bırakır.',
              urgency: 'low',
            },
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basınçları (Rear Tyres)',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `+0.6 PSI`,
              adjustment: `Arka lastik basıncını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a yükselt`,
              impact: 'Yuvarlanma direncini düşürerek düzlük ivmesini keskinleştirir.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Düzlüğe bağlanan son virajda apexi erken yakalayıp düz hatta %100 tam gaza erken oturun.',
          quickActionSummary: `Arka kanadı ${setup.rearWing} -> ${targetRearWing}, ön kanadı ${setup.frontWing} -> ${targetFrontWing} yapın, motor frenini %${targetEngineBraking}'e düşürün ve tabanı 2 tık alçaltın.`,
        }
      : {
          title: `🚀 ${trackName} — Top Speed Optimization & Drag Reduction`,
          summary: `Your wing levels (${setup.frontWing}/${setup.rearWing}), engine braking (%${setup.engineBraking}) and ride heights (${setup.frontRideHeight}/${setup.rearRideHeight}) are creating excessive aerodynamic and mechanical parasitic drag.`,
          problemAnalysis: `A rear wing of ${setup.rearWing} caps straight-line terminal velocity even with DRS enabled. Lowering wings, floor height and reducing engine braking unlocks +7 to +11 km/h on straights.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Rear Wing Level',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `-${setup.rearWing - targetRearWing} clicks`,
              adjustment: `Reduce rear wing from ${setup.rearWing} down to ${targetRearWing} (-${setup.rearWing - targetRearWing} clicks)`,
              impact: 'Slashes aerodynamic wake resistance for top terminal velocity.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Front Wing Level',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `-${setup.frontWing - targetFrontWing} clicks`,
              adjustment: `Reduce front wing from ${setup.frontWing} down to ${targetFrontWing} (-${setup.frontWing - targetFrontWing} clicks)`,
              impact: 'Maintains aerodynamic center of pressure balance with trimmed rear wing.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Engine Braking',
              currentValue: `${setup.engineBraking}%`,
              recommendedValue: `${targetEngineBraking}%`,
              changeDelta: `-${setup.engineBraking - targetEngineBraking}%`,
              adjustment: `Reduce engine braking from ${setup.engineBraking}% down to ${targetEngineBraking}%`,
              impact: 'Reduces internal powertrain overrun resistance onto straight exits.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Ride Height (Front / Rear)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `-2 / -2 clicks`,
              adjustment: `Lower front ride height to ${targetFrontRide} and rear to ${targetRearRide}`,
              impact: 'Minimizes aerodynamic frontal cross-section and optimizes underfloor venturi flow.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Front Camber',
              currentValue: `${setup.frontCamber}°`,
              recommendedValue: `${targetFrontCamber}°`,
              changeDelta: `${(targetFrontCamber - setup.frontCamber).toFixed(2)}°`,
              adjustment: `Set front camber closer to ${targetFrontCamber}°`,
              impact: 'Reduces contact patch rolling friction on long full-throttle straights.',
              urgency: 'low',
            },
            {
              category: 'Tyres',
              parameter: 'Rear Tyre Pressure',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `+0.6 PSI`,
              adjustment: `Increase rear tyre pressure to ${targetRearPSI} PSI`,
              impact: 'Decreases rolling tire deflection and straight-line drag.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Prioritize exit geometric line in the corner leading onto the straight to apply full throttle earlier.',
          quickActionSummary: `Drop rear wing ${setup.rearWing} -> ${targetRearWing}, front wing to ${targetFrontWing}, lower ride height by 2 clicks, and drop engine braking to ${targetEngineBraking}%.`,
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
    const targetDiffOn = Math.max(50, Math.min(setup.diffOnThrottle - 6, 52));
    const targetRearARB = Math.max(1, setup.rearARB - 3);
    const targetRearWing = Math.min(50, setup.rearWing + 2);
    const targetRearSusp = Math.max(1, setup.rearSuspension - 3);
    const targetRearToe = Math.min(0.50, +(setup.rearToe + 0.05).toFixed(2));
    const targetRearPSI = +(setup.rearTyrePressure - 0.5).toFixed(1);

    return isTr
      ? {
          title: `🏎️ ${trackName} — Viraj Çıkışında Arka Kopması & Snap Oversteer Teşhisi`,
          summary: `Gaza bastığınızda diferansiyel kilidinizin (%${setup.diffOnThrottle}), sert Arka Viraj Demiri (${setup.rearARB}) ve yay sertliğinizin (${setup.rearSuspension}) arka aksı kilitlediği ve ani tutunma kaybı (snap) yarattığı belirlendi.`,
          problemAnalysis: `Viraj çıkışında gaza basarken diferansiyel %${setup.diffOnThrottle} seviyesinde her iki arka tekeri aynı devirde dönmeye zorlar. Arka ARB (${setup.rearARB}) sert kaldığında iç tekerlek asfalttan havalanır, mikro patinaj başlatır ve anında spin tetikler.`,
          adjustments: [
            {
              category: 'Transmission',
              parameter: 'Gaza Basarken Diferansiyel (% On-Throttle)',
              currentValue: `%${setup.diffOnThrottle}`,
              recommendedValue: `%${targetDiffOn}`,
              changeDelta: `-%${setup.diffOnThrottle - targetDiffOn}`,
              adjustment: `Diferansiyeli %${setup.diffOnThrottle}'den %${targetDiffOn}'ye düşür (-%${setup.diffOnThrottle - targetDiffOn})`,
              impact: 'Arka tekerleklerin bağımsız dönmesine izin vererek apexten çıkarken anlık spin riskini yok eder.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Arka Viraj Demiri (Rear ARB)',
              currentValue: setup.rearARB,
              recommendedValue: targetRearARB,
              changeDelta: `-${setup.rearARB - targetRearARB} tık`,
              adjustment: `Arka ARB'yi ${setup.rearARB}'den ${targetRearARB}'e yumuşat (-${setup.rearARB - targetRearARB} tık)`,
              impact: 'Arka aksın esnemesini sağlayarak mekanik çekişi (mechanical grip) doğrudan yükseltir.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Arka Kanat (Rear Wing)',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+${targetRearWing - setup.rearWing} kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'den ${targetRearWing}'e artır (+${targetRearWing - setup.rearWing} tık)`,
              impact: 'Çıkış ivmelenmesinde arka aksı aerodinamik bastırma kuvvetiyle yere basar.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Arka Süspansiyon (Rear Suspension)',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} tık`,
              adjustment: `Arka yay sertliğini ${setup.rearSuspension}'den ${targetRearSusp}'e yumuşat`,
              impact: 'Gaza basıldığında arka ağırlık transferini (squat) homojenleştirir.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Arka İçe Açıklık (Rear Toe-In)',
              currentValue: `${setup.rearToe}°`,
              recommendedValue: `${targetRearToe}°`,
              changeDelta: `+0.05°`,
              adjustment: `Arka Toe-In değerini ${setup.rearToe}°'den ${targetRearToe}°'ye yükselt`,
              impact: 'Arka tekerlekleri viraj çıkışında hizalayarak yanal savrulmayı sönümler.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basınçları (Rear Tyres)',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.5 PSI`,
              adjustment: `Arka lastik basıncını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a düşür`,
              impact: 'Lastik taban temas alanını genişleterek patinajı ve aşırı ısınmayı önler.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Apexten sonra gaza aniden %100 oturmak yerine (%25 -> %60 -> %100) kademeli gaz pedalı uygulayın.',
          quickActionSummary: `Diferansiyeli %${setup.diffOnThrottle} -> %${targetDiffOn} yapın, Arka ARB'yi ${setup.rearARB} -> ${targetRearARB}'e yumuşatın, arka kanadı ${setup.rearWing} -> ${targetRearWing} artırın.`,
        }
      : {
          title: `🏎️ ${trackName} — Rear Instability & Power-On Snap Oversteer`,
          summary: `High on-throttle differential (%${setup.diffOnThrottle}) combined with stiff rear ARB (${setup.rearARB}) and springs (${setup.rearSuspension}) are breaking rear traction violently under acceleration.`,
          problemAnalysis: `At %${setup.diffOnThrottle} on-throttle diff lock, the rear axle resists wheel speed differentiation on lock. A stiff rear roll bar lifts the inside tyre, inciting immediate snap oversteer.`,
          adjustments: [
            {
              category: 'Transmission',
              parameter: 'Differential On-Throttle',
              currentValue: `${setup.diffOnThrottle}%`,
              recommendedValue: `${targetDiffOn}%`,
              changeDelta: `-${setup.diffOnThrottle - targetDiffOn}%`,
              adjustment: `Reduce on-throttle diff from ${setup.diffOnThrottle}% down to ${targetDiffOn}%`,
              impact: 'Permits rear wheel differentiation to eliminate violent snap spins on corner exit.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Rear Anti-Roll Bar (Rear ARB)',
              currentValue: setup.rearARB,
              recommendedValue: targetRearARB,
              changeDelta: `-${setup.rearARB - targetRearARB} clicks`,
              adjustment: `Soften rear ARB from ${setup.rearARB} down to ${targetRearARB} (-${setup.rearARB - targetRearARB} clicks)`,
              impact: 'Introduces chassis compliance to generate immense mechanical traction.',
              urgency: 'high',
            },
            {
              category: 'Aero',
              parameter: 'Rear Wing Downforce',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+${targetRearWing - setup.rearWing} clicks`,
              adjustment: `Increase rear wing from ${setup.rearWing} to ${targetRearWing} (+${targetRearWing - setup.rearWing} clicks)`,
              impact: 'Aerodynamically plants the rear axle as speed builds out of corners.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Rear Suspension Springs',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} clicks`,
              adjustment: `Soften rear springs from ${setup.rearSuspension} down to ${targetRearSusp}`,
              impact: 'Facilitates controlled weight transfer onto rear tyres during launch.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Rear Toe-In',
              currentValue: `${setup.rearToe}°`,
              recommendedValue: `${targetRearToe}°`,
              changeDelta: `+0.05°`,
              adjustment: `Increase rear toe-in from ${setup.rearToe}° to ${targetRearToe}°`,
              impact: 'Enhances dynamic straight-line stability under heavy power-on squats.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Rear Tyre Pressure',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.5 PSI`,
              adjustment: `Lower rear tyre pressure from ${setup.rearTyrePressure} to ${targetRearPSI} PSI`,
              impact: 'Expands tire contact footprint to stop micro-spin friction.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Use progressive throttle feed (25% -> 60% -> 100%) rather than instantly flooring the throttle pedal at apex.',
          quickActionSummary: `Drop diff to ${targetDiffOn}%, soften rear ARB to ${targetRearARB}, increase rear wing to ${targetRearWing}, and soften rear springs to ${targetRearSusp}.`,
        };
  }

  // 3. Yavaş Virajlarda Kafadan Kayma / Low speed understeer / Turn-in understeer
  if (
    query.includes('low_speed_understeer') ||
    query.includes('önden kayma') ||
    query.includes('dönmüyor') ||
    query.includes('kafadan') ||
    query.includes('yavaş viraj') ||
    query.includes('understeer') ||
    query.includes('burnu girmiyor') ||
    query.includes('turn-in')
  ) {
    const targetFrontWing = Math.min(50, setup.frontWing + 3);
    const targetFrontARB = Math.max(1, setup.frontARB - 3);
    const targetDiffOff = Math.max(50, Math.min(setup.diffOffThrottle - 4, 50));
    const targetEngineBraking = Math.max(40, setup.engineBraking - 10);
    const targetFrontSusp = Math.max(1, setup.frontSuspension - 3);
    const targetFrontToe = Math.min(0.50, +(setup.frontToe + 0.04).toFixed(2));
    const targetFrontCamber = -2.50; // Maximum grip bite in F1 24/25

    return isTr
      ? {
          title: `🛑 ${trackName} — Düşük Hızlı Virajlarda Kafadan Kayma (Turn-In Understeer) Çözümü`,
          summary: `Ön Viraj Demiri (${setup.frontARB}), sert ön yaylar (${setup.frontSuspension}) ve Gaz Kesme diferansiyeli (%${setup.diffOffThrottle}) aracın burnunun apexe dönmesini engelliyor.`,
          problemAnalysis: `Yavaş virajlarda mekanik tutuş ve şasi yönlenme çevikliği (yaw rotation) esastır. Ön ARB ${setup.frontARB} seviyesinde sert kaldığında dış ön tekerlek aşırı yüklenir ve dışa doğru sürüklenir (scrub).`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Ön Kanat (Front Wing)',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `+${targetFrontWing - setup.frontWing} kademe`,
              adjustment: `Ön kanadı ${setup.frontWing}'den ${targetFrontWing}'e artır (+${targetFrontWing - setup.frontWing} tık)`,
              impact: 'Direksiyon çevrildiği anda ön lastiklere doğrudan mekanik/aero ısırma sağlar.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Viraj Demiri (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} tık`,
              adjustment: `Ön ARB'yi ${setup.frontARB}'den ${targetFrontARB}'e yumuşat (-${setup.frontARB - targetFrontARB} tık)`,
              impact: 'Viraj girişinde ön lastiklerin bağımsız esneyip yolu tam kavramasını sağlar.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Gaz Kesildiğinde Diferansiyel (% Off-Throttle)',
              currentValue: `%${setup.diffOffThrottle}`,
              recommendedValue: `%${targetDiffOff}`,
              changeDelta: `-%${setup.diffOffThrottle - targetDiffOff}`,
              adjustment: `Off-Throttle Diff'i %${setup.diffOffThrottle}'den %${targetDiffOff}'ye düşür`,
              impact: 'Ayak gazdan çekildiğinde diferansiyel kilidini serbest bırakarak aracın burnunu apexe çeker.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Motor Freni (Engine Braking)',
              currentValue: `%${setup.engineBraking}`,
              recommendedValue: `%${targetEngineBraking}`,
              changeDelta: `-%${setup.engineBraking - targetEngineBraking}`,
              adjustment: `Motor frenini %${setup.engineBraking}'den %${targetEngineBraking}'e indir`,
              impact: 'Arka tekerleklerin frenajda aracı geriye çekmesini önleyerek dönüş açısını (yaw) rahatlatır.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Yay Sertliği (Front Suspension)',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} tık`,
              adjustment: `Ön yay sertliğini ${setup.frontSuspension}'den ${targetFrontSusp}'e yumuşat`,
              impact: 'Viraj girişinde ağırlığın ön aksa yüklenmesini kolaylaştırır.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Ön Dışa Açıklık (Front Toe-Out)',
              currentValue: `${setup.frontToe}°`,
              recommendedValue: `${targetFrontToe}°`,
              changeDelta: `+0.04°`,
              adjustment: `Ön Toe-Out değerini ${targetFrontToe}° seviyesine artır`,
              impact: 'Direksiyon ilk çevrildiği anda ön aksın apexe atılmasını (turn-in response) keskinleştirir.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Ön Kamber (Front Camber)',
              currentValue: `${setup.frontCamber}°`,
              recommendedValue: `${targetFrontCamber}°`,
              changeDelta: `${(targetFrontCamber - setup.frontCamber).toFixed(2)}°`,
              adjustment: `Ön kamberi en agresif tutuş açısı olan ${targetFrontCamber}° yap`,
              impact: 'Viraj ortasında ön lastiğin temas yüzeyini maksimize eder.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Frenden aniden çekilmek yerine viraj içine doğru %5-10 hafif trail-braking ile ön tekerlek yükünü koruyun.',
          quickActionSummary: `Ön kanadı ${setup.frontWing} -> ${targetFrontWing} yapın, Ön ARB'yi ${setup.frontARB} -> ${targetFrontARB}'e yumuşatın ve Off-Throttle Diff'i %${targetDiffOff}'ye çekin.`,
        }
      : {
          title: `🛑 ${trackName} — Slow-Speed Understeer & Turn-In Deficit`,
          summary: `Stiff front ARB (${setup.frontARB}), front springs (${setup.frontSuspension}) and off-throttle diff (%${setup.diffOffThrottle}) are resisting yaw rotation into slow corners.`,
          problemAnalysis: `In low speed turns, mechanical articulation dictates front bite. An excessively stiff front roll bar overloads the outer front tyre, creating front wash.`,
          adjustments: [
            {
              category: 'Aero',
              parameter: 'Front Wing Level',
              currentValue: setup.frontWing,
              recommendedValue: targetFrontWing,
              changeDelta: `+${targetFrontWing - setup.frontWing} clicks`,
              adjustment: `Increase front wing from ${setup.frontWing} up to ${targetFrontWing} (+${targetFrontWing - setup.frontWing} clicks)`,
              impact: 'Imparts instantaneous front bite as soon as steering lock is applied.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Anti-Roll Bar (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} clicks`,
              adjustment: `Soften front ARB from ${setup.frontARB} down to ${targetFrontARB} (-${setup.frontARB - targetFrontARB} clicks)`,
              impact: 'Permits independent front wheel articulation to maximize turn-in grip.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Differential Off-Throttle (Coast)',
              currentValue: `${setup.diffOffThrottle}%`,
              recommendedValue: `${targetDiffOff}%`,
              changeDelta: `-${setup.diffOffThrottle - targetDiffOff}%`,
              adjustment: `Decrease off-throttle differential to ${targetDiffOff}%`,
              impact: 'Unlocks mid-corner rotation to actively pull the nose into the apex.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Engine Braking',
              currentValue: `${setup.engineBraking}%`,
              recommendedValue: `${targetEngineBraking}%`,
              changeDelta: `-${setup.engineBraking - targetEngineBraking}%`,
              adjustment: `Reduce engine braking from ${setup.engineBraking}% to ${targetEngineBraking}%`,
              impact: 'Relieves rear axle deceleration bind to smooth out corner entry yaw.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Front Suspension Springs',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} clicks`,
              adjustment: `Soften front springs from ${setup.frontSuspension} to ${targetFrontSusp}`,
              impact: 'Facilitates forward load transfer during braking and initial steering.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Front Toe-Out',
              currentValue: `${setup.frontToe}°`,
              recommendedValue: `${targetFrontToe}°`,
              changeDelta: `+0.04°`,
              adjustment: `Increase front toe-out to ${targetFrontToe}°`,
              impact: 'Sharpens front apex turn-in response.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Maintain light trail-braking pressure (5-10%) right up to the apex to keep load pinned on the steering axle.',
          quickActionSummary: `Increase front wing to ${targetFrontWing}, soften front ARB to ${targetFrontARB}, drop coast diff to ${targetDiffOff}%, and reduce engine braking to ${targetEngineBraking}%.`,
        };
  }

  // 4. Frenleme Kilitlenmesi & Kararsızlık / Braking Lock-up & Instability
  if (
    query.includes('braking') ||
    query.includes('fren') ||
    query.includes('kilitlen') ||
    query.includes('lock up') ||
    query.includes('frenleme')
  ) {
    const targetBias = setup.brakeBias > 55 ? 54 : 56;
    const targetPressure = Math.max(95, setup.brakePressure - 3);
    const targetDiffOff = Math.min(65, setup.diffOffThrottle + 4);
    const targetEngineBraking = Math.min(80, setup.engineBraking + 10);
    const targetFrontSusp = Math.min(41, setup.frontSuspension + 2);

    return isTr
      ? {
          title: `🎯 ${trackName} — Fren Kararlılığı & Kilitlenme (Lock-Up) Önleme`,
          summary: `Fren dengeniz (%${setup.brakeBias}), fren basıncınız (%${setup.brakePressure}) ve motor freniniz (%${setup.engineBraking}) ağır fren bölgelerinde tekerlek kilitlenmesine ve şasi kararsızlığına yol açıyor.`,
          problemAnalysis: `Ön fren dengesi %${setup.brakeBias} seviyesinde ağır frenaj anında ağırlık öne yığıldığında ön lastikler dönme momentumunu kaybeder ve kilitlenir. Dengeyi geriye alıp, off-throttle diferansiyeli ve motor frenini optimize ediyoruz.`,
          adjustments: [
            {
              category: 'Brakes',
              parameter: 'Ön Fren Dengesi (Front Brake Bias)',
              currentValue: `%${setup.brakeBias}`,
              recommendedValue: `%${targetBias}`,
              changeDelta: `${targetBias - setup.brakeBias > 0 ? '+' : ''}${targetBias - setup.brakeBias}%`,
              adjustment: `Ön fren dengesini %${setup.brakeBias}'den %${targetBias}'e ayarla`,
              impact: 'Durdurma torkunu 4 tekere yayarak ön lastiklerin kızaklamasını engeller.',
              urgency: 'high',
            },
            {
              category: 'Brakes',
              parameter: 'Fren Basıncı (Brake Pressure)',
              currentValue: `%${setup.brakePressure}`,
              recommendedValue: `%${targetPressure}`,
              changeDelta: `-%${setup.brakePressure - targetPressure}`,
              adjustment: `Fren basıncını %${setup.brakePressure}'den %${targetPressure}'e indir`,
              impact: 'Eşik hissini yumuşatarak ABS kapalıyken tekerleğin kitlenmesini önler.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Gaz Kesildiğinde Diferansiyel (% Off-Throttle)',
              currentValue: `%${setup.diffOffThrottle}`,
              recommendedValue: `%${targetDiffOff}`,
              changeDelta: `+${targetDiffOff - setup.diffOffThrottle}%`,
              adjustment: `Off-Throttle diferansiyeli %${setup.diffOffThrottle}'den %${targetDiffOff}'e yükselt`,
              impact: 'Düzlük sonu sert frenajda arka aksın ray gibi düz hatta kalmasını sağlar.',
              urgency: 'medium',
            },
            {
              category: 'Transmission',
              parameter: 'Motor Freni (Engine Braking)',
              currentValue: `%${setup.engineBraking}`,
              recommendedValue: `%${targetEngineBraking}`,
              changeDelta: `+${targetEngineBraking - setup.engineBraking}%`,
              adjustment: `Motor frenini %${setup.engineBraking}'den %${targetEngineBraking}'e yükselt`,
              impact: 'Vites küçültürken motor kompresyonunu artırarak aracı dengeli biçimde yavaşlatır.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Yay Sertliği (Front Suspension)',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `+2 tık`,
              adjustment: `Ön yayları ${setup.frontSuspension}'den ${targetFrontSusp}'e sertleştir`,
              impact: 'Frende şasinin öne aşırı çökmesini (dive) engelleyerek taban aerodinamiğini korur.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Frene ilk darbeyi düz çizgide %100 basın; hız düştükçe ve direksiyon açısı arttıkça freni kademeli serbest bırakın (Trail-braking).',
          quickActionSummary: `Fren dengesini %${targetBias} yapın, basıncı %${targetPressure}'e çekin, Off-Throttle Diff'i %${targetDiffOff} yapın.`,
        }
      : {
          title: `🎯 ${trackName} — Brake Stability & Lock-Up Prevention`,
          summary: `Brake bias (%${setup.brakeBias}), threshold pressure (%${setup.brakePressure}) and engine braking (%${setup.engineBraking}) are inducing wheel lock-ups in heavy braking zones.`,
          problemAnalysis: `At %${setup.brakeBias} front bias, dynamic pitch transfer overloads the front axle under heavy deceleration, locking wheels as steering input begins.`,
          adjustments: [
            {
              category: 'Brakes',
              parameter: 'Front Brake Bias',
              currentValue: `${setup.brakeBias}%`,
              recommendedValue: `${targetBias}%`,
              changeDelta: `${targetBias - setup.brakeBias > 0 ? '+' : ''}${targetBias - setup.brakeBias}%`,
              adjustment: `Adjust front brake bias from ${setup.brakeBias}% to ${targetBias}%`,
              impact: 'Distributes stopping torque evenly across all four tires to eliminate front lock-up.',
              urgency: 'high',
            },
            {
              category: 'Brakes',
              parameter: 'Brake Pressure',
              currentValue: `${setup.brakePressure}%`,
              recommendedValue: `${targetPressure}%`,
              changeDelta: `-${setup.brakePressure - targetPressure}%`,
              adjustment: `Reduce brake pressure down to ${targetPressure}%`,
              impact: 'Widens threshold modulation window without losing braking distance.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Differential Off-Throttle',
              currentValue: `${setup.diffOffThrottle}%`,
              recommendedValue: `${targetDiffOff}%`,
              changeDelta: `+${targetDiffOff - setup.diffOffThrottle}%`,
              adjustment: `Increase off-throttle diff to ${targetDiffOff}%`,
              impact: 'Stabilizes straight-line braking and prevents rear wandering.',
              urgency: 'medium',
            },
            {
              category: 'Transmission',
              parameter: 'Engine Braking',
              currentValue: `${setup.engineBraking}%`,
              recommendedValue: `${targetEngineBraking}%`,
              changeDelta: `+${targetEngineBraking - setup.engineBraking}%`,
              adjustment: `Increase engine braking to ${targetEngineBraking}%`,
              impact: 'Utilizes powertrain compression to assist deceleration stability.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Front Suspension Springs',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `+2 clicks`,
              adjustment: `Stiffen front suspension from ${setup.frontSuspension} to ${targetFrontSusp}`,
              impact: 'Resists forward chassis dive to keep aerodynamic floor suction consistent.',
              urgency: 'medium',
            },
          ],
          telemetryTip: 'Apply maximum 100% threshold pressure while car is completely straight, then bleed off pressure progressively as steering lock increases.',
          quickActionSummary: `Adjust brake bias to ${targetBias}%, lower pressure to ${targetPressure}%, and raise off-throttle diff to ${targetDiffOff}%.`,
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
    const targetFrontRide = Math.min(45, setup.frontRideHeight + 3);
    const targetRearRide = Math.min(65, setup.rearRideHeight + 3);
    const targetFrontSusp = Math.max(1, setup.frontSuspension - 4);
    const targetRearSusp = Math.max(1, setup.rearSuspension - 3);
    const targetFrontARB = Math.max(1, setup.frontARB - 3);
    const targetFrontPSI = +(setup.frontTyrePressure - 0.4).toFixed(1);

    return isTr
      ? {
          title: `🚧 ${trackName} — Bordür (Kerb) Uyumluluğu & Taban Vurma Çözümü`,
          summary: `Mevcut taban yüksekliğiniz (${setup.frontRideHeight}/${setup.rearRideHeight}), sert yaylarınız (${setup.frontSuspension}/${setup.rearSuspension}) ve ARB ayarlarınız bordür darbelerinde aracın kontrolsüzce zıplamasına neden oluyor.`,
          problemAnalysis: `Alçak taban bordür tepesinde yere vurduğunda (bottoming out) Venturi zemin hava akımı kopar ve anlık aerodinamik kayıp yaşanır. Yayları ve viraj demirlerini yumuşatıp tabanı yükselterek bordür emilimini maksimize ediyoruz.`,
          adjustments: [
            {
              category: 'Suspension',
              parameter: 'Sürüş Yüksekliği (Ride Height Ön / Arka)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `+3 / +3 tık`,
              adjustment: `Ön tabanı ${setup.frontRideHeight}'den ${targetFrontRide}'e, Arka tabanı ${setup.rearRideHeight}'den ${targetRearRide}'e yükselt (+3 tık)`,
              impact: 'Bordür tepelerinde tabanın yere çarpmasını (bottoming out) önler.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Süspansiyon (Front Suspension)',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} tık`,
              adjustment: `Ön yay sertliğini ${setup.frontSuspension}'den ${targetFrontSusp}'e yumuşat`,
              impact: 'Amortisörlerin bordür sarsıntılarını sönümleyerek lastiklerin asfaltta kalmasını sağlar.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Ön Viraj Demiri (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} tık`,
              adjustment: `Ön ARB'yi ${setup.frontARB}'den ${targetFrontARB}'e düşür`,
              impact: 'Şasideki yanal rijitliği azaltarak bordürde tekerleklerin askıda kalmasını engeller.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Arka Süspansiyon (Rear Suspension)',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} tık`,
              adjustment: `Arka yay sertliğini ${setup.rearSuspension}'den ${targetRearSusp}'e yumuşat`,
              impact: 'Bordürden inişte arka aksın sert sekmesini engeller.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Ön Lastik Basınçları (Front Tyres)',
              currentValue: `${setup.frontTyrePressure} PSI`,
              recommendedValue: `${targetFrontPSI} PSI`,
              changeDelta: `-0.4 PSI`,
              adjustment: `Ön lastik basıncını ${setup.frontTyrePressure}'den ${targetFrontPSI} PSI'a düşür`,
              impact: 'Lastik yanak esnemesini artırarak bordür darbelerini ilk sönümleyen hava yastığı görevi görür.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Bordürlerin en yüksek sivri kısımlarından (sausage kerbs) kaçının; tekerleği bordürün düz boyalı şeridinde tutun.',
          quickActionSummary: `Taban yüksekliğini +3 tık artırın (${targetFrontRide}/${targetRearRide}), ön yayları ${targetFrontSusp}'e yumuşatın.`,
        }
      : {
          title: `🚧 ${trackName} — Kerb Compliance & Bottoming-Out Resolution`,
          summary: `Ride heights (${setup.frontRideHeight}/${setup.rearRideHeight}) and stiff springs (${setup.frontSuspension}) are unable to absorb violent kerb impacts, causing chassis bottoming.`,
          problemAnalysis: `Bottoming out on kerb crowns severs underfloor ground effect suction, tossing the car offline. Raising ride heights and softening suspension restores full compliance.`,
          adjustments: [
            {
              category: 'Suspension',
              parameter: 'Ride Height (Front / Rear)',
              currentValue: `${setup.frontRideHeight} / ${setup.rearRideHeight}`,
              recommendedValue: `${targetFrontRide} / ${targetRearRide}`,
              changeDelta: `+3 / +3 clicks`,
              adjustment: `Raise front ride height to ${targetFrontRide} and rear to ${targetRearRide} (+3 clicks)`,
              impact: 'Prevents floor planks from striking kerb crowns and causing sudden downforce stall.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Suspension Springs',
              currentValue: setup.frontSuspension,
              recommendedValue: targetFrontSusp,
              changeDelta: `-${setup.frontSuspension - targetFrontSusp} clicks`,
              adjustment: `Soften front springs from ${setup.frontSuspension} to ${targetFrontSusp}`,
              impact: 'Allows dampers to soak up high-frequency kerb impacts.',
              urgency: 'high',
            },
            {
              category: 'Suspension',
              parameter: 'Front Anti-Roll Bar (Front ARB)',
              currentValue: setup.frontARB,
              recommendedValue: targetFrontARB,
              changeDelta: `-${setup.frontARB - targetFrontARB} clicks`,
              adjustment: `Soften front ARB from ${setup.frontARB} to ${targetFrontARB}`,
              impact: 'Reduces lateral jarring across chassis when straddling kerbs.',
              urgency: 'medium',
            },
            {
              category: 'Suspension',
              parameter: 'Rear Suspension Springs',
              currentValue: setup.rearSuspension,
              recommendedValue: targetRearSusp,
              changeDelta: `-${setup.rearSuspension - targetRearSusp} clicks`,
              adjustment: `Soften rear springs to ${targetRearSusp}`,
              impact: 'Cushions chassis rebound when coming off exit kerbs.',
              urgency: 'medium',
            },
            {
              category: 'Tyres',
              parameter: 'Front Tyre Pressure',
              currentValue: `${setup.frontTyrePressure} PSI`,
              recommendedValue: `${targetFrontPSI} PSI`,
              changeDelta: `-0.4 PSI`,
              adjustment: `Lower front tyre pressure to ${targetFrontPSI} PSI`,
              impact: 'Allows tyre sidewall to act as a primary shock absorber over kerbs.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Clip the flat painted apron of kerbs while avoiding direct strikes onto pyramid sausage curbs.',
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
    const targetEngineBraking = Math.max(40, setup.engineBraking - 15);
    const targetRearWing = Math.min(50, setup.rearWing + 2);
    const targetRearCamber = Math.min(-0.70, +(setup.rearCamber + 0.15).toFixed(2));

    return isTr
      ? {
          title: `🔥 ${trackName} — Lastik Aşırı Isınması & Termal Aşınma Önleme`,
          summary: `Arka lastik basıncınız (${setup.rearTyrePressure} PSI), diferansiyel kilidiniz (%${setup.diffOnThrottle}) ve motor freniniz (%${setup.engineBraking}) viraj çıkışında mikro patinaj yaratarak lastik hamurunu aşırı ısıtıyor.`,
          problemAnalysis: `Yüksek lastik basıncı temas alanını daraltır. Viraj çıkışında kayan lastik 105°C+ sıcaklığa çıkarak tutuşunu hızla kaybeder. Basıncı düşürüp diferansiyeli ve motor frenini yumuşatarak termal dengeyi sağlıyoruz.`,
          adjustments: [
            {
              category: 'Tyres',
              parameter: 'Arka Lastik Basınçları (Rear Tyres)',
              currentValue: `${setup.rearTyrePressure} PSI`,
              recommendedValue: `${targetRearPSI} PSI`,
              changeDelta: `-0.8 PSI`,
              adjustment: `Arka lastik basınçlarını ${setup.rearTyrePressure}'den ${targetRearPSI} PSI'a düşür (-0.8 PSI)`,
              impact: 'İç gaz genleşmesini dengeler ve aşırı sıcaklık artışını doğrudan keser.',
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
              category: 'Transmission',
              parameter: 'Motor Freni (Engine Braking)',
              currentValue: `%${setup.engineBraking}`,
              recommendedValue: `%${targetEngineBraking}`,
              changeDelta: `-%${setup.engineBraking - targetEngineBraking}`,
              adjustment: `Motor frenini %${setup.engineBraking}'den %${targetEngineBraking}'e düşür`,
              impact: 'Yavaşlama anında arka lastiklerin sürüklenip ısınmasını önler.',
              urgency: 'medium',
            },
            {
              category: 'Aero',
              parameter: 'Arka Kanat (Rear Wing)',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+2 kademe`,
              adjustment: `Arka kanadı ${setup.rearWing}'den ${targetRearWing}'e yükselt`,
              impact: 'Arka tarafın kaymasını engelleyerek sürtünme kaynaklı termal yıpranmayı bitirir.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Arka Kamber (Rear Camber)',
              currentValue: `${setup.rearCamber}°`,
              recommendedValue: `${targetRearCamber}°`,
              changeDelta: `+0.15°`,
              adjustment: `Arka kamberi ${setup.rearCamber}°'den ${targetRearCamber}°'ye düzleştir`,
              impact: 'Lastik iç omuzunun aşırı ısınmasını engeller ve taban ısısını homojen yayar.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Arka lastikleri soğutmak için viraj çıkışlarında 1 vites yüksek kalın (Early upshift) ve ani gaz hareketlerinden kaçının.',
          quickActionSummary: `Arka lastik basıncını ${setup.rearTyrePressure} -> ${targetRearPSI} PSI'a indirin ve diferansiyeli %${targetDiffOn} yapın.`,
        }
      : {
          title: `🔥 ${trackName} — Tyre Overheating & Thermal Degradation Control`,
          summary: `Rear tyre pressure (${setup.rearTyrePressure} PSI), on-throttle diff (%${setup.diffOnThrottle}) and engine braking (%${setup.engineBraking}) are causing continuous micro-wheelspin and thermal spikes.`,
          problemAnalysis: `High pressures reduce the tyre contact patch. Under lateral loads, sliding surface friction overheats the carcass past 105°C. Lowering pressures, diff lock and engine braking restores thermal equilibrium.`,
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
              adjustment: `Reduce on-throttle diff to ${targetDiffOn}%`,
              impact: 'Eliminates micro-wheelspin on exit to preserve rubber compound.',
              urgency: 'high',
            },
            {
              category: 'Transmission',
              parameter: 'Engine Braking',
              currentValue: `${setup.engineBraking}%`,
              recommendedValue: `${targetEngineBraking}%`,
              changeDelta: `-${setup.engineBraking - targetEngineBraking}%`,
              adjustment: `Reduce engine braking to ${targetEngineBraking}%`,
              impact: 'Prevents rear tyre scrub and thermal build-up under heavy off-throttle deceleration.',
              urgency: 'medium',
            },
            {
              category: 'Aero',
              parameter: 'Rear Wing Level',
              currentValue: setup.rearWing,
              recommendedValue: targetRearWing,
              changeDelta: `+2 clicks`,
              adjustment: `Increase rear wing to ${targetRearWing}`,
              impact: 'Locks down rear traction to prevent lateral tire scrubbing.',
              urgency: 'medium',
            },
            {
              category: 'Geometry',
              parameter: 'Rear Camber',
              currentValue: `${setup.rearCamber}°`,
              recommendedValue: `${targetRearCamber}°`,
              changeDelta: `+0.15°`,
              adjustment: `Straighten rear camber to ${targetRearCamber}°`,
              impact: 'Evens out tyre inner shoulder temperature distribution.',
              urgency: 'low',
            },
          ],
          telemetryTip: 'Short-shift one gear higher out of slow corners to avoid aggressive wheelspin on straights.',
          quickActionSummary: `Lower rear tyre pressure to ${targetRearPSI} PSI and drop on-throttle diff to ${targetDiffOn}%.`,
        };
  }

  // Fallback generic diagnosis covering all setup categories
  const targetDiffOn = Math.max(50, setup.diffOnThrottle - 4);
  const targetDiffOff = Math.max(50, setup.diffOffThrottle - 2);
  const targetRearARB = Math.max(1, setup.rearARB - 2);
  const targetFrontWing = Math.min(50, setup.frontWing + 2);
  const targetEngineBraking = Math.max(40, setup.engineBraking - 10);
  const targetFrontRide = Math.max(10, setup.frontRideHeight - 1);
  const targetRearRide = Math.max(30, setup.rearRideHeight - 1);

  return isTr
    ? {
        title: `🔧 ${trackName} — Tam Telemetri ve 6-Kategori Setup İnce Ayar Paketi`,
        summary: `Mevcut setup parametrelerinize (${setup.frontWing}/${setup.rearWing} kanat, %${setup.diffOnThrottle}/%${setup.diffOffThrottle} diff, %${setup.engineBraking} motor freni, ${setup.frontARB}/${setup.rearARB} ARB, ${setup.frontRideHeight}/${setup.rearRideHeight} taban, ${setup.frontTyrePressure}/${setup.rearTyrePressure} PSI) göre önerilen telemetri revizyonu:`,
        problemAnalysis: `Bildirilen araç davranışı dengesizliği; Diferansiyel, Viraj Demiri, Motor Freni ve Kanat oranlarının pist karakteristiğiyle tam örtüşmemesinden kaynaklanır.`,
        adjustments: [
          {
            category: 'Aero',
            parameter: 'Ön Kanat (Front Wing)',
            currentValue: setup.frontWing,
            recommendedValue: targetFrontWing,
            changeDelta: `+2 kademe`,
            adjustment: `Ön kanadı ${setup.frontWing}'den ${targetFrontWing}'e artır`,
            impact: 'Viraj girişinde aracın apexe yönlenmesini güçlendirir.',
            urgency: 'high',
          },
          {
            category: 'Transmission',
            parameter: 'Gaza Basarken Diferansiyel (% On-Throttle)',
            currentValue: `%${setup.diffOnThrottle}`,
            recommendedValue: `%${targetDiffOn}`,
            changeDelta: `-%${setup.diffOnThrottle - targetDiffOn}`,
            adjustment: `Diferansiyeli %${setup.diffOnThrottle}'den %${targetDiffOn}'ye düşür`,
            impact: 'Viraj dönüş çevikliği ve dengeli çıkış çekişi sağlar.',
            urgency: 'high',
          },
          {
            category: 'Transmission',
            parameter: 'Motor Freni (Engine Braking)',
            currentValue: `%${setup.engineBraking}`,
            recommendedValue: `%${targetEngineBraking}`,
            changeDelta: `-%${setup.engineBraking - targetEngineBraking}`,
            adjustment: `Motor frenini %${setup.engineBraking}'den %${targetEngineBraking}'e ayarla`,
            impact: 'Frenaj ve gaz kesme anında şasi stabilitesini artırır.',
            urgency: 'medium',
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
          {
            category: 'Suspension',
            parameter: 'Sürüş Yüksekliği (Ride Height)',
            currentValue: `${setup.frontRideHeight}/${setup.rearRideHeight}`,
            recommendedValue: `${targetFrontRide}/${targetRearRide}`,
            changeDelta: `-1/-1 tık`,
            adjustment: `Sürüş yüksekliğini 1 tık alçaltarak taban emişini artır`,
            impact: 'Zemin etkisiyle aerodinamik çekişi güçlendirir.',
            urgency: 'low',
          },
        ],
        telemetryTip: 'Pistin en çok zaman kazanılan sektöründeki virajlara odaklanıp telemetri apex hızınızı referans alın.',
        quickActionSummary: `Diferansiyeli %${targetDiffOn} seviyesine çekin, Arka ARB'yi ${targetRearARB} yapın ve motor frenini %${targetEngineBraking} seviyesine ayarlayın.`,
      }
    : {
        title: `🔧 ${trackName} — Complete 6-Category Telemetry & Calibration Package`,
        summary: `Tailored adjustments based on your current setup (${setup.frontWing}/${setup.rearWing} wings, ${setup.diffOnThrottle}%/${setup.diffOffThrottle}% diff, ${setup.engineBraking}% engine braking, ${setup.frontARB}/${setup.rearARB} ARB, ${setup.frontRideHeight}/${setup.rearRideHeight} ride, ${setup.frontTyrePressure}/${setup.rearTyrePressure} PSI):`,
        problemAnalysis: `Chassis handling deficits trace back to differential preload, anti-roll bar distribution, engine braking, and aerodynamic wing balance.`,
        adjustments: [
          {
            category: 'Aero',
            parameter: 'Front Wing Level',
            currentValue: setup.frontWing,
            recommendedValue: targetFrontWing,
            changeDelta: `+2 clicks`,
            adjustment: `Increase front wing from ${setup.frontWing} to ${targetFrontWing}`,
            impact: 'Sharpens front axle response into corner apexes.',
            urgency: 'high',
          },
          {
            category: 'Transmission',
            parameter: 'Differential On-Throttle',
            currentValue: `${setup.diffOnThrottle}%`,
            recommendedValue: `${targetDiffOn}%`,
            changeDelta: `-${setup.diffOnThrottle - targetDiffOn}%`,
            adjustment: `Reduce on-throttle diff from ${setup.diffOnThrottle}% down to ${targetDiffOn}%`,
            impact: 'Enhances mid-corner rotation paired with smooth exit traction.',
            urgency: 'high',
          },
          {
            category: 'Transmission',
            parameter: 'Engine Braking',
            currentValue: `${setup.engineBraking}%`,
            recommendedValue: `${targetEngineBraking}%`,
            changeDelta: `-${setup.engineBraking - targetEngineBraking}%`,
            adjustment: `Calibrate engine braking from ${setup.engineBraking}% to ${targetEngineBraking}%`,
            impact: 'Harmonizes deceleration weight transfer and rear tyre compliance.',
            urgency: 'medium',
          },
          {
            category: 'Suspension',
            parameter: 'Rear Anti-Roll Bar (Rear ARB)',
            currentValue: setup.rearARB,
            recommendedValue: targetRearARB,
            changeDelta: `-${setup.rearARB - targetRearARB} clicks`,
            adjustment: `Soften rear ARB from ${setup.rearARB} down to ${targetRearARB}`,
            impact: 'Allows progressive mechanical weight transfer on acceleration.',
            urgency: 'medium',
          },
          {
            category: 'Suspension',
            parameter: 'Ride Height',
            currentValue: `${setup.frontRideHeight}/${setup.rearRideHeight}`,
            recommendedValue: `${targetFrontRide}/${targetRearRide}`,
            changeDelta: `-1/-1 click`,
            adjustment: `Lower ride height by 1 click for enhanced floor suction`,
            impact: 'Optimizes ground effect venturi tunnel velocity.',
            urgency: 'low',
          },
        ],
        telemetryTip: 'Focus on corner exit speed in the primary traction zones for maximum lap time gain.',
        quickActionSummary: `Set on-throttle diff to ${targetDiffOn}%, soften rear ARB to ${targetRearARB}, and tune engine braking to ${targetEngineBraking}%.`,
      };
}
