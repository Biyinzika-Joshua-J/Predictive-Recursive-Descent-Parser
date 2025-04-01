// const {} = require('');
const {Parser} = require('../src/parser');

const parser = new Parser();

const program = '34';

const ast = parser.parse(program)

// make this assertion
console.log(JSON.stringify(ast, null, 2));