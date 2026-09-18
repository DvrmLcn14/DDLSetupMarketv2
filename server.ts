import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON payload parser for base64 images and large config payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure persistent data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const bannerConfigFile = path.join(dataDir, 'banner-config.json');
  const setupsFile = path.join(dataDir, 'setups.json');

  // Default initial banner configuration
  const defaultBannerConfig = {
    enabled: true,
    autoRotate: true,
    intervalSeconds: 3,
    items: [
      {
        id: 'prl-league-ad',
        title: 'Join PRL League',
        highlightText: 'Official League',
        description: 'Access exclusive PRL League setups, live race telemetry, championship standings, and connect with fellow F1 drivers.',
        buttonText: 'Join PRL League',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'OFFICIAL LEAGUE',
        onlineCount: 428,
        iconType: 'discord',
        accentColor: 'indigo',
      },
      {
        id: 'ddl-community-discord',
        title: 'DDL Setup Discord Community',
        highlightText: 'Hot Community',
        description: 'Get daily esports setups for F1 24, F1 25 & F1 26, discuss racing lines, and get 1-on-1 tuning help from creators.',
        buttonText: 'Join Discord Server',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'HOT COMMUNITY',
        onlineCount: 1280,
        iconType: 'discord',
        accentColor: 'amber',
      },
      {
        id: 'weekly-hotlap-trials',
        title: 'Weekly Hotlap Time Trials',
        highlightText: 'Prize Pool',
        description: 'Compete on Spa & Silverstone leaderboards with verified telemetry screenshots. Win exclusive Verified Creator badges.',
        buttonText: 'View Leaderboards',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'WEEKLY EVENT',
        onlineCount: 340,
        iconType: 'trophy',
        accentColor: 'emerald',
      },
      {
        id: 'telemetry-coaching-hub',
        title: 'Telemetry & Coaching Hub',
        highlightText: 'Pro Guides',
        description: 'Master corner exit throttle control, differential tuning, and optimal wing aerodynamic setups with esports coaches.',
        buttonText: 'Access Setup Guides',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'COACHING HUB',
        onlineCount: 215,
        iconType: 'zap',
        accentColor: 'cyan',
      },
      {
        id: 'apex-esports-championship',
        title: 'Apex Esports Championship',
        highlightText: 'Championship',
        description: 'Register for Tier 1 & Tier 2 Sunday league races with FIA-grade stewarding and broadcasted live streams.',
        buttonText: 'Register for League',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'CHAMPIONSHIP',
        onlineCount: 560,
        iconType: 'flag',
        accentColor: 'purple',
      },
    ],
  };

  // Load existing global banner config from file or initialize with default
  let globalBannerConfig = defaultBannerConfig;
  try {
    if (fs.existsSync(bannerConfigFile)) {
      const raw = fs.readFileSync(bannerConfigFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        globalBannerConfig = parsed;
      }
    } else {
      fs.writeFileSync(bannerConfigFile, JSON.stringify(defaultBannerConfig, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error loading global banner config file:', err);
  }

  // Load existing custom setups from file
  let globalCustomSetups: any[] = [];
  try {
    if (fs.existsSync(setupsFile)) {
      const raw = fs.readFileSync(setupsFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        globalCustomSetups = parsed;
      }
    }
  } catch (err) {
    console.error('Error loading global setups file:', err);
  }

  // ==========================================
  // PUBLIC GLOBAL API ROUTES
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/banner-config - Fetch globally active banner & advertisement slots for all visitors
  app.get('/api/banner-config', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
      success: true,
      config: globalBannerConfig,
      updatedAt: new Date().toISOString(),
    });
  });

  // POST /api/banner-config - Save global banner & advertisement slots so all visitors see updates
  app.post('/api/banner-config', (req, res) => {
    try {
      const newConfig = req.body;
      if (!newConfig || typeof newConfig !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid config payload' });
      }

      globalBannerConfig = newConfig;
      fs.writeFileSync(bannerConfigFile, JSON.stringify(newConfig, null, 2), 'utf-8');
      console.log('✅ Global advertisement banner config updated by admin. Visible to all users.');

      res.json({
        success: true,
        message: 'Advertisement banner saved globally for all visitors.',
        config: globalBannerConfig,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error saving global banner config:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save banner config' });
    }
  });

  // GET /api/setups - Fetch globally persisted community setups
  app.get('/api/setups', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
      success: true,
      setups: globalCustomSetups,
    });
  });

  // POST /api/setups - Save / sync user submitted setups globally
  app.post('/api/setups', (req, res) => {
    try {
      const setupsList = req.body;
      if (Array.isArray(setupsList)) {
        globalCustomSetups = setupsList;
        fs.writeFileSync(setupsFile, JSON.stringify(setupsList, null, 2), 'utf-8');
        res.json({ success: true, message: 'Setups saved globally', count: setupsList.length });
      } else {
        res.status(400).json({ success: false, error: 'Expected array of setups' });
      }
    } catch (err: any) {
      console.error('Error saving setups:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE / PRODUCTION STATIC FALLBACK
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏎️ DDLSetupMarket Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
