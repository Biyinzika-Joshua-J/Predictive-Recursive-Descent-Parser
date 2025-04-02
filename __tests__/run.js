// const {} = require('');
const {Parser} = require('../src/parser');
const assert = require('assert');   


const tests = [
    require('./literal.test'),
    require('./statement-list.test'),
]

const parser = new Parser();

// for manual testing only
function exec(){
    const program = [
        `
            // name 
            "Joshua JB";
            42;
        `,
        `"34";`,
        `'34';`,
        `34;`,
        `   34  ;   `,
        `
            // this is a single line comment
            "The single line comment above should be ignored";
        `,
        `
        /*
            this is a single line comment
        */ 
    
        "The multi-line comment above should be ignored";
        `,

        
    ]
    
    for (const programStr of program){
        let ast = parser.parse(programStr);
    
        // make this assertion
        console.log(JSON.stringify(ast, null, 2));
    }
}


function test(program, expected){
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
    console.log(`Test passed`);
}

exec();

tests.forEach(testRun => testRun(test));

