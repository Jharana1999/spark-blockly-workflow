import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import './blocks.js';
import 'blockly/python';

const toolboxXml = /* xml */ `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="read_csv"></block>
  <block type="flatmap"></block>
  <block type="map"></block>
  <block type="filter"></block>
  <block type="reduce"></block>
  <block type="reduce_by_key"></block>
  <block type="count"></block>
  <block type="store_result"></block>
</xml>
`;

export default function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (workspaceRef.current) return;

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxXml,
      grid: { spacing: 20, length: 3, colour: '#ccc' },
      zoom: { controls: true },
      theme: Blockly.Themes.Classic
    });

    workspace.clear();
    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, []);

  const handleRun = async () => {
    const codeBody = pythonGenerator.workspaceToCode(workspaceRef.current);
    const fullCode = [
      'import os',
      'os.environ["JAVA_HOME"] = r"C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.7.6-hotspot"',
      'os.environ["PYSPARK_PYTHON"] = r"C:\\Users\\jhara\\AppData\\Local\\Programs\\Python\\Python311\\python.exe"',
      'os.environ["PYSPARK_DRIVER_PYTHON"] = r"C:\\Users\\jhara\\AppData\\Local\\Programs\\Python\\Python311\\python.exe"',
      '',
      'from pyspark.sql import SparkSession',
      'from udf import *',
      'import sys',
      '',
      'spark = SparkSession.builder.master("local[*]").appName("BlocklyFlow").getOrCreate()',
      'sc = spark.sparkContext',
      '',
      '# Initialize variables',
      'rdd = None',
      'result = None',
      '',
      codeBody,
      '',
      'print("File exists:", os.path.exists("../data/wordcount.txt"))',
      'print("RDD count:", rdd.count())',
      'if hasattr(result, "take"):',
      '    print("Result preview:", result.take(10))',
      'else:',
      '    print("Result:", result)',
      'sys.stdout.flush()',
      'spark.stop()'
    ].join('\n');

    console.log("\uD83D\uDD25 Generated Spark code:\n", fullCode);

    try {
      const res = await fetch('http://localhost:5001/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode })
      });

      const data = await res.json();
      setOutput(data.stdout || data.error || 'No output received.');
    } catch (err) {
      setOutput('Failed to run: ' + err.message);
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
