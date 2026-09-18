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
        description: 'Access exclusive PRL League setups, race results, and connect with fellow league drivers.',
        buttonText: 'Join PRL League',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'ADVERTISEMENT',
        onlineCount: 428,
        iconType: 'discord',
        accentColor: 'indigo',
      },
      {
        id: 'custom-announcement-slot-1',
        title: 'Custom Announcement 1',
        highlightText: 'Featured',
        description: 'Easily customize this slot with your partner links, sponsors, race leagues, or setup guides.',
        buttonText: 'Configure Link',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'ANNOUNCEMENT 1',
        onlineCount: 150,
        iconType: 'sparkles',
        accentColor: 'amber',
      },
      {
        id: 'custom-announcement-slot-2',
        title: 'Custom Announcement 2',
        highlightText: 'Hot Event',
        description: 'Register for upcoming hotlap competitions, telemetry breakdown sessions, and driver coaching.',
        buttonText: 'View Events',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'ANNOUNCEMENT 2',
        onlineCount: 310,
        iconType: 'trophy',
        accentColor: 'emerald',
      },
      {
        id: 'custom-template-slot-4',
        title: 'Your Ad / Sponsor Here',
        highlightText: 'Available',
        description: 'Space available for community partners, esports teams, or custom setup announcements.',
        buttonText: 'Add Your Link',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'SPONSOR / AD',
        onlineCount: 200,
        iconType: 'zap',
        accentColor: 'cyan',
      },
      {
        id: 'custom-announcement-slot-5',
        title: 'Apex Esports Academy',
        highlightText: 'Driver Coaching',
        description: 'Get telemetry analysis, master braking points, and compete in weekly championship lobbies.',
        buttonText: 'Join Academy Hub',
        buttonUrl: 'https://discord.gg/aFzAhfBy3',
        badgeText: 'COACHING / ESPORTS',
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
