module.exports = test => {
    test(`{
         // name 
            "Joshua JB";
            42;
        }`, {
        "type": "Program",
        "body": [
          {
            "type": "BlockStatement",
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
          }
        ]
    })

    // empty block
    test(`{
        
        }`, {
        "type": "Program",
        "body": [
          {
            "type": "BlockStatement",
            "body": []
          }
        ]
    })

    // nested block
    test(`{
        {
            42;
        }
    }`, {
        "type": "Program",
        "body": [
          {
            "type": "BlockStatement",
            "body": [
              {
                "type": "BlockStatement",
                "body": [
                  {
                    "type": "ExpressionStatement",
                    "expression": {
                      "type": "NumericLiteral",
                      "value": 42
                    }
                  }
                ]
              }
            ]
          }
        ]
    })
    
}