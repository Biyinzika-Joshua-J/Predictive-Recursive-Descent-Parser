// const {} = require('');
const {Parser} = require('../src/parser');

const parser = new Parser();

// const program = `"34"`;
// const program = `'34'`;
// const program = `34`;

const program = [
    `"34"`,
    `'34'`,
    `34`,
    `   34   `,
    `
        // this is a single line comment
        "The single line comment above should be ignored"
    `,
    `
    /*
        this is a single line comment
    */ 

    "The multi-line comment above should be ignored"
    `,
]

for (const programStr of program){
    let ast = parser.parse(programStr);

    // make this assertion
    console.log(JSON.stringify(ast, null, 2));
}
