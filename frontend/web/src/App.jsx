import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import './blocks.js';
import 'blockly/python';

const defaultApiBase = import.meta.env.DEV ? 'http://localhost:5001' : '';
const apiBase = (import.meta.env.VITE_API_BASE ?? defaultApiBase).trim();
const withApiBase = (pathname) => {
  if (!apiBase) return null;
  return `${apiBase.replace(/\/$/, '')}${pathname}`;
};

// Static CSV list used in the GitHub Pages demo when there is no backend.
const STATIC_CSV_FILES = [
  'aircrafts_data.csv',
  'airports_data.csv',
  'boarding_passes.csv',
  'bookings.csv',
  'flights.csv',
  'seats.csv',
  'text.csv',
  'tickets.csv',
  'ticket_flights.csv',
  'wordcount.csv'
];

const toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <!-- File Reading -->
  <block type="read_csv"></block>

  <!-- Transformations -->
  <block type="flatmap"></block>
  <block type="map"></block>
  <block type="filter"></block>
   <block type="skip_header"></block>

  <!-- Aggregations -->
  <block type="reduce"></block>
  <block type="reduce_by_key"></block>

  <!-- Joins -->
  <block type="join"></block>
  <block type="join_rdd"></block>

  <!-- Storage & Output -->
  <block type="count"></block>
  <block type="sort_rdd"></block>
  <block type="store_as_rdd2"></block>
  <block type="store_result"></block>
  <block type="debug_print"></block>
</xml>
`;



export default function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  const [output,   setOutput]   = useState('');
  const [csvReady, setCsvReady] = useState(false);

  /*  Get CSV list once */
  useEffect(() => {
    const csvUrl = withApiBase('/api/csv-files');
    if (!csvUrl) {
      // Static demo mode (GitHub Pages): use the known CSV list from the repo.
      window.__CSV_FILE_OPTIONS__ = STATIC_CSV_FILES;
      setCsvReady(true);
      return;
    }

    fetch(csvUrl)
      .then(r => r.json())
      .then(list => {
        console.log('[frontend] csv list:', list);
        window.__CSV_FILE_OPTIONS__ = list;
        setCsvReady(true);
      })
      .catch(err => {
        console.error('[frontend] csv fetch failed:', err);
        setCsvReady(true);
      });
  }, []);

  /* 2️⃣  Inject Blockly when list ready */
  useEffect(() => {
    if (workspaceRef.current || !csvReady) return;

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxXml,
      grid   : { spacing: 20, length: 3, colour: '#ccc' },
      zoom   : { controls: true },
      theme  : Blockly.Themes.Classic
    });

    workspace.clear();
    workspaceRef.current = workspace;
    return () => workspace.dispose();
  }, [csvReady]);

  /* 3️⃣  Run handler */
  const handleRun = async () => {
    if (!workspaceRef.current) {
      setOutput('Workspace not ready yet.');
      return;
    }

    const codeBody = pythonGenerator.workspaceToCode(workspaceRef.current);
    const fullCode = [
      'from pyspark.sql import SparkSession',
      'from udf import *',
      'import sys',
      '',
      'spark = SparkSession.builder.master("local[*]").appName("BlocklyFlow").getOrCreate()',
      'sc = spark.sparkContext',
      '',
      '# variables',
      'rdd = None',
      'result = None',
      '',
      codeBody,
      '',
      'if hasattr(result, "take"):',
      '    print("Result preview:", result.take(10))',
      'else:',
      '    print("Result:", result)',
      'sys.stdout.flush()',
      'spark.stop()'
    ].join('\n');

    console.log('Generated Spark code:\n', fullCode);
    setOutput(fullCode);

    const runUrl = withApiBase('/api/run');
    if (!runUrl) {
      setOutput(
        `${fullCode}\n\n[Info] Backend is not configured in production. Run locally (backend on port 5001) to execute.`
      );
      return;
    }

    try {
      const res  = await fetch(runUrl, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ code: fullCode })
      });
      const data = await res.json();
      setOutput(data.stdout || data.error || 'No output.');
    } catch (err) {
      setOutput(`${fullCode}\n\n[Error] Failed to run: ${err.message}`);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Header Title */}
      <div style={{ padding: 16, background: '#222', color: 'white', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 28 }}>ShaRaFlow - Spark Drag‑and‑Drop Workflow</h2>
      </div>

      {/* Button Row */}
      <div style={{ padding: 12, background: '#333', display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={handleRun}
          style={{ fontSize: 16, padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
        >
          ▶️ Run Spark Job
        </button>

        <button
          onClick={() => {
            if (workspaceRef.current) {
              workspaceRef.current.clear();
            }
          }}
          style={{ fontSize: 16, padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4 }}
        >
           Clear Workspace
        </button>
      </div>

      {/* Main Split Screen */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Blockly Editor */}
        <div
          ref={blocklyDiv}
          style={{
            flex: 2,
            background: '#fafafa',
            borderRight: '2px solid #ccc'
          }}
        />

        {/* Output Console */}
        <div
          style={{
            flex: 1,
            background: '#111',
            color: '#0f0',
            padding: 16,
            overflowY: 'auto',
            fontFamily: 'monospace'
          }}
        >
          <h3 style={{ color: 'white', marginTop: 0 }}>🔍 Output</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
