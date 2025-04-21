import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';


// READ‑CSV
Blockly.Blocks.read_csv = {
    init() {
      this.appendDummyInput()
        .appendField('Read CSV')
        .appendField(new Blockly.FieldTextInput('../data/wordcount.txt'), 'PATH');
      this.setNextStatement(true, 'RDD');
      this.setColour(160);
    }
  };

// MAP
Blockly.Blocks.map = {
  init() {
    this.appendDummyInput()
      .appendField('map with')
      .appendField(new Blockly.FieldDropdown([
        ['add1', 'add1'],
        ['splitCSV', 'splitCSV'],
        ['toPair', 'toPair']
      ]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(195);
  }
};

// FILTER
Blockly.Blocks.filter = {
  init() {
    this.appendDummyInput()
      .appendField('filter with')
      .appendField(new Blockly.FieldDropdown([
        ['greaterThan10', 'greaterThan10'],
        ['isLongWord', 'isLongWord']
      ]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');
    this.setColour(230);
  }
};

// REDUCE
Blockly.Blocks.reduce = {
  init() {
    this.appendDummyInput()
      .appendField('reduce with')
      .appendField(new Blockly.FieldDropdown([['sumInts', 'sumInts']]), 'UDF');
    this.setPreviousStatement(true, 'RDD');
    this.setNextStatement(true, 'RDD');   // allows chaining
    this.setColour(260);
  }
};

// COUNT
Blockly.Blocks.count = {
  init() {
    this.appendDummyInput().appendField('count');
    this.setPreviousStatement(true, 'RDD');
    this.setColour(290);
  }
};


// STORE RESULT
Blockly.Blocks.store_result = {
    init() {
      this.appendDummyInput().appendField('Store as result');
      this.setPreviousStatement(true, 'RDD');
      this.setColour(320); 
    }
  };
  
  pythonGenerator.forBlock['store_result'] = () => {
    return `result = rdd\n`; 
  };

//REDUCE BY KEY
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
  
  pythonGenerator.forBlock['reduce_by_key'] = (block) => {
    const fn = block.getFieldValue('UDF');
    return `rdd = rdd.reduceByKey(${fn})\n`;
  };


  // FLATMAP
Blockly.Blocks.flatmap = {
    init() {
      this.appendDummyInput()
        .appendField('flatMap with')
        .appendField(new Blockly.FieldDropdown([
          ['splitCSV', 'splitCSV']
        ]), 'UDF');
      this.setPreviousStatement(true, 'RDD');
      this.setNextStatement(true, 'RDD');
      this.setColour(175); // Unique color for flatMap
    }
  };
  
  pythonGenerator.forBlock['flatmap'] = (block) => {
    const fn = block.getFieldValue('UDF');
    return `rdd = rdd.flatMap(${fn})\n`;
  };
  

pythonGenerator.forBlock['read_csv'] = (block) => {
  const path = block.getFieldValue('PATH');
  return `rdd = sc.textFile("${path}")\n`;
};

pythonGenerator.forBlock['map'] = (block) => {
  const fn = block.getFieldValue('UDF');
  return `rdd = rdd.map(${fn})\n`;
};

pythonGenerator.forBlock['filter'] = (block) => {
  const fn = block.getFieldValue('UDF');
  return `rdd = rdd.filter(${fn})\n`;
};

pythonGenerator.forBlock['reduce'] = (block) => {
  const fn = block.getFieldValue('UDF');
  return `result = rdd.reduce(${fn})\n`;
};

pythonGenerator.forBlock['count'] = () => {
  return `result = rdd \n`;
};


