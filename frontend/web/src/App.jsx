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
  const blocklyDiv   = useRef(null);
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
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2> Spark Drag‑and‑Drop Workflow</h2>
      <button onClick={handleRun} style={{ fontSize: 16, padding: '6px 14px' }}>
        ▶️ Run Spark Job
      </button>

      <div
        ref={blocklyDiv}
        style={{
          marginTop: 20,
          height: '60vh',
          width: 800,
          border: '1px solid #ccc',
          background: '#fafafa'
        }}
      />

      <h3>🔍 Output</h3>
      <pre style={{ background: '#f5f5f5', padding: 12, whiteSpace: 'pre-wrap' }}>
        {output}
      </pre>
    </div>
  );
}