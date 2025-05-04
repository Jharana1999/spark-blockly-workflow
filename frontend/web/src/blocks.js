/* ─────────  Blockly & generator  ───────── */
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

/* Helper that always shows the latest CSV list coming from React */
const csvOptions = () =>
  (window.__CSV_FILE_OPTIONS__ || []).map(f => [f, f]);

/* ─────── READ CSV  (single-select) ─────── */
Blockly.Blocks.read_csv = {
  init() {
    this.appendDummyInput()
      .appendField('Read CSV')
      .appendField(
        new Blockly.FieldDropdown(csvOptions),
        'PATH'
      );
    this.setNextStatement(true, 'RDD');
    this.setColour(160);
  }
};

pythonGenerator.forBlock['read_csv'] = blk => {
  const file = blk.getFieldValue('PATH');
  if (!file) return '# No CSV selected\n';
  return `rdd = sc.textFile("../data/${file}")\n`;
};

/* ─────── MAP ─────── */
Blockly.Blocks.map = {
  init() {
    this.appendDummyInput()
      .appendField('map with')
      .appendField(
        new Blockly.FieldDropdown([
          ['add1', 'add1'],
          ['splitCSV', 'splitCSV'],
          ['toPair', 'toPair'],
          ['parseFlights', 'parseFlights'],
          ['parseTicketFlights', 'parseTicketFlights'],
          ['parseAirports', 'parseAirports'],
          ['toDepAmount', 'toDepAmount'],
          ['extractLeft', 'extractLeft'],
          ['extractRight', 'extractRight'],
          ['toDepartureKeyVal', 'toDepartureKeyVal'],
          ['toAircraftKeyVal', 'toAircraftKeyVal'],
          ['avgFromTuple', 'avgFromTuple'],
          ['keepMax', 'keepMax']
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

/* ─────── FLATMAP ─────── */
Blockly.Blocks.flatmap = {
  init() {
    this.appendDummyInput()
      .appendField('flatMap with')
      .appendField(
        new Blockly.FieldDropdown([
          ['splitCSV', 'splitCSV']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(175);
  }
};
pythonGenerator.forBlock['flatmap'] = b =>
  `rdd = rdd.flatMap(${b.getFieldValue('UDF')})\n`;

/* ─────── FILTER ─────── */
Blockly.Blocks.filter = {
  init() {
    this.appendDummyInput()
      .appendField('filter with')
      .appendField(
        new Blockly.FieldDropdown([
          ['greaterThan10', 'greaterThan10'],
          ['isLongWord', 'isLongWord'],
          ['notNone', 'notNone'],
          ['notHeaderOrUnknown', 'notHeaderOrUnknown']
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

/* ─────── REDUCE ─────── */
Blockly.Blocks.reduce = {
  init() {
    this.appendDummyInput()
      .appendField('reduce with')
      .appendField(
        new Blockly.FieldDropdown([
          ['sumInts', 'sumInts']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(260);
  }
};
pythonGenerator.forBlock['reduce'] = b =>
  `result = rdd.reduce(${b.getFieldValue('UDF')})\n`;

/* ─────── REDUCE BY KEY ─────── */
Blockly.Blocks.reduce_by_key = {
  init() {
    this.appendDummyInput()
      .appendField('reduceByKey with')
      .appendField(
        new Blockly.FieldDropdown([
          ['sumInts', 'sumInts'],
          ['keepMax', 'keepMax']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(260);
  }
};
pythonGenerator.forBlock['reduce_by_key'] = b =>
  `rdd = rdd.reduceByKey(${b.getFieldValue('UDF')})\n`;

/* ─────── JOIN (single CSV) ─────── */
Blockly.Blocks.join = {
  init() {
    this.appendDummyInput()
      .appendField('join with')
      .appendField(
        new Blockly.FieldDropdown(csvOptions),
        'PATH'
      )
      .appendField('using mapper')
      .appendField(
        new Blockly.FieldDropdown([
          ['toPair', 'toPair'],
          ['parseFlights', 'parseFlights'],
          ['parseTicketFlights', 'parseTicketFlights'],
          ['parseAirports', 'parseAirports'],
          ['toDepartureKeyVal', 'toDepartureKeyVal']
        ]),
        'UDF'
      );
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(215);
  }
};

pythonGenerator.forBlock['join'] = blk => {
  const file = blk.getFieldValue('PATH');
  const udf  = blk.getFieldValue('UDF');
  if (!file) return '# No join CSV selected\n';

  return (
    `rdd2 = sc.textFile("../data/${file}")\\\n` +
    `        .map(${udf})\\\n` +
    `        .filter(notNone)\n` +
    `rdd  = rdd.filter(notNone).join(rdd2)\n`
  );
};

/* ─────── COUNT ─────── */
Blockly.Blocks.count = {
  init() {
    this.appendDummyInput().appendField('count');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(290);
  }
};
pythonGenerator.forBlock['count'] = () =>
  `result = rdd\n`;

/* ─────── STORE RESULT ─────── */
Blockly.Blocks.store_result = {
  init() {
    this.appendDummyInput().appendField('Store as result');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(320);
  }
};
pythonGenerator.forBlock['store_result'] = () =>
  `result = rdd\n`;

// DISPLAY RESULT
Blockly.Blocks.debug_print = {
  init() {
    this.appendDummyInput()
      .appendField('Display results');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(320);
  }
};

pythonGenerator.forBlock['debug_print'] = () => {
  return `
try:
    import pyspark
    df = rdd.toDF(["key", "value"])
    print("Displaying as DataFrame:")
    df.show(n=5, truncate=False)
except Exception as e:
    print("Could not display RDD as DataFrame:", e)
`.trim() + '\n';
};

/* ─────── JOIN EXISTING RDDs ─────── */
Blockly.Blocks.join_rdd = {
  init() {
    this.appendDummyInput()
      .appendField('join with another RDD');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(215);
  }
};
pythonGenerator.forBlock['join_rdd'] = () =>
  `rdd = rdd.join(rdd2)\n`;

/* ─────── STORE AS RDD2 ─────── */
Blockly.Blocks.store_as_rdd2 = {
  init() {
    this.appendDummyInput()
      .appendField('store as rdd');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(320);
  }
};
pythonGenerator.forBlock['store_as_rdd2'] = () =>
  `rdd2 = rdd\n`;

// SKIP HEADER
Blockly.Blocks.skip_header = {
  init() {
    this.appendDummyInput()
      .appendField('Skip Header Row');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(280);
  }
};

pythonGenerator.forBlock['skip_header'] = () => {
  return `rdd = rdd.zipWithIndex().filter(lambda x: x[1] > 0).map(lambda x: x[0])\n`;
};

// SORT RDD
Blockly.Blocks.sort_rdd = {
  init() {
    this.appendDummyInput()
      .appendField('Sort RDD by')
      .appendField(new Blockly.FieldDropdown([
        ['Key Ascending', 'key_asc'],
        ['Key Descending', 'key_desc'],
        ['Value Ascending', 'val_asc'],
        ['Value Descending', 'val_desc']
      ]), 'ORDER');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(240);
  }
};

pythonGenerator.forBlock['sort_rdd'] = (block) => {
  const order = block.getFieldValue('ORDER');
  if (order === 'key_asc') {
    return `rdd = rdd.sortByKey(ascending=True)\n`;
  } else if (order === 'key_desc') {
    return `rdd = rdd.sortByKey(ascending=False)\n`;
  } else if (order === 'val_asc') {
    return `rdd = rdd.sortBy(lambda x: x[1], ascending=True)\n`;
  } else if (order === 'val_desc') {
    return `rdd = rdd.sortBy(lambda x: x[1], ascending=False)\n`;
  }
  return '';
};