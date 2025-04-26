import express        from 'express';
import bodyParser     from 'body-parser';
import cors           from 'cors';
import { PythonShell } from 'python-shell';
import fs             from 'fs/promises';
import path           from 'path';
import os             from 'os';
import { fileURLToPath } from 'url';

const app = express();

/* ───────────── 0.  Path helpers ───────────── */
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);          // folder where server.js lives
const PROJECT_ROOT = path.resolve(__dirname, '..');     // one level up
const DATA_DIR     = path.join(PROJECT_ROOT, 'data');   //  …/data
console.log('[backend] DATA_DIR →', DATA_DIR);

/* ───────────── 1.  CORS ───────────────────── */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

/* ───────────── 2.  Body parser ────────────── */
app.use(bodyParser.json());

/* ───────────── 3.  Env for PySpark ────────── */
const PY = 'C:\\Users\\jhara\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';

process.env.JAVA_HOME             = 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.7.6-hotspot';
process.env.PYSPARK_PYTHON        = PY;
process.env.PYSPARK_DRIVER_PYTHON = PY;
process.env.PYTHONPATH            = path.join(PROJECT_ROOT, 'udf');

/* ───────────── helper: rewrite data paths ─── */
const rewriteDataPaths = src =>
  src.replace(/sc\.textFile\(["']\.{0,2}\/data\/([^"']+)["']\)/g,
              (_, f) => `sc.textFile("${path.join(DATA_DIR, f).replace(/\\/g, '/')}")`);

const KILL_SPAM = /^SUCCESS: .*terminated\.\s*$/m;

/* ───────────── 4.  CSV list endpoint ──────── */
app.get('/api/csv-files', async (_req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const csvs  = files.filter(f => f.toLowerCase().endsWith('.csv'));
    console.log(`[backend] /api/csv-files → ${csvs.length} file(s)`);
    res.json(csvs);
  } catch (err) {
    console.error('[backend] CSV endpoint failed:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ───────────── 5.  Run-code endpoint ──────── */
app.post('/api/run', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const script    = rewriteDataPaths(code);
    const scriptPat = path.join(os.tmpdir(), 'blockly_flow.py');
    await fs.writeFile(scriptPat, script);

    const pyshell = new PythonShell(scriptPat, {
      pythonPath   : PY,
      pythonOptions: ['-u'],
      mode         : 'text',
      env          : { ...process.env }
    });

    let stdout = '', stderr = '';

    pyshell.on('message', l => { if (!KILL_SPAM.test(l)) stdout += l + '\n'; });
    pyshell.on('stderr',  l => { if (!KILL_SPAM.test(l)) stderr += l + '\n'; });

    pyshell.end(err => {
      if (err) stderr += `\n[PYTHON-ERROR] ${err.message}\n${err.stack}`;
      const clean = t => t.replace(KILL_SPAM, '').trim();
      res.json({ stdout: clean(stdout), error: clean(stderr) });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ───────────── 6.  Start server ───────────── */
const PORT = 5001;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
