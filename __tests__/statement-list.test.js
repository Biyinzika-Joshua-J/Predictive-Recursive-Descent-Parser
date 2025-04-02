module.exports = test => {
    test(`
             // name 
            "Joshua JB";
            42;
        `, {
        "type": "Program",
        "body": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "StringLiteral",
              "value": "Joshua JB"
            }
          },
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "NumericLiteral",
              "value": 42
            }
          }
        ]
      })
}