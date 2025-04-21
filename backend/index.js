
import express        from 'express';
import bodyParser     from 'body-parser';
import cors           from 'cors';
import { PythonShell } from 'python-shell';
import fs             from 'fs/promises';
import path           from 'path';
import os             from 'os';

const app = express();

/* ─────────────────── 1. CORS ─────────────────── */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

/* ─────────────────── 2. Body parser ───────────── */
app.use(bodyParser.json());

/* ─────────────────── 3. Paths & env ───────────── */
const PROJECT_ROOT      = path.resolve('..');
const DATA_DIR          = path.join(PROJECT_ROOT, 'data');
const PY              = 'C:\\Users\\jhara\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';

process.env.JAVA_HOME             = 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.7.6-hotspot';
process.env.PYSPARK_PYTHON        = PY;
process.env.PYSPARK_DRIVER_PYTHON = PY;
process.env.PYTHONPATH            = path.join(PROJECT_ROOT, 'udf');  

/* ─────────────────── helpers ──────────────────── */
const rewriteDataPaths = c =>
  c.replace(/sc\.textFile\(["']\.{0,2}\/data\/([^"']+)["']\)/g,
            (_, f) => `sc.textFile("${path.join(DATA_DIR, f).replace(/\\/g, '/') }")`);

// catch every flavour of the “SUCCESS: … terminated.” line (CR, LF, or both)
const KILL_SPAM = /^SUCCESS: .*terminated\.\s*$/m;

/* ─────────────────── 4. Run‑code endpoint ─────── */
app.post('/api/run', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const script    = rewriteDataPaths(code);
    const scriptPat = path.join(os.tmpdir(), 'blockly_flow.py');
    await fs.writeFile(scriptPat, script);

    const pyOpts = {
      pythonPath   : PY,
      pythonOptions: ['-u'],   
      mode         : 'text',
      env          : { ...process.env }
    };

    const pyshell = new PythonShell(scriptPat, pyOpts);
    let stdout = '', stderr = '';

    pyshell.on('message', l => { if (!KILL_SPAM.test(l)) stdout += l + '\n'; });
    pyshell.on('stderr',  l => { if (!KILL_SPAM.test(l)) stderr += l + '\n'; });

    pyshell.end(err => {
      if (err) stderr += `\n[PYTHON‑ERROR] ${err.message}\n${err.stack}`;

      // final sweep just in case the spam came through in a chunk
      const clean = txt => txt.replace(KILL_SPAM, '').trim();

      res.json({ stdout: clean(stdout), error: clean(stderr) });
    });

  } catch (e) {
    console.error('Server error:', e);
    res.status(500).json({ error: e.message });
  }
});

/* ─────────────────── 5. Start server ──────────── */
const PORT = 5001;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
