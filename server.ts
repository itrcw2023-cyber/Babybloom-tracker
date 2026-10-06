import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// 1. Global CORS & Security Headers for external PWA scanners (PWABuilder / Lighthouse / Android TWA)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// 2. Explicit PWA endpoints
app.get(['/manifest.json', '/manifest.webmanifest'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

app.get('/sw.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

app.get('/.well-known/assetlinks.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.resolve(__dirname, 'public', '.well-known', 'assetlinks.json'));
});

// 3. Serve public directory assets (PNGs, icons, svgs)
app.use(express.static(path.resolve(__dirname, 'public')));

// 4. Middleware to parse large JSON payloads for images (up to 25MB)
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI on server side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Time synchronization endpoint (+08:00 Asia/Manila)
app.get('/api/time', (_req, res) => {
  const now = new Date();
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json({
    timestamp: now.getTime(),
    utc: now.toISOString(),
    timezone: 'Asia/Manila',
    offsetMinutes: 480, // +08:00
    formatted: {
      date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now),
      time: new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
    }
  });
});

// Photo analysis API endpoint
app.post('/api/analyze-photo', async (req, res) => {
  try {
    const { image, category = 'general', week = 22, notes = '' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Parse base64 and mimeType
    let base64Data = image;
    let mimeType = 'image/jpeg';

    if (image.startsWith('data:')) {
      const parts = image.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      base64Data = parts[1];
    }

    const promptText = `
Analyze this pregnancy photo for the mother's BabyBloom pregnancy journal.
Context:
- Current gestational week: Week ${week}
- User indicated category: ${category}
- User notes: ${notes || 'None provided'}

Task:
1. Provide a tender, supportive, and educational summary of what this photo shows.
2. If it is an ultrasound, explain common landmarks visible (e.g. head contour, spine, limb buds, profile, placenta orientation, amniotic space) in simple, reassuring words for an expectant mother.
3. If it is a bump photo, celebrate the gestational milestone, posture, and healthy growth.
4. If it is nursery gear or baby clothing, provide helpful safety or comfort suggestions.
5. If it is a healthy meal, highlight nourishing vitamins (folate, iron, calcium, DHA) for baby.
6. Provide gentle suggestions for mom's comfort and well-being.
7. Include a clear medical reassurance disclaimer that this is a personal wellness journal observation, not a diagnostic medical interpretation.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short charming headline for this moment' },
            summary: { type: Type.STRING, description: '2-3 sentence warm summary of the photo' },
            keyObservations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 key visual highlights observed in ultrasound or photo'
            },
            sweetMilestoneNote: { type: Type.STRING, description: 'Heartfelt milestone note relating to baby development' },
            helpfulSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 practical tips for mama comfort or preparation'
            },
            medicalDisclaimer: {
              type: Type.STRING,
              description: 'Gentle reassurance and reminder to consult OB-GYN for medical advice'
            }
          },
          required: ['title', 'summary', 'keyObservations', 'sweetMilestoneNote', 'helpfulSuggestions', 'medicalDisclaimer']
        }
      }
    });

    const resultText = response.text || '{}';
    const parsedData = JSON.parse(resultText);

    return res.json({
      success: true,
      analysis: parsedData
    });
  } catch (error: any) {
    console.error('Error analyzing photo with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to analyze photo with Gemini',
      message: error?.message || 'Server error'
    });
  }
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
