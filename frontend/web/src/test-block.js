import * as Blockly from 'blockly';

// Just a simple block chain: A → B → C

Blockly.Blocks['step_one'] = {
  init() {
    this.appendDummyInput().appendField('Step One');
    this.setNextStatement(true, 'CHAIN');
    this.setColour(160);
  }
};

Blockly.Blocks['step_two'] = {
  init() {
    this.appendDummyInput().appendField('Step Two');
    this.setPreviousStatement(true, 'CHAIN');
    this.setNextStatement(true, 'CHAIN');
    this.setColour(210);
  }
};

Blockly.Blocks['step_three'] = {
  init() {
    this.appendDummyInput().appendField('Step Three');
    this.setPreviousStatement(true, 'CHAIN');
    this.setColour(270);
  }
};
