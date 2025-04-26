import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

/* Filled from React before Blockly injects */
window.__CSV_FILE_OPTIONS__ = [];

/* ────────── READ-CSV ────────── */
Blockly.Blocks.read_csv = {
  init() {
    this.appendDummyInput()
      .appendField('Read CSV')
      .appendField(
        new Blockly.FieldDropdown(() => {
          const files = window.__CSV_FILE_OPTIONS__;
          return files.length
            ? files.map(f => [f, `../data/${f}`])
            : [['<no-csv-found>', '']];
        }),
        'PATH'
      );
    this.setNextStatement(true, 'RDD');
    this.setColour(160);
  }
};

pythonGenerator.forBlock['read_csv'] = blk =>
  `rdd = sc.textFile("${blk.getFieldValue('PATH')}")\n`;

/* ────────── MAP ────────── */
Blockly.Blocks.map = {
  init() {
    this.appendDummyInput()
      .appendField('map with')
      .appendField(new Blockly.FieldDropdown([
        ['add1', 'add1'],
        ['splitCSV', 'splitCSV'],
        ['toPair', 'toPair'],
        ['parseFlights', 'parseFlights'],
        ['parseTicketFlights', 'parseTicketFlights'],
        ['parseAirports', 'parseAirports'],
        ['extractLeft', 'extractLeft'],
        ['extractRight', 'extractRight']
      ]), 'UDF');
      .appendField(
        new Blockly.FieldDropdown([
          ['add1', 'add1'],
          ['splitCSV', 'splitCSV'],
          ['toPair', 'toPair']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(195);
  }
};

pythonGenerator.forBlock['map'] = b =>
  `rdd = rdd.map(${b.getFieldValue('UDF')})\n`;

/* ────────── FLATMAP ──────── */
Blockly.Blocks.flatmap = {
  init() {
    this.appendDummyInput()
      .appendField('flatMap with')
      .appendField(new Blockly.FieldDropdown([['splitCSV', 'splitCSV']]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(175);
  }
};

pythonGenerator.forBlock['flatmap'] = b =>
  `rdd = rdd.flatMap(${b.getFieldValue('UDF')})\n`;

/* ────────── FILTER ──────── */
Blockly.Blocks.filter = {
  init() {
    this.appendDummyInput()
      .appendField('filter with')
      .appendField(
        new Blockly.FieldDropdown([
          ['greaterThan10', 'greaterThan10'],
          ['isLongWord', 'isLongWord']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(230);
  }
};


pythonGenerator.forBlock['filter'] = b =>
  `rdd = rdd.filter(${b.getFieldValue('UDF')})\n`;

/* ────────── REDUCE ──────── */
Blockly.Blocks.reduce = {
  init() {
    this.appendDummyInput()
      .appendField('reduce with')
      .appendField(new Blockly.FieldDropdown([
        ['sumInts', 'sumInts']
      ]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(260);
  }
};

Blockly.Blocks.reduce_by_key = {
  init() {
    this.appendDummyInput()
      .appendField('reduceByKey with')
      .appendField(new Blockly.FieldDropdown([
        ['sumInts', 'sumInts']
      ]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(260);
  }
};

pythonGenerator.forBlock['reduce'] = b =>
  `result = rdd.reduce(${b.getFieldValue('UDF')})\n`;

/* ────────── REDUCE BY KEY ── */
Blockly.Blocks.reduce_by_key = {
  init() {
    this.appendDummyInput()
      .appendField('reduceByKey with')
      .appendField(new Blockly.FieldDropdown([['sumInts', 'sumInts']]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(260);
  }
};


pythonGenerator.forBlock['reduce_by_key'] = b =>
  `rdd = rdd.reduceByKey(${b.getFieldValue('UDF')})\n`;

/* ────────── COUNT ───────── */
Blockly.Blocks.count = {
  init() {
    this.appendDummyInput().appendField('count');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(290);
  }
};

pythonGenerator.forBlock['count'] = () => 'result = rdd\n';

/* ────────── STORE RESULT ─ */
Blockly.Blocks.store_result = {
  init() {
    this.appendDummyInput().appendField('Store as result');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(320);
  }
};

pythonGenerator.forBlock['store_result'] = () => 'result = rdd\n';
